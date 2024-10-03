// CalendarFooter.js
import React from "react";
import styles from "./Calendar.module.css";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CalendarFooter = () => {
  const { t } = useTranslation();
  let diskusEventColor = localStorage.getItem("diskusEventColor");
  let googleEventColor = localStorage.getItem("googleEventColor");
  let officeEventColor = localStorage.getItem("officeEventColor");
  const diskusEventClr = () => {
    let backgroundColor = diskusEventColor;
    return (
      <>
        <span className="d-flex gap-2  ">
          <div style={{ backgroundColor }} className={styles["cirle"]}></div>
          <p className={styles["cirleheading"]}>{t("Diskus")}</p>
        </span>
      </>
    );
  };
  const googleEventClr = () => {
    let backgroundColor = googleEventColor;
    return (
      <>
        <span className="d-flex gap-2 ">
          <div style={{ backgroundColor }} className={styles["cirle"]}></div>
          <p className={styles["cirleheading"]}>{t("Google")}</p>
        </span>
      </>
    );
  };
  const officeEventClr = () => {
    let backgroundColor = officeEventColor;
    return (
      <>
        <span className="d-flex gap-2">
          <div style={{ backgroundColor }} className={styles["cirle"]}></div>
          <p className={styles["cirleheading"]}>{t("Microsoft")}</p>
        </span>
      </>
    );
  };
  return (
    <Row className={styles["custom-footer"]}>
      <Col
        sm={12}
        lg={12}
        md={12}
        className="d-flex justify-content-center align-items-center gap-2"
      >
        <span> {diskusEventColor ? diskusEventClr() : null}</span>
        <span>{googleEventColor ? googleEventClr() : null}</span>
        <span> {officeEventColor ? officeEventClr() : null}</span>
      </Col>
    </Row>
  );
};

export default CalendarFooter;
