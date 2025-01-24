import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
export const MeetingContext = createContext();

// Create a Provider component
export const MeetingProvider = ({ children }) => {
  const UserProfileData = useSelector(
    (state) => state.settingReducer.UserProfileData
  );
  const [isAgendaUpdateWhenMeetingActive, setIsAgendaUpdateWhenMeetingActive] =
    useState(true);
  // Meeting Details State
  const [cancelConfirmationModal, setCancelConfirmationModal] = useState(false);
  const [endMeetingConfirmationModal, setEndMeetingConfirmationModal] =
    useState(false);
  const [goBackCancelModal, setGoBackCancelModal] = useState(false);
  const [editorRole, setEditorRole] = useState({
    status: null,
    role: null,
    isPrimaryOrganizer: false,
  });
  const [videoTalk, setVideoTalk] = useState({
    isChat: false,
    isVideoCall: false,
    talkGroupID: 0,
  });
  const [currentMeetingStatus, setCurrentMeetingStatus] = useState(null);
  const [viewFlag, setViewFlag] = useState(false);
  const [viewAdvanceMeetingModal, setViewAdvanceMeetingModal] = useState(false);
  const [viewProposeDatePoll, setViewProposeDatePoll] = useState(false);
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(0);

  // View Meeting Tabs States

  const [meetingDetails, setmeetingDetails] = useState(true);

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
  //For Polls View Mode
  const [editPolls, setEditPolls] = useState(false);
  const [votePolls, setvotePolls] = useState(false);
  const [unPublished, setUnPublished] = useState(false);
  const [viewPublishedPoll, setViewPublishedPoll] = useState(false);

  const [deleteMeetingConfirmationModal, setDeleteMeetingConfirmationModal] =
    useState(false);
  useEffect(() => {
    try {
      if (UserProfileData !== null && UserProfileData !== undefined) {
        setIsAgendaUpdateWhenMeetingActive(
          UserProfileData?.emailWhenActiveMeetingAgendaUpdated
        );
      } else {
        setIsAgendaUpdateWhenMeetingActive(true);
      }
    } catch (error) {
      setIsAgendaUpdateWhenMeetingActive(true);
    }
  }, [UserProfileData]);
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
    editPolls,
    setEditPolls,
    votePolls,
    setvotePolls,
    unPublished,
    setUnPublished,
    viewPublishedPoll,
    setViewPublishedPoll,
  };
  return (
    <MeetingContext.Provider value={statesData}>
      {children}
    </MeetingContext.Provider>
  );
};

// Custom Hook to consume the context
export const useMeetingContext = () => {
  const context = useContext(MeetingContext);

  if (!context) {
    throw new Error("useMeetingContext must be used within a MeetingProvider");
  }

  return context;
};
