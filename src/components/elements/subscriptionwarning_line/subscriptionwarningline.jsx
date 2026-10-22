import React from "react";
import styles from "./subscriptionwarningline.module.css";
import { Row, Col } from "react-bootstrap";
import LimitExceedIcon from "./../../../assets/images/limit-exceed.png";
/**
 * @component subscriptionwarningline
 * @description Renders a full-width banner-style warning row used to alert users about
 * subscription limit issues. Displays a limit-exceed icon alongside a customisable
 * warning message. The banner's background colour is controlled via the `color` prop.
 *
 * @param {string} text - The warning message text to display next to the icon.
 * @param {string} color - A valid CSS colour value applied as the banner's background colour
 *   (e.g. `"#FFF3CD"` or `"orange"`).
 *
 * @example
 * <subscriptionwarningline
 *   text="You have reached your user limit. Please upgrade your plan."
 *   color="#FFF3CD"
 * />
 */
const subscriptionwarningline = ({ text, color }) => {
  return (
    <Row
      className={styles["subscription_warning"]}
      style={{ backgroundColor: color }}
    >
      <Col className="MontserratMedium-500 d-flex justify-content-center my-2">
        <img
          src={LimitExceedIcon}
          alt=""
          className={styles["warningIcon"]}
          draggable="false"
        />
        <span className={styles["warnignMessage"]}>{text}</span>
      </Col>
    </Row>
  );
};

export default subscriptionwarningline;
