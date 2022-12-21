import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Spinner: false,
  Fail: false,
  ResponseMessage: "",
  ToDoDetails: [],
  AllAssigneesData: [],
  AllTodolistData: [],
  TodoActivityData: [],
  SocketTodoActivityData: [],
  socketTodoStatusData : [],
  TotalTodoCountThisWeek: 0,
  TotalNumberOfUpcommingTodoInWeek: 0,
  TableSpinner: false,
};

const toDoListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_TODOLIST_LOADER_START:
      return { ...state, Loading: true };

    case actions.GET_TODO_FAIL:
      console.log("action", action);
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        Fail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };
    case actions.SET_LOADER_FALSE:
      return { ...state, Loading: false };

    case actions.SET_SPINNER_TRUE:
      return { ...state, Spinner: true };

    case actions.SET_SPINNER_FALSE:
      return { ...state, Spinner: false };

    case actions.SET_TABLESPINNER_FALSE:
      return { ...state, TableSpinner: false };

    case actions.CLEAR_STATE:
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
        ToDoDetails: [],
      };

    case actions.SHOW:
      return {
        ...state,
        ShowNotification: true,
        ResponseMessage: action.message,
      };

    case actions.HIDE:
      return {
        ...state,
        ResponseMessage: "",
      };

    case actions.GET_ALL_ASSIGNEES_SUCCESS:
      console.log("GET_ALL_ASSIGNEES_SUCCESS", action);
      let GetAllAssigneesArray = action.response.user.map((item, index) => {
        return { ...item, key: index };
      });
      console.log("GET_ALL_ASSIGNEES_SUCCESS", GetAllAssigneesArray);
      return {
        ...state,
        // Loading: false,
        TableSpinner: false,
        // ResponseMessage: action.response.responseMessage,
        AllAssigneesData: GetAllAssigneesArray,
        ShowNotification: true,
      };

    case actions.GET_ALL_ASSIGNEES_FAIL:
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
        AllAssigneesData: action.response.user,
        ShowNotification: true,
      };

    case actions.GET_TODOLIST_INIT:
      return {
        ...state,
        Loading: true,
        TableSpinner: true,
        AllTodolistData: [],
      };

    case actions.GET_TODOLIST_SUCCESS:
      console.log("GET_TODO_SUCCESS", action);
      let GetAllTodolistArray = action.response.toDoLists.map((item, index) => {
        return { ...item, key: index };
      });
      console.log("GET_TODO_SUCCESS", GetAllTodolistArray);
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        // ResponseMessage: action.response.responseMessage,
        AllTodolistData: GetAllTodolistArray,
        ShowNotification: true,
      };
    case actions.SETTODO_RECENT_ACTIVITY_DATA: {
      console.log("TodosActivityData", action.response);
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        SocketTodoActivityData: action.response
      }
    }
    case actions.SET_TODO_STATUS_DATA: {
      return {
        ...state,
        socketTodoStatusData: action.response
      }
    }
    case actions.GET_TODOLIST_FAIL:
      console.log("todo fail", action);
      return {
        ...state,
        AllTodolistData: [],
        Loading: false,
        TableSpinner: false,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
        ShowNotification: true,
      };

    case actions.VIEW_TODO_SUCCESS:
      console.log("ViewToDoDetails", action);
      return {
        ...state,
        Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage,
        ToDoDetails: action.response,
      };

    case actions.VIEW_TODO_FAIL:
      return {
        ...state,
        Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage,
        ToDoDetails: [],
      };

    case actions.GET_TODOCOUNT_SUCCESS:
      console.log("GET_TODOCOUNT_SUCCESS", action);
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        ResponseMessage: action.response.responseMessage,
        TotalTodoCountThisWeek: action.response.totalNumberOfToDoListInThisWeek,
        TotalNumberOfUpcommingTodoInWeek:
          action.response.totalNumberOfAssignedToDoListInThisWeek,
        ShowNotification: true,
      };

    case actions.GET_TODOCOUNT_FAIL:
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        TotalTodoCountThisWeek: 0,
        TotalNumberOfUpcommingTodoInWeek: 0,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
        ShowNotification: true,
      };

    default:
      return { ...state };
  }
};
export default toDoListReducer;
