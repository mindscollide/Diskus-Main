import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";
import { TextField } from "../../../../../components/elements";
import Select from "react-select";

const FiscalYear = ({ organizationSettingData, setOrganizationSetting }) => {
  const { t } = useTranslation();

  const months = useMemo(
    () => [
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
    ],
    []
  );
  const [fiscalYearStartDay, setfiscalYearStartDay] = useState(null);
  const [selectStartMonthOfYear, setSelectStartMonthOfYear] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    console.log(
      organizationSettingData,
      "Reached here organizationSettingData"
    );
    if (!organizationSettingData) return;

    const monthIndex = organizationSettingData.fiscalStartMonth - 1;

    setfiscalYearStartDay(organizationSettingData.fiscalYearStartDay);
    setSelectStartMonthOfYear(months[monthIndex]);
  }, [organizationSettingData]);

  useEffect(() => {
    if (!fiscalYearStartDay || !selectStartMonthOfYear) return;

    // Fix invalid day when month changes
    const maxDays = getDaysInMonth(selectStartMonthOfYear.value);
    if (fiscalYearStartDay > maxDays) {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          fiscalYearStartDay: Number(maxDays),
        };
      });
      setfiscalYearStartDay(maxDays);
      return;
    }

    const end = calculateFiscalYearEndDate(
      fiscalYearStartDay,
      selectStartMonthOfYear.value
    );
    //
    setEndDate(end);
  }, [fiscalYearStartDay, selectStartMonthOfYear]);

  const onChangeFYStartDate = (event) => {
    const { name, value } = event.target;
    console.log(name, value, "handleChangeDueDatehandleChangeDueDate");
    if (name === "FYStartDate") {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          fiscalYearStartDay: Number(value),
        };
      });
      setfiscalYearStartDay(value);
      return;
    }
  };

  const handleChangeMonth = (event) => {
    console.log(event, "handleChangeMonth");
    setOrganizationSetting((organizationSettings) => {
      return {
        ...organizationSettings,
        fiscalStartMonth: Number(event.value),
      };
    });
    setSelectStartMonthOfYear(event);
    return;
  };

  const getDaysInMonth = (monthValue) => {
    return new Date(2024, monthValue, 0).getDate();
  };

  const calculateFiscalYearEndDate = (day, month) => {
    if (!day || !month) return null;

    // Fiscal year end = one year later, minus one day
    const startDate = new Date(2024, month - 1, day);
    startDate.setFullYear(startDate.getFullYear() + 1);
    startDate.setDate(startDate.getDate() - 1);

    return `${startDate.getDate()} ${months[startDate.getMonth()].label}`;
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
          // max={31}
          max={getDaysInMonth(selectStartMonthOfYear?.value)}
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
          onChange={handleChangeMonth}
          // onChange={(event) => {
          //   setSelectStartMonthOfYear(event);
          // }}
          // onBlur={calculateFiscalYearEndDate}
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
