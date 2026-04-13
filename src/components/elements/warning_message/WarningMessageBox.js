import React from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./WarningMessageBox.module.css";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import "./../../../i18n";
import { useTranslation } from "react-i18next";

/**
 * @component WarningMessageBox
 * @description Renders a styled warning banner with a bold "Warning" heading
 * (preceded by an exclamation-triangle icon) and a configurable message body.
 * Used across the platform to surface non-blocking alerts — for example, when a
 * feature is unavailable due to missing permissions or incomplete configuration.
 * The heading label is translated via react-i18next.
 *
 * @param {string} text      - The warning message text displayed in the body of the box.
 * @param {string} textClass - Additional CSS class applied to the `<p>` element that
 *                             wraps the message text (allows per-call-site typography overrides).
 *
 * @example
 * <WarningMessageBox
 *   text="You do not have permission to perform this action."
 *   textClass="text-danger"
 * />
 */
const WarningMessageBox = ({ text, textClass }) => {
  const { t } = useTranslation();
  return (
    <Row>
      <Col sm={12} lg={12} md={12} className={styles["ErrorMessageBox"]}>
        <Row>
          <Col sm={12} lg={12} md={12} className={styles["warning_heading"]}>
            <span className="me-2">
              <ExclamationTriangleFill />
            </span>
            {t("Warning")}
          </Col>
          <Col sm={12} lg={12} md={12} className="text-justify">
            <p className={textClass}>{text}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default WarningMessageBox;
