import React from "react";
import styles from "./attachment.module.css";
import "./attachment.css";
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
  isQuickMeeting = false,
}) => {
  let fileExtension = ["pdf", "doc", "docx", "xls", "xlsx"].includes(
    getFileExtension(name)
  );
  let getfileExtensionName = getFileExtension(name);
  let currentUser = Number(localStorage.getItem("userID"));

  return (
    <div className='document-container d-flex align-items-center justify-content-center mt-2 position-relative '>
      <div
        className={`${
          id !== 0 ? "document-card" : "document-card-none"
        } d-flex align-items-center'`}>
        <div className='d-flex align-items-center flex-grow-1 overflow-hidden mx-2'>
          <div className='icon-container me-2'>
            <img
              draggable={false}
              src={getIconSource(getFileExtension(name))}
              alt=''
              width={20}
              height={20}
            />
          </div>
          <Tooltip placement='top' showArrow={false} title={name}>
            <span className='document-name fw-medium text-truncate'>
              {name}
            </span>
          </Tooltip>
        </div>

        <div className='d-flex align-items-center'>
          {id !== 0 && (
            <>
              <div className='divider mx-1' />
              <button className='action-button' aria-label='Download document'>
                <img
                  draggable={false}
                  src={DownloadImg}
                  alt=''
                  onClick={handleClickDownload}
                />
              </button>
            </>
          )}
          {id !== 0 &&
            getfileExtensionName !== "txt" &&
            getfileExtensionName !== "pptx" && (
              <>
                <div className='divider mx-1'></div>
                <button className='action-button' aria-label='View document'>
                  {/* <Eye size={20} /> */}
                  <img
                    draggable={false}
                    src={EyeIcon}
                    alt=''
                    onClick={handleEyeIcon}
                  />
                </button>
              </>
            )}
        </div>
      </div>
      {currentUser === Number(fk_UID) && (
        <img
          src={CrossIcon}
          alt=''
          className={styles["Cross_Icon"]}
          onClick={handleClickRemove}
        />
      )}
    </div>
    // <div className={styles["agendaFileAttachedView"]}>
    //   <Row>
    //     <Col
    //       lg={id !== 0 ? 8 : 12}
    //       md={id !== 0 ? 8 : 12}
    //       sm={id !== 0 ? 8 : 12}>
    //       <div
    //         className={
    //           id !== 0 && isQuickMeeting === true
    //             ? styles["fileNameTruncateStyleisQuickMeeting"]
    //             : isQuickMeeting === true && id === 0
    //             ? styles["fileNameTruncateStyle_fullwidthisQuickMeetingView"]
    //             : id !== 0 && isQuickMeeting === false
    //             ? styles["fileNameTruncateStyle"]
    //             : styles["fileNameTruncateStyle_fullwidth"]
    //         }>
    //         <img
    //           draggable={false}
    //           src={getIconSource(getFileExtension(name))}
    //           alt=''
    //           width={20}
    //           height={20}
    //         />
    //         <span
    //           className={
    //             fileExtension
    //               ? styles["fileNameAttachment"]
    //               : styles["fileNameAttachmentNotOpened"]
    //           }>
    //           <Tooltip placement='topLeft' title={name}>
    //             {name}
    //           </Tooltip>
    //         </span>
    //       </div>
    //     </Col>
    //     {id !== 0 && (
    //       <Col
    //         lg={getfileExtensionName === "txt" ? 4 : 2}
    //         md={getfileExtensionName === "txt" ? 4 : 2}
    //         sm={getfileExtensionName === "txt" ? 4 : 2}>
    //         <span className={`${styles["borderFileName"]} p-0`}>
    //           <img
    //             draggable={false}
    //             src={DownloadImg}
    //             alt=''
    //             onClick={handleClickDownload}
    //           />
    //         </span>
    //       </Col>
    //     )}
    //     {id !== 0 && getfileExtensionName !== "txt" ? (
    //       <Col lg={2} md={2} sm={2} className='p-0'>
    //         <img
    //           draggable={false}
    //           src={EyeIcon}
    //           alt=''
    //           className='mx-1'
    //           onClick={handleEyeIcon}
    //         />
    //       </Col>
    //     ) : null}
    //   </Row>
    //   {currentUser === Number(fk_UID) && (
    //     <img
    //       src={CrossIcon}
    //       alt=''
    //       className={styles["Cross_Icon"]}
    //       onClick={handleClickRemove}
    //     />
    //   )}
    // </div>
  );
};

export default AttachmentViewer;
