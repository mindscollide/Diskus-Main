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
    console.log(response, message ," responseSuccess")
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

const getSubscriptionDetails = () => {
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
            console.log(response, "packges")

            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    dispatch(getSubscriptionDetailSuccess(response.data.responseResult.subscriptionPackages
                        , response.data.responseResult.responseMessage))
                } else {
                    dispatch(getSubscriptionDetailFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            // dispatch(getSubscriptionDetailFail(response.data.responseResult.responseMessage))
        })
    }
}

export default getSubscriptionDetails