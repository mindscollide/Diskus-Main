import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import WebViewer from "@pdftron/webviewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";

import {
  Notification,
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../components/elements/index";
import SendDocumentModal from "../SendDocumentModal/SendDocumentModal";

import PlusSignSignatureFlow from "../../../../assets/images/plus-sign-signatureflow.svg";
import DragIcon from "../../../../assets/images/DragIcon_SignatureFlow.png";
import DeleteIcon from "../../../../assets/images/Icon material-delete.svg";

import {
  getWorkFlowByWorkFlowIdwApi,
  saveWorkflowApi,
} from "../../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { getActorColorByUserID } from "../../../../commen/functions/converthextorgb";
import { generateBase64FromBlob } from "../../../../commen/functions/generateBase64FromBlob";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

// ─── Pure helpers (no component state) ──────────────────────────────────────

const containsNull = (arr) => arr.some((el) => el === null);

const getRemovedData = (oldArray, newArray) =>
  oldArray.filter((o) => !newArray.some((n) => n.userID === o.userID));

const base64ToBlob = (base64) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
};

const revertXmlField = (data) =>
  data.map((item) => {
    const xml = item.xmlField
      ? item.xmlField
          .split("_#_")
          .map((str) => {
            try {
              return JSON.parse(str);
            } catch {
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

const removeDeletedAnnotations = (xfdfString, deletedUsers) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xfdfString, "text/xml");

  deletedUsers.forEach(({ xml, userID }) => {
    (xml || []).forEach(({ ffield }) => {
      const match = ffield?.match(/name="([^"]+)"/);
      if (!match) return;
      const name = match[1];
      xmlDoc
        .querySelectorAll(`ffield[name="${name}"]`)
        .forEach((el) => el.parentNode?.removeChild(el));
      xmlDoc
        .querySelectorAll(`widget[field="${name}"]`)
        .forEach((el) => el.parentNode?.removeChild(el));
      xmlDoc
        .querySelectorAll(`fields field[name="${name}"]`)
        .forEach((el) => el.parentNode?.removeChild(el));
      xmlDoc
        .querySelectorAll(`annots [subject*="-${userID}"]`)
        .forEach((el) => el.parentNode?.removeChild(el));
    });
    xmlDoc
      .querySelectorAll(`freetext[subject*="-${userID}"]`)
      .forEach((el) => el.parentNode?.removeChild(el));
  });

  return new XMLSerializer().serializeToString(xmlDoc);
};

const buildBundleList = (signerList, pdfData, isOrdered) =>
  signerList.map((s, i) => {
    const bundle = {
      ID: `BundleID_#${i + 1}`,
      Title: "",
      BundleDeadline: "",
      ListOfUsers: [s.userID],
      Entity: { EntityID: pdfData.documentID, EntityTypeID: 1 },
    };
    if (isOrdered && i !== 0) {
      bundle.Dependency = {
        BundleID: `BundleID_#${i + 1}`,
        DependencyIDs: [`BundleID_#${i}`],
      };
    }
    return bundle;
  });

const filterAnnotationsAgainstXFDF = (userAnnotations, xfdfString) => {
  const parser = new DOMParser();
  const mainDoc = parser.parseFromString(xfdfString, "text/xml");
  const exists = (name, tag) =>
    mainDoc.querySelectorAll(`${tag}[name="${name}"]`).length > 0;

  return userAnnotations.map((user) => ({
    ...user,
    xml: user.xml.filter((item) => {
      const ffieldDoc = parser.parseFromString(item.ffield, "text/xml");
      const widgetDoc = parser.parseFromString(item.widget, "text/xml");
      const ffieldName = ffieldDoc.documentElement.getAttribute("name");
      const widgetName = widgetDoc.documentElement.getAttribute("name");
      return exists(ffieldName, "ffield") && exists(widgetName, "widget");
    }),
  }));
};

const convertAnnotationsForApi = (filtered) =>
  filtered.map((u) => ({
    ActorID: u.actorID,
    xmlList: u.xml.map((x) => JSON.stringify(x)),
  }));

// ─── Disabled UI elements list (static, defined once outside component) ─────

const DISABLED_ELEMENTS = [
  "freeTextToolButton",
  "stylePanel",
  "leftPanelButton",
  "underlineToolGroupButton",
  "textSelectButton",
  "toolbarGroup-FillAndSign",
  "toolbarGroup-Annotate",
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
  "searchButton",
  "freeTextToolGroupButton",
  "rubberStampToolGroupButton",
  "dateFreeTextToolButton",
  "eraserToolButton",
  "panToolButton",
  "signatureToolGroupButton",
  "signaturePanelButton",
  "contextMenuPopup",
  "colorPalette",
  "formFieldEditButton",
  "stylePanelToggle",
  "comboBoxFieldToolGroupButton",
  "listBoxFieldToolGroupButton",
  "outlinesPanelButton",
  "listBoxFieldButton",
  "comboBoxFieldButton",
  "indexPanelListToggle",
  "divider-0.8",
  "divider-0.7",
  "notesPanelToggle",
  "searchPanelToggle",
];

// ─── Component ───────────────────────────────────────────────────────────────

const SignatureViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { webViewer } = useSelector((s) => s);
  const { assignees } = useSelector((s) => s);
  const {
    getAllFieldsByWorkflowID,
    saveWorkFlowResponse,
    getWorkfFlowByFileId,
    ResponseMessage,
    getDataroomAnnotation,
  } = useSelector((s) => s.SignatureWorkFlowReducer);

  // Stable — only computed once
  const docWorkflowID = useMemo(
    () => new URLSearchParams(location.search).get("documentID"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ─── Viewer DOM ref ──────────────────────────────────────────────────────
  const viewerRef = useRef(null);

  /**
   * Guard: prevents WebViewer from being initialised more than once.
   * This is the root cause of the "stop re-rendering" issue — React strict-mode
   * and dependency-array changes were firing the effect multiple times.
   */
  const viewerInitialized = useRef(false);

  // ─── State ───────────────────────────────────────────────────────────────
  const [instance, setInstance] = useState(null);

  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
  const [signerData, setSignerData] = useState([]);
  const [userList, setUserList] = useState([]);

  const [userAnnotations, setUserAnnotations] = useState([]);
  const [annotationsColorRecord, setAnnotationsColorRecord] = useState([]);
  const [deletedDataTemp, setDeletedDataTemp] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [orderCheckBox, setOrderCheckbox] = useState(false);
  const [openAddParticipentModal, setOpenAddParticipentModal] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [sendModal, setSendModal] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [mailerInput, setMailerInput] = useState("");

  const [signerForm, setSignerForm] = useState({
    Name: "",
    EmailAddress: "",
    UserID: 0,
  });
  const [signerDropdown, setSignerDropdown] = useState({
    value: 0,
    label: "",
    name: "",
  });

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

  // ─── Mutable refs (read by WebViewer callbacks, never cause re-renders) ──
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfXfdfRef = useRef(pdfData.xfdfData);
  const participantsRef = useRef(participants);
  const annotationsColorRef = useRef(annotationsColorRecord);
  const orderCheckedRef = useRef(orderCheckBox);
  const pdfDataRef = useRef(pdfData);

  /**
   * Ref to the <select> element rendered inside the custom left panel.
   * We update it imperatively so we never have to tear down and recreate
   * the entire WebViewer panel when participants change.
   */
  const panelSelectRef = useRef(null);

  // ─── Sync state → refs ───────────────────────────────────────────────────
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
    pdfXfdfRef.current = pdfData.xfdfData;
  }, [pdfData.xfdfData]);
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);
  useEffect(() => {
    annotationsColorRef.current = annotationsColorRecord;
  }, [annotationsColorRecord]);
  useEffect(() => {
    orderCheckedRef.current = orderCheckBox;
  }, [orderCheckBox]);
  useEffect(() => {
    pdfDataRef.current = pdfData;
  }, [pdfData]);

  // ─── Initial data fetch (runs once) ─────────────────────────────────────
  useEffect(() => {
    if (!docWorkflowID) return;
    dispatch(
      getWorkFlowByWorkFlowIdwApi(
        { FileID: Number(docWorkflowID) },
        navigate,
        t,
      ),
    );
    dispatch(allAssignessList(navigate, t, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── getAllFieldsByWorkflowID ─────────────────────────────────────────────
  useEffect(() => {
    if (!getAllFieldsByWorkflowID) return;
    try {
      const { bundleDetails, listOfFields } =
        getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails;
      if (!bundleDetails.length) return;

      const mappedFields = bundleDetails.map((f) => ({
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
      }));
      // fieldsData is only used externally — keep setter if needed downstream
      // setFieldsData(mappedFields);

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
        setUserAnnotations(revertXmlField(listOfFields));
      }
    } catch (err) {
      console.error("getAllFieldsByWorkflowID handler:", err);
    }
  }, [getAllFieldsByWorkflowID, getWorkfFlowByFileId]);

  // ─── getWorkfFlowByFileId ────────────────────────────────────────────────
  useEffect(() => {
    if (!getWorkfFlowByFileId) return;
    try {
      const { bundleModels, workFlow } = getWorkfFlowByFileId.workFlow;

      if (bundleModels?.length) {
        const listOfUsers = [];
        const signersArr = [];
        const isOrdered = bundleModels.some((b) => b.dependencies?.length > 0);

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

        setOrderCheckbox(isOrdered);
        setSignerData(signersArr);
        setParticipants(listOfUsers);
        setLastParticipants(listOfUsers);
        setSelectedUser(listOfUsers[0]?.pk_UID ?? null);

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
      } else {
        // No participants yet — open the modal immediately
        setOpenAddParticipentModal(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWorkfFlowByFileId]);

  // ─── getDataroomAnnotation ───────────────────────────────────────────────
  useEffect(() => {
    if (!getDataroomAnnotation) return;
    const { annotationString, attachmentBlob } = getDataroomAnnotation;
    setPdfData((prev) => ({
      ...prev,
      xfdfData: annotationString ?? "",
      attachmentBlob: attachmentBlob ?? "",
    }));
    if (annotationString) {
      const doc = new DOMParser().parseFromString(annotationString, "text/xml");
      const names = [...doc.getElementsByTagName("ffield")]
        .map((n) => n.getAttribute("name"))
        .filter(Boolean);
      setAnnotationsColorRecord((prev) => [...new Set([...prev, ...names])]);
    }
  }, [getDataroomAnnotation]);

  // ─── saveWorkFlowResponse ────────────────────────────────────────────────
  useEffect(() => {
    if (!saveWorkFlowResponse) return;
    try {
      const { bundleModels } = saveWorkFlowResponse.workFlow;
      const listOfUsers = [];
      const signersArr = [];
      const selectedList = [];

      bundleModels.forEach((b) =>
        b.actors.forEach((a) => {
          listOfUsers.push({ name: a.name, pk_UID: a.pK_UID });
          signersArr.push({
            Name: a.name,
            EmailAddress: a.emailAddress,
            userID: a.pK_UID,
          });
          selectedList.push({
            xml:
              userAnnotationsRef.current.find((u) => u.userID === a.pK_UID)
                ?.xml ?? [],
            userID: a.pK_UID,
            actorID: a.fK_WorkFlowActor_ID,
            actorColor: a.actorColor,
          });
        }),
      );

      setDeletedDataTemp(
        getRemovedData(userAnnotationsRef.current, selectedList),
      );
      setSignerData(signersArr);
      setParticipants(listOfUsers);
      setSelectedUser(listOfUsers[0]?.pk_UID ?? null);
      setUserAnnotations(selectedList);
    } catch (err) {
      console.error("saveWorkFlowResponse handler:", err);
    }
  }, [saveWorkFlowResponse]);

  // ─── Notification from ResponseMessage ──────────────────────────────────
  useEffect(() => {
    if (ResponseMessage)
      showMessage(ResponseMessage, "success", setNotification);
  }, [ResponseMessage]);

  // ─── Assignees → Select options ──────────────────────────────────────────
  useEffect(() => {
    if (!assignees.user?.length) return;
    setUserList(
      assignees.user.map((u) => ({
        label: (
          <Row>
            <Col lg={12} className="d-flex gap-2 align-items-center">
              <img
                src={`data:image/jpeg;base64,${u.displayProfilePictureName}`}
                height="16px"
                width="18px"
                draggable="false"
                alt=""
              />
              <span>{u.name}</span>
            </Col>
          </Row>
        ),
        value: u.pK_UID,
        name: u.name,
        email: u.emailAddress,
      })),
    );
  }, [assignees.user]);

  // ─── Imperatively update the panel <select> when participants change ─────
  //
  // Instead of destroying/recreating the WebViewer panel (which caused the
  // re-render problem), we hold a DOM ref to the <select> and patch it directly.
  //
  useEffect(() => {
    const select = panelSelectRef.current;
    if (!select || !participants.length) return;

    const previousValue = select.value;

    // Rebuild options
    select.innerHTML = "";
    participants.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = String(u.pk_UID);
      opt.textContent = u.name;
      select.appendChild(opt);
    });

    // Keep the previously selected user if still in the list
    const stillPresent = participants.some(
      (p) => String(p.pk_UID) === previousValue,
    );
    if (stillPresent) {
      select.value = previousValue;
    } else {
      const firstId = participants[0].pk_UID;
      select.value = String(firstId);
      setSelectedUser(firstId);
      selectedUserRef.current = firstId;
    }
  }, [participants]);

  // ─── Handle deleted participants — strip their annotations from the doc ──
  useEffect(() => {
    if (!instance || !participants.length) return;

    const removed = lastParticipants.filter(
      (lp) => !participants.some((p) => p.pk_UID === lp.pk_UID),
    );
    setLastParticipants(participants);
    if (!removed.length) return;

    (async () => {
      const { annotationManager } = instance.Core;
      const xfdf = await annotationManager.exportAnnotations();
      const modified = removeDeletedAnnotations(xfdf, deletedDataTemp);
      annotationManager.deleteAnnotations(
        annotationManager.getAnnotationsList(),
      );
      try {
        await annotationManager.importAnnotations(modified);
        annotationManager.redrawAnnotation();
      } catch (err) {
        console.error("removeDeletedAnnotations:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants]);

  // ─── Build API payload (reads only from refs — no state reads) ───────────
  const collectPayload = useCallback(async () => {
    if (!instance) return null;
    const { annotationManager, documentViewer } = instance.Core;
    const doc = documentViewer.getDocument();
    const data = await doc.getFileData({});
    const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });
    const base64 = await generateBase64FromBlob(blob);
    const xfdfString = await annotationManager.exportAnnotations();
    const filtered = filterAnnotationsAgainstXFDF(
      userAnnotationsRef.current,
      xfdfString,
    );

    return {
      xfdfString,
      filtered,
      base64,
      saveWorkFlowData: {
        PK_WorkFlow_ID: pdfDataRef.current.workFlowID,
        WorkFlowTitle: pdfDataRef.current.title,
        Description: pdfDataRef.current.description,
        isDeadline: pdfDataRef.current.isDeadline,
        DeadlineDateTime: pdfDataRef.current.isDeadline
          ? pdfDataRef.current.deadlineDatetime
          : "",
        CreatorID: pdfDataRef.current.creatorID,
        ListOfActionAbleBundle: buildBundleList(
          signerDataRef.current,
          pdfDataRef.current,
          orderCheckedRef.current,
        ),
      },
      newData: { ActorsFieldValuesList: convertAnnotationsForApi(filtered) },
      addAnnotationPayload: {
        FileID: Number(docWorkflowID),
        AnnotationString: xfdfString,
      },
      saveSignatureDocPayload: {
        FileID: Number(docWorkflowID),
        base64File: base64,
      },
    };
  }, [instance, docWorkflowID]);

  // ─── Validation: every participant must have ≥ 1 annotation for Send ─────
  const validateBeforeSend = useCallback(() => {
    const annotations = userAnnotationsRef.current;
    if (!annotations.length) return false;
    return annotations.every((u) => u.xml && u.xml.length > 0);
  }, []);

  // ─── Action handlers ─────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    console.log("handleSave");
    const payload = await collectPayload();
    console.log("handleSave", payload);

    if (!payload) return;
    dispatch(
      saveWorkflowApi(
        payload.saveWorkFlowData,
        navigate,
        t,
        setOpenAddParticipentModal,
        1,
        payload.newData,
        payload.addAnnotationPayload,
        payload.saveSignatureDocPayload,
        1,
      ),
    );
  }, [collectPayload, dispatch, navigate, t]);

  const handleSendClick = useCallback(() => {
    if (!validateBeforeSend()) {
      showMessage(
        t("All-participants-must-have-at-least-one-field-assigned"),
        "error",
        setNotification,
      );
      return;
    }
    setSendModal(true);
  }, [validateBeforeSend, t]);

  const handlePublish = useCallback(async () => {
    const payload = await collectPayload();
    if (!payload) return;
    dispatch(
      saveWorkflowApi(
        payload.saveWorkFlowData,
        navigate,
        t,
        setOpenAddParticipentModal,
        1,
        payload.newData,
        payload.addAnnotationPayload,
        payload.saveSignatureDocPayload,
        2,
        {
          PK_WorkFlow_ID: pdfDataRef.current.workFlowID,
          FinalDocumentName: pdfDataRef.current.title,
          Message: sendMessage,
          ListOfViewers: [],
        },
      ),
    );
  }, [collectPayload, dispatch, navigate, sendMessage, t]);

  // ─── WebViewer initialisation ────────────────────────────────────────────
  //
  // Guarded by `viewerInitialized` ref so this block runs EXACTLY ONCE even
  // if React re-renders or StrictMode double-invokes effects.
  //
  useEffect(() => {
    if (!pdfData.attachmentBlob || !viewerRef.current) return;
    if (viewerInitialized.current) return; // ← the key guard
    viewerInitialized.current = true;

    WebViewer(
      {
        path: "/webviewer/lib",
        fullAPI: true,
        licenseKey: process.env.REACT_APP_APRYSEKEY,
      },
      viewerRef.current,
    ).then((inst) => {
      setInstance(inst);
      const { UI, Core } = inst;
      const { documentViewer, annotationManager, Annotations } = Core;

      UI.loadDocument(base64ToBlob(pdfData.attachmentBlob), {
        filename: pdfData.title,
      });
      UI.disableElements(DISABLED_ELEMENTS);

      // ─── Color helper ──────────────────────────────────────────────────
      const applyActorColour = (ann, r, g, b) => {
        const color = new Annotations.Color(r, g, b);
        if (ann instanceof Annotations.FreeTextAnnotation) {
          ann.StrokeColor = color;
          ann.StrokeThickness = 2;
        } else if (ann instanceof Annotations.WidgetAnnotation) {
          ann.StrokeColor = color;
          ann.Color = color;
          ann.StrokeThickness = 1.5;
          const field = ann.getField?.();
          if (field) {
            if (!field.Border) field.Border = {};
            field.Border.color = color;
            field.Border.style = "solid";
            field.Border.width = 1.5;
          }
        } else {
          ann.StrokeColor = color;
          ann.Color = color;
        }
        ann.isNew = false;
        annotationManager.updateAnnotation(ann);
        annotationManager.redrawAnnotation(ann);
      };

      // ─── Header buttons ────────────────────────────────────────────────
      const cancelButton = new UI.Components.CustomButton({
        dataElement: "cancelButton",
        label: t("Cancel"),
        title: t("Cancel"),
        onClick: () => window.close(),
        style: {
          background: "#fff",
          border: "1px solid #e1e1e1",
          color: "#5a5a5a",
          padding: "8px 30px",
          borderRadius: "4px",
        },
      });

      const saveButton = new UI.Components.CustomButton({
        dataElement: "saveButton",
        label: t("Save"),
        title: t("Save"),
        // Reads handleSave through a stable closure — no re-init needed
        onClick: () => handleSave(),
        style: {
          background: "#fff",
          border: "1px solid #e1e1e1",
          color: "#5a5a5a",
          padding: "8px 30px",
          borderRadius: "4px",
          marginLeft: "10px",
        },
      });

      const publishButton = new UI.Components.CustomButton({
        dataElement: "publishButton",
        label: t("Send"),
        title: t("Send"),
        // Reads handleSendClick through a stable closure — validation runs at call time
        onClick: () => handleSendClick(),
        style: {
          background: "#6172d6",
          border: "1px solid #6172d6",
          color: "#fff",
          padding: "8px 30px",
          borderRadius: "4px",
          marginLeft: "10px",
        },
      });

      // ─── Custom left panel ─────────────────────────────────────────────
      //
      // The panel is built ONCE.  Participant changes later are handled by
      // patching the <select> via panelSelectRef — no panel teardown needed.
      //
      const customPanelToggle = new UI.Components.ToggleElementButton({
        dataElement: "customPanelToggle",
        toggleElement: "customPanel",
        img: "icon-header-sidebar-line",
        title: "Participants",
      });

      const addFreetextAnnotation = (label) => {
        const { r, g, b } = getActorColorByUserID(
          selectedUserRef.current,
          userAnnotationsRef,
        );
        const ann = new Annotations.FreeTextAnnotation();
        ann.PageNumber = documentViewer.getCurrentPage();
        ann.X = 100;
        ann.Y = 100;
        ann.Width = 200;
        ann.Height = 50;
        ann.TextAlign = "center";
        ann.TextVerticalAlign = "center";
        ann.setContents(label);
        ann.Intent = Annotations.FreeTextAnnotation.Intent.FreeText;
        ann.Subject = `${label}-${selectedUserRef.current}`;
        ann.StrokeColor = new Annotations.Color(r, g, b);
        ann.StrokeThickness = 2;
        ann.StrokeStyle = "solid";
        annotationManager.addAnnotation(ann);
        annotationManager.redrawAnnotation(ann);
      };

      const renderCustomPanel = () => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "padding:12px; font-family:sans-serif;";

        // Participant label
        const label = document.createElement("label");
        label.textContent = t("Participant");
        label.style.cssText =
          "display:block; margin-bottom:4px; font-size:13px; font-weight:600;";
        wrapper.appendChild(label);

        // Participant <select>
        const select = document.createElement("select");
        select.style.cssText =
          "width:100%; padding:10px 6px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px;";

        // Seed with current participants (may be empty on first render)
        participantsRef.current.forEach((u) => {
          const opt = document.createElement("option");
          opt.value = String(u.pk_UID);
          opt.textContent = u.name;
          select.appendChild(opt);
        });

        select.addEventListener("change", (e) => {
          const id = Number(e.target.value);
          setSelectedUser(id);
          selectedUserRef.current = id;
        });

        // Store ref so we can update participants without rebuilding the panel
        panelSelectRef.current = select;
        wrapper.appendChild(select);

        // Add signatories button
        const addBtn = document.createElement("button");
        addBtn.textContent = t("Add-Signaturies");
        addBtn.style.cssText =
          "width:100%; padding:10px; margin-bottom:12px; background:#6172d6; color:#fff; border:none; border-radius:4px; cursor:pointer;";
        addBtn.addEventListener("click", () =>
          setOpenAddParticipentModal(true),
        );
        wrapper.appendChild(addBtn);

        // Label field buttons
        const row = document.createElement("div");
        row.style.cssText = "display:flex; gap:8px;";
        ["Title", "Name", "Email"].forEach((lbl) => {
          const btn = document.createElement("button");
          btn.textContent = t(lbl);
          btn.style.cssText =
            "flex:1; padding:6px 4px; background:#fff; border:1px solid #e1e1e1; border-radius:4px; cursor:pointer; font-size:12px;";
          btn.addEventListener("click", () => addFreetextAnnotation(lbl));
          row.appendChild(btn);
        });
        wrapper.appendChild(row);

        return wrapper;
      };

      UI.addPanel({
        dataElement: "customPanel",
        location: "left",
        render: renderCustomPanel,
      });

      // ─── Header layout ─────────────────────────────────────────────────
      const topHeader = UI.getModularHeader("default-top-header");
      const existingItems = topHeader.getItems();

      const actionButtonsGroup = new UI.Components.GroupedItems({
        dataElement: "signatureFlowActionButtons",
        grow: 0,
        gap: 8,
        position: "end",
        alwaysVisible: true,
        items: [cancelButton, saveButton, publishButton],
      });

      topHeader.setItems([
        customPanelToggle,
        ...existingItems,
        actionButtonsGroup,
      ]);
      UI.setActiveLeftPanel("customPanel");

      // ─── Document loaded ───────────────────────────────────────────────
      documentViewer.addEventListener("documentLoaded", async () => {
        UI.setFitMode(UI.FitMode.FitWidth);
        if (pdfXfdfRef.current) {
          try {
            await annotationManager.importAnnotations(pdfXfdfRef.current);
          } catch (err) {
            console.error("importAnnotations:", err);
          }
        }
      });

      // ─── Annotation changed ────────────────────────────────────────────
      annotationManager.addEventListener(
        "annotationChanged",
        async (annotations, action, { imported }) => {
          if (imported) return;
          if (action !== "add" && action !== "modify") return;

          try {
            const { r, g, b } = getActorColorByUserID(
              selectedUserRef.current,
              userAnnotationsRef,
            );

            annotations.forEach((ann) => {
              const fieldName = ann.ij?.["trn-form-field-name"];
              const alreadyColoured =
                fieldName && annotationsColorRef.current.includes(fieldName);

              if (!alreadyColoured) {
                if (fieldName) {
                  setAnnotationsColorRecord((prev) => [
                    ...new Set([...prev, fieldName]),
                  ]);
                  annotationsColorRef.current = [
                    ...new Set([...annotationsColorRef.current, fieldName]),
                  ];
                }
                applyActorColour(ann, r, g, b);
              }
            });
          } catch (err) {
            console.error("annotation colour update:", err);
          }

          const xfdfString = await annotationManager.exportAnnotations();
          const snapshot = userAnnotationsRef.current.map((u) => ({
            ...u,
            xml: [...u.xml],
          }));
          mergeXFDFIntoAnnotations(
            xfdfString,
            selectedUserRef.current,
            snapshot,
          );
          setUserAnnotations(snapshot);
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfData.attachmentBlob]); // init once — guard ref prevents double run

  // ─── Modal helpers ────────────────────────────────────────────────────────

  const filterFunc = useCallback(
    (option, searchText) =>
      option.data.name.toLowerCase().includes(searchText.toLowerCase()),
    [],
  );

  const resetSignerForm = useCallback(() => {
    setSignerForm({ Name: "", EmailAddress: "", UserID: 0 });
    setSignerDropdown({ value: 0, label: "", name: "" });
  }, []);

  const handleSignerDropdownChange = useCallback((val) => {
    setSignerDropdown(val);
    setSignerForm({
      Name: val.name,
      EmailAddress: val.email,
      UserID: val.value,
    });
  }, []);

  const handleAddSigner = useCallback(() => {
    const { EmailAddress, Name, UserID } = signerForm;
    if (!EmailAddress || !Name) return;
    const alreadyExists = signerData.some(
      (d) => d.EmailAddress.toLowerCase() === EmailAddress.toLowerCase(),
    );
    if (alreadyExists) {
      showMessage(t("User-already-is-in-list"), "error", setNotification);
    } else {
      setSignerData((prev) => [
        ...prev,
        { Name, EmailAddress, userID: UserID },
      ]);
    }
    resetSignerForm();
  }, [signerForm, signerData, t, resetSignerForm]);

  const handleRemoveSigner = useCallback(
    (index) => setSignerData((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setSignerData((prev) => {
      const items = [...prev];
      const [moved] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, moved);
      return items;
    });
  }, []);

  const handleModalClose = useCallback(() => {
    if (participantsRef.current?.length > 0) {
      setOpenAddParticipentModal(false);
      resetSignerForm();
    } else {
      window.close();
    }
  }, [resetSignerForm]);

  const handleSaveSigners = useCallback(async () => {
    if (!signerData.length) {
      showMessage(
        t("Atleast-one-signatory-is-required"),
        "error",
        setNotification,
      );
      return;
    }
    const payload = {
      PK_WorkFlow_ID: pdfDataRef.current.workFlowID,
      WorkFlowTitle: pdfDataRef.current.title,
      Description: pdfDataRef.current.description,
      isDeadline: pdfDataRef.current.isDeadline,
      DeadlineDateTime: pdfDataRef.current.isDeadline
        ? pdfDataRef.current.deadlineDatetime
        : "",
      CreatorID: pdfDataRef.current.creatorID,
      ListOfActionAbleBundle: buildBundleList(
        signerData,
        pdfDataRef.current,
        orderCheckBox,
      ),
    };
    resetSignerForm();
    dispatch(saveWorkflowApi(payload, navigate, t, setOpenAddParticipentModal));
  }, [signerData, orderCheckBox, dispatch, navigate, t, resetSignerForm]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* WebViewer container — must never unmount */}
      <div style={{ height: "100vh", width: "100%" }}>
        <div ref={viewerRef} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Add/Edit participants modal */}
      <Modal
        show={openAddParticipentModal}
        onHide={handleModalClose}
        setShow={setOpenAddParticipentModal}
        centered
        closeButton
        size="md"
        modalFooterClassName="d-block"
        modalBodyClassName="Signers_modal_body"
        modalHeaderClassName="Signers_modal_header"
        ModalBody={
          <Row className="mb-1">
            <Col lg={12}>
              <span className="Signers_heading">{t("Signers")}</span>
            </Col>
            <Col lg={12} className="mt-4 mb-3">
              <span className="Signers_tagLine">
                {t("Add-the-people-who-need-to-sign-this-document")}
              </span>
            </Col>

            {/* Add new signer row */}
            <Col lg={12}>
              <Row>
                <Col sm={6}>
                  <p className="pb-1 m-0 inputlabel_style">{t("Name")}</p>
                  <Select
                    placeholder={t("Name")}
                    onChange={handleSignerDropdownChange}
                    options={userList}
                    filterOption={filterFunc}
                    value={signerDropdown.value !== 0 ? signerDropdown : null}
                  />
                </Col>
                <Col sm={6}>
                  <TextField
                    width="100%"
                    name="EmailAddress"
                    type="email"
                    disable
                    labelclass="inputlabel_style"
                    applyClass="signatureflow_input"
                    placeholder={t("Email")}
                    value={signerForm.EmailAddress}
                    label="Email"
                  />
                </Col>
              </Row>

              {/* Draggable signer list */}
              <Row className="d-flex align-items-center">
                <Col sm={12} className="signersList">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="signers">
                      {(provided) => (
                        <Row
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {signerData.map((signer, index) => (
                            <Draggable
                              key={index}
                              draggableId={String(index)}
                              index={index}
                            >
                              {(prov) => (
                                <>
                                  <Col
                                    sm={1}
                                    className="my-1 d-flex align-items-end mb-2"
                                  >
                                    <img
                                      alt="drag"
                                      src={DragIcon}
                                      width={20}
                                      ref={prov.innerRef}
                                      {...prov.draggableProps}
                                      {...prov.dragHandleProps}
                                    />
                                  </Col>
                                  <Col sm={10} className="my-1">
                                    <Row>
                                      <Col sm={6}>
                                        <TextField
                                          width="100%"
                                          name="Name"
                                          type="text"
                                          disable
                                          labelclass="inputlabel_style"
                                          applyClass="signatureflow_input"
                                          placeholder={t("Name")}
                                          value={signer.Name}
                                          label="Name"
                                        />
                                      </Col>
                                      <Col sm={6}>
                                        <TextField
                                          width="100%"
                                          name="EmailAddress"
                                          type="email"
                                          disable
                                          labelclass="inputlabel_style"
                                          applyClass="signatureflow_input"
                                          placeholder={t("Email")}
                                          value={signer.EmailAddress}
                                          label="Email"
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col
                                    sm={1}
                                    className="my-1 d-flex align-items-end mb-3"
                                  >
                                    <img
                                      alt="delete"
                                      src={DeleteIcon}
                                      className="cursor-pointer"
                                      width={20}
                                      onClick={() => handleRemoveSigner(index)}
                                    />
                                  </Col>
                                </>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Row>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Col>
              </Row>

              {/* Add another signer */}
              <Col lg={12}>
                <Button
                  className="addOther_field"
                  text={t("Add-another-signer")}
                  onClick={handleAddSigner}
                  icon={<img src={PlusSignSignatureFlow} alt="" />}
                />
              </Col>
            </Col>
          </Row>
        }
        ModalFooter={
          <Row>
            <Col sm={6} className="d-flex justify-content-start px-0">
              <Checkbox
                label2={t("Set-signer-order")}
                checked={orderCheckBox}
                onChange={(e) => {
                  setOrderCheckbox(e.target.checked);
                  orderCheckedRef.current = e.target.checked;
                }}
                classNameDiv="d-flex gap-2"
              />
            </Col>
            <Col sm={6} className="d-flex justify-content-end gap-2 px-0">
              <Button
                className="CancelBtn"
                text={
                  participantsRef.current?.length > 0 ? t("Cancel") : t("Close")
                }
                onClick={handleModalClose}
              />
              <Button
                className="Add"
                text={t("Save")}
                onClick={handleSaveSigners}
              />
            </Col>
          </Row>
        }
      />

      <Notification open={notification} setOpen={setNotification} />

      {sendModal && (
        <SendDocumentModal
          sendDocumentModal={sendModal}
          setSendDocumentModal={setSendModal}
          handleClickSendDocument={handlePublish}
          signersData={signerDataRef}
          setMailerInput={setMailerInput}
          mailerInput={mailerInput}
          setSendMessage={setSendMessage}
          sendMessage={sendMessage}
          pdfResponceData={pdfData}
          setPdfResponceData={setPdfData}
        />
      )}
    </>
  );
};

export default SignatureViewer;
