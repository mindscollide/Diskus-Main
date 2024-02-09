import * as actions from "../action_types";
const initialState = {
  Loading: false,
  ResponseMessage: "",
  userLoginHistoryData: null,
};

const UserReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_USER_LOGIN_HISTORY_INIT: {
      console.log(
        action,
        "GET_USER_LOGIN_HISTORY_INITGET_USER_LOGIN_HISTORY_INIT"
      );
      return {
        ...state,
        Loading: action.loader,
      };
    }
    case actions.GET_USER_LOGIN_HISTORY_SUCCESS: {
      console.log(action, "GET_USER_LOGIN_HISTORY_SUCCESS");
      return {
        ...state,
        Loading: false,
        userLoginHistoryData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_USER_LOGIN_HISTORY_FAIL: {
      return {
        ...state,
        Loading: false,
        userLoginHistoryData: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};

export default UserReportReducer;
