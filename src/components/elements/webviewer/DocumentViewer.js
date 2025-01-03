import React, { useRef, useEffect, useState, useMemo } from "react";
import WebViewer from "@pdftron/webviewer";
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
import { showMessage } from "../snack_bar/utill";
import "./DocumentViwer.css";

const DocumentViewer = () => {
  const viewer = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use React Router's useLocation hook
  const { t } = useTranslation();

  // State Variables
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [pdfResponseData, setPdfResponseData] = useState({
    xfdfData: "",
    attachmentBlob: "",
  });

  // Redux Selectors
  const FileRemoveMQTT = useSelector(
    (state) => state.DataRoomReducer.FileRemoveMQTT
  );
  const { attachmentBlob, xfdfData, ResponseMessage } = useSelector(
    (state) => state.webViewer
  );

  // Memoized PDF Data
  const pdfData = useMemo(() => {
    const params = new URLSearchParams(location.search).get("pdfData");
    return JSON.parse(params || "{}");
  }, [location.search]);

  const { taskId, attachmentID, fileName, commingFrom, isPermission } = pdfData;

  // Utility: Clear Local Storage
  const clearLocalStorage = () => {
    [
      "DataRoomOperations",
      "NotificationClickFileID",
      "NotificationClickFileName",
      "DataRoomOperationsForFileEditorRights",
    ].forEach(localStorage.removeItem);
  };

  // Utility: Convert Base64 to Blob
  const base64ToBlob = (base64) => {
    const binaryString = window.atob(base64);
    return new Blob(
      [new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)))],
      {
        type: "application/pdf",
      }
    );
  };

  // Fetch Annotations
  useEffect(() => {
    const fetchAnnotations = () => {
      const actions = {
        1: getAnnotationsOfToDoAttachement,
        2: getAnnotationsOfNotesAttachement,
        3: getAnnotationsOfResolutionAttachement,
        4: getAnnotationsOfDataroomAttachement,
      };

      const data = {
        1: { TaskID: Number(taskId), TaskAttachementID: Number(attachmentID) },
        2: { NoteID: Number(taskId), NoteAttachementID: Number(attachmentID) },
        3: {
          ResolutionID: Number(taskId),
          ResolutionAttachementID: Number(attachmentID),
        },
        4: { FileID: attachmentID },
      };

      const action = actions[Number(commingFrom)];
      if (action) dispatch(action(navigate, t, data[Number(commingFrom)]));
    };

    if (taskId && attachmentID) fetchAnnotations();
    return clearLocalStorage;
  }, [dispatch, navigate, t, taskId, attachmentID, commingFrom]);

  // Handle File Removal via MQTT
  useEffect(() => {
    if (FileRemoveMQTT && Number(FileRemoveMQTT) === Number(attachmentID)) {
      window.close();
    }
  }, [FileRemoveMQTT, attachmentID]);

  // Update PDF Data
  useEffect(() => {
    if (attachmentBlob) {
      setPdfResponseData({ xfdfData, attachmentBlob });
    }
  }, [attachmentBlob, xfdfData]);
  // Initialize WebViewer
  useEffect(() => {
    if (pdfResponseData.attachmentBlob) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "1693909073058:7c3553ec030000000025c35b7559d8f130f298d30d4b45c2bfd67217fd", // Replace with your key
        },
        viewer.current
      ).then((instance) => {
        const { documentViewer, annotationManager } = instance.Core;

        // Load document
        console.log(
          "pdfResponseDatapdfResponseData",
          pdfResponseData.attachmentBlob
        );
        instance.UI.loadDocument(base64ToBlob(pdfResponseData.attachmentBlob), {
          filename: fileName,
        });

        // Handle annotations
        documentViewer.addEventListener("documentLoaded", () => {
          annotationManager.setCurrentUser(localStorage.getItem("name"));
          if (pdfResponseData.xfdfData) {
            console.log(
              "pdfResponseDatapdfResponseData",
              pdfResponseData.xfdfData
            );
            // annotationManager.importAnnotations(pdfResponseData.xfdfData);
            annotationManager.importAnnotationsAsync(pdfResponseData.xfdfData).then(() => {
              const annotations = annotationManager.getAnnotationsList();
            
              annotations.forEach((annot) => {
                if (annot.PageNumber > documentViewer.getPageCount()) {
                  annot.PageNumber = documentViewer.getPageCount(); // Adjust invalid pages
                }
              });
            
              annotationManager.redrawAnnotations();
            });
          }
        });

        // Set permissions if needed
        if (Number(isPermission) === 1) setPermissions(instance);

        // Add custom save button
        instance.UI.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: async () => saveAnnotations(annotationManager),
          });
        });
      });
    }
  }, [pdfResponseData, attachmentBlob, fileName, isPermission]);

  // Save Annotations
  const saveAnnotations = async (annotationManager) => {
    try {
      // Export annotations as XFDF
      const xfdfString = await annotationManager.exportAnnotations();
      console.log("pdfResponseDatapdfResponseData", xfdfString);

      // Prepare API data dynamically based on 'commingFrom'
      let apiData = { AnnotationString: xfdfString };

      switch (Number(commingFrom)) {
        case 1: // For To-Do
          apiData = {
            TaskID: taskId,
            TaskAttachementID: attachmentID,
            AnnotationString: xfdfString,
          };
          dispatch(addAnnotationsOnToDoAttachement(navigate, t, apiData));
          break;

        case 2: // For Notes
          apiData = {
            NoteID: taskId,
            NoteAttachementID: attachmentID,
            AnnotationString: xfdfString,
          };
          dispatch(addAnnotationsOnNotesAttachement(navigate, t, apiData));
          break;

        case 3: // For Resolution
          apiData = {
            ResolutionID: taskId,
            ResolutionAttachementID: attachmentID,
            AnnotationString: xfdfString,
          };
          dispatch(addAnnotationsOnResolutionAttachement(navigate, t, apiData));
          break;

        case 4: // For Data Room
          apiData = {
            FileID: attachmentID,
            AnnotationString: xfdfString,
          };
          dispatch(addAnnotationsOnDataroomAttachement(navigate, t, apiData));
          break;

        default:
          console.error("Invalid 'commingFrom' value:", commingFrom);
          break;
      }

      console.log("Annotations saved successfully!");
    } catch (error) {
      console.error("Failed to save annotations:", error);
    }
  };

  // Set Permissions
  const setPermissions = (instance) => {
    const disabledElements = [
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
    ];
    instance.UI.disableElements(disabledElements);
  };

  // Handle Notifications
  useEffect(() => {
    if (ResponseMessage) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(ClearMessageAnnotations());
    }
  }, [ResponseMessage, dispatch]);

  return (
    <>
      <div className="document-viewer">
        <div className="webviewer" ref={viewer}></div>
      </div>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default DocumentViewer;
