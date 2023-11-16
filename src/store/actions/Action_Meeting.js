import * as actions from "../action_types";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { getMeetingTasksAction } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

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

export { getMeetingTaskMainApi };
