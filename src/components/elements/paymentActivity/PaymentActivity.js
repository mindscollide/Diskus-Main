import { Row, Col } from "react-bootstrap";
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
        className={`${" fs-4 mt-3 mb-2"} ${styles["paymentActivityTitle"]}`}
      >
        {PaymentActivityBoxTitle}
      </Col>
      <Col
        sm={12}
        lg={12}
        md={12}
        className="border py-3 px-5 bg-white border-radius-4"
      >
        <Col
          sm={12}
          md={12}
          lg={12}
          className={styles["PaymentActivitySubtitle"]}
        >
          {PaymentActivityTitle}
        </Col>
        <Row className="mt-2 color-5a5a5a">
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColOneKey}</span>{" "}
            <span
              className={`${"MontserratExtraBold"} ${styles["number-color"]}`}
            >
              {ColOneValue}
            </span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColTwoKey}</span>{" "}
            <span
              className={`${"MontserratExtraBold"} ${styles["number-color"]}`}
            >
              {ColTwoValue}
            </span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColThreeKey}</span>{" "}
            <span
              className={`${"MontserratExtraBold"} ${styles["number-color"]}`}
            >
              {ColThreeValue}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PaymentActivity;
