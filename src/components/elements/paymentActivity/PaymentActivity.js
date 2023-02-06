import { Container, Row, Col } from "react-bootstrap";
import styles from "./PaymentActivity.module.css";
import React from "react";

const PaymentActivity = ({
  PaymentActivityTitle,
  PaymentActivityBoxTitle,
  ColOneKey,
  ColTwoKey,
  ColThreeKey,
  ColOneValue,
  ColTwoValue,
  ColThreeValue,
}) => {
  return (
    <Row>
      <Col
        sm={12}
        md={12}
        lg={12}
        className={`${"fs-4 fw-bold my-3 "} ${styles["paymentActivityTitle"]}`}
      >
        {PaymentActivityBoxTitle}
      </Col>
      <Col sm={12} lg={12} md={12} className="border py-3 px-5 bg-white">
        <Col
          sm={12}
          md={12}
          lg={12}
          className={styles["PaymentActivitySubtitle"]}
        >
          {PaymentActivityTitle}
        </Col>
        <Row className="mt-2">
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColOneKey}</span>{" "}
            <span className={styles["MontserratExtraBold"]}>{ColOneValue}</span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColTwoKey}</span>{" "}
            <span className={styles["MontserratExtraBold"]}>{ColTwoValue}</span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColThreeKey}</span>{" "}
            <span className={styles["MontserratExtraBold"]}>
              {ColThreeValue}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PaymentActivity;
