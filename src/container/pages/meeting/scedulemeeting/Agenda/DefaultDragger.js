import Dragger from "antd/lib/upload/Dragger";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import { getRandomUniqueNumber } from "./drageFunction";

const DefaultDragger = ({
  index,
  setRows,
  rows,
  fileForSend,
  setFileForSend,
}) => {
  const { t } = useTranslation();

  const { NewMeetingReducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //Uploader For Main Agendas File
  // const props = {
  //   name: "file",
  //   multiple: true,
  //   showUploadList: false,
  //   onChange(data) {
  //     const { status } = data.file;
  //     console.log("DATADATADATA", data.file);
  //     let newRows = [...rows];
  //     console.log("DATADATADATA", newRows);
  //     let fileData = {
  //       agendaAttachmentsID: getRandomUniqueNumber().toString(),
  //       displayAttachmentName: data.file.originFileObj.name,
  //       originalAttachmentName: data.file.originFileObj.name,
  //       fK_MAID: 0,
  //     };
  //     console.log("DATADATADATA", fileData);
  //     newRows[index].files.push(fileData);
  //     console.log("DATADATADATA", newRows);
  //     setRows(newRows);
  //   },
  //   onDrop(e) {
  //     let list = e.dataTransfer.files;
  //     let newRows = [...rows];
  //     console.log("DATADATADATA", list);
  //     list.map((fileDatas, fileindex) => {
  //       let fileData = {
  //         agendaAttachmentsID: getRandomUniqueNumber().toString(),
  //         displayAttachmentName: fileDatas.file.originFileObj.name,
  //         originalAttachmentName: fileDatas.file.originFileObj.name,
  //         fK_MAID: 0,
  //       };
  //       newRows[index].files.push(fileData);
  //     });
  //     setRows(newRows);
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  //   customRequest() {},
  // };

  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      let newRows = [...rows];
      let fileSizeArr;
      if (newRows[index].files.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
      } else if (newRows[index].files.length > 0) {
        let flag = false;
        let sizezero;
        let size;
        newRows[index].files.map((arData, index) => {
          if (arData.displayAttachmentName === data.file.originFileObj.name) {
            flag = true;
          }
        });
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else if (flag === true) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            }),
            3000
          );
        } else {
          let file = {
            displayAttachmentName: data.file.originFileObj.name,
            originalAttachmentName: data.file.originFileObj.name,
            agendaAttachmentsID: getRandomUniqueNumber(),
            fK_MAID: 0,
          };
          setFileForSend([...fileForSend, data.file.originFileObj]);
          newRows[index].files.push(file);
          setRows(newRows);
          // dispatch(FileUploadToDo(navigate, data.file.originFileObj, t));
        }
      } else {
        let sizezero;
        let size;
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else {
          let file = {
            displayAttachmentName: data.file.originFileObj.name,
            originalAttachmentName: data.file.originFileObj.name,
            agendaAttachmentsID: getRandomUniqueNumber(),
            fK_MAID: 0,
          };
          newRows[index].files.push(file);
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setRows(newRows);
          // dispatch(FileUploadToDo(navigate, data.file.originFileObj, t));
        }
      }
    },
    // onDrop(e) {
    //   let list = e.dataTransfer.files;
    //   let newRows = [...rows];
    //   console.log("DATADATADATA", list);
    //   list.map((fileDatas, fileindex) => {
    //     let fileData = {
    //       agendaAttachmentsID: getRandomUniqueNumber().toString(),
    //       displayAttachmentName: fileDatas.file.originFileObj.name,
    //       originalAttachmentName: fileDatas.file.originFileObj.name,
    //       fK_MAID: 0,
    //     };
    //     newRows[index].files.push(fileData);
    //   });
    //   setRows(newRows);
    //   setFileForSend([...fileForSend, fileDatas.file.originFileObj]);
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
    customRequest() {},
  };

  return (
    <>
      <Row key={index + 5} className="mt-4 mb-2">
        <Col lg={12} md={12} sm={12}>
          <Dragger
            {...props}
            className={styles["dragdrop_attachment_create_resolution"]}
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

export default DefaultDragger;
