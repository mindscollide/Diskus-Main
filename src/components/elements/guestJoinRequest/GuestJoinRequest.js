import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";
import CrossIcon from "../../../assets/images/Cross_Icon.png";
import { guestJoinPopup } from "../../../store/actions/VideoFeature_actions";

const GuestJoinRequest = ({ mqttData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { guestName } = mqttData.payload;

  const handleAdmit = () => {
    // Handle the admit logic here, e.g., send an MQTT message
  };

  useEffect(() => {
    const audioElement = new Audio("/Admit-Request.wav");

    audioElement.loop = false;

    audioElement.play();

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);

  return (
    <div className={styles["box-positioning"]}>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className={styles["card-ui"]}>
          <img
            onClick={() => dispatch(guestJoinPopup(false))}
            className={styles["handle-close"]}
            src={CrossIcon}
            alt=""
          />
          <Card.Body className="text-center">
            <p className={styles["title-alert"]}>
              <strong>{guestName}</strong> {t("wants-to-join-this-call")}
            </p>
            <Row className="justify-content-center">
              <Col xs={5}>
                <p className={styles["title-admit"]}>{t("Admit")}</p>
              </Col>
              <Col xs={5}>
                <p className={styles["title-reject"]}>{t("Reject")}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
