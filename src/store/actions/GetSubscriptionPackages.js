import { authenticationApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import axios from 'axios'
import { getSubscriptionDetailRequestMethod } from '../../commen/apis/Api_config';



const getSubscriptionDetailInit = () => {
    return {
        type: actions.GETSUBSCRIPTIONPACAKGES_INIT

    }
}
const getSubscriptionDetailSuccess = (response, message) => {
    console.log(response, message, " responseSuccess")
    return {
        type: actions.GETSUBSCRIPTIONPACAKGES_SUCCESS,
        response: response,
        message: message
    }
}

const getSubscriptionDetailFail = (message) => {
    return {
        type: actions.GETSUBSCRIPTIONPACAKGES_FAIL,
        message: message
    }
}

const getSubscriptionDetails = (t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(getSubscriptionDetailInit())
        let form = new FormData();
        form.append("RequestMethod", getSubscriptionDetailRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            console.log(response, "responseresponse")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_GetSubscriptionPackages_01".toLowerCase())) {
                        dispatch(getSubscriptionDetailSuccess(response.data.responseResult.subscriptionPackages
                            , t("Data-Available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_GetSubscriptionPackages_02".toLowerCase())) {
                            dispatch(getSubscriptionDetailFail(t("No-Data-Available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("ERM_AuthService_SignUpManager_GetSubscriptionPackages_02".toLowerCase())) {
                        dispatch(getSubscriptionDetailFail(t("No-Data-Available")))
                    }
                } else {
                    dispatch(getSubscriptionDetailFail(t("something-went-worng")))
                }
            } else {
                dispatch(getSubscriptionDetailFail(t("something-went-worng")))
            }
        }).catch((response) => {
            console.log(response, "responseresponse")
            dispatch(getSubscriptionDetailFail(t("something-went-worng")))
        })
    }
}

export { getSubscriptionDetails }