import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import WebViewer from "@pdftron/webviewer";
import "./pendingSignature.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../../components/elements/index";
import {
  addUpdateFieldValueApi,
  declineReasonApi,
  getWorkFlowByWorkFlowIdwApi,
  clearSignatureViewerData,
} from "../../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import DeclineReasonModal from "../SignatureModals/DeclineReasonModal/DeclineReasonModal";
import DeclineReasonCloseModal from "../SignatureModals/DeclineReasonCloseModal/DeclineReasonCloseModal";
import {
  handleBlobFiles,
  hideFreetextElements,
  isUserSigned,
  processXmlForReadOnly,
  processXmlToHideFields,
  readOnlyFreetextElements,
  revertHideFreetextElements,
  revertProcessXmlForReadOnly,
  revertProcessXmlToHideFields,
  revertReadOnlyFreetextElements,
  sanitizeXFDF,
} from "./pendingSIgnatureFunctions";
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";
import { generateBase64FromBlob } from "../../../../commen/functions/generateBase64FromBlob";
import { useApryseDocument } from "../../../../context/DocumentContext";

// ─── Apryse tool patching (module scope, restorable) ─────────────────────────
//
// Apryse tool classes are shared prototypes, so patching them is a GLOBAL
// mutation, not a per-component one. Guarding it with a per-component ref
// meant a second mount re-wrapped the prototype, chaining the new wrapper onto
// the previous mount's closure — which still captured a dead annotationManager
// and a stale ownership Set, permanently swallowing clicks until a full reload.
//
// Here the prototype is wrapped at most once per page load, and the wrapper
// delegates to `activeOwnershipCheck`, which the currently mounted screen
// re-points at itself. Unmount restores the untouched originals.
let toolsPatched = false;
const originalToolHandlers = new Map();
let activeOwnershipCheck = null;

const patchSignatureTools = (Tools, ownershipCheck) => {
  // Always re-point at the live component, even when already patched.
  activeOwnershipCheck = ownershipCheck;
  if (toolsPatched) return;
  toolsPatched = true;

  [Tools?.SignatureCreateTool, Tools?.SignatureFormFieldCreateTool]
    .filter(Boolean)
    .forEach((ToolClass) => {
      const down = ToolClass.prototype.mouseLeftDown;
      const up = ToolClass.prototype.mouseLeftUp;
      originalToolHandlers.set(ToolClass, { down, up });

      // Fail OPEN: with no check registered the original handler runs.
      // Fields belonging to other users are still protected by the
      // annotation-level Locked/ReadOnly flags applyAnnotationLocks() sets,
      // which Apryse honours on its own — so a missing check costs a
      // redundant guard instead of making the whole document inert.
      ToolClass.prototype.mouseLeftDown = function (e) {
        if (!activeOwnershipCheck || activeOwnershipCheck(e))
          return down.call(this, e);
      };
      ToolClass.prototype.mouseLeftUp = function (e) {
        if (!activeOwnershipCheck || activeOwnershipCheck(e))
          return up.call(this, e);
      };
    });
};

const unpatchSignatureTools = () => {
  activeOwnershipCheck = null;
  originalToolHandlers.forEach(({ down, up }, ToolClass) => {
    ToolClass.prototype.mouseLeftDown = down;
    ToolClass.prototype.mouseLeftUp = up;
  });
  originalToolHandlers.clear();
  toolsPatched = false;
};

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/**
 * Async: strip only <apref> elements whose referenced PDF object does NOT exist
 * in the document's XRef table.
 *
 * Root cause of the errors
 * ────────────────────────
 * After the XFDF processing pipeline (processXmlForReadOnly, processXmlToHideFields,
 * etc.) some <apref> nodes reference PDF objects that no longer exist in the
 * current document (stale objnum pointers from a previous PDF revision or from
 * server-side re-processing).  When Apryse tries to load those appearance streams
 * inside a Promise.all it logs:
 *   "Error in Promise.all for appearanceReference N on page M"
 *   {type: 'PDFWorkerError', message: '…Can not find any annotation…'}
 * and the cascade TypeError: Cannot read properties of undefined (reading 'children')
 *
 * Why we validate instead of stripping everything
 * ────────────────────────────────────────────────
 * <apref> on a SIGNED Sig field is the ONLY data Apryse uses to render the
 * signature visual.  Stripping all <apref> makes every signed field blank.
 * We instead ask the PDF document (fullAPI: true) whether the objnum exists;
 * only missing/free/null objects are stripped.  Valid signature appearances
 * survive intact.
 *
 * Fallback
 * ────────
 * If pdfDoc is unavailable or the API call throws, every <apref> on a
 * non-Sig widget is stripped as a safe default (Apryse regenerates text/
 * checkbox appearances from field values).  Sig-field <apref> are preserved
 * in all code paths.
 *
 * @param {string}  xfdfStr  - XFDF string (already sanitized)
 * @param {object}  pdfDoc   - Apryse PDFDoc from documentViewer.getDocument().getPDFDoc()
 * @param {Array}   userAnnotations - userAnnotations state (for fallback Sig detection)
 * @returns {Promise<string>} cleaned XFDF string
 */
const stripInvalidAppearanceRefs = async (xfdfStr, pdfDoc, userAnnotations) => {
  // ── Helper: collect Sig field names from userAnnotations (fallback path) ──
  const getSigFieldNames = () => {
    const sigNames = new Set();
    const parser = new DOMParser();
    (userAnnotations || []).forEach(({ xml }) => {
      (xml || []).forEach(({ ffield }) => {
        if (!ffield) return;
        try {
          const d = parser.parseFromString(ffield, "text/xml");
          const name = d.documentElement.getAttribute("name");
          const type = d.documentElement.getAttribute("type");
          if (name && type === "Sig") sigNames.add(name);
        } catch {
          /* ignore */
        }
      });
    });
    return sigNames;
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xfdfStr, "text/xml");
    const aprefs = Array.from(doc.querySelectorAll("apref"));

    if (!aprefs.length) return xfdfStr;

    // ── Primary path: validate each apref objnum against the PDF XRef table ──
    if (pdfDoc) {
      for (const apref of aprefs) {
        const objnum = parseInt(apref.getAttribute("objnum") ?? "0", 10);

        // PDF object 0 is the null/free object — never a valid appearance stream
        if (objnum === 0) {
          apref.remove();
          continue;
        }

        try {
          // getXRefTableEntry(objnum) returns the Obj at that number in the
          // XRef table (in standard PDFs the entry index equals the object number).
          // Returns a null-type Obj for free/deleted entries.
          const obj = await pdfDoc.getXRefTableEntry(objnum);

          // isNull() returns true for free/null XRef entries (missing objects)
          const missing =
            !obj || (typeof obj.isNull === "function" && (await obj.isNull()));
          if (missing) apref.remove();
        } catch {
          // Object doesn't exist or API unavailable — strip to prevent error
          apref.remove();
        }
      }

      return new XMLSerializer().serializeToString(doc);
    }

    // ── Fallback path: no pdfDoc — strip apref from non-Sig fields only ──
    const sigFieldNames = getSigFieldNames();
    doc.querySelectorAll("widget").forEach((widget) => {
      const fieldName = widget.getAttribute("field");
      if (!sigFieldNames.has(fieldName)) {
        widget.querySelectorAll("apref").forEach((node) => node.remove());
      }
    });

    return new XMLSerializer().serializeToString(doc);
  } catch {
    return xfdfStr; // parsing failed — return original unchanged
  }
};

const containsNull = (arr) => arr.some((el) => el === null);

const getCurrentUserID = () =>
  localStorage.getItem("userID") !== null
    ? Number(localStorage.getItem("userID"))
    : 0;

const revertXmlField = (data) =>
  data.map((item) => {
    const xml = item.xmlField
      ? item.xmlField
          .split("_#_")
          .map((str) => {
            try {
              return JSON.parse(str);
            } catch (err) {
              return null;
            }
          })
          .filter(Boolean)
      : [];
    return {
      actorID: item.actorID,
      userID: item.userID,
      actorColor: item.actorColor,
      xml,
    };
  });

/**
 * Extract the Set of ffield names assigned to a specific user.
 * Used to determine widget annotation ownership without relying on Subject.
 */
const getUserFieldNames = (userAnnotations, userID) => {
  const entry = userAnnotations.find((u) => u.userID === userID);
  if (!entry) return new Set();
  const names = new Set();
  entry.xml.forEach(({ ffield }) => {
    if (!ffield) return;
    try {
      const doc = new DOMParser().parseFromString(ffield, "text/xml");
      const name = doc.documentElement.getAttribute("name");
      if (name) names.add(name);
    } catch {
      /* ignore malformed ffield */
    }
  });
  return names;
};

/**
 * Build HideArray / ReadArray from userAnnotations.
 *
 * HideArray — field names whose owner is in hiddenUsers
 *             (their turn hasn't arrived yet in an ordered workflow).
 *
 * ReadArray — field names of EVERY other non-current user that is NOT hidden.
 *             This covers already-signed users so their data stays visible
 *             but fully locked.
 */
const buildHideReadArrays = (annotations, hiddenUsers, currentUserID) => {
  const HideArray = [];
  const ReadArray = [];

  annotations.forEach((obj) => {
    if (obj.userID === currentUserID) return; // own fields stay editable

    obj.xml.forEach(({ ffield }) => {
      const matches = ffield?.match(/<ffield[^>]*\sname="([^"]+)"/g) ?? [];
      matches.forEach((match) => {
        const name = match.match(/name="([^"]+)"/)?.[1];
        if (!name) return;

        if (hiddenUsers.includes(obj.userID)) {
          HideArray.push(name); // hide entirely
        } else {
          ReadArray.push(name); // show but lock — signed or pending
        }
      });
    });
  });

  return { HideArray, ReadArray };
};

const mergeXFDFIntoAnnotations = (
  xfdfString,
  userSelectID,
  userAnnotations,
) => {
  const userSelect = parseInt(userSelectID, 10);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xfdfString, "text/xml");

  xmlDoc.querySelectorAll("widget").forEach((widget) => {
    const widgetName = widget.getAttribute("name");
    const fieldName = widget.getAttribute("field");
    let found = false;

    userAnnotations.forEach((user) => {
      user.xml.forEach((xml) => {
        // Match the widget's name ATTRIBUTE, not any substring of the
        // serialised widget XML. A bare `includes(widgetName)` also matched
        // longer names that merely start with it — so "Radio1" matched the
        // stored XML for "Radio10". Radio groups are where this actually
        // bites, since their widgets are usually named with a shared prefix
        // and a trailing index, and a mismatch silently attributes an option
        // to the wrong entry.
        if (xml.widget?.includes(`name="${widgetName}"`)) {
          const ffieldEl = xmlDoc.querySelector(`ffield[name="${fieldName}"]`);
          if (ffieldEl) {
            xml.ffield = ffieldEl.outerHTML;
            xml.widget = widget.outerHTML;
          }
          found = true;
        }
      });
    });

    if (!found) {
      const target = userAnnotations.find((u) => u.userID === userSelect);
      if (target) {
        const ffieldEl = xmlDoc.querySelector(`ffield[name="${fieldName}"]`);
        if (ffieldEl)
          target.xml.push({
            ffield: ffieldEl.outerHTML,
            widget: widget.outerHTML,
          });
      }
    }
  });
};

const filterAnnotationsAgainstXFDF = (userAnnotations, xfdfString) => {
  const parser = new DOMParser();
  const mainDoc = parser.parseFromString(xfdfString, "text/xml");
  const exists = (name, tag) =>
    mainDoc.querySelectorAll(`${tag}[name="${name}"]`).length > 0;

  return userAnnotations.map((user) => ({
    ...user,
    xml: user.xml.filter((item) => {
      const ffieldName = new DOMParser()
        .parseFromString(item.ffield, "text/xml")
        .documentElement.getAttribute("name");
      const widgetName = new DOMParser()
        .parseFromString(item.widget, "text/xml")
        .documentElement.getAttribute("name");
      return exists(ffieldName, "ffield") && exists(widgetName, "widget");
    }),
  }));
};

const convertAnnotationsForApi = (filtered) =>
  filtered.map((u) => ({
    ActorID: u.actorID,
    xmlList: u.xml.map((x) => JSON.stringify(x)),
  }));

/**
 * Parse the owner userID from a FreeText annotation's Subject.
 * Subject format: "<label>-<userID>"  e.g. "Title-42"
 */
const getAnnotationOwnerIDFromSubject = (annot) => {
  if (!annot.Subject) return null;
  const parts = annot.Subject.split("-");
  const lastPart = parts[parts.length - 1];
  const parsed = Number(lastPart);
  return Number.isFinite(parsed) && lastPart !== "" ? parsed : null;
};

/**
 * Lock / unlock annotations based on who the current user is.
 *
 * Widget annotations  → ownership is determined by comparing the widget's
 *                       field name against currentUserFieldNames (a Set).
 * FreeText annotations → ownership is determined via the Subject attribute.
 *
 * Non-owner annotations:
 *   • annotation-level  Locked = true, ReadOnly = true
 *   • no resize / move / rotate
 * Owner widget annotations:
 *   • clear PDF field-level ReadOnly so the widget is clickable (re-sign support)
 *   • annotation-level flags left unlocked
 */
// ✅ UPDATED: Stronger locks for non-owner fields
/**
 * Key used with Apryse's annotation custom-data API to stamp a signature with
 * the user who created it. Unlike the in-memory session set (empty on a fresh
 * load) and getAssociatedSignatureAnnotation() (not reliably wired up right
 * after import), custom data is serialised into the XFDF — so ownership still
 * resolves after the document is saved and the page reloaded.
 */
const SIGNER_CUSTOM_DATA_KEY = "diskusSignerUserId";

/**
 * Summarise every marker a signature could be carried by, so the XFDF can be
 * tracked through the revert pipeline and the exact step that drops it is
 * visible. A signature may be represented as an <apref> on the widget, as an
 * <appearance> block, or as an ink/stamp annotation inside <annots> — checking
 * only one of those can miss where it actually went.
 */
const summariseXfdfSignature = (xfdf) => {
  const count = (re) => (xfdf?.match(re) || []).length;
  return {
    length: xfdf?.length ?? 0,
    apref: count(/<apref/g),
    appearance: count(/<appearance/g),
    ink: count(/<ink[\s>]/g),
    stamp: count(/<stamp[\s>]/g),
    freetext: count(/<freetext[\s>]/g),
    sigFields: count(/type="Sig"/g),
    hasAnnotsBlock: !!xfdf?.includes("<annots"),
  };
};

/**
 * Set annotation flags WITHOUT destroying an imported appearance.
 *
 * Assigning these flags one by one is not safe on a freshly imported
 * annotation, for two reasons:
 *
 *  • `NoRotate`'s setter calls Apryse's internal invalidate hook with no
 *    arguments, and that form runs `delete this.appearances; delete this.ye`.
 *    `ye` is the ONLY place a signature imported from XFDF lives — Apryse
 *    parses the widget's <appearance> block into `appearanceString` and stashes
 *    it there. Setting NoRotate straight after importAnnotations() therefore
 *    erased every signature already applied by a PREVIOUS signer: the field
 *    repainted as an empty box with just its border, while text / checkbox /
 *    radio survived because they render from <fields><value> instead. The
 *    setter also has no equality guard, so re-setting the value it already
 *    holds still wipes the appearance. Nothing here needs it: Locked +
 *    NoResize + NoMove already block every manipulation this screen allows,
 *    and a widget exposes no rotation handle once NoResize is set. So it is
 *    simply not set any more — see the call sites below.
 *
 *  • The flags that remain are individually safe (Locked/ReadOnly invalidate in
 *    appearance-preserving mode; NoResize/NoMove route through custom data), but
 *    `isImporting` short-circuits the invalidate hook outright, so the whole
 *    block is wrapped in it as a standing guard against the same class of bug.
 *    It also stops DateModified being bumped on annotations nobody touched.
 */
const setAnnotationFlags = (annot, flags) => {
  const wasImporting = !!annot.isImporting;
  annot.isImporting = true;
  try {
    Object.assign(annot, flags);
  } finally {
    annot.isImporting = wasImporting;
  }
};

const applyAnnotationLocks = (
  annotationManager,
  annotations,
  currentUserID,
  currentUserFieldNames,
  // Ids of annotations this user created interactively in this session.
  // Authoritative and timing-independent: unlike
  // getAssociatedSignatureAnnotation(), which may not be wired up yet at the
  // moment the "add" event fires, this is known the instant the annotation
  // is created — so a freshly drawn signature is never mistaken for someone
  // else's and locked.
  sessionOwnedAnnotIds,
) => {
  // ── Pre-pass: identify signature "stamps" owned by the current user ────────
  //
  // The visible signature Apryse creates when a Sig field is signed is a
  // SEPARATE annotation from the widget it fills. It has no field (so the
  // widget test below misses it) and no "<label>-<userID>" Subject (so the
  // Subject test misses it too) — so it was classified as someone else's and
  // Locked the instant the user created it. That is why the delete icon
  // appeared but did nothing, and why the field could not be signed again.
  //
  // Resolve ownership through the widget the stamp is associated with, and
  // scan the FULL annotation list — annotationChanged calls this with only the
  // changed annotations, which would never include the owning widget.
  const ownedSignatureAnnotIds = new Set();
  try {
    annotationManager.getAnnotationsList().forEach((a) => {
      try {
        if (
          typeof a.getField !== "function" ||
          typeof a.getAssociatedSignatureAnnotation !== "function"
        )
          return;
        const fieldName = a.getField()?.name;
        if (!fieldName || !currentUserFieldNames.has(fieldName)) return;
        const assoc = a.getAssociatedSignatureAnnotation();
        if (assoc?.Id) ownedSignatureAnnotIds.add(assoc.Id);
      } catch {
        /* ignore individual annotation failures */
      }
    });
  } catch {
    /* ignore — fall through to the per-annotation tests below */
  }

  // ── Fail OPEN when ownership is unresolved ─────────────────────────────────
  //
  // getUserFieldNames() returns an EMPTY set when the current user has no
  // entry in userAnnotations yet, or an entry whose xml is still empty. That
  // is exactly the state on the first load right after a document is sent,
  // before the backend has materialised this signer's field records.
  //
  // Locking on that basis marks EVERY field Locked/ReadOnly — including the
  // user's own — so nothing can be signed until a refresh happens to fetch
  // complete data. That is the "cannot sign until I reload" symptom.
  //
  // Skipping here is safe: other signers' fields are already protected
  // independently of these annotation-level flags. The XFDF pipeline marks
  // them ReadOnly (processXmlForReadOnly) and strips hidden users' fields
  // entirely (processXmlToHideFields) BEFORE the document is imported, so
  // those protections are already baked into what Apryse loaded.
  if (!currentUserFieldNames || currentUserFieldNames.size === 0) return;

  annotations.forEach((annot) => {
    const isWidget =
      typeof annot.getField === "function" ||
      annot.constructor?.name?.includes("Widget");

    let isOwner = false;

    // Ownership stamped onto the annotation when it was created. This is the
    // only signal that survives save + reload, so it is what keeps a signature
    // deletable/re-signable after a refresh. Used only to GRANT ownership,
    // never to revoke it, so it cannot regress the checks below.
    let stampedOwnerID = null;
    try {
      const raw = annot.getCustomData?.(SIGNER_CUSTOM_DATA_KEY);
      if (raw !== undefined && raw !== null && raw !== "") {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) stampedOwnerID = parsed;
      }
    } catch {
      /* custom data unsupported — fall through to the tests below */
    }

    if (stampedOwnerID !== null && stampedOwnerID === currentUserID) {
      isOwner = true;
    } else if (
      annot.Id &&
      (ownedSignatureAnnotIds.has(annot.Id) ||
        sessionOwnedAnnotIds?.has(annot.Id))
    ) {
      // The current user's own signature stamp — must stay deletable so it
      // can be removed and the field re-signed.
      isOwner = true;
    } else if (isWidget) {
      try {
        const field = annot.getField?.();
        const fieldName = field?.name;
        isOwner = fieldName ? currentUserFieldNames.has(fieldName) : false;
      } catch {
        isOwner = false;
      }
    } else {
      const ownerID = getAnnotationOwnerIDFromSubject(annot);
      isOwner = ownerID === currentUserID;
    }

    if (!isOwner) {
      // Non-owner: Completely disable the field.
      // NoRotate is deliberately NOT set — see setAnnotationFlags.
      setAnnotationFlags(annot, {
        Locked: true,
        ReadOnly: true,
        NoResize: true,
        NoMove: true,
      });

      if (isWidget) {
        try {
          const field = annot.getField?.();
          if (field) {
            field.flags.set("ReadOnly", true);
            field.flags.set("NoToggleToOff", true);
          }
        } catch {}
      }
    } else {
      // Owner: fillable, but NOT repositionable.
      //
      // This screen lets a signer FILL their own fields — it is not a layout
      // editor. Only the creator (signatureviewer.js) may place or move a
      // field. Clearing Locked/ReadOnly is what makes the field clickable and
      // fillable; NoResize/NoMove stay ON so the widget cannot be dragged out
      // of position or resized while signing. (NoRotate used to be set here
      // too — it is not, and must not be: see setAnnotationFlags.)
      setAnnotationFlags(annot, {
        Locked: false,
        ReadOnly: false,
        NoResize: true,
        NoMove: true,
      });

      if (isWidget) {
        try {
          const field = annot.getField?.();
          if (field) {
            field.flags.set("ReadOnly", false);
            // Mirror the non-owner branch, which sets NoToggleToOff. Leaving
            // it set on an owned field makes a radio group behave oddly — the
            // selected option can no longer be toggled off. Radio widgets in a
            // group share ONE field object, so a single pass that locked this
            // field would otherwise leave the flag stuck on for every option.
            field.flags.set("NoToggleToOff", false);
          }
        } catch {}
      }
    }

    annotationManager.updateAnnotation(annot);
    annotationManager.redrawAnnotation(annot);
  });
};

/**
 * Validate that all fields assigned to the current user are filled.
 * Called synchronously at submit time with the already-exported xfdfString.
 *
 * Field type is read from the stored `ffield` XML in userAnnotations — the
 * same data Apryse wrote when the designer created the fields.
 *
 * Per-type strategy
 * ─────────────────
 * Btn (checkbox / radio)
 *   Always valid — any state (checked or unchecked) is acceptable.
 *
 * Sig (signature)
 *   Apryse NEVER writes signature values into <fields><value>; they are
 *   stored as appearance streams.  Instead we inspect the widget element
 *   inside Apryse's proprietary <pdf-info> section:
 *     • unsigned widget  → self-closing or has 0 child elements
 *     • signed   widget  → has ≥ 1 child (apref / ap / inline appearance)
 *   As a belt-and-suspenders fallback we also check <fields><value> in case
 *   a future Apryse version writes the value there.
 *
 * Tx / Ch (text / choice)
 *   Reliably stored in <fields><field name="…"><value>.
 */
const validateViaXFDF = (
  xfdfString,
  currentUserFieldNames,
  userAnnotations,
  currentUserID,
) => {
  if (currentUserFieldNames.size === 0)
    return { valid: true, unfilledCount: 0 };

  const parser = new DOMParser();
  const doc = parser.parseFromString(xfdfString, "text/xml");

  // Build field-type map from stored ffield XML (designer-time metadata)
  const fieldTypeMap = new Map();
  const userEntry = userAnnotations.find((u) => u.userID === currentUserID);
  userEntry?.xml.forEach(({ ffield }) => {
    if (!ffield) return;
    try {
      const d = parser.parseFromString(ffield, "text/xml");
      const name = d.documentElement.getAttribute("name");
      const type = d.documentElement.getAttribute("type") || "";
      if (name) fieldTypeMap.set(name, type);
    } catch {
      /* malformed ffield string — skip */
    }
  });

  let unfilledCount = 0;
  console.log(
    currentUserFieldNames,
    fieldTypeMap,
    unfilledCount,
    "validateViaXFDFvalidateViaXFDF",
  );

  for (const fieldName of currentUserFieldNames) {
    const fieldType = fieldTypeMap.get(fieldName) || "";

    // ── Btn ──────────────────────────────────────────────────────────────────
    if (fieldType === "Btn") continue; // checkbox / radio always valid

    // ── Sig ──────────────────────────────────────────────────────────────────
    if (fieldType === "Sig") {
      // Belt-and-suspenders check 1: <fields> value (works in some Apryse builds)
      const fieldEl =
        doc.querySelector(`fields field[name="${CSS.escape(fieldName)}"]`) ??
        doc.querySelector(`fields field[name="${fieldName}"]`);
      const fieldValue = (
        fieldEl?.querySelector("value")?.textContent ?? ""
      ).trim();
      if (fieldValue) continue; // value present → signed

      // Belt-and-suspenders check 2: widget element children in <pdf-info>
      // Apryse adds an apref / ap child to the widget after applying a signature.
      const widget = doc.querySelector(`widget[field="${fieldName}"]`);
      if (widget && widget.childElementCount > 0) continue; // has appearance → signed

      unfilledCount++; // widget found but no evidence of signing
      continue;
    }

    // ── Tx / Ch (text, choice) ────────────────────────────────────────────────
    const fieldEl =
      doc.querySelector(`fields field[name="${CSS.escape(fieldName)}"]`) ??
      doc.querySelector(`fields field[name="${fieldName}"]`);
    const value = (fieldEl?.querySelector("value")?.textContent ?? "").trim();
    if (!value) unfilledCount++;
  }

  return { valid: unfilledCount === 0, unfilledCount };
};

// ─── Component ────────────────────────────────────────────────────────────────

const PendingSignatureViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { pendingSignatureViewer } = useApryseDocument();

  const { webViewer } = useSelector((s) => s);
  const {
    getAllFieldsByWorkflowID,
    getWorkfFlowByFileId,
    ResponseMessage,
    getSignatureFileAnnotationResponse,
  } = useSelector((s) => s.SignatureWorkFlowReducer);

  const docWorkflowID = new URLSearchParams(location.search).get("documentID");

  // ── WebViewer ──────────────────────────────────────────────────────────────
  const viewerRef = useRef(null);
  const webViewerInitialized = useRef(false);
  const [instance, setInstance] = useState(null);

  // ── Data state ─────────────────────────────────────────────────────────────
  const [fieldsData, setFieldsData] = useState([]);
  const [signerData, setSignerData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // ── Annotation state ───────────────────────────────────────────────────────
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [userAnnotationsCopy, setUserAnnotationsCopy] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);

  const [removeXmlAfterHideData, setRemoveXmlAfterHideData] = useState("");
  const [removeXmlAfterFreetextHideData, setRemoveXmlAfterFreetextHideData] =
    useState([]);

  // ── PDF data ───────────────────────────────────────────────────────────────
  const [pdfData, setPdfData] = useState({
    xfdfData: "",
    attachmentBlob: "",
    workFlowID: 0,
    documentID: 0,
    title: "",
    description: "",
    creationDateTime: "",
    isDeadline: "",
    deadlineDatetime: "",
    creatorID: "",
    isCreator: 0,
  });

  // ── UI state ───────────────────────────────────────────────────────────────
  const [show, SnackBar] = useSnackbar();
  const [reasonModal, setReasonModal] = useState(false);
  const [declineConfirmationModal, setDeclineConfirmationModal] =
    useState(false);
  const [declineReasonMessage, setDeclineReasonMessage] = useState("");
  const [declineErrorMessage, setDeclineErrorMessage] = useState(false);

  // ── Stable refs ────────────────────────────────────────────────────────────
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const userAnnotationsCopyRef = useRef(userAnnotationsCopy);
  const pdfXfdfRef = useRef(pdfData.xfdfData);
  const participantsRef = useRef(participants);
  const hiddenUsersRef = useRef(hiddenUsers);
  const removeXmlAfterHideDataRef = useRef(removeXmlAfterHideData);
  const removeXmlAfterFreetextHideRef = useRef(removeXmlAfterFreetextHideData);
  const fieldsDataRef = useRef(fieldsData);
  const pdfDataRef = useRef(pdfData);

  /**
   * Set of ffield names that belong to the current user.
   * Kept in a ref so WebViewer event callbacks can always read the latest value
   * without needing the effect to re-run.
   */
  const currentUserFieldNamesRef = useRef(new Set());

  // NOTE: the signature tool patch guard now lives at module scope
  // (patchSignatureTools / unpatchSignatureTools) because it mutates shared
  // Apryse prototypes, which a per-component ref cannot correctly guard.

  /**
   * Set of field names that the current user has already filled / signed during
   * this session.  Populated exclusively via the `fieldChanged` event — the only
   * reliable signal that Apryse provides for signature fields (Apryse stores
   * signature data as an appearance stream, NOT as an XFDF field value, so
   * XFDF parsing always returns empty for signature fields even after signing).
   */
  const filledFieldsRef = useRef(new Set());

  /**
   * Ids of annotations this user created interactively in this session
   * (signature stamps, above all). annotationChanged only reaches the locking
   * code for non-imported changes, i.e. things this user just did — so these
   * are unambiguously theirs and must never be locked, otherwise the signature
   * they just drew becomes undeletable and the field cannot be re-signed.
   */
  const sessionOwnedAnnotIdsRef = useRef(new Set());

  // ── Sync state → refs ──────────────────────────────────────────────────────
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);

  // Ownership is derived during render and mirrored into refs immediately,
  // NOT inside a useEffect. A ref-sync effect runs after render and in
  // declaration order, so anything reading currentUserFieldNamesRef earlier in
  // the same commit (the viewer bootstrap, documentLoaded, Apryse click
  // callbacks) could observe an empty Set — i.e. "I own nothing" — and treat
  // every field, including the user's own, as not theirs. Deriving it here
  // guarantees the value is correct before any effect in this component runs.
  const currentUserID = useMemo(() => getCurrentUserID(), []);

  const currentUserFieldNames = useMemo(
    () => getUserFieldNames(userAnnotations, currentUserID),
    [userAnnotations, currentUserID],
  );

  userAnnotationsRef.current = userAnnotations;
  currentUserFieldNamesRef.current = currentUserFieldNames;

  // ─── First-render readiness gate ───────────────────────────────────────────
  //
  // The viewer must not bootstrap until every input it depends on has arrived.
  // Keying initialisation on attachmentBlob alone could start the viewer while
  // signerData was still empty (so the header rendered a bare "Close" button
  // instead of Decline/Submit) and while ownership was still unresolved (so
  // every field, including the user's own, was treated as someone else's).
  //
  // getAllFieldsByWorkflowID is deliberately NOT required: it is dispatched as
  // a failure (null) in the "no fields" branch of the API, so requiring it
  // would hang this screen forever for documents that legitimately have none.
  // A document with no actors at all has no signers to wait for; requiring
  // signerData unconditionally would leave such a document on a blank screen
  // forever instead of showing the read-only "Close" header.
  const hasActors = Boolean(
    getWorkfFlowByFileId?.workFlow?.bundleModels?.length,
  );

  // Step 2 of the bootstrap: the viewer is created only once EVERY response
  // has landed AND the state derived from each has settled.
  //
  //   getWorkfFlowByFileId              → workflow + actors   → signerData
  //   getSignatureFileAnnotationResponse→ XFDF + PDF bytes    → pdfData.*
  //   signerData                        → drives the header (Decline/Submit
  //                                       vs a bare Close button)
  //   pdfData.documentID                → proves the pdfData above belongs to
  //                                       THIS document and is not left over
  //                                       from a previous one
  //
  // getAllFieldsByWorkflowID is intentionally excluded: it is dispatched as a
  // failure (null) in the API's "no fields" branch, so requiring it would hang
  // this screen forever on documents that legitimately have none.
  const isViewerDataReady = Boolean(
    pdfData.attachmentBlob &&
      Number(pdfData.documentID) === Number(docWorkflowID) &&
      getWorkfFlowByFileId &&
      getSignatureFileAnnotationResponse &&
      (!hasActors || signerData.length > 0),
  );

  useEffect(() => {
    userAnnotationsCopyRef.current = userAnnotationsCopy;
  }, [userAnnotationsCopy]);
  useEffect(() => {
    pdfXfdfRef.current = pdfData.xfdfData;
  }, [pdfData.xfdfData]);
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);
  useEffect(() => {
    hiddenUsersRef.current = hiddenUsers;
  }, [hiddenUsers]);
  useEffect(() => {
    removeXmlAfterHideDataRef.current = removeXmlAfterHideData;
  }, [removeXmlAfterHideData]);
  useEffect(() => {
    removeXmlAfterFreetextHideRef.current = removeXmlAfterFreetextHideData;
  }, [removeXmlAfterFreetextHideData]);
  useEffect(() => {
    fieldsDataRef.current = fieldsData;
  }, [fieldsData]);
  useEffect(() => {
    pdfDataRef.current = pdfData;
  }, [pdfData]);

  // ── Bootstrap: clean → fetch → settle → (viewer starts once ready) ─────────
  //
  // Step 1 of an explicit sequence. Everything from any previously opened
  // document is wiped BEFORE the first request goes out, so none of the
  // `if (!x) return;` guards below can ever act on the previous document's
  // Redux data while this document's responses are still in flight. The
  // viewer itself is not created here — it waits on the readiness gate.
  useEffect(() => {
    if (!docWorkflowID) return;

    // 1a. Clear shared Redux state for the signature viewers.
    dispatch(clearSignatureViewerData());

    // 1b. Reset every piece of local state this screen derives from it.
    setFieldsData([]);
    setSignerData([]);
    setParticipants([]);
    setLastParticipants([]);
    setSelectedUser("");
    setUserAnnotations([]);
    setUserAnnotationsCopy([]);
    setHiddenUsers([]);
    setRemoveXmlAfterHideData("");
    setRemoveXmlAfterFreetextHideData([]);
    setPdfData({
      xfdfData: "",
      attachmentBlob: "",
      workFlowID: 0,
      documentID: 0,
      title: "",
      description: "",
      creationDateTime: "",
      isDeadline: "",
      deadlineDatetime: "",
      creatorID: "",
      isCreator: 0,
    });

    // 1c. Reset per-document viewer bookkeeping so a re-open bootstraps clean.
    webViewerInitialized.current = false;
    sessionOwnedAnnotIdsRef.current = new Set();
    filledFieldsRef.current = new Set();
    currentUserFieldNamesRef.current = new Set();

    // 1d. Only now start fetching. getWorkFlowByWorkFlowIdwApi chains
    //     GetAllFieldsByWorkFlowID and then GetSignatureFileAnnotation
    //     internally, so this one dispatch drives the whole load.
    dispatch(
      getWorkFlowByWorkFlowIdwApi(
        { FileID: Number(docWorkflowID) },
        navigate,
        t,
        1,
      ),
    );
    dispatch(allAssignessList(navigate, t, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docWorkflowID]);

  // ── getAllFieldsByWorkflowID ────────────────────────────────────────────────
  useEffect(() => {
    if (!getAllFieldsByWorkflowID) return;
    try {
      const { bundleDetails, listOfFields } =
        getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails;
      if (!bundleDetails.length) return;

      setFieldsData(
        bundleDetails.map((f) => ({
          pK_WorkFlowActionableBundle_ID: f.pK_WorkFlowActionableBundle_ID,
          titles: f.titles,
          bundleDeadline: f.bundleDeadline,
          fK_ActionAbleBundleStatusState: f.fK_ActionAbleBundleStatusState,
          bundleAssignedDate: f.bundleAssignedDate,
          bundleDependenceID: f.bundleDependenceID,
          actor_ID: f.actor_ID,
          userID: f.userID,
          actorName: f.actorName,
          actorDesignation: f.actorDesignation,
          actorEmail: f.actorEmail,
          actorColor: f.actorColor,
        })),
      );

      // hiddenUsers come from the API (future signers in ordered workflows)
      setHiddenUsers(getAllFieldsByWorkflowID.hiddenUsers ?? []);

      if (containsNull(listOfFields)) {
        const bundles = getWorkfFlowByFileId?.workFlow?.bundleModels ?? [];
        setUserAnnotations(
          bundles.flatMap((b) =>
            b.actors.map((a) => ({
              actorID: a.fK_WorkFlowActor_ID,
              userID: a.pK_UID,
              actorColor: a.actorColor,
              xml: [],
            })),
          ),
        );
      } else {
        const reverted = revertXmlField(listOfFields);
        setUserAnnotations(reverted);
        setUserAnnotationsCopy(reverted);
      }
    } catch (err) {}
  }, [getAllFieldsByWorkflowID]);

  // ── getWorkfFlowByFileId ───────────────────────────────────────────────────
  useEffect(() => {
    if (!getWorkfFlowByFileId) return;
    try {
      const { bundleModels, workFlow } = getWorkfFlowByFileId.workFlow;

      if (bundleModels?.length) {
        const listOfUsers = [];
        const signersArr = [];

        bundleModels.forEach((b) =>
          b.actors.forEach((a) => {
            listOfUsers.push({ name: a.name, pk_UID: a.pK_UID });
            signersArr.push({
              Name: a.name,
              EmailAddress: a.emailAddress,
              userID: a.pK_UID,
            });
          }),
        );

        setSignerData(signersArr);
        setParticipants(listOfUsers);
        setLastParticipants(listOfUsers);
        setSelectedUser(listOfUsers[0]?.pk_UID);

        const { listOfFields } =
          getAllFieldsByWorkflowID?.signatureWorkFlowFieldDetails ?? {};
        if (listOfFields && containsNull(listOfFields)) {
          setUserAnnotations(
            bundleModels.flatMap((b) =>
              b.actors.map((a) => ({
                actorID: a.fK_WorkFlowActor_ID,
                userID: a.pK_UID,
                actorColor: a.actorColor,
                xml: [],
              })),
            ),
          );
        }
      }

      setPdfData((prev) => ({
        ...prev,
        attachmentBlob: webViewer.attachmentBlob,
        workFlowID: workFlow.pK_WorkFlow_ID,
        documentID: Number(docWorkflowID),
        title: workFlow.title,
        description: workFlow.description,
        creationDateTime: workFlow.creationDateTime,
        isDeadline: workFlow.isDeadline,
        deadlineDatetime: workFlow.deadlineDatetime,
        creatorID: workFlow.creatorID,
        isCreator: workFlow.isCreator,
      }));
    } catch (err) {}
  }, [getWorkfFlowByFileId, fieldsData]);

  // ── getSignatureFileAnnotationResponse ────────────────────────────────────
  //
  // Pre-processes the XFDF before it is loaded into the viewer:
  //   • Hidden users   → their ffield / widget / freetext elements are stripped
  //   • All other non-current users → their ffield elements get ReadOnly flag
  //     and their freetext annotations get print+locked flags
  //   This ensures already-signed data is visible but not editable.
  //
  useEffect(() => {
    if (!getSignatureFileAnnotationResponse) return;
    try {
      const currentUserID = getCurrentUserID();
      const { HideArray, ReadArray } = buildHideReadArrays(
        userAnnotationsRef.current,
        hiddenUsersRef.current,
        currentUserID,
      );

      // 1. Mark non-hidden other users' widget fields as ReadOnly in XFDF
      const withReadOnly = processXmlForReadOnly(
        getSignatureFileAnnotationResponse.annotationString,
        ReadArray,
      );

      // 2. Strip widget / ffield entries for hidden users (ordered workflow)
      const { updatedXmlString, removedItems } = processXmlToHideFields(
        withReadOnly,
        HideArray,
      );
      setRemoveXmlAfterHideData(removedItems);

      // All non-current, non-hidden users → their freetext labels are read-only
      const readOnlyUserIDs = userAnnotationsRef.current
        .filter(
          (u) =>
            u.userID !== currentUserID &&
            !hiddenUsersRef.current.includes(u.userID),
        )
        .map((u) => u.userID);

      // 3. Lock freetext (label) annotations belonging to readOnly users
      const withReadOnlyFreetext = readOnlyFreetextElements(
        updatedXmlString,
        readOnlyUserIDs,
      );

      // 4. Remove freetext annotations belonging to hidden users
      const { hideFreetextXmlString, removedHideFreetextElements } =
        hideFreetextElements(withReadOnlyFreetext, hiddenUsersRef.current);
      setRemoveXmlAfterFreetextHideData(removedHideFreetextElements);

      setPdfData((prev) => ({
        ...prev,
        xfdfData: hideFreetextXmlString,
        attachmentBlob: getSignatureFileAnnotationResponse.attachmentBlob,
      }));
    } catch (err) {}
  }, [getSignatureFileAnnotationResponse]);

  // ─── Save / submit handler ────────────────────────────────────────────────

  const handleSave = useCallback(
    async (annotationManager) => {
      try {
        const currentUserID = getCurrentUserID();
        const currentUserFieldNames = currentUserFieldNamesRef.current;

        console.group("[SUBMIT] handleSave");
        console.log("1. currentUserID:", currentUserID);
        console.log("1. ownedFieldNames:", [...currentUserFieldNames]);
        console.log(
          "1. userAnnotations:",
          userAnnotationsRef.current.map((u) => ({
            userID: u.userID,
            actorID: u.actorID,
            xmlCount: u.xml?.length,
          })),
        );
        console.log("1. hiddenUsers:", hiddenUsersRef.current);

        // Export XFDF once — used for both validation and API payload.
        //
        // Options are explicit rather than relying on defaults: this XFDF is
        // the record the NEXT signer loads, so it has to carry the widget
        // annotations and form-field data, not just the free annotations.
        // A bare exportAnnotations() leaves that to Apryse's defaults, which
        // is where a signature's appearance data can quietly be left out.
        const xfdfString = await annotationManager.exportAnnotations({
          widgets: true,
          fields: true,
          links: true,
        });
        console.log("2. exported XFDF (raw from viewer):", xfdfString);
        console.log("2. SIGNATURE MARKERS:", summariseXfdfSignature(xfdfString));

        const isSigned = isUserSigned(xfdfString);
        console.log("3. isUserSigned:", isSigned);

        // ── Validation: every assigned field must be filled ──────────────────
        // validateViaXFDF inspects the exported XFDF synchronously:
        //   • Sig fields  → widget.childElementCount > 0 (appearance stream present)
        //   • Tx/Ch fields → <fields><field><value> non-empty
        //   • Btn fields   → always considered filled
        const { valid } = validateViaXFDF(
          xfdfString,
          currentUserFieldNames,
          userAnnotationsRef.current,
          currentUserID,
        );

        console.log("3. validateViaXFDF valid:", valid);

        if (!valid || !isSigned) {
          console.warn("ABORTED: validation failed", { valid, isSigned });
          console.groupEnd();
          show(t("Signature-is-required"), "warning");
          return;
        }

        // ── Revert XFDF transformations before sending to API ────────────────
        const { HideArray, ReadArray } = buildHideReadArrays(
          userAnnotationsRef.current,
          hiddenUsersRef.current,
          currentUserID,
        );

        const readOnlyUserIDs = userAnnotationsRef.current
          .filter(
            (u) =>
              u.userID !== currentUserID &&
              !hiddenUsersRef.current.includes(u.userID),
          )
          .map((u) => u.userID);

        console.log("4. HideArray:", HideArray);
        console.log("4. ReadArray:", ReadArray);
        console.log("4. readOnlyUserIDs:", readOnlyUserIDs);

        let reverted = await revertProcessXmlForReadOnly(xfdfString, ReadArray);
        console.log("5a. after revertProcessXmlForReadOnly:", summariseXfdfSignature(reverted));

        reverted = await revertProcessXmlToHideFields(
          reverted,
          removeXmlAfterHideDataRef.current,
        );
        console.log("5b. after revertProcessXmlToHideFields:", summariseXfdfSignature(reverted));
        reverted = await revertReadOnlyFreetextElements(
          reverted,
          readOnlyUserIDs,
        );
        console.log("5c. after revertReadOnlyFreetextElements:", summariseXfdfSignature(reverted));

        reverted = await revertHideFreetextElements(
          reverted,
          removeXmlAfterFreetextHideRef.current,
        );
        console.log("5d. FINAL reverted XFDF:", summariseXfdfSignature(reverted));
        console.log("5d. FINAL reverted XFDF (full):", reverted);

        // ── Build API payload ────────────────────────────────────────────────
        const filtered = filterAnnotationsAgainstXFDF(
          userAnnotationsRef.current,
          reverted,
        );
        console.log(
          "6. filterAnnotationsAgainstXFDF result:",
          filtered.map((u) => ({ userID: u.userID, xmlCount: u.xml?.length })),
        );

        const convertData = convertAnnotationsForApi(filtered);
        console.log("6. ActorsFieldValuesList:", convertData);
        const userID = getCurrentUserID();
        const findActionBundleID = fieldsDataRef.current.find(
          (d) => Number(d.userID) === userID,
        );

        // ── Signed PDF bytes ─────────────────────────────────────────────────
        //
        // A signature is a PDF appearance stream that the XFDF only REFERENCES
        // (<apref objnum="N">); unlike text/checkbox values it is not
        // self-contained. Saving only the annotation string left that object
        // unpersisted, so for the next signer the reference dangled and the
        // signature disappeared. Sending the document bytes keeps object N
        // alive so the reference still resolves.
        //
        // Best-effort: if this fails the submit still goes through exactly as
        // it did before, just without the appearance persisted.
        let signedPdfPayload = "";
        try {
          const documentViewer =
            pendingSignatureViewer.current?.Core?.documentViewer;
          const doc = documentViewer?.getDocument?.();
          if (doc) {
            // Pass the XFDF so the annotations are MERGED INTO the saved PDF.
            // getFileData({}) with no options returns the original document
            // bytes without the annotation layer — so the signature, which
            // exists only as an appearance stream in the XFDF, was never
            // actually baked into the file being saved.
            const fileData = await doc.getFileData({ xfdfString: reverted });
            const base64File = await generateBase64FromBlob(
              new Blob([new Uint8Array(fileData)], {
                type: "application/pdf",
              }),
            );
            if (base64File) {
              signedPdfPayload = {
                FileID: Number(docWorkflowID),
                base64File,
              };
            }
          }
        } catch (err) {
          console.error("Failed to serialise signed PDF:", err);
        }

        console.log("7. signedPdfPayload:", {
          present: !!signedPdfPayload,
          FileID: signedPdfPayload?.FileID,
          base64Length: signedPdfPayload?.base64File?.length,
          base64Preview: signedPdfPayload?.base64File?.slice(0, 80),
        });

        // ── Exactly what would be sent to AddUpdateFieldValue ────────────────
        const apiArgs = {
          "arg1 Data (ActorsFieldValuesList)": {
            ActorsFieldValuesList: convertData,
          },
          "arg4 addAnnoatationofFilesAttachment": {
            FileID: Number(docWorkflowID),
            AnnotationString: reverted,
            CreatorID: pdfDataRef.current.creatorID,
          },
          "arg5 saveSignatureDocument": signedPdfPayload,
          "arg6 status": 3,
          "arg8 UpdateActorBundle": {
            WorkFlowID: pdfDataRef.current.workFlowID,
            UserID: userID,
            WorkFlowActionableBundleID:
              findActionBundleID?.pK_WorkFlowActionableBundle_ID ?? 0,
          },
        };
        console.log("8. FULL API ARGS →", apiArgs);
        console.groupEnd();

        dispatch(
          addUpdateFieldValueApi(
            { ActorsFieldValuesList: convertData },
            navigate,
            t,
            {
              FileID: Number(docWorkflowID),
              AnnotationString: reverted,
              CreatorID: pdfDataRef.current.creatorID,
            },
            signedPdfPayload,
            3,
            "",
            {
              WorkFlowID: pdfDataRef.current.workFlowID,
              UserID: userID,
              WorkFlowActionableBundleID:
                findActionBundleID?.pK_WorkFlowActionableBundle_ID ?? 0,
            },
          ),
        );
      } catch (err) {}
    },
    [docWorkflowID, dispatch, navigate, t],
  );

  // ─── Suppress Apryse internal appearance-stream crash ────────────────────
  //
  // When an <apref> in the XFDF references a PDF appearance object that no
  // longer resolves (e.g. after server-side PDF reprocessing), Apryse's
  // internal appearance-loading runs a Promise.all that rejects with:
  //   TypeError: Cannot read properties of undefined (reading 'children')
  // That rejection is unhandled inside webviewer-core.min.js — it never
  // surfaces to our try/catch around importAnnotations.
  //
  // We MUST keep <apref> on Sig-type fields so already-signed signature
  // visuals remain visible; stripping them makes signed fields blank.
  // This handler silences only the specific Apryse internal crash while
  // leaving all other unhandled rejections untouched.
  useEffect(() => {
    const suppressApryseChildrenError = (event) => {
      const reason = event?.reason;
      if (
        reason instanceof TypeError &&
        typeof reason.message === "string" &&
        reason.message.includes("children") &&
        typeof reason.stack === "string" &&
        reason.stack.includes("webviewer-core.min.js")
      ) {
        event.preventDefault(); // prevent "Uncaught (in promise)" from printing
      }
    };
    window.addEventListener("unhandledrejection", suppressApryseChildrenError);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        suppressApryseChildrenError,
      );
    };
  }, []);

  // ─── Header buttons (Decline/Submit or Close) ────────────────────────────
  //
  // Apryse's CustomButton/GroupedItems are plain JS UI objects created once,
  // not React — their label/title text is whatever t() returned AT CREATION
  // TIME and never updates on its own. Extracted into its own function (not
  // just inline in the WebViewer init effect) so it can also be re-invoked
  // whenever the language changes, to actually refresh the button text.
  const renderHeaderButtons = (inst) => {
    const { UI } = inst;
    const topHeader = UI.getModularHeader("default-top-header");
    const existingItems = topHeader
      .getItems()
      .filter((item) => item.dataElement !== "pendingSignatureActionButtons");
    const currentUserID = getCurrentUserID();
    const isSignatory = signerDataRef.current.some(
      (u) => Number(u.userID) === currentUserID,
    );

    let actionGroup;

    if (isSignatory) {
      const declineButton = new UI.Components.CustomButton({
        dataElement: "declineButton",
        label: t("Decline"),
        title: t("Decline"),
        onClick: () => setReasonModal(true),
        style: {
          background: "#fff",
          border: "1px solid #e1e1e1",
          color: "#5a5a5a",
          padding: "8px 30px",
          borderRadius: "4px",
        },
      });

      const submitButton = new UI.Components.CustomButton({
        dataElement: "submitButton",
        label: t("Submit"),
        title: t("Submit"),
        onClick: () => handleSave(inst.Core.annotationManager),
        style: {
          background: "#6172d6",
          border: "1px solid #6172d6",
          color: "#fff",
          padding: "8px 30px",
          borderRadius: "4px",
          marginLeft: "10px",
        },
      });

      actionGroup = new UI.Components.GroupedItems({
        dataElement: "pendingSignatureActionButtons",
        grow: 0,
        gap: 8,
        position: "end",
        alwaysVisible: true,
        items: [declineButton, submitButton],
      });
    } else {
      const closeButton = new UI.Components.CustomButton({
        dataElement: "closeButton",
        label: t("Close"),
        title: t("Close"),
        onClick: () => window.close(),
        style: {
          background: "#fff",
          border: "1px solid #e1e1e1",
          color: "#5a5a5a",
          padding: "8px 30px",
          borderRadius: "4px",
        },
      });

      actionGroup = new UI.Components.GroupedItems({
        dataElement: "pendingSignatureActionButtons",
        grow: 0,
        gap: 8,
        position: "end",
        alwaysVisible: true,
        items: [closeButton],
      });
    }

    topHeader.setItems([...existingItems, actionGroup]);
  };

  // Re-render the header buttons whenever the language changes, since
  // renderHeaderButtons only bakes in the current t() text at call time.
  useEffect(() => {
    if (!instance) return;
    renderHeaderButtons(instance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, i18n.language]);

  // ─── WebViewer initialisation ─────────────────────────────────────────────

  // ✅ WebViewer initialisation with signature tool override
  useEffect(() => {
    if (!isViewerDataReady || webViewerInitialized.current || !viewerRef.current)
      return;

    const init = async () => {
      try {
        const inst = await WebViewer(
          {
            path: "/webviewer/lib",
            fullAPI: true,
            licenseKey: process.env.REACT_APP_APRYSEKEY,
          },
          viewerRef.current,
        );

        setInstance(inst);
        pendingSignatureViewer.current = inst;
        webViewerInitialized.current = true;

        const { UI, Core } = inst;
        const { documentViewer, annotationManager, Tools } = Core;

        // ── Restrict signature creation to the current user's own field ──────
        //
        // Apryse's SignatureCreateTool, once active, opens the "Create
        // Signature" modal on ANY click on the page. The modal can be triggered
        // from either the mouse-DOWN or the mouse-UP handler, so we must gate
        // BOTH; gating only mouseLeftUp (as before) let the mouse-down path
        // open the modal anywhere on the page.
        //
        // We install the patch here — unconditionally and before the document
        // loads — so it is always in place regardless of XFDF timing. The
        // handlers read currentUserFieldNamesRef lazily at click time, so the
        // ref being empty at install time is fine.
        // True only when the click lands on a signature widget that belongs
        // to the current user and is still signable (not signed, not locked).
        const isOwnSignableWidget = (e) => {
          try {
            // Fail OPEN while ownership is unresolved. Returning false here
            // used to mean "not yours", so any hiccup in the ownership data
            // silently swallowed every click and the signature modal never
            // opened until a reload. Non-owned fields remain protected by the
            // Locked/ReadOnly flags applyAnnotationLocks() applies.
            if (!currentUserFieldNamesRef.current.size) return true;

            const widget = annotationManager.getAnnotationByMouseEvent(e);
            if (!widget) return false;

            // A signed field is covered by its signature stamp, which sits on
            // top and has no field of its own — so the click lands on the stamp
            // rather than the widget. Treat a stamp belonging to one of the
            // current user's own fields as clickable, otherwise re-signing is
            // impossible once a signature is present.
            if (typeof widget.getField !== "function") {
              return annotationManager.getAnnotationsList().some((a) => {
                try {
                  if (
                    typeof a.getField !== "function" ||
                    typeof a.getAssociatedSignatureAnnotation !== "function"
                  )
                    return false;
                  const fn = a.getField()?.name;
                  if (!fn || !currentUserFieldNamesRef.current.has(fn))
                    return false;
                  return a.getAssociatedSignatureAnnotation()?.Id === widget.Id;
                } catch {
                  return false;
                }
              });
            }

            const fieldName = widget.getField()?.name;

            // An already-signed field is intentionally still clickable so the
            // signer can re-sign it. Previously this also required
            // `!widget.getAssociatedSignatureAnnotation()`, which meant that
            // once a field was signed the click was swallowed and the modal
            // could never reopen — combined with the delete button being
            // disabled, a signature became permanent.
            return (
              !!fieldName &&
              currentUserFieldNamesRef.current.has(fieldName) &&
              !widget.ReadOnly
            );
          } catch {
            // Errors must not make the document inert either.
            return true;
          }
        };

        patchSignatureTools(Tools, isOwnSignableWidget);

        UI.loadDocument(handleBlobFiles(pdfData.attachmentBlob), {
          filename: pdfData.title,
        });

        // NOTE: "annotationDeleteButton" and "annotationPopup" are deliberately
        // NOT disabled — they are the only way a signer can select their own
        // signature and delete it in order to re-sign. Disabling them made a
        // signature permanent: it could not be removed, and the field could not
        // be signed again. This is safe because applyAnnotationLocks() sets
        // Locked = true on every annotation that is not the current user's, and
        // Apryse's select/delete honours Locked — so a signer can only ever
        // delete their own signature.
        UI.disableElements([
          "linkButton",
          "annotationStyleEditButton",
          "indexPanel",
          "formFieldPanel",
          "groupedLeftHeaderButtons",
          "toolbarGroup-FillAndSign",
          "signatureListPanel",
          "insertGroupedItems",
          "view-controls-toggle-button",
          "searchPanelToggle",
          "notesPanelToggle",
          "colorPalette",
          "underlineToolGroupButton",
          "textSelectButton",
          "textSelectButtonGroup",
          "textPopup",
          "outlinesPanelButton",
          "comboBoxFieldToolGroupButton",
          "listBoxFieldToolGroupButton",
          "toolsOverlay",
          "toolbarGroup-Shapes",
          "toolbarGroup-Edit",
          "toolbarGroup-Insert",
          "shapeToolGroupButton",
          "menuButton",
          "freeHandHighlightToolGroupButton",
          "freeHandToolGroupButton",
          "stickyToolGroupButton",
          "squigglyToolGroupButton",
          "strikeoutToolGroupButton",
          "notesPanel",
          "viewControlsButton",
          "selectToolButton",
          "toggleNotesButton",
          "searchButton",
          "freeTextToolGroupButton",
          "crossStampToolButton",
          "checkStampToolButton",
          "dotStampToolButton",
          "rubberStampToolGroupButton",
          "dateFreeTextToolButton",
          "eraserToolButton",
          "panToolButton",
          "signatureToolGroupButton",
          "viewControlsOverlay",
          "contextMenuPopup",
          "signaturePanelButton",
          "richTextPopup",
          "toolbarGroup-Annotate",
          "leftPanelButton",
          "zoomOverlayButton",
          "toolbarGroup-Forms",
        ]);

        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

          // ── Leave form-field CREATION mode, before anything else ──────────
          //
          // While Apryse is in form-field creation mode, widgets behave as
          // editable ANNOTATIONS: clicking one selects it and shows the
          // edit/delete popup. Only once creation mode has ended do they
          // behave as FILLABLE fields — text boxes accept typing, checkboxes
          // and radios toggle, and a signature field opens the signing modal.
          //
          // This screen only ever fills fields; authoring happens in
          // signatureviewer.js, which is what turns creation mode on. Nothing
          // in this flow ever turned it back off, which is exactly the
          // reported symptom: clicking a field showed edit/delete instead of
          // letting the user sign, type or toggle it.
          //
          // Done first so the annotation locks applied below are not undone by
          // the mode change, and unconditionally rather than behind an
          // isInFormFieldCreationMode() check, since ending it is a no-op when
          // it was never started.
          try {
            const formFieldCreationManager =
              annotationManager.getFormFieldCreationManager?.();
            formFieldCreationManager?.endFormFieldCreationMode?.();
          } catch {
            /* older Apryse builds may not expose the manager */
          }

          if (pdfXfdfRef.current) {
            try {
              // Validate each <apref> objnum against the PDF XRef table;
              // strip references to missing objects (they cause the
              // "Can not find any annotation" PDFWorkerError) while keeping
              // valid ones so already-signed signature visuals stay visible.
              const pdfDoc = await documentViewer.getDocument().getPDFDoc();
              const cleanedXFDF = await stripInvalidAppearanceRefs(
                sanitizeXFDF(pdfXfdfRef.current, documentViewer),
                pdfDoc,
                userAnnotationsRef.current,
              );
              await annotationManager.importAnnotations(cleanedXFDF);

              const currentUserID = getCurrentUserID();

              // Apply locks to all annotations
              applyAnnotationLocks(
                annotationManager,
                annotationManager.getAnnotationsList(),
                currentUserID,
                currentUserFieldNamesRef.current,
                sessionOwnedAnnotIdsRef.current,
              );
            } catch (err) {}
          }

          // Start in EDIT mode deterministically, right after annotations and
          // locks are in place. This previously ran inside a
          // requestAnimationFrame + 200ms setTimeout, which fired unconditionally
          // and could reset the tool out from under a click already in flight.
          UI.setToolMode(Core.Tools.ToolNames.EDIT);

          documentViewer.refreshAll();
          documentViewer.updateView();
        });

        // Header buttons
        renderHeaderButtons(inst);
      } catch (err) {}
    };

    init();
  }, [isViewerDataReady]);

  // ─── Unmount teardown ──────────────────────────────────────────────────────
  //
  // Runs once, on unmount only. Without this the screen left behind:
  //   • patched Apryse tool prototypes (global, and re-wrapped on every mount)
  //   • an undisposed WebViewer instance (a large WASM heap plus workers)
  //   • the previous document's Redux state, which the next viewer's
  //     `if (!x) return;` guards accept immediately as if it were its own
  useEffect(() => {
    return () => {
      unpatchSignatureTools();

      try {
        pendingSignatureViewer.current?.UI?.dispose?.();
      } catch {
        /* disposal is best-effort */
      }
      pendingSignatureViewer.current = null;

      // Allow a remount to bootstrap a fresh viewer.
      webViewerInitialized.current = false;

      dispatch(clearSignatureViewerData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── annotationChanged + fieldChanged event listeners ──────────────────────
  //
  // annotationChanged: syncs the userAnnotations XFDF snapshot and re-applies
  //   locks in case Apryse resets any flags internally.
  //
  // fieldChanged: fires AFTER Apryse finishes its own post-commit processing.
  //   This is the only reliable place to clear the field-level ReadOnly that
  //   Apryse sets after a signature is committed, so the user can re-sign.
  //
  // ✅ Annotation Changed handler with locks
  useEffect(() => {
    if (!instance) return;
    const { annotationManager } = instance.Core;
    const currentUserID = getCurrentUserID();

    const annotHandler = async (annotations, action, { imported }) => {
      if (imported) return;

      // Anything reaching here is a change this user just made interactively,
      // so record additions as theirs before any locking runs. Without this a
      // freshly drawn signature stamp — which has no field and no
      // "<label>-<userID>" Subject — fails every ownership test and is locked
      // the moment it is created, making it impossible to clear or re-sign.
      if (action === "add") {
        annotations.forEach((a) => {
          if (a?.Id) sessionOwnedAnnotIdsRef.current.add(a.Id);
          // Also stamp it onto the annotation itself. The session set above
          // is empty after a reload; this is what makes the signature still
          // resolve as the current user's once it comes back from the server.
          try {
            const existing = a.getCustomData?.(SIGNER_CUSTOM_DATA_KEY);
            if (!existing) {
              a.setCustomData?.(SIGNER_CUSTOM_DATA_KEY, String(currentUserID));
            }
          } catch {
            /* custom data unsupported — session set still covers this load */
          }
        });
      } else if (action === "delete") {
        annotations.forEach((a) => {
          if (a?.Id) sessionOwnedAnnotIdsRef.current.delete(a.Id);
        });
      }

      try {
        const xfdfString = await annotationManager.exportAnnotations();
        const snapshot = userAnnotationsRef.current.map((u) => ({
          ...u,
          xml: [...u.xml],
        }));
        mergeXFDFIntoAnnotations(xfdfString, selectedUserRef.current, snapshot);
        setUserAnnotations(snapshot);
      } catch (err) {}

      // Re-apply locks after changes
      applyAnnotationLocks(
        annotationManager,
        annotations,
        currentUserID,
        currentUserFieldNamesRef.current,
        sessionOwnedAnnotIdsRef.current,
      );
    };

    // ✅ Updated fieldHandler with proper ownership check
    const fieldHandler = (field, newValue) => {
      try {
        const fieldName = field.name;

        // Block non-owner fields — but only once ownership is actually known.
        // An empty set means ownership has not resolved yet (see the matching
        // fail-open guard in applyAnnotationLocks); blocking on that basis
        // would stop the user filling their own field and never clear the
        // post-signature ReadOnly flag, so re-signing would break too.
        if (
          currentUserFieldNamesRef.current.size > 0 &&
          !currentUserFieldNamesRef.current.has(fieldName)
        ) {
          return;
        }

        const fieldType = field.type || "";

        if (fieldType === "Sig") {
          filledFieldsRef.current.add(fieldName);
        } else if (fieldType === "Btn") {
          filledFieldsRef.current.add(fieldName);
        } else {
          const strValue = String(newValue ?? "").trim();
          if (strValue) {
            filledFieldsRef.current.add(fieldName);
          } else {
            filledFieldsRef.current.delete(fieldName);
          }
        }

        // Clear ReadOnly flag for re-sign support
        field.flags.set("ReadOnly", false);

        // Re-signable, but still not repositionable — mirrors the owner
        // branch of applyAnnotationLocks (fill yes, move/resize no), including
        // its appearance-safe flag handling: this runs the instant a field
        // commits, so setting NoRotate here wiped the appearance of the
        // signature the user had just drawn.
        field.widgets?.forEach((annot) => {
          setAnnotationFlags(annot, {
            Locked: false,
            ReadOnly: false,
            NoResize: true,
            NoMove: true,
          });
          annotationManager.updateAnnotation(annot);
          annotationManager.redrawAnnotation(annot);
        });
      } catch (err) {}
    };

    annotationManager.addEventListener("annotationChanged", annotHandler);
    annotationManager.addEventListener("fieldChanged", fieldHandler);

    return () => {
      annotationManager.removeEventListener("annotationChanged", annotHandler);
      annotationManager.removeEventListener("fieldChanged", fieldHandler);
    };
  }, [instance]);

  // ── Participants change ────────────────────────────────────────────────────
  useEffect(() => {
    if (!instance || !participants.length) return;
    instance.UI.disableElement("customPanel");
    instance.UI.enableElement("customPanel");
    instance.UI.setActiveLeftPanel("customPanel");
    setLastParticipants(participants);
  }, [participants]);

  // ─── Decline confirm ──────────────────────────────────────────────────────

  const handleConfirmDecline = () => {
    if (!declineReasonMessage) {
      setDeclineErrorMessage(true);
      return;
    }

    const userID = getCurrentUserID();
    const actorData = userAnnotationsRef.current.find(
      (d) => Number(d.userID) === userID,
    );
    if (!actorData) return;

    dispatch(
      declineReasonApi(
        navigate,
        t,
        {
          FK_WorkFlow_ID: pdfDataRef.current.workFlowID,
          Reason: declineReasonMessage,
          DeclinedById: Number(actorData.actorID),
        },
        setReasonModal,
        setDeclineConfirmationModal,
      ),
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <div ref={viewerRef} style={{ height: "100%", width: "100%" }} />
      </div>

      {reasonModal && (
        <DeclineReasonModal
          show={reasonModal}
          setShow={setReasonModal}
          declineReasonMessage={declineReasonMessage}
          setDeclineReasonMessage={setDeclineReasonMessage}
          handleClickDecline={handleConfirmDecline}
          declineErrorMessage={declineErrorMessage}
          setDeclineErrorMessage={setDeclineErrorMessage}
        />
      )}

      {declineConfirmationModal && (
        <DeclineReasonCloseModal
          show={declineConfirmationModal}
          setShow={setDeclineConfirmationModal}
        />
      )}

      {SnackBar}
    </>
  );
};

export default PendingSignatureViewer;
