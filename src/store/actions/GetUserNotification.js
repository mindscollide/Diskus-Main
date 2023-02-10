import * as actions from "../action_types";
import { getUserNotifcations } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import { settingApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";

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

const getNotifications = (userID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userIDData = {
    UserID: parseInt(userID),
  };
  return (dispatch) => {
    dispatch(getusernotificationinit());
    let form = new FormData();
    form.append("RequestMethod", getUserNotifcations.RequestMethod);
    form.append("RequestData", JSON.stringify(userIDData));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("notifications response", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(getNotifications(userID, t));
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
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetFAQs_02".toLowerCase()
                )
            ) {
              await dispatch(getusernotificationfail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetFAQs_03".toLowerCase()
                )
            ) {
              await dispatch(
                getusernotificationfail(t("something-went-worng"))
              );
            }
          } else {
            await dispatch(getusernotificationfail(t("something-went-worng")));
          }
        } else {
          await dispatch(getusernotificationfail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        dispatch(getusernotificationfail(t("something-went-worng")));
      });
  };
};

const HideNotificationUserNotificationData = () => {
  return {
    type: actions.HIDE,
  };
};

export { getNotifications, HideNotificationUserNotificationData };
