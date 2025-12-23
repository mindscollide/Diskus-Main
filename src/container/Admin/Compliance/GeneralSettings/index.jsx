import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./generalSetting.module.css";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
// import ResolutionIcon from "../../../../assets/images/new_ResolutionIcon2.svg";
import exclamationIcon from "../../../../assets/images/Vector.png";
import calenderIcon from "../../../../assets/images/Group 1258.png";
import workingDaysIcon from "../../../../assets/images/Vector Suitcase.png";

import FiscalYear from "./FiscalYear";
import WorkingDays from "./WorkingDays";
import DueDateAlert from "./DueDateAlert";
import line from "../../../../assets/images/Line 27.svg";
import { useDispatch } from "react-redux";
import {
  getOrganizationLevelSetting,
  updateOrganizationLevelSetting,
} from "../../../../store/actions/OrganizationSettings";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GeneralSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [viewState, setViewState] = useState(1);
  const [userOrganizationSetting, setOrganizationSetting] = useState({
    Is2FAEnabled: false,
    EmailOnNewMeeting: false,
    EmailEditMeeting: false,
    EmailCancelOrDeleteMeeting: false,
    PushNotificationonNewMeeting: false,
    PushNotificationEditMeeting: false,
    PushNotificationCancelledOrDeleteMeeting: false,
    ShowNotificationOnParticipantJoining: false,
    AllowCalenderSync: false,
    AllowMicrosoftCalenderSync: false,
    EmailWhenAddedToCommittee: false,
    EmailWhenRemovedFromCommittee: false,
    EmailWhenCommitteeIsDissolvedOrArchived: false,
    EmailWhenCommitteeIsInactive: false,
    EmailWhenCommitteeIsactive: false,
    PushNotificationWhenAddedToCommittee: false,
    PushNotificationWhenRemovedFromCommittee: false,
    PushNotificationWhenCommitteeIsDissolvedOrArchived: false,
    PushNotificationWhenCommitteeIsInActive: false,
    PushNotificationWhenCommitteeSetIsInActive: false,
    EmailWhenAddedToGroup: false,
    EmailWhenRemovedFromGroup: false,
    EmailWhenGroupIsDissolvedOrArchived: false,
    EmailWhenGroupisInactive: false,
    EmailWhenGroupisactive: false,
    PushNotificationWhenAddedToGroup: false,
    PushNotificationWhenRemovedFromGroup: false,
    PushNotificationWhenGroupIsDissolvedOrArchived: false,
    PushNotificationWhenGroupIsInActive: false,
    PushNotificationWhenGroupSetIsInActive: false,
    EmailWhenResolutionIsCirculated: false,
    EmailWhenNewResolutionIsCancelledAfterCirculation: false,
    EmailWhenResolutionIsClosed: false,
    PushNotificationWhenNewResolutionIsCirculated: false,
    PushNotificationWhenNewResolutionIsCancelledAfterCirculated: false,
    PushNotificationWhenResolutionISClosed: false,
    EmailWhenNewPollIsPublished: false,
    EmailWhenPollDueDateIsPassed: false,
    EmailWhenPublishedPollIsDeleted: false,
    EmailWhenPublishedPollIsUpdated: false,
    PushNotificationWhenNewPollIsPublished: false,
    PushNotificationWhenPollDueDateIsPassed: false,
    PushNotificationWhenPublishedPollIsDeleted: false,
    PushNotificationWhenPublishedPollIsUpdated: false,
    DormatInactiveUsersforDays: 0,
    MaximumMeetingDuration: 0,
    CalenderMonthsSpan: 0,
    TimeZoneId: 0,
    worldCountryID: 0,
    EmailWhenGroupisActive: false,
    EmailWhenGroupIsSetInActive: false,
    PushNotificationWhenGroupisActive: false,
    PushNotificationWhenGroupisSetInActive: false,
    EmailWhenCommitteeisActive: false,
    EmailWhenCommitteeIsSetInActive: false,
    PushNotificationWhenCommitteeisActive: false,
    PushNotificationWhenCommitteeisSetInActive: false,
    PushNotificationWhenNewTODOAssigned: false,
    PushNotificationWhenNewTODODeleted: false,
    PushNotificationWhenNewTODOEdited: false,
    PushNotificationWhenNewCommentAdded: false,
    PushNotificationWhenCommentDeleted: false,
    EmailWhenCommentDeleted: false,
    EmailWhenNewCommentAdded: false,
    EmailWhenNewTODOAssigned: false,
    EmailWhenNewTODODeleted: false,
    EmailWhenNewTODOEdited: false,
    EmailWhenActiveMeetingAgendaUpdated: false,
    isMondayWorkingDay: true,
    isTuesdayWorkingDay: true,
    isWednesdayWorkingDay: true,
    isThursdayWorkingDay: true,
    isFridayWorkingDay: true,
    isSaturdayWorkingDay: true,
    isSundayWorkingDay: true,
    fiscalEndMonth: 2,
    complianceAlertOne: 1,
    complianceAlertThree: 1,
    complianceAlertTwo: 1,
    autoCloseResolutionDays: 0,
  });

  const settingReducerGetOrganizationLevelSettingResponseData = useSelector(
    (state) => state.settingReducer.GetOrganizationLevelSettingResponse
  );

  console.log(
    userOrganizationSetting,
    "settingReducerGetOrganizationLevelSettingResponseData"
  );
  useEffect(() => {
    dispatch(getOrganizationLevelSetting(navigate, t));
  }, []);

  useEffect(() => {
    if (
      settingReducerGetOrganizationLevelSettingResponseData !== null &&
      settingReducerGetOrganizationLevelSettingResponseData !== undefined
    ) {
      if (
        Object.keys(settingReducerGetOrganizationLevelSettingResponseData)
          .length > 0
      ) {
        let organizationSettings =
          settingReducerGetOrganizationLevelSettingResponseData;
        console.log(
          organizationSettings,
          "organizationSettingsorganizationSettings"
        );
        setOrganizationSetting({
          Is2FAEnabled: organizationSettings.is2FAEnabled,
          EmailOnNewMeeting: organizationSettings.emailOnNewMeeting,
          EmailEditMeeting: organizationSettings.emailOnEditMeeting,
          EmailCancelOrDeleteMeeting:
            organizationSettings.emailOnCancelledDeletedMeeting,
          PushNotificationonNewMeeting:
            organizationSettings.pushNotificationOnNewMeeting,
          PushNotificationEditMeeting:
            organizationSettings.pushNotificationOnEditMeeting,
          PushNotificationCancelledOrDeleteMeeting:
            organizationSettings.pushNotificationonCancelledDeletedMeeting,
          ShowNotificationOnParticipantJoining:
            organizationSettings.showNotificationOnParticipantJoining,
          AllowCalenderSync: organizationSettings.userAllowGoogleCalendarSynch,
          AllowMicrosoftCalenderSync:
            organizationSettings.userAllowMicrosoftCalendarSynch,
          EmailWhenAddedToCommittee:
            organizationSettings.emailWhenAddedToCommittee,
          EmailWhenRemovedFromCommittee:
            organizationSettings.emailWhenRemovedFromCommittee,
          EmailWhenCommitteeIsDissolvedOrArchived:
            organizationSettings.emailWhenCommitteeIsDissolvedArchived,
          EmailWhenCommitteeIsSetInactive:
            organizationSettings.emailWhenCommitteeIsInActive,
          PushNotificationWhenAddedToCommittee:
            organizationSettings.pushNotificationwhenAddedtoCommittee,
          PushNotificationWhenRemovedFromCommittee:
            organizationSettings.pushNotificationwhenRemovedfromCommittee,
          PushNotificationWhenCommitteeIsDissolvedOrArchived:
            organizationSettings.pushNotificationwhenCommitteeisDissolvedArchived,
          PushNotificationWhenCommitteeIsInActive:
            organizationSettings.pushNotificationwhenCommitteeissetInActive,
          EmailWhenAddedToGroup: organizationSettings.emailWhenAddedToGroup,
          EmailWhenRemovedFromGroup:
            organizationSettings.emailWhenRemovedFromGroup,
          EmailWhenGroupIsDissolvedOrArchived:
            organizationSettings.emailWhenGroupIsClosedArchived,
          EmailWhenGroupisSetInactive:
            organizationSettings.emailWhenGroupIsInActive,
          PushNotificationWhenAddedToGroup:
            organizationSettings.pushNotificationwhenAddedtoGroup,
          PushNotificationWhenRemovedFromGroup:
            organizationSettings.pushNotificationwhenRemovedfromGroup,
          PushNotificationWhenGroupIsDissolvedOrArchived:
            organizationSettings.pushNotificationwhenGroupisClosedArchived,
          PushNotificationWhenGroupIsInActive:
            organizationSettings.pushNotificationwhenGroupissetInActive,
          EmailWhenResolutionIsCirculated:
            organizationSettings.emailwhenaResolutionisClosed,
          EmailWhenNewResolutionIsCancelledAfterCirculation:
            organizationSettings.emailwhenResolutionisCancelledafterCirculation,
          EmailWhenResolutionIsClosed:
            organizationSettings.emailwhenaResolutionisClosed,
          PushNotificationWhenNewResolutionIsCirculated:
            organizationSettings.pushNotificationwhenNewResolutionisCirculated,
          PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
            organizationSettings.pushNotificationwhenResolutionisCancelledafterCirculation,
          PushNotificationWhenResolutionISClosed:
            organizationSettings.pushNotificationWhenResolutionIsClosed,
          EmailWhenNewPollIsPublished:
            organizationSettings.emailWhenNewPollIsPublished,
          EmailWhenPollDueDateIsPassed:
            organizationSettings.emailWhenPollDueDateIsPassed,
          EmailWhenPublishedPollIsDeleted:
            organizationSettings.emailWhenPublishedPollIsDeleted,
          EmailWhenPublishedPollIsUpdated:
            organizationSettings.emailWhenPublishedPollIsUpdated,
          PushNotificationWhenNewPollIsPublished:
            organizationSettings.pushNotificationWhenNewPollIsPublished,
          PushNotificationWhenPollDueDateIsPassed:
            organizationSettings.pushNotificationWhenPollDueDateIsPassed,
          PushNotificationWhenPublishedPollIsDeleted:
            organizationSettings.pushNotificationWhenPublishedPollIsDeleted,
          PushNotificationWhenPublishedPollIsUpdated:
            organizationSettings.pushNotificationWhenPublishedPollIsUpdated,
          DormatInactiveUsersforDays:
            organizationSettings.dormantInactiveUsersForDays,
          MaximumMeetingDuration: organizationSettings.maximumMeetingDuration,
          CalenderMonthsSpan: organizationSettings.calenderMonthsSpan,
          TimeZoneId: organizationSettings.timeZones?.pK_TZID,
          worldCountryID: organizationSettings.worldCountry.fK_WorldCountryID,
          EmailWhenGroupisActive: organizationSettings.emailWhenGroupIsActive,
          EmailWhenGroupIsSetInActive:
            organizationSettings.emailWhenGroupIsInActive,
          PushNotificationWhenGroupisActive:
            organizationSettings.pushNotificationwhenGroupissetActive,
          PushNotificationWhenGroupisSetInActive:
            organizationSettings.pushNotificationwhenGroupissetInActive,
          EmailWhenCommitteeisActive:
            organizationSettings.emailWhenCommitteeIsActive,
          EmailWhenCommitteeIsSetInActive:
            organizationSettings.emailWhenCommitteeIsInActive,
          PushNotificationWhenCommitteeisActive:
            organizationSettings.pushNotificationwhenCommitteeissetActive,
          PushNotificationWhenCommitteeisSetInActive:
            organizationSettings.pushNotificationwhenCommitteeissetInActive,
          PushNotificationWhenNewTODOAssigned:
            organizationSettings.pushNotificationWhenNewTODOAssigned,
          PushNotificationWhenNewTODODeleted:
            organizationSettings.pushNotificationWhenNewTODODeleted,
          PushNotificationWhenNewTODOEdited:
            organizationSettings.pushNotificationWhenNewTODOEdited,
          PushNotificationWhenNewCommentAdded:
            organizationSettings.pushNotificationWhenNewCommentAdded,
          PushNotificationWhenCommentDeleted:
            organizationSettings.pushNotificationWhenCommentDeleted,
          EmailWhenCommentDeleted: organizationSettings.emailWhenCommentDeleted,
          EmailWhenNewCommentAdded:
            organizationSettings.emailWhenNewCommentAdded,
          EmailWhenNewTODOAssigned:
            organizationSettings.emailWhenNewTODOAssigned,
          EmailWhenNewTODODeleted: organizationSettings.emailWhenNewTODODeleted,
          EmailWhenNewTODOEdited: organizationSettings.emailWhenNewTODOEdited,
          EmailWhenActiveMeetingAgendaUpdated:
            organizationSettings.emailWhenActiveMeetingAgendaUpdated,
          isMondayWorkingDay: organizationSettings.isMondayWorkingDay,
          isTuesdayWorkingDay: organizationSettings.isTuesdayWorkingDay,
          isWednesdayWorkingDay: organizationSettings.isWednesdayWorkingDay,
          isThursdayWorkingDay: organizationSettings.isThursdayWorkingDay,
          isFridayWorkingDay: organizationSettings.isFridayWorkingDay,
          isSaturdayWorkingDay: organizationSettings.isSaturdayWorkingDay,
          isSundayWorkingDay: organizationSettings.isSundayWorkingDay,
          fiscalEndMonth: organizationSettings.fiscalEndMonth,
          complianceAlertOne: organizationSettings.complianceAlertOne,
          complianceAlertThree: organizationSettings.complianceAlertThree,
          complianceAlertTwo: organizationSettings.complianceAlertTwo,
          autoCloseResolutionDays: organizationSettings.autoCloseResolutionDays,
        });
      }
    }
  }, [settingReducerGetOrganizationLevelSettingResponseData]);

  const updateOrganizationLevelSettings = async () => {
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
      CalenderMonthsSpan: userOrganizationSetting.CalenderMonthsSpan,
      DormantInactiveUsersForDays:
        userOrganizationSetting.DormatInactiveUsersforDays,
      EmailOnCancelledDeletedMeeting:
        userOrganizationSetting.EmailCancelOrDeleteMeeting,
      EmailOnEditMeeting: userOrganizationSetting.EmailEditMeeting,
      EmailOnNewMeeting: userOrganizationSetting.EmailOnNewMeeting,
      EmailWhenAddedToCommittee:
        userOrganizationSetting.EmailWhenAddedToCommittee,
      EmailWhenAddedToGroup: userOrganizationSetting.EmailWhenAddedToGroup,
      EmailWhenCommitteeIsActive:
        userOrganizationSetting.EmailWhenCommitteeisActive,
      EmailWhenCommitteeIsDissolvedArchived:
        userOrganizationSetting.EmailWhenCommitteeIsDissolvedOrArchived,
      EmailWhenCommitteeIsInActive:
        userOrganizationSetting.EmailWhenCommitteeisActive,
      EmailWhenGroupIsActive: userOrganizationSetting.EmailWhenGroupisActive,
      EmailWhenGroupIsClosedArchived:
        userOrganizationSetting.EmailWhenGroupIsDissolvedOrArchived,
      EmailWhenGroupIsInActive:
        userOrganizationSetting.EmailWhenGroupIsSetInActive,
      EmailWhenNewPollIsPublished:
        userOrganizationSetting.EmailWhenNewPollIsPublished,
      EmailWhenPollDueDateIsPassed:
        userOrganizationSetting.EmailWhenPollDueDateIsPassed,
      EmailWhenPublishedPollIsDeleted:
        userOrganizationSetting.EmailWhenPublishedPollIsDeleted,
      EmailWhenPublishedPollIsUpdated:
        userOrganizationSetting.EmailWhenPublishedPollIsUpdated,
      EmailWhenRemovedFromCommittee:
        userOrganizationSetting.EmailWhenRemovedFromCommittee,
      EmailWhenRemovedFromGroup:
        userOrganizationSetting.EmailWhenRemovedFromGroup,
      EmailwhenNewResolutionisCirculated:
        userOrganizationSetting.EmailWhenResolutionIsCirculated,
      EmailwhenResolutionisCancelledafterCirculation:
        userOrganizationSetting.EmailWhenNewResolutionIsCancelledAfterCirculation,
      EmailwhenaResolutionisClosed:
        userOrganizationSetting.EmailWhenResolutionIsClosed,
      FK_OrganizationID: JSON.parse(OrganizationID),
      FK_TZID: userOrganizationSetting.TimeZoneId,
      FK_WorldCountryID: userOrganizationSetting.worldCountryID,
      Is2FAEnabled: userOrganizationSetting.Is2FAEnabled,
      MaximumMeetingDuration: userOrganizationSetting.MaximumMeetingDuration,
      PushNotificationOnEditMeeting:
        userOrganizationSetting.PushNotificationEditMeeting,
      PushNotificationOnNewMeeting:
        userOrganizationSetting.PushNotificationonNewMeeting,
      PushNotificationWhenNewPollIsPublished:
        userOrganizationSetting.PushNotificationWhenNewPollIsPublished,
      PushNotificationWhenPollDueDateIsPassed:
        userOrganizationSetting.PushNotificationWhenPollDueDateIsPassed,
      PushNotificationWhenPublishedPollIsDeleted:
        userOrganizationSetting.PushNotificationWhenPublishedPollIsDeleted,
      PushNotificationWhenPublishedPollIsUpdated:
        userOrganizationSetting.PushNotificationWhenPublishedPollIsUpdated,
      PushNotificationWhenResolutionIsClosed:
        userOrganizationSetting.PushNotificationWhenResolutionISClosed,
      PushNotificationonCancelledDeletedMeeting:
        userOrganizationSetting.PushNotificationCancelledOrDeleteMeeting,
      PushNotificationwhenAddedtoCommittee:
        userOrganizationSetting.PushNotificationWhenAddedToCommittee,
      PushNotificationwhenAddedtoGroup:
        userOrganizationSetting.PushNotificationWhenAddedToGroup,
      PushNotificationwhenCommitteeisDissolvedArchived:
        userOrganizationSetting.PushNotificationWhenCommitteeIsDissolvedOrArchived,
      PushNotificationwhenCommitteeissetActive:
        userOrganizationSetting.PushNotificationWhenCommitteeisActive,
      PushNotificationwhenCommitteeissetInActive:
        userOrganizationSetting.PushNotificationWhenCommitteeisSetInActive,
      PushNotificationwhenGroupisClosedArchived:
        userOrganizationSetting.PushNotificationWhenGroupIsDissolvedOrArchived,
      PushNotificationwhenGroupissetActive:
        userOrganizationSetting.PushNotificationWhenGroupisSetInActive,
      PushNotificationwhenGroupissetInActive:
        userOrganizationSetting.PushNotificationWhenGroupisActive,
      PushNotificationwhenNewResolutionisCirculated:
        userOrganizationSetting.PushNotificationWhenNewResolutionIsCirculated,
      PushNotificationwhenRemovedfromCommittee:
        userOrganizationSetting.PushNotificationWhenRemovedFromCommittee,
      PushNotificationwhenRemovedfromGroup:
        userOrganizationSetting.PushNotificationWhenRemovedFromGroup,
      PushNotificationwhenResolutionisCancelledafterCirculation:
        userOrganizationSetting.PushNotificationWhenNewResolutionIsCancelledAfterCirculated,
      ShowNotificationOnParticipantJoining:
        userOrganizationSetting.ShowNotificationOnParticipantJoining,
      UserAllowGoogleCalendarSynch: userOrganizationSetting.AllowCalenderSync,
      UserAllowMicrosoftCalendarSynch:
        userOrganizationSetting.AllowMicrosoftCalenderSync,
      PushNotificationWhenNewTODOAssigned:
        userOrganizationSetting.PushNotificationWhenNewTODOAssigned,
      PushNotificationWhenNewTODODeleted:
        userOrganizationSetting.PushNotificationWhenNewTODODeleted,
      PushNotificationWhenNewTODOEdited:
        userOrganizationSetting.PushNotificationWhenNewTODOEdited,
      PushNotificationWhenNewCommentAdded:
        userOrganizationSetting.PushNotificationWhenNewCommentAdded,
      PushNotificationWhenCommentDeleted:
        userOrganizationSetting.PushNotificationWhenCommentDeleted,
      EmailWhenCommentDeleted: userOrganizationSetting.EmailWhenCommentDeleted,
      EmailWhenNewCommentAdded:
        userOrganizationSetting.EmailWhenNewCommentAdded,
      EmailWhenNewTODOAssigned:
        userOrganizationSetting.EmailWhenNewTODOAssigned,
      EmailWhenNewTODODeleted: userOrganizationSetting.EmailWhenNewTODODeleted,
      EmailWhenNewTODOEdited: userOrganizationSetting.EmailWhenNewTODOEdited,
      EmailWhenActiveMeetingAgendaUpdated:
        userOrganizationSetting.EmailWhenActiveMeetingAgendaUpdated,
      AutoCloseResolutionDays: userOrganizationSetting.autoCloseResolutionDays,
      FiscalEndMonth: 2,
      ComplianceAlertOne: userOrganizationSetting.complianceAlertOne,
      ComplianceAlertTwo: userOrganizationSetting.complianceAlertTwo,
      ComplianceAlertThree: userOrganizationSetting.complianceAlertThree,
      IsMondayWorkingDay: userOrganizationSetting.isMondayWorkingDay,
      IsTuesdayWorkingDay: userOrganizationSetting.isTuesdayWorkingDay,
      IsWednesdayWorkingDay: userOrganizationSetting.isWednesdayWorkingDay,
      IsThursdayWorkingDay: userOrganizationSetting.isThursdayWorkingDay,
      IsFridayWorkingDay: userOrganizationSetting.isFridayWorkingDay,
      IsSaturdayWorkingDay: userOrganizationSetting.isSaturdayWorkingDay,
      IsSundayWorkingDay: userOrganizationSetting.isSundayWorkingDay,
    };
    dispatch(updateOrganizationLevelSetting(navigate, Data, t));
  };

  const cancelOrganizationLevelSettings = () => {
    if (
      settingReducerGetOrganizationLevelSettingResponseData !== null &&
      settingReducerGetOrganizationLevelSettingResponseData !== undefined
    ) {
      if (
        Object.keys(settingReducerGetOrganizationLevelSettingResponseData)
          .length > 0
      ) {
        let organizationSettings =
          settingReducerGetOrganizationLevelSettingResponseData;
        console.log(
          organizationSettings,
          "organizationSettingsorganizationSettings"
        );
        setOrganizationSetting({
          Is2FAEnabled: organizationSettings.is2FAEnabled,
          EmailOnNewMeeting: organizationSettings.emailOnNewMeeting,
          EmailEditMeeting: organizationSettings.emailOnEditMeeting,
          EmailCancelOrDeleteMeeting:
            organizationSettings.emailOnCancelledDeletedMeeting,
          PushNotificationonNewMeeting:
            organizationSettings.pushNotificationOnNewMeeting,
          PushNotificationEditMeeting:
            organizationSettings.pushNotificationOnEditMeeting,
          PushNotificationCancelledOrDeleteMeeting:
            organizationSettings.pushNotificationonCancelledDeletedMeeting,
          ShowNotificationOnParticipantJoining:
            organizationSettings.showNotificationOnParticipantJoining,
          AllowCalenderSync: organizationSettings.userAllowGoogleCalendarSynch,
          AllowMicrosoftCalenderSync:
            organizationSettings.userAllowMicrosoftCalendarSynch,
          EmailWhenAddedToCommittee:
            organizationSettings.emailWhenAddedToCommittee,
          EmailWhenRemovedFromCommittee:
            organizationSettings.emailWhenRemovedFromCommittee,
          EmailWhenCommitteeIsDissolvedOrArchived:
            organizationSettings.emailWhenCommitteeIsDissolvedArchived,
          EmailWhenCommitteeIsSetInactive:
            organizationSettings.emailWhenCommitteeIsInActive,
          PushNotificationWhenAddedToCommittee:
            organizationSettings.pushNotificationwhenAddedtoCommittee,
          PushNotificationWhenRemovedFromCommittee:
            organizationSettings.pushNotificationwhenRemovedfromCommittee,
          PushNotificationWhenCommitteeIsDissolvedOrArchived:
            organizationSettings.pushNotificationwhenCommitteeisDissolvedArchived,
          PushNotificationWhenCommitteeIsInActive:
            organizationSettings.pushNotificationwhenCommitteeissetInActive,
          EmailWhenAddedToGroup: organizationSettings.emailWhenAddedToGroup,
          EmailWhenRemovedFromGroup:
            organizationSettings.emailWhenRemovedFromGroup,
          EmailWhenGroupIsDissolvedOrArchived:
            organizationSettings.emailWhenGroupIsClosedArchived,
          EmailWhenGroupisSetInactive:
            organizationSettings.emailWhenGroupIsInActive,
          PushNotificationWhenAddedToGroup:
            organizationSettings.pushNotificationwhenAddedtoGroup,
          PushNotificationWhenRemovedFromGroup:
            organizationSettings.pushNotificationwhenRemovedfromGroup,
          PushNotificationWhenGroupIsDissolvedOrArchived:
            organizationSettings.pushNotificationwhenGroupisClosedArchived,
          PushNotificationWhenGroupIsInActive:
            organizationSettings.pushNotificationwhenGroupissetInActive,
          EmailWhenResolutionIsCirculated:
            organizationSettings.emailwhenaResolutionisClosed,
          EmailWhenNewResolutionIsCancelledAfterCirculation:
            organizationSettings.emailwhenResolutionisCancelledafterCirculation,
          EmailWhenResolutionIsClosed:
            organizationSettings.emailwhenaResolutionisClosed,
          PushNotificationWhenNewResolutionIsCirculated:
            organizationSettings.pushNotificationwhenNewResolutionisCirculated,
          PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
            organizationSettings.pushNotificationwhenResolutionisCancelledafterCirculation,
          PushNotificationWhenResolutionISClosed:
            organizationSettings.pushNotificationWhenResolutionIsClosed,
          EmailWhenNewPollIsPublished:
            organizationSettings.emailWhenNewPollIsPublished,
          EmailWhenPollDueDateIsPassed:
            organizationSettings.emailWhenPollDueDateIsPassed,
          EmailWhenPublishedPollIsDeleted:
            organizationSettings.emailWhenPublishedPollIsDeleted,
          EmailWhenPublishedPollIsUpdated:
            organizationSettings.emailWhenPublishedPollIsUpdated,
          PushNotificationWhenNewPollIsPublished:
            organizationSettings.pushNotificationWhenNewPollIsPublished,
          PushNotificationWhenPollDueDateIsPassed:
            organizationSettings.pushNotificationWhenPollDueDateIsPassed,
          PushNotificationWhenPublishedPollIsDeleted:
            organizationSettings.pushNotificationWhenPublishedPollIsDeleted,
          PushNotificationWhenPublishedPollIsUpdated:
            organizationSettings.pushNotificationWhenPublishedPollIsUpdated,
          DormatInactiveUsersforDays:
            organizationSettings.dormantInactiveUsersForDays,
          MaximumMeetingDuration: organizationSettings.maximumMeetingDuration,
          CalenderMonthsSpan: organizationSettings.calenderMonthsSpan,
          TimeZoneId: organizationSettings.timeZones?.pK_TZID,
          worldCountryID: organizationSettings.worldCountry.fK_WorldCountryID,
          EmailWhenGroupisActive: organizationSettings.emailWhenGroupIsActive,
          EmailWhenGroupIsSetInActive:
            organizationSettings.emailWhenGroupIsInActive,
          PushNotificationWhenGroupisActive:
            organizationSettings.pushNotificationwhenGroupissetActive,
          PushNotificationWhenGroupisSetInActive:
            organizationSettings.pushNotificationwhenGroupissetInActive,
          EmailWhenCommitteeisActive:
            organizationSettings.emailWhenCommitteeIsActive,
          EmailWhenCommitteeIsSetInActive:
            organizationSettings.emailWhenCommitteeIsInActive,
          PushNotificationWhenCommitteeisActive:
            organizationSettings.pushNotificationwhenCommitteeissetActive,
          PushNotificationWhenCommitteeisSetInActive:
            organizationSettings.pushNotificationwhenCommitteeissetInActive,
          PushNotificationWhenNewTODOAssigned:
            organizationSettings.pushNotificationWhenNewTODOAssigned,
          PushNotificationWhenNewTODODeleted:
            organizationSettings.pushNotificationWhenNewTODODeleted,
          PushNotificationWhenNewTODOEdited:
            organizationSettings.pushNotificationWhenNewTODOEdited,
          PushNotificationWhenNewCommentAdded:
            organizationSettings.pushNotificationWhenNewCommentAdded,
          PushNotificationWhenCommentDeleted:
            organizationSettings.pushNotificationWhenCommentDeleted,
          EmailWhenCommentDeleted: organizationSettings.emailWhenCommentDeleted,
          EmailWhenNewCommentAdded:
            organizationSettings.emailWhenNewCommentAdded,
          EmailWhenNewTODOAssigned:
            organizationSettings.emailWhenNewTODOAssigned,
          EmailWhenNewTODODeleted: organizationSettings.emailWhenNewTODODeleted,
          EmailWhenNewTODOEdited: organizationSettings.emailWhenNewTODOEdited,
          EmailWhenActiveMeetingAgendaUpdated:
            organizationSettings.emailWhenActiveMeetingAgendaUpdated,
          isMondayWorkingDay: organizationSettings.isMondayWorkingDay,
          isTuesdayWorkingDay: organizationSettings.isTuesdayWorkingDay,
          isWednesdayWorkingDay: organizationSettings.isWednesdayWorkingDay,
          isThursdayWorkingDay: organizationSettings.isThursdayWorkingDay,
          isFridayWorkingDay: organizationSettings.isFridayWorkingDay,
          isSaturdayWorkingDay: organizationSettings.isSaturdayWorkingDay,
          isSundayWorkingDay: organizationSettings.isSundayWorkingDay,
          fiscalEndMonth: organizationSettings.fiscalEndMonth,
          complianceAlertOne: organizationSettings.complianceAlertOne,
          complianceAlertThree: organizationSettings.complianceAlertThree,
          complianceAlertTwo: organizationSettings.complianceAlertTwo,
          autoCloseResolutionDays: organizationSettings.autoCloseResolutionDays,
        });
      }
    }
  };
  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={6} sm={12} xs={12}>
            <div className="d-flex gap-3 align-items-center w-100 justify-content-start">
              <label className={styles["General_Setting-Main-Heading"]}>
                {t("General-settings")}
              </label>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col lg={3} md={3} sm={3}>
                <>
                  <div
                    onClick={() => setViewState(1)}
                    className="cursor-pointer my-3 gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={calenderIcon}
                      alt=""
                      width="28.46px"
                      height="28.47px"
                    />

                    <span
                      className={
                        viewState === 1
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Fiscal-year")}
                    </span>
                  </div>
                  <hr />
                </>

                {/* Due Date Alert */}
                <Col>
                  <div
                    onClick={() => setViewState(2)}
                    className="cursor-pointer mb-3 gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={exclamationIcon}
                      alt=""
                      width="25px"
                      height="25px"
                    />

                    <span
                      className={
                        viewState === 2
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Due-date-alert")}
                    </span>
                  </div>
                  <hr />
                </Col>

                {/* Working Days */}
                <Col>
                  <div
                    onClick={() => setViewState(3)}
                    className="cursor-pointer gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={workingDaysIcon}
                      alt=""
                      width="25px"
                      height="22.5px"
                    />
                    <span
                      className={
                        viewState === 3
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Working-days")}
                    </span>
                  </div>
                  <hr />
                </Col>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex justify-content-center"
              >
                <img
                  draggable="false"
                  alt=""
                  src={line}
                  className={styles["general-setting-row"]}
                />
              </Col>
              <Col sm={12} md={8} lg={8}>
                {viewState === 1 && (
                  <FiscalYear
                    organizationSettingData={userOrganizationSetting}
                    setOrganizationSetting={setOrganizationSetting}
                  />
                )}
                {viewState === 2 && (
                  <DueDateAlert
                    organizationSettingData={userOrganizationSetting}
                    setOrganizationSetting={setOrganizationSetting}
                  />
                )}
                {viewState === 3 && (
                  <WorkingDays
                    organizationSettingData={userOrganizationSetting}
                    setOrganizationSetting={setOrganizationSetting}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 justify-content-end"
          >
            <Button
              text={t("Cancel")}
              className={styles["New_settings_Cancel_Button"]}
              onClick={cancelOrganizationLevelSettings}
            />
            <Button
              text={t("Save")}
              className={styles["New_settings_Update_Button"]}
              onClick={updateOrganizationLevelSettings}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GeneralSetting;
