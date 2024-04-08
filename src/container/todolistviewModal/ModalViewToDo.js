import React, { useState, useEffect, useRef } from "react";
import "./ModalViewToDo.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import { LoadingOutlined } from "@ant-design/icons";
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
} from "./../../components/elements";
import userImage from "../../assets/images/user.png";
import {
  newTimeFormaterAsPerUTCFullDate,
  RemoveTimeDashes,
} from "./../../commen/functions/date_formater";
import { Row, Col, Container } from "react-bootstrap";
import {
  GetAllAssigneesToDoList,
  clearState,
  ViewToDoList,
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
import { DownloadFile } from "../../store/actions/Download_action";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { DataRoomDownloadFileApiFunc } from "../../store/actions/DataRoom_actions";

const ModalViewToDo = ({ viewFlagToDo, setViewFlagToDo }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  const state = useSelector((state) => state);
  const { toDoListReducer, postAssigneeComments } = state;
  const [commentID, setCommentID] = useState(0);
  const { Comments } = postAssigneeComments;
  console.log(
    postAssigneeComments,
    "postAssigneeCommentspostAssigneeCommentspostAssigneeComments"
  );

  //To Display Modal
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Notification State
  const [open, setOpen] = useState({
    flag: false,
    message: "",
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
  const date = new Date();
  let currentDateTime = new Date();
  let changeDateFormat = moment(currentDateTime).utc();
  let convertFormation = moment(changeDateFormat).format("YYYYMMDDHHmmss");

  const year = currentDateTime.getFullYear();
  const month = (currentDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDateTime.getDate().toString().padStart(2, "0");
  const hour = currentDateTime.getHours().toString().padStart(2, "0");
  const minute = currentDateTime.getMinutes().toString().padStart(2, "0");
  const second = currentDateTime.getSeconds().toString().padStart(2, "0");

  let getFullDateFormat = `${year}${month}${day}${hour}${minute}${second}`;
  //Current Time
  let currentTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  currentTime = RemoveTimeDashes(currentTime);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 20,
      }}
      spin
    />
  );
  //To Set task Creater ID
  const [TaskCreatorID, setTaskCreatorID] = useState(0);
  const todoComments = useRef();
  //task Asignees
  const [TaskAssignedTo, setTaskAssignedTo] = useState([]);
  const [todoCreator, setTodoCreator] = useState(null);
  const [taskAssignedName, setTaskAssignedName] = useState([]);
  const [assigeeDetails, setAssigneeDetails] = useState(null);
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
        setAssigneeDetails(assigneeinfo);
        setTaskAssignedTo(assigneedetails);
        setTaskAssignedName(tem);
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
        setTasksAttachments({ ["TasksAttachments"]: tem });
      }
      let assgineeeComments = toDoListReducer.ToDoDetails.taskComments;
      console.log(
        assgineeeComments,
        "assgineeeCommentsassgineeeCommentsassgineeeComments"
      );
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
  console.log(
    { taskAssigneeComments, Comments },
    "commentIndex2commentIndex2commentIndex2commentIndex2"
  );

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
      console.log(commentIndex, commentIndex2, "commentIndex2commentIndex2");
      // Update Comment ID
      if (commentIndex !== -1) {
        let newArr = taskAssigneeComments.map((comment, index) => {
          if (index === commentIndex) {
            console.log(
              "testcommentIndex2commentIndex2commentIndex2commentIndex2"
            );
            const newData = {
              ...comment,
              taskCommentID: Number(Comments.pK_TCID),
            };

            return newData;
          }

          return comment;
        });

        setTaskAssigneeComments(newArr);
        dispatch(postComments(null));

        // dispatch(emptyCommentState());
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
        // dispatch(emptyCommentState());
        dispatch(postComments(null));
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
      // dispatch(clearState());
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
      setDeleteCommentsId([]);
    }
  }, [viewFlagToDo]);

  // download file
  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };

    dispatch(DownloadFile(navigate, data));
  };

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

  const handleLinkClick = (data) => {
    window.open(
      `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
      "_blank",
      "noopener noreferrer"
    );
  };
  // useEffect(() => { }, [toDoListReducer.ToDoDetails]);

  useEffect(() => {
    if (
      postAssigneeComments.ResponseMessage !== "" &&
      postAssigneeComments !== undefined &&
      postAssigneeComments.ResponseMessage !== "Comment added successfully"
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
          onHide={() => {
            setViewFlagToDo(false);
            dispatch(emptyCommentState());
          }}
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
                  <Row className="view_todo_assignees">
                    {TaskAssignedTo.length > 0 && todoCreator !== null ? (
                      <>
                        {TaskAssignedTo.map((assgineeData, index) => {
                          if (
                            Number(
                              toDoListReducer.ToDoDetails.taskCreator.pK_UID
                            ) === Number(createrID)
                          ) {
                            return (
                              <Col sm={12} md={12} lg={12}>
                                <TodoAssgineeEmployeeCard
                                  employeeName={assgineeData.name}
                                  employeeDesignation={assgineeData.designation}
                                  cardText={assgineeData.datetimeFormating}
                                  cardTextIconStyle="DateTimeViewTodo"
                                  userImage={assgineeData.displayProfilePicture}
                                />
                              </Col>
                            );
                          } else {
                            if (
                              Number(assgineeData.pK_UID) === Number(createrID)
                            ) {
                              return (
                                <Col sm={12} md={12} lg={12}>
                                  <TodoAssgineeEmployeeCard
                                    employeeName={assgineeData.name}
                                    employeeDesignation={
                                      assgineeData.designation
                                    }
                                    cardText={assgineeData.datetimeFormating}
                                    cardTextIconStyle="DateTimeViewTodo"
                                    userImage={
                                      assgineeData.displayProfilePicture
                                    }
                                  />
                                </Col>
                              );
                            }
                          }
                        })}
                      </>
                    ) : null}
                  </Row>
                </Col>
              </Row>
              {/* Render Assignee Task */}
              <Row className="taskcreatorinfo">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="MontserratSemiBold-600 todo-modal-title Saved_money_Tagline"
                >
                  <p className="Modal-todo-view1">{task.Title}</p>
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="MontserratRegular todo-modal-content FontArabicRegular"
                >
                  <p className="Modal-todo-view-discription1">
                    {task.Description}{" "}
                  </p>
                </Col>
              </Row>
              {/* Render Assignee Comments */}
              <Row className="comment-Height" id="commentviews">
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
                                labelClassName="MontserratSemiBold-600 d-flex justify-content-start  fw-bold "
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
                                labelClassName="MontserratSemiBold-600 d-flex justify-content-start mx-2 "
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
              </Row>

              {/* Post Comments  */}
              <Row className="mt-3">
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
                      labelClass={"d-none"}
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
              </Row>
              {/* File Attachments */}
              <Row className="my-3">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="MontserratSemiBold-600 Saved_money_Tagline"
                >
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
                            <Col
                              sm={12}
                              lg={2}
                              md={2}
                              className="fileIconBoxView"
                              // onClick={(e) =>
                              //   downloadClick(e, modalviewAttachmentFiles)
                              // }
                            >
                              {ext === "doc" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"docx"}
                                    size={78}
                                    type={"document"}
                                    labelColor={"rgba(44, 88, 152)"}
                                  />
                                </span>
                              ) : ext === "docx" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"docx"}
                                    size={78}
                                    type={"font"}
                                    labelColor={"rgba(44, 88, 152)"}
                                  />
                                </span>
                              ) : ext === "xls" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"xls"}
                                    type={"spreadsheet"}
                                    size={78}
                                    labelColor={"rgba(16, 121, 63)"}
                                  />
                                </span>
                              ) : ext === "xlsx" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"xls"}
                                    type={"spreadsheet"}
                                    size={78}
                                    labelColor={"rgba(16, 121, 63)"}
                                  />
                                </span>
                              ) : ext === "pdf" ? (
                                // <Link
                                //   to={`/DisKus/documentViewer?pdfData=${encodeURIComponent(
                                //     pdfDataJson
                                //   )}`}
                                //   target="_blank"
                                //   onClick={}
                                //   rel="noopener noreferrer"
                                // >

                                <span
                                  onClick={() => handleLinkClick(pdfDataJson)}
                                >
                                  <FileIcon
                                    extension={"pdf"}
                                    size={78}
                                    {...defaultStyles.pdf}
                                  />
                                </span>
                              ) : // </Link>
                              ext === "png" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"png"}
                                    size={78}
                                    type={"image"}
                                    labelColor={"rgba(102, 102, 224)"}
                                  />
                                </span>
                              ) : ext === "txt" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"txt"}
                                    size={78}
                                    type={"document"}
                                    labelColor={"rgba(52, 120, 199)"}
                                  />
                                </span>
                              ) : ext === "jpg" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"jpg"}
                                    size={78}
                                    type={"image"}
                                    labelColor={"rgba(102, 102, 224)"}
                                  />
                                </span>
                              ) : ext === "jpeg" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"jpeg"}
                                    size={78}
                                    type={"image"}
                                    labelColor={"rgba(102, 102, 224)"}
                                  />
                                </span>
                              ) : ext === "gif" ? (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={"gif"}
                                    size={78}
                                    {...defaultStyles.gif}
                                  />
                                </span>
                              ) : (
                                <span
                                  onClick={() =>
                                    handleClickDownloadFile(
                                      modalviewAttachmentFiles.OriginalAttachmentName,
                                      modalviewAttachmentFiles.DisplayAttachmentName
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <FileIcon
                                    extension={ext}
                                    size={78}
                                    {...defaultStyles.ext}
                                  />
                                </span>
                              )}
                              <p
                                className="todoModalFileAttach FontArabicRegular"
                                title={
                                  modalviewAttachmentFiles.DisplayAttachmentName
                                }
                              >
                                {first}
                              </p>
                            </Col>
                          );
                        }
                      )
                    : null}
                </Col>
              </Row>
              <Row>
                <Col
                  className="d-flex justify-content-end"
                  sm={12}
                  md={12}
                  lg={12}
                >
                  <Button
                    className={"cancelButton_createTodo"}
                    onClick={() => setViewFlagToDo(false)}
                    text="Close"
                  />
                </Col>
              </Row>
            </>
          }
          // ModalFooter = {() }
        />
      </Container>
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default ModalViewToDo;
