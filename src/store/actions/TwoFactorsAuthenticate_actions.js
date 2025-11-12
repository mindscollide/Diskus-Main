import * as actions from "../action_types";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import {
  TwoFaAuthenticateRequestMethod,
  sendTwoFacOTP,
  verifyTwoFacOTP,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { LoginFlowRoutes } from "./UserManagementActions";
import {
  clearLocalStorageAtloginresponce,
  handleNavigation,
} from "../../commen/functions/utils";
import axiosInstance from "../../commen/functions/axiosInstance";
const TwoFaAuthenticateInit = () => {
  return {
    type: actions.CHECKINGAUTHENTICATEAFA_INIT,
  };
};
const TwoFaAuthenticateSuccess = (response, message) => {
  return {
    type: actions.CHECKINGAUTHENTICATEAFA_SUCCESS,
    response: response,
    message: message,
  };
};
const TwoFaAuthenticateFail = (message) => {
  return {
    type: actions.CHECKINGAUTHENTICATEAFA_FAIL,
    message: message,
  };
};

const TwoFaAuthenticate = (t, OrganiztionID, userID, navigate) => {
  let Data = {
    UserID: JSON.parse(userID),
    Device: "Browser",
    DeviceID: "1",
    OrganizationID: JSON.parse(OrganiztionID),
  };
  return (dispatch) => {
    dispatch(TwoFaAuthenticateInit());
    let form = new FormData();
    form.append("RequestMethod", TwoFaAuthenticateRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(TwoFaAuthenticate(t, OrganiztionID, userID, navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_01".toLowerCase()
                )
            ) {
              await dispatch(
                TwoFaAuthenticateFail(t("Device-does-not-exists"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_02".toLowerCase()
                )
            ) {
              await dispatch(
                TwoFaAuthenticateFail(t("Device-id-does-not-exists"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_03".toLowerCase()
                )
            ) {
              await dispatch(
                TwoFaAuthenticateSuccess(
                  response.data.responseResult,
                  t("2FA-authentication-is-not-enabled-against-this-user")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_04".toLowerCase()
                )
            ) {
              await dispatch(TwoFaAuthenticateFail(t("No-user-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_05".toLowerCase()
                )
            ) {
              await dispatch(
                TwoFaAuthenticateSuccess(
                  response.data.responseResult,
                  t("User-has-saved-devices-along-with-email-and-sms")
                )
              );
              console.log(response.data.responseResult.userDevices.length);
              if (response.data.responseResult.userDevices.length === 1) {
                dispatch(LoginFlowRoutes(8));
                localStorage.setItem("LoginFlowPageRoute", 8);
                localStorage.setItem("isMultiDevice", false);
              } else {
                localStorage.setItem("isMultiDevice", true);
                localStorage.setItem("LoginFlowPageRoute", 13);
                dispatch(LoginFlowRoutes(13));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_06".toLowerCase()
                )
            ) {
              await dispatch(
                TwoFaAuthenticateSuccess(
                  response.data.responseResult,
                  ""
                  // t("User-doesnt-have-saved-devices")
                )
              );
              localStorage.removeItem("SignupFlowPageRoute");
              localStorage.setItem("LoginFlowPageRoute", 4);
              localStorage.setItem("commingfromSignFlow", true);
              dispatch(LoginFlowRoutes(4));
              navigate("/");
              console.log("Complete");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Authenticate2FA_07".toLowerCase()
                )
            ) {
              await dispatch(TwoFaAuthenticateFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(TwoFaAuthenticateFail(t("Something-went-wrong")));
          }
        } else if (response.data.responseCode === 400) {
          await dispatch(TwoFaAuthenticateFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(TwoFaAuthenticateFail(t("Something-went-wrong")));
      });
  };
};

const sendTwoFacOtpInit = () => {
  return {
    type: actions.SENDTWOFACOTP_INIT,
  };
};

const sendTwoFacOtpSuccess = (response, message) => {
  return {
    type: actions.SENDTWOFACOTP_SUCCESS,
    response: response,
    message: message,
  };
};

const sendTwoFacOtpFail = (message) => {
  return {
    type: actions.SENDTWOFACOTP_FAIL,
    message: message,
  };
};

// t, navigate, Data, selectDevice, setCurrentStep; Previous Props
const sendTwoFacAction = (t, navigate, Data, setSeconds, setMinutes) => {
  return (dispatch) => {
    dispatch(sendTwoFacOtpInit());
    let form = new FormData();
    form.append("RequestMethod", sendTwoFacOTP.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_01".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Device-does-not-exists")));
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_02".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Device-id-does-not-exists")));
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_03".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("FailedtogenerateOTP")));
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_04".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-sms-and-devices")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_05".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-sms-and-devices")
                )
              );

              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_06".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-and-devices")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_07".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-and-sms")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
              localStorage.setItem("value", 2);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_08".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-devices")
                )
              );
              // navigate("/2FAverificationdevieotp");
              dispatch(LoginFlowRoutes(14));
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_09".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-sms")
                )
              );

              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
              localStorage.setItem("value", 0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_10".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email")
                )
              );

              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              localStorage.setItem("seconds", 60);
              localStorage.setItem("minutes", 4);
              localStorage.setItem("value", 1);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_11".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
      });
  };
};

const resendTwoFacAction = (t, Data, navigate, setSeconds, setMinutes) => {
  return (dispatch) => {
    dispatch(sendTwoFacOtpInit());
    let form = new FormData();
    form.append("RequestMethod", sendTwoFacOTP.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            resendTwoFacAction(t, Data, navigate, setSeconds, setMinutes)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_01".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Device-does-not-exists")));
              setSeconds(0);
              setMinutes(0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_02".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Device-id-does-not-exists")));
              // return setSeconds(0), setMinutes(0);
              setSeconds(0);
              setMinutes(0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_03".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("FailedtogenerateOTP")));
              // return setSeconds(0), setMinutes(0);
              setSeconds(0);
              setMinutes(0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_04".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-sms-and-devices")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              // return setSeconds(60), setMinutes(4);
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_05".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-sms-and-devices")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_06".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-and-devices")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp");
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_07".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email-and-sms")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp", { state: { value: 2 } });
              // return setSeconds(60), setMinutes(4);
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_08".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-devices")
                )
              );
              navigate("/2FAverificationdevieotp");
              // return setSeconds(60), setMinutes(4);
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_09".toLowerCase()
                )
            ) {
              // localStorage.setItem("seconds", 0);
              // localStorage.setItem("minutes", 0);
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-sms")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp", { state: { value: 0 } });
              // return setSeconds(60), setMinutes(4);
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_10".toLowerCase()
                )
            ) {
              dispatch(
                sendTwoFacOtpSuccess(
                  response.data.responseResult,
                  t("Otp-code-sent-via-email")
                )
              );
              //localStorage.setItem("LoginFlowPageRoute", 6);
              dispatch(LoginFlowRoutes(6));
              // navigate("/2FAverificationotp", { state: { value: 1 } });
              // return setSeconds(60), setMinutes(4);
              setSeconds(60);
              setMinutes(4);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Send2FAOTP_11".toLowerCase()
                )
            ) {
              dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(sendTwoFacOtpFail(t("Something-went-wrong")));
      });
  };
};

const verifyOtpFacInit = () => {
  return {
    type: actions.SENDTWOFACOTP_INIT,
  };
};

const verifyOtpFacSuccess = (response, message) => {
  return {
    type: actions.SENDTWOFACOTP_SUCCESS,
    response: response,
    message: message,
  };
};
const verifyOtpFacFail = (message) => {
  return {
    type: actions.SENDTWOFACOTP_FAIL,
    message: message,
  };
};

const verificationTwoFacOtp = (Data, t, navigate, setOtpCode) => {
  return (dispatch) => {
    dispatch(verifyOtpFacInit());
    let form = new FormData();
    form.append("RequestMethod", verifyTwoFacOTP.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(verificationTwoFacOtp(Data, t, navigate, setOtpCode));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Verify2FAOTP_01".toLowerCase()
                )
            ) {
              dispatch(
                verifyOtpFacSuccess(
                  response.data.responseResult,
                  t("Otp-has-been-verified-successfully")
                )
              );
              localStorage.setItem("TowApproval", true);
              let isFirstLogin = JSON.parse(
                localStorage.getItem("isFirstLogin")
              );
              handleNavigation(navigate, isFirstLogin, dispatch);

              clearLocalStorageAtloginresponce(dispatch, 1, navigate);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Verify2FAOTP_02".toLowerCase()
                )
            ) {
              setOtpCode("");
              dispatch(verifyOtpFacFail(t("Failed-to-verify-otp")));
              localStorage.setItem("TowApproval", false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Verify2FAOTP_03".toLowerCase()
                )
            ) {
              dispatch(verifyOtpFacFail(t("Something-went-wrong")));
              localStorage.setItem("TowApproval", false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Verify2FAOTP_04".toLowerCase()
                )
            ) {
              dispatch(verifyOtpFacFail(t("No-otp-exist-against-this-user")));
              setOtpCode("");
              localStorage.setItem("TowApproval", false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_Verify2FAOTP_05".toLowerCase()
                )
            ) {
              dispatch(
                verifyOtpFacFail(
                  t("The-user-has-reached-the-maximum-faileda-attempts")
                )
              );
              setOtpCode("");
              navigate("/");
            }
          } else {
            dispatch(verifyOtpFacFail(t("Something-went-wrong")));
            localStorage.setItem("TowApproval", false);
          }
        } else {
          dispatch(verifyOtpFacFail(t("Something-went-wrong")));
          localStorage.setItem("TowApproval", false);
        }
      })
      .catch((response) => {
        dispatch(verifyOtpFacFail(t("Something-went-wrong")));
        localStorage.setItem("TowApproval", false);
        console.log("TowApproval");
      });
  };
};
export {
  TwoFaAuthenticate,
  sendTwoFacAction,
  verificationTwoFacOtp,
  resendTwoFacAction,
};
