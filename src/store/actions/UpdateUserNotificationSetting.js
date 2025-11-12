import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import {
  DiskusWebNotification,
  DiskusWebNotificationMarkAsRead,
  updateUserNotificationSetting,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";
import { isFunction } from "../../commen/functions/utils";
import axiosInstance from "../../commen/functions/axiosInstance";

const updateusernotificationinit = () => {
  return {
    type: actions.UPDATEUSERNOTIFICATION_INIT,
  };
};
const updateusernotificationsuccess = (message, response) => {
  return {
    type: actions.UPDATEUSERNOTIFICATION_SUCCESS,
    response: response,
    message: message,
  };
};
const updateusernotificationfail = (message, response) => {
  return {
    type: actions.UPDATEUSERNOTIFICATION_FAIL,
    message: message,
    response: response,
  };
};

const getUserNotificationSetting = (navigate, userSettingData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let Data = {
    UserNotificationSettings: {
      PK_UNSID: userSettingData.PK_UNSID,
      OnCancelledMeeting: userSettingData.OnCancelledMeeting,
      Sound: userSettingData.Sound,
      Email_NewMeeting: userSettingData.Email_NewMeeting,
      Email_CancelledMeeting: userSettingData.Email_CancelledMeeting,
      Email_EditMeeting: userSettingData.Email_EditMeeting,
      Email_ReminderTimeIsReached: userSettingData.Email_ReminderTimeIsReached,
      Toast_ParticipantJoiningMeeting:
        userSettingData.Toast_ParticipantJoiningMeeting,
      Toast_ParticipantLeavingMeeting:
        userSettingData.Toast_ParticipantLeavingMeeting,
      FK_UID: userSettingData.FK_UID,
    },
  };
  return (dispatch) => {
    dispatch(updateusernotificationinit());
    let form = new FormData();
    form.append("RequestMethod", updateUserNotificationSetting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
    .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getUserNotificationSetting(navigate, userSettingData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateusernotificationsuccess(
                response.data.responseResult.responseMessage,
                response.data.responseResult
              )
            );
            await dispatch(getUserSetting(JSON.parse(currentUserID), false));
          } else {
            dispatch(updateusernotificationfail());
          }
        } else {
          dispatch(updateusernotificationfail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateusernotificationfail(response.data.responseMessage));
      });
  };
};

//Diskus Web Notification Api Method

const DiskusWebNotificationActionMethodInit = () => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_INIT,
  };
};

const DiskusWebNotificationActionMethodSuccess = (response, message) => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_SUCCESS,
    response: response,
    message: message,
  };
};

const DiskusWebNotificationActionMethodFail = (message) => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_FAIL,
    message: message,
  };
};

const DiskusWebNotificationActionMethodAPI = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(DiskusWebNotificationActionMethodInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", DiskusWebNotification.RequestMethod);
    axiosInstance
      .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DiskusWebNotificationActionMethodAPI(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserWebNotifications_01".toLowerCase()
                )
            ) {
              dispatch(
                DiskusWebNotificationActionMethodSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserWebNotifications_02".toLowerCase()
                )
            ) {
              dispatch(
                DiskusWebNotificationActionMethodFail(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserWebNotifications_03".toLowerCase()
                )
            ) {
              dispatch(
                DiskusWebNotificationActionMethodFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                DiskusWebNotificationActionMethodFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              DiskusWebNotificationActionMethodFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            DiskusWebNotificationActionMethodFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          DiskusWebNotificationActionMethodFail(t("Something-went-wrong"))
        );
      });
  };
};

//Diskus Web Notification Mark As Read

const DiskusWebNotificationMarkAsReadInit = () => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_INIT,
  };
};

const DiskusWebNotificationMarkAsReadSuccess = (response, message) => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_SUCCESS,
    response: response,
    message: message,
  };
};

const DiskusWebNotificationMarkAsReadFail = (message) => {
  return {
    type: actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_FAIL,
    message: message,
  };
};

const DiskusWebNotificationMarkAsReadAPI = (
  navigate,
  t,
  data,
  setUnReadCountNotification,
  setwebNotificationData
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(DiskusWebNotificationMarkAsReadInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", DiskusWebNotificationMarkAsRead.RequestMethod);
    axiosInstance
    .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            DiskusWebNotificationMarkAsReadAPI(
              navigate,
              t,
              data,
              setUnReadCountNotification,
              setwebNotificationData
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_MarkNotificationsAsRead_01".toLowerCase()
                )
            ) {
              dispatch(
                DiskusWebNotificationMarkAsReadSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              //For Bring Notification Count to Zero
              (await isFunction(setUnReadCountNotification)) &&
                setUnReadCountNotification(0);
              (await isFunction(setwebNotificationData)) &&
                // Assuming webNotificationData is your state
                setwebNotificationData((prevData) =>
                  prevData.map(
                    (notification) =>
                      notification.isRead === false
                        ? { ...notification, isRead: true } // Update isRead to true
                        : notification // Keep as is
                  )
                );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_MarkNotificationsAsRead_02".toLowerCase()
                )
            ) {
              dispatch(
                DiskusWebNotificationMarkAsReadFail(t("Invalid-request-data"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_MarkNotificationsAsRead_03".toLowerCase()
                )
            ) {
              dispatch(DiskusWebNotificationMarkAsReadFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_MarkNotificationsAsRead_04".toLowerCase()
                )
            ) {
              DiskusWebNotificationMarkAsReadFail(t("Something-went-wrong"));
            } else {
              dispatch(
                DiskusWebNotificationMarkAsReadFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              DiskusWebNotificationMarkAsReadFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            DiskusWebNotificationMarkAsReadFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          DiskusWebNotificationMarkAsReadFail(t("Something-went-wrong"))
        );
      });
  };
};

//Diskus Global Unread Notification Count
const DiskusGlobalUnreadNotificationCount = (response) => {
  return {
    type: actions.REAL_TIME_UNREAD_NOTIFICATION_COUNT,
    response: response,
  };
};

//Notification Data Global State if Clicked in bettween Video
const webNotificationDataLeaveVideoIntiminationModal = (response) => {
  return {
    type: actions.WEB_NOTIFICATION_DATA_VIDEO_INITIMINATION,
    response: response,
  };
};

//Notification Data Global State if Clicked in bettween Video
const webnotificationGlobalFlag = (response) => {
  return {
    type: actions.GLOBAL_FLAG_WEB_NOTIFICATION_FUNCTION,
    response: response,
  };
};

export {
  getUserNotificationSetting,
  DiskusWebNotificationActionMethodAPI,
  DiskusWebNotificationMarkAsReadAPI,
  DiskusGlobalUnreadNotificationCount,
  webNotificationDataLeaveVideoIntiminationModal,
  webnotificationGlobalFlag,
};
