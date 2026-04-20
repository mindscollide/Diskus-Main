/**
 * @file DataroomContext.js
 * @description Manages navigation state for the Dataroom (document repository) feature.
 * Tracks the current folder breadcrumb trail so that nested folder navigation
 * can be rendered and updated consistently across dataroom components.
 *
 * Exposed values:
 * - `breadCrumbsItems` {Array<{name: string, id: number}>} - The ordered list of folders
 *   representing the current navigation path within the dataroom.
 * - `setBreadCrumbsItems` {Function} - Setter to update the breadcrumb trail on navigation.
 *
 * Consumed by dataroom folder views, file browsers, and any component that renders
 * or responds to the current folder path within the document repository.
 */

import React, { createContext, useContext, useState } from "react";

// Create the Context
export const DataroomContext = createContext();

/**
 * DataroomProvider component that supplies breadcrumb navigation state
 * to the dataroom component tree via DataroomContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const DataroomProvider = ({ children }) => {
  const [breadCrumbsItems, setBreadCrumbsItems] = useState([
    {
      name: "My Documents",
      id: 20,
    },
    {
      name: "Logo Options for Dairastudio",
      id: 22,
    },
    {
      name: "Final Options",
      id: 24,
    },
  ]);
  return (
    <DataroomContext.Provider
      value={{
        breadCrumbsItems,
        setBreadCrumbsItems,
      }}>
      {children}
    </DataroomContext.Provider>
  );
};

/**
 * Custom hook to consume DataroomContext.
 * Must be used within a {@link DataroomProvider}.
 *
 * @returns {{ breadCrumbsItems: Array, setBreadCrumbsItems: Function }} The dataroom context value.
 * @throws {Error} If used outside of a DataroomProvider.
 */
export const useDataroomContext = () => {
  const context = useContext(DataroomContext);

  if (!context) {
    throw new Error(
      "useMeetingContext must be used within a Dataroon Privuder"
    );
  }

  return context;
};
