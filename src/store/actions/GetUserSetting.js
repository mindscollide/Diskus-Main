import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getUserSettings } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";

const settingInit = () => {
  return {
    type: actions.GETSETTING_INIT,
  };
};
const settingSuccess = (response, message) => {
  return {
    type: actions.GETSETTING_SUCCESS,
    response: response,
    message: message
  };
};
const settingFail = (response, message) => {
  return {
    type: actions.GETSETTING_FAIL,
    response: response,
    message: message
  };
};
const setRecentActivity = (response) => {
  return {
    type: actions.SETRECENTACTIVITYNOTIFICATION,
    response: response,
  };
};
const getUserSetting = (userID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userSettingData = {
    UserID: userID,
    NumberOfRecords: 10

  };
  return (dispatch) => {
    dispatch(settingInit());
    let form = new FormData();
    form.append("RequestMethod", getUserSettings.RequestMethod);
    form.append("RequestData", JSON.stringify(userSettingData));
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
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetUserSettings_01") {
              await dispatch(settingSuccess(response.data.responseResult.userSettings
                , t("Record-found")));
            } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetUserSettings_02") {
              await dispatch(settingFail(response.data.responseResult.userSettings, t("No-Record-Found")))
            } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetUserSettings_03") {
              await dispatch(settingFail(response.data.responseResult.userSettings, t("No-Record-Found")))
            }
          }
        }
      })
      .catch((response) => {
        dispatch(settingFail(response.data.responseMessage, t("No-Record-Found")));
      });
  };
};

export { getUserSetting, setRecentActivity };
