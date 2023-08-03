import React from "react";
import styles from "./SceduleMeeting.module.css";
import { Col, Row } from "react-bootstrap";

const SceduleMeeting = ({ setSceduleMeeting }) => {
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          Hello there I am sceduling a Meeting
        </Col>
      </Row>
    </section>
  );
};

export default SceduleMeeting;
