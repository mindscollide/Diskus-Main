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

const WebNotfication = ({
  webNotificationData, // All Web Notification that Includes or Notification Data
  fetchNotifications, // Scrolling Function on Lazy Loading
  totalCountNotification, // Total number of Notification
  isReadNotification, //IsRead Notification Flag
}) => {
  console.log(isReadNotification, "isReadNotification");
  console.log(webNotificationData, "isReadNotification");
  const { t } = useTranslation();
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
  console.log(webNotificationData, "WebNotificationOuterBox");
  return (
    <section className={styles["WebNotificationOuterBox"]}>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          {webNotificationData.length > 0 && (
            <span className={styles["NotificationCategories"]}>Today</span>
          )}
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
            {webNotificationData.length > 0 &&
            webNotificationData !== undefined ? (
              webNotificationData.map((data, index) => (
                <Row
                  key={data.notificationID || `notification-${index}`} // Key can be both index or Notification_ID
                  className={
                    isReadNotification === true
                      ? styles["BackGroundreadNotifications"]
                      : styles["BackGroundUnreadNotifications"]
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
              ))
            ) : (
              <>
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
              </>
            )}
          </InfiniteScroll>
        </Col>
      </Row>
    </section>
  );
};

export default WebNotfication;
