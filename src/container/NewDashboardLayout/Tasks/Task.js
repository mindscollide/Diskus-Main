import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import { _justShowDateformat } from "../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import noTask from "../../../assets/images/DashBoardTask.svg";

import { CustomTableToDoDashboard, Button } from "../../../components/elements";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./newTable.css";
import { useDispatch } from "react-redux";
import {
  SearchTodoListApi,
  ViewToDoList,
  getTodoListInit,
} from "../../../store/actions/ToDoList_action";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalToDoList from "../../todolistModal/ModalToDoList";
import { Table } from "antd";
const Task = () => {
  const { t } = useTranslation();
  const { toDoListReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let creatorID = Number(localStorage.getItem("userID"));
  const [rowsToDo, setRowToDo] = useState([]);
  const [getTodoID, setTodoID] = useState(0);
  const [todoViewModal, setTodoViewModal] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const callApiTask = async () => {
    if (checkFeatureIDAvailability(6)) {
      await dispatch(getTodoListInit());
      let searchData = {
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: 0,
      };
      await dispatch(SearchTodoListApi(navigate, searchData, 1, 50, t));
    }
  };
  useEffect(() => {
    callApiTask();
  }, []);

  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      width: "35%",
      className: "titleDashboard",
      ellipsis: true,
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
      width: "40%",
      className: "deadlineDashboard",
      ellipsis: true,

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
      width: "25%",
      className: "statusDashboard",
      ellipsis: true,

      render: (text, record) => {
        if (record.status.pK_TSID === 1) {
          return (
            <span className=' InProgress status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 2) {
          return (
            <span className=' Pending  status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 3) {
          return (
            <span className=' Upcoming  status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 4) {
          return (
            <span className=' Cancelled status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 5) {
          return (
            <span className=' Completed status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 6) {
          return (
            <span className=' color-F68732 status_value text-truncate cursor-pointer'>
              {text.status}
            </span>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (
      toDoListReducer.SearchTodolist !== null &&
      toDoListReducer.SearchTodolist !== undefined
    ) {
      if (toDoListReducer.SearchTodolist.toDoLists.length > 0) {
        let dataToSort = [...toDoListReducer.SearchTodolist.toDoLists];
        const sortedTasks = dataToSort.sort((taskA, taskB) => {
          const deadlineA = taskA?.deadlineDateTime;
          const deadlineB = taskB?.deadlineDateTime;

          // Compare the deadlineDateTime values as numbers for sorting
          return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
        });
        setRowToDo(sortedTasks.slice(0, 15));
      } else {
        setRowToDo([]);
      }
    } else {
      setRowToDo([]);
    }
  }, [toDoListReducer.SearchTodolist]);

  // Add Tasks from MQTT
  useEffect(() => {
    try {
      if (
        toDoListReducer.SocketTodoActivityData !== null &&
        toDoListReducer.SocketTodoActivityData !== undefined
      ) {
        if (
          toDoListReducer.SocketTodoActivityData.comitteeID === -1 &&
          toDoListReducer.SocketTodoActivityData.groupID === -1 &&
          toDoListReducer.SocketTodoActivityData.meetingID === -1
        ) {
          let dataToSort = [
            toDoListReducer.SocketTodoActivityData.todoList,
            ...rowsToDo,
          ];

          const sortedTasks = dataToSort.sort((taskA, taskB) => {
            const deadlineA = taskA?.deadlineDateTime;
            const deadlineB = taskB?.deadlineDateTime;

            // Compare the deadlineDateTime values as numbers for sorting
            return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
          });

          setRowToDo(sortedTasks.slice(0, 15));
        }
      }
    } catch (error) {}
  }, [toDoListReducer.SocketTodoActivityData]);

  // Update MQTT Status
  useEffect(() => {
    try {
      if (toDoListReducer.socketTodoStatusData !== null) {
        let payloadData = toDoListReducer.socketTodoStatusData;
        if (payloadData.todoStatusID === 6) {
          setRowToDo((rowsData) => {
            return rowsData.filter((newData, index) => {
              return newData.pK_TID !== payloadData.todoid;
            });
          });
        } else {
          setRowToDo((rowsData) => {
            return rowsData.map((newData, index) => {
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
    } catch {}
  }, [toDoListReducer.socketTodoStatusData]);

  useEffect(() => {
    if (todoViewModal) {
      setTodoID(0);
    } else if (todoViewModal === false) {
      setTodoID(0);
    }
  }, [todoViewModal]);

  const viewTodoModal = (id) => {
    setTodoID(id);
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
                  {rowsToDo.length === 15 && (
                    <span
                      className='cursor-pointer'
                      onClick={() => navigate("/DisKus/todolist")}>
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
                  console.log({ record, index }, "rowClassNamerowClassName");

                  return "AssignedToMe";
                } else {
                  console.log({ record, index }, "rowClassNamerowClassName");

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
