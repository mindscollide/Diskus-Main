import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import PlusSignSignatureFlow from "../../../../assets/images/plus-sign-signatureflow.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIcon from "../../../../assets/images/DragIcon_SignatureFlow.png";
import { ClearMessageAnnotations } from "../../../../store/actions/webVieverApi_actions";
import { xml2json, json2xml } from "xml-js";
import buffer from "buffer";
import { useTranslation } from "react-i18next";
import {
  Notification,
  Loader,
  Modal,
  Button,
  TextField,
} from "../../../../components/elements/index";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../../assets/images/Icon material-delete.svg";
import Select from "react-select";
import {
  addUpdateFieldValueApi,
  declineReasonApi,
  getWorkFlowByWorkFlowIdwApi,
  saveWorkflowApi,
} from "../../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { getActorColorByUserID } from "../../../../commen/functions/converthextorgb";
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
} from "../pendingSignature/pendingSIgnatureFunctions.js";
import { generateBase64FromBlob } from "../../../../commen/functions/generateBase64FromBlob";

const ViewDocument = () => {
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
    getDataroomAnnotation,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  // Parse the URL parameters to get the data
  const docWorkflowID = new URLSearchParams(location.search).get("documentID");
  const { assignees } = useSelector((state) => state);
  const [Instance, setInstance] = useState(null);
  const viewer = useRef(null);
  const [userList, setUserList] = useState([]);
  const [signerData, setSignerData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
  const [FieldsData, setFieldsData] = useState([]);
  const [reasonModal, setReasonModal] = useState(false);
  const [declineConfirmationModal, setDeclineConfirmationModal] =
    useState(false);
  const [declineReasonMessage, setDeclineReasonMessage] = useState("");
  const [declineErrorMessage, setDeclineErrorMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [xmlAfterHideDAta, setXmlAfterHideDAta] = useState("");
  const [removeXmlAfterHideDAta, setRemoveXmlAfterHideDAta] = useState("");

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

  console.log(getAllFieldsByWorkflowID, "getAllFieldsByWorkflowID");
  // { userID: "user1", xml: [] }
  const [userAnnotationsCopy, setUserAnnotationsCopy] = useState([]);
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);
  const [readOnlyUsers, setReadOnlyUsers] = useState([]);
  const userAnnotationsCopyData = useRef(userAnnotationsCopy);
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const removedAnnotationsRef = useRef(pdfResponceData.removedAnnotations);
  const participantsRef = useRef(participants);
  const xmlAfterHideDAtaRef = useRef(xmlAfterHideDAta);
  const removeXmlAfterHideDAtaRef = useRef(removeXmlAfterHideDAta);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);
  console.log(
    userAnnotationsCopyData,
    "userAnnotationsCopyDatauserAnnotationsCopyDatauserAnnotationsCopyData"
  );

  // ===== this use for current state update get =====//

  useEffect(() => {
    userAnnotationsCopyData.current = userAnnotationsCopy;
  }, [userAnnotationsCopy]);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    readOnlyUsersRef.current = readOnlyUsers;
  }, [readOnlyUsers]);
  useEffect(() => {
    hiddenUsersRef.current = hiddenUsers;
  }, [hiddenUsers]);
  useEffect(() => {
    userAnnotationsRef.current = userAnnotations;
  }, [userAnnotations]);

  useEffect(() => {
    pdfResponceDataRef.current = pdfResponceData.xfdfData;
  }, [pdfResponceData]);

  useEffect(() => {
    removedAnnotationsRef.current = pdfResponceData.removedAnnotations;
  }, [pdfResponceData]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);

  useEffect(() => {
    xmlAfterHideDAtaRef.current = xmlAfterHideDAta;
  }, [xmlAfterHideDAta]);

  useEffect(() => {
    removeXmlAfterHideDAtaRef.current = removeXmlAfterHideDAta;
  }, [removeXmlAfterHideDAta]);
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

  // === checker for null array === //
  function containsNull(arr) {
    return arr.some((element) => element === null);
  }
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
          setHiddenUsers(getAllFieldsByWorkflowID.hiddenUsers);
          setReadOnlyUsers(getAllFieldsByWorkflowID.readOnlyUsers);
          function revert(data) {
            return data.map((item) => {
              const xmlField = item.xmlField
                ? item.xmlField.split("_#_").map((str) => {
                    try {
                      return JSON.parse(str);
                    } catch (error) {
                      console.error(
                        "Error parsing JSON:",
                        error,
                        "Input:",
                        str
                      );
                      return null; // or handle the error as needed
                    }
                  })
                : [];
              return {
                actorID: item.actorID,
                userID: item.userID,
                actorColor: item.actorColor,
                xml: xmlField,
              };
            });
          }
          // this is using if we are getting null value for anotations
          if (
            containsNull(
              getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                .listOfFields
            )
          ) {
            let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;

            if (bundleModels?.length > 0) {
              let listOfUsers = [];
              bundleModels.forEach((users, index) => {
                users.actors.forEach((usersData, index) => {
                  listOfUsers.push({
                    actorID: usersData.fK_WorkFlowActor_ID,
                    userID: usersData.pK_UID,
                    actorColor: usersData.actorColor,
                    xml: [],
                  });
                });
              });
              setUserAnnotations(listOfUsers);
            }
          } else {
            revertedData = revert(
              getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                .listOfFields
            );
            setUserAnnotations(revertedData);
            setUserAnnotationsCopy(revertedData);
          }
          setFieldsData(newFieldsData);
        }
      } catch {}
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
          // this is using if we are getting null value for anotations
          if (
            getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails
              .length > 0
          ) {
            if (
              containsNull(
                getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                  .listOfFields
              )
            ) {
              let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;

              if (bundleModels?.length > 0) {
                let listOfUsers = [];
                bundleModels.forEach((users, index) => {
                  users.actors.forEach((usersData, index) => {
                    listOfUsers.push({
                      actorID: usersData.fK_WorkFlowActor_ID,
                      userID: usersData.pK_UID,
                      actorColor: usersData.actorColor,
                      xml: [],
                    });
                  });
                });
                setUserAnnotations(listOfUsers);
              }
            }
          }
        } else {
          // setOpenAddParticipentModal(true);
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
      let currentUserID =
        localStorage.getItem("userID") !== null
          ? Number(localStorage.getItem("userID"))
          : 0;

      let HideArray = [];
      let ReadArray = [];

      // Iterate over each object in the data array
      userAnnotationsRef.current.forEach((obj) => {
        // Check if userID does not match currentID
        if (obj.userID !== currentUserID) {
          // Iterate over xml array in the current object
          obj.xml.forEach((item) => {
            // Extract all 'name' attributes from ffield excluding font tag
            let ffield = item.ffield;
            let matches = ffield.match(/<ffield[^>]*\sname="([^"]+)"/g);
            if (matches) {
              matches.forEach((match) => {
                // Extract the name value and push into nameArray
                let name = match.match(/name="([^"]+)"/)[1];
                if (hiddenUsersRef.current.includes(obj.userID)) {
                  HideArray.push(name);
                } else if (readOnlyUsersRef.current.includes(obj.userID)) {
                  ReadArray.push(name);
                }
              });
            }
          });
        }
      });
      console.log({ HideArray, ReadArray }, "ReadArrayReadArray");
      console.log(
        "getDataroomAnnotation.annotationString getDataroomAnnotation",
        getDataroomAnnotation.annotationString
      );
      let newProcessXmlForReadOnly = processXmlForReadOnly(
        getDataroomAnnotation.annotationString,
        ReadArray
      );

      // Process the XML to hide fields
      const { updatedXmlString, removedFields } = processXmlToHideFields(
        newProcessXmlForReadOnly,
        HideArray
      );
      console.log(
        "getDataroomAnnotation.annotationString removedFields",
        removedFields
      );
      setXmlAfterHideDAta(updatedXmlString);
      setRemoveXmlAfterHideDAta(removedFields);
      const readonlyFreetextXmlString = readOnlyFreetextElements(
        updatedXmlString,
        readOnlyUsersRef.current
      );
      const hideFreetextXmlString = hideFreetextElements(
        readonlyFreetextXmlString,
        hiddenUsersRef.current
      );
      setPdfResponceData((prevData) => ({
        ...prevData,
        xfdfData: hideFreetextXmlString,
        attachmentBlob: getDataroomAnnotation.attachmentBlob,
        removedAnnotations: "",
      }));
    }
  }, [getDataroomAnnotation]);
  // === End === //

  // === It's triggered when we update the blob file in our local state ===
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

        const { documentViewer, annotationManager, Tools } = instance.Core;

        // Add event listener for when the document is loaded
        documentViewer.addEventListener("documentLoaded", async () => {
          // Ensure the annotations are fully loaded
          await documentViewer.getAnnotationsLoadedPromise();

          // If XFDF data exists, import it
          if (pdfResponceData.xfdfData !== "" && annotationManager) {
            try {
              await annotationManager.importAnnotations(
                pdfResponceDataRef.current
              );
            } catch (error) {
              console.error("Error importing annotations:", error);
            }
          }

          // Iterate through all annotations to lock them and set to read-only
          const annotations = annotationManager.getAnnotationsList();
          annotations.forEach((annotation) => {
            console.log(annotation, "annotationsannotationsannotations")
            annotation.Locked = true;
            annotation.ReadOnly = true;
          });

          // Refresh to apply the changes
          documentViewer.refreshAll();
          documentViewer.updateView();
        });

        // Disable header tools and elements
        instance.UI.disableTools([Tools.disableTextSelection]);
        instance.UI.disableElements([
          "underlineToolGroupButton",
          "textSelectButton",
          "textSelectButtonGroup",
          "textSelectButtonGroupButton",
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
          "annotationPopup",
          "textPopup",
          "richTextPopup",
          "toolbarGroup-Annotate",
          "leftPanelButton",
          "zoomOverlayButton",
          "toolbarGroup-Forms",
          "header",
        ]);
      });
    }
  }, [pdfResponceData.attachmentBlob]);

  // ==== End ====//

  // this will generate my xfdf files for user base and send into AddUpdateFieldValue
  const updateXFDF = (action, xmlString, userSelectID, userAnnotations) => {
    console.log(
      "userAnnotations updateXFDF",
      action,
      xmlString,
      userSelectID,
      userAnnotations
    );
    try {
      let userSelect = parseInt(userSelectID);
      // Iterate over each user's annotations
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      xmlDoc.querySelectorAll("widget").forEach((widget) => {
        const widgetName = widget.getAttribute("name");
        const ffieldName = widget.getAttribute("field");
        // const uniqueWidgetName = `${ffieldName}-${userSelect}`;
        // widget.setAttribute("name", uniqueWidgetName);
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
      console.log("userAnnotations userAnnotations in", userAnnotations);
      setUserAnnotations(userAnnotations);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("saveWorkFlowData", userAnnotations);

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
      } else {
        setLastParticipants(participants);
      }
    }
  }, [participants]);
  // ==== End ====//

  // === this is for update intance in ===//
  useEffect(() => {
    if (Instance) {
      const { annotationManager, Annotations } = Instance.Core;
      annotationManager.addEventListener(
        "annotationChanged",
        async (annotations, action, { imported }) => {
          if (imported) {
            return;
          }

          try {
            // Export annotations to XFDF format using `exportAnnotations`
            const xfdfString = await annotationManager.exportAnnotations();

            // Update the user's annotations based on the action
            updateXFDF(
              action,
              xfdfString,
              selectedUserRef.current,
              userAnnotationsRef.current
            );
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
  }, [Instance]);
  // === End ===//

  // === this is for Response Message===//
  useEffect(() => {
    if (ResponseMessage !== "" && ResponseMessage !== undefined) {
      setOpen({
        ...open,
        message: ResponseMessage,
        open: true,
      });
      setTimeout(() => {
        dispatch(ClearMessageAnnotations());
        setOpen({
          ...open,
          message: "",
          open: false,
        });
      }, 4000);
    }
  }, [ResponseMessage]);
  // === End ===//

  return (
    <>
      <div className="documnetviewer">
        <div className="webviewer" ref={viewer}></div>
      </div>

      <Notification message={open.message} open={open.open} setOpen={setOpen} />
      {Loading && <Loader />}
    </>
  );
};

export default ViewDocument;
