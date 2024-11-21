import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav, Navbar, DropdownButton, Row, Col } from "react-bootstrap";
import { Tooltip } from "antd";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";
import DiskusLogoHeader from "../../../assets/images/newElements/diskus_newheader.svg";
import DiskusHeaderInfo from "../../../assets/images/newElements/Diskus-infoIcon.svg";
import DiskusNotificationIcon from "../../../assets/images/newElements/Diskus-notification_icon.svg";
import "./Header.css";
import "../../../i18n.js";
import { useTranslation } from "react-i18next";
import { userLogOutApiFunc } from "../../../store/actions/Auth_Sign_Out";
import {
  showCancelModalmeetingDeitals,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  viewMeetingFlag,
  uploadGlobalFlag,
  LeaveCurrentMeetingOtherMenus,
  currentMeetingStatus,
} from "../../../store/actions/NewMeetingActions";
import {
  getUserDetails,
  getUserSetting,
} from "../../../store/actions/GetUserSetting";
import { useLocation } from "react-router-dom";
import UserProfile from "../../../container/authentication/User_Profile/UserProfile";
import LanguageSelector from "../../elements/languageSelector/Language-selector";
import ModalMeeting from "../../../container/modalmeeting/ModalMeeting";
import { Button, Modal, UploadTextField, Loader } from "../../elements";
import UpgradeNowModal from "../../../container/pages/UserMangement/ModalsUserManagement/UpgradeNowModal/UpgradeNowModal.js";
import RequestExtensionModal from "../../../container/pages/UserMangement/ModalsUserManagement/RequestExtentionModal/RequestExtensionModal.js";
import { getCurrentDateTimeUTC } from "../../../commen/functions/date_formater.js";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
} from "../../../commen/functions/utils";
import { requestOrganizationExtendApi } from "../../../store/actions/UserManagementActions.js";
import ModalAddNote from "../../../container/notes/modalAddNote/ModalAddNote.js";

const Header2 = ({ isVideo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const scheduleMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const viewProposeDateMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingPublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );
  const viewAdvanceMeetingUnpublishPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizerMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const proposeNewMeetingPageFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.proposeNewMeetingPageFlag
  );
  const viewMeetingFlagReducer = useSelector(
    (state) => state.NewMeetingreducer.viewMeetingFlag
  );
  const UserProfileData = useSelector(
    (state) => state.settingReducer.UserProfileData
  );
  const CurrentMeetingStatus = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingStatus
  );

  const UpgradeNowModalReducer = useSelector(
    (state) => state.UserManagementModals.UpgradeNowModal
  );
  const requestExtentionModal = useSelector(
    (state) => state.UserManagementModals.requestExtentionModal
  );
  const [createMeetingModal, setCreateMeetingModal] = useState(false);
  const [modalNoteHeader, setModalNoteHeader] = useState(false);
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);
  //for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activateBlur, setActivateBlur] = useState(false);
  // for userProfile
  const [userProfileModal, setUserProfileModal] = useState(false);
  //for userprofile edit modal
  const [editFlag, setEditFlag] = useState(false);
  const [showButtonOfUpgrade, setShowButtonOfUpgrade] = useState(false);

  let Blur = localStorage.getItem("blur");

  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

  const TrialExpireSelectPac = getLocalStorageItemNonActiveCheck(
    "TrialExpireSelectPac"
  );
  const hasAdminRights = JSON.parse(localStorage.getItem("hasAdminRights"));
  const cancelSub = getLocalStorageItemNonActiveCheck("cancelSub");
  let currentLanguage = localStorage.getItem("i18nextLng");

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));

  let currentOrganizationName = localStorage.getItem("organizatioName");

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Blur !== null) {
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
    if (location.pathname.includes("/Admin") === true) {
      if (showButtonOfUpgrade === false) {
        setShowButtonOfUpgrade(true);
      }
    } else {
      if (showButtonOfUpgrade) {
        setShowButtonOfUpgrade(false);
      }
    }
  }, []);

  useEffect(() => {
    if (UserProfileData === undefined || UserProfileData === null) {
      dispatch(getUserSetting(navigate, t, false));
    }
  }, []);

  useEffect(() => {
    if (UserProfileData !== undefined && UserProfileData !== null) {
      setCurrentUserName(UserProfileData?.userName);
      setCurrentUserProfilePic(
        UserProfileData?.userProfilePicture?.displayProfilePictureName
      );
    }
  }, [UserProfileData]);

  const forgotPasswordCheck = () => {
    localStorage.setItem("globalPassowrdChecker", true);
  };

  const dropDownMenuFunction = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // userProfile handler
  const modalUserProfileHandler = (e) => {
    let userID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    dispatch(
      getUserDetails(navigate, userID, t, OrganizationID, setUserProfileModal)
    );
  };

  //Customer Information Modal

  const handleModalCustomerInformation = () => {
    let userID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    dispatch(getUserDetails(navigate, userID, t, OrganizationID));
  };

  // for modal create  handler
  const modalLogoutHandler = async (e) => {
    await setShow(true);
  };

  const handleCancel = async (e) => {
    await setShow(false);
  };

  const logoutFunction = () => {
    dispatch(userLogOutApiFunc(navigate, t));
  };

  const openMeetingModal = () => {
    setCreateMeetingModal(true);
  };

  const openModalAddNote = () => {
    setModalNoteHeader(true);
  };
  const handleUploadFile = async ({ file }) => {
    navigate("/Diskus/dataroom", { state: file });
  };

  const RecentFilesTab = async () => {
    if (
      (scheduleMeetingPageFlagReducer === true ||
        viewProposeDateMeetingPageFlagReducer === true ||
        viewAdvanceMeetingPublishPageFlagReducer === true ||
        viewAdvanceMeetingUnpublishPageFlagReducer === true ||
        viewProposeOrganizerMeetingPageFlagReducer === true ||
        proposeNewMeetingPageFlagReducer === true) &&
      viewMeetingFlagReducer === false
    ) {
      dispatch(showCancelModalmeetingDeitals(true));
      localStorage.setItem("navigateLocation", "dataroom");
    } else {
      localStorage.setItem("setTableView", 4);
      navigate("/DisKus/dataroom");
      dispatch(showCancelModalmeetingDeitals(false));
      dispatch(scheduleMeetingPageFlag(false));
      dispatch(viewProposeDateMeetingPageFlag(false));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(proposeNewMeetingPageFlag(false));
      dispatch(viewMeetingFlag(false));
      let Data = {
        FK_MDID: currentMeeting,
        DateTime: getCurrentDateTimeUTC(),
      };
      if (CurrentMeetingStatus === 10) {
        dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
  };

  const homePageDashboardClick = (event) => {
    if (location.pathname.includes("/Admin") === false) {
      if (
        (scheduleMeetingPageFlagReducer === true ||
          viewProposeDateMeetingPageFlagReducer === true ||
          viewAdvanceMeetingPublishPageFlagReducer === true ||
          viewAdvanceMeetingUnpublishPageFlagReducer === true ||
          viewProposeOrganizerMeetingPageFlagReducer === true ||
          proposeNewMeetingPageFlagReducer === true) &&
        viewMeetingFlagReducer === false
      ) {
        event.preventDefault();
        dispatch(showCancelModalmeetingDeitals(true));
        localStorage.setItem("navigateLocation", "home");
      } else {
        dispatch(showCancelModalmeetingDeitals(false));
        dispatch(scheduleMeetingPageFlag(false));
        dispatch(viewProposeDateMeetingPageFlag(false));
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        dispatch(viewProposeOrganizerMeetingPageFlag(false));
        dispatch(proposeNewMeetingPageFlag(false));
        dispatch(viewMeetingFlag(false));
        let Data = {
          FK_MDID: currentMeeting,
          DateTime: getCurrentDateTimeUTC(),
        };
        if (CurrentMeetingStatus === 10) {
          dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
          dispatch(currentMeetingStatus(0));
        }
      }
    }
  };

  const handleMeetingSidebarSettings = () => {
    if (location.pathname.includes("/Admin") === false) {
      if (
        (scheduleMeetingPageFlagReducer === true ||
          viewProposeDateMeetingPageFlagReducer === true ||
          viewAdvanceMeetingPublishPageFlagReducer === true ||
          viewAdvanceMeetingUnpublishPageFlagReducer === true ||
          viewProposeOrganizerMeetingPageFlagReducer === true ||
          proposeNewMeetingPageFlagReducer === true) &&
        viewMeetingFlagReducer === false
      ) {
        dispatch(showCancelModalmeetingDeitals(true));
        localStorage.setItem("navigateLocation", "setting");
      } else {
        dispatch(showCancelModalmeetingDeitals(false));
        dispatch(scheduleMeetingPageFlag(false));
        dispatch(viewProposeDateMeetingPageFlag(false));
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        dispatch(viewProposeOrganizerMeetingPageFlag(false));
        dispatch(proposeNewMeetingPageFlag(false));
        dispatch(viewMeetingFlag(false));
        let Data = {
          FK_MDID: currentMeeting,
          DateTime: getCurrentDateTimeUTC(),
        };
        if (CurrentMeetingStatus === 10) {
          dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
          dispatch(currentMeetingStatus(0));
        }
      }
    }
  };

  const handleMeetingPendingApprovals = () => {
    if (location.pathname.includes("/Admin") === false) {
      if (
        (scheduleMeetingPageFlagReducer === true ||
          viewProposeDateMeetingPageFlagReducer === true ||
          viewAdvanceMeetingPublishPageFlagReducer === true ||
          viewAdvanceMeetingUnpublishPageFlagReducer === true ||
          viewProposeOrganizerMeetingPageFlagReducer === true ||
          proposeNewMeetingPageFlagReducer === true) &&
        viewMeetingFlagReducer === false
      ) {
        dispatch(showCancelModalmeetingDeitals(true));
        localStorage.setItem("navigateLocation", "Minutes");
      } else {
        dispatch(showCancelModalmeetingDeitals(false));
        dispatch(scheduleMeetingPageFlag(false));
        dispatch(viewProposeDateMeetingPageFlag(false));
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        dispatch(viewProposeOrganizerMeetingPageFlag(false));
        dispatch(proposeNewMeetingPageFlag(false));
        dispatch(viewMeetingFlag(false));
        let Data = {
          FK_MDID: currentMeeting,
          DateTime: getCurrentDateTimeUTC(),
        };
        if (CurrentMeetingStatus === 10) {
          dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
          dispatch(currentMeetingStatus(0));
        }
      }
    }
  };

  const handleMeetingSidebarFAQ = () => {
    if (location.pathname.includes("/Admin") === false) {
      if (
        (scheduleMeetingPageFlagReducer === true ||
          viewProposeDateMeetingPageFlagReducer === true ||
          viewAdvanceMeetingPublishPageFlagReducer === true ||
          viewAdvanceMeetingUnpublishPageFlagReducer === true ||
          viewProposeOrganizerMeetingPageFlagReducer === true ||
          proposeNewMeetingPageFlagReducer === true) &&
        viewMeetingFlagReducer === false
      ) {
        dispatch(showCancelModalmeetingDeitals(true));
        localStorage.setItem("navigateLocation", "faq's");
      } else {
        dispatch(showCancelModalmeetingDeitals(false));
        dispatch(scheduleMeetingPageFlag(false));
        dispatch(viewProposeDateMeetingPageFlag(false));
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
        dispatch(viewProposeOrganizerMeetingPageFlag(false));
        dispatch(proposeNewMeetingPageFlag(false));
        dispatch(viewMeetingFlag(false));
        let Data = {
          FK_MDID: currentMeeting,
          DateTime: getCurrentDateTimeUTC(),
        };
        if (CurrentMeetingStatus === 10) {
          dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
          dispatch(currentMeetingStatus(0));
        }
      }
    }
  };

  // as huzeifa bhai said when we click on upgrade button then it'll navigate to the billing calculator page
  const handleShowUpgradedNowModal = () => {
    console.log("Clicked");
    navigate("/Admin/PakageDetailsUserManagement");
  };

  const handleRequestExtentionModal = () => {
    const organizationID = localStorage.getItem("organizationID");
    const UserID = localStorage.getItem("userID");
    let data = {
      OrganizationID: Number(organizationID),
      UserID: Number(UserID),
    };
    dispatch(requestOrganizationExtendApi(navigate, t, data));
  };

  const openAdminTab = () => {
    window.open(window.location.origin + "/#/Admin", "_blank");
  };

  // open new dashboard tab in new window for dashboard user
  const openUserTab = () => {
    window.open(window.location.origin + "/#/Diskus/", "_blank");
  };

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
                  ? roleRoute
                    ? "Admin/PayOutstanding"
                    : TrialExpireSelectPac
                    ? "/Admin/PakageDetailsUserManagement"
                    : cancelSub
                    ? "/Admin/ManageUsers"
                    : "/Admin/ManageUsers"
                  : "/DisKus"
              }
            >
              <img
                src={DiskusLogoHeader}
                alt=""
                width={120}
                draggable="false"
              />
            </Navbar.Brand>
            <Nav className="ml-auto align-items-center">
              <LanguageSelector />
              <Nav.Link className="me-2">
                <Tooltip placement="topRight" title={t("Shortcuts")}>
                  <div className="dropdown-btn_dotted">
                    <DropdownButton
                      id="dropdown-btn_dotted"
                      className="dropdown-btn_dotted"
                      disabled={true}
                      title={
                        <img
                          src={DiskusNotificationIcon}
                          alt=""
                          width={28}
                          draggable="false"
                        />
                      }
                      onClick={dropDownMenuFunction}
                    >
                      {checkFeatureIDAvailability(1) ? (
                        <>
                          <Dropdown.Item
                            className="d-flex title-className"
                            onClick={openMeetingModal}
                          >
                            <span>{t("Quick-meeting")}</span>
                          </Dropdown.Item>
                        </>
                      ) : null}

                      <Dropdown.Item className="d-flex title-className">
                        {t("Upload-document")}
                      </Dropdown.Item>
                      <Dropdown.Item className="d-flex title-className">
                        {t("Recently-added-files")}
                      </Dropdown.Item>
                      <Dropdown.Item className="d-flex title-className">
                        <Nav.Link
                          as={Link}
                          to={
                            (scheduleMeetingPageFlagReducer === true ||
                              viewProposeDateMeetingPageFlagReducer === true ||
                              viewAdvanceMeetingPublishPageFlagReducer ===
                                true ||
                              viewAdvanceMeetingUnpublishPageFlagReducer ===
                                true ||
                              viewProposeOrganizerMeetingPageFlagReducer ===
                                true ||
                              proposeNewMeetingPageFlagReducer === true) &&
                            viewMeetingFlagReducer === false
                              ? "/DisKus/Meeting"
                              : "/DisKus/Minutes"
                          }
                          onClick={handleMeetingPendingApprovals}
                          className="pendingApprovalsNav"
                        >
                          {t("Pending-approvals")}
                        </Nav.Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="d-flex title-className"
                        onClick={openModalAddNote}
                      >
                        <span>{t("Add-a-note")}</span>
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                </Tooltip>
              </Nav.Link>
              <Dropdown className="profilebtn-dropdown">
                <Dropdown.Toggle className="dropdown-toggle">
                  <img
                    src={`data:image/jpeg;base64,${currentUserProfilePic}`}
                    className="user-img me-3 "
                    width={30}
                    alt=""
                    draggable="false"
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
                        className="SignOutOptionMenu text-black"
                      >
                        {/* Change Password */}
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={modalLogoutHandler}>
                      {/* Sign Out */}
                      <Nav.Link className="SignOutOptionMenu text-black border-none">
                        {t("Sign-out")}
                      </Nav.Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu className="Profile_dropdown_menu">
                    {hasAdminRights && (
                      <Dropdown.Item className={currentLanguage}>
                        <Nav.Link className="d-flex text-black FontClass">
                          {t("Organization-admin")}
                        </Nav.Link>
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      className={currentLanguage}
                      onClick={modalUserProfileHandler}
                    >
                      <Nav.Link className="d-flex text-black FontClass">
                        {t("My-profile")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to={
                          (scheduleMeetingPageFlagReducer === true ||
                            viewProposeDateMeetingPageFlagReducer === true ||
                            viewAdvanceMeetingPublishPageFlagReducer === true ||
                            viewAdvanceMeetingUnpublishPageFlagReducer ===
                              true ||
                            viewProposeOrganizerMeetingPageFlagReducer ===
                              true ||
                            proposeNewMeetingPageFlagReducer === true) &&
                          viewMeetingFlagReducer === false
                            ? "/DisKus/Meeting"
                            : "/DisKus/setting"
                        }
                        className="d-flex text-black FontClass"
                        onClick={handleMeetingSidebarSettings}
                      >
                        {/* Change Password */}
                        {t("Settings")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={() => forgotPasswordCheck()}
                    >
                      <Nav.Link
                        as={Link}
                        to={
                          (scheduleMeetingPageFlagReducer === true ||
                            viewProposeDateMeetingPageFlagReducer === true ||
                            viewAdvanceMeetingPublishPageFlagReducer === true ||
                            viewAdvanceMeetingUnpublishPageFlagReducer ===
                              true ||
                            viewProposeOrganizerMeetingPageFlagReducer ===
                              true ||
                            proposeNewMeetingPageFlagReducer === true) &&
                          viewMeetingFlagReducer === false
                            ? "/DisKus/Meeting"
                            : "/DisKus/faq's"
                        }
                        onClick={handleMeetingSidebarFAQ}
                        className="d-flex text-black FontClass"
                      >
                        {/* Change Password */}
                        {t("Help")}
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={" text-black" + " " + currentLanguage}
                      onClick={handleModalCustomerInformation}
                    >
                      <Nav.Link
                        as={Link}
                        to="changePassword"
                        className="SignOutOptionMenu d-flex text-black  FontClass"
                      >
                        {t("Change-password")}
                      </Nav.Link>
                    </Dropdown.Item>
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
                    ? "/Admin/faq's"
                    : (scheduleMeetingPageFlagReducer === true ||
                        viewProposeDateMeetingPageFlagReducer === true ||
                        viewAdvanceMeetingPublishPageFlagReducer === true ||
                        viewAdvanceMeetingUnpublishPageFlagReducer === true ||
                        viewProposeOrganizerMeetingPageFlagReducer === true ||
                        proposeNewMeetingPageFlagReducer === true) &&
                      viewMeetingFlagReducer === false
                    ? "/DisKus/Meeting"
                    : "/DisKus/faq's"
                }
                onClick={handleMeetingSidebarFAQ}
                className="mx-3"
              >
                <img
                  src={DiskusHeaderInfo}
                  alt=""
                  width={28}
                  draggable="false"
                />
              </Nav.Link>
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
                isVideo
                  ? "/Diskus/video"
                  : location.pathname.includes("/Admin")
                  ? roleRoute
                    ? "/Admin/PayOutstanding"
                    : TrialExpireSelectPac
                    ? "/Admin/PakageDetailsUserManagement"
                    : cancelSub
                    ? "/Admin/ManageUsers"
                    : "/Admin/ManageUsers"
                  : "/Diskus"
              }
              onClick={homePageDashboardClick}
            >
              <img
                src={DiskusLogoHeader}
                alt=""
                width={120}
                draggable="false"
              />
            </Navbar.Brand>
            {!isVideo && (
              <>
                <Row>
                  {!TrialExpireSelectPac && hasAdminRights ? (
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="UpgradeButtonsClass"
                    >
                      {JSON.parse(localStorage.getItem("isTrial")) && (
                        <>
                          {JSON.parse(localStorage.getItem("remainingDays")) >
                            1 && (
                            <>
                              {" "}
                              <span className={"trialExpireButton"}>
                                <span className="InnerText">
                                  {t(
                                    "Your-trial-will-expire-in-{{remainingDays}}-days",
                                    {
                                      remainingDays:
                                        localStorage.getItem("remainingDays"),
                                    }
                                  )}
                                </span>
                              </span>
                              {showButtonOfUpgrade && (
                                <Button
                                  text={t("Upgrade-now")}
                                  className="UpgradeNowbutton"
                                  onClick={handleShowUpgradedNowModal}
                                />
                              )}
                            </>
                          )}
                          {(JSON.parse(
                            localStorage.getItem("remainingDays")
                          ) === 1 ||
                            JSON.parse(
                              localStorage.getItem("remainingDays")
                            ) === 0) && (
                            <>
                              {" "}
                              <Button
                                text={t("Upgrade-now")}
                                className="UpgradeNowbutton"
                                onClick={handleShowUpgradedNowModal}
                              />
                              {JSON.parse(
                                localStorage.getItem("isExtensionAvailable")
                              ) && (
                                <Button
                                  text={t("Request-an-extention")}
                                  className="UpgradeNowbutton"
                                  onClick={handleRequestExtentionModal}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Col>
                  ) : null}
                </Row>
                <Nav className="ml-auto align-items-center">
                  <LanguageSelector />

                  <Nav.Link className="me-2">
                    {checkFeatureIDAvailability(1) ||
                    checkFeatureIDAvailability(13) ? (
                      <div className="dropdown-btn_dotted">
                        {location.pathname.includes("/Admin") ||
                        location.pathname.includes(
                          "/Admin"
                        ) ? null : roleRoute || TrialExpireSelectPac ? null : (
                          <DropdownButton
                            id="dropdown-btn_dotted"
                            className="dropdown-btn_dotted"
                            title={
                              <Tooltip
                                placement="topRight"
                                title={t("Shortcuts")}
                              >
                                <img
                                  src={DiskusNotificationIcon}
                                  alt=""
                                  width={28}
                                  draggable="false"
                                />
                              </Tooltip>
                            }
                            onClick={dropDownMenuFunction}
                          >
                            {checkFeatureIDAvailability(1) ? (
                              <>
                                <Dropdown.Item
                                  className="d-flex title-className"
                                  onClick={openMeetingModal}
                                >
                                  <span className="New_folder_shortcutkeys">
                                    {t("Quick-meeting")}
                                  </span>
                                </Dropdown.Item>
                              </>
                            ) : null}

                            {checkFeatureIDAvailability(13) ? (
                              <>
                                <Dropdown.Item className="d-flex title-className">
                                  {/* {t("Upload-document")} */}
                                  {(scheduleMeetingPageFlagReducer === true ||
                                    viewProposeDateMeetingPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingPublishPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingUnpublishPageFlagReducer ===
                                      true ||
                                    viewProposeOrganizerMeetingPageFlagReducer ===
                                      true ||
                                    proposeNewMeetingPageFlagReducer ===
                                      true) &&
                                  viewMeetingFlagReducer === false ? (
                                    <div
                                      className="New_folder_shortcutkeys"
                                      onClick={() => {
                                        dispatch(
                                          showCancelModalmeetingDeitals(true)
                                        );
                                        dispatch(uploadGlobalFlag(true));
                                      }}
                                    >
                                      {t("Upload-document")}
                                    </div>
                                  ) : (
                                    <UploadTextField
                                      title={t("Upload-document")}
                                      handleFileUploadRequest={handleUploadFile}
                                    />
                                  )}
                                </Dropdown.Item>
                              </>
                            ) : null}

                            {checkFeatureIDAvailability(13) ? (
                              <>
                                <Dropdown.Item
                                  className="d-flex title-className"
                                  onClick={RecentFilesTab}
                                >
                                  <span className="New_folder_shortcutkeys">
                                    {t("Recently-added-files")}
                                  </span>
                                </Dropdown.Item>
                              </>
                            ) : null}
                            <Dropdown.Item className="d-flex title-className">
                              <Nav.Link
                                as={Link}
                                to={
                                  (scheduleMeetingPageFlagReducer === true ||
                                    viewProposeDateMeetingPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingPublishPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingUnpublishPageFlagReducer ===
                                      true ||
                                    viewProposeOrganizerMeetingPageFlagReducer ===
                                      true ||
                                    proposeNewMeetingPageFlagReducer ===
                                      true) &&
                                  viewMeetingFlagReducer === false
                                    ? "/DisKus/Meeting"
                                    : "/DisKus/Minutes"
                                }
                                onClick={handleMeetingPendingApprovals}
                                className="pendingApprovalsNav"
                              >
                                <span className="New_folder_shortcutkeys">
                                  {t("Pending-approvals")}
                                </span>
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex title-className"
                              onClick={openModalAddNote}
                            >
                              <span className="New_folder_shortcutkeys">
                                {t("Add-a-note")}
                              </span>
                            </Dropdown.Item>
                          </DropdownButton>
                        )}
                      </div>
                    ) : null}
                  </Nav.Link>

                  <Dropdown className="profilebtn-dropdown">
                    <Dropdown.Toggle className="dropdown-toggle">
                      <img
                        src={`data:image/jpeg;base64,${currentUserProfilePic}`}
                        className="user-img me-3 "
                        width={30}
                        alt=""
                        draggable="false"
                      />
                      <div>
                        <p className={`${"user-name me-2"} ${currentLanguage}`}>
                          {currentUserName}
                        </p>
                        <p
                          className={`${"user-name orgStyle me-2"} ${currentLanguage}`}
                        >
                          {" "}
                          {currentOrganizationName}
                        </p>
                      </div>
                    </Dropdown.Toggle>
                    {location.pathname.includes("/Admin") ? (
                      <Dropdown.Menu className="dropdown_menu_admin">
                        {roleRoute || TrialExpireSelectPac || cancelSub ? (
                          <Dropdown.Item onClick={modalLogoutHandler}>
                            {/* Sign Out */}
                            <Nav.Link className="SignOutOptionMenu text-black border-none">
                              {t("Sign-out")}
                            </Nav.Link>
                          </Dropdown.Item>
                        ) : (
                          <>
                            {" "}
                            <Dropdown.Item
                              className={currentLanguage}
                              onClick={openUserTab}
                            >
                              <Nav.Link
                                as={Link}
                                disabled={true}
                                className="text-black FontClass"
                              >
                                {t("User-dashboard")}
                              </Nav.Link>
                            </Dropdown.Item>
                            {checkFeatureIDAvailability(1) ? (
                              <>
                                <Dropdown.Item
                                  className={`${" text-black"} ${currentLanguage}`}
                                  onClick={handleModalCustomerInformation}
                                >
                                  <Nav.Link
                                    as={Link}
                                    to="CustomerInformation"
                                    className="text-black FontClass"
                                  >
                                    {/* Change Password */}
                                    {t("Customer-information")}
                                  </Nav.Link>
                                </Dropdown.Item>
                              </>
                            ) : null}
                            <Dropdown.Item
                              className={currentLanguage}
                              onClick={modalUserProfileHandler}
                            >
                              <Nav.Link className="d-flex text-black FontClass">
                                {t("My-profile")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={" text-black" + " " + currentLanguage}
                            >
                              <Nav.Link
                                as={Link}
                                to={"faq's"}
                                className="d-flex text-black FontClass"
                              >
                                {t("Help")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={" text-black" + " " + currentLanguage}
                              onClick={() => forgotPasswordCheck()}
                            >
                              <Nav.Link
                                as={Link}
                                to="changePassword"
                                className="SignOutOptionMenu text-black FontClass"
                              >
                                {/* Change Password */}
                                {t("Change-password")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={modalLogoutHandler}>
                              {/* Sign Out */}
                              <Nav.Link className="SignOutOptionMenu text-black border-none FontClass">
                                {t("Sign-out")}
                              </Nav.Link>
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    ) : (
                      <Dropdown.Menu className="Profile_dropdown_menu">
                        {roleRoute || TrialExpireSelectPac || cancelSub ? (
                          <Dropdown.Item
                            className={currentLanguage}
                            onClick={modalLogoutHandler}
                          >
                            {/* Sign Out */}
                            <Nav.Link className="SignOutOptionMenu d-flex text-black border-none FontClass">
                              {t("Sign-out")}
                            </Nav.Link>
                          </Dropdown.Item>
                        ) : (
                          <>
                            {hasAdminRights && (
                              <Dropdown.Item
                                className={currentLanguage}
                                onClick={openAdminTab}
                              >
                                <Nav.Link className="d-flex text-black FontClass">
                                  {t("Organization-admin")}
                                </Nav.Link>
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              className={currentLanguage}
                              onClick={modalUserProfileHandler}
                            >
                              <Nav.Link className="d-flex text-black FontClass">
                                {t("My-profile")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={" text-black" + " " + currentLanguage}
                              onClick={() => forgotPasswordCheck()}
                            >
                              <Nav.Link
                                as={Link}
                                to={
                                  (scheduleMeetingPageFlagReducer === true ||
                                    viewProposeDateMeetingPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingPublishPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingUnpublishPageFlagReducer ===
                                      true ||
                                    viewProposeOrganizerMeetingPageFlagReducer ===
                                      true ||
                                    proposeNewMeetingPageFlagReducer ===
                                      true) &&
                                  viewMeetingFlagReducer === false
                                    ? "/DisKus/Meeting"
                                    : "/DisKus/setting"
                                }
                                className="d-flex text-black FontClass"
                                onClick={handleMeetingSidebarSettings}
                              >
                                {/* Change Password */}
                                {t("Settings")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={" text-black" + " " + currentLanguage}
                              onClick={() => forgotPasswordCheck()}
                            >
                              <Nav.Link
                                as={Link}
                                to={
                                  (scheduleMeetingPageFlagReducer === true ||
                                    viewProposeDateMeetingPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingPublishPageFlagReducer ===
                                      true ||
                                    viewAdvanceMeetingUnpublishPageFlagReducer ===
                                      true ||
                                    viewProposeOrganizerMeetingPageFlagReducer ===
                                      true ||
                                    proposeNewMeetingPageFlagReducer ===
                                      true) &&
                                  viewMeetingFlagReducer === false
                                    ? "/DisKus/Meeting"
                                    : "/DisKus/faq's"
                                }
                                onClick={handleMeetingSidebarFAQ}
                                className="d-flex text-black FontClass"
                              >
                                {/* Change Password */}
                                {t("Help")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={" text-black" + " " + currentLanguage}
                              onClick={() => forgotPasswordCheck()}
                            >
                              <Nav.Link
                                as={Link}
                                to="changePassword"
                                className="SignOutOptionMenu d-flex text-black FontClass"
                              >
                                {t("Change-password")}
                              </Nav.Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className={currentLanguage}
                              onClick={modalLogoutHandler}
                            >
                              {/* Sign Out */}
                              <Nav.Link className="SignOutOptionMenu d-flex text-black border-none FontClass">
                                {t("Sign-out")}
                              </Nav.Link>
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                  {roleRoute || TrialExpireSelectPac || cancelSub ? null : (
                    <Nav.Link
                      as={Link}
                      to={
                        location.pathname.includes("/Admin")
                          ? "/Admin/faq's"
                          : (scheduleMeetingPageFlagReducer === true ||
                              viewProposeDateMeetingPageFlagReducer === true ||
                              viewAdvanceMeetingPublishPageFlagReducer ===
                                true ||
                              viewAdvanceMeetingUnpublishPageFlagReducer ===
                                true ||
                              viewProposeOrganizerMeetingPageFlagReducer ===
                                true ||
                              proposeNewMeetingPageFlagReducer === true) &&
                            viewMeetingFlagReducer === false
                          ? "/DisKus/Meeting"
                          : "/DisKus/faq's"
                      }
                      className="mx-3"
                      onClick={handleMeetingSidebarFAQ}
                    >
                      <Tooltip placement="topRight" title={t("FAQs")}>
                        <img
                          src={DiskusHeaderInfo}
                          alt=""
                          width={28}
                          draggable="false"
                        />
                      </Tooltip>
                    </Nav.Link>
                  )}
                </Nav>
              </>
            )}
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
                <label className=" logout-confirmation-label">
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
                    className=" Cancel-btn"
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
                    className=" Ok-Successfull-btn"
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
      {createMeetingModal && (
        <ModalMeeting
          show={createMeetingModal}
          setShow={setCreateMeetingModal}
          // this is check from where its called 1 is from header
          checkFlag={1}
        />
      )}
      {modalNoteHeader && (
        <ModalAddNote
          addNewModal={modalNoteHeader}
          setAddNewModal={setModalNoteHeader}
        />
      )}

      {UpgradeNowModalReducer && <UpgradeNowModal />}
      {requestExtentionModal && <RequestExtensionModal />}
    </>
  );
};

export default Header2;
