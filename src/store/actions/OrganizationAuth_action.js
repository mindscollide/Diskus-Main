import { authenticationApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import axios from 'axios'
import { createOrganizationRequestMethod } from '../../commen/apis/Api_config';


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


const createOrganization = (data) => {
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

            // if (response.data.responseCode === 200) {
            //     if (response.data.responseResult.isExecuted === true) {
            //         dispatch(createOrganizationSuccess(response.data.responseResult.subscriptionPackages
            //             , response.data.responseResult.responseMessage))
            //     } else {
            //         dispatch(createOrganizationFail(response.data.responseResult.responseMessage))
            //     }
            // }
        }).catch((response) => {
            console.log(response)
            // dispatch(createOrganizationFail(response.data.responseResult.responseMessage))
        })
    }
}

export default createOrganization