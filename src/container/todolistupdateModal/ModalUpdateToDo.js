import React, { useState, useEffect } from "react";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  TextField,
  Button,
  Modal,
  TimePickers,
  CustomDatePicker,
  Notification,
  InputSearchFilter,
} from "./../../components/elements";
import userImage from "../../assets/images/user.png";
import { RemoveTimeDashes } from "./../../commen/functions/date_formater";
import CustomUpload from "./../../components/elements/upload/Upload";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  UpdateToDoList,
} from "./../../store/actions/ToDoList_action";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DownloadFile } from "../../store/actions/Download_action";
import "./ModalUpdateToDo.css";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../components/elements/snack_bar/utill";
const ModalUpdateToDo = ({ updateFlagToDo, setUpdateFlagToDo, ModalTitle }) => {
  const { t } = useTranslation();
  const state = useSelector((state) => state);
  const { toDoListReducer } = state;

  const toDoListReducerData = useSelector(
    (state) => state.toDoListReducer.ToDoDetails
  );

  const allAssigneesData = useSelector(
    (state) => state.toDoListReducer.AllAssigneesData
  );

  const toDoListReducerResponseMessageData = useSelector(
    (state) => state.toDoListReducer.Message
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

  //task Asignees
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  const [taskAssignedName, setTaskAssignedName] = useState([]);

  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });

  //task Handler aka Input fields
  const taskHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Title") {
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "DeadLineDate") {
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "DeadLineTime") {
      setTask({
        ...task,
        [name]: RemoveTimeDashes(value),
      });
    } else if (name === "Description") {
      setTask({
        ...task,
        [name]: value,
      });
    }
  };

  //Upload File Handler
  const uploadFilesAgenda = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    //

    let file = tasksAttachments.TasksAttachments;
    file.push({
      PK_TAID: 0,
      DisplayAttachmentName: uploadedFile.name,
      OriginalAttachmentName: uploadFilePath,
      CreationDateTime: "",
      FK_TID: 0,
    });
    setTasksAttachments({ TasksAttachments: file });
  };

  // To View To-Do List Data
  useEffect(() => {
    if (Object.keys(toDoListReducerData).length > 0) {
      let viewData = toDoListReducerData;
      setTask({
        ...task,
        Title: viewData.title,
        Description: viewData.description,
        IsMainTask: true,
        DeadLineDate: viewData.deadlineDate,
        DeadLineTime: viewData.deadlineTime,
        CreationDateTime: "",
        PK_TID: viewData.pK_TID,
      });
      if (viewData.taskAssignedTo !== undefined) {
        viewData.taskAssignedTo.forEach((data, index) => {
          if (data.pK_UID === TaskAssignedTo) {
          }
        });
      }
      let listOfAssignees = toDoListReducerData.taskAssignedTo;
      if (listOfAssignees !== undefined) {
        let tem = [];
        let temid = [];
        listOfAssignees.forEach((data, index) => {
          tem.push(data.name);
          temid.push(data.pK_UID);
        });

        //
        setTaskAssignedTo(temid);
        setTaskAssignedName(tem);
      }
      let filesUploaded = toDoListReducerData.taskAttachments;
      if (filesUploaded !== undefined) {
        let tem = [];
        filesUploaded.forEach((data, index) => {
          tem.push({
            PK_TAID: data.pK_TAID,
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            CreationDateTime: data.creationDateTime,
            FK_TID: data.fK_TID,
          });
        });

        setTasksAttachments({ TasksAttachments: tem });
      }
    }
  }, [toDoListReducerData]);

  //Get All Assignees API hit
  useEffect(() => {
    if (updateFlagToDo) {
      dispatch(GetAllAssigneesToDoList(navigate, 1, t));
    } else {
      setUpdateFlagToDo(false);
    }
  }, [updateFlagToDo]);

  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setTaskAssignedToInput(name);
    let temp = taskAssignedName;
    let temp2 = TaskAssignedTo;
    temp.push(name);
    temp2.push(id);
    setTaskAssignedTo(temp2);
    setTaskAssignedName(temp);
    setTaskAssignedToInput("");
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value);
  };

  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = allAssigneesData;

    if (
      allAssignees !== undefined &&
      allAssignees !== null &&
      Object.keys(allAssignees).length > 0
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return (
            searchTerm &&
            assigneesName.startsWith(searchTerm) &&
            assigneesName !== searchTerm
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {}
            <img
              draggable="false"
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
    }
  };

  //Save To-Do List Function
  const updateToDoList = () => {
    let Task = {
      PK_TID: task.PK_TID,
      Title: task.Title,
      Description: task.Description,
      IsMainTask: task.IsMainTask,
      DeadLineDate: task.DeadLineDate,
      DeadLineTime: task.DeadLineTime,
    };

    if (Task.DeadLineDate === "") {
      showMessage(t("Date-missing"), "error", setOpen);
    } else if (Task.DeadLineTime === "") {
      showMessage(t("Time-missing"), "error", setOpen);
    } else if (Task.Title === "") {
      showMessage(t("Title-missing"), "error", setOpen);
    } else if (Task.Description === "") {
      showMessage(t("Description-missing"), "error", setOpen);
    } else {
      dispatch(UpdateToDoList(navigate, Task, t));
      setUpdateFlagToDo(false);
      setTask({
        ...task,
        PK_TID: 1,
        Title: "",
        Description: "",
        IsMainTask: true,
        DeadLine: "",
        CreationDateTime: "",
      });
      setTaskAssignedTo([]);
      setTasksAttachments({ TasksAttachments: [] });
      setTaskAssignedName([]);
    }
  };
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };

    dispatch(DownloadFile(navigate, data));
  };

  useEffect(() => {
    if (
      toDoListReducerResponseMessageData ===
      "The Record has been Updated successfully"
    ) {
      showMessage(toDoListReducerResponseMessageData, "success", setOpen);
      //
    }
  }, [toDoListReducerResponseMessageData]);

  return (
    <>
      <Container>
        <Modal
          show={updateFlagToDo}
          setShow={setUpdateFlagToDo}
          className="modaldialog"
          ModalBody={
            <>
              <Row>
                <Col lg={2} md={2} xs={12}>
                  <TimePickers
                    change={taskHandler}
                    name="DeadLineTime"
                    value={task.DeadLineTime}
                  />
                </Col>
                <Col lg={3} md={3} xs={12}>
                  <CustomDatePicker
                    change={taskHandler}
                    name="DeadLineDate"
                    value={task.DeadLineDate}
                  />
                </Col>
                <Col lg={7} md={7} xs={12} className="modaltodo-search-input">
                  <InputSearchFilter
                    placeholder={t("Add-attendees")}
                    value={taskAssignedToInput}
                    filteredDataHandler={searchFilterHandler(
                      taskAssignedToInput
                    )}
                    change={onChangeSearch}
                  />
                  {taskAssignedName ? (
                    <>
                      <span>
                        {taskAssignedName.map((taskAssignedName) => (
                          <div className="dropdown-row-assignee d-flex align-items-center flex-row">
                            <img
                              draggable="false"
                              src={userImage}
                              alt="userimage"
                            />
                            <p className="p-0 m-0">{taskAssignedName}</p>
                          </div>
                        ))}
                      </span>
                    </>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    change={taskHandler}
                    name="Title"
                    applyClass="form-control2"
                    type="text"
                    placeholder="Title"
                    required
                    value={task.Title}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} xs={12} className="textAreaDiv">
                  <TextField
                    change={taskHandler}
                    name="Description"
                    applyClass="form-control2"
                    type="text"
                    as={"textarea"}
                    rows="7"
                    placeholder={"Description"}
                    value={task.Description}
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="d-flex justify-content-start flex-column margin-left-15"
                >
                  <label>Attachment</label>
                  <span className="custom-upload-input">
                    <CustomUpload
                      change={uploadFilesAgenda}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                      className="UploadFileButton"
                    />
                    <Row>
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
                                  lg={3}
                                  md={3}
                                  className="modalupdatetodolist-attachment-icon"
                                  onClick={(e) => downloadClick(e, data)}
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
                                  <p
                                    className="modalupdatetodolist-attachment-text"
                                    title={data.DisplayAttachmentName}
                                  >
                                    {first}
                                  </p>
                                </Col>
                              );
                            }
                          )
                        : null}
                    </Row>
                  </span>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    onClick={updateToDoList}
                    className={"btn btn-primary px-4 fw-600"}
                    variant={"Primary"}
                    text="Update"
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalUpdateToDo;
