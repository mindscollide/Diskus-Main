import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./WebNotificationCard.module.css";
import AddedInMeeting from "../../../../assets/images/Added in meeting.png";

import {
  WebNotficationDateFormatter,
  WebNotificationDateFormatter,
} from "../../../../commen/functions/date_formater";

const WebNotificationCard = ({
  NotificationMessege,
  NotificationTime,
  maxCharacters = 105,
  index,
  length,
  NotificaitonID,
}) => {
  //Current Language
  let Lang = localStorage.getItem("i18nextLng");
  //Local States
  const [truncatedMessage, setTruncatedMessage] = useState("");
  //UseEffect for Truncating the Text According to need without using webkitt solution for Text truncation
  useEffect(() => {
    if (NotificationMessege.length > maxCharacters) {
      setTruncatedMessage(
        NotificationMessege.substring(0, maxCharacters) + "..."
      );
    } else {
      setTruncatedMessage(NotificationMessege);
    }
  }, [NotificationMessege, maxCharacters]);

  return (
    <section className={styles["CardSectionInner"]}>
      <Row className="mt-2">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex align-items-center justify-content-center gap-2"
        >
          {/* Icons According to Unique Notification ID  */}
          {/* {NotificaitonID === 1 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 2 ? (
            <img src={MeetingUpdated} width={46} alt="" />
          ) : NotificaitonID === 3 ? (
            <img src={MeetingUpdated} width={46} alt="" />
          ) : NotificaitonID === 4 ? (
            <img src={MeetingEnded} width={46} alt="" />
          ) : NotificaitonID === 5 ? (
            <img src={MeetingEnded} width={46} alt="" />
          ) : NotificaitonID === 6 ? (
            <img src={RemoveFromMeeting} width={46} alt="" />
          ) : NotificaitonID === 7 ? (
            <img src={MinutesReviewRequest} width={46} alt="" />
          ) : NotificaitonID === 8 ? (
            <img src={MinutesReviewRequest} width={46} alt="" />
          ) : NotificaitonID === 9 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 10 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 11 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 12 ? (
            <img src={PollCreated} width={46} alt="" />
          ) : NotificaitonID === 13 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 14 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 15 ? (
            <img src={MeetingCreated} width={46} alt="" />
          ) : NotificaitonID === 16 ? (
            <img src={GroupCreated} width={46} alt="" />
          ) : NotificaitonID === 17 ? (
            <img src={GroupCreated} width={46} alt="" />
          ) : NotificaitonID === 18 ? (
            <img src={GroupCreated} width={46} alt="" />
          ) : NotificaitonID === 19 ? (
            <img src={GroupCreated} width={46} alt="" />
          ) : NotificaitonID === 20 ? (
            <img src={GroupCreated} width={46} alt="" />
          ) : NotificaitonID === 21 ? (
            <img src={CommitteesCreated} width={46} alt="" />
          ) : NotificaitonID === 22 ? (
            <img src={CommitteesCreated} width={46} alt="" />
          ) : NotificaitonID === 23 ? (
            <img src={CommitteesCreated} width={46} alt="" />
          ) : NotificaitonID === 24 ? (
            <img src={CommitteesCreated} width={46} alt="" />
          ) : NotificaitonID === 25 ? (
            <img src={CommitteesCreated} width={46} alt="" />
          ) : NotificaitonID === 26 ? (
            <img src={ResolutionCreated} width={46} alt="" />
          ) : NotificaitonID === 27 ? (
            <img src={ResolutionCreated} width={46} alt="" />
          ) : NotificaitonID === 28 ? (
            <img src={ResolutionCreated} width={46} alt="" />
          ) : NotificaitonID === 29 ? (
            <img src={PollCreated} width={46} alt="" />
          ) : NotificaitonID === 30 ? (
            <img src={PollCreated} width={46} alt="" />
          ) : NotificaitonID === 31 ? (
            <img src={PollResult} width={46} alt="" />
          ) : NotificaitonID === 33 ? (
            <img src={FolderShared} width={46} alt="" />
          ) : NotificaitonID === 34 ? (
            <img src={FolderShared} width={46} alt="" />
          ) : NotificaitonID === 35 ? (
            <img src={FolderShared} width={46} alt="" />
          ) : NotificaitonID === 36 ? (
            <img src={FolderShared} width={46} alt="" />
          ) : NotificaitonID === 37 ? (
            <img src={FolderDeleted} width={46} alt="" />
          ) : NotificaitonID === 38 ? (
            <img src={FolderDeleted} width={46} alt="" />
          ) : NotificaitonID === 39 ? (
            <img src={FolderDeleted} width={46} alt="" />
          ) : NotificaitonID === 40 ? (
            <img src={FolderDeleted} width={46} alt="" />
          ) : (
            <img src={MeetingCreated} width={46} alt="" />
          )} */}

          <span className={styles["NotificationMessegeUnmarked"]}>
            {truncatedMessage}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className="d-flex flex-column flex-wrap">
          <span className={styles["NotifcationDateStyles"]}>
            {WebNotificationDateFormatter(NotificationTime, Lang)}
          </span>
          {index !== length - 1 ? (
            <span className={styles["SeperateNotificationLine"]}></span>
          ) : null}
        </Col>
      </Row>
    </section>
  );
};

export default WebNotificationCard;
