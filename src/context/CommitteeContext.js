import React, { createContext, useContext, useState } from "react";

/**
 * @context CommitteeContext
 * @description Provides a shared context scope for the Committee module. Currently
 * exposes an empty value object as a placeholder; state and setters will be added
 * here as the module grows.
 *
 * @provides {Object} (empty) - No values exposed yet; reserved for future Committee state
 *
 * Usage:
 *   import { useCommitteeContext } from '../context/CommitteeContext';
 *   const {} = useCommitteeContext();
 */

// Create the Context
export const CommitteeContext = createContext();

// Create a Provider component
export const CommitteeProvider = ({ children }) => {
  return (
    <CommitteeContext.Provider value={{}}>{children}</CommitteeContext.Provider>
  );
};

/**
 * @hook useCommitteeContext
 * @description Consumes CommitteeContext and returns its value.
 *   Throws an error if called outside of CommitteeProvider.
 * @returns {Object} CommitteeContext value (currently empty)
 */
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
