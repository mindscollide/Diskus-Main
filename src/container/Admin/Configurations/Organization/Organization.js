import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  Paper,
  Accordian,
  Loader,
  TextField
} from "../../../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./Organzation.module.css";
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select";
import { getUserSetting } from "../../../../store/actions/GetUserSetting";
import getTimeZone from "../../../../store/actions/GetTimeZone";
import getCountryCodeFunc from "../../../../store/actions/GetCountryCode";
import { getOrganizationLevelSetting, updateOrganizationLevelSetting } from "../../../../store/actions/OrganizationSettings";


const Organization = () => {
  //for translation
  const { settingReducer } = useSelector(state => state)
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [timedurationValues, setTimeDurationValues] = useState([
    {
      label: 1, value: 1
    }
    ,
    {
      label: 2, value: 2
    },
    {
      label: 3, value: 3
    },
    {
      label: 4, value: 4
    },
    {
      label: 5, value: 5
    },
    {
      label: 6, value: 6
    },
    {
      label: 7, value: 7
    },
    {
      label: 8, value: 8
    },
    {
      label: 9, value: 9
    },
    {
      label: 10, value: 10
    },
    {
      label: 11, value: 11
    },
    {
      label: 12, value: 12
    },
    {
      label: 13, value: 13
    },
    {
      label: 14, value: 14
    },
    {
      label: 15, value: 15
    }])

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
    MaximumMeetingDuration: 0
  });
  const [timeZoneValue, setTimeZoneValue] = useState({
    label: "",
    value: ""
  })

  const [timezone, setTimeZone] = useState([]);
  const [countrycode, setCountryCode] = useState([]);
  const [countryCodeValue, setCountryCodeValue] = useState({
    label: "",
    value: ""
  })
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
      PushNotificationOnNewMeeting: organizationStates.PushNotificationOnNewMeeting,
      PushNotificationOnEditMeeting: organizationStates.PushNotificationOnEditMeeting,
      ShowNotificationOnParticipantJoining: organizationStates.ShowNotificationonparticipantJoining,
      DormantInactiveUsersForDays: organizationStates.DormatInactiveUsersforDays,
      FK_OrganizationID: organizationID,
      FK_CCID: countryCodeValue.value
    }
    dispatch(updateOrganizationLevelSetting(organizationSettings, t))
  }
  // Time Zone Change Handler
  const timezoneChangeHandler = (event) => {
    setTimeZoneValue({
      label: event.label,
      value: event.value,
    });
  }
  // Time Zone Change Handler
  const countryCodeChandeHandler = (event) => {
    setCountryCodeValue({
      label: event.label,
      value: event.value,
    });
  }
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
    dispatch(getOrganizationLevelSetting(t))
  }, [])


  useEffect(() => {
    dispatch(getCountryCodeFunc())
    dispatch(getTimeZone())
  }, [])
  useEffect(() => {
    let userProfileData = settingReducer.GetOrganizationLevelSettingResponse;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        SynchronizeDocuments: userProfileData.synchronizeDocuments,
        DisableMeetingScheduling: false,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledMeeting: false,
        PushNotificationOnNewMeeting: userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting: userProfileData.pushNotificationOnEditMeeting,
        PushNotificationOnCancelledMeeting: false,
        ShowNotificationonparticipantJoining: userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: userProfileData.dormantInactiveUsersForDays,
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration
      }
      setOrganizationStates(settingData)
      let countryCode = {
        label: userProfileData.countryCode.code,
        value: userProfileData.countryCode.pK_CCID
      }
      setCountryCodeValue(countryCode)
      let timeZoneCode = {
        label: userProfileData.timeZones.gmtOffset, value: userProfileData.timeZones.pK_TZID
      }
      setTimeZoneValue(timeZoneCode)
    }
  }, [settingReducer.GetOrganizationLevelSettingResponse])


  return (
    <>
      <Container>
        <Col sm={6} xs={12}>
          <Row className="">
            <Col lg={12} md={12} sm={12} xs={12}>
              <label className="fs-3 mt-3">{t("Organization-Level-Configurations")}</label>
            </Col>
          </Row>
          <Paper className={styles["OrganizerlevelSetting"]}>
            <Row className="mt-1 d-flex align-items-center">
              <Col
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Organization-Time-Zone")}</label>
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
                  placeholder={t("Please-Select")}
                  className={styles["select-timezone"]}
                  value={timeZoneValue}
                  defaultValue={{
                    label: timeZoneValue.label,
                    value: timeZoneValue.value,
                  }}
                  onChange={timezoneChangeHandler}
                />
              </Col>
            </Row>
            <Row className="mt-3 d-flex align-items-center">
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
                  placeholder={t("Please-Select")}
                  className={styles["select-Country"]}
                  value={countryCodeValue}
                  defaultValue={{
                    label: countryCodeValue.label,
                    value: countryCodeValue.value,
                  }}
                  onChange={countryCodeChandeHandler}
                />
              </Col>
            </Row>
            <Row className="mt-3 d-flex align-items-center">
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
                // onChange={countryCodeChandeHandler}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Synchronize-Documents")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Disable-Meeting-Scheduling")}</label>
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
                  checkedValue={organizationStates.DisableMeetingScheduling || false}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-New-Meeting")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-Edit-Meeting")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Email-On-Cancelled-Meeting")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-New-Meeting")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-Edit-Meeting")}</label>
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

            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Push-Notification-on-Cancelled-Meeting")}</label>
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
            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
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
            <Row className="mt-3">
              <Col
                lg={10}
                md={10}
                sm={12}
                xs={12}
                className="d-flex justify-content-start"
              >
                <label>{t("Dormant-inactive-users-for-days")}</label>
              </Col>
              <Col
                lg={2}
                md={2}
                sm={12}
                xs={12}
                className="d-flex justify-content-end"
              >
                <TextField type="number" value={organizationStates.DormatInactiveUsersforDays} change={(e) => {
                  setOrganizationStates({
                    ...organizationStates,
                    DormatInactiveUsersforDays: e.target.value
                  })
                }} maxLength={360} labelClass="d-none" width="80px" />

              </Col>
            </Row>

          </Paper>
          <Row className="my-2">
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-start" ><Button className={styles["organization-level-resetBtn"]} text={"Reset"} /></Col>
            <Col sm={12} md={6} lg={6} className="d-flex justify-content-end"><Button onClick={updateOrganizationLevelSettings} className={styles["organization-level-updateBtn"]} text={"Update"} /></Col>
          </Row>
        </Col>
      </Container>
      {settingReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default Organization;
