import React, { useState } from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
const WebNotfication = () => {
  const [dummyNotifcation, setDummyNotfication] = useState([
    {
      Messege:
        "Routine Check start in 30 mins. Go to Meeting Details to run through any attachments before the meeting",
      Time: "12:13 pm",
    },
    {
      Messege:
        "Mr. Yaqoob added an attachment to your meeting, Finance Breakdown.",
      Time: "10:48 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
    {
      Messege:
        "Board Member Executive Meetings  added on 16:00, 24th May, 2020. ",
      Time: "09:03 am",
    },
  ]);
  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["NotificationCateogries"]}>Today</span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {dummyNotifcation.map((data, index) => {
            return (
              <>
                <WebNotificationCard
                  NotificationMessege={data.Messege}
                  NotificationTime={data.Time}
                />
                {index !== dummyNotifcation.length - 1 && (
                  <span className={styles["SeperateNotificationLine"]}></span>
                )}
              </>
            );
          })}
        </Col>
      </Row>
    </section>
  );
};

export default WebNotfication;
