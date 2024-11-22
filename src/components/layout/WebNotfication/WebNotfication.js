import React from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
const WebNotfication = () => {
  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <WebNotificationCard />
        </Col>
      </Row>
    </section>
  );
};

export default WebNotfication;
