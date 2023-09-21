import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./DocumentViwer.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnnotationsOnToDoAttachement,
  getAnnotationsOfToDoAttachement,
} from "../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
const DocumentViewer = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const state = useSelector((state) => state);
  const { webViewer } = state;
  const viewer = useRef(null);
  let name = localStorage.getItem("name");
  // Parse the URL parameters to get the data
  const pdfDataJson = new URLSearchParams(location.search).get("pdfData");
  // Deserialize the JSON string into an object
  const pdfData = JSON.parse(pdfDataJson);
  const { taskId, attachmentID, fileName } = pdfData;
  const [pdfResponceData, setPdfResponceData] = useState({
    xfdfData: "",
    attachmentBlob: "",
  });

  useEffect(() => {
    if (taskId && attachmentID) {
      let data = {
        TaskID: Number(taskId),
        TaskAttachementID: Number(attachmentID),
      };

      dispatch(getAnnotationsOfToDoAttachement(navigate, t, data));
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
              const apiData = {
                TaskID: taskId, // Assuming taskId is defined in your component
                TaskAttachementID: attachmentID, // Assuming attachmentID is defined in your component
                AnnotationString: xfdfString, // Pass the annotations data here
              };

              // Dispatch your Redux action to send the data to the API
              dispatch(addAnnotationsOnToDoAttachement(navigate, t, apiData));
              // console.log("exportAnnotationsDocument saved successfully:", blob);
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

  return (
    <div className="documnetviewer">
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default DocumentViewer;
