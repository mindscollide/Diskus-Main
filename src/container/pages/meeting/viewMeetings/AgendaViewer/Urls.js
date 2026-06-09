import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";

const Urls = ({ data, index }) => {
  return (
    <Row key={index + 5} className="mt-3 mb-2">
      <Col lg={8} md={8} sm={12}>
        <span
          className={styles["URLTitle_Heading"]}
          onClick={() => window.open(data.urlFieldMain, "_blank")}
        >
          {data.urlFieldMain}
        </span>
      </Col>
    </Row>
  );
};

export default Urls;
