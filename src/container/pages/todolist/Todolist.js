import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  ArrowCounterclockwise,
  ChevronDown,
  Plus,
} from "react-bootstrap-icons";
import { Select } from "antd";
import {
  Button,
  TableToDo,
  CustomDatePicker,
  TextField,
  Notification,
} from "../../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
import del from "../../../assets/images/del.png";
import { Search, ArrowRight, ArrowLeft } from "react-bootstrap-icons";
import {
  ViewToDoList,
  clearResponce,
  SearchTodoListApi,
  saveTaskDocumentsApi,
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";
import { Tooltip } from "antd";
import ModalToDoList from "../../todolistModal/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalUpdateToDo from "../../todolistupdateModal/ModalUpdateToDo";
import {
  cleareMessage,
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import Form from "react-bootstrap/Form";
import "./Todolist.css";
import { useTranslation } from "react-i18next";
import { clearResponseMessage } from "../../../store/actions/Get_List_Of_Assignees";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";

const TodoList = () => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const state = useSelector((state) => state);
  const { toDoListReducer, todoStatus, assignees, getTodosStatus } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpand, setExpand] = useState(false);
  const [rowsToDo, setRowToDo] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [statusValues, setStatusValues] = useState([]);
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
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  console.log(rowsToDo, "rowsToDorowsToDo");
  // GET TODOS STATUS
  useEffect(() => {
    try {
      if (!todoStatus.Response?.length > 0) {
        dispatch(getTodoStatus(navigate, t));
      }
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
        localStorage.setItem("todoListRow", 15);
        dispatch(SearchTodoListApi(navigate, searchData, 1, 15, t));
      }
      return () => {
        localStorage.removeItem("todoListPage");
        localStorage.removeItem("todoListRow");
      };
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  //get todolist reducer
  useEffect(() => {
    try {
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
            return parseInt(deadlineB, 10) - parseInt(deadlineA, 10);
          });

          setRowToDo(sortedTasks);
        } else {
          setRowToDo([]);
        }
      } else {
        setRowToDo([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [toDoListReducer.SearchTodolist]);

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
          setRowToDo(sortedTasks);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [toDoListReducer.SocketTodoActivityData]);

  useEffect(() => {
    try {
      if (toDoListReducer.socketTodoStatusData !== null) {
        let payloadData = toDoListReducer.socketTodoStatusData;
        if (Number(payloadData.todoStatusID) === 6) {
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

  // SET STATUS VALUES
  useEffect(() => {
    try {
      let optionsArr = [];
      let newOptionsFilter = [];
      let newArrStatus = [""];
      if (
        todoStatus.Response !== null &&
        todoStatus.Response !== "" &&
        todoStatus.Response.length > 0
      ) {
        todoStatus.Response.map((data, index) => {
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
    } catch (error) {
      console.log(error, "error");
    }
  }, [todoStatus]);

  // for modal create  handler
  const modalHandler = (e) => {
    setShow(true);
  };

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
    dispatch(ViewToDoList(navigate, Data, t, setViewFlagToDo));
  };

  const deleteTodolist = async (record) => {
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    dispatch(saveTaskDocumentsApi(navigate, NewData, t, 2, setShow, 6));
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
          title={text}
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
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      ellipsis: true,
      width: "220px",

      align: "center",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadlineDateTime) -
        utcConvertintoGMT(b.deadlineDateTime),

      render: (text, record) => {
        return (
          <span className="text-nowrap text-center">
            {newTimeFormaterAsPerUTCFullDate(record.deadlineDateTime)}
          </span>
        );
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
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) => {
        return record?.status?.status
          ?.toLowerCase()
          .includes(value.toLowerCase());
      },
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(createrID)) {
          return (
            <>
              <Select
                value={text.status}
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
        if (parseInt(record?.pK_UID) === parseInt(createrID)) {
          return (
            <Tooltip placement="topRight" title={t("Delete")}>
              <i
                className="meeting-editbutton cursor-pointer"
                onClick={(e) => deleteTodolist(index)}
              >
                <img draggable="false" src={del} alt="" />
              </i>
            </Tooltip>
          );
        } else {
          <></>;
        }
      },
    },
  ];

  useEffect(() => {
    try {
      setViewFlagToDo(false);
      if (Object.keys(toDoListReducer.ToDoDetails).length > 0) {
        if (modalsflag === true) {
          setUpdateFlagToDo(true);
          setModalsflag(false);
        } else {
        }
      }
    } catch (error) {
      console.log(error, "error");
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
      dispatch(SearchTodoListApi(navigate, newData, 1, 15, t));
    } else {
      // make notification for if input fields is empty here
      let newData = {
        Date: searchData.Date,
        Title: searchData.Title,
        AssignedToName: searchData.AssignedToName,
        UserID: parseInt(createrID),
      };
      dispatch(SearchTodoListApi(navigate, newData, 1, 15, t));
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
    localStorage.setItem("todoListRow", 15);

    dispatch(SearchTodoListApi(navigate, newData, 1, 15, t));
    setSearchData({
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(0),
    });
  };

  useEffect(() => {
    try {
      if (
        toDoListReducer.ResponseMessage !== "" &&
        toDoListReducer.ResponseMessage !== undefined &&
        toDoListReducer.ResponseMessage !== "" &&
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
        assignees.ResponseMessage !== "" &&
        assignees.ResponseMessage !== t("No-records-found") &&
        assignees.ResponseMessage !== t("The-meeting-has-been-cancelled")
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
    } catch (error) {
      console.log(error, "error");
    }
  }, [toDoListReducer.ResponseMessage, assignees.ResponseMessage]);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error, "error");
    }
  }, [getTodosStatus.UpdateTodoStatusMessage, removeTodo]);

  useEffect(() => {
    try {
      if (
        getTodosStatus.ResponseMessage !== "" &&
        getTodosStatus.ResponseMessage !== undefined &&
        getTodosStatus.ResponseMessage !== "" &&
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
        getTodosStatus.UpdateTodoStatusMessage !== "" &&
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
        getTodosStatus.UpdateTodoStatus !== "" &&
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
    } catch (error) {
      console.log(error, "error");
    }
  }, [
    getTodosStatus.ResponseMessage,
    getTodosStatus.UpdateTodoStatusMessage,
    getTodosStatus.UpdateTodoStatus,
  ]);

  const scroll = {
    y: "58vh",
    scrollbar: {
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
    },
  };

  return (
    <>
      <div className="todolistContainer">
        <Row className="d-flex justify-content-start align-items-center   mt-3">
          <Col md={2} sm={4} lg={2} className="todolist-heading-size">
            {t("Tasks")}
          </Col>

          <Col lg={2} md={2} sm={4} className="todolist-create-btn">
            <Button
              className={"btn btn-primary"}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              variant={"Primary"}
              text={t("Create-a-Task")}
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
                        labelclass="textFieldSearch"
                        change={searchHandler}
                      />
                      <TextField
                        width="250px"
                        name="Title"
                        value={searchData.Title}
                        // className="mx-4"
                        placeholder={t("Task")}
                        labelclass="textFieldSearch"
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
                        labelclass="textFieldSearch"
                        change={searchHandler}
                      />
                      <TextField
                        applyClass="form-control2"
                        width="180px"
                        name="AssignedToName"
                        value={searchData.AssignedToName}
                        className="mx-2"
                        placeholder={t("Assigned-to")}
                        labelclass="textFieldSearch"
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
        <section className="todolist_main_section">
          <Row>
            <Col>
              <TableToDo
                sortDirections={["descend", "ascend"]}
                column={columnsToDo}
                className={"ToDo"}
                rows={rowsToDo}
                scroll={scroll}
                locale={{
                  emptyText: (
                    <>
                      <section className="d-flex flex-column align-items-center justify-content-center ">
                        <img src={TodoMessageIcon1} width={"250px"} alt="" />
                        <span className="NotaskTodolist">{t("No-Task")}</span>
                      </section>
                    </>
                  ), // Set your custom empty text here
                }}
                pagination={false}
              />
            </Col>
          </Row>
          {/* <Row> */}

          {/* </Row> */}
          {/* </Col> */}
          {/* </Row> */}
          <Row>
            <Col>
              {rowsToDo.length > 0 && (
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
                            onChange={paginationChangeHandlerTodo}
                            current={
                              todoListCurrentPage !== null &&
                              todoListCurrentPage !== undefined
                                ? todoListCurrentPage
                                : 1
                            }
                            showSizer={true}
                            total={totalRecords}
                            pageSizeOptionsValues={["15", "30", "50", "100"]}
                            pageSize={
                              todoListPageSize !== null &&
                              todoListPageSize !== undefined
                                ? todoListPageSize
                                : 15
                            }
                          />
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </section>
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
    </>
  );
};
export default TodoList;
