import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./viewComplianceTasks.module.css";
import { Button } from "../../../../../components/elements";
import CustomAccordion from "../../../../../components/elements/accordian/CustomAccordion";
import { useTranslation } from "react-i18next";
// import Accordion_Arrow from "../../../../assets/images/Accordion_Arrow.png";
import Accordion_Arrow from "../../../../../assets/images/Accordion_Arrow.png";
import NoChecklistImg from "../../../../../assets/images/NoChecklistImg.png";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
  GetComplianceChecklistsWithTasksByComplianceIdForMeAPI,
} from "../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import DefaultSortIcon from "../../../../../assets/images/sortingIcons/Double Arrow2.svg";
import deleteIcon from "../../../../../assets/images/Icon material-delete.png";
import IconAttachment from "../../../../../assets/images/Icon-Attachment.png";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";
import { formatDateToYMD } from "../../commonFunctions";
import Select from "react-select";
import {
  cleareMessage,
  getTodoStatus,
} from "../../../../../store/actions/GetTodos";
import TaskDetailsViewModal from "../../../../taskViewDetailsModal";
import { ViewToDoList } from "../../../../../store/actions/ToDoList_action";

const ViewComplianceTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewComplianceTasksData, setViewComplianceTasksData] = useState([]);
  const accordionContainerRef = useRef();
  const { t } = useTranslation();
  const [addChecklistCloseState, setAddChecklistCloseState] = useState(false);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  const [taskView, setTaskView] = useState(false);

  // Sort States
  const [taskTitleSort, setTaskTitleSort] = useState("ascend");
  const [assignedToSort, setAssignedToSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState(null);
  const [statusFilter, setStatusFilter] = useState([
    "In Progress",
    "Pending",
    "Cancelled",
    "Completed",
  ]);
  const [activeSortedChecklistId, setActiveSortedChecklistId] = useState(null);
  const [taskStatus, setTaskStatus] = useState([]);

  console.log(taskStatus, "taskStatustaskStatus");

  // Status Options
  const TASK_STATUS_TRANSITIONS = {
    2: [1, 4], // Pending → In Progress, Cancelled
    1: [5, 4], // In Progress → Completed, Cancelled
    5: [], // Completed → none
    4: [], // Cancelled → none
  };
  const getAllowedStatusOptions = (record) => {
    const allowedStatusIds = TASK_STATUS_TRANSITIONS[record.taskStatusId] || [];

    return taskStatus.filter((status) =>
      allowedStatusIds.includes(status.value)
    );
  };
  // context
  const {
    complianceDetailsState,
    expandChecklistOnTasksPage,
    setExpandChecklistOnTasksPage,
    complianceViewMode,
  } = useComplianceContext();
  console.log(
    complianceDetailsState,
    "complianceDetailsStatecomplianceDetailsState"
  );
  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId
  );

  const getAllComplianceChecklistTaskForMe = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceIdForMe
  );

  console.log(
    getAllComplianceChecklistTask,
    "getAllComplianceChecklistTaskgetAllComplianceChecklistTask"
  );

  // Status for All tasks
  const getAllTasksStatus = useSelector(
    (state) => state.getTodosStatus.Response
  );
  console.log(getAllTasksStatus, "getAllTasksStatus");
  // global State Response

  // initial UseEffect
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));

    return () => {
      dispatch(cleareMessage());
    };
  }, []);

  useEffect(() => {
    if (getAllTasksStatus && getAllTasksStatus.length > 0) {
      try {
        const statuses = getAllTasksStatus.map((item) => ({
          value: item.pK_TSID,
          label: item.status,
        }));
        setTaskStatus(statuses);
      } catch (error) {}
    }
  }, [getAllTasksStatus]);

  useEffect(() => {
    if (complianceDetailsState.complianceId !== 0) {
      let Data = {
        complianceId: complianceDetailsState.complianceId,
      };
      if (complianceViewMode === "byMe") {
        dispatch(
          GetComplianceChecklistsWithTasksByComplianceIdAPI(navigate, Data, t)
        );
      } else if (complianceViewMode === "forMe") {
        dispatch(
          GetComplianceChecklistsWithTasksByComplianceIdForMeAPI(
            navigate,
            Data,
            t
          )
        );
      }
    }
  }, [complianceDetailsState]);

  useEffect(() => {
    if (expandChecklistOnTasksPage && viewComplianceTasksData?.length > 0) {
      setExpandedCheckListIds([expandChecklistOnTasksPage]); // 👈 expand only one
      setAddChecklistCloseState(true);

      // 🔁 Reset so refresh / tab switch doesn't re-trigger
      setExpandChecklistOnTasksPage(null);
    }
  }, [expandChecklistOnTasksPage, viewComplianceTasksData]);

  useEffect(() => {
    if (complianceViewMode === "byMe") {
      if (
        getAllComplianceChecklistTask &&
        getAllComplianceChecklistTask !== null
      ) {
        try {
          const { checklistList } = getAllComplianceChecklistTask;
          setViewComplianceTasksData(checklistList);
        } catch (error) {}
      }
    } else if (complianceViewMode === "forMe") {
      if (
        getAllComplianceChecklistTaskForMe &&
        getAllComplianceChecklistTaskForMe !== null
      ) {
        try {
          const { checklistList } = getAllComplianceChecklistTaskForMe;
          setViewComplianceTasksData(checklistList);
        } catch (error) {}
      }
    }
  }, [getAllComplianceChecklistTask, getAllComplianceChecklistTaskForMe]);

  // functions
  const handleClickExpandCheckList = (data) => {
    setExpandedCheckListIds((prev) => {
      if (prev.includes(data.checklistId)) {
        // collapse

        return prev.filter((id) => id !== data.checklistId);
      } else {
        setAddChecklistCloseState(true);
        // expand
        return [...prev, data.checklistId];
      }
    });
  };

  // const handleStatusChange = async (taskId, newStatus) => {
  //   let previousStatus = null;

  //   // 🔎 Find current task + status
  //   viewComplianceTasksData.forEach((checklist) => {
  //     checklist.taskList?.forEach((task) => {
  //       if (task.taskId === taskId) {
  //         previousStatus = task.taskStatus;
  //       }
  //     });
  //   });

  //   // ❌ Safety check (UI should already block this)
  //   const allowedTransitions = TASK_STATUS_TRANSITIONS[previousStatus] || [];

  //   if (!allowedTransitions.includes(newStatus)) {
  //     console.warn(`Invalid transition: ${previousStatus} → ${newStatus}`);
  //     return;
  //   }

  //   // ✅ Optimistic UI update
  //   setViewComplianceTasksData((prev) =>
  //     prev.map((checklist) => ({
  //       ...checklist,
  //       taskList: checklist.taskList?.map((task) =>
  //         task.taskId === taskId ? { ...task, taskStatus: newStatus } : task
  //       ),
  //     }))
  //   );

  //   try {
  //     // 🚀 API payload
  //     const payload = {
  //       taskId,
  //       status: newStatus,
  //     };

  //     // await dispatch(
  //     //   UpdateComplianceTaskStatusAPI(navigate, payload, t)
  //     // );
  //   } catch (error) {
  //     // 🔁 Rollback on failure
  //     setViewComplianceTasksData((prev) =>
  //       prev.map((checklist) => ({
  //         ...checklist,
  //         taskList: checklist.taskList?.map((task) =>
  //           task.taskId === taskId
  //             ? { ...task, taskStatus: previousStatus }
  //             : task
  //         ),
  //       }))
  //     );
  //   }
  // };
  const resetAllSorts = () => {
    setTaskTitleSort(null);
    setAssignedToSort(null);
    setDueDateSort(null);
  };
  const handleChangeAuthorityFilerSorter = (
    checklistId,
    pagination,
    filters,
    sorter
  ) => {
    setActiveSortedChecklistId(checklistId);

    resetAllSorts();

    if (sorter.columnKey === "taskTitle") {
      setTaskTitleSort(sorter.order);
    }

    if (sorter.columnKey === "assignedUsers") {
      setAssignedToSort(sorter.order);
    }

    if (sorter.columnKey === "deadLineDate") {
      setDueDateSort(sorter.order);
    }
  };

  // styles for status
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "#9E9E9E";
      case "In Progress":
        return "#F5A623";
      case "Completed":
        return "#2ECC71";
      case "Overdue":
        return "#E74C3C";
      case "Submitted for Approval":
        return "#5B6EF5";
      case "Responded":
        return "#4FC3F7";
      case "On Hold":
        return "#26C6DA";
      case "Closed":
        return "#616161";
      default:
        return "#000";
    }
  };
  const statusSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      backgroundColor: state.isFocused ? "#F5F7FF" : "#fff",
      fontWeight: 500,
      cursor: "pointer",
    }),

    menu: (provided, state) => ({
      ...provided,
      width: "160px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      fontWeight: 600,
    }),

    control: (provided, state) => ({
      ...provided,
      width: "160px",
      minHeight: "36px",
      border: "none",
      borderColor: state.isFocused ? "#6172d6" : "#d9d9d9",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6172d6",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  // functions
  const handleStatusChange = (taskId, selectedStatus) => {
    setViewComplianceTasksData((prev) =>
      prev.map((checklist) => ({
        ...checklist,
        taskList: checklist.taskList?.map((task) =>
          task.taskId === taskId
            ? {
                ...task,
                taskStatusId: selectedStatus.value,
                taskStatus: selectedStatus.label,
              }
            : task
        ),
      }))
    );

    // 🔗 API payload (when you connect backend)
    /*
    dispatch(
      UpdateComplianceTaskStatusAPI(navigate, {
        taskId,
        statusId: selectedStatus.value,
      }, t)
    );
    */
  };

  const handleClickTitle = (id) => {
    let Data = { ToDoListID: id };
    dispatch(ViewToDoList(navigate, Data, t, setTaskView));
  };

  // TABLES
  // Column

  const getColumnsTasks = (checklistId) => [
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
          {t("Task-title")}
          {activeSortedChecklistId === checklistId ? (
            taskTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" />
            ) : taskTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" />
            ) : (
              <img src={DefaultSortIcon} alt="" />
            )
          ) : (
            <img src={DefaultSortIcon} alt="" />
          )}
        </span>
      ),
      dataIndex: "taskTitle",
      key: "taskTitle",
      width: "25%",
      ellipsis: true,
      align: "left",
      render: (text, record) => (
        <span
          className="text-truncate"
          onClick={() => handleClickTitle(record.taskId)}
        >
          {text}
        </span>
      ),
      sorter: (a, b) =>
        taskTitleSort === "descend"
          ? b.taskTitle?.toLowerCase().localeCompare(a.taskTitle?.toLowerCase())
          : taskTitleSort === "ascend"
          ? a.taskTitle?.toLowerCase().localeCompare(b.taskTitle?.toLowerCase())
          : a.taskTitle
              ?.toLowerCase()
              .localeCompare(b.taskTitle?.toLowerCase()),
    },

    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
          {t("Assigned-to")}
          {activeSortedChecklistId === checklistId ? (
            assignedToSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : assignedToSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )
          ) : (
            <img src={DefaultSortIcon} alt="" />
          )}
        </span>
      ),

      dataIndex: "assignedUsers",
      key: "assignedUsers",
      width: "15%",
      align: "left",
      ellipsis: true,
      render: (assignedUsers) => {
        const firstUser = assignedUsers?.[0];
        return (
          <span className="text-truncate">
            {firstUser ? firstUser.name : "-"}
          </span>
        );
      },

      sorter: (a, b) =>
        assignedToSort === "descend"
          ? b.assignedUsers[0]?.name
              ?.toLowerCase()
              .localeCompare(a.assignedUsers[0]?.name?.toLowerCase())
          : assignedToSort === "ascend"
          ? a.assignedUsers[0]?.name
              ?.toLowerCase()
              .localeCompare(b.assignedUsers[0]?.name?.toLowerCase())
          : a.assignedUsers[0]?.name
              ?.toLowerCase()
              .localeCompare(b.assignedUsers[0]?.name?.toLowerCase()),
    },
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
          {t("Due-date")}
          {activeSortedChecklistId === checklistId ? (
            dueDateSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : dueDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )
          ) : (
            <img src={DefaultSortIcon} alt="" />
          )}
        </span>
      ),
      sorter: (a, b) =>
        dueDateSort === "descend"
          ? b.deadLineDate
              ?.toLowerCase()
              .localeCompare(a.deadLineDate?.toLowerCase())
          : dueDateSort === "ascend"
          ? a.deadLineDate
              ?.toLowerCase()
              .localeCompare(b.deadLineDate?.toLowerCase())
          : a.deadLineDate
              ?.toLowerCase()
              .localeCompare(b.deadLineDate?.toLowerCase()),

      dataIndex: "deadLineDate",
      key: "deadLineDate",
      width: "12%",
      align: "left",
      ellipsis: true,
      render: (text) => (
        <span className="text-truncate">{formatDateToYMD(text)}</span>
      ),
    },

    {
      title: t("Status"),
      dataIndex: "taskStatus",
      key: "taskStatus",
      width: "10%",
      align: "center",

      render: (taskStatusText, record) => {
        const allowedOptions = getAllowedStatusOptions(record);

        const currentStatus = {
          label: record.taskStatus,
          value: record.taskStatusId,
        };

        // 🚫 No transitions allowed → show plain text
        if (allowedOptions.length === 0) {
          return (
            <span
              style={{
                color: getStatusColor(record.taskStatus),
                fontWeight: 600,
              }}
            >
              {record.taskStatus}
            </span>
          );
        }

        // ✅ Transitions allowed
        return complianceViewMode === "byMe" ? (
          <Select
            menuPortalTarget={document.body}
            isSearchable={false}
            options={allowedOptions}
            value={currentStatus}
            styles={statusSelectStyles}
            onChange={(selected) => handleStatusChange(record.taskId, selected)}
          />
        ) : (
          <span
            style={{
              color: getStatusColor(currentStatus.label),
              fontWeight: 600,
            }}
          >
            {currentStatus.label}
          </span>
        );
      },
    },

    {
      title: t(""),
      dataIndex: "hasAttachments",
      key: "hasAttachments",
      width: "20%",

      // Action buttons column
      render: (hasAttachments) => {
        console.log(hasAttachments, "hasAttachmentshasAttachments");
        return (
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-end align-items-center gap-4"
            >
              {/* Attachment */}
              {hasAttachments > 0 ? (
                <img
                  className="cursor-pointer"
                  draggable="false"
                  alt=""
                  src={IconAttachment}
                  // onClick={() => handleDeleteTaskModal(record.authorityId)}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        );
      },
    },
  ];

  // Row
  return (
    <>
      <Row className="mt-3">
        <div
          ref={accordionContainerRef}
          className={
            addChecklistCloseState
              ? styles["taskAccordian_closed"]
              : styles["taskAccordian"]
          }
        >
          {viewComplianceTasksData?.length > 0 ? (
            viewComplianceTasksData.map((data, index) => {
              const isExpanded = expandedCheckListIds.find(
                (data2, index) => data2 === data.checklistId
              );

              // const taskData = data.taskList;
              const taskData = (data.taskList || []).map((task, index) => ({
                ...task,
                key: task.taskId || `${data.checklistId}-${index}`,
              }));
              console.log(taskData, "isExpandedisExpanded");

              return (
                <div key={data.checklistId}>
                  <CustomAccordion
                    isExpand={isExpanded}
                    notesID={data.checklistId}
                    isCompliance={false}
                    isComplianceTask={true}
                    StartField={
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className={styles.checklistTitleLabel}
                        >
                          {t("Checklist-title")}
                        </Col>

                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className={`m-0 ${styles.checklistTitleValue}`}
                        >
                          {data.checklistTitle}
                        </Col>
                      </Row>
                    }
                    attachmentsRow={
                      taskData.length > 0 && (
                        <>
                          <CustomTable
                            column={getColumnsTasks(data.checklistId)}
                            rows={taskData}
                            pagination={false}
                            onChange={(pagination, filters, sorter) =>
                              handleChangeAuthorityFilerSorter(
                                data.checklistId,
                                pagination,
                                filters,
                                sorter
                              )
                            }
                          />
                        </>
                      )
                    }
                    endField={
                      <>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={styles.checklistTitleLabel}
                          >
                            {t("Checklist-title")}
                          </Col>

                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className={`m-0 ${styles.checklistTitleValue}`}
                          >
                            {data.checklistTitle}
                          </Col>
                        </Row>
                      </>
                    }
                  />
                </div>
              );
            })
          ) : (
            <>
              <Row className="mt-3 ">
                <Col
                  lg={12}
                  ms={12}
                  sm={12}
                  className="d-flex justify-content-center align-items-center"
                >
                  <img draggable={false} src={NoChecklistImg} alt="" />
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  ms={12}
                  sm={12}
                  className={`${styles["noChecklistMsg"]} d-flex justify-content-center`}
                >
                  {t("No-checklist-found")}
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={`${styles["noChecklistMsg_subMsg"]} d-flex justify-content-center`}
                >
                  {t("No-checklist-has-been-assigned-yet.")}
                </Col>
              </Row>
            </>
          )}
        </div>
      </Row>
      {taskView && (
        <TaskDetailsViewModal
          viewFlagToDo={taskView}
          setViewFlagToDo={setTaskView}
        />
      )}
    </>
  );
};

export default ViewComplianceTasks;
