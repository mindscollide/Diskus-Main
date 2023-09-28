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
  const [expandIndex, setexpandIndex] = useState(0);
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
  const [materialOptions, setmaterialOptions] = useState([
    {
      name: "Introduction",
    },
    {
      name: "CEO Report",
    },
    {
      name: "Finance Summary",
    },
    {
      name: "Functional Review",
    },
    {
      name: "Closing Report",
    },
  ]);
  const handleIntroductionExpand = (index) => {
    setexpandIndex(index);
    setIntroductionFiles(!introductionFiles);
  };

  return (
    <section>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12} className={styles["Scroller"]}>
          {materialOptions.length > 0
            ? materialOptions.map((data, index) => {
                return (
                  <>
                    <Row className={styles["meeting_material_row"]}>
                      <Col lg={11} md={11} sm={11}>
                        <span className={styles["MeetinMaterial_Heading"]}>
                          {data.name}
                        </span>
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <img
                          draggable={false}
                          src={
                            expandIndex === index && introductionFiles
                              ? upArrow
                              : backDownArrow
                          }
                          className="cursor-pointer"
                          onClick={() => handleIntroductionExpand(index)}
                        />
                      </Col>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          {expandIndex === index &&
                          introductionFiles === true ? (
                            <>
                              <Row>
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
                                                  draggable={false}
                                                  src={PDFIcon}
                                                  height="31.57px"
                                                  width="31.57px"
                                                />
                                                <span
                                                  className={
                                                    styles["Meeting_file_name"]
                                                  }
                                                >
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
                    </Row>
                  </>
                );
              })
            : null}
        </Col>
      </Row>
    </section>
  );
};

export default MeetingMaterial;
