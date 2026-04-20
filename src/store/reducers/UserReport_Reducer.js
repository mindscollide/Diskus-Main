/**
 * @file UserReport_Reducer.js
 * @description Redux reducer for the `UserReport` slice. Manages the user
 * login-history report — fetching and displaying historical sign-in records
 * for admin audit purposes.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading              - Loading flag for the report request.
 * @property {string}      ResponseMessage      - Last API response message.
 * @property {object|null} userLoginHistoryData - Login history records returned by the API.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  userLoginHistoryData: null,
};

/**
 * Reducer for the `UserReport` slice.
 * Handles fetching the user login-history report.
 *
 * @param {object} state  - Current user-report state.
 * @param {{ type: string, response?: *, loader?: boolean }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
