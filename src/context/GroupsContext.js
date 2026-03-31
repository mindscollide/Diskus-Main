import React, { createContext, useContext, useState } from "react";

/**
 * @context GroupContext
 * @description Provides UI state for the Groups module, controlling which view
 * is displayed (list vs. detail), the visibility of the create/edit modal, and
 * whether the vote results panel is open.
 *
 * @provides {boolean}  ViewGroupPage    - Whether the main group list page is visible
 * @provides {Function} setViewGroupPage - Setter for ViewGroupPage
 * @provides {boolean}  showModal        - Whether the group create/edit modal is open
 * @provides {Function} setShowModal     - Setter for showModal
 * @provides {boolean}  viewVotes        - Whether the votes panel is visible
 * @provides {Function} setviewVotes     - Setter for viewVotes
 *
 * Usage:
 *   import { useGroupsContext } from '../context/GroupsContext';
 *   const { showModal, setShowModal } = useGroupsContext();
 */

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

/**
 * @hook useGroupsContext
 * @description Consumes GroupContext and returns the Groups UI state and setters.
 *   Throws an error if called outside of GroupsProvider.
 * @returns {{ ViewGroupPage: boolean, setViewGroupPage: Function, showModal: boolean, setShowModal: Function, viewVotes: boolean, setviewVotes: Function }} GroupContext value
 */
// Custom Hook to consume the context
export const useGroupsContext = () => {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroupsContext must be used within a GroupsProvider");
  }

  return context;
};
