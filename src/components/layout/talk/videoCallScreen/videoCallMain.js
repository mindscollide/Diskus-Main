import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "../../../elements";
import { Row, Col } from "react-bootstrap";
import VideoPanelNormal from "./videoCallPanels/videoCallNormalPanel";
import VideoPanelMaximize from "./videoCallPanels/videoCallMaximizePanel";
import VideoCallMinimizeHeader from "./videoCallHeader/videoCallMinimizeHeader";
import { leaveCallModal } from "../../../../store/actions/VideoFeature_actions";
import LeaveVideoIntimationModal from "./LeaveVideoIntimationModal/LeaveVideoIntimationModal";

const VideoMain = () => {
  const {
    videoFeatureReducer,
    assignees,
    CommitteeReducer,
    toDoListReducer,
    getTodosStatus,
    downloadReducer,
    todoStatus,
    uploadReducer,
    settingReducer,
    fAQsReducer,
    meetingIdReducer,
    calendarReducer,
    postAssigneeComments,
    VideoChatReducer,
    minuteofMeetingReducer,
    countryNamesReducer,
    GetSubscriptionPackage,
    Authreducer,
    roleListReducer,
    NotesReducer,
    GroupsReducer,
    ResolutionReducer,
    RealtimeNotification,
    OrganizationBillingReducer,
    PollsReducer,
    NewMeetingreducer,
    LanguageReducer,
    webViewer,
    MeetingOrganizersReducer,
    MeetingAgendaReducer,
    attendanceMeetingReducer,
    actionMeetingReducer,
    AgendaWiseAgendaListReducer,
    DataRoomReducer,
    DataRoomFileAndFoldersDetailsReducer,
    SignatureWorkFlowReducer,
  } = useSelector((state) => state);
  
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
