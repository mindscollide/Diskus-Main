import React, { createContext, useState } from "react";

// Create the Context
export const MeetingContext = createContext();

// Create a Provider component
export const MeetingProvider = ({ children }) => {
  const [editorRole, setEdiorRole] = useState({
    status: null,
    role: null,
    isPrimaryOrganizer: false,
  });
  return (
    <MeetingContext.Provider value={{ editorRole, setEdiorRole }}>
      {children}
    </MeetingContext.Provider>
  );
};