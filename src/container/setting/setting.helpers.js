/**
 * Shared helpers for the Settings module, extracted to remove the duplicated
 * userProfileData -> settings-state mapping between initial load and reset.
 */

// Maps the settingReducer's UserProfileData (Redux) into the shape the
// org-level Settings page (Setting.js) keeps in local state.
export const mapUserProfileToOrganizationSettings = (userProfileData) => ({
  EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
  EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
  PushNotificationOnNewMeeting: userProfileData.pushNotificationOnNewMeeting,
  PushNotificationOnEditMeeting: userProfileData.pushNotificationOnEditMeeting,
  ShowNotificationonparticipantJoining:
    userProfileData.showNotificationOnParticipantJoining,
  Is2FAVerification: userProfileData.iS2FAEnabled,
  EmailOnCancelledorDeleteMeeting:
    userProfileData.emailOnCancelledORDeleteMeeting,
  PushNotificationonCancelledORDeleteMeeting:
    userProfileData.pushNotificationonCancelledORDeleteMeeting,
  //New Data inserted
  DiskusEventColor: userProfileData.diskusEventColor,
  EmailWhenAddedToCommittee: userProfileData.emailWhenAddedToCommittee,
  EmailWhenAddedToGroup: userProfileData.emailWhenAddedToGroup,
  EmailWhenCommitteeIsDissolvedorArchived:
    userProfileData.emailWhenCommitteeIsDissolvedorArchived,
  EmailWhenCommitteeIsInActive: userProfileData.emailWhenCommitteeIsInActive,
  EmailWhenGroupIsClosedorArchived:
    userProfileData.emailWhenGroupIsClosedorArchived,
  EmailWhenGroupIsInActive: userProfileData.emailWhenGroupIsInActive,
  EmailWhenNewResolutionIsCirculated:
    userProfileData.emailWhenNewResolutionIsCirculated,
  EmailWhenRemovedFromCommittee: userProfileData.emailWhenRemovedFromCommittee,
  EmailWhenRemovedFromGroup: userProfileData.emailWhenRemovedFromGroup,
  EmailWhenResolutionIsCancelledAfterCirculation:
    userProfileData.emailWhenResolutionIsCancelledAfterCirculation,
  EmailWhenResolutionIsClosed: userProfileData.emailWhenResolutionIsClosed,
  PushNotificationWhenAddedToCommittee:
    userProfileData.pushNotificationWhenAddedToCommittee,
  PushNotificationWhenAddedToGroup:
    userProfileData.pushNotificationWhenAddedToGroup,
  PushNotificationWhenCommitteeIsDissolvedorArchived:
    userProfileData.pushNotificationWhenCommitteeIsDissolvedorArchived,
  PushNotificationWhenCommitteeIsInActive:
    userProfileData.pushNotificationWhenCommitteeIsInActive,
  PushNotificationWhenGroupIsClosedORArchived:
    userProfileData.pushNotificationWhenGroupIsClosedORArchived,
  PushNotificationWhenGroupisSetInactive:
    userProfileData.pushNotificationWhenGroupisSetInactive,
  PushNotificationWhenNewResolutionIsCirculated:
    userProfileData.pushNotificationWhenNewResolutionIsCirculated,
  PushNotificationWhenRemoveFromGroup:
    userProfileData.pushNotificationWhenRemoveFromGroup,
  PushNotificationWhenRemovedFromCommittee:
    userProfileData.pushNotificationWhenRemovedFromCommittee,
  PushNotificationWhenResolutionIsClosed:
    userProfileData.pushNotificationWhenResolutionIsClosed,
  PushNotificationWhenWhenResolutionIsCancelledAfterCirculation:
    userProfileData.pushNotificationWhenWhenResolutionIsCancelledAfterCirculation,
  UserAllowGoogleCalendarSynch: userProfileData.userAllowGoogleCalendarSynch,
  UserAllowMicrosoftCalendarSynch:
    userProfileData.userAllowMicrosoftCalendarSynch,
  UserName: userProfileData.userName,
  OfficeEventColor: userProfileData.officeEventColor,
  GoogleEventColor: userProfileData.googleEventColor,
});
