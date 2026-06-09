import Dragger from "antd/lib/upload/Dragger";
import React, { useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/Files_Upload_Agenda.png";

import { getRandomUniqueNumber } from "./drageFunction";
import { MeetingContext } from "../../../../../context/MeetingContext";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { isFileSizeValid } from "../../../../../commen/functions/convertFileSizeInMB";

const DefaultDragger = ({
  index,
  setRows,
  rows,
  fileForSend,
  setFileForSend,
}) => {
  const { t } = useTranslation();
  const { isAgendaUpdateWhenMeetingActive, editorRole } =
    useContext(MeetingContext);

  let currentUserID = Number(localStorage.getItem("userID"));

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;
      console.log(fileList, "fileListfileList");
      let sizezero = true;
      let newRows = [...rows];
      let size = true;

      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }

      console.log(newRows[index], "checkingIndex");
      let getRowData = newRows[index];

      // Check the total number of files, including new uploads
      const totalFilesCount = getRowData.files.length + fileList.length;
      if (totalFilesCount > 10) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
        return; // Stop further processing
      }

      if (getRowData.files.length > 0) {
        fileList.forEach((fileData) => {
          let { isMorethan } = isFileSizeValid(fileData.size);

          let fileExists = getRowData.files.some(
            (oldFileData) => oldFileData.displayAttachmentName === fileData.name
          );
          if (!isMorethan) {
            size = false;
          } else if (fileData.size === 0) {
            sizezero = false;
          }

          if (!size) {
            showMessage(
              t("File-size-should-not-be-greater-than-1-5GB"),
              "error",
              setOpen
            );
          } else if (!sizezero) {
            showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
          } else if (fileExists) {
            showMessage(t("File-already-exists"), "error", setOpen);
          } else {
            let file = {
              displayAttachmentName: fileData.originFileObj.name,
              originalAttachmentName: fileData.originFileObj.name,
              agendaAttachmentsID: getRandomUniqueNumber(),
              fK_MAID: 0,
              fK_UID: currentUserID,
            };
            setFileForSend((prevFiles) => [
              ...prevFiles,
              fileData.originFileObj,
            ]);
            getRowData.files.push(file);
          }
        });
      } else {
        fileList.forEach((fileData) => {
          let { isMorethan } = isFileSizeValid(fileData.size);

          if (!isMorethan) {
            size = false;
          } else if (fileData.size === 0) {
            sizezero = false;
          }

          if (!size) {
            showMessage(
              t("File-size-should-not-be-greater-than-1-5GB"),
              "error",
              setOpen
            );
          } else if (!sizezero) {
            showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
          } else {
            let file = {
              displayAttachmentName: fileData.originFileObj.name,
              originalAttachmentName: fileData.originFileObj.name,
              agendaAttachmentsID: getRandomUniqueNumber(),
              fK_MAID: 0,
              fK_UID: currentUserID,
            };
            setFileForSend((prevFiles) => [
              ...prevFiles,
              fileData.originFileObj,
            ]);
            getRowData.files.push(file);
          }
        });
      }
      setRows(newRows);
    },
    customRequest() {},
  };

  // Initialize previousFileList to an empty array
  let previousFileList = [];
  console.log(rows, "rowsInSubDefaultDragger");

  return (
    <>
      <Row key={index + 5} className='mt-4 mb-2'>
        <Col lg={12} md={12} sm={12}>
          <Dragger
            {...props}
            className={styles["dragdrop_attachment_create_resolution"]}
            fileList={[]}
            disabled={
              Number(editorRole.status) === 10 &&
              editorRole.role !== "Organizer"
                ? true 
                : rows[index].isLocked
                ? true
                : editorRole.role === "Participant" ||
                  (editorRole.role === "Agenda Contributor" &&
                    rows[index].canEdit === false)
                ? true
                : editorRole.status === 9 || editorRole.status === "9"
                ? true
                : Number(editorRole.status) === 10 &&
                  !isAgendaUpdateWhenMeetingActive
                ? true
                : false
            }>
            <Row>
              <Col
                lg={5}
                md={5}
                sm={12}
                className='d-flex justify-content-end align-items-center'>
                <img
                  draggable={false}
                  src={DrapDropIcon}
                  width={100}
                  className={styles["ClassImage"]}
                  alt=''
                />
              </Col>
              <Col lg={7} md={7} sm={12}>
                <Row className='mt-3'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-start'>
                    <span className={styles["ant-upload-text-Meetings"]}>
                      {t("Drag-file-here")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-start'>
                    <span className={styles["Choose_file_style-Meeting"]}>
                      {t("The-following-file-formats-are")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex justify-content-start'>
                    <span className={styles["Choose_file_style-Meeting"]}>
                      {t("Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Dragger>
        </Col>
      </Row>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default DefaultDragger;
