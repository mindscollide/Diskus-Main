import React from "react";
import styles from "./subscriptionwarninglimit.module.css";
import { Row, Col } from "react-bootstrap";
import LimitExceedIcon from "./../../../assets/images/limit-exceed.png";
/**
 * @component subscriptionwarninglimit
 * @description Renders an inline warning indicator used to communicate that a subscription
 * seat limit has been reached or exceeded. Displays a limit-exceed icon alongside a message.
 * Unlike `subscriptionwarningline`, this component accepts external class names for both the
 * row wrapper and the text span, giving the parent full control over styling.
 *
 * @param {string} text - The warning message text to display next to the icon.
 * @param {string} rowClassNameWarning - CSS class name(s) applied to the outer Bootstrap Row.
 * @param {string} textStyle - CSS class name(s) applied to the message text span.
 *
 * @example
 * <subscriptionwarninglimit
 *   text="Board member seats are full."
 *   rowClassNameWarning="my-2"
 *   textStyle="text-danger fw-bold"
 * />
 */
const subscriptionwarninglimit = ({ text, rowClassNameWarning, textStyle }) => {
  return (
    <Row className={rowClassNameWarning}>
      <Col className="MontserratMedium-500 d-flex justify-content-center my-2">
        <img
          src={LimitExceedIcon}
          alt=""
          className={styles["warningIcon"]}
          draggable="false"
        />
        <span className={textStyle}>{text}</span>
      </Col>
    </Row>
  );
};

export default subscriptionwarninglimit;
