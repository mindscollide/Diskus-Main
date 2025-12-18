import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";

const FiscalYear = () => {
  const { t } = useTranslation();
  return (
    <Row>
      <Col lg={4} md={4} sm={12} className="mt-3">
        <span className={styles["leftHeadingStyle"]}>
          {t("Fiscal-year-settings")}
        </span>
      </Col>
      <Col lg={4} md={4} sm={12}>
        {/* Type int */}
        <div className={styles["dropdownHeading"]}>
          {t("Fiscal-year-start-date")}
        </div>
      </Col>
      {/* Select  */}

      <Col lg={4} md={4} sm={12}>
        <div className={styles["dropdownHeading"]}>
          {t("Fiscal-year-start-month")}
        </div>
      </Col>
    </Row>
  );
};

export default FiscalYear;
