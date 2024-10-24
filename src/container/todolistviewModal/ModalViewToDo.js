import React, { useState, useEffect, useRef } from "react";
import "./ModalViewToDo.css";
import moment from "moment";
import { ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import CrossIcon from "../../assets/images/CrossIcon.svg";
import {
  TextField,
  Modal,
  Notification,
  TodoAssgineeEmployeeCard,
  TextArea,
  Button,
  AttachmentViewer,
} from "./../../components/elements";
import { newTimeFormaterAsPerUTCFullDate } from "./../../commen/functions/date_formater";
import { Row, Col } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  deleteCommentApi,
} from "./../../store/actions/ToDoList_action";
import { getRandomUniqueNumber } from "../pages/meeting/scedulemeeting/Agenda/drageFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  postAssgineeComment,
  HideNotificationTodoComment,
  emptyCommentState,
  postComments,
} from "../../store/actions/Post_AssigneeComments";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { DataRoomDownloadFileApiFunc } from "../../store/actions/DataRoom_actions";
import { fileFormatforSignatureFlow } from "../../commen/functions/utils";
import { showMessage } from "../../components/elements/snack_bar/utill";

const ModalViewToDo = ({ viewFlagToDo, setViewFlagToDo }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  const state = useSelector((state) => state);
  const { toDoListReducer, postAssigneeComments } = state;
  const { Comments } = postAssigneeComments;

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
    PK_TID: 0,
    Title: "",
    Description: "",
    IsMainTask: true,
    DeadLineDate: "",
    DeadLineTime: "",
    CreationDateTime: "",
  });

  //Current Date
  let currentDateTime = new Date();
  let changeDateFormat = moment(currentDateTime).utc();
  let convertFormation = moment(changeDateFormat).format("YYYYMMDDHHmmss");

  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);
  const todoComments = useRef();
  //task Asignees
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  const [todoCreator, setTodoCreator] = useState(null);
  const [taskAssigneeComments, setTaskAssigneeComments] = useState([]);
  const [assgineeComments, setAssgieeComments] = useState("");
  const [deleteCommentsId, setDeleteCommentsId] = useState(0);
  //Upload File States
  const [tasksAttachments, setTasksAttachments] = useState({
    TasksAttachments: [],
  });
  const UserName = localStorage.getItem("name");
  //To Set task Creater ID
  useEffect(() => {
    dispatch(postComments(null));

    setTaskCreatorID(parseInt(createrID));
    return () => {
      dispatch(postComments(null));
      setTaskAssigneeComments([]);
      //task Object
      setTask({
        PK_TID: 0,
        Title: "",
        Description: "",
        IsMainTask: true,
        DeadLineDate: "",
        DeadLineTime: "",
        CreationDateTime: "",
      });
    };
  }, []);
  useEffect(() => {
    todoComments.current?.scrollIntoView({ behavior: "smooth" });
  }, [todoComments, taskAssigneeComments]);

  useEffect(() => {
    if (Object.keys(toDoListReducer.ToDoDetails).length > 0) {
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
      if (viewData.taskAssignedTo !== undefined) {
        viewData.taskAssignedTo.forEach((data, index) => {
          if (data.pK_UID === TaskAssignedTo) {
          }
        });
      }
      let listOfAssignees = toDoListReducer.ToDoDetails.taskAssignedTo;

      if (listOfAssignees !== undefined) {
        let tem = [];
        let assigneedetails = [];
        let assigneeinfo = [];
        let temid = [];
        listOfAssignees.forEach((data, index) => {
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
            displayProfilePicture: data.displayProfilePictureName,
            datetimeFormating:
              newTimeFormaterAsPerUTCFullDate(deadlineDateTime),
          });
        });
        listOfAssignees.forEach((data, index) => {
          if (data.pK_UID === Number(createrID)) {
            assigneeinfo.push(data);
          }
        });
        setTaskAssignedTo(assigneedetails);
      }
      let todoCreator = toDoListReducer.ToDoDetails.taskCreator;
      setTodoCreator(todoCreator);
      let filesUploaded = toDoListReducer.ToDoDetails.taskAttachments;
      if (filesUploaded !== undefined) {
        let tem = [];
        filesUploaded.forEach((data, index) => {
          tem.push({
            PK_MAAID: data.pK_TAID,
            DisplayAttachmentName: data.displayAttachmentName,
            OriginalAttachmentName: data.originalAttachmentName,
            CreationDateTime: data.creationDateTime,
            FK_TID: data.fK_TID,
          });
        });
        setTasksAttachments({ TasksAttachments: tem });
      }
      let assgineeeComments = toDoListReducer.ToDoDetails.taskComments;

      if (assgineeeComments.length > 0) {
        let assigneescommentsArr = [];
        assgineeeComments.forEach((assgineeData) => {
          assigneescommentsArr.push({
            userID: assgineeData.fK_UID,
            TaskID: assgineeData.fK_TID,
            Comment: assgineeData.comment,
            taskCommentID: assgineeData.pK_TCID,
            taskCommentUserName: assgineeData.userName,
            DateTime: assgineeData.dateTime,
            CommentID: 0,
          });
        });
        setTaskAssigneeComments(assigneescommentsArr);
      }
    } else {
      setTask({
        PK_TID: 0,
        Title: "",
        Description: "",
        IsMainTask: true,
        DeadLineDate: "",
        DeadLineTime: "",
        CreationDateTime: "",
      });
      setAssgieeComments([]);
    }
  }, [toDoListReducer.ToDoDetails]);

  // for comment from socket
  useEffect(() => {
    if (Comments !== null) {
      // First Compare Random ID and replace with
      let commentIndex = taskAssigneeComments.findIndex((data, index) => {
        return data?.CommentID === Comments.commentFrontEndID.toString();
      });
      // Update Comment ID
      let commentIndex2 = taskAssigneeComments.find(
        (data, index) => data?.taskCommentID === Number(Comments.pK_TCID)
      );

      // Update Comment ID
      if (commentIndex !== -1) {
        let newArr = taskAssigneeComments.map((comment, index) => {
          if (index === commentIndex) {
            const newData = {
              ...comment,
              taskCommentID: Number(Comments.pK_TCID),
            };

            return newData;
          }

          return comment;
        });

        setTaskAssigneeComments(newArr);
      } else if (commentIndex2 === undefined && commentIndex === -1) {
        // Comment does not exist, add it
        let newComment = {
          userID: parseInt(Comments.fK_UID),
          TaskID: parseInt(Comments.fK_TID),
          CommentID: Comments.CommentFrontEndID,
          Comment: Comments.comment,
          taskCommentID: Number(Comments.pK_TCID),
          taskCommentUserName: Comments.userName,
          DateTime: Comments.dateTime,
        };

        setTaskAssigneeComments((prev) => [...prev, newComment]);
        dispatch(emptyCommentState());
      }
    }
  }, [Comments]);

  // for Comment delete from MQTT Notification
  useEffect(() => {
    if (
      postAssigneeComments.DeleteCommentsId !== null &&
      postAssigneeComments.DeleteCommentsId !== undefined
    ) {
      if (
        postAssigneeComments.DeleteCommentsId.commentID !== 0 &&
        postAssigneeComments.DeleteCommentsId.commentID !== null
      ) {
        let findNewIndex = taskAssigneeComments.findIndex(
          (data, index) =>
            data.taskCommentID ===
            postAssigneeComments.DeleteCommentsId.commentID
        );
        if (findNewIndex !== -1) {
          let newData = [...taskAssigneeComments];
          newData.splice(findNewIndex, 1);
          setTaskAssigneeComments(newData);
        }
      }
    }
  }, [postAssigneeComments.DeleteCommentsId]);

  //Get All Assignees API hit
  useEffect(() => {
    if (viewFlagToDo) {
      dispatch(postComments(null));

      dispatch(GetAllAssigneesToDoList(navigate, 1, t));
    } else {
      setViewFlagToDo(false);
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
      setTaskAssignedTo([]);
      setTasksAttachments({ TasksAttachments: [] });
      setTaskAssigneeComments([]);
      setAssgieeComments("");
      setDeleteCommentsId([]);
    }
  }, [viewFlagToDo]);

  const handleClickCommentSubmit = async (e, id) => {
    e.preventDefault();
    if (assgineeComments !== "" && assgineeComments.trim() !== "") {
      let commentData = {
        PK_TCID: 0,
        CommentID: getRandomUniqueNumber().toString() + "A",
        Comment: assgineeComments,
        FK_TID: id,
        FK_UID: Number(TaskCreatorID),
        DateTime: "",
      };
      await dispatch(postAssgineeComment(navigate, commentData, t));
      let newComment = {
        userID: parseInt(TaskCreatorID),
        TaskID: parseInt(id),
        CommentID: commentData.CommentID,
        Comment: assgineeComments,
        taskCommentID: 0,
        taskCommentUserName: UserName,
        DateTime: convertFormation,
      };
      setTaskAssigneeComments([...taskAssigneeComments, newComment]);
      setAssgieeComments("");
    }
  };

  const handleDeleteComments = (commentID, taskID) => {
    setDeleteCommentsId(commentID);
    dispatch(deleteCommentApi(navigate, t, commentID, taskID));
  };

  const handleClickDownloadFile = (fileID, fileName) => {
    let data = {
      FileID: Number(fileID),
    };
    dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, fileName));
  };

  const handleLinkClick = (data, ext) => {
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  useEffect(() => {
    if (
      postAssigneeComments.ResponseMessage !== "" &&
      postAssigneeComments !== undefined &&
      postAssigneeComments.ResponseMessage !== "Comment added successfully"
    ) {
      showMessage(postAssigneeComments.ResponseMessage, "error", setOpen);
    }
    dispatch(HideNotificationTodoComment());
  }, [postAssigneeComments.ResponseMessage]);

  const handleClose = () => {
    dispatch(emptyCommentState());
    setViewFlagToDo(false);
  };

  return (
    <>
      <Modal
        onHide={handleClose}
        show={viewFlagToDo}
        setShow={setViewFlagToDo}
        className="todview-modal"
        modalBodyClassName="modalTodoViewBody"
        modalFooterClassName="modalTodoViewFooter"
        modalHeaderClassName="modalTodoViewHeader d-none"
        size="md"
        ModalBody={
          <>
            <Row>
              {/* Assigned to Heading */}
              <Col sm={12} md={12} lg={12} className="mt-2">
                <p className=" AssignedToDoView">{t("Assigned-to")}</p>
              </Col>
              {/* Task Assigned Person Details */}
              <Col sm={12} md={12} lg={12}>
                {TaskAssignedTo.length > 0 && todoCreator !== null ? (
                  <>
                    {TaskAssignedTo.forEach((assgineeData, index) => {
                      if (
                        Number(
                          toDoListReducer.ToDoDetails.taskCreator.pK_UID
                        ) === Number(createrID)
                      ) {
                        return (
                          <Col sm={12} md={12} lg={12}>
                            <TodoAssgineeEmployeeCard
                              employeeName={assgineeData.name}
                              employeeDesignation={"Test Designation"}
                              cardText={assgineeData.datetimeFormating}
                              cardTextIconStyle="DateTimeViewTodo"
                              userImage={assgineeData.displayProfilePicture}
                            />
                          </Col>
                        );
                      } else {
                        if (Number(assgineeData.pK_UID) === Number(createrID)) {
                          return (
                            <Col sm={12} md={12} lg={12}>
                              <TodoAssgineeEmployeeCard
                                employeeName={assgineeData.name}
                                employeeDesignation={"assgineeData.designation"}
                                cardText={assgineeData.datetimeFormating}
                                cardTextIconStyle="DateTimeViewTodo"
                                userImage={assgineeData.displayProfilePicture}
                              />
                            </Col>
                          );
                        }
                      }
                    })}
                  </>
                ) : null}
              </Col>
              {/* Task Title and Description */}
              <Col sm={12} md={12} lg={12} className="task-and-description">
                {/* Task Title */}
                <p className="todo-modal-title mb-0" title={task.Title}>
                  {" "}
                  {task.Title}{" "}
                </p>

                {/* Task Description */}
                <p className="Modal-todo-view-discription1">
                  {task.Description}
                </p>
              </Col>

              {/* Task Comments */}
              <Col sm={12} md={12} lg={12} className="taskComments">
                {taskAssigneeComments.length > 0
                  ? taskAssigneeComments.map((commentData, index) => {
                      if (Number(commentData.userID) === Number(createrID)) {
                        return (
                          <>
                            <Col
                              sm={12}
                              lg={12}
                              md={12}
                              className="MontserratRegular my-1 FontArabicRegular position-relative"
                              key={commentData.taskCommentID}
                            >
                              <TextArea
                                rows={2}
                                timeValue={newTimeFormaterAsPerUTCFullDate(
                                  commentData.DateTime
                                )}
                                label={commentData.taskCommentUserName}
                                labelClassName=" d-flex justify-content-start  fw-bold "
                                disable="false"
                                className="comment-view sender text-white  "
                                value={commentData.Comment}
                                timeClass={"timeClass"}
                                formClassPosition="relative-position-form"
                              />

                              {toDoListReducer.deleteCommentSpinner &&
                              deleteCommentsId === commentData.taskCommentID ? (
                                <span className="deleteCommentSpinner">
                                  <Spin size="small" />
                                </span>
                              ) : commentData.taskCommentID === 0 ||
                                commentData.taskCommentID !== 0 ? (
                                <>
                                  <img
                                    draggable="false"
                                    src={CrossIcon}
                                    width={14}
                                    alt=""
                                    onClick={() =>
                                      handleDeleteComments(
                                        commentData.taskCommentID,
                                        commentData.TaskID
                                      )
                                    }
                                    className={
                                      commentData.taskCommentID !== 0
                                        ? "crossIconTodoComment"
                                        : "crossIconTodoComment_disable"
                                    }
                                  />
                                </>
                              ) : null}
                            </Col>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <Col
                              sm={12}
                              lg={12}
                              md={12}
                              className="MontserratRegular my-1 FontArabicRegular"
                              key={commentData.taskCommentID}
                            >
                              <TextArea
                                rows={2}
                                label={commentData.taskCommentUserName}
                                disable="false"
                                className="comment-view"
                                value={commentData.Comment}
                                labelClassName=" d-flex justify-content-start mx-2 "
                                timeValue={newTimeFormaterAsPerUTCFullDate(
                                  commentData.DateTime
                                )}
                                timeClass={"timeClass Participant"}
                                formClassPosition="relative-position-form"
                              />
                            </Col>
                          </>
                        );
                      }
                    })
                  : null}
                <div ref={todoComments} />
              </Col>
              {/* Task Submit */}
              <Col sm={12} md={12} lg={12} className="mb-2">
                <Form
                  className="d-flex"
                  onSubmit={(e) => handleClickCommentSubmit(e, task.PK_TID)}
                >
                  <Col
                    sm={11}
                    md={11}
                    lg={11}
                    className="todolist-modal-fields InputFieldStyle"
                  >
                    <TextField
                      placeholder={t("Type-in")}
                      applyClass="todoviewmodalcomments"
                      width={"460"}
                      labelclass={"d-none"}
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
                        className="cursor-pointer"
                        onClick={(e) =>
                          handleClickCommentSubmit(e, task.PK_TID)
                        }
                      />
                    ) : (
                      <ChevronRight
                        width={25}
                        height={35}
                        color={"white"}
                        className="cursor-pointer"
                        onClick={(e) =>
                          handleClickCommentSubmit(e, task.PK_TID)
                        }
                      />
                    )}
                  </Col>
                </Form>
              </Col>
              {/* Attachment Heading */}
              <Col sm={12} md={12} lg={12} className="fw-600">
                {/* Attachments */}
                {t("Attachement")}
              </Col>
              {/* Task Attachment List */}
              <Col sm={12} md={12} lg={12} className="todoModalViewFiles">
                {tasksAttachments.TasksAttachments.length > 0
                  ? tasksAttachments.TasksAttachments.map(
                      (modalviewAttachmentFiles, index) => {
                        let ext =
                          modalviewAttachmentFiles.DisplayAttachmentName.split(
                            "."
                          ).pop();

                        const pdfData = {
                          taskId: modalviewAttachmentFiles.FK_TID,
                          attachmentID: Number(
                            modalviewAttachmentFiles.OriginalAttachmentName
                          ),
                          fileName:
                            modalviewAttachmentFiles.DisplayAttachmentName,
                          commingFrom: 4,
                        };
                        const pdfDataJson = JSON.stringify(pdfData);
                        return (
                          <AttachmentViewer
                            handleClickDownload={() =>
                              handleClickDownloadFile(
                                modalviewAttachmentFiles.OriginalAttachmentName,
                                modalviewAttachmentFiles.DisplayAttachmentName
                              )
                            }
                            handleEyeIcon={() =>
                              handleLinkClick(pdfDataJson, ext)
                            }
                            id={modalviewAttachmentFiles.OriginalAttachmentName}
                            data={modalviewAttachmentFiles}
                            name={
                              modalviewAttachmentFiles.DisplayAttachmentName
                            }
                          />
                        );
                      }
                    )
                  : null}
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-end"
              >
                <Button
                  className={"cancelButton_createTodo"}
                  onClick={handleClose}
                  text={t("Close")}
                />
              </Col>
            </Row>
          </>
        }
      />

      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default ModalViewToDo;
