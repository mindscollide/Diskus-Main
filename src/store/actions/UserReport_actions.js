/**
 * @file UserReport_actions.js
 * @description Redux thunk actions for fetching user login history reports.
 * Retrieves paginated login-history data for the organization admin view.
 * Dispatches: GET_USER_LOGIN_HISTORY_INIT / GET_USER_LOGIN_HISTORY_SUCCESS /
 * GET_USER_LOGIN_HISTORY_FAIL action types.
 */
import { UserLoginHistoryRM } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

/**
 * @param {boolean} loader - Whether to show a loading indicator.
 * @returns {{ type: string, loader: boolean }}
 */
const userLoginHistory_Init = (loader) => {
  return {
    type: actions.GET_USER_LOGIN_HISTORY_INIT,
    loader: loader,
  };
};

/**
 * @returns {{ type: string, response: *, message: string }}
 */
const userLoginHistory_Success = (response, message) => {
  console.log(response, message, "GET_USER_LOGIN_HISTORY_SUCCESS");
  return {
    type: actions.GET_USER_LOGIN_HISTORY_SUCCESS,
    response: response,
    message: message,
  };
};

/**
 * @returns {{ type: string, message: string }}
 */
const userLoginHistory_Fail = (message) => {
  return {
    type: actions.GET_USER_LOGIN_HISTORY_FAIL,
    message: message,
  };
};

/**
 * Fetches user login history for the organization admin report.
 * @param {Function} navigate - React Router navigate function.
 * @param {Function} t - i18next translation function.
 * @param {Object} Data - Request payload (e.g. filters, pagination).
 * @param {boolean} loader - Whether to display a loading indicator.
 * @returns {Function} Redux thunk.
 */
const userLoginHistory_Api = (navigate, t, Data, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(userLoginHistory_Init(loader));
    let form = new FormData();
    form.append("RequestMethod", UserLoginHistoryRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
  axiosInstance.post(getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(userLoginHistory_Api(navigate, t, Data, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistoryForOA_01".toLowerCase()
                )
            ) {
              dispatch(
                userLoginHistory_Success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistoryForOA_02".toLowerCase()
                )
            ) {
              dispatch(userLoginHistory_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistoryForOA_03".toLowerCase()
                )
            ) {
              dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
            } else {
              dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
      });
  };
};

export { userLoginHistory_Api };
