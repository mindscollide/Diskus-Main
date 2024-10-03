import React from "react";
import styles from "./attachment.module.css";
import { Row, Col } from "react-bootstrap";
import DownloadImg from "../../../assets/images/download.png";
import EyeIcon from "../../../assets/images/newElements/eyeIcon.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";

import {
  getFileExtension,
  getIconSource,
} from "../../../container/DataRoom/SearchFunctionality/option";
import { Tooltip } from "antd";
const AttachmentViewer = ({
  handleClickDownload,
  handleEyeIcon,
  name,
  handleClickRemove,
  id = 1,
  data,
  fk_UID = 1049,
}) => {
  let fileExtension = ["pdf", "doc", "docx", "xls", "xlsx"].includes(
    getFileExtension(name)
  );
  let currentUser = Number(localStorage.getItem("userID"));

  return (
    <div className={styles["agendaFileAttachedView"]}>
      <Row>
        <Col
          lg={id !== 0 ? 8 : 12}
          md={id !== 0 ? 8 : 12}
          sm={id !== 0 ? 8 : 12}
        >
          <div
            className={
              id !== 0
                ? styles["fileNameTruncateStyle"]
                : styles["fileNameTruncateStyle_fullwidth"]
            }
          >
            <img
              draggable={false}
              src={getIconSource(getFileExtension(name))}
              alt=""
              width={20}
              height={20}
            />
            <span
              className={
                ["pdf", "doc", "docx", "xls", "xlsx"].includes(fileExtension)
                  ? styles["fileNameAttachment"]
                  : styles["fileNameAttachmentNotOpened"]
              }
            >
              <Tooltip placement="topLeft" title={name}>
                {name}
              </Tooltip>
            </span>
          </div>
        </Col>
        {id !== 0 && (
          <Col
            lg={2}
            md={2}
            sm={12}
            className={`${styles["borderFileName"]} p-0`}
          >
            <img
              draggable={false}
              src={DownloadImg}
              alt=""
              onClick={handleClickDownload}
            />
          </Col>
        )}
        {id !== 0 && (
          <Col lg={2} md={2} sm={12} className="p-0">
            <img
              draggable={false}
              src={EyeIcon}
              alt=""
              className="mx-1"
              onClick={handleEyeIcon}
            />
          </Col>
        )}
      </Row>
      {currentUser === Number(fk_UID) && (
        <img
          src={CrossIcon}
          alt=""
          className={styles["Cross_Icon"]}
          onClick={handleClickRemove}
        />
      )}
    </div>
  );
};

export default AttachmentViewer;
