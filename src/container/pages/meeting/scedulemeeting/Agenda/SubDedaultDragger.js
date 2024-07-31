import Dragger from "antd/lib/upload/Dragger";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/Files_Upload_Agenda.png";
import { useTranslation } from "react-i18next";
import { getRandomUniqueNumber } from "./drageFunction";

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
    flag: false,
    message: "",
  });

  let currentUserID = Number(localStorage.getItem("userID"));

  let previousFileList = [];

  const Subprops = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
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
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
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
            setTimeout(() => {
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              });
            }, 3000);
          } else if (!sizezero) {
            setTimeout(() => {
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-zero"),
              });
            }, 3000);
          } else if (fileExists) {
            setTimeout(() => {
              setOpen({
                flag: true,
                message: t("File-already-exists"),
              });
            }, 3000);
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
            setTimeout(() => {
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              });
            }, 3000);
          } else if (!sizezero) {
            setTimeout(() => {
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-zero"),
              });
            }, 3000);
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
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default SubDedaultDragger;
