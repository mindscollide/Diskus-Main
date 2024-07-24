import React from "react";
import styles from "./PendingTasks.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
const PendingTasks = ({ taskValue }) => {
  return (
    <>
      <Row className={styles["PendingTaskLine"]}>
        <Col sm={12} md={12} lg={12} className={styles["UpComingTaskCount"]}>
          {formatValue(taskValue)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["UpComingTaskText"]}>
          Upcoming Tasks
        </Col>
      </Row>
    </>
  );
};

export default PendingTasks;
