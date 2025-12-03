import * as actions from "../action_types";
import { settingApi, getCalender } from "../../commen/apis/Api_ends_points";
import {
  updateOrganizationUserSetting,
  googleValidToken,
  revoketoken,
  validateMicrosoftToken,
  revokeMicrosoftToken,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import { getUserSetting } from "../actions/GetUserSetting";
import axiosInstance from "../../commen/functions/axiosInstance";

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

const updateUserSettingFunc = (
  navigate,
  userOptionsSettings,
  t,
  flag,
  AllowMicrosoftCalenderSyncCall
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data2 = {
    UserSettings: {
      FK_TZID: 0,
      MaximumMeetingDuration: userOptionsSettings.MaximumMeetingDuration,
      SynchronizeDocuments: userOptionsSettings.SynchronizeDocuments,
      DisableMeetingScheduling: userOptionsSettings.DisableMeetingScheduling,
      EmailOnNewMeeting: userOptionsSettings.EmailOnNewMeeting,
      EmailOnEditMeeting: userOptionsSettings.EmailEditMeeting,
      PushNotificationOnNewMeeting:
        userOptionsSettings.PushNotificationonNewMeeting,
      PushNotificationOnEditMeeting:
        userOptionsSettings.PushNotificationEditMeeting,
      ShowNotificationOnParticipantJoining:
        userOptionsSettings.ShowNotificationOnParticipantJoining,
      PushNotificationonCancelledORDeleteMeeting:
        userOptionsSettings.PushNotificationCancelledOrDeleteMeeting,
      FK_OrganizationID: JSON.parse(OrganizationID),
      FK_CCID: 0,
      EmailOnCancelledORDeleteMeeting:
        userOptionsSettings.EmailCancelOrDeleteMeeting,
      FK_UID: JSON.parse(currentUserID),
      Is2FAEnabled: userOptionsSettings.Is2FAEnabled,
      DiskusEventColor: userOptionsSettings.DiskusCalenderColor,
      EmailWhenAddedToCommittee: userOptionsSettings.EmailWhenAddedToCommittee,
      EmailWhenAddedToGroup: userOptionsSettings.EmailWhenAddedToGroup,
      EmailWhenCommitteeIsDissolvedorArchived:
        userOptionsSettings.EmailWhenCommitteeIsDissolvedOrArchived,
      EmailWhenCommitteeIsInActive:
        userOptionsSettings.EmailWhenCommitteeIsSetInactive,
      EmailWhenGroupIsClosedorArchived:
        userOptionsSettings.EmailWhenGroupIsDissolvedOrArchived,
      EmailWhenGroupIsInActive: userOptionsSettings.EmailWhenGroupisSetInactive,
      EmailWhenNewResolutionIsCirculated:
        userOptionsSettings.EmailWhenResolutionIsCirculated,
      EmailWhenRemovedFromCommittee:
        userOptionsSettings.EmailWhenRemovedFromCommittee,
      EmailWhenRemovedFromGroup: userOptionsSettings.EmailWhenRemovedFromGroup,
      EmailWhenResolutionIsCancelledAfterCirculation:
        userOptionsSettings.EmailWhenNewResolutionIsCancelledAfterCirculation,
      EmailWhenResolutionIsClosed:
        userOptionsSettings.EmailWhenResolutionIsClosed,
      PushNotificationWhenAddedToCommittee:
        userOptionsSettings.PushNotificationWhenAddedToCommittee,
      PushNotificationWhenAddedToGroup:
        userOptionsSettings.PushNotificationWhenAddedToGroup,
      PushNotificationWhenCommitteeIsDissolvedorArchived:
        userOptionsSettings.PushNotificationWhenCommitteeIsDissolvedOrArchived,
      PushNotificationWhenCommitteeIsInActive:
        userOptionsSettings.PushNotificationWhenCommitteeIsInActive,
      PushNotificationWhenGroupIsClosedORArchived:
        userOptionsSettings.PushNotificationWhenGroupIsDissolvedOrArchived,
      PushNotificationWhenGroupisSetInactive:
        userOptionsSettings.PushNotificationWhenGroupIsInActive,
      PushNotificationWhenNewResolutionIsCirculated:
        userOptionsSettings.PushNotificationWhenNewResolutionIsCirculated,
      PushNotificationWhenRemoveFromGroup:
        userOptionsSettings.PushNotificationWhenRemovedFromGroup,
      PushNotificationWhenRemovedFromCommittee:
        userOptionsSettings.PushNotificationWhenRemovedFromCommittee,
      PushNotificationWhenResolutionIsClosed:
        userOptionsSettings.PushNotificationWhenResolutionISClosed,
      PushNotificationWhenWhenResolutionIsCancelledAfterCirculation:
        userOptionsSettings.PushNotificationWhenNewResolutionIsCancelledAfterCirculated,
      UserAllowGoogleCalendarSynch:
        flag === undefined || flag === null ? false : flag,
      UserAllowMicrosoftCalendarSynch: AllowMicrosoftCalenderSyncCall,
      GoogleEventColor: userOptionsSettings.GoogleCalenderColor,
      OfficeEventColor: userOptionsSettings.MicrosoftCalenderColor,
      EmailWhenNewPollIsPublished:
        userOptionsSettings.EmailWhenNewPollIsPublished,
      EmailWhenPollDueDateIsPassed:
        userOptionsSettings.EmailWhenPollDueDateIsPassed,
      EmailWhenPublishedPollIsDeleted:
        userOptionsSettings.EmailWhenPublishedPollIsDeleted,
      EmailWhenPublishedPollIsUpdated:
        userOptionsSettings.EmailWhenPublishedPollIsUpdated,
      PushNotificationWhenNewPollIsPublished:
        userOptionsSettings.PushNotificationWhenNewPollIsPublished,
      PushNotificationWhenPollDueDateIsPassed:
        userOptionsSettings.PushNotificationWhenPollDueDateIsPassed,
      PushNotificationWhenPublishedPollIsDeleted:
        userOptionsSettings.PushNotificationWhenPublishedPollIsDeleted,
      PushNotificationWhenPublishedPollIsUpdated:
        userOptionsSettings.PushNotificationWhenPublishedPollIsUpdated,
      EmailWhenGroupIsActive: userOptionsSettings.EmailWhenGroupIsActive,
      PushNotificationwhenGroupissetActive:
        userOptionsSettings.PushNotificationwhenGroupissetActive,
      EmailWhenCommitteeIsActive:
        userOptionsSettings.EmailWhenCommitteeIsActive,
      PushNotificationwhenCommitteeissetActive:
        userOptionsSettings.PushNotificationwhenCommitteeissetActive,
      PushNotificationWhenNewTODOAssigned:
        userOptionsSettings.PushNotificationWhenNewTODOAssigned,
      PushNotificationWhenNewTODODeleted:
        userOptionsSettings.PushNotificationWhenNewTODODeleted,
      PushNotificationWhenNewTODOEdited:
        userOptionsSettings.PushNotificationWhenNewTODOEdited,
      PushNotificationWhenNewCommentAdded:
        userOptionsSettings.PushNotificationWhenNewCommentAdded,
      PushNotificationWhenCommentDeleted:
        userOptionsSettings.PushNotificationWhenCommentDeleted,
      EmailWhenCommentDeleted: userOptionsSettings.EmailWhenCommentDeleted,
      EmailWhenNewCommentAdded: userOptionsSettings.EmailWhenNewCommentAdded,
      EmailWhenNewTODOAssigned: userOptionsSettings.EmailWhenNewTODOAssigned,
      EmailWhenNewTODODeleted: userOptionsSettings.EmailWhenNewTODODeleted,
      EmailWhenNewTODOEdited: userOptionsSettings.EmailWhenNewTODOEdited,
    },
  };
  return (dispatch) => {
    dispatch(updateUserSettinginit());
    let form = new FormData();
    form.append("RequestMethod", updateOrganizationUserSetting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data2));
    axiosInstance
    .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            updateUserSettingFunc(
              navigate,
              userOptionsSettings,
              t,
              flag,
              AllowMicrosoftCalenderSyncCall
            )
          );
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
              dispatch(getUserSetting(navigate, t, false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UpdateOrganizationUserSettings_02".toLowerCase()
                )
            ) {
              dispatch(
                updateUserSettingFail(
                  t("User-configurations-updates-not-successfully")
                )
              );
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

const googleValidTokeninit = () => {
  return {
    type: actions.GOOGLEVALIDTOKEN_INIT,
  };
};

const googleValidTokenSuccess = (message) => {
  return {
    type: actions.GOOGLEVALIDTOKEN_SUCCESS,
    message: message,
  };
};
const googleValidTokenFail = (message) => {
  return {
    type: actions.GOOGLEVALIDTOKEN_FAIL,
    message: message,
  };
};

const getGoogleValidToken = (
  navigate,
  data,
  userOptionsSettings,
  t,
  AllowMicrosoftCalenderSyncCall
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(currentUserID),
    OrganizationID: parseInt(OrganizationID),
    ValidCode: data,
  };

  return async (dispatch) => {
    dispatch(googleValidTokeninit());
    let form = new FormData();
    form.append("RequestMethod", googleValidToken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await       axiosInstance.post(getCalender,form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getGoogleValidToken(
              navigate,
              data,
              userOptionsSettings,
              t,
              AllowMicrosoftCalenderSyncCall
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_01".toLowerCase()
                )
            ) {
              dispatch(
                googleValidTokenSuccess(
                  t("Token-updated-and-calender-list-saved-successful")
                )
              );
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  true,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_02".toLowerCase()
                )
            ) {
              dispatch(
                googleValidTokenSuccess(
                  t("Token-updated-but-failed-to-save-calender")
                )
              );
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_03".toLowerCase()
                )
            ) {
              dispatch(
                googleValidTokenSuccess(
                  t("Token-updated-but-no-event-found-in-the-calendar")
                )
              );
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  true,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_04".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("No-email-exist")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_05".toLowerCase()
                )
            ) {
              dispatch(
                googleValidTokenFail(t("Failed-to-insert-configuration"))
              );
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_06".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("Code-is-invalid")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_07".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("Something-went-wrong")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            }
          } else {
            dispatch(googleValidTokenFail(t("Something-went-wrong")));
            dispatch(
              updateUserSettingFunc(
                navigate,
                userOptionsSettings,
                t,
                false,
                AllowMicrosoftCalenderSyncCall
              )
            );
          }
        } else {
          dispatch(googleValidTokenFail(t("Something-went-wrong")));
          dispatch(
            updateUserSettingFunc(
              navigate,
              userOptionsSettings,
              t,
              false,
              AllowMicrosoftCalenderSyncCall
            )
          );
        }
      })
      .catch((response) => {
        dispatch(googleValidTokenFail(t("Something-went-wrong")));
        dispatch(
          updateUserSettingFunc(
            navigate,
            userOptionsSettings,
            t,
            false,
            AllowMicrosoftCalenderSyncCall
          )
        );
      });
  };
};

const revokeTokeninit = () => {
  return {
    type: actions.REVOKETOKEN_INIT,
  };
};

const revokeTokenSuccess = (message) => {
  return {
    type: actions.REVOKETOKEN_SUCCESS,
    message: message,
  };
};
const revokeTokenFail = (message) => {
  return {
    type: actions.REVOKETOKEN_FAIL,
    message: message,
  };
};

const revokeToken = (
  navigate,
  userOptionsSettings,
  t,
  AllowMicrosoftCalenderSyncCall
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(currentUserID),
    OrganizationID: parseInt(OrganizationID),
  };
  return async (dispatch) => {
    dispatch(revokeTokeninit());
    let form = new FormData();
    form.append("RequestMethod", revoketoken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await       axiosInstance.post(getCalender,form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            revokeToken(
              navigate,
              userOptionsSettings,
              t,
              AllowMicrosoftCalenderSyncCall
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_01".toLowerCase()
                )
            ) {
              dispatch(revokeTokenSuccess(t("Successful")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  false,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_02".toLowerCase()
                )
            ) {
              dispatch(revokeTokenFail(t("UnSuccessful")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  true,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_03".toLowerCase()
                )
            ) {
              dispatch(revokeTokenFail(t("Something-went-wrong")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  true,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            } else {
              dispatch(revokeTokenFail(t("Something-went-wrong")));
              dispatch(
                updateUserSettingFunc(
                  navigate,
                  userOptionsSettings,
                  t,
                  true,
                  AllowMicrosoftCalenderSyncCall
                )
              );
            }
          } else {
            dispatch(revokeTokenFail(t("Something-went-wrong")));
            dispatch(
              updateUserSettingFunc(
                navigate,
                userOptionsSettings,
                t,
                true,
                AllowMicrosoftCalenderSyncCall
              )
            );
          }
        } else {
          dispatch(revokeTokenFail(t("Something-went-wrong")));
          dispatch(
            updateUserSettingFunc(
              navigate,
              userOptionsSettings,
              t,
              true,
              AllowMicrosoftCalenderSyncCall
            )
          );
        }
      })
      .catch((response) => {
        dispatch(revokeTokenFail(t("Something-went-wrong")));
        dispatch(
          updateUserSettingFunc(
            navigate,
            userOptionsSettings,
            t,
            true,
            AllowMicrosoftCalenderSyncCall
          )
        );
      });
  };
};

const updateUserMessageCleare = () => {
  return {
    type: actions.UDPATEUSERSETTING_MESSAGE_CLEARE,
  };
};

const MicrosoftValidTokeninit = () => {
  return {
    type: actions.MICROSOFT_VALIDATE_TOKEN_INIT,
  };
};

const MicrosoftValidTokenSuccess = (message) => {
  return {
    type: actions.MICROSOFT_VALIDATE_TOKEN_SUCCESS,
    message: message,
  };
};

const MicrosoftValidTokenFailed = (message) => {
  return {
    type: actions.MICROSOFT_VALIDATE_TOKEN_FAIL,
    message: message,
  };
};

// const getMicrosoftValidToken = (
//   navigate,
//   authMicrosoftAccessCode,
//   userOptionsSettings,
//   AllowMicrosoftCalenderSyncCall,
//   t
// ) => {
//   let token = JSON.parse(localStorage.getItem("token"));
//   let currentUserID = localStorage.getItem("userID");
//   let OrganizationID = localStorage.getItem("organizationID");
//   let Data = {
//     UserID: parseInt(currentUserID),
//     OrganizationID: parseInt(OrganizationID),
//     validCode: authMicrosoftAccessCode,
//   };

//   return async (dispatch) => {
//     dispatch(MicrosoftValidTokeninit());
//     let form = new FormData();
//     form.append("RequestMethod", validateMicrosoftToken.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     await axios({
//       method: "post",
//       url: getCalender,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(
//             getMicrosoftValidToken(
//               navigate,
//               authMicrosoftAccessCode,
//               userOptionsSettings,
//               AllowMicrosoftCalenderSyncCall,
//               t
//             )
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_01".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 MicrosoftValidTokenSuccess(
//                   t("Token-updated-and-calender-list-saved-successful")
//                 )
//               );
//               return  true
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_02".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 MicrosoftValidTokenSuccess(
//                   t("Token-updated-but-failed-to-save-calender")
//                 )
//               );
//               return  true
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_03".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 MicrosoftValidTokenSuccess(
//                   t("Token-updated-but-no-event-found-in-the-calendar")
//                 )
//               );
//               return  true
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_04".toLowerCase()
//                 )
//             ) {
//               dispatch(MicrosoftValidTokenFailed(t("No-email-exist")));
//               return  false
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_05".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 MicrosoftValidTokenFailed(t("Failed-to-insert-configuration"))
//               );
//               return  false
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_06".toLowerCase()
//                 )
//             ) {
//               dispatch(MicrosoftValidTokenFailed(t("Code-is-invalid")));
//               return  false
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Calender_CalenderServiceManager_GetMicrosoftValidToken_07".toLowerCase()
//                 )
//             ) {
//               dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
//               return  false
//             }
//           } else {
//             dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
//             return  false
//           }
//         } else {
//           dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
//           return  false
//         }
//       })
//       .catch((response) => {
//         dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
//         return  false
//       });
//   };
// };
const getMicrosoftValidToken = (
  navigate,
  authMicrosoftAccessCode,
  userOptionsSettings,
  AllowMicrosoftCalenderSyncCall,
  t
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(currentUserID),
    OrganizationID: parseInt(OrganizationID),
    validCode: authMicrosoftAccessCode,
  };

  return async (dispatch) => {
    dispatch(MicrosoftValidTokeninit());
    let form = new FormData();
    form.append("RequestMethod", validateMicrosoftToken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    try {
      const response = await axiosInstance.post(getCalender, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(
          getMicrosoftValidToken(
            navigate,
            authMicrosoftAccessCode,
            userOptionsSettings,
            AllowMicrosoftCalenderSyncCall,
            t
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_01".toLowerCase()
              )
          ) {
            dispatch(
              MicrosoftValidTokenSuccess(
                t("Token-updated-and-calender-list-saved-successful")
              )
            );
            return true;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_02".toLowerCase()
              )
          ) {
            dispatch(
              MicrosoftValidTokenSuccess(
                t("Token-updated-but-failed-to-save-calender")
              )
            );
            return true;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_03".toLowerCase()
              )
          ) {
            dispatch(
              MicrosoftValidTokenSuccess(
                t("Token-updated-but-no-event-found-in-the-calendar")
              )
            );
            return true;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_04".toLowerCase()
              )
          ) {
            dispatch(MicrosoftValidTokenFailed(t("No-email-exist")));
            return false;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_05".toLowerCase()
              )
          ) {
            dispatch(
              MicrosoftValidTokenFailed(t("Failed-to-insert-configuration"))
            );
            return false;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_06".toLowerCase()
              )
          ) {
            dispatch(MicrosoftValidTokenFailed(t("Code-is-invalid")));
            return false;
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Calender_CalenderServiceManager_GetMicrosoftValidToken_07".toLowerCase()
              )
          ) {
            dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
            return false;
          }
        } else {
          dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
          return false;
        }
      } else {
        dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
        return false;
      }
    } catch (error) {
      dispatch(MicrosoftValidTokenFailed(t("Something-went-wrong")));
      return false;
    }
  };
};

const revokeMicrosoftToken_Init = () => {
  return {
    type: actions.REVOKE_TOKEN_MICROSOFT_INIT,
  };
};

const revokeMicrosoftToken_success = (response, message) => {
  return {
    type: actions.REVOKE_TOKEN_MICROSOFT_SUCCESS,
    response: response,
    message: message,
  };
};

const revokeMicrosoftToken_fail = (message) => {
  return {
    type: actions.REVOKE_TOKEN_MICROSOFT_FAIL,
    message: message,
  };
};

const revokeMicrosoftTokenApi = (
  navigate,
  data,
  t,
  flag,
  AllowMicrosoftCalenderSyncCall
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(revokeMicrosoftToken_Init());
    let form = new FormData();
    form.append("RequestMethod", revokeMicrosoftToken.RequestMethod);
    await       axiosInstance.post(getCalender,form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            revokeMicrosoftTokenApi(
              navigate,
              data,
              t,
              flag,
              AllowMicrosoftCalenderSyncCall
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeMicrosoftToken_01".toLowerCase()
                )
            ) {
              dispatch(revokeMicrosoftToken_success(""));
              updateUserSettingFunc(
                navigate,
                data,
                t,
                flag,
                AllowMicrosoftCalenderSyncCall
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeMicrosoftToken_01".toLowerCase()
                )
            ) {
              dispatch(revokeMicrosoftToken_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeMicrosoftToken_01".toLowerCase()
                )
            ) {
              dispatch(revokeMicrosoftToken_fail(""));
            } else {
              dispatch(revokeMicrosoftToken_fail(""));
            }
          } else {
            dispatch(revokeMicrosoftToken_fail(""));
          }
        } else {
          dispatch(revokeMicrosoftToken_fail(""));
        }
      })
      .catch(() => {
        dispatch(revokeMicrosoftToken_fail(""));
      })
      .finally(() => {
        dispatch(revokeMicrosoftToken_fail(""));
      });
  };
};
export {
  updateUserSettingFunc,
  updateUserMessageCleare,
  getGoogleValidToken,
  revokeToken,
  getMicrosoftValidToken,
  revokeMicrosoftTokenApi,
};
