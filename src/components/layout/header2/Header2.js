import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Nav,
  Navbar,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
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
import { getPackageExpiryDetail } from "../../../store/actions/GetPackageExpirtyDetails";
import { Button, Modal } from "../../../components/elements";

const Header2 = () => {
  const location = useLocation();
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const { NotificationData, UserProfileData } = settingReducer;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  console.log("settingReducersettingReducersettingReducer", settingReducer);
  //for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activateBlur, setActivateBlur] = useState(false);

  let Blur = localStorage.getItem("blur");

  useEffect(() => {
    if (Blur != undefined) {
      console.log("Blur", Blur);

      setActivateBlur(true);
    } else {
      console.log("Blur", Blur);

      setActivateBlur(false);
    }
  }, [Blur]);
  useEffect(() => {
    if (reload === false) {
      setReload(true);
    }
  }, []);
  useEffect(() => {
    let currentUserID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    // dispatch(getNotifications(JSON.parse(currentUserID)));
    dispatch(getPackageExpiryDetail(JSON.parse(OrganizationID), t));
    dispatch(getUserSetting(JSON.parse(currentUserID), t));
  }, []);

  useEffect(() => {
    if (UserProfileData !== undefined && UserProfileData !== null) {
      setCurrentUserName(UserProfileData?.userName);
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

  const dropDownMenuFunction = () => {
    setDropdownOpen(!dropdownOpen);
    if (dropdownOpen === false) {
      document.body.classList.add("blur-background");
    } else {
      document.body.classList.remove("blur-background");
    }
  };

  const [show, setShow] = useState(false);

  // for modal create  handler
  const modalLogoutHandler = async (e) => {
    await setShow(true);
  };

  const handleCancel = async (e) => {
    await setShow(false);
  };

  const logoutFunction = () => {
    dispatch(signOut(navigate));
  };

  return (
    <>
      {activateBlur ? (
        <Navbar className="header2-container " sticky="top">
          <Container>
            <Navbar.Brand
              as={Link}
              // to={
              //   location.pathname.includes("/Admin")
              //     ? "/DisKus/Admin/PayOutstanding"
              //     : "/DisKus/Admin/PayOutstanding"
              // }
            >
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
                    defaultValue={code}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <Nav.Link disabled={true} className="me-2">
                <div className="dropdown-btn">
                  <DropdownButton
                    id="dropdown-basic-button"
                    className="dropdown-btn"
                    title={<img src={DiskusNotificationIcon} width={33} />}
                    onClick={dropDownMenuFunction}
                  >
                    <Dropdown.Item
                      href="#action/3.1"
                      className="title-className"
                    >
                      Upload Documents
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.2"
                      className="title-className"
                    >
                      Create a Meeting
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.3"
                      className="title-className"
                    >
                      Data Room
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.4"
                      className="title-className"
                    >
                      Pending Tasks{" "}
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.4"
                      className="title-language-className"
                    >
                      Language: English{" "}
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
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
                        disabled={true}
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
                        as={Link}
                        disabled={true}
                        to="changePassword"
                        className="text-black"
                      >
                        {/* Change Password */}
                        {t("Change-Password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalLogoutHandler}
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
                        disabled={true}
                      >
                        {/* Change Password */}
                        {t("Change-Password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalLogoutHandler}
                    >
                      {/* Sign Out */}
                      <Nav.Link className="text-black border-none">
                        {t("Sign-Out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}
              </Dropdown>
              <Nav.Link disabled={true} as={Link} to="faq's" className="mx-3">
                <img src={DiskusHeaderInfo} width={25} />
              </Nav.Link>
              <Nav.Link disabled={true} className="me-2" as={Link} to="setting">
                <img src={DiskusHeaderSetting} width={25} />
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <Navbar className="header2-container " sticky="top">
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
                    defaultValue={code}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <Nav.Link className="me-2">
                <div className="dropdown-btn">
                  <DropdownButton
                    id="dropdown-basic-button"
                    className="dropdown-btn"
                    title={<img src={DiskusNotificationIcon} width={33} />}
                    onClick={dropDownMenuFunction}
                  >
                    <Dropdown.Item
                      href="#action/3.1"
                      className="title-className"
                    >
                      Upload Documents
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.2"
                      className="title-className"
                    >
                      Create a Meeting
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.3"
                      className="title-className"
                    >
                      Data Room
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.4"
                      className="title-className"
                    >
                      Pending Tasks{" "}
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#action/3.4"
                      className="title-language-className"
                    >
                      Language: English{" "}
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
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
                        as={Link}
                        to="changePassword"
                        className="text-black"
                      >
                        {/* Change Password */}
                        {t("Change-Password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalLogoutHandler}
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
                      onClick={modalLogoutHandler}
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
            </Nav>
          </Container>
        </Navbar>
      )}
      {show ? (
        <Modal
          show={show}
          setShow={setShow}
          centered
          size={"md"}
          ModalBody={
            <Row className="mb-3">
              <Col lg={2} md={2} sm={12} />
              <Col
                lg={8}
                md={8}
                sm={12}
                className="d-flex justify-content-center"
              >
                <label className="MontserratSemiBold logout-confirmation-label">
                  Are you sure you want to log out?
                </label>
              </Col>
              <Col lg={2} md={2} sm={12} />
            </Row>
          }
          ModalFooter={
            <Col sm={12} md={12} lg={12}>
              <Row className="mb-3">
                <Col lg={6} md={6} sm={12} className="text-end">
                  <Button
                    className="MontserratSemiBold Cancel-btn"
                    text={t("Cancel")}
                    onClick={handleCancel}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="text-start">
                  <Button
                    className="MontserratSemiBold Ok-Successfull-btn"
                    text={"Log out"}
                    onClick={logoutFunction}
                  />
                </Col>
              </Row>
            </Col>
          }
        />
      ) : null}
    </>
  );
};

export default Header2;
