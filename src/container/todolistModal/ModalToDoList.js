import React, { useRef, useState, useEffect } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "./ModalToDoList.css";
import deleteButtonCreateMeeting from "../../assets/images/cancel_meeting_icon.svg";
import InputIcon from "react-multi-date-picker/components/input_icon";
import {
  TextField,
  Button,
  Modal,
  Notification,
  AttachmentViewer,
} from "./../../components/elements";
import {
  createConvert,
  get_CurrentDateTime,
  multiDatePickerDateChangIntoUTC,
} from "./../../commen/functions/date_formater";
import CustomUpload from "./../../components/elements/upload/Upload";
import { Row, Col, Container } from "react-bootstrap";
import Select from "react-select";

import {
  GetAllAssigneesToDoList,
  CreateToDoList,
  uploadDocumentsTaskApi,
  saveTaskDocumentsAndAssigneesApi,
  saveFilesTaskApi,
} from "./../../store/actions/ToDoList_action";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../commen/functions/utils";

const ModalToDoList = ({ ModalTitle, setShow, show }) => {
  //For Localization
  const { t } = useTranslation();
  const [fileSize, setFileSize] = useState(0);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const { currentTime, current_Date, dateObject, current_value } =
    get_CurrentDateTime();
  console.log(
    { currentTime, current_Date, dateObject, current_value },
    "get_CurrentDateTime"
  );
  const [isCreateTodo, setIsCreateTodo] = useState(true);
  const [fileForSend, setFileForSend] = useState([]);

  const toDoListReducerAllAssigneesData = useSelector(
    (state) => state.toDoListReducer.AllAssigneesData
  );

  const toDoListReducertodoDocumentsMappingData = useSelector(
    (state) => state.toDoListReducer.todoDocumentsMapping
  );

  //To Display Modal

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Notification State
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  let currentLanguage = localStorage.getItem("i18nextLng");

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
    creationDate: "",
  });
  console.log(task, "tasktasktask");
  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);

  //task Asignees

  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  console.log(TaskAssignedTo, "TaskAssignedToTaskAssignedTo");

  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [createTaskID, setCreateTaskID] = useState(0);

  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //To Set task Creater ID
  useEffect(() => {
    try {
      setTaskCreatorID(parseInt(createrID));
      setTask({
        ...task,
        // CreationDateTime: currentTime,
        // timeforView: dateObject,
        creationDate: dateObject,
      });
      dispatch(GetAllAssigneesToDoList(navigate, parseInt(createrID), t));
      return () => {
        setCloseConfirmationBox(false);
        setIsCreateTodo(true);
        setTask({
          ...task,
          PK_TID: 1,
          Title: "",
          Description: "",
          IsMainTask: true,
          creationDate: "",
        });
        setTaskAssignedTo([]);
        setTaskAssignedName([]);
        setAssignees([]);
        setFileForSend([]);
        setTasksAttachments({ TasksAttachments: [] });
      };
    } catch (error) {
      console.log(error, "toDoListReducerAllAssigneesData");
    }
  }, []);

  console.log(task, "tasktask");

  //To Set task Creater ID
  useEffect(() => {
    try {
      let data = [...toDoListReducerAllAssigneesData];
      if (
        data !== undefined &&
        data !== null &&
        data.length !== 0 &&
        Object(data).length > 0
      ) {
        let PresenterData = [];
        data.forEach((user, index) => {
          PresenterData.push({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                      height='16.45px'
                      width='18.32px'
                      draggable='false'
                      alt=''
                    />
                    <span>{user.name}</span>
                  </Col>
                </Row>
              </>
            ),
            value: user.pK_UID,
            name: user.name,
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
                      className='d-flex gap-2 align-items-center'>
                      <img
                        src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                        height='16.45px'
                        width='18.32px'
                        draggable='false'
                        alt=''
                      />
                      <span>{user.name}</span>
                    </Col>
                  </Row>
                </>
              ),
              value: user.pK_UID,
              name: user.name,
            });
          }
        });

        setAllPresenters(PresenterData);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [toDoListReducerAllAssigneesData]);

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
      TasksAttachments: searchIndex,
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
    let filesArray = Object.values(data.target.files);
    let totalFiles =
      filesArray.length + tasksAttachments.TasksAttachments.length;
    let fileSizeArr = fileSize;
    let sizezero = true;
    let size = true;

    if (totalFiles > 10) {
      showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
      return;
    }
    filesArray.forEach((fileData, index) => {
      if (fileData.size > maxFileSize) {
        size = false;
      } else if (fileData.size === 0) {
        sizezero = false;
      }

      let fileExists = tasksAttachments.TasksAttachments.some(
        (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
      );

      if (!size) {
        showMessage(
          t("File-size-should-not-be-greater-than-1-5GB"),
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
    });
  };

  useEffect(() => {
    if (taskAssignedName.length > 1) {
      showMessage(t("Only-one-assignee-allow"), "error", setOpen);
    }
  }, [taskAssignedName.length]);

  //Input Field Assignee Change
  const onChangeSearch = (item) => {
    setPresenterValue(item);
    setTaskAssignedTo([item.value]);
  };

  const toDoDateHandler = (date, format = "YYYYMMDD") => {
    let taskDate = new Date(date);
    taskDate.setHours(23);
    taskDate.setMinutes(59);
    taskDate.setSeconds(59);
    setTask({
      ...task,
      creationDate: taskDate,
    });
    if (calendRef.current.isOpen) {
      calendRef.current.closeCalendar();
    }
  };

  // Save To-Do List Function
  const createToDoList = async () => {
    // Step 1: Initialize and validate task assignees
    let taskAssignedTO = [...TaskAssignedTo];
    if (taskAssignedTO.length === 0) {
      taskAssignedTO.push(Number(createrID)); // Assign task to creator if no one is assigned
      setTaskAssignedTo(taskAssignedTO);
    }

    // Step 2: Validate and process task creation date and time
    if (!task.creationDate) {
      showMessage(t("Creation date is required"), "error", setOpen); // Validate task creation date
      return;
    }

    let newDate = multiDatePickerDateChangIntoUTC(task.creationDate).slice(
      0,
      8
    ); // Extract UTC date
    let newTime = multiDatePickerDateChangIntoUTC(task.creationDate).slice(
      8,
      14
    ); // Extract UTC time

    // Step 3: Validate task properties
    if (!task.Title || task.Title.trim() === "") {
      showMessage(t("Please select a title for the task"), "error", setOpen); // Validate task title
      return;
    }
    if (!newDate) {
      showMessage(t("Deadline date is required"), "error", setOpen); // Validate deadline date
      return;
    }
    // Step 4: Construct the task object
    let Task = {
      PK_TID: task.PK_TID, // Task ID
      Title: task.Title, // Task title
      Description: task.Description, // Task description
      IsMainTask: task.IsMainTask, // Indicates if it's a main task
      DeadLineDate: newDate, // Deadline date
      DeadLineTime: newTime, // Deadline time
      CreationDateTime: `${newDate}${newTime}`, // Combined creation date and time
    };

    // Step 5: Prepare data for submission
    let Data = {
      Task,
      TaskCreatorID, // ID of the task creator
      TaskAssignedTo:
        taskAssignedTO.length > 0 ? taskAssignedTO : TaskAssignedTo, // Assigned users
      // TasksAttachments, // Uncomment if attachments are needed
    };

    // Step 6: Dispatch the create to-do action
    // Uncomment the line below to enable the action
    dispatch(CreateToDoList(navigate, Data, t, setCreateTaskID, 2));
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
        saveTaskDocumentsAndAssigneesApi(navigate, Data, t, 1, setShow)
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (toDoListReducertodoDocumentsMappingData !== 0) {
      uploadTaskDocuments(toDoListReducertodoDocumentsMappingData);
    }
  }, [toDoListReducertodoDocumentsMappingData]);

  const handleDeleteAttendee = (data, index) => {
    let newDataAssignees = [...assignees];
    newDataAssignees.splice(index, 1);
    let newDataTaskAssignedTo = [...TaskAssignedTo];
    newDataTaskAssignedTo.splice(index, 1);

    setAssignees(newDataAssignees);
    setTaskAssignedName([]);
    setTaskAssignedTo(newDataTaskAssignedTo);
  };

  function CustomInput({ onFocus, value, onChange }) {
    return (
      <input
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        className='input-with-icon'
      />
    );
  }
  const handleCloseConfirmationModal = () => {
    setShow(false);
    setCloseConfirmationBox(false);
    setIsCreateTodo(true);
  };

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
          size={"md"}
          // className='modaldialogTodoCreate'
          modalBodyClassName={" createTask__body p-4"}
          modalFooterClassName='d-block'
          modalHeaderClassName='d-none'
          ButtonTitle={ModalTitle}
          ModalBody={
            isCreateTodo ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className='createtask__heading'>
                      {t("Create-task")}
                    </span>
                  </Col>
                </Row>
                <div className='createTask__contet'>
                  <Row className='mt-4'>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='todolist-modal-fields'>
                      <span className='createTask_label'>{`${t(
                        "Task-title"
                      )}*`}</span>
                      <TextField
                        change={taskHandler}
                        name='Title'
                        applyClass='createtodo-title'
                        labelclass={"d-none"}
                        type='text'
                        placeholder={t("Task-title") + "*"}
                        required
                        value={task.Title}
                        maxLength={200}
                      />
                    </Col>
                  </Row>
                  <Row className='my-3'>
                    <Col lg={5} md={5} sm={12} xs={12}>
                      <span className='createTask_label'>{`${t(
                        "Add-assignee"
                      )}*`}</span>
                      <Select
                        options={allPresenters}
                        maxMenuHeight={140}
                        onChange={onChangeSearch}
                        value={
                          presenterValue.value === 0 ? null : presenterValue
                        }
                        placeholder={t("Add-assignee")}
                        applyClass='assigneeFindInCreateToDo'
                        className="seletTaskAssginee"
                        filterOption={filterFunc}
                      />
                    </Col>
                    <Col sm={12} md={2} lg={2}></Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      xs={12}
                      className='d-flex flex-column'>
                      <span className='createTask_label'>{`${t(
                        "Deadline"
                      )}*`}</span>
                      <DatePicker
                        onFocusedDateChange={toDoDateHandler}
                        format={"DD/MM/YYYY"}
                        value={task.creationDate}
                        minDate={moment().toDate()}
                        placeholder='DD/MM/YYYY'
                        render={
                          <InputIcon
                            placeholder='DD/MM/YYYY'
                            className='datepicker_input'
                          />
                        }
                        editable={false}
                        className='datePickerTodoCreate2'
                        onOpenPickNewDate={true}
                        inputMode=''
                        calendar={calendarValue}
                        locale={localValue}
                        ref={calendRef}
                      />
                    </Col>
                  </Row>
                  {/* <Row className='create_todo_assignee d-flex justify-content-end'>
                    {assignees.length > 0 ? (
                      <>
                        {assignees.map((taskAssignedName, index) => (
                          <Col sm={12} md={6} lg={6}>
                            <div className='dropdown-row-assignee w-100'>
                              <div className='d-flex align-items-center gap-2 mt-1 position-relative'>
                                <img
                                  draggable='false'
                                  alt=''
                                  src={`data:image/jpeg;base64,${taskAssignedName.displayProfilePictureName}`}
                                />
                                <p className=' m-0'>{taskAssignedName.name}</p>
                              </div>
                              <span className='todolist-remove-assignee-icon'>
                                <img
                                  draggable='false'
                                  width={20}
                                  className='remove'
                                  height={20}
                                  alt=''
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
                  </Row> */}

                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <span className='createTask_label'>{`${t(
                        "Description"
                      )}`}</span>
                      <TextField
                        change={taskHandler}
                        labelclass={"d-none"}
                        name='Description'
                        applyClass='createtodo-description'
                        type='text'
                        as={"textarea"}
                        rows='7'
                        placeholder={t("Description")}
                        maxLength={2000}
                      />
                    </Col>
                  </Row>
                  <Row className='mt-4'>
                    <Col lg={12} md={12} xs={12} className=' attachmentCon '>
                      <label className='ArabicFontSemiBold'>
                        {t("Attachement")}
                      </label>
                      <span className='custom-upload-input'>
                        <CustomUpload
                          change={uploadFilesToDo}
                          multiple={true}
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                          className='UploadFileButton'
                        />
                      </span>
                      <section className='todolist_files '>
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
                    className={"Confirmationmodal_body_text"}>
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
                    className='d-flex justify-content-end gap-3 p-0'>
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
                    className='d-flex justify-content-center gap-3'>
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
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalToDoList;
