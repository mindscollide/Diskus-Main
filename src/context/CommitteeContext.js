import React, { createContext, useContext, useState } from "react";

// Create the Context
export const CommitteeContext = createContext();

// Create a Provider component
export const CommitteeProvider = ({ children }) => {
  return (
    <CommitteeContext.Provider value={{}}>{children}</CommitteeContext.Provider>
  );
};

// Custom Hook to consume the context
export const useCommitteeContext = () => {
  const context = useContext(CommitteeContext);

  if (!context) {
    throw new Error(
      "useCommitteeContext must be used within a CommittteeProvider"
    );
  }

  return context;
};
