import React, { useRef, useEffect, useState, useCallback } from "react";
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
import { showMessage } from "../../../../components/elements/snack_bar/utill";

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
        } catch { /* ignore */ }
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
          const missing = !obj || (typeof obj.isNull === "function" && await obj.isNull());
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
              console.error("revertXmlField parse error:", err, str);
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
        if (xml.widget?.includes(widgetName)) {
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
const applyAnnotationLocks = (
  annotationManager,
  annotations,
  currentUserID,
  currentUserFieldNames,
) => {
  annotations.forEach((annot) => {
    const isWidget =
      typeof annot.getField === "function" ||
      annot.constructor?.name?.includes("Widget");

    let isOwner = false;

    if (isWidget) {
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
      // Non-owner: Completely disable the field
      annot.Locked = true;
      annot.ReadOnly = true;
      annot.NoResize = true;
      annot.NoMove = true;
      annot.NoRotate = true;

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
      // Owner: Unlock the field
      annot.Locked = false;
      annot.ReadOnly = false;
      annot.NoResize = false;
      annot.NoMove = false;
      annot.NoRotate = false;

      if (isWidget) {
        try {
          const field = annot.getField?.();
          if (field) field.flags.set("ReadOnly", false);
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
  const { t } = useTranslation();

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
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "error",
  });
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

  // ✅ Store original mouseLeftUp function to restore if needed
  const originalMouseLeftUpRef = useRef(null);

  /**
   * Set of field names that the current user has already filled / signed during
   * this session.  Populated exclusively via the `fieldChanged` event — the only
   * reliable signal that Apryse provides for signature fields (Apryse stores
   * signature data as an appearance stream, NOT as an XFDF field value, so
   * XFDF parsing always returns empty for signature fields even after signing).
   */
  const filledFieldsRef = useRef(new Set());

  // ── Sync state → refs ──────────────────────────────────────────────────────
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);

  useEffect(() => {
    userAnnotationsRef.current = userAnnotations;
    // Recompute the current user's field names whenever annotations update
    currentUserFieldNamesRef.current = getUserFieldNames(
      userAnnotations,
      getCurrentUserID(),
    );
  }, [userAnnotations]);

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

  // ── Initial API calls ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!docWorkflowID) return;
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

  useEffect(() => {
    if (ResponseMessage) showMessage(ResponseMessage, "error", setNotification);
  }, [ResponseMessage]);

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
    } catch (err) {
      console.error("getAllFieldsByWorkflowID handler:", err);
    }
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
    } catch (err) {
      console.error("getWorkfFlowByFileId handler:", err);
    }
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
    } catch (err) {
      console.error("getSignatureFileAnnotationResponse handler:", err);
    }
  }, [getSignatureFileAnnotationResponse]);

  // ─── Save / submit handler ────────────────────────────────────────────────

  const handleSave = useCallback(
    async (annotationManager) => {
      try {
        const currentUserID = getCurrentUserID();
        const currentUserFieldNames = currentUserFieldNamesRef.current;

        console.log(
          currentUserID,
          currentUserFieldNames,
          "handleSavehandleSavehandle",
        );

        // Export XFDF once — used for both validation and API payload
        const xfdfString = await annotationManager.exportAnnotations();
        console.log(xfdfString, "exported XFDF");

        // Usage with your data
        const isSigned = isUserSigned(xfdfString);
        console.log("User signed:", isSigned);

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

        console.log(valid, "handleSavehandleSavehandle");

        if (!valid || !isSigned) {
          showMessage(t("Signature-is-required"), "warning", setNotification);
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

        let reverted = await revertProcessXmlForReadOnly(xfdfString, ReadArray);
        reverted = await revertProcessXmlToHideFields(
          reverted,
          removeXmlAfterHideDataRef.current,
        );
        reverted = await revertReadOnlyFreetextElements(
          reverted,
          readOnlyUserIDs,
        );
        reverted = await revertHideFreetextElements(
          reverted,
          removeXmlAfterFreetextHideRef.current,
        );

        // ── Build API payload ────────────────────────────────────────────────
        const filtered = filterAnnotationsAgainstXFDF(
          userAnnotationsRef.current,
          reverted,
        );
        const convertData = convertAnnotationsForApi(filtered);
        const userID = getCurrentUserID();
        const findActionBundleID = fieldsDataRef.current.find(
          (d) => Number(d.userID) === userID,
        );

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
            "",
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
      } catch (err) {
        console.error("handleSave:", err);
      }
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

  // ─── WebViewer initialisation ─────────────────────────────────────────────

  // ✅ WebViewer initialisation with signature tool override
  useEffect(() => {
    if (
      !pdfData.attachmentBlob ||
      webViewerInitialized.current ||
      !viewerRef.current
    )
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
        webViewerInitialized.current = true;

        const { UI, Core } = inst;
        const { documentViewer, annotationManager, Tools } = Core;

        UI.loadDocument(handleBlobFiles(pdfData.attachmentBlob), {
          filename: pdfData.title,
        });

        UI.disableElements([
          "linkButton",
          "annotationStyleEditButton",
          "annotationDeleteButton",
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
          "annotationPopup",
          "richTextPopup",
          "toolbarGroup-Annotate",
          "leftPanelButton",
          "zoomOverlayButton",
          "toolbarGroup-Forms",
        ]);

        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

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
              );

              // ✅ CRITICAL: Override SignatureCreateTool to block clicks on non-owner fields
              const SignatureCreateTool = Tools.SignatureCreateTool;
              if (SignatureCreateTool && !originalMouseLeftUpRef.current) {
                // Store original function
                originalMouseLeftUpRef.current =
                  SignatureCreateTool.prototype.mouseLeftUp;

                // Override with our custom logic
                SignatureCreateTool.prototype.mouseLeftUp = function (e) {
                  const widget = annotationManager.getAnnotationByMouseEvent(e);

                  // Check if clicked on a signature widget
                  if (
                    widget &&
                    widget.getField &&
                    typeof widget.getField === "function"
                  ) {
                    const field = widget.getField();
                    const fieldName = field?.name;
                    const isOwner =
                      currentUserFieldNamesRef.current.has(fieldName);

                    console.log(
                      `Widget clicked: ${fieldName}, isOwner: ${isOwner}`,
                    );

                    // Only allow click if:
                    // 1. Field belongs to current user
                    // 2. Field is not already signed
                    // 3. Field is not read-only
                    if (
                      isOwner &&
                      !widget.getAssociatedSignatureAnnotation() &&
                      !widget.ReadOnly
                    ) {
                      console.log("✅ Allowing signature on owner field");
                      originalMouseLeftUpRef.current.call(this, e);
                    } else {
                      console.log("❌ Blocking signature on non-owner field");
                      // Do nothing - field is blocked
                    }
                  } else {
                    // Not a signature widget, proceed normally
                    originalMouseLeftUpRef.current.call(this, e);
                  }
                };
              }
            } catch (err) {
              console.error("importAnnotations:", err);
            }
          }

          documentViewer.refreshAll();
          documentViewer.updateView();
        });

        // Header buttons
        const topHeader = UI.getModularHeader("default-top-header");
        const existingItems = topHeader.getItems();
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
            onClick: () => handleSave(annotationManager),
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
      } catch (err) {
        console.error("WebViewer init error:", err);
      }
    };

    init();
  }, [pdfData.attachmentBlob]);

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

      try {
        const xfdfString = await annotationManager.exportAnnotations();
        const snapshot = userAnnotationsRef.current.map((u) => ({
          ...u,
          xml: [...u.xml],
        }));
        mergeXFDFIntoAnnotations(xfdfString, selectedUserRef.current, snapshot);
        setUserAnnotations(snapshot);
      } catch (err) {
        console.error("annotationChanged snapshot:", err);
      }

      // Re-apply locks after changes
      applyAnnotationLocks(
        annotationManager,
        annotations,
        currentUserID,
        currentUserFieldNamesRef.current,
      );
    };

    // ✅ Updated fieldHandler with proper ownership check
    const fieldHandler = (field, newValue) => {
      try {
        const fieldName = field.name;

        // 🔥 CRITICAL: Block non-owner fields immediately
        if (!currentUserFieldNamesRef.current.has(fieldName)) {
          console.warn(
            `🚫 Blocked: Field "${fieldName}" doesn't belong to current user`,
          );
          return;
        }

        console.log(`✅ Field changed allowed for: ${fieldName}`);

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

        field.widgets?.forEach((annot) => {
          annot.Locked = false;
          annot.ReadOnly = false;
          annot.NoResize = false;
          annot.NoMove = false;
          annot.NoRotate = false;
          annotationManager.updateAnnotation(annot);
          annotationManager.redrawAnnotation(annot);
        });
      } catch (err) {
        console.error("fieldChanged:", err);
      }
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

    </>
  );
};

export default PendingSignatureViewer;
