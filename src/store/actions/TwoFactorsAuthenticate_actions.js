import * as actions from '../action_types';
import { authenticationApi } from '../../commen/apis/Api_ends_points';
import axios from 'axios'
import { TwoFaAuthenticateRequestMethod, sendTwoFacOTP, verifyTwoFacOTP } from '../../commen/apis/Api_config';

const TwoFaAuthenticateInit = () => {
    return {
        type: actions.CHECKINGAUTHENTICATEAFA_INIT
    }
}
const TwoFaAuthenticateSuccess = (response, message) => {
    return {
        type: actions.CHECKINGAUTHENTICATEAFA_SUCCESS,
        response: response,
        message: message
    }
}
const TwoFaAuthenticateFail = (message) => {
    return {
        type: actions.CHECKINGAUTHENTICATEAFA_FAIL,
        message: message
    }
}

const TwoFaAuthenticate = (t, OrganiztionID, userID, navigate) => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let Data = { UserID: JSON.parse(userID), Device: "Browser", DeviceID: id.toString(), OrganizationID: JSON.parse(OrganiztionID) }
    return (dispatch) => {
        dispatch(TwoFaAuthenticateInit());
        let form = new FormData();
        form.append("RequestMethod", TwoFaAuthenticateRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: authenticationApi,
            data: form,
        }).then(async (response) => {
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_01".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateFail(t("Device-does-not-exists")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_02".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateFail(t("Device-id-does-not-exists")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_03".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateSuccess(response.data.responseResult, t("2FA-authentication-is-not-enabled-against-this-user")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_04".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateFail(t("No-user-exist")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_05".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateSuccess(response.data.responseResult, t("User-has-saved-devices-along-with-email-and-sms")))
                        if (response.data.responseResult.userDevices.length === 1) {
                            navigate("/sendmailRealme")
                        } else {
                            navigate("/twofacsendemail")
                        }
                        // localStorage.setItem("organizationID", JSON.parse(response.data.responseResult.organizationID))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_06".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateSuccess(response.data.responseResult, t("User-doesnt-have-saved-devices")))
                        navigate("/twofac")
                        // localStorage.setItem("organizationID", JSON.parse(response.data.responseResult.organizationID))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Authenticate2FA_07".toLowerCase())) {
                        await dispatch(TwoFaAuthenticateFail(t("something-went-worng")))
                    }
                } else {
                    await dispatch(TwoFaAuthenticateFail(t("something-went-worng")))
                }
            } else if (response.data.responseCode === 400) {
                await dispatch(TwoFaAuthenticateFail(t("something-went-worng")))
            }
        }).catch((response) => {
            dispatch(TwoFaAuthenticateFail(t("something went wrong")))
        })
    }
}

const sendTwoFacOtpInit = () => {
    return {
        type: actions.SENDTWOFACOTP_INIT
    }
}

const sendTwoFacOtpSuccess = (response, message) => {
    return {
        type: actions.SENDTWOFACOTP_SUCCESS,
        response: response,
        message: message
    }
}
const sendTwoFacOtpFail = (message) => {
    return {
        type: actions.SENDTWOFACOTP_FAIL,
        message: message
    }
}
const sendTwoFacAction = (t, navigate, Data) => {
    // let Data = {Data }
    return (dispatch) => {
        dispatch(sendTwoFacOtpInit());
        let form = new FormData();
        form.append("RequestMethod", sendTwoFacOTP.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: authenticationApi,
            data: form,
        })
            .then((response) => {
                console.log(response)
                if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_01".toLowerCase())) {
                            dispatch(sendTwoFacOtpFail(t("Device-does-not-exists")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_02".toLowerCase())) {
                            dispatch(sendTwoFacOtpFail(t("Device-id-does-not-exists")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_03".toLowerCase())) {
                            dispatch(sendTwoFacOtpFail(t("FailedtogenerateOTP")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_04".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-email-sms-and-devices")))
                            navigate("/verifycodeone")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_05".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-sms-and-devices")))
                            navigate("/verifycodeone")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_06".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-email-and-devices")))
                            navigate("/verifycodeone")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_07".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-email-and-sms")))
                            navigate("/verifycodeone")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_08".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-devices")))
                            navigate("/verifycodeone")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_09".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-sms")))
                            navigate("/verifycodeone", { state: { value: 0 } })
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_10".toLowerCase())) {
                            dispatch(sendTwoFacOtpSuccess(response.data.responseResult, t("Otp-code-sent-via-email")))
                            navigate("/verifycodeone", { state: { value: 1 } })

                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Send2FAOTP_11".toLowerCase())) {
                            dispatch(sendTwoFacOtpFail(t("something-went-worng")))
                        }
                    } else {
                        dispatch(sendTwoFacOtpFail(t("something-went-worng")))
                    }
                } else {
                    dispatch(sendTwoFacOtpFail(t("something-went-worng")))
                }
            })
            .catch((response) => { dispatch(sendTwoFacOtpFail(t("something-went-worng"))) })
    }
}

const verifyOtpFacInit = () => {
    return {
        type: actions.SENDTWOFACOTP_INIT
    }
}
const verifyOtpFacSuccess = () => {
    return {
        type: actions.SENDTWOFACOTP_SUCCESS
    }
}
const verifyOtpFacFail = () => {
    return {
        type: actions.SENDTWOFACOTP_FAIL
    }
}

const verificationTwoFacOtp = (t, Data, navigate) => {
    return (dispatch) => {
        dispatch(verifyOtpFacInit())
        let form = new FormData();
        form.append("RequestMethod", verifyTwoFacOTP.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: authenticationApi,
            data: form,
        })
            .then((response) => {
                if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Verify2FAOTP_01".toLowerCase())) {
                            dispatch(verifyOtpFacSuccess(response.data.responseResult, t("Otp-has-been-verified-successfully")))
                            if (response.data.responseResult.token.roleID === 1) {
                                localStorage.setItem(
                                    "name",
                                    response.data.responseResult.token.userName
                                );
                                localStorage.setItem(
                                    "token",
                                    JSON.stringify(response.data.responseResult.token.token)
                                );
                                localStorage.setItem(
                                    "refreshToken",
                                    JSON.stringify(
                                        response.data.responseResult.token.refreshToken
                                    )
                                );
                                localStorage.setItem(
                                    "roleID",
                                    response.data.responseResult.token.roleID
                                );
                                navigate("/Diskus/Admin/");
                            } else if (response.data.responseResult.token.roleID === 2) {
                                localStorage.setItem(
                                    "name",
                                    response.data.responseResult.token.userName
                                );
                                localStorage.setItem(
                                    "token",
                                    JSON.stringify(response.data.responseResult.token.token)
                                );
                                localStorage.setItem(
                                    "refreshToken",
                                    JSON.stringify(
                                        response.data.responseResult.token.refreshToken
                                    )
                                );
                                localStorage.setItem(
                                    "roleID",
                                    response.data.responseResult.token.roleID
                                );
                                navigate("/Diskus/Admin/");
                            } else if (response.data.responseResult.token.roleID === 3) {
                                localStorage.setItem(
                                    "name",
                                    response.data.responseResult.token.userName
                                );
                                localStorage.setItem(
                                    "token",
                                    JSON.stringify(response.data.responseResult.token.token)
                                );
                                localStorage.setItem(
                                    "refreshToken",
                                    JSON.stringify(
                                        response.data.responseResult.token.refreshToken
                                    )
                                );
                                localStorage.setItem(
                                    "roleID",
                                    response.data.responseResult.token.roleID
                                );
                                if (response.data.responseResult.token.isFirstLogIn === true) {
                                    navigate("/onboard");
                                } else {
                                    navigate("/DisKus/");

                                }
                                localStorage.setItem(
                                    "name",
                                    response.data.responseResult.token.userName
                                );
                                localStorage.setItem(
                                    "token",
                                    JSON.stringify(response.data.responseResult.token.token)
                                );
                                localStorage.setItem(
                                    "refreshToken",
                                    JSON.stringify(
                                        response.data.responseResult.token.refreshToken
                                    )
                                );
                                localStorage.setItem(
                                    "roleID",
                                    response.data.responseResult.token.roleID
                                );
                            }
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Verify2FAOTP_02".toLowerCase())) {
                            dispatch(verifyOtpFacFail(t("Failed-to-verify-otp")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Verify2FAOTP_03".toLowerCase())) {
                            dispatch(verifyOtpFacFail(t("something-went-worng")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_AuthManager_Verify2FAOTP_04".toLowerCase())) {
                            dispatch(verifyOtpFacFail(t("No-otp-exist-against-this-user")))
                        }
                    } else {
                        dispatch(verifyOtpFacFail(t("something-went-worng")))
                    }
                } else {
                    dispatch(verifyOtpFacFail(t("something-went-worng")))
                }
            })
            .catch((response) => {
                dispatch(verifyOtpFacFail(t("something-went-worng")))
            })
    }
}
export { TwoFaAuthenticate, sendTwoFacAction, verificationTwoFacOtp }