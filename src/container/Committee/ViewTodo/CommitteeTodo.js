import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import { Select } from "antd";
import { Button, TableToDo } from "../../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import del from "../../../assets/images/del.png";
import {
  ViewToDoList,
  clearResponce,
  saveTaskDocumentsApi,
  createTaskCommitteeMQTT,
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";
import ModalToDoList from "./CreateTodo/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import {
  cleareMessage,
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import "../../pages/todolist/Todolist.css";
import { useTranslation } from "react-i18next";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import { getTaskCommitteeIDApi } from "../../../store/actions/Polls_actions";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const CreateTodoCommittee = ({ committeeStatus }) => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const state = useSelector((state) => state);
  const {
    toDoListReducer,
    todoStatus,
    assignees,
    getTodosStatus,
    PollsReducer,
  } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rowsToDo, setRowToDo] = useState([]);
  const [show, setShow] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [todoViewModal, setTodoViewModal] = useState(false);
  const [removeTodo, setRemoveTodo] = useState(0);
  const [statusValues, setStatusValues] = useState([]);

  const [searchData, setSearchData] = useState({
    Date: "",
    Title: "",
    AssignedToName: "",
    UserID: 0,
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [tableFilterOptions, setTableFilterOptions] = useState([]);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

  // GET TODOS STATUS
  useEffect(() => {
    if (!todoStatus.Response?.length > 0) {
      dispatch(getTodoStatus(navigate, t));
    }

    if (ViewCommitteeID !== null) {
      let newData = {
        CommitteeID: Number(ViewCommitteeID),
      };
      dispatch(getTaskCommitteeIDApi(navigate, t, newData));
    }
  }, []);

  // Remove task from mqtt response
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
  }, [toDoListReducer.socketTodoStatusData]);

  //get todolist reducer
  useEffect(() => {
    if (
      PollsReducer.getTodoCommitteeTask !== null &&
      PollsReducer.getTodoCommitteeTask !== undefined
    ) {
      if (PollsReducer.getTodoCommitteeTask.toDoLists.length > 0) {
        let dataToSort = [...PollsReducer.getTodoCommitteeTask.toDoLists];
        const sortedTasks = dataToSort.sort((taskA, taskB) => {
          const deadlineA = taskA?.deadlineDateTime;
          const deadlineB = taskB?.deadlineDateTime;

          return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
        });

        setRowToDo(sortedTasks);
      } else {
        setRowToDo([]);
      }
    } else {
      setRowToDo([]);
    }
  }, [PollsReducer.getTodoCommitteeTask]);

  useEffect(() => {
    try {
      if (toDoListReducer.createTaskCommittee !== null) {
        let taskData = toDoListReducer.createTaskCommittee;
        if (Number(taskData.comitteeID) === Number(ViewCommitteeID)) {
          setRowToDo([...rowsToDo, taskData.todoList]);
        }
        dispatch(createTaskCommitteeMQTT(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [toDoListReducer.createTaskCommittee]);

  // SET STATUS VALUES
  useEffect(() => {
    let optionsArr = [];
    let newOptionsFilter = [];
    let newArrStatus = [""];

    if (
      todoStatus.Response !== null &&
      todoStatus.Response !== "" &&
      todoStatus.Response?.length > 0
    ) {
      todoStatus.Response.forEach((data, index) => {
        optionsArr.push({
          id: data.pK_TSID,
          status: data.status,
        });
        newArrStatus.push(data.status);

        newOptionsFilter.push({
          key: data.pK_TSID,
          label: data.status,
        });
      });
    }
    setStatusValues(newArrStatus);

    setStatusOptions(optionsArr);
    setTableFilterOptions(newOptionsFilter);
  }, [todoStatus]);

  // for modal create  handler
  const modalHandler = (e) => {
    setShow(true);
  };

  // for view modal  handler
  const viewModalHandler = (id) => {
    let Data = { ToDoListID: id };
    dispatch(
      ViewToDoList(navigate, Data, t, setViewFlagToDo, setTodoViewModal)
    );
  };

  const deleteTodolist = async (record) => {
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    dispatch(saveTaskDocumentsApi(navigate, NewData, t, 6, setShow));
  };

  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      width: "260px",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      render: (text, record) => (
        <p
          className="todolist-title-col"
          onClick={(e) => viewModalHandler(record.pK_TID)}
        >
          {text}
        </p>
      ),
    },
    {
      title: t("Assigned-by"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "220px",
      sortDirections: ["descend", "ascend"],
      render: (record, index) => {
        return (
          <p className="m-0 MontserratRegular color-5a5a5a FontArabicRegular">
            {" "}
            <img
              draggable="false"
              className="data-img"
              src={`data:image/jpeg;base64,${record.displayProfilePictureName}`}
              alt="userimage"
            />
            {record?.name}
          </p>
        );
      },
      sorter: (a, b) => {
        return a?.taskCreator?.name
          .toLowerCase()
          .localeCompare(b?.taskCreator?.name.toLowerCase());
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
              <p className="m-0 MontserratRegular color-505050 FontArabicRegular">
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img
                      draggable="false"
                      className="data-img"
                      src={`data:image/jpeg;base64,${text[0].displayProfilePictureName}`}
                      alt="userimage"
                    />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img
                      draggable="false"
                      className="data-img"
                      src={`data:image/jpeg;base64,${text[0].displayProfilePictureName}`}
                      alt="userimage"
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
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      className: "deadLineTodo",
      width: "220px",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadlineDateTime) -
        utcConvertintoGMT(b.deadlineDateTime),
      render: (text, record) => {
        return newTimeFormaterAsPerUTCFullDate(record.deadlineDateTime);
      },
    },
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
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) => {
        return record.status.status.toLowerCase().includes(value.toLowerCase());
      },
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(createrID)) {
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
                  ? "InProgress custom-class   color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 2
                  ? "Pending  custom-class color-5a5a5a text-center my-1"
                  : text.pK_TSID === 3
                  ? "Upcoming custom-class color-5a5a5a text-center  my-1"
                  : text.pK_TSID === 4
                  ? "Cancelled custom-class   color-5a5a5a text-center my-1"
                  : text.pK_TSID === 5
                  ? "Completed custom-class  color-5a5a5a  text-center my-1"
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
    {
      title: t("Delete"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "120px",
      render: (record, index) => {
        if (
          parseInt(record?.pK_UID) === parseInt(createrID) &&
          committeeStatus === 3
        ) {
          return (
            <i
              className="meeting-editbutton cursor-pointer"
              onClick={(e) => deleteTodolist(index)}
            >
              <img draggable="false" src={del} alt="" />
            </i>
          );
        } else {
          <></>;
        }
      },
    },
  ];

  // CHANGE HANDLER STATUS
  const statusChangeHandler = (e, statusdata) => {
    if (e === 6) {
      setRemoveTodo(statusdata);
    }
    dispatch(updateTodoStatusFunc(navigate, e, statusdata, t, false, 1));
  };

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== undefined &&
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== t("No-records-found")
    ) {
      showMessage(PollsReducer.ResponseMessage, "success", setOpen);
      dispatch(clearResponce());
    }
  }, [PollsReducer.ResponseMessage, assignees.ResponseMessage]);

  useEffect(() => {
    if (removeTodo !== 0) {
      if (
        getTodosStatus.UpdateTodoStatusMessage ===
        t("The-record-has-been-updated-successfully")
      ) {
        let copyData = [...rowsToDo];
        let removeDeleteTodo = copyData.filter(
          (todoData, index) => todoData.pK_TID !== removeTodo
        );
        setRowToDo(removeDeleteTodo);
        setRemoveTodo(0);
      }
    }
  }, [getTodosStatus.UpdateTodoStatusMessage, removeTodo]);

  useEffect(() => {
    if (
      getTodosStatus.ResponseMessage !== "" &&
      getTodosStatus.ResponseMessage !== undefined &&
      getTodosStatus.ResponseMessage !== "" &&
      getTodosStatus.ResponseMessage !== t("No-records-found")
    ) {
      showMessage(getTodosStatus.ResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      getTodosStatus.UpdateTodoStatusMessage !== "" &&
      getTodosStatus.UpdateTodoStatusMessage !== undefined &&
      getTodosStatus.UpdateTodoStatusMessage !== "" &&
      getTodosStatus.UpdateTodoStatusMessage !== t("No-records-found")
    ) {
      showMessage(getTodosStatus.UpdateTodoStatusMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      getTodosStatus.UpdateTodoStatus !== "" &&
      getTodosStatus.UpdateTodoStatus !== undefined &&
      getTodosStatus.UpdateTodoStatus !== "" &&
      getTodosStatus.UpdateTodoStatus !== t("No-records-found")
    ) {
      showMessage(getTodosStatus.UpdateTodoStatus, "success", setOpen);
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    getTodosStatus.ResponseMessage,
    getTodosStatus.UpdateTodoStatusMessage,
    getTodosStatus.UpdateTodoStatus,
  ]);

  const scroll = {
    y: "64vh",
    scrollbar: {
      // You can adjust the width and distance as needed
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
      // Other scrollbar options
    },
  };
  const emptyText = () => {
    return (
      <Row>
        <Col
          sm={12}
          md={12}
          lg={12}
          className="d-flex flex-column align-items-center"
        >
          <img src={TodoMessageIcon1} alt="" />
          <span className="mt-4"> {t("No-Task")}</span>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <div className="todolistContainer_Committee">
        <Row className="my-3">
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-end ">
            {committeeStatus === 3 && (
              <Button
                text={t("Create-a-Task")}
                onClick={modalHandler}
                icon={<Plus width={20} height={20} fontWeight={800} />}
                className={"Create_TodoBtn_Button"}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="row-scroll-todolist">
              <Col className="">
                <TableToDo
                  sortDirections={["descend", "ascend"]}
                  column={columnsToDo}
                  className={"ToDo"}
                  rows={rowsToDo}
                  scroll={scroll}
                  pagination={false}
                  locale={{
                    emptyText: emptyText(), // Set your custom empty text here
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {show ? (
        <ModalToDoList
          show={show}
          setShow={setShow}
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          className="toDoViewModal"
        />
      ) : viewFlagToDo ? (
        <ModalViewToDo
          viewFlagToDo={viewFlagToDo}
          setViewFlagToDo={setViewFlagToDo}
        />
      ) : null}
    </>
  );
};
export default CreateTodoCommittee;
