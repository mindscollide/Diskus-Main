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
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";

import ModalToDoList from "../../todolistModal/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
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

const TodoList = () => {
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
    LanguageReducer,
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

  console.log("socketTodoStatusData", socketTodoStatusData);

  // GET TODOS STATUS
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));
    if (todoListPageSize !== null && todoListCurrentPage !== null) {
      dispatch(
        SearchTodoListApi(
          navigate,
          searchData,
          todoListCurrentPage,
          todoListPageSize,
          t
        )
      );
    } else {
      localStorage.setItem("todoListPage", 1);
      localStorage.setItem("todoListRow", 50);
      dispatch(SearchTodoListApi(navigate, searchData, 1, 50, t));
    }
    return () => {
      localStorage.removeItem("todoListPage");
      localStorage.removeItem("todoListRow");
    };
  }, []);

  //get todolist reducer
  useEffect(() => {
    if (
      toDoListReducer.SearchTodolist !== null &&
      toDoListReducer.SearchTodolist !== undefined
    ) {
      setTotalRecords(toDoListReducer.SearchTodolist.totalRecords);
      if (toDoListReducer.SearchTodolist.toDoLists.length > 0) {
        let dataToSort = [...toDoListReducer.SearchTodolist.toDoLists];
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
  }, [toDoListReducer.SearchTodolist]);

  useEffect(() => {
    if (Object.keys(toDoListReducer.SocketTodoActivityData).length > 0) {
      setRowToDo([toDoListReducer.SocketTodoActivityData, ...rowsToDo]);
      let dataToSort = [toDoListReducer.SocketTodoActivityData, ...rowsToDo];
      const sortedTasks = dataToSort.sort((taskA, taskB) => {
        const deadlineA = taskA?.deadlineDateTime;
        const deadlineB = taskB?.deadlineDateTime;

        // Compare the deadlineDateTime values as numbers for sorting
        return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
      });
      setRowToDo(sortedTasks);
    } else {
      let dataToSort = [...rowsToDo];
      const sortedTasks = dataToSort.sort((taskA, taskB) => {
        const deadlineA = taskA?.deadlineDateTime;
        const deadlineB = taskB?.deadlineDateTime;

        // Compare the deadlineDateTime values as numbers for sorting
        return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
      });
      setRowToDo(sortedTasks);
    }
  }, [toDoListReducer.SocketTodoActivityData]);

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

  // for Socket Update meeting status update
  useEffect(() => {
    if (
      toDoListReducer.socketTodoStatusData &&
      Object.keys(toDoListReducer.socketTodoStatusData).length > 0
    ) {
      let tableRowsData = [...rowsToDo];
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_TID === toDoListReducer.socketTodoStatusData.todoid
      );
      if (foundIndex !== -1) {
        if (Number(toDoListReducer.socketTodoStatusData.todoStatusID) === 6) {
          let removeDeleteIndex = tableRowsData.filter(
            (data, index) =>
              data.pK_TID !== toDoListReducer.socketTodoStatusData.todoid
          );
          setRowToDo(removeDeleteIndex);
        } else {
          let newArr = tableRowsData.map((rowObj, index) => {
            if (index === foundIndex) {
              let statusID = toDoListReducer.socketTodoStatusData.todoStatusID;
              const newData = {
                ...rowObj,
                status: {
                  pK_TSID: statusID,
                  status:
                    statusID === 1
                      ? "In Progress"
                      : statusID === 2
                      ? "Pending"
                      : statusID === 3
                      ? "Upcoming"
                      : statusID === 4
                      ? "Cancelled"
                      : statusID === 5
                      ? "Completed"
                      : statusID === 6
                      ? "Deleted"
                      : null,
                },
              };
              return newData;
            }
            return rowObj;
          });
          setRowToDo(newArr);
        }
      }
    }
  }, [toDoListReducer.socketTodoStatusData]);

  const ShowHide = () => {
    setExpand(!isExpand);
    setSearchData({
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(0),
    });
  };

  // for view modal  handler
  const viewModalHandler = (id) => {
    let Data = { ToDoListID: id };
    dispatch(
      ViewToDoList(navigate, Data, t, setViewFlagToDo, setTodoViewModal)
    );
  };

  // for search Date handler
  const tableTodoChange = (pagination, filters, sorter) => {
    let newArrData = [];
    let todoStatus = filters.status;
    if (
      todoStatus !== null &&
      todoStatus !== undefined &&
      todoStatus.length > 0
    ) {
      todoStatus.map((statusValue, index) => {
        let newArr = toDoListReducer.SearchTodolist.toDoLists.filter(
          (data, index) => {
            return data.status.status === statusValue;
          }
        );
        if (newArr.length > 0) {
          setRowToDo(newArr);
        } else {
          setRowToDo([]);
        }
      });
    } else if (todoStatus === null) {
      setRowToDo(toDoListReducer.SearchTodolist.toDoLists);
    }
  };

  const deleteTodolist = async (record) => {
    await dispatch(updateTodoStatusFunc(navigate, 6, record.pK_TID, t, false));
    if (todoListPageSize !== null && todoListCurrentPage !== null) {
      dispatch(
        SearchTodoListApi(
          navigate,
          searchData,
          todoListCurrentPage,
          todoListPageSize,
          t
        )
      );
    } else {
      localStorage.setItem("todoListPage", 1);
      localStorage.setItem("todoListRow", 50);
      dispatch(SearchTodoListApi(navigate, searchData, 1, 50, t));
    }
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
      width: "180px",
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
        } else {
          return record.taskAssignedTo.map((newdata, index) => {
            if (Number(newdata.pK_UID) === Number(createrID)) {
              return (
                <Select
                  defaultValue={text.status}
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
              className="meeting-editbutton"
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
    dispatch(updateTodoStatusFunc(navigate, e, statusdata, t, false));
  };

  // for search handler
  const searchHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Title") {
      setSearchData({
        ...searchData,
        [name]: value.trimStart(),
        UserID: parseInt(createrID),
      });
    } else if (name === "AssignedToName") {
      setSearchData({
        ...searchData,
        [name]: value.trimStart(),
        UserID: parseInt(createrID),
      });
    }
  };

  const paginationChangeHandlerTodo = async (current, pageSize) => {
    localStorage.setItem("todoListPage", current);
    localStorage.setItem("todoListRow", pageSize);
    dispatch(SearchTodoListApi(navigate, searchData, current, pageSize, t));
  };

  // for search
  const search = (e) => {
    e.preventDefault();
    if (
      searchData.Date === "" &&
      searchData.Title === "" &&
      searchData.AssignedToName === ""
    ) {
      let newData = {
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(createrID),
      };
      dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
    } else {
      // make notification for if input fields is empty here
      let newData = {
        Date: searchData.Date,
        Title: searchData.Title,
        AssignedToName: searchData.AssignedToName,
        UserID: parseInt(createrID),
      };
      dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
      setSearchData({
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(createrID),
      });
    }
  };

  const resetSearchBar = (e) => {
    e.preventDefault();
    let newData = {
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(createrID),
    };
    localStorage.setItem("todoListPage", 1);
    dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
    setSearchData({
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(0),
    });
  };

  useEffect(() => {
    if (
      toDoListReducer.ResponseMessage != "" &&
      toDoListReducer.ResponseMessage != undefined &&
      toDoListReducer.ResponseMessage != t("Record-found") &&
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

  return (
    <>
      <div className="todolistContainer">
        <Row className="d-flex justify-content-start align-items-center   mt-3">
          <Col md={2} sm={4} lg={2} className="todolist-heading-size">
            {t("Todo-list")}
          </Col>

          <Col lg={2} md={2} sm={4} className="todolist-create-btn">
            <Button
              className={"btn btn-primary"}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              variant={"Primary"}
              text={t("Create-to-do-list")}
              onClick={modalHandler}
            />
          </Col>
          <Col
            md={8}
            lg={8}
            sm={4}
            className="todo-list-field todolist-search-row "
          >
            <Search
              width="24px"
              height="24px"
              className="search-Icon toExpandSearch Meeting"
              onClick={ShowHide}
            />
            {isExpand && (
              <>
                {currentLanguage === "ar" ? (
                  <div className="expandableMenuSearch">
                    <Form className="d-flex">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
                        />
                      )}
                      <TextField
                        width="180px"
                        name="AssignedToName"
                        value={searchData.AssignedToName}
                        className="mx-2 "
                        placeholder={t("Assigned-to")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />
                      <TextField
                        width="250px"
                        name="Title"
                        value={searchData.Title}
                        // className="mx-4"
                        placeholder={t("Task")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />

                      <Button
                        className="btn btn-primary meeting search me-3"
                        variant={"Primary"}
                        text={<ArrowLeft />}
                        type="submit"
                        onClick={search}
                      />
                      <Button
                        className="btn  btn-primary meeting search"
                        variant={"Primary"}
                        type="reset"
                        text={<ArrowCounterclockwise />}
                        onClick={resetSearchBar}
                      />
                    </Form>
                  </div>
                ) : (
                  <div className="expandableMenuSearch">
                    <Form className="d-flex">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
                        />
                      )}
                      <TextField
                        applyClass="form-control2"
                        width="250px"
                        name="Title"
                        value={searchData.Title}
                        className="mx-2"
                        placeholder={t("Task")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />
                      <TextField
                        applyClass="form-control2"
                        width="180px"
                        name="AssignedToName"
                        value={searchData.AssignedToName}
                        className="mx-2"
                        placeholder={t("Assigned-to")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />
                      <Button
                        className="btn btn-primary meeting search me-3"
                        variant={"Primary"}
                        text={<ArrowRight />}
                        onClick={search}
                      />
                      <Button
                        className="btn  btn-primary meeting search"
                        variant={"Primary"}
                        type="reset"
                        text={<ArrowCounterclockwise />}
                        onClick={resetSearchBar}
                      />
                    </Form>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="row-scroll-todolist">
              <Col className="">
                {rowsToDo.length > 0 &&
                rowsToDo !== undefined &&
                rowsToDo !== null ? (
                  <TableToDo
                    sortDirections={["descend", "ascend"]}
                    column={columnsToDo}
                    className={"ToDo"}
                    rows={rowsToDo}
                    scroll={{ y: "65vh", x: "scroll" }}
                    // onChange={tableTodoChange}
                    pagination={false}
                  />
                ) : (
                  <Paper>
                    <ResultMessage
                      icon={
                        <img
                          draggable="false"
                          src={TodoMessageIcon1}
                          width={250}
                        />
                      }
                      title="No-Task"
                      className="NoTaskTodo"
                    />
                  </Paper>
                )}
                {rowsToDo.length > 0 && (
                  <Row className="">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <Row className="PaginationStyle-Committee">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={"pagination-groups-table"}
                        >
                          <Pagination
                            onChange={paginationChangeHandlerTodo}
                            // className="PaginationStyle-Meeting"
                            current={
                              todoListCurrentPage !== null &&
                              todoListCurrentPage !== undefined
                                ? todoListCurrentPage
                                : 1
                            }
                            total={totalRecords}
                            locale={{
                              items_per_page: t("items_per_page"),
                              page: t("page"),
                            }}
                            showSizeChanger
                            pageSizeOptions={["30", "50", "100", "200"]}
                            pageSize={
                              todoListPageSize !== null &&
                              todoListPageSize !== undefined
                                ? todoListPageSize
                                : 50
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
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
      ) : updateFlagToDo ? (
        <ModalUpdateToDo
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          setModalsflag={setModalsflag}
        />
      ) : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {toDoListReducer.Loading ||
      todoStatus.Loading ||
      LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};
export default TodoList;
