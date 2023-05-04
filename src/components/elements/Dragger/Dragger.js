import React, { useEffect } from "react";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ChevronDown } from "react-bootstrap-icons";
import Cancellicon from "../../../assets/images/Delete-ChatFeature-Icon.png";
import { useTranslation } from "react-i18next";
import PDFfileICon from "../../../assets/images/337946.svg";
import { Progress, Space, Tooltip } from "antd";
import styles from "./Dragger.module.css";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
const Dragger = ({
  setShowbarupload,
  progress,
  setProgress,
  setUploadCounter,
  uploadCounter,
  setRemainingTime,
  remainingTime,
  Icon,
}) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [data, setData] = useState([]);
  const { uploadReducer } = useSelector((state) => state);

  //   const props = {
  //     name: "file",
  //     multiple: true,
  //     // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //     showUploadList: false,
  //     onChange(data) {
  //       dispatch(FileUploadToDo(data.file.originFileObj, t));
  //       // setTasksAttachments([...tasksAttachments]);
  //       console.log(data, "propsprops");
  //       const { status } = data.file;
  //       console.log(status, "propsprops");
  //       if (status !== "uploading") {
  //         console.log(data.file.originFileObj, "propsprops");
  //         // setTasksAttachments(data.fileList);
  //         setShowupload(false);
  //       } else {
  //         console.log(status, "propsprops");

  //         setShowupload(true);
  //       }
  //       if (status === "done") {
  //         setShowupload(false);
  //         console.log(status, "propsprops");
  //         // message.success(
  //         //   `${data.file.originFileObj} file uploaded successfully.`
  //         // );

  //         // setTasksAttachments(data.fileList);
  //         // setShowupload(false);
  //       } else if (status === "error") {
  //         // message.error(`${data.file.originFileObj} file upload failed.`);
  //         setShowupload(true);
  //       }
  //     },
  //     onDrop(e) {
  //       console.log("propsprops", e.dataTransfer.files);
  //     },
  //     customRequest() {},
  //   };

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      console.log("statusstatusstatus", info.file.name, info.fileList);

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        setShowbarupload(false);
      } else {
        setShowbarupload(true);
      }
      if (status === "done") {
        setShowbarupload(false);

        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        setShowbarupload(false);

        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  //   useEffect(() => {
  //     setTasksAttachments([]);
  //     dispatch(FileUploadToDo(data, t));
  //   }, []);

  //   useEffect(() => {
  //     if (uploadReducer.uploadDocumentsList !== null) {
  //       tasksAttachments.push({
  //         DisplayAttachmentName:
  //           uploadReducer.uploadDocumentsList.displayFileName,
  //         OriginalAttachmentName:
  //           uploadReducer.uploadDocumentsList.originalFileName,
  //       });
  //       setTasksAttachments([...tasksAttachments]);
  //       setShowbarupload(true);
  //     }
  //   }, [uploadReducer.uploadDocumentsList]);

  const handleCustomRequest = ({ file }) => {
    setUploadCounter(uploadCounter + 1);
    dispatch(
      FileUploadToDo(
        file,
        t,
        setProgress,
        setUploadCounter,
        uploadCounter,
        setRemainingTime,
        remainingTime
      )
    );
  };

  return (
    <Dragger
      {...props}
      customRequest={handleCustomRequest}
      showUploadList={false}
      onProgress={(progress) => setProgress(progress.percent)}
    >
      {Icon}
    </Dragger>
  );
};

export default Dragger;
