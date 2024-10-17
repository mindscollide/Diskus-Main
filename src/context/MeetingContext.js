import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
export const MeetingContext = createContext();

// Create a Provider component
export const MeetingProvider = ({ children }) => {
  const { settingReducer } = useSelector((state) => state);
  const [isAgendaUpdateWhenMeetingActive, setIsAgendaUpdateWhenMeetingActive] =
    useState(true);
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
      value={{ editorRole, setEdiorRole, isAgendaUpdateWhenMeetingActive }}>
      {children}
    </MeetingContext.Provider>
  );
};
