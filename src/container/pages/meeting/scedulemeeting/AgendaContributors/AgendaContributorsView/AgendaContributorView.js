import React from "react";
import styles from "./AgendaContributorView.module.css";
import { Col, Row } from "react-bootstrap";
const AgendaContributorView = () => {
  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Grant_Access_Styles"]}>
            Grant access to their own agenda items and files only
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default AgendaContributorView;
