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

// Clearing states on click of Button
const clearState = (history) => {
  return {
    type: actions.CLEAR_STATE_BACK,
  };
};

const HideNotificationAuth = () => {
  return {
    type: actions.HIDE,
  };
};

export { RefreshToken, clearState, HideNotificationAuth };
