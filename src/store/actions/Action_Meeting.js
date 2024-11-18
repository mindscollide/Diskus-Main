import * as actions from "../action_types";
import { toDoListApi, dataRoomApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import {
  getMeetingTasksAction,
  uploadDocumentsRequestMethod,
  mapTaskWithMeetingAgenda,
  saveTaskandAssgineesRM,
  saveTaskDocuments,
  removeTaskMeetingMapping,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { showCancelActions } from "./NewMeetingActions";
// get Meeting By Group ID Init
const getMeetingTask_Init = () => {
  return {
    type: actions.GET_MEETING_TASKS_ACTION_INIT,
  };
};
// get Meeting by Group ID Success
const getMeetingTask_Success = (response, message) => {
  return {
    type: actions.GET_MEETING_TASKS_ACTION_SUCCESS,
    response: response,
    message: message,
  };
};
// get Meeting by Group ID Failed
const getMeetingTask_Fail = (message) => {
  return {
    type: actions.GET_MEETING_TASKS_ACTION_FAIL,
    message: message,
  };
};

// Get Meeting by Group ID
const getMeetingTaskMainApi = (navigate, t, meetingTaskData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingTask_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(meetingTaskData));
    form.append("RequestMethod", getMeetingTasksAction.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetMeetingTasks_01".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingTask_Success(
                  response.data.responseResult,
                  ""
                )
              );
              dispatch(showCancelActions(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetMeetingTasks_02".toLowerCase()
                )
            ) {
              dispatch(getMeetingTask_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetMeetingTasks_03".toLowerCase()
                )
            ) {
              dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
            } else {
              dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
      });
  };
};

// Action meeeting init
const actionMeetingInit = () => {
  return {
    type: actions.UPLOAD_DOCUMENT_ACTION_INIT,
  };
};

//Action meeting success
const actionMeetingSuccess = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_ACTION_SUCCESS,
    response: response,
    message: message,
  };
};

//Action meeting fail
const actionMeetingFail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_ACTION_FAIL,
    message: message,
  };
};

//Action meeting Upload document Api
const uploadActionMeetingApi = (
  navigate,
  t,
  data,
  dataroomMapFolderId,
  newFolder
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
    dispatch(actionMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    form.append("File", data);
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadActionMeetingApi(
              navigate,
              t,
              data,
              dataroomMapFolderId,
              newFolder
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                )
            ) {
              dispatch(actionMeetingSuccess(response.data.responseResult, ""));
              newFolder.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
              // await dispatch(
              //   saveFilesTaskApi(
              //     navigate,
              //     t,
              //     response.data.responseResult,
              //     dataroomMapFolderId,
              //     newFolder
              //   )
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(actionMeetingFail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(actionMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(actionMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(actionMeetingFail(t("Something-went-wrong")));
        }
        // }
      })
      .catch((error) => {
        dispatch(actionMeetingFail(t("Something-went-wrong")));
      });
  };
};

// map task with meeting agenda Init
const mapTaskAgendaInit = () => {
  return {
    type: actions.MAP_TASK_MEETING_AGENDA_INIT,
  };
};

// map task with meeting agenda Success
const mapTaskAgendaSuccess = (response, message) => {
  return {
    type: actions.MAP_TASK_MEETING_AGENDA_SUCCESS,
    response: response,
    message: message,
  };
};

// map task with meeting agenda Fail
const mapTaskAgendaFail = (message) => {
  return {
    type: actions.MAP_TASK_MEETING_AGENDA_FAIL,
    message: message,
  };
};

const mapTaskAgendaMainApi = (
  navigate,
  t,
  mapTaskData,
  setCreateaTask,
  setCreateTaskID
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");

  return (dispatch) => {
    dispatch(mapTaskAgendaInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(mapTaskData));
    form.append("RequestMethod", mapTaskWithMeetingAgenda.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            mapTaskAgendaMainApi(
              navigate,
              t,
              mapTaskData,
              setCreateaTask,
              setCreateTaskID
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_MapTaskWithMeetingAndAgenda_01".toLowerCase()
                )
            ) {
              dispatch(
                mapTaskAgendaSuccess(
                  response.data.responseResult.responseMessage,
                  t("Data-inserted-successfully")
                )
              );
              let Data = {
                MeetingID: Number(mapTaskData.MeetingID),
                Date: "",
                Title: "",
                AssignedToName: "",
                UserID: Number(creatorID),
                PageNumber: 1,
                Length: 50,
              };
              dispatch(getMeetingTaskMainApi(navigate, t, Data));
              setCreateaTask(false);
              setCreateTaskID(0);
              // setShow(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_MapTaskWithMeetingAndAgenda_02".toLowerCase()
                )
            ) {
              dispatch(mapTaskAgendaFail(t("Failed-to-insert-record")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_MapTaskWithMeetingAndAgenda_03".toLowerCase()
                )
            ) {
              dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
            } else {
              dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
      });
  };
};

// Save Document and Assignees
const saveTaskDocumentsAndAssignees_init = () => {
  return {
    type: actions.SAVETASKDOCUMENTSANDASSIGNEES_INIT,
  };
};
const saveTaskDocumentsAndAssignees_success = (response, message) => {
  return {
    type: actions.SAVETASKDOCUMENTSANDASSIGNEES_SUCCESS,
    response: response,
    message: message,
  };
};
const saveTaskDocumentsAndAssignees_fail = (message) => {
  return {
    type: actions.SAVETASKDOCUMENTSANDASSIGNEES_FAIL,
    message: message,
  };
};
const saveTaskDocumentsAndAssigneesApi = (
  navigate,
  Data,
  t,
  value,
  setShow,
  newData,
  setCreateTaskID
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(saveTaskDocumentsAndAssignees_init());
    let form = new FormData();
    form.append("RequestMethod", saveTaskandAssgineesRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            saveTaskDocumentsAndAssigneesApi(
              navigate,
              Data,
              t,
              value,
              setShow,
              newData,
              setCreateTaskID
            )
          );
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ToDoList_ToDoListServiceManager_SaveTaskDocumentsAndAssignees_01".toLowerCase()
              )
          ) {
            dispatch(
              saveTaskDocumentsAndAssignees_success(
                response.data.responseResult,
                ""
              )
            );
            let NewData = {
              ToDoID: Number(Data.TaskID),
              UpdateFileList: Data.TasksAttachments.map((data, index) => {
                return { PK_FileID: Number(data.OriginalAttachmentName) };
              }),
            };
            dispatch(
              saveMeetingActionsDocuments(
                navigate,
                NewData,
                t,
                value,
                setShow,
                newData,
                setCreateTaskID
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ToDoList_ToDoListServiceManager_SaveTaskDocumentsAndAssignees_02".toLowerCase()
              )
          ) {
            dispatch(saveTaskDocumentsAndAssignees_fail(t("No-record-save")));
            setCreateTaskID(0);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ToDoList_ToDoListServiceManager_SaveTaskDocumentsAndAssignees_03".toLowerCase()
              )
          ) {
            dispatch(
              saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong"))
            );
            setCreateTaskID(0);
          } else {
            dispatch(
              saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong"))
            );
            setCreateTaskID(0);
          }
        } else {
          dispatch(
            saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong"))
          );
          setCreateTaskID(0);
        }
      })
      .catch((error) => {
        dispatch(saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong")));
        setCreateTaskID(0);
      });
  };
};

// Save documents Api
const saveTaskDocuments_init = () => {
  return {
    type: actions.SAVE_TASK_DOCUMENTS_INIT,
  };
};

const saveTaskDocuments_success = (response, message) => {
  return {
    type: actions.SAVE_TASK_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const saveTaskDocuments_fail = (message) => {
  return {
    type: actions.SAVE_TASK_DOCUMENTS_FAIL,
    message: message,
  };
};

const saveMeetingActionsDocuments = (
  navigate,
  Data,
  t,
  value,
  setCreateaTask,
  newData,
  setCreateTaskID,
  currentMeeting
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(saveTaskDocuments_init());
    let form = new FormData();
    form.append("RequestMethod", saveTaskDocuments.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            saveMeetingActionsDocuments(
              navigate,
              Data,
              t,
              value,
              setCreateaTask,
              newData,
              setCreateTaskID,
              currentMeeting
            )
          );
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_SaveToDoDocuments_01".toLowerCase()
              )
          ) {
            dispatch(
              saveTaskDocuments_success(
                response.data.responseResult,
                t("Update-successful")
              )
            );

            // Create Task from Meeting Actions
            if (value === 7) {
              dispatch(
                mapTaskAgendaMainApi(
                  navigate,
                  t,
                  newData,
                  setCreateaTask,
                  setCreateTaskID
                )
              );
              setCreateTaskID(0);
            }
            // Delete Task from Meetin Actions
            if (value === 8) {
              let dataDelete = {
                TaskID: Data.ToDoID,
                MeetingID: Number(currentMeeting),
              };
              dispatch(removeMapMainApi(navigate, t, dataDelete));
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_SaveToDoDocuments_02".toLowerCase()
              )
          ) {
            dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
            setCreateTaskID(0);
          } else {
            dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
            setCreateTaskID(0);
          }
        } else {
          dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
          setCreateTaskID(0);
        }
      })
      .catch(() => {
        dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
        setCreateTaskID(0);
      });
  };
};

// map task with meeting agenda Init
const removeMapTaskInit = () => {
  return {
    type: actions.REMOVE_TASK_MEETING_MAP_INIT,
  };
};

// map task with meeting agenda Success
const removeMapTaskSuccess = (message) => {
  return {
    type: actions.REMOVE_TASK_MEETING_MAP_SUCCESS,
    message: message,
  };
};

// map task with meeting agenda Fail
const removeMapTaskFail = (message) => {
  return {
    type: actions.REMOVE_TASK_MEETING_MAP_FAIL,
    message: message,
  };
};

const removeMapMainApi = (navigate, t, dataDelete) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(removeMapTaskInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(dataDelete));
    form.append("RequestMethod", removeTaskMeetingMapping.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(removeMapMainApi(navigate, t, dataDelete));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_RemoveTaskMeetingMapping_01".toLowerCase()
                )
            ) {
              dispatch(removeMapTaskSuccess(t("Delete-successfully")));

              let userID = localStorage.getItem("userID");
              let meetingpageRow = localStorage.getItem("MeetingPageRows");
              let meetingPageCurrent = 
                localStorage.getItem("MeetingPageCurrent"
              );
              let meetingTaskData = {
                MeetingID: Number(dataDelete.MeetingID),
                Date: "",
                Title: "",
                AssignedToName: "",
                UserID: Number(userID),
                PageNumber:
                  meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
                Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
              };
              dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_RemoveTaskMeetingMapping_02".toLowerCase()
                )
            ) {
              dispatch(removeMapTaskFail(t("Failed-to-delete-record")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_RemoveTaskMeetingMapping_03".toLowerCase()
                )
            ) {
              dispatch(removeMapTaskFail(t("Something-went-wrong")));
            } else {
              dispatch(removeMapTaskFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(removeMapTaskFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(removeMapTaskFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(removeMapTaskFail(t("Something-went-wrong")));
      });
  };
};

export {
  getMeetingTaskMainApi,
  uploadActionMeetingApi,
  mapTaskAgendaMainApi,
  saveTaskDocumentsAndAssigneesApi,
  removeMapMainApi,
  saveMeetingActionsDocuments,
  getMeetingTask_Fail,
};
