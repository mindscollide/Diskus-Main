import React, { useEffect } from "react";
import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { message, Upload } from "antd";
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

const Dragger = ({
  setProgress,
  handleFileDraggerUploadRequest,
  Icon,
  className,
}) => {
  const { Dragger } = Upload;

  return (
    <Dragger
      className={className}
      showUploadList={false}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
      customRequest={handleFileDraggerUploadRequest}
    >
      {Icon}
    </Dragger>
  );
};

export default Dragger;
