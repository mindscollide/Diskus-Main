import React from "react";
import styles from "./PendingApproval.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
const PendingApproval = ({ pendingAppr }) => {
  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["PendingApprovalCount"]}>
          {formatValue(pendingAppr)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["PendingApprovalText"]}>
          Pending Approval
        </Col>
      </Row>
    </>
  );
};

export default PendingApproval;
