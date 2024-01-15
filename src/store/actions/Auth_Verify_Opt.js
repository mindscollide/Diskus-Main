import * as actions from "../action_types";
import axios from "axios";
import {
  verifyOTPSignUp,
  resendOTP,
  resendOTPForgotPassword,
} from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import { message } from "antd";

const verifyoptinit = () => {
  return {
    type: actions.VERIFY_OPT_INIT,
  };
};

const verifyOTPSignUpSuccess = (response) => {
  return {
    type: actions.VERIFY_OTPSIGNUP_SUCCESS,
    response: response,
  };
};

const verifyOTPSignUpFail = (response) => {
  return {
    type: actions.VERIFY_OTPSIGNUP_FAIL,
    response: response,
  };
};

const VerifyOTPSignUp = (verificationData, navigate, setVerificationError) => {
  let Data = {
    UserID: parseInt(verificationData.UserID),
    Email: verificationData.Email,
    OTP: verificationData.OTP,
  };
  return (dispatch) => {
    dispatch(verifyoptinit());
    let form = new FormData();
    form.append("RequestMethod", verifyOTPSignUp.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          dispatch(
            verifyOTPSignUpSuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
          setVerificationError(false);
          navigate("/AccountCreated");
        } else {
          setVerificationError(true);
          dispatch(verifyOTPSignUpFail(response.data.responseResult));
        }
      })
      .catch((response) => {
        dispatch(verifyOTPSignUpFail(response));
      });
  };
};
const resendOTPInit = () => {
  return {
    type: actions.RESEND_OTP_INIT,
  };
};

const resendOTPSuccess = (response, message) => {
  return {
    type: actions.RESEND_OTP_SUCCESS,
    response: response,
    message: message,
  };
};

const resendOTPFail = (message) => {
  return {
    type: actions.RESEND_OTP_FAIL,
    message: message,
  };
};

const ResendOTP = (t, verificationData, setSeconds, setMinutes) => {
  return (dispatch) => {
    dispatch(resendOTPInit());
    let form = new FormData();
    form.append("RequestMethod", resendOTP.RequestMethod);
    form.append("RequestData", JSON.stringify(verificationData));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_01"
          ) {
            let newMessage = t("User-otp-generated-successfully");
            dispatch(
              resendOTPSuccess(response.data.responseResult, newMessage)
            );
            return setSeconds(60), setMinutes(4);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_02"
          ) {
            let newMessage = t("User-otp-not-generated-successfully");
            dispatch(resendOTPFail(newMessage));
            return setSeconds(0), setMinutes(0);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_03"
          ) {
            let newMessage = t("The-user-email-is-not-active");
            dispatch(resendOTPFail(newMessage));
            return setSeconds(0), setMinutes(0);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_04"
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(resendOTPFail(newMessage));
            return setSeconds(0), setMinutes(0);
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(resendOTPFail(newMessage));
          return setSeconds(0), setMinutes(0);
        }
      })
      .catch((response) => {
        dispatch(resendOTPFail(t("Something-went-wrong")));
      });
  };
};

const resendOTPForgotPasswordSuccess = (response, message) => {
  return {
    type: actions.RESEND_OTP_FORGOTPASSWORD_SUCCESS,
    response: response,
    message: message,
  };
};

const resendOTPForgotPasswordFail = (message) => {
  return {
    type: actions.RESEND_OTP_FORGOTPASSWORD_FAIL,
    message: message,
  };
};

const ResendOTPForgotPasswordOTP = (verificationData, t) => {
  let Data = {
    Email: verificationData.Email,
  };

  return (dispatch) => {
    dispatch(verifyoptinit());
    let form = new FormData();
    form.append("RequestMethod", resendOTPForgotPassword.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_AuthManager_ResendPassConfirmationOTP_01"
          ) {
            dispatch(
              resendOTPForgotPasswordSuccess(
                response.data.responseResult,
                t("Otp-sent-successfully")
              )
            );
            // return setSeconds(60), setMinutes(4);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_AuthManager_ResendPassConfirmationOTP_02"
          ) {
            dispatch(resendOTPForgotPasswordFail(t("No-otp-generated")));
            // return setSeconds(0), setMinutes(0);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_AuthManager_ResendPassConfirmationOTP_03"
          ) {
            dispatch(resendOTPForgotPasswordFail(t("Something-went-wrong")));
            // return setSeconds(0), setMinutes(0);
          } else {
            dispatch(resendOTPForgotPasswordFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(resendOTPForgotPasswordFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(resendOTPForgotPasswordFail(t("Something-went-wrong")));
      });
  };
};

export { VerifyOTPSignUp, ResendOTP, ResendOTPForgotPasswordOTP };
