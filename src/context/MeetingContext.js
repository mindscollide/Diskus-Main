import React, { createContext, useEffect, useState } from "react";
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
  const [editorRole, setEdiorRole] = useState({
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
        setEdiorRole,
        isAgendaUpdateWhenMeetingActive,
        cancelConfirmationModal,
        setCancelConfirmationModal,
        endMeetingConfirmationModal,
        setEndMeetingConfirmationModal,
        setCurrentMeetingStatus,
        currentMeetingStatus,
        setVideoTalk,
        videoTalk
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
