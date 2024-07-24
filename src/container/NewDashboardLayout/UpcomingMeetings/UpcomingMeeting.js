import React from "react";
import styles from "./UpcomingMeeting.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
const UpcomingMeeting = ({ meetingValue }) => {
  console.log(meetingValue, "meetingValuemeetingValuemeetingValue")
  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["UpComingMeetingCount"]}>
          {formatValue(meetingValue)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["UpComingMeetingText"]}>
          Upcoming Meetings
        </Col>
      </Row>
    </>
  );
};

export default UpcomingMeeting;
