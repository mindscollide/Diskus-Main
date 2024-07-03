import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import { _justShowDateformat } from "../../../commen/functions/date_formater";
import { useTranslation } from "react-i18next";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import noTask from "../../../assets/images/DashBoardTask.svg";

import { Button, Spin } from "antd";
import {
  CustomTableToDoDashboard,
  ResultMessage,
} from "../../../components/elements";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  SearchTodoListApi,
  ViewToDoList,
  getTodoListInit,
} from "../../../store/actions/ToDoList_action";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalToDoList from "../../todolistModal/ModalToDoList";
const Task = () => {
  const { t } = useTranslation();
  const { toDoListReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      render: (text, record) => (
        <span className="w-100 cursor-pointer">{text}</span>
      ),
      // render: (text) => <span className="fw-bold">{text}</span>,
    },
    {
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      width: "40%",
      className: "deadlineDashboard",

      render: (text, record) => {
        return (
          <span className="cursor-pointer">{_justShowDateformat(text)}</span>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "25%",
      className: "statusDashboard",
      render: (text, record) => {
        if (record.status.pK_TSID === 1) {
          return (
            <span className=" InProgress status_value text-truncate cursor-pointer">
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 2) {
          return (
            <span className=" Pending  status_value text-truncate cursor-pointer">
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 3) {
          return (
            <span className=" Upcoming  status_value text-truncate cursor-pointer">{text.status}</span>
          );
        } else if (record.status.pK_TSID === 4) {
          return (
            <span className=" Cancelled status_value text-truncate cursor-pointer">
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 5) {
          return (
            <span className=" Completed status_value text-truncate cursor-pointer">
              {text.status}
            </span>
          );
        } else if (record.status.pK_TSID === 6) {
          return (
            <span className=" color-F68732 status_value text-truncate cursor-pointer">
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
        {toDoListReducer.TableSpinner === true && getTodoID === 0 ? (
          <CustomTableToDoDashboard
            loading={{
              spinning: true,
              indicator: <Spin />,
            }}
            // prefClassName="DashboardTask"
            className={"dashboard-todo"}


            column={columnsToDo}
            rows={[]}
            labelTitle={<span className="task-title">{t("Tasks")}</span>}
            scroll={{ y: 600 }}
            pagination={false}
          />
        ) : rowsToDo.length > 0 &&
          rowsToDo !== undefined &&
          rowsToDo !== null ? (
          <CustomTableToDoDashboard
            column={columnsToDo}
            // prefClassName="DashboardTask"
            className={"dashboard-todo"}

            rows={rowsToDo}
            labelTitle={
              <>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-between"
                  >
                    <span className="task-title">{t("Tasks")}</span>
                    {rowsToDo.length === 15 && (
                      <span
                        className="cursor-pointer"
                        onClick={() => navigate("/DisKus/todolist")}
                      >
                        {t("View-more")}
                      </span>
                    )}
                  </Col>
                </Row>
              </>
            }
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  viewTodoModal(record.pK_TID);
                },
              };
            }}
            scroll={{ y: "68vh", x: "hidden" }}
            pagination={false}
            // onChange={handleChangeTodoTable}
          />
        ) : (
          <Paper>
            <span className="task-title">{t("Tasks")}</span>
            <ResultMessage
              icon={
                <img src={noTask} width={"100%"} alt="" draggable="false" />
              }
              title={<span className="MainTitleClass">{t("No-task")}</span>}
              subTitle={
                <span className="SubtitleTodoMessege">
                  {t("There-is-no-pending-task")}
                </span>
              }
              extra={[
                <Button
                  disableBtn={checkFeatureIDAvailability(14) ? false : true}
                  text={t("Create-new-task")}
                  className={"CreateNewTaskButton"}
                  onClick={handleOpenTodoListModal}
                />,
              ]}
              className="NoTask"
            />
          </Paper>
        )}
      </div>
      {todoViewModal ? (
        <ModalViewToDo
          viewFlagToDo={todoViewModal}
          setViewFlagToDo={setTodoViewModal}
        />
      ) : showTodo ? (
        <ModalToDoList show={showTodo} setShow={setShowTodo} />
      ) : null}
    </>
  );
};

export default Task;
