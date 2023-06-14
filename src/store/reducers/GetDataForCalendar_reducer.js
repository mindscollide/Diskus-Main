import inputBaseClasses from "@mui/base/InputUnstyled/inputUnstyledClasses";
import * as actions from "../action_types";

const initialState = {
  CalenderData: [],
  Loading: false,
  ResponseMessage: "",
  Spinner: false,
};

const calendarReducer = (state = initialState, action) => {
  console.log("calendar Reducer", state);
  switch (action.type) {
    case actions.GET_DATA_FOR_CALENDAR_INIT: {
      return {
        ...state,
        CalenderData: [],
        Loading: true,
        Spinner: true,
      };
    }
    case actions.GET_DATA_FOR_CALENDAR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CalenderData: action.response.calenderLists,
        ResponseMessage: action.message,
        Spinner: false,
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

    case actions.HIDE:
      return {
        ...state,
        ResponseMessage: "",
      };

    default:
      return { ...state };
  }
};
export default calendarReducer;
