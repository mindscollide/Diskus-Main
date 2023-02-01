import * as actions from '../action_types'
import { settingApi } from '../../commen/apis/Api_ends_points'
import axios from 'axios'
import { updateOrganizationLevelSettings, getOrganizationLevelSettings } from '../../commen/apis/Api_config'



const getOrganizationLevelSettingInit = () => {
    return {
        type: actions.GETORGANIZATIONLEVELSETTING_INIT
    }
}
const getOrganizationLevelSettingSuccess = (response, message) => {
    return {
        type: actions.GETORGANIZATIONLEVELSETTING_SUCCESS,
        response: response,
        message: message

    }
}
const getOrganizationLevelSettingFail = (message) => {
    return {
        type: actions.GETORGANIZATIONLEVELSETTING_FAIL,
        message: message
    }
}
const getOrganizationLevelSetting = (t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let data = {
        OrganizationID: organizationID
    }
    return (dispatch) => {
        dispatch(getOrganizationLevelSettingInit())
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
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        console.log(response, "responseresponseresponse")
                        if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetOrganizationSettings_01") {
                            dispatch(getOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("Record-found")))
                        } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetOrganizationSettings_02") {
                            dispatch(getOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("No-Record-Found")))
                        } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_GetOrganizationSettings_03") {
                            dispatch(getOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("No-Record-Found")))
                        }
                    }
                } else {
                    dispatch(getOrganizationLevelSettingFail(response.data.responseResult, t("No-Record-Found")))
                }
            })
            .catch((response) => {
                dispatch(getOrganizationLevelSettingFail(response.data.responseResult, t("No-Record-Found")))
            });
    };
}

const updateOrganizationLevelSettingInit = () => {
    return {
        type: actions.UPDATEORGANIZATIONLEVELSETTING_INIT
    }
}
const updateOrganizationLevelSettingSuccess = () => {
    return {
        type: actions.UPDATEORGANIZATIONLEVELSETTING_SUCCESS
    }
}
const updateOrganizationLevelSettingFail = () => {
    return {
        type: actions.UPDATEORGANIZATIONLEVELSETTING_FAIL
    }
}
const updateOrganizationLevelSetting = (updateData, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let data = {
        organizationSettings: updateData
    }
    console.log(data, "updateData")
    return (dispatch) => {
        dispatch(updateOrganizationLevelSettingInit())
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
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        console.log(response, "responseresponseresponse")
                        if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_UpdateOrganizationSettings_01") {
                            dispatch(updateOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("Record-found")))
                            dispatch(getOrganizationLevelSetting(t))
                        } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_UpdateOrganizationSettings_02") {
                            dispatch(updateOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("No-Record-Found")))
                        } else if (response.data.responseResult.responseMessage === "Settings_SettingsServiceManager_UpdateOrganizationSettings_03") {
                            dispatch(updateOrganizationLevelSettingSuccess(response.data.responseResult.organizationSettings, t("No-Record-Found")))
                        }
                    }
                } else if (response.data.responseCode === 400) {
                    dispatch(updateOrganizationLevelSettingFail(response.data.responseResult, t("No-Record-Found")))
                } else {
                    dispatch(updateOrganizationLevelSettingFail(response.data.responseResult, t("No-Record-Found")))
                }
            })
            .catch((response) => {
                dispatch(updateOrganizationLevelSettingFail(response.data.responseResult, t("No-Record-Found")))
            });
    };
}



export { getOrganizationLevelSetting, updateOrganizationLevelSetting }