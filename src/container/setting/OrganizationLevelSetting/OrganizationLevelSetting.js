import React, { useState } from "react";
import styles from "./UserSettings.module.css";
import { Col, Row } from "react-bootstrap";
import { Loader, Button } from "../../../components/elements";
import backbutton from "../../../assets/images/backbutton.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import SecurityIcon from "../../../assets/images/SecuritySetting.svg";
import MeetingIcon from "../../../assets/images/MeetingSetting.svg";
import Calender from "../../../assets/images/CalenderSetting.svg";
import pollsIcon from "../../../assets/images/pollsIcon.svg";
import Committee from "../../../assets/images/CommitteSetting.svg";
import GroupIcon from "../../../assets/images/GroupSetting.svg";
import ResolutionIcon from "../../../assets/images/ResolutionSetting.svg";
import line from "../../../assets/images/Line 27.svg";
import { getUserSetting } from "../../../store/actions/GetUserSetting";
import { useEffect } from "react";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
  useGoogleLogout,
} from "@react-oauth/google";
import {
  getGoogleValidToken,
  revokeToken,
} from "../../../store/actions/UpdateUserGeneralSetting";
const UserSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settingReducer } = useSelector((state) => state);
  const [securitystate, setSecuritystate] = useState(false);
  const [meetingsState, setmeetingsState] = useState(false);
  const [calender, setCalender] = useState(false);
  const [committee, setCommittee] = useState(false);
  const [group, setGroup] = useState(false);
  const [resolution, setResolution] = useState(false);
  const [polls, setpolls] = useState(false);
  const roleID = localStorage.getItem("roleID");
  const { loaded, clientId } = useGoogleLogin({
    clientId:
      "509020224191-pst82a2kqjq33phenb35b0bg1i0q762o.apps.googleusercontent.com",
  });
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
    AllowCalenderSync: false,
    AllowMicrosoftCalenderSync: false,
    EmailWhenAddedToCommittee: false,
    EmailWhenRemovedFromCommittee: false,
    EmailWhenCommitteeIsDissolvedOrArchived: false,
    EmailWhenCommitteeIsSetInactive: false,
    PushNotificationWhenAddedToCommittee: false,
    PushNotificationWhenRemovedFromCommittee: false,
    PushNotificationWhenCommitteeIsDissolvedOrArchived: false,
    PushNotificationWhenCommitteeIsInActive: false,
    EmailWhenAddedToGroup: false,
    EmailWhenRemovedFromGroup: false,
    EmailWhenGroupIsDissolvedOrArchived: false,
    EmailWhenGroupisSetInactive: false,
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
  });

  useEffect(() => {
    dispatch(getUserSetting(navigate, t));
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    console.log(response.code);
    setSignUpCodeToken(response.code);
    setUserOptionsSettings({
      ...userOptionsSettings,
      AllowCalenderSync: true,
    });
  };

  const handleGoogleLoginFailure = (response) => {
    console.log(response);
    setSignUpCodeToken("");
    setUserOptionsSettings({
      ...userOptionsSettings,
      AllowMicrosoftCalenderSync:
        userOptionsSettings.AllowMicrosoftCalenderSync,
    });
  };

  const signIn = useGoogleLogin({
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

  useEffect(() => {
    if (
      settingReducer.UserProfileData !== null &&
      settingReducer.UserProfileData !== undefined
    ) {
      if (Object.keys(settingReducer.UserProfileData).length > 0) {
        setUserOptionsSettings({
          Is2FAEnabled: settingReducer.UserProfileData.iS2FAEnabled,
          EmailOnNewMeeting: settingReducer.UserProfileData.emailOnNewMeeting,
          EmailEditMeeting: settingReducer.UserProfileData.emailOnEditMeeting,
          EmailCancelOrDeleteMeeting:
            settingReducer.UserProfileData.emailOnCancelledORDeleteMeeting,
          PushNotificationonNewMeeting:
            settingReducer.UserProfileData.pushNotificationOnNewMeeting,
          PushNotificationEditMeeting:
            settingReducer.UserProfileData.pushNotificationOnEditMeeting,
          PushNotificationCancelledOrDeleteMeeting:
            settingReducer.UserProfileData
              .pushNotificationonCancelledORDeleteMeeting,
          ShowNotificationOnParticipantJoining:
            settingReducer.UserProfileData.showNotificationOnParticipantJoining,
          AllowCalenderSync:
            settingReducer.UserProfileData.userAllowGoogleCalendarSynch,
          AllowMicrosoftCalenderSync:
            settingReducer.UserProfileData.userAllowMicrosoftCalendarSynch,
          EmailWhenAddedToCommittee:
            settingReducer.UserProfileData.emailWhenAddedToCommittee,
          EmailWhenRemovedFromCommittee:
            settingReducer.UserProfileData.emailWhenRemovedFromCommittee,
          EmailWhenCommitteeIsDissolvedOrArchived:
            settingReducer.UserProfileData
              .emailWhenCommitteeIsDissolvedorArchived,
          EmailWhenCommitteeIsSetInactive:
            settingReducer.UserProfileData.emailWhenCommitteeIsInActive,
          PushNotificationWhenAddedToCommittee:
            settingReducer.UserProfileData.pushNotificationWhenAddedToCommittee,
          PushNotificationWhenRemovedFromCommittee:
            settingReducer.UserProfileData
              .pushNotificationWhenRemovedFromCommittee,
          PushNotificationWhenCommitteeIsDissolvedOrArchived:
            settingReducer.UserProfileData
              .pushNotificationWhenCommitteeIsDissolvedorArchived,
          PushNotificationWhenCommitteeIsInActive:
            settingReducer.UserProfileData
              .pushNotificationWhenCommitteeIsInActive,
          EmailWhenAddedToGroup:
            settingReducer.UserProfileData.emailWhenAddedToGroup,
          EmailWhenRemovedFromGroup:
            settingReducer.UserProfileData.emailWhenRemovedFromGroup,
          EmailWhenGroupIsDissolvedOrArchived:
            settingReducer.UserProfileData.emailWhenGroupIsClosedorArchived,
          EmailWhenGroupisSetInactive:
            settingReducer.UserProfileData.emailWhenGroupIsInActive,
          PushNotificationWhenAddedToGroup:
            settingReducer.UserProfileData.pushNotificationWhenAddedToGroup,
          PushNotificationWhenRemovedFromGroup:
            settingReducer.UserProfileData.pushNotificationWhenRemoveFromGroup,
          PushNotificationWhenGroupIsDissolvedOrArchived:
            settingReducer.UserProfileData
              .pushNotificationWhenGroupIsClosedORArchived,
          PushNotificationWhenGroupIsInActive:
            settingReducer.UserProfileData
              .pushNotificationWhenGroupisSetInactive,
          EmailWhenResolutionIsCirculated:
            settingReducer.UserProfileData.emailWhenNewResolutionIsCirculated,
          EmailWhenNewResolutionIsCancelledAfterCirculation:
            settingReducer.UserProfileData
              .emailWhenResolutionIsCancelledAfterCirculation,
          EmailWhenResolutionIsClosed:
            settingReducer.UserProfileData.emailWhenResolutionIsClosed,
          PushNotificationWhenNewResolutionIsCirculated:
            settingReducer.UserProfileData
              .pushNotificationWhenNewResolutionIsCirculated,
          PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
            settingReducer.UserProfileData
              .pushNotificationWhenWhenResolutionIsCancelledAfterCirculation,
          PushNotificationWhenResolutionISClosed:
            settingReducer.UserProfileData
              .pushNotificationWhenResolutionIsClosed,
          DiskusCalenderColor: settingReducer.UserProfileData.diskusEventColor,
          GoogleCalenderColor: settingReducer.UserProfileData.googleEventColor,
          MicrosoftCalenderColor:
            settingReducer.UserProfileData.officeEventColor,
          EmailWhenNewPollIsPublished:
            settingReducer.UserProfileData.emailWhenNewPollIsPublished,
          EmailWhenPollDueDateIsPassed:
            settingReducer.UserProfileData.emailWhenPollDueDateIsPassed,
          EmailWhenPublishedPollIsDeleted:
            settingReducer.UserProfileData.emailWhenPublishedPollIsDeleted,
          EmailWhenPublishedPollIsUpdated:
            settingReducer.UserProfileData.emailWhenPublishedPollIsUpdated,
          PushNotificationWhenNewPollIsPublished:
            settingReducer.UserProfileData
              .pushNotificationWhenNewPollIsPublished,
          PushNotificationWhenPollDueDateIsPassed:
            settingReducer.UserProfileData
              .pushNotificationWhenPollDueDateIsPassed,
          PushNotificationWhenPublishedPollIsDeleted:
            settingReducer.UserProfileData
              .pushNotificationWhenPublishedPollIsDeleted,
          PushNotificationWhenPublishedPollIsUpdated:
            settingReducer.UserProfileData
              .pushNotificationWhenPublishedPollIsUpdated,
        });
      }
    }
  }, [settingReducer.UserProfileData]);

  const openSecurityTab = () => {
    setSecuritystate(true);
    setmeetingsState(false);
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
  };

  const openCalenderTab = () => {
    setCalender(true);
    setmeetingsState(false);
    setSecuritystate(false);
    setCommittee(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
  };

  const openCommitteTab = () => {
    setCommittee(true);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setGroup(false);
    setResolution(false);
    setpolls(false);
  };

  const openGroupTab = () => {
    setGroup(true);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setResolution(false);
    setpolls(false);
  };

  const openResolutionTab = () => {
    setResolution(true);
    setGroup(false);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
    setpolls(false);
  };
  const openPollsTab = () => {
    setpolls(true);
    setResolution(false);
    setGroup(false);
    setCommittee(false);
    setCalender(false);
    setmeetingsState(false);
    setSecuritystate(false);
  };
  const onChangeIsTwoFaceEnabled = (e) => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      Is2FAEnabled: !userOptionsSettings.Is2FAEnabled,
    });
  };

  const onChangeEmailOnNewMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailOnNewMeeting: !userOptionsSettings.EmailOnNewMeeting,
    });
  };

  const onChangeEmailOnEditMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailEditMeeting: !userOptionsSettings.EmailEditMeeting,
    });
  };

  const onChangeEmailOnCancelledOrDeletedMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailCancelOrDeleteMeeting:
        !userOptionsSettings.EmailCancelOrDeleteMeeting,
    });
  };

  const onChangePushNotificationonNewMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationonNewMeeting:
        !userOptionsSettings.PushNotificationonNewMeeting,
    });
  };

  const onChangePushNotificationOnEditMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationEditMeeting:
        !userOptionsSettings.PushNotificationEditMeeting,
    });
  };

  const onChangePushNotificationOnCancelledOrDeleteMeeting = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationCancelledOrDeleteMeeting:
        !userOptionsSettings.PushNotificationCancelledOrDeleteMeeting,
    });
  };

  const onChangeShowNotificationonJoiningParticiapnts = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      ShowNotificationOnParticipantJoining:
        !userOptionsSettings.ShowNotificationOnParticipantJoining,
    });
  };

  const onChangeAllowCalenderSync = (checked) => {
    if (checked) {
      signIn();
    } else {
      setUserOptionsSettings({
        ...userOptionsSettings,
        AllowCalenderSync: !userOptionsSettings.AllowCalenderSync,
      });
    }
  };

  const onChangeAllowMicrosoftCalenderSync = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      AllowMicrosoftCalenderSync:
        !userOptionsSettings.AllowMicrosoftCalenderSync,
    });
  };

  const onChangeEmailWhenAddedToCommittee = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenAddedToCommittee: !userOptionsSettings.EmailWhenAddedToCommittee,
    });
  };

  const onChangeEmailWhenRemovedFromCommittee = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenRemovedFromCommittee:
        !userOptionsSettings.EmailWhenRemovedFromCommittee,
    });
  };

  const onChangeWhenCommitteeIsDissolvedOrArchived = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommitteeIsDissolvedOrArchived:
        !userOptionsSettings.EmailWhenCommitteeIsDissolvedOrArchived,
    });
  };

  const onChangeEmailWhenCommitteeIsInActive = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenCommitteeIsSetInactive:
        !userOptionsSettings.EmailWhenCommitteeIsSetInactive,
    });
  };

  const onChangePushNotificationWhenAddedToCommittee = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenAddedToCommittee:
        !userOptionsSettings.PushNotificationWhenAddedToCommittee,
    });
  };

  const onChangePushNotificationWhenRemovedFromCommittee = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenRemovedFromCommittee:
        !userOptionsSettings.PushNotificationWhenRemovedFromCommittee,
    });
  };

  const onChangepushNotificationWhenCommitteeIsDissolvedOrArchived = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenCommitteeIsDissolvedOrArchived:
        !userOptionsSettings.PushNotificationWhenCommitteeIsDissolvedOrArchived,
    });
  };

  const onChangepushNotificationWhenCommitteeIsInActive = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenCommitteeIsInActive:
        !userOptionsSettings.PushNotificationWhenCommitteeIsInActive,
    });
  };

  const onChangeEmailWhenAddedToGroup = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenAddedToGroup: !userOptionsSettings.EmailWhenAddedToGroup,
    });
  };

  const onChangeEmailWhenRemovedFromGroup = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenRemovedFromGroup: !userOptionsSettings.EmailWhenRemovedFromGroup,
    });
  };

  const onChangeEmailWhenGroupIsDissolvedOrArchived = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenGroupIsDissolvedOrArchived:
        !userOptionsSettings.EmailWhenGroupIsDissolvedOrArchived,
    });
  };

  const onChangeWhenGroupIsSetInactive = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenGroupisSetInactive:
        !userOptionsSettings.EmailWhenGroupisSetInactive,
    });
  };

  const onChangePushNotificationWhenAddedToGroup = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenAddedToGroup:
        !userOptionsSettings.PushNotificationWhenAddedToGroup,
    });
  };

  const onChangePushNotificationWhenRemovedFromGroup = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenRemovedFromGroup:
        !userOptionsSettings.PushNotificationWhenRemovedFromGroup,
    });
  };

  const onChangePushNotificationWhenGroupIsDissolvedOrArchived = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenGroupIsDissolvedOrArchived:
        !userOptionsSettings.PushNotificationWhenGroupIsDissolvedOrArchived,
    });
  };

  const onChangePushNotificationWhenGroupIsSetInActive = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenGroupIsInActive:
        !userOptionsSettings.PushNotificationWhenGroupIsInActive,
    });
  };

  const onChangeWhenResolutionIsCirculated = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenResolutionIsCirculated:
        !userOptionsSettings.EmailWhenResolutionIsCirculated,
    });
  };

  const onChangeWhenNewPollIsPublished = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewPollIsPublished:
        !userOptionsSettings.EmailWhenNewPollIsPublished,
    });
  };

  const onChangeWhenPollsDueDateIsPassed = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPollDueDateIsPassed:
        !userOptionsSettings.EmailWhenPollDueDateIsPassed,
    });
  };

  const onChangeWhenPublishedPollIsDeleted = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPublishedPollIsDeleted:
        !userOptionsSettings.EmailWhenPublishedPollIsDeleted,
    });
  };

  const onChangeWhenPublishedPollIsUpdated = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenPublishedPollIsUpdated:
        !userOptionsSettings.EmailWhenPublishedPollIsUpdated,
    });
  };

  const onChangePushNotificationWhenNewPollIsPublished = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewPollIsPublished:
        !userOptionsSettings.PushNotificationWhenNewPollIsPublished,
    });
  };

  const onChangePushNotificationWhenPollsDueDateIsPassed = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPollDueDateIsPassed:
        !userOptionsSettings.PushNotificationWhenPollDueDateIsPassed,
    });
  };

  const onChangePushNotificationWhenPublishedPollIsDeleted = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPublishedPollIsDeleted:
        !userOptionsSettings.PushNotificationWhenPublishedPollIsDeleted,
    });
  };

  const onChangePushNotificationWhenPublishedPollisUpdated = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenPublishedPollIsUpdated:
        !userOptionsSettings.PushNotificationWhenPublishedPollIsUpdated,
    });
  };

  const onChangeEmailWhenResolutionIsCancelledAfterCirculation = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenNewResolutionIsCancelledAfterCirculation:
        !userOptionsSettings.EmailWhenNewResolutionIsCancelledAfterCirculation,
    });
  };

  const onChangeEmailWhenResolutionisClosed = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      EmailWhenResolutionIsClosed:
        !userOptionsSettings.EmailWhenResolutionIsClosed,
    });
  };

  const onChangePushNotificationWhenResolutionIsCirculated = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenNewResolutionIsCirculated:
        !userOptionsSettings.PushNotificationWhenNewResolutionIsCirculated,
    });
  };

  const onChangePushNoficationWhenNewResolutionIsCanelledAfterCirculated =
    () => {
      setUserOptionsSettings({
        ...userOptionsSettings,
        PushNotificationWhenNewResolutionIsCancelledAfterCirculated:
          !userOptionsSettings.PushNotificationWhenNewResolutionIsCancelledAfterCirculated,
      });
    };

  const onChangePushNotificationWhenResolutionIsClosed = () => {
    setUserOptionsSettings({
      ...userOptionsSettings,
      PushNotificationWhenResolutionISClosed:
        !userOptionsSettings.PushNotificationWhenResolutionISClosed,
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
    if (signUpCodeToken != "") {
      await dispatch(
        getGoogleValidToken(navigate, signUpCodeToken, userOptionsSettings, t)
      );
      setSignUpCodeToken("");
    } else {
      await dispatch(revokeToken(navigate, userOptionsSettings, t));
    }
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
            <img src={backbutton} width="34.88px" height="34.88px" />
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
                        src={SecurityIcon}
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
                <div onClick={openMeetingTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img src={MeetingIcon} width="35.79px" height="27.3px" />
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
                <div className="cursor-pointer" onClick={openCalenderTab}>
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img src={Calender} width="28.47px" height="28.47px" />
                    </Col>
                    <Col lg={10} md={10} ms={12}>
                      <span
                        className={
                          calender
                            ? styles["Options_headings_active"]
                            : styles["Options_headings"]
                        }
                      >
                        {t("Calender")}
                      </span>
                    </Col>
                  </Row>
                </div>
                <hr />
                <div onClick={openCommitteTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img src={Committee} width="35.8px" height="34.63px" />
                    </Col>
                    <Col lg={10} md={10} ms={12}>
                      <span
                        className={
                          committee
                            ? styles["Options_headings_active"]
                            : styles["Options_headings"]
                        }
                      >
                        {t("Committee")}
                      </span>
                    </Col>
                  </Row>
                </div>
                <hr />
                <div onClick={openGroupTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img src={GroupIcon} width="29px" height="26.04px" />
                    </Col>
                    <Col lg={10} md={10} ms={12}>
                      <span
                        className={
                          group
                            ? styles["Options_headings_active"]
                            : styles["Options_headings"]
                        }
                      >
                        {t("Group")}
                      </span>
                    </Col>
                  </Row>
                </div>
                <hr />
                <div onClick={openResolutionTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img
                        src={ResolutionIcon}
                        width="27.4px"
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
                        {t("Resolution")}
                      </span>
                    </Col>
                  </Row>
                </div>
                <hr />
                <div onClick={openPollsTab} className="cursor-pointer">
                  <Row className="mt-3">
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <img src={pollsIcon} width="33.52px" height="34.59px" />
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
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex justify-content-center"
              >
                <img src={line} className={styles["user-setting-row"]} />
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
                            {t("2FA-is-enabled")}
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
                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12}>
                        <Checkbox
                          onChange={onChangeAllowCalenderSync}
                          checked={userOptionsSettings.AllowCalenderSync}
                        >
                          <span className={styles["Class_CheckBox"]}>
                            {t("Allow-calender-sync")}
                          </span>
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12}>
                        <Checkbox
                          onChange={onChangeAllowMicrosoftCalenderSync}
                          checked={
                            userOptionsSettings.AllowMicrosoftCalenderSync
                          }
                        >
                          <span className={styles["Class_CheckBox"]}>
                            {t("Allow-microsoft-calender-sync")}
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
                              onChange={
                                onChangePushNotificationWhenGroupIsSetInActive
                              }
                              checked={
                                userOptionsSettings.PushNotificationWhenGroupIsInActive
                              }
                            >
                              <span className={styles["Class_CheckBox"]}>
                                {t("Push-notification-when-group-is-inActive")}
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
                <img src={line} className={styles["user-setting-row"]} />
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
                              {t("Diskus-calender")}
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
                              {t("Google-calender")}
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
                              {t("Microsoft-calender")}
                            </span>
                          </Col>
                          <Col lg={3} md={3} sm={3} className="">
                            <input
                              type="color"
                              className="circle-color-picker"
                              value={userOptionsSettings.MicrosoftCalenderColor}
                              onChange={onChangeMicrosoftColorChange}
                            />
                          </Col>
                        </Row>
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
      {settingReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default UserSettings;
