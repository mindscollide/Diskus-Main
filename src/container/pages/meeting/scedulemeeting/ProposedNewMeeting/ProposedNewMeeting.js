import React from "react";
import styles from "./ProposedNewMeeting.module.css";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import profile from "../../../../../assets/images/newprofile.png";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import { TextField } from "../../../../../components/elements";
import { useState } from "react";
const ProposedNewMeeting = () => {
  const [participantsProposedMeeting, setParticipantsProposedMeeting] =
    useState([
      {
        name: "Saif ul Islam",
      },
      {
        name: "Aun Naqvi",
      },
      {
        name: "Ali Mamdani",
      },
      {
        name: "Owais Wajid khan",
      },
    ]);
  const { t } = useTranslation();

  const hanleRemovingParticipants = (index) => {
    let removeParticipant = [...participantsProposedMeeting];
    removeParticipant.splice(index, 1);
    setParticipantsProposedMeeting(removeParticipant);
  };
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ProposedMeetingHeading"]}>
            {t("Propose-new-meeting")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["ProposedNewMeetingPaper"]}>
            <Row>
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Meeting-title")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <TextField labelClass={"d-none"} name={"MeetingTitle"} />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Description")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      name="MeetingDescription"
                      applyClass="form-control2 textbox-height-details-view"
                      type="text"
                      as={"textarea"}
                      labelClass={"d-none"}
                      rows="7"
                      required
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Sub_headings"]}>
                      {t("Participant")}
                      <span className={styles["res_steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Select />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_ProposedMeeting"]}
                  >
                    <Row className="mt-2">
                      {participantsProposedMeeting.length > 0
                        ? participantsProposedMeeting.map(
                            (participant, index) => {
                              return (
                                <>
                                  <Col
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    className="mt-2"
                                    key={index}
                                  >
                                    <Row className="m-0 p-0">
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className={styles["Box_for_Assignee"]}
                                      >
                                        <Row className="mt-1">
                                          <Col
                                            lg={10}
                                            md={10}
                                            sm={12}
                                            className="d-flex gap-2 align-items-center"
                                          >
                                            <img
                                              draggable={false}
                                              src={profile}
                                              //   src={`data:image/jpeg;base64,${data.displayPicture}`}
                                              width="50px"
                                              alt=""
                                              height="50px"
                                              className={styles["ProfilePic"]}
                                            />
                                            <span>{participant.name}</span>
                                          </Col>
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={2}
                                            className="d-flex  align-items-center"
                                          >
                                            <img
                                              src={CrossIcon}
                                              width="14px"
                                              height="14px"
                                              draggable="false"
                                              style={{ cursor: "pointer" }}
                                              alt=""
                                              onClick={() =>
                                                hanleRemovingParticipants(index)
                                              }
                                            />
                                          </Col>
                                        </Row>
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
              <Col lg={1} md={1} sm={1}></Col>
              <Col lg={5} md={5} sm={5}></Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default ProposedNewMeeting;
