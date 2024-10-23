import Dragger from "antd/lib/upload/Dragger";
import React, { useContext, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/Files_Upload_Agenda.png";
import { useTranslation } from "react-i18next";
import { getRandomUniqueNumber } from "./drageFunction";
import { MeetingContext } from "../../../../../context/MeetingContext";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";

const SubDedaultDragger = ({
  setRows,
  rows,
  index,
  subIndex,
  fileForSend,
  setFileForSend,
  editorRole,
}) => {
  const { t } = useTranslation();
  //Uploader Props For SubAgendas

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const { isAgendaUpdateWhenMeetingActive } = useContext(MeetingContext);

  let currentUserID = Number(localStorage.getItem("userID"));

  let previousFileList = [];

  const Subprops = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;
      let newRows = [...rows];
      let sizezero = true;
      let size = true;

      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return;
      }

      let getRowData = newRows[index].subAgenda[subIndex];

      if (getRowData.subfiles.length > 9) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
        return;
      }
      if (getRowData.subfiles.length > 0) {
        fileList.forEach((fileData, index) => {
          if (fileData.size > 10485760) {
            size = false;
          } else if (fileData.size === 0) {
            sizezero = false;
          }
          let fileExists = getRowData.subfiles.some(
            (oldFileData) => oldFileData.displayAttachmentName === fileData.name
          );
          if (!size) {
            showMessage(
              t("File-size-should-not-be-greater-then-zero"),
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
            // setFileForSend([...fileForSend, fileData.originFileObj]);
            setFileForSend((prevFiles) => [
              ...prevFiles,
              fileData.originFileObj,
            ]);
            getRowData.subfiles.push(file);
          }
        });
      } else {
        fileList.forEach((fileData, index) => {
          if (fileData.size > 10485760) {
            size = false;
          } else if (fileData.size === 0) {
            sizezero = false;
          }

          if (!size) {
            showMessage(
              t("File-size-should-not-be-greater-then-zero"),
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
            // setFileForSend([...fileForSend, fileData.originFileObj]);
            setFileForSend((prevFiles) => [
              ...prevFiles,
              fileData.originFileObj,
            ]);
            getRowData.subfiles.push(file);
          }
        });
      }
      setRows(newRows);
    },
    customRequest() {},
  };

  return (
    <>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <Dragger
            fileList={[]}
            {...Subprops}
            className={styles["dragdrop_attachment_create_resolution"]}
            disabled={
              editorRole.role === "Participant" ||
              (editorRole.role === "Agenda Contributor" &&
                rows[index].subAgenda[subIndex].canEdit === false) ||
              editorRole.status === "9" ||
              editorRole.status === 9
                ? true
                : Number(editorRole.status) === 10 &&
                  !isAgendaUpdateWhenMeetingActive
                ? true
                : false
            }
          >
            <Row>
              <Col
                lg={5}
                md={5}
                sm={12}
                className="d-flex justify-content-end align-items-center"
              >
                <img
                  draggable={false}
                  src={DrapDropIcon}
                  width={100}
                  className={styles["ClassImage"]}
                  alt=""
                />
              </Col>
              <Col lg={7} md={7} sm={12}>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start"
                  >
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
                    className="d-flex justify-content-start"
                  >
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
                    className="d-flex justify-content-start"
                  >
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
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default SubDedaultDragger;
