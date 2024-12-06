import React, { useEffect, useState } from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { useSelector } from "react-redux";

const WebNotfication = ({
  webNotificationData,
  fetchNotifications,
  totalCountNotification,
}) => {
  const WebNotificaitonLoader = useSelector(
    (state) => state.settingReducer.Loading
  );
  console.log(webNotificationData, "webNotificationData");
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row className="mt-2">
        <Col lg={12}>
          <span className={styles["NotificationCategories"]}>Today</span>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <InfiniteScroll
            dataLength={webNotificationData.length} // Current data length
            next={fetchNotifications} // Fetch more data
            hasMore={webNotificationData.length < totalCountNotification} // Stop if all data loaded
            loader={
              WebNotificaitonLoader && (
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center my-3"
                  >
                    <Spin indicator={antIcon} />
                  </Col>
                </Row>
              )
            }
            height="68vh"
            style={{ overflowX: "hidden" }}
          >
            {webNotificationData.map((data, index) => (
              <Row
                key={data.notificationID || `notification-${index}`} // Ensure a unique key
                className={
                  index !== webNotificationData.length - 1
                    ? styles["BackGroundUnreadNotifications"]
                    : styles["BackGroundreadNotifications"]
                }
              >
                <Col lg={12} md={12} sm={12}>
                  <WebNotificationCard
                    NotificationMessege={data.description}
                    NotificationTime={data.sentDateTime}
                    index={index}
                    length={webNotificationData.length}
                    NotificaitonID={data.notificationID}
                  />
                </Col>
              </Row>
            ))}
          </InfiniteScroll>
        </Col>
      </Row>
    </section>
  );
};

export default WebNotfication;
