import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";
import DiskusLogoHeader from "../../../assets/images/newElements/diskus_newheader.svg";
import DiskusHeaderSetting from "../../../assets/images/newElements/Diskus_newSetting.svg";
import DiskusHeaderInfo from "../../../assets/images/newElements/Diskus-infoIcon.svg";
import DiskusNotificationIcon from "../../../assets/images/newElements/Diskus-notification_icon.svg";
import "./Header.css";
import "../../../i18n.js";
import { useTranslation } from "react-i18next";
import { signOut } from "../../../store/actions/Auth_Sign_Out";
import { getUserSetting } from "../../../store/actions/GetUserSetting";
import currentUserImage from "../../../assets/images/avatar.png";
import { useLocation } from "react-router-dom";

const Header2 = () => {
  const location = useLocation();
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const { NotificationData, UserProfileData } = settingReducer;
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
    let currentUserID = localStorage.getItem("UserID");
    if (reload === true) {
      // dispatch(getNotifications(JSON.parse(currentUserID)));
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

  // const currentLocale = Cookies.get("i18next");
  let currentLanguage = localStorage.getItem("i18nextLng");

  const [language, setLanguage] = useState(currentLanguage);
  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    window.location.reload();
  };
  useEffect(() => {
    let currentLanguage = localStorage.getItem("i18nextLng");
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      setTimeout(() => {
        i18n.changeLanguage(currentLanguage);
        document.body.dir = currentLangObj.dir || "ltr";
      }, 1000);
    }
  }, [language, i18n]);
  const currentLangObj = languages.find((lang) => lang.code === language);

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  // }, [currentLangObj, t]);

  console.log(language, "currentLangObjcurrentLangObj");
  // console.log(currentLocale, "currentLangObjcurrentLangObj")
  console.log(i18n, "currentLangObjcurrentLangObj");
  return (
    <>
      <Navbar className="header2-container" expand="md" sticky="top">
        <Container>
          <Navbar.Brand
            as={Link}
            to={
              location.pathname.includes("/Admin")
                ? "/Diskus/Admin/Summary"
                : "/DisKus/home"
            }
          >
            <img src={DiskusLogoHeader} width={120} />
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Row className="mt-1">
              <Col
                lg={6}
                md={6}
                sm={6}
                xs={6}
                className="d-flex justify-content-start"
              >
                <select
                  className={"language-dropdown" + " " + currentLanguage}
                  onChange={handleChangeLocale}
                  value={language}
                >
                  {languages.map(({ name, code }) => (
                    <option
                      className="language-dropdown-value"
                      key={code}
                      defaultValue={code}
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

                    <p className={"user-name me-2" + " " + currentLanguage}>
                      {currentUserName}
                    </p>
                  </Dropdown.Toggle>
                  {location.pathname.includes("/Admin") ? (
                    <Dropdown.Menu className="dropdown_menu">
                      <Dropdown.Item
                        className={" text-black" + " " + currentLanguage}
                        onClick={() => forgotPasswordCheck()}
                      >
                        <Nav.Link
                          as={Link}
                          to="CustomerInformation"
                          className="text-black"
                        >
                          {/* Change Password */}
                          {t("Customer-Information")}
                        </Nav.Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className={" text-black" + " " + currentLanguage}
                        onClick={() => forgotPasswordCheck()}
                      >
                        <Nav.Link
                          // as={Link}
                          // to="forgotpassword"
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
                  ) : (
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
                  )}
                </Dropdown>
                <Nav.Link as={Link} to="faq's" className="mx-3">
                  <img src={DiskusHeaderInfo} width={25} />
                </Nav.Link>
                <Nav.Link className="me-2" as={Link} to="setting">
                  <img src={DiskusHeaderSetting} width={25} />
                </Nav.Link>
              </Col>
            </Row>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header2;
