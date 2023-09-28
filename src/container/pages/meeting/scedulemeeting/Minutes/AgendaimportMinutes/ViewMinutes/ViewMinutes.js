import React, { useState } from "react";
import styles from "./ViewMinutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import profile from "../../../../../../../assets/images/newprofile.png";
import { useNavigate } from "react-router";
import { Col, Row } from "react-bootstrap";
import Editicon from "../../../../../../../assets/images/Edit-Icon.png";
import { useSelector } from "react-redux";

const ViewMinutes = ({ AgendaData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [expanded, setExpanded] = useState(false);
  const [expandIndex, setExpandIndex] = useState(0);

  const toggleExpansion = (index) => {
    setExpandIndex(index);
    setExpanded(!expanded);
  };

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["Main_scroller_View"]}>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
              {AgendaData.length > 0
                ? AgendaData.map((data, index) => {
                    return (
                      <>
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["Heading_View_Minutes"]}>
                              <span>{index + 1}.</span>
                              {data.MainTitle}
                            </span>
                          </Col>
                        </Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Box_Minutes_For_main_agenda"]}
                        >
                          <Row>
                            <Col lg={9} md={9} sm={9}>
                              <Row className="mt-3">
                                <Col lg={12} md={12} sm={12}>
                                  <span className={styles["Title_File"]}>
                                    {expandIndex === index &&
                                    expanded === true ? (
                                      <>
                                        {data?.MainHeading?.substring(0, 190)}
                                        ...
                                      </>
                                    ) : (
                                      <>{data?.MainHeading}</>
                                    )}

                                    <span
                                      className={styles["Show_more_Styles"]}
                                      onClick={() => toggleExpansion(index)}
                                    >
                                      {expanded ? t("See-more") : t("See-less")}
                                    </span>
                                  </span>
                                </Col>
                              </Row>
                              <Row className="mt-1">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Date_Minutes_And_time"]}
                                  >
                                    4:00pm, 18th May, 2020
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={3} md={3} sm={3} className="mt-4">
                              <Row className="d-flex justify-content-end">
                                <Col lg={2} md={2} sm={2}>
                                  <img
                                    draggable={false}
                                    src={profile}
                                    height="39px"
                                    width="39px"
                                    className={styles["Profile_minutes"]}
                                  />
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={6}
                                  className={styles["Line_heigh"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={styles["Uploaded_heading"]}
                                      >
                                        {t("Uploaded-by")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span className={styles["Name"]}>
                                        Mehtab Ahmed
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        {/* SubAgenda Mapping */}
                        <Row className="mt-2">
                          <Col lg={1} md={1} sm={1}></Col>
                          <Col
                            lg={11}
                            md={11}
                            sm={11}
                            className={
                              data.SubAgenda <= 0
                                ? styles[
                                    "Scroller_SubAgendaView_when_No+SubAgenda_View"
                                  ]
                                : styles["Scroller_SubAgendaView"]
                            }
                          >
                            {data.SubAgenda.map(
                              (subAgendaViewData, subAgendaViewIndex) => {
                                return (
                                  <>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="mt-2"
                                    >
                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <span
                                            className={
                                              styles[
                                                "SubAgendaSubTitleHeaeding"
                                              ]
                                            }
                                          >
                                            1.1.
                                            <span>
                                              {subAgendaViewData.SubTitle}
                                            </span>
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className={styles["Box_Minutes"]}
                                        >
                                          <Row>
                                            <Col lg={8} md={8} sm={8}>
                                              <Row className="mt-3">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Title_File"]
                                                    }
                                                  >
                                                    {expandIndex === index &&
                                                    expanded === true ? (
                                                      <>
                                                        {subAgendaViewData?.SubTitle?.substring(
                                                          0,
                                                          190
                                                        )}
                                                        ...
                                                      </>
                                                    ) : (
                                                      <>
                                                        {
                                                          subAgendaViewData?.SubTitle
                                                        }
                                                      </>
                                                    )}

                                                    <span
                                                      className={
                                                        styles[
                                                          "Show_more_Styles"
                                                        ]
                                                      }
                                                      onClick={() =>
                                                        toggleExpansion(index)
                                                      }
                                                    >
                                                      {expanded
                                                        ? t("See-more")
                                                        : t("See-less")}
                                                    </span>
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row className="mt-1">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Date_Minutes_And_time"
                                                      ]
                                                    }
                                                  >
                                                    4:00pm, 18th May, 2020
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={4}
                                              md={4}
                                              sm={4}
                                              className="mt-4"
                                            >
                                              <Row className="d-flex justify-content-end">
                                                <Col lg={2} md={2} sm={2}>
                                                  <img
                                                    draggable={false}
                                                    src={profile}
                                                    height="39px"
                                                    width="39px"
                                                    className={
                                                      styles["Profile_minutes"]
                                                    }
                                                  />
                                                </Col>
                                                <Col
                                                  lg={6}
                                                  md={6}
                                                  sm={6}
                                                  className={
                                                    styles["Line_heigh"]
                                                  }
                                                >
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Uploaded_heading"
                                                          ]
                                                        }
                                                      >
                                                        {t("Uploaded-by")}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles["Name"]
                                                        }
                                                      >
                                                        Mehtab Ahmed
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </>
                                );
                              }
                            )}
                          </Col>
                        </Row>
                      </>
                    );
                  })
                : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default ViewMinutes;
