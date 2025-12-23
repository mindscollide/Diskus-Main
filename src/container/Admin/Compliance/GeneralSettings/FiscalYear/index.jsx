import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";
import { TextField } from "../../../../../components/elements";
import Select from "react-select";

const FiscalYear = ({ organizationSettingData }) => {
  const { t } = useTranslation();
  const [fiscalYearStartDate, setfiscalYearStartDate] = useState(1);
  const months = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];
  const [selectMonthOfYear, setSelectMonthOfYear] = useState(months[6]);

  useEffect(() => {
    if (organizationSettingData !== null) {
    }
  }, [organizationSettingData]);

  const onChangeFYStartDate = (e) => {
    // const { value } = e.target;
    // console.log(e, "onChangeFYStartDate");
    // if (parseInt(value) >= 0 && parseInt(value) <= 31) {
    //   setfiscalYearStartDate();
    // }
  };
  return (
    <Row>
      <Col lg={3} md={3} sm={12} className="mt-4">
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
        <div className={styles["dropdownHeading"]}>
          {t("Fiscal-year-start-month")}
        </div>
        <Select
          isSearchable={true}
          options={months}
          onChange={(event) => setSelectMonthOfYear(event)}
          value={selectMonthOfYear}
          placeholder={t("Please-select-Month")}
          classNamePrefix="Select_fical_year_month"
        />
      </Col>
      <Col
        lg={3}
        md={3}
        sm={12}
        className="d-flex flex-column align-items-center justify-content-center"
      >
        <div className={`${styles["dropdownHeading"]}`}>
          {t("Fiscal-year-end")}
        </div>
        <span className={styles["endYearText"]}>{"30 June"}</span>
      </Col>
    </Row>
  );
};

export default FiscalYear;
