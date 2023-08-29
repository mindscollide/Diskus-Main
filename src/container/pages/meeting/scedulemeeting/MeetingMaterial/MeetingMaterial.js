import React, { useState } from "react";
import styles from "./MeetingMaterial.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import backDownArrow from "../../../../../assets/images/downDirect.png";
import upArrow from "../../../../../assets/images/UpperArrow.svg";
import PDFIcon from "../../../../../assets/images/pdf_icon.svg";

const MeetingMaterial = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [introductionFiles, setIntroductionFiles] = useState(false);
  const [files, setFiles] = useState([
    {
      name: "Meeting Agenda",
    },
    {
      name: "Diskus Meeting Agenda",
    },
    {
      name: "Axis Meeting Agenda",
    },
    {
      name: "World Wide Meeting Agenda",
    },
    {
      name: "General Agenda",
    },
    {
      name: "HBL Agenda",
    },
  ]);
  const handleIntroductionExpand = () => {
    setIntroductionFiles(!introductionFiles);
  };

  return (
    <section>
      <Row className="mt-5">
        <Col lg={11} md={11} sm={11}>
          <span className={styles["MeetinMaterial_Heading"]}>
            {t("Introduction")}
          </span>
        </Col>
        <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
          <img
            src={introductionFiles ? upArrow : backDownArrow}
            className="cursor-pointer"
            onClick={handleIntroductionExpand}
          />
        </Col>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {introductionFiles ? (
              <>
                <Row className="mt-3">
                  {files.length > 0
                    ? files.map((data, index) => {
                        return (
                          <>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className={styles["File_Structure"]}
                            >
                              <Row className="mt-2">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex gap-2 align-items-center"
                                >
                                  <img
                                    src={PDFIcon}
                                    height="31.57px"
                                    width="31.57px"
                                  />
                                  <span className={styles["Meeting_file_name"]}>
                                    {data.name}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        );
                      })
                    : null}
                </Row>
              </>
            ) : null}
          </Col>
        </Row>
        <Row>
          <span className={styles["Bottom_Line"]}></span>
        </Row>
      </Row>
      <Row className="mt-2">
        <Col lg={11} md={11} sm={11}>
          <span className={styles["MeetinMaterial_Heading"]}>
            {t("Ceo-report")}
          </span>
        </Col>
        <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
          <img src={backDownArrow} className="cursor-pointer" />
        </Col>
        <Row>
          <span className={styles["Bottom_Line"]}></span>
        </Row>
      </Row>
      <Row className="mt-2">
        <Col lg={11} md={11} sm={11}>
          <span className={styles["MeetinMaterial_Heading"]}>
            {t("Finance-summary")}
          </span>
        </Col>
        <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
          <img src={backDownArrow} className="cursor-pointer" />
        </Col>
        <Row>
          <span className={styles["Bottom_Line"]}></span>
        </Row>
      </Row>
      <Row className="mt-2">
        <Col lg={11} md={11} sm={11}>
          <span className={styles["MeetinMaterial_Heading"]}>
            {t("Functional-review")}
          </span>
        </Col>
        <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
          <img src={backDownArrow} className="cursor-pointer" />
        </Col>
        <Row>
          <span className={styles["Bottom_Line"]}></span>
        </Row>
      </Row>
      <Row className="mt-2">
        <Col lg={11} md={11} sm={11}>
          <span className={styles["MeetinMaterial_Heading"]}>
            {t("Closing-report")}
          </span>
        </Col>
        <Col lg={1} md={1} sm={1} className="d-flex align-items-center">
          <img src={backDownArrow} className="cursor-pointer" />
        </Col>
        <Row>
          <span className={styles["Bottom_Line"]}></span>
        </Row>
      </Row>
    </section>
  );
};

export default MeetingMaterial;
