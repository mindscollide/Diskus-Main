import React, { useRef, useState, useEffect } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import { DateObject } from "react-multi-date-picker";
import "./ModalToDoList.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import {
  TextField,
  Button,
  Modal,
  TimePickers,
  CustomDatePicker,
  Notification,
  InputSearchFilter,
  Loader,
  MultiDatePicker,
} from "./../../components/elements";
import userImage from "../../assets/images/user.png";
import {
  RemoveTimeDashes,
  TimeSendingFormat,
  DateSendingFormat,
  createConvert,
} from "./../../commen/functions/date_formater";
import CustomUpload from "./../../components/elements/upload/Upload";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  CreateToDoList,
  GetTodoListByUser,
  HideNotificationTodo,
} from "./../../store/actions/ToDoList_action";
import { useDispatch, useSelector } from "react-redux";
import TodoList from "../pages/todolist/Todolist";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ModalToDoList = ({ ModalTitle, setShow, show }) => {
  //For Localization
  const { t } = useTranslation();
  const [createTodoTime, setCreateTodoTime] = useState("");
  const [createTodoDate, setCreateTodoDate] = useState("");
  console.log(
    createTodoTime,
    createTodoDate,
    "createTodoDatecreateTodoDatecreateTodoDate"
  );
  const state = useSelector((state) => state);
  const { toDoListReducer } = state;
  //To Display Modal

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Notification State
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [toDoDate, setToDoDate] = useState("");

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  let currentLanguage = localStorage.getItem("i18nextLng");

  useEffect(() => {
    if (currentLanguage != undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

  //task Object
  const [task, setTask] = useState({
    PK_TID: 1,
    Title: "",
    Description: "",
    IsMainTask: true,
    DeadLineDate: "",
    DeadLineTime: "",
    CreationDateTime: "",
  });

  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);

  //task Asignees
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [taskAssigneeLength, setTaskAssigneeLength] = useState(false);

  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments.TasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
  };

  //To Set task Creater ID
  useEffect(() => {
    setTaskCreatorID(parseInt(createrID));
  }, []);

  //task Handler aka Input fields
  const taskHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    console.log("taskHandler", name, value);
    if (name === "Title") {
      console.log("Title", name, value);
      if (valueCheck.length > 199) {
        setOpen({
          flag: true,
          message: "Title Limit is 200",
        });
      } else {
        setOpen({
          flag: false,
          message: "",
        });
        setTask({
          ...task,
          [name]: valueCheck.trimStart(),
        });
      }
    } else if (name === "DeadLineDate") {
      console.log("DeadLineDate12", name, value);
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "DeadLineTime") {
      console.log("DeadLineDate", name, value);
      setTask({
        ...task,
        [name]: RemoveTimeDashes(value),
      });

      console.log("12123123", setCreateTodoTime(RemoveTimeDashes(value)));
    } else if (name === "Description") {
      if (valueCheck.length > 299) {
        setOpen({
          flag: true,
          message: "Description Limit is 300",
        });
      } else {
        setOpen({
          flag: false,
          message: "",
        });
        setTask({
          ...task,
          [name]: valueCheck.trimStart(),
        });
      }
      console.log("Description", name, value);
    }
    // if (name === "ToDoTime") {
    //   console.log("ToDoTime", name, value);
    //   setToDoTime(RemoveTimeDashes(value));
    // }
  };

  console.log("Object task", task);

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    if (Object.keys(tasksAttachments.TasksAttachments).length === 10) {
      console.log("uploadedFile");

      setTimeout(
        setOpen({
          flag: true,
          message: t("You-can-not-upload-more-then-10-files"),
        }),
        3000
      );
    } else {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      console.log("uploadedFile", uploadedFile.name, ext);
      let file = tasksAttachments.TasksAttachments;
      console.log("daatadaad", file);
      console.log(uploadedFile, "daatadaad");
      if (
        ext === "doc" ||
        ext === "docx" ||
        ext === "xls" ||
        ext === "xlsx" ||
        ext === "pdf" ||
        ext === "png" ||
        ext === "txt" ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "gif"
      ) {
        let data;
        let sizezero;
        let size;
        if (file.length > 0) {
          file.map((filename, index) => {
            console.log("uploadedFile", filename);
            if (filename.DisplayAttachmentName === uploadedFile.name) {
              console.log(
                "uploadedFile",
                filename.DisplayAttachmentName === uploadedFile.name
              );
              data = false;
            }
          });
          if (uploadedFile.size > 10485760) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (data === false) {
            setTimeout(
              setOpen({
                flag: true,
                message: t("File-already-exisit"),
              }),
              3000
            );
          } else if (size === false) {
            setTimeout(
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            setTimeout(
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            dispatch(FileUploadToDo(navigate, uploadedFile, t));
            file.push({
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
            });
            setTasksAttachments({ ["TasksAttachments"]: file });
          }
        } else {
          if (uploadedFile.size > 10485760) {
            size = false;
          } else if (uploadedFile.size === 0) {
            sizezero = false;
          }
          if (size === false) {
            setTimeout(
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-greater-then-zero"),
              }),
              3000
            );
          } else if (sizezero === false) {
            setTimeout(
              setOpen({
                flag: true,
                message: t("File-size-should-not-be-zero"),
              }),
              3000
            );
          } else {
            dispatch(FileUploadToDo(navigate, uploadedFile, t));
            file.push({
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
            });
            setTasksAttachments({ ["TasksAttachments"]: file });
          }
        }
      }
    }
  };

  //Get All Assignees API hit
  useEffect(() => {
    // dispatch(GetAllAssigneesToDoList(parseInt(createrID)));
    if (show) {
      dispatch(GetAllAssigneesToDoList(navigate, parseInt(createrID), t));
    } else {
      setShow(false);
      setTask({
        ...task,
        PK_TID: 1,
        Title: "",
        Description: "",
        IsMainTask: true,
        DeadLineDate: "",
        DeadLineTime: "",
        CreationDateTime: "",
      });
      setToDoDate("");
      setTaskAssignedTo([]);
      setTasksAttachments({ ["TasksAttachments"]: [] });
      setTaskAssignedName([]);
    }
  }, [show]);

  console.log("test");

  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    console.log("onSearch", taskAssignedName);
    if (taskAssignedName.length === 1) {
      setOpen({
        flag: true,
        message: "Only one assignee allow",
      });
      setTaskAssignedToInput("");
    } else {
      setTaskAssignedToInput(name);
      let temp = taskAssignedName;
      let temp2 = TaskAssignedTo;
      temp.push(name);
      temp2.push(id);
      setTaskAssignedTo(temp2);
      setTaskAssignedName(temp);
      setTaskAssignedToInput("");
    }
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value.trimStart());

    console.log("Input Value OnChange", e.target.value);
  };

  useEffect(() => {
    if (taskAssignedName.length > 1) {
      setOpen({
        flag: true,
        message: "Only one assignee allow",
      });
    } else {
      setTaskAssigneeLength(false);
    }
  }, [taskAssignedName.length]);

  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = toDoListReducer.AllAssigneesData;
    console.log("Input Value", allAssignees);
    if (
      allAssignees != undefined &&
      allAssignees != null &&
      allAssignees != NaN &&
      allAssignees != []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return (
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {console.log("itemitem", item)}
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  const toDoDateHandler = (date, format = "YYYYMMDD") => {
    let toDoDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let toDoDateSaveFormat = new DateObject(date).format("YYYYMMDD");
    setCreateTodoDate(toDoDateSaveFormat);
    setToDoDate(toDoDateValueFormat);
    setTask({
      ...task,
      DeadLineDate: toDoDateSaveFormat,
    });
  };

  //Save To-Do List Function
  const createToDoList = () => {
    let TasksAttachments = tasksAttachments.TasksAttachments;
    console.log("TasksAttachments", TasksAttachments);
    let finalDateTime = createConvert(createTodoDate + createTodoTime);

    let newDate = finalDateTime.slice(0, 8);
    let newTime = finalDateTime.slice(8, 14);
    console.log(finalDateTime, "DateTimeTodo");
    console.log(newDate, "DateTimeTodo");
    console.log(newTime, "DateTimeTodo");
    console.log(createTodoDate, "DateTimeTodo");
    console.log(createTodoTime, "DateTimeTodo");
    let Task = {
      PK_TID: task.PK_TID,
      Title: task.Title,
      Description: task.Description,
      IsMainTask: task.IsMainTask,
      DeadLineDate: newDate,
      DeadLineTime: newTime,
      CreationDateTime: "",
    };
    if (Task.DeadLineDate === "") {
      setOpen({
        ...open,
        flag: true,
        message: t("Date-missing"),
      });
    } else if (Task.DeadLineTime === "") {
      setOpen({
        ...open,
        flag: true,
        message: t("Time-missing"),
      });
    } else if (Task.Title === "") {
      setOpen({
        ...open,
        flag: true,
        message: t("Title-missing"),
      });
    } else if (Task.Description === "") {
      setOpen({
        ...open,
        flag: true,
        message: t("Description-missing"),
      });
    } else if (TaskAssignedTo.length === 0) {
      setOpen({
        ...open,
        flag: true,
        message: t("Please-add-assignees"),
      });
    }
    //  else if (tasksAttachments.TasksAttachments.length === 0) {
    //   setOpen({
    //     ...open,
    //     flag: true,
    //     message: "Please add attachment",
    //   });
    // }
    else {
      let Data = {
        Task,
        TaskCreatorID,
        TaskAssignedTo,
        TasksAttachments,
      };
      dispatch(CreateToDoList(navigate, Data, t));
      setShow(false);
      console.log("createToDoList", Data);
      setTask({
        ...task,
        PK_TID: 1,
        Title: "",
        Description: "",
        IsMainTask: true,
        DeadLineDate: "",
        DeadLineTime: "",
        CreationDateTime: "",
      });
      setCreateTodoDate("");
      setCreateTodoTime("");
      setTaskAssignedTo([]);
      setTasksAttachments({ ["TasksAttachments"]: [] });
      setTaskAssignedName([]);
      setToDoDate("");
    }
  };

  const handleDeleteAttendee = (data, index) => {
    TaskAssignedTo.splice(index, 1);
    taskAssignedName.splice(index, 1);
    setTaskAssignedName([...taskAssignedName]);
    setTaskAssignedTo([...TaskAssignedTo]);
  };

  useEffect(() => {}, [TaskAssignedTo, taskAssignedName]);
  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            setShow(false);
          }}
          show={show}
          setShow={setShow}
          className="modaldialogTodoCreate"
          modalBodyClassName="bodytodoCreateModal"
          modalFooterClassName="footertodoCreateModal"
          modalHeaderClassName="headertodoCreateModal"
          ButtonTitle={ModalTitle}
          size="md"
          // ModalTitle={"Modal Header"}
          ModalBody={
            <>
              <div>
                <Row>
                  <Col
                    lg={2}
                    md={2}
                    sm={3}
                    xs={12}
                    className="CreateMeetingTime"
                  >
                    <TimePickers
                      change={taskHandler}
                      name="DeadLineTime"
                      value={task.DeadLineTime}
                    />
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={2}
                    xs={12}
                    className="CreateMeetingDate text-center"
                  >
                    {/* <CustomDatePicker
                      change={taskHandler}
                      name="DeadLineDate"
                      value={task.DeadLineDate}
                    /> */}
                    <MultiDatePicker
                      onChange={toDoDateHandler}
                      name="DeadLineDate"
                      value={toDoDate}
                      calendar={calendarValue}
                      locale={localValue}
                      // newValue={createMeeting.MeetingDate}
                    />
                  </Col>
                  <Col
                    lg={7}
                    md={7}
                    sm={7}
                    xs={12}
                    className="todolist-modal-fields margin-top--20 d-flex  flex-column"
                  >
                    <InputSearchFilter
                      placeholder={t("Add-attendees")}
                      value={taskAssignedToInput}
                      filteredDataHandler={searchFilterHandler(
                        taskAssignedToInput
                      )}
                      applyClass="assigneeFindInCreateToDo"
                      disable={taskAssigneeLength}
                      change={onChangeSearch}
                    />
                    {taskAssignedName ? (
                      <>
                        {taskAssignedName.map((taskAssignedName, index) => (
                          <span>
                            <div className="dropdown-row-assignee dg-flex align-items-center flex-row">
                              <div className="d-flex align-items-center position-relative">
                                <img src={userImage} />
                                <p className="p-0 m-0">{taskAssignedName}</p>
                              </div>
                              <span className="todolist-remove-assignee-icon">
                                <img
                                  width={20}
                                  className="remove"
                                  height={20}
                                  src={deleteButtonCreateMeeting}
                                  onClick={() =>
                                    handleDeleteAttendee(
                                      taskAssignedName,
                                      index
                                    )
                                  }
                                />
                              </span>
                            </div>
                          </span>
                        ))}
                      </>
                    ) : null}
                  </Col>
                </Row>
                <Row className="my-0">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="todolist-modal-fields"
                  >
                    <TextField
                      change={taskHandler}
                      name="Title"
                      applyClass="createtodo-title"
                      type="text"
                      placeholder={t("Title")}
                      required
                      value={task.Title}
                      maxLength={200}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} xs={12} className="FontArabicRegular">
                    <TextField
                      change={taskHandler}
                      name="Description"
                      applyClass="createtodo-description"
                      type="text"
                      as={"textarea"}
                      rows="7"
                      placeholder={t("Description") + "*"}
                      maxLength={300}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="MontserratSemiBold-600 attachmentCon margin-left-15"
                  >
                    <label className="ArabicFontSemiBold">
                      {t("Attachement")}
                    </label>
                    <span className="custom-upload-input">
                      <CustomUpload
                        change={uploadFilesToDo}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        className="UploadFileButton"
                      />
                      <Row>
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className="todoModalCreateModal"
                        >
                          {tasksAttachments.TasksAttachments.length > 0
                            ? tasksAttachments.TasksAttachments.map(
                                (data, index) => {
                                  var ext =
                                    data.DisplayAttachmentName.split(".").pop();

                                  const first =
                                    data.DisplayAttachmentName.split(" ")[0];
                                  return (
                                    <Col
                                      sm={12}
                                      lg={2}
                                      md={2}
                                      className="modaltodolist-attachment-icon"
                                    >
                                      {ext === "doc" ? (
                                        <FileIcon
                                          extension={"docx"}
                                          size={78}
                                          type={"document"}
                                          labelColor={"rgba(44, 88, 152)"}
                                        />
                                      ) : ext === "docx" ? (
                                        <FileIcon
                                          extension={"docx"}
                                          size={78}
                                          type={"font"}
                                          labelColor={"rgba(44, 88, 152)"}
                                        />
                                      ) : ext === "xls" ? (
                                        <FileIcon
                                          extension={"xls"}
                                          type={"spreadsheet"}
                                          size={78}
                                          labelColor={"rgba(16, 121, 63)"}
                                        />
                                      ) : ext === "xlsx" ? (
                                        <FileIcon
                                          extension={"xls"}
                                          type={"spreadsheet"}
                                          size={78}
                                          labelColor={"rgba(16, 121, 63)"}
                                        />
                                      ) : ext === "pdf" ? (
                                        <FileIcon
                                          extension={"pdf"}
                                          size={78}
                                          {...defaultStyles.pdf}
                                        />
                                      ) : ext === "png" ? (
                                        <FileIcon
                                          extension={"png"}
                                          size={78}
                                          type={"image"}
                                          labelColor={"rgba(102, 102, 224)"}
                                        />
                                      ) : ext === "txt" ? (
                                        <FileIcon
                                          extension={"txt"}
                                          size={78}
                                          type={"document"}
                                          labelColor={"rgba(52, 120, 199)"}
                                        />
                                      ) : ext === "jpg" ? (
                                        <FileIcon
                                          extension={"jpg"}
                                          size={78}
                                          type={"image"}
                                          labelColor={"rgba(102, 102, 224)"}
                                        />
                                      ) : ext === "jpeg" ? (
                                        <FileIcon
                                          extension={"jpeg"}
                                          size={78}
                                          type={"image"}
                                          labelColor={"rgba(102, 102, 224)"}
                                        />
                                      ) : ext === "gif" ? (
                                        <FileIcon
                                          extension={"gif"}
                                          size={78}
                                          {...defaultStyles.gif}
                                        />
                                      ) : null}
                                      <span className="deleteBtn">
                                        <img
                                          src={deleteButtonCreateMeeting}
                                          width={15}
                                          height={15}
                                          onClick={() =>
                                            deleteFilefromAttachments(
                                              data,
                                              index
                                            )
                                          }
                                        />
                                      </span>
                                      <p className="modaltodolist-attachment-text">
                                        {first}
                                      </p>
                                    </Col>
                                  );
                                }
                              )
                            : null}
                        </Col>
                      </Row>
                    </span>
                  </Col>
                </Row>
              </div>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    onClick={createToDoList}
                    className={
                      "btn btn-primary px-4 fw-600 todocreate-createbtn ArabicFontSemiBold"
                    }
                    variant={"Primary"}
                    text={t("Create")}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalToDoList;
