import React, { useRef, useState, useEffect } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "./ModalToDoList.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import Select from "react-select";
import deleteButtonCreateMeeting from "../../../../assets/images/cancel_meeting_icon.svg";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  TextField,
  Button,
  Modal,
  Notification,
  InputSearchFilter,
  AttachmentViewer,
} from "../../../../components/elements";
import {
  createConvert,
  get_CurrentDateTime,
} from "../../../../commen/functions/date_formater";
import CustomUpload from "../../../../components/elements/upload/Upload";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  CreateToDoList,
  saveTaskDocumentsAndAssigneesApi,
  uploadDocumentsTaskApi,
  saveFilesTaskApi,
} from "../../../../store/actions/ToDoList_action";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const ModalToDoList = ({ ModalTitle, setShow, show }) => {
  //For Localization
  const { t } = useTranslation();
  const timePickerRef = useRef();
  const { currentTime, current_Date, dateObject, current_value } =
    get_CurrentDateTime();
  const [fileSize, setFileSize] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [isCreateTodo, setIsCreateTodo] = useState(true);
  const [fileForSend, setFileForSend] = useState([]);
  const [createTodoTime, setCreateTodoTime] = useState("");
  const [createTodoDate, setCreateTodoDate] = useState(current_Date);

  const state = useSelector((state) => state);

  const { toDoListReducer, GroupsReducer } = state;

  //To Display Modal

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Notification State
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [toDoDate, setToDoDate] = useState(current_value);

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
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
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

  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);

  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [assignees, setAssignees] = useState([]);

  const [taskAssigneeLength, setTaskAssigneeLength] = useState(false);
  const [taskAssigneeApiData, setTaskAssigneeApiData] = useState([]);

  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  const [allPresenters, setAllPresenters] = useState([]);

  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  //To Set task Creater ID
  useEffect(() => {
    try {
      setTask({
        ...task,
        DeadLineDate: current_Date,
        DeadLineTime: currentTime,
        CreationDateTime: "",
        timeforView: dateObject,
      });
      setCreateTodoDate(current_Date);
      setToDoDate(current_value);
      setTaskCreatorID(parseInt(createrID));

      return () => {
        setCloseConfirmationBox(false);
        setIsCreateTodo(true);
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
        setTaskAssignedTo([]);
        setTaskAssignedName([]);
        setToDoDate("");
        setAssignees([]);
        setFileForSend([]);
        setTasksAttachments({ TasksAttachments: [] });
      };
    } catch {}
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
        showMessage(t("Title-limit-is-200"), "error", setOpen);
      } else {
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
      if (valueCheck.length > 2000) {
        showMessage(t("Description-limit-is-2000"), "error", setOpen);
      } else {
        setTask({
          ...task,
          [name]: valueCheck.trimStart(),
        });
      }
    }
  };

  //Upload File Handler
  const uploadFilesToDo = (data) => {
    console.log(data, "uploadFilesToDouploadFilesToDo");
    let filesArray = Object.values(data.target.files);
    let fileSizeArr = fileSize;
    let flag = false;
    let sizezero = true;
    let size = true;

    if (tasksAttachments.TasksAttachments.length > 9) {
      showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
      return;
    }
    filesArray.forEach((fileData, index) => {
      if (fileData.size > 10485760) {
        size = false;
      } else if (fileData.size === 0) {
        sizezero = false;
      }

      let fileExists = tasksAttachments.TasksAttachments.some(
        (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
      );

      if (!size) {
        showMessage(
          t("File-size-should-not-be-greater-then-zero"),
          "error",
          setOpen
        );
      } else if (!sizezero) {
        showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
      } else if (fileExists) {
        showMessage(t("File-already-exists"), "error", setOpen);
      } else {
        let file = {
          DisplayAttachmentName: fileData.name,
          OriginalAttachmentName: fileData.name,
          fileSize: fileData.size,
        };
        setTasksAttachments((prevAttachments) => ({
          ...prevAttachments,
          TasksAttachments: [...prevAttachments.TasksAttachments, file],
        }));

        fileSizeArr += fileData.size;
        setFileForSend((prevFiles) => [...prevFiles, fileData]);
        setFileSize(fileSizeArr);
      }
      // Update previousFileList to current fileList
      previousFileList = filesArray;
    });
  };

  let previousFileList = [];

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
      showMessage(t("Only-one-assignee-allow"), "error", setOpen);
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
      showMessage(t("Only-one-assignee-allow"), "error", setOpen);
    } else {
      setTaskAssigneeLength(false);
    }
  }, [taskAssignedName.length]);

  //To Set task Creater ID
  useEffect(() => {
    try {
      if (
        GroupsReducer.getGroupByGroupIdResponse !== null &&
        GroupsReducer.getGroupByGroupIdResponse !== undefined
      ) {
        let getUserDetails =
          GroupsReducer.getGroupByGroupIdResponse.groupMembers;
        let PresenterData = [];
        getUserDetails.forEach((user, index) => {
          PresenterData.push({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-2 align-items-center"
                  >
                    <img
                      src={`data:image/jpeg;base64,${user.userProfilePicture.displayProfilePictureName}`}
                      height="16.45px"
                      width="18.32px"
                      draggable="false"
                      alt=""
                    />
                    <span>{user.userName}</span>
                  </Col>
                </Row>
              </>
            ),
            value: user.pK_UID,
            name: user.userName,
          });
          if (Number(user.pK_UID) === Number(createrID)) {
            setTaskAssignedTo([user.pK_UID]);
            setPresenterValue({
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${user.userProfilePicture.displayProfilePictureName}`}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                        alt=""
                      />
                      <span>{user.userName}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: user.pK_UID,
              name: user.userName,
            });
          }
        });
        setAllPresenters(PresenterData);
      }
    } catch {}
  }, [GroupsReducer.getGroupByGroupIdResponse]);

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
    let newTime;
    if (createTodoDate !== "" && task.DeadLineTime !== "") {
      finalDateTime = createConvert(createTodoDate + task.DeadLineTime);
      newDate = finalDateTime.slice(0, 8);
      newTime = finalDateTime.slice(8, 14);
    }

    let Task = {
      PK_TID: task.PK_TID,
      Title: task.Title,
      Description: task.Description,
      IsMainTask: task.IsMainTask,
      DeadLineDate: newDate,
      DeadLineTime: newTime,
      CreationDateTime: "",
    };
    if (finalDateTime === undefined) {
      if (Task.DeadLineTime === "" || Task.DeadLineTime === undefined) {
        showMessage(t("Time-missing"), "error", setOpen);
      } else if (Task.DeadLineDate === "" || Task.DeadLineDate === undefined) {
        showMessage(t("Enter-date-must"), "error", setOpen);
      }
    } else if (Task.Title === "") {
      showMessage(t("Please-select-title-for-the-task"), "error", setOpen);
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
      dispatch(CreateToDoList(navigate, Data, t, setCreateTaskID, 2));
    }
  };

  const uploadTaskDocuments = async (folderID) => {
    try {
      let newfile = [];
      let newFolder = [];
      if (fileForSend.length > 0) {
        const uploadPromises = fileForSend.map(async (newData) => {
          await dispatch(
            uploadDocumentsTaskApi(
              navigate,
              t,
              newData,
              folderID,
              // newFolder,
              newfile
            )
          );
        });
        // Wait for all promises to resolve
        await Promise.all(uploadPromises); //till here the files get upload
        await dispatch(
          saveFilesTaskApi(navigate, t, newfile, folderID, newFolder)
        );
      }

      console.log(newFolder, "newFoldernewFoldernewFolder");
      let newAttachmentData = newFolder.map((data, index) => {
        console.log(data, "newFoldernewFoldernewFolder");
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
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
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

    setAssignees(newDataAssignees);
    setTaskAssignedName([]);
    setTaskAssignedTo(newDataTaskAssignedTo);
  };

  const handleTimeChange = (newTime) => {
    let newDate = new Date(newTime);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getHours()).slice(-2);
      const minutes = ("0" + newDate.getMinutes()).slice(-2);
      const seconds = ("0" + newDate.getSeconds()).slice(-2);

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
  const handleCloseConfirmationModal = () => {
    setShow(false);
    setCloseConfirmationBox(false);
    setIsCreateTodo(true);
  };

  //Selecter Assignee onChange

  const onChangeSearch = (item) => {
    console.log(item, "itemitemitem");
    setPresenterValue(item);
    setTaskAssignedTo([item.value]);
  };

  //Searchable Filter
  const filterFunc = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

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
                      <DatePicker
                        arrowClassName="arrowClass"
                        value={task.timeforView}
                        containerClassName="containerClassTimePicker"
                        className="timePicker"
                        disableDayPicker
                        inputClass="inputTImeMeeting"
                        calendar={calendarValue}
                        locale={localValue}
                        format="hh:mm A"
                        selected={task.timeforView}
                        render={<CustomInput />}
                        editable={false}
                        plugins={[<TimePicker hideSeconds />]}
                        onChange={handleTimeChange}
                      />

                      <DatePicker
                        onFocusedDateChange={toDoDateHandler}
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
                      className="todolist-modal-fields margin-top-0 d-flex  flex-column"
                    >
                      {/* <InputSearchFilter
                        placeholder={t("Add-assignee")}
                        value={taskAssignedToInput}
                        filteredDataHandler={searchFilterHandler(
                          taskAssignedToInput
                        )}
                        applyClass="assigneeFindInCreateToDo"
                        disable={taskAssigneeLength}
                        change={onChangeSearch}
                      /> */}

                      <Select
                        options={allPresenters}
                        maxMenuHeight={140}
                        onChange={onChangeSearch}
                        value={
                          presenterValue.value === 0 ? null : presenterValue
                        }
                        placeholder={t("Add-assignee")}
                        applyClass="assigneeFindInCreateToDo"
                        filterOption={filterFunc}
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
                        maxLength={2000}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} xs={12} className=" attachmentCon ">
                      <label className="ArabicFontSemiBold">
                        {t("Attachement")}
                      </label>
                      <span className="custom-upload-input">
                        <CustomUpload
                          multiple={true}
                          change={uploadFilesToDo}
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                          className="UploadFileButton"
                        />
                      </span>
                      <section className="todolist_files ">
                        {tasksAttachments.TasksAttachments.length > 0
                          ? tasksAttachments.TasksAttachments.map(
                              (data, index) => {
                                return (
                                  <AttachmentViewer
                                    name={data.DisplayAttachmentName}
                                    data={data}
                                    id={0}
                                    fk_UID={createrID}
                                    handleClickRemove={() => {
                                      deleteFilefromAttachments(data, index);
                                    }}
                                  />
                                );
                              }
                            )
                          : null}
                      </section>
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
                      text={t("Cancel")}
                    />
                    <Button
                      onClick={handleCloseConfirmationModal}
                      className={"todocreate-createbtn"}
                      text={t("Close")}
                    />
                  </Col>
                </Row>
              </>
            ) : null
          }
        />
      </Container>
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default ModalToDoList;
