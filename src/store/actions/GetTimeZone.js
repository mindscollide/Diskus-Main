import * as actions from "../action_types";
import axios from "axios";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getTimeZOne } from "../../commen/apis/Api_config";

const timeZoneInit = () => {
  return {
    type: actions.GET_TIMEZONE_INIT,
  };
};
const timeZoneSuccess = (response, message) => {
  console.log(message, response);
  return {
    type: actions.GET_TIMEZONE_SUCCESS,
    response: response,
    message: message,
  };
};
const timeZoneFail = (message) => {
  return {
    type: actions.GET_TIMEZONE_SUCCESS,
    message: message,
  };
};

const getTimeZone = () => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    // dispatch(timeZoneInit())
    let form = new FormData();
    form.append("RequestMethod", getTimeZOne.RequestMethod);

    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        console.log("timezone response", response);
        if (response.data.responseResult.isExecuted === true) {
          console.log(
            "timezone response in conidtion",
            response.data.responseResult
          );
          dispatch(
            timeZoneSuccess(
              response.data.responseResult.timeZones,
              response.data.responseMessage
            )
          );
        } else {
          dispatch(timeZoneFail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(timeZoneFail);
        console.log(response);
      });
  };
};
export default getTimeZone;
