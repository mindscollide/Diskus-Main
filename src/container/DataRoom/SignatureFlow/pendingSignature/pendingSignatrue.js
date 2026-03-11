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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const buildHideReadArrays = (
  annotations,
  hiddenUsers,
  readOnlyUsers,
  currentUserID,
) => {
  const HideArray = [];
  const ReadArray = [];
  annotations.forEach((obj) => {
    if (obj.userID === currentUserID) return;
    obj.xml.forEach(({ ffield }) => {
      const matches = ffield?.match(/<ffield[^>]*\sname="([^"]+)"/g) ?? [];
      matches.forEach((match) => {
        const name = match.match(/name="([^"]+)"/)?.[1];
        if (!name) return;
        if (hiddenUsers.includes(obj.userID)) HideArray.push(name);
        else if (readOnlyUsers.includes(obj.userID)) ReadArray.push(name);
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

const getAnnotationOwnerID = (annot) => {
  if (!annot.Subject) return null;
  const parts = annot.Subject.split("-");
  const lastPart = parts[parts.length - 1];
  const parsed = Number(lastPart);
  return Number.isFinite(parsed) && lastPart !== "" ? parsed : null;
};

/**
 * Apply lock/readOnly rules.
 * Own annotations → fully editable.
 * Others' annotations → locked + read-only.
 *
 * For WidgetAnnotations that belong to the current user we ALSO
 * call field.resetValue() + clear the flags Apryse sets internally
 * when a signature field has been "committed", so the user can
 * click it again to replace their signature.
 */
const applyAnnotationLocks = (
  annotationManager,
  annotations,
  currentUserID,
) => {
  annotations.forEach((annot) => {
    const ownerID = getAnnotationOwnerID(annot);
    const isOwner = ownerID === currentUserID;

    // annot.Locked = !isOwner;
    // annot.ReadOnly = !isOwner;
    annot.NoResize = true;
    annot.NoMove = true;
    annot.NoRotate = true;

    // ── Re-sign fix ──────────────────────────────────────────────────────────
    // After Apryse "commits" a signature widget it sets the field to ReadOnly
    // at the PDF-field level (separate from the annotation-level flags above).
    // We must clear that field-level lock so clicking the widget opens the
    // signature panel again instead of doing nothing.
    if (isOwner) {
      // Check annotation type via constructor name — works without importing
      // the Annotations namespace outside the WebViewer promise scope.
      const isWidget =
        annot.constructor?.name?.includes("Widget") ||
        annot.Subject?.includes("Widget") ||
        typeof annot.getField === "function";

      if (isWidget) {
        try {
          const field = annot.getField?.();
          if (field) {
            // Clear PDF-field-level read-only so the widget is clickable again
            field.flags.set("ReadOnly", false);
            // If this is a signature field that has been filled, mark it as
            // not-yet-signed so Apryse will open the signing dialog on click.
            if (typeof field.setValue === "function") {
              // Passing undefined / empty string clears the drawn signature
              // without removing the widget placeholder from the document.
              // We only do this if the field is already filled.
              if (
                field.getValue?.() !== "" &&
                field.getValue?.() !== undefined
              ) {
                // DON'T clear the value here — we want to KEEP the existing
                // signature visible. We only need to make the field clickable.
                // Clearing the PDF ReadOnly flag is sufficient.
              }
            }
          }
        } catch (_) {
          // getField not available on all annotation subtypes — safe to ignore
        }
      }
    }
    // ── End re-sign fix ──────────────────────────────────────────────────────

    annotationManager.redrawAnnotation(annot);
  });
};

/**
 * After a signature is placed Apryse fires annotationChanged with action="modify".
 * At that point the widget is already "committed" and its field is set to ReadOnly
 * by the SDK internally. We re-unlock it immediately so the user can click to change.
 */
const unlockSignatureWidgetForResign = (annot, annotationManager) => {
  try {
    const field = annot.getField?.();
    if (!field) return;
    field.flags.set("ReadOnly", false);
    annot.Locked = false;
    annot.ReadOnly = false;
    annot.NoResize = false;
    annot.NoMove = false;
    annot.NoRotate = false;
    annotationManager.updateAnnotation(annot);
    annotationManager.redrawAnnotation(annot);
  } catch (_) {}
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

  // ── WebViewer ──
  const viewerRef = useRef(null);
  const webViewerInitialized = useRef(false);
  const [instance, setInstance] = useState(null);

  // ── Data state ──
  const [fieldsData, setFieldsData] = useState([]);
  const [signerData, setSignerData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // ── Annotation state ──
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [userAnnotationsCopy, setUserAnnotationsCopy] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);
  const [readOnlyUsers, setReadOnlyUsers] = useState([]);

  const [removeXmlAfterHideData, setRemoveXmlAfterHideData] = useState("");
  const [removeXmlAfterFreetextHideData, setRemoveXmlAfterFreetextHideData] =
    useState([]);

  // ── PDF data ──
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

  // ── UI state ──
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

  // ── Stable refs ──
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const userAnnotationsCopyRef = useRef(userAnnotationsCopy);
  const pdfXfdfRef = useRef(pdfData.xfdfData);
  const participantsRef = useRef(participants);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);
  const removeXmlAfterHideDataRef = useRef(removeXmlAfterHideData);
  const removeXmlAfterFreetextHideRef = useRef(removeXmlAfterFreetextHideData);
  const fieldsDataRef = useRef(fieldsData);
  const pdfDataRef = useRef(pdfData);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);
  useEffect(() => {
    userAnnotationsRef.current = userAnnotations;
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
    readOnlyUsersRef.current = readOnlyUsers;
  }, [readOnlyUsers]);
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

  // ── Initial API calls ──
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
  }, [docWorkflowID]);

  useEffect(() => {
    if (ResponseMessage) showMessage(ResponseMessage, "error", setNotification);
  }, [ResponseMessage]);

  // ── getAllFieldsByWorkflowID ──
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

      setHiddenUsers(getAllFieldsByWorkflowID.hiddenUsers ?? []);
      setReadOnlyUsers(getAllFieldsByWorkflowID.readOnlyUsers ?? []);

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

  // ── getWorkfFlowByFileId ──
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

  // ── getSignatureFileAnnotationResponse ──
  useEffect(() => {
    if (!getSignatureFileAnnotationResponse) return;
    try {
      const currentUserID = getCurrentUserID();
      const { HideArray, ReadArray } = buildHideReadArrays(
        userAnnotationsRef.current,
        hiddenUsersRef.current,
        readOnlyUsersRef.current,
        currentUserID,
      );

      const withReadOnly = processXmlForReadOnly(
        getSignatureFileAnnotationResponse.annotationString,
        ReadArray,
      );
      const { updatedXmlString, removedItems } = processXmlToHideFields(
        withReadOnly,
        HideArray,
      );
      setRemoveXmlAfterHideData(removedItems);

      const withReadOnlyFreetext = readOnlyFreetextElements(
        updatedXmlString,
        readOnlyUsersRef.current,
      );
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

  // ─── Save handler ─────────────────────────────────────────────────────────

  const handleSave = useCallback(
    async (annotationManager) => {
      try {
        const currentUserID = getCurrentUserID();
        const xfdfString = await annotationManager.exportAnnotations();

        const { HideArray, ReadArray } = buildHideReadArrays(
          userAnnotationsRef.current,
          hiddenUsersRef.current,
          readOnlyUsersRef.current,
          currentUserID,
        );

        let reverted = await revertProcessXmlForReadOnly(xfdfString, ReadArray);
        reverted = await revertProcessXmlToHideFields(
          reverted,
          removeXmlAfterHideDataRef.current,
        );
        reverted = await revertReadOnlyFreetextElements(
          reverted,
          readOnlyUsersRef.current,
        );

        // Validate current user has signed
        const parser = new DOMParser();
        const doc = parser.parseFromString(reverted, "text/xml");
        const annotsEl = doc.getElementsByTagName("annots")[0];
        const pattern = new RegExp(`-${currentUserID}$`);
        const hasSigned = annotsEl
          ? Array.from(annotsEl.children).some((node) => {
              const subj =
                node.getAttribute("subject") ||
                node.getAttribute("Subject") ||
                "";
              return pattern.test(subj);
            })
          : false;

        if (!hasSigned) {
          showMessage(t("Signature-is-required"), "warning", setNotification);
          return;
        }

        reverted = await revertHideFreetextElements(
          reverted,
          removeXmlAfterFreetextHideRef.current,
        );

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

  // ─── WebViewer initialisation ─────────────────────────────────────────────

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
        const { documentViewer, annotationManager } = Core;

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

        // ── documentLoaded ────────────────────────────────────────────────────
        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

          if (pdfXfdfRef.current) {
            try {
              const cleanedXFDF = sanitizeXFDF(
                pdfXfdfRef.current,
                documentViewer,
              );
              await annotationManager.importAnnotations(cleanedXFDF);

              const currentUserID = getCurrentUserID();
              const allAnnotations = annotationManager.getAnnotationsList();
              applyAnnotationLocks(
                annotationManager,
                allAnnotations,
                currentUserID,
              );
              console.log(
                "importAnnotations:",
                applyAnnotationLocks(
                  annotationManager,
                  allAnnotations,
                  currentUserID,
                ),
              );
            } catch (err) {
              console.error("importAnnotations:", err);
            }
          }

          documentViewer.refreshAll();
          documentViewer.updateView();
        });

        // ── Header ────────────────────────────────────────────────────────────
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

  // ── annotationChanged + fieldChanged ─────────────────────────────────────
  //
  // Re-sign fix explanation:
  //   After the user applies a signature Apryse fires annotationChanged first,
  //   then immediately sets field.flags ReadOnly = true in its own post-commit
  //   code. So clearing ReadOnly inside annotationChanged (even with setTimeout)
  //   gets overwritten.
  //
  //   `fieldChanged` fires AFTER Apryse finishes all its internal field updates.
  //   That is the only reliable place to clear the field-level ReadOnly and
  //   keep the widget clickable for re-signing.
  //
  useEffect(() => {
    if (!instance) return;
    const { annotationManager } = instance.Core;
    const currentUserID = getCurrentUserID();

    // Sync XFDF snapshot + re-apply annotation-level locks
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
      applyAnnotationLocks(annotationManager, annotations, currentUserID);
    };

    // Clear the field-level ReadOnly Apryse sets after committing a signature
    const fieldHandler = (field) => {
      try {
        const widgets = field.widgets ?? [];
        widgets.forEach((annot) => {
          const ownerID = getAnnotationOwnerID(annot);
          if (ownerID !== currentUserID) return;

          // This is the key line — clears Apryse's post-commit field lock
          field.flags.set("ReadOnly", false);

          annot.Locked = false;
          annot.ReadOnly = false;
          annot.NoResize = false;
          annot.NoMove = false;
          annot.NoRotate = false;

          annotationManager.updateAnnotation(annot);
          annotationManager.redrawAnnotation(annot);
        });
      } catch (err) {
        console.error("fieldChanged re-sign unlock:", err);
      }
    };

    annotationManager.addEventListener("annotationChanged", annotHandler);
    annotationManager.addEventListener("fieldChanged", fieldHandler);

    return () => {
      annotationManager.removeEventListener("annotationChanged", annotHandler);
      annotationManager.removeEventListener("fieldChanged", fieldHandler);
    };
  }, [instance]);

  // ── Participants change → refresh panel ──
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

      <Notification open={notification} setOpen={setNotification} />
    </>
  );
};

export default PendingSignatureViewer;
