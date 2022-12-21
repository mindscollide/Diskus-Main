import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import Cookies from "js-cookie";
import DiskusLogoHeader from "../../../assets/images/newElements/diskus_newheader.svg";
import DiskusHeaderSetting from "../../../assets/images/newElements/Diskus_newSetting.svg";
import DiskusHeaderInfo from "../../../assets/images/newElements/Diskus-infoIcon.svg";
import DiskusNotificationIcon from "../../../assets/images/newElements/Diskus-notification_icon.svg";
import "./Header.css";
import moment from 'moment'
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
import { signOut } from "../../../store/actions/Auth_Sign_Out";
import { dateTime } from "../../../commen/functions/date_formater";
import { getNotifications } from "../../../store/actions/GetUserNotification";
import { getUserSetting } from "../../../store/actions/GetUserSetting";
import currentUserImage from "../../../assets/images/avatar.png";
import { useLocation } from "react-router-dom";
import NavbarAdmin from "../navbar/Navbar";
import Helper from "../../../commen/functions/history_logout";

const Header2 = () => {
  const location = useLocation();
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const { NotificationData, UserProfileData } = settingReducer;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [isPageReload, setIsPageReload] = useState(false)

  useEffect(() => {
    if (reload === false) {
      setReload(true);
    }
  }, []);
  useEffect(() => {
    let currentUserID = localStorage.getItem("UserID");
    if (reload === true) {
      dispatch(getNotifications(JSON.parse(currentUserID)));
      dispatch(getUserSetting(JSON.parse(currentUserID)));
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
    window.location.reload()
    Helper.isReload = true;
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);

  

    moment.locale(lang);
  };
  useEffect(() => {
    console.log("hjsdhad", Helper.isReload);
    if (Helper.isReload) {
      console.log("hjsdhad", Helper.isReload);
      window.location.reload();
      Helper.isReload = false;
      document.body.dir = currentLangObj.dir || "ltr";
    }
  }, [language]);
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
    // document.title = t("app_title");
  }, [currentLangObj, t]);

  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <>

      <Navbar className="header2-container mb-3" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/Diskus/home">
            <img src={DiskusLogoHeader} width={120} />
          </Navbar.Brand>
          <Nav className="ml-auto">
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
            <Nav.Link className="me-2">
              <img src={DiskusNotificationIcon} width={25} />
            </Nav.Link>
            <Dropdown className="profilebtn-dropdown">
              <Dropdown.Toggle className="dropdown-toggle">
                <img
                  src={currentUserImage}
                  className="user-img me-3 "
                  width={30}
                />

                <p className={"user-name me-4" + " " + currentLanguage}>
                  {currentUserName}
                </p>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown_menu">
                <Dropdown.Item
                  className={" text-black" + " " + currentLanguage}
                  onClick={() => forgotPasswordCheck()}
                >
                  <Nav.Link
                    as={Link}
                    to="forgotpassword"
                    className="text-black"
                  >
                    {/* Change Password */}
                    {t("Change-Password")}
                  </Nav.Link>
                </Dropdown.Item>
                <Dropdown.Item
                  className={currentLanguage}
                  onClick={() => dispatch(signOut(navigate))}
                >
                  {/* Sign Out */}
                  <Nav.Link className="text-black border-none">
                    {t("Sign-Out")}
                  </Nav.Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link className="mx-3">
              <img src={DiskusHeaderInfo} width={25} />
            </Nav.Link>
            <Nav.Link className="me-2" as={Link} to="setting">
              <img src={DiskusHeaderSetting} width={25} />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header2;
