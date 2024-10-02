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
        <Card
          style={{
            width: "18rem",
            backgroundColor: "#333",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <Card.Body className="text-center">
            <Card.Title>Someone wants to join this call</Card.Title>
            <Image
              src="https://via.placeholder.com/40"
              roundedCircle
              className="my-3"
            />
            <Card.Text>{guestName}</Card.Text>
            <Row className="justify-content-center">
              <Col xs={5}>
                <Button
                  className="w-100"
                  onClick={handleAdmit}
                  text={t("Admit")}
                />
              </Col>
              <Col xs={5}>
                <Button
                  className="w-100"
                  onClick={handleAdmit}
                  text={t("Reject")}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GuestJoinRequest;
