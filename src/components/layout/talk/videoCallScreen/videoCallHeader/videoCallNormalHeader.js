import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./videoCallHeader.css";
import { Button } from "./../../../../elements";
import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";
import { Tooltip } from "antd";
import AddParticipant from "./../../talk-Video/video-images/Add Participant Purple.svg";
import ExpandIcon from "./../../talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../talk-Video/video-images/Minimize Purple.svg";
import NonActiveScreenShare from "./../../talk-Video/video-images/Screen Share Purple.svg";
import videoEndIcon from "./../../talk-Video/video-images/Call End White.svg";
import TileView from "./../../talk-Video/video-images/Tile View 1 Purple.svg";
import SidebarView from "./../../talk-Video/video-images/Tile View 3 Purple.svg";
import MicOn from "./../../talk-Video/video-images/Mic Enabled Purple.svg";
import VideoOn from "./../../talk-Video/video-images/Video Enabled Purple.svg";
import MicOff from "./../../talk-Video/video-images/Mic Disabled White.svg";
import VideoOff from "./../../talk-Video/video-images/Video Disabled White.svg";
import ChatIcon from "./../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../talk-Video/video-images/Collapse.svg";
import RaiseHand from "./../../talk-Video/video-images/Raise Hand Purple.svg";
import LowerHand from "./../../talk-Video/video-images/Raise Hand White.svg";
import CopyLink from "./../../talk-Video/video-images/Copy Link Purple.svg";
import CloseNotification from "../../../../../assets/images/Close-Notification.png";
import ActiveParticipantIcon from "./../../talk-Video/video-images/Users White.svg";
import ParticipantsIcon from "./../../talk-Video/video-images/Users Purple.svg";
import MenuRaiseHand from "./../../talk-Video/video-images/Menu-RaiseHand.png";
import Menu from "./../../talk-Video/video-images/Menu.png";
import { activeChat } from "../../../../../store/actions/Talk_action";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  chatEnableNormalFlag,
  leaveCallModal,
  participantPopup,
  videoChatMessagesFlag,
} from "../../../../../store/actions/VideoFeature_actions";
import { GetOTOUserMessages } from "../../../../../store/actions/Talk_action";
import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";
import { useTranslation } from "react-i18next";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";

const VideoCallNormalHeader = ({
  isScreenActive,
  screenShareButton,
  layoutCurrentChange,
  disableMic,
  disableVideo,
  isMicActive,
  isVideoActive,
  showTile,
}) => {
  const { videoFeatureReducer, VideoMainReducer, talkStateData } = useSelector(
    (state) => state
  );

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );

  let callerNameInitiate = localStorage.getItem("callerNameInitiate");
  let organizationName = localStorage.getItem("organizatioName");
  let currentUserName = localStorage.getItem("name");
  let callerName = localStorage.getItem("callerName");
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem("initiateVideoCall")
  );
  let recipentCalledID = Number(localStorage.getItem("recipentCalledID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let callerID = Number(localStorage.getItem("callerID"));
  let recipentID = Number(localStorage.getItem("recipentID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let initiateRoomID = localStorage.getItem("initiateCallRoomID");
  let callerObject = localStorage.getItem("callerStatusObject");
  let currentCallType = Number(localStorage.getItem("CallType"));
  let meetingTitle = localStorage.getItem("meetingTitle");
  let isCallerFlag = JSON.parse(localStorage.getItem("isCaller"));
  let userGUID = localStorage.getItem("userGUID");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  // Create a ref for the iframe element
  const iframeRef = useRef(null);

  const [showNotification, setShowNotification] = useState(true);

  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);

  const [isActiveIcon, setIsActiveIcon] = useState(false);

  const [currentParticipants, setCurrentParticipants] = useState([]);

  const [participantStatus, setParticipantStatus] = useState([]);

  const [handStatus, setHandStatus] = useState(false);

  const leaveModalPopupRef = useRef(null);

  useEffect(() => {
    if (meetingUrlData !== null && meetingUrlData !== undefined) {
      setMeetingURLLocalData(meetingUrlData);
    } else {
      setMeetingURLLocalData(null);
    }
  }, [meetingUrlData]);

  const otoMaximizeVideoPanel = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(normalizeVideoPanelFlag(false));
    }
    setShowNotification(true);
  };

  const minimizeVideoPanel = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
    localStorage.setItem("activeCall", false);
  };

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true));
  };

  const endCallParticipant = () => {
    if (isMeeting === false) {
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: roomID,
        IsCaller: false,
        CallTypeID: callTypeID,
      };
      dispatch(LeaveCall(Data, navigate, t));
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeetingVideo", false);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
    } else if (isMeeting === true) {
      let Data = {
        RoomID: roomID,
        UserGUID: userGUID,
      };
      dispatch(LeaveMeetingVideo(Data, navigate, t));
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("meetingTitle", "");
      localStorage.setItem("acceptedRecipientID", 0);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
    }
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const onClickCloseChatHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.VideoChatMessagesFlag === false) {
        if (callerID === currentUserID) {
          let activeChatData = {
            id: VideoMainReducer.VideoRecipentData.userID,
            fullName: VideoMainReducer.VideoRecipentData.userName,
            imgURL: "",
            messageBody: "",
            messageDate: "",
            notiCount: 0,
            messageType: "O",
            isOnline: false,
            companyName: organizationName,
            sentDate: "",
            receivedDate: "",
            seenDate: "",
            attachmentLocation: "",
            senderID: currentUserID,
            admin: 0,
            isBlock: 0,
          };
          dispatch(activeChat(activeChatData));
        } else if (callerID !== currentUserID) {
          let activeChatData = {
            id: callerID,
            fullName: callerNameInitiate,
            imgURL: "",
            messageBody: "",
            messageDate: "",
            notiCount: 0,
            messageType: "O",
            isOnline: false,
            companyName: organizationName,
            sentDate: "",
            receivedDate: "",
            seenDate: "",
            attachmentLocation: "",
            senderID: currentUserID,
            admin: 0,
            isBlock: 0,
          };
          dispatch(activeChat(activeChatData));
        }
        localStorage.setItem("ActiveChatType", "O");
        dispatch(chatEnableNormalFlag(true));
        setIsActiveIcon(true);
        let chatOTOData = {
          UserID: currentUserID,
          ChannelID: currentOrganization,
          OpponentUserId:
            callerID !== currentUserID ? callerID : recipentCalledID,
          NumberOfMessages: 50,
          OffsetMessage: 0,
        };
        dispatch(videoChatMessagesFlag(true));
        dispatch(GetOTOUserMessages(navigate, chatOTOData, t));
        localStorage.setItem("ActiveChatType", "O");
        localStorage.setItem(
          "activeOtoChatID",
          callerID !== currentUserID ? callerID : recipentCalledID
        );
      } else {
        dispatch(videoChatMessagesFlag(false));
      }
    }
  };

  const closeParticipantHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.ParticipantPopupFlag === false) {
        dispatch(participantPopup(true));
      } else {
        dispatch(participantPopup(false));
      }
    }
  };

  const normalizeScreen = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(normalizeVideoPanelFlag(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
    }
  };

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false));
  };

  const leaveCall = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    localStorage.setItem("isCaller", false);
    localStorage.setItem("isMeetingVideo", false);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    setParticipantStatus([]);
    localStorage.setItem("activeCall", false);
    localStorage.setItem("isCaller", false);
    localStorage.setItem("acceptedRoomID", 0);
    localStorage.setItem("activeRoomID", 0);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    dispatch(participantPopup(false));
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const raiseHandFunction = () => {
    if (handStatus) {
      setHandStatus(false);
    } else {
      setHandStatus(true);
    }
  };

  useEffect(() => {}, [
    VideoMainReducer.VideoRecipentData.userName,
    callerNameInitiate,
    callerName,
  ]);

  useEffect(() => {
    // Use setTimeout to hide the notification after 4 seconds
    if (showNotification === true) {
      const timeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      // Clear the timeout when the component unmounts to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [showNotification]);

  useEffect(() => {
    if (
      VideoMainReducer.GroupCallRecipientsData !== undefined &&
      VideoMainReducer.GroupCallRecipientsData !== null &&
      VideoMainReducer.GroupCallRecipientsData.length !== 0
    ) {
      setCurrentParticipants(VideoMainReducer.GroupCallRecipientsData);
    } else {
      setCurrentParticipants([]);
    }
  }, [VideoMainReducer.GroupCallRecipientsData]);

  useEffect(() => {
    if (callerObject !== undefined && callerObject !== null) {
      let callerObjectObj = JSON.parse(callerObject);
      setParticipantStatus((prevStatus) => [callerObjectObj, ...prevStatus]);
    }
  }, [callerObject]);

  console.log("Video Feature Reducer", videoFeatureReducer);

  return (
    <>
      <Row className="mb-4">
        {currentCallType === 2 && callTypeID === 2 && meetingTitle === "" ? (
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">{t("Group-call")}</p>
          </Col>
        ) : (currentCallType === 2 || callTypeID === 2) &&
          meetingTitle !== "" ? (
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">{meetingTitle}</p>
          </Col>
        ) : (
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">
              {currentUserName !==
                VideoMainReducer.VideoRecipentData.userName &&
              Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
              initiateVideoCallFlag === true
                ? VideoMainReducer.VideoRecipentData.userName ||
                  VideoMainReducer.VideoRecipentData.recipients[0].userName
                : currentUserName !==
                    VideoMainReducer.VideoRecipentData.userName &&
                  Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                  initiateVideoCallFlag === false
                ? VideoMainReducer.VideoRecipentData.userName ||
                  VideoMainReducer.VideoRecipentData.recipients[0].userName
                : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
                ? callerName
                : null}
            </p>
          </Col>
        )}

        <Col
          lg={3}
          md={3}
          sm={12}
          className="d-flex justify-content-center align-items-center mt-1"
        >
          {videoFeatureReducer.MaximizeVideoFlag === true &&
          showNotification === true ? (
            <div className="Notification-maximize">
              <p className="Notification-text">
                {t("Minimize-call-to-see-the-screen")}
              </p>
              <img
                className="cursor-pointer"
                src={CloseNotification}
                onClick={closeNotification}
                alt="Close Notification"
              />
            </div>
          ) : null}
        </Col>
        <>
          <Col lg={6} md={6} sm={12} className="normal-screen-top-icons">
            <div
              onClick={disableMic}
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : !isMicActive
                  ? "active-state"
                  : "inactive-state"
              }
            >
              <Tooltip
                placement="topRight"
                title={isMicActive ? t("Disable-mic") : t("Enable-mic")}
              >
                <img src={isMicActive ? MicOn : MicOff} alt="Mic" />
              </Tooltip>
            </div>
            <div
              onClick={disableVideo}
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : !isVideoActive
                  ? "active-state"
                  : "inactive-state"
              }
            >
              <Tooltip
                placement="topRight"
                title={isVideoActive ? t("Disable-video") : t("Enable-video")}
              >
                <img src={isVideoActive ? VideoOn : VideoOff} alt="Video" />
              </Tooltip>
            </div>
            {checkFeatureIDAvailability(5) ? (
              <div
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "screenShare-Toggle inactive-state"
                }
              >
                <Tooltip placement="topRight" title={t("Screen-share")}>
                  <img
                    onClick={screenShareButton}
                    src={NonActiveScreenShare}
                    alt="Screen Share"
                  />
                </Tooltip>
              </div>
            ) : null}

            <div
              onClick={raiseHandFunction}
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : !handStatus
                  ? "inactive-state"
                  : "active-state"
              }
            >
              <Tooltip
                placement="topRight"
                title={handStatus ? t("Lower-hand") : t("Raise-hand")}
              >
                <img
                  src={handStatus ? LowerHand : RaiseHand}
                  alt="Raise Hand"
                />
              </Tooltip>
            </div>

            <div
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }
            >
              <Tooltip placement="topRight" title={t("Copy-link")}>
                <img src={CopyLink} alt="Copy Link" />
              </Tooltip>
            </div>

            {videoFeatureReducer.MaximizeVideoFlag === true ? (
              <div
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "screenShare-Toggle"
                }
              >
                <Tooltip placement="topRight" title={t("Layout")}>
                  <img
                    className={"cursor-pointer"}
                    onClick={layoutCurrentChange}
                    src={showTile ? TileView : SidebarView}
                    alt="Layout Change"
                  />
                </Tooltip>
              </div>
            ) : null}

            {callerID === currentUserID && currentCallType === 2 ? (
              <div className={"position-relative"}>
                {videoFeatureReducer.ParticipantPopupFlag === true ? (
                  <>
                    <div className="active-state">
                      <img
                        src={ActiveParticipantIcon}
                        onClick={closeParticipantHandler}
                        alt="Active participants"
                      />
                    </div>
                    <div className="participants-list">
                      {currentParticipants !== undefined &&
                      currentParticipants !== null &&
                      currentParticipants.length > 0
                        ? currentParticipants.map((participantData, index) => {
                            console.log(
                              "participantStatus",
                              participantStatus[0]
                            );
                            const matchingStatus = participantStatus[0].find(
                              (status) =>
                                status.RecipientID === participantData.userID &&
                                status.RoomID === initiateRoomID
                            );
                            return (
                              <Row className="m-0" key={index}>
                                <Col className="p-0" lg={7} md={7} sm={12}>
                                  <p className="participant-name">
                                    {participantData.userName}
                                  </p>
                                </Col>
                                <Col
                                  className="d-flex justify-content-end align-items-baseline gap-3 p-0"
                                  lg={5}
                                  md={5}
                                  sm={12}
                                >
                                  <img src={MenuRaiseHand} alt="" />

                                  <Dropdown>
                                    <Dropdown.Toggle className="participant-toggle">
                                      <img src={Menu} alt="" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item className="participant-dropdown-item">
                                        {t("Make-host")}
                                      </Dropdown.Item>
                                      <Dropdown.Item className="participant-dropdown-item">
                                        {t("Remove")}
                                      </Dropdown.Item>
                                      <Dropdown.Item className="participant-dropdown-item">
                                        {t("Mute")}
                                      </Dropdown.Item>
                                      <Dropdown.Item className="participant-dropdown-item">
                                        {t("Hide-video")}
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>

                                  {/* <p className="participant-state">
                                    {matchingStatus
                                      ? matchingStatus.CallStatus
                                      : "Calling..."}
                                  </p> */}
                                </Col>
                              </Row>
                            );
                          })
                        : null}
                      <Row className="hostBorder m-0">
                        <Col className="p-0" lg={7} md={7} sm={12}>
                          <p className="participant-name">{currentUserName}</p>
                        </Col>
                        <Col
                          className="
                        d-flex
                        justify-content-end
                        align-items-baseline
                        gap-3
                        p-0"
                          lg={5}
                          md={5}
                          sm={12}
                        >
                          <img src={MenuRaiseHand} alt="" />
                          <Dropdown>
                            <Dropdown.Toggle className="participant-toggle">
                              <img src={Menu} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item className="participant-dropdown-item">
                                {t("Make-host")}
                              </Dropdown.Item>
                              <Dropdown.Item className="participant-dropdown-item">
                                {t("Remove")}
                              </Dropdown.Item>
                              <Dropdown.Item className="participant-dropdown-item">
                                {t("Mute")}
                              </Dropdown.Item>
                              <Dropdown.Item className="participant-dropdown-item">
                                {t("Hide-video")}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  <Tooltip placement="topRight" title={t("Participants")}>
                    <div
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "grayScaleImage"
                          : "inactive-state"
                      }
                    >
                      <img
                        src={ParticipantsIcon}
                        onClick={closeParticipantHandler}
                        alt="Participants"
                      />
                    </div>
                  </Tooltip>
                )}
                <span className="participants-counter">3</span>
              </div>
            ) : null}

            <div
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? "grayScaleImage position-relative"
                  : "screenShare-Toggle inactive-state position-relative"
              }
            >
              <Tooltip placement="topRight" title={t("Participants")}>
                <img src={AddParticipant} alt="Add Participants" />
              </Tooltip>
              <div className="participants-list">
                {currentParticipants !== undefined &&
                currentParticipants !== null &&
                currentParticipants.length > 0
                  ? currentParticipants.map((participantData, index) => {
                      console.log("participantStatus", participantStatus[0]);
                      const matchingStatus = participantStatus[0].find(
                        (status) =>
                          status.RecipientID === participantData.userID &&
                          status.RoomID === initiateRoomID
                      );
                      return (
                        <Row className="m-0" key={index}>
                          <Col className="p-0" lg={7} md={7} sm={12}>
                            <p className="participant-name">
                              {participantData.userName}
                            </p>
                          </Col>
                          <Col
                            className="d-flex justify-content-end align-items-baseline gap-3 p-0"
                            lg={5}
                            md={5}
                            sm={12}
                          >
                            <img src={MenuRaiseHand} alt="" />

                            <Dropdown>
                              <Dropdown.Toggle className="participant-toggle">
                                <img src={Menu} alt="" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item className="participant-dropdown-item">
                                  {t("Make-host")}
                                </Dropdown.Item>
                                <Dropdown.Item className="participant-dropdown-item">
                                  {t("Remove")}
                                </Dropdown.Item>
                                <Dropdown.Item className="participant-dropdown-item">
                                  {t("Mute")}
                                </Dropdown.Item>
                                <Dropdown.Item className="participant-dropdown-item">
                                  {t("Hide-video")}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* <p className="participant-state">
                                    {matchingStatus
                                      ? matchingStatus.CallStatus
                                      : "Calling..."}
                                  </p> */}
                          </Col>
                        </Row>
                      );
                    })
                  : null}
                <Row className="hostBorder m-0">
                  <Col className="p-0" lg={7} md={7} sm={12}>
                    <p className="participant-name">{currentUserName}</p>
                  </Col>
                  <Col
                    className="
                        d-flex
                        justify-content-end
                        align-items-baseline
                        gap-3
                        p-0"
                    lg={5}
                    md={5}
                    sm={12}
                  >
                    <img src={MenuRaiseHand} alt="" />
                    <Dropdown>
                      <Dropdown.Toggle className="participant-toggle">
                        <img src={Menu} alt="" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item className="participant-dropdown-item">
                          {t("Make-host")}
                        </Dropdown.Item>
                        <Dropdown.Item className="participant-dropdown-item">
                          {t("Remove")}
                        </Dropdown.Item>
                        <Dropdown.Item className="participant-dropdown-item">
                          {t("Mute")}
                        </Dropdown.Item>
                        <Dropdown.Item className="participant-dropdown-item">
                          {t("Hide-video")}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </div>
            </div>

            {currentCallType === 1 && checkFeatureIDAvailability(3) ? (
              <div
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "screenShare-Toggle inactive-state"
                }
              >
                <Tooltip placement="topRight" title={t("Chat")}>
                  <img
                    onClick={onClickCloseChatHandler}
                    src={ChatIcon}
                    alt="Chat"
                  />
                </Tooltip>
              </div>
            ) : null}

            <Tooltip placement="topRight" title={t("Minimize")}>
              <div
                onClick={minimizeVideoPanel}
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "inactive-state"
                }
              >
                <img src={MinimizeIcon} alt="Minimize" />
              </div>
            </Tooltip>

            {videoFeatureReducer.LeaveCallModalFlag === true &&
            callerID === currentUserID ? (
              <div className="active-state-end">
                <Tooltip placement="topRight" title={t("Cancel")}>
                  <img
                    onClick={cancelLeaveCallOption}
                    src={videoEndIcon}
                    alt="End Call"
                  />
                </Tooltip>
              </div>
            ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                callerID === currentUserID) ||
              callerID === 0 ? (
              <Tooltip placement="topRight" title={t("End-call")}>
                <div className="inactive-state">
                  <img
                    className="cursor-pointer"
                    src={CallEndRedIcon}
                    onClick={openVideoPanel}
                    alt="End Call"
                  />
                </div>
              </Tooltip>
            ) : videoFeatureReducer.LeaveCallModalFlag === false &&
              callerID !== currentUserID ? (
              <Tooltip placement="topRight" title={t("End-call")}>
                <img
                  className="inactive-state"
                  src={CallEndRedIcon}
                  onClick={endCallParticipant}
                  alt="End Call"
                />
              </Tooltip>
            ) : null}

            {videoFeatureReducer.NormalizeVideoFlag === true &&
            videoFeatureReducer.MinimizeVideoFlag === false &&
            videoFeatureReducer.MaximizeVideoFlag === false ? (
              <Tooltip placement="topRight" title={t("Expand")}>
                <div
                  className={
                    videoFeatureReducer.LeaveCallModalFlag === true
                      ? "grayScaleImage"
                      : "inactive-state"
                  }
                >
                  <img
                    src={ExpandIcon}
                    onClick={otoMaximizeVideoPanel}
                    alt="Expand"
                  />
                </div>
              </Tooltip>
            ) : videoFeatureReducer.NormalizeVideoFlag === false &&
              videoFeatureReducer.MinimizeVideoFlag === false &&
              videoFeatureReducer.MaximizeVideoFlag === true ? (
              <div
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : "inactive-state"
                }
              >
                <Tooltip placement="topRight" title={t("Collapse")}>
                  <img
                    src={NormalizeIcon}
                    alt="Maximize"
                    onClick={normalizeScreen}
                  />
                </Tooltip>
              </div>
            ) : null}
          </Col>
        </>
      </Row>

      <div ref={leaveModalPopupRef}>
        {videoFeatureReducer.LeaveCallModalFlag === true ? (
          <div className="leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              <Button
                className="leave-meeting-options__btn leave-meeting-red-button"
                text={t("Leave-call")}
                onClick={leaveCall}
              />

              <Button
                className="leave-meeting-options__btn leave-meeting-gray-button"
                text={
                  currentCallType === 1
                    ? t("End-call")
                    : t("End-call-for-everyone")
                }
                onClick={leaveCall}
              />

              <Button
                className="leave-meeting-options__btn leave-meeting-gray-button"
                text="Cancel"
                onClick={closeVideoPanel}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoCallNormalHeader;
