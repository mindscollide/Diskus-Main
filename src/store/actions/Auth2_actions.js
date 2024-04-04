import {
  authenticationApi,
  userLogOutAuthURL,
} from "../../commen/apis/Api_ends_points";
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
  UserLogout,
} from "../../commen/apis/Api_config";
import { getPackageExpiryDetail } from "./GetPackageExpirtyDetails";
import { RefreshToken } from "./Auth_action";
import { TwoFaAuthenticate } from "./TwoFactorsAuthenticate_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import Helper from "../../commen/functions/history_logout";
import { getSubscriptionPaymentDetail } from "./Admin_PackageDetail";
import { LoginFlowRoutes } from "./UserManagementActions";
import { showCreateAddtionalUsersModal } from "./UserMangementModalActions";

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
  let token = JSON.parse(localStorage.getItem("token"));
  let data = { UserEmail: email, Device: "Browser", DeviceID: "1" };
  return (dispatch) => {
    dispatch(validationEmailInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", userEmailValidation.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_01".toLowerCase()
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
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_02".toLowerCase()
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
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_03".toLowerCase()
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
              localStorage.setItem("LoginFlowPageRoute", 2);
              dispatch(LoginFlowRoutes(2));
              // navigate("/enterPassword");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_04".toLowerCase()
                )
            ) {
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
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_05".toLowerCase()
                )
            ) {
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("User-password-is-not-created-please-create-your-password")
                )
              );
              localStorage.setItem("LoginFlowPageRoute", 11);
              dispatch(LoginFlowRoutes(11));
              // navigate("/createpasswordorganization");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_06".toLowerCase()
                )
            ) {
              localStorage.setItem("seconds", 0);
              localStorage.setItem("minutes", 0);
              localStorage.setItem("UserEmail", email);
              localStorage.setItem("LoginFlowPageRoute", 3);
              dispatch(LoginFlowRoutes(3));
              // navigate("/verifyEmailOTP");
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
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_07".toLowerCase()
                )
            ) {
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("Not-a-valid-user-please-login-with-valid-user")
                )
              );
            }
          } else {
            let MessageResponce = "";
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_01".toLowerCase()
                )
            ) {
              MessageResponce = t("Device-does-not-exists");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_02".toLowerCase()
                )
            ) {
              MessageResponce = t("Device-id-does-not-exists");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_03".toLowerCase()
                )
            ) {
              MessageResponce = t("Users-password-is-created");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_04".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User's-password-is-created-but-somthing-went-wrong."
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_05".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User-password-is-not-created-please-create-your-password"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_06".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User-email-is-not-verified-Please-verify-your-email"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithUserEmail_07".toLowerCase()
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
  let userID = localStorage.getItem("userID");
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let data = {
    UserID: JSON.parse(userID),
    Device: "Browser",
    DeviceID: "1",
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
                "userEmail",
                response.data.responseResult.authToken.userName
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
              localStorage.setItem("activeCall", false);
              localStorage.setItem("initiateVideoCall", false);
              localStorage.setItem("activeRoomID", 0);
              localStorage.setItem("isMeeting", false);
              localStorage.setItem("newCallerID", 0);
              const emptyArray = [];
              localStorage.setItem(
                "callerStatusObject",
                JSON.stringify(emptyArray)
              );
              localStorage.setItem("meetingTitle", "");
            }

            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_UserPasswordVerification_01".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_02".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_03".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_04".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_05".toLowerCase()
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
                  let RSVP = localStorage.getItem("RSVP");
                  let dataroomValue = localStorage.getItem("DataRoomEmail");

                  if (RSVP !== undefined && RSVP !== null) {
                    navigate("/DisKus/Meeting/Useravailabilityformeeting");
                  } else if (
                    dataroomValue !== null &&
                    dataroomValue !== undefined
                  ) {
                    navigate("/Diskus/dataroom");
                  } else {
                    navigate("/Diskus/");
                  }
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_UserPasswordVerification_07".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_08".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_09".toLowerCase()
                )
            ) {
              let LocalUserRoutes = [
                { name: "Meeting", id: 1 },
                { name: "todolist", id: 2 },
                { name: "calendar", id: 3 },
                { name: "Diskus", id: 4 },
                { name: "setting", id: 5 },
                { name: "faq's", id: 6 },
                { name: "changePassword", id: 7 },
                { name: "home", id: 8 },
                { name: "", id: 9 },
              ];
              let LocalAdminRoutes = [
                { name: "Admin", id: 1 },
                { name: "ManageUsers", id: 2 },
                { name: "OrganizationlevelConfigUM", id: 3 },
                { name: "PackageDetailsUserManagement", id: 4 },
                { name: "Summary", id: 5 },
              ];
              localStorage.setItem(
                "LocalUserRoutes",
                JSON.stringify(LocalUserRoutes)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify(LocalAdminRoutes)
              );

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
                  let RSVP = localStorage.getItem("RSVP");
                  let dataroomValue = localStorage.getItem("DataRoomEmail");

                  if (RSVP !== undefined && RSVP !== null) {
                    navigate("/DisKus/Meeting/Useravailabilityformeeting");
                  } else if (
                    dataroomValue !== null &&
                    dataroomValue !== undefined
                  ) {
                    navigate("/Diskus/dataroom");
                  } else {
                    navigate("/Diskus/");
                  }
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_UserPasswordVerification_10".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_11".toLowerCase()
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_12".toLowerCase()
                )
            ) {
              localStorage.setItem("signupCurrentPage", 5);
              navigate("/Signup");
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
                  "ERM_AuthService_AuthManager_UserPasswordVerification_13".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );

                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                // navigate("/");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                // navigate("/");
              } else {
                dispatch(
                  enterPasswordFail(
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );

                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                // navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_UserPasswordVerification_14".toLowerCase()
                )
            ) {
              dispatch(
                enterPasswordFail(t("Password-verification-failed-try-again"))
              );
            }
            //  else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_AuthManager_PasswordVerification_15".toLowerCase()
            //     )
            // ) {
            //   if (
            //     parseInt(
            //       response.data.responseResult.organizationSubscriptionStatusID
            //     ) === parseInt(5)
            //   ) {
            //     localStorage.setItem("revokeCancellation", true);
            //   } else {
            //     localStorage.setItem("revokeCancellation", false);
            //   }
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
            //     navigate("/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     localStorage.setItem(
            //       "roleID",
            //       JSON.parse(response.data.responseResult.userRoleId)
            //     );
            //     localStorage.setItem(
            //       "organizationID",
            //       response.data.responseResult.organizationID
            //     );
            //     localStorage.setItem(
            //       "organizationRoleID",
            //       response.data.responseResult.organizationRoleID
            //     );
            //     enterPasswordSuccess(
            //       response.data.responseResult,
            //       t("The-user-is-a-partial-admin")
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
            //   }
            // }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_AuthManager_PasswordVerification_16".toLowerCase()
            //     )
            // ) {
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(
            //       enterPasswordFail(
            //         t(
            //           "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
            //         )
            //       )
            //     );
            //     navigate("/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     enterPasswordFail(
            //       t(
            //         "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
            //       )
            //     );
            //     navigate("/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     localStorage.setItem("blur", true);
            //     localStorage.setItem(
            //       "roleID",
            //       JSON.parse(response.data.responseResult.userRoleId)
            //     );
            //     localStorage.setItem(
            //       "organizationID",
            //       response.data.responseResult.organizationID
            //     );
            //     localStorage.setItem(
            //       "organizationRoleID",
            //       response.data.responseResult.organizationRoleID
            //     );
            //     enterPasswordSuccess(
            //       response.data.responseResult,
            //       t(
            //         "The-user-is-a-partial-admin-user-the-organization-subscription-is-not-active-please-contact-your-admin"
            //       )
            //     );
            //     navigate("/DisKus/Admin/Nonactive/");
            //   }
            // }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_AuthManager_PasswordVerification_17".toLowerCase()
            //     )
            // ) {
            //   if (
            //     parseInt(
            //       response.data.responseResult.organizationSubscriptionStatusID
            //     ) === parseInt(5)
            //   ) {
            //     localStorage.setItem("revokeCancellation", true);
            //   } else {
            //     localStorage.setItem("revokeCancellation", false);
            //   }
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     localStorage.setItem(
            //       "roleID",
            //       JSON.parse(response.data.responseResult.userRoleId)
            //     );
            //     localStorage.setItem(
            //       "organizationID",
            //       response.data.responseResult.organizationID
            //     );
            //     localStorage.setItem(
            //       "organizationRoleID",
            //       response.data.responseResult.organizationRoleID
            //     );
            //     enterPasswordSuccess(
            //       response.data.responseResult,
            //       t("The-user-is-a-partial-admin")
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     dispatch(enterPasswordFail(t("The-user-is-a-partial-admin")));
            //   }
            // }
            else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_UserPasswordVerification_18".toLowerCase()
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
              console.log("LoginFlowPageRoute")
              dispatch(
                verifyOTPSuccess(
                  response.data.responseResult,
                  t("The-users-email-has-been-verified")
                )
              );
              console.log("LoginFlowPageRoute")
              if (updateFlag === true) {
                localStorage.setItem("updatePasswordCheck", true);
              } else {
                localStorage.setItem("updatePasswordCheck", false);
              }
              let signUp=localStorage.getItem("signupCurrentPage")
              if(signUp){
                console.log("LoginFlowPageRoute")
                localStorage.removeItem("seconds");
                localStorage.removeItem("minutes");
                localStorage.setItem("signupCurrentPage", 4);
                console.log("LoginFlowPageRoute")
              }else{
                  //  this is used on when we ccaome from verify emaol otp of qrganaisation creation
              console.log("LoginFlowPageRoute")
              localStorage.removeItem("seconds");
              localStorage.removeItem("minutes");
              localStorage.getItem("LoginFlowPageRoute", 11);
              console.log("LoginFlowPageRoute")
              dispatch(LoginFlowRoutes(11));
              console.log("LoginFlowPageRoute")
              }
            

              // const signupValue = localStorage.getItem("signupCurrentPage");
              // if (signupValue === "3") {
              //   localStorage.setItem("signupCurrentPage", 4);
              //   navigate("/Signup");
              // } else {
              //   localStorage.removeItem("seconds");
              //   localStorage.removeItem("minutes");
              //   localStorage.setItem("LoginFlowPageRoute", 4);
              //   dispatch(LoginFlowRoutes(4));
              //   // navigate("/createpasswordorganization");
              // }
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
              localStorage.removeItem("LoginFlowPageRoute");
              localStorage.removeItem("signupCurrentPage");
              navigate("/");
            }
          } else {
            dispatch(verifyOTPFail(t("Something-went-wrong")));
          }
        } else if (response.data.responseCode === 400) {
          dispatch(verifyOTPFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(verifyOTPFail(t("Something-went-wrong")));
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
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.organizationName !== undefined) {
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
            }
            if (response.data.responseResult.isTrial !== undefined) {
              localStorage.setItem(
                "isTrial",
                   
              );
            }
            
            if (response.data.responseResult.authToken !== null) {
              localStorage.setItem(
                "name",
                response.data.responseResult.authToken.name
              );
              localStorage.setItem(
                "userEmail",
                response.data.responseResult.authToken.userName
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
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_01".toLowerCase()
                )
            ) {
              console.log("UsersPasswordCreation")
              if (
                parseInt(
                  response.data.responseResult.organizationSubscriptionStatusID
                ) === parseInt(5)
              ) {
              console.log("UsersPasswordCreation")
              localStorage.setItem("revokeCancellation", true);
              } else {
              console.log("UsersPasswordCreation")
              localStorage.setItem("revokeCancellation", false);
              }
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
              console.log("UsersPasswordCreation")
              dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
              console.log("UsersPasswordCreation")
              localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                // navigate("/selectedpackage");
              console.log("UsersPasswordCreation")
              localStorage.setItem("signupCurrentPage", 5);
              console.log("UsersPasswordCreation")
              navigate("/Signup");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 2
              ) {
              console.log("UsersPasswordCreation")
              dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
              console.log("UsersPasswordCreation")
              localStorage.setItem(
                  "organizationID",
                  response.data.responseResult.organizationID
                );
                // navigate("/selectedpackage");
                localStorage.setItem("signupCurrentPage", 5);
                navigate("/Signup");
              } else if (
                JSON.parse(response.data.responseResult.userRoleId) === 3
              ) {
              console.log("UsersPasswordCreation")
              dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
              console.log("UsersPasswordCreation")
              navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_02".toLowerCase()
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
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                localStorage.setItem("LoginFlowPageRoute", 13);
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
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                localStorage.setItem("LoginFlowPageRoute", 13);
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
                    data.UserID,
                    navigate
                  )
                );
                mqttConnection(response.data.responseResult.authToken.userID);
                localStorage.setItem("LoginFlowPageRoute", 13);
                // navigate("/");
              }
            }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_SignUpManager_UserPasswordCreation_03".toLowerCase()
            //     )
            // ) {
            //   if (
            //     parseInt(
            //       response.data.responseResult.organizationSubscriptionStatusID
            //     ) === parseInt(5)
            //   ) {
            //     localStorage.setItem("revokeCancellation", true);
            //   } else {
            //     localStorage.setItem("revokeCancellation", false);
            //   }
            //   localStorage.setItem(
            //     "roleID",
            //     JSON.parse(response.data.responseResult.userRoleId)
            //   );
            //   localStorage.setItem(
            //     "organizationID",
            //     response.data.responseResult.organizationID
            //   );
            //   localStorage.setItem(
            //     "organizationRoleID",
            //     response.data.responseResult.organizationRoleID
            //   );
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("Tthe-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("Tthe-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     dispatch(
            //       createPasswordFail(
            //         response.data.responseResult,
            //         t("Tthe-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/");
            //   }
            // }
            else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_04".toLowerCase()
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
                  "userEmail",
                  response.data.responseResult.authToken.userName
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                  localStorage.removeItem("LoginFlowPageRoute");
                  dispatch(LoginFlowRoutes(null));
                  navigate("/onboard");
                } else {
                  let RSVP = localStorage.getItem("RSVP");
                  let dataroomValue = localStorage.getItem("DataRoomEmail");

                  if (RSVP !== undefined && RSVP !== null) {
                    localStorage.removeItem("LoginFlowPageRoute");
                    dispatch(LoginFlowRoutes(null));
                    navigate("/DisKus/Meeting/Useravailabilityformeeting");
                  } else if (
                    dataroomValue !== null &&
                    dataroomValue !== undefined
                  ) {
                    localStorage.removeItem("LoginFlowPageRoute");
                    dispatch(LoginFlowRoutes(null));
                    navigate("/Diskus/dataroom");
                  } else {
                    localStorage.removeItem("LoginFlowPageRoute");
                    dispatch(LoginFlowRoutes(null));
                    navigate("/Diskus/");
                  }
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_05".toLowerCase()
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_06".toLowerCase()
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
                navigate("/");
              }
            }
            //  else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_SignUpManager_UserPasswordCreation_07".toLowerCase()
            //     )
            // ) {
            //   if (
            //     parseInt(
            //       response.data.responseResult.organizationSubscriptionStatusID
            //     ) === parseInt(5)
            //   ) {
            //     localStorage.setItem("revokeCancellation", true);
            //   } else {
            //     localStorage.setItem("revokeCancellation", false);
            //   }
            //   if (response.data.responseResult.organizationName !== undefined) {
            //     localStorage.setItem(
            //       "OrganizatioName",
            //       response.data.responseResult.organizationName
            //     );
            //   }
            //   if (response.data.responseResult.authToken !== null) {
            //     localStorage.setItem(
            //       "name",
            //       response.data.responseResult.authToken.name
            //     );
            //     localStorage.setItem(
            //       "userEmail",
            //       response.data.responseResult.authToken.userName
            //     );
            //     localStorage.setItem(
            //       "token",
            //       JSON.stringify(response.data.responseResult.authToken.token)
            //     );
            //     localStorage.setItem(
            //       "refreshToken",
            //       JSON.stringify(
            //         response.data.responseResult.authToken.refreshToken
            //       )
            //     );
            //     localStorage.setItem(
            //       "roleID",
            //       JSON.parse(response.data.responseResult.userRoleId)
            //     );
            //   }
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/Diskus/Admin/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
            //       )
            //     );
            //     navigate("/");
            //   }
            // }
            else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_08".toLowerCase()
                )
            ) {
              if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                localStorage.setItem("LoginFlowPageRoute", 1);
                dispatch(LoginFlowRoutes(1));
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                let RSVP = localStorage.getItem("RSVP");
                let dataroomValue = localStorage.getItem("DataRoomEmail");

                if (RSVP !== undefined && RSVP !== null) {
                  localStorage.removeItem("LoginFlowPageRoute");
                  dispatch(LoginFlowRoutes(null));
                  navigate("/DisKus/Meeting/Useravailabilityformeeting");
                } else if (
                  dataroomValue !== null &&
                  dataroomValue !== undefined
                ) {
                  localStorage.removeItem("LoginFlowPageRoute");
                  dispatch(LoginFlowRoutes(null));
                  navigate("/Diskus/dataroom");
                } else {
                  localStorage.removeItem("LoginFlowPageRoute");
                  dispatch(LoginFlowRoutes(null));
                  navigate("/Diskus/");
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_09".toLowerCase()
                )
            ) {
              localStorage.setItem("signupCurrentPage", 5);
              navigate("/Signup");

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
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_10".toLowerCase()
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
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_11".toLowerCase()
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
            }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_SignUpManager_UserPasswordCreation_12".toLowerCase()
            //     )
            // ) {
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-active-please-activate")
            //       )
            //     );
            //     navigate("/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-active-please-activate")
            //       )
            //     );
            //     navigate("/");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t("User-is-not-active-please-activate")
            //       )
            //     );
            //     navigate("/");
            //   }
            // }
            else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_13".toLowerCase()
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                let RSVP = localStorage.getItem("RSVP");
                let dataroomValue = localStorage.getItem("DataRoomEmail");

                if (RSVP !== undefined && RSVP !== null) {
                  navigate("/DisKus/Meeting/Useravailabilityformeeting");
                } else if (
                  dataroomValue !== null &&
                  dataroomValue !== undefined
                ) {
                  navigate("/Diskus/dataroom");
                } else {
                  navigate("/Diskus/");
                }
              }
            }
            // else if (
            //   response.data.responseResult.responseMessage
            //     .toLowerCase()
            //     .includes(
            //       "ERM_AuthService_SignUpManager_UserPasswordCreation_14".toLowerCase()
            //     )
            // ) {
            //   if (JSON.parse(response.data.responseResult.userRoleId) === 1) {
            //     localStorage.setItem("blur", true);
            //     if (
            //       response.data.responseResult.organizationName !== undefined
            //     ) {
            //       localStorage.setItem(
            //         "OrganizatioName",
            //         response.data.responseResult.organizationName
            //       );
            //     }
            //     if (response.data.responseResult.authToken !== null) {
            //       localStorage.setItem(
            //         "name",
            //         response.data.responseResult.authToken.name
            //       );
            //       localStorage.setItem(
            //         "userEmail",
            //         response.data.responseResult.authToken.userName
            //       );
            //       localStorage.setItem(
            //         "token",
            //         JSON.stringify(response.data.responseResult.authToken.token)
            //       );
            //       localStorage.setItem(
            //         "refreshToken",
            //         JSON.stringify(
            //           response.data.responseResult.authToken.refreshToken
            //         )
            //       );
            //       localStorage.setItem(
            //         "roleID",
            //         JSON.parse(response.data.responseResult.userRoleId)
            //       );
            //     }
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t(
            //           "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
            //         )
            //       )
            //     );
            //     navigate("/Diskus/Admin/PayOutstanding");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 2
            //   ) {
            //     localStorage.setItem("blur", true);
            //     if (
            //       response.data.responseResult.organizationName !== undefined
            //     ) {
            //       localStorage.setItem(
            //         "OrganizatioName",
            //         response.data.responseResult.organizationName
            //       );
            //     }
            //     if (response.data.responseResult.authToken !== null) {
            //       localStorage.setItem(
            //         "name",
            //         response.data.responseResult.authToken.name
            //       );
            //       localStorage.setItem(
            //         "userEmail",
            //         response.data.responseResult.authToken.userName
            //       );
            //       localStorage.setItem(
            //         "token",
            //         JSON.stringify(response.data.responseResult.authToken.token)
            //       );
            //       localStorage.setItem(
            //         "refreshToken",
            //         JSON.stringify(
            //           response.data.responseResult.authToken.refreshToken
            //         )
            //       );
            //       localStorage.setItem(
            //         "roleID",
            //         JSON.parse(response.data.responseResult.userRoleId)
            //       );
            //     }
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t(
            //           "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
            //         )
            //       )
            //     );
            //     navigate("/Diskus/Admin/Nonactive");
            //   } else if (
            //     JSON.parse(response.data.responseResult.userRoleId) === 3
            //   ) {
            //     localStorage.setItem("blur", true);
            //     if (
            //       response.data.responseResult.organizationName !== undefined
            //     ) {
            //       localStorage.setItem(
            //         "OrganizatioName",
            //         response.data.responseResult.organizationName
            //       );
            //     }
            //     if (response.data.responseResult.authToken !== null) {
            //       localStorage.setItem(
            //         "name",
            //         response.data.responseResult.authToken.name
            //       );
            //       localStorage.setItem(
            //         "userEmail",
            //         response.data.responseResult.authToken.userName
            //       );
            //       localStorage.setItem(
            //         "token",
            //         JSON.stringify(response.data.responseResult.authToken.token)
            //       );
            //       localStorage.setItem(
            //         "refreshToken",
            //         JSON.stringify(
            //           response.data.responseResult.authToken.refreshToken
            //         )
            //       );
            //       localStorage.setItem(
            //         "roleID",
            //         JSON.parse(response.data.responseResult.userRoleId)
            //       );
            //     }
            //     dispatch(
            //       createPasswordSuccess(
            //         response.data.responseResult,
            //         t(
            //           "Organization-subscription-is-in-active-and-this-is-a-partial-admin-user"
            //         )
            //       )
            //     );
            //     let RSVP = localStorage.getItem("RSVP");
            //     let dataroomValue = localStorage.getItem("DataRoomEmail");

            //     if (RSVP !== undefined && RSVP !== null) {
            //       navigate("/DisKus/Meeting/Useravailabilityformeeting");
            //     } else if (
            //       dataroomValue !== null &&
            //       dataroomValue !== undefined
            //     ) {
            //       navigate("/Diskus/dataroom");
            //     } else {
            //       navigate("/Diskus/");
            //     }
            //   }
            // }
            else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_15".toLowerCase()
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                    "userEmail",
                    response.data.responseResult.authToken.userName
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
                let RSVP = localStorage.getItem("RSVP");
                let dataroomValue = localStorage.getItem("DataRoomEmail");

                if (RSVP !== undefined && RSVP !== null) {
                  navigate("/DisKus/Meeting/Useravailabilityformeeting");
                } else if (
                  dataroomValue !== null &&
                  dataroomValue !== undefined
                ) {
                  navigate("/Diskus/dataroom");
                } else {
                  navigate("/Diskus/");
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_16".toLowerCase()
                )
            ) {
              dispatch(createPasswordSuccess(response.data.responseResult, ""));
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_17".toLowerCase()
                )
            ) {
              dispatch(createPasswordFail(response.data.responseResult, ""));
              // navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UsersPasswordCreation_18".toLowerCase()
                )
            ) {
              dispatch(createPasswordSuccess(response.data.responseResult, ""));
              dispatch(showCreateAddtionalUsersModal(true));
              // navigate("/");
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
    DeviceID: "1",
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
