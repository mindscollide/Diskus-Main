import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "../actions/Auth_action";
import { dataRoomApi, toDoListApi } from "../../commen/apis/Api_ends_points";
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
  deleteCommitteeTaskRM,
  deleteGroupTaskRM,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
  saveTaskandAssgineesRM,
  createupdateTaskDataroom,
  saveTaskDocuments,
} from "../../commen/apis/Api_config";
import {
  getTaskCommitteeIDApi,
  getTasksByGroupIDApi,
  setTasksByCommitteeApi,
  setTasksByGroupApi,
} from "./Polls_actions";
import { updateTodoStatusFunc } from "./GetTodos";

const ClearMappingFolderID = () => {
  return {
    type: actions.TASK_FOLDER_MAPPING_ID,
  };
};
const ShowNotification = (message) => {
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
        dispatch(getTodoListFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
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

const CreateToDoList = (navigate, object, t, setCreateTaskID, value) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
          dispatch(CreateToDoList(navigate, object, t, setCreateTaskID, value));
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
              await dispatch(SetLoaderFalse());

              setCreateTaskID(Number(response.data.responseResult.tid));
              console.log(object, "objectobjectobjectobject");
              console.log(
                response.data.responseResult,
                "objectobjectobjectobject"
              );
              if (value === 1) {
              } else {
                let Data = {
                  ToDoID: Number(response.data.responseResult.tid),
                  ToDoTitle: object.Task.Title,
                  IsUpdateFlow: false,
                  AssigneeList: object.TaskAssignedTo.map(
                    (newData, index) => newData
                  ),
                };
                await dispatch(createUpdateTaskDataRoomApi(navigate, Data, t));
              }
              // if (value === 1) {
              //   let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

              //   let data = {
              //     FK_TID: Number(response.data.responseResult.tid),
              //     CommitteeID: Number(ViewCommitteeID),
              //   };

              //   dispatch(setTasksByCommitteeApi(navigate, t, data));
              // } else if (value === 2) {
              //   let ViewGroupID = localStorage.getItem("ViewGroupID");

              //   let data = {
              //     FK_TID: Number(response.data.responseResult.tid),
              //     GroupID: Number(ViewGroupID),
              //   };
              //   dispatch(setTasksByGroupApi(navigate, t, data));
              // } else if (value === 4) {
              //   setCreateTaskID(Number(response.data.responseResult.tid));
              //   let Data = {
              //     ToDoID: Number(response.data.responseResult.tid),
              //     ToDoTitle: object.Task.Title,
              //     IsUpdateFlow: false,
              //     AssigneeList: object.TaskAssignedTo.map(
              //       (newData, index) => newData
              //     ),
              //   };
              //   dispatch(createUpdateTaskDataRoomApi(navigate, Data, t));
              //
              //   // await dispatch(
              //   //   SearchTodoListApi(
              //   //     navigate,
              //   //     dataForList,
              //   //     meetingPage,
              //   //     meetingRow,
              //   //     t
              //   //   )
              //   // );
              // }
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

const ViewToDoList = (
  navigate,
  object,
  t,
  setViewFlagToDo,
  setTodoViewModal
) => {
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

              if (typeof setViewFlagToDo === "function") {
                setViewFlagToDo(true);
              }
              if (typeof setTodoViewModal === "function") {
                setTodoViewModal(true);
              }
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByToDoListID_02".toLowerCase()
                )
            ) {
              await dispatch(ViewToDoFail(t("No-records-found")));
              setViewFlagToDo(false);
              setTodoViewModal(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetToDoListByToDoListID_03".toLowerCase()
                )
            ) {
              setViewFlagToDo(false);
              setTodoViewModal(false);
              await dispatch(ViewToDoFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(ViewToDoFail(t("Something-went-wrong")));
            setViewFlagToDo(false);
            setTodoViewModal(false);
          }
        } else {
          dispatch(ViewToDoFail(t("Something-went-wrong")));
          setViewFlagToDo(false);
          setTodoViewModal(false);
        }
      })
      .catch((response) => {
        dispatch(ViewToDoFail(t("Something-went-wrong")));
        setViewFlagToDo(false);
        setTodoViewModal(false);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateToDoList(navigate, object, t));
        } else if (response.data.responseCode === 200) {
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
const deleteTodoCommentSpinner = (payload) => {
  return {
    type: actions.DELETE_TODO_COMMENT_ID,
    response: payload,
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
    dispatch(deleteTodoCommentSpinner(true));
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
                  t("Comment-deleted")
                )
              );
              dispatch(deleteTodoCommentSpinner(false));
              // dispatch(ViewToDoList(navigate, newData, t))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteComment_02".toLowerCase()
                )
            ) {
              dispatch(deleteComment_fail(t("Comment-Not-Deleted")));
              dispatch(deleteTodoCommentSpinner(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteComment_03".toLowerCase()
                )
            ) {
              dispatch(deleteComment_fail(t("Something-went-wrong")));
              dispatch(deleteTodoCommentSpinner(false));
            } else {
              dispatch(deleteComment_fail(t("Something-went-wrong")));
              dispatch(deleteTodoCommentSpinner(false));
            }
          } else {
            dispatch(deleteComment_fail(t("Something-went-wrong")));
            dispatch(deleteTodoCommentSpinner(false));
          }
        } else {
          dispatch(deleteComment_fail(t("Something-went-wrong")));
          dispatch(deleteTodoCommentSpinner(false));
        }
      })
      .catch((error) => {
        dispatch(deleteComment_fail(t("Something-went-wrong")));
        dispatch(deleteTodoCommentSpinner(false));
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

const deleteGroupTask_init = () => {
  return {
    type: actions.DELETEGROUPTASK_INIT,
  };
};
const deleteGroupTask_success = (response, message) => {
  return {
    type: actions.DELETEGROUPTASK_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteGroupTask_fail = (message) => {
  return {
    type: actions.DELETEGROUPTASK_FAIL,
    message: message,
  };
};
const deleteGroupTaskApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(deleteGroupTask_init());
    let form = new FormData();
    form.append("RequestMethod", deleteGroupTaskRM.RequestMethod);
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
          dispatch(deleteGroupTaskApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteGroupTasks_01".toLowerCase()
                )
            ) {
              await dispatch(
                deleteGroupTask_success(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let newData = {
                GroupID: Number(Data.GroupID),
              };
              dispatch(getTasksByGroupIDApi(navigate, t, newData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteGroupTasks_02".toLowerCase()
                )
            ) {
              dispatch(deleteGroupTask_fail(t("Failed-to-delete-record")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteGroupTasks_03".toLowerCase()
                )
            ) {
              dispatch(deleteGroupTask_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteGroupTask_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteGroupTask_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteGroupTask_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteGroupTask_fail(t("Something-went-wrong")));
      });
  };
};

const deleteCommitteeTask_init = () => {
  return {
    type: actions.DELETECOMMITTEETASK_INIT,
  };
};
const deleteCommitteeTask_success = (response, message) => {
  return {
    type: actions.DELETECOMMITTEETASK_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteCommitteeTask_fail = (message) => {
  return {
    type: actions.DELETECOMMITTEETASK_FAIL,
    message: message,
  };
};
const deleteCommitteeTaskApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(deleteCommitteeTask_init());
    let form = new FormData();
    form.append("RequestMethod", deleteCommitteeTaskRM.RequestMethod);
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
                  "ToDoList_ToDoListServiceManager_DeleteCommitteeTasks_01".toLowerCase()
                )
            ) {
              await dispatch(
                deleteCommitteeTask_success(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let newData = {
                CommitteeID: Number(Data.CommitteeID),
              };
              dispatch(getTaskCommitteeIDApi(navigate, t, newData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteCommitteeTasks_02".toLowerCase()
                )
            ) {
              dispatch(deleteCommitteeTask_fail(t("Failed-to-delete-record")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_DeleteCommitteeTasks_03".toLowerCase()
                )
            ) {
              dispatch(deleteCommitteeTask_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteCommitteeTask_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteCommitteeTask_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteCommitteeTask_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteCommitteeTask_fail(t("Something-went-wrong")));
      });
  };
};

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENTS_TASKS_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_TASKS_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_TASKS_FAIL,
    message: message,
  };
};

// Upload Documents API for Resolution
const uploadDocumentsTaskApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
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
            uploadDocumentsTaskApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile
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
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      });
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_TASKS_INIT,
  };
};

// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_TASKS_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_TASKS_FAIL,
    message: message,
  };
};

// Save Files API for Resolution
const saveFilesTaskApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null && folderID !== undefined ? folderID : 0,
    // Files: data,
    Files: data,
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  console.log("saveFilesTaskApi Data", Data);
  return async (dispatch) => {
    dispatch(saveFiles_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
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
          dispatch(RefreshToken(navigate, t));
          dispatch(saveFilesTaskApi(navigate, t, data, folderID, newFolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              console.log(
                response.data.responseResult,
                "newFoldernewFoldernewFolder"
              );
              let File = response.data.responseResult.fileID;
              File.forEach((newData, index) => {
                console.log(newData, "newFoldernewFoldernewFolder");
                return newFolder.push({
                  pK_FileID: newData.pK_FileID,
                  DisplayAttachmentName: newData.displayFileName,
                });
              });

              console.log(newFolder, "newFoldernewFoldernewFolder");

              await dispatch(
                saveFiles_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

//  Create Update Task Dataroom
const createUpdateTaskDataRoom_init = () => {
  return {
    type: actions.CREATEUPDATETASKDATAROOMMAP_INIT,
  };
};

const createUpdateTaskDataRoom_success = (response, message) => {
  return {
    type: actions.CREATEUPDATETASKDATAROOMMAP_SUCCESS,
    response: response,
    message: message,
  };
};

const createUpdateTaskDataRoom_fail = (message) => {
  return {
    type: actions.CREATEUPDATETASKDATAROOMMAP_FAIL,
    message: message,
  };
};

const createUpdateTaskDataRoomApi = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(createUpdateTaskDataRoom_init());
    let form = new FormData();
    form.append("RequestMethod", createupdateTaskDataroom.RequestMethod);
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
          dispatch(RefreshToken(navigate, t));
          dispatch(createUpdateTaskDataRoomApi(navigate, Data, t));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_01".toLowerCase()
              )
          ) {
            dispatch(
              createUpdateTaskDataRoom_success(
                response.data.responseResult.folderID,
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_02".toLowerCase()
              )
          ) {
            dispatch(
              createUpdateTaskDataRoom_fail(t("Failed-to-save-or-map-folder"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_03".toLowerCase()
              )
          ) {
            dispatch(
              createUpdateTaskDataRoom_success(
                response.data.responseResult.folderID,
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_04".toLowerCase()
              )
          ) {
            dispatch(
              createUpdateTaskDataRoom_fail(t("Unable-to-update-folder"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_05".toLowerCase()
              )
          ) {
            dispatch(
              createUpdateTaskDataRoom_success(
                response.data.responseResult.folderID,
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_06".toLowerCase()
              )
          ) {
            createUpdateTaskDataRoom_fail(t("Failed-to-create-new-mapping"));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_CreateUpdateToDoDataRoomMap_07".toLowerCase()
              )
          ) {
            dispatch(createUpdateTaskDataRoom_fail(t("Something-went-wrong")));
          } else {
            dispatch(createUpdateTaskDataRoom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createUpdateTaskDataRoom_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(createUpdateTaskDataRoom_fail(t("Something-went-wrong")));
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
  setShow
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
            saveTaskDocumentsAndAssigneesApi(navigate, Data, t, value, setShow)
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
              ToDoID: Number(Data?.TaskID),
              UpdateFileList: Data?.TasksAttachments.map((data, index) => {
                return { PK_FileID: Number(data?.OriginalAttachmentName) };
              }),
            };
            dispatch(
              saveTaskDocumentsApi(navigate, NewData, t, value, setShow)
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ToDoList_ToDoListServiceManager_SaveTaskDocumentsAndAssignees_02".toLowerCase()
              )
          ) {
            dispatch(saveTaskDocumentsAndAssignees_fail(t("No-record-save")));
            dispatch(createUpdateTaskDataRoom_fail(""));
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
            dispatch(createUpdateTaskDataRoom_fail(""));
          } else {
            dispatch(
              saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong"))
            );
            dispatch(createUpdateTaskDataRoom_fail(""));
          }
        } else {
          dispatch(
            saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong"))
          );
          dispatch(createUpdateTaskDataRoom_fail(""));
        }
      })
      .catch((error) => {
        dispatch(saveTaskDocumentsAndAssignees_fail(t("Something-went-wrong")));
        dispatch(createUpdateTaskDataRoom_fail(""));
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

const saveTaskDocumentsApi = (navigate, Data, t, value, setShow) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    try {
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
            dispatch(saveTaskDocumentsApi(navigate, Data, t, value, setShow));
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

              // Create Task from main TOdo list
              if (value === 1) {
                setShow(false);
                let TodoListPage =
                  localStorage.getItem("todoListPage") !== null
                    ? localStorage.getItem("todoListPage")
                    : 1;

                let todoLength =
                  localStorage.getItem("todoListRow") !== null
                    ? localStorage.getItem("todoListRow")
                    : 50;

                let dataForList = {
                  Date: "",
                  Title: "",
                  AssignedToName: "",
                };
                await dispatch(
                  SearchTodoListApi(
                    navigate,
                    dataForList,
                    Number(TodoListPage),
                    Number(todoLength),
                    t
                  )
                );
                // dispatch(createUpdateTaskDataRoom_fail(""));
              }
              // Delete Task from main Task
              if (value === 2) {
                await dispatch(
                  updateTodoStatusFunc(navigate, 6, Data.ToDoID, t, false)
                );
              }
              // Create Task from Group
              if (value === 3) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");
                let data = {
                  FK_TID: Number(Data.ToDoID),
                  GroupID: Number(ViewGroupID),
                };
                dispatch(ClearMappingFolderID());
                dispatch(setTasksByGroupApi(navigate, t, data));
                setShow(false);
              }
              // Delete Task from Group
              if (value === 4) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");

                let data = {
                  FK_TID: Number(Data.ToDoID),
                  GroupID: Number(ViewGroupID),
                };
                dispatch(deleteGroupTaskApi(navigate, t, data));
              }
              // Create Task from Committee
              if (value === 5) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
                let data = {
                  FK_TID: Number(Data.ToDoID),
                  CommitteeID: Number(ViewCommitteeID),
                };
                dispatch(ClearMappingFolderID());

                dispatch(setTasksByCommitteeApi(navigate, t, data));
                setShow(false);
              }
              // Delete Task from Committee
              if (value === 6) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
                let data = {
                  FK_TID: Number(Data.ToDoID),
                  CommitteeID: Number(ViewCommitteeID),
                };
                dispatch(deleteCommitteeTaskApi(navigate, t, data));
              }
              // Create Task from Meeting Actions
              if (value === 7) {
              }
              // Delete Task from Meetin Actions
              if (value === 8) {
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveToDoDocuments_02".toLowerCase()
                )
            ) {
              dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
              dispatch(createUpdateTaskDataRoom_fail(""));
            } else {
              dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
              dispatch(createUpdateTaskDataRoom_fail(""));
            }
          } else {
            dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
            dispatch(createUpdateTaskDataRoom_fail(""));
          }
        })
        .catch(() => {
          dispatch(saveTaskDocuments_fail(t("Something-went-wrong")));
          dispatch(createUpdateTaskDataRoom_fail(""));
        });
    } catch (error) {}
  };
};

const createTaskGroupMQTT = (response) => {
  return {
    type: actions.TODO_CREATE_GROUP,
    response: response,
  };
};

const createTaskCommitteeMQTT = (response) => {
  return {
    type: actions.TODO_CREATE_COMMITTEE,
    response: response,
  };
};

const createTaskMeetingMQTT = (response) => {
  return {
    type: actions.TODO_CREATE_ADVANCED_MEETING,
    response: response,
  };
};

export {
  createTaskGroupMQTT,
  createTaskCommitteeMQTT,
  createTaskMeetingMQTT,
  saveTaskDocumentsApi,
  saveTaskDocumentsAndAssigneesApi,
  deleteCommitteeTaskApi,
  deleteGroupTaskApi,
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
  toDoListLoaderStart,
  uploadDocumentsTaskApi,
  saveFilesTaskApi,
};
