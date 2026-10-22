import React, { createContext, useContext, useState } from "react";

/**
 * @context ResolutionContext
 * @description Provides state for the Resolutions module, tracking whether the
 * resolution result/outcome view is currently displayed.
 *
 * @provides {boolean}  resultresolution    - Whether the resolution result view is active
 * @provides {Function} setResultresolution - Setter to toggle the resolution result view
 *
 * Usage:
 *   import { useResolutionContext } from '../context/ResolutionContext';
 *   const { resultresolution, setResultresolution } = useResolutionContext();
 */

// Create the Context
export const ResolutionContext = createContext();
// Create a Provider component
export const ResolutionProvider = ({ children }) => {
  const [resultresolution, setResultresolution] = useState(false);

  return (
    <ResolutionContext.Provider
      value={{ resultresolution, setResultresolution }}
    >
      {children}
    </ResolutionContext.Provider>
  );
};

/**
 * @hook useResolutionContext
 * @description Consumes ResolutionContext and returns the resolution result state
 *   and its setter. Throws an error if called outside of ResolutionProvider.
 * @returns {{ resultresolution: boolean, setResultresolution: Function }} ResolutionContext value
 */
// Custom Hook to consume the context
export const useResolutionContext = () => {
  const context = useContext(ResolutionContext);

  if (!context) {
    throw new Error(
      "useResolutionContext must be used within a ResolutionProvider"
    );
  }

  return context;
};
