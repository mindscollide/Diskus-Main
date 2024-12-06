import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./WebNotificationCard.module.css";
import AddedInMeeting from "../../../../assets/images/Added in meeting.png";
import MeetingUpdated from "../../../../assets/images/Meeting Updated.png";
import MeetingCreated from "../../../../assets/images/Meeting created.png";
import MeetingEnded from "../../../../assets/images/Meeting Ended.png";
import RemoveFromMeeting from "../../../../assets/images/Removed from Meeting.png";
import TaskCreated from "../../../../assets/images/Task Created.png";
import AddedInTask from "../../../../assets/images/Added in a task.png";
import TaskStatusChange from "../../../../assets/images/Task status change.png";
import TaskDeadline from "../../../../assets/images/Task Deadline.png";
import TaskDeleted from "../../../../assets/images/Task Deleted.png";
import AddedAnEventFromGoogleCalender from "../../../../assets/images/Added an event from Google Calendar.png";
import AddedAnEventFromOutlookCalender from "../../../../assets/images/Added an event from Outlook Calendar.png";
import UpdatedAnEventFromGoogleCalender from "../../../../assets/images/Updated event from Google Calendar.png";
import UpdatedAnEventFromOutlookCalender from "../../../../assets/images/Updated event from Outlook Calendar.png";
import DeleteAnEventFromOutlookCalender from "../../../../assets/images/Deleted event from Outlook Calendar.png";
import DeleteAnEventFromGoogleCalender from "../../../../assets/images/Deleted event from Outlook Calendar.png";
import FolderShared from "../../../../assets/images/folder shared.png";
import FolderDeleted from "../../../../assets/images/folder deleted.png";
import RightsChangeInAnyFile from "../../../../assets/images/Rights change in any file.png";
import GroupCreated from "../../../../assets/images/Group created.png";
import GroupDeleted from "../../../../assets/images/Group deleted.png";
import CommitteesCreated from "../../../../assets/images/Committees created.png";
import CommitteesDeleted from "../../../../assets/images/Committees deleted.png";
import ResolutionCreated from "../../../../assets/images/Resolution created.png";
import ResolutionDeleted from "../../../../assets/images/Resolution deleted.png";
import ResolutionAdded from "../../../../assets/images/Added in resolution.png";
import ResolutionIntimationDeadline from "../../../../assets/images/Deadline intimation in resolution.png";
import PollCreated from "../../../../assets/images/Poll created.png";
import PollDeleted from "../../../../assets/images/Poll deleted.png";
import PollResult from "../../../../assets/images/Poll Result.png";
import SignatureRequest from "../../../../assets/images/Signatures request.png";
import MinutesReviewRequest from "../../../../assets/images/Minutes review request.png";
import Video from "../../../../assets/images/Video.png";
import Approval from "../../../../assets/images/Approval.png";
import Signature from "../../../../assets/images/Signature.png";
import { WebNotficationDateFormatter } from "../../../../commen/functions/date_formater";

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
          {NotificaitonID === 1 ? (
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
          )}

          <span className={styles["NotificationMessegeUnmarked"]}>
            {truncatedMessage}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className="d-flex flex-column flex-wrap">
          <span className={styles["NotifcationDateStyles"]}>
            {WebNotficationDateFormatter(NotificationTime, Lang)}
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
