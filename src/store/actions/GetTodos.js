import * as actions from "../action_types";
import axios from "axios";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import { todosStatus, updateTodoStatus } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

const getTodoStatusInit = () => {
  return {
    type: actions.GET_TODOSSTATUS_INIT,
  };
};

const getTodoStatusSuccess = (response, message) => {
  return {
    type: actions.GET_TODOSSTATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const getTodoStatusFail = (message) => {
  return {
    type: actions.GET_TODOSSTATUS_FAIL,
    message: message,
  };
};
const updateTodoStatusInit = () => {
  return {
    type: actions.UPDATE_TODOSTATUS_INIT,
  };
};
const updateTodoStatusSuccess = (message) => {
  return {
    type: actions.UPDATE_TODOSTATUS_SUCCESS,
    message: message,
  };
};
const updateTodoStatusFail = (message) => {
  return {
    type: actions.UPDATE_TODOSTATUS_FAIL,
    message: message,
  };
};
const getTodoStatus = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getTodoStatusInit());
    let form = new FormData();
    form.append("RequestMethod", todosStatus.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("todo Status response", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(getTodoStatus(t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllTodoStatus_01".toLowerCase()
                )
            ) {
              await dispatch(
                getTodoStatusSuccess(
                  response.data.responseResult.taskStatuses,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllTodoStatus_02".toLowerCase()
                )
            ) {
              await dispatch(getTodoStatusFail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllTodoStatus_03".toLowerCase()
                )
            ) {
              await dispatch(getTodoStatusFail(t("something-went-worng")));
            }
          } else {
            await dispatch(getTodoStatusFail(t("something-went-worng")));
          }
        } else {
          await dispatch(getTodoStatusFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        dispatch(getTodoStatusFail(t("something-went-worng")));
      });
  };
};

const updateTodoStatusFunc = (value, data, t) => {
  console.log(value, data, "updateTodoStatus");
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let Data = {
    TaskStatusID: value,
    TaskID: data,
    UserID: userID,
  };
  return (dispatch) => {
    dispatch(updateTodoStatusInit());
    let form = new FormData();
    form.append("RequestMethod", updateTodoStatus.RequestMethod);
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
          await dispatch(RefreshToken(t));
          dispatch(updateTodoStatusFunc(value, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateTaskStatus_01".toLowerCase()
                )
            ) {
              await dispatch(getTodoStatus(t));
              await dispatch(
                updateTodoStatusSuccess(
                  t("The-record-has-been-updated-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateTaskStatus_02".toLowerCase()
                )
            ) {
              await dispatch(
                updateTodoStatusFail(t("No-record-has-been-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateTaskStatus_03".toLowerCase()
                )
            ) {
              await dispatch(updateTodoStatusFail(t("something-went-worng")));
            }
          } else {
            await dispatch(updateTodoStatusFail(t("something-went-worng")));
          }
        } else {
          await dispatch(updateTodoStatusFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        dispatch(updateTodoStatusFail(t("something-went-worng")));
      });
  };
};
const cleareMessage = () => {
  return {
    type: actions.GET_CLEAREMESSAGE_GETTODO,
  };
};
export { getTodoStatus, updateTodoStatusFunc, cleareMessage };
