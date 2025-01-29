import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { useTranslation } from "react-i18next";
import ExpandedMenu from "./ExpandedMenu/ExpandedMenu";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../store/actions/VideoMain_actions";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
} from "../../../store/actions/VideoFeature_actions";
import DataroomImage from "../../../assets/images/sidebar_icons/Dataroom.png";
import ResolutionImage from "../../../assets/images/sidebar_icons/Resolution.png";
import CommitteeImage from "../../../assets/images/sidebar_icons/Committee.png";
import MeetingImage from "../../../assets/images/sidebar_icons/NewMeetingSVGSideBar.png";
import NewShowMoreIcon from "../../../assets/images/sidebar_icons/NewSideBarShowMoreIcon.png";
import {
  LeaveMeetingSideBarModalAction,
  searchNewUserMeeting,
  showEndMeetingModal,
  viewMeetingFlag,
} from "../../../store/actions/NewMeetingActions";
import LeaveMeetingModalSideBar from "./LeaveMeetingModalSideBar/LeaveMeetingModalSideBar";
import { useMeetingContext } from "../../../context/MeetingContext";
import CancelButtonModal from "../../../container/pages/meeting/closeMeetingTab/CancelModal";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    editorRole,
    minutes,
    polls,
    actionsPage,
    viewAdvanceMeetingModal,
    setViewAdvanceMeetingModal,
    setCancelConfirmationModal,
  } = useMeetingContext();

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
  const CurrentMeetingStatus = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingStatus
  );

  const scheduleMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.scheduleMeetingPageFlag
  );
  const viewProposeDateMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeDateMeetingPageFlag
  );
  const viewAdvanceMeetingsPublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingPublishPageFlag
  );
  const viewAdvanceMeetingsUnpublishPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag
  );
  const viewProposeOrganizerMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.viewProposeOrganizerMeetingPageFlag
  );
  const proposeNewMeetingsPageFlag = useSelector(
    (state) => state.NewMeetingreducer.proposeNewMeetingPageFlag
  );
  const viewMeetingsFlag = useSelector(
    (state) => state.NewMeetingreducer.viewMeetingFlag
  );
  const LeaveMeetingSideBarModalTrigger = useSelector(
    (state) => state.NewMeetingreducer.LeaveMeetingSidebarModal
  );
  const [activateBlur, setActivateBlur] = useState(false);
  const [showMore, setShowMore] = useState(false);
  let Blur = localStorage.getItem("blur");
  let userID = localStorage.getItem("userID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let MeetingPageLength = localStorage.getItem("MeetingPageRows");
  let MeetingPageCurrent = localStorage.getItem("MeetingPageCurrent");

  const sidebarshow = useRef();

  const handleOutsideClick = (event) => {
    if (
      sidebarshow.current &&
      !sidebarshow.current.contains(event.target) &&
      showMore
    ) {
      setShowMore(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showMore]);

  const handleMoreOptions = () => {
    setShowMore(!showMore);
  };

  const handleMoreOptionActiveCall = () => {
    setShowMore(!showMore);
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
  };

  useEffect(() => {
    if (Blur !== undefined && Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  //Meeting SideBar Click
  const handleMeetingSidebarClick = () => {
    localStorage.setItem("navigateLocation", "Meeting");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };
  const handleMeetingSidebarClickNoCall = async () => {
    if (viewAdvanceMeetingModal) {
      if (Number(editorRole?.status) === 10) {
        dispatch(showEndMeetingModal(true));
      } else if (minutes || actionsPage || polls) {
        setCancelConfirmationModal(true);
      } else {
        setViewAdvanceMeetingModal(false);
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber: 1,
          Length: 30,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        localStorage.setItem("MeetingPageRows", 30);
        localStorage.setItem("MeetingPageCurrent", 1);
        console.log("chek search meeting");
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
        localStorage.removeItem("NotificationAdvanceMeetingID");
        localStorage.removeItem("QuickMeetingCheckNotification");
        localStorage.removeItem("viewadvanceMeetingPolls");
        localStorage.removeItem("NotificationClickPollID");
        localStorage.removeItem("AdvanceMeetingOperations");
        localStorage.removeItem("NotificationClickTaskID");
        localStorage.removeItem("viewadvanceMeetingTask");
      }
    } else {
      navigate("/Diskus/Meeting");
    }
  };

  //Dataroom Sidebar Click
  const handleMeetingSidebarDataroom = () => {
    localStorage.setItem("navigateLocation", "dataroom");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarDataroomNoCall = () => {
    navigate("/Diskus/dataroom");
  };

  //Resolutions Sidebar Click
  const handleMeetingSidebarResolutions = () => {
    localStorage.setItem("navigateLocation", "resolution");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarResolutionsNoCall = () => {
    localStorage.setItem("navigateLocation", "resolution");
    navigate("/Diskus/resolution");
  };

  //Committees Sidebar Click
  const handleMeetingSidebarCommittees = () => {
    localStorage.setItem("navigateLocation", "committee");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarCommitteesNoCall = () => {
    localStorage.setItem("navigateLocation", "committee");
    navigate("/Diskus/committee");
  };

  console.log("activeCall", CurrentMeetingStatus);
  return (
    <>
      {location.pathname.includes("/Admin") ? (
        ""
      ) : activateBlur ? (
        <Row className="sidebar-row">
          <Col
            sm={2}
            className={
              location.pathname.includes("/Admin/") ||
              location.pathname.includes("/Admin/")
                ? "justify-content-start align-items-start admin-width "
                : "diskus-sidebar m-0 p-0"
            }
          >
            <Nav
              disabled={true}
              className="new_sidebar p-0 d-flex justify-content-center gap-5 align-items-center flex-column"
            >
              <>
                {/* Meeting Menu */}
                <Nav.Link
                  // as={Link}
                  disabled={true}
                  to="Meeting"
                  eventKey="link-2"
                  data-tut="meeting-iconSidebar"
                  className={
                    location.pathname === "/Diskus/Meeting" ||
                    location.pathname === "/Diskus/Meeting"
                      ? "m-0 p-0 iconSidebar-active-sidebar"
                      : "m-0 p-0 iconSidebar"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="39.078"
                    viewBox="0 0 51.227 39.078"
                  >
                    <defs>
                      <linearGradient
                        id="linear-gradient"
                        x1="0.5"
                        x2="0.5"
                        y2="1"
                        gradientUnits="objectBoundingBox"
                      >
                        <stop offset="0" stopColor="#4adede" />
                        <stop offset="1" stopColor="#6172d6" />
                      </linearGradient>
                    </defs>
                    <g
                      id="Group_1257"
                      data-name="Group 1257"
                      transform="translate(-15 -47.501)"
                    >
                      <path
                        id="Union_1"
                        data-name="Union 1"
                        d="M-6534.229-1040.577h-1.382l0,0h-8.448a.614.614,0,0,1-.065,0h-1.171c-.027,0-.062,0-.1,0h-3.485a.5.5,0,0,1-.062,0h-1.144a.779.779,0,0,1-.8-.529l-1.941-5.818h-9.991a2.528,2.528,0,0,1-2.526-2.524V-1064.3a2.516,2.516,0,0,1,2.455-2.526h.007l8.044.013a2.522,2.522,0,0,1,1.822.741l4.106,4.106h3.1a2.5,2.5,0,0,1,1.791.748,2.5,2.5,0,0,1,.731,1.682h7.1a2.494,2.494,0,0,1,.731-1.682,2.507,2.507,0,0,1,1.792-.748h3.1l4.121-4.119a2.5,2.5,0,0,1,1.785-.741h8a2.528,2.528,0,0,1,2.526,2.526v14.582a2.527,2.527,0,0,1-2.526,2.524h-9.991l-2.025,6.08a.73.73,0,0,1-.756.536c-.023,0-.046,0-.073,0h-4.5c-.042,0-.086.006-.131.006Zm-1.183,0Zm2.878-2.62h1.8l1.629-4.887a2.518,2.518,0,0,1,2.394-1.727h9.967v-14.392h-7.869l-4.119,4.121a2.531,2.531,0,0,1-1,.615h5.7a2.526,2.526,0,0,1,2.521,2.394l0,.054,0,2.687a2.552,2.552,0,0,1-.69,1.831,2.543,2.543,0,0,1-1.832.786h-5.125Zm-20.564-11.14h2.786a2.519,2.519,0,0,1,2.346,1.588l3.819,9.552h8.757l3.819-9.55a2.519,2.519,0,0,1,2.348-1.59h5.088l0-2.51h-28.959Zm-9.636,4.8h9.967a2.521,2.521,0,0,1,2.4,1.727l1.538,4.617h1.867l-3.407-8.519h-2.811a2.538,2.538,0,0,1-2.531-2.376l0-.04.011-2.722a2.542,2.542,0,0,1,.689-1.826,2.551,2.551,0,0,1,1.833-.789h3.44a2.521,2.521,0,0,1-1-.615l-4.106-4.106-7.884-.013Zm36.266-23.938a6.177,6.177,0,0,1,6.17-6.171,6.177,6.177,0,0,1,6.17,6.171,6.178,6.178,0,0,1-6.17,6.171A6.178,6.178,0,0,1-6526.469-1073.481Zm2.62,0a3.554,3.554,0,0,0,3.551,3.549,3.554,3.554,0,0,0,3.551-3.549,3.554,3.554,0,0,0-3.551-3.551A3.554,3.554,0,0,0-6523.849-1073.481Zm-41.505,0a6.178,6.178,0,0,1,6.171-6.171,6.177,6.177,0,0,1,6.17,6.171,6.178,6.178,0,0,1-6.17,6.171A6.178,6.178,0,0,1-6565.354-1073.481Zm2.62,0a3.554,3.554,0,0,0,3.551,3.549,3.554,3.554,0,0,0,3.551-3.549,3.554,3.554,0,0,0-3.551-3.551A3.554,3.554,0,0,0-6562.734-1073.481Z"
                        transform="translate(6580.354 1127.152)"
                        fill="url(#linear-gradient)"
                      />
                    </g>
                  </svg>
                </Nav.Link>
                {/* Todo Menu */}
                <Nav.Link
                  disabled={true}
                  to="todolist"
                  eventKey="link-3"
                  className={
                    location.pathname === "/Diskus/todolist" ||
                    location.pathname === "/Diskus/todolist"
                      ? "m-0 p-0 iconSidebar-active-sidebar"
                      : "m-0 p-0 iconSidebar"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="46.081"
                    viewBox="0 0 48.346 46.081"
                  >
                    <defs>
                      <linearGradient
                        id="linear-gradient"
                        x1="0.5"
                        x2="0.5"
                        y2="1"
                        gradientUnits="objectBoundingBox"
                      >
                        <stop offset="0" stopColor="#4adede" />
                        <stop offset="1" stopColor="#6172d6" />
                      </linearGradient>
                    </defs>
                    <g
                      id="Group_1259"
                      data-name="Group 1259"
                      transform="translate(255.773 -23.25)"
                    >
                      <path
                        id="Union_2"
                        data-name="Union 2"
                        d="M-6997.727-1054.47a5.838,5.838,0,0,1-5.832-5.832v-29.884a5.839,5.839,0,0,1,5.832-5.832h5.5v-3.528a1,1,0,0,1,1-1.005h23.67a1,1,0,0,1,1,1.005v3.528h5.5a5.838,5.838,0,0,1,5.83,5.832v29.884a5.837,5.837,0,0,1-5.83,5.832Zm-2.821-35.064v28.581a3.476,3.476,0,0,0,3.473,3.471h35.38a3.475,3.475,0,0,0,3.471-3.471v-28.581a3.475,3.475,0,0,0-3.471-3.471h-4.851v3.529a1,1,0,0,1-1,1h-23.67a1,1,0,0,1-1-1v-3.529h-4.851A3.476,3.476,0,0,0-7000.548-1089.534Zm11.335-1.949h19.656v-6.057h-19.656Zm-4.913,28.288-2.441-2.441a1,1,0,0,1-.3-.71,1,1,0,0,1,.3-.71l.71-.71a1,1,0,0,1,.708-.294,1,1,0,0,1,.71.294l1.023,1.023,3.291-3.289a.994.994,0,0,1,.708-.294,1,1,0,0,1,.71.292l.71.712a1,1,0,0,1,.3.708,1,1,0,0,1-.3.71l-4.709,4.711a1,1,0,0,1-.71.293A1,1,0,0,1-6994.125-1063.2Zm12.657-1.854a.958.958,0,0,1-.933-1v-1.009a.959.959,0,0,1,.933-1h17.767a.96.96,0,0,1,.935,1v1.009a.959.959,0,0,1-.935,1Zm-12.657-4.946-2.441-2.441a1,1,0,0,1-.3-.71,1,1,0,0,1,.3-.71l.71-.71a1,1,0,0,1,.708-.293,1,1,0,0,1,.71.293l1.023,1.023,3.291-3.289a.994.994,0,0,1,.708-.293,1,1,0,0,1,.71.292l.71.712a1,1,0,0,1,.3.708,1,1,0,0,1-.3.71l-4.709,4.711a1,1,0,0,1-.71.293A1,1,0,0,1-6994.125-1070Zm12.657-1.854a.958.958,0,0,1-.933-1v-1.009a.958.958,0,0,1,.933-1h17.767a.96.96,0,0,1,.935,1v1.009a.959.959,0,0,1-.935,1Zm-12.657-4.946-2.441-2.441a1,1,0,0,1-.3-.71,1,1,0,0,1,.3-.71l.71-.71a1,1,0,0,1,.708-.293,1,1,0,0,1,.71.293l1.023,1.023,3.291-3.289a.994.994,0,0,1,.708-.293,1,1,0,0,1,.71.292l.71.712a1,1,0,0,1,.3.708,1,1,0,0,1-.3.71l-4.709,4.711a1,1,0,0,1-.71.294A1,1,0,0,1-6994.125-1076.8Zm12.657-1.854a.958.958,0,0,1-.933-1v-1.009a.958.958,0,0,1,.933-1h17.767a.96.96,0,0,1,.935,1v1.009a.959.959,0,0,1-.935,1Z"
                        transform="translate(6747.787 1123.801)"
                        fill="url(#linear-gradient)"
                      />
                    </g>
                  </svg>
                </Nav.Link>
                {/* Calendar Menu */}
                <Nav.Link
                  disabled={true}
                  to="calendar"
                  eventKey="link-4"
                  className={
                    location.pathname === "/Diskus/calendar" ||
                    location.pathname === "/Diskus/calendar"
                      ? "m-0 p-0 iconSidebar-active-sidebar"
                      : "m-0 p-0 iconSidebar"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="44.281"
                    viewBox="0 0 44.281 44.281"
                  >
                    <defs>
                      <linearGradient
                        id="linear-gradient"
                        x1="0.5"
                        x2="0.5"
                        y2="1"
                        gradientUnits="objectBoundingBox"
                      >
                        <stop offset="0" stopColor="#4adede" />
                        <stop offset="1" stopColor="#6172d6" />
                      </linearGradient>
                    </defs>
                    <g
                      id="Group_1258"
                      data-name="Group 1258"
                      transform="translate(-408 -408)"
                    >
                      <path
                        id="Path_46"
                        data-name="Path 46"
                        d="M408,444.584V419.07a1.834,1.834,0,0,0,.081-.281,8.533,8.533,0,0,1,7.77-7.335c.768-.049,1.542-.007,2.351-.007,0-.485.025-.873,0-1.256A1.923,1.923,0,0,1,419.589,408h.692a1.962,1.962,0,0,1,1.385,2.246c-.029.368,0,.741,0,1.133H438.62c0-.392.025-.765,0-1.133A1.963,1.963,0,0,1,440,408h.692a1.926,1.926,0,0,1,1.391,2.192c-.031.394-.005.792-.005,1.21.543,0,1.017-.005,1.491,0a8.576,8.576,0,0,1,8.415,6.333c.12.439.2.89.3,1.335v25.514a1.394,1.394,0,0,0-.077.24,8.53,8.53,0,0,1-6.533,7.216c-.389.092-.783.162-1.174.241H415.784a1.405,1.405,0,0,0-.241-.075,8.558,8.558,0,0,1-7.337-6.615C408.129,445.257,408.068,444.92,408,444.584Zm3.459-19.5v.48q0,9.015,0,18.03a5.089,5.089,0,0,0,5.217,5.225q13.468.013,26.936,0a5.088,5.088,0,0,0,5.209-5.233q0-9.015,0-18.029v-.472Zm.031-3.509h37.3c.578-5.394-3.245-7.213-6.714-6.628,0,1.091.008,2.185,0,3.28a1.726,1.726,0,1,1-3.451.01c-.016-1.106,0-2.213,0-3.346H421.662c0,.182,0,.338,0,.494,0,.951.012,1.9,0,2.854a1.726,1.726,0,1,1-3.452-.014c-.008-.5,0-1.009,0-1.513,0-.6,0-1.2,0-1.794C414.1,414.385,410.952,416.677,411.49,421.572Z"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_47"
                        data-name="Path 47"
                        d="M485.126,688.457c.561,0,1.123-.009,1.684,0a1.725,1.725,0,0,1,.034,3.449q-1.727.032-3.454,0a1.725,1.725,0,0,1,.009-3.449C483.975,688.447,484.551,688.457,485.126,688.457Z"
                        transform="translate(-65.182 -248.113)"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_48"
                        data-name="Path 48"
                        d="M662.247,688.455c.561,0,1.123-.009,1.684,0a1.726,1.726,0,1,1,0,3.451c-1.137.016-2.274.018-3.411,0a1.725,1.725,0,0,1,0-3.45C661.1,688.445,661.672,688.456,662.247,688.455Z"
                        transform="translate(-221.885 -248.111)"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_49"
                        data-name="Path 49"
                        d="M662.22,603.417c-.561,0-1.123.011-1.684,0a1.726,1.726,0,1,1,.016-3.453q1.684-.017,3.368,0a1.726,1.726,0,1,1,.027,3.452C663.371,603.429,662.8,603.417,662.22,603.417Z"
                        transform="translate(-221.887 -169.819)"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_50"
                        data-name="Path 50"
                        d="M485.092,603.417c-.561,0-1.123.011-1.684,0a1.726,1.726,0,1,1,.022-3.452q1.684-.017,3.368,0a1.726,1.726,0,1,1,.021,3.453C486.244,603.428,485.668,603.417,485.092,603.417Z"
                        transform="translate(-65.185 -169.818)"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_51"
                        data-name="Path 51"
                        d="M573.553,603.417c-.561,0-1.123.011-1.684,0a1.726,1.726,0,1,1,.02-3.452q1.684-.017,3.368,0a1.726,1.726,0,1,1,.023,3.453C574.7,603.428,574.128,603.417,573.553,603.417Z"
                        transform="translate(-143.444 -169.818)"
                        fill="url(#linear-gradient)"
                      />
                      <path
                        id="Path_52"
                        data-name="Path 52"
                        d="M573.613,688.456c.561,0,1.123-.011,1.684,0a1.724,1.724,0,0,1,.029,3.447q-1.748.037-3.5,0a1.724,1.724,0,0,1,.014-3.447C572.433,688.444,573.023,688.456,573.613,688.456Z"
                        transform="translate(-143.444 -248.111)"
                        fill="url(#linear-gradient)"
                      />
                    </g>
                  </svg>
                </Nav.Link>

                {/* FAQ Menu */}
                <Nav.Link
                  disabled={true}
                  to="faq's"
                  eventKey="link-5"
                  className={
                    location.pathname === "/Diskus/faq's" ||
                    location.pathname === "/Diskus/faq's"
                      ? "m-0 p-0 faqMenu iconSidebar"
                      : "m-0 p-0 faqMenu iconSidebar"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="48.231"
                    viewBox="0 0 49.694 48.231"
                  >
                    <defs>
                      <linearGradient
                        id="linear-gradient"
                        x1="0.5"
                        x2="0.5"
                        y2="1"
                        gradientUnits="objectBoundingBox"
                      >
                        <stop offset="0" stopColor="#4adede" />
                        <stop offset="1" stopColor="#6172d6" />
                      </linearGradient>
                    </defs>
                    <g
                      id="Group_1362"
                      data-name="Group 1362"
                      transform="translate(-225 -536)"
                    >
                      <g
                        id="Group_1364"
                        data-name="Group 1364"
                        transform="translate(225 536)"
                      >
                        <path
                          id="Path_484"
                          data-name="Path 484"
                          d="M-346.953,786.919q-4.389,0-8.778-.006a2.38,2.38,0,0,1-2.525-2.54c0-1.062,0-2.124,0-3.211V780.1h-23.076c-2.342,0-3.133-.514-4.027-2.619l-.031-.072v-8.712a3.984,3.984,0,0,1,.49-1.914l.454-.829a4.288,4.288,0,0,1-.922-1.685l-.021-.061v-9.582l.016-.054a4.127,4.127,0,0,1,.919-1.737h0a8.188,8.188,0,0,1-.936-3.8V741.4l.039-.08c.011-.023.024-.046.036-.069l.035-.085a3.269,3.269,0,0,1,3.34-2.479q8.738,0,17.477,0,8.391,0,16.782,0a3.293,3.293,0,0,1,3.46,3.478c.005,1.822,0,3.674,0,5.465q0,1.162,0,2.324a3.5,3.5,0,0,1-.994,2.837,3.339,3.339,0,0,1,.953,1.939c0,.007,0,.016.006.025a.641.641,0,0,1,.011.292c-.163.724.117.933,1.025,1.392a8.23,8.23,0,0,1,4.72,7.743c.013.784.01,1.557.006,2.375q0,.376,0,.76h.052c.085,0,.169,0,.253,0a2.434,2.434,0,0,1,2.492,2.579q0,7.215,0,14.43a2.4,2.4,0,0,1-2.543,2.576Q-342.6,786.919-346.953,786.919Zm-.024-17.681h-8.559c-.7,0-.809.108-.809.823q0,7.07,0,14.14c0,.7.1.8.818.8h17.1c.707,0,.813-.107.813-.812q0-7.07,0-14.14c0-.7-.115-.812-.823-.813Zm-21.224-2.313h-13.7a1.422,1.422,0,0,0-1.58,1.572q0,4.035,0,8.071a1.428,1.428,0,0,0,1.632,1.615h23.563V775.4l-.211,0c-.2,0-.389,0-.582,0-.274,0-.5,0-.714-.013a2.846,2.846,0,0,1-2.755-2.4,2.788,2.788,0,0,1,1.969-3.123,4.909,4.909,0,0,1,1.185-.134c.105,0,.211-.006.315-.012.14-.007.289-.01.47-.01l.347,0a2.064,2.064,0,0,1,.99-1.868,6.034,6.034,0,0,1,1.421-.5c.12-.032.242-.064.364-.1v-.316Zm25.438.384q0-.424,0-.842c.005-.9.01-1.751-.01-2.617a4.233,4.233,0,0,0-4.186-4.086h-.034a4.212,4.212,0,0,0-4.2,4.033c-.026.861-.021,1.74-.017,2.59q0,.461,0,.922Zm-10.351-.013v-.16q0-.508,0-1.015c0-.734-.006-1.493.008-2.241a6.1,6.1,0,0,1,5.757-6.02c.147-.011.3-.017.443-.017a6.024,6.024,0,0,1,5.938,5.076,18.387,18.387,0,0,1,.125,2.916c0,.421-.009.855,0,1.278,0,.06,0,.12,0,.181h.436q0-.1,0-.209c0-.425.008-.827-.007-1.23-.012-.312-.016-.629-.02-.935a14.038,14.038,0,0,0-.159-2.338,6.49,6.49,0,0,0-6.366-5.166q-.154,0-.308.007a6.469,6.469,0,0,0-6.2,5.766c-.089,1-.079,2.038-.069,3.04,0,.35.007.709.006,1.067Zm-11.53-13.538-17.238,0a1.42,1.42,0,0,0-1.6,1.6q0,2.975,0,5.951v1.93c0,1.3.461,1.768,1.76,1.768h26.212l.208-2.785h-.092l-1.289,0-1.291,0c-.685,0-1.247,0-1.769-.008a2.878,2.878,0,0,1-2.054-.857,2.811,2.811,0,0,1-.79-2.026,2.8,2.8,0,0,1,2.932-2.777q1.575-.008,3.15-.006h1.658c1.083,0,2.246,0,3.407-.008a2.348,2.348,0,0,0,.637-.139l.165-.05c.258-.076.521-.165.775-.251a11.393,11.393,0,0,1,1.631-.46,10.442,10.442,0,0,1,1.7-.115l.395-.006a1.748,1.748,0,0,0-.333-1.284,1.593,1.593,0,0,0-1.262-.485Zm8.909-1.912,7.947,0a1.439,1.439,0,0,0,1.653-1.645c0-2.984,0-5.593,0-7.978a1.42,1.42,0,0,0-1.584-1.616l-16.494,0-17.717,0a1.385,1.385,0,0,0-1.548,1.547c0,2.959,0,5.92,0,8.17a2.014,2.014,0,0,0,.035.435,1.415,1.415,0,0,0,1.587,1.087h26.12Z"
                          transform="translate(385.391 -738.688)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_485"
                          data-name="Path 485"
                          d="M-350.651,788.408c-2.711,1.483-4.6.589-4.605-1.42,0-1.527,0-3.055,0-4.657h-23.46c-2.188,0-2.841-.424-3.674-2.386v-8.536a3.985,3.985,0,0,1,.49-1.914l.557-1.017a3.373,3.373,0,0,1-1.047-1.72V757.3a3.42,3.42,0,0,1,.941-1.683l.032-.186a8.186,8.186,0,0,1-.974-3.874V744.11a1.134,1.134,0,0,0,.082-.17,2.879,2.879,0,0,1,2.986-2.247q17.129-.008,34.258,0a2.911,2.911,0,0,1,3.078,3.1c.008,2.6,0,5.192,0,7.788a3.243,3.243,0,0,1-1.145,2.849,3.137,3.137,0,0,1,1.106,1.972.61.61,0,0,1,.023.189c-.236,1.049.381,1.391,1.226,1.818a7.88,7.88,0,0,1,4.51,7.407c.02,1.144,0,2.289,0,3.515.246,0,.461-.006.675,0,1.532.055,2.375,1.173,2.055,2.891-.794,4.27.18,8.561-.026,12.9C-333.748,790.114-350.651,788.408-350.651,788.408Zm-11.577-33.564q8.529,0,17.057,0a1.81,1.81,0,0,0,2.036-2.027q0-3.99,0-7.979a1.792,1.792,0,0,0-1.967-2q-17.105,0-34.211,0a1.765,1.765,0,0,0-1.931,1.93q0,4.085,0,8.17a2.344,2.344,0,0,0,.045.521,1.786,1.786,0,0,0,1.96,1.384Q-370.733,754.846-362.228,754.844ZM-344.405,788q4.3,0,8.6,0c.922,0,1.2-.277,1.2-1.195q0-7.07,0-14.14c0-.907-.287-1.2-1.206-1.2q-8.551,0-17.1,0c-.916,0-1.192.283-1.192,1.206q0,7.07,0,14.14c0,.916.27,1.184,1.2,1.185Q-348.657,788.006-344.405,788Zm-7.863-23.543h-.456c-1.465,0-2.93.011-4.394,0a2.43,2.43,0,0,1-2.465-2.493,2.419,2.419,0,0,1,2.551-2.4c2.738-.014,5.477,0,8.215-.014a3.4,3.4,0,0,0,.909-.205,22.229,22.229,0,0,1,2.364-.7,18.142,18.142,0,0,1,2.367-.126c.252-1.537-.483-2.524-1.936-2.524q-17.075-.005-34.15,0a1.8,1.8,0,0,0-1.98,1.987q0,3.94,0,7.881c0,1.511.636,2.151,2.143,2.151h26.568C-352.444,766.808-352.358,765.657-352.268,764.461Zm-.216,4.7h-.481q-13.157,0-26.315,0a1.8,1.8,0,0,0-1.963,1.955q0,4.035,0,8.071a1.805,1.805,0,0,0,2.015,2h23.946v-3.553c-.642,0-1.259.021-1.874,0a2.462,2.462,0,0,1-2.391-2.073c-.07-.52,1.015-2.515,1.693-2.7a6.545,6.545,0,0,1,1.417-.132c.388-.02.778,0,1.182,0a1.894,1.894,0,0,1,.791-1.92,10.639,10.639,0,0,1,1.982-.651Zm12.721,1.149c0-1.313.024-2.582-.005-3.85A4.6,4.6,0,0,0-344.334,762a4.591,4.591,0,0,0-4.617,4.4c-.037,1.208-.013,2.417-.013,3.626a1.716,1.716,0,0,0,.048.281Zm-10.35-.013c0-.2,0-.372,0-.543,0-1.083-.014-2.166.006-3.249a5.749,5.749,0,0,1,5.4-5.645,5.67,5.67,0,0,1,5.972,4.734,32.789,32.789,0,0,1,.121,4.145c0,.184,0,.368,0,.555h1.2c0-.633.018-1.235,0-1.836a23.162,23.162,0,0,0-.184-3.328,6.854,6.854,0,0,0-7.069-5.472,6.845,6.845,0,0,0-6.567,6.115c-.131,1.469-.052,2.958-.066,4.437,0,.025.035.051.06.086Zm.028-9.578c-2.352,0-4.739-.014-7.127.009a1.232,1.232,0,0,0-1.221,1.318,1.267,1.267,0,0,0,1.293,1.263c1.7.018,3.408.01,5.112,0a.475.475,0,0,0,.346-.159C-351.144,762.351-350.624,761.542-350.085,760.717Zm-5.19,13.189c-.731,0-1.429-.048-2.118.015l-.88.621-.147.574c-.021.633,2.4,1.31,3.145,1.31Z"
                          transform="translate(382.774 -741.305)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_486"
                          data-name="Path 486"
                          d="M-202.063,781.207q-.888,0-1.776,0a2.816,2.816,0,0,1-2.908-2.8,2.785,2.785,0,0,1,.793-2,2.956,2.956,0,0,1,2.122-.847q2.281,0,4.563,0,2.253,0,4.505,0a2.825,2.825,0,0,1,2.919,2.8,2.758,2.758,0,0,1-.791,1.984,2.976,2.976,0,0,1-2.134.867q-.882,0-1.765,0l-2.77,0Z"
                          transform="translate(229.552 -770.843)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_487"
                          data-name="Path 487"
                          d="M-196.686,783.439c-1.511,0-3.022,0-4.534,0a2.423,2.423,0,0,1-2.526-2.422,2.422,2.422,0,0,1,2.532-2.463q4.534-.007,9.067,0a2.446,2.446,0,0,1,2.536,2.422,2.45,2.45,0,0,1-2.543,2.464C-193.663,783.443-195.175,783.439-196.686,783.439Zm.045-1.147c1.465,0,2.929,0,4.394,0a1.323,1.323,0,0,0,1.485-1.315,1.319,1.319,0,0,0-1.474-1.278q-4.442,0-8.883,0a1.3,1.3,0,0,0-1.477,1.314,1.3,1.3,0,0,0,1.465,1.279C-199.634,782.3-198.137,782.293-196.641,782.293Z"
                          transform="translate(226.935 -773.46)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_488"
                          data-name="Path 488"
                          d="M-355.507,781.224a2.84,2.84,0,0,1-2.841-2.812,2.8,2.8,0,0,1,.819-1.993,2.837,2.837,0,0,1,2.018-.845,2.823,2.823,0,0,1,2.825,2.787,2.835,2.835,0,0,1-.812,2.029,2.8,2.8,0,0,1-1.988.834Zm-.022-3.738C-355.774,777.49-355.007,777.486-355.529,777.486Z"
                          transform="translate(361.801 -770.865)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_489"
                          data-name="Path 489"
                          d="M-350.453,780.981a2.429,2.429,0,0,1-2.42,2.477,2.457,2.457,0,0,1-2.475-2.431,2.457,2.457,0,0,1,2.455-2.453A2.428,2.428,0,0,1-350.453,780.981Zm-1.148.013a1.281,1.281,0,0,0-1.317-1.273,1.309,1.309,0,0,0-1.284,1.318,1.307,1.307,0,0,0,1.327,1.274A1.284,1.284,0,0,0-351.6,780.994Z"
                          transform="translate(359.184 -773.482)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_490"
                          data-name="Path 490"
                          d="M-310.73,781.224a2.809,2.809,0,0,1-2-.827,2.807,2.807,0,0,1-.822-2,2.807,2.807,0,0,1,2.844-2.82,2.813,2.813,0,0,1,2.808,2.805,2.8,2.8,0,0,1-2.817,2.845Zm-.015-3.737C-311.255,777.494-310.224,777.487-310.745,777.487Z"
                          transform="translate(322.726 -770.865)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_491"
                          data-name="Path 491"
                          d="M-308.094,778.575A2.428,2.428,0,0,1-305.669,781a2.429,2.429,0,0,1-2.435,2.461,2.432,2.432,0,0,1-2.45-2.446A2.434,2.434,0,0,1-308.094,778.575Zm-.039,1.147a1.286,1.286,0,0,0-1.276,1.316,1.284,1.284,0,0,0,1.316,1.275A1.286,1.286,0,0,0-306.817,781,1.281,1.281,0,0,0-308.133,779.722Z"
                          transform="translate(320.109 -773.483)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_492"
                          data-name="Path 492"
                          d="M-265.994,781.225a2.79,2.79,0,0,1-1.993-.83,2.82,2.82,0,0,1-.812-2.026,2.809,2.809,0,0,1,2.844-2.795h.019a2.85,2.85,0,0,1,2.793,2.83,2.848,2.848,0,0,1-2.845,2.82Zm.017-3.738c-.518,0,.25,0,0-.383Z"
                          transform="translate(283.684 -770.866)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_494"
                          data-name="Path 494"
                          d="M-103.871,1015.372c-.446,0-.9-.335-.915-1.085,0-.2,0-.4,0-.6v-.267c0-.015,0-.031,0-.047a1.218,1.218,0,0,1,0-.189c.058-.487,0-.729-.493-.962a2.639,2.639,0,0,1-1.248-3.216,2.842,2.842,0,0,1,2.679-1.989c.044,0,.088,0,.132,0a2.828,2.828,0,0,1,2.647,2.274,2.757,2.757,0,0,1-1.593,3.1c-.223.092-.235.127-.223.356.018.338.015.676.011,1,0,.181,0,.361,0,.541a.966.966,0,0,1-.91,1.076C-103.813,1015.37-103.842,1015.372-103.871,1015.372Zm.037-6.441a.9.9,0,0,0-.64.275.9.9,0,0,0-.267.649.894.894,0,0,0,.9.887.9.9,0,0,0,.649-.263.906.906,0,0,0,.258-.652.906.906,0,0,0-.9-.9l0-.383Z"
                          transform="translate(142.245 -972.761)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_495"
                          data-name="Path 495"
                          d="M-101.768,1016.037a1.586,1.586,0,0,1,0-.191,1.118,1.118,0,0,0-.711-1.354,2.27,2.27,0,0,1-1.045-2.754,2.449,2.449,0,0,1,2.426-1.718,2.456,2.456,0,0,1,2.289,1.959,2.379,2.379,0,0,1-1.362,2.674.626.626,0,0,0-.458.731c.027.507,0,1.018.008,1.527,0,.389-.153.655-.561.691-.355.032-.578-.249-.586-.707C-101.772,1016.61-101.768,1016.323-101.768,1016.037Zm1.853-3.6a1.292,1.292,0,0,0-1.278-1.276,1.309,1.309,0,0,0-1.3,1.313,1.282,1.282,0,0,0,1.283,1.265A1.272,1.272,0,0,0-99.914,1012.44Z"
                          transform="translate(139.608 -975.378)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_496"
                          data-name="Path 496"
                          d="M-355.508,884.39a2.843,2.843,0,0,1-2.84-2.823,2.841,2.841,0,0,1,2.838-2.833h.015a2.815,2.815,0,0,1,2.809,2.787,2.847,2.847,0,0,1-.809,2.021,2.79,2.79,0,0,1-1.993.847Zm0-3.742C-356.013,880.648-355.229,880.655-355.5,880.648Z"
                          transform="translate(361.801 -860.855)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_497"
                          data-name="Path 497"
                          d="M-352.892,881.735a2.422,2.422,0,0,1,2.439,2.407,2.445,2.445,0,0,1-2.422,2.483,2.47,2.47,0,0,1-2.474-2.441A2.445,2.445,0,0,1-352.892,881.735Zm1.288,2.489a1.27,1.27,0,0,0-1.243-1.341,1.3,1.3,0,0,0-1.354,1.242,1.326,1.326,0,0,0,1.255,1.353A1.3,1.3,0,0,0-351.6,884.224Z"
                          transform="translate(359.184 -863.473)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_498"
                          data-name="Path 498"
                          d="M-310.73,884.388a2.807,2.807,0,0,1-2-.834,2.818,2.818,0,0,1-.826-2.013,2.805,2.805,0,0,1,2.845-2.809,2.813,2.813,0,0,1,2.807,2.811,2.839,2.839,0,0,1-2.822,2.845Zm0-4.125Z"
                          transform="translate(322.726 -860.853)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_499"
                          data-name="Path 499"
                          d="M-305.67,884.16a2.449,2.449,0,0,1-2.442,2.462,2.451,2.451,0,0,1-2.443-2.463,2.426,2.426,0,0,1,2.469-2.428A2.422,2.422,0,0,1-305.67,884.16Zm-1.148.007a1.272,1.272,0,0,0-1.3-1.287,1.277,1.277,0,0,0-1.293,1.3,1.307,1.307,0,0,0,1.3,1.3A1.308,1.308,0,0,0-306.817,884.167Z"
                          transform="translate(320.109 -863.47)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_500"
                          data-name="Path 500"
                          d="M-265.978,884.385a2.831,2.831,0,0,1-2.824-2.83,2.805,2.805,0,0,1,2.831-2.826,2.822,2.822,0,0,1,2.826,2.794,2.831,2.831,0,0,1-.822,2.013,2.805,2.805,0,0,1-2,.849Zm0-4.125Z"
                          transform="translate(283.686 -860.851)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_501"
                          data-name="Path 501"
                          d="M-265.8,884.173a2.417,2.417,0,0,1,2.449-2.443,2.441,2.441,0,0,1,2.442,2.413,2.47,2.47,0,0,1-2.437,2.477A2.438,2.438,0,0,1-265.8,884.173Zm2.453,1.3a1.326,1.326,0,0,0,1.29-1.32,1.29,1.29,0,0,0-1.319-1.276,1.268,1.268,0,0,0-1.279,1.307A1.294,1.294,0,0,0-263.349,885.475Z"
                          transform="translate(281.069 -863.469)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_502"
                          data-name="Path 502"
                          d="M-310.734,987.438a2.8,2.8,0,0,1-1.993-.836,2.827,2.827,0,0,1-.828-2.019,2.842,2.842,0,0,1,2.84-2.818h.018a2.823,2.823,0,0,1,2.793,2.828,2.842,2.842,0,0,1-2.825,2.844Z"
                          transform="translate(322.726 -950.734)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_503"
                          data-name="Path 503"
                          d="M-310.555,987.2a2.453,2.453,0,0,1,2.473-2.436,2.447,2.447,0,0,1,2.413,2.444,2.456,2.456,0,0,1-2.446,2.462A2.457,2.457,0,0,1-310.555,987.2Zm2.418-1.288a1.3,1.3,0,0,0-1.272,1.329,1.31,1.31,0,0,0,1.32,1.282,1.31,1.31,0,0,0,1.271-1.332A1.3,1.3,0,0,0-308.137,985.914Z"
                          transform="translate(320.109 -953.351)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_504"
                          data-name="Path 504"
                          d="M-355.489,987.441l-.1,0a2.847,2.847,0,0,1-2.762-2.92,2.861,2.861,0,0,1,2.826-2.751l.106,0a2.839,2.839,0,0,1,2.727,2.89A2.846,2.846,0,0,1-355.489,987.441Z"
                          transform="translate(361.8 -950.736)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_505"
                          data-name="Path 505"
                          d="M-350.453,987.266a2.452,2.452,0,0,1-2.5,2.407,2.473,2.473,0,0,1-2.392-2.524,2.473,2.473,0,0,1,2.535-2.38A2.445,2.445,0,0,1-350.453,987.266Zm-1.148-.064a1.3,1.3,0,0,0-1.312-1.288,1.327,1.327,0,0,0-1.289,1.322,1.328,1.328,0,0,0,1.321,1.29A1.306,1.306,0,0,0-351.6,987.2Z"
                          transform="translate(359.183 -953.352)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_506"
                          data-name="Path 506"
                          d="M-265.991,987.432a2.826,2.826,0,0,1-2.81-2.823,2.819,2.819,0,0,1,2.819-2.85h.028a2.861,2.861,0,0,1,2.81,2.8,2.854,2.854,0,0,1-2.8,2.877Z"
                          transform="translate(283.685 -950.728)"
                          fill="url(#linear-gradient)"
                        />
                        <path
                          id="Path_507"
                          data-name="Path 507"
                          d="M-265.8,987.225a2.445,2.445,0,0,1,2.44-2.466,2.472,2.472,0,0,1,2.451,2.416,2.473,2.473,0,0,1-2.427,2.49A2.446,2.446,0,0,1-265.8,987.225Zm3.743,0a1.316,1.316,0,0,0-1.286-1.321,1.3,1.3,0,0,0-1.311,1.286,1.3,1.3,0,0,0,1.274,1.326A1.329,1.329,0,0,0-262.058,987.23Z"
                          transform="translate(281.068 -953.345)"
                          fill="url(#linear-gradient)"
                        />
                      </g>
                    </g>
                  </svg>
                </Nav.Link>
              </>
            </Nav>
          </Col>
          <Col sm={11} className={""}></Col>
        </Row>
      ) : (
        <Row className="sidebar-row">
          <Col
            sm={2}
            className={
              location.pathname.includes("/Admin/") ||
              location.pathname.includes("/Admin/")
                ? "justify-content-start align-items-start admin-width"
                : "diskus-sidebar m-0 p-0"
            }
          >
            <Nav className="new_sidebar p-0 d-flex justify-content-center  gap-4 align-items-center flex-column">
              <>
                {/* Meeting Menu */}
                {checkFeatureIDAvailability(1) ||
                checkFeatureIDAvailability(12) ||
                checkFeatureIDAvailability(9) ? (
                  <Nav.Link
                    as={Link}
                    to={
                      (scheduleMeetingPageFlagReducer === true ||
                        viewProposeDateMeetingPageFlagReducer === true ||
                        viewAdvanceMeetingPublishPageFlagReducer === true ||
                        viewAdvanceMeetingUnpublishPageFlagReducer === true ||
                        viewProposeOrganizerMeetingPageFlagReducer === true ||
                        proposeNewMeetingPageFlagReducer === true) &&
                      viewMeetingFlagReducer === false
                        ? "/Diskus/Meeting"
                        : "/Diskus/Meeting"
                    }
                    eventKey="link-2"
                    className={
                      location.pathname === "/Diskus/Meeting" ||
                      location.pathname === "/Diskus/Meeting" ||
                      location.pathname === "/Diskus/meeting" ||
                      location.pathname === "/Diskus/meeting"
                        ? "m-0 p-0 iconItem_activeSideBarMain"
                        : "m-0 p-0 iconItemSideBarMain"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      const activeCall = JSON.parse(
                        localStorage.getItem("activeCall")
                      );
                      // Explicitly evaluate activeCall
                      if (activeCall === false) {
                        handleMeetingSidebarClickNoCall();
                      } else {
                        handleMeetingSidebarClick();
                      }
                    }}
                  >
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      draggable="false"
                    >
                      <img src={MeetingImage} alt="MeetingIcon" />
                      <span>{t("Meetings")}</span>
                    </div>
                  </Nav.Link>
                ) : null}

                {/* DataRoom  */}
                {checkFeatureIDAvailability(13) ? (
                  <Nav.Link
                    as={Link}
                    to={
                      (scheduleMeetingsPageFlag === true ||
                        viewProposeDateMeetingsPageFlag === true ||
                        viewAdvanceMeetingsPublishPageFlag === true ||
                        viewAdvanceMeetingsUnpublishPageFlag === true ||
                        viewProposeOrganizerMeetingsPageFlag === true ||
                        proposeNewMeetingsPageFlag === true) &&
                      viewMeetingsFlag === false
                        ? "/Diskus/Meeting"
                        : "/Diskus/dataroom"
                    }
                    draggable="false"
                    className={
                      location.pathname === "/Diskus/dataroom" ||
                      location.pathname === "/Diskus/dataroom"
                        ? "m-0 p-0 iconItem_activeSideBarMain"
                        : "m-0 p-0 iconItemSideBarMain"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      const activeCall = JSON.parse(
                        localStorage.getItem("activeCall")
                      );
                      // Explicitly evaluate activeCall
                      if (activeCall === false) {
                        handleMeetingSidebarDataroomNoCall();
                      } else {
                        handleMeetingSidebarDataroom();
                      }
                    }}
                  >
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      draggable="false"
                    >
                      <img src={DataroomImage} alt="DataroomIcon" />

                      <span draggable="false">{t("Data-room")}</span>
                    </div>
                  </Nav.Link>
                ) : null}

                {/* Resolution */}
                {checkFeatureIDAvailability(18) ? (
                  <Nav.Link
                    as={Link}
                    to={
                      (scheduleMeetingsPageFlag === true ||
                        viewProposeDateMeetingsPageFlag === true ||
                        viewAdvanceMeetingsPublishPageFlag === true ||
                        viewAdvanceMeetingsUnpublishPageFlag === true ||
                        viewProposeOrganizerMeetingsPageFlag === true ||
                        proposeNewMeetingsPageFlag === true) &&
                      viewMeetingsFlag === false
                        ? "/Diskus/Meeting"
                        : "/Diskus/resolution"
                    }
                    disabled={false}
                    draggable="false"
                    className={
                      location.pathname === "/Diskus/resolution" ||
                      location.pathname === "/Diskus/resolution"
                        ? "m-0 p-0 iconItem_activeSideBarMain"
                        : "m-0 p-0 iconItemSideBarMain"
                    }
                    onClick={(e) => {
                      // Prevent default behavior
                      e.preventDefault();
                      const activeCall = JSON.parse(
                        localStorage.getItem("activeCall")
                      );
                      // Explicitly evaluate activeCall
                      if (activeCall === false) {
                        handleMeetingSidebarResolutionsNoCall();
                      } else {
                        handleMeetingSidebarResolutions();
                      }
                    }}
                  >
                    {/* Resolution Icon */}
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      draggable="false"
                    >
                      <img src={ResolutionImage} alt="ResolutionImage" />
                      <span draggable="false">{t("Resolutions")}</span>
                    </div>
                  </Nav.Link>
                ) : null}

                {/* Committee */}
                {checkFeatureIDAvailability(48) ? (
                  <Nav.Link
                    as={Link}
                    to={
                      (scheduleMeetingsPageFlag === true ||
                        viewProposeDateMeetingsPageFlag === true ||
                        viewAdvanceMeetingsPublishPageFlag === true ||
                        viewAdvanceMeetingsUnpublishPageFlag === true ||
                        viewProposeOrganizerMeetingsPageFlag === true ||
                        proposeNewMeetingsPageFlag === true) &&
                      viewMeetingsFlag === false
                        ? "/Diskus/Meeting"
                        : "/Diskus/committee"
                    }
                    disabled={false}
                    draggable="false"
                    className={
                      location.pathname === "/Diskus/committee" ||
                      location.pathname === "/Diskus/committee"
                        ? "m-0 p-0 iconItem_activeSideBarMain"
                        : "m-0 p-0 iconItemSideBarMain"
                    }
                    onClick={(e) => {
                      // Prevent default behavior
                      e.preventDefault();
                      const activeCall = JSON.parse(
                        localStorage.getItem("activeCall")
                      );
                      // Explicitly evaluate activeCall
                      if (activeCall === false) {
                        handleMeetingSidebarCommitteesNoCall();
                      } else {
                        handleMeetingSidebarCommittees();
                      }
                    }}
                  >
                    {/* CommitteeIcon */}
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      draggable="false"
                    >
                      <img
                        src={CommitteeImage}
                        height="25.18px"
                        width="43.97px"
                        alt="CommitteeImage"
                      />
                      <span draggable="false">{t("Committees")}</span>
                    </div>
                  </Nav.Link>
                ) : null}

                {/* Add more btn */}
                {checkFeatureIDAvailability(13) ||
                checkFeatureIDAvailability(17) ||
                checkFeatureIDAvailability(18) ||
                checkFeatureIDAvailability(15) ||
                checkFeatureIDAvailability(48) ? (
                  <>
                    <Nav.Link
                      disabled={false}
                      eventKey="link-6"
                      draggable="false"
                      className={
                        showMore ||
                        location.pathname === "/Diskus/Notes" ||
                        location.pathname === "/Diskus/groups" ||
                        location.pathname === "/Diskus/todolist" ||
                        location.pathname === "/Diskus/calendar" ||
                        location.pathname === "/Diskus/polling"
                          ? "m-0 p-0 iconItem_activeSideBarMainShowMore position-relative"
                          : "m-0 p-0 iconItemSideBarMain  position-relative"
                      }
                      ref={sidebarshow}
                      onClick={(e) => {
                        // Prevent default behavior
                        e.preventDefault();
                        const activeCall = JSON.parse(
                          localStorage.getItem("activeCall")
                        );
                        // Explicitly evaluate activeCall
                        if (activeCall === false) {
                          handleMoreOptions();
                        } else {
                          handleMoreOptionActiveCall();
                        }
                      }}
                    >
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        draggable="false"
                      >
                        <img
                          src={NewShowMoreIcon}
                          alt="ShowMoreImage"
                          className={
                            showMore ||
                            location.pathname === "/Diskus/Notes" ||
                            location.pathname === "/Diskus/groups" ||
                            location.pathname === "/Diskus/calendar" ||
                            location.pathname === "/Diskus/todolist" ||
                            location.pathname === "/Diskus/polling"
                              ? "m-0 p-0 ForActive"
                              : ""
                          }
                        />
                        <span draggable="false">{t("More")}</span>
                      </div>

                      {showMore ? (
                        <>
                          <section className="expanded_menu">
                            <ExpandedMenu />
                          </section>
                        </>
                      ) : null}
                    </Nav.Link>
                  </>
                ) : null}
              </>
            </Nav>
          </Col>
          <Col sm={11} className={""}></Col>
        </Row>
      )}
      {LeaveMeetingSideBarModalTrigger && <LeaveMeetingModalSideBar />}
      <CancelButtonModal />
    </>
  );
};

export default Sidebar;
