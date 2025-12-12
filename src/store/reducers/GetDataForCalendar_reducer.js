import * as actions from "../action_types";

const initialState = {
  CalenderData: [],
  Loading: false,
  ResponseMessage: "",
  Spinner: false,
  getEventTypeIds: [],
  eventsDetails: null,
  googleEventCreate: null,
  googleEventUpdate: null,
  googleEventDelete: null,
  microsoftEventCreate: null,
  microsoftEventUpdate: null,
  microsoftEventDelete: null,
  errorSeverity: null, // Added errorSeverity to initialState
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
        errorSeverity: "success", // Added
      };
    }
    case actions.GETEVENTSDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        eventsDetails: null,
        ResponseMessage: action.message,
        errorSeverity: "error", // Added
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
        errorSeverity: "success", // Added
      };
    }
    case actions.GETEVENTSTYPES_FAIL: {
      return {
        ...state,
        Loading: false,
        getEventTypeIds: [],
        ResponseMessage: action.message,
        errorSeverity: "error", // Added
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
        errorSeverity: "success", // Added
      };
    }
    case actions.GET_DATA_FOR_CALENDAR_FAIL: {
      return {
        ...state,
        Loading: action.flag,
        Spinner: false,
        CalenderData: [],
        ResponseMessage: action.message,
        errorSeverity: "error", // Added
      };
    }
    case actions.CLEAR_CALENDAR_STATE: {
      return {
        ...state,
        CalenderData: [],
      };
    }
    case actions.CALENDAR_RESPONSE_MESSAGE:
      return {
        ...state,
        ResponseMessage: "",
        errorSeverity: null, // Also clear errorSeverity
      };
    case actions.CALENDAR_LOADER: {
      console.log(action.payload, "payloadpayloadpayload");
      return {
        ...state,
        Loading: action.payload,
      };
    }
    case actions.GOOGLE_CREATE_EVENT: {
      return {
        ...state,
        googleEventCreate: action.response,
      };
    }
    case actions.GOOGLE_UPDATE_EVENT: {
      return {
        ...state,
        googleEventUpdate: action.response,
      };
    }
    case actions.GOOGLE_DELETE_EVENT: {
      return {
        ...state,
        googleEventDelete: action.response,
      };
    }
    case actions.MICROSOFT_CREATE_EVENT: {
      return {
        ...state,
        microsoftEventCreate: action.response,
      };
    }
    case actions.MICROSOFT_UPDATE_EVENT: {
      return {
        ...state,
        microsoftEventUpdate: action.response,
      };
    }
    case actions.MICROSOFT_DELETE_EVENT: {
      return {
        ...state,
        microsoftEventDelete: action.response,
      };
    }
    case actions.REMOVE_CALENDARMEETINGDATA: {
      console.log(action, "REMOVE_CALENDARMEETINGDATAREMOVE_CALENDARMEETINGDATA")
      return {
        ...state,
        eventsDetails: action.payload,
      };
    }
    default:
      return { ...state };
  }
};
export default calendarReducer;