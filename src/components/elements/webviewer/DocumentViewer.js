import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./DocumentViwer.css";
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
} from "../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification, Loader } from "../index";
const DocumentViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const { webViewer } = useSelector((state) => state);
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
          // fullAPI: isPermission === 2 ? "viewer" : "editor",
          path: "/webviewer/lib",
          // initialDoc: webViewer.attachmentBlob,
          // extension: "pdf",
          licenseKey:
            "1693909073058:7c3553ec030000000025c35b7559d8f130f298d30d4b45c2bfd67217fd", // sign up to get a free trial key at https://dev.apryse.com
        },

        viewer.current
      ).then((instance) => {
        instance.UI.loadDocument(base64ToBlob(webViewer.attachmentBlob), {
          filename: fileName,
        });
        const { documentViewer, annotationManager, Annotations } =
          instance.Core;
        const annotManager = documentViewer.getAnnotationManager();

        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => {
              // save the annotations
              // const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              // const data = await doc.getFileData({
              //   // saves the document with annotations in it
              //   xfdfString,
              // });
              // const arr = new Uint8Array(data);
              // const blob = new Blob([arr], { type: "application/pdf" });

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
              //
              // console.log(
              //   "exportAnnotations",
              //   await annotationManager.exportAnnotations({
              //     links: false,
              //     widgets: false,
              //   })
              // );
            },
          });
        });

        //======================================== disable header =====================================//
        // if (isPermission) {
        try {
          console.log(isPermission, "isPermissionisPermissionisPermission");

          if (Number(isPermission) === 0) {
            //  Currently for all
            // instance.UI.disableElements([
            //   "thumbRotateClockwise",
            //   "toolsOverlay",
            //   "toolbarGroup-Shapes",
            //   "toolbarGroup-Edit",
            //   "toolbarGroup-Insert",
            //   "shapeToolGroupButton",
            //   "menuButton",
            //   "freeHandHighlightToolGroupButton",
            //   "underlineToolGroupButton",
            //   "freeHandToolGroupButton",
            //   "stickyToolGroupButton",
            //   "squigglyToolGroupButton",
            //   "strikeoutToolGroupButton",
            //   "notesPanel",
            //   "viewControlsButton",
            //   "selectToolButton",
            //   "toggleNotesButton",
            //   "searchButton",
            //   "freeTextToolGroupButton",
            //   "crossStampToolButton",
            //   "checkStampToolButton",
            //   "dotStampToolButton",
            //   "rubberStampToolGroupButton",
            //   "dateFreeTextToolButton",
            //   "eraserToolButton",
            //   "panToolButton",
            //   "signatureToolGroupButton",
            //   "viewControlsOverlay",
            //   "contextMenuPopup",
            //   "signatureFieldToolGroupButton"
            // ]);
          } else if (Number(isPermission) === 1) {
            console.log(isPermission, "isPermissionisPermissionisPermission");

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
          } else if (Number(isPermission) === 2) {
            //  Editor Role
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
              "signatureFieldToolGroupButton",
              "leftPanelButton",
            ]);
          } else if (Number(isPermission) === 3) {
            // Not Ediable
          }
        } catch (error) {
          console.log(error, "errorerrorerrorerrorerror");
        }

        // }
        // instance.UI.disableElements([
        //   "thumbRotateClockwise",
        //   "toolsOverlay",
        //   "toolbarGroup-Shapes",
        //   "toolbarGroup-Edit",
        //   "toolbarGroup-Insert",
        //   "shapeToolGroupButton",
        //   "menuButton",
        //   "freeHandHighlightToolGroupButton",
        //   "underlineToolGroupButton",
        //   "freeHandToolGroupButton",
        //   "stickyToolGroupButton",
        //   "squigglyToolGroupButton",
        //   "strikeoutToolGroupButton",
        //   "notesPanel",
        //   "viewControlsButton",
        //   "selectToolButton",
        //   "toggleNotesButton",
        //   "searchButton",
        //   "freeTextToolGroupButton",
        //   "crossStampToolButton",
        //   "checkStampToolButton",
        //   "dotStampToolButton",
        //   "rubberStampToolGroupButton",
        //   "dateFreeTextToolButton",
        //   "eraserToolButton",
        //   "panToolButton",
        //   "signatureToolGroupButton",
        //   "viewControlsOverlay",
        //   "contextMenuPopup",
        // ]);
        //======================================== disable header =====================================//

        documentViewer.addEventListener("documentLoaded", async () => {
          annotManager.setCurrentUser(name);
          const rectangleAnnot = new Annotations.RectangleAnnotation({
            PageNumber: 1,
            // values are in page coordinates with (0, 0) in the top left
            X: 100,
            Y: 150,
            Width: 200,
            Height: 50,
            Author: annotationManager.getCurrentUser(),
          });

          annotationManager.addAnnotation(rectangleAnnot);
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
