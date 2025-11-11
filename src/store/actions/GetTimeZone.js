import * as actions from "../action_types";
import axios from "axios";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getTimeZOne } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

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
  return async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const form = new FormData();
      form.append("RequestMethod", getTimeZOne.RequestMethod);

      const response = await axiosInstance.post(settingApi, form);

      const { responseCode, responseResult } = response.data;

      if (responseCode === 417) {
        // Refresh token and retry the API call
        await dispatch(RefreshToken(navigate, t));
        return dispatch(getTimeZone(navigate, t));
      }

      if (responseCode === 200 && responseResult.isExecuted) {
        const message = responseResult.responseMessage.toLowerCase();

        // Dynamic handling of response messages
        if (
          message.includes(
            "settings_settingsservicemanager_getalltimezones_01".toLowerCase()
          )
        ) {
          dispatch(timeZoneSuccess(responseResult.timeZones, ""));
          return responseResult.timeZones; // Return successful result
        } else if (
          message.includes(
            "settings_settingsservicemanager_getalltimezones_02".toLowerCase()
          )
        ) {
          dispatch(timeZoneFail(t("No-records-found")));
        } else if (
          message.includes(
            "settings_settingsservicemanager_getalltimezones_03".toLowerCase()
          )
        ) {
          dispatch(timeZoneFail(t("Something-went-wrong")));
        } else {
          dispatch(timeZoneFail(t("Unexpected-response-message")));
        }
      } else {
        dispatch(timeZoneFail(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(timeZoneFail(t("Something-went-wrong")));
      throw error; // Rethrow error for higher-level handling
    }
  };
};

export default getTimeZone;
