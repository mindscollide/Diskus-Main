/**
 * @file CommitteeContext.js
 * @description Provides a React Context for the Committee feature.
 * Currently serves as a placeholder context with an empty value object,
 * intended to be extended with committee-specific state and actions as
 * the feature grows.
 *
 * Exposed values:
 * - (none at present) - The context value is an empty object `{}`.
 *
 * Consumed by committee-related components that will share state once
 * committee-specific values are added to the provider.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const CommitteeContext = createContext();

/**
 * CommitteeProvider component that wraps committee-related components
 * and provides CommitteeContext to the component tree.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const CommitteeProvider = ({ children }) => {
  return (
    <CommitteeContext.Provider value={{}}>{children}</CommitteeContext.Provider>
  );
};

/**
 * Custom hook to consume CommitteeContext.
 * Must be used within a {@link CommitteeProvider}.
 *
 * @returns {object} The committee context value.
 * @throws {Error} If used outside of a CommitteeProvider.
 */
export const useCommitteeContext = () => {
  const context = useContext(CommitteeContext);

  if (!context) {
    throw new Error(
      "useCommitteeContext must be used within a CommittteeProvider"
    );
  }

  return context;
};
