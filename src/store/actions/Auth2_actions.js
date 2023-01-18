import { authenticationApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import axios from 'axios'
import { createOrganizationRequestMethod, userEmailValidation, userPasswordVerify, userPasswordCreation, userEmailVerification, getSelectedPacakge_Detail } from '../../commen/apis/Api_config';

const createOrganizationInit = () => {
    return {
        type: actions.SIGNUPORGANIZATION_INIT
    }
}
const createOrganizationSuccess = (response, message) => {
    return {
        type: actions.SIGNUPORGANIZATION_SUCCESS,
        response: response,
        message: message
    }
}
const createOrganizationFail = (message) => {
    return {
        type: actions.SIGNUPORGANIZATION_FAIL,
        message: message
    }
}
const createOrganization = (data, navigate, t) => {
    return (dispatch) => {
        dispatch(createOrganizationInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", createOrganizationRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            console.log(response, "signupOrganization")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_01") {
                        localStorage.setItem("userID", response.data.responseResult.userID)
                        localStorage.setItem("OrganizationID", response.data.responseResult.organizationID)
                        localStorage.setItem("UserEmail", data.Organization.ContactPersonEmail)
                        localStorage.setItem("OrganizatioName", data.Organization.OrganizationName)
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The-Organization-has-been-created-successfully-and-the-OTP-has-been-generated-Please-verfiy-you-email")))
                        navigate("/verifyEmailOTP")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_02") {
                        localStorage.setItem("userID", response.data.responseResult.userID)
                        localStorage.setItem("OrganizationID", response.data.responseResult.organizationID)
                        localStorage.setItem("UserEmail", data.Organization.ContactPersonEmail)
                        localStorage.setItem("OrganizatioName", data.Organization.OrganizationName)
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The-Organization-has-been-created-successfully-but-the-OTP-has-not-been-generated")))
                        navigate("/verifyEmailOTP")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_03") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The-Organization-has-been-created-successfully-failed-to-save-User")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_04") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The-Organization-has-been-created-successfully-and-the-User-has-been-associated-to-it")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_05") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("Failed-to-save-Organization-Subscription")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_06") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("Failed-to-save-Organization-Subscription")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_07") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("This-Organization-already-exists")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_08") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The Organization has not created successfully failed to save User.")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_09") {
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The Organization has not created successfully failed to save User.")))
                    } else {
                        dispatch(createOrganizationSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                    }
                } else {
                    dispatch(createOrganizationFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(createOrganizationFail(response.data.responseResult.responseMessage))
        })
    }
}
const validationEmailInit = () => {
    return {
        type: actions.EMAILVALIDATION_INIT,
    }
}
const validationEmailSuccess = (response, message) => {
    return {
        type: actions.EMAILVALIDATION_SUCCESS,
        response: response,
        message: message
    }
}
const validationEmailFail = (message) => {
    return {
        type: actions.EMAILVALIDATION_FAIL,
        message: message
    }
}
const validationEmailAction = (email, navigate) => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = { UserEmail: email, Device: "Browser", DeviceID: id.toString() }
    return (dispatch) => {
        dispatch(validationEmailInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", userEmailValidation.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            console.log(response, "signupOrganization")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    dispatch(validationEmailSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                    navigate("/enterPassword")
                } else {
                    dispatch(validationEmailFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(validationEmailFail(response.data.responseResult.responseMessage))
        })
    }
}
const enterPasswordInit = () => {
    return {
        type: actions.PASSWORDVALIDATION_INIT,
    }
}
const enterPasswordSuccess = (response, message) => {
    return {
        type: actions.PASSWORDVALIDATION_SUCCESS,
        response: response,
        message: message
    }
}
const enterPasswordFail = (response, message) => {
    return {
        type: actions.PASSWORDVALIDATION_FAIL,
        response: response,
        message: message
    }
}
const enterPasswordvalidation = (value, navigate, t) => {
    console.log("value", value)
    let userID = localStorage.getItem("userID")
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = { UserID: JSON.parse(userID), Device: "Browser", DeviceID: id.toString(), UserPassword: value }
    return (dispatch) => {
        dispatch(enterPasswordInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", userPasswordVerify.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            console.log(response, "enterPasswordvalidation")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_01") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("Device-does-not-exists")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_02") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("Device-ID-does-not-exists")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_03") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("2FA-Enabled")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_04") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("The-user-is-an-admin-user-and-the-role-id-is")))
                        navigate("/DisKus/Admin")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_05") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("The-user-is-not-an-admin-user-and-the-role-id-is")))
                        navigate("/DisKus/")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_06") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_07") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("2FA-Enabled")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_08") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("The-user-is-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_09") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("The-user-is-not-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_10") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("Your-Organization-is-not-activated-Please-contact-your-admin")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_11") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("User-is-not-activated-Please-contact-your-admin")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_AuthManager_PasswordVerification_12") {
                        dispatch(enterPasswordSuccess(response.data.responseResult, t("Password-verification-failed-Try-again")))
                    }
                } else {
                    dispatch(enterPasswordFail(response.data.responseResult, (t("Password-verification-failed-Try-again"))))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(enterPasswordFail(t(response.data.responseResult.responseMessage)))
        })
    }
}
const verifyOTPInit = () => {
    return {
        type: actions.VERIFYOTPFOREMAIL_INIT
    }
}
const verifyOTPSuccess = (response, message) => {
    return {
        type: actions.VERIFYOTPFOREMAIL_SUCCESS,
        response: response,
        message: message
    }
}
const verifyOTPFail = (message) => {
    return {
        type: actions.VERIFYOTPFOREMAIL_FAIL,
        message: message
    }
}
const verificationEmailOTP = (OTPValue, navigate, t) => {
    let userID = localStorage.getItem("userID");
    let email = localStorage.getItem("UserEmail")
    let data = { UserID: JSON.parse(userID), Email: email, OTP: OTPValue }
    return (dispatch) => {
        dispatch(verifyOTPInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", userEmailVerification.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            console.log(response, "verificationEmailOTP")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_UserEmailVerification_01") {
                        dispatch(verifyOTPSuccess(response.data.responseResult, t("The-user's-email-has-been-verified")))
                        navigate("/createpasswordorganization")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_UserEmailVerification_02") {
                        dispatch(verifyOTPSuccess(response.data.responseResult, t("Invalid-OTP-Failed-to-verify-User-Email")))
                        navigate("/createpasswordorganization")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_UserEmailVerification_03") {
                        dispatch(verifyOTPSuccess(response.data.responseResult, t("The-user's-email-has-not-been-verified")))
                    }
                    // navigate("/createpasswordorganization")
                    //    dispatch(verifyOTPSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                } else if (response.data.responseCode === 400) {

                } else {
                    dispatch(verifyOTPFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(verifyOTPFail(response.data.responseResult.responseMessage))
        })
    }
}
const createPasswordInit = () => {
    return {
        type: actions.PASSWORDCREATION_INIT
    }
}
const createPasswordSuccess = (response, message) => {
    return {
        type: actions.PASSWORDCREATION_SUCCESS,
        response: response,
        message: message
    }
}
const createPasswordFail = (message) => {
    return {
        type: actions.PASSWORDCREATION_FAIL,
        message: message
    }
}
const createPasswordAction = (value, navigate, t) => {
    let userID = localStorage.getItem("userID");
    let data = { UserID: JSON.parse(userID), "Password": value }
    return (dispatch) => {
        dispatch(createPasswordInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", userPasswordCreation.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            console.log(response, "createPasswordAction")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    console.log(response.data.responseResult.responseMessage.split(" ")[0], "test")
                    if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_01") {
                        console.log("hello test")
                        dispatch(createPasswordSuccess(response.data.responseResult, t("The-user-is-an-admin-user-and-the-role-id-is")))
                        navigate("/selectedpackage")
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_02") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("2FA-Enabled")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_03") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("The-user-is-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_04") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("The-user-is-not-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_05") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("The-user-has-been-created-but-in-a-close-state-Please-contact-your-admin")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_06") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("User-is-not-a-new-user-2FA-Enabled")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_07") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("User-is-not-a-new-user-The-user-is-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_08") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("User-is-not-a-new-user-The-user-is-not-an-admin-user-and-the-role-id-is")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_09") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("Organization-subscription-is-in-active-Please-activate")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_10") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("Organization-subscription-is-in=active-Please-contact-your-admin")))
                    } else if (response.data.responseResult.responseMessage.split(" ")[0] === "ERM_AuthService_SignUpManager_UserPasswordCreation_11") {
                        dispatch(createPasswordSuccess(response.data.responseResult, t("Organization-subscription-is-in=active-Please-contact-your-admin")))
                    }
                } else {
                    dispatch(createPasswordFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(createPasswordFail(response.data.responseResult.responseMessage))
        })
    }
}
const getSelectedPackageandDetailsInit = () => {
    return {
        type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_INIT
    }
}
const getSelectedPackageandDetailsSuccess = (response, message) => {
    return {
        type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_SUCCESS,
        response: response,
        message: message
    }
}
const getSelectedPackageandDetailsFail = (message) => {
    return {
        type: actions.GETSELECTEDPACAKGEANDORGANIZATIONDETAILS_FAIL,
        message: message
    }
}
const getSelectedPacakgeDetail = (navigate, t) => {
    let value = localStorage.getItem("OrganizatioName");
    let data = { OrganizationName: value }
    return (dispatch) => {
        dispatch(getSelectedPackageandDetailsInit())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data))
        form.append("RequestMethod", getSelectedPacakge_Detail.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form
        }).then((response) => {
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    console.log(response.data.responseResult.responseMessage.split(" ")[0], "test")
                    if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_01") {
                        dispatch(getSelectedPackageandDetailsSuccess(response.data.responseResult, t("Data-Available")))
                        // navigate("/paymentForm")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_02") {
                        dispatch(getSelectedPackageandDetailsSuccess(response.data.responseResult, t("No-Data-Available")))
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_GetOrganizationSeletedPackage_03") {
                        dispatch(getSelectedPackageandDetailsSuccess(response.data.responseResult, t("No-Data-Available")))
                    }
                } else {
                    dispatch(getSelectedPackageandDetailsFail(t("No-Data-Available")))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(getSelectedPackageandDetailsFail(t("No-Data-Available")))
        })
    }
}
export { createOrganization, validationEmailAction, enterPasswordvalidation, verificationEmailOTP, getSelectedPacakgeDetail, createPasswordAction }