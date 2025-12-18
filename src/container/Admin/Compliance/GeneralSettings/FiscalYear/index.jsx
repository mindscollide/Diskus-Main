import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";
import { TextField } from "../../../../../components/elements";

const FiscalYear = () => {
  const { t } = useTranslation();
  const [fiscalYearStartDate, setfiscalYearStartDate] = useState(1);

  const onChangeFYStartDate = (e) => {
    // const { value } = e.target;
    // console.log(e, "onChangeFYStartDate");
    // if (parseInt(value) >= 0 && parseInt(value) <= 31) {
    //   setfiscalYearStartDate();
    // }
  };
  return (
    <Row>
      <Col lg={3} md={3} sm={12} className="mt-3">
        <span className={styles["leftHeadingStyle"]}>
          {t("Fiscal-year-settings")}
        </span>
      </Col>
      <Col lg={3} md={3} sm={12}>
        {/* Type int */}
        <div className={styles["dropdownHeading"]}>
          {t("Fiscal-year-start-date")}
        </div>
        <TextField
          labelclass={"d-none"}
          // placeholder={t("Authority-name")}
          maxLength={10}
          name={"FYStartDate"}
          value={fiscalYearStartDate}
          type="number"
          applyClass={"usermanagementTextField"}
          change={onChangeFYStartDate}
        />
      </Col>

      {/* Select  */}

      <Col lg={3} md={3} sm={12}>
        <div
        // className={`${styles["dropdownHeading"]} ${styles["Select_country_Authoriy_label"]}`}
        // className={`${styles["dropdownHeading"]} ${styles["Select_country_Authoriy_label"]}
        >
          {t("Fiscal-year-start-month")}
        </div>
      </Col>
      <Col lg={3} md={3} sm={12}>
        <div className={styles["dropdownHeading"]}>{t("Fiscal-year-end")}</div>
        <span className={styles["leftHeadingStyle"]}>{"30 June"}</span>
      </Col>
    </Row>
  );
};

export default FiscalYear;
