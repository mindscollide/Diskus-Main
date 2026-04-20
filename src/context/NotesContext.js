/**
 * @file NotesContext.js
 * @description Manages UI state for the Notes feature, including modal visibility
 * and dashboard panel open/close state.
 *
 * Exposed values:
 * - `createNotesModal` {boolean} - Whether the "Add Note" creation modal is open.
 * - `setCreateNotesModal` {Function} - Setter to open or close the creation modal.
 * - `modalNote` {boolean} - Whether a note detail/edit modal is open.
 * - `setModalNote` {Function} - Setter to open or close the note detail modal.
 * - `notesOpenDashboard` {boolean} - Whether the notes panel is open on the dashboard.
 * - `setNotesOpenDashboard` {Function} - Setter to expand or collapse the dashboard notes panel.
 *
 * Consumed by note listing pages, the dashboard notes widget, and any component
 * that opens or closes a note-related modal.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const NotesContext = createContext();

/**
 * NotesProvider component that supplies notes modal and dashboard panel state
 * to the component tree via NotesContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const NotesProvider = ({ children }) => {
  // Add  Note Modal
  const [createNotesModal, setCreateNotesModal] = useState(false);
  const [modalNote, setModalNote] = useState(false);
  const [notesOpenDashboard, setNotesOpenDashboard] = useState(false)
  return (
    <NotesContext.Provider
      value={{ createNotesModal, setCreateNotesModal, modalNote, setModalNote,setNotesOpenDashboard, notesOpenDashboard}}
    >
      {children}
    </NotesContext.Provider>
  );
};

/**
 * Custom hook to consume NotesContext.
 * Must be used within a {@link NotesProvider}.
 *
 * @returns {{ createNotesModal: boolean, setCreateNotesModal: Function, modalNote: boolean, setModalNote: Function, notesOpenDashboard: boolean, setNotesOpenDashboard: Function }} The notes context value.
 * @throws {Error} If used outside of a NotesProvider.
 */
export const useNotesContext = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotesContext must be used within a NotesContext");
  }

  return context;
};
