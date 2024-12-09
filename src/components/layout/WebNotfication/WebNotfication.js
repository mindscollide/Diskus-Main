import React from "react";
import styles from "./WebNotification.module.css";
import { Col, Row } from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import WebNotificationCard from "./WebNotificationCard/WebNotificationCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import BellIconNotificationEmptyState from "../../../assets/images/BellIconEmptyState.png";
import { useTranslation } from "react-i18next";
import moment from "moment";

const WebNotfication = ({
  webNotificationData, // All Web Notification that Includes or Notification Data
  fetchNotifications, // Scrolling Function on Lazy Loading
  totalCountNotification, // Total number of Notification
  isReadNotification, //IsRead Notification Flag
}) => {
  console.log(isReadNotification, "isReadNotification");
  console.log(webNotificationData, "isReadNotification");
  const { t } = useTranslation();
  const todayDate = moment().format("YYYYMMDD"); // Format today's date to match the incoming date format

  //Global Loader From Setting Reducer
  const WebNotificaitonLoader = useSelector(
    (state) => state.settingReducer.Loading
  );

  //Spinner Styles in Lazy Loading
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  //Grouping of Notification on Todays and Previous Categories
  const groupedNotifications = webNotificationData.reduce(
    (acc, notification) => {
      const notificationDate = notification.sentDateTime.slice(0, 8); // Extract YYYYMMDD from sentDateTime
      if (notificationDate === todayDate) {
        acc.today.push(notification);
      } else {
        acc.previous.push(notification);
      }
      return acc;
    },
    { today: [], previous: [] }
  );
  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row className="mt-2">
        {groupedNotifications.today.length > 0 && (
          <Col lg={12} md={12} sm={12}>
            <span className={styles["NotificationCategories"]}>Today</span>
          </Col>
        )}
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
            {/* Render "Today" Notifications */}
            {groupedNotifications.today.length > 0 &&
              groupedNotifications.today.map((data, index) => (
                <Row
                  key={data.notificationID || `notification-today-${index}`}
                  className={
                    data.isRead === false
                      ? styles["BackGroundUnreadNotifications"]
                      : styles["BackGroundreadNotifications"]
                  }
                >
                  <Col lg={12} md={12} sm={12}>
                    <WebNotificationCard
                      NotificationMessege={data.description}
                      NotificationTime={data.sentDateTime}
                      index={index}
                      length={groupedNotifications.today.length}
                      NotificaitonID={data.notificationID}
                    />
                  </Col>
                </Row>
              ))}

            {/* Render "Previous" Header and Notifications */}
            {groupedNotifications.previous.length > 0 && (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["NotificationCategories"]}>
                      Previous
                    </span>
                  </Col>
                </Row>
                {groupedNotifications.previous.map((data, index) => (
                  <Row
                    key={
                      data.notificationID || `notification-previous-${index}`
                    }
                    className={
                      data.isRead === false
                        ? styles["BackGroundUnreadNotifications"]
                        : styles["BackGroundreadNotifications"]
                    }
                  >
                    <Col lg={12} md={12} sm={12}>
                      <WebNotificationCard
                        NotificationMessege={data.description}
                        NotificationTime={data.sentDateTime}
                        index={index}
                        length={groupedNotifications.previous.length}
                        NotificaitonID={data.notificationID}
                      />
                    </Col>
                  </Row>
                ))}
              </>
            )}

            {/* No Notifications */}
            {webNotificationData.length === 0 && (
              <Row>
                <Col lg={12} md={12} sm={12} className={styles["TopMargin"]}>
                  <div className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                    <img
                      src={BellIconNotificationEmptyState}
                      width="155.35px"
                      height="111px"
                      alt=""
                    />
                    <span className={styles["NotificationEmptyState"]}>
                      {t("You-have-no-notifications")}
                    </span>
                  </div>
                </Col>
              </Row>
            )}
          </InfiniteScroll>
        </Col>
      </Row>
    </section>
  );
};

export default WebNotfication;
