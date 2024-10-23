import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./pendingSignature.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClearMessageAnnotations } from "../../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification, Loader } from "../../../../components/elements/index";
import { Col, Row } from "react-bootstrap";
import {
  addUpdateFieldValueApi,
  clearWorkFlowResponseMessage,
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
} from "./pendingSIgnatureFunctions";
import { generateBase64FromBlob } from "../../../../commen/functions/generateBase64FromBlob";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const SignatureViewer = () => {
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
  const [participants, setParticipants] = useState([]);
  const [lastParticipants, setLastParticipants] = useState([]);
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
  const [removeXmlAfterFreetextHideDAta, setRemoveXmlAfterFreetextHideDAta] =
    useState([]);
  const userAnnotationsCopyData = useRef(userAnnotationsCopy);
  const selectedUserRef = useRef(selectedUser);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const removedAnnotationsRef = useRef(pdfResponceData.removedAnnotations);
  const participantsRef = useRef(participants);
  const removeXmlAfterHideDAtaRef = useRef(removeXmlAfterHideDAta);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);
  const removeXmlAfterFreetextHideDAtaRef = useRef(
    removeXmlAfterFreetextHideDAta
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
    removeXmlAfterFreetextHideDAtaRef.current = removeXmlAfterFreetextHideDAta;
  }, [removeXmlAfterFreetextHideDAta]);

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
    removeXmlAfterHideDAtaRef.current = removeXmlAfterHideDAta;
  }, [removeXmlAfterHideDAta]);
  // === End === //

  // === Api calling === //
  async function apiCall(Data) {
    await dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t));
    await dispatch(allAssignessList(navigate, t, false));
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
      try {
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
        let newProcessXmlForReadOnly = processXmlForReadOnly(
          getDataroomAnnotation.annotationString,
          ReadArray
        );

        // Process the XML to hide fields
        const { updatedXmlString, removedItems } = processXmlToHideFields(
          newProcessXmlForReadOnly,
          HideArray
        );

        setRemoveXmlAfterHideDAta(removedItems);
        const readonlyFreetextXmlString = readOnlyFreetextElements(
          updatedXmlString,
          readOnlyUsersRef.current
        );
        const { hideFreetextXmlString, removedHideFreetextElements } =
          hideFreetextElements(
            readonlyFreetextXmlString,
            hiddenUsersRef.current
          );
        setRemoveXmlAfterFreetextHideDAta(removedHideFreetextElements);
        setPdfResponceData((prevData) => ({
          ...prevData,
          xfdfData: hideFreetextXmlString,
          attachmentBlob: getDataroomAnnotation.attachmentBlob,
        }));
      } catch (error) {}
    }
  }, [getDataroomAnnotation]);
  // === End === //

  // === It's triggered when we update the blob file in our local state ===
  useEffect(() => {
    if (pdfResponceData.attachmentBlob !== "") {
      try {
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
            "colorPalette",
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
          ]);

          // Custom header buttons
          const handleClickDeclineBtn = () => {
            setReasonModal(true);
            // alert("Decline Button Clicked");
          };

          const handleClickSaveBtn = async () => {
            try {
              const xfdfString = await annotationManager.exportAnnotations(); // this doc send to add annotationfilesofattachment
              let currentUserID =
                localStorage.getItem("userID") !== null
                  ? Number(localStorage.getItem("userID"))
                  : 0;
              // this one sent do save signature document
              let HideArray = [];
              let ReadArray = [];

              // Iterate over each object in the data array
              await userAnnotationsRef.current.forEach((obj) => {
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
                        } else if (
                          readOnlyUsersRef.current.includes(obj.userID)
                        ) {
                          ReadArray.push(name);
                        }
                      });
                    }
                  });
                }
              });

              let newProcessXmlForReadOnly = await revertProcessXmlForReadOnly(
                xfdfString,
                ReadArray
              );

              const revertedHideFieldsXml = await revertProcessXmlToHideFields(
                newProcessXmlForReadOnly,
                removeXmlAfterHideDAtaRef.current
              );

              const afterAddReadOnlyFreetextElements =
                await revertReadOnlyFreetextElements(
                  revertedHideFieldsXml,
                  readOnlyUsersRef.current
                );

              const afterAddRevertHideFreetextElements =
                await revertHideFreetextElements(
                  afterAddReadOnlyFreetextElements,
                  removeXmlAfterFreetextHideDAtaRef.current
                );

              const parser = new DOMParser();
              const mainXmlDoc = parser.parseFromString(
                afterAddRevertHideFreetextElements,
                "text/xml"
              );

              function existsInMainXML(name, type, mainXmlDoc) {
                const elements = mainXmlDoc.querySelectorAll(
                  `${type}[name="${name}"]`
                );
                return elements.length > 0;
              }
              let covert = userAnnotationsRef.current.map((user) => {
                let filteredXml = user.xml.filter((item) => {
                  const ffieldDoc = parser.parseFromString(
                    item.ffield,
                    "text/xml"
                  );
                  const widgetDoc = parser.parseFromString(
                    item.widget,
                    "text/xml"
                  );
                  const ffieldName =
                    ffieldDoc.documentElement.getAttribute("name");
                  const widgetName =
                    widgetDoc.documentElement.getAttribute("name");

                  return (
                    existsInMainXML(ffieldName, "ffield", mainXmlDoc) &&
                    existsInMainXML(widgetName, "widget", mainXmlDoc)
                  );
                });

                return { ...user, xml: filteredXml };
              });
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

              // add annotation  of files attachment api
              let addAnnoatationofFilesAttachment = {
                FileID: Number(docWorkflowID),
                AnnotationString: afterAddRevertHideFreetextElements,
              };
              let userID =
                localStorage.getItem("userID") !== null
                  ? Number(localStorage.getItem("userID"))
                  : 0;
              let findActionBundleID = FieldsData.find(
                (actorData, index) => Number(actorData.userID) === userID
              );
              // Update Actor Bundle Status APi Call
              let UpdateActorBundle = {
                WorkFlowID: pdfResponceData.workFlowID,
                UserID: userID,
                WorkFlowActionableBundleID: findActionBundleID
                  ? findActionBundleID.pK_WorkFlowActionableBundle_ID
                  : 0,
              };

              let newData = { ActorsFieldValuesList: convertData };
              // console.log(
              //   newData,
              //   UpdateActorBundle,
              //   addAnnoatationofFilesAttachment,
              //   "handleClickSaveBtnhandleClickSaveBtn"
              // );

              dispatch(
                addUpdateFieldValueApi(
                  newData,
                  navigate,
                  t,
                  addAnnoatationofFilesAttachment,
                  "",
                  3,
                  "",
                  UpdateActorBundle
                )
              );
            } catch (error) {
              console.log(error, "handleClickSaveBtnhandleClickSaveBtn");
            }

            // try {
            //   const annots = await annotationManager.getAnnotationsList();
            //   if (annots && annots.length > 0) {
            //     // Log the annotations before deletion
            //     console.log("Annotations before deletion:", annots);

            //     // Process and delete annotations
            //     await annotationManager.deleteAnnotations(annots);

            //     // Log the annotations after deletion attempt
            //     console.log("Annotations after deletion:", annots);

            //     // Import new annotations
            //     await annotationManager.importAnnotations(
            //       afterAddRevertHideFreetextElements
            //     );

            //     // Redraw annotations
            //     annotationManager.redrawAnnotation(
            //       afterAddRevertHideFreetextElements
            //     );
            //   } else {
            //     console.error(
            //       "No annotations found or annotations list is empty."
            //     );
            //   }
            // } catch (error) {
            //   console.error("Error importing or drawing annotations:", error);
            //   // Handle
            // }
          };

          instance.UI.setHeaderItems((header) => {
            header.push({
              type: "customElement",
              render: () => {
                const textBoxButton = document.createElement("button");
                textBoxButton.textContent = "Decline";
                textBoxButton.style.background = "#fff";
                textBoxButton.style.border = "1px solid #e1e1e1";
                textBoxButton.style.color = "#5a5a5a";
                textBoxButton.style.padding = "8px 30px";
                textBoxButton.style.cursor = "pointer";
                textBoxButton.style.borderRadius = "4px";
                textBoxButton.onclick = handleClickDeclineBtn;
                return textBoxButton;
              },
            });

            header.push({
              type: "customElement",
              render: () => {
                const SaveButton = document.createElement("button");
                SaveButton.textContent = "Save";
                SaveButton.style.background = "#6172d6";
                SaveButton.style.color = "#fff";
                SaveButton.style.borderRadius = "4px";
                SaveButton.style.cursor = "pointer";
                SaveButton.style.padding = "8px 30px";
                SaveButton.style.margin = "10px 0 10px 10px";
                SaveButton.style.border = "1px solid #6172d6";
                SaveButton.onclick = handleClickSaveBtn;
                return SaveButton;
              },
            });
          });
        });
      } catch (error) {}
    }
  }, [pdfResponceData.attachmentBlob]);

  // ==== End ====//

  // this will generate my xfdf files for user base and send into AddUpdateFieldValue
  const updateXFDF = (action, xmlString, userSelectID, userAnnotations) => {
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
      setUserAnnotations(userAnnotations);
      // }
    } catch (error) {
      console.log(error);
    }
  };

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
      showMessage(ResponseMessage, "error", setOpen);
      dispatch(clearWorkFlowResponseMessage());
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
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
      {/* {Loading && <Loader />} */}
    </>
  );
};

export default SignatureViewer;
