import React, { createContext, useContext, useState } from "react";

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
