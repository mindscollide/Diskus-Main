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
import getTimeZone from "../../../../store/actions/GetTimeZone";
import getCountryCodeFunc from "../../../../store/actions/GetCountryCode";

import {
  getOrganizationLevelSetting,
  updateOrganizationLevelSetting,
} from "../../../../store/actions/OrganizationSettings";
import { countryName } from "../../AllUsers/AddUser/CountryJson";
import { useNavigate } from "react-router-dom";

const Organization = () => {
  //for translation
  const { settingReducer, LanguageReducer } = useSelector((state) => state);
  console.log("settingReducersettingReducersettingReducer", settingReducer);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    EmailOnNewMeeting: false,
    EmailOnEditMeeting: false,
    EmailOnCancelledDeletedMeeting: false,
    PushNotificationOnNewMeeting: false,
    PushNotificationOnEditMeeting: false,
    PushNotificationonCancelledDeletedMeeting: false,
    ShowNotificationOnParticipantJoining: false,
    DormatInactiveUsersforDays: 0,
    MaximumMeetingDuration: 0,
    Is2FAEnabled: false,
    EmailonCancelledorDeleteMeeting: false,

    PushNotificationWhenResolutionIsClosed: false,
    PushNotificationwhenResolutionisCancelledafterCirculation: false,
    PushNotificationwhenRemovedfromGroup: false,
    PushNotificationwhenRemovedfromCommittee: false,
    PushNotificationwhenNewResolutionisCirculated: false,
    PushNotificationwhenGroupissetInActive: false,
    PushNotificationwhenGroupisClosedArchived: false,
    PushNotificationwhenCommitteeissetInActive: false,
    PushNotificationwhenCommitteeisDissolvedArchived: false,
    PushNotificationwhenAddedtoGroup: false,
    PushNotificationwhenAddedtoCommittee: false,
    EmailwhenResolutionisCancelledafterCirculation: false,
    EmailWhenRemovedFromGroup: false,
    EmailWhenRemovedFromCommittee: false,
    EmailwhenNewResolutionisCirculated: false,
    EmailWhenGroupIsInActive: false,
    EmailWhenGroupIsClosedArchived: false,
    EmailWhenCommitteeIsInActive: false,
    EmailWhenCommitteeIsDissolvedArchived: false,
    EmailWhenAddedToGroup: false,
    EmailWhenAddedToCommittee: false,
    EmailwhenaResolutionisClosed: false,
    UserAllowGoogleCalendarSynch: false,
    UserAllowMicrosoftCalendarSynch: false,
    CalenderMonthsSpan: 0,
  });
  console.log(organizationStates, "organizationStates");
  const [timeZoneValue, setTimeZoneValue] = useState({
    label: "",
    value: "",
  });
  const [worldCountryID, setWorldCountryID] = useState(0);
  const [timezone, setTimeZone] = useState([]);
  const [countrycode, setCountryCode] = useState([]);
  const [countryCodeValue, setCountryCodeValue] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    dispatch(getTimeZone(navigate, t));
    dispatch(getOrganizationLevelSetting(navigate, t));
    let newCountryCode = [];
    let array = Object.keys(countryName);
    array.map((data, index) => {
      console.log("datadatadata", data);
      return newCountryCode.push({
        label: data,
        value: data,
      });
    });
    setCountryCode(newCountryCode);
  }, []);

  //Reset handler for organization

  const resetOrganizer = () => {
    let userProfileData = settingReducer.GetOrganizationLevelSettingResponse;
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        CalenderMonthsSpan: userProfileData.calenderMonthsSpan,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationonCancelledDeletedMeeting:
          userProfileData.pushNotificationonCancelledDeletedMeeting,
        ShowNotificationOnParticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: parseInt(
          userProfileData.dormantInactiveUsersForDays
        ),
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
        Is2FAEnabled: userProfileData.is2FAEnabled,
        EmailOnCancelledDeletedMeeting: userProfileData.emailOnCancelledMeeting,
        EmailonCancelledorDeleteMeeting:
          userProfileData.emailOnCancelledDeletedMeeting,
        PushNotificationWhenResolutionIsClosed:
          userProfileData.pushNotificationWhenResolutionIsClosed,
        PushNotificationwhenResolutionisCancelledafterCirculation:
          userProfileData.pushNotificationwhenResolutionisCancelledafterCirculation,
        PushNotificationwhenRemovedfromGroup:
          userProfileData.pushNotificationwhenRemovedfromGroup,
        PushNotificationwhenRemovedfromCommittee:
          userProfileData.pushNotificationwhenRemovedfromCommittee,
        PushNotificationwhenNewResolutionisCirculated:
          userProfileData.pushNotificationwhenNewResolutionisCirculated,
        PushNotificationwhenGroupissetInActive:
          userProfileData.pushNotificationwhenGroupissetInActive,
        PushNotificationwhenGroupisClosedArchived:
          userProfileData.pushNotificationwhenGroupisClosedArchived,
        PushNotificationwhenCommitteeissetInActive:
          userProfileData.pushNotificationwhenCommitteeissetInActive,
        PushNotificationwhenCommitteeisDissolvedArchived:
          userProfileData.pushNotificationwhenCommitteeisDissolvedArchived,
        PushNotificationwhenAddedtoGroup:
          userProfileData.pushNotificationwhenAddedtoGroup,
        PushNotificationwhenAddedtoCommittee:
          userProfileData.pushNotificationwhenAddedtoCommittee,
        EmailwhenResolutionisCancelledafterCirculation:
          userProfileData.emailwhenResolutionisCancelledafterCirculation,
        EmailWhenRemovedFromGroup: userProfileData.emailWhenRemovedFromGroup,
        EmailWhenRemovedFromCommittee:
          userProfileData.emailWhenRemovedFromCommittee,
        EmailwhenNewResolutionisCirculated:
          userProfileData.emailwhenNewResolutionisCirculated,
        EmailWhenGroupIsInActive: userProfileData.emailWhenGroupIsInActive,
        EmailWhenGroupIsClosedArchived:
          userProfileData.emailWhenGroupIsClosedArchived,
        EmailWhenCommitteeIsInActive:
          userProfileData.emailWhenCommitteeIsInActive,
        EmailWhenCommitteeIsDissolvedArchived:
          userProfileData.emailWhenCommitteeIsDissolvedArchived,
        EmailWhenAddedToGroup: userProfileData.emailWhenAddedToGroup,
        EmailWhenAddedToCommittee: userProfileData.emailWhenAddedToCommittee,
        EmailwhenaResolutionisClosed:
          userProfileData.emailwhenaResolutionisClosed,
        UserAllowGoogleCalendarSynch:
          userProfileData.userAllowGoogleCalendarSynch,
        UserAllowMicrosoftCalendarSynch:
          userProfileData.userAllowMicrosoftCalendarSynch,
      };
      setOrganizationStates(settingData);
      // let countryCode = {
      //   label: userProfileData.countryCode.code,
      //   value: userProfileData.countryCode.pK_CCID,
      // };
      // setCountryCodeValue(countryCode);
      setWorldCountryID(userProfileData.worldCountry.fK_WorldCountryID);
      let timeZoneCode = {
        label: userProfileData.timeZones
          ? userProfileData.timeZones.countryName +
            " " +
            "(" +
            userProfileData.timeZones.timeZone +
            ")" +
            " " +
            userProfileData.timeZones.gmtOffset
          : null,
        value: userProfileData.timeZones?.pK_TZID,
      };
      console.log(timeZoneCode, "timeZoneCodetimeZoneCodetimeZoneCode");
      setTimeZoneValue(timeZoneCode);
    }
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
      EmailonCancelledorDeleteMeeting: checked,
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
      ShowNotificationOnParticipantJoining: checked,
    });
  };

  const pushNotificationOnCancelledMeeting = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationonCancelledDeletedMeeting: checked,
    });
  };

  const updateOrganizationLevelSettings = () => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let organizationSettings = {
      FK_TZID: timeZoneValue.value,
      MaximumMeetingDuration: parseInt(
        organizationStates.MaximumMeetingDuration
      ),
      CalenderMonthsSpan: organizationStates.CalenderMonthsSpan,
      EmailOnNewMeeting: organizationStates.EmailOnNewMeeting,
      EmailOnEditMeeting: organizationStates.EmailOnEditMeeting,
      PushNotificationOnNewMeeting:
        organizationStates.PushNotificationOnNewMeeting,
      PushNotificationOnEditMeeting:
        organizationStates.PushNotificationOnEditMeeting,
      ShowNotificationOnParticipantJoining:
        organizationStates.ShowNotificationOnParticipantJoining,
      DormantInactiveUsersForDays: parseInt(
        organizationStates.DormatInactiveUsersforDays
      ),
      FK_OrganizationID: organizationID,
      FK_WorldCountryID: worldCountryID,
      Is2FAEnabled: organizationStates.Is2FAEnabled,
      PushNotificationonCancelledDeletedMeeting:
        organizationStates.PushNotificationonCancelledDeletedMeeting,
      EmailOnCancelledDeletedMeeting:
        organizationStates.EmailonCancelledorDeleteMeeting,

      PushNotificationWhenResolutionIsClosed:
        organizationStates.PushNotificationWhenResolutionIsClosed,
      PushNotificationwhenResolutionisCancelledafterCirculation:
        organizationStates.PushNotificationwhenResolutionisCancelledafterCirculation,
      PushNotificationwhenRemovedfromGroup:
        organizationStates.PushNotificationwhenRemovedfromGroup,
      PushNotificationwhenRemovedfromCommittee:
        organizationStates.PushNotificationwhenRemovedfromCommittee,
      PushNotificationwhenNewResolutionisCirculated:
        organizationStates.PushNotificationwhenNewResolutionisCirculated,
      PushNotificationwhenGroupissetInActive:
        organizationStates.PushNotificationwhenGroupissetInActive,
      PushNotificationwhenGroupisClosedArchived:
        organizationStates.PushNotificationwhenGroupisClosedArchived,
      PushNotificationwhenCommitteeissetInActive:
        organizationStates.PushNotificationwhenCommitteeissetInActive,
      PushNotificationwhenCommitteeisDissolvedArchived:
        organizationStates.PushNotificationwhenCommitteeisDissolvedArchived,
      PushNotificationwhenAddedtoGroup:
        organizationStates.PushNotificationwhenAddedtoGroup,
      PushNotificationwhenAddedtoCommittee:
        organizationStates.PushNotificationwhenAddedtoCommittee,
      EmailwhenResolutionisCancelledafterCirculation:
        organizationStates.EmailwhenResolutionisCancelledafterCirculation,
      EmailWhenRemovedFromGroup: organizationStates.EmailWhenRemovedFromGroup,
      EmailWhenRemovedFromCommittee:
        organizationStates.EmailWhenRemovedFromCommittee,
      EmailwhenNewResolutionisCirculated:
        organizationStates.EmailwhenNewResolutionisCirculated,
      EmailWhenGroupIsInActive: organizationStates.EmailWhenGroupIsInActive,
      EmailWhenGroupIsClosedArchived:
        organizationStates.EmailWhenGroupIsClosedArchived,
      EmailWhenCommitteeIsInActive:
        organizationStates.EmailWhenCommitteeIsInActive,
      EmailWhenCommitteeIsDissolvedArchived:
        organizationStates.EmailWhenCommitteeIsDissolvedArchived,
      EmailWhenAddedToGroup: organizationStates.EmailWhenAddedToGroup,
      EmailWhenAddedToCommittee: organizationStates.EmailWhenAddedToCommittee,
      EmailwhenaResolutionisClosed:
        organizationStates.EmailwhenaResolutionisClosed,
      UserAllowGoogleCalendarSynch:
        organizationStates.UserAllowGoogleCalendarSynch,
      UserAllowMicrosoftCalendarSynch:
        organizationStates.UserAllowMicrosoftCalendarSynch,
    };
    console.log(
      organizationSettings,
      "organizationSettingsorganizationSettingsorganizationSettingsorganizationSettings"
    );
    dispatch(updateOrganizationLevelSetting(navigate, organizationSettings, t));
  };

  // Time Zone Change Handler
  const timezoneChangeHandler = (event) => {
    setTimeZoneValue({
      label: event.label,
      value: event.value,
    });
  };

  const Is2FAVerificationHandle = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      Is2FAEnabled: checked,
    });
  };

  const ChangePushNotificationWhenResolutionIsClosed = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationWhenResolutionIsClosed: checked,
    });
  };

  const ChangePushNotificationwhenResolutionisCancelledafterCirculation = (
    checked
  ) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenResolutionisCancelledafterCirculation: checked,
    });
  };

  const ChangePushNotificationwhenRemovedfromGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenRemovedfromGroup: checked,
    });
  };

  const ChangePushNotificationwhenRemovedfromCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenRemovedfromCommittee: checked,
    });
  };

  const ChangePushNotificationwhenNewResolutionisCirculated = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenNewResolutionisCirculated: checked,
    });
  };

  const ChangePushNotificationwhenGroupissetInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenGroupissetInActive: checked,
    });
  };

  const ChangePushNotificationwhenGroupisClosedArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenGroupisClosedArchived: checked,
    });
  };

  const ChangePushNotificationwhenCommitteeissetInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenCommitteeissetInActive: checked,
    });
  };

  const ChangePushNotificationwhenCommitteeisDissolvedArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenCommitteeisDissolvedArchived: checked,
    });
  };

  const ChangePushNotificationwhenAddedtoGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenAddedtoGroup: checked,
    });
  };

  const ChangePushNotificationwhenAddedtoCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      PushNotificationwhenAddedtoCommittee: checked,
    });
  };

  const ChangeEmailwhenResolutionisCancelledafterCirculation = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailwhenResolutionisCancelledafterCirculation: checked,
    });
  };

  const ChangeEmailWhenRemovedFromGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenRemovedFromGroup: checked,
    });
  };

  const ChangeEmailWhenRemovedFromCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenRemovedFromCommittee: checked,
    });
  };

  const ChangeEmailwhenNewResolutionisCirculated = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailwhenNewResolutionisCirculated: checked,
    });
  };

  const ChangeEmailWhenGroupIsInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenGroupIsInActive: checked,
    });
  };

  const ChangeEmailWhenGroupIsClosedArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenGroupIsClosedArchived: checked,
    });
  };

  const ChangeEmailWhenCommitteeIsInActive = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenCommitteeIsInActive: checked,
    });
  };

  const ChangeEmailWhenCommitteeIsDissolvedArchived = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenCommitteeIsDissolvedArchived: checked,
    });
  };

  const ChangeEmailWhenAddedToGroup = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenAddedToGroup: checked,
    });
  };

  const ChangeEmailWhenAddedToCommittee = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailWhenAddedToCommittee: checked,
    });
  };

  const ChangeEmailwhenaResolutionisClosed = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      EmailwhenaResolutionisClosed: checked,
    });
  };

  const ChangeUserAllowGoogleCalendarSynch = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      UserAllowGoogleCalendarSynch: checked,
    });
  };

  const ChangeUserAllowMicrosoftCalendarSynch = (checked) => {
    setOrganizationStates({
      ...organizationStates,
      UserAllowMicrosoftCalendarSynch: checked,
    });
  };

  // const hoursHandler = (event) => {
  //   setOrganizationStates({
  //     ...organizationStates,
  //     MaximumMeetingDuration: event.value,
  //   });
  // };
  const handleChangeMaximumMeeting = (e) => {
    const value = e.target.value;
    if (value < 5 || value > 900) {
      console.log("Error is occured");
    } else {
      setOrganizationStates({
        ...organizationStates,
        MaximumMeetingDuration: value,
      });
    }
  };

  console.log("changeFlage", organizationStates);

  // Time Zones set in values
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
  // Country Code set in values

  useEffect(() => {
    let userProfileData = settingReducer.GetOrganizationLevelSettingResponse;
    console.log(
      userProfileData,
      "userProfileDatauserProfileDatauserProfileData"
    );
    if (userProfileData !== null && userProfileData !== undefined) {
      let settingData = {
        CalenderMonthsSpan: userProfileData.calenderMonthsSpan,
        EmailOnNewMeeting: userProfileData.emailOnNewMeeting,
        EmailOnEditMeeting: userProfileData.emailOnEditMeeting,
        EmailOnCancelledDeletedMeeting: userProfileData.emailOnCancelledMeeting,
        PushNotificationOnNewMeeting:
          userProfileData.pushNotificationOnNewMeeting,
        PushNotificationOnEditMeeting:
          userProfileData.pushNotificationOnEditMeeting,
        PushNotificationonCancelledDeletedMeeting:
          userProfileData.pushNotificationonCancelledDeletedMeeting,
        ShowNotificationOnParticipantJoining:
          userProfileData.showNotificationOnParticipantJoining,
        DormatInactiveUsersforDays: parseInt(
          userProfileData.dormantInactiveUsersForDays
        ),
        MaximumMeetingDuration: userProfileData.maximumMeetingDuration,
        Is2FAEnabled: userProfileData.is2FAEnabled,
        EmailonCancelledorDeleteMeeting:
          userProfileData.emailOnCancelledDeletedMeeting,
        EmailOnCancelledDeletedMeeting: userProfileData.emailOnCancelledMeeting,
        EmailonCancelledorDeleteMeeting:
          userProfileData.emailOnCancelledDeletedMeeting,
        PushNotificationWhenResolutionIsClosed:
          userProfileData.pushNotificationWhenResolutionIsClosed,
        PushNotificationwhenResolutionisCancelledafterCirculation:
          userProfileData.pushNotificationwhenResolutionisCancelledafterCirculation,
        PushNotificationwhenRemovedfromGroup:
          userProfileData.pushNotificationwhenRemovedfromGroup,
        PushNotificationwhenRemovedfromCommittee:
          userProfileData.pushNotificationwhenRemovedfromCommittee,
        PushNotificationwhenNewResolutionisCirculated:
          userProfileData.pushNotificationwhenNewResolutionisCirculated,
        PushNotificationwhenGroupissetInActive:
          userProfileData.pushNotificationwhenGroupissetInActive,
        PushNotificationwhenGroupisClosedArchived:
          userProfileData.pushNotificationwhenGroupisClosedArchived,
        PushNotificationwhenCommitteeissetInActive:
          userProfileData.pushNotificationwhenCommitteeissetInActive,
        PushNotificationwhenCommitteeisDissolvedArchived:
          userProfileData.pushNotificationwhenCommitteeisDissolvedArchived,
        PushNotificationwhenAddedtoGroup:
          userProfileData.pushNotificationwhenAddedtoGroup,
        PushNotificationwhenAddedtoCommittee:
          userProfileData.pushNotificationwhenAddedtoCommittee,
        EmailwhenResolutionisCancelledafterCirculation:
          userProfileData.emailwhenResolutionisCancelledafterCirculation,
        EmailWhenRemovedFromGroup: userProfileData.emailWhenRemovedFromGroup,
        EmailWhenRemovedFromCommittee:
          userProfileData.emailWhenRemovedFromCommittee,
        EmailwhenNewResolutionisCirculated:
          userProfileData.emailwhenNewResolutionisCirculated,
        EmailWhenGroupIsInActive: userProfileData.emailWhenGroupIsInActive,
        EmailWhenGroupIsClosedArchived:
          userProfileData.emailWhenGroupIsClosedArchived,
        EmailWhenCommitteeIsInActive:
          userProfileData.emailWhenCommitteeIsInActive,
        EmailWhenCommitteeIsDissolvedArchived:
          userProfileData.emailWhenCommitteeIsDissolvedArchived,
        EmailWhenAddedToGroup: userProfileData.emailWhenAddedToGroup,
        EmailWhenAddedToCommittee: userProfileData.emailWhenAddedToCommittee,
        EmailwhenaResolutionisClosed:
          userProfileData.emailwhenaResolutionisClosed,
        UserAllowGoogleCalendarSynch:
          userProfileData.userAllowGoogleCalendarSynch,
        UserAllowMicrosoftCalendarSynch:
          userProfileData.userAllowMicrosoftCalendarSynch,
      };
      setOrganizationStates(settingData);
      // let countryCode = {
      //   label: userProfileData.worldCountry?.code,
      //   value: userProfileData.worldCountry?.fK_WorldCountryID,
      // };
      // setCountryCodeValue(countryCode);
      setWorldCountryID(userProfileData.worldCountry?.fK_WorldCountryID);
      let timeZoneCode = {
        label: userProfileData.timeZones
          ? userProfileData.timeZones.countryName +
            " " +
            "(" +
            userProfileData.timeZones.timeZone +
            ")" +
            " " +
            userProfileData.timeZones.gmtOffset
          : null,
        value: userProfileData.timeZones?.pK_TZID,
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
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    className={
                      "d-flex justify-content-end organization-timezone-col FontArabicRegular"
                    }
                  >
                    <Select
                      options={timezone}
                      placeholder={t("Please-select")}
                      classNamePrefix={"Select_timezone"}
                      className={styles["select-timezone"]}
                      value={{
                        label: timeZoneValue.label,
                        value: timeZoneValue.value,
                      }}
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
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <label className="organization-labels">
                      {t("Calender-month-span")}
                    </label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className={
                      "d-flex justify-content-end organization-timezone-col2"
                    }
                  >
                    <TextField
                      type="number"
                      value={organizationStates.CalenderMonthsSpan}
                      change={(e) => {
                        setOrganizationStates({
                          ...organizationStates,
                          CalenderMonthsSpan:
                            parseInt(e.target.value) < 0
                              ? 0
                              : parseInt(e.target.value),
                        });
                      }}
                      maxLength={360}
                      labelclass="d-none"
                      width="80px"
                    />
                  </Col>
                </Row>

                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3 d-flex align-items-center">
                  <Col
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <label className="organization-labels">
                      {t("Maximum-meeting-duration-in-minutes")}
                    </label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className={
                      "d-flex justify-content-end organization-timezone-col2"
                    }
                  >
                    <TextField
                      type={"number"}
                      change={handleChangeMaximumMeeting}
                      value={organizationStates.MaximumMeetingDuration}
                      name={"maximumduration"}
                      labelclass={"d-none"}
                      width="80px"
                    />
                    {/* <Select
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
                    /> */}
                  </Col>
                </Row>

                <span className={styles["bottom-line"]}></span>
                <Row className="mt-3">
                  <Col
                    lg={10}
                    md={10}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start "
                  >
                    <label className="organization-labels">
                      {t("Is-2fa-verification")}
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
                      name="Is2FAEnabled"
                      checkedValue={organizationStates.Is2FAEnabled || false}
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
                      checkedValue={
                        organizationStates.EmailOnNewMeeting || false
                      }
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
                      checkedValue={
                        organizationStates.EmailOnEditMeeting || false
                      }
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
                      {t("Email-on-cancel-or-delete-meeting")}
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
                      name="EmailOnCancelledDeletedMeeting"
                      checkedValue={
                        organizationStates.EmailonCancelledorDeleteMeeting ||
                        false
                      }
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
                      {t("Push-notification-when-added-to-committee")}
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
                      name="PushNotificationwhenAddedtoCommittee"
                      checkedValue={
                        organizationStates.PushNotificationwhenAddedtoCommittee ||
                        false
                      }
                      onChange={ChangePushNotificationwhenAddedtoCommittee}
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
                      {t(
                        "Email-when-resolution-is-cancelled-after-circulation"
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
                      name="EmailwhenResolutionisCancelledafterCirculation"
                      checkedValue={
                        organizationStates.EmailwhenResolutionisCancelledafterCirculation ||
                        false
                      }
                      onChange={
                        ChangeEmailwhenResolutionisCancelledafterCirculation
                      }
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
                      {t("Email-when-removed-from-group")}
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
                      name="EmailWhenRemovedFromGroup"
                      checkedValue={
                        organizationStates.EmailWhenRemovedFromGroup || false
                      }
                      onChange={ChangeEmailWhenRemovedFromGroup}
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
                      {t("Email-when-removed-from-committee")}
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
                      name="EmailWhenRemovedFromCommittee"
                      checkedValue={
                        organizationStates.EmailWhenRemovedFromCommittee ||
                        false
                      }
                      onChange={ChangeEmailWhenRemovedFromCommittee}
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
                      {t("Email-when-new-resolution-is-circulated")}
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
                      name="EmailwhenNewResolutionisCirculated"
                      checkedValue={
                        organizationStates.EmailwhenNewResolutionisCirculated ||
                        false
                      }
                      onChange={ChangeEmailwhenNewResolutionisCirculated}
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
                      {t("Email-when-group-is-inActive")}
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
                      name="EmailWhenGroupIsInActive"
                      checkedValue={
                        organizationStates.EmailWhenGroupIsInActive || false
                      }
                      onChange={ChangeEmailWhenGroupIsInActive}
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
                      {t("Email-When-Group-Is-Closed-Archived")}
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
                      name="EmailWhenGroupIsClosedArchived"
                      checkedValue={
                        organizationStates.EmailWhenGroupIsClosedArchived ||
                        false
                      }
                      onChange={ChangeEmailWhenGroupIsClosedArchived}
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
                      {t("Email-when-committee-is-inActive")}
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
                      name="EmailWhenCommitteeIsInActive"
                      checkedValue={
                        organizationStates.EmailWhenCommitteeIsInActive || false
                      }
                      onChange={ChangeEmailWhenCommitteeIsInActive}
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
                      {t("Email-when-committee-is-dissolved-archived")}
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
                      name="EmailWhenCommitteeIsDissolvedArchived"
                      checkedValue={
                        organizationStates.EmailWhenCommitteeIsDissolvedArchived ||
                        false
                      }
                      onChange={ChangeEmailWhenCommitteeIsDissolvedArchived}
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
                      {t("Email-when-added-to-group")}
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
                      name="EmailWhenAddedToGroup"
                      checkedValue={
                        organizationStates.EmailWhenAddedToGroup || false
                      }
                      onChange={ChangeEmailWhenAddedToGroup}
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
                      {t("Push-notificatio-When-resolution-is-closed")}
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
                      onChange={ChangePushNotificationWhenResolutionIsClosed}
                      checkedValue={
                        organizationStates.PushNotificationWhenResolutionIsClosed ||
                        false
                      }
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
                      {t(
                        "Push-notification-when-resolution-is-cancelled-after-circulation"
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
                      name="PushNotificationwhenResolutionisCancelledafterCirculation"
                      checkedValue={
                        organizationStates.PushNotificationwhenResolutionisCancelledafterCirculation ||
                        false
                      }
                      onChange={
                        ChangePushNotificationwhenResolutionisCancelledafterCirculation
                      }
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
                      {t("Push-notification-when-removed-from-group")}
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
                      name="PushNotificationwhenRemovedfromGroup"
                      checkedValue={
                        organizationStates.PushNotificationwhenRemovedfromGroup ||
                        false
                      }
                      onChange={ChangePushNotificationwhenRemovedfromGroup}
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
                      name="PushNotificationwhenRemovedfromCommittee"
                      checkedValue={
                        organizationStates.PushNotificationwhenRemovedfromCommittee ||
                        false
                      }
                      onChange={ChangePushNotificationwhenRemovedfromCommittee}
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
                      name="PushNotificationwhenNewResolutionisCirculated"
                      checkedValue={
                        organizationStates.PushNotificationwhenNewResolutionisCirculated ||
                        false
                      }
                      onChange={
                        ChangePushNotificationwhenNewResolutionisCirculated
                      }
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
                      {t("Push-notification-when-group-is-set-inActive")}
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
                      name="PushNotificationwhenGroupissetInActive"
                      checkedValue={
                        organizationStates.PushNotificationwhenGroupissetInActive ||
                        false
                      }
                      onChange={ChangePushNotificationwhenGroupissetInActive}
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
                      {t("Push-notification-when-group-is-closed-archived")}
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
                      name="PushNotificationwhenGroupisClosedArchived"
                      checkedValue={
                        organizationStates.PushNotificationwhenGroupisClosedArchived ||
                        false
                      }
                      onChange={ChangePushNotificationwhenGroupisClosedArchived}
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
                      {t("Push-notification-when-committee-is-set-inActive")}
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
                      name="PushNotificationwhenCommitteeissetInActive"
                      checkedValue={
                        organizationStates.PushNotificationwhenCommitteeissetInActive ||
                        false
                      }
                      onChange={
                        ChangePushNotificationwhenCommitteeissetInActive
                      }
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
                      {t(
                        "Push-notification-when-committee-is-dissolved-archived"
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
                      name="PushNotificationwhenCommitteeisDissolvedArchived"
                      checkedValue={
                        organizationStates.PushNotificationwhenCommitteeisDissolvedArchived ||
                        false
                      }
                      onChange={
                        ChangePushNotificationwhenCommitteeisDissolvedArchived
                      }
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
                      {t("Push-notification-when-added-to-group")}
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
                      name="PushNotificationwhenAddedtoGroup"
                      checkedValue={
                        organizationStates.PushNotificationwhenAddedtoGroup ||
                        false
                      }
                      onChange={ChangePushNotificationwhenAddedtoGroup}
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
                      {t("Email-when-added-to-committee")}
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
                      name="EmailWhenAddedToCommittee"
                      checkedValue={
                        organizationStates.EmailWhenAddedToCommittee || false
                      }
                      onChange={ChangeEmailWhenAddedToCommittee}
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
                      {t("Email-when-a-Resolution-is-Closed")}
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
                      name="EmailwhenaResolutionisClosed"
                      checkedValue={
                        organizationStates.EmailwhenaResolutionisClosed || false
                      }
                      onChange={ChangeEmailwhenaResolutionisClosed}
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
                      {t("User-allow-google-calendar-synch")}
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
                      name="UserAllowGoogleCalendarSynch"
                      checkedValue={
                        organizationStates.UserAllowGoogleCalendarSynch || false
                      }
                      onChange={ChangeUserAllowGoogleCalendarSynch}
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
                      {t("User-allow-microsoft-calendar-synch")}
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
                      name="UserAllowMicrosoftCalendarSynch"
                      checkedValue={
                        organizationStates.UserAllowMicrosoftCalendarSynch ||
                        false
                      }
                      onChange={ChangeUserAllowMicrosoftCalendarSynch}
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
                        organizationStates.PushNotificationOnNewMeeting || false
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
                        organizationStates.PushNotificationOnEditMeeting ||
                        false
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
                      name="PushNotificationonCancelledDeletedMeeting"
                      checkedValue={
                        organizationStates.PushNotificationonCancelledDeletedMeeting ||
                        false
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
                      name="PushNotificationonCancelledDeletedMeeting"
                      checkedValue={
                        organizationStates.ShowNotificationOnParticipantJoining ||
                        false
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
                    className="d-flex justify-content-end FontArabicRegular"
                  >
                    <TextField
                      type="number"
                      value={organizationStates.DormatInactiveUsersforDays}
                      change={(e) => {
                        setOrganizationStates({
                          ...organizationStates,
                          DormatInactiveUsersforDays: parseInt(e.target.value),
                        });
                      }}
                      maxLength={360}
                      labelclass="d-none"
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
      {/* {settingReducer.Loading || LanguageReducer.Loading ? <Loader /> : null} */}
    </>
  );
};

export default Organization;
