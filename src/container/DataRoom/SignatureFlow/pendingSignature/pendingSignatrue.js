import React, { useRef, useEffect, useState, useCallback } from "react";
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
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";
import useApryseWebViewer, {
  stripInvalidAppearanceRefs,
} from "../hooks/useApryseWebViewer";

// ─── Pure helpers ─────────────────────────────────────────────────────────────

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
      try {
        const ffieldName = new DOMParser()
          .parseFromString(item.ffield, "text/xml")
          .documentElement.getAttribute("name");
        const widgetName = new DOMParser()
          .parseFromString(item.widget, "text/xml")
          .documentElement.getAttribute("name");
        return exists(ffieldName, "ffield") && exists(widgetName, "widget");
      } catch (err) {
        // Malformed ffield/widget XML — drop this entry instead of throwing
        // and aborting the whole save flow.
        console.error("filterAnnotationsAgainstXFDF: failed to parse item", err, item);
        return false;
      }
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
 * Signature appearance annotations (the visible ink/image "stamp" created
 *   when a Sig widget is signed, retrievable via
 *   widget.getAssociatedSignatureAnnotation()) → these are separate
 *   annotation objects from the widget itself and don't have a Subject or
 *   a field, so ownership is inherited from whichever widget they're
 *   associated with. This is what lets a user select + delete (via the
 *   standard delete tool/button) only their own signature to correct it,
 *   while leaving the widget itself intact for re-signing.
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
  // ── Pre-pass: find signature "stamp" annotations that belong to widgets
  // owned by the current user, so they can be treated as owned below. ──
  const ownedSignatureAnnotIds = new Set();
  annotations.forEach((a) => {
    try {
      if (typeof a.getField === "function" && typeof a.getAssociatedSignatureAnnotation === "function") {
        const fieldName = a.getField()?.name;
        if (fieldName && currentUserFieldNames.has(fieldName)) {
          const assoc = a.getAssociatedSignatureAnnotation();
          if (assoc?.Id) ownedSignatureAnnotIds.add(assoc.Id);
        }
      }
    } catch {
      /* ignore — fall through to normal ownership checks below */
    }
  });

  annotations.forEach((annot) => {
    const isWidget =
      typeof annot.getField === "function" ||
      annot.constructor?.name?.includes("Widget");

    let isOwner = false;

    if (annot.Id && ownedSignatureAnnotIds.has(annot.Id)) {
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
    getSignatureFileAnnotationResponse,
  } = useSelector((s) => s.SignatureWorkFlowReducer);

  const docWorkflowID = new URLSearchParams(location.search).get("documentID");

  // ── WebViewer ──────────────────────────────────────────────────────────────
  const { viewerRef, instance, initWebViewer } = useApryseWebViewer();

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

  // Guard so the SignatureCreateTool mouse handlers are patched only once.
  const signatureToolPatchedRef = useRef(false);

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
      console.error("getAllFieldsByWorkflowID effect failed:", err);
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
      console.error("getWorkfFlowByFileId effect failed:", err);
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
      console.error("getSignatureFileAnnotationResponse effect failed:", err);
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
        console.error("handleSave failed:", err);
      }
    },
    [docWorkflowID, dispatch, navigate, t],
  );

  // ─── WebViewer initialisation ─────────────────────────────────────────────
  //
  // The Apryse "reading children" crash suppression and the double-init
  // guard both live inside useApryseWebViewer() now — see that file.

  // ✅ WebViewer initialisation with signature tool override
  useEffect(() => {
    if (!pdfData.attachmentBlob) return;

    let documentLoadedHandler = null;
    let documentViewerForCleanup = null;

    const init = async () => {
      try {
        const inst = await initWebViewer();
        if (!inst) return;

        const { UI, Core } = inst;
        const { documentViewer, annotationManager, Tools } = Core;
        documentViewerForCleanup = documentViewer;

        console.log({ Tools }, "ToolsToolsToolsToolsToolsToolsToolsTools");

        // ── Restrict signature creation to the current user's own field ──────
        //
        // Once active, Apryse's signature-field tool opens the "Create
        // Signature" modal on a click. The modal can be triggered from either
        // the mouse-DOWN or the mouse-UP handler, so we must gate BOTH; gating
        // only mouseLeftUp (as before) let the mouse-down path open the modal
        // anywhere on the page. Two tool classes need this: SignatureCreateTool
        // (the simple annotation-based signer) AND SignatureFormFieldCreateTool
        // (the Forms-toolbar tool — since fields are placed via the Forms
        // toolbar in signatureviewer.js, clicking an EXISTING field routes
        // through this same class, not just SignatureCreateTool).
        //
        // We install the patch here — unconditionally and before the document
        // loads — so it is always in place regardless of XFDF timing. The
        // handler reads currentUserFieldNamesRef lazily at click time, so the
        // ref being empty at install time is fine.
        if (!signatureToolPatchedRef.current) {
          signatureToolPatchedRef.current = true;

          // True only when the click lands on a field widget that belongs to
          // the current user and is still fillable (not signed, not locked).
          const isOwnSignableWidget = (e) => {
            try {
              const widget = annotationManager.getAnnotationByMouseEvent(e);
              if (!widget || typeof widget.getField !== "function")
                return false;
              const fieldName = widget.getField()?.name;
              return (
                !!fieldName &&
                currentUserFieldNamesRef.current.has(fieldName) &&
                !widget.getAssociatedSignatureAnnotation?.() &&
                !widget.ReadOnly
              );
            } catch {
              return false;
            }
          };

          [Tools.SignatureCreateTool, Tools.SignatureFormFieldCreateTool]
            .filter(Boolean)
            .forEach((ToolClass) => {
              const origMouseDown = ToolClass.prototype.mouseLeftDown;
              const origMouseUp = ToolClass.prototype.mouseLeftUp;

              ToolClass.prototype.mouseLeftDown = function (e) {
                if (isOwnSignableWidget(e)) return origMouseDown.call(this, e);
                // click outside an owned field — ignore
              };
              ToolClass.prototype.mouseLeftUp = function (e) {
                if (isOwnSignableWidget(e)) return origMouseUp.call(this, e);
                // click outside an owned field — ignore
              };
            });
        }

        // ── Field-interaction tools that must stay ownership-gated ───────────
        //
        // The document's fields were placed via Apryse's Forms toolbar in
        // signatureviewer.js (toolbarGroup-Forms is enabled there), so
        // clicking an EXISTING field on this page routes through the SAME
        // *FormFieldCreateTool classes Apryse uses to originally place them —
        // e.g. SIG_FORM_FIELD ("SignatureFormFieldCreateTool") handles both
        // "place a brand-new Sig field" AND "fill/sign this existing Sig
        // field". SIGNATURE ("SignatureCreateTool") is the older/simpler
        // annotation-based signing tool. A signer legitimately needs ONE of
        // these active while interacting with their OWN field — so we can't
        // just always revert away from them (that would block real signing).
        // What must never happen is one of these tools staying active while
        // NOTHING owned by the current user is selected — that's what let a
        // click reach a field that isn't theirs, and what left the tool
        // "stuck" showing a stray/ghost field box on later pages.
        const FIELD_INTERACTION_TOOLS = new Set([
          Tools.ToolNames.SIGNATURE,
          Tools.ToolNames.SIG_FORM_FIELD,
          Tools.ToolNames.TEXT_FORM_FIELD,
          Tools.ToolNames.CHECK_BOX_FIELD,
          Tools.ToolNames.RADIO_FORM_FIELD,
          Tools.ToolNames.LIST_BOX_FIELD,
        ]);

        // True if at least one currently-selected annotation is an
        // editable field that belongs to the current user.
        const hasOwnedSelection = () => {
          const selected = annotationManager.getSelectedAnnotations?.() ?? [];
          return selected.some((annot) => {
            try {
              const field = annot.getField?.();
              const fieldName = field?.name;
              return (
                !!fieldName &&
                currentUserFieldNamesRef.current.has(fieldName) &&
                !annot.ReadOnly
              );
            } catch {
              return false;
            }
          });
        };

        // ── Guard 1: block at annotation-selection time ──────────────────────
        //
        // Clicking a field widget selects it, and Apryse's own internal
        // listener reacts to that selection by switching into whichever
        // FIELD_INTERACTION_TOOLS member matches the field type — independent
        // of whichever tool was active before the click. We intercept the
        // selection itself: a non-owned field is deselected immediately, and
        // if Apryse already switched tool mode as a result, we revert.
        annotationManager.addEventListener(
          "annotationSelected",
          (annotations, action) => {
            if (action !== "selected") return;
            annotations.forEach((annot) => {
              if (typeof annot.getField !== "function") return;
              const field = annot.getField();
              const fieldName = field?.name;
              if (fieldName && currentUserFieldNamesRef.current.has(fieldName))
                return; // owned — allow the normal flow

              annotationManager.deselectAnnotation(annot);
              if (FIELD_INTERACTION_TOOLS.has(documentViewer.getToolMode()?.name)) {
                UI.setToolMode(Tools.ToolNames.ANNOTATION_EDIT);
              }
            });
          },
        );

        // ── Guard 2: catch activation that isn't tied to a selection at all ──
        //
        // Observed bug: on first load, the active tool sometimes ends up as
        // SIG_FORM_FIELD with nothing legitimately selected, and it
        // self-corrected on a second visit — the signature of a race between
        // Apryse's own post-load logic and our fixed 200ms reset further
        // below. That stray active tool is also what produced the extra/
        // ghost field box seen on a later page. Reacting to the tool-mode
        // change itself (instead of guessing a timeout) catches it the
        // instant it happens, regardless of timing — but only reverts when
        // there's no legitimately owned field selected, so a real owner
        // signing their own field is never interrupted.
        documentViewer.addEventListener("toolModeUpdated", (newTool) => {
          if (!newTool?.name || !FIELD_INTERACTION_TOOLS.has(newTool.name)) return;
          if (!hasOwnedSelection()) {
            UI.setToolMode(Tools.ToolNames.ANNOTATION_EDIT);
          }
        });

        UI.loadDocument(handleBlobFiles(pdfData.attachmentBlob), {
          filename: pdfData.title,
        });

        // NOTE: "annotationDeleteButton" and "annotationPopup" are intentionally
        // left enabled (not in the list below) so a user can select their own
        // signature and delete it to re-sign. This is safe because
        // applyAnnotationLocks() sets Locked = true on every annotation that
        // doesn't belong to the current user — Apryse's built-in select/delete
        // tool respects Locked and won't let a user select-for-delete or delete
        // anything that isn't theirs.
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

        documentLoadedHandler = async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

          if (pdfXfdfRef.current) {
            try {
              const pdfDoc = await documentViewer.getDocument().getPDFDoc();

              const cleanedXFDF = await stripInvalidAppearanceRefs(
                sanitizeXFDF(pdfXfdfRef.current, documentViewer),
                pdfDoc,
                userAnnotationsRef.current,
              );

              await annotationManager.importAnnotations(cleanedXFDF);

              const currentUserID = getCurrentUserID();

              applyAnnotationLocks(
                annotationManager,
                annotationManager.getAnnotationsList(),
                currentUserID,
                currentUserFieldNamesRef.current,
              );
            } catch (err) {
              console.error(err);
            }
          }

          documentViewer.refreshAll();
          documentViewer.updateView();

          // 👇 Add this block
          requestAnimationFrame(() => {
            setTimeout(() => {
              UI.setToolMode(Core.Tools.ToolNames.ANNOTATION_EDIT);

              console.log("Current Tool:", UI.getToolMode()?.name);
            }, 200);
          });
        };

        documentViewer.addEventListener("documentLoaded", documentLoadedHandler);
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
            text: t("Decline"),
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
        console.error("WebViewer init failed:", err);
      }
    };

    init();

    return () => {
      if (documentViewerForCleanup && documentLoadedHandler) {
        documentViewerForCleanup.removeEventListener(
          "documentLoaded",
          documentLoadedHandler,
        );
      }
    };
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
        console.error("annotationChanged handler failed:", err);
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
        console.error("fieldChanged handler failed:", err);
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

      {SnackBar}
    </>
  );
};

export default PendingSignatureViewer;