import React from "react";
import styles from "./subscriptionwarningline.module.css";
import { Row, Col } from "react-bootstrap";
import LimitExceedIcon from "./../../../assets/images/limit-exceed.png";
const subscriptionwarningline = ({ text, color }) => {
  return (
    <Row
      className={styles["subscription_warning"]}
      style={{ backgroundColor: color }}
    >
      <Col className="MontserratMedium-500 d-flex justify-content-center my-2">
        <img
          src={LimitExceedIcon}
          className={styles["warningIcon"]}
          draggable="false"
        />
        <span className={styles["warnignMessage"]}>{text}</span>
      </Col>
    </Row>
  );
};

export default subscriptionwarningline;
