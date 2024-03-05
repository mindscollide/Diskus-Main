import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./signaturewebviewer.css";
import PlusSignSignatureFlow from "../../../assets/images/plus-sign-signatureflow.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
} from "../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification, Loader, Modal, Button, TextField } from "../index";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../assets/images/Icon material-delete.svg";
import Select from "react-select";
import {
  addUpdateFieldValueApi,
  createWorkflowApi,
  getWorkFlowByWorkFlowIdwApi,
  saveWorkflowApi,
} from "../../../store/actions/workflow_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
const SignatureViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { webViewer } = useSelector((state) => state);
  const {
    createSignatureResponse,
    saveWorkFlowResponse,
    getWorkfFlowByFileId,
  } = useSelector((state) => state.SignatureWorkFlowReducer);
  let name = localStorage.getItem("name");
  // Parse the URL parameters to get the data
  const pdfDataJson = new URLSearchParams(location.search).get("pdfData");
  const ApiResponse = new URLSearchParams(location.search).get(
    "createSignatureFlow"
  );

  console.log(webViewer, "ApiResponseApiResponseApiResponse");
  // Deserialize the JSON string into an object
  // const pdfData = JSON.parse(pdfDataJson);
  // const { taskId, attachmentID, fileName, commingFrom, isPermission, isNew } =
  //   pdfData;
  const { assignees } = useSelector((state) => state);
  const [Instance, setInstance] = useState();
  const [removeFlag, setRemoveFlag] = useState(false);
  const viewer = useRef(null);
  const [isNewFile, setIsFileNew] = useState(false);
  const [userList, setUserList] = useState([]);
  const [signerData, setSignerData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [openAddParticipentModal, setOpenAddParticipentModal] = useState(false);
  const [isButtonDisbale, setButtonDisabled] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
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
  console.log(pdfResponceData, "pdfResponceDatapdfResponceDatapdfResponceData");
  console.log(
    getWorkfFlowByFileId,
    "getWorkfFlowByFileIdgetWorkfFlowByFileIdgetWorkfFlowByFileId"
  );
  // { userID: "user1", xml: [] }
  const [userAnnotations, setUserAnnotations] = useState([]);

  const selectedUserRef = useRef(selectedUser);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const pdfResponceDataBLobRef = useRef(pdfResponceData.attachmentBlob);
  const removedAnnotationsRef = useRef(pdfResponceData.removedAnnotations);
  const participantsRef = useRef(participants);
  let documentID = Number(localStorage.getItem("documentID"));

  console.log(
    pdfResponceDataBLobRef,
    "pdfResponceDataBLobRefpdfResponceDataBLobRef"
  );
  useEffect(() => {
    if (ApiResponse !== null && ApiResponse !== undefined) {
      let Data = {
        FileID: Number(ApiResponse),
      };
      let Data2 = {
        FileID: Number(ApiResponse),
        UserID: Number(localStorage.getItem("userID")),
        OrganizationID: Number(localStorage.getItem("organizationID")),
      };
      dispatch(getAnnotationsOfDataroomAttachement(navigate, t, Data2));
      dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t));
      dispatch(allAssignessList(navigate, t));
      // let newApiData = JSON.parse(ApiResponse);
      // setPdfResponceData((prevData) => ({
      //   ...prevData,
      //   xfdfData: "",
      //   attachmentBlob: newApiData?.signatureDocument?.base64File,
      //   removedAnnotations: "",
      //   workFlowID: newApiData?.workFlow?.pK_WorkFlow_ID,
      //   documentID: newApiData?.signatureDocument.documentID,
      //   title: newApiData?.workFlow?.title,
      //   description: newApiData?.workFlow?.description,
      //   creationDateTime: newApiData?.workFlow?.creationDateTime,
      //   isDeadline: newApiData?.workFlow?.isDeadline,
      //   deadlineDatetime: newApiData?.workFlow?.deadlineDatetime,
      //   creatorID: newApiData?.workFlow?.creatorID,
      //   isCreator: newApiData?.workFlow?.isCreator,
      // }));
    }
  }, []);
  useEffect(() => {
    if (
      getWorkfFlowByFileId !== null &&
      getWorkfFlowByFileId !== undefined &&
      webViewer
    ) {
      let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;
      if (bundleModels?.length > 0) {
        let listOfUsers = [];
        let selectedUserList = [];
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
            selectedUserList.push({
              xml: [],
              userID: usersData.pK_UID,
            });
          });
        });
        setSignerData(signersData);
        setParticipants(listOfUsers);
        setSelectedUser(listOfUsers[0].pk_UID);
        setUserAnnotations(selectedUserList);
      } else {
        setOpenAddParticipentModal(true);
      }

      setPdfResponceData((prevData) => ({
        ...prevData,
        xfdfData: "",
        attachmentBlob: webViewer.attachmentBlob,
        removedAnnotations: "",
        workFlowID: getWorkfFlowByFileId?.workFlow?.workFlow.pK_WorkFlow_ID,
        documentID: Number(ApiResponse),
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
    }
  }, [getWorkfFlowByFileId]);
  useEffect(() => {
    if (webViewer !== null && webViewer !== undefined) {
      setPdfResponceData((prevData) => ({
        ...prevData,
        attachmentBlob: webViewer.attachmentBlob,
      }));
    }
  }, [webViewer]);

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

        // setAllPresenters(PresenterData);
      }
    } catch (error) {}
  }, [assignees.user]);
  console.log(
    saveWorkFlowResponse,
    "saveWorkFlowResponsesaveWorkFlowResponsesaveWorkFlowResponse"
  );
  useEffect(() => {
    try {
      if (saveWorkFlowResponse !== null) {
        let getUsers = saveWorkFlowResponse.workFlow;
        let listOfUsers = [];
        let selectedUserList = [];
        let signersData = [];

        getUsers.bundleModels.forEach((users, index) => {
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
            selectedUserList.push({
              xml: [],
              userID: usersData.pK_UID,
            });
          });
        });
        setSignerData(signersData);

        setParticipants(listOfUsers);
        setSelectedUser(listOfUsers[0].pk_UID);
        setUserAnnotations(selectedUserList);
      } else {
      }
    } catch (error) {
      console.log(error, "catchcatchcatchcatch");
    }
  }, [saveWorkFlowResponse]);

  function base64ToBlob(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: "application/pdf" });
  }

  function processXml(xmlString, id) {
    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Find the widget with the specified name attribute
    const widget = xmlDoc.querySelector(`widget[name="${id}"]`);

    if (widget) {
      // Find the corresponding ffield with the same name as the widget
      const ffield = xmlDoc.querySelector(
        `ffield[name="${widget.getAttribute("field")}"]`
      );

      if (ffield) {
        // Check if the ffield already has a flags attribute
        const flagsAttribute = ffield.getAttribute("flags");

        if (!flagsAttribute) {
          // If flags attribute does not exist, add it with value "ReadOnly"
          ffield.setAttribute("flags", "ReadOnly");
        } else {
          // If flags attribute exists, update its value to "ReadOnly"
          ffield.setAttribute("flags", "ReadOnly");
        }

        // Serialize the updated XML back to string
        const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
        return updatedXmlString;
      } else {
        return webViewer.xfdfData;
      }
    } else {
      return webViewer.xfdfData;
    }
  }

  // this function perom after rotating signature flow
  function filterFreetextElements(xmlString, currentUserID) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const freetextElements = xmlDoc.querySelectorAll("freetext");
    let removedAnnotations = ""; // Initialize as an empty string
    const serializer = new XMLSerializer();
    freetextElements.forEach((freetextElement) => {
      const subject = freetextElement.getAttribute("subject");
      const userIdIndex = subject.lastIndexOf("-");
      if (userIdIndex !== -1) {
        const userId = subject.substring(userIdIndex + 1);
        if (userId !== currentUserID) {
          // User ID doesn't match, remove the annotation
          removedAnnotations += serializer.serializeToString(freetextElement); // Concatenate the serialized string
          freetextElement.parentNode.removeChild(freetextElement);
        }
      }
    });

    // Serialize the modified XML back to a string
    const filteredXmlString = serializer.serializeToString(xmlDoc);
    return { filteredXmlString, removedAnnotations };
  }

  console.log("userAnnotations", userAnnotations);
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
    removedAnnotationsRef.current = pdfResponceData.removedAnnotations;
  }, [removedAnnotationsRef]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  const areAllAnnotationsEmpty = (userAnnotations) => {
    // Check if any user has non-empty xml array
    for (const user of userAnnotations) {
      if (Object.keys(user.xml).length > 0) {
        return false;
      }
    }
    return true;
  };

  // this will generate my xfdf files for user base and send into AddUpdateFieldValue
  const updateXFDF = (action, xmlString, userSelectID, userAnnotations) => {
    console.log("userAnnotations From auto", userSelect);
    let userSelect = parseInt(userSelectID);
    if (areAllAnnotationsEmpty(userAnnotations)) {
      console.log("annotationChanged From auto", userSelect);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      if (
        xmlDoc.getElementsByTagName("ffield").length > 0 &&
        xmlDoc.getElementsByTagName("widget").length > 0
      ) {
        const ffield = xmlDoc.getElementsByTagName("ffield")[0].outerHTML;
        const widget = xmlDoc.getElementsByTagName("widget")[0].outerHTML;
        setUserAnnotations((prevState) => {
          const updatedAnnotations = prevState.map((user) => {
            if (user.userID === userSelect) {
              return {
                ...user,
                xml: [{ ffield: ffield, widget: widget }],
              };
            }
            return user;
          });
          return updatedAnnotations;
        });
      }
    } else {
      // Iterate over each user's annotations
      console.log("userAnnotations From auto", userSelect);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      xmlDoc.querySelectorAll("widget").forEach((widget) => {
        const widgetName = widget.getAttribute("name");
        const ffieldName = widget.getAttribute("field");
        let widgetFound = false;
        userAnnotations.forEach((user) => {
          user.xml.forEach((xml) => {
            if (xml.widget.includes(widgetName)) {
              // Replace the ffield and widget with new values from the main XML
              xml.ffield = xmlDoc.querySelector(
                `ffield[name="${ffieldName}"]`
              ).outerHTML;
              xml.widget = widget.outerHTML;
              widgetFound = true;
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
    }
  };

  function addRemovedAnnotationsToMainXml(mainXmlString, removedAnnotations) {
    const parser = new DOMParser();
    const mainXmlDoc = parser.parseFromString(mainXmlString, "text/xml");
    const annotsNode = mainXmlDoc.querySelector("annots");

    if (annotsNode) {
      annotsNode.innerHTML += removedAnnotations;
      const serializer = new XMLSerializer();
      const updatedMainXmlString = serializer.serializeToString(mainXmlDoc);
      return updatedMainXmlString;
    } else {
      throw new Error("Main XML does not contain <annots> tag.");
    }
  }

  function updateFreetextCustomData(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const freetextElements = xmlDoc.querySelectorAll("freetext");

    freetextElements.forEach((freetextElement) => {
      const customDataElement =
        freetextElement.querySelector("trn-custom-data");
      if (customDataElement) {
        let bytesValue = customDataElement.getAttribute("bytes");
        if (bytesValue) {
          // Parse the existing bytes value
          let bytesObject = JSON.parse(
            decodeURIComponent(bytesValue.replace(/&quot;/g, '"'))
          );

          // Add or update the additional data
          bytesObject["trn-annot-no-resize"] = "true";
          bytesObject["trn-annot-no-move"] = "true";

          // Update the bytes attribute with the modified value
          customDataElement.setAttribute("bytes", JSON.stringify(bytesObject));
        }
      }
    });

    // Serialize the modified XML back to a string
    const serializer = new XMLSerializer();
    const updatedXmlString = serializer.serializeToString(xmlDoc);
    return updatedXmlString;
  }

  function removeSignatureAnnotationsFromXFDF(xfdfString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xfdfString, "text/xml");

    // Find all <ffield> elements with type="Sig" (signature fields) and remove them
    const ffieldElements = xmlDoc.querySelectorAll('ffield[type="Sig"]');
    ffieldElements.forEach((ffieldElement) => {
      const fieldName = ffieldElement.getAttribute("name");

      // Find the corresponding <widget> element and remove it
      const widgetElement = xmlDoc.querySelector(
        `widget[field="${fieldName}"]`
      );
      if (widgetElement) {
        widgetElement.parentNode.removeChild(widgetElement);
      }

      // Find the corresponding <field> element and remove it
      const fieldElement = xmlDoc.querySelector(`field[name="${fieldName}"]`);
      if (fieldElement) {
        fieldElement.parentNode.removeChild(fieldElement);
      }

      // Remove the <ffield> element itself
      ffieldElement.parentNode.removeChild(ffieldElement);

      // Check if the parent node of <ffield> has any other children
      const parentNode = ffieldElement.parentNode;
      if (parentNode && !parentNode.hasChildNodes()) {
        // If the parent node has no other children, remove the parent node (<pdf-info>)
        parentNode.parentNode.removeChild(parentNode);
      }
    });
    // Serialize the modified XML back to a string
    const serializer = new XMLSerializer();
    const modifiedXFDFString = serializer.serializeToString(xmlDoc);

    return modifiedXFDFString;
  }
  // function removeSignatureAnnotationsFromXFDF(xfdfString) {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(xfdfString, "text/xml");

  //   // Find all <freetext> elements and remove them
  //   const freetextElements = xmlDoc.querySelectorAll('freetext');
  //   freetextElements.forEach((freetextElement) => {
  //     // Remove the <freetext> element
  //     freetextElement.parentNode.removeChild(freetextElement);
  //   });

  //   // Check if the parent node of <freetext> has any other children
  //   freetextElements.forEach((freetextElement) => {
  //     const parentNode = freetextElement.parentNode;
  //     if (parentNode && !parentNode.hasChildNodes()) {
  //       // If the parent node has no other children, remove the parent node (<pdf-info>)
  //       parentNode.parentNode.removeChild(parentNode);
  //     }
  //   });

  //   // Serialize the modified XML back to a string
  //   const serializer = new XMLSerializer();
  //   const modifiedXFDFString = serializer.serializeToString(xmlDoc);

  //   return modifiedXFDFString;
  // }

  const publicFlow = async (annotationManager) => {
    try {
      let annotations = await annotationManager.exportAnnotations();
      console.log("All annotations: String", annotations);

      const modifiedXFDF = removeSignatureAnnotationsFromXFDF(annotations);
      console.log("All annotations: String after", modifiedXFDF);

      // Remove existing annotations
      const annots = annotationManager.getAnnotationsList();
      console.log("All annotations: String after annots", annots);

      // remove annotations
      annotationManager.deleteAnnotations(annots);

      // Import modified annotations
      annotationManager.importAnnotations(modifiedXFDF);

      // Redraw the viewer to reflect the changes
      annotationManager.redrawAnnotation();

      // const annotationsList = await annotationManager.getAnnotationsList();
      // console.log("All annotationsList:", annotationsList);

      // // Log the annotations to see what you're getting
      // console.log('All annotations:', annotations);
      // Filter out only the signature annotations
      // const signatureAnnotations = annotations.filter(
      //   (annotation) => annotation.Subject === "Signature"
      // );

      // // Log the filtered annotations to see if there are any
      // console.log('Signature annotations:', signatureAnnotations);

      // // Remove each signature annotation
      // signatureAnnotations.forEach((annotation) => {
      //   console.log('Deleting annotation:', annotation);
      //   annotationManager.deleteAnnotation(annotation);
      // });

      // Update the UI to reflect the changes
      // annotationManager.redrawAnnotation(modifiedXFDF);
      // annotationManager.importAnnotations(modifiedXFDF);

      // Optionally, you can update your state or dispatch an action here
      // to reflect the changes in your application's state or backend
    } catch (error) {
      console.error("Error clearing signature annotations:", error);
    }
  };

  // this is add user modal func
  const handleClickAdd = () => {
    if (signers.EmailAddress !== "" && signers.Name !== "") {
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
      // setOpen({
      //   message: "Please fill all options",
      //   open: true,
      // });
    }
  };

  // this is add user modal func for remove
  const handleRemoveSigner = (index) => {
    setSignerData((prevSignersData) => {
      return prevSignersData.filter((_, i) => i !== index);
    });
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if (pdfResponceData.attachmentBlob !== "") {
      let newData = JSON.parse(ApiResponse);
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
        instance.UI.loadDocument(base64ToBlob(pdfResponceData.attachmentBlob), {
          filename: pdfResponceData.title,
        });
        const {
          documentViewer,
          annotationManager,
          Annotations,
          PDFNet,
          Tools,
        } = instance.Core;
        //======================================== disable header =====================================//
        instance.UI.disableTools([Tools.disableTextSelection]);
        instance.UI.disableElements([
          "underlineToolGroupButton",
          // thiws is for popup disable
          // "annotationPopup",
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
        // Example handler for when the dropdown value changes
        const handleDropdownChange = (selectedValue) => {
          setSelectedUser(selectedValue);
          // userSelect = selectedValue;
        };
        const handleChangeUser = (event) => {
          console.log(
            event.target,
            "handleChangeUserhandleChangeUserhandleChangeUser"
          );
          setSelectedUser(event.target.value);
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
                  id="select-country"
                  data-live-search="true"
                  onChange={handleChangeUser}
                >
                  {participantsRef.current.map((userData, index) => {
                    return (
                      <option value={userData.pk_UID}>{userData.name}</option>
                    );
                  })}
                </select>

                {/* <Select /> */}
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
                  // className="w-100 d-flex justify-content-center align-items-center"
                >
                  Open Modal
                </button>
                {/* <Button text={"Open Custom Modal"} /> */}
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
                  Title
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
                  Name
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
                  Email
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
          // header.push({
          //   type: "actionButton",
          //   img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
          //   onClick: async () => {
          //     const xfdfString = await annotationManager.exportAnnotations();
          //     console.log("xfdfStringxfdf String", xfdfString);
          //     // Append removed annotations to xfdfString
          //     const updatedMainXmlString = addRemovedAnnotationsToMainXml(
          //       xfdfString,
          //       removedAnnotationsRef.current
          //     );
          //     console.log(
          //       "xfdfStringxfdf updatedMainXmlString",
          //       updatedMainXmlString
          //     );
          //     const updatedXml = updateFreetextCustomData(updatedMainXmlString);
          //     console.log("xfdfStringxfdf updatedXml", updatedXml);
          //     const doc = documentViewer.getDocument();
          //     const data = await doc.getFileData({}); // No xfdfString for annotations
          //     const arr = new Uint8Array(data);
          //     const blob = new Blob([arr], { type: "application/pdf" });
          //     generateBase64FromBlob(blob)
          //       .then((base64String) => {
          //         console.log(
          //           "xfdfStringxfdf PDF Base64 String:",
          //           base64String
          //         );
          //         // Here you can use the base64String as needed
          //       })
          //       .catch((error) => {
          //         console.error("Error generating base64 string:", error);
          //       });

          //     // Dispatch your Redux action to send the data to the API
          //     // if (Number(commingFrom) === 1) {
          //     //   const apiData = {
          //     //     TaskID: taskId, // Assuming taskId is defined in your component
          //     //     TaskAttachementID: attachmentID, // Assuming attachmentID is defined in your component
          //     //     AnnotationString: updatedMainXmlString, // Pass the annotations data here
          //     //   };
          //     //   // for todo
          //     //   dispatch(addAnnotationsOnToDoAttachement(navigate, t, apiData));
          //     // } else if (Number(commingFrom) === 2) {
          //     //   let notesData = {
          //     //     NoteID: taskId,
          //     //     NoteAttachementID: attachmentID,
          //     //     AnnotationString: updatedMainXmlString,
          //     //   };
          //     //   dispatch(
          //     //     addAnnotationsOnNotesAttachement(navigate, t, notesData)
          //     //   );
          //     //   // for notes
          //     // } else if (Number(commingFrom) === 3) {
          //     //   let resolutionData = {
          //     //     ResolutionID: taskId,
          //     //     ResolutionAttachementID: attachmentID,
          //     //     AnnotationString: updatedMainXmlString,
          //     //   };
          //     //   dispatch(
          //     //     addAnnotationsOnResolutionAttachement(
          //     //       navigate,
          //     //       t,
          //     //       resolutionData
          //     //     )
          //     //   );
          //     //   // for resultion
          //     // } else if (Number(commingFrom) === 4) {
          //     //   // for data room
          //     //   let dataRoomData = {
          //     //     FileID: attachmentID,
          //     //     AnnotationString: updatedMainXmlString,
          //     //   };

          //     //   dispatch(
          //     //     addAnnotationsOnDataroomAttachement(navigate, t, dataRoomData)
          //     //   );
          //     // }
          //   },
          // });
          // header.push({
          //   type: "actionButton",
          //   img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
          //   onClick: async () => {
          //     publicFlow(annotationManager);
          //   },
          // });
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
              textBoxButton.addEventListener("click", () => {
                const annotation = new Annotations.FreeTextAnnotation();
                annotation.PageNumber = documentViewer.getCurrentPage();
                annotation.X = 100;
                annotation.Y = 100;
                annotation.Width = 200;
                annotation.Height = 50;
                annotation.TextAlign = "center";
                annotation.TextVerticalAlign = "center";
                annotation.setContents("Title");
                annotation.Intent =
                  Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
                annotation.Subject = `Title-${selectedUserRef.current}`;

                // Add the annotation to the document
                annotationManager.addAnnotation(annotation);
                annotationManager.redrawAnnotation(annotation);
              });
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
              textBoxButton.addEventListener("click", () => {
                const annotation = new Annotations.FreeTextAnnotation();
                annotation.PageNumber = documentViewer.getCurrentPage();
                annotation.X = 100;
                annotation.Y = 100;
                annotation.Width = 200;
                annotation.Height = 50;
                annotation.TextAlign = "center";
                annotation.TextVerticalAlign = "center";
                annotation.setContents("Name");
                annotation.Intent =
                  Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
                annotation.Subject = `Name-${selectedUserRef.current}`;

                // Add the annotation to the document
                annotationManager.addAnnotation(annotation);
                annotationManager.redrawAnnotation(annotation);
              });
              return textBoxButton;
            },
          });

          header.push({
            type: "customElement",
            render: () => {
              const textBoxButton = document.createElement("button");
              textBoxButton.textContent = "Send";
              textBoxButton.style.background = "#6172d6";
              textBoxButton.style.color = "#fff";
              textBoxButton.style.padding = "8px 30px";
              textBoxButton.style.borderRadius = "4px";
              textBoxButton.style.cursor = "pointer";
              textBoxButton.style.margin = "10px 0 10px 10px";
              textBoxButton.style.border = "1px solid #6172d6";
              textBoxButton.addEventListener("click", () => {
                const annotation = new Annotations.FreeTextAnnotation();
                annotation.PageNumber = documentViewer.getCurrentPage();
                annotation.X = 100;
                annotation.Y = 100;
                annotation.Width = 200;
                annotation.Height = 50;
                annotation.TextAlign = "center";
                annotation.TextVerticalAlign = "center";
                annotation.TextColor = new Annotations.Color(255, 0, 0, 1);
                annotation.StrokeColor = new Annotations.Color(0, 255, 0, 1);
                annotation.setContents("Email");
                annotation.Intent =
                  Annotations.FreeTextAnnotation.Intent.FreeText; // Set the intent to FreeText
                annotation.Subject = `Email-${selectedUserRef.current}`;
                // Add the annotation to the document
                annotationManager.addAnnotation(annotation);
                annotationManager.redrawAnnotation(annotation);
              });
              return textBoxButton;
            },
          });
        });

        //======================================== header save button =====================================//

        //======================================== for documentLoaded =====================================//
        await documentViewer.getAnnotationsLoadedPromise();

        documentViewer.addEventListener("documentLoaded", async () => {
          if (webViewer.xfdfData !== "" && annotationManager) {
            try {
              console.log("importAnnotations");
              await annotationManager.importAnnotations(
                pdfResponceDataRef.current
              );
            } catch (error) {
              console.log("importAnnotations", error);
            }
          }
        });
        //======================================== for documentLoaded =====================================//
      });
    }
  }, [pdfResponceData.attachmentBlob]);

  useEffect(() => {
    if (Instance) {
      // Rerender the custom panel to reflect the updated participants
      Instance.UI.disableElement("customPanel");
      Instance.UI.enableElement("customPanel");
      Instance.UI.setActiveLeftPanel("customPanel");
    }
  }, [participants]);

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
            console.log("annotationChanged From auto", xfdfString);
            updateXFDF(
              action,
              xfdfString,
              selectedUserRef.current,
              userAnnotationsRef.current
            );
          } catch (error) {
            console.error("Error in annotationChanged event:", error);
          }
        }
      );
    }
  }, [Instance]);

  useEffect(() => {
    if (
      webViewer.ResponseMessage !== "" &&
      webViewer.ResponseMessage !== undefined
    ) {
      setOpen({
        ...open,
        message: webViewer.ResponseMessage,
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
  }, [webViewer.ResponseMessage]);

  const handleHideModal = () => {
    if (signerData.length > 0) {
      setOpenAddParticipentModal(false);
      setSignerData([]);
    } else {
      setOpen({
        ...open,
        message: "Data Must Required",
        open: true,
      });
    }
  };
  const filterFunc = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  const clickSaveSigners = async () => {
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
    dispatch(saveWorkflowApi(Data, navigate, t, setOpenAddParticipentModal));
  };
  const handleChangeFllName = (value) => {
    setSingerUserData(value);
    setSigners({
      ...signers,
      EmailAddress: value.email,
      UserID: value.value,
      Name: value.name,
    });
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
                    <Col sm={12} md={6} lg={6}>
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
                    <Col sm={12} md={6} lg={6}>
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
                      <Row>
                        {signerData.length > 0 &&
                          signerData.map((fieldsData, index) => {
                            return (
                              <>
                                <Col sm={12} md={11} lg={11} className="my-1">
                                  <Row>
                                    <Col sm={12} md={6} lg={6}>
                                      <TextField
                                        placeholder={t("Full-name")}
                                        labelClass={"inputlabel_style"}
                                        width={"100%"}
                                        applyClass={"signatureflow_input"}
                                        name={"Name"}
                                        type="text"
                                        disable={true}
                                        value={fieldsData.Name}
                                        label={"Name"}
                                      />
                                    </Col>
                                    <Col sm={12} md={6} lg={6}>
                                      <TextField
                                        width={"100%"}
                                        name={"EmailAddress"}
                                        type="email"
                                        disable={true}
                                        labelClass={"inputlabel_style"}
                                        applyClass={"signatureflow_input"}
                                        placeholder={t("Email")}
                                        value={fieldsData.EmailAddress}
                                        label={"Email"}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col
                                  sm={12}
                                  md={1}
                                  lg={1}
                                  className="my-1 d-flex align-items-end mb-3"
                                >
                                  <img
                                    src={DeleteIcon}
                                    className="cursor-pointer"
                                    onClick={() => handleRemoveSigner(index)}
                                    width={20}
                                  />
                                </Col>
                              </>
                            );
                          })}
                      </Row>
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
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end gap-2"
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
    </>
  );
};

export default SignatureViewer;
