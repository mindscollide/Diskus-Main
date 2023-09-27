import React from "react";
import styles from "./AgendaView.module.css";
import { Col, Row } from "react-bootstrap";
const AgendaView = () => {
  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <section className={styles["SectionViewAgenda"]}>
            <Row>
              <Col lg={1} md={1} sm={1}></Col>
              <Col lg={11} md={11} sm={11}></Col>
            </Row>
          </section>
        </Col>
      </Row>
    </section>
  );
};

export default AgendaView;
