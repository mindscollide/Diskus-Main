import * as actions from "../action_types";
import axios from "axios";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getCountryCode } from "../../commen/apis/Api_config";

const countryCodeInit = () => {
  return {
    type: actions.GET_COUNTRYCODE_INIT,
  };
};
const countryCodeSuccess = (response, message) => {
  return {
    type: actions.GET_COUNTRYCODE_SUCCESS,
    response: response,
    message: message,
  };
};
const countryCodeFail = (message) => {
  return {
    type: actions.GET_COUNTRYCODE_FAIL,
    message: message,
  };
};

const getCountryCodeFunc = () => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    // dispatch(countryCodeInit())
    let form = new FormData();
    form.append("RequestMethod", getCountryCode.RequestMethod);

    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          console.log("response country code", response);
          dispatch(
            countryCodeSuccess(
              response.data.responseResult.countryCodes,
              response.data.responseMessage
            )
          );
        }
      })
      .catch((response) => {
        dispatch(countryCodeFail);
        console.log(response);
      });
  };
};

export default getCountryCodeFunc;
