import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./signaturewebviewer.css";
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
import DeleteIcon from "../../../assets/images/delete_dataroom.svg";
import Select from "react-select";
const SignatureViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [openAddParticipentModal, setOpenAddParticipentModal] = useState(false);
  const { webViewer } = useSelector((state) => state);
  const viewer = useRef(null);
  const [signersData, setSignersData] = useState([
    {
      Name: "",
      EmailAddress: "",
    },
  ]);
  const [isButtonDisbale, setButtonDisabled] = useState(false);
  let name = localStorage.getItem("name");
  // Parse the URL parameters to get the data
  const pdfDataJson = new URLSearchParams(location.search).get("pdfData");
  // Deserialize the JSON string into an object
  const pdfData = JSON.parse(pdfDataJson);
  const { taskId, attachmentID, fileName, commingFrom, isPermission } = pdfData;
  const [pdfResponceData, setPdfResponceData] = useState({
    xfdfData: "",
    attachmentBlob: "",
    removedAnnotations: "",
  });
  const [userAnnotations, setUserAnnotations] = useState([
    { userID: "user1", xml: [] },
    { userID: "user2", xml: [] },
  ]);

  const [selectedUser, setSelectedUser] = useState("user1");

  useEffect(() => {
    if (taskId && attachmentID) {
      console.log("test", { taskId, attachmentID });
      if (Number(commingFrom) === 1) {
        let data = {
          TaskID: Number(taskId),
          TaskAttachementID: Number(attachmentID),
        };
        // for todo
        dispatch(getAnnotationsOfToDoAttachement(navigate, t, data));
      } else if (Number(commingFrom) === 2) {
        let notesData = {
          NoteID: Number(taskId),
          NoteAttachementID: Number(attachmentID),
        };
        console.log("test", { commingFrom, notesData });
        dispatch(getAnnotationsOfNotesAttachement(navigate, t, notesData));
        // for notes
      } else if (Number(commingFrom) === 3) {
        let resolutionData = {
          ResolutionID: Number(taskId),
          ResolutionAttachementID: Number(attachmentID),
        };
        dispatch(
          getAnnotationsOfResolutionAttachement(navigate, t, resolutionData)
        );
        // for resultion
      } else if (Number(commingFrom) === 4) {
        // for data room
        let dataRoomData = {
          FileID: attachmentID,
        };
        dispatch(
          getAnnotationsOfDataroomAttachement(navigate, t, dataRoomData)
        );
      }
    }
  }, []);

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
  useEffect(() => {
    if (webViewer.attachmentBlob) {
      let value = "250486b9-711b-3bfa-3457-8d6ff0f35044";
      let xmlNew = processXml(webViewer.xfdfData, value);
      const currentUserID = "user1";
      const { filteredXmlString, removedAnnotations } = filterFreetextElements(
        xmlNew,
        currentUserID
      );
      setPdfResponceData((prevData) => ({
        ...prevData,
        xfdfData: filteredXmlString,
        pdfUrls: webViewer.attachmentBlob,
        removedAnnotations: removedAnnotations,
      }));
    }
  }, [webViewer.attachmentBlob]);
  console.log("annotationChanged pdfResponceData", pdfResponceData);

  const selectedUserRef = useRef(selectedUser);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const removedAnnotationsRef = useRef(pdfResponceData.removedAnnotations);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
    userAnnotationsRef.current = userAnnotations;
    pdfResponceDataRef.current = pdfResponceData.xfdfData;
    removedAnnotationsRef.current = pdfResponceData.removedAnnotations;
  }, [selectedUser, userAnnotations, pdfResponceData, removedAnnotationsRef]);

  const [Instance, setInstance] = useState();
  const [removeFlag, setRemoveFlag] = useState(false);
  const areAllAnnotationsEmpty = (userAnnotations) => {
    // Check if any user has non-empty xml array
    for (const user of userAnnotations) {
      if (Object.keys(user.xml).length > 0) {
        return false;
      }
    }
    return true;
  };

  const updateXFDF = (action, xmlString, userSelect, userAnnotations) => {
    if (areAllAnnotationsEmpty(userAnnotations)) {
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
  const allValuesNotEmpty = signersData.every(
    (item) => item.EmailAddress !== "" && item.Name !== ""
  );
  const handleClickAdd = () => {
    if (allValuesNotEmpty) {
      setSignersData((prevSignersData) => [
        ...prevSignersData,
        { Name: "", EmailAddress: "" },
      ]);
    } else {
      setOpen({
        message: "Please fill all options",
        open: true,
      });
    }
  };

  const handleRemoveSigner = (index) => {
    setSignersData((prevSignersData) => {
      return prevSignersData.filter((_, i) => i !== index);
    });
  };

  const handleupdateFieldData = (event, index) => {
    setSignersData((prevSignersData) => {
      return prevSignersData.map((data, dataindex) => {
        if (index === dataindex) {
          return {
            ...data,
            [event.target.name]: event.target.value,
          };
        }
        return data;
      });
    });
  };
  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if (webViewer.attachmentBlob) {
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
        instance.UI.loadDocument(base64ToBlob(webViewer.attachmentBlob), {
          filename: fileName,
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

        const openCustomModal = () => {
          setOpenAddParticipentModal(true); // Open the custom modal
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
                >
                  <option
                    style={{
                      width: "100%",
                      padding: "12px 5px",
                      margin: "8px 0",
                    }}
                    data-tokens="china"
                  >
                    China
                  </option>
                  <option
                    style={{
                      width: "100%",
                      padding: "12px 5px",
                      margin: "8px 0",
                    }}
                    data-tokens="malayasia"
                  >
                    Malayasia
                  </option>
                  <option
                    style={{
                      width: "100%",
                      padding: "12px 5px",
                      margin: "8px 0",
                    }}
                    data-tokens="singapore"
                  >
                    Singapore
                  </option>
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
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              const xfdfString = await annotationManager.exportAnnotations();
              console.log("xfdfStringxfdf String", xfdfString);
              // Append removed annotations to xfdfString
              const updatedMainXmlString = addRemovedAnnotationsToMainXml(
                xfdfString,
                removedAnnotationsRef.current
              );
              console.log(
                "xfdfStringxfdf updatedMainXmlString",
                updatedMainXmlString
              );
              const updatedXml = updateFreetextCustomData(updatedMainXmlString);
              console.log("xfdfStringxfdf updatedXml", updatedXml);
              const doc = documentViewer.getDocument();
              const data = await doc.getFileData({}); // No xfdfString for annotations
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: "application/pdf" });
              generateBase64FromBlob(blob)
                .then((base64String) => {
                  console.log(
                    "xfdfStringxfdf PDF Base64 String:",
                    base64String
                  );
                  // Here you can use the base64String as needed
                })
                .catch((error) => {
                  console.error("Error generating base64 string:", error);
                });

              // Dispatch your Redux action to send the data to the API
              // if (Number(commingFrom) === 1) {
              //   const apiData = {
              //     TaskID: taskId, // Assuming taskId is defined in your component
              //     TaskAttachementID: attachmentID, // Assuming attachmentID is defined in your component
              //     AnnotationString: updatedMainXmlString, // Pass the annotations data here
              //   };
              //   // for todo
              //   dispatch(addAnnotationsOnToDoAttachement(navigate, t, apiData));
              // } else if (Number(commingFrom) === 2) {
              //   let notesData = {
              //     NoteID: taskId,
              //     NoteAttachementID: attachmentID,
              //     AnnotationString: updatedMainXmlString,
              //   };
              //   dispatch(
              //     addAnnotationsOnNotesAttachement(navigate, t, notesData)
              //   );
              //   // for notes
              // } else if (Number(commingFrom) === 3) {
              //   let resolutionData = {
              //     ResolutionID: taskId,
              //     ResolutionAttachementID: attachmentID,
              //     AnnotationString: updatedMainXmlString,
              //   };
              //   dispatch(
              //     addAnnotationsOnResolutionAttachement(
              //       navigate,
              //       t,
              //       resolutionData
              //     )
              //   );
              //   // for resultion
              // } else if (Number(commingFrom) === 4) {
              //   // for data room
              //   let dataRoomData = {
              //     FileID: attachmentID,
              //     AnnotationString: updatedMainXmlString,
              //   };

              //   dispatch(
              //     addAnnotationsOnDataroomAttachement(navigate, t, dataRoomData)
              //   );
              // }
            },
          });
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              publicFlow(annotationManager);
            },
          });
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
  }, [webViewer.attachmentBlob]);

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
    setOpenAddParticipentModal(false);
    setSignersData([
      {
        Name: "",
        EmailAddress: "",
      },
    ]);
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
                <Col lg={12} md={12} xs={12} sm={12} className="signersList">
                  <Row className="d-flex align-items-center">
                    {signersData.map((fieldsData, index) => {
                      return (
                        <>
                          <Col sm={12} md={11} lg={11} className="my-1">
                            <Row>
                              <Col sm={12} md={6} lg={6}>
                                <TextField
                                  placeholder="Name"
                                  labelClass={"inputlabel_style"}
                                  width={"100%"}
                                  name={"Name"}
                                  type="text"
                                  value={fieldsData.Name}
                                  label={"Name"}
                                  change={(e) =>
                                    handleupdateFieldData(e, index)
                                  }
                                />
                              </Col>
                              <Col sm={12} md={6} lg={6}>
                                <TextField
                                  width={"100%"}
                                  name={"EmailAddress"}
                                  type="email"
                                  labelClass={"inputlabel_style"}
                                  placeholder="E-mail Address"
                                  value={fieldsData.EmailAddress}
                                  label={"Email"}
                                  change={(e) =>
                                    handleupdateFieldData(e, index)
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            sm={12}
                            md={1}
                            lg={1}
                            className="d-flex justify-content-start align-items-center"
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
                <Col lg={12} md={12} xs={12} sm={12}>
                  <Button
                    className="addOther_field"
                    text={"Add another signer"}
                    onClick={handleClickAdd}
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
                  onClick={() => setOpenAddParticipentModal(false)}
                />
                <Button
                  className={"Add"}
                  text={t("Add")}
                  // onClick={()=>setOpenAddParticipentModal(false)}
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