import * as actions from "../action_types";
import axios from "axios";
import {
  verifyotp,
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

const verifyoptsuccess = (response) => {
  return {
    type: actions.VERIFY_OPT_SUCCESS,
    response: response,
  };
};

const verifyoptfail = (response) => {
  return {
    type: actions.VERIFY_OPT_FAIL,
    response: response,
  };
};

const VerifyOTPFunc = (verificationData, navigate, setVerificationError) => {
  console.log("verificationData 1", verificationData);

  let Data = {
    UserID: parseInt(verificationData.UserID),
    Email: verificationData.Email,
    OTP: verificationData.OTP,
    Device: "browser",
  };
  console.log("verificationData 2", Data);

  return (dispatch) => {
    dispatch(verifyoptinit());
    let form = new FormData();
    form.append("RequestMethod", verifyotp.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          console.log("SignIn Response", response);
          dispatch(
            verifyoptsuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
          console.log("verificationData 1.1.2", Data, verificationData);
          localStorage.setItem("verificationData", verificationData);
          localStorage.setItem("Email", Data.Email);
          localStorage.setItem("UserID", Data.UserID);
          setVerificationError(false);
          navigate("/updateNewPassword");
        } else {
          setVerificationError(true);
          dispatch(verifyoptfail(response.data.responseResult));
        }
      })
      .catch((response) => {
        dispatch(verifyoptfail(response));
        //   dispatch(SomeThingWentWrong(response));
      });
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
  console.log("verificationData 1", verificationData);

  let Data = {
    UserID: parseInt(verificationData.UserID),
    Email: verificationData.Email,
    OTP: verificationData.OTP,
  };

  console.log("verificationData", Data);

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
          console.log("SignIn Response", response);
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

const resendOTPSuccess = (response, message) => {
  return {
    type: actions.RESEND_OTP_SUCCESS,
    response: response,
    message: message,
  };
};

const resendOTPFail = (response, message) => {
  return {
    type: actions.RESEND_OTP_FAIL,
    response: response,
    message: message,
  };
};

const ResendOTP = (verificationData) => {
  console.log("verificationData 1", verificationData);

  let Data = {
    Email: verificationData.Email,
  };

  console.log("verificationData", Data);

  return (dispatch) => {
    dispatch(verifyoptinit());
    let form = new FormData();
    form.append("RequestMethod", resendOTP.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          console.log("SignIn Response", response);
          dispatch(
            resendOTPSuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
        } else {
          dispatch(
            resendOTPFail(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
        }
      })
      .catch((response) => {
        dispatch(resendOTPFail(response));
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

const resendOTPForgotPasswordFail = (response, message) => {
  return {
    type: actions.RESEND_OTP_FORGOTPASSWORD_FAIL,
    response: response,
    message: message,
  };
};

const ResendOTPForgotPasswordOTP = (verificationData) => {
  let Data = {
    Email: verificationData.Email,
  };

  console.log("verificationData", Data);

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
          console.log("SignIn Response", response);
          dispatch(
            resendOTPForgotPasswordSuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
        } else {
          dispatch(
            resendOTPForgotPasswordFail(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
        }
      })
      .catch((response) => {
        dispatch(resendOTPForgotPasswordFail(response));
      });
  };
};

export {
  VerifyOTPFunc,
  VerifyOTPSignUp,
  ResendOTP,
  ResendOTPForgotPasswordOTP,
};
