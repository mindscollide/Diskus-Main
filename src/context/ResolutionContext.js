/**
 * @file ResolutionContext.js
 * @description Manages UI state for the Resolution feature, specifically controlling
 * whether the resolution result/outcome view is currently visible.
 *
 * Exposed values:
 * - `resultresolution` {boolean} - Whether the resolution result panel is displayed.
 * - `setResultresolution` {Function} - Setter to toggle the resolution result panel.
 *
 * Consumed by resolution listing pages and resolution detail components that
 * need to switch between editing/viewing a resolution and displaying its outcome.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const ResolutionContext = createContext();

/**
 * ResolutionProvider component that supplies resolution result-view state
 * to the component tree via ResolutionContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
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
 * Custom hook to consume ResolutionContext.
 * Must be used within a {@link ResolutionProvider}.
 *
 * @returns {{ resultresolution: boolean, setResultresolution: Function }} The resolution context value.
 * @throws {Error} If used outside of a ResolutionProvider.
 */
export const useResolutionContext = () => {
  const context = useContext(ResolutionContext);

  if (!context) {
    throw new Error(
      "useResolutionContext must be used within a ResolutionProvider"
    );
  }

  return context;
};
