import { authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";

import axios from "axios";
import {
  createOrganizationRequestMethod,
  userEmailValidation,
  userPasswordVerify,
  userPasswordCreation,
  userEmailVerification,
  getSelectedPacakge_Detail,
  changepassword,
  OrganizationPackageReselection,
  passswordUpdationOnForgetPassword,
} from "../../commen/apis/Api_config";
import { getPackageExpiryDetail } from "./GetPackageExpirtyDetails";
import { RefreshToken } from "./Auth_action";
import { TwoFaAuthenticate } from "./TwoFactorsAuthenticate_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import Helper from "../../commen/functions/history_logout";
import { getSubscriptionPaymentDetail } from "./Admin_PackageDetail";
const createOrganizationInit = () => {
  return {
    type: actions.SIGNUPORGANIZATION_INIT,
  };
};
const createOrganizationSuccess = (response, message) => {
  return {
    type: actions.SIGNUPORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};
const createOrganizationFail = (message) => {
  return {
    type: actions.SIGNUPORGANIZATION_FAIL,
    message: message,
  };
};
const createOrganization = (data, navigate, t) => {
  console.log(data, "datadatadata");
  return (dispatch) => {
    dispatch(createOrganizationInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", createOrganizationRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        console.log(response, "signupOrganization");
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_01".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "OrganizatioName",
                data.Organization.OrganizationName
              );
              localStorage.setItem(
                "userID",
                response.data.responseResult.userID
              );
              localStorage.setItem(
                "OrganizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "UserEmail",
                data.Organization.ContactPersonEmail
              );

              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The-organization-has-been-created-successfully-and-the-OTP-has-been-generated-Please-verfiy-you-email"
                  )
                )
              );
              localStorage.removeItem("PackageID");
              localStorage.setItem("minutes", 4);
              localStorage.setItem("seconds", 60);
              navigate("/verifyEmailOTP");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_02".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "userID",
                response.data.responseResult.userID
              );
              localStorage.setItem(
                "OrganizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "UserEmail",
                data.Organization.ContactPersonEmail
              );
              localStorage.setItem(
                "OrganizatioName",
                data.Organization.OrganizationName
              );
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The-organization-has-been-created-successfully-but-the-OTP-has-not-been-generated"
                  )
                )
              );
              localStorage.setItem("minutes", 0);
              localStorage.setItem("seconds", 0);
              localStorage.removeItem("PackageID");
              navigate("/verifyEmailOTP");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_03".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationFail(
                  t(
                    "The-organization-has-been-created-successfully-failed-to-save-user"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_04".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationFail(
                  t("Failed-to-save-organization-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_05".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationFail(t("Failed-to-save-organization-package"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_06".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationFail(t("This-organization-already-exists"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_07".toLowerCase()
                )
            ) {
              dispatch(createOrganizationFail(t("The-user-email-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_08".toLowerCase()
                )
            ) {
              dispatch(createOrganizationFail(t("Something-went-wrong")));
            }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_09".toLowerCase()
            //     )
            // ) {
            //   dispatch(
            //     createOrganizationSuccess(
            //       response.data.responseResult,
            //       t(
            //         "The Organization has not created successfully failed to save User."
            //       )
            //     )
            //   );
            // }
            else {
              dispatch(createOrganizationFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createOrganizationFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createOrganizationFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(createOrganizationFail(t("Something-went-wrong")));
      });
  };
};
const validationEmailInit = () => {
  return {
    type: actions.EMAILVALIDATION_INIT,
  };
};
const validationEmailSuccess = (response, message) => {
  return {
    type: actions.EMAILVALIDATION_SUCCESS,
    response: response,
    message: message,
  };
};
const validationEmailFail = (message) => {
  return {
    type: actions.EMAILVALIDATION_FAIL,
    message: message,
  };
};
const validationEmailAction = (email, navigate, t) => {
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let data = { UserEmail: email, Device: "Browser", DeviceID: id.toString() };
  return (dispatch) => {
    dispatch(validationEmailInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", userEmailValidation.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_01".toLowerCase()
                )
            ) {
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Device-does-not-exists")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_02".toLowerCase()
                )
            ) {
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Device-id-does-not-exists")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_03".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "userID",
                response.data.responseResult.userID
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Users-password-is-created")
                )
              );
              navigate("/enterPassword");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_04".toLowerCase()
                )
            ) {
              console.log("validationEmailAction", response);
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Users-password-is-created-but-somthing-went-wrong")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_05".toLowerCase()
                )
            ) {
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("User-password-is-not-created-please-create-your-password")
                )
              );
              navigate("/createpasswordorganization");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_06".toLowerCase()
                )
            ) {
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
              localStorage.setItem("UserEmail", email);
              navigate("/verifyEmailOTP");
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Users-email-is-not-verified-please-verify-your-email")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_07".toLowerCase()
                )
            ) {
              console.log("validationEmailAction", response);
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Not-a-valid-user-please-login-with-valid-user")
                )
              );
            }
          } else {
            console.log("validationEmailAction", response);
            let MessageResponce = "";
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_01".toLowerCase()
                )
            ) {
              MessageResponce = t("Device-does-not-exists");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_02".toLowerCase()
                )
            ) {
              MessageResponce = t("Device-id-does-not-exists");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_03".toLowerCase()
                )
            ) {
              MessageResponce = t("Users-password-is-created");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_04".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User's-password-is-created-but-somthing-went-wrong."
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_05".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User-password-is-not-created-please-create-your-password"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_06".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User-email-is-not-verified-Please-verify-your-email"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_07".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "Not-a-valid-user-Please-login-with-valid-user"
              );
            } else {
              MessageResponce = t("Something-went-wrong");
            }
            dispatch(validationEmailFail(MessageResponce));
          }
        } else {
          dispatch(validationEmailFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(validationEmailFail(t("Something-went-wrong")));
      });
  };
};
const enterPasswordInit = () => {
  return {
    type: actions.PASSWORDVALIDATION_INIT,
  };
};
const enterPasswordSuccess = (response, message) => {
  return {
    type: actions.PASSWORDVALIDATION_SUCCESS,
    response: response,
    message: message,
  };
};
const enterPasswordFail = (message, response) => {
  return {
    type: actions.PASSWORDVALIDATION_FAIL,
    response: response,
    message: message,
  };
};
const enterPasswordvalidation = (value, navigate, t) => {
  console.log("value", value);
  let userID = localStorage.getItem("userID");
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let data = {
    UserID: JSON.parse(userID),
    Device: "Browser",
    DeviceID: id.toString(),
    UserPassword: value,
  };
  return (dispatch) => {
    dispatch(enterPasswordInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", userPasswordVerify.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.organizationName !== undefined) {
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
            }
            if (response.data.responseResult.authToken !== null) {
              localStorage.setItem(
                "name",
                response.data.responseResult.authToken.name
              );
              localStorage.setItem(
                "token",
                JSON.stringify(response.data.responseResult.authToken.token)
              );
              localStorage.setItem(
                "refreshToken",
                JSON.stringify(
                  response.data.responseResult.authToken.refreshToken
                )
              );
              localStorage.setItem(
                "roleID",
                response.data.responseResult.authToken.roleID
              );
              localStorage.setItem(
                "isFirstLogin",
                response.data.responseResult.authToken.isFirstLogIn
              );
              localStorage.setItem("activeOtoChatID", 0);
            }

            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_01".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(enterPasswordFail(t("Device-does-not-exists")));
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(enterPasswordFail(t("Device-does-not-exists")));
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(enterPasswordFail(t("Device-does-not-exists")));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_02".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(enterPasswordFail(t("Device-id-does-not-exists")));
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(enterPasswordFail(t("Device-id-does-not-exists")));
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(enterPasswordFail(t("Device-id-does-not-exists")));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_03".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                mqttConnection(response.data.responseResult.authToken.userID);
                await dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                await dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                // navigate("/");
                await dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_04".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                await dispatch(
                  getPackageExpiryDetail(
                    navigate,
                    response.data.responseResult.organizationRoleID,
                    t
                  )
                );
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );

                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_05".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 3) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user")
                  )
                );
                if (
                  response.data.responseResult.authToken.isFirstLogIn === true
                ) {
                  navigate("/onboard");
                } else {
                  navigate("/DisKus/");
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_07".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                localStorage.setItem(
                  "isFirstLogin",
                  response.data.responseResult.authToken.isFirstLogIn
                );
                mqttConnection(response.data.responseResult.authToken.userID);

                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    data.UserID,
                    navigate
                  )
                );
                // navigate("/");
                mqttConnection(response.data.responseResult.authToken.userID);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_08".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                await dispatch(
                  getPackageExpiryDetail(
                    navigate,
                    response.data.responseResult.organizationID,
                    t
                  )
                );
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );

                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_09".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 3) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user")
                  )
                );
                if (
                  response.data.responseResult.authToken.isFirstLogIn === true
                ) {
                  navigate("/onboard");
                } else {
                  navigate("/DisKus/");
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_10".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-an-admin-user-the-organization-subscription-is-not-active-please-activate-it"
                    )
                  )
                );
                navigate("/DisKus/Admin/Payment/PayOutstanding");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-an-admin-user-the-organization-subscription-is-not-active-please-activate-it"
                    )
                  )
                );
                navigate("/Diskus/Admin/Nonactive/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-an-admin-user-the-organization-subscription-is-not-active-please-activate-it"
                    )
                  )
                );
                navigate("/DisKus/Nonactive/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_11".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-not-an-admin-user-the-organization-subscription-is-not-activated-please-contact-your-admin"
                    )
                  )
                );
                navigate("/DisKus/Admin/Payment/PayOutstanding");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-not-an-admin-user-the-organization-subscription-is-not-activated-please-contact-your-admin"
                    )
                  )
                );
                navigate("/DisKus/Admin/Nonactive/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-is-not-an-admin-user-the-organization-subscription-is-not-activated-please-contact-your-admin"
                    )
                  )
                );
                navigate("/DisKus/Nonactive/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_12".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordFail(
                    t("Your-organization-is-not-activated"),
                    true
                  )
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                navigate("/selectedpackage");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  enterPasswordFail(t("Your-organization-is-not-activated"))
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  enterPasswordFail(t("Your-organization-is-not-activated"))
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_13".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_14".toLowerCase()
                )
            ) {
              dispatch(
                enterPasswordFail(t("Password-verification-failed-try-again"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_15".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("The-user-is-a-partial-admin")
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_16".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordFail(
                    t(
                      "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                enterPasswordFail(
                  t(
                    "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                enterPasswordSuccess(
                  response.data.responseResult,
                  t(
                    "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
                  )
                );
                navigate("/DisKus/Admin/Nonactive/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_17".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "organizationRoleID",
                  response.data.responseResult.organizationRoleID
                );
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("The-user-is-a-partial-admin")
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_18".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(enterPasswordFail(t("The-user-is-blocked")));
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(enterPasswordFail(t("The-user-is-blocked")));
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(enterPasswordFail(t("The-user-is-blocked")));
                navigate("/");
              }
            } else {
              dispatch(enterPasswordFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(enterPasswordFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(enterPasswordFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(enterPasswordFail(t("Something-went-wrong")));
      });
  };
};
const verifyOTPInit = () => {
  return {
    type: actions.VERIFYOTPFOREMAIL_INIT,
  };
};
const verifyOTPSuccess = (response, message) => {
  return {
    type: actions.VERIFYOTPFOREMAIL_SUCCESS,
    response: response,
    message: message,
  };
};
const verifyOTPFail = (message) => {
  return {
    type: actions.VERIFYOTPFOREMAIL_FAIL,
    message: message,
  };
};
const verificationEmailOTP = (
  OTPValue,
  navigate,
  t,
  updateFlag,
  setSeconds,
  setMinutes
) => {
  let userID = localStorage.getItem("userID");
  let email = localStorage.getItem("UserEmail");
  let data = { UserID: JSON.parse(userID), Email: email, OTP: OTPValue };
  console.log(userID, "verificationEmailOTP");
  // 3P3KVX
  return (dispatch) => {
    dispatch(verifyOTPInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", userEmailVerification.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserEmailVerification_01".toLowerCase()
                )
            ) {
              dispatch(
                verifyOTPSuccess(
                  response.data.responseResult,
                  t("The-users-email-has-been-verified")
                )
              );
              // localStorage.removeItem("OrganizationID");
              if (updateFlag === true) {
                localStorage.setItem("updatePasswordCheck", true);
              } else {
                localStorage.setItem("updatePasswordCheck", false);
              }
              localStorage.removeItem("seconds");
              localStorage.removeItem("minutes");
              navigate("/createpasswordorganization");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserEmailVerification_02".toLowerCase()
                )
            ) {
              dispatch(
                verifyOTPFail(t("Invalid-otp-failed-to-verify-user-email"))
              );
              // return setSeconds(0), setMinutes(0);
              // navigate("/createpasswordorganization");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserEmailVerification_03".toLowerCase()
                )
            ) {
              dispatch(
                verifyOTPFail(t("The-users-email-has-not-been-verified"))
              );
              // return setSeconds(0), setMinutes(0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserEmailVerification_04".toLowerCase()
                )
            ) {
              dispatch(
                verifyOTPFail(
                  t("The-user-has-reached-the-maximum-faileda-attempts")
                )
              );
              navigate("/");
            }
            // navigate("/createpasswordorganization")
            //    dispatch(verifyOTPSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
          } else {
            dispatch(verifyOTPFail(t("Something-went-wrong")));
            // return setSeconds(0), setMinutes(0);
          }
        } else if (response.data.responseCode === 400) {
          dispatch(verifyOTPFail(t("Something-went-wrong")));
          // return setSeconds(0), setMinutes(0);
        }
      })
      .catch((response) => {
        dispatch(verifyOTPFail(t("Something-went-wrong")));
        // return setSeconds(0), setMinutes(0);
      });
  };
};
const createPasswordInit = () => {
  return {
    type: actions.PASSWORDCREATION_INIT,
  };
};
const createPasswordSuccess = (response, message) => {
  return {
    type: actions.PASSWORDCREATION_SUCCESS,
    response: response,
    message: message,
  };
};
const createPasswordFail = (message) => {
  return {
    type: actions.PASSWORDCREATION_FAIL,
    message: message,
  };
};
const createPasswordAction = (value, navigate, t) => {
  let userID = localStorage.getItem("userID");
  let data = { UserID: JSON.parse(userID), Password: value };
  return (dispatch) => {
    dispatch(createPasswordInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", userPasswordCreation.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        console.log(response, "createPasswordAction");
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.organizationName !== undefined) {
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
            }
            if (response.data.responseResult.authToken !== null) {
              localStorage.setItem(
                "name",
                response.data.responseResult.authToken.name
              );
              localStorage.setItem(
                "token",
                JSON.stringify(response.data.responseResult.authToken.token)
              );
              localStorage.setItem(
                "refreshToken",
                JSON.stringify(
                  response.data.responseResult.authToken.refreshToken
                )
              );
              localStorage.setItem(
                "roleID",
                response.data.responseResult.authToken.roleID
              );
            }
            localStorage.setItem(
              "organizationID",
              response.data.responseResult.organizationID
            );
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_01".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                // localStorage.setItem("globalPassowrdChecker", true);

                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                navigate("/selectedpackage");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                navigate("/selectedpackage");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_02".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "roleID",
                JSON.parse(response.data.responseResult.userRoleId)
              );
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }

              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    userID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    userID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2fa-enabled")
                  )
                );
                localStorage.setItem("2fa", true);
                dispatch(
                  TwoFaAuthenticate(
                    t,
                    response.data.responseResult.organizationID,
                    userID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                // navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_03".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              localStorage.setItem(
                "roleID",
                JSON.parse(response.data.responseResult.userRoleId)
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "organizationRoleID",
                response.data.responseResult.organizationRoleID
              );
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Tthe-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Tthe-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordFail(
                    response.data.responseResult,
                    t("Tthe-user-is-a-partial-admin-user")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_04".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (response.data.responseResult.organizationName !== undefined) {
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
              }
              if (response.data.responseResult.authToken !== null) {
                localStorage.setItem(
                  "name",
                  response.data.responseResult.authToken.name
                );
                localStorage.setItem(
                  "token",
                  JSON.stringify(response.data.responseResult.authToken.token)
                );
                localStorage.setItem(
                  "refreshToken",
                  JSON.stringify(
                    response.data.responseResult.authToken.refreshToken
                  )
                );
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user")
                  )
                );
                if (
                  response.data.responseResult.authToken.isFirstLogIn === true
                ) {
                  navigate("/onboard");
                } else {
                  navigate("/DisKus/");
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_05".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_06".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2fa-enabled")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2fa-enabled")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2fa-enabled")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_07".toLowerCase()
                )
            ) {
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
                localStorage.setItem("revokeCancellation", true);
              } else {
                localStorage.setItem("revokeCancellation", false);
              }
              if (response.data.responseResult.organizationName !== undefined) {
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
              }
              if (response.data.responseResult.authToken !== null) {
                localStorage.setItem(
                  "name",
                  response.data.responseResult.authToken.name
                );
                localStorage.setItem(
                  "token",
                  JSON.stringify(response.data.responseResult.authToken.token)
                );
                localStorage.setItem(
                  "refreshToken",
                  JSON.stringify(
                    response.data.responseResult.authToken.refreshToken
                  )
                );
                localStorage.setItem(
                  "roleID",
                  JSON.parse(response.data.responseResult.userRoleId)
                );
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_08".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    response.data.responseResult.authToken.roleID
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                navigate("/Diskus/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_09".toLowerCase()
                )
            ) {
              localStorage.setItem("blur", true);
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-organization-is-inactive-and-the-user-is-an-admin-user"
                    )
                  )
                );
                navigate("/selectedpackage");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-organization-is-inactive-and-the-user-is-an-admin-user"
                    )
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-organization-is-inactive-and-the-user-is-an-admin-user"
                    )
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_10".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-organization-is-inactive-please-contact-your-admin")
                  )
                );

                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-organization-is-inactive-please-contact-your-admin")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-organization-is-inactive-please-contact-your-admin")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_11".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Something-went-wrong")
                  )
                );
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Something-went-wrong")
                  )
                );
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Something-went-wrong")
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_12".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-please-activate")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-please-activate")
                  )
                );
                navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-please-activate")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_13".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/PayOutstanding");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/Nonactive");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_14".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/PayOutstanding");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/Nonactive");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
                    )
                  )
                );
                navigate("/Diskus/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_15".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-not-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/PayOutstanding");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-not-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/Admin/Nonactive");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                localStorage.setItem("blur", true);
                if (
                  response.data.responseResult.organizationName !== undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken !== null) {
                  localStorage.setItem(
                    "name",
                    response.data.responseResult.authToken.name
                  );
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.data.responseResult.authToken.token)
                  );
                  localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(
                      response.data.responseResult.authToken.refreshToken
                    )
                  );
                  localStorage.setItem(
                    "roleID",
                    JSON.parse(response.data.responseResult.userRoleId)
                  );
                }
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-and-this-is-not-an-admin-user"
                    )
                  )
                );
                navigate("/Diskus/");
              }
            } else {
              dispatch(createPasswordFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createPasswordFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createPasswordFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(createPasswordFail(t("Something-went-wrong")));
      });
  };
};
const getSelectedPackageandDetailsInit = () => {
  return {
    type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_INIT,
  };
};
const getSelectedPackageandDetailsSuccess = (response, message) => {
  return {
    type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getSelectedPackageandDetailsFail = (message) => {
  return {
    type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_FAIL,
    message: message,
  };
};
const getSelectedPacakgeDetail = (navigate, t) => {
  let value = localStorage.getItem("OrganizatioName");
  let data = { OrganizationName: value };
  return (dispatch) => {
    dispatch(getSelectedPackageandDetailsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", getSelectedPacakge_Detail.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_01".toLowerCase()
                )
            ) {
              dispatch(
                getSelectedPackageandDetailsSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              let TenureID =
                response.data.responseResult.organizationSelectedPackage
                  .fK_TenureOfSubscription;
              dispatch(getSubscriptionPaymentDetail(navigate, TenureID, t));
              console.log("test");
              // navigate("/paymentForm")
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_02".toLowerCase()
                )
            ) {
              dispatch(
                getSelectedPackageandDetailsSuccess(
                  response.data.responseResult,
                  t("No-data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_03".toLowerCase()
                )
            ) {
              dispatch(
                getSelectedPackageandDetailsSuccess(
                  response.data.responseResult,
                  t("No-data-available")
                )
              );
            }
          } else {
            dispatch(getSelectedPackageandDetailsFail(t("No-data-available")));
          }
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(getSelectedPackageandDetailsFail(t("No-data-available")));
      });
  };
};
const changePasswordInit = () => {
  return {
    type: actions.CHANGEPASSWORD_INIT,
  };
};
const changePasswordSuccess = (message) => {
  return {
    type: actions.CHANGEPASSWORD_SUCCESS,
    message: message,
  };
};
const changePasswordFail = (message) => {
  return {
    type: actions.CHANGEPASSWORD_FAIL,
    message: message,
  };
};
const changePasswordFunc = (navigate, oldPassword, newPassword, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let data = {
    UserID: userID,
    OldPassword: oldPassword,
    NewPassword: newPassword,
    DeviceID: "1111",
  };
  return (dispatch) => {
    dispatch(changePasswordInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", changepassword.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("response", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(changePasswordFunc(navigate, oldPassword, newPassword, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_ChangePassword_01".toLowerCase()
                )
            ) {
              console.log("response", response);

              dispatch(
                changePasswordSuccess(t("Password-updated-successfully"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_ChangePassword_02".toLowerCase()
                )
            ) {
              dispatch(changePasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_ChangePassword_03".toLowerCase()
                )
            ) {
              dispatch(changePasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_ChangePassword_04".toLowerCase()
                )
            ) {
              dispatch(changePasswordFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(changePasswordFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(changePasswordFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(changePasswordFail(t("Something-went-wrong")));
      });
  };
};
const setLoader = (response) => {
  return {
    type: actions.AUTH2_REDUCER_LOADER,
    response: response,
  };
};
const cleareMessage = (response) => {
  return {
    type: actions.CLEARE_MESSAGE,
  };
};
const organizationPackageReselectionInit = () => {
  return {
    type: actions.RESELECTIONPACKAGE_INIT,
  };
};
const organizationPackageReselectionSuccess = (response, message) => {
  return {
    type: actions.RESELECTIONPACKAGE_SUCCESS,
    response: response,
    message: message,
  };
};
const organizationPackageReselectionFail = (message) => {
  return {
    type: actions.RESELECTIONPACKAGE_FAIL,
    message: message,
  };
};

const organizationPackageReselection = (
  ID,
  TenureOfSuscriptionID,
  navigate,
  t
) => {
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
    SelectedPackageID: JSON.parse(ID),
    TenureOfSuscriptionID: JSON.parse(TenureOfSuscriptionID),
  };
  console.log("flagForSelectedPackeg", data);
  return (dispatch) => {
    dispatch(organizationPackageReselectionInit());
    let form = new FormData();
    form.append("RequestMethod", OrganizationPackageReselection.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        console.log("flagForSelectedPackeg", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          await dispatch(
            organizationPackageReselection(
              ID,
              TenureOfSuscriptionID,
              navigate,
              t
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            localStorage.setItem(
              "organizationID",
              response.data.responseResult.organizationID
            );
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_01".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionSuccess(
                  response.data.responseResult,
                  t("Organization-package-selected-successfully")
                )
              );
              navigate("/selectedpackage");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_02".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionFail(
                  response.data.responseResult,
                  t("Organization-package-not-selected")
                )
              );
              // navigate("/Diskus/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_03".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionFail(
                  response.data.responseResult,
                  t("Organization-package-not-save")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_04".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionFail(
                  response.data.responseResult,
                  t("Previous-package-not-deleted")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_05".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionFail(
                  response.data.responseResult,
                  t("Previous-subscription-not-deleted")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_OrganizationPackageReselection_06".toLowerCase()
                )
            ) {
              dispatch(
                organizationPackageReselectionFail(
                  response.data.responseResult,
                  t("Something-went-wrong")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else {
              dispatch(
                organizationPackageReselectionFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              organizationPackageReselectionFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            organizationPackageReselectionFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(organizationPackageReselectionFail(t("Something-went-wrong")));
      });
  };
};

const passwordupdateinit = () => {
  return {
    type: actions.PASSWORD_UPDATE_INIT,
  };
};

const passwordupdatesuccess = (message) => {
  return {
    type: actions.PASSWORD_UPDATE_SUCCESS,
    message: message,
  };
};

const passwordupdatefail = (message) => {
  return {
    type: actions.PASSWORD_UPDATE_FAIL,
    message: message,
  };
};

const updatePasswordAction = (value, navigate, t) => {
  let userID = localStorage.getItem("userID");
  let data = {
    UserID: JSON.parse(userID),
    NewPassword: value,
  };

  return (dispatch) => {
    dispatch(passwordupdateinit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      passswordUpdationOnForgetPassword.RequestMethod
    );
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        console.log(response, "createPasswordAction");
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordUpdationOnForgetPassword_01".toLowerCase()
                )
            ) {
              dispatch(
                passwordupdatesuccess(t("Password-updated-successfully"))
              );
              localStorage.removeItem("updatePasswordCheck");
              navigate("/updatepassword");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordUpdationOnForgetPassword_02".toLowerCase()
                )
            ) {
              dispatch(createPasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordUpdationOnForgetPassword_03".toLowerCase()
                )
            ) {
              dispatch(createPasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordUpdationOnForgetPassword_04".toLowerCase()
                )
            ) {
              dispatch(createPasswordFail(t("Something-went-wrong")));
            } else {
              dispatch(createPasswordFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(passwordupdatefail(t("Something-went-wrong")));
          }
        } else {
          dispatch(passwordupdatefail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(passwordupdatefail(t("Something-went-wrong")));
      });
  };
};

const setClient = (response) => {
  return {
    type: actions.SET_MQTT_CLIENT,
    response: response,
  };
};

export {
  setClient,
  setLoader,
  createOrganization,
  validationEmailAction,
  enterPasswordvalidation,
  verificationEmailOTP,
  getSelectedPacakgeDetail,
  createPasswordAction,
  cleareMessage,
  changePasswordFunc,
  organizationPackageReselection,
  updatePasswordAction,
};
