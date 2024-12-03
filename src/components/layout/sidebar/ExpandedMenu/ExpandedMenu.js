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
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../../store/actions/VideoMain_actions";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
} from "../../../../store/actions/VideoFeature_actions";

const ExpandedMenu = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let ActiveCallFlag = localStorage.getItem("activeCall");
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

  //Groups Sidebar Click
  const handleMeetingSidebarGroups = () => {
    localStorage.setItem("navigateLocation", "groups");
    navigate("/Diskus/groups");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  //Polls Sidebar Click
  const handleMeetingSidebarPolls = () => {
    localStorage.setItem("navigateLocation", "polling");
    navigate("/Diskus/polling");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  //Calendar Sidebar Click
  const handleMeetingSidebarCalendar = () => {
    localStorage.setItem("navigateLocation", "calendar");
    navigate("/Diskus/calendar");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  // Todo Sidebar Click
  const handleMeetingSidebarTodo = () => {
    localStorage.setItem("navigateLocation", "todolist");
    navigate("/Diskus/todolist");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const handleMeetingSidebarNotes = () => {
    localStorage.setItem("navigateLocation", "Notes");
    navigate("/Diskus/Notes");
    if (CurrentMeetingStatus === 10) {
      dispatch(LeaveInitmationMessegeVideoMeetAction(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  return (
    <Nav className={styles.iconGrid}>
      {/* Calendar Menu */}
      {checkFeatureIDAvailability(7) ? (
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
              ? "/DisKus/Meeting"
              : "/DisKus/calendar"
          }
          eventKey="link-5"
          className={
            location.pathname === "/DisKus/calendar" ||
            location.pathname === "/Diskus/calendar"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarCalendar
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarCalendar(); // Your custom click handler
                }
          }
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
          to={
            (scheduleMeetingsPageFlag === true ||
              viewProposeDateMeetingsPageFlag === true ||
              viewAdvanceMeetingsPublishPageFlag === true ||
              viewAdvanceMeetingsUnpublishPageFlag === true ||
              viewProposeOrganizerMeetingsPageFlag === true ||
              proposeNewMeetingsPageFlag === true) &&
            viewMeetingsFlag === false
              ? "/DisKus/Meeting"
              : "/DisKus/groups"
          }
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/DisKus/groups" ||
            location.pathname === "/Diskus/groups"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarGroups
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarGroups(); // Your custom click handler
                }
          }
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
          to={
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
              ? "/DisKus/Meeting"
              : "/DisKus/todolist"
          }
          eventKey="link-3"
          className={
            location.pathname === "/DisKus/todolist" ||
            location.pathname === "/Diskus/todolist"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarTodo
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarTodo(); // Your custom click handler
                }
          }
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
          to={
            (scheduleMeetingPageFlagReducer === true ||
              viewProposeDateMeetingPageFlagReducer === true ||
              viewAdvanceMeetingPublishPageFlagReducer === true ||
              viewAdvanceMeetingUnpublishPageFlagReducer === true ||
              viewProposeOrganizerMeetingPageFlagReducer === true ||
              proposeNewMeetingPageFlagReducer === true) &&
            viewMeetingFlagReducer === false
              ? "/DisKus/Meeting"
              : "/DisKus/Notes"
          }
          eventKey="link-4"
          className={
            location.pathname === "/DisKus/Notes" ||
            location.pathname === "/Diskus/Notes"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarNotes
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarNotes(); // Your custom click handler
                }
          }
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
          to={
            (scheduleMeetingsPageFlag === true ||
              viewProposeDateMeetingsPageFlag === true ||
              viewAdvanceMeetingsPublishPageFlag === true ||
              viewAdvanceMeetingsUnpublishPageFlag === true ||
              viewProposeOrganizerMeetingsPageFlag === true ||
              proposeNewMeetingsPageFlag === true) &&
            viewMeetingsFlag === false
              ? "/DisKus/Meeting"
              : "/DisKus/polling"
          }
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/DisKus/polling" ||
            location.pathname === "/Diskus/polling"
              ? styles.iconItem_activeExpandedMenu
              : styles.iconItemExpandedMenu
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarPolls
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarPolls(); // Your custom click handler
                }
          }
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
