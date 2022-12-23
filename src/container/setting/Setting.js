import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Accordian,
  SelectBox,
  Switch,
  Notification,
} from "./../../components/elements";
import Select from "react-select";
import updateUserGeneralSetting from "../../store/actions/UpdateUserGeneralSetting";
import updateUserNotification from "../../store/actions/UpdateUserNotificationSetting";
import updateUserUpdateProfile from "../../store/actions/UpdateUserProfile";
import getCountryCodeFunc from "../../store/actions/GetCountryCode";
import GetUserSetting from "../../store/actions/GetUserSetting";
import GetUserNotification from "../../store/actions/GetUserNotification";
import getTimeZone from "../../store/actions/GetTimeZone";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Loader } from "./../../components/elements";
import "./Setting.css";
import CustomUpload from "../../components/elements/upload/Upload";
import { useTranslation } from "react-i18next";
// import SimpleSelect from "../../components/elements/select_dropdown_for_Object/Select_Dropdown_for_Object";
// import SelectForCC from '../../components/elements/select_dropdown_for_Object-for-CC/Select_Dropdown_for_Object_CC'
const CustomSetting = () => {
  //For Localization
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const [reload, setReload] = useState(false);
  const { UserProfileData, ResponseMessage, Loading, UpdateSuccessfull } =
    settingReducer;
  const { CountryCodes, TimeZone } = settingReducer;
  const [countryCodeValue, setCountryCodeValue] = useState({
    label: "",
    value: "",
  });
  console.log("Loading", Loading);
  const [countrycode, setCountryCode] = useState([]);
  const [timeZoneValue, setTimeZoneValue] = useState({
    label: "",
    value: "",
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [timezone, setTimeZone] = useState([]);
  console.log("ResponseMessage", ResponseMessage);
  // profile user values
  const [userProfileValues, setUserProfile] = useState({
    PK_UID: 0,
    Name: "",
    Designation: "",
    ProfilePicture: "",
    Organization: "",
    CountryCode: "",
    EmailAddress: "",
    Password: "",
    MobileNumber: "",
  });
  //userGeneralsetting State
  const [getUserGeneralSettingData, setGetUserGeneralSettingData] = useState({
    PK_UGSID: 0,
    FK_TZID: 0,
    FK_CCID: 0,
    IsSynchronizeDocument: "",
    AutomaticallyMeetingEndTime: "",
    FK_UID: 0,
  });
  // user Notification State
  const [getUserNotification, setUserNotification] = useState({
    PK_UNSID: 0,
    OnCancelledMeeting: "",
    Sound: "",
    Email_NewMeeting: "",
    Email_CancelledMeeting: "",
    Email_EditMeeting: "",
    Email_ReminderTimeIsReached: "",
    Toast_ParticipantJoiningMeeting: "",
    Toast_ParticipantLeavingMeeting: "",
    FK_UID: 0,
  });

  // calling api for settings and notifications
  useEffect(() => {
    let currentUserID = localStorage.getItem("UserID");
    dispatch(getCountryCodeFunc());
    dispatch(getTimeZone());
    console.log("check 2 on reload");
  }, []);

  //user profile change handler
  const changeUserProfileValueHandler = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    var valueCheck = fieldValue.replace(/^\s/g, "");
    setUserProfile({
      ...userProfileValues,
      [fieldName]: valueCheck.trimStart(),
    });
  };

  // user general setting change handler
  const userGeneralSettingChangeHandler = (e) => {
    let userGeneralFieldName = e.target.name;
    let userGeneralFieldValue = e.target.value;
    var valueCheck = userGeneralFieldValue.replace(/^\s/g, "");
    setGetUserGeneralSettingData({
      ...getUserGeneralSettingData,
      [userGeneralFieldName]: valueCheck.trimStart(),
    });
  };

  // Time Zone Change Handler
  const timezoneChangeHandler = (event) => {
    setTimeZoneValue({
      label: event.label,
      value: event.value,
    });

    setGetUserGeneralSettingData({
      ...getUserGeneralSettingData,
      ["FK_TZID"]: event.value,
    });
  };
  // Country Code Change Handler
  const countryCodeChandeHandler = (event) => {
    setCountryCodeValue({
      label: event.label,
      value: event.value,
    });

    setGetUserGeneralSettingData({
      ...getUserGeneralSettingData,
      ["FK_CCID"]: event.value,
    });
  };
  // switch for sync document change handler
  const synchronizeDocuments = (checked) => {
    setGetUserGeneralSettingData({
      ...getUserGeneralSettingData,
      IsSynchronizeDocument: checked,
    });
  };

  // upload profile picture change handler
  const profilePictureupload = (event) => {
    setUserProfile({
      ...userProfileValues,
      ProfilePicture: "abc",
    });
  };

  // switch change handler for notification on call meeting
  const notificatononcallmeeting = (checked) => {
    setUserNotification({
      ...getUserNotification,
      OnCancelledMeeting: checked,
    });
  };

  // switch change handler for sounds notification
  const soundonNotification = (checked) => {
    setUserNotification({
      ...getUserNotification,
      Sound: checked,
    });
  };

  // switch change handler for email new meetings
  const emailNewMeeting = (checked) => {
    setUserNotification({
      ...getUserNotification,
      Email_NewMeeting: checked,
    });
  };

  // switch change handler for email edit meetings
  const emailEditMeeting = (checked) => {
    setUserNotification({
      ...getUserNotification,
      Email_EditMeeting: checked,
    });
  };

  // switch change handler for email cancelling
  const emailCancelMeeting = (checked) => {
    setUserNotification({
      ...getUserNotification,
      Email_CancelledMeeting: checked,
    });
  };

  // dispatch general settings
  const handleClickGeneralSetting = async () => {
    let currentUserID = localStorage.getItem("UserID");
    console.log("getUserGeneralSettingData", getUserGeneralSettingData);
    await dispatch(updateUserGeneralSetting(getUserGeneralSettingData));

    if (UpdateSuccessfull) {
      setOpen({
        ...open,
        open: true,
        message: t("Update-General-Setting-Succesffuly"),
      });
    }
  };

  // dispatch user profile settings
  const handleClickUserProfileSetting = async () => {
    await dispatch(updateUserUpdateProfile(userProfileValues));

    if (UpdateSuccessfull) {
      setOpen({
        ...open,
        open: true,
        message: t("Update-User-Profile-Successfully"),
      });
    }
  };

  // dispatch update notification settings
  const handleNotificationSetting = async () => {
    let currentUserID = localStorage.getItem("UserID");
    await dispatch(updateUserNotification(getUserNotification));

    if (UpdateSuccessfull) {
      setOpen({
        ...open,
        open: true,
        message: t("Update-User-Notifications-Successfully"),
      });
    }
  };
  // Time Zones set in values
  useEffect(() => {
    if (TimeZone !== undefined && TimeZone !== null) {
      let newData = [];
      TimeZone.map((data, index) => {
        newData.push({ label: data.gmtOffset, value: data.pK_TZID });
      });
      setTimeZone(newData);
    }
  }, [TimeZone]);
  // Country Code set in values
  useEffect(() => {
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
  }, [CountryCodes]);
  // get values from API
  useEffect(() => {
    if (UserProfileData !== null && UserProfileData !== undefined) {
      let profileData = UserProfileData.userProfile;
      if (profileData !== null && profileData !== undefined) {
        setUserProfile({
          ...userProfileValues,
          PK_UID: profileData.pK_UID,
          Name: profileData.name,
          Designation: profileData.designation,
          ProfilePicture: profileData.profilePicture,
          Organization: profileData.organization,
          CountryCode: "",
          EmailAddress: profileData.emailAddress,
          Password: profileData.password,
          MobileNumber: profileData.mobileNumber,
        });
      }
      let userGeneralSettingData = UserProfileData.userGeneralSettings;
      setGetUserGeneralSettingData({
        ...getUserGeneralSettingData,
        PK_UGSID: userGeneralSettingData.pK_UGSID,
        FK_TZID: userGeneralSettingData.fK_TZID,
        FK_CCID: userGeneralSettingData.fK_CCID,
        IsSynchronizeDocument: userGeneralSettingData.isSynchronizeDocument,
        AutomaticallyMeetingEndTime:
          userGeneralSettingData.automaticallyMeetingEndTime,
        FK_UID: userGeneralSettingData.fK_UID,
      });
      if (TimeZone !== undefined && TimeZone !== null) {
        let timeZoneCurrentValue = TimeZone.filter((data, index) => {
          return data.pK_TZID === userGeneralSettingData.fK_TZID;
        });
        setTimeZoneValue({
          label: timeZoneCurrentValue[0]?.gmtOffset,
          value: timeZoneCurrentValue[0]?.pK_TZID,
        });
      }
      if (CountryCodes !== undefined && CountryCodes !== null) {
        let countryCodeCurrentValue = CountryCodes.filter((data, index) => {
          return data.pK_CCID === userGeneralSettingData.fK_CCID;
        });
        setCountryCodeValue({
          label: countryCodeCurrentValue[0]?.code,
          value: countryCodeCurrentValue[0]?.pK_CCID,
        });
      }
      let userNotificationSettingData =
        UserProfileData.userNotificationSettings;
      setUserNotification({
        ...getUserNotification,
        PK_UNSID: userNotificationSettingData.pK_UNSID,
        OnCancelledMeeting: userNotificationSettingData.onCancelledMeeting,
        Sound: userNotificationSettingData.sound,
        Email_NewMeeting: userNotificationSettingData.email_NewMeeting,
        Email_CancelledMeeting:
          userNotificationSettingData.email_CancelledMeeting,
        Email_EditMeeting: userNotificationSettingData.email_EditMeeting,
        Email_ReminderTimeIsReached:
          userNotificationSettingData.email_ReminderTimeIsReached,
        Toast_ParticipantJoiningMeeting:
          userNotificationSettingData.toast_ParticipantJoiningMeeting,
        Toast_ParticipantLeavingMeeting:
          userNotificationSettingData.toast_ParticipantLeavingMeeting,
        FK_UID: userNotificationSettingData.fK_UID,
      });
    }
  }, [UserProfileData]);

  useEffect(() => {
    console.log("timezone", timezone);
    if (TimeZone !== undefined && TimeZone !== null) {
      let timeZoneCurrentValue = TimeZone.filter((data, index) => {
        return data.pK_TZID === getUserGeneralSettingData.FK_TZID;
      });
      setTimeZoneValue({
        label: timeZoneCurrentValue[0]?.gmtOffset,
        value: timeZoneCurrentValue[0]?.pK_TZID,
      });
    }
  }, [TimeZone]);

  useEffect(() => {
    console.log("countryCode", countrycode);
    if (CountryCodes !== undefined && CountryCodes !== null) {
      let countryCodeCurrentValue = CountryCodes.filter((data, index) => {
        return data.pK_CCID === getUserGeneralSettingData.FK_CCID;
      });
      setCountryCodeValue({
        label: countryCodeCurrentValue[0]?.code,
        value: countryCodeCurrentValue[0]?.pK_CCID,
      });
    }
  }, [CountryCodes]);

  //loading overflow hidden
  useEffect(() => {
    if (settingReducer.Loading === false) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [settingReducer.Loading]);

  console.log("Values", timeZoneValue, countryCodeValue);

  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <>
      <Container className="mt-4">
        <Col sm={6} xs={12}>
          {/* User General Setting  */}
          <Accordian
            defaultActiveKey="0"
            flush
            className={"Setting" + " " + currentLanguage}
            AccordioonHeader={
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className="fs-5">
                      {t("General-Settings-Title")}
                    </label>
                  </Col>
                </Row>
              </>
            }
            AccordioonBody={
              <>
                <Row className="mt-1 d-flex align-items-center">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>{t("Time-Zone-Title")}</label>
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
                    lg={8}
                    md={8}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <label>{t("Country-Code-Title")}</label>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Select
                      options={countrycode}
                      width="120px"
                      value={countryCodeValue}
                      defaultValue={{
                        label: countryCodeValue.label,
                        value: countryCodeValue.value,
                      }}
                      onChange={countryCodeChandeHandler}
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
                    <label>{t("Synchronize-Documents-Title")}</label>
                  </Col>
                  <Col
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={
                        getUserGeneralSettingData.IsSynchronizeDocument
                      }
                      onChange={synchronizeDocuments}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>
                      {t("Automatically-End-Meeting-After-Title")}{" "}
                      <input
                        className="border-0 border-bottom w-25 text-center"
                        name="AutomaticallyMeetingEndTime"
                        type="text"
                        onChange={userGeneralSettingChangeHandler}
                        value={
                          getUserGeneralSettingData.AutomaticallyMeetingEndTime
                        }
                      />{" "}
                      {t("Hours-Title")}
                    </label>
                  </Col>
                  <Col sm={12} lg={12} className="d-flex justify-content-end">
                    <Button
                      className="mt-3"
                      onClick={handleClickGeneralSetting}
                      text={t("Update-Modal-Button")}
                    />
                  </Col>
                </Row>
              </>
            }
          />
          {/* User Profile  */}
          <Accordian
            defaultActiveKey="0"
            className={"Setting" + " " + currentLanguage}
            AccordioonHeader={
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className="fs-5">
                      {t("Profile-Settings-Title")}
                    </label>
                  </Col>
                </Row>
              </>
            }
            AccordioonBody={
              <>
                <Row className="mt-1">
                  <Col lg={10} md={10} sm={12} xs={12}>
                    <label>{t("Profile-Picture-Title")}</label>
                  </Col>
                  <Col lg={2} md={2} sm={12} xs={12}>
                    <CustomUpload
                      name="ProfilePicture"
                      change={profilePictureupload}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                      className="UploadFileButton"
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <label className="margin-top-25">
                      {t("Profile-Name-Title")}
                    </label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="text"
                      name="Name"
                      placeholder={t("Enter-Name")}
                      value={userProfileValues?.Name || ""}
                      change={changeUserProfileValueHandler}
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <label className="margin-top-25">{t("Designation")}</label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="text"
                      name="Designation"
                      placeholder={t("Enter-Designation")}
                      change={changeUserProfileValueHandler}
                      value={userProfileValues?.Designation || ""}
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <label className="margin-top-25">{t("EmailAddress")}</label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="text"
                      name="EmailAddress"
                      placeholder={t("Enter-Email")}
                      change={changeUserProfileValueHandler}
                      value={userProfileValues?.EmailAddress || ""}
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <label className="margin-top-25">{t("PhoneNumber")}</label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="text"
                      placeholder={t("Enter-Number")}
                      name="MobileNumber"
                      value={userProfileValues?.MobileNumber || ""}
                      change={changeUserProfileValueHandler}
                      maxLength={11}
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <label className="margin-top-25">
                      {t("Current-Password-Title")}
                    </label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="password"
                      placeholder={"*********"}
                      name="Password"
                      value={userProfileValues?.Password || ""}
                      change={changeUserProfileValueHandler}
                    />
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col lg={6} md={6} sm={12} xs={12} className="margin-top-25">
                    <label>{t("Newpassword-Heading")}</label>
                  </Col>
                  <Col lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      applyClass="form-control2"
                      type="password"
                      placeholder={"*********"}
                    />
                  </Col>
                  <Col sm={12} lg={12} className="d-flex justify-content-end">
                    <Button
                      className="mt-3"
                      onClick={handleClickUserProfileSetting}
                      text={t("Update-Modal-Button")}
                    />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Notification Setting */}
          <Accordian
            className={"Setting" + " " + currentLanguage}
            AccordioonHeader={
              <>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className="fs-5">
                      {t("Notification-Settings-Title")}
                    </label>
                  </Col>
                </Row>
              </>
            }
            AccordioonBody={
              <>
                <Row className="mt-4">
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>
                      {t("Notification-On-Cancelled-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={
                        getUserNotification.OnCancelledMeeting || false
                      }
                      onChange={notificatononcallmeeting}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={8}
                    md={8}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>{t("Sound-On-Notification-Title")}</label>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={getUserNotification.Sound}
                      onChange={soundonNotification}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>{t("Email-Notification-Title")}</label>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className="margin-left--30">
                      {t("New-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={getUserNotification.Email_NewMeeting}
                      onChange={emailNewMeeting}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className="margin-left--15">
                      {t("Editing-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={getUserNotification.Email_EditMeeting}
                      onChange={emailEditMeeting}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className="m-0">
                      {t("Cancelled-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch
                      checkedValue={getUserNotification.Email_CancelledMeeting}
                      onChange={emailCancelMeeting}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>{t("Push-Notification-Title")}</label>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className="margin-left--15">
                      {t("New-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch checkedValue={false} />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label>{t("Editing-Meeting-Title")}</label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch checkedValue={false} />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <label className="m-0">
                      {t("Cancelled-Meeting-Title")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Switch checkedValue={false} />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label>
                      {t("Show-Notification-On-Participant-Joining")}
                    </label>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <SelectBox />
                  </Col>
                  <Col sm={12} lg={12} className="d-flex justify-content-end">
                    <Button
                      className="mt-3"
                      onClick={handleNotificationSetting}
                      text={t("Update-Modal-Button")}
                    />
                  </Col>
                </Row>
              </>
            }
          />
          {/* Term and Condition */}
          <Accordian
            className={"Setting" + " " + currentLanguage}
            AccordioonHeader={
              <>
                <label className="fs-5">
                  {t("Terms-and-Conditions-Title")}
                </label>
              </>
            }
            AccordioonBody={<></>}
          />
        </Col>
      </Container>
      {settingReducer.Loading ? (
        <Loader />
      ) : timeZoneValue.label === "" ||
        timeZoneValue.value === "" ||
        countryCodeValue.label === "" ||
        countryCodeValue.value === "" ||
        timeZoneValue.label === undefined ||
        timeZoneValue.value === undefined ||
        countryCodeValue.label === undefined ||
        countryCodeValue.value === undefined ? (
        <Loader />
      ) : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};
export default CustomSetting;
