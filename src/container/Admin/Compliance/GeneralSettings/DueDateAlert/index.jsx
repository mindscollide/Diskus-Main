import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import styles from "./dueDateAlert.module.css";
import { TextField } from "../../../../../components/elements";

const DueDateAlert = ({ organizationSettingData, setOrganizationSetting }) => {
  const { t } = useTranslation();
  const handleChangeDueDate = (event) => {
    console.log(event);
    const { name, value } = event.target;
    console.log(name, value, "handleChangeDueDatehandleChangeDueDate");
    if (name === "FYStartDateOne") {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          complianceAlertOne: Number(value),
        };
      });
      return;
    }
    if (name === "FYStartDateTwo") {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          complianceAlertTwo: Number(value),
        };
      });
      return;
    }

    if (name === "FYStartDateThree") {
      setOrganizationSetting((organizationSettings) => {
        return {
          ...organizationSettings,
          complianceAlertThree: Number(value),
        };
      });
      return;
    }
  };
  return (
    <>
      <Row>
        <Col className={styles["complainDueDateMainHeading"]}>
          {t("Compliance-due-date")}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex align-items-center justify-content-start gap-3 mt-3"
        >
          <div
            className={`${styles["dueDateAlert_color-span"]} ${styles["color-green"]}`}
          ></div>
          <div className={styles["dueDateAlert_color-text"]}>
            {t("First-reminder-day-before")}
          </div>
        </Col>

        <Col sm={12} md={6} lg={6} className={styles["selectNumer"]}>
          {/* Type int */}

          <TextField
            label={t("Select-day-number")}
            labelclass={styles["labelStyle"]}
            onKeyDown={(e) => e.preventDefault()}
            max={15}
            value={organizationSettingData.complianceAlertOne}
            name={"FYStartDateOne"}
            change={handleChangeDueDate}
            type="number"
            min={1}
            applyClass={"selectDayNumberTextField"}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex align-items-center justify-content-start gap-3  mt-3"
        >
          <div
            className={`${styles["dueDateAlert_color-span"]} ${styles["color-orange"]}`}
          ></div>
          <div className={styles["dueDateAlert_color-text"]}>
            {t("Second-reminder-day-before")}
          </div>
        </Col>

        <Col sm={12} md={6} lg={6}>
          {/* Type int */}

          <TextField
            label={t("Select-day-number")}
            labelclass={styles["labelStyle"]}
            // placeholder={t("Authority-name")}
            min={1}
            max={15}
            value={organizationSettingData.complianceAlertTwo}
            change={handleChangeDueDate}
            onKeyDown={(e) => e.preventDefault()}
            name={"FYStartDateTwo"}
            type="number"
            applyClass={"selectDayNumberTextField"}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex align-items-center justify-content-start gap-3  mt-3"
        >
          <div
            className={`${styles["dueDateAlert_color-span"]} ${styles["color-purple"]}`}
          ></div>
          <div className={styles["dueDateAlert_color-text"]}>
            {t("Third-reminder-day-before")}
          </div>
        </Col>

        <Col sm={12} md={6} lg={6}>
          <TextField
            label={t("Select-day-number")}
            labelclass={styles["labelStyle"]}
            max={15}
            min={1}
            change={handleChangeDueDate}
            value={organizationSettingData.complianceAlertThree}
            onKeyDown={(e) => e.preventDefault()}
            name={"FYStartDateThree"}
            type="number"
            applyClass={"selectDayNumberTextField"}
          />
        </Col>
      </Row>
    </>
  );
};

export default DueDateAlert;
