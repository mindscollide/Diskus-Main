/**
 * @file PollsContext.js
 * @description Manages UI state for the standalone Polls feature (outside of meetings).
 * Controls whether the vote-results view is currently displayed.
 *
 * Exposed values:
 * - `viewVotes` {boolean} - Whether the poll vote-results panel is open.
 * - `setviewVotes` {Function} - Setter to toggle the vote-results panel.
 *
 * Consumed by poll listing pages and poll detail components that need to
 * toggle between the poll form view and the results view.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const PollsContext = createContext();

/**
 * PollsProvider component that supplies poll UI state
 * to the component tree via PollsContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const PollsProvider = ({ children }) => {
  const [viewVotes, setviewVotes] = useState(false);

  return (
    <PollsContext.Provider value={{ viewVotes, setviewVotes }}>
      {children}
    </PollsContext.Provider>
  );
};

/**
 * Custom hook to consume PollsContext.
 * Must be used within a {@link PollsProvider}.
 *
 * @returns {{ viewVotes: boolean, setviewVotes: Function }} The polls context value.
 * @throws {Error} If used outside of a PollsProvider.
 */
export const usePollsContext = () => {
  const context = useContext(PollsContext);

  if (!context) {
    throw new Error("usePollsContext must be used within a PollsProvider");
  }

  return context;
};
