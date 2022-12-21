import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  AddMeetingofMinutesResponse: "",
  AddMeetingofMinutesMessage: "",
  UpdateMeetingofMinutesResponse: "",
  UpdateMeetingofMinutesMessage: "",
};

const minuteofMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.HIDEMINUTEMESSAGE: {
      return {
        ...state,
        AddMeetingofMinutesResponse: "",
        AddMeetingofMinutesMessage: "",
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
        AddMeetingofMinutesResponse: action.response,
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
