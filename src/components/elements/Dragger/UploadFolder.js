import React, { useEffect } from "react";
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
const UploadDataFolder = ({
  setProgress,
  title,
  customRequestFolderUpload
}) => {

  return (
    <Upload
      directory
      showUploadList={false}
      customRequest={customRequestFolderUpload}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadDataFolder;
