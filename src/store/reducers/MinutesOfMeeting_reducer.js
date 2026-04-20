/**
 * @file MinutesOfMeeting_reducer.js
 * @description Redux reducer for the `minuteOfMeeting` slice. Manages
 * adding and updating meeting-of-minutes records for a given meeting.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                       - Pending request flag.
 * @property {string}  ResponseMessage               - Last generic response message.
 * @property {string}  AddMeetingofMinutesResponse   - Response data from add-minutes API.
 * @property {string}  AddMeetingofMinutesMessage    - Message from add-minutes API.
 * @property {string}  UpdateMeetingofMinutesResponse - Response data from update-minutes API.
 * @property {string}  UpdateMeetingofMinutesMessage  - Message from update-minutes API.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  AddMeetingofMinutesResponse: "",
  AddMeetingofMinutesMessage: "",
  UpdateMeetingofMinutesResponse: "",
  UpdateMeetingofMinutesMessage: "",
};

/**
 * Reducer for the `minuteOfMeeting` slice.
 * Handles adding and updating meeting minutes records.
 *
 * @param {object} state  - Current minuteOfMeeting state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const minuteofMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.HIDEMINUTEMESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
        AddMeetingofMinutesMessage: "",
        UpdateMeetingofMinutesMessage: "",
      };
    }

    case actions.ADD_MINUTESOFMEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_MINUTESOFMEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AddMeetingofMinutesResponse: action.response,
        AddMeetingofMinutesMessage: action.message,
      };
    }
    case actions.ADD_MINUTESOFMEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        AddMeetingofMinutesResponse: "",
        AddMeetingofMinutesMessage: action.message,
      };
    }
    case actions.UPDATE_MINUTESOFMEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_MINUTESOFMEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateMeetingofMinutesResponse: action.response,
        UpdateMeetingofMinutesMessage: action.message,
      };
    }
    case actions.UPDATE_MINUTESOFMEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateMeetingofMinutesResponse: action.response,
        UpdateMeetingofMinutesMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};

export default minuteofMeetingReducer;
