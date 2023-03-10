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
  Loader,
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
const ModalUpdateToDo = ({ updateFlagToDo, setUpdateFlagToDo, ModalTitle }) => {
  const { t } = useTranslation();
  const state = useSelector((state) => state);
  const { toDoListReducer } = state;
  //To Display Modal

  const dispatch = useDispatch();

  //Notification State
  const [open, setOpen] = useState({
    flag: false,
    message: "",
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
    console.log("taskHandler", name, value);
    if (name === "Title") {
      console.log("Title", name, value);
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "DeadLineDate") {
      console.log("DeadLineDate", name, value);
      setTask({
        ...task,
        [name]: value,
      });
    } else if (name === "DeadLineTime") {
      console.log("DeadLineTime", name, value);
      setTask({
        ...task,
        [name]: RemoveTimeDashes(value),
      });
    } else if (name === "Description") {
      console.log("Description", name, value);
      setTask({
        ...task,
        [name]: value,
      });
    }
  };

  console.log("Object task", task);

  //Upload File Handler
  const uploadFilesAgenda = (data) => {
    const uploadFilePath = data.target.value;
    const uploadedFile = data.target.files[0];
    // console.log("uploadFilesAgenda", uploadedFile.name);
    console.log("uploadedFile", uploadedFile.name);
    let file = tasksAttachments.TasksAttachments;
    file.push({
      PK_TAID: 0,
      DisplayAttachmentName: uploadedFile.name,
      OriginalAttachmentName: uploadFilePath,
      CreationDateTime: "",
      FK_TID: 0,
    });
    setTasksAttachments({ ["TasksAttachments"]: file });
  };

  // To View To-Do List Data
  useEffect(() => {
    if (Object.keys(toDoListReducer.ToDoDetails).length > 0) {
      console.log("ViewToDoDetails", toDoListReducer.ToDoDetails);
      let viewData = toDoListReducer.ToDoDetails;
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
        viewData.taskAssignedTo.map((data, index) => {
          console.log("taskAssignedToMap", data);
          if (data.pK_UID === TaskAssignedTo) {
            console.log("Mapping Answer", data.name);
          }
        });
      }
      let listOfAssignees = toDoListReducer.ToDoDetails.taskAssignedTo;
      if (listOfAssignees !== undefined) {
        let tem = [];
        let temid = [];
        listOfAssignees.map((data, index) => {
          tem.push(data.name);
          temid.push(data.pK_UID);
        });
        console.log("listOfAssignees", tem);
        // console.log("setTaskAssignedName", tem);
        setTaskAssignedTo(temid);
        setTaskAssignedName(tem);
      }
      let filesUploaded = toDoListReducer.ToDoDetails.taskAttachments;
      if (filesUploaded !== undefined) {
        let tem = [];
        filesUploaded.map((data, index) => {
          tem.push({
            PK_TAID: data.pK_TAID,
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            CreationDateTime: data.creationDateTime,
            FK_TID: data.fK_TID,
          });
        });
        console.log("responseaaaaa 1234", tem);
        setTasksAttachments({ ["TasksAttachments"]: tem });
      }
      console.log("viewToDoData", viewData);
    }
  }, [toDoListReducer.ToDoDetails]);

  //Get All Assignees API hit
  useEffect(() => {
    if (updateFlagToDo) {
      dispatch(GetAllAssigneesToDoList(1, t));
    } else {
      setUpdateFlagToDo(false);
      // setTask({
      //   ...task,
      //   PK_TID: 1,
      //   Title: "",
      //   Description: "",
      //   IsMainTask: true,
      //   DeadLine: "",
      //   CreationDateTime: "",
      // });
      // setTaskAssignedTo([]);
      // setTasksAttachments({ ["TasksAttachments"]: [] });
      // setTaskAssignedName([]);
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
    console.log("Input Value OnChange", e.target.value);
  };

  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = toDoListReducer.AllAssigneesData;
    console.log("Input Value", value);
    if (
      allAssignees !== undefined &&
      allAssignees !== null &&
      allAssignees !== []
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
            {console.log("itemitem", item)}
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  //Save To-Do List Function
  const updateToDoList = () => {
    let TasksAttachments = tasksAttachments.TasksAttachments;
    console.log("TasksAttachments", TasksAttachments);
    let Task = {
      PK_TID: task.PK_TID,
      Title: task.Title,
      Description: task.Description,
      IsMainTask: task.IsMainTask,
      DeadLineDate: task.DeadLineDate,
      DeadLineTime: task.DeadLineTime,
    };
    console.log("Task Object For Update", Task);
    if (Task.DeadLineDate === "") {
      setOpen({
        ...open,
        flag: true,
        message: "Date Missing",
      });
    } else if (Task.DeadLineTime === "") {
      setOpen({
        ...open,
        flag: true,
        message: "Time missing",
      });
    } else if (Task.Title === "") {
      setOpen({
        ...open,
        flag: true,
        message: "Title missing",
      });
    } else if (Task.Description === "") {
      setOpen({
        ...open,
        flag: true,
        message: "Description missing",
      });
    } else {
      // let Data = {
      //   Task,
      // };
      dispatch(UpdateToDoList(Task, t));
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
      setTasksAttachments({ ["TasksAttachments"]: [] });
      setTaskAssignedName([]);
    }
  };
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    console.log("DownloadFile", data);
    dispatch(DownloadFile(data));
  };

  console.log("toDoListReducer", toDoListReducer);
  console.log("uploadToDoList Task", task);

  useEffect(() => {
    if (
      toDoListReducer.Message === "The Record has been Updated successfully"
    ) {
      setOpen({
        ...open,
        flag: true,
        message: toDoListReducer.Message,
      });
      // console.log(toDoListReducer.Message)
    }
  }, [toDoListReducer.Message]);

  return (
    <>
      <Container>
        <Modal
          show={updateFlagToDo}
          setShow={setUpdateFlagToDo}
          className="modaldialog"
          // ButtonTitle={ModalTitle}
          // ModalTitle={"Modal Header"}
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
                            <img src={userImage} alt="userimage" />
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
                                  <FileIcon
                                    extension={ext}
                                    {...defaultStyles.ext}
                                  />
                                  <p className="modalupdatetodolist-attachment-text">
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
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {toDoListReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default ModalUpdateToDo;
