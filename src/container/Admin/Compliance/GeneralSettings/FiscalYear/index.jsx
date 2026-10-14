import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./fiscalYear.module.css";
import { TextField } from "../../../../../components/elements";
import Select from "react-select";
import { formatNumber } from "../../../../../commen/functions/utils";

const monthLabels = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
};

const FiscalYear = ({ organizationSettingData, setOrganizationSetting }) => {
  const { t } = useTranslation();

  const months = useMemo(
    () => [
      { label: t("January"), value: 1 },
      { label: t("February"), value: 2 },
      { label: t("March"), value: 3 },
      { label: t("April"), value: 4 },
      { label: t("May"), value: 5 },
      { label: t("June"), value: 6 },
      { label: t("July"), value: 7 },
      { label: t("August"), value: 8 },
      { label: t("September"), value: 9 },
      { label: t("October"), value: 10 },
      { label: t("November"), value: 11 },
      { label: t("December"), value: 12 },
    ],
    []
  );
  const [fiscalYearStartDay, setfiscalYearStartDay] = useState(null);
  const [selectStartMonthOfYear, setSelectStartMonthOfYear] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    
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

  const lang = localStorage.getItem('i18nextLng') || 'en';
  const dayValue = startDate.getDate();
  const monthLabel = monthLabels[lang][startDate.getMonth()];

  return lang === 'ar'
    ? `${formatNumber(dayValue)} ${monthLabel}`
    : `${dayValue} ${monthLabel}`;
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
