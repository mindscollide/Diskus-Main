import { Row, Col } from "react-bootstrap";
import styles from "./PaymentActivity.module.css";
import React from "react";
import { convertToArabicNumerals } from "../../../commen/functions/regex";

/**
 * @component PaymentActivity
 * @description Renders a labelled payment activity summary box displaying a title, a subtitle,
 * and three key-value data columns (e.g. invoice date, amount, status). Numeric values are
 * automatically converted to Arabic numerals when the active locale requires it via
 * `convertToArabicNumerals`.
 *
 * @param {string} PaymentActivityTitle - Subtitle text rendered inside the white content box.
 * @param {string} PaymentActivityBoxTitle - Section heading rendered above the white content box.
 * @param {string} ColOneKey - Label for the first data column.
 * @param {string} ColTwoKey - Label for the second data column.
 * @param {string} ColThreeKey - Label for the third data column.
 * @param {string|number} ColOneValue - Value displayed in the first data column.
 * @param {string|number} ColTwoValue - Value displayed in the second data column.
 * @param {string|number} ColThreeValue - Value displayed in the third data column.
 *
 * @example
 * <PaymentActivity
 *   PaymentActivityBoxTitle="Recent Transactions"
 *   PaymentActivityTitle="Invoice #1042"
 *   ColOneKey="Date:"
 *   ColOneValue="2024-01-15"
 *   ColTwoKey="Amount:"
 *   ColTwoValue="$55"
 *   ColThreeKey="Status:"
 *   ColThreeValue="Paid"
 * />
 */
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
  let lang = localStorage.getItem("i18nextLng");
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
              {convertToArabicNumerals(ColOneValue, lang)}
            </span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColTwoKey}</span>{" "}
            <span
              className={`${"MontserratExtraBold"} ${styles["number-color"]}`}
            >
              {convertToArabicNumerals(ColTwoValue, lang)}
            </span>{" "}
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className={styles["MontserratMedium"]}>{ColThreeKey}</span>{" "}
            <span
              className={`${"MontserratExtraBold"} ${styles["number-color"]}`}
            >
              {convertToArabicNumerals(ColThreeValue, lang)}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PaymentActivity;
