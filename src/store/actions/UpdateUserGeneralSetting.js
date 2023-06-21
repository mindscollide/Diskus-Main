import * as actions from "../action_types";
import { settingApi, getCalender } from "../../commen/apis/Api_ends_points";
import {
  updateUserGeneralSetting,
  updateOrganizationUserSetting,
  googleValidToken,
  revoketoken,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";
import { async } from "q";

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

const getGoogleValidToken = (navigate, data, userGeneralSettingData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(currentUserID),
    OrganizationID: parseInt(OrganizationID),
    ValidCode: data,
  };
  let Data2 = {
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
    EmailWhenAddedToCommittee: userGeneralSettingData.EmailWhenAddedToCommittee,
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
    EmailWhenRemovedFromGroup: userGeneralSettingData.EmailWhenRemovedFromGroup,
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
    UserAllowGoogleCalendarSynch: false,
    UserAllowMicrosoftCalendarSynch:
      userGeneralSettingData.UserAllowMicrosoftCalendarSynch,
    GoogleEventColor: userGeneralSettingData.GoogleEventColor,
    OfficeEventColor: userGeneralSettingData.OfficeEventColor,
  };
  return async (dispatch) => {
    dispatch(googleValidTokeninit());
    let form = new FormData();
    form.append("RequestMethod", googleValidToken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: getCalender,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getGoogleValidToken(navigate, data, userGeneralSettingData, t)
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
                updateUserSettingFunc(navigate, userGeneralSettingData, t)
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
                updateUserSettingFunc(navigate, userGeneralSettingData, t)
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
                  t("Token-updated-but-failed-to-save-calender")
                )
              );
              dispatch(
                updateUserSettingFunc(navigate, userGeneralSettingData, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_04".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("No-email-exist")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
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
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_06".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("Code-is-invalid")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetGoogleValidToken_07".toLowerCase()
                )
            ) {
              dispatch(googleValidTokenFail(t("Something-went-wrong")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            }
          } else {
            dispatch(googleValidTokenFail(t("Something-went-wrong")));
            dispatch(updateUserSettingFunc(navigate, Data2, t));
          }
        } else {
          dispatch(googleValidTokenFail(t("Something-went-wrong")));
          dispatch(updateUserSettingFunc(navigate, Data2, t));
        }
      })
      .catch((response) => {
        dispatch(googleValidTokenFail(t("Something-went-wrong")));
        dispatch(updateUserSettingFunc(navigate, Data2, t));
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

const revokeToken = (navigate, userGeneralSettingData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(currentUserID),
    OrganizationID: parseInt(OrganizationID),
  };
  let Data2 = {
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
    EmailWhenAddedToCommittee: userGeneralSettingData.EmailWhenAddedToCommittee,
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
    EmailWhenRemovedFromGroup: userGeneralSettingData.EmailWhenRemovedFromGroup,
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
    UserAllowGoogleCalendarSynch: true,
    UserAllowMicrosoftCalendarSynch:
      userGeneralSettingData.UserAllowMicrosoftCalendarSynch,
    GoogleEventColor: userGeneralSettingData.GoogleEventColor,
    OfficeEventColor: userGeneralSettingData.OfficeEventColor,
  };
  return async (dispatch) => {
    dispatch(revokeTokeninit());
    let form = new FormData();
    form.append("RequestMethod", revoketoken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: getCalender,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(revokeToken(navigate, userGeneralSettingData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_01".toLowerCase()
                )
            ) {
              console.log("organizationStatesorganizationStates1212",userGeneralSettingData)

              dispatch(revokeTokenSuccess(t("Successful")));
      console.log("organizationStatesorganizationStates1212",userGeneralSettingData)
      dispatch(
                
                updateUserSettingFunc(navigate, userGeneralSettingData, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_02".toLowerCase()
                )
            ) {
              dispatch(revokeTokenFail(t("UnSuccessful")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_RevokeToken_03".toLowerCase()
                )
            ) {
              dispatch(revokeTokenFail(t("Something-went-wrong")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            } else {
              dispatch(revokeTokenFail(t("Something-went-wrong")));
              dispatch(updateUserSettingFunc(navigate, Data2, t));
            }
          } else {
            dispatch(revokeTokenFail(t("Something-went-wrong")));
            dispatch(updateUserSettingFunc(navigate, Data2, t));
          }
        } else {
          dispatch(revokeTokenFail(t("Something-went-wrong")));
          dispatch(updateUserSettingFunc(navigate, Data2, t));
        }
      })
      .catch((response) => {
        dispatch(revokeTokenFail(t("Something-went-wrong")));
        dispatch(updateUserSettingFunc(navigate, Data2, t));
      });
  };
};

const updateUserMessageCleare = () => {
  return {
    type: actions.UDPATEUSERSETTING_MESSAGE_CLEARE,
  };
};
export {
  updateUserSettingFunc,
  updateUserMessageCleare,
  getGoogleValidToken,
  revokeToken,
};
