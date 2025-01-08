import React, { createContext, useContext, useState } from "react";

// Create the Context
export const NotesContext = createContext();

// Create a Provider component
export const NotesProvider = ({ children }) => {
  // Add  Note Modal
  const [addNotes, setAddNotes] = useState(false);
  return (
    <NotesContext.Provider value={{ addNotes, setAddNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom Hook to consume the context
export const useNotesContext = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotesContext must be used within a NotesContext");
  }

  return context;
};
