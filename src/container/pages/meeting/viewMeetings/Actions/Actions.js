import React from "react";
import "./Actions.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, TableToDo } from "../../../../../components/elements";
import { ChevronDown } from "react-bootstrap-icons";
import addmore from "../../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import EmptyStates from "../../../../../assets/images/EmptystateAction.svg";
import CreateTask from "./CreateTask/CreateTask";
import RemoveTableModal from "./RemoveTableModal/RemoveTableModal";
import del from "../../../../../assets/images/del.png";
import {
  searchNewUserMeeting,
  showUnsavedActionsModal,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import {
  getMeetingTaskMainApi,
  saveMeetingActionsDocuments,
} from "../../../../../store/actions/Action_Meeting";
import CancelActions from "./CancelActions/CancelActions";
import {
  _justShowDateformatBilling,
  utcConvertintoGMT,
} from "../../../../../commen/functions/date_formater";
import CustomPagination from "../../../../../commen/functions/customPagination/Paginations";
import { clearAttendanceState } from "../../../../../store/actions/Attendance_Meeting";
import {
  ViewToDoList,
  createTaskMeetingMQTT,
} from "../../../../../store/actions/ToDoList_action";
import ModalViewToDo from "../../../../todolistviewModal/ModalViewToDo";
import { Checkbox, Dropdown, Menu, Select } from "antd";
import {
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../../../store/actions/GetTodos";
import DescendIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/Arrow-up.png";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import AccessDeniedModal from "../../../../../components/layout/WebNotfication/AccessDeniedModal/AccessDeniedModal";
const Actions = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    editorRole,
    setViewAdvanceMeetingModal,
    setactionsPage,
    setPolls,
    advanceMeetingModalID,
    dataroomMapFolderId,
  } = useMeetingContext();

  console.log(advanceMeetingModalID, "advanceMeetingModalIDadvanceMeetingModalIDadvanceMeetingModalID");
  const cancelActions = useSelector(
    (state) => state.NewMeetingreducer.cancelActions
  );
  const removeTableModal = useSelector(
    (state) => state.NewMeetingreducer.removeTableModal
  );
  const todoListMeetingTask = useSelector(
    (state) => state.actionMeetingReducer.todoListMeetingTask
  );
  const Response = useSelector((state) => state.todoStatus.Response);
  const UpdateTodoStatusMessage = useSelector(
    (state) => state.getTodosStatus.UpdateTodoStatusMessage
  );
  const socketTodoStatusData = useSelector(
    (state) => state.toDoListReducer.socketTodoStatusData
  );
  const createTaskMeeting = useSelector(
    (state) => state.toDoListReducer.createTaskMeeting
  );

  const AccessDeniedGlobalState = useSelector(
    (state) => state.PollsReducer.AccessDeniedPolls
  );

  let userID = localStorage.getItem("userID");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [statusValues, setStatusValues] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [createaTask, setCreateaTask] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [removeTodo, setRemoveTodo] = useState(0);
  const [statusOptions, setStatusOptions] = useState([]);
  const [taskTitleSort, setTaskTitleSort] = useState(null);
  const [taskAssignedBySort, setTaskAssignedBySort] = useState(null);
  const [taskAssignedToSort, setTaskAssignedToSort] = useState(null);
  const [taskDeadlineSort, setDeadlineSort] = useState(null);
  console.log(statusOptions, "statusOptionsstatusOptions");
  const [actionState, setActionState] = useState({
    Title: "",
    Date: "",
    AssignedToName: "",
    TaskID: 0,
  });

  // Rows for table rendering in Action
  const [actionsRows, setActionsRows] = useState([]);

  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);

  // Notification Click Redirection Page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      if (JSON.parse(localStorage.getItem("viewadvanceMeetingTask")) === true) {
        console.log("NotificationDataNotificationData");
        let Data = {
          ToDoListID: Number(localStorage.getItem("NotificationClickTaskID")),
        };
        dispatch(ViewToDoList(navigate, Data, t, setViewTaskModal, null));
      }
    }
    return () => {};
  }, []);

  // dispatch Api in useEffect
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));

    let meetingTaskData = {
      MeetingID: Number(advanceMeetingModalID),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: currentPage,
      Length: currentPageSize,
    };

    dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));

    return () => {
      dispatch(clearAttendanceState());
      setActionsRows([]);
    };
  }, []);

  // SET STATUS VALUES
  useEffect(() => {
    let optionsArr = [];
    let newOptionsFilter = [];
    let newArrStatus = [""];

    if (Response !== null && Response !== "" && Response?.length > 0) {
      Response.map((data) => {
        if (data.pK_TSID !== 3 && data.pK_TSID !== 6) {
          optionsArr.push({
            id: data.pK_TSID,
            status: data.status,
          });
          newArrStatus.push(data.status);

          newOptionsFilter.push({
            key: data.pK_TSID,
            label: data.status,
          });
        }
      });
    }
    setStatusValues(newArrStatus);

    setStatusOptions(optionsArr);
  }, [Response]);

  // Remove task from mqtt response
  useEffect(() => {
    try {
      if (socketTodoStatusData !== null) {
        let payloadData = socketTodoStatusData;
        if (payloadData.todoStatusID === 6) {
          setActionsRows((rowsData) => {
            return rowsData.filter((newData, index) => {
              return newData.pK_TID !== payloadData.todoid;
            });
          });
        } else {
          setActionsRows((rowsData) => {
            return rowsData.map((newData) => {
              if (newData.pK_TID === payloadData.todoid) {
                const newObj = {
                  ...newData,
                  status: {
                    pK_TSID: payloadData.todoStatusID,
                    status: statusValues[payloadData.todoStatusID],
                  },
                };
                return newObj;
              }
              return newData;
            });
          });
        }
      }
    } catch {}
  }, [socketTodoStatusData]);

  useEffect(() => {
    if (removeTodo !== 0) {
      if (
        UpdateTodoStatusMessage ===
        t("The-record-has-been-updated-successfully")
      ) {
        let copyData = [...actionsRows];
        let removeDeleteTodo = copyData.filter(
          (todoData, index) => todoData.pK_TID !== removeTodo
        );
        setActionsRows(removeDeleteTodo);
        setRemoveTodo(0);
      }
    }
  }, [UpdateTodoStatusMessage, removeTodo]);

  // CHANGE HANDLER STATUS
  const statusChangeHandler = (e, statusdata) => {
    if (e === 6) {
      setRemoveTodo(statusdata);
    }
    dispatch(
      updateTodoStatusFunc(navigate, e, statusdata, t, false, 3, advanceMeetingModalID)
    );
  };

  const filters = [
    {
      value: "1",
      text: t("In-progress"),
    },
    {
      value: "2",
      text: t("Pending"),
    },

    {
      value: "4",
      text: t("Cancelled"),
    },
    {
      value: "5",
      text: t("Completed"),
    },
  ];

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    const filteredData = originalData.filter((item) =>
      selectedValues.includes(item.status.pK_TSID.toString())
    );
    setActionsRows(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["1", "2", "3", "4", "5", "6"]);
    setActionsRows(originalData);
    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex gap-3 align-items-center justify-content-center'>
        <Button
          text={"Reset"}
          className={"FilterResetBtn"}
          onClick={resetFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedValues.length === 0}
          className={"ResetOkBtn"}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );
  const ActionsColoumn = [
    {
      title: (
        <>
          <span className='d-flex gap-2 align-items-center'>
            {t("Task")}
            {taskTitleSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "title",
      key: "title",
      width: "25%",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      taskDeadlineSort,
      onHeaderCell: () => ({
        onClick: () => {
          setTaskTitleSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p
          className='todolist-title-col'
          title={text}
          onClick={(e) => viewActionModal(record)}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 justify-content-center align-items-center'>
            {t("Assigned-by")}
            {taskAssignedBySort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "25%",
      align: "center",
      sortDirections: ["descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => {
          setTaskAssignedBySort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) => {
        return (
          a?.taskCreator?.name
            .toLowerCase()
            .localeCompare(b?.taskCreator?.name?.toLowerCase()),
          taskAssignedBySort
        );
      },
      render: (record, index) => {
        return (
          <p className='m-0 MontserratRegular color-5a5a5a FontArabicRegular text-nowrap'>
            {" "}
            <img
              draggable='false'
              className='data-img'
              src={`data:image/jpeg;base64,${record?.displayProfilePictureName}`}
              alt=''
            />
            {record?.name}
          </p>
        );
      },
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 justify-content-center align-items-center'>
            {t("Assigned-to")}{" "}
            {taskAssignedToSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      width: "25%",
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      align: "center",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.taskAssignedTo[0].name
          .toLowerCase()
          .localeCompare(b.taskAssignedTo[0].name.toLowerCase()),
      taskAssignedToSort,
      onHeaderCell: () => ({
        onClick: () => {
          setTaskAssignedToSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        if (text !== undefined && text !== null && text.length > 0) {
          return (
            <>
              <p className='m-0 MontserratRegular  color-505050 FontArabicRegular text-nowrap '>
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img
                      draggable='false'
                      className='data-img'
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=''
                    />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img
                      draggable='false'
                      className='data-img'
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=''
                    />
                    {text[0].name}
                  </>
                )}
              </p>
            </>
          );
        }
      },
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 align-items-center justify-content-center'>
            {t("Deadline")}
            {taskDeadlineSort === "descend" ? (
              <img src={ArrowDownIcon} alt='' />
            ) : (
              <img src={ArrowUpIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      ellipsis: true,
      width: "10%",

      align: "center",
      sortDirections: ["descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => {
          setDeadlineSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadlineDateTime) -
        utcConvertintoGMT(b.deadlineDateTime),

      render: (text, record) => {
        console.log(record, "deadlineDateTime");
        return (
          <span className='text-nowrap text-center'>
            {_justShowDateformatBilling(record.deadlineDateTime)}
          </span>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(userID)) {
          return (
            <>
              <Select
                value={text.status}
                bordered={false}
                dropdownClassName='Status-Todo'
                className={
                  text.pK_TSID === 1
                    ? "InProgress  custom-class "
                    : text.pK_TSID === 2
                    ? "Pending  custom-class "
                    : text.pK_TSID === 3
                    ? "Upcoming  custom-class "
                    : text.pK_TSID === 4
                    ? "Cancelled  custom-class "
                    : text.pK_TSID === 5
                    ? "Completed  custom-class "
                    : null
                }
                onChange={(e) => statusChangeHandler(e, record.pK_TID)}>
                {statusOptions.map((optValue) => {
                  return (
                    <option key={optValue.id} value={optValue.id}>
                      {optValue.status}
                    </option>
                  );
                })}
              </Select>
            </>
          );
        } else {
          return (
            <p
              className={
                text.pK_TSID === 1
                  ? "InProgress custom-class  color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 2
                  ? "Pending  custom-class color-5a5a5a text-center my-1"
                  : text.pK_TSID === 3
                  ? "Upcoming  custom-class color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 4
                  ? "Cancelled   custom-class color-5a5a5a text-center my-1"
                  : text.pK_TSID === 5
                  ? "Completed   custom-class color-5a5a5a  text-center my-1"
                  : null
              }>
              {text.status}
            </p>
          );
        }
      },

      filterMultiple: true,
    },
    {
      title: "",
      dataIndex: "",
      key: "taskCreator",
      width: "5%",
      render: (record, index) => {
        if (parseInt(record?.taskCreator?.pK_UID) === parseInt(userID)) {
          return (
            <i
              className='meeting-editbutton cursor-pointer'
              title={t("Delete")}
              onClick={(e) => deleteActionHandler(record)}>
              <img draggable='false' src={del} alt='' />
            </i>
          );
        } else {
          <></>;
        }
      },
    },
  ];

  const deleteActionHandler = (record) => {
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    let newData = {};
    dispatch(
      saveMeetingActionsDocuments(
        navigate,
        NewData,
        t,
        8,
        setCreateaTask,
        newData,
        0,
        advanceMeetingModalID
      )
    );
  };

  useEffect(() => {
    try {
      if (
        todoListMeetingTask !== null &&
        todoListMeetingTask !== undefined &&
        todoListMeetingTask.toDoLists.length > 0
      ) {
        console.log(todoListMeetingTask.toDoLists, "actionMeetingReducer");
        setTotalRecords(todoListMeetingTask.totalRecords);
        setActionsRows(todoListMeetingTask.toDoLists);
        setOriginalData(todoListMeetingTask.toDoLists);
      } else {
        setActionsRows([]);
        setOriginalData([]);
        setTotalRecords(0);
      }
    } catch {}
  }, [todoListMeetingTask]);

  useEffect(() => {
    try {
      if (createTaskMeeting !== null) {
        let taskData = createTaskMeeting;
        let taskInfo = createTaskMeeting.todoList;
        if (Number(taskData.meetingID) === Number(advanceMeetingModalID)) {
          let findisAlreadExist = actionsRows.findIndex(
            (data, index) => data.pK_TID === taskData.todoList.pK_TID
          );
          if (findisAlreadExist !== -1) {
          } else {
            setActionsRows([...actionsRows, taskInfo]);
          }
        }
        dispatch(createTaskMeetingMQTT(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [createTaskMeeting]);

  // for pagination in Create Task
  const handleForPagination = (current, pageSize) => {
    let data = {
      MeetingID: Number(advanceMeetingModalID),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    dispatch(getMeetingTaskMainApi(navigate, t, data));
  };

  const handleCancelActionNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.removeItem("folderDataRoomMeeting");
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    setactionsPage(false);
    localStorage.removeItem("AdvanceMeetingOperations");
    localStorage.removeItem("NotificationAdvanceMeetingID");
  };

  const handleCreateTaskButton = () => {
    setCreateaTask(true);
    dispatch(showUnsavedActionsModal(false));
  };

  // to move in next to polls handler
  const nextTabToPolls = () => {
    setactionsPage(false);
    setPolls(true);
  };
  const viewActionModal = (record) => {
    let Data = { ToDoListID: Number(record.pK_TID) };
    dispatch(ViewToDoList(navigate, Data, t, setViewTaskModal, null));
  };

  const scroll = {
    y: "64vh",
    scrollbar: {
      // You can adjust the width and distance as needed
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
      // Other scrollbar options
    },
  };

  return (
    <section>
      {createaTask ? (
        <CreateTask
          setCreateaTask={setCreateaTask}
          currentMeeting={advanceMeetingModalID}
          setActionState={setActionState}
          actionState={actionState}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : (
        <>
          <Row className='mt-3'>
            <Col lg={12} md={12} sm={12} className='d-flex justify-content-end'>
              <Button
                text={t("Create-task")}
                className={"Create_Task_Button"}
                icon={<img draggable={false} src={addmore} alt='' />}
                onClick={handleCreateTaskButton}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={12} md={12} sm={12}>
              <>
                <section className={"HeightDefined"}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <TableToDo
                        sortDirections={["descend", "ascend"]}
                        column={ActionsColoumn}
                        scroll={scroll}
                        pagination={false}
                        className={"ToDo"}
                        rows={actionsRows}
                        locale={{
                          emptyText: (
                            <>
                              <Row className='mt-0'>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <img
                                    alt=''
                                    draggable={false}
                                    src={EmptyStates}
                                  />
                                </Col>
                              </Row>
                              <Row className='mt-2'>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <span className={"Empty-State_Heading"}>
                                    {t("Create-tasks-instantly")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='d-flex justify-content-center'>
                                  <span className={"EmptyState_SubHeading"}>
                                    {t(
                                      "Assign-tasks-in-real-time-while-the-meeting-is-underway"
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </>
                          ), //
                        }}
                      />
                    </Col>
                  </Row>

                  {Object.keys(actionsRows).length > 0 && (
                    <Row className=''>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex justify-content-center'>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={
                              "pagination-groups-table d-flex justify-content-center"
                            }>
                            <span className='PaginationStyle-TodoList'>
                              <CustomPagination
                                onChange={handleForPagination}
                                current={currentPage}
                                showSizer={true}
                                total={totalRecords}
                                pageSizeOptionsValues={[
                                  "10",
                                  "25",
                                  "50",
                                  "100",
                                ]}
                                pageSize={currentPageSize}
                              />
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )}
                </section>
              </>
              {/* <Row className="mt-3">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Cancel")}
                    className={"CloneMeetingButton"}
                    onClick={handleCancelActionNoPopup}
                  />

                  {Number(editorRole.status) === 9 &&
                  (editorRole.role === "Participant" ||
                    editorRole.role === "Agenda Contributor") ? null : (
                    <>
                      <Button
                        text={t("Next")}
                        className={"SaveButtonActions"}
                        onClick={nextTabToPolls}
                      />
                    </>
                  )}
                </Col>
              </Row> */}
            </Col>
          </Row>
        </>
      )}
      {viewTaskModal && (
        <ModalViewToDo
          viewFlagToDo={viewTaskModal}
          setViewFlagToDo={setViewTaskModal}
        />
      )}
      {removeTableModal && <RemoveTableModal />}
      {cancelActions && (
        <CancelActions setSceduleMeeting={setViewAdvanceMeetingModal} />
      )}
      {AccessDeniedGlobalState && <AccessDeniedModal />}
    </section>
  );
};

export default Actions;
