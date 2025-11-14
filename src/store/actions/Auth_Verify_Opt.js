import * as actions from "../action_types";
import { resendOTP } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

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
    axiosInstance.post(authenticationApi, form)

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
            return () => {
              setSeconds(60);
              setMinutes(4);
            };
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_02"
          ) {
            let newMessage = t("User-otp-not-generated-successfully");
            dispatch(resendOTPFail(newMessage));
            return () => {
              setSeconds(0);
              setMinutes(0);
            };
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_03"
          ) {
            let newMessage = t("The-user-email-is-not-active");
            dispatch(resendOTPFail(newMessage));
            return () => {
              setSeconds(0);
              setMinutes(0);
            };
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_GenerateOTP_04"
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(resendOTPFail(newMessage));
            return () => {
              setSeconds(0);
              setMinutes(0);
            };
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(resendOTPFail(newMessage));
          return () => {
            setSeconds(0);
            setMinutes(0);
          };
        }
      })
      .catch((response) => {
        dispatch(resendOTPFail(t("Something-went-wrong")));
      });
  };
};

export { ResendOTP };
