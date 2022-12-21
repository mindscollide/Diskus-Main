import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { updateUserNotificationSetting } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";

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

const getUserNotificationSetting = (userSettingData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("UserID");
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
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("updae user notification", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateusernotificationsuccess(
                response.data.responseResult.responseMessage,
                response.data.responseResult
              )
            );
            await dispatch(getUserSetting(JSON.parse(currentUserID)));
          } else {
            dispatch(updateusernotificationfail());
          }
        } else {
          dispatch(updateusernotificationfail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateusernotificationfail(response.data.responseMessage));
        console.log("catch response", response);
      });
  };
};

export default getUserNotificationSetting;
