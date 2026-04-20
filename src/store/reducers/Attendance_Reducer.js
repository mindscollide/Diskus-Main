/**
 * @file Attendance_Reducer.js
 * @description Redux reducer for the `attendanceMeeting` slice. Manages
 * meeting attendance: fetching attendance records and saving attendee
 * confirmations for a given meeting.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                 - Pending request flag.
 * @property {string}  ResponseMessage         - Last response message.
 * @property {Array}   saveAttendanceMeeting   - Result of save-attendance API.
 * @property {Array}   attendanceMeetings      - Fetched attendance records for meetings.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  saveAttendanceMeeting: [],
  attendanceMeetings: [],
};

/**
 * Reducer for the `attendanceMeeting` slice.
 * Handles fetching meeting attendance records and saving attendee confirmations.
 *
 * @param {object} state  - Current attendanceMeeting state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const attendanceMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLEAR_ATTENDANCE_RESPONSEMESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

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
    case actions.ATTENDANCE_REDUCER_STATE_CLEAR: {
      return {
        ...state,
        saveAttendanceMeeting: [],
        attendanceMeetings: [],
      };
    }
    default:
      return { ...state };
  }
};

export default attendanceMeetingReducer;
