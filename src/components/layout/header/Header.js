import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import Cookies from "js-cookie";
import MeetingChangesSvg from "../../../assets/images/meeting_changes-icon.svg";
import "../header2/Header.css";
import { useTour } from "@reactour/tour";
import TextField from "../../elements/input_field/Input_field";
import "../../../i18n.js";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Search,
  Mailbox,
  Paperclip,
  ChatSquareText,
  X,
} from "react-bootstrap-icons";
import { CustomDatePicker, ResultMessage } from "../../elements";
import CancelMeetingSvg from "../../../assets/images/cancel_meeting_icon.svg";
import {
  signOut,
  userLogOutApiFunc,
} from "../../../store/actions/Auth_Sign_Out";
import { dateTime } from "../../../commen/functions/date_formater";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { getUserSetting } from "../../../store/actions/GetUserSetting";

const Header = ({ currentUserImage }) => {
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const { NotificationData, UserProfileData } = settingReducer;
  const { LanguageReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    if (reload === false) {
      setReload(true);
    }
  }, []);
  useEffect(() => {
    let currentUserID = localStorage.getItem("userID");
    if (reload === true) {
      dispatch(getNotifications(navigate, JSON.parse(currentUserID)));
      dispatch(getUserSetting(navigate, JSON.parse(currentUserID), false));
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    if (UserProfileData !== undefined && UserProfileData !== null) {
      setCurrentUserName(UserProfileData.userProfile.name);
    }
  }, [UserProfileData]);
  const forgotPasswordCheck = () => {
    localStorage.setItem("globalPassowrdChecker", true);
  };

  console.log("NotificationData", settingReducer);

  const { t, i18n } = useTranslation();

  // Languages
  const languages = [
    { name: "English", code: "en" },
    // { name: "日本語", code: "ja" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
    // document.title = t("app_title");
  }, [currentLangObj, t]);

  let currentLanguage = localStorage.getItem("i18nextLng");

  console.log("LanguageReducer", LanguageReducer);

  return (
    <>
      <Container className="header-container">
        <Row className="mt-3 d-flex align-items-center">
          <Col
            sm={5}
            className="d-flex justify-content-start align-items-center"
          >
            <div className="header-heading  color-primary fw-600"></div>
          </Col>
          <Col
            sm={7}
            className="d-flex align-items-center  justify-content-end"
          >
            <Dropdown className="notification-dropdowns">
              <Dropdown.Toggle className="notification-dropdowntoggle">
                <Bell width="24px" height="24" />
              </Dropdown.Toggle>
              <Dropdown.Menu
                className={"notification-dropdown_menu" + " " + currentLanguage}
              >
                {NotificationData !== null &&
                NotificationData !== undefined &&
                NotificationData.length !== 0 ? (
                  NotificationData.map((notificationData, index) => {
                    // console.log("notificationData", notificationData);
                    return (
                      <>
                        <Dropdown.Item key={index}>
                          <Row className="d-flex justify-content-center ">
                            <Col sm={2}>
                              {notificationData.notificationTypes.pK_NTID ===
                              1 ? (
                                <div className="desc-notification-user ">
                                  <img
                                    src={MeetingChangesSvg}
                                    className="icon-class"
                                    draggable="false"
                                  />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                2 ? (
                                <div className="desc-notification-user ">
                                  <img
                                    src={MeetingChangesSvg}
                                    className="icon-class"
                                    draggable="false"
                                  />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                3 ? (
                                <div className="desc-notification-user blue">
                                  <Mailbox className="icon-class" />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                4 ? (
                                <div className="desc-notification-user">
                                  <img
                                    src={CancelMeetingSvg}
                                    className="icon-class"
                                    draggable="false"
                                  />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                5 ? (
                                <div className="desc-notification-user red">
                                  <X className="icon-class" />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                6 ? (
                                <div className="desc-notification-user orange">
                                  <ChatSquareText className="icon-class" />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                7 ? (
                                <div className="desc-notification-user blue">
                                  <Bell className="icon-class" />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                8 ? (
                                <div className="desc-notification-user green">
                                  <Search className="icon-class" />
                                </div>
                              ) : notificationData.notificationTypes.pK_NTID ===
                                9 ? (
                                <div className="desc-notification-user red">
                                  <Mailbox className="icon-class" />
                                </div>
                              ) : (
                                <div className="desc-notification-user orange">
                                  <Paperclip className="icon-class" />
                                </div>
                              )}
                            </Col>
                            <Col
                              sm={10}
                              className="d-flex justify-content-between"
                            >
                              <p className="desc-item-text">
                                {notificationData.description}
                              </p>
                            </Col>
                            <Row>
                              <Col
                                sm={12}
                                className="desc-item-time d-flex justify-content-end"
                              >
                                {
                                  <TimeAgo
                                    datetime={dateTime(
                                      notificationData.creationDateTime
                                    )}
                                    locale="en"
                                  />
                                }
                              </Col>
                            </Row>
                          </Row>
                        </Dropdown.Item>
                      </>
                    );
                  })
                ) : (
                  <ResultMessage
                    icon={<Mailbox className="notification-icon" />}
                    subTitle="No New Notifications"
                    className="notification-text"
                  />
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* <span>{t("languages")}</span>{" "} */}
            <select
              className={"language-dropdown" + " " + currentLanguage}
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option
                  className="language-dropdown-value"
                  key={code}
                  value={code}
                >
                  {name}
                </option>
              ))}
            </select>

            <Dropdown className="profilebtn-dropdown">
              <Dropdown.Toggle className="dropdown-toggle">
                <img
                  src={currentUserImage}
                  className="user-img "
                  draggable="false"
                />

                <p className={"user-name" + " " + currentLanguage}>
                  {currentUserName}
                </p>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown_menu">
                <Dropdown.Item
                  href="forgotpassword"
                  className={"my-2" + " " + currentLanguage}
                  onClick={() => forgotPasswordCheck()}
                >
                  <Nav.Link as={Link} to="forgotpassword">
                    {/* Change Password */}
                    {t("Change-password")}
                  </Nav.Link>
                </Dropdown.Item>
                <Dropdown.Item
                  className={currentLanguage}
                  onClick={() => dispatch(userLogOutApiFunc(navigate, t))}
                >
                  {/* Sign Out */}
                  {t("Sign-out")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Header;
