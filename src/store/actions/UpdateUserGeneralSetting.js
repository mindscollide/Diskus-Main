import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import {
  updateUserGeneralSetting,
  updateOrganizationUserSetting,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";
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
const updateUserSettingFunc = (navigate, userGeneralSettingData, t) => {
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
      PushNotificationonCancelledORDeleteMeeting:
        userGeneralSettingData.PushNotificationonCancelledORDeleteMeeting,
      FK_OrganizationID: JSON.parse(OrganizationID),
      FK_CCID: 0,
      EmailOnCancelledORDeleteMeeting:
        userGeneralSettingData.EmailOnCancelledorDeleteMeeting,
      FK_UID: JSON.parse(currentUserID),
      Is2FAEnabled: userGeneralSettingData.Is2FAVerification,

      DiskusEventColor: userGeneralSettingData.DiskusEventColor,
      EmailWhenAddedToCommittee:
        userGeneralSettingData.EmailWhenAddedToCommittee,
      EmailWhenAddedToGroup: userGeneralSettingData.EmailWhenAddedToGroup,
      EmailWhenCommitteeIsDissolvedorArchived:
        userGeneralSettingData.EmailWhenCommitteeIsDissolvedorArchived,
      EmailWhenCommitteeIsInActive:
        userGeneralSettingData.EmailWhenCommitteeIsInActive,
      EmailWhenGroupIsClosedorArchived:
        userGeneralSettingData.EmailWhenGroupIsClosedorArchived,
      EmailWhenGroupIsInActive: userGeneralSettingData.EmailWhenGroupIsInActive,
      EmailWhenNewResolutionIsCirculated:
        userGeneralSettingData.EmailWhenNewResolutionIsCirculated,
      EmailWhenRemovedFromCommittee:
        userGeneralSettingData.EmailWhenRemovedFromCommittee,
      EmailWhenRemovedFromGroup:
        userGeneralSettingData.EmailWhenRemovedFromGroup,
      EmailWhenResolutionIsCancelledAfterCirculation:
        userGeneralSettingData.EmailWhenResolutionIsCancelledAfterCirculation,
      EmailWhenResolutionIsClosed:
        userGeneralSettingData.EmailWhenResolutionIsClosed,
      PushNotificationWhenAddedToCommittee:
        userGeneralSettingData.PushNotificationWhenAddedToCommittee,
      PushNotificationWhenAddedToGroup:
        userGeneralSettingData.PushNotificationWhenAddedToGroup,
      PushNotificationWhenCommitteeIsDissolvedorArchived:
        userGeneralSettingData.PushNotificationWhenCommitteeIsDissolvedorArchived,
      PushNotificationWhenCommitteeIsInActive:
        userGeneralSettingData.PushNotificationWhenCommitteeIsInActive,
      PushNotificationWhenGroupIsClosedORArchived:
        userGeneralSettingData.PushNotificationWhenGroupIsClosedORArchived,
      PushNotificationWhenGroupisSetInactive:
        userGeneralSettingData.PushNotificationWhenGroupisSetInactive,
      PushNotificationWhenNewResolutionIsCirculated:
        userGeneralSettingData.PushNotificationWhenNewResolutionIsCirculated,
      PushNotificationWhenRemoveFromGroup:
        userGeneralSettingData.PushNotificationWhenRemoveFromGroup,
      PushNotificationWhenRemovedFromCommittee:
        userGeneralSettingData.PushNotificationWhenRemovedFromCommittee,
      PushNotificationWhenResolutionIsClosed:
        userGeneralSettingData.PushNotificationWhenResolutionIsClosed,
      PushNotificationWhenWhenResolutionIsCancelledAfterCirculation:
        userGeneralSettingData.PushNotificationWhenWhenResolutionIsCancelledAfterCirculation,
      UserAllowGoogleCalendarSynch:
        userGeneralSettingData.UserAllowGoogleCalendarSynch,
      UserAllowMicrosoftCalendarSynch:
        userGeneralSettingData.UserAllowMicrosoftCalendarSynch,
      GoogleEventColor: userGeneralSettingData.GoogleEventColor,
      OfficeEventColor: userGeneralSettingData.OfficeEventColor,
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateUserSettingFunc(navigate, userGeneralSettingData, t));
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
              dispatch(getUserSetting(navigate, t));
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
const updateUserMessageCleare = () => {
  return {
    type: actions.UDPATEUSERSETTING_MESSAGE_CLEARE,
  };
};
export { updateUserSettingFunc, updateUserMessageCleare };
