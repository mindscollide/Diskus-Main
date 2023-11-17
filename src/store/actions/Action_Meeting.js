import * as actions from "../action_types";
import { toDoListApi, dataRoomApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import {
  getMeetingTasksAction,
  uploadDocumentsRequestMethod,
  mapTaskWithMeetingAgenda,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { saveFilesTaskApi } from "./ToDoList_action";
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
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetMeetingTasks_01".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingTask_Success(
                  response.data.responseResult.toDoLists,
                  t("Data-Available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetMeetingTasks_02".toLowerCase()
                )
            ) {
              dispatch(getMeetingTask_Fail(t("No-Data-Available")));
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
            console.log(response, "response");
            dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(getMeetingTask_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
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
              await dispatch(
                saveFilesTaskApi(
                  navigate,
                  t,
                  response.data.responseResult,
                  dataroomMapFolderId,
                  newFolder
                )
              );
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

const mapTaskAgendaMainApi = (navigate, t, mapTaskData) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(mapTaskAgendaMainApi(navigate, t, mapTaskData));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
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
            console.log(response, "response");
            dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(mapTaskAgendaFail(t("Something-went-wrong")));
      });
  };
};

export { getMeetingTaskMainApi, uploadActionMeetingApi, mapTaskAgendaMainApi };
