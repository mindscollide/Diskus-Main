import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import {
  getuserdetails,
  getUserSettings,
  updateProfileData,
} from "../../commen/apis/Api_config";
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
    message: message,
  };
};
const settingFail = (response, message) => {
  return {
    type: actions.GETSETTING_FAIL,
    response: response,
    message: message,
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
    NumberOfRecords: 10,
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
          await dispatch(RefreshToken(t));
          dispatch(getUserSetting(userID, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetUserSettings_01"
            ) {
              await dispatch(
                settingSuccess(
                  response.data.responseResult.userSettings,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetUserSettings_02"
            ) {
              await dispatch(
                settingFail(
                  response.data.responseResult.userSettings,
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetUserSettings_03"
            ) {
              await dispatch(
                settingFail(
                  response.data.responseResult.userSettings,
                  t("No-records-found")
                )
              );
            }
          } else {
            dispatch(
              settingFail(
                response.data.responseMessage,
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            settingFail(
              response.data.responseMessage,
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          settingFail(response.data.responseMessage, t("Something-went-wrong"))
        );
      });
  };
};
const getuserdetailinit = () => {
  return {
    type: actions.GET_USERS_DETAILS_INIT,
  };
};

const getuserdetailssuccess = (response, message) => {
  // console.log("response123", response, message);
  return {
    type: actions.GET_USERS_DETAILS_SUCCESS,
    response: response,
    message: message,
  };
};

const getuserdetailsfail = (message) => {
  return {
    type: actions.GET_USERS_DETAILS_FAIL,
    message: message,
  };
};

const getUserDetails = (userID, t, OrganizationID, setUserProfileModal) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userSettingData = {
    UserID: JSON.parse(userID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getuserdetailinit());
    let form = new FormData();
    form.append("RequestMethod", getuserdetails.RequestMethod);
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
        console.log("responseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(getUserDetails(userID, t, OrganizationID));
          // dispatch(updateuserprofile(updateData,t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserDetails_01".toLowerCase()
                )
            ) {
              await dispatch(
                getuserdetailssuccess(
                  response.data.responseResult.organization,
                  t("Record-found")
                )
              );
              setUserProfileModal(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserDetails_02".toLowerCase()
                )
            ) {
              await dispatch(getuserdetailsfail(t("No-records-found")));
              setUserProfileModal(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserDetails_03".toLowerCase()
                )
            ) {
              await dispatch(getuserdetailsfail(t("No-records-found")));
              setUserProfileModal(false);
            }
          } else {
            dispatch(getuserdetailsfail(t("Something-went-wrong")));
            setUserProfileModal(false);
          }
        } else {
          dispatch(getuserdetailsfail(t("Something-went-wrong")));
          setUserProfileModal(false);
        }
      })
      .catch((response) => {
        dispatch(getuserdetailsfail(t("Something-went-wrong")));
        setUserProfileModal(false);
      });
  };
};

const updateprofileinit = () => {
  return {
    type: actions.UPDATE_USER_PROFILE_INIT,
  };
};

const updateprofilesuccess = (response, message) => {
  return {
    type: actions.UPDATE_USER_PROFILE_SUCCESS,
    response: response,
    message: message,
  };
};

const updateprofilefail = (message) => {
  return {
    type: actions.UPDATE_USER_PROFILE_FAIL,
    message: message,
  };
};

const updateuserprofile = (updateData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  return (dispatch) => {
    dispatch(updateprofileinit());
    let form = new FormData();
    form.append("RequestMethod", updateProfileData.RequestMethod);
    form.append("RequestData", JSON.stringify(updateData));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responsefortheupdate", response);
        if (response.data.responseCode === 417) {
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateUserProfile_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateprofilesuccess(t("Record-updated-successfully"))
              );
              dispatch(getUserDetails(userID, t,organizationID));
              dispatch(getUserSetting(userID, t,organizationID));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateUserProfile_02".toLowerCase()
                )
            ) {
              dispatch(updateprofilefail(t("No-Records-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateUserProfile_03".toLowerCase()
                )
            ) {
              dispatch(updateprofilefail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateprofilefail(t("Something-went-worng")));
          }
        } else if (response.data.responseCode === 400) {
          dispatch(updateprofilefail(t("Something-went-wrong")));
        } else {
          dispatch(updateprofilefail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateprofilefail(t("Something-went-wrong")));
      });
  };
};
const settingClearMessege = () => {
  return {
    type: actions.UDPATEUSERSETTING_MESSAGE_CLEARE,
  };
};

export {
  getUserSetting,
  setRecentActivity,
  getUserDetails,
  settingClearMessege,
  updateuserprofile,
};
