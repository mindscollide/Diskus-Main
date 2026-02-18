import React from "react";
import styles from "./SavedAgendaView.module.css";
import { Col, Row } from "react-bootstrap";
const SaveAgendaView = () => {
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <section className={styles["viewAgendaBox"]}>savedViewAgenda</section>
        </Col>
      </Row>
    </section>
  );
};

export default SaveAgendaView;
