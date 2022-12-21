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
const getusernotificationfail = (response, message) => {
  return {
    type: actions.GETUSERNOTIFICATION_FAIL,
    response: response,
    message: message,
  };
};

const getNotifications = (userID) => {
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
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getuusernotifcationsuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
          } else {
            dispatch(getusernotificationfail(response.data.responseMessage));
          }
        } else {
          dispatch(getusernotificationfail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(getusernotificationfail(response.data.responseMessage));
      });
  };
};

const HideNotificationUserNotificationData = () => {
  return {
    type: actions.HIDE,
  };
};

export { getNotifications, HideNotificationUserNotificationData };
