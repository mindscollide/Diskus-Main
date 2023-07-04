import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowCounterclockwise, ChevronDown, Plus } from "react-bootstrap-icons";
import { Pagination, Select } from "antd";
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
  newDateFormaterAsPerUTC,
  newTimeFormaterAsPerUTC,
  newTimeFormaterAsPerUTCFullDate,
} from "../../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  registerLocale("ar", ar);
  registerLocale("en", enGB);
  const state = useSelector((state) => state);
  const {
    toDoListReducer,
    todoStatus,
    assignees,
    getTodosStatus,
    socketTodoStatusData,
  } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpand, setExpand] = useState(false);
  const { Option } = Select;
  const [rowsToDo, setRowToDo] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0)
  const [show, setShow] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [modalsflag, setModalsflag] = useState(false);
  const [searchData, setSearchData] = useState({
    Date: "",
    Title: "",
    AssignedToName: "",
    UserID: 0,
  });
  let todoListCurrentPage = JSON.parse(localStorage.getItem("todoListPage"))
  let todoListPageSize = JSON.parse(localStorage.getItem("todoListRow"))
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  // for modal create  handler
  const modalHandler = (e) => {
    setShow(true);
  };

  // for Socket Update meeting status update
  useEffect(() => {
    if (Object.keys(toDoListReducer.socketTodoStatusData).length > 0) {
      console.log(
        toDoListReducer.socketTodoStatusData,
        "MeetingStatusSocketMeetingStatusSocket"
      );
      console.log("rowsToDorowsToDo", rowsToDo);
      let tableRowsData = [...rowsToDo];
      console.log(tableRowsData, "tableRowsDatatableRowsData");
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_TID === toDoListReducer.socketTodoStatusData.todoid
      );
      if (foundIndex !== -1) {
        let newArr = tableRowsData.map((rowObj, index) => {
          if (index === foundIndex) {
            let statusID = toDoListReducer.socketTodoStatusData.todoStatusID;
            const newData = {
              ...rowObj,
              status: {
                pK_TSID: statusID,
                status:
                  statusID === 1
                    ? "InProgress"
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
        console.log("newArrnewArrnewArr", newArr);
        setRowToDo(newArr);
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
    console.log(isExpand);
  };
  // for view modal  handler
  const viewModalHandler = (id) => {
    // setViewFlagToDo(true);
    let Data = { ToDoListID: id };
    console.log("viewModalHandler", Data);
    dispatch(ViewToDoList(navigate, Data, t));
  };

  //dispatch gettodolist api
  useEffect(() => {

    if (todoListPageSize !== null && todoListCurrentPage !== null) {
      dispatch(SearchTodoListApi(navigate, searchData, t));
    } else {
      localStorage.setItem("todoListPage", 1)
      localStorage.setItem("todoListRow", 50)
      dispatch(SearchTodoListApi(navigate, searchData, t));
    }
    return () => {
      localStorage.removeItem("todoListPage");
      localStorage.removeItem("todoListRow")
    }
  }, []);

  //get todolist reducer
  useEffect(() => {
    if (toDoListReducer.SearchTodolist !== null && toDoListReducer.SearchTodolist !== undefined) {
      setTotalRecords(toDoListReducer.SearchTodolist.totalRecords)
      if (toDoListReducer.SearchTodolist.toDoLists.length > 0) {
        setRowToDo(toDoListReducer.SearchTodolist.toDoLists);
      } else {
        setRowToDo([])
      }
    }
  }, [toDoListReducer.SearchTodolist]);

  useEffect(() => {
    console.log("checkingthesocketdata is coming or not", rowsToDo);
    if (Object.keys(toDoListReducer.SocketTodoActivityData).length > 0) {
      // rowsToDo.unshift(toDoListReducer.SocketTodoActivityData);
      setRowToDo([toDoListReducer.SocketTodoActivityData, ...rowsToDo])
      // setRowToDo([...rowsToDo]);
      console.log("checkingthesocketdata is coming or not", rowsToDo);
    } else {
      setRowToDo(toDoListReducer.AllTodolistData);
    }
  }, [toDoListReducer.SocketTodoActivityData]);
  // GET TODOS STATUS
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));
  }, []);
  // SET STATUS VALUES
  useEffect(() => {
    console.log(todoStatus, "todoStatustodoStatustodoStatus");
    let optionsArr = [];
    if (todoStatus.Response !== null && todoStatus.Response !== "") {
      todoStatus.Response.map((data, index) => {
        return optionsArr.push({
          id: data.pK_TSID,
          status: data.status,
        });
      });
    }
    setStatusOptions([...optionsArr]);
  }, [todoStatus]);

  // for search Date handler
  const tableTodoChange = (pagination, filters, sorter) => {
    console.log("Various parameters", filters);
    console.log("Various parameters", filters.status);

    console.log("Various parameters", rowsToDo);
    let newArray = toDoListReducer.AllTodolistData.filter((data, index) => {
      // console.log("newArraynewArraynewArray", data.status, filters)
      return data.status.status === filters;
    });
    console.log("newArraynewArraynewArray", newArray);
    if (newArray.length > 0) {
      setRowToDo(newArray);
    } else {
      setRowToDo(toDoListReducer.AllTodolistData);
    }
  };
  const deleteTodolist = (record) => {
    console.log("deleteTodolist", record);
    dispatch(updateTodoStatusFunc(navigate, 6, record.pK_TID, t)).then((response) => {
      console.log(response, "updateTodoStatusFuncupdateTodoStatusFunc")
    });
    if (todoListPageSize !== null && todoListCurrentPage !== null) {
      dispatch(SearchTodoListApi(navigate, searchData, t));
    } else {
      localStorage.setItem("todoListPage", 1)
      localStorage.setItem("todoListRow", 50)
      dispatch(SearchTodoListApi(navigate, searchData, t));
    }
    // let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    // dispatch(GetTodoListByUser(navigate, data, t));
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
      // width: "220px",
      sortDirections: ["descend", "ascend"],
      // align: "left",
      render: (record, index) => {
        console.log("recording", index);
        console.log("records", record);
        return (
          <p className="m-0 MontserratRegular color-5a5a5a FontArabicRegular">
            {" "}
            <img className="data-img" src={UserImage} alt="userimage" />
            {record.name}
          </p>
        );
      },
      sorter: (a, b) => {
        console.log("sorter", "a", a, "b", b);
        return a.taskCreator.name
          .toLowerCase()
          .localeCompare(b.taskCreator.name.toLowerCase());
      },
    },
    {
      title: t("Assigned-to"),
      // width: "220px",
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.taskAssignedTo[0].name
          .toLowerCase()
          .localeCompare(b.taskAssignedTo[0].name.toLowerCase()),
      render: (text, record) => {
        console.log("Text111", text);
        console.log("records assigned", record);
        if (text !== undefined && text !== null && text.length > 0) {
          return (
            <>
              <p className="m-0 MontserratRegular color-505050 FontArabicRegular">
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img className="data-img" src={UserImage} alt="userimage" />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img
                      className="data-img "
                      src={UserImage}
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
    // {
    //   title: "",
    //   dataIndex: "attach",
    //   key: "attach",
    //   render: (text, attach) => {
    //     return <Paperclip className="paper-icon" />;
    //   },
    // },
    {
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      className: "deadLineTodo",
      align: "left",
      // width: "220px",
      render: (text, record) => {
        console.log("text1212", record);
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
          value: "InProgress",
          className: currentLanguage,
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
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) => {
        return (
          console.log(value, "filter222"),
          console.log(record, "filter222"),
          record.status.status.toLowerCase().includes(value.toLowerCase())
        );
      },
      render: (text, record) => {
        return record.taskAssignedTo.map((newdata, index) => {
          if (newdata.pK_UID === parseInt(createrID)) {
            console.log("text.pK_TSID", text.pK_TSID);
            return (
              <Select
                defaultValue={text.status}
                bordered={false}
                dropdownClassName="Status-Todo"
                className={
                  text.pK_TSID === 1
                    ? "InProgress MontserratSemiBold  margin-left-55"
                    : text.pK_TSID === 2
                      ? "Pending MontserratSemiBold margin-left-55"
                      : text.pK_TSID === 3
                        ? "Upcoming MontserratSemiBold margin-left-55"
                        : text.pK_TSID === 4
                          ? "Cancelled MontserratSemiBold margin-left-55"
                          : text.pK_TSID === 5
                            ? "Completed MontserratSemiBold margin-left-55"
                            : null
                }
                onChange={(e) => statusChangeHandler(e, record.pK_TID)}
              >
                {statusOptions.map((optValue, index) => {
                  console.log("optValue", optValue);
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
        });
      },
      filterMultiple: true,
    },
    {
      title: t("Delete"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "120px",
      render: (record, index) => {
        console.log("recording", index);
        console.log("recordsrecords", record);
        if (parseInt(record.pK_UID) === parseInt(createrID)) {
          return (
            <i
              className="meeting-editbutton"
              onClick={(e) => deleteTodolist(index)}
            >
              <img src={del} alt="" />
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
      console.log("ToDoDetails", toDoListReducer, toDoListReducer.ToDoDetails);
      if (modalsflag === true) {
        console.log(
          "ViewtoDoList12",
          toDoListReducer,
          toDoListReducer.ToDoDetails
        );
        setUpdateFlagToDo(true);
        setModalsflag(false);
      } else {
        setViewFlagToDo(true);
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
    console.log("searchData", searchData);
  };

  // CHANGE HANDLER STATUS
  const statusChangeHandler = (e, statusdata) => {
    console.log("stautschangehandler", "e", e, "statusdata", statusdata);
    dispatch(updateTodoStatusFunc(navigate, e, statusdata, t, false));
    // let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    // dispatch(GetTodoListByUser(data, t));
    // console.log("change Handler Value", e, data);
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
    // console.log("searchData", searchData);
  };

  const paginationChangeHandlerTodo = async (current, pageSize) => {
    console.log(current, pageSize, "paginationChangeHandlerTodo")
    localStorage.setItem("todoListPage", current)
    localStorage.setItem("todoListRow", pageSize)
    dispatch(SearchTodoListApi(navigate, searchData, t));
  }

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
      dispatch(SearchTodoListApi(navigate, newData, t));
      setSearchData({
        ...searchData,
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(0),
      });
    } else {
      // make notification for if input fields is empty here
      dispatch(SearchTodoListApi(navigate, searchData, t));
      setSearchData({
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(0),
      });
    }
  }
  const resetSearchBar = (e) => {
    e.preventDefault();
    let newData = {
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(createrID),
    };
    localStorage.setItem("todoListPage", 1);
    dispatch(SearchTodoListApi(navigate, newData, t));
    setSearchData({
      Date: "",
      Title: "",
      AssignedToName: "",
      UserID: parseInt(0),
    });
  }
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
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("Record-found") &&
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
    if (
      getTodosStatus.ResponseMessage != "" &&
      getTodosStatus.ResponseMessage != undefined &&
      getTodosStatus.ResponseMessage != t("Record-found") &&
      getTodosStatus.ResponseMessage != t("No-records-found")
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
      getTodosStatus.UpdateTodoStatusMessage != "" &&
      getTodosStatus.UpdateTodoStatusMessage != undefined &&
      getTodosStatus.UpdateTodoStatusMessage != t("Record-found") &&
      getTodosStatus.UpdateTodoStatusMessage != t("No-records-found")
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
      getTodosStatus.UpdateTodoStatus != "" &&
      getTodosStatus.UpdateTodoStatus != undefined &&
      getTodosStatus.UpdateTodoStatus != t("Record-found") &&
      getTodosStatus.UpdateTodoStatus != t("No-records-found")
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
      <Col className="todolistContainer">
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
                      <Button className="btn  btn-primary meeting search"
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
                      <Button className="btn  btn-primary meeting search"
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
                    className={"ToDo" + " " + currentLanguage}
                    rows={rowsToDo}
                    scroll={{ y: 400 }}
                    onChange={tableTodoChange}
                    pagination={false}
                  />
                ) : (
                  <Paper>
                    <ResultMessage
                      icon={<img src={TodoMessageIcon1} width={250} />}
                      title="NO TASK"
                      className="NoTaskTodo"
                    // title={t("Nothing-to-do")}
                    // subTitle={t("Enjoy-or-discuss-with-your-colleagues")}
                    // extra={<Button text="+ Create New Meeting" />}
                    />
                  </Paper>
                )}
                <section className="pagination-groups-table d-flex justify-content-center my-3">
                  <Pagination onChange={paginationChangeHandlerTodo} className="PaginationStyle-Meeting" current={todoListCurrentPage} total={totalRecords} pageSizeOptions={[30, 50, 100, 200]} pageSize={todoListPageSize} />
                </section>
              </Col>
            </Row>
          </Col>
        </Row>
        <ModalToDoList
          show={show}
          setShow={setShow}
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          className="toDoViewModal"
        />
        <ModalViewToDo
          viewFlagToDo={viewFlagToDo}
          setViewFlagToDo={setViewFlagToDo}
        />
        <ModalUpdateToDo
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          setModalsflag={setModalsflag}
        />
      </Col>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {toDoListReducer.Loading ? null : getTodosStatus.Loading ? (
        <Loader />
      ) : null}
      {/* {
      toDoListReducer.Loading ? (
        <Loader />
      ) : todoStatus.Loading ? (
        <Loader />
      ) : null
      } */}
    </>
  );
};
export default TodoList;
