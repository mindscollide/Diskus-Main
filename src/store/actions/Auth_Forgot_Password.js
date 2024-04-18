import * as actions from "../action_types";
import { forgetpassword } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginFlowRoutes } from "./UserManagementActions";

const forgotPasswordInit = () => {
  return {
    type: actions.FORGOT_PASSWORD_INIT,
  };
};

const forgotPasswordSuccess = (response, message) => {
  return {
    type: actions.FORGOT_PASSWORD_SUCCESS,
    response: response,
    message: message,
  };
};

const forgotPasswordFail = (message) => {
  return {
    type: actions.FORGOT_PASSWORD_FAIL,
    message: message,
  };
};

const changePasswordRequest = (email, t, navigate) => {
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let Data = {
    Email: email,
    DeviceID: "1",
    Device: "browser",
  };

  return (dispatch) => {
    dispatch(forgotPasswordInit());
    let form = new FormData();
    form.append("RequestMethod", forgetpassword.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_01".toLowerCase()
              )
          ) {
            dispatch(forgotPasswordFail(t("Device does not exists")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_02".toLowerCase()
              )
          ) {
            dispatch(forgotPasswordFail(t("Device ID does not exists")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_03".toLowerCase()
              )
          ) {
            localStorage.setItem(
              "userEmail",
              response.data.responseResult.email
            );
            localStorage.setItem("userID", response.data.responseResult.userID);
            dispatch(
              forgotPasswordSuccess(
                response.data.responseResult,
                t("OTP-has-been-sent-to-your-email")
              )
            );
            localStorage.setItem("LoginFlowPageRoute", 12);
            dispatch(LoginFlowRoutes(12));
            // navigate("/forgotpasswordVerification");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_04".toLowerCase()
              )
          ) {
            dispatch(forgotPasswordFail(t("Failed to generate OTP")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_05".toLowerCase()
              )
          ) {
            dispatch(forgotPasswordFail(t("Failed to identify user")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_AuthManager_ForgotPassword_06".toLowerCase()
              )
          ) {
            dispatch(forgotPasswordFail(t("Something-went-wrong")));
          } else {
            dispatch(forgotPasswordFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(forgotPasswordFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(forgotPasswordFail(t("Something-went-wrong")));
        //   dispatch(SomeThingWentWrong(response));
      });
  };
};
const cleareChangePasswordMessage = () => {
  return {
    type: actions.CLEARE_CHANGE_PASSWORD_MESSAGE,
  };
};

export { changePasswordRequest, cleareChangePasswordMessage };
