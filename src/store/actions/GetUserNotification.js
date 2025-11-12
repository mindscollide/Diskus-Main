import * as actions from "../action_types";
import { getUserNotifcations } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import { settingApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import axiosInstance from "../../commen/functions/axiosInstance";

const getusernotificationinit = () => {
  return {
    type: actions.GETUSERNOTIFICATION_INIT,
  };
};
const getuusernotifcationsuccess = (
  response,
  message,
  userNotificationData
) => {
  return {
    type: actions.GETUSERNOTIFICATION_SUCCESS,
    response: response,
    message: message,
    userNotificationData: userNotificationData,
  };
};
const getusernotificationfail = (message) => {
  return {
    type: actions.GETUSERNOTIFICATION_FAIL,
    message: message,
  };
};

const getNotifications = (navigate, userID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userIDData = {
    UserID: parseInt(userID),
  };
  return (dispatch) => {
    dispatch(getusernotificationinit());
    let form = new FormData();
    form.append("RequestMethod", getUserNotifcations.RequestMethod);
    form.append("RequestData", JSON.stringify(userIDData));
    axiosInstance
      .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getNotifications(navigate, userID, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserNotifications_01".toLowerCase()
                )
            ) {
              await dispatch(
                getuusernotifcationsuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserNotifications_02".toLowerCase()
                )
            ) {
              await dispatch(getusernotificationfail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetUserNotifications_03".toLowerCase()
                )
            ) {
              await dispatch(
                getusernotificationfail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(getusernotificationfail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getusernotificationfail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getusernotificationfail(t("Something-went-wrong")));
      });
  };
};

const HideNotificationUserNotificationData = () => {
  return {
    type: actions.HIDE,
  };
};

export {
  getNotifications,
  HideNotificationUserNotificationData,
  getusernotificationinit,
};
