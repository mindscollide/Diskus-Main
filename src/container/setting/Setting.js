import React, { useState, useEffect } from "react";
import { Button, Switch, Notification } from "../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import "./../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Setting.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getGoogleValidToken,
  revokeToken,
  updateUserMessageCleare,
} from "../../store/actions/UpdateUserGeneralSetting";
import { getUserSetting } from "../../store/actions/GetUserSetting";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { showMessage } from "../../components/elements/snack_bar/utill";
const Organization = () => {
  //for translation
  const { settingReducer } = useSelector((state) => state);
  const { UserProfileData } = settingReducer;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [organizationStates, setOrganizationStates] = useState({
    EmailOnNewMeeting: false,
    EmailOnEditMeeting: false,
    PushNotificationOnNewMeeting: false,
    PushNotificationOnEditMeeting: false,
    ShowNotificationonparticipantJoining: false,
    Is2FAVerification: false,
    EmailOnCancelledorDeleteMeeting: false,
    PushNotificationonCancelledORDeleteMeeting: false,
    //NEW DATA FROM HERE STARTED
    DiskusEventColor: "",
    EmailWhenAddedToCommittee: false,
    EmailWhenAddedToGroup: false,
    EmailWhenCommitteeIsDissolvedorArchived: false,
    EmailWhenCommitteeIsInActive: false,
    EmailWhenGroupIsClosedorArchived: false,
    EmailWhenGroupIsInActive: false,
    EmailWhenNewResolutionIsCirculated: false,
    EmailWhenRemovedFromCommittee: false,
    EmailWhenRemovedFromGroup: false,
    EmailWhenResolutionIsCancelledAfterCirculation: false,
    EmailWhenResolutionIsClosed: false,
    PushNotificationWhenAddedToCommittee: false,
    PushNotificationWhenAddedToGroup: false,
    PushNotificationWhenCommitteeIsDissolvedorArchived: false,
    PushNotificationWhenCommitteeIsInActive: false,
    PushNotificationWhenGroupIsClosedORArchived: false,
    PushNotificationWhenGroupisSetInactive: false,
    PushNotificationWhenNewResolutionIsCirculated: false,
    PushNotificationWhenRemoveFromGroup: false,
    PushNotificationWhenRemovedFromCommittee: false,
    PushNotificationWhenResolutionIsClosed: false,
    PushNotificationWhenWhenResolutionIsCancelledAfterCirculation: false,
    UserAllowGoogleCalendarSynch: null,
    UserAllowMicrosoftCalendarSynch: null,
    UserName: "",
    GoogleEventColor: "",
    OfficeEventColor: "",
  });

  const roleID = localStorage.getItem("roleID");
  const { loaded, clientId } = useGoogleLogin({
    clientId:
      "509020224191-pst82a2kqjq33phenb35b0bg1i0q762o.apps.googleusercontent.com",
  });
  const [signUpCodeToken, setSignUpCodeToken] = useState("");

  useEffect(() => {
    if (UserProfileData === undefined || UserProfileData === null) {
      dispatch(getUserSetting(navigate, t, false));
    }
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    setSignUpCodeToken(response.code);
    setOrganizationStates({
      ...organizationStates,
      UserAllowGoogleCalendarSynch: true,
    });
  };

  const handleGoogleLoginFailure = (response) => {
    setSignUpCodeToken("");
    setOrganizationStates({
      ...organizationStates,
      UserAllowGoogleCalendarSynch:
        organizationStates.UserAllowGoogleCalendarSynch,
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

  const emailOnNewMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnNewMeeting: checked,
    });
  };

  const emailOnEditMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnEditMeeting: checked,
    });
  };

  const emailOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailOnCancelledorDeleteMeeting: checked,
    });
  };

  const pushNotificationOnNewMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnNewMeeting: checked,
    });
  };

  const pushNotificationOnEditMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnEditMeeting: checked,
    });
  };

  const showNotificationonparticipantJoining = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      ShowNotificationonparticipantJoining: checked,
    });
  };

  const Is2FAVerificationHandle = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      Is2FAVerification: checked,
    });
  };

  const ChangeEmailWhenAddedToGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenAddedToGroup: checked,
    });
  };

  const ChangeEmailWhenCommitteeIsDissolvedorArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenCommitteeIsDissolvedorArchived: checked,
    });
  };

  const ChangeEmailWhenCommitteeIsInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenCommitteeIsInActive: checked,
    });
  };

  const ChangeEmailWhenGroupIsClosedorArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenGroupIsClosedorArchived: checked,
    });
  };

  const ChangeEmailWhenGroupIsInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenGroupIsInActive: checked,
    });
  };

  const ChangeEmailWhenNewResolutionIsCirculated = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenNewResolutionIsCirculated: checked,
    });
  };

  const ChangeEmailWhenRemovedFromCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenRemovedFromCommittee: checked,
    });
  };

  const ChangeEmailWhenRemovedFromGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenRemovedFromGroup: checked,
    });
  };

  const ChangeEmailWhenResolutionIsCancelledAfterCirculation = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenResolutionIsCancelledAfterCirculation: checked,
    });
  };

  const ChangeEmailWhenResolutionIsClosed = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenResolutionIsClosed: checked,
    });
  };

  const ChangePushNotificationWhenAddedToCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenAddedToCommittee: checked,
    });
  };

  const ChangePushNotificationWhenAddedToGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenAddedToGroup: checked,
    });
  };

  const ChangePushNotificationWhenCommitteeIsDissolvedorArchived = (
    checked
  ) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenCommitteeIsDissolvedorArchived: checked,
    });
  };

  const ChangePushNotificationWhenCommitteeIsInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenCommitteeIsInActive: checked,
    });
  };

  const ChangePushNotificationWhenGroupIsClosedORArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenGroupIsClosedORArchived: checked,
    });
  };

  const ChangePushNotificationWhenGroupisSetInactive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenGroupisSetInactive: checked,
    });
  };

  const ChangePushNotificationWhenNewResolutionIsCirculated = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenNewResolutionIsCirculated: checked,
    });
  };

  const ChangePushNotificationWhenRemoveFromGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenRemoveFromGroup: checked,
    });
  };

  const ChangePushNotificationWhenRemovedFromCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenRemovedFromCommittee: checked,
    });
  };

  const ChangePushNotificationWhenResolutionIsClosed = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenResolutionIsClosed: checked,
    });
  };

  const ChangePushNotificationWhenWhenResolutionIsCancelledAfterCirculation = (
    checked
  ) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenWhenResolutionIsCancelledAfterCirculation: checked,
    });
  };

  const changeUserAllowGoogleCalendarSynch = (checked) => {
    if (checked) {
      signIn();
    } else {
      setOrganizationStates({
        ...organizationStates,
        UserAllowGoogleCalendarSynch: false,
      });
    }
  };

  const ChangeUserAllowMicrosoftCalendarSynch = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      UserAllowMicrosoftCalendarSynch: checked,
    });
  };

  const pushNotificationOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationonCancelledORDeleteMeeting: checked,
    });
  };

  const ChangeEmailWhenAddedToCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenAddedToCommittee: checked,
    });
  };

  const updateOrganizationLevelSettings = async () => {
    if (signUpCodeToken !== "") {
      await dispatch(
        getGoogleValidToken(navigate, signUpCodeToken, organizationStates, t)
      );
      setSignUpCodeToken("");
    } else {
      await dispatch(revokeToken(navigate, organizationStates, t));
    }
  };

  useEffect(() => {
    let userProfileData = settingReducer.UserProfileData;
    if (userProfileData !== null && userProfileData !== undefined) {
      localStorage.setItem(
        "officeEventColor",
        userProfileData.officeEventColor
      );
      localStorage.setItem(
        "googleEventColor",
        userProfileData.googleEventColor
      );
      localStorage.setItem(
        "diskusEventColor",
        userProfileData.diskusEventColor
      );

      let settingData = {
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
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
        EmailWhenCommitteeIsInActive:
          userProfileData.emailWhenCommitteeIsInActive,
        EmailWhenGroupIsClosedorArchived:
          userProfileData.emailWhenGroupIsClosedorArchived,
        EmailWhenGroupIsInActive: userProfileData.emailWhenGroupIsInActive,
        EmailWhenNewResolutionIsCirculated:
          userProfileData.emailWhenNewResolutionIsCirculated,
        EmailWhenRemovedFromCommittee:
          userProfileData.emailWhenRemovedFromCommittee,
        EmailWhenRemovedFromGroup: userProfileData.emailWhenRemovedFromGroup,
        EmailWhenResolutionIsCancelledAfterCirculation:
          userProfileData.emailWhenResolutionIsCancelledAfterCirculation,
        EmailWhenResolutionIsClosed:
          userProfileData.emailWhenResolutionIsClosed,
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
        UserAllowGoogleCalendarSynch:
          userProfileData.userAllowGoogleCalendarSynch,
        UserAllowMicrosoftCalendarSynch:
          userProfileData.userAllowMicrosoftCalendarSynch,
        UserName: userProfileData.userName,
        OfficeEventColor: userProfileData.officeEventColor,
        GoogleEventColor: userProfileData.googleEventColor,
      };
      setOrganizationStates(settingData);
    }
  }, [settingReducer.UserProfileData]);

  const ResetUserConfigurationSetting = () => {
    let userProfileData = settingReducer.UserProfileData;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
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
        EmailWhenCommitteeIsInActive:
          userProfileData.emailWhenCommitteeIsInActive,
        EmailWhenGroupIsClosedorArchived:
          userProfileData.emailWhenGroupIsClosedorArchived,
        EmailWhenGroupIsInActive: userProfileData.emailWhenGroupIsInActive,
        EmailWhenNewResolutionIsCirculated:
          userProfileData.emailWhenNewResolutionIsCirculated,
        EmailWhenRemovedFromCommittee:
          userProfileData.emailWhenRemovedFromCommittee,
        EmailWhenRemovedFromGroup: userProfileData.emailWhenRemovedFromGroup,
        EmailWhenResolutionIsCancelledAfterCirculation:
          userProfileData.emailWhenResolutionIsCancelledAfterCirculation,
        EmailWhenResolutionIsClosed:
          userProfileData.emailWhenResolutionIsClosed,
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
        UserAllowGoogleCalendarSynch:
          userProfileData.userAllowGoogleCalendarSynch,
        UserAllowMicrosoftCalendarSynch:
          userProfileData.userAllowMicrosoftCalendarSynch,
        UserName: userProfileData.userName,
        GoogleEventColor: userProfileData.googleEventColor,
        OfficeEventColor: userProfileData.officeEventColor,
      };
      setOrganizationStates(settingData);
    }
  };

  useEffect(() => {
    if (
      settingReducer.UpdateUserSettingResponseMessage !== "" &&
      settingReducer.UpdateUserSettingResponseMessage !== ""
    ) {
      showMessage(
        settingReducer.UpdateUserSettingResponseMessage,
        "success",
        setOpen
      );
      dispatch(updateUserMessageCleare());
    } else {
      dispatch(updateUserMessageCleare());
    }
  }, [settingReducer.UpdateUserSettingResponseMessage]);

  return (
    <>
      <Container>
        <Col sm={6} xs={12}>
          <Row className="">
            <Col lg={12} md={12} sm={12} xs={12}>
              <label className={styles["settingPage_title"]}>
                {t("Configurations")}
              </label>
            </Col>
          </Row>
          <Col className={styles["OrganizerlevelSetting"]}>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Is-2fa-verification")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="Is2FAVerification"
                  checkedValue={organizationStates.Is2FAVerification || false}
                  onChange={Is2FAVerificationHandle}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            {/* New Data Started Inserting  */}
            {roleID != 1 && roleID != 2 ? (
              <>
                <Row className="mt-3 FontArabicRegular">
                  <Col
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start fw-900"
                  >
                    <label>{t("Diskus-color-theme")}</label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <input
                      type="color"
                      className="m-0 p-0 circle-color-picker"
                      value={organizationStates.DiskusEventColor}
                      onChange={(e) =>
                        setOrganizationStates({
                          ...organizationStates,
                          DiskusEventColor: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
                <span className={styles["bottom-line"]}></span>
              </>
            ) : (
              <></>
            )}

            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-on-edit-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnEditMeeting"
                  checkedValue={organizationStates.EmailOnEditMeeting}
                  onChange={emailOnEditMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-on-cancel-or-delete-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnCancelledMeeting"
                  checkedValue={
                    organizationStates.EmailOnCancelledorDeleteMeeting
                  }
                  onChange={emailOnCancelledMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-added-to-committee")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenAddedToCommittee"
                  checkedValue={
                    organizationStates.EmailWhenAddedToCommittee || false
                  }
                  onChange={ChangeEmailWhenAddedToCommittee}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-added-to-group")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenAddedToGroup"
                  checkedValue={
                    organizationStates.EmailWhenAddedToGroup || false
                  }
                  onChange={ChangeEmailWhenAddedToGroup}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Email-when-committee-is-dissolved-or-archived")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenCommitteeIsDissolvedorArchived"
                  checkedValue={
                    organizationStates.EmailWhenCommitteeIsDissolvedorArchived ||
                    false
                  }
                  onChange={ChangeEmailWhenCommitteeIsDissolvedorArchived}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-committee-is-inActive")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenCommitteeIsInActive"
                  checkedValue={
                    organizationStates.EmailWhenCommitteeIsInActive || false
                  }
                  onChange={ChangeEmailWhenCommitteeIsInActive}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-group-is-closed-or-archived")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenGroupIsClosedorArchived"
                  checkedValue={
                    organizationStates.EmailWhenGroupIsClosedorArchived || false
                  }
                  onChange={ChangeEmailWhenGroupIsClosedorArchived}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-group-is-inActive")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenGroupIsInActive"
                  checkedValue={
                    organizationStates.EmailWhenGroupIsInActive || false
                  }
                  onChange={ChangeEmailWhenGroupIsInActive}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-new-resolution-is-circulated")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenNewResolutionIsCirculated"
                  checkedValue={
                    organizationStates.EmailWhenNewResolutionIsCirculated ||
                    false
                  }
                  onChange={ChangeEmailWhenNewResolutionIsCirculated}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-removed-from-committee")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenRemovedFromCommittee"
                  checkedValue={
                    organizationStates.EmailWhenRemovedFromCommittee || false
                  }
                  onChange={ChangeEmailWhenRemovedFromCommittee}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-removed-from-group")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenRemovedFromGroup"
                  checkedValue={
                    organizationStates.EmailWhenRemovedFromGroup || false
                  }
                  onChange={ChangeEmailWhenRemovedFromGroup}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Email-when-resolution-is-cancelled-after-circulation")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenResolutionIsCancelledAfterCirculation"
                  checkedValue={
                    organizationStates.EmailWhenResolutionIsCancelledAfterCirculation ||
                    false
                  }
                  onChange={
                    ChangeEmailWhenResolutionIsCancelledAfterCirculation
                  }
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-when-resolution-is-closed")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailWhenResolutionIsClosed"
                  checkedValue={
                    organizationStates.EmailWhenResolutionIsClosed || false
                  }
                  onChange={ChangeEmailWhenResolutionIsClosed}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-on-new-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="EmailOnNewMeeting"
                  checkedValue={organizationStates.EmailOnNewMeeting}
                  onChange={emailOnNewMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-when-added-to-committee")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenAddedToCommittee"
                  checkedValue={
                    organizationStates.PushNotificationWhenAddedToCommittee ||
                    false
                  }
                  onChange={ChangePushNotificationWhenAddedToCommittee}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-when-added-to-group")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenAddedToGroup"
                  checkedValue={
                    organizationStates.PushNotificationWhenAddedToGroup || false
                  }
                  onChange={ChangePushNotificationWhenAddedToGroup}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t(
                    "Push-notification-when-committee-is-dissolved-or-archived"
                  )}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenCommitteeIsDissolvedorArchived"
                  checkedValue={
                    organizationStates.PushNotificationWhenCommitteeIsDissolvedorArchived ||
                    false
                  }
                  onChange={
                    ChangePushNotificationWhenCommitteeIsDissolvedorArchived
                  }
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-committee-is-inActive")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenCommitteeIsInActive"
                  checkedValue={
                    organizationStates.PushNotificationWhenCommitteeIsInActive ||
                    false
                  }
                  onChange={ChangePushNotificationWhenCommitteeIsInActive}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-group-is-closed-or-archived")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenGroupIsClosedORArchived"
                  checkedValue={
                    organizationStates.PushNotificationWhenGroupIsClosedORArchived ||
                    false
                  }
                  onChange={ChangePushNotificationWhenGroupIsClosedORArchived}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-group-is-set-inactive")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenGroupisSetInactive"
                  checkedValue={
                    organizationStates.PushNotificationWhenGroupisSetInactive ||
                    false
                  }
                  onChange={ChangePushNotificationWhenGroupisSetInactive}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-new-resolution-is-circulated")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenNewResolutionIsCirculated"
                  checkedValue={
                    organizationStates.PushNotificationWhenNewResolutionIsCirculated ||
                    false
                  }
                  onChange={ChangePushNotificationWhenNewResolutionIsCirculated}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-when-remove-from-group")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenRemoveFromGroup"
                  checkedValue={
                    organizationStates.PushNotificationWhenRemoveFromGroup ||
                    false
                  }
                  onChange={ChangePushNotificationWhenRemoveFromGroup}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-removed-from-committee")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenRemovedFromCommittee"
                  checkedValue={
                    organizationStates.PushNotificationWhenRemovedFromCommittee ||
                    false
                  }
                  onChange={ChangePushNotificationWhenRemovedFromCommittee}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-when-resolution-is-closed")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenResolutionIsClosed"
                  checkedValue={
                    organizationStates.PushNotificationWhenResolutionIsClosed ||
                    false
                  }
                  onChange={ChangePushNotificationWhenResolutionIsClosed}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t(
                    "Push-notification-when-when-resolution-is-cancelled-after-circulation"
                  )}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationWhenWhenResolutionIsCancelledAfterCirculation"
                  checkedValue={
                    organizationStates.PushNotificationWhenWhenResolutionIsCancelledAfterCirculation ||
                    false
                  }
                  onChange={
                    ChangePushNotificationWhenWhenResolutionIsCancelledAfterCirculation
                  }
                />
              </Col>
            </Row>
            {/* only for user */}
            {organizationStates.UserAllowGoogleCalendarSynch !== null &&
            roleID != 1 &&
            roleID != 2 ? (
              <>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 FontArabicRegular">
                  <Col
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start fw-900"
                  >
                    <label>{t("User-allow-google-calendar-synch")}</label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      name="UserAllowGoogleCalendarSynch"
                      checkedValue={
                        organizationStates.UserAllowGoogleCalendarSynch || false
                      }
                      onChange={changeUserAllowGoogleCalendarSynch}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <></>
            )}
            {organizationStates.UserAllowGoogleCalendarSynch === true &&
            roleID != 1 &&
            roleID != 2 ? (
              <>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 FontArabicRegular">
                  <Col
                    lg={9}
                    md={9}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start fw-900"
                  >
                    <label>{t("Google-calender-color")}</label>
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <input
                      type="color"
                      className="m-0 p-0 circle-color-picker"
                      value={organizationStates.GoogleEventColor}
                      onChange={(e) =>
                        setOrganizationStates({
                          ...organizationStates,
                          GoogleEventColor: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <></>
            )}
            {organizationStates.UserAllowMicrosoftCalendarSynch !== null &&
            roleID != 1 &&
            roleID != 2 ? (
              <>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 FontArabicRegular">
                  <Col
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start fw-900"
                  >
                    <label>{t("User-allow-microsoft-calendar-synch")}</label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      name="UserAllowMicrosoftCalendarSynch"
                      checkedValue={
                        organizationStates.UserAllowMicrosoftCalendarSynch ||
                        false
                      }
                      onChange={ChangeUserAllowMicrosoftCalendarSynch}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <></>
            )}

            {organizationStates.UserAllowMicrosoftCalendarSynch === true &&
            roleID != 1 &&
            roleID != 2 ? (
              <>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 FontArabicRegular">
                  <Col
                    lg={9}
                    md={9}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start fw-900"
                  >
                    <label>{t("Microsoft-calender-color")}</label>
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end  "
                  >
                    <input
                      type="color"
                      className="m-0 p-0 circle-color-picker"
                      value={organizationStates.OfficeEventColor}
                      onChange={(e) =>
                        setOrganizationStates({
                          ...organizationStates,
                          OfficeEventColor: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <></>
            )}
            {/* upper for user */}
            {/* New Data Ends */}
            <span className={styles["bottom-line"]}></span>

            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-on-new-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnNewMeeting"
                  checkedValue={organizationStates.PushNotificationOnNewMeeting}
                  onChange={pushNotificationOnNewMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-on-edit-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnEditMeeting"
                  checkedValue={
                    organizationStates.PushNotificationOnEditMeeting
                  }
                  onChange={pushNotificationOnEditMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>
                  {t("Push-notification-on-cancel-or-delete-meeting")}
                </label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationonCancelledORDeleteMeeting"
                  checkedValue={
                    organizationStates.PushNotificationonCancelledORDeleteMeeting
                  }
                  onChange={pushNotificationOnCancelledMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3 FontArabicRegular">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Show-notification-on-participant-joining")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="ShowNotificationonparticipantJoining"
                  checkedValue={
                    organizationStates.ShowNotificationonparticipantJoining
                  }
                  onChange={showNotificationonparticipantJoining}
                />
              </Col>
            </Row>
          </Col>
          <Row className="my-2">
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-start">
              <Button
                className={styles["organization-level-resetBtn"]}
                text={t("Reset")}
                onClick={ResetUserConfigurationSetting}
              />
            </Col>
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-end">
              <Button
                onClick={updateOrganizationLevelSettings}
                className={styles["organization-level-updateBtn"]}
                text={t("Update")}
              />
            </Col>
          </Row>
        </Col>
      </Container>
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.flag })}
        severity={open.severity}
      />
    </>
  );
};

export default Organization;
