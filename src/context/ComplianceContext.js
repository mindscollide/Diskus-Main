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

  const [searchCompliancePayload, setSearchCompliancePayload] = useState({
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

  const [complianceByMeList, setComplianceByMeList] = useState([]);
  const [complianceByMeTotal, setComplianceByMeTotal] = useState(0);

  const [complianceForMeList, setComplianceForMeList] = useState([]);
  const [complianceForMeTotal, setComplianceForMeTotal] = useState(0);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [complianceViewMode, setComplianceViewMode] = useState("byMe");
  const [allComplianceStatusForFilter, setAllComplianceStatusForFilter] =
    useState([]);
  const [allTasksStatusForFilter, setAllTasksStatusForFilter] = useState([]);

  // Modals For Status
  const [submitForApprovalModal, setSubmitForApprovalModal] = useState(false);

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
    setSearchCompliancePayload({
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
    setComplianceForMeList([]);
    setIsViewDetailsOpen(false);
    setsearchbox(false);
    setComplianceForMeTotal(0);
    setSubmitForApprovalModal(false);
  };

  // view compliance
  const [showViewCompliance, setShowViewCompliance] = useState(false);
  const [viewComplianceDetailsTab, setViewComplianceDetailsTab] = useState(1);
  const [allowedComplianceStatusOptions, setAllowedComplianceStatusOptions] =
    useState([]);
  const [allCheckListByComplianceId, setAllCheckListByComplianceId] = useState(
    []
  );
  const [searchbox, setsearchbox] = useState(false);

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
        complianceByMeList,
        setComplianceByMeList,
        complianceByMeTotal,
        setComplianceByMeTotal,
        complianceForMeList,
        setComplianceForMeList,
        isViewDetailsOpen,
        setIsViewDetailsOpen,
        complianceViewMode,
        setComplianceViewMode,
        setSearchCompliancePayload,
        searchCompliancePayload,
        complianceForMeTotal,
        setComplianceForMeTotal,
        searchbox,
        setsearchbox,
        allComplianceStatusForFilter,
        setAllComplianceStatusForFilter,
        allTasksStatusForFilter,
        setAllTasksStatusForFilter,
        submitForApprovalModal,
        setSubmitForApprovalModal,
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
