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
  console.log(webNotificationData, "webNotificationDatawebNotificationData");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sRowsData, setSRowsData] = useState(0);
  const [totalRecords, setTotalRecords] = useState(webNotificationData.length);
  const [loading, setLoading] = useState(false);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  // Function to fetch more data from webNotificationData
  const fetchNotifications = () => {
    if (sRowsData < totalRecords) {
      setLoading(true);

      // Simulate a delay like an API call (optional)
      setTimeout(() => {
        const newNotifications = webNotificationData.slice(
          sRowsData,
          sRowsData + 8
        );

        setwebNotificationData((prev) => {
          // Combine the current data with new data, ensuring uniqueness
          const combinedData = [
            ...prev,
            ...newNotifications.filter(
              (notification) =>
                !prev.some(
                  (existingNotification) =>
                    existingNotification.id === notification.id
                )
            ),
          ];
          return combinedData;
        });

        setSRowsData((prev) => prev + 8); // Increment row count
        setLoading(false);
      }, 1000); // Simulating a delay of 1 second
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
            next={fetchNotifications} // Trigger fetch when reaching the bottom
            hasMore={webNotificationData.length < totalRecords} // Continue fetching until limit
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
                key={index}
                className={
                  index !== webNotificationData.length - 1
                    ? styles["BackGroundUnreadNotifications"]
                    : styles["BackGroundreadNotifications"] // Apply the class only if it's not the last item
                }
              >
                <Col lg={12} md={12} sm={12}>
                  <WebNotificationCard
                    NotificationMessege={data.description}
                    NotificationTime={data.sentDateTime}
                    index={index}
                    length={webNotificationData.length}
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
