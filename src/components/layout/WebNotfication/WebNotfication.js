import React, { useEffect, useState } from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DiskusWebNotificationActionMethodAPI } from "../../../store/actions/UpdateUserNotificationSetting";
import { Spin } from "antd";
const WebNotfication = ({ webNotificationData, setwebNotificationData }) => {
  console.log(webNotificationData, "webNotificationData");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [sRowsData, setSRowsData] = useState(webNotificationData.length); // Start with current data length
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // Indicates if more data is available

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  // Function to fetch notifications from the API
  const fetchNotifications = async () => {
    if (loading || !hasMore) return; // Prevent multiple calls or unnecessary fetches

    setLoading(true);
    const data = { sRow: webNotificationData.length, eRow: 8 }; // Adjust rows for pagination

    try {
      const response = await dispatch(
        DiskusWebNotificationActionMethodAPI(navigate, t, data)
      );

      if (response && response.notifications) {
        const newNotifications = response.notifications.filter(
          (newNotification) =>
            !webNotificationData.some(
              (existingNotification) =>
                existingNotification.id === newNotification.id
            )
        );

        // Append new notifications if they exist
        if (newNotifications.length > 0) {
          setwebNotificationData((prev) => [...prev, ...newNotifications]);
          setSRowsData((prev) => prev + newNotifications.length); // Increment the starting row
        }

        // Check if we've loaded all data
        if (newNotifications.length < 8) {
          setHasMore(false); // No more data to fetch
        }
      } else {
        setHasMore(false); // No data returned
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

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
            dataLength={webNotificationData.length}
            next={fetchNotifications} // Trigger fetch on scroll
            hasMore={hasMore} // Fetch more if there are records left
            loader={
              loading && (
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
            height={"68vh"}
            style={{
              overflowX: "hidden",
            }}
          >
            {webNotificationData.map((data, index) => (
              <Row
                key={data.notificationID || index} // Unique key for each notification
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
