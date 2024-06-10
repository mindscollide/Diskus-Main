import {
  authenticationApi,
  getAdminURLs,
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
  GetInvoiceHTMLByOrganizatonID,
} from "../../commen/apis/Api_config";
import { getPackageExpiryDetail } from "./GetPackageExpirtyDetails";
import { RefreshToken } from "./Auth_action";
import { TwoFaAuthenticate } from "./TwoFactorsAuthenticate_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import Helper from "../../commen/functions/history_logout";
import { getSubscriptionPaymentDetail } from "./Admin_PackageDetail";
import { LoginFlowRoutes, signUpFlowRoutes } from "./UserManagementActions";
import {
  showCreateAddtionalUsersModal,
  showUpgradeNowModal,
} from "./UserMangementModalActions";
import {
  checkFeatureIDAvailability,
  checkFeatureIDRoutes,
  clearLocalStorageAtloginresponce,
  getFormData,
  handleLoginResponse,
  savePackageFeatureIDs,
} from "../../commen/functions/utils";
import {
  USERPASSWORDVERIFICATION,
  USERSPASSWORDCREATION,
} from "../../commen/functions/responce_message";

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
                "organizatioName",
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
                "userEmail",
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
                "userEmail",
                data.Organization.ContactPersonEmail
              );
              localStorage.setItem(
                "organizatioName",
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
              //localStorage.setItem("LoginFlowPageRoute", 2);
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
              //localStorage.setItem("LoginFlowPageRoute", 11);
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
              localStorage.setItem("userEmail", email);
              //localStorage.setItem("LoginFlowPageRoute", 3);
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
  const userID = localStorage.getItem("userID");
  const data = {
    UserID: JSON.parse(userID),
    Device: "Browser",
    DeviceID: "1",
    UserPassword: value,
  };
  let RSVP = localStorage.getItem("RSVP");
  let dataroomValue = localStorage.getItem("DataRoomEmail");
  let AgCont = localStorage.getItem("AgCont");
  let AdOrg = localStorage.getItem("AdOrg");

  return async (dispatch) => {
    dispatch(enterPasswordInit());
    const formData = getFormData(data, userPasswordVerify);

    try {
      const response = await axios.post(authenticationApi, formData);
      if (response.data.responseCode !== 200) {
        clearLocalStorageAtloginresponce(dispatch, 1, navigate);
        dispatch(enterPasswordFail("Something-went-wrong"));
        return;
      }

      const { responseMessage, isExecuted } = response.data.responseResult;
      if (!isExecuted) {
        clearLocalStorageAtloginresponce(dispatch, 1, navigate);

        dispatch(enterPasswordFail("Something-went-wrong"));
        return;
      }
      await handleLoginResponse(response.data.responseResult);
      await dispatch(
        getPackageExpiryDetail(
          navigate,
          response.data.responseResult.organizationID,
          t
        )
      );
      let packageFeatureIDs = [];
      switch (responseMessage.toLowerCase()) {
        case USERPASSWORDVERIFICATION.VERIFICATION_01:
          dispatch(enterPasswordFail(t("Device-does-not-exists")));
          clearLocalStorageAtloginresponce(dispatch, 5, navigate);
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_02:
          clearLocalStorageAtloginresponce(dispatch, 4, navigate);
          dispatch(enterPasswordFail(t("Device-id-does-not-exists")));
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_03:
          clearLocalStorageAtloginresponce(dispatch, 4, navigate);

          dispatch(enterPasswordFail(t("User-does-not-exist")));
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_04:
          clearLocalStorageAtloginresponce(dispatch, 4, navigate);
          dispatch(enterPasswordFail(t("Account-is-blocked")));
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_05:
          dispatch(enterPasswordFail(t("Wrong-password")));
          // For Wrong password
          clearLocalStorageAtloginresponce(dispatch, 3, navigate);
          dispatch(LoginFlowRoutes(2));
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_06:
          dispatch(enterPasswordFail(t("User-is-inactive")));
          clearLocalStorageAtloginresponce(dispatch, 4, navigate);
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_07:
          dispatch(
            enterPasswordFail(t("Organization-subscription-packages-not-found"))
          );
          clearLocalStorageAtloginresponce(dispatch, 4, navigate);
          // dispatch(LoginFlowRoutes(1));
          // no action
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_08:
          if (response.data.responseResult.isOrganizationCreator) {
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t("Organization-is-inactive")
              )
            );
            localStorage.removeItem("LoginFlowPageRoute");
            localStorage.setItem("signupCurrentPage", 5);
            dispatch(signUpFlowRoutes(5));
            navigate("/Signup");
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }

          // packege detail ki bhi api hit honi hy
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_09:
          dispatch(
            enterPasswordSuccess(
              response.data.responseResult,
              t("Password-verified-and-user-is-new-and-2FA-is-enabled")
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
          clearLocalStorageAtloginresponce(dispatch, 3, navigate);
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_10:
          if (response.data.responseResult.hasAdminRights) {
            mqttConnection(response.data.responseResult.authToken.userID);

            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t("Password-verified-admin-user")
              )
            );
            if (response.data.responseResult.authToken.isFirstLogIn) {
              navigate("/Admin/ManageUsers");
            } else {
              navigate("/Diskus");
            }
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          } else if (response.data.responseResult.hasUserRights) {
            mqttConnection(response.data.responseResult.authToken.userID);
            if (response.data.responseResult.authToken.isFirstLogIn) {
              if (RSVP !== undefined && RSVP !== null) {
                navigate("/DisKus/Meeting/Useravailabilityformeeting");
              } else if (
                dataroomValue !== null &&
                dataroomValue !== undefined
              ) {
                navigate("/Diskus/dataroom");
              } else if (AgCont !== null) {
                navigate("/DisKus/Meeting");
              } else if (AdOrg !== null) {
                navigate("/DisKus/Meeting");
              } else {
                navigate("/onboard");
              }
            } else {
              if (RSVP !== undefined && RSVP !== null) {
                navigate("/DisKus/Meeting/Useravailabilityformeeting");
              } else if (
                dataroomValue !== null &&
                dataroomValue !== undefined
              ) {
                navigate("/Diskus/dataroom");
              } else if (AgCont !== null) {
                navigate("/DisKus/Meeting");
              } else if (AdOrg !== null) {
                navigate("/DisKus/Meeting");
              } else {
                navigate("/DisKus/");
              }
            }
          } else {
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_11:
          if (response.data.responseResult.hasAdminRights) {
            mqttConnection(response.data.responseResult.authToken.userID);
            navigate("/Admin/ManageUsers");
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t("Password-verified-admin")
              )
            );
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          } else {
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_12:
          if (response.data.responseResult.hasUserRights) {
            mqttConnection(response.data.responseResult.authToken.userID);

            if (response.data.responseResult.authToken.isFirstLogIn) {
              if (RSVP !== undefined && RSVP !== null) {
                navigate("/DisKus/Meeting/Useravailabilityformeeting");
              } else if (
                dataroomValue !== null &&
                dataroomValue !== undefined
              ) {
                navigate("/Diskus/dataroom");
              } else if (AgCont !== null) {
                navigate("/DisKus/Meeting");
              } else if (AdOrg !== null) {
                navigate("/DisKus/Meeting");
              } else {
                navigate("/onboard/");
              }
            } else {
              if (RSVP !== undefined && RSVP !== null) {
                navigate("/DisKus/Meeting/Useravailabilityformeeting");
              } else if (
                dataroomValue !== null &&
                dataroomValue !== undefined
              ) {
                navigate("/Diskus/dataroom");
              } else if (AgCont !== null) {
                navigate("/DisKus/Meeting");
              } else if (AdOrg !== null) {
                navigate("/DisKus/Meeting");
              } else {
                navigate("/Diskus/");
              }
            }
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);

            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t("Password-verified-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          // route to onboard
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_17:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-suspended-and-this-is-an-admin"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_18:
          // pahly check kergay ga k ussy pay outstanding k rights hy ya nai
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-not-active-and-this-is-an-admin-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_19:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-not-active-and-this-is-an-admin"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_20:
          //yeah user dash board non active per jai ga
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);

          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-not-active-and-this-is-an-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_21:
          // The Organization Trial has expired and This is the Organization Creator. Direct To Billing Flow
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);

          localStorage.removeItem("LocalAdminRoutes");
          localStorage.removeItem("LocalUserRoutes");
          localStorage.setItem("TrialExpireSelectPac", JSON.stringify(true));
          dispatch(showUpgradeNowModal(true));
          packageFeatureIDs = [28];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalAdminRoutes",
            JSON.stringify([
              { id: 28, name: "PakageDetailsUserManagement" },
              { id: 200, name: "Admin" },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasAdminRights) {
            navigate("/Admin/PakageDetailsUserManagement");
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t("The-organization-trial-has-expired")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_22:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.removeItem("LocalUserRoutes");

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasAdminRights) {
            if (JSON.parse(localStorage.getItem("isExtensionAvailable"))) {
              localStorage.setItem(
                "TrialExpireSelectPac",
                JSON.stringify(true)
              );
              dispatch(showUpgradeNowModal(true));
              packageFeatureIDs = [28];
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 28, name: "PakageDetailsUserManagement" },
                  { id: 200, name: "Admin" },
                ])
              );
              navigate("/Admin/PakageDetailsUserManagement");
              dispatch(
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("Organization-trial-has-expired-and-this-is-admin-user")
                )
              );
            } else {
              clearLocalStorageAtloginresponce(dispatch, 2, navigate);
              dispatch(LoginFlowRoutes(1));
              dispatch(
                enterPasswordFail(t("User-not-authorised-contact-admin"))
              );
            }
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_23:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.removeItem("LocalUserRoutes");

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasAdminRights) {
            if (JSON.parse(localStorage.getItem("isExtensionAvailable"))) {
              localStorage.setItem(
                "TrialExpireSelectPac",
                JSON.stringify(true)
              );
              dispatch(showUpgradeNowModal(true));
              packageFeatureIDs = [28];
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 28, name: "PakageDetailsUserManagement" },
                  { id: 200, name: "Admin" },
                ])
              );
              navigate("/Admin/PakageDetailsUserManagement");
              dispatch(
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("Organization-trial-has-expired-and-this-is-admin")
                )
              );
            } else {
              clearLocalStorageAtloginresponce(dispatch, 2, navigate);
              dispatch(LoginFlowRoutes(1));
              dispatch(
                enterPasswordFail(t("User-not-authorised-contact-admin"))
              );
            }
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_24:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);

          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              enterPasswordSuccess(
                t("Organization-trial-has-expired-and-this-is-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_25:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(enterPasswordFail("Something-went-wrong"));
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_26:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            enterPasswordFail(
              "Organization-is-currently-locked-please-contact-the-global-Admin-for-further-assistance"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_27:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            enterPasswordFail(
              "You-have-not-been-assigned-any-license-please-contact-the-admin-for-further-assistance"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_28:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            enterPasswordFail(
              t(
                "Password-verified-and-subscription-is-closed-and-this-is-organization-creator"
              )
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_29:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            enterPasswordFail(
              "Password-verified-and-subscription-is-closed-and-this-is-an-admin-user"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_30:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            enterPasswordFail(
              "Password-verified-and-subscription-is-closed-and-this-is-an-admin"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_31:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            enterPasswordFail(
              "Password-verified-and-subscription-is-closed-and-this-is-an-user"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_32:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }

            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-cancel-and-this-is-organization-creator"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_33:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-cancel-and-this-is-an-admin-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_34:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-cancel-and-this-is-an-admin"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_35:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-cancel-and-this-is-an-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_36:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            enterPasswordFail(
              "Password-verified-and-subscription-is-suspended-and-this-is-organization-creator"
            )
          );
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_37:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-suspended-and-this-is-an-admin-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_38:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-suspended-and-this-is-an-admin"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        case USERPASSWORDVERIFICATION.VERIFICATION_39:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              enterPasswordSuccess(
                response.data.responseResult,
                t(
                  "Password-verified-and-subscription-is-suspended-and-this-is-an-user"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          break;
        default:
          dispatch(enterPasswordFail("Something-went-wrong"));
      }
    } catch (error) {
      console.error("Network or other error:", error);
      clearLocalStorageAtloginresponce(dispatch, 2, navigate);
      dispatch(LoginFlowRoutes(1));

      dispatch(enterPasswordFail("Something-went-wrong"));
    }
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
  let email = localStorage.getItem("userEmail");
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
              console.log("LoginFlowPageRoute");
              dispatch(
                verifyOTPSuccess(
                  response.data.responseResult,
                  t("The-users-email-has-been-verified")
                )
              );
              console.log("LoginFlowPageRoute");
              if (updateFlag === true) {
                localStorage.setItem("updatePasswordCheck", true);
              } else {
                localStorage.setItem("updatePasswordCheck", false);
              }
              let signUp = localStorage.getItem("SignupFlowPageRoute");
              if (signUp) {
                console.log("LoginFlowPageRoute");
                localStorage.removeItem("seconds");
                localStorage.removeItem("minutes");
                localStorage.setItem("SignupFlowPageRoute", 4);
                dispatch(signUpFlowRoutes(4));
                navigate("/Signup");
                console.log("LoginFlowPageRoute");
              } else {
                //  this is used on when we ccaome from verify emaol otp of qrganaisation creation
                console.log("LoginFlowPageRoute");
                localStorage.removeItem("seconds");
                localStorage.removeItem("minutes");
                localStorage.setItem("LoginFlowPageRoute", 11);
                console.log("LoginFlowPageRoute");
                dispatch(LoginFlowRoutes(11));
                console.log("LoginFlowPageRoute");
              }
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
              console.log("423986");
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
  let RSVP = localStorage.getItem("RSVP");
  let dataroomValue = localStorage.getItem("DataRoomEmail");
  let AgCont = localStorage.getItem("AgCont");
  let AdOrg = localStorage.getItem("AdOrg");
  return async (dispatch) => {
    dispatch(createPasswordInit());
    const formData = getFormData(data, userPasswordCreation);

    try {
      const response = await axios.post(authenticationApi, formData);
      if (response.data.responseCode !== 200) {
        dispatch(createPasswordFail("Something-went-wrong"));
        return;
      }

      const { responseMessage, isExecuted } = response.data.responseResult;
      if (!isExecuted) {
        dispatch(createPasswordFail("Something-went-wrong"));
        return;
      }
      await handleLoginResponse(response.data.responseResult);
      await dispatch(
        getPackageExpiryDetail(
          navigate,
          response.data.responseResult.organizationID,
          t
        )
      );
      let packageFeatureIDs = [];
      switch (responseMessage.toLowerCase()) {
        case USERSPASSWORDCREATION.CREATION_01:
          dispatch(createPasswordFail(t("Password-could-not-be-created")));
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_02:
          dispatch(
            createPasswordFail(
              t("Organization-subscription-packages-not-found")
            )
          );
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_03:
          //(Direct to Package Selection).
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);

          localStorage.removeItem("LocalAdminRoutes");
          localStorage.removeItem("LocalUserRoutes");
          localStorage.setItem("TrialExpireSelectPac", JSON.stringify(true));
          dispatch(showUpgradeNowModal(true));
          packageFeatureIDs = [28];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalAdminRoutes",
            JSON.stringify([
              { id: 28, name: "PakageDetailsUserManagement" },
              { id: 200, name: "Admin" },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasAdminRights) {
            navigate("/Admin/PakageDetailsUserManagement");
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("User-is-the-organization-creator-trial-has-expired")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_04:
          //2FA is enabled.
          // if (
          //   JSON.parse(response.data.responseResult.roleId) === (3 || 4 || 1)
          // ) {
          dispatch(
            createPasswordSuccess(
              response.data.responseResult,
              t("Password-created-and-2FA-is-enabled")
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
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          // }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_05:
          //Password Created and this is an admin user
          if (response.data.responseResult.hasAdminRights) {
            if (response.data.responseResult.authToken.isFirstLogIn) {
              localStorage.removeItem("SignupFlowPageRoute");
              navigate("/Admin/ManageUsers");
            } else {
              if (response.data.responseResult.hasUserRights) {
                navigate("/DisKus/");
              } else {
                localStorage.removeItem("SignupFlowPageRoute");
                navigate("/Admin/ManageUsers");
              }
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Password-created-and-this-is-an-admin-user")
              )
            );
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          } else {
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_06:
          // Password Created and this is a admin
          if (response.data.responseResult.hasAdminRights) {
            if (response.data.responseResult.authToken.isFirstLogIn) {
              navigate("/Admin/ManageUsers");
            } else {
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Password-created-and-this-is-a-admin")
              )
            );
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          } else {
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_07:
          // Password Created and this is a user
          if (response.data.responseResult.hasUserRights) {
            if (response.data.responseResult.authToken.isFirstLogIn) {
              navigate("/onboard");
            } else {
              navigate("/Diskus");
            }
            clearLocalStorageAtloginresponce(dispatch, 1, navigate);

            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Password-created-and-this-is-a-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_08:
          //pay out standing
          // User is the Organization Creator. Org sub not active. and this is organization creator (Direct to Billing Page)
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t(
                  "User-is-the-organization-creator-org-sub-not-active-and-this-is-organization-creator"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          break;
        case USERSPASSWORDCREATION.CREATION_09:
          // Org sub not active. and this is an admin user
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-not-active-and-this-is-an-admin-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }

          break;
        case USERSPASSWORDCREATION.CREATION_10:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-not-active-and-this-is-a-admin")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          break;
        case USERSPASSWORDCREATION.CREATION_11:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-not-active-and-this-is-a-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          break;
        case USERSPASSWORDCREATION.CREATION_12:
          // setting organization subscription ID

          if (response.data.responseResult.isOrganizationCreator) {
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Organization-is-inactive")
              )
            );

            // localStorage.removeItem("LoginFlowPageRoute");
            // localStorage.setItem("signupCurrentPage", 5);
            // navigate("/Signup");

            localStorage.setItem("SignupFlowPageRoute", 5);
            dispatch(signUpFlowRoutes(5));
            navigate("/Signup");
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(
              createPasswordFail(
                t("Organization-is-inactive-and-the-user-is-an-admin-user")
              )
            );
          }
          // route to onboard
          break;
        case USERSPASSWORDCREATION.CREATION_13:
          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.isOrganizationCreator) {
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Organization-is-inactive")
              )
            );
            localStorage.removeItem("LoginFlowPageRoute");
            localStorage.setItem("signupCurrentPage", 5);
            navigate("/Signup");
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(
              createPasswordFail(
                t("Organization-is-inactive-and-this-is-an-admin")
              )
            );
          }

          break;
        case USERSPASSWORDCREATION.CREATION_14:
          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.isOrganizationCreator) {
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Organization-is-inactive")
              )
            );
            localStorage.removeItem("LoginFlowPageRoute");
            localStorage.setItem("signupCurrentPage", 5);
            navigate("/Signup");
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            dispatch(
              createPasswordFail(
                t("Organization-is-inactive-and-this-is-an-user")
              )
            );
          }

          break;
        case USERSPASSWORDCREATION.CREATION_15:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(createPasswordFail("Something-went-wrong"));
          break;
        case USERSPASSWORDCREATION.CREATION_16:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            createPasswordFail(
              "Organization-is-currently-locked-please-contact-the-global-Admin-for-further-assistance"
            )
          );
          break;
        case USERSPASSWORDCREATION.CREATION_17:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));

          dispatch(
            createPasswordFail(
              "You-have-not-been-assigned-any-license-please-contact-the-admin-for-further-assistance"
            )
          );
          break;
        case USERSPASSWORDCREATION.CREATION_18:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t(
                  "User-is-the-organization-creator-org-sub-is-suspended-and-this-is-organization-creator"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_19:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-suspended-and-this-is-an-admin-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_20:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-suspended-and-this-is-a-admin")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_21:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-suspended-and-this-is-a-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_22:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            createPasswordFail(
              t(
                "User-is-the-organization-creator-org-sub-is-closed-and-this-is-organization-creator"
              )
            )
          );
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_23:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            createPasswordFail(t("Org-sub-is-closed-and-this-is-an-admin-user"))
          );
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_24:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            createPasswordFail(t("Org-sub-is-closed-and-this-is-a-admin"))
          );
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_25:
          clearLocalStorageAtloginresponce(dispatch, 2, navigate);
          dispatch(LoginFlowRoutes(1));
          dispatch(
            createPasswordFail(t("Org-sub-is-closed-and-this-is-a-user"))
          );
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_26:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t(
                  "User-is-the-Organization-Creator-Org-sub-is-cancel-and-this-is-organization-creator"
                )
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_27:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-cancel-and-this-is-an-admin-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_28:
          if (response.data.responseResult.hasAdminRights) {
            if (checkFeatureIDAvailability(33)) {
              packageFeatureIDs = [203, 28, 29, 30, 34, 218];
            } else {
              packageFeatureIDs = [33, 203, 28, 29, 30, 34, 218];
            }
            localStorage.setItem("cancelSub", JSON.stringify(true));
            if (checkFeatureIDAvailability(33)) {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { name: "PakageDetailsUserManagement", id: 206 },
                  { id: 33, name: "PayOutstanding" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/PayOutstanding");
            } else {
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.setItem(
                "packageFeatureIDs",
                JSON.stringify(packageFeatureIDs)
              );
              localStorage.setItem(
                "LocalAdminRoutes",
                JSON.stringify([
                  { id: 203, name: "ManageUsers" },
                  { id: 28, name: "PackageDetailsUserManagement" },
                  { id: 29, name: "CancelSubscriptionUserManagement" },
                  { id: 30, name: "deleteorganizationUserMangement" },
                  { id: 34, name: "Summary" },
                  { id: 200, name: "Admin" },
                  { name: "PaymentHistory", id: 218 },
                ])
              );
              navigate("/Admin/ManageUsers");
            }
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-cancel-and-this-is-an-admin")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));
            localStorage.removeItem("LocalUserRoutes");
            localStorage.setItem("VERIFICATION", false);
            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        case USERSPASSWORDCREATION.CREATION_29:
          clearLocalStorageAtloginresponce(dispatch, 1, navigate);
          localStorage.removeItem("LocalAdminRoutes");
          localStorage.setItem("VERIFICATION", true);
          packageFeatureIDs = [100, 101, 102];
          localStorage.setItem(
            "packageFeatureIDs",
            JSON.stringify(packageFeatureIDs)
          );
          localStorage.setItem(
            "LocalUserRoutes",
            JSON.stringify([
              { name: "Diskus", id: 100 },
              { name: "home", id: 101 },
              { name: "", id: 102 },
            ])
          );

          //yeah pay outstanding per lai jai ga
          if (response.data.responseResult.hasUserRights) {
            navigate("/Diskus");
            dispatch(
              createPasswordSuccess(
                response.data.responseResult,
                t("Org-sub-is-cancel-and-this-is-an-user")
              )
            );
          } else {
            clearLocalStorageAtloginresponce(dispatch, 2, navigate);
            dispatch(LoginFlowRoutes(1));

            dispatch(
              createPasswordFail(t("User-not-authorised-contact-admin"))
            );
          }
          // no action
          break;
        default:
          dispatch(enterPasswordFail("Something-went-wrong"));
      }
    } catch (error) {
      console.error("Network or other error:", error);
      clearLocalStorageAtloginresponce(dispatch, 2, navigate);
      dispatch(LoginFlowRoutes(1));

      dispatch(enterPasswordFail("Something-went-wrong"));
    }
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
  let value = localStorage.getItem("organizatioName");
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
              // navigate("/Admin/PackageDetail");
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
              if (response.data.responseResult.hasAdminRights) {
                navigate("/Admin/PackageDetail");
              }
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
              if (response.data.responseResult.hasAdminRights) {
                navigate("/Admin/PackageDetail");
              }
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
              if (response.data.responseResult.hasAdminRights) {
                navigate("/Admin/PackageDetail");
              }
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
              if (response.data.responseResult.hasAdminRights) {
                navigate("/Admin/PackageDetail");
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

const getInvoiceHTML_Init = () => {
  return {
    type: actions.GETINVOICEHTMLBYORGANIZATION_INIT,
  };
};
const getInvoiceHTML_Success = (response, message) => {
  return {
    type: actions.GETINVOICEHTMLBYORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};
const getInvoiceHTML_Fail = (message) => {
  return {
    type: actions.GETINVOICEHTMLBYORGANIZATION_FAIL,
    message: message,
  };
};

const getInvocieHTMLApi = (navigate, t, Data, setInvoiceModal) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getInvoiceHTML_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", GetInvoiceHTMLByOrganizatonID.RequestMethod);
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getInvocieHTMLApi(navigate, t, Data, setInvoiceModal));
        } else if (response.data.responseCode === 200) {

          if (response.data.responseResult.isExecuted === true) {
        

            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetInvoiceHtmlByOrganizationID_01".toLowerCase()
                )
            ) {

              setInvoiceModal(true);
              dispatch(
                getInvoiceHTML_Success(
                  response.data.responseResult,
                  t("Successfull")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetInvoiceHtmlByOrganizationID_02".toLowerCase()
                )
            ) {
              dispatch(getInvoiceHTML_Fail(t("Not-created")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetInvoiceHtmlByOrganizationID_03".toLowerCase()
                )
            ) {
              dispatch(getInvoiceHTML_Fail(t("Something-went-wrong")));
            } else {
              dispatch(getInvoiceHTML_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getInvoiceHTML_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getInvoiceHTML_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getInvoiceHTML_Fail(t("Something-went-wrong")));
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
  getInvocieHTMLApi,
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
