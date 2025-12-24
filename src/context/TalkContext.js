import React, { createContext, useContext, useState } from "react";

// Create a Context
const TalkContext = createContext();

// Create a Provider component
export const TalkProvider = ({ children }) => {
  const [activeVideoIcon, setActiveVideoIcon] = useState(false);

  return (
    <TalkContext.Provider value={{ activeVideoIcon, setActiveVideoIcon }}>
      {children}
    </TalkContext.Provider>
  );
};

// Custom hook to use the TalkContext
export const useTalkContext = () => {
  return useContext(TalkContext);
};
