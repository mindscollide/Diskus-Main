import React, { useState } from "react";
import styles from "./AgendaView.module.css";
import { Col, Row } from "react-bootstrap";
import dropmdownblack from "../../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../../assets/images/whiteupper.png";
import { useTranslation } from "react-i18next";
import profile from "../../../../../../assets/images/newprofile.png";
import PDFIcon from "../../../../../../assets/images/pdf_icon.svg";
import SubAgendaView from "./SubAgendaView/SubAgendaView";
import { Button } from "../../../../../../components/elements";
const AgendaView = () => {
  const { t } = useTranslation();

  const [expandMainAgenda, setExpandMainAgenda] = useState(false);
  const [viewDataAgenda, setViewDataAgenda] = useState([
    {
      MainAgendaTitle: "First Title",
      ParticipantName: "Saif Ul Islam",
      startDate: "12:30AM",
      EndDate: "12:30PM",
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
      SubAgendaView: [
        {
          SubagendaTitle: "Hello there I am subAgenda Title",
          subAgendaParticipant: "Huzaifa jahangir",
          SubAgendaStartDate: "1:30AM",
          subAgendaEndDate: "5:00PM",
          subAgendaFiles: [
            {
              subAgendaFileName: "Axis SubAgenda",
            },
            {
              subAgendaFileName: "Diskus SubAgenda",
            },
            {
              subAgendaFileName: "Bandwidgth SubAgenda",
            },
            {
              subAgendaFileName: "Bandwidgth SubAgenda",
            },
          ],
        },
      ],
    },
  ]);
  const handleExpandMainAgendaView = () => {
    setExpandMainAgenda(!expandMainAgenda);
  };

  return (
    <section>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className={styles["MainAgendaScrollerView"]}
        >
          <Row className="mt-4">
            {viewDataAgenda.length > 0
              ? viewDataAgenda.map((MainAgendaData, MainAgendaIndex) => {
                  return (
                    <>
                      <Col lg={12} md={12} sm={12} className="mt-2">
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
                                    alt=""
                                    src={
                                      expandMainAgenda
                                        ? blackArrowUpper
                                        : dropmdownblack
                                    }
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
                                  className={
                                    styles["OverAll_Padding_View_agenda_Screen"]
                                  }
                                >
                                  <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["Heading_View_Agenda"]
                                        }
                                      >
                                        <span>{MainAgendaIndex + 1}.</span>{" "}
                                        {MainAgendaData.MainAgendaTitle}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className="mt-1">
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={styles["Show_more_Class"]}
                                        onClick={handleExpandMainAgendaView}
                                      >
                                        {expandMainAgenda
                                          ? t("Hide-details")
                                          : t("Show-more")}
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
                                                alt=""
                                                width="27px"
                                                className={
                                                  styles["Profile_Class"]
                                                }
                                              />
                                              <span
                                                className={
                                                  styles["ParticipantName"]
                                                }
                                              >
                                                {MainAgendaData.ParticipantName}
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
                                                  <span
                                                    className={
                                                      styles["Date_Time"]
                                                    }
                                                  >
                                                    {MainAgendaData.startDate}
                                                  </span>
                                                  <span
                                                    className={
                                                      styles["midLine"]
                                                    }
                                                  ></span>
                                                  <span
                                                    className={
                                                      styles["Date_Time"]
                                                    }
                                                  >
                                                    {MainAgendaData.EndDate}
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
                                              styles["Attachments_Heading"]
                                            }
                                          >
                                            {t("Attachments")}
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className={
                                            styles["MainAgendaFileScroller"]
                                          }
                                        >
                                          <Row>
                                            {MainAgendaData.AttachmentsMain
                                              .length > 0
                                              ? MainAgendaData.AttachmentsMain.map(
                                                  (
                                                    MainAgendaFiles,
                                                    MainAgendaFilesIndex
                                                  ) => {
                                                    return (
                                                      <>
                                                        <Col
                                                          lg={3}
                                                          md={3}
                                                          sm={3}
                                                          className="mt-2"
                                                        >
                                                          <section
                                                            className={
                                                              styles[
                                                                "Border_Attachments"
                                                              ]
                                                            }
                                                          >
                                                            <Row className="mt-2">
                                                              <Col
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                className="d-flex gap-3 align-items-center"
                                                              >
                                                                <img
                                                                  src={PDFIcon}
                                                                  alt=""
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
                                                                    MainAgendaFiles.MainFileName
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
                      <Row className="m-0 p-0">
                        <Col lg={12} md={12} sm={12} className="mt-2">
                          <SubAgendaView
                            MainAgendaData={MainAgendaData}
                            MainAgendaIndex={MainAgendaIndex}
                          />
                        </Col>
                      </Row>
                    </>
                  );
                })
              : null}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Clone-meeting")}
            className={styles["Cancel_Classname"]}
          />
          <Button text={t("Cancel")} className={styles["Cancel_Classname"]} />
          <Button text={t("Save")} className={styles["Save_Classname"]} />
        </Col>
      </Row>
    </section>
  );
};

export default AgendaView;
