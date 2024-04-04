import * as actions from "../action_types";

const initialState = {
  CalenderData: [],
  Loading: false,
  ResponseMessage: "",
  Spinner: false,
  getEventTypeIds: [],
  eventsDetails: null,
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GETEVENTSDETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETEVENTSDETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        eventsDetails: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETEVENTSDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        eventsDetails: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETEVENTSTYPES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETEVENTSTYPES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getEventTypeIds: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETEVENTSTYPES_FAIL: {
      return {
        ...state,
        Loading: false,
        getEventTypeIds: [],
        ResponseMessage: action.message,
      };
    }
    case actions.GET_DATA_FOR_CALENDAR_INIT: {
      return {
        ...state,
        // CalenderData: [],
        Loading: action.flag,
        Spinner: action.flag,
      };
    }
    case actions.GET_DATA_FOR_CALENDAR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CalenderData: action.response.calenderLists,
        ResponseMessage: action.message,
        Spinner: action.flag,
      };
    }
    case actions.GET_DATA_FOR_CALENDAR_FAIL: {
      return {
        ...state,
        Loading: false,
        Spinner: false,
        CalenderData: [],
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_CALENDAR_STATE: {
      return {
        ...state,
        CalenderData: [],
      };
    }
    case actions.HIDE:
      return {
        ...state,
        ResponseMessage: "",
      };
    case actions.CALENDAR_LOADER: {
      return {
        ...state,
        Loading: action.payload,
      };
    }
    default:
      return { ...state };
  }
};
export default calendarReducer;
