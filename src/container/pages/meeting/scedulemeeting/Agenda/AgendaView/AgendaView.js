import React, { useState } from "react";
import styles from "./AgendaView.module.css";
import { Col, Row } from "react-bootstrap";
import dropmdownblack from "../../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../../assets/images/whiteupper.png";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import profile from "../../../../../../assets/images/newprofile.png";
import PDFIcon from "../../../../../../assets/images/pdf_icon.svg";
const AgendaView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandMainAgenda, setExpandMainAgenda] = useState(false);
  const [viewDataAgenda, setViewDataAgenda] = [
    {
      MainAgendaTitle: "",
      ParticipantName: "",
      startDate: "",
      EndDate: "",
      AttachmentsMain: [
        {
          MainFileName: "Meeting File",
        },
        {
          MainFileName: "Axis File",
        },
        {
          MainFileName: "Diskus File",
        },
      ],
    },
  ];
  const handleExpandMainAgendaView = () => {
    setExpandMainAgenda(!expandMainAgenda);
  };

  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <section
            className={
              expandMainAgenda
                ? styles["SectionViewAgendaExpanded"]
                : styles["SectionViewAgenda"]
            }
          >
            <Row>
              <Col
                lg={1}
                md={1}
                sm={1}
                className={styles["Expand_Class_ViewAgenda"]}
              >
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <img
                      draggable={false}
                      src={expandMainAgenda ? blackArrowUpper : dropmdownblack}
                      width="18.71px"
                      height="9.36px"
                      className={
                        expandMainAgenda
                          ? styles["ArrowExpanded"]
                          : styles["Arrow"]
                      }
                      onClick={handleExpandMainAgendaView}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={11} md={11} sm={11}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["OverAll_Padding_View_agenda_Screen"]}
                  >
                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Heading_View_Agenda"]}>
                          1. Get new computers from Techno City Mall. Also, Get
                          a new graphics card for the designer.
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col lg={12} md={12} sm={12}>
                        <span
                          className={styles["Show_more_Class"]}
                          onClick={handleExpandMainAgendaView}
                        >
                          {t("Show-more")}
                        </span>
                      </Col>
                    </Row>
                    {expandMainAgenda ? (
                      <>
                        <Row className="mt-3">
                          <Col lg={8} md={8} sm={12}>
                            <Row>
                              <Col
                                lg={3}
                                md={3}
                                sm={3}
                                className="d-flex align-items-center gap-2"
                              >
                                <img
                                  src={profile}
                                  height="27px"
                                  width="27px"
                                  className={styles["Profile_Class"]}
                                />
                                <span className={styles["ParticipantName"]}>
                                  Salman Memon
                                </span>
                              </Col>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                className={styles["Top_Spacing"]}
                              >
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex gap-2"
                                  >
                                    <span className={styles["Date_Time"]}>
                                      12:15 PM
                                    </span>
                                    <span className={styles["midLine"]}></span>
                                    <span className={styles["Date_Time"]}>
                                      02:00 PM
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["Attachments_Heading"]}>
                              {t("Attachments")}
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={3} md={3} sm={3}>
                            <section className={styles["Border_Attachments"]}>
                              <Row className="mt-2">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex gap-3 align-items-center"
                                >
                                  <img
                                    src={PDFIcon}
                                    height="31.57px"
                                    width="31.57px"
                                  />
                                  <span className={styles["File_Name"]}>
                                    Meeting Material
                                  </span>
                                </Col>
                              </Row>
                            </section>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </Col>
                </Row>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </section>
  );
};

export default AgendaView;
