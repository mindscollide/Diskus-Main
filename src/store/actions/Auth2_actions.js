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
} from "../../commen/apis/Api_config";
import { getPackageExpiryDetail } from "./GetPackageExpirtyDetails";

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
                    "The-Organization-has-been-created-successfully-and-the-OTP-has-been-generated-Please-verfiy-you-email"
                  )
                )
              );
              localStorage.removeItem("PackageID");
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
                    "The-Organization-has-been-created-successfully-but-the-OTP-has-not-been-generated"
                  )
                )
              );
              navigate("/verifyEmailOTP");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_03".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The-Organization-has-been-created-successfully-failed-to-save-User"
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
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The-Organization-has-been-created-successfully-and-the-User-has-been-associated-to-it"
                  )
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
                createOrganizationSuccess(
                  response.data.responseResult,
                  t("Failed-to-save-Organization-Subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_06".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t("Failed-to-save-Organization-Subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_07".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t("This-Organization-already-exists")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_08".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The Organization has not created successfully failed to save User."
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_09".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  t(
                    "The Organization has not created successfully failed to save User."
                  )
                )
              );
            } else {
              dispatch(
                createOrganizationSuccess(
                  response.data.responseResult,
                  response.data.responseResult.responseMessage
                )
              );
            }
          } else {
            dispatch(createOrganizationFail(t("something-went-worng")));
          }
        } else {
          dispatch(createOrganizationFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(createOrganizationFail(t("something-went-worng")));
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
              dispatch(
                validationEmailSuccess(
                  response.data.responseResult,
                  t("User's-password-is-Created")
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
                  t("User's-password-is-created-but-somthing-went-wrong.")
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
                  t(
                    "User's-password-is-not-Created-Please-create-your-password"
                  )
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
                  t("User's-email-is-not-verified-Please-verify-your-email")
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
              MessageResponce = t("User's-password-is-Created");
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
                "User's-password-is-not-Created-Please-create-your-password"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_06".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "User's-email-is-not-verified-Please-verify-your-email"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_LoginWithEmail_07".toLowerCase()
                )
            ) {
              MessageResponce = t(
                "Not-a-valid-user.-Please-login-with-valid-user"
              );
            } else {
              MessageResponce = t("Something went worng");
            }
            dispatch(validationEmailFail(MessageResponce));
          }
        } else {
          dispatch(validationEmailFail(t("Something went worng")));
        }
      })
      .catch((response) => {
        dispatch(validationEmailFail(t("Something went worng")));
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
const enterPasswordFail = (message) => {
  return {
    type: actions.PASSWORDVALIDATION_FAIL,
    // response: response,
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
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.organizationName != undefined) {
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
            }
            if (response.data.responseResult.authToken != null) {
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

            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_01".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-does-not-exists")
                  )
                );
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-does-not-exists")
                  )
                );
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-does-not-exists")
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_02".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-id-does-not-exists")
                  )
                );
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-id-does-not-exists")
                  )
                );
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Device-id-does-not-exists")
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_03".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_04".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
              } else if (response.data.responseResult.userRoleId === 2) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                  getPackageExpiryDetail(
                    response.data.responseResult.organizationRoleID,
                    t
                  )
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
              if (response.data.responseResult.userRoleId === 3) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                  "ERM_AuthService_AuthManager_PasswordVerification_06".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordFail(
                    t(
                      "The-current-active-users-limit-have-been-breached-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(
                    t(
                      "The-current-active-users-limit-have-been-breached-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(
                    t(
                      "The-current-active-users-limit-have-been-breached-Please-contact-your-admin"
                    )
                  )
                );
              }
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_07".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_08".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                  getPackageExpiryDetail(
                    response.data.responseResult.organizationID,
                    t
                  )
                );
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 2) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                    t("The-user-is-an-admin-user-and-the-role-id-is")
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
              if (response.data.responseResult.userRoleId === 3) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                    t("The-user-is-not-an-admin")
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
              if (response.data.responseResult.userRoleId === 1) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
              } else if (response.data.responseResult.userRoleId === 2) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
              } else if (response.data.responseResult.userRoleId === 3) {
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
              if (response.data.responseResult.userRoleId === 1) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                      "The-user-is-not-an-admin-user-he-organization-subscription-is-not-activated-please-contact-your-admin"
                    )
                  )
                );
                navigate("/DisKus/Admin/Payment/PayOutstanding");
              } else if (response.data.responseResult.userRoleId === 2) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                      "The-user-is-not-an-admin-user-he-organization-subscription-is-not-activated-lease-contact-your-admin"
                    )
                  )
                );
                navigate("/DisKus/Admin/Nonactive/");
              } else if (response.data.responseResult.userRoleId === 3) {
                localStorage.setItem("blur", true);
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                      "The-user-is-not-an-admin-user-he-organization-subscription-is-not-activated-lease-contact-your-admin"
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
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
              if (response.data.responseResult.userRoleId === 1) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Your-Organization-is-not-activated")
                  )
                );
                navigate("/selectedpackage");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t(
                      "Your-Organization-is-not-activated-Please-contact-your-admin."
                    )
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                localStorage.setItem(
                  "roleID",
                  response.data.responseResult.userRoleId
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
                  enterPasswordFail(
                    // response.data.responseResult,
                    t(
                      "Your-Organization-is-not-activated-Please-contact-your-admin."
                    )
                  )
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-activated-please-contact-your-admin")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordSuccess(
                    response.data.responseResult,
                    t("Your-organization-is-not-activated")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(
                    // response.data.responseResult,
                    t("Your-organization-is-not-activated")
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_15".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "roleID",
                response.data.responseResult.userRoleId
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "organizationRoleID",
                response.data.responseResult.organizationRoleID
              );
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              } else if (response.data.responseResult.userRoleId === 2) {
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("The-user-is-a-partial-admin.")
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_16".toLowerCase()
                )
            ) {
              localStorage.setItem("blur", true);
              localStorage.setItem(
                "roleID",
                response.data.responseResult.userRoleId
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "organizationRoleID",
                response.data.responseResult.organizationRoleID
              );
              if (response.data.responseResult.userRoleId === 2) {
                console.log("response.data.responseResult.userRoleId");
                enterPasswordSuccess(
                  response.data.responseResult,
                  t(
                    "The-user-is-a-partial-user-the-organization-subscription-is-not-active-please-contact-your-admin"
                  )
                );
                navigate("/DisKus/Admin/Nonactive/");
              } else {
                dispatch(enterPasswordFail(t("something-went-worng")));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_AuthManager_PasswordVerification_17".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "roleID",
                response.data.responseResult.userRoleId
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "organizationRoleID",
                response.data.responseResult.organizationRoleID
              );
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              } else if (response.data.responseResult.userRoleId === 2) {
                enterPasswordSuccess(
                  response.data.responseResult,
                  t("The-user-is-a-partial-admin.")
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  enterPasswordFail(t("Password-verification-failed-try-again"))
                );
              }
            } else {
              dispatch(enterPasswordFail(t("something-went-worng")));
            }
          } else {
            dispatch(enterPasswordFail(t("something-went-worng")));
          }
        } else {
          dispatch(enterPasswordFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(enterPasswordFail(t("something-went-worng")));
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
                  t("The-user's-email-has-been-verified")
                )
              );
              // localStorage.removeItem("OrganizationID");
              // localStorage.removeItem("OrganizatioName");
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
                verifyOTPSuccess(
                  response.data.responseResult,
                  t("Invalid-OTP-Failed-to-verify-User-Email")
                )
              );
              // navigate("/createpasswordorganization");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserEmailVerification_03".toLowerCase()
                )
            ) {
              dispatch(
                verifyOTPSuccess(
                  response.data.responseResult,
                  t("The-user's-email-has-not-been-verified")
                )
              );
              return setSeconds(0), setMinutes(0);
            }
            // navigate("/createpasswordorganization")
            //    dispatch(verifyOTPSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
          } else {
            dispatch(verifyOTPFail(t("something-went-worng")));
            return setSeconds(0), setMinutes(0);
          }
        } else if (response.data.responseCode === 400) {
          return setSeconds(0), setMinutes(0);
          dispatch(verifyOTPFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(verifyOTPFail(t("something-went-worng")));
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
            if (response.data.responseResult.organizationName != undefined) {
              localStorage.setItem(
                "OrganizatioName",
                response.data.responseResult.organizationName
              );
            }
            if (response.data.responseResult.authToken != null) {
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
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_01".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/selectedpackage");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-an-admin-user")
                  )
                );
                navigate("/selectedpackage");
              } else if (response.data.responseResult.userRoleId === 3) {
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("2FA-Enabled")
                  )
                );
                navigate("/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_03".toLowerCase()
                )
            ) {
              localStorage.setItem(
                "roleID",
                response.data.responseResult.userRoleId
              );
              localStorage.setItem(
                "organizationID",
                response.data.responseResult.organizationID
              );
              localStorage.setItem(
                "organizationRoleID",
                response.data.responseResult.organizationRoleID
              );
              // if (response.data.responseResult.organizationName != undefined) {
              //   localStorage.setItem(
              //     "OrganizatioName",
              //     response.data.responseResult.organizationName
              //   );
              // }
              // if (response.data.responseResult.authToken != null) {
              // await localStorage.setItem(
              //   "name",
              //   response.data.responseResult.authToken.name
              // );
              // await localStorage.setItem(
              //   "token",
              //   JSON.stringify(response.data.responseResult.authToken.token)
              // );
              // await localStorage.setItem(
              //   "refreshToken",
              //   JSON.stringify(
              //     response.data.responseResult.authToken.refreshToken
              //   )
              // );
              // await localStorage.setItem(
              //   "roleID",
              //   response.data.responseResult.userRoleId
              // );
              // await localStorage.setItem(
              //   "organizationID",
              //   response.data.responseResult.organizationID
              // );
              // await localStorage.setItem(
              //   "organizationRoleID",
              //   response.data.responseResult.organizationRoleID
              // );
              // }
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("TThe-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("TThe-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordFail(
                    response.data.responseResult,
                    t("TThe-user-is-a-partial-admin-user")
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
              if (response.data.responseResult.organizationName != undefined) {
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
              }
              if (response.data.responseResult.authToken != null) {
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
                  response.data.responseResult.userRoleId
                );
              }
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user-and-the-role-id-is")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user-and-the-role-id-is")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("The-user-is-not-an-admin-user-and-the-role-id-is")
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2FA-Enabled")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-2FA-Enabled")
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
              if (response.data.responseResult.organizationName != undefined) {
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
              }
              if (response.data.responseResult.authToken != null) {
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
                  response.data.responseResult.userRoleId
                );
              }
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-a-partial-admin-user")
                  )
                );
                navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 3) {
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-a-new-user-the-user-is-not-an-admin-user")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                if (
                  response.data.responseResult.organizationName != undefined
                ) {
                  localStorage.setItem(
                    "OrganizatioName",
                    response.data.responseResult.organizationName
                  );
                }
                if (response.data.responseResult.authToken != null) {
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
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Organization-subscription-is-in-active-please-activate")
                  )
                );
                navigate("/selectedpackage");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Organization-subscription-is-in-active-please-activate")
                  )
                );
                navigate("/selectedpackage");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("Organization-subscription-is-in-active-please-activate")
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
              localStorage.setItem("blur", true);
              if (response.data.responseResult.organizationName != undefined) {
                localStorage.setItem(
                  "OrganizatioName",
                  response.data.responseResult.organizationName
                );
              }
              if (response.data.responseResult.authToken != null) {
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
                  response.data.responseResult.userRoleId
                );
              }
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-please-contact-your-admin"
                    )
                  )
                );

                navigate("/Diskus/Admin/PayOutstanding");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-Please-contact-your-admin"
                    )
                  )
                );
                navigate("/Diskus/Admin/Nonactive");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-subscription-is-in-active-please-contact-your-admin"
                    )
                  )
                );
                navigate("/Diskus/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_11".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("something-went-worng")
                  )
                );
                // navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("something-went-worng")
                  )
                );
                // navigate("/Diskus/Admin/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("something-went-worng")
                  )
                );
                // navigate("/Diskus/");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UserPasswordCreation_12".toLowerCase()
                )
            ) {
              if (response.data.responseResult.userRoleId === 1) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-Please-activate")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 2) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-Please-activate")
                  )
                );
                navigate("/");
              } else if (response.data.responseResult.userRoleId === 3) {
                dispatch(
                  createPasswordSuccess(
                    response.data.responseResult,
                    t("User-is-not-active-Please-activate")
                  )
                );
                navigate("/");
              }
            } else {
              dispatch(createPasswordFail(t("something-went-worng")));
            }
          } else {
            dispatch(createPasswordFail(t("something-went-worng")));
          }
        } else {
          dispatch(createPasswordFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(createPasswordFail(t("something-went-worng")));
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
                  t("Data-Available")
                )
              );
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
                  t("No-Data-Available")
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
                  t("No-Data-Available")
                )
              );
            }
          } else {
            dispatch(getSelectedPackageandDetailsFail(t("No-Data-Available")));
          }
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(getSelectedPackageandDetailsFail(t("No-Data-Available")));
      });
  };
};
const changePasswordInit = () => {
  return {
    type: actions.CHANGEPASSWORD_INIT,
  };
};
const changePasswordSuccess = (response, message) => {
  return {
    type: actions.CHANGEPASSWORD_SUCCESS,
    response: response,
    message: message,
  };
};
const changePasswordFail = (message) => {
  return {
    type: actions.CHANGEPASSWORD_FAIL,
    message: message,
  };
};
const changePasswordFunc = (oldPassword, newPassword, t) => {
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
      .then((response) => {
        if (response.data.responseCode === 417) {
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_ChangePassword_01")
            ) {
              dispatch(
                changePasswordSuccess(
                  response.data.responseResult,
                  t("Password-updated-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_ChangePassword_02")
            ) {
              dispatch(changePasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_ChangePassword_03")
            ) {
              dispatch(changePasswordFail(t("No-password-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("ERM_AuthService_AuthManager_ChangePassword_04")
            ) {
              dispatch(changePasswordFail(t("No-password-updated")));
            }
          } else {
            dispatch(changePasswordFail(t("something-went-worng")));
          }
        } else {
          dispatch(changePasswordFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        dispatch(changePasswordFail(t("something-went-worng")));
      });
  };
};
const setLoader = (response) => {
  return {
    type: actions.LOADER,
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

const organizationPackageReselection = (ID, navigate, t) => {
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
    SelectedPackageID: JSON.parse(ID),
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
          await dispatch(organizationPackageReselection(ID, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
                  t("something-wentworng")
                )
              );
              navigate("/Diskus/Admin/PackageDetail");
            } else {
              dispatch(
                organizationPackageReselectionFail(t("something-wentworng"))
              );
            }
          } else {
            dispatch(
              organizationPackageReselectionFail(t("something-wentworng"))
            );
          }
        } else {
          dispatch(
            organizationPackageReselectionFail(t("something-wentworng"))
          );
        }
      })
      .catch((response) => {
        dispatch(organizationPackageReselectionFail(t("something-wentworng")));
      });
  };
};
export {
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
};
