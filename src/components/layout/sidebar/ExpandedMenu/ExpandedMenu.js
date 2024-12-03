import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ExpandedMenu.css";
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import DataroomImage from "../../../../assets/images/sidebar_icons/Dataroom.png";
import GroupImage from "../../../../assets/images/sidebar_icons/Group.png";
import CommitteeImage from "../../../../assets/images/sidebar_icons/Committee.png";
import PollImage from "../../../../assets/images/sidebar_icons/Polls.png";
import ResolutionImage from "../../../../assets/images/sidebar_icons/Resolution.png";
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

  return (
    <Nav className={styles.iconGrid}>
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
              ? "/DisKus/Meeting"
              : "/DisKus/dataroom"
          }
          draggable="false"
          className={
            location.pathname === "/DisKus/dataroom" ||
            location.pathname === "/Diskus/dataroom"
              ? styles.iconItem_active
              : styles.iconItem
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarDataroom
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarDataroom(); // Your custom click handler
                }
          }
        >
          <img src={DataroomImage} alt="DataroomIcon" />
          <p>{t("Data-room")}</p>
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
              ? styles.iconItem_active
              : styles.iconItem
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
          <img src={GroupImage} alt="" />

          <p>{t("Groups")}</p>
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
              ? "/DisKus/Meeting"
              : "/DisKus/committee"
          }
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/DisKus/committee" ||
            location.pathname === "/Diskus/committee"
              ? styles.iconItem_active
              : styles.iconItem
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarCommittees
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarCommittees(); // Your custom click handler
                }
          }
        >
          {/* CommitteeIcon */}

          <img src={CommitteeImage} alt="" />
          <p>{t("Committees")}</p>
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
              ? "/DisKus/Meeting"
              : "/DisKus/resolution"
          }
          disabled={false}
          draggable="false"
          className={
            location.pathname === "/DisKus/resolution" ||
            location.pathname === "/Diskus/resolution"
              ? styles.iconItem_active
              : styles.iconItem
          }
          onClick={
            ActiveCallFlag === false
              ? handleMeetingSidebarResolutions
              : (event) => {
                  event.preventDefault(); // Prevents default navigation
                  handleMeetingSidebarResolutions(); // Your custom click handler
                }
          }
        >
          {/* Resolution Icon */}
          <img src={ResolutionImage} alt="" />
          <p>{t("Resolutions")}</p>
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
              ? styles.iconItem_active
              : styles.iconItem
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
          <img src={PollImage} alt="" />

          <p>{t("Polls")}</p>
        </Nav.Link>
      ) : null}
    </Nav>
  );
};

export default ExpandedMenu;
