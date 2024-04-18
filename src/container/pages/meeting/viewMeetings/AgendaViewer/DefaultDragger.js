import Dragger from "antd/lib/upload/Dragger";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import { getRandomUniqueNumber } from "./drageFunction";

const DefaultDragger = ({ index, setRows, rows }) => {
  const { t } = useTranslation();
  //Uploader For Main Agendas File
  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      console.log("Dropped files", data.file);
      let newRows = [...rows];
      let fileData = {
        name: data.file.originFileObj.name,
        FileID: getRandomUniqueNumber().toString(),
      };
      newRows[index].files.push(fileData);
      setRows(newRows);
    },
    onDrop(e) {
      let list = e.dataTransfer.files;
      let newRows = [...rows];
      list.map((fileDatas, fileindex) => {
        let fileData = {
          name: fileDatas.file.originFileObj.name,
          FileID: getRandomUniqueNumber().toString(),
        };
        newRows[index].files.push(fileData);
      });
      setRows(newRows);
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() {},
  };
  return (
    <Row key={index + 5} className="mt-4 mb-2">
      <Col lg={12} md={12} sm={12}>
        <Dragger
          {...props}
          fileList={[]}
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
  );
};

export default DefaultDragger;
