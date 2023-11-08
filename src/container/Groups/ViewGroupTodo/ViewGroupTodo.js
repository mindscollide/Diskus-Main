import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ArrowCounterclockwise,
  ChevronDown,
  Plus,
} from "react-bootstrap-icons";
import { Input, Pagination, Select } from "antd";
import {
  Button,
  TableToDo,
  ResultMessage,
  Paper,
  Loader,
  CustomDatePicker,
  TextField,
  Notification,
} from "../../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import UserImage from "../../../assets/images/user.png";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import del from "../../../assets/images/del.png";
import { Dropdown, Space, Typography } from "antd";
import {
  Paragraph,
  Search,
  ArrowRight,
  ArrowLeft,
} from "react-bootstrap-icons";
import {
  ViewToDoList,
  GetTodoListByUser,
  searchTodoListByUser,
  clearResponce,
  SearchTodoListApi,
  deleteGroupTaskApi,
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";

import ModalToDoList from "./CreateTodo/ModalToDoList";
import ModalViewToDo from "./ViewTodo/ModalViewToDo";
import ModalUpdateToDo from "../../todolistupdateModal/ModalUpdateToDo";
import {
  cleareMessage,
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import Form from "react-bootstrap/Form";
import moment from "moment";
import "./Todolist.css";
import { useTranslation } from "react-i18next";
import { clearResponseMessage } from "../../../store/actions/Get_List_Of_Assignees";
import { enGB, ar } from "date-fns/locale";
import { registerLocale } from "react-datepicker";
import {
  _justShowDateformat,
  newDateFormaterAsPerUTC,
  newTimeFormaterAsPerUTC,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import { getTasksByGroupIDApi } from "../../../store/actions/Polls_actions";
import { deleteGroupTaskRM } from "../../../commen/apis/Api_config";

const CreateTodoCommittee = () => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const state = useSelector((state) => state);
  const {
    toDoListReducer,
    todoStatus,
    assignees,
    getTodosStatus,
    socketTodoStatusData,
    PollsReducer,
    LanguageReducer,
    uploadReducer,
  } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpand, setExpand] = useState(false);
  const { Option } = Select;
  const [rowsToDo, setRowToDo] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);

  const [todoViewModal, setTodoViewModal] = useState(false);
  const [modalsflag, setModalsflag] = useState(false);
  const [removeTodo, setRemoveTodo] = useState(0);
  const [searchData, setSearchData] = useState({
    Date: "",
    Title: "",
    AssignedToName: "",
    UserID: 0,
  });
  let todoListCurrentPage = JSON.parse(localStorage.getItem("todoListPage"));
  let todoListPageSize = localStorage.getItem("todoListRow");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [tableFilterOptions, setTableFilterOptions] = useState([]);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let ViewGroupID = localStorage.getItem("ViewGroupID");

  console.log("socketTodoStatusData", socketTodoStatusData);

  // GET TODOS STATUS
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));
    if (ViewGroupID !== null) {
      let newData = {
        GroupID: Number(ViewGroupID),
      };
      dispatch(getTasksByGroupIDApi(navigate, t, newData));
    }
  }, []);

  //get todolist reducer
  useEffect(() => {
    if (
      PollsReducer.todoGetGroupTask !== null &&
      PollsReducer.todoGetGroupTask !== undefined
    ) {
      // setTotalRecords(toDoListReducer.SearchTodolist.totalRecords);
      if (PollsReducer.todoGetGroupTask.toDoLists.length > 0) {
        let dataToSort = [...PollsReducer.todoGetGroupTask.toDoLists];
        const sortedTasks = dataToSort.sort((taskA, taskB) => {
          const deadlineA = taskA?.deadlineDateTime;
          const deadlineB = taskB?.deadlineDateTime;

          // Compare the deadlineDateTime values as numbers for sorting
          return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
        });

        setRowToDo(sortedTasks);
      } else {
        setRowToDo([]);
      }
    } else {
      setRowToDo([]);
    }
  }, [PollsReducer.todoGetGroupTask]);

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
    let Data = {
      FK_TID: record.pK_TID,
      GroupID: ViewGroupID,
    };
    dispatch(deleteGroupTaskApi(navigate, t, Data));
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
      // align: "left",
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
      // width: "220px",
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
        return record.status.status.toLowerCase().includes(value.toLowerCase());
      },
      render: (text, record) => {
        if (Number(record.taskCreator.pK_UID) === Number(createrID)) {
          if (
            Number(
              record.taskAssignedTo[0].pK_UID ===
                Number(record.taskCreator.pK_UID)
            )
          ) {
            return (
              <Select
                defaultValue={text.status}
                bordered={false}
                dropdownClassName="Status-Todo"
                className={
                  text.pK_TSID === 1
                    ? "InProgress MontserratSemiBold custom-class "
                    : text.pK_TSID === 2
                    ? "Pending MontserratSemiBold custom-class "
                    : text.pK_TSID === 3
                    ? "Upcoming MontserratSemiBold custom-class "
                    : text.pK_TSID === 4
                    ? "Cancelled MontserratSemiBold custom-class "
                    : text.pK_TSID === 5
                    ? "Completed MontserratSemiBold custom-class "
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
            );
          } else {
            return (
              <p
                className={
                  text.pK_TSID === 1
                    ? "InProgress  MontserratSemiBold color-5a5a5a text-center  my-1"
                    : text.pK_TSID === 2
                    ? "Pending  MontserratSemiBold color-5a5a5a text-center my-1"
                    : text.pK_TSID === 3
                    ? "Upcoming MontserratSemiBold color-5a5a5a text-center  my-1"
                    : text.pK_TSID === 4
                    ? "Cancelled  MontserratSemiBold color-5a5a5a text-center my-1"
                    : text.pK_TSID === 5
                    ? "Completed  MontserratSemiBold color-5a5a5a  text-center my-1"
                    : null
                }
              >
                {text.status}
              </p>
            );
          }
        } else {
          return record.taskAssignedTo.map((newdata, index) => {
            if (Number(newdata.pK_UID) === Number(createrID)) {
              return (
                <Select
                  defaultValue={text.status}
                  // prefixCls="todo-status-select"
                  bordered={false}
                  dropdownClassName="Status-Todo"
                  className={
                    text.pK_TSID === 1
                      ? "InProgress MontserratSemiBold "
                      : text.pK_TSID === 2
                      ? "Pending MontserratSemiBold "
                      : text.pK_TSID === 3
                      ? "Upcoming MontserratSemiBold "
                      : text.pK_TSID === 4
                      ? "Cancelled MontserratSemiBold "
                      : text.pK_TSID === 5
                      ? "Completed MontserratSemiBold "
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
              );
            }
          });
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
        console.log(record, index, "recordrecordrecordrecordrecord");
        if (parseInt(record?.pK_UID) === parseInt(createrID)) {
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

  useEffect(() => {
    setViewFlagToDo(false);
    if (Object.keys(toDoListReducer.ToDoDetails).length > 0) {
      if (modalsflag === true) {
        setUpdateFlagToDo(true);
        setModalsflag(false);
      } else {
        console.log("setViewFlagToDosetViewFlagToDo");
        // setViewFlagToDo(true);
      }
    }
  }, [toDoListReducer.ToDoDetails]);

  // for search Date handler
  const searchHandlerDate = (e) => {
    setSearchData({
      ...searchData,
      Date: e.target.value,
      UserID: parseInt(createrID),
    });
  };

  // CHANGE HANDLER STATUS
  const statusChangeHandler = (e, statusdata) => {
    if (e === 6) {
      setRemoveTodo(statusdata);
    }
    dispatch(updateTodoStatusFunc(navigate, e, statusdata, t, false, 2));
  };

  useEffect(() => {
    if (
      toDoListReducer.ResponseMessage !== "" &&
      toDoListReducer.ResponseMessage !== undefined &&
      toDoListReducer.ResponseMessage !== t("Record-found") &&
      toDoListReducer.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: toDoListReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponce());
    } else if (
      assignees.ResponseMessage !== "" &&
      assignees.ResponseMessage !== t("Record-found") &&
      assignees.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: assignees.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponseMessage());
    } else {
      dispatch(clearResponce());
      dispatch(clearResponseMessage());
    }
  }, [toDoListReducer.ResponseMessage, assignees.ResponseMessage]);

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
      getTodosStatus.ResponseMessage !== t("Record-found") &&
      getTodosStatus.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: getTodosStatus.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      getTodosStatus.UpdateTodoStatusMessage !== "" &&
      getTodosStatus.UpdateTodoStatusMessage !== undefined &&
      getTodosStatus.UpdateTodoStatusMessage !== t("Record-found") &&
      getTodosStatus.UpdateTodoStatusMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: getTodosStatus.UpdateTodoStatusMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      getTodosStatus.UpdateTodoStatus !== "" &&
      getTodosStatus.UpdateTodoStatus !== undefined &&
      getTodosStatus.UpdateTodoStatus !== t("Record-found") &&
      getTodosStatus.UpdateTodoStatus !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: getTodosStatus.UpdateTodoStatus,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

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
            <Button
              text={t("Create-a-task")}
              onClick={modalHandler}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              className={"Create_TodoBtn_Button"}
            />
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
                  // onChange={tableTodoChange}
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
      {/* <Notification setOpen={setOpen} open={open.open} message={open.message} /> */}

      {/* {toDoListReducer.Loading ||
      todoStatus.Loading ||
      LanguageReducer.Loading ||
      uploadReducer.Loading ? (
        <Loader />
      ) : null} */}
    </>
  );
};
export default CreateTodoCommittee;
