import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "../actions/Auth_action";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import {
  createToDoList,
  getAllAssigneesToDoList,
  getToDoListByToDoListID,
  getToDoListByUserID,
  updateToDoList,
  searchTodoList,
  getWeekToDo,
  searchTodoListRequestMethod,
  DeleteCommentRM,
} from "../../commen/apis/Api_config";

const ShowNotification = (message) => {
  console.log("message", message);
  return {
    type: actions.SHOW,
    message: message,
  };
};

const HideNotificationTodo = () => {
  return {
    type: actions.HIDE,
  };
};

const toDoListLoaderStart = () => {
  return {
    type: actions.GET_TODOLIST_LOADER_START,
  };
};

const toDoFail = (message) => {
  return {
    type: actions.GET_TODO_FAIL,
    message: message,
  };
};

const SetSpinnersTrue = () => {
  return {
    type: actions.SET_SPINNER_TRUE,
  };
};

const SetSpinnerFalse = () => {
  return {
    type: actions.SET_SPINNER_FALSE,
  };
};

const SetTableSpinnerFalse = () => {
  return {
    type: actions.SET_TABLESPINNER_FALSE,
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

//CLear State
const clearState = () => {
  return {
    type: actions.CLEAR_STATE,
  };
};

//Get To-Do List
const getTodoListInit = () => {
  return {
    type: actions.GET_TODOLIST_INIT,
  };
};

const getTodoListSuccess = (response, message) => {
  return {
    type: actions.GET_TODOLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const getTodoListFail = (message) => {
  return {
    type: actions.GET_TODOLIST_FAIL,
    message: message,
  };
};

//get todolist api
const GetTodoListByUser = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getTodoListInit());
    let form = new FormData();
    form.append("RequestMethod", getToDoListByUserID.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(GetTodoListByUser(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByUserID_01".toLowerCase()
                )
            ) {
              await dispatch(
                getTodoListSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByUserID_02".toLowerCase()
                )
            ) {
              await dispatch(getTodoListFail(t("No-records-found")));
              await dispatch(SetTableSpinnerFalse());
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByUserID_03".toLowerCase()
                )
            ) {
              await dispatch(getTodoListFail(t("Something-went-wrong")));
              await dispatch(SetTableSpinnerFalse());
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(getTodoListFail(t("Something-went-wrong")));
            await dispatch(SetTableSpinnerFalse());
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(getTodoListFail(t("Something-went-wrong")));
          await dispatch(SetTableSpinnerFalse());
          await dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(getTodoListFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
        dispatch(SetLoaderFalse());
      });
  };
};

// get TodoList Data from Socket
const setTodoListActivityData = (response) => {
  console.log("todoData", response);
  return {
    type: actions.SETTODO_RECENT_ACTIVITY_DATA,
    response: response,
  };
};
// get TodoStatusData from Socket
const setTodoStatusDataFormSocket = (response) => {
  console.log("responseresponse", response);
  return {
    type: actions.SET_TODO_STATUS_DATA,
    response: response,
  };
};
//Creating A ToDoList

const CreateToDoList = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let meetingPage = JSON.parse(localStorage.getItem("todoListPage"));
  let meetingRow = JSON.parse(localStorage.getItem("todoListRow"));
  //Data For ToDoList
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let dataForList = {
    Date: "",
    Title: "",
    AssignedToName: "",
  };
  return (dispatch) => {
    dispatch(toDoListLoaderStart());
    let form = new FormData();
    form.append("RequestMethod", createToDoList.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
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
          dispatch(CreateToDoList(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateToDoList_01".toLowerCase()
                )
            ) {
              await dispatch(
                ShowNotification(t("The-record-has-been-saved-successfully"))
              );
              await dispatch(
                SearchTodoListApi(
                  navigate,
                  dataForList,
                  meetingPage,
                  meetingRow,
                  t
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateToDoList_02".toLowerCase()
                )
            ) {
              await dispatch(ShowNotification(t("No-record-save")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateToDoList_03".toLowerCase()
                )
            ) {
              await dispatch(toDoFail(t("Something-went-wrong")));
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(toDoFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(toDoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(toDoFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

//Get All Assignees
//GetAllAssigneesSuccess
const GetAllAssigneesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_ASSIGNEES_SUCCESS,
    response: response,
    message: message,
  };
};
//PendingForApprovalSuccess
const GetAllAssigneesFail = (message) => {
  return {
    type: actions.GET_ALL_ASSIGNEES_FAIL,
    message: message,
  };
};

//  pending for deletion for qm

const GetAllAssigneesToDoList = (navigate, object, t, check) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    // UserID: id,
    OrganizationID: OrganizationID,
  };
  return (dispatch) => {
    // dispatch(toDoListLoaderStart());
    let form = new FormData();
    form.append("RequestMethod", getAllAssigneesToDoList.RequestMethod);
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
        console.log("RefreshToken", response.data.responseCode);

        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllAssigneesToDoList(navigate, object, t, check));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllAssignees_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAllAssigneesSuccess(
                  response.data.responseResult.user,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllAssignees_02".toLowerCase()
                )
            ) {
              await dispatch(GetAllAssigneesFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAllAssignees_03".toLowerCase()
                )
            ) {
              await dispatch(GetAllAssigneesFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(GetAllAssigneesFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(GetAllAssigneesFail(t("Something-went-wrong")));
          await dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(GetAllAssigneesFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

const ViewToDoSuccess = (response) => {
  return {
    type: actions.VIEW_TODO_SUCCESS,
    response: response,
  };
};

const ViewToDoFail = (message) => {
  return {
    type: actions.VIEW_TODO_FAIL,
    message: message,
  };
};

//View To-Do

const ViewToDoList = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(toDoListLoaderStart());
    let form = new FormData();
    form.append("RequestMethod", getToDoListByToDoListID.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
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
          dispatch(ViewToDoList(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByToDoListID_01".toLowerCase()
                )
            ) {
              await dispatch(ShowNotification(t("Record-found")));
              await dispatch(ViewToDoSuccess(response.data.responseResult));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByToDoListID_02".toLowerCase()
                )
            ) {
              await dispatch(ViewToDoFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByToDoListID_03".toLowerCase()
                )
            ) {
              await dispatch(ViewToDoFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(ViewToDoFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(ViewToDoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(ViewToDoFail(t("Something-went-wrong")));
      });
  };
};

//Update To-Do List
const UpdateToDoList = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: parseInt(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(toDoListLoaderStart());
    let form = new FormData();
    form.append("RequestMethod", updateToDoList.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("UpdateToDoList", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateToDoList(navigate, object, t));
        } else if (response.data.responseCode === 200) {
          console.log("UpdateToDoList TrueResponse", response);
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateToDoList_01".toLowerCase()
                )
            ) {
              await dispatch(
                ShowNotification(t("The-record-has-been-updated-successfully"))
              );
              await dispatch(GetTodoListByUser(navigate, dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateToDoList_02".toLowerCase()
                )
            ) {
              await dispatch(toDoFail(t("No-record-has-been-updated")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_UpdateToDoList_03".toLowerCase()
                )
            ) {
              await dispatch(toDoFail(t("Something-went-wrong")));
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(toDoFail(t("Something-went-wrong")));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(toDoFail(t("Something-went-wrong")));
          await dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(toDoFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

// search todolist
//get todolist api
const searchTodoListByUser = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getTodoListInit());
    let form = new FormData();
    form.append("RequestMethod", searchTodoList.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(searchTodoListByUser(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_01".toLowerCase()
                )
            ) {
              await dispatch(
                getTodoListSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_02".toLowerCase()
                )
            ) {
              await dispatch(getTodoListFail(t("No-records-found")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_03".toLowerCase()
                )
            ) {
              await dispatch(getTodoListFail(t("Something-went-wrong")));
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(getTodoListFail(t("Something-went-wrong")));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(getTodoListFail(t("Something-went-wrong")));
          await dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        dispatch(getTodoListFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

//Todo Count
const getWeeklyToDoCountSuccess = (response, message) => {
  return {
    type: actions.GET_TODOCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

const getWeeklyToDoCountFail = (message) => {
  return {
    type: actions.GET_TODOCOUNT_FAIL,
    message: message,
  };
};

//Get Week meetings
const GetWeeklyToDoCount = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SetSpinnersTrue());
    let form = new FormData();
    form.append("RequestMethod", getWeekToDo.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(GetWeeklyToDoCount(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetNumberOfToDoListInWeekByUserIDAndDate_01".toLowerCase()
                )
            ) {
              await dispatch(
                getWeeklyToDoCountSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              await dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetNumberOfToDoListInWeekByUserIDAndDate_02".toLowerCase()
                )
            ) {
              await dispatch(getWeeklyToDoCountFail(t("No-records-found")));
              await dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetNumberOfToDoListInWeekByUserIDAndDate_03".toLowerCase()
                )
            ) {
              await dispatch(getWeeklyToDoCountFail(t("Something-went-wrong")));
              await dispatch(SetSpinnerFalse());
            }
          } else {
            await dispatch(getWeeklyToDoCountFail(t("Something-went-wrong")));
            dispatch(SetSpinnerFalse());
          }
        } else {
          await dispatch(getWeeklyToDoCountFail(t("Something-went-wrong")));
          dispatch(SetSpinnerFalse());
        }
      })
      .catch((response) => {
        dispatch(getWeeklyToDoCountFail(t("Something-went-wrong")));
        dispatch(SetSpinnerFalse());
      });
  };
};

const searchTodoList_init = () => {
  return {
    type: actions.SEARCH_TODOLIST_INIT,
  };
};
const searchTodoList_success = (response, message) => {
  return {
    type: actions.SEARCH_TODOLIST_SUCCESS,
    response: response,
    message: message,
  };
};
const searchTodoList_fail = (message) => {
  return {
    type: actions.SEARCH_TODOLIST_FAIL,
    message: message,
  };
};

const SearchTodoListApi = (navigate, searchData, page, size, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let meetingPage = JSON.parse(localStorage.getItem("todoListPage"));
  let meetingRow = JSON.parse(localStorage.getItem("todoListRow"));
  let Data = {
    Date:
      searchData !== null && searchData !== undefined ? searchData?.Date : "",
    Title:
      searchData !== null && searchData !== undefined ? searchData?.Title : "",
    AssignedToName:
      searchData !== null && searchData !== undefined
        ? searchData?.AssignedToName
        : "",
    UserID: JSON.parse(createrID),
    PageNumber: page !== null && page !== undefined ? JSON.parse(page) : 1,
    Length: size !== null && size !== undefined ? JSON.parse(size) : 50,
  };

  return (dispatch) => {
    dispatch(searchTodoList_init());
    let form = new FormData();
    form.append("RequestMethod", searchTodoListRequestMethod.RequestMethod);
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
          dispatch(SearchTodoListApi(navigate, searchData, page, size, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_01".toLowerCase()
                )
            ) {
              dispatch(
                searchTodoList_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_02".toLowerCase()
                )
            ) {
              dispatch(searchTodoList_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SearchToDoList_03".toLowerCase()
                )
            ) {
              dispatch(searchTodoList_fail(t("No-records-found")));
            } else {
              dispatch(searchTodoList_fail(t("No-records-found")));
            }
          } else {
            dispatch(searchTodoList_fail(t("No-records-found")));
          }
        } else {
          dispatch(searchTodoList_fail(t("No-records-found")));
        }
      })
      .catch((error) => {
        dispatch(searchTodoList_fail(t("No-records-found")));
      });
  };
};

const deleteComment_init = () => {
  return {
    type: actions.DELETE_TODO_COMMENT_INIT,
  };
};
const deleteComment_success = (response, message) => {
  return {
    type: actions.DELETE_TODO_COMMENT_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteComment_fail = (message) => {
  return {
    type: actions.DELETE_TODO_COMMENT_FAIL,
    message: message,
  };
};

const deleteCommentApi = (navigate, t, commmentID, taskID) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let Data = {
    PK_TCID: Number(commmentID),
    FK_TID: Number(taskID),
    FK_UID: Number(createrID),
  };
  // let newData = { ToDoListID: taskID }
  return (dispatch) => {
    // dispatch(deleteComment_init());
    let form = new FormData();
    form.append("RequestMethod", DeleteCommentRM.RequestMethod);
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
          dispatch(deleteCommentApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteComment_01".toLowerCase()
                )
            ) {
              await dispatch(
                deleteComment_success(
                  response.data.responseResult,
                  t("Comment-Deleted")
                )
              );
              // dispatch(ViewToDoList(navigate, newData, t))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteComment_02".toLowerCase()
                )
            ) {
              dispatch(deleteComment_fail(t("Comment-Not-Deleted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteComment_03".toLowerCase()
                )
            ) {
              dispatch(deleteComment_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteComment_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteComment_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteComment_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteComment_fail(t("Something-went-wrong")));
      });
  };
};
const TodoCounter = (response) => {
  return {
    type: actions.RECENT_TODOCOUNTER,
    response: response,
  };
};
//CLear State
const clearResponce = () => {
  return {
    type: actions.CLEAR_RESPONCE_STATE,
  };
};

export {
  CreateToDoList,
  GetAllAssigneesToDoList,
  ViewToDoList,
  GetTodoListByUser,
  UpdateToDoList,
  clearState,
  searchTodoListByUser,
  GetWeeklyToDoCount,
  HideNotificationTodo,
  setTodoListActivityData,
  setTodoStatusDataFormSocket,
  clearResponce,
  TodoCounter,
  SearchTodoListApi,
  getTodoListInit,
  SetSpinnersTrue,
  deleteCommentApi,
};
