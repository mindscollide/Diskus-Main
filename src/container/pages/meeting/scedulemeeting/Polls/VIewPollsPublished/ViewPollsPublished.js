import React, { useState } from "react";
import styles from "./ViewPollsPublished.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { style } from "@mui/system";
const ViewPollsPublished = () => {
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
                            <section className={styles["Options_messege"]}>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Messege_span_Class"]}
                                  >
                                    {data.text}
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
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Date_Heading"]}>{"Due-date"}</span>
            </Col>
          </Row>
          <Row></Row>
        </Col>
        <Col lg={6} md={6} sm={6}></Col>
      </Row>
    </section>
  );
};

export default ViewPollsPublished;
