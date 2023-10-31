import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  saveAttendanceMeeting: [],
  attendanceMeetings: [],
};

const attendanceMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_ATTENDANCE_MEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_ATTENDANCE_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        attendanceMeetings: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_ATTENDANCE_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        attendanceMeetings: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_ATTENDANCE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_MEETING_ATTENDANCE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveAttendanceMeeting: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_ATTENDANCE_FAIL: {
      return {
        ...state,
        Loading: false,
        saveAttendanceMeeting: [],
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default attendanceMeetingReducer;
