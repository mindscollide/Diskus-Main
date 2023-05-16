import React, { useEffect } from "react";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { Button, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ChevronDown } from "react-bootstrap-icons";
import Cancellicon from "../../../assets/images/Delete-ChatFeature-Icon.png";
import { useTranslation } from "react-i18next";
import PDFfileICon from "../../../assets/images/pdf_icon.svg";
import { Progress, Space, Tooltip } from "antd";
import styles from "./Dragger.module.css";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { uploadDocumentsApi } from "../../../store/actions/DataRoom_actions";
const UploadFile = ({
  setShowbarupload,
  progress,
  setProgress,
  setUploadCounter,
  uploadCounter,
  setRemainingTime,
  remainingTime,
  Icon,
  title,
}) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [data, setData] = useState([]);
  const { uploadReducer } = useSelector((state) => state);

  const props = {
    name: "file",
    multiple: true,
    // onbeforeunload(file) {
    //   console.log(file, "statusstatusstatusstatusstatusstatus")
    // },
    onChange(info) {
      const { status } = info.file;
      console.log("statusstatusstatus", info.file)

      try {
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
          setShowbarupload(false);
        } else {
          setShowbarupload(true);
        }
        if (info.file.status === 'done') {
          setShowbarupload(false);
        } else if (info.file.status === 'error') {
          setShowbarupload(false);
        }
      } catch (e) {
        setShowbarupload(false);
      }


    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };


  return (
    <Upload
      {...props}
      // maxCount={1}
      // onChange={handleCustomRequest}
      showUploadList={false}
      onProgress={(progress) => setProgress(progress.percent)}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadFile;
