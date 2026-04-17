import React, { createContext, useContext, useState } from "react";

/**
 * @context PollsContext
 * @description Provides state for the standalone Polls module, controlling
 * whether the vote-results view is currently visible.
 *
 * @provides {boolean}  viewVotes    - Whether the poll vote-results panel is open
 * @provides {Function} setviewVotes - Setter to toggle the vote-results panel
 *
 * Usage:
 *   import { usePollsContext } from '../context/PollsContext';
 *   const { viewVotes, setviewVotes } = usePollsContext();
 */

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

/**
 * @hook usePollsContext
 * @description Consumes PollsContext and returns the polls UI state and setter.
 *   Throws an error if called outside of PollsProvider.
 * @returns {{ viewVotes: boolean, setviewVotes: Function }} PollsContext value
 */
// Custom Hook to consume the context
export const usePollsContext = () => {
  const context = useContext(PollsContext);

  if (!context) {
    throw new Error("usePollsContext must be used within a PollsProvider");
  }

  return context;
};
