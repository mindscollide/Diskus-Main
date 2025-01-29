import React, { createContext, useContext, useState } from "react";

// Create the Context
export const PollsContext = createContext();
// Create a Provider component
export const PollsProvider = ({ children }) => {
  const [viewVotes, setviewVotes] = useState(false);

  return (
    <PollsContext.Provider value={{ viewVotes, setviewVotes }}>
      {children}
    </PollsContext.Provider>
  );
};

// Custom Hook to consume the context
export const usePollsContext = () => {
  const context = useContext(PollsContext);

  if (!context) {
    throw new Error("usePollsContext must be used within a PollsProvider");
  }

  return context;
};
