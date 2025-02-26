import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
export const MeetingContext = createContext();

// Create a Provider component
export const MeetingProvider = ({ children }) => {
  // Fetch user profile data from the Redux store
  const UserProfileData = useSelector(
    (state) => state.settingReducer.UserProfileData
  );

  // State to manage whether agenda updates are active during a meeting
  const [isAgendaUpdateWhenMeetingActive, setIsAgendaUpdateWhenMeetingActive] =
    useState(true);

  // State for managing confirmation modals
  const [cancelConfirmationModal, setCancelConfirmationModal] = useState(false);
  const [endMeetingConfirmationModal, setEndMeetingConfirmationModal] =
    useState(false);
  const [goBackCancelModal, setGoBackCancelModal] = useState(false);

  // State for managing editor role and permissions
  const [editorRole, setEditorRole] = useState({
    status: null,
    role: null,
    isPrimaryOrganizer: false,
  });

  // State for managing video chat and call settings
  const [videoTalk, setVideoTalk] = useState({
    isChat: false,
    isVideoCall: false,
    talkGroupID: 0,
  });

  // State for managing the current meeting status
  const [currentMeetingStatus, setCurrentMeetingStatus] = useState(null);

  // State for managing view flags and modals
  const [viewFlag, setViewFlag] = useState(false);
  const [viewAdvanceMeetingModal, setViewAdvanceMeetingModal] = useState(false);
  const [viewProposeDatePoll, setViewProposeDatePoll] = useState(false);
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(0);
  const [dataroomMapFolderId, setDataroomMapFolderId] = useState(0);

  // State for managing the schedule advanced meeting modal
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  // State for managing the edit advanced meeting modal
  const [isEditMeeting, setEditMeeting] = useState(false);

  // State for managing meeting tabs and their visibility
  const [meetingDetails, setmeetingDetails] = useState(false);
  const [organizers, setorganizers] = useState(false);
  const [agendaContributors, setAgendaContributors] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [meetingMaterial, setMeetingMaterial] = useState(false);
  const [minutes, setMinutes] = useState(false);
  const [actionsPage, setactionsPage] = useState(false);
  const [polls, setPolls] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [attendees, setAttendees] = useState(false);
  const [isRecording, setRecording] = useState(false);

  // State for managing polls view mode
  const [editPolls, setEditPolls] = useState(false);
  const [votePolls, setvotePolls] = useState(false);
  const [unPublished, setUnPublished] = useState(false);
  const [viewPublishedPoll, setViewPublishedPoll] = useState(false);

  // State for managing confirmation modals
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deleteMeetingConfirmationModal, setDeleteMeetingConfirmationModal] =
    useState(false);

  // this is the state of isMeeting which is used For create Meeting and Videos
  const [meetingId, setMeetingId] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const [isMeeting, setIsMeeting] = useState(false);
  const [isMeetingHostFlag, setIsMeetingHostFlag] = useState(false);
  const [isMeetingVideo, setIsMeetingVideo] = useState(false);
  const [endMeeting, setEndMeeting] = useState(false);
  const [isRemoveFromMeetingVideo, setIsRemoveFromMeetingVideo] = useState({
    flag: false,
    guid: 0,
  });
  const [leaveMeetingAndLogout, setLeaveMeetingAndLogout] = useState(false);
  const [leaveMeeting, setLeaveMeeting] = useState(false);
  const [leaveMeetingVideo, setLeaveMeetingVideo] = useState(false);
  const [mic, setMic] = useState(false);
  const [camera, setCamera] = useState(false);
  const [actionOnMicByHost, setActionOnMicByHost] = useState(false);
  const [actionOnCameraByHost, setActionOnCameraByHost] = useState(false);
  const [handRaise, setHandRaise] = useState(false);
  const [participantLeft, setParticipantLeft] = useState({
    flag: false,
    guid: 0,
  });
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [presenterViewFlag, setPresenterViewFlag] = useState(false);
  const [presenterViewHostFlag, setPresenterViewHostFlag] = useState(false);
  const [presenterMeetingId, setPresenterMeetingId] = useState(0);
  const [presenterJoinFlag, setPresenterJoinFlag] = useState(false);
  const [isPresenterParticipant, setIsPresenterParticipant] = useState(false);
  const [alreadyPartOfMeetingVideo, setAlreadyPartOfMeetingVideo] =
    useState(false);
  const [minimizeMeetingVideo, setMinimizeMeetingVideo] = useState(false);
  const [normalizedMeetingVideo, setNormalizedMeetingVideo] = useState(false);
  const [maximizeMeetingVideo, setMaximizeMeetingVideo] = useState(false);
  const [callType, setCallType] = useState(0);
  const [typeOfMeeting, setTypeOfMeeting] = useState("");

  // state for leave one to one  and Join Meeting Video
  const [leaveOneToOne, setLeaveOneToOne] = useState(false);
  const [joinMeetingVideo, setJoinMeetingVideo] = useState(false);

  // Meeting BoardDeck
  const [boardDeckMeetingID, setBoardDeckMeetingID] = useState(0);
  const [boardDeckMeetingTitle, setBoardDeckMeetingTitle] = useState("");
  const [stepDownloadModal, setStepDownloadModal] = useState(1);
  const [downloadMeetinModal, setDownloadMeeting] = useState(false);

  // Effect to update the agenda update state based on user profile data
  useEffect(() => {
    try {
      if (UserProfileData !== null && UserProfileData !== undefined) {
        // Set the agenda update state based on user profile data
        setIsAgendaUpdateWhenMeetingActive(
          UserProfileData?.emailWhenActiveMeetingAgendaUpdated
        );
      } else {
        // Default to true if user profile data is not available
        setIsAgendaUpdateWhenMeetingActive(true);
      }
    } catch (error) {
      // Handle any errors and default to true
      setIsAgendaUpdateWhenMeetingActive(true);
    }
  }, [UserProfileData]);

  // Consolidate all states into a single object for easier passing to the context
  let statesData = {
    setGoBackCancelModal,
    goBackCancelModal,
    editorRole,
    setEditorRole,
    isAgendaUpdateWhenMeetingActive,
    cancelConfirmationModal,
    setCancelConfirmationModal,
    endMeetingConfirmationModal,
    setEndMeetingConfirmationModal,
    setCurrentMeetingStatus,
    currentMeetingStatus,
    setVideoTalk,
    videoTalk,
    viewFlag,
    setViewFlag,
    viewAdvanceMeetingModal,
    setViewAdvanceMeetingModal,
    viewProposeDatePoll,
    setViewProposeDatePoll,
    deleteMeetingConfirmationModal,
    setDeleteMeetingConfirmationModal,
    setAdvanceMeetingModalID,
    advanceMeetingModalID,
    meetingDetails,
    setmeetingDetails,
    organizers,
    setorganizers,
    agendaContributors,
    setAgendaContributors,
    participants,
    setParticipants,
    agenda,
    setAgenda,
    meetingMaterial,
    setMeetingMaterial,
    minutes,
    setMinutes,
    actionsPage,
    setactionsPage,
    polls,
    setPolls,
    attendance,
    setAttendance,
    attendees,
    setAttendees,
    setConfirmationModal,
    confirmationModal,
    editPolls,
    setEditPolls,
    votePolls,
    setvotePolls,
    unPublished,
    setUnPublished,
    viewPublishedPoll,
    setViewPublishedPoll,
    setSceduleMeeting,
    sceduleMeeting,
    setDataroomMapFolderId,
    dataroomMapFolderId,

    //For Meeting Video
    setIsMeeting,
    isMeeting,
    meetingId,
    setMeetingId,
    roomId,
    setRoomId,
    isMeetingHostFlag,
    setIsMeetingHostFlag,
    isMeetingVideo,
    setIsMeetingVideo,
    endMeeting,
    setEndMeeting,
    isRemoveFromMeetingVideo,
    setIsRemoveFromMeetingVideo,
    leaveMeetingAndLogout,
    setLeaveMeetingAndLogout,
    leaveMeeting,
    setLeaveMeeting,
    leaveMeetingVideo,
    setLeaveMeetingVideo,
    mic,
    setMic,
    camera,
    setCamera,
    actionOnMicByHost,
    setActionOnMicByHost,
    actionOnCameraByHost,
    setActionOnCameraByHost,
    handRaise,
    setHandRaise,
    participantLeft,
    setParticipantLeft,
    isZoomEnabled,
    setIsZoomEnabled,
    videoUrl,
    setVideoUrl,
    iframeUrl,
    setIframeUrl,
    presenterViewFlag,
    setPresenterViewFlag,
    presenterViewHostFlag,
    setPresenterViewHostFlag,
    presenterMeetingId,
    setPresenterMeetingId,
    presenterJoinFlag,
    setPresenterJoinFlag,
    isPresenterParticipant,
    setIsPresenterParticipant,
    alreadyPartOfMeetingVideo,
    setAlreadyPartOfMeetingVideo,
    minimizeMeetingVideo,
    setMinimizeMeetingVideo,
    normalizedMeetingVideo,
    setNormalizedMeetingVideo,
    maximizeMeetingVideo,
    setMaximizeMeetingVideo,
    callType,
    setCallType,
    typeOfMeeting,
    setTypeOfMeeting,
    setEditMeeting,
    isEditMeeting,
    boardDeckMeetingID,
    setBoardDeckMeetingID,
    boardDeckMeetingTitle,
    setBoardDeckMeetingTitle,
    setStepDownloadModal,
    stepDownloadModal,
    downloadMeetinModal,
    setDownloadMeeting,
    isRecording,
    setRecording,
    leaveOneToOne,
    setLeaveOneToOne,
    joinMeetingVideo,
    setJoinMeetingVideo,
  };

  // Provide the state data to the context
  return (
    <MeetingContext.Provider value={statesData}>
      {children}
    </MeetingContext.Provider>
  );
};

// Custom Hook to consume the context
export const useMeetingContext = () => {
  // Access the context
  const context = useContext(MeetingContext);

  // Throw an error if the hook is used outside of the MeetingProvider
  if (!context) {
    throw new Error("useMeetingContext must be used within a MeetingProvider");
  }

  // Return the context data
  return context;
};
