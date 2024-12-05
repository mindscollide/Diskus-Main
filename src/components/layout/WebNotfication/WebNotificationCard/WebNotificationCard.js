import React, { useEffect, useState } from "react";
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
import { Col, Row } from "react-bootstrap";

const WebNotificationCard = ({
  NotificationMessege,
  NotificationTime,
  maxCharacters = 90,
}) => {
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

  console.log(NotificationMessege, "NotificationMessege");
  return (
    <section>
      <Row className="mt-2">
        <Col
          lg={10}
          md={10}
          sm={10}
          className="d-flex align-items-center justify-content-center gap-2"
        >
          <img src={AddedInMeeting} width={40} alt="" />
          <span className={styles["NotificationMessegeUnmarked"]}>
            {truncatedMessage}
          </span>
        </Col>
        <Col
          lg={2}
          md={2}
          sm={2}
          className="d-flex justify-content-end align-items-center mt-3"
        >
          <span className={styles["NotifcationDateStyles"]}>
            {NotificationTime}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default WebNotificationCard;
