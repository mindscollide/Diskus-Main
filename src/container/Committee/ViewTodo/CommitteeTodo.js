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
  deleteCommitteeTaskApi,
  saveTaskDocumentsApi,
} from "../../../store/actions/ToDoList_action";
import "antd/dist/antd.css";

import ModalToDoList from "./CreateTodo/ModalToDoList";
import ModalViewToDo from "../../todolistviewModal/ModalViewToDo";
import ModalUpdateToDo from "../../todolistupdateModal/ModalUpdateToDo";
import {
  cleareMessage,
  getTodoStatus,
  updateTodoStatusFunc,
} from "../../../store/actions/GetTodos";
import Form from "react-bootstrap/Form";
import moment from "moment";
import "../../pages/todolist/Todolist.css";
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
import {
  getTaskCommitteeIDApi,
  setTasksByCommitteeApi,
} from "../../../store/actions/Polls_actions";
import { deleteCommitteeTaskRM } from "../../../commen/apis/Api_config";

const CreateTodoCommittee = ({ committeeStatus }) => {
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
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  console.log("socketTodoStatusData", PollsReducer);

  // GET TODOS STATUS
  useEffect(() => {
    dispatch(getTodoStatus(navigate, t));

    if (ViewCommitteeID !== null) {
      let newData = {
        CommitteeID: Number(ViewCommitteeID),
      };
      dispatch(getTaskCommitteeIDApi(navigate, t, newData));
    }
  }, []);

  //get todolist reducer
  useEffect(() => {
    if (
      PollsReducer.getTodoCommitteeTask !== null &&
      PollsReducer.getTodoCommitteeTask !== undefined
    ) {
      // setTotalRecords(PollsReducer.SearchTodolist.totalRecords);
      if (PollsReducer.getTodoCommitteeTask.toDoLists.length > 0) {
        let dataToSort = [...PollsReducer.getTodoCommitteeTask.toDoLists];
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
  }, [PollsReducer.getTodoCommitteeTask]);

  useEffect(() => {
    try {
      if (toDoListReducer.createTaskCommittee !== null) {
        let taskData = toDoListReducer.createTaskCommittee;
        if (Number(taskData.comitteeID) === Number(ViewCommitteeID)) {
          setRowToDo([...rowsToDo, taskData.todoList]);
        }
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [toDoListReducer.createTaskCommittee]);

  // SET STATUS VALUES
  useEffect(() => {
    let optionsArr = [];
    let newOptionsFilter = [];
    if (todoStatus.Response !== null && todoStatus.Response !== "") {
      todoStatus.Response.forEach((data, index) => {
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
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    dispatch(saveTaskDocumentsApi(navigate, NewData, t, 6, setShow));
    // let data = {
    //   FK_TID: record.pK_TID,
    //   CommitteeID: Number(ViewCommitteeID),
    // };
    // dispatch(deleteCommitteeTaskApi(navigate, t, data));
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
            </>
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
    dispatch(updateTodoStatusFunc(navigate, e, statusdata, t, false, 1));
  };

  // const paginationChangeHandlerTodo = async (current, pageSize) => {
  //   localStorage.setItem("todoListPage", current);
  //   localStorage.setItem("todoListRow", pageSize);
  //   dispatch(SearchTodoListApi(navigate, searchData, current, pageSize, t));
  // };

  // // for search
  // const search = (e) => {
  //   e.preventDefault();
  //   if (
  //     searchData.Date === "" &&
  //     searchData.Title === "" &&
  //     searchData.AssignedToName === ""
  //   ) {
  //     let newData = {
  //       Date: "",
  //       Title: "",
  //       AssignedToName: "",
  //       UserID: parseInt(createrID),
  //     };
  //     dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
  //   } else {
  //     // make notification for if input fields is empty here
  //     let newData = {
  //       Date: searchData.Date,
  //       Title: searchData.Title,
  //       AssignedToName: searchData.AssignedToName,
  //       UserID: parseInt(createrID),
  //     };
  //     dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
  //     setSearchData({
  //       Date: "",
  //       Title: "",
  //       AssignedToName: "",
  //       UserID: parseInt(createrID),
  //     });
  //   }
  // };

  // const resetSearchBar = (e) => {
  //   e.preventDefault();
  //   let newData = {
  //     Date: "",
  //     Title: "",
  //     AssignedToName: "",
  //     UserID: parseInt(createrID),
  //   };
  //   localStorage.setItem("todoListPage", 1);
  //   dispatch(SearchTodoListApi(navigate, newData, 1, 50, t));
  //   setSearchData({
  //     Date: "",
  //     Title: "",
  //     AssignedToName: "",
  //     UserID: parseInt(0),
  //   });
  // };

  useEffect(() => {
    if (
      PollsReducer.ResponseMessage !== "" &&
      PollsReducer.ResponseMessage !== undefined &&
      PollsReducer.ResponseMessage !== t("Record-found") &&
      PollsReducer.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: PollsReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

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
                  // onChange={tableTodoChange}
                  pagination={false}
                  locale={{
                    emptyText: emptyText(), // Set your custom empty text here
                  }}
                />

                {/* {rowsToDo.length > 0 && (
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
                            "  d-flex justify-content-center"
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
                              pageSizeOptionsValues={["30", "50", "100", "200"]}
                              pageSize={
                                todoListPageSize !== null &&
                                todoListPageSize !== undefined
                                  ? todoListPageSize
                                  : 50
                              }
                            />
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )} */}
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
    </>
  );
};
export default CreateTodoCommittee;
