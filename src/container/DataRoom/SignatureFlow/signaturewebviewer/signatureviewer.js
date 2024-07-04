import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./signaturewebviewer.css";
import PlusSignSignatureFlow from "../../../../assets/images/plus-sign-signatureflow.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIcon from "../../../../assets/images/DragIcon_SignatureFlow.png";
import {
  ClearMessageAnnotations,
  GetAnnotationsOfToDoAttachementMessageCleare,
  addAnnotationsOnDataroomAttachement,
  addAnnotationsOnNotesAttachement,
  addAnnotationsOnResolutionAttachement,
  addAnnotationsOnToDoAttachement,
  getAnnotationsOfDataroomAttachement,
  getAnnotationsOfNotesAttachement,
  getAnnotationsOfResolutionAttachement,
  getAnnotationsOfToDoAttachement,
  setUserAnnotation,
} from "../../../../store/actions/webVieverApi_actions";

import { useTranslation } from "react-i18next";
import {
  Notification,
  Loader,
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../components/elements/index";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../../assets/images/Icon material-delete.svg";
import Select from "react-select";
import {
  clearWorkFlowResponseMessage,
  getWorkFlowByWorkFlowIdwApi,
  saveWorkflowApi,
} from "../../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
const SignatureViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { webViewer } = useSelector((state) => state);
  const {
    getAllFieldsByWorkflowID,
    saveWorkFlowResponse,
    getWorkfFlowByFileId,
    Loading,
    ResponseMessage,
    getDataroomAnnotation,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  // Parse the URL parameters to get the data
  const docWorkflowID = new URLSearchParams(location.search).get("documentID");
  const { assignees } = useSelector((state) => state);
  const [Instance, setInstance] = useState(null);
  const viewer = useRef(null);
  const [userList, setUserList] = useState([]);
  const [signerData, setSignerData] = useState([]);
  console.log(signerData, "signerDatasignerDatasignerData");
  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
  const [FieldsData, setFieldsData] = useState([]);
  const [openAddParticipentModal, setOpenAddParticipentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderCheckBox, setOrderCheckbox] = useState(false);
  const [signers, setSigners] = useState({
    Name: "",
    EmailAddress: "",
    UserID: 0,
  });
  const [signerUserData, setSingerUserData] = useState({
    value: 0,
    label: "",
    name: "",
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [pdfResponceData, setPdfResponceData] = useState({
    xfdfData: "",
    attachmentBlob: "",
    removedAnnotations: "",
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
  console.log(pdfResponceData, "pdfResponceDatapdfResponceData");
  // { userID: "user1", xml: [] }
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [deletedDataTem, setTeletedDataTem] = useState([]);
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const participantsRef = useRef(participants);
  console.log(
    selectedUserRef,
    participantsRef,
    "selectedUserRefselectedUserRef"
  );
  // ===== this use for current state update get =====//
  // Ensure the ref stays in sync with the state
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    userAnnotationsRef.current = userAnnotations;
  }, [userAnnotations]);

  useEffect(() => {
    pdfResponceDataRef.current = pdfResponceData.xfdfData;
  }, [pdfResponceData]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);
  // === End === //

  // === Api calling === //
  async function apiCall(Data) {
    await dispatch(allAssignessList(navigate, t));
    await dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t));
  }
  useEffect(() => {
    const fetchData = async () => {
      if (docWorkflowID !== null && docWorkflowID !== undefined) {
        let Data = {
          FileID: Number(docWorkflowID),
        };
        apiCall(Data);
      }
    };

    fetchData();
  }, []);
  // === End === //

  // === this is responce of GetAllFieldsByWorkFlowID ===//
  useEffect(() => {
    if (getAllFieldsByWorkflowID !== null) {
      try {
        let newFieldsData = [];
        let revertedData;
        if (
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails
            .length > 0
        ) {
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails.forEach(
            (fieldsData) => {
              newFieldsData.push({
                pK_WorkFlowActionableBundle_ID:
                  fieldsData.pK_WorkFlowActionableBundle_ID,
                titles: fieldsData.titles,
                bundleDeadline: fieldsData.bundleDeadline,
                fK_ActionAbleBundleStatusState:
                  fieldsData.fK_ActionAbleBundleStatusState,
                bundleAssignedDate: fieldsData.bundleAssignedDate,
                bundleDependenceID: fieldsData.bundleDependenceID,
                actor_ID: fieldsData.actor_ID,
                userID: fieldsData.userID,
                actorName: fieldsData.actorName,
                actorDesignation: fieldsData.actorDesignation,
                actorEmail: fieldsData.actorEmail,
                actorColor: fieldsData.actorColor,
              });
            }
          );
          function revert(data) {
            return data.map((item) => {
              const xmlField = item?.xmlField
                .split("_#_")
                .map((str) => JSON.parse(str));
              return {
                actorID: item.actorID,
                userID: item.userID,
                actorColor: item.actorColor,
                xml: xmlField,
              };
            });
          }

          revertedData = revert(
            getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.listOfFields
          );
          console.log(revertedData, "revertedData");
          setUserAnnotations(revertedData);
          setFieldsData(newFieldsData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [getAllFieldsByWorkflowID]);
  // === End === //

  // === Get Workflow by FileID Api responce Update Also trigger when FieldsDatavalues update its contain color of users===//
  useEffect(() => {
    if (getWorkfFlowByFileId !== null && getWorkfFlowByFileId !== undefined) {
      try {
        let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;
        if (bundleModels?.length > 0) {
          let listOfUsers = [];
          let signersData = [];
          bundleModels.forEach((users, index) => {
            users.actors.forEach((usersData, index) => {
              listOfUsers.push({
                name: usersData.name,
                pk_UID: usersData.pK_UID,
              });
              signersData.push({
                Name: usersData.name,
                EmailAddress: usersData.emailAddress,
                userID: usersData.pK_UID,
              });
            });
          });
          setSignerData(signersData);
          setParticipants(listOfUsers);
          setLastParticipants(listOfUsers);
          setSelectedUser(listOfUsers[0].pk_UID);
        } else {
          setOpenAddParticipentModal(true);
        }

        setPdfResponceData((prevData) => ({
          ...prevData,
          xfdfData: "",
          attachmentBlob: webViewer.attachmentBlob,
          removedAnnotations: "",
          workFlowID: getWorkfFlowByFileId?.workFlow?.workFlow.pK_WorkFlow_ID,
          documentID: Number(docWorkflowID),
          title: getWorkfFlowByFileId?.workFlow?.workFlow.title,
          description: getWorkfFlowByFileId?.workFlow?.workFlow.description,
          creationDateTime:
            getWorkfFlowByFileId?.workFlow?.workFlow.creationDateTime,
          isDeadline: getWorkfFlowByFileId?.workFlow?.workFlow.isDeadline,
          deadlineDatetime:
            getWorkfFlowByFileId?.workFlow?.workFlow.deadlineDatetime,
          creatorID: getWorkfFlowByFileId?.workFlow?.workFlow.creatorID,
          isCreator: getWorkfFlowByFileId?.workFlow?.workFlow.isCreator,
        }));
      } catch (error) {}
    }
  }, [getWorkfFlowByFileId, FieldsData]);
  // === End === //

  // === Get  the file details by Id from API and Set it === //
  useEffect(() => {
    if (getDataroomAnnotation !== null && getDataroomAnnotation !== undefined) {
      setPdfResponceData((prevData) => ({
        ...prevData,
        xfdfData: getDataroomAnnotation.annotationString,
        attachmentBlob: getDataroomAnnotation.attachmentBlob,
        removedAnnotations: "",
      }));
    }
  }, [getDataroomAnnotation]);
  // === End === //

  // this is used for find pervious deleted data so we can delete it from our state and xfdf
  function getRemovedData(oldArray, newArray) {
    const removedData = [];

    // Iterate over each object in the old array
    for (const oldItem of oldArray) {
      let found = false;

      // Check if the userID exists in the new array
      for (const newItem of newArray) {
        if (oldItem.userID === newItem.userID) {
          found = true;
          break;
        }
      }

      // If userID not found in new array, add it to removedData
      if (!found) {
        removedData.push(oldItem);
      }
    }

    return removedData;
  }

  //=== Save Workflow Api Response Update ===//
  useEffect(() => {
    try {
      if (saveWorkFlowResponse !== null) {
        let getUsers = saveWorkFlowResponse.workFlow;
        let listOfUsers = [];
        let selectedUserList = [];
        let signersData = [];

        const extractXML = (ID) => {
          const xmlData = userAnnotations.find(
            (userAnnotData) => Number(userAnnotData?.userID) === Number(ID)
          );

          if (xmlData) {
            return xmlData.xml;
          } else {
            return []; // or any appropriate default value if no XML data is found
          }
        };

        getUsers.bundleModels.forEach((users, index) => {
          users.actors.forEach((usersData, index) => {
            // Find matching user in FieldsData to get actorColor
            const fieldData = FieldsData.find(
              (field) => field.userID === usersData.pK_UID
            );

            listOfUsers.push({
              name: usersData.name,
              pk_UID: usersData?.pK_UID,
            });
            signersData.push({
              Name: usersData.name,
              EmailAddress: usersData.emailAddress,
              userID: usersData?.pK_UID,
            });
            selectedUserList.push({
              xml: extractXML(usersData?.pK_UID),
              userID: usersData?.pK_UID,
              actorID: usersData?.fK_WorkFlowActor_ID,
              actorColor: fieldData ? fieldData.actorColor : "#000000",
            });
          });
        });
        setSignerData(signersData);
        setParticipants(listOfUsers);

        let deletedData = getRemovedData(userAnnotations, selectedUserList);
        setTeletedDataTem(deletedData);
        setSelectedUser(listOfUsers[0]?.pk_UID);
        setUserAnnotations(selectedUserList);
      } else {
      }
    } catch (error) {}
  }, [saveWorkFlowResponse]);
  // === End === //

  //===  this is for covert blob file ===//
  function handleBlobFiles(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: "application/pdf" });
  }
  // ==== End ===//

  // this will generate my xfdf files for user base and send into AddUpdateFieldValue
  const updateXFDF = (action, xmlString, userSelectID, userAnnotations) => {
    try {
      let userSelect = parseInt(userSelectID);
      // Iterate over each user's annotations
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      console.log(xmlDoc, "xmlDocxmlDocxmlDoc");
      xmlDoc.querySelectorAll("widget").forEach((widget) => {
        const widgetName = widget.getAttribute("name");
        const ffieldName = widget.getAttribute("field");
        let widgetFound = false;
        userAnnotations.forEach((user) => {
          user.xml.forEach((xml) => {
            if (xml.widget.includes(widgetName)) {
              // Replace the ffield and widget with new values from the main XML
              const ffieldElement = xmlDoc.querySelector(
                `ffield[name="${ffieldName}"]`
              );
              const widgetElement = widget;
              if (ffieldElement && widgetElement) {
                // Only access outerHTML if elements are not null
                xml.ffield = ffieldElement.outerHTML;
                xml.widget = widgetElement.outerHTML;
                widgetFound = true;
              } else {
                console.log("Element not found:", ffieldName, widgetName);
              }
            }
          });
        });
        // If the widget was not found in userAnnotations, add it
        if (!widgetFound) {
          userAnnotations.forEach((user) => {
            if (user.userID === userSelect) {
              // Assuming you want to add to the current user's annotations
              user.xml.push({
                ffield: xmlDoc.querySelector(`ffield[name="${ffieldName}"]`)
                  .outerHTML,
                widget: widget.outerHTML,
              });
            }
          });
        }
      });
      // Update the state with the modified userAnnotations
      setUserAnnotations(userAnnotations);
      // }
    } catch (error) {
      console.log("userAnnotations", error);
    }
  };
  console.log("saveWorkFlowData", userAnnotations);

  // === its triger when whe update blob file in our local state ===/
  useEffect(() => {
    if (pdfResponceData.attachmentBlob !== "") {
      WebViewer(
        {
          path: "/webviewer/lib",
          showLocalFilePicker: true,
          fullAPI: true,
          licenseKey:
            "1693909073058:7c3553ec030000000025c35b7559d8f130f298d30d4b45c2bfd67217fd", // sign up to get a free trial key at https://dev.apryse.com
        },

        viewer.current
      ).then(async (instance) => {
        setInstance(instance);
        instance.UI.loadDocument(
          handleBlobFiles(pdfResponceData.attachmentBlob),
          {
            filename: pdfResponceData.title,
          }
        );

        const { documentViewer, annotationManager, Annotations, Tools } =
          instance.Core;
 
        //======================================== disable header =====================================//
        instance.UI.disableTools([Tools.disableTextSelection]);
        instance.UI.disableElements([
          "underlineToolGroupButton",
          "textSelectButton",
          "textSelectButtonGroup",
          "textSelectButtonGroupButton",
          "textPopup ",
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
          "underlineToolGroupButton",
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
        ]);
        //======================================== disable header =====================================//

        //======================================== for cutome side bar =====================================//
        const handleChangeUser = (event) => {
          const newSelectedUser = Number(event.target.value);
          setSelectedUser(newSelectedUser);
          selectedUserRef.current = newSelectedUser; // Update the ref
        };
        const openCustomModal = () => {
          setOpenAddParticipentModal(true); // Open the custom modal
        };

        const handleClickTItle = () => {
          const annotation = new Annotations.FreeTextAnnotation();
          annotation.PageNumber = documentViewer.getCurrentPage();
          annotation.X = 100;
          annotation.Y = 100;
          annotation.Width = 200;
          annotation.Height = 50;
          annotation.TextAlign = "center";
          annotation.TextVerticalAlign = "center";
          annotation.Intent = Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
          annotation.Subject = `Title-${selectedUserRef.current}`;

          // Add the annotation to the document
          annotationManager.addAnnotation(annotation);
          annotationManager.redrawAnnotation(annotation);
        };

        const handleClickName = () => {
          const annotation = new Annotations.FreeTextAnnotation();
          annotation.PageNumber = documentViewer.getCurrentPage();
          annotation.X = 100;
          annotation.Y = 100;
          annotation.Width = 200;
          annotation.Height = 50;
          annotation.TextAlign = "center";
          annotation.TextVerticalAlign = "center";
          annotation.Intent = Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
          annotation.Subject = `Name-${selectedUserRef.current}`;

          // Add the annotation to the document
          annotationManager.addAnnotation(annotation);
          annotationManager.redrawAnnotation(annotation);
        };

        const handleClickEmail = () => {
          const annotation = new Annotations.FreeTextAnnotation();
          annotation.PageNumber = documentViewer.getCurrentPage();
          annotation.X = 100;
          annotation.Y = 100;
          annotation.Width = 200;
          annotation.Height = 50;
          annotation.TextAlign = "center";
          annotation.TextVerticalAlign = "center";
          annotation.Intent = Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
          annotation.Subject = `Email-${selectedUserRef.current}`;

          // Add the annotation to the document
          annotationManager.addAnnotation(annotation);
          annotationManager.redrawAnnotation(annotation);
        };

        const handleClickCancelBtn = () => {
          window.close();
        };

        const handleClickSaveBtn = async () => {
          // status of 1 for save button
          const doc = documentViewer.getDocument();
          const data = await doc.getFileData({}); // No xfdfString for annotations
          const arr = new Uint8Array(data);
          const blob = new Blob([arr], { type: "application/pdf" });
          let getBase64 = await generateBase64FromBlob(blob)
            .then(async (base64String) => {
              return base64String;
              // Here you can use the base64String as needed
            })
            .catch((error) => {
              return null;
            });

          // this one sent do save signature document
          const xfdfString = await annotationManager.exportAnnotations(); // this doc send to add annotationfilesofattachment
          const parser = new DOMParser();
          const mainXmlDoc = parser.parseFromString(xfdfString, "text/xml");
          function existsInMainXML(name, type, mainXmlDoc) {
            const elements = mainXmlDoc.querySelectorAll(
              `${type}[name="${name}"]`
            );
            return elements.length > 0;
          }

          let covert = userAnnotationsRef.current.map((user) => {
            let filteredXml = user.xml.filter((item) => {
              const ffieldDoc = parser.parseFromString(item.ffield, "text/xml");
              const widgetDoc = parser.parseFromString(item.widget, "text/xml");
              const ffieldName = ffieldDoc.documentElement.getAttribute("name");
              const widgetName = widgetDoc.documentElement.getAttribute("name");

              return (
                existsInMainXML(ffieldName, "ffield", mainXmlDoc) &&
                existsInMainXML(widgetName, "widget", mainXmlDoc)
              );
            });

            return { ...user, xml: filteredXml };
          });
          // for Save workFlow Api
          let saveWorkFlowData = {
            PK_WorkFlow_ID: pdfResponceData.workFlowID,
            WorkFlowTitle: pdfResponceData.title,
            Description: pdfResponceData.description,
            isDeadline: pdfResponceData.isDeadline,
            DeadlineDateTime:
              pdfResponceData.isDeadline === false
                ? ""
                : pdfResponceData.deadlineDatetime,
            CreatorID: pdfResponceData.creatorID,
            ListOfActionAbleBundle: signerDataRef.current.map(
              (sendData, index) => {
                return {
                  ID: `BundleID_# ${index + 1}`,
                  Title: "",
                  BundleDeadline: "",
                  ListOfUsers: [sendData.userID],
                  Entity: {
                    EntityID: pdfResponceData.documentID,
                    EntityTypeID: 1,
                  },
                };
              }
            ),
          };

          let convertData = [];
          covert.forEach((data) => {
            const xmlListStrings = data.xml.map((xmlObj) =>
              JSON.stringify(xmlObj)
            );
            convertData.push({
              ActorID: data.actorID,
              xmlList: xmlListStrings,
            });
          });

          console.log("saveWorkFlowData", convertData);
          // save signature document api
          let saveSignatureDocument = {
            FileID: Number(docWorkflowID),
            base64File: getBase64,
          };
          // add annotation  of files attachment api
          let addAnnoatationofFilesAttachment = {
            FileID: Number(docWorkflowID),
            AnnotationString: xfdfString,
          };
          let newData = { ActorsFieldValuesList: convertData };
          dispatch(
            saveWorkflowApi(
              saveWorkFlowData,
              navigate,
              t,
              setOpenAddParticipentModal,
              1,
              newData,
              addAnnoatationofFilesAttachment,
              saveSignatureDocument,
              1
            )
          );
        };

        const handleClickPublishBtn = async () => {
          // status of 1 for save button
          const doc = documentViewer.getDocument();
          const data = await doc.getFileData({}); // No xfdfString for annotations
          const arr = new Uint8Array(data);
          const blob = new Blob([arr], { type: "application/pdf" });
          let getBase64 = await generateBase64FromBlob(blob)
            .then(async (base64String) => {
              return base64String;
              // Here you can use the base64String as needed
            })
            .catch((error) => {
              return null;
            });

          // this one sent do save signature document
          const xfdfString = await annotationManager.exportAnnotations(); // this doc send to add annotationfilesofattachment
          const parser = new DOMParser();
          const mainXmlDoc = parser.parseFromString(xfdfString, "text/xml");
          function existsInMainXML(name, type, mainXmlDoc) {
            const elements = mainXmlDoc.querySelectorAll(
              `${type}[name="${name}"]`
            );
            return elements.length > 0;
          }

          let covert = userAnnotationsRef.current.map((user) => {
            let filteredXml = user.xml.filter((item) => {
              const ffieldDoc = parser.parseFromString(item.ffield, "text/xml");
              const widgetDoc = parser.parseFromString(item.widget, "text/xml");
              const ffieldName = ffieldDoc.documentElement.getAttribute("name");
              const widgetName = widgetDoc.documentElement.getAttribute("name");

              return (
                existsInMainXML(ffieldName, "ffield", mainXmlDoc) &&
                existsInMainXML(widgetName, "widget", mainXmlDoc)
              );
            });

            return { ...user, xml: filteredXml };
          });
          // for Save workFlow Api
          let saveWorkFlowData = {
            PK_WorkFlow_ID: pdfResponceData.workFlowID,
            WorkFlowTitle: pdfResponceData.title,
            Description: pdfResponceData.description,
            isDeadline: pdfResponceData.isDeadline,
            DeadlineDateTime:
              pdfResponceData.isDeadline === false
                ? ""
                : pdfResponceData.deadlineDatetime,
            CreatorID: pdfResponceData.creatorID,
            ListOfActionAbleBundle: signerDataRef.current.map(
              (sendData, index) => {
                return {
                  ID: `BundleID_# ${index + 1}`,
                  Title: "",
                  BundleDeadline: "",
                  ListOfUsers: [sendData.userID],
                  Entity: {
                    EntityID: pdfResponceData.documentID,
                    EntityTypeID: 1,
                  },
                };
              }
            ),
          };

          let convertData = [];
          covert.forEach((data) => {
            const xmlListStrings = data.xml.map((xmlObj) =>
              JSON.stringify(xmlObj)
            );
            convertData.push({
              ActorID: data.actorID,
              xmlList: xmlListStrings,
            });
          });

          console.log("saveWorkFlowData", convertData);
          // save signature document api
          let saveSignatureDocument = {
            FileID: Number(docWorkflowID),
            base64File: getBase64,
          };
          // add annotation  of files attachment api
          let addAnnoatationofFilesAttachment = {
            FileID: Number(docWorkflowID),
            AnnotationString: xfdfString,
          };
          // send document api data
          let sendDocumentData = {
            PK_WorkFlow_ID: pdfResponceData.workFlowID,
            FinalDocumentName: pdfResponceData.title,
            Message: "",
            ListOfViewers: [],
          };

          let newData = { ActorsFieldValuesList: convertData };
          dispatch(
            saveWorkflowApi(
              saveWorkFlowData,
              navigate,
              t,
              setOpenAddParticipentModal,
              1,
              newData,
              addAnnoatationofFilesAttachment,
              saveSignatureDocument,
              2,
              sendDocumentData
            )
          );
        };

        // Create a render function for the custom panel
        const renderCustomPanel = () => {
          return (
            <div>
              <div>
                <label htmlFor="participantDropdown">{t("Participant")}</label>
              </div>
              <div className="w-100 d-flex justify-content-center">
                <select
                  style={{
                    width: "100%",
                    padding: "12px 5px",
                    margin: "8px 0",
                  }}
                  onChange={handleChangeUser}
                >
                  {participantsRef.current.map((userData, index) => {
                    return (
                      <option value={userData.pk_UID}>{userData.name}</option>
                    );
                  })}
                </select>
              </div>
              <div className="w-100">
                <button
                  style={{
                    width: "100%",
                    padding: "12px 30px",
                    margin: "8px 0",
                    background: "#6172d6",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={openCustomModal}
                >
                  {t("Add-Signaturies")}
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "5px 12px",

                    background: "#ffffff",
                    border: "1px solid #e1e1e1",
                  }}
                  onClick={handleClickTItle}
                >
                  {t("Title")}
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "5px 12px",
                    background: "#ffffff",
                    border: "1px solid #e1e1e1",
                  }}
                  onClick={handleClickName}
                >
                  {t("Name")}
                </button>
                <button
                  style={{
                    width: "100%",
                    padding: "5px 12px",

                    background: "#ffffff",
                    border: "1px solid #e1e1e1",
                  }}
                  onClick={handleClickEmail}
                >
                  {t("Email")}
                </button>
              </div>
            </div>
          );
        };

        let myCustomPanel = {
          tab: {
            dataElement: "customPanelTab",
            title: "customPanelTab",
            img: "/favicon-32x32.png",
          },
          panel: {
            dataElement: "customPanel",
            render: renderCustomPanel,
          },
        };

        instance.UI.setCustomPanel(myCustomPanel);
        //======================================== for cutome side bar =====================================//

        //======================================== header save button =====================================//
        async function generateBase64FromBlob(blob) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function () {
              const base64String = reader.result.split(",")[1];
              resolve(base64String);
            };

            reader.onerror = function (error) {
              reject(error);
            };

            reader.readAsDataURL(blob);
          });
        }
        const { WidgetFlags } = Annotations;
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "customElement",
            render: () => {
              const textBoxButton = document.createElement("button");
              textBoxButton.textContent = "Cancel";
              textBoxButton.style.background = "#fff";
              textBoxButton.style.border = "1px solid #e1e1e1";
              textBoxButton.style.color = "#5a5a5a";
              textBoxButton.style.padding = "8px 30px";
              textBoxButton.style.cursor = "pointer";
              textBoxButton.style.borderRadius = "4px";
              textBoxButton.onclick = handleClickCancelBtn;
              return textBoxButton;
            },
          });

          header.push({
            type: "customElement",
            render: () => {
              const textBoxButton = document.createElement("button");
              textBoxButton.textContent = "Save";
              textBoxButton.style.background = "#fff";
              textBoxButton.style.border = "1px solid #e1e1e1";
              textBoxButton.style.color = "#5a5a5a";
              textBoxButton.style.padding = "8px 30px";
              textBoxButton.style.cursor = "pointer";
              textBoxButton.style.borderRadius = "4px";
              textBoxButton.style.marginLeft = "10px";
              textBoxButton.onclick = handleClickSaveBtn;
              return textBoxButton;
            },
          });

          header.push({
            type: "customElement",
            render: () => {
              const publishBtn = document.createElement("button");
              publishBtn.textContent = "Send";
              publishBtn.style.background = "#6172d6";
              publishBtn.style.color = "#fff";
              publishBtn.style.borderRadius = "4px";
              publishBtn.style.cursor = "pointer";
              publishBtn.style.padding = "8px 30px";
              publishBtn.style.margin = "10px 0 10px 10px";
              publishBtn.style.border = "1px solid #6172d6";
              publishBtn.onclick = handleClickPublishBtn;
              return publishBtn;
            },
          });
        });

        //======================================== header save button =====================================//

        //======================================== for documentLoaded =====================================//
        await documentViewer.getAnnotationsLoadedPromise();

        documentViewer.addEventListener("documentLoaded", async () => {
          if (pdfResponceData.xfdfData !== "" && annotationManager) {
            try {
              await annotationManager.importAnnotations(
                pdfResponceDataRef.current
              );
            } catch (error) {}
          }
        });
        //======================================== for documentLoaded =====================================//
      });
    }
  }, [pdfResponceData.attachmentBlob]);
  // ==== End ====//

  // ==== this is for remove specifi from Xfdf Main   === //
  function removeSignatureAnnotationsFromXFDF(xfdfString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xfdfString, "text/xml");
    deletedDataTem.forEach(({ xml, userID }) => {
      xml.forEach(({ ffield }) => {
        const regex = /name=\"([^\"]+)\"/;
        const match = ffield.match(regex);
        if (match && match[1]) {
          const fieldName = match[1];

          // Remove <ffield> element from main XML
          const ffieldElements = xmlDoc.querySelectorAll(
            `ffield[name="${fieldName}"]`
          );
          ffieldElements.forEach((ffieldElement) => {
            ffieldElement.parentNode.removeChild(ffieldElement);
          });

          // Find and remove corresponding <widget> element
          const widgetElement = xmlDoc.querySelector(
            `widget[field="${fieldName}"]`
          );
          if (widgetElement) {
            widgetElement.parentNode.removeChild(widgetElement);
          }

          // Find and remove corresponding <field> element from <fields>
          const fieldElement = xmlDoc.querySelector(
            `fields field[name="${fieldName}"]`
          );
          if (fieldElement) {
            fieldElement.parentNode.removeChild(fieldElement);
          }
        }
      });

      // Remove <freetext> elements associated with the userID
      const freetextElements = xmlDoc.querySelectorAll(
        `freetext[subject*="-${userID}"]`
      );
      freetextElements.forEach((freetextElement) => {
        freetextElement.parentNode.removeChild(freetextElement);
      });
    });

    // Serialize the modified XML back to a string
    const serializer = new XMLSerializer();
    const modifiedXFDFString = serializer.serializeToString(xmlDoc);

    return modifiedXFDFString;
  }
  // === End === //

  // ==== this is for remove Exsisting Xfdf Of removed singaturies from list === //
  const removeHandlerForPrticipantDelete = async (usersNotInParticipants) => {
    const { annotationManager } = Instance.Core;
    try {
      let annotations = await annotationManager.exportAnnotations();

      const modifiedXFDF = removeSignatureAnnotationsFromXFDF(
        annotations,
        usersNotInParticipants
      );

      // Remove existing annotations
      const annots = annotationManager.getAnnotationsList();

      // remove annotations
      annotationManager.deleteAnnotations(annots);

      // Import modified annotations
      annotationManager.importAnnotations(modifiedXFDF);

      // Redraw the viewer to reflect the changes
      annotationManager.redrawAnnotation();
    } catch (error) {}
  };
  // ==== End ====//

  // ==== this is use for add participants in side bar ====//
  useEffect(() => {
    if (Instance && participants) {
      // Rerender the custom panel to reflect the updated participants
      Instance.UI.disableElement("customPanel");
      Instance.UI.enableElement("customPanel");
      Instance.UI.setActiveLeftPanel("customPanel");
      let usersNotInParticipants = lastParticipants.filter(
        (lastParticipant) =>
          !participants.some(
            (participant) => participant.pk_UID === lastParticipant.pk_UID
          )
      );
      if (usersNotInParticipants.length > 0) {
        setLastParticipants(participants);
        removeHandlerForPrticipantDelete(usersNotInParticipants);
      } else {
        setLastParticipants(participants);
      }
    }
  }, [participants]);
  // ==== End ====//

  // === this is for update intance in ===//
  useEffect(() => {
    if (Instance) {
      const { annotationManager } = Instance.Core;
      annotationManager.addEventListener(
        "annotationChanged",
        async (annotations, action, { imported }) => {
          if (imported) {
            return;
          }

          try {
            annotations.forEach((annotation) => {
              console.log(annotation, "annotationannotationannotation");
              if (annotation.Subject === "Signature") {
                annotation.NoResize = true;
                annotation.NoMove = true;
                annotationManager.updateAnnotation(annotation);
                annotationManager.redrawAnnotation(annotation);
              }
            });
            // Export annotations to XFDF format using `exportAnnotations`
            const xfdfString = await annotationManager.exportAnnotations();

            // Update the user's annotations based on the action

            updateXFDF(
              action,
              xfdfString,
              selectedUserRef.current,
              userAnnotationsRef.current
            );
          } catch (error) {}
        }
      );
    }
  }, [Instance]);
  // === End ===//

  // === these are the function which we are using in add signaturtires modal === //
  //  its use for update dropdown display of signatries modal users list
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        let usersDataArr = [];
        assignees.user.forEach((allData, index) => {
          usersDataArr.push({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-2 align-items-center"
                  >
                    <img
                      src={`data:image/jpeg;base64,${allData?.displayProfilePictureName}`}
                      height="16.45px"
                      width="18.32px"
                      draggable="false"
                      alt=""
                    />
                    <span>{allData.name}</span>
                  </Col>
                </Row>
              </>
            ),
            value: allData.pK_UID,
            name: allData.name,
            email: allData.emailAddress,
          });
        });
        setUserList(usersDataArr);
      }
    } catch (error) {}
  }, [assignees.user]);

  // this is for searching in dropdown
  const filterFunc = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  // this is for cahneg value of user selection dropdown
  const handleChangeFllName = (value) => {
    setSingerUserData(value);
    setSigners({
      ...signers,
      EmailAddress: value.email,
      UserID: value.value,
      Name: value.name,
    });
  };

  // this  func for remove user fron list
  const handleRemoveSigner = (index) => {
    setSignerData((prevSignersData) => {
      return prevSignersData.filter((_, i) => i !== index);
    });
  };

  // this is add another user func
  const handleClickAdd = () => {
    if (signers.EmailAddress !== "" && signers.Name !== "") {
      let isExist = signerData.find(
        (data, index) =>
          data.EmailAddress.toLowerCase() === signers.EmailAddress.toLowerCase()
      );

      if (isExist === undefined) {
        setSingerUserData({
          value: 0,
          label: "",
          name: "",
        });
        setSignerData([
          ...signerData,
          {
            Name: signers.Name,
            EmailAddress: signers.EmailAddress,
            userID: signers.UserID,
          },
        ]);
        setSigners({
          ...signers,
          EmailAddress: "",
          UserID: 0,
          Name: "",
        });
      } else {
        setSingerUserData({
          value: 0,
          label: "",
          name: "",
        });
        setSigners({
          ...signers,
          EmailAddress: "",
          UserID: 0,
          Name: "",
        });
        setOpen({
          message: "User Already is List",
          open: true,
        });
      }
    } else {
    }
  };

  // this for cancel modal
  const handleHideModal = () => {
    if (signerData.length > 0) {
      setOpenAddParticipentModal(false);
      setSingerUserData({
        label: "",
        name: "",
        value: 0,
      });
      setSigners({
        EmailAddress: "",
        Name: "",
        UserID: 0,
      });
    } else {
      setOpen({
        ...open,
        message: "Data Must Required",
        open: true,
      });
    }
  };

  // this is for  save sinatries
  const clickSaveSigners = async () => {
    if (Object.keys(signerData).length > 0) {
      let Data = {
        PK_WorkFlow_ID: pdfResponceData.workFlowID,
        WorkFlowTitle: pdfResponceData.title,
        Description: pdfResponceData.description,
        isDeadline: pdfResponceData.isDeadline,
        DeadlineDateTime:
          pdfResponceData.isDeadline === false
            ? ""
            : pdfResponceData.deadlineDatetime,
        CreatorID: pdfResponceData.creatorID,
        ListOfActionAbleBundle: signerData.map((sendData, index) => {
          return {
            ID: `BundleID_# ${index + 1}`,
            Title: "",
            BundleDeadline: "",
            ListOfUsers: [sendData.userID],
            Entity: {
              EntityID: pdfResponceData.documentID,
              EntityTypeID: 1,
            },
          };
        }),
      };
      setSingerUserData({
        value: 0,
        label: "",
        name: "",
      });
      dispatch(saveWorkflowApi(Data, navigate, t, setOpenAddParticipentModal));
    }
  };
  // === End === //

  // === this is for Response Message===//
  useEffect(() => {
    if (ResponseMessage !== "" && ResponseMessage !== undefined) {
      setOpen({
        ...open,
        message: ResponseMessage,
        open: true,
      });
      setTimeout(() => {
        dispatch(clearWorkFlowResponseMessage());
        setOpen({
          ...open,
          message: "",
          open: false,
        });
      }, 4000);
    }
  }, [ResponseMessage]);
  // === End ===//

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(signerData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSignerData(items);
  };

  return (
    <>
      <div className="documnetviewer">
        <div className="webviewer" ref={viewer}></div>
      </div>
      <Modal
        show={openAddParticipentModal}
        onHide={handleHideModal}
        setShow={setOpenAddParticipentModal}
        ButtonTitle={"Block"}
        centered
        closeButton
        size={"md"}
        modalFooterClassName={"d-block"}
        modalBodyClassName={"Signers_modal_body"}
        modalHeaderClassName="Signers_modal_header"
        ModalBody={
          <>
            <>
              <Row className="mb-1">
                <Col lg={12} md={12} xs={12} sm={12}>
                  <span className="Signers_heading">{t("Signers")}</span>
                </Col>
                <Col lg={12} md={12} xs={12} sm={12} className="mt-4 mb-3">
                  <span className="Signers_tagLine">
                    {t("Add-the-people-who-need-to-sign-this-document")}
                  </span>
                </Col>
                <Col lg={12} md={12} xs={12} sm={12}>
                  <Row>
                    <Col sm={6} md={6} lg={6}>
                      <p className="pb-1 m-0 inputlabel_style">{"Full Name"}</p>
                      <Select
                        placeholder="Full Name"
                        onChange={handleChangeFllName}
                        options={userList}
                        filterOption={filterFunc}
                        value={
                          signerUserData.value !== 0 ? signerUserData : null
                        }
                      />
                    </Col>
                    <Col sm={6} md={6} lg={6}>
                      <TextField
                        width={"100%"}
                        name={"EmailAddress"}
                        type="email"
                        disable={true}
                        // disable={index !== 0 ? true : false}
                        labelClass={"inputlabel_style"}
                        applyClass={"signatureflow_input"}
                        placeholder={t("Email")}
                        value={signers.EmailAddress}
                        label={"Email"}
                      />
                    </Col>
                  </Row>
                  <Row className="d-flex align-items-center">
                    <Col sm={12} md={12} lg={12} className="signersList">
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="signers">
                          {(provided) => (
                            <Row
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {signerData.length > 0 &&
                                signerData.map((fieldsData, index) => {
                                  return (
                                    <Draggable
                                      key={index}
                                      draggableId={index.toString()}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <>
                                          <Col
                                            sm={1}
                                            md={1}
                                            lg={1}
                                            className="my-1 d-flex align-items-end mb-2"
                                          >
                                            <img
                                              src={DragIcon}
                                              width={20}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            />
                                          </Col>
                                          <Col
                                            sm={10}
                                            md={10}
                                            lg={10}
                                            className="my-1"
                                            // ref={provided.innerRef}
                                            // {...provided.draggableProps}
                                            // {...provided.dragHandleProps}
                                          >
                                            <Row>
                                              <Col sm={6} md={6} lg={6}>
                                                <TextField
                                                  placeholder={t("Full-name")}
                                                  labelClass={
                                                    "inputlabel_style"
                                                  }
                                                  width={"100%"}
                                                  applyClass={
                                                    "signatureflow_input"
                                                  }
                                                  name={"Name"}
                                                  type="text"
                                                  disable={true}
                                                  value={fieldsData.Name}
                                                  label={"Name"}
                                                />
                                              </Col>
                                              <Col sm={6} md={6} lg={6}>
                                                <TextField
                                                  width={"100%"}
                                                  name={"EmailAddress"}
                                                  type="email"
                                                  disable={true}
                                                  labelClass={
                                                    "inputlabel_style"
                                                  }
                                                  applyClass={
                                                    "signatureflow_input"
                                                  }
                                                  placeholder={t("Email")}
                                                  value={
                                                    fieldsData.EmailAddress
                                                  }
                                                  label={"Email"}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col
                                            sm={1}
                                            md={1}
                                            lg={1}
                                            className="my-1 d-flex align-items-end mb-3"
                                          >
                                            <img
                                              src={DeleteIcon}
                                              className="cursor-pointer"
                                              onClick={() =>
                                                handleRemoveSigner(index)
                                              }
                                              width={20}
                                            />
                                          </Col>
                                        </>
                                      )}
                                    </Draggable>
                                  );
                                })}
                              {provided.placeholder}
                            </Row>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12} md={12} xs={12} sm={12}>
                  <Button
                    className="addOther_field"
                    text={t("Add-another-signer")}
                    onClick={handleClickAdd}
                    icon={<img src={PlusSignSignatureFlow} />}
                  />
                </Col>
              </Row>
            </>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                sm={6}
                md={6}
                lg={6}
                className="d-flex justify-content-start px-0"
              >
                <Checkbox
                  label2={t("Set-signer-order")}
                  checked={orderCheckBox}
                  onChange={(event) => setOrderCheckbox(event.target.checked)}
                  classNameDiv={"d-flex gap-2"}
                />
              </Col>
              <Col
                sm={6}
                md={6}
                lg={6}
                className="d-flex justify-content-end gap-2 px-0"
              >
                <Button
                  className={"CancelBtn"}
                  text={t("Cancel")}
                  onClick={handleHideModal}
                />
                <Button
                  className={"Add"}
                  text={t("Add")}
                  onClick={clickSaveSigners}
                />
              </Col>
            </Row>
          </>
        }
      />
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
      {Loading && <Loader />}
    </>
  );
};

export default SignatureViewer;
