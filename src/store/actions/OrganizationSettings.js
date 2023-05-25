import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import {
  updateOrganizationLevelSettings,
  getOrganizationLevelSettings,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

const getOrganizationLevelSettingInit = () => {
  return {
    type: actions.GETORGANIZATIONLEVELSETTING_INIT,
  };
};
const getOrganizationLevelSettingSuccess = (response, message) => {
  return {
    type: actions.GETORGANIZATIONLEVELSETTING_SUCCESS,
    response: response,
    message: message,
  };
};
const getOrganizationLevelSettingFail = (message) => {
  return {
    type: actions.GETORGANIZATIONLEVELSETTING_FAIL,
    message: message,
  };
};
const getOrganizationLevelSetting = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = {
    OrganizationID: organizationID,
  };
  return (dispatch) => {
    dispatch(getOrganizationLevelSettingInit());
    let form = new FormData();
    form.append("RequestMethod", getOrganizationLevelSettings.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t))
          dispatch(getOrganizationLevelSetting(navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetOrganizationSettings_01"
            ) {
              dispatch(
                getOrganizationLevelSettingSuccess(
                  response.data.responseResult.organizationSettings,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetOrganizationSettings_02"
            ) {
              dispatch(
                getOrganizationLevelSettingSuccess(
                  response.data.responseResult.organizationSettings,
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetOrganizationSettings_03"
            ) {
              dispatch(
                getOrganizationLevelSettingSuccess(
                  response.data.responseResult.organizationSettings,
                  t("No-records-found")
                )
              );
            }
          } else {
            dispatch(
              getOrganizationLevelSettingFail(
                response.data.responseResult,
                t("No-records-found")
              )
            );
          }
        } else {
          dispatch(
            getOrganizationLevelSettingFail(
              response.data.responseResult,
              t("No-records-found")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getOrganizationLevelSettingFail(
            response.data.responseResult,
            t("No-records-found")
          )
        );
      });
  };
};

const updateOrganizationLevelSettingInit = () => {
  return {
    type: actions.UPDATEORGANIZATIONLEVELSETTING_INIT,
  };
};
const updateOrganizationLevelSettingSuccess = (message) => {
  return {
    type: actions.UPDATEORGANIZATIONLEVELSETTING_SUCCESS,
    message: message,
  };
};
const updateOrganizationLevelSettingFail = (message) => {
  return {
    type: actions.UPDATEORGANIZATIONLEVELSETTING_FAIL,
    message: message,
  };
};
const updateOrganizationLevelSetting = (navigate, updateData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let data = {
    organizationSettings: updateData,
  };
  console.log(data, "updateData");
  return (dispatch) => {
    dispatch(updateOrganizationLevelSettingInit());
    let form = new FormData();
    form.append("RequestMethod", updateOrganizationLevelSettings.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t))
          dispatch(updateOrganizationLevelSetting(navigate, updateData, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationSettings_01"
            ) {
              dispatch(
                updateOrganizationLevelSettingSuccess(
                  t("Organization-configurations-updated-successfully")
                )
              );
              dispatch(getOrganizationLevelSetting(t));
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationSettings_02"
            ) {
              dispatch(
                updateOrganizationLevelSettingSuccess(t("Organization-configurations-updates-not-successfully"))
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_UpdateOrganizationSettings_03"
            ) {
              dispatch(
                updateOrganizationLevelSettingFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              updateOrganizationLevelSettingFail(t("Something-went-wrong"))
            );
          }
        } else if (response.data.responseCode === 400) {
          dispatch(
            updateOrganizationLevelSettingFail(t("Something-went-wrong"))
          );
        } else {
          dispatch(
            updateOrganizationLevelSettingFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(updateOrganizationLevelSettingFail(t("Something-went-wrong")));
      });
  };
};

export { getOrganizationLevelSetting, updateOrganizationLevelSetting };
