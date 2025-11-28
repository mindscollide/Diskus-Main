import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import { _justShowDateformat } from "../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import noTask from "../../../assets/images/DashBoardTask.svg";
import { Button } from "../../../components/elements";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./newTable.css";
import { useDispatch } from "react-redux";
import {
  ViewToDoList,
  taskFromDashboardAction,
} from "../../../store/actions/ToDoList_action";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalToDoList from "../../todolistModal/ModalToDoList";
import { Table } from "antd";
const Task = () => {
  const { t } = useTranslation();
  const getDashboardTaskData = useSelector(
    (state) => state.toDoListReducer.getDashboardTaskData
  );
  const SocketTodoActivityData = useSelector(
    (state) => state.toDoListReducer.SocketTodoActivityData
  );
  const socketTodoStatusData = useSelector(
    (state) => state.toDoListReducer.socketTodoStatusData
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let creatorID = Number(localStorage.getItem("userID"));
  let locale = localStorage.getItem("i18nextLng") || "en";
  const [rowsToDo, setRowToDo] = useState([]);
  const [totalDataRecords, setTotalDataRecords] = useState(0);
  console.log(totalDataRecords, "totalDataRecordstotalDataRecords");
  const [getTodoID, setTodoID] = useState(0);
  const [todoViewModal, setTodoViewModal] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [showTodo, setShowTodo] = useState(false);

  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      width: "50%",
      className: "titleDashboard",
      ellipsis: true,
      align: locale === "en" ? "left" : "right",
      render: (text, record) => {
        const className =
          Number(record?.taskCreator?.pK_UID) === creatorID
            ? "titleDashboardToMe"
            : "titleDashboardByMe";
        return <span className={`${className} cursor-pointer`}>{text}</span>;
      },
    },
    {
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      width: "30%",
      className: "deadlineDashboard",
      ellipsis: true,
      align: "center",

      render: (text, record) => {
        return (
          <span className='cursor-pointer'>{_justShowDateformat(text)}</span>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "35%",
      align: "center",
      className: "statusDashboard",
      ellipsis: true,

      render: (text, record) => {
        if (record.status.pK_TSID === 1) {
          return (
            <span className=' InProgress status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        } else if (record.status.pK_TSID === 2) {
          return (
            <span className=' Pending  status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        } else if (record.status.pK_TSID === 3) {
          return (
            <span className=' Upcoming  status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        } else if (record.status.pK_TSID === 4) {
          return (
            <span className=' Cancelled status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        } else if (record.status.pK_TSID === 5) {
          return (
            <span className=' Completed status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        } else if (record.status.pK_TSID === 6) {
          return (
            <span className=' color-F68732 status_value text-truncate cursor-pointer'>
              {t(text.status)}
            </span>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (getDashboardTaskData) {
      const { toDoLists, totalRecords } = getDashboardTaskData;
      if (toDoLists?.length > 0) {
        setTotalDataRecords(totalRecords);
        let dataToSort = [...toDoLists];
        const sortedTasks = dataToSort.sort((taskA, taskB) => {
          const deadlineA = taskA?.deadlineDateTime;
          const deadlineB = taskB?.deadlineDateTime;

          // Compare the deadlineDateTime values as numbers for sorting
          return parseInt(deadlineB, 10) - parseInt(deadlineA, 10);
        });
        setRowToDo(sortedTasks.slice(0, 15));
      } else {
        setRowToDo([]);
      }
    } else {
      setRowToDo([]);
    }
  }, [getDashboardTaskData]);

  // Add Tasks from MQTT
  useEffect(() => {
    try {
      if (
        SocketTodoActivityData !== null &&
        SocketTodoActivityData !== undefined
      ) {
        if (
          SocketTodoActivityData.comitteeID === -1 &&
          SocketTodoActivityData.groupID === -1 &&
          SocketTodoActivityData.meetingID === -1
        ) {
          let dataToSort = [SocketTodoActivityData.todoList, ...rowsToDo];

          const sortedTasks = dataToSort.sort((taskA, taskB) => {
            const deadlineA = taskA?.deadlineDateTime;
            const deadlineB = taskB?.deadlineDateTime;

            // Compare the deadlineDateTime values as numbers for sorting
            return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
          });

          setRowToDo(sortedTasks.slice(0, 15));
        }
      }
    } catch (error) { }
  }, [SocketTodoActivityData]);

  // Update MQTT Status
  useEffect(() => {
    try {
      if (socketTodoStatusData !== null) {
        let payloadData = socketTodoStatusData;
        if (payloadData.todoStatusID === 6) {
          setRowToDo((rowsData) => {
            return rowsData.filter((newData, index) => {
              return newData.pK_TID !== payloadData.todoid;
            });
          });
        } else {
          setRowToDo((rowsData) => {
            return rowsData.map((newData) => {
              if (newData.pK_TID === payloadData.todoid) {
                const newObj = {
                  ...newData,
                  status: {
                    pK_TSID: payloadData.todoStatusID,
                    status:
                      payloadData.todoStatusID === 1
                        ? "In Progress"
                        : payloadData.todoStatusID === 2
                          ? "Pending"
                          : payloadData.todoStatusID === 3
                            ? "Upcoming"
                            : payloadData.todoStatusID === 4
                              ? "Cancelled"
                              : payloadData.todoStatusID === 5
                                ? "Completed"
                                : payloadData.todoStatusID === 6
                                  ? "Deleted"
                                  : payloadData.todoStatusID === 7,
                  },
                };
                return newObj;
              }
              return newData;
            });
          });
        }
      }
    } catch { }
  }, [socketTodoStatusData]);

  useEffect(() => {
    if (todoViewModal) {
      setTodoID(0);
      dispatch(taskFromDashboardAction(0));
    } else if (todoViewModal === false) {
      setTodoID(0);
      dispatch(taskFromDashboardAction(0));
    }
  }, [todoViewModal]);

  const viewTodoModal = (id) => {
    setTodoID(id);
    dispatch(taskFromDashboardAction(id));
    let Data = { ToDoListID: id };
    dispatch(
      ViewToDoList(navigate, Data, t, setViewFlagToDo, setTodoViewModal)
    );
  };

  const handleOpenTodoListModal = () => {
    setShowTodo(true);
  };
  return (
    <>
      <div>
        {rowsToDo.length > 0 && rowsToDo !== undefined && rowsToDo !== null ? (
          <>
            <span>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className='d-flex justify-content-between'>
                  <span className='task-title'>{t("Tasks")}</span>
                  {totalDataRecords >= 15 && (
                    <span
                      className='cursor-pointer'
                      onClick={() => navigate("/Diskus/todolist")}>
                      {t("View-more")}
                    </span>
                  )}
                </Col>
              </Row>
            </span>
            <Table
              columns={columnsToDo}
              dataSource={rowsToDo}
              className='newDashboardTable'
              tableLayout='fixed'
              pagination={false}
              size='small'
              rowKey='id'
              rowClassName={(record, index) => {
                if (Number(record?.taskCreator?.pK_UID) === creatorID) {
                  return "AssignedToMe";
                } else {
                  return "AssignedByMe";
                }
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    viewTodoModal(record.pK_TID);
                  },
                };
              }}
              scroll={{ y: 550 }}
            />
          </>
        ) : (
          <>
            <span className='task-title'>{t("Tasks")}</span>
            <section className={styles["No_Tasks_View"]}>
              <img src={noTask} width={"100%"} alt='' draggable='false' />
              <span className={styles["MainTitleClass"]}>{t("No-task")}</span>
              <span className={styles["SubtitleTodoMessege"]}>
                {t("There-is-no-pending-task")}
              </span>
              <Button
                disableBtn={checkFeatureIDAvailability(14) ? false : true}
                text={t("Create-new-task")}
                className={styles["CreateNewTaskButton"]}
                onClick={handleOpenTodoListModal}
              />
            </section>
          </>
        )}
      </div>
      {viewFlagToDo ? (
        <ModalViewToDo
          viewFlagToDo={viewFlagToDo}
          setViewFlagToDo={setViewFlagToDo}
        />
      ) : showTodo ? (
        <ModalToDoList show={showTodo} setShow={setShowTodo} />
      ) : null}
    </>
  );
};

export default Task;
