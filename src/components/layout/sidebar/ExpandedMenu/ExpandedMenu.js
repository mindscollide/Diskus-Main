import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ExpandedMenu.css";
import { Row, Col, Nav, Container, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tooltip from "../../../elements/tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { getDocumentsAndFolderApi } from "../../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import DataroomImage from "../../../../assets/images/sidebar_icons/Dataroom.png";
import GroupImage from "../../../../assets/images/sidebar_icons/Group.png";
import CommitteeImage from "../../../../assets/images/sidebar_icons/Committee.png";
import PollImage from "../../../../assets/images/sidebar_icons/Polls.png";
import ResolutionImage from "../../../../assets/images/sidebar_icons/Resolution.png";
import styles from "./ExpandMenu.module.css";
import {
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
} from "../../../../store/actions/Groups_actions";
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
  LeaveCurrentMeeting,
  currentMeetingStatus,
} from "../../../../store/actions/NewMeetingActions";
import {
  createCommitteePageFlag,
  updateCommitteePageFlag,
  viewCommitteePageFlag,
} from "../../../../store/actions/Committee_actions";
import {
  resultResolutionFlag,
  voteResolutionFlag,
  viewAttachmentFlag,
  createResolutionModal,
  viewResolutionModal,
} from "../../../../store/actions/Resolution_actions";
import { getCurrentDateTimeUTC } from "../../../../commen/functions/date_formater";
import { checkFeatureIDAvailability } from "../../../../commen/functions/utils";

const ExpandedMenu = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [dataroomNavigation, setDataroomNavigation] = useState("dataroom");
  const [groupNavigation, setGroupNavigation] = useState("groups");
  const [committeeNavigation, setCommitteeNavigation] = useState("committee");
  const [resolutionNavigation, setResolutionNavigation] =
    useState("resolution");
  const [pollNavigation, setPollNavigation] = useState("polling");

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));

  const CurrentMeetingStatus = useSelector(
    (state) => state.NewMeetingreducer.currentMeetingStatus
  );

  //Dataroom Sidebar Click
  const handleMeetingSidebarDataroom = () => {
    if (
      (NewMeetingreducer.scheduleMeetingPageFlag === true ||
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
        NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
      NewMeetingreducer.viewMeetingFlag === false
    ) {
      setDataroomNavigation("Meeting");
      dispatch(showCancelModalmeetingDeitals(true));
      dispatch(uploadGlobalFlag(false));
      localStorage.setItem("navigateLocation", "dataroom");
    } else {
      setDataroomNavigation("dataroom");
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
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
    // navigate(`/${dataroomNavigation}`);
  };

  //Groups Sidebar Click
  const handleMeetingSidebarGroups = () => {
    if (
      (NewMeetingreducer.scheduleMeetingPageFlag === true ||
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
        NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
      NewMeetingreducer.viewMeetingFlag === false
    ) {
      setGroupNavigation("Meeting");
      dispatch(showCancelModalmeetingDeitals(true));
      dispatch(uploadGlobalFlag(false));
      localStorage.setItem("navigateLocation", "groups");
    } else {
      setGroupNavigation("groups");
      dispatch(createGroupPageFlag(false));
      dispatch(updateGroupPageFlag(false));
      dispatch(viewGroupPageFlag(false));
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
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
    // navigate(`/${groupNavigation}`);
  };

  //Committees Sidebar Click
  const handleMeetingSidebarCommittees = () => {
    if (
      (NewMeetingreducer.scheduleMeetingPageFlag === true ||
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
        NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
      NewMeetingreducer.viewMeetingFlag === false
    ) {
      setCommitteeNavigation("Meeting");
      dispatch(showCancelModalmeetingDeitals(true));
      dispatch(uploadGlobalFlag(false));
      localStorage.setItem("navigateLocation", "committee");
    } else {
      setCommitteeNavigation("committee");
      dispatch(createCommitteePageFlag(false));
      dispatch(updateCommitteePageFlag(false));
      dispatch(viewCommitteePageFlag(false));
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
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
    // navigate(`/${committeeNavigation}`);
  };

  //Resolutions Sidebar Click
  const handleMeetingSidebarResolutions = () => {
    if (
      (NewMeetingreducer.scheduleMeetingPageFlag === true ||
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
        NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
      NewMeetingreducer.viewMeetingFlag === false
    ) {
      setResolutionNavigation("Meeting");
      dispatch(showCancelModalmeetingDeitals(true));
      dispatch(uploadGlobalFlag(false));
      localStorage.setItem("navigateLocation", "resolution");
    } else {
      setResolutionNavigation("resolution");
      dispatch(resultResolutionFlag(false));
      dispatch(voteResolutionFlag(false));
      dispatch(viewAttachmentFlag(false));
      dispatch(createResolutionModal(false));
      dispatch(viewResolutionModal(false));
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
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
    // navigate(`/${resolutionNavigation}`);
  };

  //Polls Sidebar Click
  const handleMeetingSidebarPolls = () => {
    if (
      (NewMeetingreducer.scheduleMeetingPageFlag === true ||
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
        NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
      NewMeetingreducer.viewMeetingFlag === false
    ) {
      setPollNavigation("Meeting");
      dispatch(showCancelModalmeetingDeitals(true));
      dispatch(uploadGlobalFlag(false));
      localStorage.setItem("navigateLocation", "polling");
    } else {
      setPollNavigation("polling");
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
        dispatch(LeaveCurrentMeeting(navigate, t, Data));
        dispatch(currentMeetingStatus(0));
      }
    }
    // navigate(`/${pollNavigation}`);
  };

  return (
    <Nav className={styles.iconGrid}>
      {checkFeatureIDAvailability(13) ? (
        <Nav.Link
          as={Link}
          to={
            (NewMeetingreducer.scheduleMeetingPageFlag === true ||
              NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
              NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
              NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
            NewMeetingreducer.viewMeetingFlag === false
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
          onClick={handleMeetingSidebarDataroom}
        >
          <img src={DataroomImage} alt="DataroomIcon" />
          <p>{t("Data-room")}</p>
        </Nav.Link>
      ) : null}

      {/* Groups */}
      {checkFeatureIDAvailability(17) ? (
        <Nav.Link
          as={Link}
          // to="groups"
          to={
            (NewMeetingreducer.scheduleMeetingPageFlag === true ||
              NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
              NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
              NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
            NewMeetingreducer.viewMeetingFlag === false
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
          onClick={handleMeetingSidebarGroups}
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
          // to="committee"
          to={
            (NewMeetingreducer.scheduleMeetingPageFlag === true ||
              NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
              NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
              NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
            NewMeetingreducer.viewMeetingFlag === false
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
          onClick={handleMeetingSidebarCommittees}
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
          // to="resolution"
          to={
            (NewMeetingreducer.scheduleMeetingPageFlag === true ||
              NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
              NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
              NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
            NewMeetingreducer.viewMeetingFlag === false
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
          onClick={handleMeetingSidebarResolutions}
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
          // to="polling"
          to={
            (NewMeetingreducer.scheduleMeetingPageFlag === true ||
              NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ||
              NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ||
              NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ||
              NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
            NewMeetingreducer.viewMeetingFlag === false
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
          onClick={handleMeetingSidebarPolls}
        >
          <img src={PollImage} alt="" />

          <p>{t("Polls")}</p>
        </Nav.Link>
      ) : null}
    </Nav>
  );
};

export default ExpandedMenu;
