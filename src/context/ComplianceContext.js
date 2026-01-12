import { createContext, useContext, useState } from "react";
import { clearComplianceDetailsData } from "../store/actions/ComplainSettingActions";
import { useDispatch } from "react-redux";

const ComplianceContext = createContext();

export const ComlianceProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [createEditCompliance, setCreateEditComplaince] = useState(false);
  const [complianceInfo, setComplianceInfo] = useState({
    complianceId: 0,
    complianceName: "",
  });
  const [checkListData, setChecklistData] = useState({
    checklistId: 0,
    checklistTitle: "",
    checklistDescription: "",
    checklistDueDate: "",
  });
  const [complianceAddEditViewState, setComplianceAddEditViewState] =
    useState(0);

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const [mainComplianceTabs, setMainComplianceTabs] = useState(1);

  const [checkListTabs, setChecklistTabs] = useState(1);

  const [complianceDetailsState, setComplianceDetailsState] = useState({
    complianceTitle: "",
    description: "",
    authority: {
      value: 0,
      label: "",
    },
    criticality: {
      value: 0,
      label: "",
    },
    dueDate: "",
    complianceDueDateForChecklist: "",
    tags: [],
    status: {
      value: 0,
      label: "",
    },
  });
  const [checklistCount, setChecklistCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  const emptyComplianceState = () => {
    dispatch(clearComplianceDetailsData());
    setComplianceInfo({
      complianceId: 0,
      complianceName: "",
    });
    setChecklistData({
      checklistTitle: "",
      checklistDescription: "",
      checklistDueDate: "",
    });
    // setMainComplianceTabs(1);
    setComplianceAddEditViewState(0);
    setChecklistTabs(1);
    setComplianceDetailsState({
      complianceTitle: "",
      description: "",
      authorityId: 0,
      criticality: 0,
      dueDate: "",
      complianceDueDateForChecklist: "",
      tags: [],
    });
    setChecklistCount(0);
    setTaskCount(0);
  };
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
        checkListData,
        setChecklistData,
        emptyComplianceState,
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
