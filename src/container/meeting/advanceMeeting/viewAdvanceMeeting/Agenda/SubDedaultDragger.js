import Dragger from "antd/lib/upload/Dragger";
import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import { useTranslation } from "react-i18next";
import { getRandomUniqueNumber } from "./drageFunction";

const SubDedaultDragger = ({ setRows, rows, index, subIndex }) => {
  const { t } = useTranslation();
  //Uploader Props For SubAgendas
  const Subprops = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      let newRows = [...rows];
      let fileData = {
        name: data.file.originFileObj.name,
        FileID: getRandomUniqueNumber().toString(),
      };
      newRows[index].subAgenda[subIndex].subfiles.push(fileData);
      setRows(newRows);
    },
    onDrop(e) {
      let list = e.dataTransfer.files;
      let newRows = [...rows];
      list.map((fileDatas) => {
        let fileData = {
          name: fileDatas.file.originFileObj.name,
          FileID: getRandomUniqueNumber().toString(),
        };
        newRows[index].subAgenda[subIndex].subfiles.push(fileData);
      });
      setRows(newRows);
      
    },
    customRequest() {},
  };
  return (
    <Row className="mt-2">
      <Col lg={12} md={12} sm={12}>
        <Dragger
          {...Subprops}
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
                alt=""
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

export default SubDedaultDragger;
