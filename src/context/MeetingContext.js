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
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(0)

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
  return (
    <MeetingContext.Provider
      value={{
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
        advanceMeetingModalID
      }}
    >
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
