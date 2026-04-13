import React, { createContext, useContext, useState } from "react";

/**
 * @context DataroomContext
 * @description Provides shared breadcrumb navigation state for the Dataroom
 * (document repository) module, allowing nested folder views to keep the
 * breadcrumb trail in sync across the component tree.
 *
 * @provides {Array<{name: string, id: number}>} breadCrumbsItems    - Ordered list of breadcrumb entries representing the current folder path
 * @provides {Function}                          setBreadCrumbsItems - Setter to update the breadcrumb trail when navigating folders
 *
 * Usage:
 *   import { useDataroomContext } from '../context/DataroomContext';
 *   const { breadCrumbsItems, setBreadCrumbsItems } = useDataroomContext();
 */

// Create the Context
export const DataroomContext = createContext();

// Create a Provider component
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
 * @hook useDataroomContext
 * @description Consumes DataroomContext and returns the breadcrumb navigation
 *   state and its setter. Throws an error if called outside of DataroomProvider.
 * @returns {{ breadCrumbsItems: Array<{name: string, id: number}>, setBreadCrumbsItems: Function }} DataroomContext value
 */
// Custom Hook to consume the context
export const useDataroomContext = () => {
  const context = useContext(DataroomContext);

  if (!context) {
    throw new Error(
      "useMeetingContext must be used within a Dataroon Privuder"
    );
  }

  return context;
};
