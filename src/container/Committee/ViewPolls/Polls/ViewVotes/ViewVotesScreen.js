import React, { useState } from "react";
import styles from "./ViewVoteScreen.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Progress } from "antd";
import Profile from "../../../../../assets/images/newprofile.png";
import { Button } from "../../../../../components/elements";

const ViewVotesScreen = ({ setviewVotes }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
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

  const handleViewVotesScreen = () => {
    setviewVotes(false);
  };

  return (
    <section>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Heading_vewPolls_Published"]}>
                How do you prefer to collaborate with your colleagues in the
                office?
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
                                    className={styles["Messege_span_Class"]}
                                  >
                                    {data.text}
                                    {""} <span>-20%</span>
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
                                      <Progress
                                        percent={20}
                                        status="active"
                                        className="pollsDetailsProgress"
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
        </Col>
        <Col lg={1} md={1} sm={1}></Col>
        <Col lg={5} md={5} sm={5}>
          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["Scroller_View_Published_Polls"]}
            >
              <Row className="mt-1">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Participant_Count"]}>
                    Email Conference <span>(20)</span>
                  </span>
                </Col>
              </Row>
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
                                  <span className={styles["Participants_name"]}>
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
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={"Cancel"}
                className={styles["Cacnel_styles_button_view_Votes_screen"]}
                onClick={handleViewVotesScreen}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default ViewVotesScreen;
