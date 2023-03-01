import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Paper,
  Accordian,
  Loader,
  TextField,
} from "../../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Organzation.module.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getUserSetting } from "../../../../store/actions/GetUserSetting";
import getTimeZone from "../../../../store/actions/GetTimeZone";
import getCountryCodeFunc from "../../../../store/actions/GetCountryCode";
import {
  getOrganizationLevelSetting,
  updateOrganizationLevelSetting,
} from "../../../../store/actions/OrganizationSettings";

const Organization = () => {
  //for translation
  const { settingReducer } = useSelector((state) => state);
  console.log("settingReducersettingReducersettingReducer", settingReducer);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [timedurationValues, setTimeDurationValues] = useState([
    {
      label: "1 Hours",
      value: 1,
    },
    {
      label: "2 Hours",
      value: 2,
    },
    {
      label: "3 Hours",
      value: 3,
    },
    {
      label: "4 Hours",
      value: 4,
    },
    {
      label: "5 Hours",
      value: 5,
    },
    {
      label: "6 Hours",
      value: 6,
    },
    {
      label: "7 Hours",
      value: 7,
    },
    {
      label: "8 Hours",
      value: 8,
    },
    {
      label: "9 Hours",
      value: 9,
    },
    {
      label: "10 Hours",
      value: 10,
    },
    {
      label: "11 Hours",
      value: 11,
    },
    {
      label: "12 Hours",
      value: 12,
    },
    {
      label: "13 Hours",
      value: 13,
    },
    {
      label: "14 Hours",
      value: 14,
    },
    {
      label: "15 Hours",
      value: 15,
    },
  ]);

  const [organizationStates, setOrganizationStates] = useState({
    SynchronizeDocuments: false,
    DisableMeetingScheduling: "",
    EmailOnNewMeeting: false,
    EmailOnEditMeeting: false,
    EmailOnCancelledMeeting: false,
    PushNotificationOnNewMeeting: false,
    PushNotificationOnEditMeeting: false,
    PushNotificationOnCancelledMeeting: false,
    ShowNotificationonparticipantJoining: false,
    DormatInactiveUsersforDays: "",
    MaximumMeetingDuration: 0,
  });

  //Reset handler for organization

  const resetOrganizer = () => {
    let userProfileData = settingReducer.GetOrganizationLevelSettingResponse;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        SynchronizeDocuments: userProfileData.synchronizeDocuments,
        DisableMeetingScheduling: false,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledMeeting: false,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationOnCancelledMeeting: false,
        ShowNotificationonparticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: userProfileData.dormantInactiveUsersForDays,
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
      };
      setOrganizationStates(settingData);
      let countryCode = {
        label: userProfileData.countryCode.code,
        value: userProfileData.countryCode.pK_CCID,
      };
      setCountryCodeValue(countryCode);
      let timeZoneCode = {
        label: userProfileData.timeZones.gmtOffset,
        value: userProfileData.timeZones.pK_TZID,
      };
      setTimeZoneValue(timeZoneCode);
    }
    // setCountryCodeValue([]);
    // setTimeZoneValue("");
    // setOrganizationStates({
    //   ...organizationStates,
    //   SynchronizeDocuments: false,
    //   DisableMeetingScheduling: "",
    //   EmailOnNewMeeting: false,
    //   EmailOnEditMeeting: false,
    //   EmailOnCancelledMeeting: false,
    //   PushNotificationOnNewMeeting: false,
    //   PushNotificationOnEditMeeting: false,
    //   PushNotificationOnCancelledMeeting: false,
    //   ShowNotificationonparticipantJoining: false,
    //   DormatInactiveUsersforDays: "",
    //   MaximumMeetingDuration: 0,
    // });
  };

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
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let organizationSettings = {
      FK_TZID: timeZoneValue.value,
      MaximumMeetingDuration: organizationStates.MaximumMeetingDuration,
      SynchronizeDocuments: organizationStates.SynchronizeDocuments,
      EmailOnNewMeeting: organizationStates.EmailOnNewMeeting,
      EmailOnEditMeeting: organizationStates.EmailOnEditMeeting,
      PushNotificationOnNewMeeting:
        organizationStates.PushNotificationOnNewMeeting,
      PushNotificationOnEditMeeting:
        organizationStates.PushNotificationOnEditMeeting,
      ShowNotificationOnParticipantJoining:
        organizationStates.ShowNotificationonparticipantJoining,
      DormantInactiveUsersForDays:
        organizationStates.DormatInactiveUsersforDays,
      FK_OrganizationID: organizationID,
      FK_CCID: countryCodeValue.value,
    };
    dispatch(updateOrganizationLevelSetting(organizationSettings, t));
  };
  // Time Zone Change Handler
  const timezoneChangeHandler = (event) => {
    setTimeZoneValue({
      label: event.label,
      value: event.value,
    });
  };
  // Time Zone Change Handler
  const countryCodeChandeHandler = (event) => {
    setCountryCodeValue({
      label: event.label,
      value: event.value,
    });
  };

  const hoursHandler = (event) => {
    // setTimeDurationValues({
    //   ...timedurationValues,
    //   label: event.label,
    //   value: event.value,
    // });
    setOrganizationStates({
      ...organizationStates,
      MaximumMeetingDuration: event.value,
    });
  };

  // Time Zones set in values
  useEffect(() => {
    let TimeZone = settingReducer.TimeZone;
    if (TimeZone !== undefined && TimeZone !== null) {
      let newData = [];
      TimeZone.map((data, index) => {
        newData.push({ label: data.gmtOffset, value: data.pK_TZID });
      });
      setTimeZone(newData);
    }
  }, [settingReducer.TimeZone]);
  // Country Code set in values
  useEffect(() => {
    let CountryCodes = settingReducer.CountryCodes;
    if (CountryCodes !== undefined && CountryCodes !== null) {
      let newCountryCodeData = [];
      CountryCodes.map((data, index) => {
        newCountryCodeData.push({
          label: data.code,
          value: data.pK_CCID,
        });
      });
      setCountryCode(newCountryCodeData);
    }
  }, [settingReducer.CountryCodes]);
  useEffect(() => {
    dispatch(getOrganizationLevelSetting(t));
  }, []);

  useEffect(() => {
    dispatch(getCountryCodeFunc());
    dispatch(getTimeZone());
  }, []);
  useEffect(() => {
    let userProfileData = settingReducer.GetOrganizationLevelSettingResponse;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        SynchronizeDocuments: userProfileData.synchronizeDocuments,
        DisableMeetingScheduling: false,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledMeeting: false,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationOnCancelledMeeting: false,
        ShowNotificationonparticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: userProfileData.dormantInactiveUsersForDays,
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
      };
      setOrganizationStates(settingData);
      let countryCode = {
        label: userProfileData.countryCode.code,
        value: userProfileData.countryCode.pK_CCID,
      };
      setCountryCodeValue(countryCode);
      let timeZoneCode = {
        label: userProfileData.timeZones.gmtOffset,
        value: userProfileData.timeZones.pK_TZID,
      };
      setTimeZoneValue(timeZoneCode);
    }
  }, [settingReducer.GetOrganizationLevelSettingResponse]);

  const borderChanges = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #e1e1e1 !important",
      borderRadius: "4px !important",
      boxShadow: "0 !important",

      "&:focus-within": {
        border: "1px solid #e1e1e1 !important",
      },
    }),
  };

  return (
    <>
      <Container>
        <Col sm={8} xs={12}>
          <Row className="">
            <Col lg={12} md={12} sm={12} xs={12}>
              <label
                className={`${"fs-3 mt-3"} ${styles["OrganizationLevelTitle"]}`}
              >
                {t("Organization-level-configurations")}
              </label>
            </Col>
          </Row>
          <Col className={styles["OrganizerlevelSetting"]}>
            <Row>
              <Col sm={12} md={10} lg={10}>
                <Row className="mt-1 d-flex align-items-center">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Organization-time-zone")}
                    </label>
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
                      width="110px"
                      placeholder={t("Please-select")}
                      className={styles["select-timezone"]}
                      value={timeZoneValue}
                      defaultValue={{
                        label: timeZoneValue.label,
                        value: timeZoneValue.value,
                      }}
                      menuShouldScrollIntoView={false}
                      onChange={timezoneChangeHandler}
                      styles={borderChanges}
                    />
                  </Col>
                </Row>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 d-flex align-items-center">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <label className="organization-labels">
                      {t("Country-code")}
                    </label>
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
                      menuShouldScrollIntoView={false}
                      onChange={countryCodeChandeHandler}
                      styles={borderChanges}
                    />
                  </Col>
                </Row>
                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 d-flex align-items-center">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <label className="organization-labels">
                      {t("Maximum-meeting-duration")}
                    </label>
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
                        label:
                          organizationStates.MaximumMeetingDuration +
                          " " +
                          "Hours",
                        value: organizationStates.MaximumMeetingDuration,
                      }}
                      defaultValue={{
                        label:
                          organizationStates.MaximumMeetingDuration +
                          " " +
                          "Hours",
                        value: organizationStates.MaximumMeetingDuration,
                      }}
                      menuShouldScrollIntoView={false}
                      onChange={hoursHandler}
                      styles={borderChanges}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Synchronize-documents")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Disable-meeting-scheduling")}
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
                      name="DisableMeetingScheduling"
                      checkedValue={
                        organizationStates.DisableMeetingScheduling || false
                      }
                      // onChange={disableMeetingScheduling}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Email-on-new-meeting")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Email-on-edit-meeting")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Email-on-cancelled-meeting")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Push-notification-on-new-meeting")}
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
                      name="PushNotificationOnNewMeeting"
                      checkedValue={
                        organizationStates.PushNotificationOnNewMeeting
                      }
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Push-notification-on-edit-meeting")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Push-notification-on-cancelled-meeting")}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Show-notification-on-participant-joining")}
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
                      name="PushNotificationOnCancelledMeeting"
                      checkedValue={
                        organizationStates.ShowNotificationonparticipantJoining
                      }
                      onChange={showNotificationonparticipantJoining}
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
                    className="d-flex justify-content-start"
                  >
                    <label className="organization-labels">
                      {t("Dormant-in-active-users-for-days")}
                    </label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <TextField
                      type="number"
                      value={organizationStates.DormatInactiveUsersforDays}
                      change={(e) => {
                        setOrganizationStates({
                          ...organizationStates,
                          DormatInactiveUsersforDays: e.target.value,
                        });
                      }}
                      maxLength={360}
                      labelClass="d-none"
                      width="80px"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Row>
            <Col sm={12} md={10} lg={10}>
              <Row className="my-2">
                <Col
                  sm={12}
                  md={6}
                  lg={6}
                  className="d-flex justify-content-start"
                >
                  <Button
                    className={styles["organization-level-resetBtn"]}
                    text={t("Reset")}
                    onClick={resetOrganizer}
                  />
                </Col>
                <Col
                  sm={12}
                  md={6}
                  lg={6}
                  className="d-flex justify-content-end"
                >
                  <Button
                    onClick={updateOrganizationLevelSettings}
                    className={styles["organization-level-updateBtn"]}
                    text={t("Update")}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Container>
      {settingReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Organization;
