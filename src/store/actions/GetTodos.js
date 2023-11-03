import * as actions from "../action_types";
import axios from "axios";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import { todosStatus, updateTodoStatus } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { GetTodoListByUser, SearchTodoListApi } from "./ToDoList_action";
import { getTaskCommitteeIDApi } from "./Polls_actions";

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
const updateTodoStatusSuccess = (message, response) => {
  return {
    type: actions.UPDATE_TODOSTATUS_SUCCESS,
    message: message,
    response: response,
  };
};
const updateTodoStatusFail = (message) => {
  return {
    type: actions.UPDATE_TODOSTATUS_FAIL,
    message: message,
  };
};
const getTodoStatus = (navigate, t) => {
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(getTodoStatus(navigate, t));
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
              await dispatch(getTodoStatusFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllTodoStatus_03".toLowerCase()
                )
            ) {
              await dispatch(getTodoStatusFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(getTodoStatusFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getTodoStatusFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getTodoStatusFail(t("Something-went-wrong")));
      });
  };
};

const updateTodoStatusFunc = (navigate, statusID, data, t, flag, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let meetingPage = localStorage.getItem("todoListPage");
  let meetingRow = localStorage.getItem("todoListRow");
  let Data = {
    TaskStatusID: statusID,
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            updateTodoStatusFunc(navigate, statusID, data, t, flag, value)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateTaskStatus_01".toLowerCase()
                )
            ) {
              if (value === 1) {
                await dispatch(
                  updateTodoStatusSuccess(
                    t("The-record-has-been-updated-successfully"),
                    false
                  )
                );
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

                if (ViewCommitteeID !== null) {
                  let newData = {
                    CommitteeID: Number(ViewCommitteeID),
                  };
                  dispatch(getTaskCommitteeIDApi(navigate, t, newData));
                }
              } else {
                if (flag === false) {
                  await dispatch(
                    updateTodoStatusSuccess(
                      t("The-record-has-been-updated-successfully"),
                      false
                    )
                  );
                } else {
                  await dispatch(
                    updateTodoStatusSuccess(
                      t("The-record-has-been-updated-successfully"),
                      true
                    )
                  );
                }
                let data2 = {
                  Date: "",
                  Title: "",
                  AssignedToName: "",
                };
                dispatch(
                  SearchTodoListApi(navigate, data2, meetingPage, meetingRow, t)
                );
              }
              // await dispatch(getTodoStatus(navigate, t));
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
              await dispatch(updateTodoStatusFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(updateTodoStatusFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(updateTodoStatusFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateTodoStatusFail(t("Something-went-wrong")));
      });
  };
};

const cleareMessage = () => {
  return {
    type: actions.GET_CLEAREMESSAGE_GETTODO,
  };
};
export { getTodoStatus, updateTodoStatusFunc, cleareMessage };
