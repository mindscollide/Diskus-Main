import * as actions from "../action_types";

const initialState = {
  user: [],
  ResponseMessage: "",
  errorSeverity: null,
  // ResponseCode: "",
  Loading: false,
  NotificationData: [],
  ViewMeetingDetails: null,
  CancelMeetingData: [],
  StartMeetingData: [],
  EndMeetingData: [],
  RemindersData: [],
  ShowNotification: false,
  SearchMeetingData: null,
  meetingcreatedashboardLoader: false,
};

const assigneesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOADER_CREATEMEETING_DASHBOARD: {
      return { ...state, meetingcreatedashboardLoader: action.response };
    }
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
        // Loading: false,
      };

    case actions.ASSIGNESS_LIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ASSIGNESS_LIST_SUCCESS: {
      return {
        ...state,
        user: action.response,
        Loading: action.loader,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.ASSIGNESS_LIST_FAIL: {
      return {
        ...state,
        user: [],
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.SET_LOADER_FALSE_GETLISTOFASSIGNEES: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.SCHEDULE_NEW_MEETING_INIT:
      return { ...state, Loading: true };

    case actions.SCHEDULE_NEW_MEETING_FAIL:
      return {
        ...state,
        ResponseMessage: action.message,
        errorSeverity: "error",
        Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage !== undefined
        //     ? action.response.responseResult.recordeMessage
        //     : "please contact IT support team",
      };

    case actions.VIEW_MEETING_INIT:
      return {
        ...state,
        Loading: true,
        ViewMeetingDetails: null,
        ResponseMessage: "",
      };

    case actions.VIEW_MEETING_SUCESS:
      return {
        ...state,
        Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage,
        ViewMeetingDetails: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };

    case actions.VIEW_MEETING_FAIL:
      return {
        ...state,
        Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage,
        ViewMeetingDetails: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    case actions.CLEARE_STATE:
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
        errorSeverity: null,
        ViewMeetingDetails: null,
        CancelMeetingData: [],
        StartMeetingData: [],
        EndMeetingData: [],
      };

    case actions.CANCEL_MEETING_INIT:
      return {
        ...state,
        Loading: true,
        CancelMeetingData: [],
        ResponseMessage: "",
      };

    case actions.CANCEL_MEETING_SUCCESS:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        CancelMeetingData: action.response,
        errorSeverity: "success",
      };

    case actions.CANCEL_MEETING_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        CancelMeetingData: [],
        errorSeverity: "error",
      };

    case actions.START_MEETING_INIT:
      return {
        ...state,
        Loading: true,
        StartMeetingData: [],
        ResponseMessage: "",
      };

    case actions.START_MEETING_SUCCESS:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        StartMeetingData: action.response,
        errorSeverity: "success",
      };

    case actions.START_MEETING_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };

    case actions.END_MEETING_INIT:
      return {
        ...state,
        Loading: true,
        EndMeetingData: [],
        ResponseMessage: "",
      };

    case actions.END_MEETING_SUCCESS:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
        EndMeetingData: action.response,
        errorSeverity: "success",
      };

    case actions.END_MEETING_FAIL:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
        EndMeetingData: action.response,
        errorSeverity: "error",
      };

    case actions.GET_REMINDERS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_REMINDERS_SUCCESS: {
      return {
        ...state,
        RemindersData: action.response.meetingReminders,
        ResponseMessage: action.message,
        Loading: false,
        errorSeverity: "success",
      };
    }
    case actions.GET_REMINDERS_FAIL: {
      return {
        ...state,
        RemindersData: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
        // Loading: false,
      };
    }

    case actions.LISTOFASSIGNEE_RESPONSE_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
        errorSeverity: null,
      };
    }
    case actions.SEARCH_USER_MEETINGS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEARCH_USER_MEETINGS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SearchMeetingData: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.SEARCH_USER_MEETINGS_FAIL: {
      return {
        ...state,
        Loading: false,
        SearchMeetingData: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    default:
      return { ...state };
  }
};
export default assigneesReducer;
