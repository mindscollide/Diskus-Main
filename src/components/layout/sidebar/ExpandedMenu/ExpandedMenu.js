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

  // //Dataroom Sidebar Click
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

  // //Groups Sidebar Click
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

  // //Committees Sidebar Click
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

  // //Resolutions Sidebar Click
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

  // //Polls Sidebar Click
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
    <section>
      <Row className="m-2">
        <Col
          lg={4}
          md={4}
          sm={4}
          className="p-0  d-flex  justify-content-between"
        >
          {/* DataRoom */}
          {checkFeatureIDAvailability(2) ||
          checkFeatureIDAvailability(13) ||
          checkFeatureIDAvailability(19) ||
          checkFeatureIDAvailability(20) ||
          checkFeatureIDAvailability(21) ? (
            <Nav.Link
              as={Link}
              to={
                (NewMeetingreducer.scheduleMeetingPageFlag === true ||
                  NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
                  NewMeetingreducer.viewAdvanceMeetingPublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewProposeOrganizerMeetingPageFlag ===
                    true ||
                  NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
                NewMeetingreducer.viewMeetingFlag === false
                  ? "/DisKus/Meeting"
                  : "/DisKus/dataroom"
              }
              draggable="false"
              eventKey="link-5"
              className={
                location.pathname === "/DisKus/dataroom" ||
                location.pathname === "/Diskus/dataroom"
                  ? " m-0 p-0 icon-active-sidebar_expand"
                  : " m-0 p-0 icon_expand"
              }
              onClick={handleMeetingSidebarDataroom}
            >
              <div draggable="false">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33.519"
                  height="32.935"
                  viewBox="0 0 33.519 32.935"
                >
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="0.834"
                      y1="0.068"
                      x2="0.06"
                      y2="1.044"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="0.126" stopColor="#4dd0dd" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                    <linearGradient
                      id="linear-gradient-2"
                      x1="0.94"
                      y1="-0.335"
                      x2="-0.101"
                      y2="3.803"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                    <linearGradient
                      id="linear-gradient-3"
                      x1="2.792"
                      y1="-0.543"
                      x2="-1.346"
                      y2="3.009"
                    />
                    <linearGradient
                      id="linear-gradient-4"
                      x1="1.376"
                      y1="-0.37"
                      x2="-0.866"
                      y2="2.113"
                    />
                    <linearGradient
                      id="linear-gradient-5"
                      x1="1"
                      y1="-0.175"
                      x2="-0.115"
                      y2="3.846"
                    />
                    <linearGradient
                      id="linear-gradient-6"
                      x1="1.378"
                      y1="-0.281"
                      x2="-0.76"
                      y2="1.995"
                    />
                    <linearGradient
                      id="linear-gradient-7"
                      x1="2.113"
                      y1="-0.412"
                      x2="-0.115"
                      y2="2.055"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="0.04" stopColor="#4bdade" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                    <linearGradient
                      id="linear-gradient-8"
                      x1="1.475"
                      y1="-1.193"
                      x2="0"
                      y2="1.569"
                    />
                    <linearGradient
                      id="linear-gradient-9"
                      x1="0.5"
                      y1="1"
                      x2="0.5"
                      y2="0"
                    />
                    <linearGradient
                      id="linear-gradient-10"
                      x1="3.639"
                      y1="-4.505"
                      x2="-1.348"
                      y2="1.198"
                    />
                    <linearGradient
                      id="linear-gradient-11"
                      x1="5.88"
                      y1="-5.035"
                      x2="-0.221"
                      y2="1.172"
                    />
                    <linearGradient
                      id="linear-gradient-12"
                      x1="0.888"
                      y1="0.12"
                      x2="-0.153"
                      y2="1"
                    />
                  </defs>
                  <path
                    id="Path_1799"
                    data-name="Path 1799"
                    d="M1157.378,538.283a2.421,2.421,0,0,0,.4-1.324v-2.152a4.4,4.4,0,0,0-2.142-.545v2.7a.293.293,0,0,1-.292.292h-3.925a4.32,4.32,0,0,0-.253,1.471v.672h4.226a.49.49,0,0,1,.117.019.3.3,0,0,1,.175.273v5.522a.287.287,0,0,1-.292.292h-7.44v2.142h7.44a2.435,2.435,0,0,0,2.435-2.435v-5.522A2.384,2.384,0,0,0,1157.378,538.283Zm-25.426,6.924v-5.522a.293.293,0,0,1,.292-.292h17.947v-.672a5.262,5.262,0,0,1,.2-1.471h-18.2a.293.293,0,0,1-.292-.292v-5.522a.293.293,0,0,1,.292-.292h23.148a.293.293,0,0,1,.292.292v1.85a5.435,5.435,0,0,1,2.142.438v-2.288a2.415,2.415,0,0,0-.428-1.373,2.369,2.369,0,0,0,.428-1.373V523.17a2.435,2.435,0,0,0-2.435-2.435h-23.148a2.435,2.435,0,0,0-2.435,2.435v5.522a2.37,2.37,0,0,0,.428,1.373,2.415,2.415,0,0,0-.428,1.373v5.522a2.408,2.408,0,0,1,.049,2.727v5.522a2.435,2.435,0,0,0,2.435,2.435h14.734V545.5h-14.734A.287.287,0,0,1,1131.951,545.207Zm-.049-22.038a.287.287,0,0,1,.292-.292h23.148a.287.287,0,0,1,.292.292v5.522a.285.285,0,0,1-.292.282h-23.148a.285.285,0,0,1-.292-.282Z"
                    transform="translate(-1129.76 -520.735)"
                    fill="url(#linear-gradient)"
                  />
                  <g
                    id="Group_3027"
                    data-name="Group 3027"
                    transform="translate(5.092 4.304)"
                  >
                    <path
                      id="Path_1800"
                      data-name="Path 1800"
                      d="M1142.261,527.281a.63.63,0,0,1-.536-.691v-.728a.636.636,0,0,1,.525-.705h10.206a.639.639,0,0,1,.537.7v.713a.638.638,0,0,1-.535.705h0Z"
                      transform="translate(-1135.166 -525.155)"
                      fill="url(#linear-gradient-2)"
                    />
                    <rect
                      id="Rectangle_1310"
                      data-name="Rectangle 1310"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      transform="translate(3.074 0)"
                      fill="url(#linear-gradient-3)"
                    />
                    <rect
                      id="Rectangle_1311"
                      data-name="Rectangle 1311"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      transform="translate(0 0)"
                      fill="url(#linear-gradient-4)"
                    />
                  </g>
                  <g
                    id="Group_3028"
                    data-name="Group 3028"
                    transform="translate(5.092 12.397)"
                  >
                    <path
                      id="Path_1801"
                      data-name="Path 1801"
                      d="M1153,534.166v.331a5.079,5.079,0,0,0-1.237,1.091l-9.495.01a.624.624,0,0,1-.536-.691v-.73a.631.631,0,0,1,.516-.711h10.215A.648.648,0,0,1,1153,534.166Z"
                      transform="translate(-1135.166 -533.465)"
                      fill="url(#linear-gradient-5)"
                    />
                    <rect
                      id="Rectangle_1312"
                      data-name="Rectangle 1312"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      transform="translate(3.074 0.003)"
                      fill="url(#linear-gradient-6)"
                    />
                    <rect
                      id="Rectangle_1313"
                      data-name="Rectangle 1313"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      transform="translate(0 0.003)"
                      fill="url(#linear-gradient-7)"
                    />
                  </g>
                  <g
                    id="Group_3029"
                    data-name="Group 3029"
                    transform="translate(5.092 20.65)"
                  >
                    <path
                      id="Path_1802"
                      data-name="Path 1802"
                      d="M1142.266,541.945h5.21a3.031,3.031,0,0,0-.185,1.032v1.091h-5.025a.624.624,0,0,1-.536-.691v-.73a.621.621,0,0,1,.516-.7Z"
                      transform="translate(-1135.166 -541.94)"
                      fill="url(#linear-gradient-8)"
                    />
                    <path
                      id="Path_1803"
                      data-name="Path 1803"
                      d="M1153.173,542.646v.711a.635.635,0,0,1-.536.7h-4.2v-1.081a1.956,1.956,0,0,1,.282-1.032h3.915A.635.635,0,0,1,1153.173,542.646Z"
                      transform="translate(-1135.342 -541.94)"
                      fill="url(#linear-gradient-9)"
                    />
                    <rect
                      id="Rectangle_1314"
                      data-name="Rectangle 1314"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      transform="translate(3.074)"
                      fill="url(#linear-gradient-10)"
                    />
                    <rect
                      id="Rectangle_1315"
                      data-name="Rectangle 1315"
                      width="2.126"
                      height="2.126"
                      rx="1.063"
                      fill="url(#linear-gradient-11)"
                    />
                  </g>
                  <rect
                    id="Rectangle_1316"
                    data-name="Rectangle 1316"
                    width="5.652"
                    height="4.084"
                    transform="translate(22.996 15.669)"
                    fill="#fff"
                  />
                  <rect
                    id="Rectangle_1317"
                    data-name="Rectangle 1317"
                    width="11.69"
                    height="9.796"
                    transform="translate(19.976 21.381)"
                    fill="#fff"
                  />
                  <g
                    id="Group_3030"
                    data-name="Group 3030"
                    transform="translate(18.191 13.526)"
                  >
                    <path
                      id="Path_1804"
                      data-name="Path 1804"
                      d="M1161.733,540.75h-1.149v-1.665a4.464,4.464,0,0,0-2.318-3.915,4.4,4.4,0,0,0-2.142-.545,4.461,4.461,0,0,0-4.217,2.99,4.32,4.32,0,0,0-.253,1.471v1.665h-1.178a2.017,2.017,0,0,0-1.753,1,1.956,1.956,0,0,0-.282,1.032V552a2.034,2.034,0,0,0,2.035,2.035h11.257a2.041,2.041,0,0,0,2.035-2.035v-9.212A2.034,2.034,0,0,0,1161.733,540.75Zm-3.564-2.756a2.293,2.293,0,0,1,.273,1.091v1.665H1153.8v-1.665a2.336,2.336,0,0,1,2.328-2.318A2.338,2.338,0,0,1,1158.169,537.995Zm3.457,13.9h-11.043v-9h11.043Z"
                      transform="translate(-1148.44 -534.625)"
                      fill="url(#linear-gradient-12)"
                    />
                    <path
                      id="Path_1805"
                      data-name="Path 1805"
                      d="M1150.64,542.95v9h11.043v-9Zm10.069,8.024h-9.1v-7.05h9.1Zm-2.211-10.167v-1.665a2.293,2.293,0,0,0-.273-1.091,2.338,2.338,0,0,0-2.045-1.227,2.336,2.336,0,0,0-2.328,2.318v1.665Zm-3.671-.974v-.691a1.349,1.349,0,0,1,2.7,0v.691Zm-4.187,3.116v9h11.043v-9Zm10.069,8.024h-9.1v-7.05h9.1Zm-2.483-12.923a2.338,2.338,0,0,0-2.045-1.227,2.336,2.336,0,0,0-2.328,2.318v1.665h4.645v-1.665A2.293,2.293,0,0,0,1158.226,538.052Zm-.7,1.782h-2.7v-.691a1.349,1.349,0,0,1,2.7,0Zm-6.885,3.116v9h11.043v-9Zm10.069,8.024h-9.1v-7.05h9.1Zm-2.211-10.167v-1.665a2.293,2.293,0,0,0-.273-1.091,2.338,2.338,0,0,0-2.045-1.227,2.336,2.336,0,0,0-2.328,2.318v1.665Zm-3.671-.974v-.691a1.349,1.349,0,0,1,2.7,0v.691Z"
                      transform="translate(-1148.498 -534.683)"
                      fill="#fff"
                    />
                  </g>
                </svg>

                <span
                  className={
                    location.pathname === "/DisKus/dataroom" ||
                    location.pathname === "/Diskus/dataroom"
                      ? "Meeting_Side_bar_Tag_active"
                      : "Meeting_Side_bar_Tag"
                  }
                >
                  {t("Data-room")}
                </span>
              </div>
            </Nav.Link>
          ) : null}
        </Col>
        <Col lg={4} md={4} sm={4} className="p-0">
          {/* Groups */}
          {checkFeatureIDAvailability(17) ? (
            <Nav.Link
              as={Link}
              // to="groups"
              to={
                (NewMeetingreducer.scheduleMeetingPageFlag === true ||
                  NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
                  NewMeetingreducer.viewAdvanceMeetingPublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewProposeOrganizerMeetingPageFlag ===
                    true ||
                  NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
                NewMeetingreducer.viewMeetingFlag === false
                  ? "/DisKus/Meeting"
                  : "/DisKus/groups"
              }
              disabled={false}
              draggable="false"
              eventKey="link-5"
              className={
                location.pathname === "/DisKus/groups" ||
                location.pathname === "/Diskus/groups"
                  ? "m-0 p-0 icon-active-sidebar_expand"
                  : "m-0 p-0 icon_expand"
              }
              onClick={handleMeetingSidebarGroups}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33.52"
                height="30.16"
                viewBox="0 0 34.562 31.032"
              >
                <title className="sidebar-tool">Groups</title>
                <path
                  id="Path_635"
                  data-name="Path 635"
                  d="M40.76,51.025a2.654,2.654,0,0,0,1.964-.769,2.6,2.6,0,0,0,.677-1.929c-.025-.474-.016-.957-.016-1.463v-.311c.528,0,1.056,0,1.584-.008.545,0,1.089-.008,1.634-.008.858,0,1.568.008,2.22.016H48.9a2.53,2.53,0,0,0,2.567-1.7l.107-.065V35.256l-.016-.049c-.041-.147-.074-.294-.116-.45a7.4,7.4,0,0,0-.314-1.063,6.014,6.014,0,0,0-3.928-3.54A1.09,1.09,0,0,0,47.313,30a6.031,6.031,0,0,0,1.238-3.352.927.927,0,0,0-.833-1.071h-.083a.931.931,0,0,0-.908.94,4.3,4.3,0,0,1-2.088,3.491,4.438,4.438,0,0,1-2.344.7,4.628,4.628,0,0,1-1.849-.4.376.376,0,0,1-.074-.123,6.263,6.263,0,0,0-2.41-4.357.258.258,0,0,1-.124-.311,4.452,4.452,0,0,1,4.333-3.671c.132,0,.264.008.4.016a4.391,4.391,0,0,1,3.837,2.78.029.029,0,0,0,.008.016.291.291,0,0,0,.033.074.939.939,0,0,0,1.271.621.93.93,0,0,0,.437-1.333,6.331,6.331,0,0,0-5.975-4.014c-.165,0-.338.008-.5.016a6.137,6.137,0,0,0-3.532,1.488,6.3,6.3,0,0,0-2.022,3.295v.008c-.008,0-.008,0-.016-.008a6.24,6.24,0,0,0-2.022-.335,6.439,6.439,0,0,0-2.047.343,6.33,6.33,0,0,0-8.36-4.406.924.924,0,0,0-.619,1.145.893.893,0,0,0,.867.629,1.025,1.025,0,0,0,.347-.057,5.185,5.185,0,0,1,1.65-.294A4.123,4.123,0,0,1,27.061,22a4.327,4.327,0,0,1,3.252,3.622.242.242,0,0,1-.058.123,6.508,6.508,0,0,0-2.492,4.48.33.33,0,0,1-.083.1,4.276,4.276,0,0,1-1.774.384,4.481,4.481,0,0,1-4.382-3.572,4.258,4.258,0,0,1,1.213-3.981l.033-.033a1.475,1.475,0,0,0,.148-.164.89.89,0,0,0-.066-1.283.9.9,0,0,0-1.3.082c-.074.082-.149.172-.223.253a7.162,7.162,0,0,0-.949,1.251,6.092,6.092,0,0,0,.669,7.014,7.624,7.624,0,0,0-1.015.482,5.806,5.806,0,0,0-3.012,5.158c-.025,2.011-.016,4.047-.008,6.025,0,.711,0,1.431.008,2.142a2.4,2.4,0,0,0,2.525,2.485H25.2v1.962a2.435,2.435,0,0,0,2.542,2.51h5.315c.759,0,1.519,0,2.278-.008s1.519-.008,2.269-.008c1.2,0,2.2.008,3.119.025C40.727,51.025,40.744,51.025,40.76,51.025ZM41.4,36.351a.938.938,0,0,0-.536.18.9.9,0,0,0-.2,1.3,2.59,2.59,0,0,0,.148.221c.05.074.1.139.14.213a3.406,3.406,0,0,1,.569,1.758c.025,2.9.025,5.829.025,8.576a.548.548,0,0,1-.627.6H27.68a.553.553,0,0,1-.627-.6c0-.589,0-1.169-.008-1.758-.008-2.175-.016-4.415.025-6.622a4.143,4.143,0,0,1,3.227-3.9H30.3a2.561,2.561,0,0,1,.569-.09.732.732,0,0,1,.355.082A6.417,6.417,0,0,0,34.067,37a6.74,6.74,0,0,0,2.872-.679,1.311,1.311,0,0,1,.553-.1h.049a4.1,4.1,0,0,1,1.849.523,1.052,1.052,0,0,0,.5.131.887.887,0,0,0,.792-.474.872.872,0,0,0,.066-.687,1,1,0,0,0-.545-.589c-.33-.155-.66-.3-1-.425q-.124-.049-.173-.074a1.288,1.288,0,0,1,.091-.131,6.427,6.427,0,0,0,1.015-2.011c.041-.147.074-.229.091-.278.091.016.223.049.281.065a6.375,6.375,0,0,0,1.807.27,5.8,5.8,0,0,0,2.525-.58,1.994,1.994,0,0,1,.883-.2,3.028,3.028,0,0,1,.677.09A4.207,4.207,0,0,1,49.739,36.1c.008,2.036.008,4.1,0,6.1v1.766c0,.6-.165.76-.768.76H43.393v-1.2c.008-1.006.008-2.036-.016-3.057a6.436,6.436,0,0,0-.289-1.848,8.529,8.529,0,0,0-.792-1.6l-.091-.155A.919.919,0,0,0,41.4,36.351ZM19.658,44.714c-.668,0-.817-.147-.817-.809V36.179a5.434,5.434,0,0,1,.066-.932,4.229,4.229,0,0,1,3.573-3.466,1.631,1.631,0,0,1,.19-.016.925.925,0,0,1,.429.106,6,6,0,0,0,2.748.654h.058a6.485,6.485,0,0,0,2.005-.335,6.235,6.235,0,0,0,1.3,2.559,6,6,0,0,0-4.035,5.78v4.194Zm14.409-18.4A4.588,4.588,0,0,1,37.3,27.661,4.216,4.216,0,0,1,38.548,30.7a4.491,4.491,0,0,1-4.531,4.464h-.066a4.427,4.427,0,0,1,.074-8.854Z"
                  transform="translate(-17.009 -20.009)"
                  fill="#fff"
                />
              </svg>
              <span
                className={
                  location.pathname === "/DisKus/groups" ||
                  location.pathname === "/Diskus/groups"
                    ? "Meeting_Side_bar_Tag_active"
                    : "Meeting_Side_bar_Tag"
                }
              >
                {t("Groups")}
              </span>
            </Nav.Link>
          ) : null}
        </Col>
        <Col lg={4} md={4} sm={4} className="p-0">
          {/* Committee */}
          {checkFeatureIDAvailability(17) ? (
            <Nav.Link
              as={Link}
              // to="committee"
              to={
                (NewMeetingreducer.scheduleMeetingPageFlag === true ||
                  NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
                  NewMeetingreducer.viewAdvanceMeetingPublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewProposeOrganizerMeetingPageFlag ===
                    true ||
                  NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
                NewMeetingreducer.viewMeetingFlag === false
                  ? "/DisKus/Meeting"
                  : "/DisKus/committee"
              }
              disabled={false}
              draggable="false"
              eventKey="link-5"
              className={
                location.pathname === "/DisKus/committee" ||
                location.pathname === "/Diskus/committee"
                  ? "m-0 p-0  icon-active-sidebar_expand"
                  : "m-0 p-0 icon_expand"
              }
              onClick={handleMeetingSidebarCommittees}
            >
              <div draggable="false">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44.01"
                  height="24.99"
                  viewBox="0 0 43.97 24.96"
                >
                  <title className="tooltip">Committee</title>
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="0.78"
                      x2="0.081"
                      y2="1"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                  </defs>
                  <path
                    id="Path_1773"
                    data-name="Path 1773"
                    d="M1344.85,528.49a4.636,4.636,0,0,0,.91-2.76v-.36a4.7,4.7,0,1,0-9.39,0v.36a4.62,4.62,0,0,0,.9,2.75,6.741,6.741,0,0,0-1.1.36l-.19-1.32a2.9,2.9,0,0,0-2.87-2.48h-9.58a2.9,2.9,0,0,0-2.87,2.48l-.19,1.28a5.969,5.969,0,0,0-.93-.31,4.628,4.628,0,0,0,.9-2.76v-.36a4.695,4.695,0,1,0-9.39,0v.36a4.62,4.62,0,0,0,.9,2.75,7.278,7.278,0,0,0-5.54,7.08v2.72a1.4,1.4,0,0,0,1.4,1.41h11.07l-.38,2.63a2.9,2.9,0,0,0,2.87,3.31h13.9a2.888,2.888,0,0,0,2.86-3.31l-.38-2.63h11.22a1.408,1.408,0,0,0,1.41-1.41v-2.72A7.285,7.285,0,0,0,1344.85,528.49Zm-6.28-3.12a2.5,2.5,0,1,1,4.99,0v.36a2.5,2.5,0,0,1-4.99,0Zm-25.32,0a2.5,2.5,0,1,1,4.99,0v.36a2.5,2.5,0,0,1-4.99,0Zm-4.64,12.12v-1.93a5.1,5.1,0,0,1,5.09-5.1h4.06a3.936,3.936,0,0,1,.77.07,2.127,2.127,0,0,1,.35.06,1.765,1.765,0,0,1,.31.08,3.966,3.966,0,0,1,.45.15,4.586,4.586,0,0,1,.5.24c.1.05.2.11.3.17s.19.12.28.19a1.859,1.859,0,0,1,.28.21,2.816,2.816,0,0,1,.36.33,3.7,3.7,0,0,1,.33.36c.08.1.15.19.22.29s.13.19.19.29.12.2.17.3a2.707,2.707,0,0,1,.2.42c.05.12.1.24.14.37a4.146,4.146,0,0,1,.16.63,3.032,3.032,0,0,1,.06.42,4.4,4.4,0,0,1,.03.52v1.93h-14.25Zm27.35,5.15a.671.671,0,0,1-.17.55.653.653,0,0,1-.52.24h-13.9a.7.7,0,0,1-.53-.24.709.709,0,0,1-.16-.55l.43-2.95h2.55a1.406,1.406,0,0,0,1.4-1.41v-2.72a7.228,7.228,0,0,0-2.54-5.52l.32-2.2a.7.7,0,0,1,.69-.6h9.58a.7.7,0,0,1,.69.6l.33,2.29a7.31,7.31,0,0,0-2.41,5.43v2.72a1.406,1.406,0,0,0,1.4,1.41h2.41Zm12.22-5.15h-14.26v-1.93a5.155,5.155,0,0,1,2.58-4.43,5.048,5.048,0,0,1,2.52-.67h4.06a5.109,5.109,0,0,1,5.1,5.1Z"
                    transform="translate(-1306.41 -520.67)"
                    fill="url(#linear-gradient)"
                  />
                </svg>
                <span
                  className={
                    location.pathname === "/DisKus/committee" ||
                    location.pathname === "/Diskus/committee"
                      ? "Meeting_Side_bar_Tag_active"
                      : "Meeting_Side_bar_Tag"
                  }
                >
                  {t("Committees")}
                </span>
              </div>
            </Nav.Link>
          ) : null}
        </Col>
      </Row>

      <Row className="m-2">
        <Col lg={4} md={4} sm={4} className="p-0">
          {/* Resolution */}
          {checkFeatureIDAvailability(18) ? (
            <Nav.Link
              as={Link}
              // to="resolution"
              to={
                (NewMeetingreducer.scheduleMeetingPageFlag === true ||
                  NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
                  NewMeetingreducer.viewAdvanceMeetingPublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewProposeOrganizerMeetingPageFlag ===
                    true ||
                  NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
                NewMeetingreducer.viewMeetingFlag === false
                  ? "/DisKus/Meeting"
                  : "/DisKus/resolution"
              }
              disabled={false}
              draggable="false"
              eventKey="link-5"
              className={
                location.pathname === "/DisKus/resolution" ||
                location.pathname === "/Diskus/resolution"
                  ? "m-0 p-0 icon-active-sidebar_expand"
                  : "m-0 p-0 icon_expand"
              }
              onClick={handleMeetingSidebarResolutions}
            >
              <div draggable="false">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33.519"
                  height="34.066"
                  viewBox="0 0 33.519 34.066"
                >
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="1"
                      y1="0.032"
                      x2="0"
                      y2="0.956"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#4adede" />
                      <stop offset="1" stopColor="#6172d6" />
                    </linearGradient>
                  </defs>
                  <path
                    id="Path_1858"
                    data-name="Path 1858"
                    d="M-298.219,262.387a1.015,1.015,0,0,0,1.095.984c.14.006.29.008.472.008l.333,0,.326,0h12.114c.934,0,1.351-.414,1.353-1.34,0-.184,0-.368.005-.552.007-.507.014-1.03-.024-1.551a7.569,7.569,0,0,0-2.416-5.243,14.081,14.081,0,0,0-1.648-1.233l-.319-.216a5.02,5.02,0,0,0,1.565-3.156,5.116,5.116,0,0,0-1.194-3.844,5.1,5.1,0,0,0-3.873-1.774,5.033,5.033,0,0,0-3.24,1.179,4.889,4.889,0,0,0-1.8,3.354,4.918,4.918,0,0,0,1.612,4.277,7.854,7.854,0,0,0-3.977,4.512,10.473,10.473,0,0,0-.4,3.9C-298.228,261.925-298.222,262.156-298.219,262.387Zm4.246-6.505a5.554,5.554,0,0,1,3.546-1.272,5.738,5.738,0,0,1,2.7.683,5.864,5.864,0,0,1,2.977,5.829H-287.3v0h-4.32l-3.259,0h-1.2A5.874,5.874,0,0,1-293.972,255.882Zm3.563-9.7.009.405a2.955,2.955,0,0,1,2.9,2.885,2.829,2.829,0,0,1-.839,2.023,2.915,2.915,0,0,1-2.081.877,2.9,2.9,0,0,1-2.071-.839,2.866,2.866,0,0,1-.827-2.05,2.913,2.913,0,0,1,2.912-2.9v-.405Zm-25.618,15.872a1.121,1.121,0,0,0,1.275,1.252l6.448,0q3.365,0,6.73,0a1.1,1.1,0,0,0,1.229-1.189l0-.21c.011-.653.023-1.327-.017-2a7.617,7.617,0,0,0-2.855-5.679,12.374,12.374,0,0,0-1.367-.923l-.147-.09a5.112,5.112,0,0,0,1.608-3.331,5.1,5.1,0,0,0-1.365-3.874,5.02,5.02,0,0,0-3.689-1.594,5.178,5.178,0,0,0-3.484,1.356,5.193,5.193,0,0,0-1.612,3.916,5.067,5.067,0,0,0,1.622,3.544,7.833,7.833,0,0,0-3.969,4.53,10.59,10.59,0,0,0-.415,3.723C-316.029,261.677-316.027,261.865-316.027,262.053Zm7.765-9.681a2.894,2.894,0,0,1-2.069-.875,2.829,2.829,0,0,1-.822-2.036,2.939,2.939,0,0,1,2.933-2.874h.021a2.928,2.928,0,0,1,2.863,2.9A2.913,2.913,0,0,1-308.262,252.372Zm-3.485,3.508a5.565,5.565,0,0,1,3.543-1.263,5.632,5.632,0,0,1,2.736.708,5.8,5.8,0,0,1,2.923,5.79h-2.591v0H-313.8A5.689,5.689,0,0,1-311.747,255.88Zm12.431,7.915a7.3,7.3,0,0,0-5.2,2.172,7.289,7.289,0,0,0-2.142,5.2,7.376,7.376,0,0,0,7.376,7.317h.02a7.375,7.375,0,0,0,7.364-7.349A7.39,7.39,0,0,0-299.316,263.8Zm.028,1.814h0v.405a5.179,5.179,0,0,1,5.156,5.1,5.006,5.006,0,0,1-1.467,3.592,5.118,5.118,0,0,1-3.654,1.543h-.014a5.1,5.1,0,0,1-5.152-5.1,5.031,5.031,0,0,1,1.48-3.6,5.1,5.1,0,0,1,3.64-1.539Zm-14.6,4.37h6.317v2.2h-7.075c-.984,0-1.387-.391-1.389-1.349q-.006-2.679,0-5.357v-.411c0-.094.008-.18.016-.281,0-.047.009-.1.013-.158l.027-.377h2.092Zm31.368-5.225q0,3.011,0,6.021c0,1.011-.389,1.405-1.384,1.406h-7.094V270h6.307v-5.737h2.115l.024-.026c0,.053.008.1.012.156C-282.527,264.507-282.517,264.629-282.517,264.755Zm-20.425,6.591a1,1,0,0,1,.345-.715,1.192,1.192,0,0,1,.773-.311,1.1,1.1,0,0,1,.779.343c.276.274.524.564.787.872l.073.086.546-.545c.7-.7,1.37-1.366,2.026-2.029a1.241,1.241,0,0,1,.885-.419,1.135,1.135,0,0,1,.414.081,1.043,1.043,0,0,1,.628.763,1.1,1.1,0,0,1-.278,1c-1.053,1.084-2.19,2.223-3.476,3.48a.984.984,0,0,1-.695.3,1.123,1.123,0,0,1-.78-.345c-.7-.672-1.217-1.194-1.693-1.693A1.184,1.184,0,0,1-302.942,271.346Z"
                    transform="translate(316.034 -244.419)"
                    fill="url(#linear-gradient)"
                  />
                </svg>
                <span
                  className={
                    location.pathname === "/DisKus/resolution" ||
                    location.pathname === "/Diskus/resolution"
                      ? "Meeting_Side_bar_Tag_active"
                      : "Meeting_Side_bar_Tag"
                  }
                >
                  {t("Resolutions")}
                </span>
              </div>
            </Nav.Link>
          ) : null}
        </Col>
        <Col lg={4} md={4} sm={4} className="p-0">
          {/* Polls */}
          {checkFeatureIDAvailability(15) ? (
            <Nav.Link
              as={Link}
              // to="polling"
              to={
                (NewMeetingreducer.scheduleMeetingPageFlag === true ||
                  NewMeetingreducer.viewProposeDateMeetingPageFlag === true ||
                  NewMeetingreducer.viewAdvanceMeetingPublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag ===
                    true ||
                  NewMeetingreducer.viewProposeOrganizerMeetingPageFlag ===
                    true ||
                  NewMeetingreducer.proposeNewMeetingPageFlag === true) &&
                NewMeetingreducer.viewMeetingFlag === false
                  ? "/DisKus/Meeting"
                  : "/DisKus/polling"
              }
              disabled={false}
              draggable="false"
              eventKey="link-5"
              className={
                location.pathname === "/DisKus/polling" ||
                location.pathname === "/Diskus/polling"
                  ? "m-0 p-0  icon-active-sidebar_expand Meeting_Side_bar_Tag_active"
                  : "m-0 p-0 icon_expand"
              }
              onClick={handleMeetingSidebarPolls}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33.52"
                height="34.59"
                viewBox="0 0 33.519 34.59"
              >
                <defs>
                  <linearGradient
                    id="linear-gradient"
                    x1="1"
                    y1="0.029"
                    x2="0"
                    y2="1.024"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0" stopColor="#4adede" />
                    <stop offset="1" stopColor="#6172d6" />
                  </linearGradient>
                </defs>
                <path
                  id="Path_1796"
                  data-name="Path 1796"
                  d="M1413.718,529.38h.118a2.823,2.823,0,0,1,2.96,2.471l0,.09v29.505a2.817,2.817,0,0,1-2.978,2.524h-2.11c-.047,0-.095,0-.142,0h-.059a2.9,2.9,0,0,1-2.918-2.094l-.057-.06,0-.409-.011-29.483v-.017a2.8,2.8,0,0,1,2.957-2.527h2.135Zm.934,2.568c-.029-.245-.386-.519-.876-.539h-2.221c-.509.014-.874.3-.891.554l.011,29.417c.024.256.39.543.9.562h2.178c.512-.017.881-.305.9-.561Zm-26.175,6.629a2.823,2.823,0,0,1,2.96,2.471l0,.09v20.309a2.818,2.818,0,0,1-2.978,2.524h-2.193a2.824,2.824,0,0,1-2.977-2.515v-.045l-.011-20.289v-.016a2.8,2.8,0,0,1,2.957-2.527h2.135Zm.934,2.57c-.033-.26-.429-.542-.934-.542h-2.241c-.516,0-.912.29-.93.554l.011,20.221c.025.269.414.563.95.563h2.155c.544.016.967-.287.989-.561Zm11.687,6.627a2.822,2.822,0,0,1,2.956,2.446l.006.062V561.45a2.834,2.834,0,0,1-3.054,2.519h-2.117a2.819,2.819,0,0,1-2.976-2.518v-.041l-.012-11.091V550.3a2.791,2.791,0,0,1,2.957-2.53h2.135Zm.935,2.613,0-.028c-.015-.272-.444-.576-.985-.557h-2.189c-.517,0-.914.29-.93.552l.011,11.028c.023.267.428.561.95.561h2.193c.522,0,.927-.3.951-.564Z"
                  transform="translate(-1383.279 -529.38)"
                  fill="url(#linear-gradient)"
                />
              </svg>
              <Row>
                <Col lg={12} md={12} sm={12} className="pollsHeading">
                  <span
                    className={
                      location.pathname === "/DisKus/polling" ||
                      location.pathname === "/Diskus/polling"
                        ? "Meeting_Side_bar_Tag_active "
                        : "Meeting_Side_bar_Tag mt-1"
                    }
                  >
                    {t("Polls")}
                  </span>
                </Col>
              </Row>
            </Nav.Link>
          ) : null}
        </Col>
      </Row>
    </section>
  );
};

export default ExpandedMenu;
