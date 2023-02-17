import React, { useState, useEffect } from "react";
import "./ModalViewToDo.css";
import FileIcon, { defaultStyles } from "react-file-icon";

import moment from "moment";
import { ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";

import {
  TextField,
  Modal,
  Notification,
  Loader,
  TodoAssgineeEmployeeCard,
  TextArea,
} from "./../../components/elements";
import userImage from "../../assets/images/user.png";
import { RemoveTimeDashes } from "./../../commen/functions/date_formater";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  clearState,
  ViewToDoList,
} from "./../../store/actions/ToDoList_action";

import { useDispatch, useSelector } from "react-redux";
import {
  postAssgineeComment,
  HideNotificationTodoComment,
} from "../../store/actions/Post_AssigneeComments";
import { DownloadFile } from "../../store/actions/Download_action";
import { useTranslation } from "react-i18next";

const ModalViewToDo = ({ viewFlagToDo, setViewFlagToDo, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  const state = useSelector((state) => state);
  const { toDoListReducer, postAssigneeComments } = state;
  const { Comments } = postAssigneeComments;
  //To Display Modal
  const dispatch = useDispatch();

  //Notification State
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  //task Object
  const [task, setTask] = useState({
    PK_TID: 0,
    Title: "",
    Description: "",
    IsMainTask: true,
    DeadLineDate: "",
    DeadLineTime: "",
    CreationDateTime: "",
  });

  //Current Date
  const date = new Date();
  let currentDateTime = new Date();
  console.log("currentDateTimecurrentDateTimecurrentDateTime", currentDateTime);

  //Current Time
  let currentTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  currentTime = RemoveTimeDashes(currentTime);

  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);

  //task Asignees
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [taskAssigneeComments, setTaskAssigneeComments] = useState([]);
  const [assgineeComments, setAssgieeComments] = useState("");
  console.log("TaskCreatorIDTaskCreatorIDTaskCreatorID", taskAssigneeComments);
  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const UserName = localStorage.getItem("UserName");
  //To Set task Creater ID
  useEffect(() => {
    setTaskCreatorID(parseInt(createrID));
  }, []);

  useEffect(() => {
    if (Object.keys(toDoListReducer.ToDoDetails).length > 0) {
      console.log("ViewToDoDetails", toDoListReducer.ToDoDetails);
      let viewData = toDoListReducer.ToDoDetails;
      setTask({
        ...task,
        PK_TID: viewData.pK_TID,
        Title: viewData.title,
        Description: viewData.description,
        IsMainTask: true,
        DeadLineDate: viewData.deadlineDate,
        DeadLineTime: viewData.deadlineTime,
        CreationDateTime: viewData.creationDateTime,
      });
      let deadlineDateTime = viewData.deadlineDate + viewData.deadlineTime;
      if (viewData.taskAssignedTo != undefined) {
        viewData.taskAssignedTo.map((data, index) => {
          console.log("taskAssignedToMap", data);
          if (data.pK_UID === TaskAssignedTo) {
            console.log("Mapping Answer", data.name);
          }
        });
      }
      let listOfAssignees = toDoListReducer.ToDoDetails.taskAssignedTo;
      console.log("listOfAssigneeslistOfAssignees", listOfAssignees);
      if (listOfAssignees != undefined) {
        let tem = [];
        let assigneedetails = [];
        let temid = [];
        listOfAssignees.map((data, index) => {
          tem.push(data.name);
          temid.push(data.pK_UID);
          assigneedetails.push({
            pK_UID: JSON.parse(data.pK_UID),
            name: data.name,
            designation: data.designation,
            orignalProfilePictureName: data.orignalProfilePictureName,
            organization: data.organization,
            emailAddress: data.emailAddress,
            mobileNumber: data.mobileNumber,
            creationDate: data.creationDate,
            creationTime: data.creationTime,
            datetimeFormating:
              // TimeDisplayFormat(data.creationDate) +
              // " " +
              moment(deadlineDateTime, "YYYYMMDDHHmmss").format(
                "h:mm A, Do MMM, YYYY"
              ),
          });
        });
        console.log("assigneedetailsassigneedetails", assigneedetails);
        setTaskAssignedTo(assigneedetails);
        setTaskAssignedName(tem);
      }
      let filesUploaded = toDoListReducer.ToDoDetails.taskAttachments;
      if (filesUploaded != undefined) {
        let tem = [];
        filesUploaded.map((data, index) => {
          tem.push({
            PK_MAAID: data.pK_TAID,
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            CreationDateTime: data.creationDateTime,
            FK_TID: data.fK_TID,
          });
        });
        console.log("responseaaaaa 1234", tem);
        setTasksAttachments({ ["TasksAttachments"]: tem });
      }
      let assgineeeComments = toDoListReducer.ToDoDetails.taskComments;
      if (assgineeeComments != undefined) {
        let assigneescommentsArr = [];
        assgineeeComments.map((assgineeData) => {
          assigneescommentsArr.push({
            userID: assgineeData.fK_UID,
            TaskID: assgineeData.fK_TID,
            Comment: assgineeData.comment,
            taskCommentID: assgineeData.pK_TCID,
            taskCommentUserName: assgineeData.userName,
            DateTime: assgineeData.dateTime,
          });
        });
        setTaskAssigneeComments([...assigneescommentsArr]);
      }
    }
  }, [toDoListReducer.ToDoDetails]);
  // for comment from socket
  useEffect(() => {
    if (Object.keys(Comments).length > 0) {
      let newComment = {
        userID: parseInt(Comments.fK_UID),
        TaskID: parseInt(Comments.fK_TID),
        Comment: Comments.comment,
        taskCommentID: parseInt(Comments.pK_TCID),
        taskCommentUserName: Comments.userName,
        DateTime: Comments.dateTime,
      };
      taskAssigneeComments.push(newComment);
      setTaskAssigneeComments(taskAssigneeComments);
    }
  }, [Comments]);

  // for comment update
  useEffect(() => {}, [taskAssigneeComments]);

  //Get All Assignees API hit
  useEffect(() => {
    if (viewFlagToDo) {
      dispatch(GetAllAssigneesToDoList(1, t));
    } else {
      setViewFlagToDo(false);
      dispatch(clearState());
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
      // setToDoTime("");
      setTaskAssignedTo([]);
      setTasksAttachments({ ["TasksAttachments"]: [] });
      setTaskAssignedName([]);
      setTaskAssigneeComments([]);
      setAssgieeComments("");
    }
  }, [viewFlagToDo]);

  // download file
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    console.log("DownloadFile", data);
    dispatch(DownloadFile(data));
  };

  const handleClickCommentSubmit = async (e, id) => {
    e.preventDefault();
    if (assgineeComments != "" && assgineeComments.trim() !== "") {
      let commentData = {
        PK_TCID: 1,
        Comment: assgineeComments,
        FK_TID: id,
        FK_UID: TaskCreatorID,
        DateTime: "",
      };
      await dispatch(postAssgineeComment(commentData, t));
      // if (Object.keys(Comments).length > 0) {
      let newComment = {
        userID: parseInt(TaskCreatorID),
        TaskID: parseInt(id),
        Comment: assgineeComments,
        taskCommentID: 1,
        taskCommentUserName: UserName,
        DateTime: currentDateTime,
      };
      taskAssigneeComments.push(newComment);
      setTaskAssigneeComments(taskAssigneeComments);
      let data = { ToDoListID: parseInt(id) };
      // await dispatch(ViewToDoList(data));
      setAssgieeComments("");
    }
  };
  useEffect(() => {}, [toDoListReducer.ToDoDetails]);

  console.log("postAssigneeComments", postAssigneeComments);

  useEffect(() => {
    if (
      postAssigneeComments.ResponseMessage !== "" &&
      postAssigneeComments !== undefined
    ) {
      setOpen({
        ...open,
        flag: true,
        message: postAssigneeComments.ResponseMessage,
      });
    }
    dispatch(HideNotificationTodoComment());
  }, [postAssigneeComments.ResponseMessage]);

  return (
    <>
      <Container>
        <Modal
          show={viewFlagToDo}
          setShow={setViewFlagToDo}
          className="todview-modal"
          modalBodyClassName="modalTodoViewBody"
          modalFooterClassName="modalTodoViewFooter"
          modalHeaderClassName="modalTodoViewHeader"
          size="md"
          ModalBody={
            <>
              {/* Render Assginees  */}
              <Row className="d-flex align-items-center">
                <Col sm={12} md={12} lg={12}>
                  <Row className="mb-2">
                    <Col sm={12} md={12} lg={12}>
                      <p className="MontserratSemiBold-600 AssignedToDoView">
                        {t("Assigned-to")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="ViewModalEmployeeCard"
                    >
                      {TaskAssignedTo.length > 0 ? (
                        <>
                          <span>
                            {TaskAssignedTo.map((assgineeData, index) => {
                              console.log(
                                "assgineeDataassgineeData",
                                assgineeData
                              );
                              return (
                                <TodoAssgineeEmployeeCard
                                  employeeName={assgineeData.name}
                                  employeeDesignation={assgineeData.designation}
                                  cardText={assgineeData.datetimeFormating}
                                  cardTextIconStyle="DateTimeViewTodo"
                                  userImage={userImage}
                                />
                              );
                            })}
                          </span>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Render Assignee Task */}
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="MontserratSemiBold-600 todo-modal-title"
                >
                  {task.Title}
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="MontserratRegular todo-modal-content"
                >
                  <p>{task.Description} </p>
                </Col>
              </Row>
              {/* Render Assignee Comments */}
              <Row className="comment-Height">
                {taskAssigneeComments.length > 0
                  ? taskAssigneeComments.map((commentData, index) => {
                      console.log(
                        "commentDatacommentData",
                        commentData.userID == createrID,
                        commentData
                      );
                      if (commentData.userID == createrID) {
                        return (
                          <Col
                            sm={12}
                            lg={12}
                            md={12}
                            className="MontserratRegular my-1"
                            key={commentData.taskCommentID}
                          >
                            <TextArea
                              rows={2}
                              timeValue={moment(
                                commentData.DateTime,
                                "YYYYMMDDHHmmss"
                              ).format("h:mm A, Do MMM, YYYY")}
                              label={commentData.taskCommentUserName}
                              labelClassName="d-flex justify-content-end mx-2"
                              disable="false"
                              className="comment-view text-white text-right bg-primary"
                              value={commentData.Comment}
                              timeClass={"timeClass"}
                              formClassPosition="relative-position-form"
                            />
                          </Col>
                        );
                      } else {
                        return (
                          <Col
                            sm={12}
                            lg={12}
                            md={12}
                            className="MontserratRegular my-1"
                            key={commentData.taskCommentID}
                          >
                            <TextArea
                              rows={2}
                              label={commentData.taskCommentUserName}
                              disable="false"
                              className="comment-view"
                              value={commentData.Comment}
                              timeValue={moment(
                                commentData.DateTime,
                                "YYYYMMDDHHmmss"
                              ).format("h:mm A, Do MMM, YYYY")}
                              timeClass={"timeClass Participant"}
                              formClassPosition="relative-position-form"
                            />
                          </Col>
                        );
                      }
                    })
                  : null}
              </Row>

              {/* Post Comments  */}
              <Row className="">
                <Form
                  className="d-flex"
                  onSubmit={(e) => handleClickCommentSubmit(e, task.PK_TID)}
                >
                  <Col sm={11} md={11} lg={11} className="InputFieldStyle">
                    <TextField
                      placeholder={t("Type-in")}
                      applyClass="m-0 p-0"
                      width={"460"}
                      value={assgineeComments}
                      change={(e) => setAssgieeComments(e.target.value)}
                      maxLength={100}
                    />
                  </Col>
                  <Col sm={1} md={1} lg={1} className="comment-enter-button">
                    {currentLanguage === "ar" ? (
                      <ChevronLeft
                        width={25}
                        height={35}
                        color={"white"}
                        onClick={(e) =>
                          handleClickCommentSubmit(e, task.PK_TID)
                        }
                      />
                    ) : (
                      <ChevronRight
                        width={25}
                        height={35}
                        color={"white"}
                        onClick={(e) =>
                          handleClickCommentSubmit(e, task.PK_TID)
                        }
                      />
                    )}
                  </Col>
                </Form>
              </Row>
              {/* File Attachments */}
              <Row className="my-3">
                <Col sm={12} md={12} lg={12} className="">
                  {/* Attachments */}
                  {t("Attachement")}
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="todoModalViewFiles mt-2"
                >
                  {tasksAttachments.TasksAttachments.length > 0
                    ? tasksAttachments.TasksAttachments.map(
                        (modalviewAttachmentFiles, index) => {
                          var ext =
                            modalviewAttachmentFiles.DisplayAttachmentName.split(
                              "."
                            ).pop();
                          const first =
                            modalviewAttachmentFiles.DisplayAttachmentName.split(
                              " "
                            )[0];
                          return (
                            <Col
                              sm={12}
                              lg={2}
                              md={2}
                              onClick={(e) =>
                                downloadClick(e, modalviewAttachmentFiles)
                              }
                            >
                              <FileIcon
                                extension={ext}
                                {...defaultStyles.ext}
                              />
                              <p className="todoModalFileAttach">{first}</p>
                            </Col>
                          );
                        }
                      )
                    : null}
                </Col>
              </Row>
            </>
          }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
      {/* {toDoListReducer.Loading ? (
        <Loader />
      ) : postAssigneeComments.Loading ? (
        <Loader />
      ) : null} */}
    </>
  );
};

export default ModalViewToDo;
