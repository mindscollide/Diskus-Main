import * as actions from "../action_types";

const initialState = {
  user: [],
  ResponseMessage: "",
  // ResponseCode: "",
  Loading: false,
  NotificationData: [],
  ViewMeetingDetails: [],
  CancelMeetingData: [],
  StartMeetingData: [],
  EndMeetingData: [],
  RemindersData: [],
  ShowNotification: false,
  SearchMeetingData: null,
  meetingcreatedashboardLoader: false,
};

const assigneesReducer = (state = initialState, action) => {
  console.log("ASSIGNESS_LIST_INIT", state);
  switch (action.type) {
    case actions.LOADER_CREATEMEETING_DASHBOARD: {
      console.log(
        action,
        "meetingcreatedashboardLoadermeetingcreatedashboardLoader"
      );
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
        // Loading: false,
      };

    case actions.ASSIGNESS_LIST_INIT: {
      return {
        ...state,
        // Loading: false,
      };
    }
    case actions.ASSIGNESS_LIST_SUCCESS: {
      console.log("allassignesslistsuccess");

      return {
        ...state,
        user: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ASSIGNESS_LIST_FAIL: {
      return {
        ...state,
        user: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SET_LOADER_FALSE: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.SCHEDULE_NEW_MEETING_INIT:
      console.log("Update Loader start");
      return { ...state, Loading: true };

    case actions.SCHEDULE_NEW_MEETING_FAIL:
      return {
        ...state,
        ResponseMessage: action.message,
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
        ViewMeetingDetails: [],
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
      };

    case actions.VIEW_MEETING_FAIL:
      return {
        ...state,
        // Loading: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseResult.recordeMessage,
        ViewMeetingDetails: [],
        ResponseMessage: action.message,
      };
    case actions.CLEARE_STATE:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: "",
        ViewMeetingDetails: [],
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
        // Loading: false,
        ResponseMessage: action.message,
        CancelMeetingData: action.response,
      };

    case actions.CANCEL_MEETING_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        CancelMeetingData: [],
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
        // Loading: false,
        ResponseMessage: action.message,
        StartMeetingData: action.response,
      };

    case actions.START_MEETING_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };

    case actions.END_MEETING_INIT:
      return {
        ...state,
        Loading: true,
        EndMeetingData: [],
        ResponseMessage: "",
      };

    case actions.END_MEETING_SUCCESS:
      console.log("END Meeting ", action);
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
        EndMeetingData: action.response,
      };

    case actions.END_MEETING_FAIL:
      return {
        ...state,
        // Loading: false,
        ResponseMessage: action.message,
        EndMeetingData: action.response,
      };

    case actions.GET_REMINDERS_SUCCESS: {
      console.log("allassignesslistsuccess12");
      return {
        ...state,
        RemindersData: action.response.meetingReminders,
        ResponseMessage: action.message,
        // Loading: false,
      };
    }
    case actions.GET_REMINDERS_FAIL: {
      return {
        ...state,
        RemindersData: [],
        ResponseMessage: action.message,
        // Loading: false,
      };
    }

    case actions.LISTOFASSIGNEE_RESPONSE_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
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
      };
    }
    case actions.SEARCH_USER_MEETINGS_FAIL: {
      return {
        ...state,
        Loading: false,
        SearchMeetingData: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};
export default assigneesReducer;
