import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import {
  getuserdetails,
  getUserSettings,
  updateProfileData,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { currentUserPicture } from "./Minutes_action";

const settingInit = () => {
  return {
    type: actions.GETSETTING_INIT,
  };
};
const settingSuccess = (response, message, loader) => {
  return {
    type: actions.GETSETTING_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};
const settingFail = (response, message) => {
  return {
    type: actions.GETSETTING_FAIL,
    response: response,
    message: message,
  };
};
const setRecentActivityDataNotification = (response) => {
  return {
    type: actions.SET_RECENT_ACTIVITY_NOTIFICATION,
    response: response,
  };
};

const getUserSetting = (navigate, t, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = localStorage.getItem("userID");
  let userSettingData = {
    UserID: JSON.parse(userID),
  };
  return async (dispatch) => {
    dispatch(settingInit());
    let form = new FormData();
    form.append("RequestMethod", getUserSettings.RequestMethod);
    form.append("RequestData", JSON.stringify(userSettingData));
    await axios({
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
          dispatch(getUserSetting(navigate, t, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Settings_SettingsServiceManager_GetUserSettings_01"
            ) {
              localStorage.setItem(
                "calenderMonthsSpan",
                response.data.responseResult.userSettings.calenderMonthsSpan
              );
              if (
                response.data.responseResult.userSettings
                  .userAllowMicrosoftCalendarSynch != null &&
                response.data.responseResult.userSettings
                  .userAllowMicrosoftCalendarSynch != false
              ) {
                localStorage.setItem(
                  "officeEventColor",
                  response.data.responseResult.userSettings.officeEventColor
                );
              } else {
                localStorage.removeItem("officeEventColor");
              }
              if (
                response.data.responseResult.userSettings
                  .userAllowGoogleCalendarSynch != null &&
                response.data.responseResult.userSettings
                  .userAllowGoogleCalendarSynch != false
              ) {
                localStorage.setItem(
                  "googleEventColor",
                  response.data.responseResult.userSettings.googleEventColor
                );
              } else {
                localStorage.removeItem("googleEventColor");
              }

              dispatch(currentUserPicture(response.data.responseResult.userSettings.userProfilePicture))

              localStorage.setItem(
                "diskusEventColor",
                response.data.responseResult.userSettings.diskusEventColor
              );

              localStorage.setItem(
                "videoBaseURLCaller",
                response.data.responseResult.userSettings.configurations[1]
                  .configValue
              );

              localStorage.setItem(
                "callRingerTimeout",
                response.data.responseResult.userSettings.configurations[2]
                  .configValue
              );

              localStorage.setItem(
                "videoBaseURLParticipant",
                response.data.responseResult.userSettings.configurations[3]
                  .configValue
              );

              await dispatch(
                settingSuccess(response.data.responseResult.userSettings, "")
              );
              // navigate("/Admin/ManageUsers");
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
        dispatch(settingFail(t("Something-went-wrong")));
      });
  };
};

const getuserdetailinit = () => {
  return {
    type: actions.GET_USERS_DETAILS_INIT,
  };
};

const getuserdetailssuccess = (response, message) => {
  //
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

const getUserDetails = (
  navigate,
  userID,
  t,
  OrganizationID,
  setUserProfileModal
) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getUserDetails(
              navigate,
              userID,
              t,
              OrganizationID,
              setUserProfileModal
            )
          );
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
                  ""
                )
              );
              if (typeof setUserProfileModal === "function") {
                setUserProfileModal(true);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserDetails_02".toLowerCase()
                )
            ) {
              await dispatch(getuserdetailsfail(t("No-records-found")));
              if (typeof setUserProfileModal === "function") {
                setUserProfileModal(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserDetails_03".toLowerCase()
                )
            ) {
              await dispatch(getuserdetailsfail(t("No-records-found")));
              if (typeof setUserProfileModal === "function") {
                setUserProfileModal(false);
              }
            }
          } else {
            dispatch(getuserdetailsfail(t("Something-went-wrong")));
            if (typeof setUserProfileModal === "function") {
              setUserProfileModal(false);
            }
          }
        } else {
          dispatch(getuserdetailsfail(t("Something-went-wrong")));
          if (typeof setUserProfileModal === "function") {
            setUserProfileModal(false);
          }
        }
      })
      .catch((response) => {
        dispatch(getuserdetailsfail(t("Something-went-wrong")));
        if (typeof setUserProfileModal === "function") {
          setUserProfileModal(false);
        }
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

const updateuserprofile = (
  navigate,
  updateData,
  t,
  setMobileEnable,
  setDesignationEnable,
  setNameEanble,
  setUser
) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            updateuserprofile(
              navigate,
              updateData,
              t,
              setMobileEnable,
              setDesignationEnable,
              setNameEanble
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
              setUser(false);
              let userID = localStorage.getItem("userID");
              let OrganizationID = localStorage.getItem("organizationID");
              setMobileEnable(true);
              setDesignationEnable(true);

              setNameEanble(true);
              await dispatch(
                getUserDetails(navigate, userID, t, OrganizationID)
              );
              await dispatch(getUserSetting(navigate, t));
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
  setRecentActivityDataNotification,
  getUserDetails,
  settingClearMessege,
  updateuserprofile,
};
