import { createContext, useContext, useState } from "react";

const ComplianceContext = createContext();

export const ComlianceProvider = ({ children }) => {
  const [createEditCompliance, setCreateEditComplaince] = useState(false);
  const [complianceInfo, setComplianceInfo] = useState({
    complianceId: 0,
    complianceName: "",
  });
  const [complianceAddEditViewState, setComplianceAddEditViewState] =
    useState(0);

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const [mainComplianceTabs, setMainComplianceTabs] = useState(1);

  const [checkListTabs, setChecklistTabs] = useState(1);

  const [complianceDetailsState, setComplianceDetailsState] = useState({
    complianceTitle: "",
    description: "",
    authorityId: 0,
    criticality: 0,
    dueDate: "",
    complianceDueDateForChecklist: "",
    tags: [],
  });
  const [checklistCount, setChecklistCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  return (
    <ComplianceContext.Provider
      value={{
        createEditCompliance,
        setCreateEditComplaince,
        complianceAddEditViewState,
        setComplianceAddEditViewState,
        closeConfirmationModal,
        setCloseConfirmationModal,
        complianceInfo,
        setComplianceInfo,
        checkListTabs,
        setChecklistTabs,
        mainComplianceTabs,
        setMainComplianceTabs,
        complianceDetailsState,
        setComplianceDetailsState,
        checklistCount,
        setChecklistCount,
        taskCount,
        setTaskCount,
      }}
    >
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
