import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  todoListMeetingTask: [],
  uploadActionDocument: null,
  mapTaskMeetingAgenda: null,
  removeTaskMapping: null,
};

const actionMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MEETING_TASKS_ACTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_MEETING_TASKS_ACTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        todoListMeetingTask: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_TASKS_ACTION_FAIL: {
      return {
        ...state,
        Loading: false,
        todoListMeetingTask: [],
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        uploadActionDocument: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_FAIL: {
      return {
        ...state,
        Loading: false,
        uploadActionDocument: null,
        ResponseMessage: action.message,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        mapTaskMeetingAgenda: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        mapTaskMeetingAgenda: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        removeTaskMapping: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_FAIL: {
      return {
        ...state,
        Loading: false,
        removeTaskMapping: null,
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default actionMeetingReducer;
