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

  // State for managing polls view mode
  const [editPolls, setEditPolls] = useState(false);
  const [votePolls, setvotePolls] = useState(false);
  const [unPublished, setUnPublished] = useState(false);
  const [viewPublishedPoll, setViewPublishedPoll] = useState(false);

  // State for managing confirmation modals
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [deleteMeetingConfirmationModal, setDeleteMeetingConfirmationModal] =
    useState(false);

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
    dataroomMapFolderId
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
