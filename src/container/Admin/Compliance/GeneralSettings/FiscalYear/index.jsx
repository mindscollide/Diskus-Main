import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";
import { TextField } from "../../../../../components/elements";
import Select from "react-select";

const FiscalYear = ({ organizationSettingData, setOrganizationSetting }) => {
  const { t } = useTranslation();

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
  const [fiscalYearStartDay, setfiscalYearStartDay] = useState(1);
  const [selectStartMonthOfYear, setSelectStartMonthOfYear] = useState(
    months[6]
  );
  const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   if (organizationSettingData !== null) {
  //     setfiscalYearStartDay(organizationSettingData.fiscalYearStartDay);

  //     const monthIndex = organizationSettingData.fiscalStartMonth - 1;

  //     setSelectStartMonthOfYear(months[monthIndex]);
  //     // calculateFiscalYearEndDate();

  //     // setEndDate(
  //     //   `${organizationSettingData.fiscalYearDay} ${months[monthIndex]?.label}`
  //     // );
  //   }
  // }, [organizationSettingData]);

  const onChangeFYStartDate = (event) => {
    const { name, value } = event.target;
    console.log(name, value, "handleChangeDueDatehandleChangeDueDate");
    if (name === "FYStartDate") {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          fiscalYearDay: Number(value),
        };
      });
      return;
    }
  };

  const calculateFiscalYearEndDate = () => {
    if (!fiscalYearStartDay || !selectStartMonthOfYear) return;

    // Create start date (year is dummy, logic still works)
    const startDate = new Date(
      2024,
      selectStartMonthOfYear.value - 1,
      fiscalYearStartDay
    );

    // Subtract 1 day
    startDate.setDate(startDate.getDate() - 1);

    // Format result
    const endDay = startDate.getDate();
    const endMonth = months[startDate.getMonth()]?.label;

    console.log(endDay, endMonth, "setEndDatesetEndDate");

    setEndDate(`${endDay} ${endMonth}`);
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
          maxLength={10}
          onKeyDown={(e) => e.preventDefault()}
          name={"FYStartDate"}
          value={fiscalYearStartDay}
          type="number"
          min={1}
          max={31}
          applyClass={"usermanagementTextField"}
          change={onChangeFYStartDate}
          onBlur={calculateFiscalYearEndDate}
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
          onChange={(event) => setSelectStartMonthOfYear(event)}
          onBlur={calculateFiscalYearEndDate}
          value={selectStartMonthOfYear}
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
        <span className={styles["endYearText"]}>{endDate}</span>
      </Col>
    </Row>
  );
};

export default FiscalYear;
