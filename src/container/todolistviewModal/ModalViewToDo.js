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

import { useDispatch, useSelector } from "react-redux";
import {
  postAssgineeComment,
  HideNotificationTodoComment,
} from "../../store/actions/Post_AssigneeComments";
import { DownloadFile } from "../../store/actions/Download_action";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const ModalViewToDo = ({ viewFlagToDo, setViewFlagToDo, ModalTitle }) => {
  //For Localization
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");

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
  let changeDateFormat = moment(currentDateTime).utc();
  let convertFormation = moment(changeDateFormat).format("YYYYMMDDHHmmss");
  console.log(
    newTimeFormaterAsPerUTCFullDate(convertFormation),
    changeDateFormat,
    convertFormation,
    "changeDateFormatchangeDateFormatchangeDateFormat"
  );
  const year = currentDateTime.getFullYear();
  const month = (currentDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDateTime.getDate().toString().padStart(2, "0");
  const hour = currentDateTime.getHours().toString().padStart(2, "0");
  const minute = currentDateTime.getMinutes().toString().padStart(2, "0");
  const second = currentDateTime.getSeconds().toString().padStart(2, "0");
  console.log("currentDateTimecurrentDateTimecurrentDateTime", currentDateTime);
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
  const [taskAssignedName, setTaskAssignedName] = useState([]);
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
    setTaskCreatorID(parseInt(createrID));
  }, []);
  useEffect(() => {
    todoComments.current?.scrollIntoView({ behavior: "smooth" });
  }, [taskAssigneeComments, assgineeComments]);

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
      if (viewData.taskAssignedTo !== undefined) {
        viewData.taskAssignedTo.map((data, index) => {
          console.log("taskAssignedToMap", data);
          if (data.pK_UID === TaskAssignedTo) {
            console.log("Mapping Answer", data.name);
          }
        });
      }
      let listOfAssignees = toDoListReducer.ToDoDetails.taskAssignedTo;
      console.log("listOfAssigneeslistOfAssignees", listOfAssignees);
      if (listOfAssignees !== undefined) {
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
            displayProfilePicture: data.displayProfilePictureName,
            datetimeFormating:
              newTimeFormaterAsPerUTCFullDate(deadlineDateTime),
          });
        });
        console.log("assigneedetailsassigneedetails", assigneedetails);
        setTaskAssignedTo(assigneedetails);
        setTaskAssignedName(tem);
      }
      let filesUploaded = toDoListReducer.ToDoDetails.taskAttachments;
      if (filesUploaded !== undefined) {
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
      if (assgineeeComments !== undefined) {
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
      let findNewIndex = taskAssigneeComments.findIndex(
        (data, index) => data.taskCommentID === 0
      );
      if (findNewIndex !== -1) {
        let newArr = taskAssigneeComments.map((comments, index) => {
          if (index === findNewIndex) {
            const newData = {
              ...comments,
              taskCommentID: Number(Comments.pK_TCID),
            };
            return newData;
          }
          return comments;
        });
        setTaskAssigneeComments(newArr);
      } else {
        let newComment = {
          userID: parseInt(Comments.fK_UID),
          TaskID: parseInt(Comments.fK_TID),
          Comment: Comments.comment,
          taskCommentID: Number(Comments.pK_TCID),
          taskCommentUserName: Comments.userName,
          DateTime: Comments.dateTime,
        };
        setTaskAssigneeComments([...taskAssigneeComments, newComment]);
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
        let commentsData = [...taskAssigneeComments];
        let deleteComments = commentsData.filter(
          (data, index) =>
            data.taskCommentID !==
            postAssigneeComments.DeleteCommentsId.commentID
        );
        setTaskAssigneeComments(deleteComments);
      }
    }
  }, [postAssigneeComments.DeleteCommentsId]);

  console.log(
    postAssigneeComments,
    "DeleteCommentsIdDeleteCommentsIdDeleteCommentsId"
  );
  // for comment update
  useEffect(() => {}, [taskAssigneeComments]);

  //Get All Assignees API hit
  useEffect(() => {
    if (viewFlagToDo) {
      dispatch(GetAllAssigneesToDoList(navigate, 1, t));
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
    dispatch(DownloadFile(navigate, data));
  };

  const handleClickCommentSubmit = async (e, id) => {
    e.preventDefault();
    if (assgineeComments !== "" && assgineeComments.trim() !== "") {
      let commentData = {
        PK_TCID: 1,
        Comment: assgineeComments,
        FK_TID: id,
        FK_UID: Number(TaskCreatorID),
        DateTime: "",
      };
      await dispatch(postAssgineeComment(navigate, commentData, t));
      let newComment = {
        userID: parseInt(TaskCreatorID),
        TaskID: parseInt(id),
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
  // useEffect(() => { }, [toDoListReducer.ToDoDetails]);

  console.log("postAssigneeComments", postAssigneeComments);

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
                                  userImage={assgineeData.displayProfilePicture}
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
                      console.log(
                        "commentDatacommentData",
                        Number(commentData.userID) === Number(createrID),
                        commentData
                      );
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
                              ) : commentData.taskCommentID !== 0 ? (
                                <></>
                              ) : null}
                              <img
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
              <Row className="">
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
                          return (
                            <Col
                              sm={12}
                              lg={2}
                              md={2}
                              className="fileIconBoxView"
                              onClick={(e) =>
                                downloadClick(e, modalviewAttachmentFiles)
                              }
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
                              <p className="todoModalFileAttach FontArabicRegular">
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
