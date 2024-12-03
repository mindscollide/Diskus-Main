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
  uploadGlobalFlag,
} from "../../../store/actions/NewMeetingActions";
import {
  getUserDetails,
  getUserSetting,
} from "../../../store/actions/GetUserSetting";
import { useLocation } from "react-router-dom";
import UserProfile from "../../../container/authentication/User_Profile/UserProfile";
import LanguageSelector from "../../elements/languageSelector/Language-selector";
import ModalMeeting from "../../../container/modalmeeting/ModalMeeting";
import { Button, Modal, UploadTextField, Notification } from "../../elements";
import UpgradeNowModal from "../../../container/pages/UserMangement/ModalsUserManagement/UpgradeNowModal/UpgradeNowModal.js";
import RequestExtensionModal from "../../../container/pages/UserMangement/ModalsUserManagement/RequestExtentionModal/RequestExtensionModal.js";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
} from "../../../commen/functions/utils";
import { requestOrganizationExtendApi } from "../../../store/actions/UserManagementActions.js";
import ModalAddNote from "../../../container/notes/modalAddNote/ModalAddNote.js";
import ModalToDoList from "../../../container/todolistModal/ModalToDoList.js";
import { showMessage } from "../../elements/snack_bar/utill.js";
import { ClearNotesResponseMessage } from "../../../store/actions/Notes_actions.js";
import { clearResponseMessage } from "../../../store/actions/Get_List_Of_Assignees.js";
import { clearResponce } from "../../../store/actions/ToDoList_action.js";
import BellNotificationIcon from "../../../assets/images/BellNotificationIcon.png";
import WebNotfication from "../WebNotfication/WebNotfication.js";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../store/actions/VideoMain_actions.js";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
} from "../../../store/actions/VideoFeature_actions.js";

const Header2 = ({ isVideo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  let ActiveCallFlag = localStorage.getItem("activeCall");
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

  const NotesReponseMessege = useSelector(
    (state) => state.NotesReducer.ResponseMessage
  );

  const ResponseMessageTodoReducer = useSelector(
    (state) => state.toDoListReducer.ResponseMessage
  );

  const ResponseMessageAssigneesReducer = useSelector(
    (state) => state.assignees.ResponseMessage
  );

  const [createMeetingModal, setCreateMeetingModal] = useState(false);
  const [modalNoteHeader, setModalNoteHeader] = useState(false);
  const [reload, setReload] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [updateFlagToDo, setUpdateFlagToDo] = useState(false);
  const [showTaskModalHeader, setShowModalHeader] = useState(false);
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(null);
  //for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activateBlur, setActivateBlur] = useState(false);
  // for userProfile
  const [userProfileModal, setUserProfileModal] = useState(false);
  //for userprofile edit modal
  const [editFlag, setEditFlag] = useState(false);
  const [showButtonOfUpgrade, setShowButtonOfUpgrade] = useState(false);
  //Web Notification state
  const [showWebNotification, setShowWebNotification] = useState(false);
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

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

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

  //Notes Response Messege as per CR
  useEffect(() => {
    try {
      if (
        NotesReponseMessege !== "" &&
        NotesReponseMessege !== t("No-data-available")
      ) {
        showMessage(NotesReponseMessege, "success", setOpen);
        dispatch(ClearNotesResponseMessage());
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [NotesReponseMessege]);

  //Todolist tast Response messeges as per CR
  useEffect(() => {
    if (
      ResponseMessageTodoReducer !== "" &&
      ResponseMessageTodoReducer !== undefined &&
      ResponseMessageTodoReducer !== "" &&
      ResponseMessageTodoReducer !== t("No-records-found")
    ) {
      showMessage(ResponseMessageTodoReducer, "success", setOpen);
      dispatch(clearResponce());
    } else if (
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== "" &&
      ResponseMessageAssigneesReducer !== t("No-records-found") &&
      ResponseMessageAssigneesReducer !== t("The-meeting-has-been-cancelled")
    ) {
      showMessage(ResponseMessageAssigneesReducer, "success", setOpen);
      dispatch(clearResponseMessage());
    } else {
      dispatch(clearResponce());
      dispatch(clearResponseMessage());
    }
  }, [ResponseMessageTodoReducer, ResponseMessageAssigneesReducer]);

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

  const openHeaderCreateTaskModal = () => {
    setShowModalHeader(true);
  };
  const handleUploadFile = async ({ file }) => {
    navigate("/Diskus/dataroom", { state: file });
  };

  const RecentFilesTab = async () => {
    localStorage.setItem("navigateLocation", "dataroomRecentAddedFiles");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const homePageDashboardClick = () => {
    localStorage.setItem("navigateLocation", "home");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarSettings = () => {
    localStorage.setItem("navigateLocation", "setting");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingPendingApprovals = () => {
    localStorage.setItem("navigateLocation", "Minutes");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarFAQ = () => {
    localStorage.setItem("navigateLocation", "faq's");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
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

  const handleWebNotication = () => {
    setShowWebNotification(!showWebNotification);
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
                          onClick={
                            ActiveCallFlag === false
                              ? handleMeetingPendingApprovals
                              : (event) => {
                                  event.preventDefault(); // Prevents default navigation
                                  handleMeetingPendingApprovals(); // Your custom click handler
                                }
                          }
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
                      <Dropdown.Item
                        className="d-flex title-className"
                        onClick={openHeaderCreateTaskModal}
                      >
                        <span className="New_folder_shortcutkeys">
                          {t("Create-a-task")}
                        </span>
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
                        onClick={
                          ActiveCallFlag === false
                            ? handleMeetingSidebarSettings
                            : (event) => {
                                event.preventDefault(); // Prevents default navigation
                                handleMeetingSidebarSettings(); // Your custom click handler
                              }
                        }
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
                        onClick={
                          ActiveCallFlag === false
                            ? handleMeetingSidebarFAQ
                            : (event) => {
                                event.preventDefault(); // Prevents default navigation
                                handleMeetingSidebarFAQ(); // Your custom click handler
                              }
                        }
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
                onClick={
                  ActiveCallFlag === false
                    ? handleMeetingSidebarFAQ
                    : (event) => {
                        event.preventDefault(); // Prevents default navigation
                        handleMeetingSidebarFAQ(); // Your custom click handler
                      }
                }
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
              onClick={
                ActiveCallFlag === false
                  ? homePageDashboardClick
                  : (event) => {
                      event.preventDefault(); // Prevents default navigation
                      homePageDashboardClick(); // Your custom click handler
                    }
              }
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
                                onClick={
                                  ActiveCallFlag === false
                                    ? handleMeetingPendingApprovals
                                    : (event) => {
                                        event.preventDefault(); // Prevents default navigation
                                        handleMeetingPendingApprovals(); // Your custom click handler
                                      }
                                }
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
                            <Dropdown.Item
                              className="d-flex title-className"
                              onClick={openHeaderCreateTaskModal}
                            >
                              <span className="New_folder_shortcutkeys">
                                {t("Create-a-task")}
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
                                onClick={
                                  ActiveCallFlag === false
                                    ? handleMeetingSidebarSettings
                                    : (event) => {
                                        event.preventDefault(); // Prevents default navigation
                                        handleMeetingSidebarSettings(); // Your custom click handler
                                      }
                                }
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
                                onClick={
                                  ActiveCallFlag === false
                                    ? handleMeetingSidebarFAQ
                                    : (event) => {
                                        event.preventDefault(); // Prevents default navigation
                                        handleMeetingSidebarFAQ(); // Your custom click handler
                                      }
                                }
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
                  {/* Web Notification Bell Icon */}
                  {/* <span
                    className="position-relative"
                    onClick={handleWebNotication}
                  >
                    <img
                      src={BellNotificationIcon}
                      alt=""
                      width={28}
                      draggable="false"
                      className="BellNotificationIconStyles"
                    />
                    <span className="NotficationCountSpan">4</span>
                  </span> */}
                  {/* Web Notification Outer Box Starts */}
                  {/* {showWebNotification && <WebNotfication />} */}
                  {/* Web Notification Outer Box End */}

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
                      onClick={
                        ActiveCallFlag === false
                          ? handleMeetingSidebarFAQ
                          : (event) => {
                              event.preventDefault(); // Prevents default navigation
                              handleMeetingSidebarFAQ(); // Your custom click handler
                            }
                      }
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
      {showTaskModalHeader && (
        <ModalToDoList
          show={showTaskModalHeader}
          setShow={setShowModalHeader}
          updateFlagToDo={updateFlagToDo}
          setUpdateFlagToDo={setUpdateFlagToDo}
          className="toDoViewModal"
        />
      )}

      {UpgradeNowModalReducer && <UpgradeNowModal />}
      {requestExtentionModal && <RequestExtensionModal />}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Header2;
