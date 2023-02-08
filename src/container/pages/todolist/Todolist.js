import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import { Select } from "antd";
import {
  Button,
  TableToDo,
  ResultMessage,
  Paper,
  Loader,
  CustomDatePicker,
  TextField,
} from "../../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import UserImage from "../../../assets/images/user.png";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";
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
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";
import ModalToDoList from "../../todolistModal/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalUpdateToDo from "../../todolistupdateModal/ModalUpdateToDo";
import {
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import Form from "react-bootstrap/Form";
import moment from "moment";
import "./Todolist.css";
import { useTranslation } from "react-i18next";

const TodoList = () => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  const state = useSelector((state) => state);
  const { toDoListReducer, todoStatus } = state;
  const dispatch = useDispatch();
  console.log("toDoListReducer", toDoListReducer);
  const [isExpand, setExpand] = useState(false);
  const { Option } = Select;
  const [rowsToDo, setRowToDo] = useState([]);
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
  const [statusOptions, setStatusOptions] = useState([]);
  console.log("statusOptionsstatusOptions", todoStatus);
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  console.log(
    "todoStatustodoStatustodoStatus",
    todoStatus.UpdateTodoStatusMessage
  );
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
    console.log(isExpand);
  };
  // for view modal  handler
  const viewModalHandler = (id) => {
    // setViewFlagToDo(true);
    let Data = { ToDoListID: id };
    console.log("viewModalHandler", Data);
    dispatch(ViewToDoList(Data));
  };

  //dispatch gettodolist api
  useEffect(() => {
    let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    console.log("datadata", data);
    dispatch(GetTodoListByUser(data));
  }, []);

  //get todolist reducer
  useEffect(() => {
    if (
      Object.keys(toDoListReducer.AllTodolistData).length > 0 &&
      toDoListReducer.AllTodolistData !== undefined
    ) {
      console.log(
        "todolistreducer.AllTodolistData",
        toDoListReducer,
        toDoListReducer.AllTodolistData
      );
      setRowToDo(toDoListReducer.AllTodolistData);
    } else {
      console.log(
        "todolistreducer.AllTodolistData",
        toDoListReducer.AllTodolistData
      );
      setRowToDo([]);
    }
  }, [toDoListReducer.AllTodolistData, todoStatus.Loading]);

  useEffect(() => {
    console.log("checkingthesocketdata is coming or not", rowsToDo);
    if (Object.keys(toDoListReducer.SocketTodoActivityData).length > 0) {
      rowsToDo.unshift(toDoListReducer.SocketTodoActivityData);
      setRowToDo([...rowsToDo]);
      console.log("checkingthesocketdata is coming or not", rowsToDo);
    } else {
      setRowToDo(toDoListReducer.AllTodolistData);
    }
  }, [toDoListReducer.SocketTodoActivityData]);
  // GET TODOS STATUS
  useEffect(() => {
    dispatch(getTodoStatus());
  }, []);
  // SET STATUS VALUES
  useEffect(() => {
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
    console.log("Various parameters", rowsToDo);
    let newArray = toDoListReducer.AllTodolistData.filter((data, index) => {
      // console.log("newArraynewArraynewArray", data.status, filters)
      return data.status.status === filters.status[0];
    });
    console.log("newArraynewArraynewArray", newArray);
    if (newArray.length > 0) {
      setRowToDo(newArray);
    } else {
      setRowToDo(toDoListReducer.AllTodolistData);
    }
  };
  console.log("rowsToDorowsToDo", rowsToDo);
  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.title.localeCompare(b.title.toLowerCase),
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
      title: t("Assigned-By-Title"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      sortDirections: ["descend", "ascend"],

      render: (record, index) => {
        console.log("recording", index);
        console.log("records", record);
        return <p className="m-0">{record.name}</p>;
      },
      sorter: (a, b) => {
        console.log("sorter", "a", a, "b", b);
        return a.taskCreator.name.localeCompare(b.taskCreator.name);
      },
    },
    {
      title: t("Search-Assigned-To-Name-Placeholder"),
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.taskAssignedTo[0].name.localeCompare(b.taskAssignedTo[0].name),
      render: (text, record) => {
        console.log("Text111", text);
        console.log("records assigned", record);
        if (text !== undefined && text !== null && text.length > 0) {
          return (
            <>
              <p className="m-0">
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img className="data-img" src={UserImage} alt="userimage" />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img className="data-img" src={UserImage} alt="userimage" />
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

      render: (text) => {
        return moment(text, "YYYYMMDDHHmmss").format("h:mm A, Do MMM, YYYY");
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: t("Completed-Title"),
          value: "Completed",
          className: currentLanguage,
        },
        {
          text: t("In-Progress-Title"),
          value: "In progress",
        },
        {
          text: t("On-Hold-Title"),
          value: "On hold",
        },
        {
          text: t("Pending-Title"),
          value: "Pending",
        },
        {
          text: t("Reopen-Title"),
          value: "Reopen",
        },
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      render: (text, record) => {
        return record.taskAssignedTo.map((newdata, index) => {
          if (newdata.pK_UID === parseInt(createrID)) {
            return (
              <Select
                defaultValue={text.status}
                bordered={false}
                dropdownClassName="Status-Todo"
                className={
                  text.pK_TSID === 1
                    ? "blue"
                    : text.pK_TSID === 2
                    ? "orange"
                    : text.pK_TSID === 3
                    ? "yellow"
                    : text.pK_TSID === 4
                    ? "gray"
                    : text.pK_TSID === 5
                    ? "green"
                    : null
                }
                onChange={(e) => statusChangeHandler(e, record.pK_TID)}
              >
                {statusOptions.map((optValue, index) => {
                  console.log("optValue", optValue);
                  return (
                    <Option key={optValue.id} value={optValue.id}>
                      {optValue.status}
                    </Option>
                  );
                })}
              </Select>
            );
          } else {
            return (
              <p
                className={
                  text.pK_TSID === 1
                    ? "blue m-0"
                    : text.pK_TSID === 2
                    ? "orange m-0"
                    : text.pK_TSID === 3
                    ? "yellow m-0"
                    : text.pK_TSID === 4
                    ? "gray m-0"
                    : text.pK_TSID === 5
                    ? "green m-0"
                    : null
                }
              >
                {text.status}
              </p>
            );
          }
        });
      },
      filterMultiple: false,
      // onFilter: (value, record) => console.log("texttexttexttext", record, value),
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      // ellipsis: true,
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
    dispatch(updateTodoStatusFunc(e, statusdata));
    let data = { UserID: parseInt(createrID), NumberOfRecords: 300 };
    dispatch(GetTodoListByUser(data));
    console.log("change Handler Value", e, data);
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
      dispatch(searchTodoListByUser(newData));
      setSearchData({
        ...searchData,
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(0),
      });
    } else {
      // make notification for if input fields is empty here
      dispatch(searchTodoListByUser(searchData));
      setSearchData({
        Date: "",
        Title: "",
        AssignedToName: "",
        UserID: parseInt(0),
      });
    }
  };

  return (
    <>
      <Container className="todolistContainer">
        <Row className="d-flex justify-content-start align-items-center margin-left-5 margin-bottom-20 mt-3">
          <Col md={2} sm={4} lg={2} className="todolist-heading-size">
            {/* To-Do List */}
            {t("Todo-List")}
          </Col>
          {/* <Col lg={1} md={1} sm={1}>
            <h1 className="heading fs-5 color-primary fw-600  mt-3">
              
            </h1>
          </Col> */}
          <Col lg={3} md={3} sm={4} className="todolist-create-btn">
            <Button
              className={"btn btn-primary"}
              variant={"Primary"}
              text={t("Create-Todo-List-Button")}
              onClick={modalHandler}
            />
          </Col>
          <Col md={7} lg={7} sm={4} className="p-0 todolist-search-row ">
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
                    <Form onSubmit={search} className="d-flex">
                      <TextField
                        width="180px"
                        name="AssignedToName"
                        value={searchData.AssignedToName}
                        className="mx-2"
                        placeholder={t("Search-Assigned-To-Name-Placeholder")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />
                      <TextField
                        width="250px"
                        name="Title"
                        value={searchData.Title}
                        className="mx-2"
                        placeholder={t("Task")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />

                      <CustomDatePicker
                        value={searchData.Date}
                        change={searchHandlerDate}
                      />
                      <Button
                        className="btn btn-primary meeting search"
                        variant={"Primary"}
                        text={<ArrowLeft />}
                        // onClick={search}
                      />
                    </Form>
                  </div>
                ) : (
                  <div className="expandableMenuSearch">
                    <Form onSubmit={search} className="d-flex">
                      <CustomDatePicker
                        value={searchData.Date}
                        change={searchHandlerDate}
                      />
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
                        placeholder={t("Search-Assigned-To-Name-Placeholder")}
                        labelClass="textFieldSearch"
                        change={searchHandler}
                      />
                      <Button
                        className="btn btn-primary meeting search"
                        variant={"Primary"}
                        text={<ArrowRight />}
                        // onClick={search}
                      />
                    </Form>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="mt-2">
            <Row className="row-scroll-todolist">
              <Col className="mt-2 margin-left-10">
                {rowsToDo.length > 0 &&
                rowsToDo !== undefined &&
                rowsToDo !== null ? (
                  <TableToDo
                    sortDirections={["descend", "ascend"]}
                    column={columnsToDo}
                    className={"ToDo" + " " + currentLanguage}
                    rows={rowsToDo}
                    onChange={tableTodoChange}
                    pagination={{
                      pageSize: 50,
                      showSizeChanger: true,
                      pageSizeOptions: ["100 ", "150", "200"],
                    }}
                  />
                ) : (
                  <Paper>
                    <ResultMessage
                      icon={
                        <img src={TodoMessageIcon1} height={130} width={190} />
                      }
                      title="NO TASK"
                      className="NoTaskTodo"
                      // title={t("Nothing-Todo-Heading")}
                      // subTitle={t("Enjoy-Or-Discuss-Heading")}
                      // extra={<Button text="+ Create New Meeting" />}
                    />
                  </Paper>
                )}
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
      </Container>

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
