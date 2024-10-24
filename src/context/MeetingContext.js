import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
export const MeetingContext = createContext();

// Create a Provider component
export const MeetingProvider = ({ children }) => {
  const { settingReducer } = useSelector((state) => state);
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
  useEffect(() => {
    try {
      if (
        settingReducer.UserProfileData !== null &&
        settingReducer.UserProfileData !== undefined
      ) {
        setIsAgendaUpdateWhenMeetingActive(
          settingReducer.UserProfileData?.emailWhenActiveMeetingAgendaUpdated
        );
      } else {
        setIsAgendaUpdateWhenMeetingActive(true);
      }
    } catch (error) {
      setIsAgendaUpdateWhenMeetingActive(true);
    }
  }, [settingReducer.UserProfileData]);
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
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
