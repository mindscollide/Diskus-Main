import { getCountryNames } from '../../commen/apis/Api_config';
import { authenticationApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import axios from 'axios'


const getCountryNamesInit = () => {
    return {
        type: actions.COUNTRYNAMES_INIT
    }
}

const getCountryNameSuccess = (response, message) => {
    return {
        type: actions.COUNTRYNAMES_SUCCESS,
        response: response,
        message: message
    }
}

const getCountryNameFail = (response, message) => {
    return {
        type: actions.COUNTRYNAMES_FAIL,
        response: response,
        message: message
    }
}


const getCountryNamesAction = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(getCountryNamesInit())
        let form = new FormData();
        form.append("RequestMethod", getCountryNames.RequestMethod);
        axios({
            method: "post",
            url: authenticationApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            console.log(response, "countryname")
            if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    dispatch(getCountryNameSuccess(response.data.responseResult.worldCountries, response.data.responseResult.responseMessage))
                } else {
                    dispatch(getCountryNameFail(response.data.responseResult.responseMessage))
                }
            }
        }).catch((response) => {
            dispatch(getCountryNameFail(response.data.responseResult.responseMessage))
        })
    }
}

export default getCountryNamesAction;