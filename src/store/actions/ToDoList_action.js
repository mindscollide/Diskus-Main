import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "../actions/Auth_action";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import {
  createToDoList,
  getAllAssigneesToDoList,
  getToDoListByToDoListID,
  getTodoList,
  updateToDoList,
  searchTodoList,
  getWeekToDo,
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

const toDoFail = (response) => {
  return {
    type: actions.GET_TODO_FAIL,
    response: response,
  };
};

const SetSpinnerTrue = () => {
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
  console.log("todo fail 1234");
  return {
    type: actions.GET_TODOLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const getTodoListFail = (message, response) => {
  console.log("todo fail 1234");
  return {
    type: actions.GET_TODOLIST_FAIL,
    message: message,
    response: response,
  };
};

//get todolist api
const GetTodoListByUser = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getTodoListInit());
    let form = new FormData();
    form.append("RequestMethod", getTodoList.RequestMethod);
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
        console.log("GetTodoListByID", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetTodoListByUser(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(getTodoListSuccess(response.data.responseResult));
          } else {
            console.log("todo fail 1234");
            dispatch(SetTableSpinnerFalse());
            await dispatch(getTodoListFail(response.data.responseResult));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(getTodoListFail(response.data));
          await dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(SetLoaderFalse());
      });
  };
};

// get TodoList Data from Socket
const setTodoListActivityData = (response) => {
  return {
    type: actions.SETTODO_RECENT_ACTIVITY_DATA,
    response: response,
  };
};
// get TodoStatusData from Socket
const setTodoStatusDataFormSocket = (response) => {
  return {
    type: actions.SET_TODO_STATUS_DATA,
    response: response,
  };
};
//Creating A ToDoList
const CreateToDoList = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  //Data For ToDoList
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: parseInt(createrID), NumberOfRecords: 300 };
  console.log("CreateToDoList", object);
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
        console.log("CreateToDoList", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(CreateToDoList(object));
        } else if (response.data.responseCode === 200) {
          console.log("CreateToDoList TrueResponse", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              ShowNotification(response.data.responseResult.responseMessage)
            );
            await dispatch(GetTodoListByUser(dataForList));
            // await dispatch(SetLoaderFalse());
          } else {
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(toDoFail(response.data));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(SetLoaderFalse());
      });
  };
};

//Get All Assignees
//GetAllAssigneesSuccess
const GetAllAssigneesSuccess = (response, message) => {
  console.log("GetAllAssigneesSuccess", response);
  return {
    type: actions.GET_ALL_ASSIGNEES_SUCCESS,
    response: response,
    message: message,
  };
};
//PendingForApprovalSuccess
const GetAllAssigneesFail = (response) => {
  console.log("GetAllAssigneesFail", response);
  return {
    type: actions.GET_ALL_ASSIGNEES_FAIL,
    response: response,
  };
};

//  pending for deletion for qm
const GetAllAssigneesToDoList = (object, check) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("GetAllAssigneesToDoList", object);
  let Data = {
    UserID: object,
  };
  console.log("GetAllAssigneesToDoList ", JSON.stringify(Data));
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
        console.log("GetAllAssigneesToDoList", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetAllAssigneesToDoList(object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              GetAllAssigneesSuccess(response.data.responseResult)
            );
          } else {
            dispatch(GetAllAssigneesFail(response.data.responseResult));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(GetAllAssigneesFail(response.data));
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(toDoFail());
        console.log(response.message);
      });
  };
};

const ViewToDoSuccess = (response) => {
  console.log("ViewMeeting", response);
  return {
    type: actions.VIEW_TODO_SUCCESS,
    response: response,
  };
};

const ViewToDoFail = (response) => {
  return {
    type: actions.VIEW_TODO_FAIL,
    response: response,
  };
};

//View To-Do
const ViewToDoList = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("ViewToDoList", object);
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
        console.log("ViewToDoList", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(ViewToDoList(object));
        } else if (response.data.responseCode === 200) {
          console.log("ViewToDoList", response);
          if (response.data.responseResult.isExecuted === true) {
            console.log("ViewToDoList", response);

            await dispatch(
              ShowNotification(response.data.responseResult.responseMessage)
            );
            console.log("ViewToDoList", response);
            dispatch(ViewToDoSuccess(response.data.responseResult));
            dispatch(SetLoaderFalse());
          } else {
            dispatch(ViewToDoFail(response.data.responseResult));
          }
        } else {
          dispatch(ViewToDoFail(response.data));
        }
      })
      .catch((response) => {
        dispatch(ViewToDoFail());
        console.log(response);
      });
  };
};

//Update To-Do List
const UpdateToDoList = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("CreateToDoList", object);
  //Data For ToDoList
  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: parseInt(createrID), NumberOfRecords: 300 };
  console.log("CreateToDoList", object);
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
          await dispatch(RefreshToken());
          dispatch(UpdateToDoList(object));
        } else if (response.data.responseCode === 200) {
          console.log("UpdateToDoList TrueResponse", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              ShowNotification(response.data.responseResult.responseMessage)
            );
            dispatch(GetTodoListByUser(dataForList));
            // await dispatch(SetLoaderFalse());
          } else {
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(toDoFail(response.data));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(SetLoaderFalse());
      });
  };
};

// search todolist
//get todolist api
const searchTodoListByUser = (data) => {
  console.log("searchTodoListByUser", data);
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
        console.log("searchTodoListByUser", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetTodoListByUser(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(getTodoListSuccess(response.data.responseResult));
          } else {
            await dispatch(getTodoListFail(response.data.responseResult));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(getTodoListFail(response.data));
          await dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
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

const getWeeklyToDoCountFail = (message, response) => {
  return {
    type: actions.GET_TODOCOUNT_FAIL,
    message: message,
    response: response,
  };
};

//Get Week meetings
const GetWeeklyToDoCount = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SetSpinnerTrue());
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
        console.log("GetWeeklyToDoCount", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetWeeklyToDoCount(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getWeeklyToDoCountSuccess(response.data.responseResult)
            );
            dispatch(SetSpinnerFalse());
          } else {
            dispatch(getWeeklyToDoCountFail(response.data.responseResult));
            dispatch(SetSpinnerFalse());
          }
        } else {
          dispatch(getWeeklyToDoCountFail(response.data));
          dispatch(SetSpinnerFalse());
        }
      })
      .catch((response) => {
        console.log(response.message);
        dispatch(SetSpinnerFalse());
      });
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
};
