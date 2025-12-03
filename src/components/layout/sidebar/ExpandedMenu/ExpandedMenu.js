import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ExpandedMenu.css";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import GroupImage from "../../../../assets/images/sidebar_icons/Group.png";
import PollImage from "../../../../assets/images/sidebar_icons/Polls.png";
import CalenderImage from "../../../../assets/images/sidebar_icons/NewCalenderSideBar.png";
import NotesImage from "../../../../assets/images/sidebar_icons/NewNotesSideBar.png";
import TaskImage from "../../../../assets/images/sidebar_icons/NewTaskSideBar.png";
import styles from "./ExpandMenu.module.css";
import {
  checkFeatureIDAvailability,
  SideBarGlobalNavigationFunction,
} from "../../../../commen/functions/utils";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../../store/actions/VideoMain_actions";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
} from "../../../../store/actions/VideoFeature_actions";
import { useMeetingContext } from "../../../../context/MeetingContext";
import {
  searchNewUserMeeting,
  showEndMeetingModal,
} from "../../../../store/actions/NewMeetingActions";

const ExpandedMenu = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let userID = localStorage.getItem("userID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );
  const {
    editorRole,
    minutes,
    polls,
    actionsPage,
    viewAdvanceMeetingModal,
    setViewAdvanceMeetingModal,
    setCancelConfirmationModal,
    sceduleMeeting,
    setSceduleMeeting,
    setGoBackCancelModal,
  } = useMeetingContext();
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

  const endMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.endMeetingModal
  );

  //Groups Sidebar Click
  const handleMeetingSidebarGroups = () => {
    localStorage.setItem("navigateLocation", "groups");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarGroupsNoCall = () => {
    dispatch(showEndMeetingModal(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
    

    localStorage.setItem("navigateLocation", "groups");

    SideBarGlobalNavigationFunction(
      viewAdvanceMeetingModal,
      editorRole,
      minutes,
      actionsPage,
      polls,
      navigate,
      dispatch,
      setCancelConfirmationModal,
      setViewAdvanceMeetingModal,
      "/Diskus/groups",
      t,
      sceduleMeeting,
      setSceduleMeeting,
      setGoBackCancelModal
    );
  };

  //Polls Sidebar Click
  const handleMeetingSidebarPolls = () => {
    localStorage.setItem("navigateLocation", "polling");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarPollsNoCall = () => {
    dispatch(showEndMeetingModal(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
    
    localStorage.setItem("navigateLocation", "polling");

    SideBarGlobalNavigationFunction(
      viewAdvanceMeetingModal,
      editorRole,
      minutes,
      actionsPage,
      polls,
      navigate,
      dispatch,
      setCancelConfirmationModal,
      setViewAdvanceMeetingModal,
      "/Diskus/polling",
      t,
      sceduleMeeting,
      setSceduleMeeting,
      setGoBackCancelModal
    );
  };

  //Calendar Sidebar Click
  const handleMeetingSidebarCalendar = () => {
    localStorage.setItem("navigateLocation", "calendar");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarCalendarNoCall = () => {
    dispatch(showEndMeetingModal(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
    

    localStorage.setItem("navigateLocation", "calendar");

    SideBarGlobalNavigationFunction(
      viewAdvanceMeetingModal,
      editorRole,
      minutes,
      actionsPage,
      polls,
      navigate,
      dispatch,
      setCancelConfirmationModal,
      setViewAdvanceMeetingModal,
      "/Diskus/calendar",
      t,
      sceduleMeeting,
      setSceduleMeeting,
      setGoBackCancelModal
    );
  };

  // Todo Sidebar Click
  const handleMeetingSidebarTodo = () => {
    localStorage.setItem("navigateLocation", "todolist");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarTodoNoCall = async () => {
    dispatch(showEndMeetingModal(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
    
    localStorage.setItem("navigateLocation", "todolist");

    SideBarGlobalNavigationFunction(
      viewAdvanceMeetingModal,
      editorRole,
      minutes,
      actionsPage,
      polls,
      navigate,
      dispatch,
      setCancelConfirmationModal,
      setViewAdvanceMeetingModal,
      "/Diskus/todolist",
      t,
      sceduleMeeting,
      setSceduleMeeting,
      setGoBackCancelModal
    );
  };

  const handleMeetingSidebarNotes = () => {
    localStorage.setItem("navigateLocation", "Notes");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarNotesNoCall = async () => {
    dispatch(showEndMeetingModal(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(true));
    dispatch(normalizeVideoPanelFlag(false));
    
    localStorage.setItem("navigateLocation", "Notes");

    SideBarGlobalNavigationFunction(
      viewAdvanceMeetingModal,
      editorRole,
      minutes,
      actionsPage,
      polls,
      navigate,
      dispatch,
      setCancelConfirmationModal,
      setViewAdvanceMeetingModal,
      "/Diskus/Notes",
      t,
      sceduleMeeting,
      setSceduleMeeting,
      setGoBackCancelModal
    );
  };

  const handleSidebarClickForExpand = ({
    targetPath,
    navigateLocationKey,
    handleWithCall,
    handleNoCall,
  }) => {
    const activeCall = JSON.parse(localStorage.getItem("activeCall"));
    const isHost = JSON.parse(localStorage.getItem("isHost"));
    
    if (isMeeting) {
      
      if (location.pathname !== targetPath && !viewAdvanceMeetingModal) {
        
        navigate(targetPath);
        return "";
      }

      

      if (!isMeetingVideo) {
        
        // show Modal in which when anyone is not in the meeting Video
        dispatch(showEndMeetingModal(true));
      } else {
        
        if (
          (activeCall === false ||
            activeCall === undefined ||
            activeCall === null) &&
          isMeetingVideo
        ) {
          //this will open when activeCall is false and this come from Host side
          
          handleNoCall();
        } else {
          if (isMeetingVideo) {
            
            //this will open when activeCall is true and this come from participant side
            handleWithCall();
          }
        }
      }

      if (!isMeetingVideoHostCheck && !isHost && !isMeetingVideo) {
        
        localStorage.removeItem("navigateLocation");
      }

      localStorage.setItem("navigateLocation", navigateLocationKey);
      return true;
    }

    if (endMeetingModal) {
      
      
      return true;
    }

    const shouldRedirectToMeeting =
      (scheduleMeetingPageFlagReducer ||
        viewProposeDateMeetingPageFlagReducer ||
        viewAdvanceMeetingPublishPageFlagReducer ||
        viewAdvanceMeetingUnpublishPageFlagReducer ||
        viewProposeOrganizerMeetingPageFlagReducer ||
        proposeNewMeetingPageFlagReducer) &&
      !viewMeetingFlagReducer;

    if (shouldRedirectToMeeting) {
      
      navigate("/Diskus/Meeting");
    } else {
      
      navigate(targetPath);
    }

    return false;
  };

  return (
    <Nav className={styles.iconGrid}>
      {/* Calendar Menu */}
      {checkFeatureIDAvailability(7) ? (
        <Nav.Link
          as={Link}
          to={"/Diskus/calendar"}
          eventKey="link-5"
          className={
            location.pathname === "/Diskus/calendar" ||
            location.pathname === "/Diskus/calendar"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={(e) => {
            // Prevent default behavior
            e.preventDefault();
            const handled = handleSidebarClickForExpand({
              targetPath: "/Diskus/calendar",
              navigateLocationKey: "calendar",
              handleWithCall: handleMeetingSidebarCalendar,
              handleNoCall: handleMeetingSidebarCalendarNoCall,
            });

            if (handled) return;
          }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            draggable="false"
          >
            <img src={CalenderImage} alt="CalenderImage" />
            <p>{t("Calendar")}</p>
          </div>
        </Nav.Link>
      ) : null}

      {/* Groups */}
      {checkFeatureIDAvailability(17) ? (
        <Nav.Link
          as={Link}
          to={"/Diskus/groups"}
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/Diskus/groups" ||
            location.pathname === "/Diskus/groups"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={(e) => {
            // Prevent default behavior
            e.preventDefault();
            const handled = handleSidebarClickForExpand({
              targetPath: "/Diskus/groups",
              navigateLocationKey: "groups",
              handleWithCall: handleMeetingSidebarGroups,
              handleNoCall: handleMeetingSidebarGroupsNoCall,
            });

            if (handled) return;
          }}
        >
          {/* Grouo Icon */}
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            draggable="false"
          >
            <img src={GroupImage} alt="" />

            <p>{t("Groups")}</p>
          </div>
        </Nav.Link>
      ) : null}

      {/* Todo Menu */}
      {checkFeatureIDAvailability(14) ? (
        <Nav.Link
          as={Link}
          to={"/Diskus/todolist"}
          eventKey="link-3"
          className={
            location.pathname === "/Diskus/todolist" ||
            location.pathname === "/Diskus/todolist"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={(e) => {
            // Prevent default behavior
            e.preventDefault();
            const handled = handleSidebarClickForExpand({
              targetPath: "/Diskus/todolist",
              navigateLocationKey: "todolist",
              handleWithCall: handleMeetingSidebarTodo,
              handleNoCall: handleMeetingSidebarTodoNoCall,
            });

            if (handled) return;
          }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            draggable="false"
          >
            <img src={TaskImage} alt="TaskImage" />
            <p>{t("Tasks")}</p>
          </div>
        </Nav.Link>
      ) : null}

      {/* Note*/}
      {checkFeatureIDAvailability(6) ? (
        <Nav.Link
          as={Link}
          disabled={false}
          to={"/Diskus/Notes"}
          eventKey="link-4"
          className={
            location.pathname === "/Diskus/Notes" ||
            location.pathname === "/Diskus/Notes"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={(e) => {
            // Prevent default behavior
            e.preventDefault();
            const handled = handleSidebarClickForExpand({
              targetPath: "/Diskus/Notes",
              navigateLocationKey: "Notes",
              handleWithCall: handleMeetingSidebarNotes,
              handleNoCall: handleMeetingSidebarNotesNoCall,
            });

            if (handled) return;
          }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            draggable="false"
          >
            <img src={NotesImage} alt="NotesImage" />
            <p>{t("Notes")}</p>
          </div>
        </Nav.Link>
      ) : null}

      {/* Polls */}
      {checkFeatureIDAvailability(15) ? (
        <Nav.Link
          as={Link}
          to={"/Diskus/polling"}
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/Diskus/polling" ||
            location.pathname === "/Diskus/polling"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={(e) => {
            // Prevent default behavior
            e.preventDefault();
            const handled = handleSidebarClickForExpand({
              targetPath: "/Diskus/polling",
              navigateLocationKey: "polling",
              handleWithCall: handleMeetingSidebarPolls,
              handleNoCall: handleMeetingSidebarPollsNoCall,
            });

            if (handled) return;
          }}
        >
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            draggable="false"
          >
            <img src={PollImage} alt="" />
            <p>{t("Polls")}</p>
          </div>
        </Nav.Link>
      ) : null}
    </Nav>
  );
};

export default ExpandedMenu;
