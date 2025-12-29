import { createContext, useContext, useState } from "react";

const ComplianceContext = createContext();

export const ComlianceProvider = ({ children }) => {
  //   const [addEditViewAuthoriyModal, setAddEditViewAuthoriyModal] =
  //     useState(false);
  return (
    <ComplianceContext.Provider value={{}}>
      {children}
    </ComplianceContext.Provider>
  );
};

export const useComplianceContext = () => {
  const context = useContext(ComplianceContext);

  if (!context) {
    throw new Error(
      "useComplianceContext must be used within a AuthorityProvider"
    );
  }
  return context;
};
