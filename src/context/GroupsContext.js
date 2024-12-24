import React, { createContext, useContext, useState } from "react";

// Create the Context
export const GroupContext = createContext();
// Create a Provider component
export const GroupsProvider = ({ children }) => {
  //View Group Page Context
  const [ViewGroupPage, setViewGroupPage] = useState(true);

  return (
    <GroupContext.Provider value={{ ViewGroupPage, setViewGroupPage }}>
      {children}
    </GroupContext.Provider>
  );
};

// Custom Hook to consume the context
export const useGroupsContext = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useMeetingContext must be used within a GroupsProvider");
  }

  return context;
};
