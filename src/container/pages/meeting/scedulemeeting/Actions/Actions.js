import React from "react";
import styles from "./Actions.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Table } from "../../../../../components/elements";
import addmore from "../../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import del from "../../../../../assets/images/del.png";
import { ChevronDown } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import EmptyStates from "../../../../../assets/images/EmptystateAction.svg";
import CreateTask from "./CreateTask/CreateTask";
import RemoveTableModal from "./RemoveTableModal/RemoveTableModal";
import {
  showCancelActions,
  showUnsavedActionsModal,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "../../../../../store/actions/NewMeetingActions";
import {
  getMeetingTaskMainApi,
  saveMeetingActionsDocuments,
} from "../../../../../store/actions/Action_Meeting";
import CancelActions from "./CancelActions/CancelActions";
import { _justShowDateformatBilling } from "../../../../../commen/functions/date_formater";
import CustomPagination from "../../../../../commen/functions/customPagination/Paginations";
import ModalViewToDo from "../../../../todolistviewModal/ModalViewToDo";
import {
  ViewToDoList,
  createTaskMeetingMQTT,
} from "../../../../../store/actions/ToDoList_action";
import { Select } from "antd";
import {
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../../../store/actions/GetTodos";

const Actions = ({
  setSceduleMeeting,
  setactionsPage,
  setPolls,
  currentMeeting,
  editorRole,
  setMinutes,
  setEditMeeting,
  isEditMeeting,
  dataroomMapFolderId,
  setMeetingMaterial,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    NewMeetingreducer,
    actionMeetingReducer,
    getTodosStatus,
    toDoListReducer,
    todoStatus,
  } = useSelector((state) => state);
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(50);
  const [createaTask, setCreateaTask] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [removeTodo, setRemoveTodo] = useState(0);

  // Rows for table rendering in Action
  const [statusOptions, setStatusOptions] = useState([]);

  const [actionsRows, setActionsRows] = useState([]);
  const [actionState, setActionState] = useState({
    Title: "",
    Date: "",
    AssignedToName: "",
    TaskID: 0,
  });

  // CHANGE HANDLER STATUS
  const statusChangeHandler = (e, statusdata) => {
    if (e === 6) {
      setRemoveTodo(statusdata);
    }
    dispatch(
      updateTodoStatusFunc(navigate, e, statusdata, t, false, 3, currentMeeting)
    );
  };

  // dispatch Api in useEffect
  useEffect(() => {
    let meetingTaskData = {
      MeetingID: Number(currentMeeting),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: currentPage,
      Length: currentPageSize,
    };

    dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
    dispatch(getTodoStatus(navigate, t));
  }, []);

  // for pagination in Create Task
  const handleForPagination = (current, pageSize) => {
    let data = {
      MeetingID: Number(currentMeeting),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    // localStorage.setItem("MeetingPageRows", pageSize);
    // localStorage.setItem("MeetingPageCurrent", current);
    dispatch(getMeetingTaskMainApi(navigate, t, data));
  };

  const viewActionModal = (record) => {
    let Data = { ToDoListID: Number(record.pK_TID) };
    dispatch(ViewToDoList(navigate, Data, t, setViewTaskModal));
  };

  // SET STATUS VALUES
  useEffect(() => {
    let optionsArr = [];
    let newOptionsFilter = [];
    if (todoStatus.Response !== null && todoStatus.Response !== "") {
      todoStatus.Response.map((data, index) => {
        optionsArr.push({
          id: data.pK_TSID,
          status: data.status,
        });
        newOptionsFilter.push({
          key: data.pK_TSID,
          label: data.status,
        });
      });
    }
    setStatusOptions(optionsArr);
  }, [todoStatus]);

  // Remove task from mqtt response
  useEffect(() => {
    try {
      if (toDoListReducer.socketTodoStatusData !== null) {
        let payloadData = toDoListReducer.socketTodoStatusData;
        if (payloadData.todoStatusID === 6) {
          setActionsRows((rowsData) => {
            return rowsData.filter((newData, index) => {
              return newData.pK_TID !== payloadData.todoid;
            });
          });
        }
      }
    } catch {}
  }, [toDoListReducer.socketTodoStatusData]);

  useEffect(() => {
    if (removeTodo !== 0) {
      if (
        getTodosStatus.UpdateTodoStatusMessage ===
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
  }, [getTodosStatus.UpdateTodoStatusMessage, removeTodo]);

  const ActionsColoumn = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,

      width: "115px",
      render: (text, record) => {
        return (
          <span
            onClick={() => viewActionModal(record)}
            className={styles["Action_title"]}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: t("Assigned-by"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "220px",
      sortDirections: ["descend", "ascend"],
      // align: "left",
      render: (record, index) => {
        return (
          <p className="m-0 MontserratRegular color-5a5a5a FontArabicRegular text-nowrap">
            {" "}
            <img
              draggable="false"
              className="data-img"
              src={`data:image/jpeg;base64,${record?.displayProfilePictureName}`}
              alt=""
            />
            {record?.name}
          </p>
        );
      },
      sorter: (a, b) => {
        return a?.taskCreator?.name
          .toLowerCase()
          .localeCompare(b?.taskCreator?.name?.toLowerCase());
      },
    },
    {
      title: t("Assigned-to"),
      width: "220px",
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.taskAssignedTo[0].name
          .toLowerCase()
          .localeCompare(b.taskAssignedTo[0].name.toLowerCase()),
      render: (text, record) => {
        if (text !== undefined && text !== null && text.length > 0) {
          return (
            <>
              <p className="m-0 MontserratRegular  color-505050 FontArabicRegular text-nowrap ">
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img
                      draggable="false"
                      className="data-img"
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=""
                    />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img
                      draggable="false"
                      className="data-img"
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=""
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
      title: t("Due-date"),
      dataIndex: "deadlineDate",
      key: "deadlineDate",
      width: "200px",
      render: (text, record) => {
        return (
          <span className={styles["Action-Date-title"]}>
            {_justShowDateformatBilling(record.deadlineDateTime)}
          </span>
        );
      },
    },
    // {
    //   title: t("Assigned-to"),
    //   dataIndex: "taskAssignedTo",
    //   key: "taskAssignedTo",
    //   width: "200px",
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <span className={styles["Action-Date-title"]}>
    //           {record.taskAssignedTo[0].name}
    //         </span>
    //       </>
    //     );
    //   },
    // },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "220px",
      filters: [
        {
          text: t("In-progress"),
          value: "In Progress",
          // className: currentLanguage,
        },
        {
          text: t("Pending"),
          value: "Pending",
        },
        {
          text: t("Upcoming"),
          value: "Upcoming",
        },
        {
          text: t("Cancelled"),
          value: "Cancelled",
        },
        {
          text: t("Completed"),
          value: "Completed",
        },
      ],
      defaultFilteredValue: [
        "In Progress",
        "Pending",
        "Upcoming",
        "Cancelled",
        "Completed",
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) => {
        return record?.status?.status
          ?.toLowerCase()
          .includes(value.toLowerCase());
      },
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(userID)) {
          return (
            <>
              <Select
                defaultValue={text.status}
                bordered={false}
                dropdownClassName="Status-Todo"
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
                onChange={(e) => statusChangeHandler(e, record.pK_TID)}
              >
                {statusOptions.map((optValue, index) => {
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
                  ? "InProgress   color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 2
                  ? "Pending   color-5a5a5a text-center my-1"
                  : text.pK_TSID === 3
                  ? "Upcoming  color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 4
                  ? "Cancelled   color-5a5a5a text-center my-1"
                  : text.pK_TSID === 5
                  ? "Completed   color-5a5a5a  text-center my-1"
                  : null
              }
            >
              {text.status}
            </p>
          );
        }
      },

      filterMultiple: true,
    },
    // {
    //   title: t("Status"),
    //   dataIndex: "status",
    //   key: "status",
    //   width: "150px",
    //   render: (text, record) => (
    //     <>
    //       <span className={styles["Action-Date-title"]}>
    //         {record.status.status}
    //       </span>
    //     </>
    //   ),
    // },
    {
      dataIndex: "RedCrossIcon",
      key: "RedCrossIcon",
      width: "50px",
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(userID)) {
          return (
            <i>
              <img
                alt={"Cross"}
                src={del}
                className={styles["action-delete-cursor"]}
                onClick={() => deleteActionHandler(record)}
              />
            </i>
          );
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
        currentMeeting
      )
    );
  };

  useEffect(() => {
    try {
      if (
        actionMeetingReducer.todoListMeetingTask !== null &&
        actionMeetingReducer.todoListMeetingTask !== undefined &&
        actionMeetingReducer.todoListMeetingTask.toDoLists.length > 0
      ) {
        setTotalRecords(actionMeetingReducer.todoListMeetingTask.totalRecords);
        setActionsRows(actionMeetingReducer.todoListMeetingTask.toDoLists);
      } else {
        setActionsRows([]);
        setTotalRecords(0);
      }
    } catch {}
  }, [actionMeetingReducer.todoListMeetingTask]);

  useEffect(() => {
    try {
      if (toDoListReducer.createTaskMeeting !== null) {
        let taskData = toDoListReducer.createTaskMeeting;
        let taskInfo = toDoListReducer.createTaskMeeting.todoList;
        if (Number(taskData.meetingID) === Number(currentMeeting)) {
          let findisAlreadExist = actionsRows.findIndex(
            (data, index) => data.pK_TID === taskData.todoList.pK_TID
          );
          if (findisAlreadExist !== -1) {
            // setActionsRows((actionRows) => {
            //   actionRows.map((newData, index) => {
            //     if (newData.pK_TID === taskData.todoList.pK_TID) {
            //       return taskInfo;
            //     } else {
            //       return newData;
            //     }
            //   });
            // });
          } else {
            setActionsRows([...actionsRows, taskInfo]);
          }
        }
        dispatch(createTaskMeetingMQTT(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [toDoListReducer.createTaskMeeting]);
  const handleCreateTaskButton = () => {
    setCreateaTask(true);
    dispatch(showUnsavedActionsModal(false));
  };

  const handleCancelActions = () => {
    dispatch(showCancelActions(true));
  };

  // to close modal while user comes on Action tab
  useEffect(() => {
    dispatch(showCancelActions(false));
  }, []);

  // to move in next to polls handler
  const nextTabToPolls = () => {
    setactionsPage(false);
    setPolls(true);
    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(true));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };

  // To go on Previous tab
  const prevTabToMinutes = () => {
    // if (
    //   Number(editorRole.status) === 10 &&
    //   editorRole.role === "Agenda Contributor"
    // ) {
    //   setactionsPage(false);
    //   setMeetingMaterial(true);
    // } else {
    //   setactionsPage(false);
    //   setMinutes(true);
    // }
    setactionsPage(false);
    setMinutes(true);
  };

  return (
    <section>
      {createaTask ? (
        <CreateTask
          setCreateaTask={setCreateaTask}
          currentMeeting={currentMeeting}
          setActionState={setActionState}
          actionState={actionState}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : (
        <>
          <>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Create-task")}
                  className={styles["Create_Task_Button"]}
                  icon={<img draggable={false} src={addmore} alt="" />}
                  onClick={handleCreateTaskButton}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={12} md={12} sm={12}>
                {actionsRows.length === 0 ? (
                  <>
                    <Row className="mt-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <img
                          draggable={false}
                          src={EmptyStates}
                          width="306.27px"
                          height="230px"
                          alt=""
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <span className={styles["Empty-State_Heading"]}>
                          {t("Take-Task")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <span className={styles["EmptyState_SubHeading"]}>
                          {t("The-meeting-wrapped-up-lets-dive-into-some-task")}
                        </span>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <section className={styles["HeightDefined"]}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Table
                            column={ActionsColoumn}
                            scroll={{ y: "40vh", x: false }}
                            pagination={false}
                            className={"ToDo"}
                            rows={actionsRows}
                          />
                        </Col>
                      </Row>

                      {actionsRows.length > 0 && (
                        <Row className="">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={
                                  "pagination-groups-table d-flex justify-content-center"
                                }
                              >
                                <span className="PaginationStyle-TodoList">
                                  <CustomPagination
                                    onChange={handleForPagination}
                                    current={currentPage}
                                    showSizer={true}
                                    total={totalRecords}
                                    pageSizeOptionsValues={[
                                      "30",
                                      "50",
                                      "100",
                                      "200",
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
                )}
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["CloneMeetingButton"]}
                  onClick={handleCancelActions}
                />
                {/* <Button
                  text={t("Previous")}
                  className={styles["SaveButtonActions"]}
                  onClick={prevTabToMinutes}
                /> */}
                <Button
                  text={t("Next")}
                  className={styles["SaveButtonActions"]}
                  onClick={nextTabToPolls}
                />

                {((Number(editorRole.status) === 1 ||
                  Number(editorRole.status) === 10 ||
                  Number(editorRole.status) === 11 ||
                  Number(editorRole.status) === 12) &&
                  editorRole.role === "Organizer" &&
                  isEditMeeting === true) ||
                ((Number(editorRole.status) === 9 ||
                  Number(editorRole.status) === 10) &&
                  (editorRole.role === "Participant" ||
                    editorRole.role === "Agenda Contributor") &&
                  isEditMeeting === true) ? (
                  <></>
                ) : null}
              </Col>
            </Row>
          </>
        </>
      )}
      {viewTaskModal && (
        <ModalViewToDo
          viewFlagToDo={viewTaskModal}
          setViewFlagToDo={setViewTaskModal}
        />
      )}
      {NewMeetingreducer.removeTableModal && <RemoveTableModal />}
      {NewMeetingreducer.cancelActions && (
        <CancelActions
          setSceduleMeeting={setSceduleMeeting}
          currentMeeting={currentMeeting}
        />
      )}
    </section>
  );
};

export default Actions;
