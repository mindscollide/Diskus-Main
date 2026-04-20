/**
 * @file GroupsContext.js
 * @description Manages UI state for the Groups feature, including page visibility,
 * modal display control, and the vote-results view toggle.
 *
 * Exposed values:
 * - `ViewGroupPage` {boolean} - Whether the main groups listing page is visible.
 * - `setViewGroupPage` {Function} - Setter to show or hide the groups listing page.
 * - `showModal` {boolean} - Whether a group-related modal (e.g. create/edit) is open.
 * - `setShowModal` {Function} - Setter to open or close the modal.
 * - `viewVotes` {boolean} - Whether the vote-results panel is displayed.
 * - `setviewVotes` {Function} - Setter to toggle the vote-results panel.
 *
 * Consumed by group listing pages, group detail components, and any modal that
 * creates or edits a group.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const GroupContext = createContext();

/**
 * GroupsProvider component that supplies group page and modal state
 * to the component tree via GroupContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
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

/**
 * Custom hook to consume GroupContext.
 * Must be used within a {@link GroupsProvider}.
 *
 * @returns {{ ViewGroupPage: boolean, setViewGroupPage: Function, showModal: boolean, setShowModal: Function, viewVotes: boolean, setviewVotes: Function }} The groups context value.
 * @throws {Error} If used outside of a GroupsProvider.
 */
export const useGroupsContext = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroupsContext must be used within a GroupsProvider");
  }

  return context;
};
