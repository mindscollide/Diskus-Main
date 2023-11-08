import Dragger from "antd/lib/upload/Dragger";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Notification } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import { useTranslation } from "react-i18next";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import { getRandomUniqueNumber } from "./drageFunction";

const SubDedaultDragger = ({
  setRows,
  rows,
  index,
  subIndex,
  fileForSend,
  setFileForSend,
}) => {
  const { t } = useTranslation();
  //Uploader Props For SubAgendas

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const Subprops = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      let newRows = [...rows];
      let fileSizeArr;
      if (newRows[index].subAgenda[subIndex].subfiles.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
      } else if (newRows[index].subAgenda[subIndex].subfiles.length > 0) {
        let flag = false;
        let sizezero;
        let size;
        newRows[index].subAgenda[subIndex].subfiles.map((arData, index) => {
          if (arData.DisplayAttachmentName === data.file.originFileObj.name) {
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
            DisplayAttachmentName: data.file.originFileObj.name,
            OriginalAttachmentName: data.file.originFileObj.name,
            AgendaAttachmentsID: getRandomUniqueNumber(),
            FK_MAID: 0,
          };
          setFileForSend([...fileForSend, data.file.originFileObj]);
          newRows[index].subAgenda[subIndex].subfiles.push(file);
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
            DisplayAttachmentName: data.file.originFileObj.name,
            OriginalAttachmentName: data.file.originFileObj.name,
            AgendaAttachmentsID: getRandomUniqueNumber(),
            FK_MAID: 0,
          };
          newRows[index].subAgenda[subIndex].subfiles.push(file);
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setRows(newRows);
        }
      }
    },
    // onDrop(e) {
    //   let list = e.dataTransfer.files;
    //   let newRows = [...rows];
    //   console.log("DATADATADATA", list);
    //   list.map((fileDatas, fileindex) => {
    //     let fileData = {
    //       AgendaAttachmentsID: getRandomUniqueNumber().toString(),
    //       DisplayAttachmentName: fileDatas.file.originFileObj.name,
    //       OriginalAttachmentName: fileDatas.file.originFileObj.name,
    //       FK_MAID: 0,
    //     };
    //     newRows[index].files.push(fileData);
    //   });
    //   setRows(newRows);
    //   setFileForSend([...fileForSend, fileDatas.file.originFileObj]);
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
    customRequest() {},
  };

  // const Subprops = {
  //   name: "file",
  //   // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  //   multiple: true,
  //   showUploadList: false,
  //   onChange(data) {
  //     const { status } = data.file;
  //     let newRows = [...rows];
  //     let fileData = {
  //       AgendaAttachmentsID: getRandomUniqueNumber().toString(),
  //       DisplayAttachmentName: data.file.originFileObj.name,
  //       OriginalAttachmentName: data.file.originFileObj.name,
  //       FK_MAID: 0,
  //     };
  //     newRows[index].subAgenda[subIndex].subfiles.push(fileData);
  //     setRows(newRows);
  //   },
  //   onDrop(e) {
  //     let list = e.dataTransfer.files;
  //     let newRows = [...rows];
  //     list.map((fileDatas, fileindex) => {
  //       let fileData = {
  //         AgendaAttachmentsID: getRandomUniqueNumber().toString(),
  //         DisplayAttachmentName: fileDatas.file.originFileObj.name,
  //         OriginalAttachmentName: fileDatas.file.originFileObj.name,
  //         FK_MAID: 0,
  //       };
  //       newRows[index].subAgenda[subIndex].subfiles.push(fileData);
  //     });
  //     setRows(newRows);
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  //   customRequest() {},
  // };

  return (
    <>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <Dragger
            {...Subprops}
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

export default SubDedaultDragger;
