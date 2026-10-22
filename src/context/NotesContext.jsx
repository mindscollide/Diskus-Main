import React, { createContext, useContext, useState } from "react";

/**
 * @context NotesContext
 * @description Provides state for the Notes module, managing the visibility of
 * the create-note modal, a secondary note detail modal, and whether the notes
 * panel is open on the dashboard.
 *
 * @provides {boolean}  createNotesModal        - Whether the "create note" modal is open
 * @provides {Function} setCreateNotesModal      - Setter for createNotesModal
 * @provides {boolean}  modalNote               - Whether the note detail/view modal is open
 * @provides {Function} setModalNote            - Setter for modalNote
 * @provides {boolean}  notesOpenDashboard      - Whether the notes panel is expanded on the dashboard
 * @provides {Function} setNotesOpenDashboard   - Setter for notesOpenDashboard
 *
 * Usage:
 *   import { useNotesContext } from '../context/NotesContext';
 *   const { createNotesModal, setCreateNotesModal } = useNotesContext();
 */

// Create the Context
export const NotesContext = createContext();

// Create a Provider component
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
 * @hook useNotesContext
 * @description Consumes NotesContext and returns the notes UI state and setters.
 *   Throws an error if called outside of NotesProvider.
 * @returns {{ createNotesModal: boolean, setCreateNotesModal: Function, modalNote: boolean, setModalNote: Function, notesOpenDashboard: boolean, setNotesOpenDashboard: Function }} NotesContext value
 */
// Custom Hook to consume the context
export const useNotesContext = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotesContext must be used within a NotesContext");
  }

  return context;
};
