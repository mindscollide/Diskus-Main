/**
 * @file Auth_action.js
 * @description Redux actions for the Authentication feature (token refresh and UI state helpers).
 * Wraps the authentication API (`authenticationApi`) for token refresh.
 * Dispatches: REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAIL, CLEAR_STATE_BACK, HIDE.
 */

import * as actions from "../action_types";
import { authenticationRefreshToken } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import { signOut } from "./Auth_Sign_Out";
import axiosInstance from "../../commen/functions/axiosInstance";

// Refresh Token
const refreshtokenFail = (message) => {
  return {
    type: actions.REFRESH_TOKEN_FAIL,
    message: message,
  };
};

const refreshtokenSuccess = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_SUCCESS,
    response: response,
    message: message,
  };
};

/**
 * Calls the refresh-token API to obtain a new JWT. Signs the user out if the
 * token is expired or the server returns a non-200 response.
 * @param {Function} navigate - React Router navigate function.
 * @param {Function} t - i18n translation function.
 * @returns {Function} Redux thunk.
 */
const RefreshToken = (navigate, t) => {
  let Token = JSON.parse(localStorage.getItem("token"));
  let RefreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  let Data = {
    Token: Token,
    RefreshToken: RefreshToken,
  };
  return async (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", authenticationRefreshToken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(authenticationApi, form)

      .then(async (response) => {
        //
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.responseCode === 205) {
            console.log(
              response.data,
              "authenticationApiauthenticationApiauthenticationApi"
            );
            let message2 = t("Your-session-has-expired-please-login-again");
            await dispatch(refreshtokenFail(message2));
            await signOut(message2, dispatch);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_RefreshToken_01".toLowerCase()
              )
          ) {
            await dispatch(
              refreshtokenSuccess(
                response.data.responseResult,
                t("Refresh-token-update-successfully")
              )
            );
            localStorage.setItem(
              "token",
              JSON.stringify(response.data?.responseResult?.token)
            );
            localStorage.setItem(
              "refreshToken",
              JSON.stringify(response.data?.responseResult?.refreshToken)
            );
          }
        } else {
          let message2 = t("Something-went-wrong");
          await dispatch(refreshtokenFail(message2));
        }
      })
      .catch((response) => {
        dispatch(refreshtokenFail(t("Something-went-wrong")));
      });
  };
};

/**
 * Dispatches CLEAR_STATE_BACK to reset auth-related UI state.
 * @returns {{ type: string }} Plain Redux action.
 */
// Clearing states on click of Button
const clearState = (history) => {
  return {
    type: actions.CLEAR_STATE_BACK,
  };
};

/**
 * Dispatches HIDE to dismiss auth notification banners.
 * @returns {{ type: string }} Plain Redux action.
 */
const HideNotificationAuth = () => {
  return {
    type: actions.HIDE,
  };
};

export { RefreshToken, clearState, HideNotificationAuth };
