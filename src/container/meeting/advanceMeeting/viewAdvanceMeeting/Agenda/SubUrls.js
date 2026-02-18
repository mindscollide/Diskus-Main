import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";

const SubUrls = ({ subAgendaData }) => {
  return (
    <Row className="mt-2">
      <Col lg={12} md={12} sm={12}>
        <span className={styles["URLTitle_Heading"]}>
          {subAgendaData.subAgendaUrlFieldRadio}
        </span>
      </Col>
    </Row>
  );
};

export default SubUrls;
