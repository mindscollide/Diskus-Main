import { authenticationApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import axios from 'axios'
import { createOrganizationRequestMethod, userEmailValidation, userPasswordVerify, userPasswordCreation, userEmailVerification } from '../../commen/apis/Api_config';

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
    console.log(data, "signupOrganization")
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
                        dispatch(createOrganizationSuccess(response.data.responseResult, t("The-Organization-has-been-created-successfully-and-the-OTP-has-been-generated-Please-verfiy-you-email")))
                        navigate("/verifyEmailOTP")
                    } else if (response.data.responseResult.responseMessage === "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_02") {
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
const enterPasswordFail = (message) => {
    return {
        type: actions.PASSWORDVALIDATION_FAIL,
        message: message
    }
}
const enterPasswordvalidation = (value, navigate) => {
    console.log("value", value)
    let userID = localStorage.getItem("UserId")
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
                    dispatch(enterPasswordSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                    navigate("/Diskus/")
                } else {
                    dispatch(enterPasswordFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            console.log(response)
            dispatch(enterPasswordFail(response.data.responseResult.responseMessage))
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
const verificationEmailOTP = (OTPValue, navigate) => {
    let userID = localStorage.getItem("UserId");
    let email = localStorage.getItem("Email")
    let data = { UserID: 213, Email: "ABC8989@GMAIL.COM", OTP: OTPValue }
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
                    dispatch(verifyOTPSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                    navigate("/createpasswordorganization")
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
const createPasswordAction = (value, navigate) => {
    let userID = localStorage.getItem("UserId");
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
                    dispatch(createPasswordSuccess(response.data.responseResult, response.data.responseResult.responseMessage))
                    navigate("/Diskus/")
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
export { createOrganization, validationEmailAction, enterPasswordvalidation, verificationEmailOTP, createPasswordAction }