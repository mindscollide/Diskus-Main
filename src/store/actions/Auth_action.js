import * as actions from "../action_types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticationRefreshToken } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import { signOut, userLogOutApiFunc } from "./Auth_Sign_Out";

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
  // const navigate = useNavigate();
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
    await axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
      .then(async (response) => {
        //
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.responseCode === 205) {
            console.log(
              response.data,
              "authenticationApiauthenticationApiauthenticationApi"
            );
            let message2 = t("Your-session-has-expired-please-login-again");
            // await dispatch(signOut(navigate, message2, dispatch));

            // dispatch(userLogOutApiFunc(navigate, t));
            await dispatch(refreshtokenFail(message2));
            setTimeout(() => {
              signOut(navigate, "", dispatch);
            }, 4000);
            // navigate("/");
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
