import React, { useState } from "react";
import styles from "./UserSettings.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import SecurityIcon from "../../../assets/images/SecuritySetting.svg";
import TodoIcon from "../../../assets/images/Todo_icon.svg";
import MeetingIcon from "../../../assets/images/MeetingSetting.svg";
import Calender from "../../../assets/images/CalenderSetting.svg";
import pollsIcon from "../../../assets/images/pollsIcon.svg";
import Committee from "../../../assets/images/CommitteSetting.svg";
import GroupIcon from "../../../assets/images/GroupSetting.svg";
import ResolutionIcon from "../../../assets/images/new_ResolutionIcon2.svg";
import line from "../../../assets/images/Line 27.svg";
import { getUserSetting } from "../../../store/actions/GetUserSetting";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  getGoogleValidToken,
  getMicrosoftValidToken,
  revokeMicrosoftTokenApi,
  revokeToken,
  updateUserSettingFunc,
} from "../../../store/actions/UpdateUserGeneralSetting";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";

const UserSettings = ({ googleClientIDs }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settingReducerData = useSelector(
    (state) => state.settingReducer.UserProfileData
  );
  const microsoftClientID = useSelector(
    (state) => state.settingReducer.microsoftClientID
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

  const [signUpCodeToken, setSignUpCodeToken] = useState("");
  const [userOptionsSettings, setUserOptionsSettings] = useState({
    Is2FAEnabled: false,
    EmailOnNewMeeting: false,
    EmailEditMeeting: false,
    EmailCancelOrDeleteMeeting: false,
    PushNotificationonNewMeeting: false,
    PushNotificationEditMeeting: false,
    PushNotificationCancelledOrDeleteMeeting: false,
    ShowNotificationOnParticipantJoining: false,
    AllowGoogleCalenderSync: false,
    AllowMicrosoftCalenderSync: false,
    EmailWhenAddedToCommittee: false,
    EmailWhenRemovedFromCommittee: false,
    EmailWhenCommitteeIsDissolvedOrArchived: false,
    EmailWhenCommitteeIsSetInactive: false,
    PushNotificationWhenAddedToCommittee: false,
    PushNotificationWhenRemovedFromCommittee: false,
    PushNotificationWhenCommitteeIsDissolvedOrArchived: false,
    PushNotificationWhenCommitteeIsInActive: false,
    PushNotificationwhenCommitteeissetActive: false,
    EmailWhenAddedToGroup: false,
    EmailWhenRemovedFromGroup: false,
    EmailWhenGroupIsDissolvedOrArchived: false,
    EmailWhenGroupisSetInactive: false,
    EmailWhenGroupIsActive: false,
    PushNotificationwhenGroupissetActive: false,
    PushNotificationWhenAddedToGroup: false,
    PushNotificationWhenRemovedFromGroup: false,
    PushNotificationWhenGroupIsDissolvedOrArchived: false,
    PushNotificationWhenGroupIsInActive: false,
    EmailWhenResolutionIsCirculated: false,
    EmailWhenNewResolutionIsCancelledAfterCirculation: false,
    EmailWhenResolutionIsClosed: false,
    PushNotificationWhenNewResolutionIsCirculated: false,
    PushNotificationWhenNewResolutionIsCancelledAfterCirculated: false,
    PushNotificationWhenResolutionISClosed: false,
    DiskusCalenderColor: "",
    GoogleCalenderColor: "",
    MicrosoftCalenderColor: "",
    EmailWhenNewPollIsPublished: false,
    EmailWhenPollDueDateIsPassed: false,
    EmailWhenPublishedPollIsDeleted: false,
    EmailWhenPublishedPollIsUpdated: false,
    PushNotificationWhenNewPollIsPublished: false,
    PushNotificationWhenPollDueDateIsPassed: false,
    PushNotificationWhenPublishedPollIsDeleted: false,
    PushNotificationWhenPublishedPollIsUpdated: false,
    EmailWhenCommitteeIsActive: false,
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
  });
  const [authMicrosoftAccessCode, setAuthMicrosoftAccessCode] = useState("");

  useEffect(() => {
    if (settingReducerData === undefined || settingReducerData === null) {
      dispatch(getUserSetting(navigate, t, false));
    }
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    console.log("Google Code ", response.code);
    setSignUpCodeToken(response.code);
    setUserOptionsSettings({
      ...userOptionsSettings,
      AllowGoogleCalenderSync: true,
    });
  };

  const handleGoogleLoginFailure = (response) => {
    setSignUpCodeToken("");
    setUserOptionsSettings({
      ...userOptionsSettings,
      AllowGoogleCalenderSync: userOptionsSettings.AllowGoogleCalenderSync,
    });
  };

  useEffect(() => {
    if (settingReducerData !== null && settingReducerData !== undefined) {
      if (Object.keys(settingReducerData).length > 0) {
        setUserOptionsSettings({
          Is2FAEnabled: settingReducerData.iS2FAEnabled,
          EmailOnNewMeeting: settingReducerData.emailOnNewMeeting,
          EmailEditMeeting: settingReducerData.emailOnEditMeeting,
          EmailCancelOrDeleteMeeting:
            settingReducerData.emailOnCancelledORDeleteMeeting,
          PushNotificationonNewMeeting:
            settingReducerData.pushNotificationOnNewMeeting,
          PushNotificationEditMeeting:
            settingReducerData.pushNotificationOnEditMeeting,
          PushNotificationCancelledOrDeleteMeeting:
            settingReducerData.pushNotificationonCancelledORDeleteMeeting,
          ShowNotificationOnParticipantJoining:
            settingReducerData.showNotificationOnParticipantJoining,
          AllowGoogleCalenderSync:
            settingReducerData.userAllowGoogleCalendarSynch,
          AllowMicrosoftCalenderSync:
            settingReducerData.userAllowMicrosoftCalendarSynch,
          EmailWhenAddedToCommittee:
            settingReducerData.emailWhenAddedToCommittee,
          EmailWhenRemovedFromCommittee:
            settingReducerData.emailWhenRemovedFromCommittee,
          EmailWhenCommitteeIsDissolvedOrArchived:
            settingReducerData.emailWhenCommitteeIsDissolvedorArchived,
          EmailWhenCommitteeIsSetInactive:
            settingReducerData.emailWhenCommitteeIsInActive,
          EmailWhenCommitteeIsActive:
            settingReducerData.emailWhenCommitteeIsActive,
          PushNotificationWhenAddedToCommittee:
            settingReducerData.pushNotificationWhenAddedToCommittee,
          PushNotificationWhenRemovedFromCommittee:
            settingReducerData.pushNotificationWhenRemovedFromCommittee,
          PushNotificationWhenCommitteeIsDissolvedOrArchived:
            settingReducerData.pushNotificationWhenCommitteeIsDissolvedorArchived,
          PushNotificationWhenCommitteeIsInActive:
            settingReducerData.pushNotificationWhenCommitteeIsInActive,
          PushNotificationwhenCommitteeissetActive:
            settingReducerData.pushNotificationwhenCommitteeissetActive,
          EmailWhenAddedToGroup: settingReducerData.emailWhenAddedToGroup,
          EmailWhenRemovedFromGroup:
            settingReducerData.emailWhenRemovedFromGroup,
          EmailWhenGroupIsDissolvedOrArchived:
            settingReducerData.emailWhenGroupIsClosedorArchived,
          EmailWhenGroupisSetInactive:
            settingReducerData.emailWhenGroupIsInActive,
          PushNotificationwhenGroupissetActive:
            settingReducerData.pushNotificationwhenGroupissetActive,
          EmailWhenGroupIsActive: settingReducerData.emailWhenGroupIsActive,
          PushNotificationWhenAddedToGroup:
            settingReducerData.pushNotificationWhenAddedToGroup,
          PushNotificationWhenRemovedFromGroup:
            settingReducerData.pushNotificationWhenRemoveFromGroup,
          PushNotificationWhenGroupIsDissolvedOrArchived:
            settingReducerData.pushNotificationWhenGroupIsClosedORArchived,
          PushNotificationWhenGroupIsInActive:
            settingReducerData.pushNotificationWhenGroupisSetInactive,
          EmailWhenResolutionIsCirculated:
            settingReducerData.emailWhenNewResolutionIsCirculated,
          EmailWhenNewResolutionIsCancelledAfterCirculation:
            settingReducerData.emailWhenResolutionIsCancelledAfterCirculation,
          EmailWhenResolutionIsClosed:
            settingReducerData.emailWhenResolutionIsClosed,
          PushNotificationWhenNewResolutionIsCirculated:
            settingReducerData.pushNotificationWhenNewResolutionIsCirculated,
          PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
            settingReducerData.pushNotificationWhenWhenResolutionIsCancelledAfterCirculation,
          PushNotificationWhenResolutionISClosed:
            settingReducerData.pushNotificationWhenResolutionIsClosed,
          DiskusCalenderColor: settingReducerData.diskusEventColor,
          GoogleCalenderColor: settingReducerData.googleEventColor,
          MicrosoftCalenderColor: settingReducerData.officeEventColor,
          EmailWhenNewPollIsPublished:
            settingReducerData.emailWhenNewPollIsPublished,
          EmailWhenPollDueDateIsPassed:
            settingReducerData.emailWhenPollDueDateIsPassed,
          EmailWhenPublishedPollIsDeleted:
            settingReducerData.emailWhenPublishedPollIsDeleted,
          EmailWhenPublishedPollIsUpdated:
            settingReducerData.emailWhenPublishedPollIsUpdated,
          PushNotificationWhenNewPollIsPublished:
            settingReducerData.pushNotificationWhenNewPollIsPublished,
          PushNotificationWhenPollDueDateIsPassed:
            settingReducerData.pushNotificationWhenPollDueDateIsPassed,
          PushNotificationWhenPublishedPollIsDeleted:
            settingReducerData.pushNotificationWhenPublishedPollIsDeleted,
          PushNotificationWhenPublishedPollIsUpdated:
            settingReducerData.pushNotificationWhenPublishedPollIsUpdated,
          PushNotificationWhenNewTODOAssigned:
            settingReducerData.pushNotificationWhenNewTODOAssigned,
          PushNotificationWhenNewTODODeleted:
            settingReducerData.pushNotificationWhenNewTODODeleted,
          PushNotificationWhenNewTODOEdited:
            settingReducerData.pushNotificationWhenNewTODOEdited,
          PushNotificationWhenNewCommentAdded:
            settingReducerData.pushNotificationWhenNewCommentAdded,
          PushNotificationWhenCommentDeleted:
            settingReducerData.pushNotificationWhenCommentDeleted,
          EmailWhenCommentDeleted: settingReducerData.emailWhenCommentDeleted,
          EmailWhenNewCommentAdded: settingReducerData.emailWhenNewCommentAdded,
          EmailWhenNewTODOAssigned: settingReducerData.emailWhenNewTODOAssigned,
          EmailWhenNewTODODeleted: settingReducerData.emailWhenNewTODODeleted,
          EmailWhenNewTODOEdited: settingReducerData.emailWhenNewTODOEdited,
        });
      }
    }
  }, [settingReducerData]);

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

  const opentodo = () => {
    setTodo(true);
    setSecuritystate(false);
    setmeetingsState(false);
    setCalender(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
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
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      Is2FAEnabled: value,
    });
  };

  const onChangeEmailOnNewMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailOnNewMeeting: value,
    });
  };

  const onChangeEmailOnEditMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailEditMeeting: value,
    });
  };

  const onChangeEmailOnCancelledOrDeletedMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailCancelOrDeleteMeeting: value,
    });
  };

  const onChangePushNotificationonNewMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationonNewMeeting: value,
    });
  };

  const onChangePushNotificationOnEditMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationEditMeeting: value,
    });
  };

  const onChangePushNotificationOnCancelledOrDeleteMeeting = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationCancelledOrDeleteMeeting: value,
    });
  };

  const onChangeShowNotificationonJoiningParticiapnts = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      ShowNotificationOnParticipantJoining: value,
    });
  };

  const signIn = useGoogleLogin({
    client_id: googleClientIDs !== null ? googleClientIDs : "dummy-client-id",
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginFailure,
    flow: "auth-code",
    cookiePolicy: "single_host_origin",
    scope:
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events", //openid email profile
    access_type: "offline",
    responseType: "code",
    prompt: "consent",
  });

  const onChangeAllowCalenderSync = (e) => {
    try {
      let value = e.target.checked;
      if (value) {
        if (googleClientIDs !== null) {
          signIn();
        } else {
          console.error("Google Client ID not loaded yet.");
        }
      } else {
        setUserOptionsSettings({
          ...userOptionsSettings,
          AllowGoogleCalenderSync: false,
        });
      }
    } catch {}
  };

  async function redirectToUrl() {
    if (microsoftClientID) {
      const baseUrl = process.env.REACT_APP_MS_LOGIN_URL;
      const url = baseUrl.replace(
        /client_id=[^&]+/,
        `client_id=${microsoftClientID}`
      );
      console.log("Client ID", url);
      const windowFeatures = "width=600,height=400,top=100,left=100";
      const popup = window.open(url, "Microsoft Login", windowFeatures);

      // Wait for the popup to close
      await new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            resolve();
          }
        }, 1000); // Check every second
      });
    }
  }

  const onChangeAllowMicrosoftCalenderSync = async (e) => {
    const value = e.target.checked;
    console.log("onChangeAllowMicrosoftCalenderSync", value);
    if (value) {
      await redirectToUrl();
    }
    let code = localStorage.getItem("Ms");
    console.log("MS Code", code);
    if (code) {
      await setUserOptionsSettings({
        ...userOptionsSettings,
        AllowMicrosoftCalenderSync: value,
      });
      await setAuthMicrosoftAccessCode(code);
      localStorage.removeItem("Ms");
    } else {
      setUserOptionsSettings({
        ...userOptionsSettings,
        AllowMicrosoftCalenderSync: false,
      });
      setAuthMicrosoftAccessCode("");
      localStorage.removeItem("Ms");
    }
  };

  const onChangeEmailWhenAddedToCommittee = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenAddedToCommittee: value,
    });
  };

  const onChangeEmailWhenRemovedFromCommittee = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenRemovedFromCommittee: value,
    });
  };

  const onChangeWhenCommitteeIsDissolvedOrArchived = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommitteeIsDissolvedOrArchived: value,
    });
  };

  const onChangeEmailWhenCommitteeIsInActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommitteeIsSetInactive: value,
    });
  };

  const onChangeEmailWhenCommitteeIsActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommitteeIsActive: value,
    });
  };

  const onChangePushNotificationWhenAddedToCommittee = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenAddedToCommittee: value,
    });
  };

  const onChangePushNotificationWhenRemovedFromCommittee = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenRemovedFromCommittee: value,
    });
  };

  const onChangepushNotificationWhenCommitteeIsDissolvedOrArchived = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenCommitteeIsDissolvedOrArchived: value,
    });
  };

  const onChangepushNotificationWhenCommitteeIsInActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenCommitteeIsInActive: value,
    });
  };

  const onChangePushNotificationwhenCommitteeissetActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationwhenCommitteeissetActive: value,
    });
  };

  const onChangeEmailWhenAddedToGroup = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenAddedToGroup: value,
    });
  };

  const onChangeEmailWhenRemovedFromGroup = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenRemovedFromGroup: value,
    });
  };

  const onChangeEmailWhenGroupIsDissolvedOrArchived = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenGroupIsDissolvedOrArchived: value,
    });
  };

  const onChangeWhenGroupIsSetInactive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenGroupisSetInactive: value,
    });
  };

  const onChangeWhenEmailWhenGroupIsActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenGroupIsActive: value,
    });
  };

  const onChangeWhenPushNotificationwhenGroupissetActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationwhenGroupissetActive: value,
    });
  };

  const onChangePushNotificationWhenAddedToGroup = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenAddedToGroup: value,
    });
  };

  const onChangePushNotificationWhenRemovedFromGroup = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenRemovedFromGroup: value,
    });
  };

  const onChangePushNotificationWhenGroupIsDissolvedOrArchived = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenGroupIsDissolvedOrArchived: value,
    });
  };

  const onChangePushNotificationWhenGroupIsSetInActive = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenGroupIsInActive: value,
    });
  };

  const onChangeWhenResolutionIsCirculated = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenResolutionIsCirculated: value,
    });
  };

  const onChangeWhenNewPollIsPublished = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewPollIsPublished: value,
    });
  };

  const onChangeWhenPollsDueDateIsPassed = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPollDueDateIsPassed: value,
    });
  };

  const onChangeWhenPublishedPollIsDeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPublishedPollIsDeleted: value,
    });
  };

  const onChangeWhenPublishedPollIsUpdated = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPublishedPollIsUpdated: value,
    });
  };

  const onChangePushNotificationWhenNewPollIsPublished = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewPollIsPublished: value,
    });
  };

  const onChangePushNotificationWhenPollsDueDateIsPassed = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPollDueDateIsPassed: value,
    });
  };

  const onChangePushNotificationWhenPublishedPollIsDeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPublishedPollIsDeleted: value,
    });
  };

  const onChangePushNotificationWhenPublishedPollisUpdated = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPublishedPollIsUpdated: value,
    });
  };

  const onChangeEmailWhenResolutionIsCancelledAfterCirculation = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewResolutionIsCancelledAfterCirculation: value,
    });
  };

  const onChangeEmailWhenResolutionisClosed = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenResolutionIsClosed: value,
    });
  };

  const onChangePushNotificationWhenResolutionIsCirculated = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewResolutionIsCirculated: value,
    });
  };

  const onChangePushNoficationWhenNewResolutionIsCanelledAfterCirculated = (
    e
  ) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewResolutionIsCancelledAfterCirculated: value,
    });
  };

  const onChangePushNotificationWhenResolutionIsClosed = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenResolutionISClosed: value,
    });
  };

  const onChangeDiskusCalenderColor = (e) => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      DiskusCalenderColor: e.target.value,
    });
  };

  const onChangeGoogleCalenderColor = (e) => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      GoogleCalenderColor: e.target.value,
    });
  };

  const onChangeMicrosoftColorChange = (e) => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      MicrosoftCalenderColor: e.target.value,
    });
  };

  const updateOrganizationLevelSettings = async () => {
    let AllowMicrosoftCalenderSyncCall = false;

    // userOptionsSettings.AllowMicrosoftCalenderSync;
    if (settingReducerData.userAllowMicrosoftCalendarSynch) {
      if (userOptionsSettings.AllowMicrosoftCalenderSync === false) {
        AllowMicrosoftCalenderSyncCall = false;
        dispatch(
          revokeMicrosoftTokenApi(
            navigate,
            userOptionsSettings,
            t,
            userOptionsSettings.AllowGoogleCalenderSync,
            AllowMicrosoftCalenderSyncCall
          )
        );
        // revoke token api hit
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
      } else {
        AllowMicrosoftCalenderSyncCall = true;
        await dispatch(
          updateUserSettingFunc(
            navigate,
            userOptionsSettings,
            t,
            true,
            AllowMicrosoftCalenderSyncCall
          )
        );
      }
    } else if (userOptionsSettings.AllowMicrosoftCalenderSync) {
      console.log(
        "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
        AllowMicrosoftCalenderSyncCall
      );
      if (authMicrosoftAccessCode !== "") {
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
        AllowMicrosoftCalenderSyncCall = await dispatch(
          getMicrosoftValidToken(
            navigate,
            authMicrosoftAccessCode,
            userOptionsSettings,
            userOptionsSettings.AllowMicrosoftCalenderSync,
            t
          )
        );
      }
    }
    if (signUpCodeToken !== "") {
      console.log(
        "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
        AllowMicrosoftCalenderSyncCall
      );
      if (userOptionsSettings.AllowGoogleCalenderSync) {
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
        await dispatch(
          getGoogleValidToken(
            navigate,
            signUpCodeToken,
            userOptionsSettings,
            t,
            AllowMicrosoftCalenderSyncCall
          )
        );
      } else {
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
        await dispatch(
          updateUserSettingFunc(
            navigate,
            userOptionsSettings,
            t,
            true,
            AllowMicrosoftCalenderSyncCall
          )
        );
      }
      setSignUpCodeToken("");
    } else {
      if (settingReducerData.userAllowGoogleCalendarSynch) {
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
        if (userOptionsSettings.AllowGoogleCalenderSync) {
          console.log(
            "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
            AllowMicrosoftCalenderSyncCall
          );
          await dispatch(
            updateUserSettingFunc(
              navigate,
              userOptionsSettings,
              t,
              true,
              AllowMicrosoftCalenderSyncCall
            )
          );
        } else {
          console.log(
            "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
            AllowMicrosoftCalenderSyncCall
          );
          await dispatch(
            revokeToken(
              navigate,
              userOptionsSettings,
              t,
              AllowMicrosoftCalenderSyncCall
            )
          );
        }
      } else {
        console.log(
          "updateOrganizationLevelSettingsupdateOrganizationLevelSettings",
          AllowMicrosoftCalenderSyncCall
        );
        await dispatch(
          updateUserSettingFunc(
            navigate,
            userOptionsSettings,
            t,
            false,
            AllowMicrosoftCalenderSyncCall
          )
        );
      }
    }
  };

  const onChangeEmailWhenNewTODOEdited = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewTODOEdited: value,
    });
  };

  const onChangeEmailWhenNewTODODeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewTODODeleted: value,
    });
  };

  const onChangeEmailWhenNewTODOAssigned = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewTODOAssigned: value,
    });
  };

  const onChangeEmailWhenNewCommentAdded = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewCommentAdded: value,
    });
  };

  const onChangeEmailWhenCommentDeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommentDeleted: value,
    });
  };

  const onChangePushNotificationWhenCommentDeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenCommentDeleted: value,
    });
  };

  const onChangePushNotificationWhenNewCommentAdded = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewCommentAdded: value,
    });
  };

  const onChangePushNotificationWhenNewTODOEdited = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewTODOEdited: value,
    });
  };

  const onChangePushNotificationWhenNewTODODeleted = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewTODODeleted: value,
    });
  };

  const onChangePushNotificationWhenNewTODOAssigned = (e) => {
    let value = e.target.checked;
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewTODOAssigned: value,
    });
  };
  return (
    <>
      <section className={styles["UserConfigsContainer"]}>
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 align-items-center"
          >
            <span className={styles["UserLevelConfig_Heading"]}>
              {t("User-level-configurations")}
            </span>
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className={styles["Padding_around_class"]}
          >
            <Row className="mt-3">
              <Col lg={3} md={3} sm={3}>
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
                        width="25.51px"
                        height="30.69px"
                        alt=""
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
                {checkFeatureIDAvailability(14) ? (
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
                            {t("Tasks")}
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <hr />
                  </>
                ) : null}

                {checkFeatureIDAvailability(1) ||
                checkFeatureIDAvailability(12) ||
                checkFeatureIDAvailability(9) ? (
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

                {checkFeatureIDAvailability(7) ? (
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

                {checkFeatureIDAvailability(48) ? (
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

                {checkFeatureIDAvailability(17) ? (
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
                            width="29px"
                            height="26.04px"
                            alt=""
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

                {checkFeatureIDAvailability(18) ? (
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
                            width={"30px"}
                            height="31.18px"
                            alt=""
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

                {checkFeatureIDAvailability(15) ? (
                  <>
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
                            src={pollsIcon}
                            alt=""
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
                  </>
                ) : null}
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex justify-content-center"
              >
                <img
                  draggable="false"
                  src={line}
                  className={styles["user-setting-row"]}
                  alt=""
                />
              </Col>
              <Col
                lg={4}
                md={4}
                sm={4}
                className="m-0 p-0 justify-content-start"
              >
                {securitystate ? (
                  <>
                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12}>
                        <Checkbox
                          onChange={onChangeIsTwoFaceEnabled}
                          checked={userOptionsSettings.Is2FAEnabled}
                        >
                          <span className={styles["Class_CheckBox"]}>
                            {t("2FA-is-enabled-heading")}
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
                          checked={userOptionsSettings.EmailWhenNewTODOAssigned}
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
                            userOptionsSettings.PushNotificationWhenNewTODOAssigned
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
                          checked={userOptionsSettings.EmailWhenNewTODOEdited}
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
                            userOptionsSettings.PushNotificationWhenNewTODOEdited
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
                          checked={userOptionsSettings.EmailWhenNewTODODeleted}
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
                            userOptionsSettings.PushNotificationWhenNewTODODeleted
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
                          checked={userOptionsSettings.EmailWhenNewCommentAdded}
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
                            userOptionsSettings.PushNotificationWhenNewCommentAdded
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
                          checked={userOptionsSettings.EmailWhenCommentDeleted}
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
                            userOptionsSettings.PushNotificationWhenCommentDeleted
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
                          checked={userOptionsSettings.EmailOnNewMeeting}
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
                            userOptionsSettings.PushNotificationonNewMeeting
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
                          checked={userOptionsSettings.EmailEditMeeting}
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
                            userOptionsSettings.PushNotificationEditMeeting
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
                            userOptionsSettings.EmailCancelOrDeleteMeeting
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
                            userOptionsSettings.PushNotificationCancelledOrDeleteMeeting
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
                          onChange={
                            onChangeShowNotificationonJoiningParticiapnts
                          }
                          checked={
                            userOptionsSettings.ShowNotificationOnParticipantJoining
                          }
                        >
                          <span className={styles["Class_CheckBox"]}>
                            {t("Show-notification-on-joining-participant")}
                          </span>
                        </Checkbox>
                      </Col>
                    </Row>
                  </>
                ) : null}
                {calender ? (
                  <>
                    {userOptionsSettings.AllowGoogleCalenderSync !== null &&
                    googleClientIDs !== null &&
                    roleID !== 1 &&
                    roleID !== 2 ? (
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={(e) => onChangeAllowCalenderSync(e)}
                            checked={
                              userOptionsSettings.AllowGoogleCalenderSync
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Allow-calendar-sync")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                    ) : null}
                    {userOptionsSettings.AllowMicrosoftCalenderSync !== null &&
                    microsoftClientID !== null &&
                    roleID !== 1 &&
                    roleID !== 2 ? (
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <Checkbox
                            onChange={onChangeAllowMicrosoftCalenderSync}
                            checked={
                              userOptionsSettings.AllowMicrosoftCalenderSync
                            }
                          >
                            <span className={styles["Class_CheckBox"]}>
                              {t("Allow-microsoft-calendar-sync")}
                            </span>
                          </Checkbox>
                        </Col>
                      </Row>
                    ) : null}
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
                                userOptionsSettings.EmailWhenAddedToCommittee
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
                                userOptionsSettings.PushNotificationWhenAddedToCommittee
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
                                userOptionsSettings.EmailWhenRemovedFromCommittee
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
                                userOptionsSettings.PushNotificationWhenRemovedFromCommittee
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
                                userOptionsSettings.EmailWhenCommitteeIsDissolvedOrArchived
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
                                userOptionsSettings.PushNotificationWhenCommitteeIsDissolvedOrArchived
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
                                userOptionsSettings.EmailWhenCommitteeIsSetInactive
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
                              onChange={
                                onChangepushNotificationWhenCommitteeIsInActive
                              }
                              checked={
                                userOptionsSettings.PushNotificationWhenCommitteeIsInActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t(
                                  "Push-notification-when-committee-is-inActive"
                                )}
                              </span>
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              onChange={onChangeEmailWhenCommitteeIsActive}
                              checked={
                                userOptionsSettings.EmailWhenCommitteeIsActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t("Email-when-committee-is-set-active")}
                              </span>
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              onChange={
                                onChangePushNotificationwhenCommitteeissetActive
                              }
                              checked={
                                userOptionsSettings.PushNotificationwhenCommitteeissetActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t(
                                  "Push-notification-when-committee-is-set-active"
                                )}
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
                                userOptionsSettings.EmailWhenAddedToGroup
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
                              onChange={
                                onChangePushNotificationWhenAddedToGroup
                              }
                              checked={
                                userOptionsSettings.PushNotificationWhenAddedToGroup
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
                                userOptionsSettings.EmailWhenRemovedFromGroup
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
                                userOptionsSettings.PushNotificationWhenRemovedFromGroup
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
                                userOptionsSettings.EmailWhenGroupIsDissolvedOrArchived
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
                                userOptionsSettings.PushNotificationWhenGroupIsDissolvedOrArchived
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
                                userOptionsSettings.EmailWhenGroupisSetInactive
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
                                userOptionsSettings.PushNotificationWhenGroupIsInActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t("Notify-when-group-becomes-in-active")}
                              </span>
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              onChange={onChangeWhenEmailWhenGroupIsActive}
                              checked={
                                userOptionsSettings.EmailWhenGroupIsActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t("Email-when-group-is-set-active")}
                              </span>
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <Checkbox
                              onChange={
                                onChangeWhenPushNotificationwhenGroupissetActive
                              }
                              checked={
                                userOptionsSettings.PushNotificationwhenGroupissetActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t("Notify-when-group-becomes-active")}
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
                            userOptionsSettings.EmailWhenResolutionIsCirculated
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
                            userOptionsSettings.PushNotificationWhenNewResolutionIsCirculated
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
                            userOptionsSettings.EmailWhenNewResolutionIsCancelledAfterCirculation
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
                            userOptionsSettings.PushNotificationWhenNewResolutionIsCancelledAfterCirculated
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
                            userOptionsSettings.EmailWhenResolutionIsClosed
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
                            userOptionsSettings.PushNotificationWhenResolutionISClosed
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
                            userOptionsSettings.EmailWhenNewPollIsPublished
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
                            userOptionsSettings.PushNotificationWhenNewPollIsPublished
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
                            userOptionsSettings.EmailWhenPollDueDateIsPassed
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
                            userOptionsSettings.PushNotificationWhenPollDueDateIsPassed
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
                            userOptionsSettings.EmailWhenPublishedPollIsDeleted
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
                            userOptionsSettings.PushNotificationWhenPublishedPollIsDeleted
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
                            userOptionsSettings.EmailWhenPublishedPollIsUpdated
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
                            userOptionsSettings.PushNotificationWhenPublishedPollIsUpdated
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
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex justify-content-center"
              >
                <img
                  draggable="false"
                  src={line}
                  className={styles["user-setting-row"]}
                  alt=""
                />
              </Col>
              <Col lg={3} md={3} sm={3}>
                {calender ? (
                  <>
                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["BackGround_Calender_color_box"]}
                      >
                        <Row className="mt-4">
                          <Col
                            lg={8}
                            md={8}
                            sm={12}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <span className={styles["Diskus_calender"]}>
                              {t("Diskus-calendar")}
                            </span>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            className="d-flex  justify-content-start"
                          >
                            <input
                              type="color"
                              className=" m-0 p-0 circle-color-picker"
                              value={userOptionsSettings.DiskusCalenderColor}
                              onChange={onChangeDiskusCalenderColor}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {userOptionsSettings.AllowGoogleCalenderSync !== null &&
                    userOptionsSettings.AllowGoogleCalenderSync !== false &&
                    roleID !== 1 &&
                    roleID !== 2 ? (
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["BackGround_Calender_color_box"]}
                        >
                          <Row className="mt-4">
                            <Col
                              lg={8}
                              md={8}
                              sm={12}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <span className={styles["Diskus_calender"]}>
                                {t("Google-calendar")}
                              </span>
                            </Col>
                            <Col
                              lg={4}
                              md={4}
                              sm={12}
                              className="d-flex  justify-content-start"
                            >
                              <input
                                type="color"
                                className="m-0 p-0 circle-color-picker"
                                value={userOptionsSettings.GoogleCalenderColor}
                                onChange={onChangeGoogleCalenderColor}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ) : null}
                    {userOptionsSettings.AllowMicrosoftCalenderSync !== null &&
                    userOptionsSettings.AllowMicrosoftCalenderSync !== false &&
                    roleID !== 1 &&
                    roleID !== 2 ? (
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["BackGround_Calender_color_box"]}
                        >
                          <Row className="mt-4">
                            <Col
                              lg={9}
                              md={9}
                              sm={9}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <span className={styles["Diskus_calender"]}>
                                {t("Microsoft-calendar")}
                              </span>
                            </Col>
                            <Col lg={3} md={3} sm={3} className="">
                              <input
                                type="color"
                                className="circle-color-picker"
                                value={
                                  userOptionsSettings.MicrosoftCalenderColor
                                }
                                onChange={onChangeMicrosoftColorChange}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ) : null}
                  </>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end mb-2"
          >
            <Button
              text={t("Update")}
              className={styles["New_settings_Update_Button"]}
              onClick={updateOrganizationLevelSettings}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default UserSettings;
