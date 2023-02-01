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
  console.log("gettodoStatus", response);
  return {
    type: actions.GET_TODOSSTATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const getTodoStatusFail = (response, message) => {
  return {
    type: actions.GET_TODOSSTATUS_FAIL,
    response: response,
    message: message,
  };
};
const updateTodoStatusInit = () => {
  return {
    type: actions.UPDATE_TODOSTATUS_INIT,
  };
};
const updateTodoStatusSuccess = (response) => {
  return {
    type: actions.UPDATE_TODOSTATUS_SUCCESS,
    response: response,
  };
};
const updateTodoStatusFail = (response) => {
  return {
    type: actions.UPDATE_TODOSTATUS_FAIL,
    response: response,
  };
};
const getTodoStatus = () => {
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
          await dispatch(RefreshToken());
        } else if (response.data.responseResult.isExecuted === true) {
          console.log(
            "todo Status response if true",
            response.data.responseResult
          );
          await dispatch(
            getTodoStatusSuccess(
              response.data.responseResult.taskStatuses,
              response.data.responseMessage
            )
          );
        } else {
          await dispatch(getTodoStatusFail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(getTodoStatusFail(response.data.responseMessage));
        console.log(response);
      });
  };
};

const updateTodoStatusFunc = (value, data) => {
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
        console.log("todoStatusresponse", response);
        if (response.data.responseResult.isExecuted === true) {
          await dispatch(getTodoStatus());
          await dispatch(
            updateTodoStatusSuccess(
              response.data.responseResult.responseMessage
            )
          );
        } else {
          await dispatch(updateTodoStatusFail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateTodoStatusFail(response.data.responseMessage));
        console.log(response);
      });
  };
};
export { getTodoStatus, updateTodoStatusFunc };
