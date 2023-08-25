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
  socketTodoStatusData: [],
  TotalTodoCountThisWeek: 0,
  TotalNumberOfUpcommingTodoInWeek: 0,
  TableSpinner: false,
  SearchTodolist: null,
  deleteComment: null
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
        ResponseMessage: action.message,
        // action.response.responseMessage !== undefined
        //   ? action.response.responseMessage
        //   : action.response.responseResult.recordeMessage,
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
    case actions.CLEAR_RESPONCE_STATE:
      return {
        ...state,
        ResponseMessage: "",
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
      let GetAllAssigneesArray = action.response.map((item, index) => {
        return { ...item, key: index };
      });

      console.log("GET_ALL_ASSIGNEES_SUCCESS", GetAllAssigneesArray);
      return {
        ...state,
        // Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        AllAssigneesData: GetAllAssigneesArray,
        ShowNotification: true,
      };

    case actions.GET_ALL_ASSIGNEES_FAIL:
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseMessage,
        // AllAssigneesData: action.response.user,
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
        ResponseMessage: action.message,
        AllTodolistData: GetAllTodolistArray,
        ShowNotification: true,
      };
    case actions.SETTODO_RECENT_ACTIVITY_DATA: {
      console.log("TodosActivityData", action.response);
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        SocketTodoActivityData: action.response,
      };
    }
    case actions.SET_TODO_STATUS_DATA: {
      return {
        ...state,
        socketTodoStatusData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_TODOLIST_FAIL:
      return {
        ...state,
        AllTodolistData: [],
        Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        // action.response.responseMessage !== undefined
        //   ? action.response.responseMessage
        //   : action.response.responseMessage,
        ShowNotification: true,
      };

    case actions.VIEW_TODO_SUCCESS:
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
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
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
        ResponseMessage: action.message,
        // action.response.responseMessage !== undefined
        //   ? action.response.responseMessage
        //   : action.response.responseMessage,
        ShowNotification: true,
      };
    case actions.RECENT_TODOCOUNTER: {
      return {
        ...state,
        TotalTodoCountThisWeek: action.response.totalNumberOfToDoListInThisWeek,
        TotalNumberOfUpcommingTodoInWeek:
          action.response.totalNumberOfAssignedToDoListInThisWeek,
      }
    }
    case actions.SEARCH_TODOLIST_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.SEARCH_TODOLIST_SUCCESS: {
      console.log(action.response, "SEARCH_TODOLIST_SUCCESSSEARCH_TODOLIST_SUCCESS")
      return {
        ...state,
        Loading: false,
        SearchTodolist: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.SEARCH_TODOLIST_FAIL: {
      console.log(action, "SEARCH_TODOLIST_SUCCESSSEARCH_TODOLIST_SUCCESS")
      return {
        ...state,
        Loading: false,
        SearchTodolist: null,
        ResponseMessage: action.message
      }
    }
    case actions.DELETE_TODO_COMMENT_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.DELETE_TODO_COMMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteComment: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.DELETE_TODO_COMMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteComment: null,
        ResponseMessage: action.message
      }
    }
    default:
      return { ...state };
  }
};
export default toDoListReducer;
