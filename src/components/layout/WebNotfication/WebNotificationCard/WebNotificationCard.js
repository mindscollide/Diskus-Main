import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./WebNotificationCard.module.css";
import AddedInMeeting from "../../../../assets/NotificationIcon/Meeting created.png";
import MeetingUpdateIcon from "../../../../assets/NotificationIcon/Meeting Updated.png";
import MeetingStartedIcon from "../../../../assets/NotificationIcon/Meeting started.png";
import MeetingEndedIcon from "../../../../assets/NotificationIcon/Meeting Ended.png";
import MeetingCancelledIcon from "../../../../assets/NotificationIcon/Cancel meeting.png";
import RemovedFromMeetingIcon from "../../../../assets/NotificationIcon/Removed from Meeting.png";
import MinutesreviewrequestIcon from "../../../../assets/NotificationIcon/Minutes review request.png";
import removedfromminutesreviewrequestIcon from "../../../../assets/NotificationIcon/removed from minutes review request.png";
import Added_As_A_ParticipantIcon from "../../../../assets/NotificationIcon/Added_As_A_Participant.png";
import Added_As_An_OrganizerIcon from "../../../../assets/NotificationIcon/Added_As_An_Organizer.png";
import Added_As_An_Agenda_ContributorIcon from "../../../../assets/NotificationIcon/Added_As_An_Agenda_Contributor.png";
import PollcreatedIcon from "../../../../assets/NotificationIcon/Poll created.png";
import Propose_Meeting_RequestIcon from "../../../../assets/NotificationIcon/Propose_Meeting_Request.png";
import Propose_Meeting_Slot_SelectedIcon from "../../../../assets/NotificationIcon/Propose_Meeting_Slot_Selected.png";
import Propose_Meeting_Slot_Selected_For_OrganizerIcon from "../../../../assets/NotificationIcon/Propose_Meeting_Slot_Selected_For_Organizer.png";
import Added_In_A_GroupIcon from "../../../../assets/NotificationIcon/Added_In_A_Group.png";
import Removed_From_A_GroupIcon from "../../../../assets/NotificationIcon/Removed_From_A_Group.png";
import Group_ArchivedIcon from "../../../../assets/NotificationIcon/Group_Archived.png";
import Group_InactivatedIcon from "../../../../assets/NotificationIcon/Group_Inactivated.png";
import Group_ActivatedIcon from "../../../../assets/NotificationIcon/Group_Activated.png";
import Added_In_A_CommitteeIcon from "../../../../assets/NotificationIcon/Added_In_A_Committee.png";
import Removed_From_A_CommitteeIcon from "../../../../assets/NotificationIcon/Removed_From_A_Committee.png";
import Committee_InActivatedIcon from "../../../../assets/NotificationIcon/Committee_InActivated.png";
import Committee_ActivatedIcon from "../../../../assets/NotificationIcon/Committee_Activated.png";
import Added_In_A_Resolution_As_VoterIcon from "../../../../assets/NotificationIcon/Added_In_A_Resolution_As_Voter.png";
import Added_In_A_Resolution_As_NonVoterIcon from "../../../../assets/NotificationIcon/Added_In_A_Resolution_As_NonVoter.png";
import Resolution_Decision_AnnouncedIcon from "../../../../assets/NotificationIcon/Resolution_Decision_Announced.png";
import Poll_UpdatedIcon from "../../../../assets/NotificationIcon/Poll_Updated.png";
import Poll_Result_Published from "../../../../assets/NotificationIcon/Poll_Result_Published.png";
import File_Shared_As_A_ViewerIcon from "../../../../assets/NotificationIcon/File_Shared_As_A_Viewer.png";
import File_Shared_As_An_EditorIcon from "../../../../assets/NotificationIcon/File_Shared_As_An_Editor.png";
import Folder_Shared_As_An_ViewerIcon from "../../../../assets/NotificationIcon/Folder_Shared_As_An_Viewer.png";
import Folder_Shared_As_An_EditorIcon from "../../../../assets/NotificationIcon/Folder_Shared_As_An_Editor.png";
import Shared_Editor_Folder_DeletedIcon from "../../../../assets/NotificationIcon/Shared_Editor_Folder_Deleted.png";
import Shared_Editor_File_DeletedIcon from "../../../../assets/NotificationIcon/Shared_Editor_File_Deleted.png";
import Shared_Viewer_Folder_DeletedIcon from "../../../../assets/NotificationIcon/Shared_Viewer_Folder_Deleted.png";
import Shared_Viewer_File_DeletedIcon from "../../../../assets/NotificationIcon/Shared_Viewer_File_Deleted.png";
import { WebNotificationDateFormatter } from "../../../../commen/functions/date_formater";

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
            <img src={AddedInMeeting} width={46} alt="" />
          ) : NotificaitonID === 2 ? (
            <img src={MeetingUpdateIcon} width={46} alt="" />
          ) : NotificaitonID === 3 ? (
            <img src={MeetingStartedIcon} width={46} alt="" />
          ) : NotificaitonID === 4 ? (
            <img src={MeetingEndedIcon} width={46} alt="" />
          ) : NotificaitonID === 5 ? (
            <img src={MeetingCancelledIcon} width={46} alt="" />
          ) : NotificaitonID === 6 ? (
            <img src={RemovedFromMeetingIcon} width={46} alt="" />
          ) : NotificaitonID === 7 ? (
            <img src={MinutesreviewrequestIcon} width={46} alt="" />
          ) : NotificaitonID === 8 ? (
            <img src={removedfromminutesreviewrequestIcon} width={46} alt="" />
          ) : NotificaitonID === 9 ? (
            <img src={Added_As_A_ParticipantIcon} width={46} alt="" />
          ) : NotificaitonID === 10 ? (
            <img src={Added_As_An_OrganizerIcon} width={46} alt="" />
          ) : NotificaitonID === 11 ? (
            <img src={Added_As_An_Agenda_ContributorIcon} width={46} alt="" />
          ) : NotificaitonID === 12 ? (
            <img src={PollcreatedIcon} width={46} alt="" />
          ) : NotificaitonID === 13 ? (
            <img src={Propose_Meeting_RequestIcon} width={46} alt="" />
          ) : NotificaitonID === 14 ? (
            <img src={Propose_Meeting_Slot_SelectedIcon} width={46} alt="" />
          ) : NotificaitonID === 15 ? (
            <img
              src={Propose_Meeting_Slot_Selected_For_OrganizerIcon}
              width={46}
              alt=""
            />
          ) : NotificaitonID === 16 ? (
            <img src={Added_In_A_GroupIcon} width={46} alt="" />
          ) : NotificaitonID === 17 ? (
            <img src={Removed_From_A_GroupIcon} width={46} alt="" />
          ) : NotificaitonID === 18 ? (
            <img src={Group_ArchivedIcon} width={46} alt="" />
          ) : NotificaitonID === 19 ? (
            <img src={Group_InactivatedIcon} width={46} alt="" />
          ) : NotificaitonID === 20 ? (
            <img src={Group_ActivatedIcon} width={46} alt="" />
          ) : NotificaitonID === 21 ? (
            <img src={Added_In_A_CommitteeIcon} width={46} alt="" />
          ) : NotificaitonID === 22 ? (
            <img src={Removed_From_A_CommitteeIcon} width={46} alt="" />
          ) : NotificaitonID === 23 ? (
            <img src={AddedInMeeting} width={46} alt="" />
          ) : NotificaitonID === 24 ? (
            <img src={Committee_InActivatedIcon} width={46} alt="" />
          ) : NotificaitonID === 25 ? (
            <img src={Committee_ActivatedIcon} width={46} alt="" />
          ) : NotificaitonID === 26 ? (
            <img src={Added_In_A_Resolution_As_VoterIcon} width={46} alt="" />
          ) : NotificaitonID === 27 ? (
            <img
              src={Added_In_A_Resolution_As_NonVoterIcon}
              width={46}
              alt=""
            />
          ) : NotificaitonID === 28 ? (
            <img src={Resolution_Decision_AnnouncedIcon} width={46} alt="" />
          ) : NotificaitonID === 29 ? (
            <img src={PollcreatedIcon} width={46} alt="" />
          ) : NotificaitonID === 30 ? (
            <img src={Poll_UpdatedIcon} width={46} alt="" />
          ) : NotificaitonID === 31 ? (
            <img src={Poll_Result_Published} width={46} alt="" />
          ) : NotificaitonID === 33 ? (
            <img src={File_Shared_As_A_ViewerIcon} width={46} alt="" />
          ) : NotificaitonID === 34 ? (
            <img src={File_Shared_As_An_EditorIcon} width={46} alt="" />
          ) : NotificaitonID === 35 ? (
            <img src={Folder_Shared_As_An_ViewerIcon} width={46} alt="" />
          ) : NotificaitonID === 36 ? (
            <img src={Folder_Shared_As_An_EditorIcon} width={46} alt="" />
          ) : NotificaitonID === 37 ? (
            <img src={Shared_Editor_Folder_DeletedIcon} width={46} alt="" />
          ) : NotificaitonID === 38 ? (
            <img src={Shared_Editor_File_DeletedIcon} width={46} alt="" />
          ) : NotificaitonID === 39 ? (
            <img src={Shared_Viewer_Folder_DeletedIcon} width={46} alt="" />
          ) : NotificaitonID === 40 ? (
            <img src={Shared_Viewer_File_DeletedIcon} width={46} alt="" />
          ) : null}

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
