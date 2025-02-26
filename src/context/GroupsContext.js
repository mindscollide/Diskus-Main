import React, { createContext, useContext, useState } from "react";

// Create the Context
export const GroupContext = createContext();

// Create a Provider component
export const GroupsProvider = ({ children }) => {
  const [ViewGroupPage, setViewGroupPage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewVotes, setviewVotes] = useState(false);

  return (
    <GroupContext.Provider
      value={{
        ViewGroupPage,
        setViewGroupPage,
        showModal,
        setShowModal,
        viewVotes,
        setviewVotes,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

// Custom Hook to consume the context
export const useGroupsContext = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroupsContext must be used within a GroupsProvider");
  }

  return context;
};
