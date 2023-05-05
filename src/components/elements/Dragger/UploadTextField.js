import React, { useEffect } from "react";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { Button, message, Upload } from "antd";
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
const UploadTextField = ({
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
      } else if (status === "error") {
        setShowbarupload(false);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleCustomRequest = ({ file }) => {
    console.log("handleCustomRequest", file);
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
    // <Dragger
    //   {...props}
    //   customRequest={handleCustomRequest}
    //   showUploadList={false}
    //   onProgress={(progress) => setProgress(progress.percent)}
    // >
    //   {Icon}
    // </Dragger>
    <Upload
      {...props}
      onChange={handleCustomRequest}
      showUploadList={false}
      onProgress={(progress) => setProgress(progress.percent)}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadTextField;
