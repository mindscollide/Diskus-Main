import React, { useState } from "react";
import styles from "./ViewPollsPublishedScreen.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Profile from "../../../../assets/images/newprofile.png";
import { Button, Checkbox } from "../../../../components/elements";
import { Progress } from "antd";
import ViewVotesScreen from "../ViewVotes/ViewVotesScreen";

const ViewPollsPublishedScreen = ({ setViewPublishedPoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [viewVotes, setviewVotes] = useState(false);
  const [messeges, setMesseges] = useState([
    {
      text: "In-person meetings",
    },
    {
      text: "Video conferences",
    },
    {
      text: "Email communication",
    },
  ]);
  const [participant, setparticipant] = useState([
    {
      name: "Saif Ul Islam",
    },
    {
      name: "Saif Ul Islam",
    },
    {
      name: "Saif Ul Islam",
    },
    {
      name: "Saif Ul Islam",
    },
  ]);

  const handleCancelButton = () => {
    setViewPublishedPoll(false);
  };

  const handleViewVotesScreen = () => {
    setviewVotes(true);
  };
  return (
    <>
      {viewVotes ? (
        <ViewVotesScreen setviewVotes={setviewVotes} />
      ) : (
        <>
          <section>
            <Row>
              <Col lg={6} md={6} sm={6}>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Heading_vewPolls_Published"]}>
                      How do you prefer to collaborate with your colleagues in
                      the office?
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_View_Published_Polls"]}
                  >
                    <Row>
                      {messeges.length > 0
                        ? messeges.map((data, index) => {
                            return (
                              <>
                                <Col lg={12} md={12} sm={12} className="mt-2">
                                  <section>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <span
                                          className={
                                            styles["Messege_span_Class"]
                                          }
                                        >
                                          {data.text} <span>(12)</span>
                                        </span>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <Row>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className="d-flex gap-3"
                                          >
                                            <Checkbox />
                                            <Progress
                                              className="Progress_bar_Polls"
                                              percent={20}
                                              status="active"
                                            />
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </section>
                                </Col>
                              </>
                            );
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Date_Heading"]}>
                          {t("Due-date")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Date_Fetched"]}>
                          18 March 2023
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col lg={1} md={1} sm={1}></Col>
              <Col lg={5} md={5} sm={5}>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Participants"]}>
                      {"Participants"}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_View_Published_Polls"]}
                  >
                    <Row>
                      {participant.length > 0
                        ? participant.map((data, index) => {
                            return (
                              <>
                                <Col lg={6} md={6} sm={6} className="mt-2">
                                  <section className={styles["Partipants_box"]}>
                                    <Row>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className="d-flex align-items-center gap-2"
                                      >
                                        <img
                                          draggable={false}
                                          src={Profile}
                                          height="33px"
                                          width="33px"
                                          className={styles["Profile_Style"]}
                                        />
                                        <span
                                          className={
                                            styles["Participants_name"]
                                          }
                                        >
                                          {data.name}
                                        </span>
                                      </Col>
                                    </Row>
                                  </section>
                                </Col>
                              </>
                            );
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["Close_button_View"]}
                      onClick={handleCancelButton}
                    />
                    <Button
                      text={t("View-votes")}
                      className={styles["ViewVotes_button_View"]}
                      onClick={handleViewVotesScreen}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </section>
        </>
      )}
    </>
  );
};

export default ViewPollsPublishedScreen;
