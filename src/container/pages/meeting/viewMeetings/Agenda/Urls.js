import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";

const Urls = ({ data, index }) => {
  return (
    <Row key={index + 5} className="mt-3 mb-2">
      <Col lg={12} md={12} sm={12}>
        <span className={styles["URLTitle_Heading"]}>{data.urlFieldMain}</span>
      </Col>
    </Row>
  );
};

export default Urls;
