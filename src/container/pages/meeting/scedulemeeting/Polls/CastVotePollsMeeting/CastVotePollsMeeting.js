import React, { useState } from "react";
import styles from "./CastVotePollsMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Button, Checkbox } from "../../../../../../components/elements";
import { Progress } from "antd";

const CastVotePollsMeeting = () => {
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
    {
      text: "In-person meetings",
    },
    {
      text: "Video conferences",
    },
    {
      text: "Email communication",
    },
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
                                <Col lg={10} md={10} sm={10}>
                                  <span
                                    className={styles["Messege_span_Class"]}
                                  >
                                    {data.text} <span>(12)</span>
                                  </span>
                                </Col>
                                <Col lg={2} md={2} sm={2}>
                                  <span className={styles["Percentage_Class"]}>
                                    59%
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
          <Row className="mt-4">
            <Col lg={6} md={6} sm={6}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Date_Heading"]}>
                    {t("Due-date")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["Date_Fetched"]}>18 March 2023</span>
                </Col>
              </Row>
            </Col>
            <Col
              lg={6}
              md={6}
              sm={6}
              className="d-flex justify-content-end align-items-center"
            >
              <span className={styles["Multiple_Answers_zstyles"]}>
                {t("Multiple-answers-allowed")}
              </span>
            </Col>
          </Row>
        </Col>
        <Col lg={1} md={1} sm={1}></Col>
        <Col lg={5} md={5} sm={5}></Col>
      </Row>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Cancel")}
            className={styles["Cancel_Button_Cast_vote_polls_Meeting"]}
          />
          <Button
            text={t("Submit")}
            className={styles["Submit_Button_Cast_vote_polls_Meeting"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default CastVotePollsMeeting;
