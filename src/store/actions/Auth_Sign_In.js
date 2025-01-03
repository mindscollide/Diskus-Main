import * as actions from "../action_types";
import { signinauthenication } from "../../commen/apis/Api_config";
import axios from "axios";
import {
  authenticationApi,
  getSocketConnection,
} from "../../commen/apis/Api_ends_points";
// import io from "socket.io-client";
import Helper from "../../commen/functions/history_logout";

//FOR SIGNIN
const signininit = () => {
  return {
    type: actions.SIGN_IN_INIT,
  };
};

const signinsuccess = (response, message) => {
  return {
    type: actions.SIGN_IN_SUCCESS,
    response: response,
    message: message,
  };
};

const signinfail = (response, message) => {
  return {
    type: actions.SIGN_IN_FAIL,
    response: response,
    message: message,
  };
};
const clearResponseMessage = () => {
  return {
    type: actions.AUTH_RESPONSE_MESSAGE,
  };
};

//FUNCTION FOR SIGNIN
const signIn = (UserData, navigate, t) => {
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let Data = {
    UserPassword: UserData.Password,
    UserName: UserData.UserName,
    DeviceID: "1",
    Device: "browser",
  };

  return (dispatch) => {
    dispatch(signininit());
    let form = new FormData();
    form.append("RequestMethod", signinauthenication.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseResult.isExecuted === true) {
          // const socket = io.connect(getSocketConnection, {
          //   query: {
          //     userID: response.data.responseResult.userID,
          //   },
          // });
          // Helper.socket = socket;
          if (response.data.responseResult.isFirstLogIn === true) {
            navigate("/onboard");
          } else {
            if (response.data.responseResult.userID === 187) {
              navigate("/Admin/Summary");
            } else {
              navigate("/Diskus/home");
            }
          }
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_AuthManager_Login_03"
          ) {
            dispatch(
              signinsuccess(
                response.data.responseResult,
                t("Successfully-logged-in")
              )
            );
          }
        } else {
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_AuthManager_Login_04"
          ) {
            dispatch(
              signinfail(
                response.data.responseResult,
                t("Not-a-valid-user.-Please-login-with-valid-user")
              )
            );
          }
        }
      })
      .catch((response) => {
        dispatch(
          signinfail(
            response.data.responseResult,
            response.data.responseResult.responseMessage
          )
        );
      });
  };
};

export { signIn, clearResponseMessage };
