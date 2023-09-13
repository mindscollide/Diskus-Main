import React, { useState } from "react";
import styles from "./ViewVoteScreen.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
const ViewVotesScreen = () => {
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
        </Col>
        <Col lg={1} md={1} sm={1}></Col>
        <Col lg={5} md={5} sm={5}></Col>
      </Row>
    </section>
  );
};

export default ViewVotesScreen;
