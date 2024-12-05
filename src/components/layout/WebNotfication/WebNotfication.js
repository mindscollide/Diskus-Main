import React from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
const WebNotfication = ({ webNotificationData }) => {
  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["NotificationCateogries"]}>Today</span>
        </Col>
      </Row>
      <Row>
        {webNotificationData.map((data, index) => {
          return (
            <>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={
                  index !== webNotificationData.length - 1 &&
                  styles["BackGroundUnreadNotifications"]
                }
              >
                <WebNotificationCard
                  NotificationMessege={data.Messege}
                  NotificationTime={data.Time}
                />
                {/* {index !== webNotificationData.length - 1 && (

                )} */}
              </Col>
            </>
          );
        })}
      </Row>
    </section>
  );
};

export default WebNotfication;
