import * as actions from "../action_types";
import axios from "axios";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getTimeZOne } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

const timeZoneSuccess = (response, message) => {
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

const getTimeZone = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
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
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getTimeZone((navigate, t)));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetAllTimeZones_01".toLowerCase()
                )
            ) {
              dispatch(
                timeZoneSuccess(
                  response.data.responseResult.timeZones,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetAllTimeZones_02".toLowerCase()
                )
            ) {
              dispatch(timeZoneFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetAllTimeZones_03".toLowerCase()
                )
            ) {
              dispatch(timeZoneFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(timeZoneFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(timeZoneFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(timeZoneFail(t("Something-went-wrong")));
      });
  };
};
export default getTimeZone;
