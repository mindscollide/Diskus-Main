import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./DocumentViwer.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ClearMessageAnnotations,
  addAnnotationsOnDataroomAttachement,
  addAnnotationsOnNotesAttachement,
  addAnnotationsOnResolutionAttachement,
  addAnnotationsOnToDoAttachement,
  getAnnotationsOfDataroomAttachement,
  getAnnotationsOfNotesAttachement,
  getAnnotationsOfResolutionAttachement,
  getAnnotationsOfToDoAttachement,
} from "../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification } from "../index";
const DocumentViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { webViewer, DataRoomReducer } = useSelector((state) => state);
  const viewer = useRef(null);
  let name = localStorage.getItem("name");
  // Parse the URL parameters to get the data
  const pdfDataJson = new URLSearchParams(location.search).get("pdfData");

  // Deserialize the JSON string into an object
  const pdfData = JSON.parse(pdfDataJson);

  const { taskId, attachmentID, fileName, commingFrom, isPermission } = pdfData;

  const [pdfResponceData, setPdfResponceData] = useState({
    xfdfData: "",
    attachmentBlob: "",
  });

  useEffect(() => {
    if (taskId && attachmentID) {
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

  // Remove File MQTT
  useEffect(() => {
    if (DataRoomReducer.FileRemoveMQTT !== null) {
      try {
        let fileID = Number(DataRoomReducer.FileRemoveMQTT);
        if (Number(attachmentID) === fileID) {
          window.close();
        }
      } catch (error) {
        console.log(error, "datadatadata");
      }
    }
  }, [DataRoomReducer.FileRemoveMQTT]);

  useEffect(() => {
    if (webViewer.attachmentBlob) {
      setPdfResponceData({
        ...pdfResponceData,
        xfdfData: webViewer.xfdfData,
        pdfUrls: webViewer.attachmentBlob,
      });
    }
  }, [webViewer.xfdfData, webViewer.attachmentBlob]);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    if (webViewer.xfdfData || webViewer.attachmentBlob) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "1693909073058:7c3553ec030000000025c35b7559d8f130f298d30d4b45c2bfd67217fd", // sign up to get a free trial key at https://dev.apryse.com
        },

        viewer.current
      ).then((instance) => {
        instance.UI.loadDocument(base64ToBlob(webViewer.attachmentBlob), {
          filename: fileName,
        });
        const { documentViewer, annotationManager } = instance.Core;
        const annotManager = documentViewer.getAnnotationManager();

        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              // save the annotations
              const xfdfString = await annotationManager.exportAnnotations();

              // Dispatch your Redux action to send the data to the API
              if (Number(commingFrom) === 1) {
                const apiData = {
                  TaskID: taskId, // Assuming taskId is defined in your component
                  TaskAttachementID: attachmentID, // Assuming attachmentID is defined in your component
                  AnnotationString: xfdfString, // Pass the annotations data here
                };
                // for todo
                dispatch(addAnnotationsOnToDoAttachement(navigate, t, apiData));
              } else if (Number(commingFrom) === 2) {
                let notesData = {
                  NoteID: taskId,
                  NoteAttachementID: attachmentID,
                  AnnotationString: xfdfString,
                };
                dispatch(
                  addAnnotationsOnNotesAttachement(navigate, t, notesData)
                );
                // for notes
              } else if (Number(commingFrom) === 3) {
                let resolutionData = {
                  ResolutionID: taskId,
                  ResolutionAttachementID: attachmentID,
                  AnnotationString: xfdfString,
                };
                dispatch(
                  addAnnotationsOnResolutionAttachement(
                    navigate,
                    t,
                    resolutionData
                  )
                );
                // for resultion
              } else if (Number(commingFrom) === 4) {
                // for data room
                let dataRoomData = {
                  FileID: attachmentID,
                  AnnotationString: xfdfString,
                };

                dispatch(
                  addAnnotationsOnDataroomAttachement(navigate, t, dataRoomData)
                );
              }
              // );
            },
          });
        });

        //======================================== disable header =====================================//
        // if (isPermission) {
        try {
          if (Number(isPermission) === 1) {
            //  for Viewer
            instance.UI.disableElements([
              "thumbRotateClockwise",
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
              "header",
            ]);
          } else if (Number(isPermission) === 3) {
            // Not Ediable
          } else if (Number(isPermission) === 1 || Number(isPermission) === 2) {
          }
        } catch (error) {
          console.log(error);
        }

        //======================================== disable header =====================================//

        documentViewer.addEventListener("documentLoaded", async () => {
          annotManager.setCurrentUser(name);

          // annotationManager.addAnnotation(rectangleAnnot);
          // need to draw the annotation otherwise it won't show up until the page is refreshed

          if (webViewer.xfdfData !== "") {
            annotManager.importAnnotations(webViewer.xfdfData);
            annotationManager.redrawAnnotation(webViewer.xfdfData);
          }
        });
      });
    }
  }, [webViewer.xfdfData, webViewer.attachmentBlob]);

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
  return (
    <>
      <div className="documnetviewer">
        <div className="webviewer" ref={viewer}></div>
      </div>
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
    </>
  );
};

export default DocumentViewer;
