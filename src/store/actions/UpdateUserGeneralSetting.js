import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import {
  updateUserGeneralSetting,
  updateOrganizationUserSetting,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";
// const updateUserGeneralSettinginit = () => {
//   return {
//     type: actions.UPDATEUSERGENERALSETTING_INIT,
//   };
// };
// const updateUserGeneralSettingsuccess = (message, response) => {
//   return {
//     type: actions.UPDATEUSERGENERALSETTING_SUCCESS,
//     response: response,
//     message: message,
//   };
// };
// const updateUserGeneralSettingfail = (message, response) => {
//   return {
//     type: actions.UPDATEUSERGENERALSETTING_FAIL,
//     message: message,
//     response: response,
//   };
// };
// const updateUserGeneralSettingFunc = (userGeneralSettingData) => {
//   console.log("userGeneralSettingData", userGeneralSettingData);
//   let token = JSON.parse(localStorage.getItem("token"));
//   let currentUserID = localStorage.getItem("userID");
//   let Data = {
//     UserSettings: {
//       FK_TZID: 2,
//       MaximumMeetingDuration: 3,
//       SynchronizeDocuments: true,
//       EmailOnNewMeeting: false,
//       EmailOnEditMeeting: true,
//       PushNotificationOnNewMeeting: false,
//       PushNotificationOnEditMeeting: true,
//       ShowNotificationOnParticipantJoining: true,
//       DormantInactiveUsersForDays: 21,
//       FK_OrganizationID: 70,
//       FK_CCID: 7,
//       FK_UID:234

//     },
//   };
//   return (dispatch) => {
//     dispatch(updateUserGeneralSettinginit());
//     let form = new FormData();
//     form.append("RequestMethod", updateUserGeneralSetting.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     axios({
//       method: "post",
//       url: settingApi,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         console.log("update general user response", response);
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(t));
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             await dispatch(
//               updateUserGeneralSettingsuccess(
//                 response.data.responseResult.responseMessage,
//                 response.data.responseResult
//               )
//             );
//             await dispatch(getUserSetting(JSON.parse(currentUserID)));
//           } else {
//             dispatch(updateUserGeneralSettingfail());
//           }
//         } else {
//           dispatch(updateUserGeneralSettingfail(response.data.responseMessage));
//         }
//       })
//       .catch((response) => {
//         dispatch(updateUserGeneralSettingfail(response.data.responseMessage));
//         console.log("catch response", response);
//       });
//   };
// };
const updateUserSettinginit = () => {
  return {
    type: actions.UDPATEUSERSETTING_INIT,
  };
};
const updateUserSettingSuccess = (response, message) => {
  return {
    type: actions.UDPATEUSERSETTING_SUCCESS,
    response: response,
    message: message,
  };
};
const updateUserSettingFail = (message) => {
  return {
    type: actions.UDPATEUSERSETTING_FAIL,
    message: message,
  };
};
const updateUserSettingFunc = (userGeneralSettingData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserSettings: {
      FK_TZID: 0,
      MaximumMeetingDuration: userGeneralSettingData.MaximumMeetingDuration,
      SynchronizeDocuments: userGeneralSettingData.SynchronizeDocuments,
      DisableMeetingScheduling: userGeneralSettingData.DisableMeetingScheduling,
      EmailOnNewMeeting: userGeneralSettingData.EmailOnNewMeeting,
      EmailOnEditMeeting: userGeneralSettingData.EmailOnEditMeeting,
      PushNotificationOnNewMeeting:
        userGeneralSettingData.PushNotificationOnNewMeeting,
      PushNotificationOnEditMeeting:
        userGeneralSettingData.PushNotificationOnEditMeeting,
      ShowNotificationOnParticipantJoining:
        userGeneralSettingData.ShowNotificationonparticipantJoining,
      DormantInactiveUsersForDays:
        userGeneralSettingData.DormatInactiveUsersforDays,
      PushNotificationonCancelledMeeting: userGeneralSettingData.PushNotificationOnCancelledMeeting,
      FK_OrganizationID: JSON.parse(OrganizationID),
      FK_CCID: 0,
      EmailOnCancelledMeeting: userGeneralSettingData.EmailOnCancelledMeeting,
      FK_UID: JSON.parse(currentUserID),
      Is2FAEnabled: userGeneralSettingData.Is2FAVerification
    },
  };
  return (dispatch) => {
    dispatch(updateUserSettinginit());
    let form = new FormData();
    form.append("RequestMethod", updateOrganizationUserSetting.RequestMethod);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateOrganizationUserSettings_01".toLowerCase()
                )
            ) {
              dispatch(
                updateUserSettingSuccess(
                  response.data.responseResult,
                  t("User-configurations-updated-successfully")
                )
              );
              dispatch(getUserSetting(JSON.parse(currentUserID), t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateOrganizationUserSettings_02".toLowerCase()
                )
            ) {
              dispatch(updateUserSettingFail(t("User-configurations-updates-not-successfully")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateOrganizationUserSettings_03".toLowerCase()
                )
            ) {
              dispatch(updateUserSettingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateUserSettingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateUserSettingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateUserSettingFail(t("Something-went-wrong")));
      });
  };
};
const updateUserMessageCleare = () => {
  return {
    type: actions.UDPATEUSERSETTING_MESSAGE_CLEARE,
  };
};
export { updateUserSettingFunc, updateUserMessageCleare };
