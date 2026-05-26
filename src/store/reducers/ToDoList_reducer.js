import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Spinner: false,
  Fail: false,
  ResponseMessage: "",
  errorSeverity: null,
  ToDoDetails: [],
  AllAssigneesData: [],
  AllTodolistData: [],
  TodoActivityData: [],
  SocketTodoActivityData: null,
  socketTodoStatusData: null,
  TotalTodoCountThisWeek: 0,
  TotalNumberOfUpcommingTodoInWeek: 0,
  TableSpinner: false,
  SearchTodolist: null,
  deleteComment: null,
  deleteCommentSpinner: false,
  deleteGroupTask: null,
  deleteCommitteeTask: null,
  todoDocumentsMapping: 0,
  todoDocumentsUpload: [],
  todoSaveFilesTodo: [],
  saveTodoDocuments: null,
  saveTaskandAssignees: null,
  createTaskGroup: null,
  createTaskCommittee: null,
  createTaskMeeting: null,
  getDashboardTaskData: null,
  getDashboardTaskCountMQTT: null,
  viewTaskList: null,
  viewTaskDetailLink: null,
  taskFromDashboard: 0,
};

const toDoListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TASK_FROM_DASHBOARD: {
      return {
        ...state,
        taskFromDashboard: action.payload,
      };
    }
    case actions.TODOLIST_LOADER: {
      return {
        ...state,
        Loading: action.loader,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_DETAILS_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_DETAILS_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        viewTaskDetailLink: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_DETAILS_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        viewTaskDetailLink: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_LIST_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_LIST_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        viewTaskList: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_TASK_LIST_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        viewTaskList: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.TASK_FOLDER_MAPPING_ID: {
      return {
        ...state,
        todoDocumentsMapping: 0,
      };
    }
    // Mapping for Task create
    case actions.CREATEUPDATETASKDATAROOMMAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATEUPDATETASKDATAROOMMAP_SUCCESS: {
      return {
        ...state,
        Loading: true,
        todoDocumentsMapping: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.CREATEUPDATETASKDATAROOMMAP_FAIL: {
      return {
        ...state,
        Loading: false,
        todoDocumentsMapping: 0,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    // Upload Documents for Task
    case actions.UPLOAD_DOCUMENTS_TASKS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPLOAD_DOCUMENTS_TASKS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        todoDocumentsUpload: [...state.todoDocumentsUpload, action.response],
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.UPLOAD_DOCUMENTS_TASKS_FAIL: {
      return {
        ...state,
        Loading: false,
        todoDocumentsUpload: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    // Save Documents and Files for Task
    case actions.SAVEFILES_TASKS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVEFILES_TASKS_SUCCESS: {
      return {
        ...state,
        Loading: true,
        todoSaveFilesTodo: [...state.todoSaveFilesTodo, action.response],
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.SAVEFILES_TASKS_FAIL: {
      return {
        ...state,
        Loading: false,
        todoSaveFilesTodo: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    // Save Tasks Documents
    case actions.SAVE_TASK_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_TASK_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveTodoDocuments: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.SAVE_TASK_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        saveTodoDocuments: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    // Save Task and Assignees Information
    case actions.SAVETASKDOCUMENTSANDASSIGNEES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVETASKDOCUMENTSANDASSIGNEES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveTaskandAssignees: action.resoponse,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.SAVETASKDOCUMENTSANDASSIGNEES_FAIL: {
      return {
        ...state,
        Loading: false,
        saveTaskandAssignees: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    // OLD WORK
    case actions.GET_TODOLIST_LOADER_START:
      return { ...state, Loading: true };
    case actions.DELETE_TODO_COMMENT_ID: {
      return {
        ...state,
        deleteCommentSpinner: action.response,
      };
    }
    case actions.GET_TODO_FAIL:
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        Fail: true,
        ResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: null,
        ToDoDetails: [],
      };
    case actions.CLEAR_RESPONCE_STATE:
      return {
        ...state,
        ResponseMessage: "",
        errorSeverity: null,
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
        errorSeverity: null,
      };

    case actions.GET_ALL_ASSIGNEES_SUCCESS:
      let GetAllAssigneesArray = action.response.map((item, index) => {
        return { ...item, key: index };
      });

      return {
        ...state,
        // Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        AllAssigneesData: GetAllAssigneesArray,
        ShowNotification: true,
        errorSeverity: "success",
      };

    case actions.GET_ALL_ASSIGNEES_FAIL:
      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
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
      let GetAllTodolistArray = action.response.toDoLists.map((item, index) => {
        return { ...item, key: index };
      });

      return {
        ...state,
        Loading: false,
        TableSpinner: false,
        ResponseMessage: action.message,
        AllTodolistData: GetAllTodolistArray,
        ShowNotification: true,
        errorSeverity: "success",
      };
    case actions.SETTODO_RECENT_ACTIVITY_DATA: {
      return {
        ...state,
        // Loading: ,
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
    case actions.DELETEGROUPTASK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEGROUPTASK_SUCCESS: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.DELETEGROUPTASK_FAIL: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.DELETECOMMITTEETASK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETECOMMITTEETASK_SUCCESS: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.DELETECOMMITTEETASK_FAIL: {
      return {
        ...state,
        Loading: false,
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
        errorSeverity: "error",
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
        errorSeverity: "error",
      };

    case actions.GET_TODOCOUNT_SUCCESS:
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        ResponseMessage: action.message,
        TotalTodoCountThisWeek: action.response.totalNumberOfToDoListInThisWeek,
        TotalNumberOfUpcommingTodoInWeek:
          action.response.totalNumberOfAssignedToDoListInThisWeek,
        ShowNotification: true,
        errorSeverity: "success",
      };

    case actions.GET_TODOCOUNT_FAIL:
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        TotalTodoCountThisWeek: 0,
        TotalNumberOfUpcommingTodoInWeek: 0,
        ResponseMessage: action.message,
        errorSeverity: "error",
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
      };
    }
    case actions.SEARCH_TODOLIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEARCH_TODOLIST_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SearchTodolist: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.SEARCH_TODOLIST_FAIL: {
      return {
        ...state,
        Loading: false,
        SearchTodolist: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.DELETE_TODO_COMMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_TODO_COMMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteComment: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.DELETE_TODO_COMMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteComment: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.TODO_CREATE_GROUP: {
      return {
        ...state,
        createTaskGroup: action.response,
      };
    }
    case actions.TODO_CREATE_COMMITTEE: {
      return {
        ...state,
        createTaskCommittee: action.response,
      };
    }
    case actions.TODO_CREATE_ADVANCED_MEETING: {
      return {
        ...state,
        createTaskMeeting: action.response,
      };
    }
    case actions.GETDASHBOARDTASKDATA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETDASHBOARDTASKDATA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getDashboardTaskData: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.GETDASHBOARDTASKDATA_FAIL: {
      return {
        ...state,
        Loading: false,
        getDashboardTaskData: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.GETTASKCOUNT_DASHBOARD_MQTT: {
      let newRecords = {
        totalNumberOfToDoList: action?.payload?.totalNumberOfToDoListInThisWeek,
        totalNumberOfAssignedToDoList:
          action?.payload?.totalNumberOfAssignedToDoListInThisWeek,
      };
      return {
        ...state,
        getDashboardTaskCountMQTT: newRecords,
      };
    }
    case actions.TASK_REDUCER_LOADER: {
      return { ...state, Loading: action.payload };
    }
    default:
      return { ...state };
  }
};
export default toDoListReducer;
