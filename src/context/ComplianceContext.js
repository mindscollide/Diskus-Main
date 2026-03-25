import { createContext, useContext, useEffect, useState } from "react";
import { clearComplianceDetailsData } from "../store/actions/ComplainSettingActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getAllowedStatuses,
  parseYYYYMMDDToEndOfDay,
} from "../container/ComplianceUser/CommonComponents/commonFunctions";

const ComplianceContext = createContext();

export const ComlianceProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const viewComplianceByMeDetails = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ViewComplianceByMeDetails,
  );

  const changeCheckListStatus = useSelector(
    (state) => state.ComplainceSettingReducerReducer.changeCheckListStatus,
  );

  const complianceCreatedMqttData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.complianceCreatedMqttData,
  );

  console.log(
    changeCheckListStatus,
    viewComplianceByMeDetails,
    "Check Compliance Coming",
  );

  const complianceCheckListMqttData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.complianceCheckListMqttData,
  );

  const complianceCheckListUpdatedMqttData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.complianceCheckListUpdatedMqttData,
  );

  const complianceCheckListDeletedMqttData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.complianceCheckListDeletedMqttData,
  );

  const complianceUpdateMqttData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.complianceUpdateMqttData,
  );

  const complianceReopenMqttData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.complianceReopenMqttData,
  );

  const GetUpcomingDealineComplianceDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetUpcomingDealineComplianceDashboard,
  );

  console.log(
    complianceCreatedMqttData,
    "complianceCreatedMqttDatacomplianceCreatedMqttData",
  );

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

  console.log(
    complianceAddEditViewState,
    "complianceAddEditViewStatecomplianceAddEditViewState",
  );

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const [mainComplianceTabs, setMainComplianceTabs] = useState(1);

  const [checkListTabs, setChecklistTabs] = useState(1);
  const [expandChecklistOnTasksPage, setExpandChecklistOnTasksPage] =
    useState(null);

  const [viewComplianceTasksContextData, setViewComplianceTasksContextData] =
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

  const [complianceDetailsViewState, setComplianceDetailsViewState] = useState({
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

  const [checkAnyTaskInProgress, setCheckAnyTaskInProgress] = useState(false);

  const [checklistCount, setChecklistCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);

  //For Compliance Report Title State
  const [searchComplianceReportPayload, setSearchComplianceReportPayload] =
    useState({
      reportTitle: "",
      reportTitleOutside: "",
      reportType: "",
      dueDateFrom: "",
      dueDateTo: "",
      sRow: 0,
      length: 10,
    });

  //For Compliance Report Title State
  const [complianceReportList, setComplianceReportList] = useState([]);
  const [complianceReportTotal, setComplianceReportTotal] = useState(0);

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
  const [complianceOnHoldModal, setComplianceOnHoldModal] = useState(false);
  const [
    complianceStatusChangeReasonModal,
    setComplianceStatusChangeReasonModal,
  ] = useState(false);
  const [complianceCancelModal, setComplianceCancelModal] = useState(false);
  const [complianceCanceleasonModal, setComplianceCancelReasonModal] =
    useState(false);

  const [comlianceCompleteExceptionModal, setComlianceCompleteExceptionModal] =
    useState(false);

  const [comlianceStatusReopenedModal, setComlianceStatusReopenedModal] =
    useState(false);

  // Modals states
  const [complianceOnHoldSelectOption, setComplianceOnHoldSelectOption] =
    useState(0);
  const [complianceOnHoldReasonState, setComplianceOnHoldReasonState] =
    useState("");

  const [complianceCancelSelectOption, setComplianceCancelSelectOption] =
    useState(0);
  const [complianceCancelReasonState, setComplianceCancelReasonState] =
    useState("");

  const [tempSelectComplianceStatus, setTempSelectedComplianceStatus] =
    useState(null);

  const [complianceReopenDetailsState, setComplianceReopenDetailsState] =
    useState({
      reason: "",
      dueDate: "",
      attachments: [],
    });

  const [upcomingDeadlineDashboard, setUpcomingDeadlineDashboard] =
    useState(null);

  // Delete Checklist Confirmation Modal
  const [
    deleteChecklistConfirmationModalState,
    setDeleteChecklistConfirmationModalState,
  ] = useState(false);

  const [deleteChecklistId, setDeleteChecklistId] = useState(0);

  const [complianceCompleteModalType, setComplianceCompleteModalType] =
    useState(null);

  console.log(
    complianceCreatedMqttData,
    complianceByMeList,
    "complianceCreatedMqttDatacomplianceCreatedMqttData",
  );

  const resetModalStates = () => {
    setSubmitForApprovalModal(false);
    setComplianceOnHoldModal(false);
    setComplianceStatusChangeReasonModal(false);
    setComplianceOnHoldSelectOption(0);
    setComplianceOnHoldReasonState("");
    setTempSelectedComplianceStatus(null);
    setComplianceCancelModal(false);
    setComplianceCancelReasonModal(false);
    setComplianceCancelSelectOption(0);
    setComplianceCancelReasonState(0);
    setComlianceCompleteExceptionModal(false);
    setComlianceStatusReopenedModal(false);
    // setComplianceReopenDetailsState({
    //   reason: "",
    //   dueDate: "",
    //   attachments: [],
    // });
    setDeleteChecklistConfirmationModalState(false);
    setDeleteChecklistId(0);
  };

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
      status: {
        value: 0,
        label: "",
      },
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
    setSearchComplianceReportPayload({
      reportTitle: "",
      reportTitleOutside: "",
      reportType: "",
      dueDateFrom: "",
      dueDateTo: "",
      sRow: 0,
      length: 10,
    });
    setComplianceReportList([]);
    setComplianceReportTotal(0);
    setComplianceByMeList([]);
    setComplianceByMeTotal(0);
    setComplianceForMeList([]);
    setIsViewDetailsOpen(false);
    setsearchbox(false);
    setComplianceForMeTotal(0);
    setSubmitForApprovalModal(false);
    setComplianceOnHoldModal(false);
    setComplianceStatusChangeReasonModal(false);
    setComplianceOnHoldReasonState("");
    setComplianceOnHoldSelectOption(0);
    setTempSelectedComplianceStatus(null);
    setDeleteChecklistId(0);
  };
  const criticalityOptions = [
    {
      label: t("High"),
      value: 1,
    },
    {
      label: t("Medium"),
      value: 2,
    },
    {
      label: t("Low"),
      value: 3,
    },
  ];
  const [checkAnyChecklistOnPendingState, setCheckAnyChecklistOnPendingState] =
    useState(false);
  const [checkAnyTaskOnPendingState, setCheckAnyTaskOnPendingState] =
    useState(false);
  // view compliance
  const [showViewCompliance, setShowViewCompliance] = useState(false);
  const [viewComplianceDetailsTab, setViewComplianceDetailsTab] = useState(1);
  const [allowedComplianceStatusOptions, setAllowedComplianceStatusOptions] =
    useState([]);
  const [allCheckListByComplianceId, setAllCheckListByComplianceId] = useState(
    [],
  );

  console.log(
    allCheckListByComplianceId,
    "allCheckListByComplianceIdallCheckListByComplianceId",
  );

  console.log(complianceForMeList, "complianceForMeListcomplianceForMeList");
  const [searchbox, setsearchbox] = useState(false);

  // View Type for Compliance Dashboard Manager View Type is 1 which is by default User View is 2
  const [viewTypeDashboard, setViewTypeDashboard] = useState(1);

  // 1 = Progress (default) Compliance Dropdown Filter
  const [complianceDashboardFilter, setComplianceDashboardFilter] = useState(1);

  // 1 Overdue (default filter) Compliance task dropdown Filter
  const [complianceTaskDashboardFilter, setComplianceTaskDashboardFilter] =
    useState(1);

  // 1 Duedate (default filter) Reopend Compliance dropdown Filter
  const [
    reopendComplianceDashboardFilter,
    setReopendComplianceDashboardFilter,
  ] = useState(1);

  // Compliance Standing Report Open
  const [complianceStatndingReport, setComplianceStandingReport] =
    useState(false);

  // End Of Compliance Report Open
  const [endOfComplianceReport, setEndOfComplianceReport] = useState(false);

  // End Of Quarter Report Open
  const [endOfQuarterReport, setEndOfQuarterReport] = useState(false);

  // Accumulative Report Open
  const [accumulativeReport, setAccumulativeReport] = useState(false);

  // To Download automatically Report State
  const [autoPdfDownload, setAutoPdfDownload] = useState(false);

  //For Reopen dashboard Card Data in COmpliance
  const [reopenDashboardList, setReopenDashboardList] = useState([]);

  const [newChecklistIds, setNewChecklistIds] = useState([]);

  const [
    viewAllReopenDashboardButtonFlag,
    setViewAllReopenDashboardButtonFlag,
  ] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  //Reset Compliance Dashboard Filter  State
  const resetComplianceDashboardFilter = () => {
    setComplianceDashboardFilter(1);
  };

  //Reset Compliance Dashboard Filter  State
  const resetComplianceTaskDashboardFilter = () => {
    setComplianceTaskDashboardFilter(1);
  };

  //Reset Reopend-Compliance Dashboard Filter State
  const resetReopenComplianceDashboardFilter = () => {
    setReopendComplianceDashboardFilter(1);
  };

  //When checklist update to Inprogress From pending then it works in viewDetail of compliance
  useEffect(() => {
    if (!changeCheckListStatus) return;
    const { responseMessage } = changeCheckListStatus;
    if (
      responseMessage ===
      "Compliance_ComplianceServiceManager_ChangeChecklistStatus_01"
    ) {
      // Checklist status changed successfully
      setCheckAnyChecklistOnPendingState(false);
    }
  }, [changeCheckListStatus]);

  useEffect(() => {
    if (
      viewComplianceByMeDetails !== null &&
      complianceAddEditViewState === 3
    ) {
      try {
        const {
          allowedComplianceStatuses,
          authority,
          checklistTasks,
          checklists,
          completedTasks,
          complianceId,
          complianceStatus,
          complianceTitle,
          createdBy,
          criticalityLevel,
          description,
          dueDate,
          isExecuted,
          progressPercent,
          showProgressBar,
          tags,
          totalTasks,
        } = viewComplianceByMeDetails;
        setComplianceInfo({
          complianceId: complianceId,
          complianceName: complianceTitle,
        });

        const selectedCriticality = criticalityOptions.find(
          (item) => item.label === criticalityLevel,
        );
        setComplianceDetailsViewState((prev) => ({
          ...prev,
          complianceTitle: complianceTitle,
          complianceId: complianceId,
          description: description,
          authority: {
            ...authority,
            value: authority.authorityId,
            label: `${authority.authorityName} (${authority.authorityShortCode})`,
          },
          criticality: selectedCriticality,
          dueDate: `${dueDate}235958`,
          tags: tags,
          status: {
            value: complianceStatus.statusId,
            label: complianceStatus.statusName,
          },
        }));

        if (allowedComplianceStatuses && allowedComplianceStatuses.length > 0) {
          const allowedStatuses = allowedComplianceStatuses.map(
            (data, index) => {
              return {
                ...data,
                value: data.statusId,
                label: data.statusName,
              };
            },
          );
          setAllowedComplianceStatusOptions(allowedStatuses);
        }
        if (complianceId !== 0) {
          let Data = {
            complianceId: complianceId,
          };
          // dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
          // dispatch(
          //   GetComplianceChecklistsWithTasksByComplianceIdAPI(
          //     navigate,
          //     Data,
          //     t,
          //   ),
          // );
        }

        // check if any status is Pending to show confirmation modal on submit for approval & Complete
        if (Array.isArray(checklists) && checklists.length > 0) {
          const hasPendingChecklist = checklists.some(
            (checklist) => checklist?.status?.statusName === "Pending",
            // || checklist?.status?.statusName === "In Progress" ||
            //   checklist?.status?.statusName === "On Hold",
          );

          setCheckAnyChecklistOnPendingState(hasPendingChecklist);
        } else {
          setCheckAnyChecklistOnPendingState(false);
        }

        // Check if any task status in pending the show confirmation modal on Complete
        if (Array.isArray(checklistTasks) && checklistTasks.length > 0) {
          const hasPendingTask = checklistTasks.some(
            (task) =>
              task?.taskStatus?.statusName === "Pending" ||
              task?.taskStatus?.statusName === "In Progress" ||
              task?.taskStatus?.statusName === "On Hold",
          );

          setCheckAnyTaskOnPendingState(hasPendingTask);
        } else {
          setCheckAnyTaskOnPendingState(false);
        }
        if (Array.isArray(checklistTasks) && checklistTasks.length > 0) {
          const hasTaskInProgress =
            Array.isArray(checklistTasks) &&
            checklistTasks.some(
              (task) => task?.taskStatus?.statusName === "In Progress",
            );

          setCheckAnyTaskInProgress(hasTaskInProgress);
        } else {
          setCheckAnyTaskInProgress(false);
        }
      } catch (error) {}
    }
  }, [viewComplianceByMeDetails, complianceAddEditViewState]);

  //When COmpliance Created Then "Compliance-created" mqtt come and update this context state
  useEffect(() => {
    if (complianceCreatedMqttData !== null) {
      try {
        const {
          complianceID,
          complianceTitle,
          authorityShortCode,
          requestData,
        } = complianceCreatedMqttData;

        const {
          authorityId,
          criticality,
          description,
          dueDate,
          tags,
          tagsCSV,
        } = requestData;
        let findIsExist = complianceByMeList.find(
          (data, index) => data.complianceId === complianceID,
        );

        if (findIsExist === undefined) {
          // Your logic here
          let complianceObj = {
            complianceId: complianceID,
            complianceTitle: complianceTitle,
            authorityId: authorityId,
            organizationId: localStorage.getItem("organizationID"),
            description: description,
            criticality: criticality,
            complianceStatusId: 1,
            complianceStatusTitle: "Not Started",
            dueDate: dueDate,
            dueTime: "185958",
            createdBy: localStorage.getItem("userID"),
            createdDate: "",
            createdTime: "",
            authorityShortCode: authorityShortCode || "",
          };
          setComplianceByMeList((prev) => [complianceObj, ...prev]);
          setComplianceByMeTotal((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error processing complianceCreatedMqttData:", error);
      }
    }
  }, [complianceCreatedMqttData]);

  // WHen CheckList Data Added Mqtt Coming
  useEffect(() => {
    if (!complianceCheckListMqttData) return;

    try {
      // handle both structures safely
      const data = complianceCheckListMqttData;
      const { checklistID, checklistTitle, requestData } = data || {};
      if (!checklistID) return;
      const { description, dueDate } = requestData || {};
      const alreadyExists = allCheckListByComplianceId?.some(
        (item) => item.checklistId === checklistID,
      );

      if (!alreadyExists) {
        const newChecklistObj = {
          checklistId: checklistID,
          checklistTitle,
          description,
          dueDate,
          status: {
            statusId: 1,
            statusName: "In Progress",
          },
          tasksCount: 0,
          completedTasks: 0,
          checklistProgress: 0,
          showViewTasksLink: false,
          noTasksMessage: "No tasks created",
          complianceCheckListAllowed: [
            { statusId: 5, statusName: "Cancelled" },
            { statusId: 4, statusName: "Completed" },
            { statusId: 3, statusName: "On Hold" },
          ],
        };

        setAllCheckListByComplianceId((prev) => [
          newChecklistObj,
          ...(prev || []),
        ]);
      }
    } catch (error) {
      console.error("MQTT Checklist Error:", error);
    }
  }, [complianceCheckListMqttData]);

  // WHen CheckList Data Update Mqtt Coming
  useEffect(() => {
    if (!complianceCheckListUpdatedMqttData) return;

    try {
      const data = complianceCheckListUpdatedMqttData;

      const { checklistID, requestData } = data || {};
      if (!checklistID) return;

      const { description, dueDate, checkListTitle } = requestData || {};

      setAllCheckListByComplianceId((prev) =>
        prev.map((item) =>
          item.checklistId === checklistID
            ? {
                ...item,
                checklistTitle: checkListTitle || item.checklistTitle,
                description: description || item.description,
                dueDate: dueDate || item.dueDate,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Checklist Update MQTT Error:", error);
    }
  }, [complianceCheckListUpdatedMqttData]);

  // WHen CheckList Data Delete Mqtt Coming
  useEffect(() => {
    if (!complianceCheckListDeletedMqttData) return;

    try {
      const data = complianceCheckListDeletedMqttData;
      console.log(data, "datadatadatadata");

      const { checklistId } = data || {};
      if (!checklistId) return;
      console.log(checklistId, "datadatadatadata");

      // 🔥 Remove checklist from state
      setAllCheckListByComplianceId((prev) =>
        prev.filter((item) => Number(item.checklistId) !== Number(checklistId)),
      );
    } catch (error) {
      console.error("Checklist Delete MQTT Error:", error);
    }
  }, [complianceCheckListDeletedMqttData]);

  // WHen COMPLIANCE_UPDATED Mqtt Coming
  useEffect(() => {
    if (!complianceUpdateMqttData) return;
    try {
      const data = complianceUpdateMqttData.payload || complianceUpdateMqttData;
      const { complianceID, requestData, authorityName, authorityShortCode } =
        data || {};
      if (!complianceID) return;
      const {
        authorityId,
        criticality,
        description,
        dueDate,
        newStatusId,
        complianceTitle,
      } = requestData || {};

      try {
        const {
          allowedComplianceStatuses,
          authority,
          checklistTasks,
          checklists,
          completedTasks,
          complianceId,
          complianceStatus,
          complianceTitle,
          createdBy,
          criticality,
          description,
          dueDate,
          isExecuted,
          progressPercent,
          showProgressBar,
          tags,
          totalTasks,
          newStatusId,
        } = requestData || {};
        console.log(requestData, "requestDatarequestData");
        setComplianceInfo({
          complianceId: complianceId,
          complianceName: complianceTitle,
        });

        const selectedCriticality = criticalityOptions.find(
          (item) => item.value === criticality,
        );

        console.log(selectedCriticality, "requestDatarequestData");

        const { currentStatus, allowedStatuses } =
          getAllowedStatuses(newStatusId);
        console.log(currentStatus, allowedStatuses, "requestDatarequestData");

        // ✅ Set state directly, no remap
        setComplianceDetailsViewState((prev) => ({
          ...prev,
          complianceTitle,
          complianceId,
          description,
          authority: {
            value: authorityId,
            label: `${authorityName || ""} ${authorityShortCode || ""}` || "",
          },
          criticality: selectedCriticality,
          dueDate,
          tags,
          status: currentStatus, // value & label format expected by UI
        }));

        // ✅ ADD THIS
        setComplianceDetailsState((prev) => ({
          ...prev,
          complianceTitle,
          complianceId,
          description,
          authority: {
            value: authorityId,
            label: `${authorityName || ""} ${authorityShortCode || ""}` || "",
          },
          criticality: selectedCriticality,
          dueDate,
          tags,
          status: currentStatus,
        }));

        // ✅ Set allowed status options directly
        setAllowedComplianceStatusOptions(allowedStatuses);

        // if (allowedStatuses && allowedStatuses.length > 0) {
        //   const allowedStatusesArr = allowedStatuses.map((data, index) => {
        //     return {
        //       ...data,
        //       value: data.statusId,
        //       label: data.statusName,
        //     };
        //   });
        //   setAllowedComplianceStatusOptions(allowedStatusesArr);
        // }
        if (complianceId !== 0) {
          let Data = {
            complianceId: complianceId,
          };
          // dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
          // dispatch(
          //   GetComplianceChecklistsWithTasksByComplianceIdAPI(
          //     navigate,
          //     Data,
          //     t,
          //   ),
          // );
        }
      } catch (error) {}

      setComplianceByMeList((prev) =>
        prev.map((item) =>
          item.complianceId === complianceID
            ? {
                ...item,
                complianceTitle: complianceTitle || item.complianceTitle,
                authorityId: authorityId ?? item.authorityId,
                criticality: criticality ?? item.criticality,
                description: description ?? item.description,
                dueDate: dueDate
                  ? dueDate.substring(0, 8) // if coming as YYYYMMDDHHMMSS
                  : item.dueDate,
                complianceStatusId: newStatusId ?? item.complianceStatusId,
              }
            : item,
        ),
      );

      setComplianceInfo((prev) => {
        return {
          ...prev,
          complianceName: complianceTitle,
        };
      });
    } catch (error) {
      console.error("Error processing complianceUpdateMqttData:", error);
    }
  }, [complianceUpdateMqttData]);

  // WHEN COMPLIANCE_REOPEN_MQTT comes
  useEffect(() => {
    if (!complianceReopenMqttData) return;
    console.log(complianceReopenMqttData, "REOPENCOMPLIANCE");
    try {
      const data = complianceReopenMqttData;
      const { complianceId, complianceStatusChangeHistory } = data || {};
      console.log(data, "REOPENCOMPLIANCE");

      if (!complianceId || !complianceStatusChangeHistory) return;

      setComplianceDetailsState((prev) => {
        if (!prev || prev.complianceId !== complianceId) return prev;

        // Get latest status from newest history item
        const latestHistory = complianceStatusChangeHistory[0];

        return {
          ...prev,
          status: {
            value: latestHistory?.toStatus?.statusId,
            label: latestHistory?.toStatus?.statusName,
          },
          complianceStatusChangeHistory: complianceStatusChangeHistory,
        };
      });
    } catch (error) {
      console.error("Error processing complianceReopenMqttData:", error);
    }
  }, [complianceReopenMqttData]);

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
        complianceOnHoldModal,
        setComplianceOnHoldModal,
        complianceStatusChangeReasonModal,
        setComplianceStatusChangeReasonModal,
        complianceOnHoldReasonState,
        setComplianceOnHoldReasonState,
        complianceOnHoldSelectOption,
        setComplianceOnHoldSelectOption,
        tempSelectComplianceStatus,
        setTempSelectedComplianceStatus,
        resetModalStates,
        complianceCancelModal,
        setComplianceCancelModal,
        complianceCanceleasonModal,
        setComplianceCancelReasonModal,
        complianceCancelSelectOption,
        setComplianceCancelSelectOption,
        complianceCancelReasonState,
        setComplianceCancelReasonState,
        comlianceCompleteExceptionModal,
        setComlianceCompleteExceptionModal,
        comlianceStatusReopenedModal,
        setComlianceStatusReopenedModal,
        complianceReopenDetailsState,
        setComplianceReopenDetailsState,
        deleteChecklistConfirmationModalState,
        setDeleteChecklistConfirmationModalState,
        deleteChecklistId,
        setDeleteChecklistId,
        viewTypeDashboard,
        setViewTypeDashboard,
        complianceDashboardFilter,
        setComplianceDashboardFilter,
        resetComplianceDashboardFilter,
        complianceTaskDashboardFilter,
        setComplianceTaskDashboardFilter,
        resetComplianceTaskDashboardFilter,
        reopendComplianceDashboardFilter,
        setReopendComplianceDashboardFilter,
        resetReopenComplianceDashboardFilter,
        complianceStatndingReport,
        setComplianceStandingReport,
        endOfComplianceReport,
        setEndOfComplianceReport,
        endOfQuarterReport,
        setEndOfQuarterReport,
        accumulativeReport,
        setAccumulativeReport,
        searchComplianceReportPayload,
        setSearchComplianceReportPayload,
        complianceReportList,
        setComplianceReportList,
        complianceReportTotal,
        setComplianceReportTotal,
        complianceDetailsViewState,
        setComplianceDetailsViewState,
        autoPdfDownload,
        setAutoPdfDownload,
        checkAnyTaskOnPendingState,
        checkAnyChecklistOnPendingState,
        checkAnyTaskInProgress,
        setCheckAnyTaskInProgress,
        reopenDashboardList,
        setReopenDashboardList,
        viewComplianceTasksContextData,
        setViewComplianceTasksContextData,
        criticalityOptions,
        pendingNavigation,
        setPendingNavigation,
        viewAllReopenDashboardButtonFlag,
        setViewAllReopenDashboardButtonFlag,
        newChecklistIds,
        setNewChecklistIds,
        complianceCompleteModalType,
        setComplianceCompleteModalType,
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
      "useComplianceContext must be used within a AuthorityProvider",
    );
  }
  return context;
};
