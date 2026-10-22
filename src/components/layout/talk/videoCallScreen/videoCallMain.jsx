import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "../../../elements";
import { Row, Col } from "react-bootstrap";
import VideoPanelNormal from "./videoCallPanels/videoCallNormalPanel";
import VideoCallMinimizeHeader from "./videoCallHeader/videoCallMinimizeHeader";
import { leaveCallModal } from "../../../../store/actions/VideoFeature_actions";
import LeaveVideoIntimationModal from "./LeaveVideoIntimationModal/LeaveVideoIntimationModal";

const VideoMain = () => {
  const videoFeatureReducer = useSelector((state) => state.videoFeatureReducer);
  const assignees = useSelector((state) => state.assignees);
  const CommitteeReducer = useSelector((state) => state.CommitteeReducer);
  const toDoListReducer = useSelector((state) => state.toDoListReducer);
  const getTodosStatus = useSelector((state) => state.getTodosStatus);
  const downloadReducer = useSelector((state) => state.downloadReducer);
  const todoStatus = useSelector((state) => state.todoStatus);
  const uploadReducer = useSelector((state) => state.uploadReducer);
  const settingReducer = useSelector((state) => state.settingReducer);
  const fAQsReducer = useSelector((state) => state.fAQsReducer);
  const meetingIdReducer = useSelector((state) => state.meetingIdReducer);
  const calendarReducer = useSelector((state) => state.calendarReducer);
  const postAssigneeComments = useSelector((state) => state.postAssigneeComments);
  const VideoChatReducer = useSelector((state) => state.VideoChatReducer);
  const minuteofMeetingReducer = useSelector((state) => state.minuteofMeetingReducer);
  const countryNamesReducer = useSelector((state) => state.countryNamesReducer);
  const GetSubscriptionPackage = useSelector((state) => state.GetSubscriptionPackage);
  const Authreducer = useSelector((state) => state.Authreducer);
  const roleListReducer = useSelector((state) => state.roleListReducer);
  const NotesReducer = useSelector((state) => state.NotesReducer);
  const GroupsReducer = useSelector((state) => state.GroupsReducer);
  const ResolutionReducer = useSelector((state) => state.ResolutionReducer);
  const RealtimeNotification = useSelector((state) => state.RealtimeNotification);
  const OrganizationBillingReducer = useSelector((state) => state.OrganizationBillingReducer);
  const PollsReducer = useSelector((state) => state.PollsReducer);
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);
  const LanguageReducer = useSelector((state) => state.LanguageReducer);
  const webViewer = useSelector((state) => state.webViewer);
  const MeetingOrganizersReducer = useSelector((state) => state.MeetingOrganizersReducer);
  const MeetingAgendaReducer = useSelector((state) => state.MeetingAgendaReducer);
  const attendanceMeetingReducer = useSelector((state) => state.attendanceMeetingReducer);
  const actionMeetingReducer = useSelector((state) => state.actionMeetingReducer);
  const AgendaWiseAgendaListReducer = useSelector((state) => state.AgendaWiseAgendaListReducer);
  const DataRoomReducer = useSelector((state) => state.DataRoomReducer);
  const DataRoomFileAndFoldersDetailsReducer = useSelector((state) => state.DataRoomFileAndFoldersDetailsReducer);
  const SignatureWorkFlowReducer = useSelector((state) => state.SignatureWorkFlowReducer);
  console.log("hell");
  return (
    <>
      <div
        className={
          (((videoFeatureReducer.NormalizeVideoFlag === true ||
            videoFeatureReducer.MaximizeVideoFlag === true) &&
            NewMeetingreducer.Loading) ||
            assignees.Loading ||
            MeetingOrganizersReducer.LoadingMeetingOrganizer ||
            MeetingOrganizersReducer.Loading ||
            PollsReducer.Loading ||
            CommitteeReducer.Loading ||
            toDoListReducer.Loading ||
            todoStatus.Loading ||
            getTodosStatus.Loading ||
            MeetingAgendaReducer.Loading ||
            actionMeetingReducer.Loading ||
            AgendaWiseAgendaListReducer.loading ||
            downloadReducer.Loading ||
            attendanceMeetingReducer.Loading ||
            webViewer.Loading ||
            LanguageReducer.Loading ||
            uploadReducer.Loading ||
            settingReducer.Loading ||
            fAQsReducer.Loading ||
            meetingIdReducer.Loading ||
            calendarReducer.Loading ||
            postAssigneeComments.Loading ||
            VideoChatReducer.Loading ||
            minuteofMeetingReducer.Loading ||
            countryNamesReducer.Loading ||
            GetSubscriptionPackage.Loading ||
            Authreducer.Loading ||
            roleListReducer.Loading ||
            NotesReducer.Loading ||
            GroupsReducer.Loading ||
            GroupsReducer.getAllLoading ||
            ResolutionReducer.Loading ||
            RealtimeNotification.Loading ||
            OrganizationBillingReducer.Loading ||
            DataRoomReducer.Loading ||
            DataRoomFileAndFoldersDetailsReducer.Loading ||
            SignatureWorkFlowReducer.Loading) &&
          videoFeatureReducer.MinimizeVideoFlag === false
            ? "d-block loader-zindex"
            : (videoFeatureReducer.NormalizeVideoFlag === true ||
                videoFeatureReducer.MaximizeVideoFlag === true) &&
              videoFeatureReducer.MinimizeVideoFlag === false
            ? "d-block"
            : "d-none"
        }
      >
        <VideoPanelNormal />
      </div>
      {videoFeatureReducer.MinimizeVideoFlag && (
        <div
          className={
            videoFeatureReducer.NormalizeVideoFlag === false &&
            videoFeatureReducer.MinimizeVideoFlag === true &&
            videoFeatureReducer.MaximizeVideoFlag === false
              ? "d-block"
              : "d-none"
          }
        >
          <VideoCallMinimizeHeader />
        </div>
      )}
    </>
  );
};

export default VideoMain;
