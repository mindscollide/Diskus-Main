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
import {
  getUserDetails,
  getUserSetting,
} from "../../../store/actions/GetUserSetting";
import currentUserImage from "../../../assets/images/avatar.png";
import LanguageIcon from "../../../assets/images/Language.svg";
import { useLocation } from "react-router-dom";
import { getPackageExpiryDetail } from "../../../store/actions/GetPackageExpirtyDetails";
import { Button, Loader, Modal } from "../../../components/elements";
import UserProfile from "../../../container/authentication/User_Profile/UserProfile";
import { Select } from "antd";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useRef } from "react";
import LanguageSelector from "../../elements/languageSelector/Language-selector";

const Header2 = () => {
  const location = useLocation();
  // const languageref = useRef()
  const state = useSelector((state) => state);
  const { settingReducer } = state;
  const { NotificationData, UserProfileData, GetUserDetailsResponse } =
    settingReducer;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);
  //for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activateBlur, setActivateBlur] = useState(false);
  let roleID = localStorage.getItem("roleID");

  // for userProfile
  const [userProfileModal, setUserProfileModal] = useState(false);
  //for userprofile edit modal
  const [editFlag, setEditFlag] = useState(false);
  const [modalsflag, setModalsflag] = useState(false);
  // const [languageforView, setLanguageforView] = useState("")
  let Blur = localStorage.getItem("blur");
  // const [languageDropdown, setLanguageDropdown] = useState(false)
  // Languages
  // const languages = [
  //   { name: "English", code: "en" },
  //   // { name: "日本語", code: "ja" },
  //   { name: "Français", code: "fr" },
  //   { name: "العربية", code: "ar", dir: "rtl" },
  // ];

  // const currentLocale = Cookies.get("i18next");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();
  // useEffect(() => {
  //   if (currentLanguage !== null) {
  //     let currentLanguageForView = languages.filter((data, index) => data.code === currentLanguage)
  //     console.log(currentLanguageForView, "currentLanguageForViewcurrentLanguageForViewcurrentLanguageForView")
  //     setLanguageforView(currentLanguageForView[0].name)
  //   }
  // }, [])
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
    dispatch(getUserSetting(navigate, t));
  }, []);

  useEffect(() => {
    console.log("UserProfileDataUserProfileData", UserProfileData);
    if (UserProfileData !== undefined && UserProfileData !== null) {
      setCurrentUserName(UserProfileData?.userName);
      setCurrentUserProfilePic(
        UserProfileData?.userProfilePicture?.displayProfilePictureName
      );
    }
  }, [UserProfileData]);

  // const [language, setLanguage] = useState(currentLanguage);

  const forgotPasswordCheck = () => {
    localStorage.setItem("globalPassowrdChecker", true);
  };

  // const handleChangeLocale = (lang) => {
  //   setLanguageDropdown(false)
  //   setLanguage(lang);
  //   let currentLanguageForView = languages.filter((data, index) => data.code === lang)
  //   console.log(currentLanguageForView, "currentLanguageForViewcurrentLanguageForViewcurrentLanguageForView")
  //   setLanguageforView(currentLanguageForView[0].name)
  //   localStorage.setItem("i18nextLng", lang);
  //   window.location.reload();
  // };
  // const currentLangObj = languages.find((lang) => lang.code === language);

  // useEffect(() => {
  //   let currentLanguage = localStorage.getItem("i18nextLng");
  //   if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  //     setTimeout(() => {
  //       i18n.changeLanguage(currentLanguage);
  //       document.body.dir = currentLangObj.dir || "ltr";
  //     }, 1000);
  //   }
  // }, [i18n]);

  const dropDownMenuFunction = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // userProfile handler
  const modalUserProfileHandler = (e) => {
    // setUserProfileModal(true);
    let userID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    dispatch(
      getUserDetails(navigate, userID, t, OrganizationID, setUserProfileModal)
    );
  };

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
  // const handleOutsideClick = (event) => {
  //   if (
  //     languageref.current &&
  //     !languageref.current.contains(event.target) &&
  //     languageDropdown
  //   ) {
  //     setLanguageDropdown(false)
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('click', handleOutsideClick)
  //   return () => {
  //     document.removeEventListener('click', handleOutsideClick)
  //   }
  // }, [languageDropdown])

  return (
    <>
      {activateBlur ? (
        <Navbar className="header2-container " sticky="top">
          {/* <Container> */}
          <section className="d-flex justify-content-between w-100  align-items-center px-5">
            <Navbar.Brand
              as={Link}
              to={
                location.pathname.includes("/Admin")
                  ? "/Diskus/Admin/Summary"
                  : "/DisKus/home"
              }
            >
              <img src={DiskusLogoHeader} alt="" width={120} />
            </Navbar.Brand>
            <Nav className="ml-auto align-items-center">
              <LanguageSelector />
              <Nav.Link className="me-2">
                <div className="dropdown-btn_dotted">
                  <DropdownButton
                    id="dropdown-btn_dotted"
                    className="dropdown-btn_dotted"
                    disabled={true}
                    title={
                      <img src={DiskusNotificationIcon} alt="" width={28} />
                    }
                    onClick={dropDownMenuFunction}
                  >
                    <Dropdown.Item className="d-flex title-className">
                      {t("Quick-meeting")}
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex title-className">
                      {t("Upload-document")}
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex title-className">
                      {t("Recently-added-files")}
                    </Dropdown.Item>
                    {/* <Dropdown.Item className="title-className">
                      {t("Upload-documents")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Create-a-meeting")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Data-room")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Pending-tasks")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-language-className">
                      {t("Language")}
                    </Dropdown.Item> */}
                  </DropdownButton>
                </div>
              </Nav.Link>
              <Dropdown className="profilebtn-dropdown">
                <Dropdown.Toggle className="dropdown-toggle">
                  <img
                    src={`data:image/jpeg;base64,${currentUserProfilePic}`}
                    className="user-img me-3 "
                    width={30}
                    alt=""
                  />

                  <p className={`${"user-name me-2"} ${currentLanguage}`}>
                    {currentUserName}
                  </p>
                </Dropdown.Toggle>
                {location.pathname.includes("/Admin") ? (
                  <Dropdown.Menu className="dropdown_menu_admin">
                    <Dropdown.Item
                      className={`${" text-black"} ${currentLanguage}`}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="CustomerInformation"
                        disabled={true}
                        className="text-black"
                      >
                        {/* Change Password */}
                        {t("Customer-information")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="changePassword"
                        disabled={true}
                        className="text-black"
                      >
                        {/* Change Password */}
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      // className={currentLanguage}
                      onClick={modalLogoutHandler}
                    >
                      {/* Sign Out */}
                      <Nav.Link className="SignOutOptionMenu text-black border-none">
                        {t("Sign-out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu className="Profile_dropdown_menu">
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalUserProfileHandler}
                    >
                      <Nav.Link className="d-flex text-black border-none FontClass">
                        {t("My-profile")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="setting"
                        className="d-flex text-black FontClass"
                      >
                        {/* Change Password */}
                        {t("Setting")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="faq's"
                        className="d-flex text-black FontClass"
                      >
                        {/* Change Password */}
                        {t("Help")}
                      </Nav.Link>
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="changePassword"
                        className="text-black"
                      >
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item> */}

                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalLogoutHandler}
                    >
                      {/* Sign Out */}
                      <Nav.Link className="SignOutOptionMenu d-flex text-black border-none FontClass">
                        {t("Sign-out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}
              </Dropdown>
              <Nav.Link
                as={Link}
                disabled={true}
                to={
                  location.pathname.includes("/Admin")
                    ? "/Diskus/Admin/faq's"
                    : "/DisKus/faq's"
                }
                className="mx-3"
              >
                <img src={DiskusHeaderInfo} alt="" width={28} />
              </Nav.Link>
              {/* {roleID != 2 && roleID != 1 ? (
                <Nav.Link className="me-2" as={Link} to="setting">
                  <img src={DiskusHeaderSetting} width={28} />
                </Nav.Link>
              ) : null} */}
            </Nav>
          </section>
          {/* </Container> */}
        </Navbar>
      ) : (
        <Navbar className="header2-container " sticky="top">
          {/* <Container> */}
          <section className="d-flex justify-content-between w-100  align-items-center px-5">
            <Navbar.Brand
              as={Link}
              to={
                location.pathname.includes("/Admin")
                  ? "/Diskus/Admin/Summary"
                  : "/DisKus/home"
              }
            >
              <img src={DiskusLogoHeader} alt="" width={120} />
            </Navbar.Brand>
            <Nav className="ml-auto align-items-center">
              <LanguageSelector />
              {/* <section className="position-relative" ref={languageref}>
                <span className="text-white d-flex gap-2 align-items-center position-relative" onClick={() => setLanguageDropdown(!languageDropdown)}>
                  <img src={LanguageIcon} />
                  {languageforView}
                  {languageDropdown ? <ChevronUp fontWeight={"bold"} /> : < ChevronDown fontWeight={"bold"} />}
                </span>
                <div className={!languageDropdown ? "language-options" : "language-options active"}>
                  {languages.map((data, index) => {
                    return <span onClick={() => handleChangeLocale(data.code)}>{data.name}</span>
                  }
                  )}</div>
              </section> */}
              {/* <select
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
              </select> */}
              <Nav.Link className="me-2">
                <div className="dropdown-btn_dotted">
                  <DropdownButton
                    id="dropdown-btn_dotted"
                    className="dropdown-btn_dotted"
                    title={
                      <img src={DiskusNotificationIcon} alt="" width={28} />
                    }
                    onClick={dropDownMenuFunction}
                  >
                    <Dropdown.Item className="d-flex title-className">
                      {t("Quick-meeting")}
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex title-className">
                      {t("Upload-document")}
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex title-className">
                      {t("Recently-added-files")}
                    </Dropdown.Item>
                    {/* <Dropdown.Item className="title-className">
                      {t("Upload-documents")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Create-a-meeting")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Data-room")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-className">
                      {t("Pending-tasks")}
                    </Dropdown.Item>
                    <Dropdown.Item className="title-language-className">
                      {t("Language")}
                    </Dropdown.Item> */}
                  </DropdownButton>
                </div>
              </Nav.Link>
              <Dropdown className="profilebtn-dropdown">
                <Dropdown.Toggle className="dropdown-toggle">
                  <img
                    src={`data:image/jpeg;base64,${currentUserProfilePic}`}
                    className="user-img me-3 "
                    width={30}
                    alt=""
                  />

                  <p className={`${"user-name me-2"} ${currentLanguage}`}>
                    {currentUserName}
                  </p>
                </Dropdown.Toggle>
                {location.pathname.includes("/Admin") ? (
                  <Dropdown.Menu className="dropdown_menu_admin">
                    <Dropdown.Item
                      className={`${" text-black"} ${currentLanguage}`}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="CustomerInformation"
                        className="text-black"
                      >
                        {/* Change Password */}
                        {t("Customer-information")}
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
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      // className={currentLanguage}
                      onClick={modalLogoutHandler}
                    >
                      {/* Sign Out */}
                      <Nav.Link className="SignOutOptionMenu text-black border-none">
                        {t("Sign-out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu className="Profile_dropdown_menu">
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalUserProfileHandler}
                    >
                      <Nav.Link className="d-flex text-black border-none FontClass">
                        {t("My-profile")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="setting"
                        className="d-flex text-black FontClass"
                      >
                        {/* Change Password */}
                        {t("Setting")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="faq's"
                        className="d-flex text-black FontClass"
                      >
                        {/* Change Password */}
                        {t("Help")}
                      </Nav.Link>
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to="changePassword"
                        className="text-black"
                      >
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item> */}

                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalLogoutHandler}
                    >
                      {/* Sign Out */}
                      <Nav.Link className="SignOutOptionMenu d-flex text-black border-none FontClass">
                        {t("Sign-out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}
              </Dropdown>
              <Nav.Link
                as={Link}
                to={
                  location.pathname.includes("/Admin")
                    ? "/Diskus/Admin/faq's"
                    : "/DisKus/faq's"
                }
                className="mx-3"
              >
                <img src={DiskusHeaderInfo} width={28} />
              </Nav.Link>
              {/* {roleID != 2 && roleID != 1 ? (
                <Nav.Link className="me-2" as={Link} to="setting">
                  <img src={DiskusHeaderSetting} width={28} />
                </Nav.Link>
              ) : null} */}
            </Nav>
          </section>
          {/* </Container> */}
        </Navbar>
      )}
      {show ? (
        <Modal
          show={show}
          modalHeaderClassName="modal-header-logout"
          setShow={setShow}
          centered
          size={"md"}
          ModalBody={
            <Row className="mb-3 mt-5">
              <Col lg={2} md={2} sm={12} />
              <Col
                lg={8}
                md={8}
                sm={12}
                className="d-flex justify-content-center"
              >
                <label className="MontserratSemiBold logout-confirmation-label">
                  {t("Are-you-sure-you-want-to-logout")}
                </label>
              </Col>
              <Col lg={2} md={2} sm={12} />
            </Row>
          }
          ModalFooter={
            <Col sm={12} md={12} lg={12}>
              <Row
                className={"mb-3 mt-2 LogoutButtons" + " " + currentLanguage}
              >
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className={"text-center" + " " + currentLanguage}
                >
                  <Button
                    className="MontserratSemiBold Cancel-btn"
                    text={t("Cancel")}
                    onClick={handleCancel}
                  />
                </Col>
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className={"text-center" + " " + currentLanguage}
                >
                  <Button
                    className="MontserratSemiBold Ok-Successfull-btn"
                    text={t("Logout")}
                    onClick={logoutFunction}
                  />
                </Col>
              </Row>
            </Col>
          }
        />
      ) : null}

      {userProfileModal ? (
        <UserProfile
          user={userProfileModal}
          setUser={setUserProfileModal}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null}
    </>
  );
};

export default Header2;
