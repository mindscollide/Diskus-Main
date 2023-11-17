import React, { useRef, useState, useEffect } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "./ModalToDoList.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../../../assets/images/cancel_meeting_icon.svg";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  TextField,
  Button,
  Modal,
  TimePickers,
  CustomDatePicker,
  Notification,
  InputSearchFilter,
  MultiDatePicker,
} from "../../../../components/elements";
import userImage from "../../../../assets/images/user.png";
import {
  RemoveTimeDashes,
  TimeSendingFormat,
  DateSendingFormat,
  createConvert,
} from "../../../../commen/functions/date_formater";
import CustomUpload from "../../../../components/elements/upload/Upload";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  CreateToDoList,
  GetTodoListByUser,
  HideNotificationTodo,
  saveTaskDocumentsAndAssigneesApi,
  uploadDocumentsTaskApi,
} from "../../../../store/actions/ToDoList_action";
import { useDispatch, useSelector } from "react-redux";
import { FileUploadToDo } from "../../../../store/actions/Upload_action";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TextFieldTime from "../../../../components/elements/input_field_time/Input_field";

const ModalToDoList = ({ ModalTitle, setShow, show }) => {
  //For Localization
  const { t } = useTranslation();
  const timePickerRef = useRef();
  const [fileSize, setFileSize] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [isCreateTodo, setIsCreateTodo] = useState(true);
  const [fileForSend, setFileForSend] = useState([]);
  const [createTodoTime, setCreateTodoTime] = useState("");
  const [createTodoDate, setCreateTodoDate] = useState("");
  const state = useSelector((state) => state);
  const { toDoListReducer, GroupsReducer } = state;
  const currentDate = new Date();
  const currentHours = currentDate.getHours().toString().padStart(2, "0");
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
  const getcurrentTime = `${currentHours}:${currentMinutes}`;
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
  const calendRef = useRef();

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  let currentLanguage = localStorage.getItem("i18nextLng");
  const [createTaskID, setCreateTaskID] = useState(0);

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
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
    timeforView: "",
  });
  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);

  //task Asignees
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  console.log(taskAssignedToInput, "taskAssignedToInputtaskAssignedToInput");
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  console.log("TaskAssignedToTaskAssignedTo", TaskAssignedTo);
  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [assignees, setAssignees] = useState([]);
  console.log(assignees, "assigneesassigneesassigneesassignees");
  const [taskAssigneeLength, setTaskAssigneeLength] = useState(false);
  const [taskAssigneeApiData, setTaskAssigneeApiData] = useState([]);

  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //To Set task Creater ID
  useEffect(() => {
    setTaskCreatorID(parseInt(createrID));
  }, []);

  //To Set task Creater ID
  useEffect(() => {
    let data = [...toDoListReducer.AllAssigneesData];
    if (
      data !== undefined &&
      data !== null &&
      data !== [] &&
      Object(data).length > 0
    ) {
      const filterData = data.filter(
        (obj) => parseInt(obj.pK_UID) !== parseInt(createrID)
      );
      setTaskAssigneeApiData(filterData);
    }
  }, [toDoListReducer.AllAssigneesData]);

  const deleteFilefromAttachments = (data, index) => {
    let fileSizefound = fileSize - data.fileSize;
    let fileForSendingIndex = fileForSend.findIndex(
      (newData, index) => newData.name === data.DisplayAttachmentName
    );
    setFileForSend(fileForSend);
    setFileSize(fileSizefound);
    fileForSend.splice(fileForSendingIndex, 1);
    let searchIndex = tasksAttachments.TasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments({
      ...tasksAttachments,
      ["TasksAttachments"]: searchIndex,
    });
  };

  //task Handler aka Input fields
  const taskHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    var valueCheck = value.replace(/^\s/g, "");
    if (name === "Title") {
      if (valueCheck.length > 199) {
        setOpen({
          flag: true,
          message: t("Title-limit-is-200"),
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
    } else if (name === "DeadLineTime") {
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "Description") {
      if (valueCheck.length > 299) {
        setOpen({
          flag: true,
          message: t("Description-limit-is-300"),
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
    }
  };

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    let fileSizeArr;
    if (Object.keys(tasksAttachments.TasksAttachments).length === 10) {
      setTimeout(
        setOpen({
          flag: true,
          message: t("You-can-not-upload-more-then-10-files"),
        }),
        3000
      );
    } else if (fileSize >= 104857600) {
      setTimeout(
        setOpen({
          open: true,
          message: t("You-can-not-upload-more-then-100MB-files"),
        }),
        3000
      );
    } else {
      const uploadFilePath = data.target.value;
      const uploadedFile = data.target.files[0];
      var ext = uploadedFile.name.split(".").pop();
      let file = tasksAttachments.TasksAttachments;
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
        ext === "gif" ||
        ext === "csv"
      ) {
        let data;
        let sizezero;
        let size;
        if (file.length > 0) {
          file.map((filename, index) => {
            if (filename.DisplayAttachmentName === uploadedFile.name) {
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
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            // dispatch(FileUploadToDo(navigate, uploadedFile, t));
            file.push({
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
              fileSize: uploadedFile.size,
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
            // dispatch(FileUploadToDo(navigate, uploadedFile, t));
            fileSizeArr = uploadedFile.size + fileSize;
            setFileForSend([...fileForSend, uploadedFile]);
            setFileSize(fileSizeArr);
            file.push({
              PK_TAID: 0,
              DisplayAttachmentName: uploadedFile.name,
              OriginalAttachmentName: uploadFilePath,
              CreationDateTime: "",
              FK_TID: 0,
              fileSize: uploadedFile.size,
            });
            setTasksAttachments({ ["TasksAttachments"]: file });
          }
        }
      }
    }
  };

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
      setTasksAttachments({ TasksAttachments: [] });
      setTaskAssignedName([]);
      setAssignees([]);
      setTaskAssignedToInput("");
    }
  }, [show]);

  //On Click Of Dropdown Value
  const onSearch = (name, id, users) => {
    if (taskAssignedName.length === 1) {
      setOpen({
        flag: true,
        message: t("Only-one-assignee-allow"),
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
      setAssignees([...assignees, users]);
    }
  };

  useEffect(() => {
    if (taskAssignedName.length > 1) {
      setOpen({
        flag: true,
        message: t("Only-one-assignee-allow"),
      });
    } else {
      setTaskAssigneeLength(false);
    }
  }, [taskAssignedName.length]);

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value.trimStart());
  };
  console.log(
    GroupsReducer?.getGroupByGroupIdResponse?.groupMembers,
    "getUserDetailsgetUserDetailsgetUserDetails"
  );
  //Drop Down Values
  const searchFilterHandler = (value) => {
    let getUserDetails = GroupsReducer?.getGroupByGroupIdResponse?.groupMembers;
    console.log(getUserDetails, "getUserDetailsgetUserDetailsgetUserDetails");

    if (
      getUserDetails !== undefined &&
      getUserDetails !== null &&
      getUserDetails.length > 0
    ) {
      return getUserDetails
        .filter((item) => {
          console.log(item, "getUserDetailsgetUserDetailsgetUserDetails");

          const searchTerm = value.toLowerCase();
          const assigneesName = item.userName.toLowerCase();
          console.log("Input Value in searchTerm", searchTerm);
          console.log("Input Value in assigneesName", assigneesName);

          return (
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.userName, item.pK_UID, item)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            <img
              src={`data:image/jpeg;base64,${item?.userProfilePicture?.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.userName}</p>
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
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };

  //Save To-Do List Function
  const createToDoList = async () => {
    let taskAssignedTO = [...TaskAssignedTo];
    if (taskAssignedTO.length === 0) {
      taskAssignedTO.push(Number(createrID));
      setTaskAssignedTo(taskAssignedTO);
    }
    let newDate = createTodoDate;
    let finalDateTime;
    if (createTodoDate !== "" && task.DeadLineTime !== "") {
      finalDateTime = createConvert(createTodoDate + task.DeadLineTime);
      newDate = finalDateTime.slice(0, 8);
    }

    let Task = {
      PK_TID: task.PK_TID,
      Title: task.Title,
      Description: task.Description,
      IsMainTask: task.IsMainTask,
      DeadLineDate: newDate,
      DeadLineTime: task.DeadLineTime,
      CreationDateTime: "",
    };
    if (finalDateTime === undefined) {
      if (Task.DeadLineTime === "" || Task.DeadLineTime === undefined) {
        setOpen({
          ...open,
          flag: true,
          message: t("Time-missing"),
        });
      } else if (Task.DeadLineDate === "" || Task.DeadLineDate === undefined) {
        setOpen({
          ...open,
          flag: true,
          message: t("Enter-date-must"),
        });
      }
    } else if (Task.Title === "") {
      setOpen({
        ...open,
        flag: true,
        message: t("Please-select-title-for-the-task"),
      });
    } else {
      let Data;
      if (TaskAssignedTo.length > 0) {
        Data = {
          Task,
          TaskCreatorID,
          TaskAssignedTo,
          // TasksAttachments,
        };
      } else {
        Data = {
          Task,
          TaskCreatorID,
          TaskAssignedTo: taskAssignedTO,
          // TasksAttachments,
        };
      }
      dispatch(CreateToDoList(navigate, Data, t, setCreateTaskID));
    }
  };
  const uploadTaskDocuments = async (folderID) => {
    let newfile = [];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsTaskApi(navigate, t, newData, folderID, newfile)
      );
    });
    // Wait for all promises to resolve
    await Promise.all(uploadPromises);
    let newAttachmentData = newfile.map((data, index) => {
      return {
        DisplayAttachmentName: data.DisplayAttachmentName,
        OriginalAttachmentName: data.pK_FileID.toString(),
        FK_TID: Number(createTaskID),
      };
    });

    let Data = {
      TaskCreatorID: TaskCreatorID,
      TaskAssignedTo:
        TaskAssignedTo.length > 0
          ? TaskAssignedTo.map((data, index) => data)
          : [TaskCreatorID],
      TaskID: Number(createTaskID),
      TasksAttachments: newAttachmentData,
    };
    await dispatch(
      saveTaskDocumentsAndAssigneesApi(navigate, Data, t, 3, setShow)
    );
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
    setTaskAssignedName([]);
    setToDoDate("");
    setAssignees([]);
    setFileForSend([]);
    setTasksAttachments({ TasksAttachments: [] });
  };

  useEffect(() => {
    if (toDoListReducer.todoDocumentsMapping !== 0) {
      uploadTaskDocuments(toDoListReducer.todoDocumentsMapping);
    }
  }, [toDoListReducer.todoDocumentsMapping]);

  const handleDeleteAttendee = (data, index) => {
    let newDataAssignees = [...assignees];
    newDataAssignees.splice(index, 1);
    let newDataTaskAssignedTo = [...TaskAssignedTo];
    newDataTaskAssignedTo.splice(index, 1);

    // TaskAssignedTo.splice(index, 1)
    // taskAssignedName.splice(index, 1)
    setAssignees(newDataAssignees);
    setTaskAssignedName([]);
    setTaskAssignedTo(newDataTaskAssignedTo);
  };

  // const createTodoTimeChangeHandler = (e) => {
  //   let getValue = e.target.value;
  //   setTask({
  //     ...task,
  //     DeadLineTime: getValue,
  //   });
  // };

  const handleTimeChange = (newTime) => {
    let newDate = new Date(newTime);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);
      console.log(hours, "Hours");
      console.log(minutes, "hourshours");
      console.log(seconds, "hourshours");
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;
      setTask({
        ...task,
        DeadLineTime: formattedTime,
        timeforView: newTime,
      });
    }
  };

  const handleFocusCreateTodo = () => {
    setTask({
      ...task,
      DeadLineTime: getcurrentTime,
    });
  };

  // const handleBlur = (event) => {
  //   // Access the selected value when the input field loses focus
  //   const selectedValue = event.target.value;
  //   console.log("Selected Value:", selectedValue);
  // };
  // const handleTimeSelect = () => {
  //   const inputElement = document.getElementById("timeInput");
  //   if (inputElement) {
  //     inputElement.blur();
  //   }
  // };
  function CustomInput({ onFocus, value, onChange }) {
    return (
      <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        className="input-with-icon"
      />
    );
  }

  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            setCloseConfirmationBox(true);
            setIsCreateTodo(false);
          }}
          show={show}
          setShow={setShow}
          className="modaldialogTodoCreate"
          modalBodyClassName={"bodytodoCreateModal"}
          modalFooterClassName="footertodoCreateModal"
          modalHeaderClassName="headertodoCreateModal"
          ButtonTitle={ModalTitle}
          // size={closeConfirmationBox ? null : "md"}
          // ModalTitle={"Modal Header"}
          ModalBody={
            isCreateTodo ? (
              <>
                <div>
                  <Row>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="CreateMeetingTime d-flex align-items-center gap-2 h-100"
                    >
                      {/* <TextFieldTime
                        type="time"
                        labelClass="d-none"
                        value={task.DeadLineTime}
                        change={createTodoTimeChangeHandler}
                        placeholder={"00:00"}
                        name="DeadLineTime"
                        applyClass={"createTodo_timePicker"}
                        inputRef={timePickerRef}
                        onClick={handleFocusCreateTodo}
                        id="timeInput"
                      /> */}

                      <DatePicker
                        arrowClassName="arrowClass"
                        value={task.timeforView}
                        containerClassName="containerClassTimePicker"
                        className="timePicker"
                        disableDayPicker
                        inputClass="inputTImeMeeting"
                        calendar={calendarValue}
                        locale={localValue}
                        format="HH:mm A"
                        selected={task.timeforView}
                        render={<CustomInput />}
                        plugins={[<TimePicker hideSeconds />]}
                        onChange={handleTimeChange}
                      />

                      <DatePicker
                        onChange={toDoDateHandler}
                        // inputClass="datepicker_input"
                        format={"DD/MM/YYYY"}
                        value={toDoDate}
                        minDate={moment().toDate()}
                        placeholder="DD/MM/YYYY"
                        render={
                          <InputIcon
                            placeholder="DD/MM/YYYY"
                            className="datepicker_input"
                          />
                        }
                        editable={false}
                        className="datePickerTodoCreate2"
                        // disabled={disabled}
                        // name={name}
                        onOpenPickNewDate={true}
                        inputMode=""
                        // value={value}
                        calendar={calendarValue}
                        locale={localValue}
                        ref={calendRef}
                      />
                      {/* <MultiDatePicker
                        onChange={toDoDateHandler}
                        name="DeadLineDate"
                        // value={toDoDate}
                        refProp={calendRef}
                        calendar={calendarValue}
                        locale={localValue}
                      /> */}
                    </Col>
                    {/* <Col
                      lg={3}
                      md={3}
                      sm={2}
                      xs={12}
                      className="CreateMeetingDate text-center"
                    >
                      
                    </Col> */}
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="todolist-modal-fields margin-top--20 d-flex  flex-column"
                    >
                      <InputSearchFilter
                        placeholder={t("Add-attendees") + "*"}
                        value={taskAssignedToInput}
                        filteredDataHandler={searchFilterHandler(
                          taskAssignedToInput
                        )}
                        applyClass="assigneeFindInCreateToDo"
                        disable={taskAssigneeLength}
                        change={onChangeSearch}
                      />
                    </Col>
                  </Row>
                  <Row className="create_todo_assignee d-flex justify-content-end">
                    {assignees ? (
                      <>
                        {assignees.map((taskAssignedName, index) => (
                          <Col sm={12} md={6} lg={6}>
                            <div className="dropdown-row-assignee w-100">
                              <div className="d-flex align-items-center gap-2 mt-1 position-relative">
                                <img
                                  draggable="false"
                                  alt=""
                                  src={`data:image/jpeg;base64,${taskAssignedName.userProfilePicture.displayProfilePictureName}`}
                                />
                                <p className=" m-0">
                                  {taskAssignedName.userName}
                                </p>
                              </div>
                              <span className="todolist-remove-assignee-icon">
                                <img
                                  draggable="false"
                                  width={20}
                                  className="remove"
                                  height={20}
                                  alt=""
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
                          </Col>
                        ))}
                      </>
                    ) : null}
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
                        placeholder={t("Title") + "*"}
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
                        placeholder={t("Description")}
                        maxLength={300}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="MontserratSemiBold-600 attachmentCon "
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
                                      data.DisplayAttachmentName.split(
                                        "."
                                      ).pop();

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
                                        ) : (
                                          <FileIcon
                                            extension={ext}
                                            size={78}
                                            {...defaultStyles.ext}
                                          />
                                        )}
                                        <span className="deleteBtn">
                                          <img
                                            draggable="false"
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
            ) : closeConfirmationBox ? (
              <>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={"Confirmationmodal_body_text"}
                  >
                    {t(
                      "Are-you-sure-if-you-click-on-close-button-the-data-will-reset-and-modal-will-close"
                    )}
                  </Col>
                </Row>
              </>
            ) : null
          }
          ModalFooter={
            isCreateTodo ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="d-flex justify-content-end gap-3 p-0"
                  >
                    <Button
                      onClick={() => {
                        setCloseConfirmationBox(true);
                        setIsCreateTodo(false);
                      }}
                      className={"cancelButton_createTodo"}
                      text={"Cancel"}
                    />
                    <Button
                      onClick={createToDoList}
                      className={"btn todocreate-createbtn ArabicFontSemiBold"}
                      variant={"Primary"}
                      text={t("Create")}
                    />
                  </Col>
                </Row>
              </>
            ) : closeConfirmationBox ? (
              <>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center gap-3"
                  >
                    <Button
                      onClick={() => setIsCreateTodo(true)}
                      className={"cancelButton_createTodo"}
                      text={"Cancel"}
                    />
                    <Button
                      onClick={() => {
                        setShow(false);
                        setIsCreateTodo(true);
                      }}
                      className={"todocreate-createbtn"}
                      text={"Close"}
                    />
                  </Col>
                </Row>
              </>
            ) : null
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalToDoList;
