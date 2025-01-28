import React, { createContext, useContext, useState } from "react";

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
