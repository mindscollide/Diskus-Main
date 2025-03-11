import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
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
import "antd/dist/antd.min.css";
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
import { Select, Checkbox, Dropdown, Menu } from "antd";
import DescendIcon from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
const CreateTodoCommittee = ({ committeeStatus }) => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const state = useSelector((state) => state);
  const { todoStatus } = state;

  const toDoListReducersocketTodoStatusData = useSelector(
    (state) => state.toDoListReducer.socketTodoStatusData
  );

  const toDoListReducercreateTaskCommittee = useSelector(
    (state) => state.toDoListReducer.createTaskCommittee
  );

  const assigneesResponseMessage = useSelector(
    (state) => state.assignees.ResponseMessage
  );

  const getTodosStatusUpdateTodoStatusMessage = useSelector(
    (state) => state.getTodosStatus.UpdateTodoStatusMessage
  );

  const getTodosStatusResponseMessage = useSelector(
    (state) => state.getTodosStatus.ResponseMessage
  );

  const getTodosStatusUpdateTodoStatus = useSelector(
    (state) => state.getTodosStatus.UpdateTodoStatus
  );

  const PollsReducergetTodoCommitteeTask = useSelector(
    (state) => state.PollsReducer.getTodoCommitteeTask
  );

  const PollsReducerResponseMessage = useSelector(
    (state) => state.PollsReducer.ResponseMessage
  );

  const todoStatusResponse = useSelector((state) => state.todoStatus.Response);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rowsToDo, setRowToDo] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [show, setShow] = useState(false);
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [viewFlagToDo, setViewFlagToDo] = useState(false);
  const [todoViewModal, setTodoViewModal] = useState(false);
  const [removeTodo, setRemoveTodo] = useState(0);
  const [statusValues, setStatusValues] = useState([]);
  const [taskTitleSort, setTaskTitleSort] = useState(null);
  const [taskAssignedBySort, setTaskAssignedBySort] = useState(null);
  const [taskAssignedToSort, setTaskAssignedToSort] = useState(null);
  const [taskDeadlineSort, setDeadlineSort] = useState(null);
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
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

  // GET TODOS STATUS
  useEffect(() => {
    try {
      if (!todoStatusResponse?.length > 0) {
        dispatch(getTodoStatus(navigate, t));
      }

      if (ViewCommitteeID !== null) {
        let newData = {
          CommitteeID: Number(ViewCommitteeID),
        };
        dispatch(getTaskCommitteeIDApi(navigate, t, newData));
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  // Remove task from mqtt response
  useEffect(() => {
    try {
      if (toDoListReducersocketTodoStatusData !== null) {
        let payloadData = toDoListReducersocketTodoStatusData;
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
  }, [toDoListReducersocketTodoStatusData]);

  //get todolist reducer
  useEffect(() => {
    try {
      if (
        PollsReducergetTodoCommitteeTask !== null &&
        PollsReducergetTodoCommitteeTask !== undefined
      ) {
        if (PollsReducergetTodoCommitteeTask.toDoLists.length > 0) {
          let dataToSort = [...PollsReducergetTodoCommitteeTask.toDoLists];
          const sortedTasks = dataToSort.sort((taskA, taskB) => {
            const deadlineA = taskA?.deadlineDateTime;
            const deadlineB = taskB?.deadlineDateTime;

            // Compare the deadlineDateTime values as numbers for sorting
            return parseInt(deadlineB, 10) - parseInt(deadlineA, 10);
          });
          console.log(dataToSort, "dataToSortdataToSort");
          setRowToDo(sortedTasks);
          setOriginalData(sortedTasks);
        } else {
          setRowToDo([]);
          setOriginalData([]);
        }
      } else {
        setRowToDo([]);
        setOriginalData([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [PollsReducergetTodoCommitteeTask]);

  useEffect(() => {
    try {
      if (toDoListReducercreateTaskCommittee !== null) {
        let taskData = toDoListReducercreateTaskCommittee;
        if (Number(taskData.comitteeID) === Number(ViewCommitteeID)) {
          setRowToDo([...rowsToDo, taskData.todoList]);
        }
        dispatch(createTaskCommitteeMQTT(null));
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  }, [toDoListReducercreateTaskCommittee]);

  // SET STATUS VALUES
  useEffect(() => {
    try {
      let optionsArr = [];
      let newOptionsFilter = [];
      let newArrStatus = [""];

      if (
        todoStatusResponse !== null &&
        todoStatusResponse !== "" &&
        todoStatusResponse?.length > 0
      ) {
        todoStatusResponse.forEach((data, index) => {
          if (data.pK_TSID !== 3 && data.pK_TSID !== 6) {
            optionsArr.push({
              id: data.pK_TSID,
              status: data.status,
            });
            newArrStatus.push(data.status);

            newOptionsFilter.push({
              key: data.pK_TSID,
              label: data.status,
            });
          }
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

  // for view modal  handler
  const viewModalHandler = (id) => {
    let Data = { ToDoListID: id };
    dispatch(
      ViewToDoList(navigate, Data, t, setViewFlagToDo, setTodoViewModal)
    );
  };

  const deleteTodolist = async (record) => {
    console.log(record, "recordrecord");
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    dispatch(saveTaskDocumentsApi(navigate, NewData, t, 6, setShow));
  };

  //Filter table work
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);

  const filters = [
    {
      value: "1",
      text: t("In-progress"),
    },
    {
      value: "2",
      text: t("Pending"),
    },

    {
      value: "4",
      text: t("Cancelled"),
    },
    {
      value: "5",
      text: t("Completed"),
    },
  ];

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    const filteredData = originalData.filter((item) =>
      selectedValues.includes(item.status.pK_TSID.toString())
    );
    setRowToDo(filteredData);
    setVisible(false);
  };
  const resetFilter = () => {
    setSelectedValues(["1", "2", "3", "4", "5", "6"]);
    setRowToDo(originalData);
    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex gap-3 align-items-center justify-content-center'>
        <Button
          text={"Reset"}
          className='FilterResetBtn'
          onClick={resetFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedValues.length === 0}
          className='ResetOkBtn'
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const columnsToDo = [
    {
      title: (
        <>
          <span className='d-flex gap-2 align-items-center'>
            {t("Task")}
            {taskTitleSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "title",
      key: "title",
      width: "25%",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      taskDeadlineSort,
      onHeaderCell: () => ({
        onClick: () => {
          setTaskTitleSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => (
        <p
          className='todolist-title-col'
          title={text}
          onClick={(e) => viewModalHandler(record.pK_TID)}>
          {text}
        </p>
      ),
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 align-items-center'>
            {t("Assigned-by")}
            {taskAssignedBySort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "15%",
      sortDirections: ["descend", "ascend"],
      // align: "left",
      onHeaderCell: () => ({
        onClick: () => {
          setTaskAssignedBySort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) => {
        return (
          a?.taskCreator?.name
            .toLowerCase()
            .localeCompare(b?.taskCreator?.name?.toLowerCase()),
          taskAssignedBySort
        );
      },
      render: (record, index) => {
        return (
          <p className='m-0 MontserratRegular color-5a5a5a FontArabicRegular text-nowrap'>
            {" "}
            <img
              draggable='false'
              className='data-img'
              src={`data:image/jpeg;base64,${record?.displayProfilePictureName}`}
              alt=''
            />
            {record?.name}
          </p>
        );
      },
    },
    {
      title: (
        <>
          <span className='d-flex gap-2 align-items-center'>
            {t("Assigned-to")}{" "}
            {taskAssignedToSort === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      width: "15%",
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) =>
        a.taskAssignedTo[0].name
          .toLowerCase()
          .localeCompare(b.taskAssignedTo[0].name.toLowerCase()),
      taskAssignedToSort,
      onHeaderCell: () => ({
        onClick: () => {
          setTaskAssignedToSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        if (text !== undefined && text !== null && text.length > 0) {
          return (
            <>
              <p className='m-0 MontserratRegular text-center  color-505050 FontArabicRegular text-nowrap '>
                {" "}
                {currentLanguage === "ar" ? (
                  <>
                    <img
                      draggable='false'
                      className='data-img'
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=''
                    />

                    {text[0].name}
                  </>
                ) : (
                  <>
                    <img
                      draggable='false'
                      className='data-img'
                      src={`data:image/jpeg;base64,${text[0]?.displayProfilePictureName}`}
                      alt=''
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
      title: (
        <>
          <span className='d-flex gap-2 align-items-center justify-content-center'>
            {t("Deadline")}
            {taskDeadlineSort === "descend" ? (
              <img src={ArrowDownIcon} alt='' />
            ) : (
              <img src={ArrowUpIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      ellipsis: true,
      width: "25%",

      align: "center",
      sortDirections: ["descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => {
          setDeadlineSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) =>
        utcConvertintoGMT(a.deadlineDateTime) -
        utcConvertintoGMT(b.deadlineDateTime),

      render: (text, record) => {
        return (
          <span className='text-nowrap text-center'>
            {newTimeFormaterAsPerUTCFullDate(
              record.deadlineDateTime,
              currentLanguage
            )}
          </span>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        if (Number(record?.taskCreator?.pK_UID) === Number(createrID)) {
          return (
            <>
              <Select
                value={text.status}
                bordered={false}
                dropdownClassName='Status-Todo'
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
                onChange={(e) => statusChangeHandler(e, record.pK_TID)}>
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
              }>
              {text.status}
            </p>
          );
        }
      },

      filterMultiple: true,
    },
    {
      title: "",
      dataIndex: "",
      key: "taskCreator",
      width: "5%",
      render: (record, index) => {
        if (parseInt(record?.taskCreator?.pK_UID) === parseInt(createrID)) {
          return (
            <i
              className='meeting-editbutton cursor-pointer'
              title={t("Delete")}
              onClick={(e) => deleteTodolist(record)}>
              <img draggable='false' src={del} alt='' />
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
    try {
      if (
        PollsReducerResponseMessage !== "" &&
        PollsReducerResponseMessage !== undefined &&
        PollsReducerResponseMessage !== "" &&
        PollsReducerResponseMessage !== t("No-records-found")
      ) {
        showMessage(PollsReducerResponseMessage, "success", setOpen);
        dispatch(clearResponce());
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [PollsReducerResponseMessage, assigneesResponseMessage]);

  useEffect(() => {
    try {
      if (removeTodo !== 0) {
        if (
          getTodosStatusUpdateTodoStatusMessage ===
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
  }, [getTodosStatusUpdateTodoStatusMessage, removeTodo]);

  useEffect(() => {
    try {
      if (
        getTodosStatusResponseMessage !== "" &&
        getTodosStatusResponseMessage !== undefined &&
        getTodosStatusResponseMessage !== "" &&
        getTodosStatusResponseMessage !== t("No-records-found")
      ) {
        showMessage(getTodosStatusResponseMessage, "success", setOpen);
        dispatch(cleareMessage());
      } else if (
        getTodosStatusUpdateTodoStatusMessage !== "" &&
        getTodosStatusUpdateTodoStatusMessage !== undefined &&
        getTodosStatusUpdateTodoStatusMessage !== "" &&
        getTodosStatusUpdateTodoStatusMessage !== t("No-records-found")
      ) {
        showMessage(getTodosStatusUpdateTodoStatusMessage, "success", setOpen);
        dispatch(cleareMessage());
      } else if (
        getTodosStatusUpdateTodoStatus !== "" &&
        getTodosStatusUpdateTodoStatus !== undefined &&
        getTodosStatusUpdateTodoStatus !== "" &&
        getTodosStatusUpdateTodoStatus !== t("No-records-found")
      ) {
        showMessage(getTodosStatusUpdateTodoStatus, "success", setOpen);
        dispatch(cleareMessage());
      } else {
        dispatch(cleareMessage());
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [
    getTodosStatusResponseMessage,
    getTodosStatusUpdateTodoStatusMessage,
    getTodosStatusUpdateTodoStatus,
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
          className='d-flex flex-column align-items-center'>
          <img src={TodoMessageIcon1} alt='' />
          <span className='mt-4'> {t("No-Task")}</span>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <div className='todolistContainer_Committee'>
        <Row className='my-3'>
          <Col lg={12} md={12} sm={12} className='d-flex justify-content-end '>
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
            <Row className='row-scroll-todolist'>
              <Col className=''>
                <TableToDo
                  column={columnsToDo}
                  className={"Resolution_table"}
                  rows={rowsToDo}
                  scroll={scroll}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <>
                        <section className='d-flex flex-column align-items-center justify-content-center'>
                          <img src={TodoMessageIcon1} width={"250px"} alt='' />
                          <span className='NotaskTodolist'>{t("No-Task")}</span>
                        </section>
                      </>
                    ),
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
          className='toDoViewModal'
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
