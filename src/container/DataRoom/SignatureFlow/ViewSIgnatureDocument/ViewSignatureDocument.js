import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClearMessageAnnotations } from "../../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../../components/elements/index";
import {
  declineReasonApi,
  getWorkFlowByWorkFlowIdwApi,
} from "../../../../store/actions/workflow_actions";
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
    getSignatureFileAnnotationResponse,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);

  // Parse the URL parameters to get the data
  const docWorkflowID = new URLSearchParams(location.search).get("documentID");
  const viewer = useRef(null);
  const [signerData, setSignerData] = useState([]);
  const [FieldsData, setFieldsData] = useState([]);
  const [reasonModal, setReasonModal] = useState(false);
  const [declineConfirmationModal, setDeclineConfirmationModal] =
    useState(false);
  const [declineReasonMessage, setDeclineReasonMessage] = useState("");
  const [declineErrorMessage, setDeclineErrorMessage] = useState(false);

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
  const [Instance, setInstance] = useState(null);
  const [readOnlyUsers, setReadOnlyUsers] = useState([]);

  const userAnnotationsCopyData = useRef(userAnnotationsCopy);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);

  console.log(signerDataRef, "signerDataRefsignerDataRef");

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
    await dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t, 1));
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
      } catch { }
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
          // xfdfData: "",
          // attachmentBlob: webViewer.attachmentBlob,
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
      } catch (error) { }
    }
  }, [getWorkfFlowByFileId, FieldsData]);
  // === End === //

  // === Get  the file details by Id from API and Set it === //
  useEffect(() => {
    try {
      if (
        getSignatureFileAnnotationResponse !== null &&
        getSignatureFileAnnotationResponse !== undefined
      ) {
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
          getSignatureFileAnnotationResponse.annotationString,
          ReadArray
        );

        const readonlyFreetextXmlString = readOnlyFreetextElements(
          newProcessXmlForReadOnly,
          readOnlyUsersRef.current
        );

        setPdfResponceData((prevData) => ({
          ...prevData,
          xfdfData: readonlyFreetextXmlString,
          attachmentBlob: getSignatureFileAnnotationResponse.attachmentBlob,
        }));
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [getSignatureFileAnnotationResponse]);
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
            process.env.REACT_APP_APRYSEKEY,// sign up to get a free trial key at https://dev.apryse.com
        },
        viewer.current
      ).then(async (instance) => {
        setInstance(instance);
        const UI = instance.UI;

        UI.loadDocument(handleBlobFiles(pdfResponceData.attachmentBlob), {
          filename: pdfResponceData.title,
        });

        const { documentViewer, annotationManager } = instance.Core;

        // ── Custom close button (same pattern as signatureviewer.js) ──────
        const closeButton = new UI.Components.CustomButton({
          dataElement: "closeTabButton",
          label: t("Close"),
          title: t("Close"),
          onClick: () => window.close(),
          style: {
            background: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 30px",
            cursor: "pointer",
            fontWeight: "600",
          },
        });

        const closeButtonGroup = new UI.Components.GroupedItems({
          dataElement: "closeButtonGroup",
          grow: 0,
          gap: 8,
          position: "end",
          alwaysVisible: true,
          items: [closeButton],
        });

        // Replace entire header with only the close button
        const topHeader = UI.getModularHeader("default-top-header");
        topHeader.setItems([closeButtonGroup]);

        // ── Hide all toolbar groups and UI panels ─────────────────────────
        UI.disableElements([
          "toolbarGroup-Annotate",
          "toolbarGroup-Shapes",
          "toolbarGroup-Edit",
          "toolbarGroup-Insert",
          "toolbarGroup-Forms",
          "toolbarGroup-FillAndSign",
          "toolbarGroup-Measure",
          "toolbarGroup-Redact",
          "toolbarGroup-View",
          "toolsOverlay",
          "menuButton",
          "leftPanelButton",
          "searchButton",
          "toggleNotesButton",
          "viewControlsButton",
          "viewControlsOverlay",
          "signaturePanelButton",
          "notesPanel",
          "outlinesPanelButton",
          "annotationPopup",
          "contextMenuPopup",
          "richTextPopup",
          "textPopup",
        ]);

        // ── Document loaded ───────────────────────────────────────────────
        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

          if (pdfResponceDataRef.current && annotationManager) {
            try {
              await annotationManager.importAnnotations(
                pdfResponceDataRef.current
              );

              // Lock every annotation object
              annotationManager.getAnnotationsList().forEach((annot) => {
                annot.Locked = true;
                annot.ReadOnly = true;
                annot.NoResize = true;
                annot.NoMove = true;
                annot.NoRotate = true;
                annotationManager.updateAnnotation(annot);
              });

              // Lock every PDF form field (Sig / Tx / Btn / Ch)
              annotationManager.getFieldManager().forEachField((field) => {
                field.flags.set("ReadOnly", true);
              });

            } catch (error) {
              console.error("Error importing annotations:", error);
            }
          }

          documentViewer.refreshAll();
          documentViewer.updateView();
        });
      });
    }
  }, [pdfResponceData.attachmentBlob]);

  // ==== End ====//

  const disableSignatureActions = (Instance) => {
    if (!Instance) return;

    const { annotationManager, Annotations } = Instance.Core;

    // Event Listener for annotation changes
    const handleAnnotationChange = (annotations) => {
      annotations.forEach((annot) => {
        console.log(
          annot,
          annot instanceof Annotations.FreeHandAnnotation,
          "annotannotannot"
        );
        if (annot.ToolName === "AnnotationCreateRubberStamp") {
          annot.NoMove = true; // Prevent dragging
          annot.NoResize = true; // Prevent resizing
          annot.NoRotate = true; // Prevent rotation
          annot.Locked = true; // Fully lock annotation
          annotationManager.redrawAnnotation(annot);
        }
      });
    };

    annotationManager.addEventListener(
      "annotationChanged",
      handleAnnotationChange
    );

    // Prevent signature deletion
    const originalGetPermissions = annotationManager.getPermissions;
    annotationManager.getPermissions = function (annotation, action) {
      if (annotation.ToolName === "AnnotationCreateRubberStamp") {
        if (action === "delete") {
          return false; // Prevent deletion
        }
        if (action === "modify") {
          return false; // Prevent modifications
        }
      }
      return originalGetPermissions
        ? originalGetPermissions(annotation, action)
        : true;
    };
  };

  useEffect(() => {
    disableSignatureActions(Instance);
  }, [Instance]);

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
      <div className='documnetviewer'>
        <div className='webviewer' ref={viewer}></div>
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
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default ViewSignatureDocument;
