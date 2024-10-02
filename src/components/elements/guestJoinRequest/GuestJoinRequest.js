import React, { useState } from "react";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import { Button } from "../../elements/";
import styles from "./GuestJoinRequest.module.css";
import { useTranslation } from "react-i18next";

const GuestJoinRequest = ({ mqttData }) => {
  const { t } = useTranslation();
  const { guestName } = mqttData.payload;

  const handleAdmit = () => {
    // Handle the admit logic here, e.g., send an MQTT message
  };

  return (
    <div className={styles["box-positioning"]}>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className={styles["card-ui"]}>
          <Card.Body className="text-center">
            <Card.Title className={styles["title-alert"]}>
              <strong>{guestName}</strong> wants to join this call
            </Card.Title>
            <Row className="justify-content-center">
              <Col xs={5}>
                <p className={styles["title-admit"]}>
                  {t("Admit")}
                </p>
              </Col>
              <Col xs={5}>
                <p className={styles["title-reject"]}>
                  {t("Reject")}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
