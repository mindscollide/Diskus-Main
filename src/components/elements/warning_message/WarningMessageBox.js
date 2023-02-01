import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./WarningMessageBox.module.css";
import "./../../../i18n";
import { useTranslation } from "react-i18next";
const WarningMessageBox = ({ text }) => {
  // for translation
  const { t } = useTranslation();
  return (
    <Row>
      <Col sm={12} lg={12} md={12} className={styles["ErrorMessageBox"]}>
        <Row>
          <Col sm={12} lg={12} md={12} className={styles["warning_heading"]}>
            <span className="me-2">&#9888;</span>{t("Warning")}
          </Col>
          <Col sm={12} lg={12} md={12} className="text-justify">
            <p className="text-sm-left">{text}</p>
            {/* {t("This-is-warning-message")} */}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default WarningMessageBox;
