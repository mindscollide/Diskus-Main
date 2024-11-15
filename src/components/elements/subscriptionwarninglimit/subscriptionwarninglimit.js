import React from "react";
import styles from "./subscriptionwarninglimit.module.css";
import { Row, Col } from "react-bootstrap";
import LimitExceedIcon from "./../../../assets/images/limit-exceed.png";
const subscriptionwarninglimit = ({ text, rowClassNameWarning, textStyle }) => {
  return (
    <Row className={rowClassNameWarning}>
      <Col className="MontserratMedium-500 d-flex justify-content-center my-2">
        <img
          src={LimitExceedIcon}
          className={styles["warningIcon"]}
          draggable="false"
        />
        <span className={textStyle}>{text}</span>
      </Col>
    </Row>
  );
};

export default subscriptionwarninglimit;
