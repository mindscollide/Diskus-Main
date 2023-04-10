import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Paper,
  Accordian,
  Notification,
  Loader,
  TextField,
} from "../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import "./../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Setting.module.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import getTimeZone from "../../store/actions/GetTimeZone";
import getCountryCodeFunc from "../../store/actions/GetCountryCode";
import {
  getOrganizationLevelSetting,
  updateOrganizationLevelSetting,
} from "../../store/actions/OrganizationSettings";
import {
  updateUserMessageCleare,
  updateUserSettingFunc,
} from "../../store/actions/UpdateUserGeneralSetting";

const Organization = () => {
  //for translation
  const { settingReducer } = useSelector((state) => state);
  console.log("settingReducersettingReducersettingReducer", settingReducer);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [timedurationValues, setTimeDurationValues] = useState([
    {
      label: 1,
      value: 1,
    },
    {
      label: 2,
      value: 2,
    },
    {
      label: 3,
      value: 3,
    },
    {
      label: 4,
      value: 4,
    },
    {
      label: 5,
      value: 5,
    },
    {
      label: 6,
      value: 6,
    },
    {
      label: 7,
      value: 7,
    },
    {
      label: 8,
      value: 8,
    },
    {
      label: 9,
      value: 9,
    },
    {
      label: 10,
      value: 10,
    },
    {
      label: 11,
      value: 11,
    },
    {
      label: 12,
      value: 12,
    },
    {
      label: 13,
      value: 13,
    },
    {
      label: 14,
      value: 14,
    },
    {
      label: 15,
      value: 15,
    },
  ]);

  const [organizationStates, setOrganizationStates] = useState({
    SynchronizeDocuments: false,
    DisableMeetingScheduling: false,
    EmailOnNewMeeting: false,
    EmailOnEditMeeting: false,
    EmailOnCancelledMeeting: false,
    PushNotificationOnNewMeeting: false,
    PushNotificationOnEditMeeting: false,
    PushNotificationOnCancelledMeeting: false,
    ShowNotificationonparticipantJoining: false,
    DormatInactiveUsersforDays: "",
    MaximumMeetingDuration: 0,
    Is2FAVerification: false
  });
  const [timeZoneValue, setTimeZoneValue] = useState({
    label: "",
    value: "",
  });

  const [timezone, setTimeZone] = useState([]);
  const [countrycode, setCountryCode] = useState([]);
  const [countryCodeValue, setCountryCodeValue] = useState({
    label: "",
    value: "",
  });
  const synchronizeDocuments = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      SynchronizeDocuments: checked,
    });
  };

  const disableMeetingScheduling = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      DisableMeetingScheduling: checked,
    });
  };

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
      EmailOnCancelledMeeting: checked,
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
  }
  const pushNotificationOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationOnCancelledMeeting: checked,
    });
  };
  const dormatInactiveUsersforDays = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      DormatInactiveUsersforDays: checked,
    });
  };
  const updateOrganizationLevelSettings = () => {
    dispatch(updateUserSettingFunc(organizationStates, t));
  };

  // Time Zones set in values
  // useEffect(() => {
  //   let TimeZone = settingReducer.TimeZone;
  //   if (TimeZone !== undefined && TimeZone !== null) {
  //     let newData = [];
  //     TimeZone.map((data, index) => {
  //       newData.push({ label: data.gmtOffset, value: data.pK_TZID });
  //     });
  //     setTimeZone(newData);
  //   }
  // }, [settingReducer.TimeZone]);
  // Country Code set in values
  // useEffect(() => {
  //   let CountryCodes = settingReducer.CountryCodes;
  //   if (CountryCodes !== undefined && CountryCodes !== null) {
  //     let newCountryCodeData = [];
  //     CountryCodes.map((data, index) => {
  //       newCountryCodeData.push({
  //         label: data.code,
  //         value: data.pK_CCID,
  //       });
  //     });
  //     setCountryCode(newCountryCodeData);
  //   }
  // }, [settingReducer.CountryCodes]);

  // useEffect(() => {
  //   dispatch(getCountryCodeFunc())
  //   dispatch(getTimeZone())
  // }, [])
  useEffect(() => {
    let userProfileData = settingReducer.UserProfileData;
    if (userProfileData !== null && userProfileData !== undefined) {
      console.log("userProfileDatauserProfileData", userProfileData)
      let settingData = {
        SynchronizeDocuments: userProfileData.synchronizeDocuments,
        DisableMeetingScheduling: userProfileData.disableMeetingScheduling,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledMeeting: false,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationOnCancelledMeeting: userProfileData.pushNotificationonCancelledMeeting,
        ShowNotificationonparticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: userProfileData.dormantInactiveUsersForDays,
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
        Is2FAVerification: userProfileData.iS2FAEnabled
      };
      setOrganizationStates(settingData);

    }
  }, [settingReducer.UserProfileData]);
  const ResetUserConfigurationSetting = () => {
    let userProfileData = settingReducer.UserProfileData;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        SynchronizeDocuments: userProfileData.synchronizeDocuments,
        DisableMeetingScheduling: userProfileData.disableMeetingScheduling,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledMeeting: false,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationOnCancelledMeeting: userProfileData.pushNotificationonCancelledMeeting,
        ShowNotificationonparticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: userProfileData.dormantInactiveUsersForDays,
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
        Is2FAVerification: userProfileData.iS2FAEnabled
      };
      setOrganizationStates(settingData);

    }
  }
  useEffect(() => {
    if (
      settingReducer.UpdateUserSettingResponseMessage !== "" &&
      settingReducer.UpdateUserSettingResponseMessage !== t("Record-found")
    ) {
      setOpen({
        flag: true,
        message: settingReducer.UpdateUserSettingResponseMessage,
      });
      setTimeout(() => {
        settingReducer.UpdateUserSettingResponseMessage = "";
        setOpen({
          flag: false,
          message: "",
        });
      }, 3000);
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
            {/* <Row className="mt-1 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Organization-time-zone")}</label>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Select
                  options={timezone}
                  width="120px"
                  placeholder={t("Please-select")}
                  className={styles["select-timezone"]}
                  value={timeZoneValue}
                  defaultValue={{
                    label: timeZoneValue.label,
                    value: timeZoneValue.value,
                  }}
                  onChange={timezoneChangeHandler}
                />
              </Col>
            </Row> */}
            {/* <Row className="mt-3 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start align-items-center"
              >
                <label>{t("CountryCode")}</label>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Select
                  options={countrycode}
                  width="120px"
                  placeholder={t("Please-select")}
                  className={styles["select-Country"]}
                  value={countryCodeValue}
                  defaultValue={{
                    label: countryCodeValue.label,
                    value: countryCodeValue.value,
                  }}
                  onChange={countryCodeChandeHandler}
                />
              </Col>
            </Row> */}
            {/* <Row className="mt-3 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start align-items-center"
              >
                <label>{t("Maximum-meeting-duration")}</label>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Select
                  options={timedurationValues}
                  placeholder={t("Select")}
                  className={styles["select-timeDuration"]}
                  value={{
                    label: organizationStates.MaximumMeetingDuration,
                    value: organizationStates.MaximumMeetingDuration,
                  }}
                  defaultValue={{
                    label: organizationStates.MaximumMeetingDuration,
                    value: organizationStates.MaximumMeetingDuration,
                  }}
                />
              </Col>
            </Row> */}

            <Row className={styles["setting-row"]}>
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Synchronize-documents")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="SynchronizeDocuments"
                  checkedValue={organizationStates.SynchronizeDocuments}
                  onChange={synchronizeDocuments}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3">
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
                  checkedValue={
                    organizationStates.Is2FAVerification || false
                  }
                  onChange={Is2FAVerificationHandle}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Disable-meeting-scheduling")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="DisableMeetingScheduling"
                  checkedValue={
                    organizationStates.DisableMeetingScheduling || false
                  }
                  onChange={disableMeetingScheduling}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3">
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
            <Row className="mt-3">
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
            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Email-on-cancelled-meeting")}</label>
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
                  checkedValue={organizationStates.EmailOnCancelledMeeting}
                  onChange={emailOnCancelledMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3">
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
            <Row className="mt-3">
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
            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start fw-900"
              >
                <label>{t("Push-notification-on-cancelled-meeting")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <Switch
                  name="PushNotificationOnCancelledMeeting"
                  checkedValue={
                    organizationStates.PushNotificationOnCancelledMeeting
                  }
                  onChange={pushNotificationOnCancelledMeeting}
                />
              </Col>
            </Row>
            <span className={styles["bottom-line"]}></span>
            <Row className="mt-3">
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
                  name="PushNotificationOnCancelledMeeting"
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
      {settingReducer.Loading ? <Loader /> : null}
      <Notification
        open={open.flag}
        message={open.message}
        setOpen={open.flag}
      />
    </>
  );
};

export default Organization;
