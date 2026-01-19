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
  const [expandChecklistOnTasksPage, setExpandChecklistOnTasksPage] =
    useState(null);

  const [complianceDetailsState, setComplianceDetailsState] = useState({
    complianceTitle: "",
    complianceId: 0,
    description: "",
    authority: {
      value: 0,
      label: "",
    },
    criticality: {
      value: 0,
      label: "",
    },
    dueDate: null,
    complianceDueDateForChecklist: "",
    tags: [],
    status: {
      value: 0,
      label: "",
    },

    progressPercent: 0,
    createdBy: "",
    totalComplianceTasks: 0,
    showProgressBar: false,
    complianceStatusChangeHistory: [],
  });
  const [checklistCount, setChecklistCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  // Search Context for compliance By me
  const [compliancebyMePayload, setComplianceByMePayload] = useState({
    complianceTitle: "",
    dueDateFrom: "",
    dueDateTo: "",
    authorityShortCode: "",
    tagsCSV: "",
    criticalityIds: [],
    statusIds: [],
    pageNumber: 0,
    length: 10,
  });
  const [complianceByMeList, setComplianceByMeList] = useState([]);
  const [complianceByMeTotal, setComplianceByMeTotal] = useState(0);

  // Search COntext for ComplianceForMe
  const [complianceForMePayload, setComplianceForMePayload] = useState({
    complianceTitle: "",
    dueDateFrom: "",
    dueDateTo: "",
    authorityShortCode: "",
    tagsCSV: "",
    criticalityIds: [],
    statusIds: [],
    pageNumber: 0,
    length: 10,
  });

  const [complianceForMeList, setComplianceForMeList] = useState([]);

  const emptyComplianceState = () => {
    console.log("cleared");
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
      complianceId: 0,
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
      progressPercent: 0,
      createdBy: "",
      totalComplianceTasks: 0,
      showProgressBar: false,
      complianceStatusChangeHistory: [],
    });
    setChecklistCount(0);
    setTaskCount(0);
    setViewComplianceDetailsTab(1);
    setShowViewCompliance(false);
    setAllowedComplianceStatusOptions([]);
    setAllCheckListByComplianceId([]);
    setExpandChecklistOnTasksPage(null);
    setComplianceByMePayload({
      complianceTitle: "",
      complianceTitleOutside: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      tagsCSV: "",
      criticalityIds: [],
      statusIds: [],
      pageNumber: 0,
      length: 10,
    });
    setComplianceByMeList([]);
    setComplianceByMeTotal(0);
    setComplianceForMePayload({
      complianceTitle: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      tagsCSV: "",
      criticalityIds: [],
      statusIds: [],
      pageNumber: 0,
      length: 10,
    });
    setComplianceForMeList([]);
  };

  // view compliance
  const [showViewCompliance, setShowViewCompliance] = useState(false);
  const [viewComplianceDetailsTab, setViewComplianceDetailsTab] = useState(1);
  const [allowedComplianceStatusOptions, setAllowedComplianceStatusOptions] =
    useState([]);
  const [allCheckListByComplianceId, setAllCheckListByComplianceId] = useState(
    []
  );

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
        showViewCompliance,
        setShowViewCompliance,
        viewComplianceDetailsTab,
        setViewComplianceDetailsTab,
        allowedComplianceStatusOptions,
        setAllowedComplianceStatusOptions,
        allCheckListByComplianceId,
        setAllCheckListByComplianceId,
        expandChecklistOnTasksPage,
        setExpandChecklistOnTasksPage,
        compliancebyMePayload,
        setComplianceByMePayload,
        complianceByMeList,
        setComplianceByMeList,
        complianceByMeTotal,
        setComplianceByMeTotal,
        complianceForMePayload,
        setComplianceForMePayload,
        complianceForMeList,
        setComplianceForMeList,
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
