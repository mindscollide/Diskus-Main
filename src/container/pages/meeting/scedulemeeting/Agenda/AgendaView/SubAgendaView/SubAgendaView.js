import React, { useState } from "react";
import styles from "./SubAgendaView.module.css";
import { Col, Row } from "react-bootstrap";
import dropmdownblack from "../../../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../../../assets/images/whiteupper.png";
import profile from "../../../../../../../assets/images/newprofile.png";
import PDFIcon from "../../../../../../../assets/images/pdf_icon.svg";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const SubAgendaView = ({ MainAgendaData, MainAgendaIndex }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandSubAgenda, setExpandSubAgenda] = useState(false);

  const expanfSubmenu = () => {
    setExpandSubAgenda(!expandSubAgenda);
  };
  return (
    <section>
      <Row>
        <Col lg={1} md={1} sm={1}></Col>
        <Col lg={11} md={11} sm={11}>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["SubagendaScrollerView"]}
            >
              <Row>
                {MainAgendaData.SubAgendaView.length > 0
                  ? MainAgendaData.SubAgendaView.map(
                      (SubagendaData, subagendaIndex) => {
                        return (
                          <>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["ScrollerSubAgendaView"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <section
                                    className={
                                      expandSubAgenda
                                        ? styles["SubagendaViewBox_Expanded"]
                                        : styles["SubagendaViewBox"]
                                    }
                                  >
                                    <Row>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={1}
                                        className={
                                          styles[
                                            "subAgendaExpandableSideStyles"
                                          ]
                                        }
                                      >
                                        <img
                                          src={
                                            expandSubAgenda
                                              ? blackArrowUpper
                                              : dropmdownblack
                                          }
                                          width="18.71px"
                                          height="9.36px"
                                          className={
                                            expandSubAgenda
                                              ? styles["subagendaArrow_Expand"]
                                              : styles["subagendaArrow"]
                                          }
                                          onClick={expanfSubmenu}
                                        />
                                      </Col>
                                      <Col lg={11} md={11} sm={11}>
                                        <Row>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className={
                                              styles[
                                                "overAll_padding_subagenda"
                                              ]
                                            }
                                          >
                                            <Row className="mt-2">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles["SubagendaTitle"]
                                                  }
                                                >
                                                  <span>
                                                    {MainAgendaIndex + 1}.
                                                    {subagendaIndex + 1}
                                                  </span>{" "}
                                                  {SubagendaData.SubagendaTitle}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "SubAgenda_Show_more_Class"
                                                    ]
                                                  }
                                                  onClick={expanfSubmenu}
                                                >
                                                  {expandSubAgenda
                                                    ? t("Hide-details")
                                                    : t("Show-more")}
                                                </span>
                                              </Col>
                                            </Row>
                                            {expandSubAgenda ? (
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
                                                          className={
                                                            styles[
                                                              "Profile_Class"
                                                            ]
                                                          }
                                                        />
                                                        <span
                                                          className={
                                                            styles[
                                                              "ParticipantName"
                                                            ]
                                                          }
                                                        >
                                                          {
                                                            SubagendaData.subAgendaParticipant
                                                          }
                                                        </span>
                                                      </Col>
                                                      <Col
                                                        lg={4}
                                                        md={4}
                                                        sm={4}
                                                        className={
                                                          styles["Top_Spacing"]
                                                        }
                                                      >
                                                        <Row>
                                                          <Col
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            className="d-flex gap-2"
                                                          >
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Date_Time"
                                                                ]
                                                              }
                                                            >
                                                              {
                                                                SubagendaData.SubAgendaStartDate
                                                              }
                                                            </span>
                                                            <span
                                                              className={
                                                                styles[
                                                                  "midLine"
                                                                ]
                                                              }
                                                            ></span>
                                                            <span
                                                              className={
                                                                styles[
                                                                  "Date_Time"
                                                                ]
                                                              }
                                                            >
                                                              {
                                                                SubagendaData.subAgendaEndDate
                                                              }
                                                            </span>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </Row>
                                                  </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "Attachments_Heading"
                                                        ]
                                                      }
                                                    >
                                                      {t("Attachments")}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                  <Col
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    className={
                                                      styles[
                                                        "SubagendaFilesScrollerView"
                                                      ]
                                                    }
                                                  >
                                                    <Row>
                                                      {SubagendaData
                                                        .subAgendaFiles.length >
                                                      0
                                                        ? SubagendaData.subAgendaFiles.map(
                                                            (
                                                              subAgendaFilesViewData,
                                                              subAgendaFilesViewDataIndex
                                                            ) => {
                                                              return (
                                                                <>
                                                                  <Col
                                                                    lg={3}
                                                                    md={3}
                                                                    sm={3}
                                                                  >
                                                                    <section
                                                                      className={
                                                                        styles[
                                                                          "Files_Structure"
                                                                        ]
                                                                      }
                                                                    >
                                                                      <Row>
                                                                        <Col
                                                                          lg={
                                                                            12
                                                                          }
                                                                          md={
                                                                            12
                                                                          }
                                                                          sm={
                                                                            12
                                                                          }
                                                                          className="d-flex gap-2 align-items-center mt-2"
                                                                        >
                                                                          <img
                                                                            src={
                                                                              PDFIcon
                                                                            }
                                                                            height="31.57px"
                                                                            width="31.57px"
                                                                          />
                                                                          <span
                                                                            className={
                                                                              styles[
                                                                                "File_Name"
                                                                              ]
                                                                            }
                                                                          >
                                                                            {
                                                                              subAgendaFilesViewData.subAgendaFileName
                                                                            }
                                                                          </span>
                                                                        </Col>
                                                                      </Row>
                                                                    </section>
                                                                  </Col>
                                                                </>
                                                              );
                                                            }
                                                          )
                                                        : null}
                                                    </Row>
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
                            </Col>
                          </>
                        );
                      }
                    )
                  : null}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default SubAgendaView;
