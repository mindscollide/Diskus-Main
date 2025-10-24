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
    localStorage.removeItem("DataRoomOperations");
    localStorage.removeItem("NotificationClickFileID");
    localStorage.removeItem("NotificationClickFileName");
    localStorage.removeItem("DataRoomOperationsForFileEditorRights");
  };

  // Utility: Convert Base64 to Blob
  const base64ToBlob = (base64, mimeType) => {
    const binaryString = window.atob(base64);
    return new Blob(
      [new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)))],
      {
        type: mimeType,
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

  const getMimeTypeFromFileName = (fileName) => {
    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      txt: "text/plain",
      csv: "text/csv",
      doc: "application/msword",
      dot: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      docm: "application/vnd.ms-word.document.macroEnabled.12",
      dotm: "application/vnd.ms-word.template.macroEnabled.12",
      xls: "application/vnd.ms-excel",
      xlt: "application/vnd.ms-excel",
      xla: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
      xltm: "application/vnd.ms-excel.template.macroEnabled.12",
      xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
      xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      ppt: "application/vnd.ms-powerpoint",
      pot: "application/vnd.ms-powerpoint",
      pps: "application/vnd.ms-powerpoint",
      ppa: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
      ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
      pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
      potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
      ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
      mdb: "application/vnd.ms-access",
      // add more file types here
    };

    const fileExtension = fileName.split(".").pop().toLowerCase();
    return mimeTypes[fileExtension] || "application/octet-stream"; // default to binary stream if not found
  };
  const getFileExtension = (fileName) => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop() : ""; // Return the extension or an empty string if no extension
  };

  const supportedFormats = [
    "pdf",
    "webp",
    "svg",
    "png",
    "jpeg",
    "gif",
    "avif",
    "apng",
    "txt",
  ];

  // Initialize WebViewer
  useEffect(() => {
    if (pdfResponseData.attachmentBlob) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "1693909073058:7c3553ec030000000025c35b7559d8f130f298d30d4b45c2bfd67217fd", // Replace with your key
          fullAPI: true,
          officeEditor: true, // Enables Office file support
          officeWorker: true, // Enables Office file conversion
        },
        viewer.current
      )
        .then((instance) => {
          const { FitMode, setFitMode } = instance.UI;
          const {
            documentViewer,
            annotationManager,
            officeToPDFBuffer,
            SupportedFileFormats,
          } = instance.Core;

          const { CLIENT } = SupportedFileFormats;
          // Example usage:
          const extension = getFileExtension(fileName);

          const mimeType = getMimeTypeFromFileName(fileName);

          console.log(
            { mimeType, extension, CLIENT },
            "mimeTypemimeTypemimeType"
          );

          let blob = base64ToBlob(pdfResponseData.attachmentBlob, mimeType); // Convert Base64 to Blob

          // Check if the extension exists in the array (case-insensitive)
          if (CLIENT.includes(extension.toLowerCase())) {
            instance.UI.loadDocument(blob, {
              filename: fileName,
            });
          } else {
            showMessage(
              t("file_format_not_supported_for_preview"),
              "error",
              setOpen
            );
            return;
          }

          // Handle annotations
          // documentViewer.addEventListener("documentLoaded", () => {
          //   annotationManager.setCurrentUser(localStorage.getItem("name"));
          //   if (pdfResponseData.xfdfData) {
          //     documentViewer.setFitMode(FitMode.FitWidth);
          //     annotationManager.importAnnotations(pdfResponseData.xfdfData);
          //   }
          // });
          documentViewer.addEventListener("documentLoaded", () => {
            annotationManager.setCurrentUser(localStorage.getItem("name"));

            // ✅ Always fit to width on load
            setFitMode(FitMode.FitWidth);

            // ✅ Import annotations if XFDF exists
            if (pdfResponseData.xfdfData) {
              annotationManager.importAnnotations(pdfResponseData.xfdfData);
            }
          });

          // Set permissions if needed
          if (Number(isPermission) === 1 || Number(isPermission) === 3) {
            setPermissions(instance);
          }

          // Add custom save button
          instance.UI.setHeaderItems((header) => {
            header.push({
              type: "actionButton",
              img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
              onClick: async () => saveAnnotations(annotationManager),
            });
          });
        })
        .catch((error) => {
          console.error("WebViewer initialization error:", error);
        });
    }
  }, [pdfResponseData.attachmentBlob]);

  // Save Annotations
  const saveAnnotations = async (annotationManager) => {
    try {
      // Export annotations as XFDF
      const xfdfString = await annotationManager.exportAnnotations();
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
  }, [ResponseMessage]);

  return (
    <>
      <div className='document-viewer'>
        <div className='webviewer' ref={viewer}></div>
      </div>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default DocumentViewer;
