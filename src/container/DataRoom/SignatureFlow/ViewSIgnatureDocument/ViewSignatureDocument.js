import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClearMessageAnnotations } from "../../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification, Loader } from "../../../../components/elements/index";
import {
  declineReasonApi,
  getWorkFlowByWorkFlowIdwApi,
} from "../../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import DeclineReasonModal from "../SignatureModals/DeclineReasonModal/DeclineReasonModal";
import DeclineReasonCloseModal from "../SignatureModals/DeclineReasonCloseModal/DeclineReasonCloseModal";
import {
  handleBlobFiles,
  processXmlForReadOnly,
  readOnlyFreetextElements,
} from "../pendingSignature/pendingSIgnatureFunctions";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const ViewSignatureDocument = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { webViewer } = useSelector((state) => state);
  const {
    getAllFieldsByWorkflowID,
    getWorkfFlowByFileId,
    Loading,
    getDataroomAnnotation,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  // Parse the URL parameters to get the data
  const docWorkflowID = new URLSearchParams(location.search).get("documentID");
  const [Instance, setInstance] = useState(null);
  const viewer = useRef(null);
  const [signerData, setSignerData] = useState([]);
  const [FieldsData, setFieldsData] = useState([]);
  const [reasonModal, setReasonModal] = useState(false);
  const [declineConfirmationModal, setDeclineConfirmationModal] =
    useState(false);
  const [declineReasonMessage, setDeclineReasonMessage] = useState("");
  const [declineErrorMessage, setDeclineErrorMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [removeXmlAfterHideDAta, setRemoveXmlAfterHideDAta] = useState("");

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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
  const [userAnnotationsCopy, setUserAnnotationsCopy] = useState([]);
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);
  const [readOnlyUsers, setReadOnlyUsers] = useState([]);

  const userAnnotationsCopyData = useRef(userAnnotationsCopy);
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);

  // ===== this use for current state update get =====//

  useEffect(() => {
    userAnnotationsCopyData.current = userAnnotationsCopy;
  }, [userAnnotationsCopy]);

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
    signerDataRef.current = signerData;
  }, [signerData]);

  // === End === //

  // === Api calling === //
  async function apiCall(Data) {
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
        let AllUserIDs = [];
        let revertedData;
        if (
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails
            .length > 0
        ) {
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails.forEach(
            (fieldsData) => {
              AllUserIDs.push(fieldsData.userID);
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
          setHiddenUsers([]);
          setReadOnlyUsers(AllUserIDs);
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
      });
      let newProcessXmlForReadOnly = processXmlForReadOnly(
        getDataroomAnnotation.annotationString,
        ReadArray
      );

      const readonlyFreetextXmlString = readOnlyFreetextElements(
        newProcessXmlForReadOnly,
        readOnlyUsersRef.current
      );

      setPdfResponceData((prevData) => ({
        ...prevData,
        xfdfData: readonlyFreetextXmlString,
        attachmentBlob: getDataroomAnnotation.attachmentBlob,
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

  // === this is for Response Message===//
  useEffect(() => {
    if (ResponseMessage !== "" && ResponseMessage !== undefined) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(ClearMessageAnnotations());
    }
  }, [ResponseMessage]);
  // === End ===//

  const handleClickDeclineBtn = () => {
    if (declineReasonMessage !== "") {
      let userID = localStorage.getItem("userID");

      let findActorID = userAnnotationsRef.current.find(
        (data, index) => Number(data.userID) === Number(userID)
      );
      if (findActorID !== undefined) {
        let Data = {
          FK_WorkFlow_ID: pdfResponceData.workFlowID,
          Reason: declineReasonMessage,
          DeclinedById: Number(findActorID.actorID),
        };
        dispatch(
          declineReasonApi(
            navigate,
            t,
            Data,
            setReasonModal,
            setDeclineConfirmationModal
          )
        );
      }

      // setDeclineConfirmationModal
    } else {
      setDeclineErrorMessage(true);
    }
  };
  return (
    <>
      <div className="documnetviewer">
        <div className="webviewer" ref={viewer}></div>
      </div>

      {reasonModal && (
        <DeclineReasonModal
          show={reasonModal}
          setShow={setReasonModal}
          declineReasonMessage={declineReasonMessage}
          setDeclineReasonMessage={setDeclineReasonMessage}
          handleClickDecline={handleClickDeclineBtn}
          declineErrorMessage={declineErrorMessage}
          setDeclineErrorMessage={setDeclineErrorMessage}
        />
      )}
      {declineConfirmationModal && (
        <DeclineReasonCloseModal
          setShow={setDeclineConfirmationModal}
          show={declineConfirmationModal}
        />
      )}
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
      {/* {Loading && <Loader />} */}
    </>
  );
};

export default ViewSignatureDocument;
