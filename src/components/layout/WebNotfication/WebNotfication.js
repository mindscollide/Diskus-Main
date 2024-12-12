import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const WebNotfication = ({
  webNotificationData, // All Web Notification that Includes or Notification Data
  setwebNotificationData, // Set State for Web Notification Data
  totalCountNotification, // Total number of Notification
  fetchNotifications, // Scrolling Function on Lazy Loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const todayDate = moment().format("YYYYMMDD"); // Format today's date to match the incoming date format
  const [groupedNotifications, setGroupedNotifications] = useState({
    today: [],
    previous: [],
  });

  //Global Loader From Setting Reducer
  const WebNotificaitonLoader = useSelector(
    (state) => state.settingReducer.Loading
  );

  //Global Data State
  const GlobalUnreadCountNotificaitonFromMqtt = useSelector(
    (state) => state.settingReducer.realTimeNotificationCountGlobalData
  );

  console.log(
    GlobalUnreadCountNotificaitonFromMqtt,
    "GlobalUnreadCountNotificaitonFromMqtt"
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

  // Real-time data for notification appending in webNotificationData
  useEffect(() => {
    if (
      Array.isArray(GlobalUnreadCountNotificaitonFromMqtt) &&
      GlobalUnreadCountNotificaitonFromMqtt.length > 0
    ) {
      // Iterate over each notification object in the array
      const newNotifications = GlobalUnreadCountNotificaitonFromMqtt.map(
        (notification) => notification.notificationData
      );

      // Prepending the new notifications to the state while ensuring uniqueness
      setwebNotificationData((prevData) => {
        const newData = newNotifications.filter(
          (newNotification) =>
            !prevData.some(
              (existingNotification) =>
                existingNotification.notificationID ===
                newNotification.notificationID
            )
        );
        return [...newData, ...prevData]; // Add new unique notifications to the front of the list
      });
    }
  }, [GlobalUnreadCountNotificaitonFromMqtt]);

  // Group notifications whenever webNotificationData changes
  useEffect(() => {
    const uniqueNotifications = Array.from(
      new Map(
        webNotificationData.map((item) => [item.notificationID, item])
      ).values()
    );

    const groupNotificationsData = uniqueNotifications.reduce(
      (acc, notification) => {
        const notificationDate = notification.sentDateTime.slice(0, 8); // Extract YYYYMMDD
        if (notificationDate === todayDate) {
          acc.today.push(notification);
        } else {
          acc.previous.push(notification);
        }
        return acc;
      },
      { today: [], previous: [] }
    );

    setGroupedNotifications(groupNotificationsData);
    console.log(groupNotificationsData, "groupNotificationsData");
  }, [webNotificationData, todayDate]);

  //Handle Click Notification
  const HandleClickNotfication = (NotificationData) => {
    console.log(NotificationData, "NotificationDataNotificationData");
    //PayLoad For Groups
    let PayLoadData = JSON.parse(NotificationData.payloadData);
    console.log(PayLoadData, "PayLoadData");
    if (NotificationData.notificationActionID === 1) {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
      }
    } else if (NotificationData.notificationActionID === 2) {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
      }
    } else if (NotificationData.notificationActionID === 3) {
      //Notification For Meeting Started For Participant (Create Update Started scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
      }
    } else if (NotificationData.notificationActionID === 4) {
      //Notification For Meeting Ended For Participant (Create Update Started scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
      }
    } else if (NotificationData.notificationActionID === 5) {
      //Notification if the Meeting is cancelled and is only applicable for Quick meet not advanced
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      }
    } else if (NotificationData.notificationActionID === 6) {
      //Notification For being removed from  Meeting
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
      } else {
        navigate("/Diskus/Meeting");
      }
    } else if (NotificationData.notificationActionID === 7) {
      //Notification for being added as a minute reviewer
      navigate("/Diskus/Minutes");
      localStorage.setItem("MinutesOperations", true);
      localStorage.setItem(
        "NotificationClickMinutesMeetingID",
        PayLoadData.MeetingID
      );
    } else if (NotificationData.notificationActionID === 8) {
      //Notification for Being Removed As a reviwer in Minutes review
      navigate("/Diskus/Minutes");
    } else if (NotificationData.notificationActionID === 9) {
    } else if (NotificationData.notificationActionID === 10) {
    } else if (NotificationData.notificationActionID === 11) {
    } else if (NotificationData.notificationActionID === 12) {
    } else if (NotificationData.notificationActionID === 13) {
      //Notification For Proposed Meeting Request
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOperations", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
    } else if (NotificationData.notificationActionID === 14) {
      //Notification When slot is selected by the participant.
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOperations", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
    } else if (NotificationData.notificationActionID === 15) {
    } else if (NotificationData.notificationActionID === 16) {
      //Notificaiton For Added in Group
      navigate("/Diskus/groups");
      //open ViewMode Modal Also in this
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    } else if (NotificationData.notificationActionID === 17) {
      //Notificaiton For Removed From Group
      navigate("/Diskus/groups");
    } else if (NotificationData.notificationActionID === 18) {
      //Notificaiton For Groups Archived
      navigate("/Diskus/groups");
      //open Archinved Modal Also in this
      localStorage.setItem("NotificationClickArchivedGroup", true);
    } else if (NotificationData.notificationActionID === 19) {
      //Notificaiton For Groups InActivated
      navigate("/Diskus/groups");
      //using the same logic here Srs say it will function same as Notificaiton ID 16 (Added in Group)
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    } else if (NotificationData.notificationActionID === 20) {
      //Notificaiton For Groups Activated
      navigate("/Diskus/groups");
      //using the same logic here Srs say it will function same as Notificaiton ID 16 (Added in Group)
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    } else if (NotificationData.notificationActionID === 21) {
      //Notification for being Added in the Committee
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    } else if (NotificationData.notificationActionID === 22) {
      //Notificaiton For Removed From Committee
      navigate("/Diskus/committee");
    } else if (NotificationData.notificationActionID === 23) {
      //Notificaiton For  Committee Archived
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeArchived", true);
    } else if (NotificationData.notificationActionID === 24) {
      //Notificaiton For Committee InActive
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    } else if (NotificationData.notificationActionID === 25) {
      //Notificaiton For Committee Active using the same above 24 logic as the operation End result is same
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    } else if (NotificationData.notificationActionID === 26) {
      //Notification for Added as Voter in the resolution
      navigate("/Diskus/resolution");
    } else if (NotificationData.notificationActionID === 27) {
      //Notification for Added as Non-Voter in the resolution
      navigate("/Diskus/resolution");
    } else if (NotificationData.notificationActionID === 28) {
      //Resolution Descision Announced
    } else if (NotificationData.notificationActionID === 29) {
      //Notification for Poll has been Created submit your response
      navigate("/Diskus/polling");
    } else if (NotificationData.notificationActionID === 30) {
      //Notification for Poll has been Updated submit your response
      navigate("/Diskus/polling");
    } else if (NotificationData.notificationActionID === 31) {
    } else if (NotificationData.notificationActionID === 32) {
    } else if (NotificationData.notificationActionID === 33) {
    } else if (NotificationData.notificationActionID === 34) {
    } else if (NotificationData.notificationActionID === 35) {
    } else if (NotificationData.notificationActionID === 36) {
    } else if (NotificationData.notificationActionID === 37) {
    } else if (NotificationData.notificationActionID === 38) {
    } else if (NotificationData.notificationActionID === 39) {
    } else if (NotificationData.notificationActionID === 40) {
    } else {
    }
  };

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
            dataLength={webNotificationData.length}
            next={fetchNotifications}
            hasMore={webNotificationData.length < totalCountNotification}
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
                    data.isRead
                      ? styles["BackGroundreadNotifications"]
                      : styles["BackGroundUnreadNotifications"]
                  }
                  onClick={() => HandleClickNotfication(data)}
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
                      data.isRead
                        ? styles["BackGroundreadNotifications"]
                        : styles["BackGroundUnreadNotifications"]
                    }
                    onClick={() => HandleClickNotfication(data)}
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
