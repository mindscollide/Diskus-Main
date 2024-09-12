import React, { useEffect, useState } from "react";
import styles from "./OrganizationLevelConfig.module.css";
import { Checkbox } from "antd";
import SecurityIcon from "../../../../assets/images/SecuritySetting.svg";
import TodoIcon from "../../../../assets/images/Todo_icon.svg";
import Select from "react-select";
import MeetingIcon from "../../../../assets/images/MeetingSetting.svg";
import Calender from "../../../../assets/images/CalenderSetting.svg";
import pollsIcon from "../../../../assets/images/pollsIcon.svg";
import Committee from "../../../../assets/images/CommitteSetting.svg";
import GroupIcon from "../../../../assets/images/GroupSetting.svg";
import BlueArrowCircle from "../../../../assets/images/BlueArrowCircle.svg";
import ResolutionIcon from "../../../../assets/images/new_ResolutionIcon2.svg";
import {
  MonthOptions,
  MonthValues,
  options,
} from "./OrganizationLevelConfigValuesUM";
import line from "../../../../assets/images/Line 27.svg";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, TextField } from "../../../../components/elements";
import {
  getOrganizationLevelSetting,
  updateOrganizationLevelSetting,
} from "../../../../store/actions/OrganizationSettings";
import getTimeZone from "../../../../store/actions/GetTimeZone";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
const OrganizationLevelConfigUM = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settingReducer, LanguageReducer } = useSelector((state) => state);
  console.log(
    settingReducer.Loading,
    "settingReducersettingReducersettingReducer"
  );
  const [securitystate, setSecuritystate] = useState(true);
  const [todo, setTodo] = useState(false);
  const [meetingsState, setmeetingsState] = useState(false);
  const [calender, setCalender] = useState(false);
  const [committee, setCommittee] = useState(false);
  const [group, setGroup] = useState(false);
  const [resolution, setResolution] = useState(false);
  const [polls, setpolls] = useState(false);
  const roleID = localStorage.getItem("roleID");
  const [worldCountryID, setWorldCountryID] = useState(0);
  const [timezone, setTimeZone] = useState([]);
  const [timeZoneValue, setTimeZoneValue] = useState({
    label: "",
    value: "",
  });

  const [signUpCodeToken, setSignUpCodeToken] = useState("");
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
    AutoCloseResolution: 0,
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
    EmailWhenActiveMeetingAgendaUpdated: false
  });

  useEffect(() => {
    dispatch(getOrganizationLevelSetting(navigate, t));
    dispatch(getTimeZone(navigate, t));
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    setSignUpCodeToken(response.code);
    setOrganizationSetting({
      ...userOrganizationSetting,
      AllowCalenderSync: true,
    });
  };

  const handleGoogleLoginFailure = (response) => {
    setSignUpCodeToken("");
    setOrganizationSetting({
      ...userOrganizationSetting,
      AllowMicrosoftCalenderSync:
        userOrganizationSetting.AllowMicrosoftCalenderSync,
    });
  };

  useEffect(() => {
    let TimeZone = settingReducer.TimeZone;
    if (TimeZone !== undefined && TimeZone !== null) {
      let newData = [];
      TimeZone.map((data, index) => {
        newData.push({
          label: data.gmtOffset
            ? data.countryName +
              " " +
              "(" +
              data.timeZone +
              ")" +
              " " +
              data.gmtOffset
            : null,
          value: data.pK_TZID,
        });
      });
      setTimeZone(newData);
    }
  }, [settingReducer.TimeZone]);

  useEffect(() => {
    if (
      settingReducer.GetOrganizationLevelSettingResponse !== null &&
      settingReducer.GetOrganizationLevelSettingResponse !== undefined
    ) {
      if (
        Object.keys(settingReducer.GetOrganizationLevelSettingResponse).length >
        0
      ) {
        let organizationSettings =
          settingReducer.GetOrganizationLevelSettingResponse;
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
          EmailWhenActiveMeetingAgendaUpdated: organizationSettings.emailWhenActiveMeetingAgendaUpdated
        });
        let timeZoneCode = {
          label: organizationSettings.timeZones
            ? organizationSettings.timeZones.countryName +
              " " +
              "(" +
              organizationSettings.timeZones.timeZone +
              ")" +
              " " +
              organizationSettings.timeZones.gmtOffset
            : null,
          value: organizationSettings.timeZones?.pK_TZID,
        };
        setTimeZoneValue(timeZoneCode);
      }
    }
  }, [settingReducer.GetOrganizationLevelSettingResponse]);

  const openSecurityTab = () => {
    setSecuritystate(true);
    setmeetingsState(false);
    setCalender(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
    setTodo(false);
  };
  const opentodo = () => {
    setTodo(true);
    setmeetingsState(false);
    setSecuritystate(false);
    setCalender(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
  };
  const openMeetingTab = () => {
    setmeetingsState(true);
    setSecuritystate(false);
    setCalender(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
    setTodo(false);
  };

  const openCalenderTab = () => {
    setCalender(true);
    setmeetingsState(false);
    setSecuritystate(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
    setTodo(false);
  };

  const openCommitteTab = () => {
    setCommittee(true);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
    setTodo(false);
  };

  const openGroupTab = () => {
    setGroup(true);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setResolution(false);
    setpolls(false);
    setTodo(false);
  };

  const openResolutionTab = () => {
    setResolution(true);
    setGroup(false);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setpolls(false);
    setTodo(false);
  };

  const openPollsTab = () => {
    setpolls(true);
    setResolution(false);
    setGroup(false);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setTodo(false);
  };

  const onChangeIsTwoFaceEnabled = (e) => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      Is2FAEnabled: !userOrganizationSetting.Is2FAEnabled,
    });
  };

  const onChangeEmailOnNewMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailOnNewMeeting: !userOrganizationSetting.EmailOnNewMeeting,
    });
  };

  const onChangeEmailOnEditMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailEditMeeting: !userOrganizationSetting.EmailEditMeeting,
    });
  };

  const onChangeEmailOnCancelledOrDeletedMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailCancelOrDeleteMeeting:
        !userOrganizationSetting.EmailCancelOrDeleteMeeting,
    });
  };

  const onChangePushNotificationonNewMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationonNewMeeting:
        !userOrganizationSetting.PushNotificationonNewMeeting,
    });
  };

  const onChangePushNotificationOnEditMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationEditMeeting:
        !userOrganizationSetting.PushNotificationEditMeeting,
    });
  };

  const onChangePushNotificationOnCancelledOrDeleteMeeting = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationCancelledOrDeleteMeeting:
        !userOrganizationSetting.PushNotificationCancelledOrDeleteMeeting,
    });
  };

  const onChangeShowNotificationonJoiningParticiapnts = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      ShowNotificationOnParticipantJoining:
        !userOrganizationSetting.ShowNotificationOnParticipantJoining,
    });
  };

  const onChangeAllowCalenderSync = (checked) => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      AllowCalenderSync: !userOrganizationSetting.AllowCalenderSync,
    });
  };

  const onChangeAllowMicrosoftCalenderSync = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      AllowMicrosoftCalenderSync:
        !userOrganizationSetting.AllowMicrosoftCalenderSync,
    });
  };

  const onChangeEmailWhenAddedToCommittee = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenAddedToCommittee:
        !userOrganizationSetting.EmailWhenAddedToCommittee,
    });
  };

  const onChangeEmailWhenRemovedFromCommittee = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenRemovedFromCommittee:
        !userOrganizationSetting.EmailWhenRemovedFromCommittee,
    });
  };

  const onChangeWhenCommitteeIsDissolvedOrArchived = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenCommitteeIsDissolvedOrArchived:
        !userOrganizationSetting.EmailWhenCommitteeIsDissolvedOrArchived,
    });
  };

  const onChangeEmailWhenCommitteeIsInActive = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenCommitteeIsSetInactive:
        !userOrganizationSetting.EmailWhenCommitteeIsSetInactive,
    });
  };

  const onChangePushNotificationWhenAddedToCommittee = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenAddedToCommittee:
        !userOrganizationSetting.PushNotificationWhenAddedToCommittee,
    });
  };

  const onChangePushNotificationWhenRemovedFromCommittee = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenRemovedFromCommittee:
        !userOrganizationSetting.PushNotificationWhenRemovedFromCommittee,
    });
  };

  const onChangepushNotificationWhenCommitteeIsDissolvedOrArchived = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenCommitteeIsDissolvedOrArchived:
        !userOrganizationSetting.PushNotificationWhenCommitteeIsDissolvedOrArchived,
    });
  };

  const onChangepushNotificationWhenCommitteeIsInActive = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenCommitteeisActive:
        !userOrganizationSetting.PushNotificationWhenCommitteeisActive,
    });
  };

  const onChangeEmailWhenAddedToGroup = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenAddedToGroup: !userOrganizationSetting.EmailWhenAddedToGroup,
    });
  };

  const onChangeEmailWhenRemovedFromGroup = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenRemovedFromGroup:
        !userOrganizationSetting.EmailWhenRemovedFromGroup,
    });
  };

  const onChangeEmailWhenGroupIsDissolvedOrArchived = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenGroupIsDissolvedOrArchived:
        !userOrganizationSetting.EmailWhenGroupIsDissolvedOrArchived,
    });
  };

  const onChangeWhenGroupIsSetInactive = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenGroupIsSetInActive:
        !userOrganizationSetting.EmailWhenGroupIsSetInActive,
    });
  };

  const onChangePushNotificationWhenAddedToGroup = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenAddedToGroup:
        !userOrganizationSetting.PushNotificationWhenAddedToGroup,
    });
  };

  const onChangePushNotificationWhenRemovedFromGroup = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenRemovedFromGroup:
        !userOrganizationSetting.PushNotificationWhenRemovedFromGroup,
    });
  };

  const onChangePushNotificationWhenGroupIsDissolvedOrArchived = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenGroupIsDissolvedOrArchived:
        !userOrganizationSetting.PushNotificationWhenGroupIsDissolvedOrArchived,
    });
  };

  const onChangePushNotificationWhenGroupIsSetInActive = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenGroupisSetInActive:
        !userOrganizationSetting.PushNotificationWhenGroupisSetInActive,
    });
  };

  const onChangeWhenResolutionIsCirculated = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenResolutionIsCirculated:
        !userOrganizationSetting.EmailWhenResolutionIsCirculated,
    });
  };

  const onChangeWhenNewPollIsPublished = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewPollIsPublished:
        !userOrganizationSetting.EmailWhenNewPollIsPublished,
    });
  };

  const onChangeWhenPollsDueDateIsPassed = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenPollDueDateIsPassed:
        !userOrganizationSetting.EmailWhenPollDueDateIsPassed,
    });
  };

  const onChangeWhenPublishedPollIsDeleted = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenPublishedPollIsDeleted:
        !userOrganizationSetting.EmailWhenPublishedPollIsDeleted,
    });
  };

  const onChangeWhenPublishedPollIsUpdated = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenPublishedPollIsUpdated:
        !userOrganizationSetting.EmailWhenPublishedPollIsUpdated,
    });
  };

  const onChangePushNotificationWhenNewPollIsPublished = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewPollIsPublished:
        !userOrganizationSetting.PushNotificationWhenNewPollIsPublished,
    });
  };

  const onChangePushNotificationWhenPollsDueDateIsPassed = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenPollDueDateIsPassed:
        !userOrganizationSetting.PushNotificationWhenPollDueDateIsPassed,
    });
  };

  const onChangePushNotificationWhenPublishedPollIsDeleted = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenPublishedPollIsDeleted:
        !userOrganizationSetting.PushNotificationWhenPublishedPollIsDeleted,
    });
  };

  const onChangePushNotificationWhenPublishedPollisUpdated = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenPublishedPollIsUpdated:
        !userOrganizationSetting.PushNotificationWhenPublishedPollIsUpdated,
    });
  };

  const onChangeEmailWhenResolutionIsCancelledAfterCirculation = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewResolutionIsCancelledAfterCirculation:
        !userOrganizationSetting.EmailWhenNewResolutionIsCancelledAfterCirculation,
    });
  };

  const onChangeEmailWhenResolutionisClosed = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenResolutionIsClosed:
        !userOrganizationSetting.EmailWhenResolutionIsClosed,
    });
  };

  const onChangePushNotificationWhenResolutionIsCirculated = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewResolutionIsCirculated:
        !userOrganizationSetting.PushNotificationWhenNewResolutionIsCirculated,
    });
  };

  const onChangePushNoficationWhenNewResolutionIsCanelledAfterCirculated =
    () => {
      setOrganizationSetting({
        ...userOrganizationSetting,
        PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
          !userOrganizationSetting.PushNotificationWhenNewResolutionIsCancelledAfterCirculated,
      });
    };

  const onChangePushNotificationWhenResolutionIsClosed = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenResolutionISClosed:
        !userOrganizationSetting.PushNotificationWhenResolutionISClosed,
    });
  };

  const handleChangeDormant = (data) => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      DormatInactiveUsersforDays: data.value,
    });
  };

  const changeMeetingDuration = (event) => {
    let value = event.target.value;
    setOrganizationSetting({
      ...userOrganizationSetting,
      MaximumMeetingDuration: Number(value),
    });
  };

  const CalendarSpanChangeHandler = (data) => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      CalenderMonthsSpan: data.value,
    });
  };

  // Time Zone Change Handler
  const timezoneChangeHandler = (event) => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      TimeZoneId: event.value,
    });
    setTimeZoneValue({
      label: event.label,
      value: event.value,
    });
  };

  const onChangeEmailWhenNewTODOEdited = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewTODOEdited: value,
    });
  };
  const onChangeEmailWhenNewTODODeleted = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewTODODeleted: value,
    });
  };
  const onChangeEmailWhenNewTODOAssigned = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewTODOAssigned: value,
    });
  };
  const onChangeEmailWhenNewCommentAdded = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenNewCommentAdded: value,
    });
  };
  const onChangeEmailWhenCommentDeleted = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenCommentDeleted: value,
    });
  };
  const onChangePushNotificationWhenCommentDeleted = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenCommentDeleted: value,
    });
  };
  const onChangePushNotificationWhenNewCommentAdded = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewCommentAdded: value,
    });
  };
  const onChangePushNotificationWhenNewTODOEdited = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewTODOEdited: value,
    });
  };
  const onChangePushNotificationWhenNewTODODeleted = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewTODODeleted: value,
    });
  };
  const onChangePushNotificationWhenNewTODOAssigned = (e) => {
    let value = e.target.checked;
    setOrganizationSetting({
      ...userOrganizationSetting,
      PushNotificationWhenNewTODOAssigned: value,
    });
  };

  
  const handleChangeAgendaUpdateEmail = () => {
    setOrganizationSetting({
      ...userOrganizationSetting,
      EmailWhenActiveMeetingAgendaUpdated:
        !userOrganizationSetting.EmailWhenActiveMeetingAgendaUpdated,
    });
  };

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
      EmailWhenActiveMeetingAgendaUpdated: userOrganizationSetting.EmailWhenActiveMeetingAgendaUpdated
    };
    dispatch(updateOrganizationLevelSetting(navigate, Data, t));
  };

  return (
    <section className={styles["UserConfigsContainer"]}>
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex gap-3 align-items-center"
        >
          <span className={styles["UserLevelConfig_Heading"]}>
            {t("Organization-level-configurations")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["Padding_around_class"]}>
          <Row className="mt-3">
            <Col lg={3} md={3} sm={3}>
              {checkFeatureIDAvailability(36) ? (
                <>
                  <div onClick={openSecurityTab} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={SecurityIcon}
                          alt=""
                          width="25.51px"
                          height="30.69px"
                        />
                      </Col>
                      <Col lg={10} md={10} sm={12}>
                        <span
                          className={
                            securitystate
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Security-settings")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(37) ? (
                <>
                  <div onClick={opentodo} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={TodoIcon}
                          alt=""
                          width="30px"
                          height="30px"
                        />
                      </Col>
                      <Col lg={10} md={10} sm={12}>
                        <span
                          className={
                            todo
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Task")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(38) ? (
                <>
                  <div onClick={openMeetingTab} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={MeetingIcon}
                          alt=""
                          width="35.79px"
                          height="27.3px"
                        />
                      </Col>
                      <Col lg={10} md={10} ms={12}>
                        <span
                          className={
                            meetingsState
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Meetings")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(39) ? (
                <>
                  <div className="cursor-pointer" onClick={openCalenderTab}>
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={Calender}
                          alt=""
                          width="28.47px"
                          height="28.47px"
                        />
                      </Col>
                      <Col lg={10} md={10} ms={12}>
                        <span
                          className={
                            calender
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Calendar")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(40) ? (
                <>
                  <div onClick={openCommitteTab} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={Committee}
                          alt=""
                          width="35.8px"
                          height="34.63px"
                        />
                      </Col>
                      <Col lg={10} md={10} ms={12}>
                        <span
                          className={
                            committee
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Committees")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(41) ? (
                <>
                  <div onClick={openGroupTab} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={GroupIcon}
                          alt=""
                          width="29px"
                          height="26.04px"
                        />
                      </Col>
                      <Col lg={10} md={10} ms={12}>
                        <span
                          className={
                            group
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Groups")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(42) ? (
                <>
                  <div onClick={openResolutionTab} className="cursor-pointer">
                    <Row className="mt-3">
                      <Col
                        lg={2}
                        md={2}
                        sm={12}
                        className="d-flex align-items-center"
                      >
                        <img
                          draggable="false"
                          src={ResolutionIcon}
                          alt=""
                          width="30px"
                          height="31.18px"
                        />
                      </Col>
                      <Col lg={10} md={10} ms={12}>
                        <span
                          className={
                            resolution
                              ? styles["Options_headings_active"]
                              : styles["Options_headings"]
                          }
                        >
                          {t("Resolutions")}
                        </span>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                </>
              ) : null}

              {checkFeatureIDAvailability(43) ? (
                <div onClick={openPollsTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img
                        draggable="false"
                        alt=""
                        src={pollsIcon}
                        width="33.52px"
                        height="34.59px"
                      />
                    </Col>
                    <Col lg={10} md={10} ms={12}>
                      <span
                        className={
                          polls
                            ? styles["Options_headings_active"]
                            : styles["Options_headings"]
                        }
                      >
                        {t("Polls")}
                      </span>
                    </Col>
                  </Row>
                </div>
              ) : null}
            </Col>
            <Col lg={1} md={1} sm={1} className="d-flex justify-content-center">
              <img
                draggable="false"
                alt=""
                src={line}
                className={styles["user-setting-row"]}
              />
            </Col>
            <Col lg={4} md={4} sm={4} className="m-0 p-0 justify-content-start">
              {securitystate ? (
                <>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeIsTwoFaceEnabled}
                        checked={userOrganizationSetting.Is2FAEnabled}
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("2FA-is-enabled")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                </>
              ) : null}
              {todo ? (
                <>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenNewTODOAssigned}
                        checked={
                          userOrganizationSetting.EmailWhenNewTODOAssigned
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-new-todo-assigned")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationWhenNewTODOAssigned}
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewTODOAssigned
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-new-todo-assigned")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenNewTODOEdited}
                        checked={userOrganizationSetting.EmailWhenNewTODOEdited}
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-new-todo-edited")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationWhenNewTODOEdited}
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewTODOEdited
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-new-todo-edited")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenNewTODODeleted}
                        checked={
                          userOrganizationSetting.EmailWhenNewTODODeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-new-todo-deleted")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationWhenNewTODODeleted}
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewTODODeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-new-todo-deleted")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenNewCommentAdded}
                        checked={
                          userOrganizationSetting.EmailWhenNewCommentAdded
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-new-comment-added")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationWhenNewCommentAdded}
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewCommentAdded
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-new-comment-added")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenCommentDeleted}
                        checked={
                          userOrganizationSetting.EmailWhenCommentDeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-comment-deleted")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationWhenCommentDeleted}
                        checked={
                          userOrganizationSetting.PushNotificationWhenCommentDeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-comment-deleted")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                </>
              ) : null}
              {meetingsState ? (
                <>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailOnNewMeeting}
                        checked={userOrganizationSetting.EmailOnNewMeeting}
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-on-new-meeting")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationonNewMeeting}
                        checked={
                          userOrganizationSetting.PushNotificationonNewMeeting
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-on-new-meeting")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailOnEditMeeting}
                        checked={userOrganizationSetting.EmailEditMeeting}
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-on-edit-meeting")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangePushNotificationOnEditMeeting}
                        checked={
                          userOrganizationSetting.PushNotificationEditMeeting
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-on-edit-meeting")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailOnCancelledOrDeletedMeeting}
                        checked={
                          userOrganizationSetting.EmailCancelOrDeleteMeeting
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-on-cancelled-or-deleted-meeting")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationOnCancelledOrDeleteMeeting
                        }
                        checked={
                          userOrganizationSetting.PushNotificationCancelledOrDeleteMeeting
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Push-notification-on-cancelled-or-deleted-meeting"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeShowNotificationonJoiningParticiapnts}
                        checked={
                          userOrganizationSetting.ShowNotificationOnParticipantJoining
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Show-notification-on-joining-participant")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                      <Col lg={12} md={12} sm={12}>
                        <Checkbox
                          onChange={handleChangeAgendaUpdateEmail}
                          checked={
                            userOrganizationSetting.EmailWhenActiveMeetingAgendaUpdated
                          }>
                          <span className={styles["Class_CheckBox"]}>
                            {t(
                              "Allow-changes-in-the-agenda-items-after-the-meeting-has-been-started"
                            )}
                          </span>
                        </Checkbox>
                      </Col>
                    </Row>
                </>
              ) : null}
              {calender ? (
                <>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeAllowCalenderSync}
                        checked={userOrganizationSetting.AllowCalenderSync}
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Allow-google-calendar-synch-for-users")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeAllowMicrosoftCalenderSync}
                        checked={
                          userOrganizationSetting.AllowMicrosoftCalenderSync
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Allow-microsoft-calendar-synch-for-users")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                </>
              ) : null}
              {committee ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Committee_material"]}
                    >
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeEmailWhenAddedToCommittee}
                            checked={
                              userOrganizationSetting.EmailWhenAddedToCommittee
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-added-to-committee")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangePushNotificationWhenAddedToCommittee
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenAddedToCommittee
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-added-to-committee")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeEmailWhenRemovedFromCommittee}
                            checked={
                              userOrganizationSetting.EmailWhenRemovedFromCommittee
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-removed-from-committee")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangePushNotificationWhenRemovedFromCommittee
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenRemovedFromCommittee
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t(
                                "Push-notification-when-removed-from-committee"
                              )}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangeWhenCommitteeIsDissolvedOrArchived
                            }
                            checked={
                              userOrganizationSetting.EmailWhenCommitteeIsDissolvedOrArchived
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t(
                                "Email-when-committee-is-dissolved-or-archived"
                              )}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangepushNotificationWhenCommitteeIsDissolvedOrArchived
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenCommitteeIsDissolvedOrArchived
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t(
                                "Push-notification-when-committee-is-dissolved-or-archived"
                              )}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeEmailWhenCommitteeIsInActive}
                            checked={
                              userOrganizationSetting.EmailWhenCommitteeIsSetInActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-committee-is-set-inactive")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={() => {
                              setOrganizationSetting({
                                ...userOrganizationSetting,
                                PushNotificationWhenCommitteeisSetInActive:
                                  !userOrganizationSetting.PushNotificationWhenCommitteeisSetInActive,
                              });
                            }}
                            checked={
                              userOrganizationSetting.PushNotificationWhenCommitteeisSetInActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t(
                                "Push-notification-when-committee-is-set-inActive"
                              )}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={() => {
                              setOrganizationSetting({
                                ...userOrganizationSetting,
                                EmailWhenCommitteeisActive:
                                  !userOrganizationSetting.EmailWhenCommitteeisActive,
                              });
                            }}
                            checked={
                              userOrganizationSetting.EmailWhenCommitteeisActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-committee-is-active")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangepushNotificationWhenCommitteeIsInActive
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenCommitteeisActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-committee-is-active")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
              {group ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Committee_material"]}
                    >
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeEmailWhenAddedToGroup}
                            checked={
                              userOrganizationSetting.EmailWhenAddedToGroup
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-added-to-group")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangePushNotificationWhenAddedToGroup}
                            checked={
                              userOrganizationSetting.PushNotificationWhenAddedToGroup
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-added-to-group")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeEmailWhenRemovedFromGroup}
                            checked={
                              userOrganizationSetting.EmailWhenRemovedFromGroup
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-removed-from-group")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangePushNotificationWhenRemovedFromGroup
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenRemovedFromGroup
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-removed-from-group")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangeEmailWhenGroupIsDissolvedOrArchived
                            }
                            checked={
                              userOrganizationSetting.EmailWhenGroupIsDissolvedOrArchived
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-group-is-dissolved-or-archived")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangePushNotificationWhenGroupIsDissolvedOrArchived
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenGroupIsDissolvedOrArchived
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t(
                                "Push-notification-when-group-is-dissolved-or-archived"
                              )}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeWhenGroupIsSetInactive}
                            checked={
                              userOrganizationSetting.EmailWhenGroupIsSetInActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-group-is-set-inactive")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={
                              onChangePushNotificationWhenGroupIsSetInActive
                            }
                            checked={
                              userOrganizationSetting.PushNotificationWhenGroupisSetInActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-group-is-inActive")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={() => {
                              setOrganizationSetting({
                                ...userOrganizationSetting,
                                EmailWhenGroupisActive:
                                  !userOrganizationSetting.EmailWhenGroupisActive,
                              });
                            }}
                            checked={
                              userOrganizationSetting.EmailWhenGroupisActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Email-when-group-is-active")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={() => {
                              setOrganizationSetting({
                                ...userOrganizationSetting,
                                PushNotificationWhenGroupisActive:
                                  !userOrganizationSetting.PushNotificationWhenGroupisActive,
                              });
                            }}
                            checked={
                              userOrganizationSetting.PushNotificationWhenGroupisActive
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Push-notification-when-group-is-active")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
              {resolution ? (
                <>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeWhenResolutionIsCirculated}
                        checked={
                          userOrganizationSetting.EmailWhenResolutionIsCirculated
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-resolution-is-circulated")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenResolutionIsCirculated
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewResolutionIsCirculated
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Push-notification-when-new-resolution-is-circulated"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangeEmailWhenResolutionIsCancelledAfterCirculation
                        }
                        checked={
                          userOrganizationSetting.EmailWhenNewResolutionIsCancelledAfterCirculation
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Email-when-new-resolution-is-cancelled-after-circulation"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNoficationWhenNewResolutionIsCanelledAfterCirculated
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewResolutionIsCancelledAfterCirculated
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Push-notification-when-new-resolution-is-cancelled-after-circulated"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeEmailWhenResolutionisClosed}
                        checked={
                          userOrganizationSetting.EmailWhenResolutionIsClosed
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-resolution-is-closed")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenResolutionIsClosed
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenResolutionISClosed
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-resolution-is-closed")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                </>
              ) : null}
              {polls ? (
                <>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeWhenNewPollIsPublished}
                        checked={
                          userOrganizationSetting.EmailWhenNewPollIsPublished
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-new-poll-is-published")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenNewPollIsPublished
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenNewPollIsPublished
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-new-poll-is-published")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeWhenPollsDueDateIsPassed}
                        checked={
                          userOrganizationSetting.EmailWhenPollDueDateIsPassed
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-poll-duedate-is-passed")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenPollsDueDateIsPassed
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenPollDueDateIsPassed
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Push-notification-when-poll-duedate-is-passed")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeWhenPublishedPollIsDeleted}
                        checked={
                          userOrganizationSetting.EmailWhenPublishedPollIsDeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-published-poll-is-deleted")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenPublishedPollIsDeleted
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenPublishedPollIsDeleted
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Push-notification-when-published-poll-is-deleted"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={onChangeWhenPublishedPollIsUpdated}
                        checked={
                          userOrganizationSetting.EmailWhenPublishedPollIsUpdated
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t("Email-when-published-poll-is-updated")}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col lg={12} md={12} sm={12}>
                      <Checkbox
                        onChange={
                          onChangePushNotificationWhenPublishedPollisUpdated
                        }
                        checked={
                          userOrganizationSetting.PushNotificationWhenPublishedPollIsUpdated
                        }
                      >
                        <span className={styles["Class_CheckBox"]}>
                          {t(
                            "Push-notification-when-published-poll-is--updated"
                          )}
                        </span>
                      </Checkbox>
                    </Col>
                  </Row>
                </>
              ) : null}
            </Col>
            <Col lg={1} md={1} sm={1} className="d-flex justify-content-center">
              <img
                draggable="false"
                alt=""
                src={line}
                className={styles["user-setting-row"]}
              />
            </Col>
            <Col lg={3} md={3} sm={3} className="m-0 p-0">
              {calender ? (
                <>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-4 w-100 justify-content-center align-items-center"
                    >
                      <span className={styles["Class_CheckBox2"]}>
                        {t("Calendar-months-span")}
                      </span>
                      <Select
                        options={MonthOptions}
                        defaultValue={{
                          value: userOrganizationSetting.CalenderMonthsSpan,
                          label: `${
                            userOrganizationSetting.CalenderMonthsSpan
                          }  ${
                            userOrganizationSetting.CalenderMonthsSpan === 1
                              ? "Month"
                              : "Months"
                          }`,
                        }}
                        onChange={CalendarSpanChangeHandler}
                        className={styles["selectDormant"]}
                        classNamePrefix={"select_dormant-days"}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
              {securitystate ? (
                <>
                  <Row className="mt-3">
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      className="d-flex gap-4 w-100 justify-content-between align-items-center"
                    >
                      <span className={styles["Class_CheckBox2"]}>
                        {t("Inactivity-days-to-dormant-account")}
                      </span>
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <Select
                        menuShouldScrollIntoView={false}
                        isSearchable={false}
                        options={options}
                        value={{
                          value:
                            userOrganizationSetting.DormatInactiveUsersforDays,
                          label: `${
                            userOrganizationSetting.DormatInactiveUsersforDays
                          } ${
                            userOrganizationSetting.DormatInactiveUsersforDays ===
                            1
                              ? "Day"
                              : "Days"
                          }`,
                        }}
                        onChange={handleChangeDormant}
                        className={styles["selectDormant"]}
                        classNamePrefix={"select_dormant-days"}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      lg={4}
                      md={4}
                      sm={12}
                      className="d-flex gap-4 w-100 justify-content-start align-items-center"
                    >
                      <span className={styles["Class_CheckBox2"]}>
                        {t("Organization-time-zone")}
                      </span>
                    </Col>
                    <Col
                      lg={8}
                      md={8}
                      sm={8}
                      className="d-flex gap-4 w-100 justify-content-start align-items-center"
                    >
                      <Select
                        placeholder={t("Please-select")}
                        value={{
                          label: timeZoneValue.label,
                          value: timeZoneValue.value,
                        }}
                        defaultValue={{
                          label: timeZoneValue.label,
                          value: timeZoneValue.value,
                        }}
                        classNamePrefix={"Select_timezone"}
                        isSearchable={false}
                        menuShouldScrollIntoView={false}
                        options={timezone}
                        onChange={timezoneChangeHandler}
                        className={styles["select_TimeZone"]}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
              {resolution ? (
                <>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-4 w-100 justify-content-center align-items-center"
                    >
                      <span className={styles["Class_CheckBox2"]}>
                        {t("Auto-close-resolution-days")}
                      </span>
                      <Select
                        options={MonthValues}
                        className={styles["selectDormant"]}
                        classNamePrefix={"select_dormant-days"}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
              {meetingsState ? (
                <>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-4 w-100 justify-content-center align-items-center"
                    >
                      <span className={styles["Class_CheckBox3"]}>
                        {t("Maximum-meeting-duration-min")}
                      </span>
                      <TextField
                        type={"number"}
                        change={changeMeetingDuration}
                        value={userOrganizationSetting.MaximumMeetingDuration}
                        name={"maximumduration"}
                        labelclass={"d-none"}
                        width="80px"
                      />
                      {/* <Select options={MonthValues} className={styles["selectDormant"]} classNamePrefix={"select_dormant-days"} /> */}
                    </Col>
                  </Row>
                </>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
          <Button
            text={t("Update")}
            className={styles["New_settings_Update_Button"]}
            onClick={updateOrganizationLevelSettings}
          />
        </Col>
      </Row>
    </section>
  );
};

export default OrganizationLevelConfigUM;
