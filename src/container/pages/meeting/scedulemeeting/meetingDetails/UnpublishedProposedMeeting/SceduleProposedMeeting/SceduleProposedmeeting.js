import React, { useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Modal, Button, Table } from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import { showSceduleProposedMeeting } from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
const SceduleProposedmeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [sceduleProposedmeetingData, setSceduleProposedmeetingData] = useState([
    {
      Dates: [
        {
          dataFormeeting: "22-2-2023",
        },
        {
          dataFormeeting: "25-3-2023",
        },
        {
          dataFormeeting: "28-3-2023",
        },
        {
          dataFormeeting: "25-3-2023",
        },
        {
          dataFormeeting: "28-3-2023",
        },
      ],
      members: [
        {
          name: "Mr Abdul Qadir",
          designation: "CFO",
          isTick: true,
        },
        {
          name: "Mr Huzaeifa Jahangir",
          designation: "Team Lead",
          isTick: true,
        },
        {
          name: "Mr Saif Ul Islam",
          designation: "Software Engineer",
          isTick: true,
        },
      ],

      Votes: [
        {
          amount: 0,
        },
        {
          amount: 2,
        },
        {
          amount: 3,
        },
      ],

      Selected: true,
    },
  ]);

  return (
    <section>
      <Modal
        show={NewMeetingreducer.sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Scedule_Proposed_meeting_heading"]}>
                  {t("Schedule-proposed-meetings")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            {sceduleProposedmeetingData.length > 0
              ? sceduleProposedmeetingData.map((data, index) => {
                  return (
                    <>
                      <section className={styles["OverAll_Padding"]}>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            {/* Dates Mapping */}
                            <Row>
                              <>
                                <Col lg={3} md={3} sm={3}></Col>
                                <Col
                                  lg={9}
                                  md={9}
                                  sm={9}
                                  className="d-flex gap-5"
                                >
                                  {data.Dates.length > 0
                                    ? data.Dates.map((dateData, dateIndex) => {
                                        return (
                                          <span
                                            className={styles["DateObject"]}
                                          >
                                            {dateData.dataFormeeting}
                                          </span>
                                        );
                                      })
                                    : null}
                                </Col>
                              </>
                            </Row>
                            {/* Members Mapping */}
                            <section className={styles["InnerSecton"]}>
                              <Row className="mt-3">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["FixedHeight"]}
                                >
                                  <Row className="mt-3">
                                    {data.members.length > 0
                                      ? data.members.map(
                                          (membersData, membersIndex) => {
                                            return (
                                              <>
                                                <Row className="mt-2">
                                                  <Col
                                                    lg={3}
                                                    md={3}
                                                    sm={3}
                                                    className="mt-1"
                                                  >
                                                    <span
                                                      className={
                                                        styles["WidthOFSpan"]
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "ParticipantName"
                                                          ]
                                                        }
                                                      >
                                                        {membersData.name}
                                                      </span>
                                                      <span
                                                        className={
                                                          styles["Designation"]
                                                        }
                                                      >
                                                        {
                                                          membersData.designation
                                                        }
                                                      </span>
                                                    </span>
                                                  </Col>

                                                  <Col
                                                    lg={9}
                                                    md={9}
                                                    sm={9}
                                                    className="d-flex gap-5"
                                                  >
                                                    <span
                                                      className={
                                                        styles["forTick"]
                                                      }
                                                    >
                                                      <img
                                                        src={BlueTick}
                                                        width="20.7px"
                                                        height="14.21px"
                                                      />
                                                    </span>
                                                  </Col>
                                                </Row>
                                                {membersIndex <
                                                  data.members.length - 1 && ( // Check if it's not the last item
                                                  <Row className="mt-2">
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles["bottom_line"]
                                                        }
                                                      ></span>
                                                    </Col>
                                                  </Row>
                                                )}
                                              </>
                                            );
                                          }
                                        )
                                      : null}
                                  </Row>
                                </Col>
                              </Row>

                              <Row className="mt-4">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["UpperTopLine"]}
                                  ></span>
                                </Col>
                              </Row>
                              {/* Total Mapping */}
                              <Row className="m-0 p-0">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["Sizing"]}
                                >
                                  <Row>
                                    <Col lg={3} md={3} sm={3}>
                                      <span
                                        className={styles["TotalCount_HEading"]}
                                      >
                                        {t("Total")}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={9}
                                      md={9}
                                      sm={9}
                                      className="d-flex gap-5"
                                    >
                                      {data.Votes.length > 0
                                        ? data.Votes.map(
                                            (voteData, voteIndex) => {
                                              return (
                                                <>
                                                  <span
                                                    className={
                                                      styles["TotalCount"]
                                                    }
                                                  >
                                                    {voteData.amount}
                                                  </span>
                                                </>
                                              );
                                            }
                                          )
                                        : null}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["UpperTopLine"]}
                                  ></span>
                                </Col>
                              </Row>
                            </section>
                          </Col>
                        </Row>
                      </section>
                    </>
                  );
                })
              : null}
          </>
        }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
