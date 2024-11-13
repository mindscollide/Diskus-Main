import React from "react";
import styles from "./UpcomingMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
import { useTranslation } from "react-i18next";
const UpcomingMeeting = ({ meetingValue }) => {
  const { t } = useTranslation();
  let lang = localStorage.getItem("i18nextLng");

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["UpComingMeetingCount"]}>
          {formatValue(meetingValue, lang)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["UpComingMeetingText"]}>
          {t("Upcoming-meetings")}
        </Col>
      </Row>
    </>
  );
};

export default UpcomingMeeting;
