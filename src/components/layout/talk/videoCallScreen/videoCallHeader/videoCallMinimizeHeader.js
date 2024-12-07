import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Button } from "./../../../../elements";
import { Tooltip } from "antd";
import "./videoCallHeader.css";
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  minimizeParticipantPopup,
} from "../../../../../store/actions/VideoFeature_actions";
import AddParticipant from "./../../talk-Video/video-images/Add Participant Purple.svg";
import ExpandIcon from "./../../talk-Video/video-images/Expand White.svg";
import MinToNormalIcon from "./../../talk-Video/video-images/Half Video Screen.svg";
import NonActiveScreenShare from "./../../talk-Video/video-images/Screen Share Purple.svg";
import videoEndIcon from "./../../talk-Video/video-images/Call End White.svg";
import TileView from "./../../talk-Video/video-images/Tile View 1 Purple.svg";
import SidebarView from "./../../talk-Video/video-images/Tile View 3 Purple.svg";
import MicOn from "./../../talk-Video/video-images/Minimize Mic Enabled.svg";
import VideoOn from "./../../talk-Video/video-images/Minimize Video Enabled.svg";
import MicOff from "./../../talk-Video/video-images/Mic Disabled Purple.svg";
import MicOffHost from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOffHost from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";

import VideoOff from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import ChatIcon from "./../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../talk-Video/video-images/Collapse.svg";
import ParticipantIcon from "./../../talk-Video/video-images/Users White.svg";
import ActiveParticipantIcon from "./../../talk-Video/video-images/Users Purple.svg";
import ParticipantsIcon from "./../../talk-Video/video-images/Users Purple.svg";

import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import {
  hideUnhideSelfMainApi,
  muteUnMuteSelfMainApi,
} from "../../../../../store/actions/Guest_Video";

const VideoCallMinimizeHeader = ({ screenShareButton }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const participantPopupDisable = useRef(null);

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );

  // state for participants
  const [currentParticipants, setCurrentParticipants] = useState([]);

  const [participantStatus, setParticipantStatus] = useState([]);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  const [localMicStatus, setLocalMicStatus] = useState(micStatus);
  const [localVidStatus, setLocalVidStatus] = useState(vidStatus);
  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);

  let newRoomID = localStorage.getItem("newRoomId");
  let newUserGUID = localStorage.getItem("isGuid");
  let participantRoomIds = localStorage.getItem("participantRoomId");
  let participantUID = localStorage.getItem("participantUID");
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
  let userGUID = localStorage.getItem("userGUID");

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  //Audio Control For host
  const audioControlHost = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  //Video Control For host
  const videoControlHost = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  // audioControlForParticipant for Participants
  const audioControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.audioControlForParticipant
  );

  // videoControlForParticipant for Participants
  const videoControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.videoControlForParticipant
  );

  const meetingHostData = JSON.parse(localStorage.getItem("meetinHostInfo"));
  console.log(meetingHostData, "meetingHostDatameetingHostData");

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
    localStorage.setItem("activeCall", false);
  };

  const normalizePanel = () => {
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const maximizePanel = () => {
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(true));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true));
    // localStorage.setItem('activeCall', false)
  };

  // this handler is for close participant

  const closeParticipantHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.MinimizeParticipantPopupFlag === false) {
        dispatch(minimizeParticipantPopup(true));
      } else {
        dispatch(minimizeParticipantPopup(false));
      }
    }
  };

  //when user click outside then icon will be closed
  const handleOutsideClick = (event) => {
    if (
      participantPopupDisable.current &&
      !participantPopupDisable.current.contains(event.target) &&
      videoFeatureReducer.MinimizeParticipantPopupFlag
    ) {
      dispatch(minimizeParticipantPopup(false));
    }
  };

  useEffect(() => {
    if (meetingUrlData !== null && meetingUrlData !== undefined) {
      setMeetingURLLocalData(meetingUrlData);
    } else {
      setMeetingURLLocalData(null);
    }
  }, [meetingUrlData]);

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

  // this is for leave call group API

  const minimizeEndCallParticipant = () => {
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
      localStorage.setItem("isMeetingVideo", false);
    }
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false));
  };

  const minimizeLeaveCall = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    localStorage.setItem("isCaller", false);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    setParticipantStatus([]);
    localStorage.setItem("activeCall", false);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    dispatch(minimizeParticipantPopup(false));
    localStorage.setItem("isMeetingVideo", false);
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const toggleMic = (status) => {
    console.log(status ? "Enable Mic" : "Disable Mic");
    localStorage.setItem("MicOff", status);
    setLocalMicStatus(status);
  };

  const toggleVideo = (status) => {
    console.log(status ? "Enable Video" : "Disable Video");
    localStorage.setItem("VidOff", status);
    setLocalVidStatus(status);
  };

  useEffect(() => {}, [localMicStatus, localVidStatus]);

  useEffect(() => {
    if (callerObject !== undefined && callerObject !== null) {
      let callerObjectObj = JSON.parse(callerObject);
      setParticipantStatus((prevStatus) => [callerObjectObj, ...prevStatus]);
    }
  }, [callerObject]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [videoFeatureReducer.MinimizeParticipantPopupFlag]);

  useEffect(() => {
    setLocalMicStatus(micStatus);
    setLocalVidStatus(vidStatus);
  }, [videoFeatureReducer.MinimizeVideoFlag]);

  const muteUnMuteForHost = (flag) => {
    // const flag = audioControlHost;
    console.log("videoHideUnHideForHost", flag);

    // Prepare data for the API request
    let data = {
      RoomID: String(newRoomID),
      IsMuted: flag,
      UID: String(newUserGUID),
    };

    // Dispatch the API request with the data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 1));
  };

  const videoHideUnHideForHost = (flag) => {
    // Set the HideVideo flag based on videoControlForParticipant
    // const flag = videoControlHost;
    console.log("videoHideUnHideForHost", flag);
    // Prepare data for the API request
    let data = {
      RoomID: String(newRoomID),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(newUserGUID),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 1));
  };

  const muteUnMuteForParticipant = (flag) => {
    // const flag = audioControlForParticipant;

    let data = {
      RoomID: String(participantRoomIds),
      IsMuted: flag,
      UID: String(participantUID),
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 2));
  };

  const videoHideUnHideForParticipant = (flag) => {
    // Prepare data for the API request
    let data = {
      RoomID: String(participantRoomIds),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(participantUID),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 2));
  };

  return (
    <>
      {" "}
      {meetingHostData !== null &&
      meetingHostData.isHost === true &&
      meetingHostData.isDashboardVideo === true ? (
        <>
          <div className="videoCallGroupScreen-minmizeVideoCall">
            <Row className="m-0 height100 align-items-center">
              {(currentCallType === 2 || callTypeID === 2) &&
              meetingTitle === "" ? (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">{t("Group-call")}</p>
                </Col>
              ) : (currentCallType === 2 || callTypeID === 2) &&
                meetingTitle !== "" ? (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="mt-1 cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">{meetingTitle}</p>
                </Col>
              ) : (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="mt-1 cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">
                    {currentUserName !==
                      VideoMainReducer.VideoRecipentData.userName &&
                    Object.keys(VideoMainReducer.VideoRecipentData).length >
                      0 &&
                    initiateVideoCallFlag === true
                      ? VideoMainReducer.VideoRecipentData.userName ||
                        VideoMainReducer.VideoRecipentData.recipients[0]
                          .userName
                      : currentUserName !==
                          VideoMainReducer.VideoRecipentData.userName &&
                        Object.keys(VideoMainReducer.VideoRecipentData).length >
                          0 &&
                        initiateVideoCallFlag === false
                      ? VideoMainReducer.VideoRecipentData.userName ||
                        VideoMainReducer.VideoRecipentData.recipients[0]
                          .userName
                      : Object.keys(VideoMainReducer.VideoRecipentData)
                          .length === 0
                      ? callerName
                      : null}
                  </p>
                </Col>
              )}

              <Col lg={6} md={6} sm={12}>
                <div className="d-flex gap-10 justify-content-end">
                  <div>
                    <div
                      onClick={() => toggleVideo(!localVidStatus)}
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : !localVidStatus
                          ? "minimize for-host-active-state-minimize"
                          : "minimize inactive-state"
                      }
                    >
                      <Tooltip
                        placement="topRight"
                        title={
                          videoControlHost
                            ? t("Disable-video")
                            : t("Enable-video")
                        }
                      >
                        <img
                          src={videoControlHost ? VideoOffHost : VideoOn}
                          onClick={() =>
                            videoHideUnHideForHost(
                              videoControlHost ? false : true
                            )
                          }
                          alt="Video"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => toggleMic(!localMicStatus)}
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : !localMicStatus
                          ? "minimize for-host-active-state-minimize"
                          : "minimize inactive-state"
                      }
                    >
                      <Tooltip
                        placement="topRight"
                        title={
                          audioControlHost ? t("Enable-mic") : t("Disable-mic")
                        }
                      >
                        <img
                          src={audioControlHost ? MicOffHost : MicOn}
                          onClick={() =>
                            muteUnMuteForHost(audioControlHost ? false : true)
                          }
                          alt="Mic"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {callerID === currentUserID &&
                  (callTypeID === 2 || currentCallType === 2) ? (
                    <div
                      className="position-relative"
                      ref={participantPopupDisable}
                    >
                      {videoFeatureReducer.MinimizeParticipantPopupFlag ===
                      true ? (
                        <>
                          <div className="minimize active-state-minimize">
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Participants")}
                            >
                              <img
                                src={ActiveParticipantIcon}
                                alt="Active Participants"
                                onClick={closeParticipantHandler}
                              />
                            </Tooltip>
                            <div className="minimize-participants-list">
                              <Row className="m-0">
                                <Col className="p-0" lg={8} md={8} sm={12}>
                                  <p className="participant-name">
                                    {currentUserName}
                                  </p>
                                </Col>
                                <Col className="p-0" lg={4} md={4} sm={12}>
                                  <p className="participant-state">Host</p>
                                </Col>
                              </Row>
                              {currentParticipants !== undefined &&
                              currentParticipants !== null &&
                              currentParticipants.length > 0
                                ? currentParticipants.map(
                                    (participantData, index) => {
                                      console.log(
                                        "participantStatus",
                                        participantStatus[0]
                                      );
                                      const matchingStatus =
                                        participantStatus[0].find(
                                          (status) =>
                                            status.RecipientID ===
                                              participantData.userID &&
                                            status.RoomID === initiateRoomID
                                        );
                                      return (
                                        <Row className="m-0" key={index}>
                                          <Col
                                            className="p-0"
                                            lg={8}
                                            md={8}
                                            sm={12}
                                          >
                                            <p className="participant-name">
                                              {participantData.userName}
                                            </p>
                                          </Col>
                                          <Col
                                            className="p-0"
                                            lg={4}
                                            md={4}
                                            sm={12}
                                          >
                                            <p className="participant-state">
                                              {matchingStatus
                                                ? matchingStatus.CallStatus
                                                : "Calling..."}
                                            </p>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )
                                : null}
                            </div>
                          </div>
                          <span className="participants-counter">3</span>
                        </>
                      ) : (
                        <>
                          <div
                            className={
                              videoFeatureReducer.LeaveCallModalFlag === true
                                ? "minimize grayScaleImage"
                                : "minimize inactive-state"
                            }
                          >
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Participants")}
                            >
                              <img
                                src={ParticipantIcon}
                                onClick={closeParticipantHandler}
                                alt="Active Participants"
                              />
                            </Tooltip>
                          </div>
                          <span className="participants-counter">3</span>
                        </>
                      )}
                    </div>
                  ) : null}
                  <div className="position-relative">
                    {videoFeatureReducer.LeaveCallModalFlag === true &&
                    callerID === currentUserID ? (
                      <>
                        <div className="minimize active-state-end">
                          <Tooltip placement="bottomLeft" title={t("Cancel")}>
                            <img
                              onClick={cancelLeaveCallOption}
                              src={CallEndRedIcon}
                              alt="End Call"
                              className="cursor-pointer"
                            />
                          </Tooltip>
                        </div>
                        {videoFeatureReducer.LeaveCallModalFlag === true ? (
                          <div className="minimize-leave-meeting-options leave-meeting-options-position">
                            <div className="leave-meeting-options__inner">
                              <Button
                                className="leave-meeting-options__btn leave-meeting-red-button"
                                text={t("Leave-call")}
                                onClick={minimizeLeaveCall}
                              />

                              <Button
                                className="leave-meeting-options__btn leave-meeting-gray-button"
                                text={
                                  currentCallType === 1
                                    ? t("End-call")
                                    : t("End-call-for-everyone")
                                }
                                onClick={minimizeLeaveCall}
                              />

                              <Button
                                className="leave-meeting-options__btn leave-meeting-gray-button"
                                text="Cancel"
                                onClick={closeVideoPanel}
                              />
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                        callerID === currentUserID) ||
                      callerID === 0 ? (
                      <Tooltip placement="bottomLeft" title={t("End-call")}>
                        <div className="minimize inactive-state">
                          <img
                            src={CallEndRedIcon}
                            onClick={openVideoPanel}
                            alt="End Call"
                            className="cursor-pointer"
                          />
                        </div>
                      </Tooltip>
                    ) : videoFeatureReducer.LeaveCallModalFlag === false &&
                      callerID !== currentUserID ? (
                      <Tooltip placement="bottomLeft" title={t("End-call")}>
                        <img
                          src={CallEndRedIcon}
                          onClick={minimizeEndCallParticipant}
                          alt="End Call"
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                  <div>
                    <Tooltip
                      placement="bottomLeft"
                      title={t("Normalize-screen")}
                    >
                      <div
                        className={
                          videoFeatureReducer.LeaveCallModalFlag === true
                            ? "minimize grayScaleImage"
                            : "minimize inactive-state"
                        }
                      >
                        <img
                          src={MinToNormalIcon}
                          onClick={normalizePanel}
                          className="min-to-normal-icon cursor-pointer"
                          alt="Normalize Panel"
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip
                      placement="bottomLeft"
                      title={t("Maximize-screen")}
                    >
                      <div
                        className={
                          videoFeatureReducer.LeaveCallModalFlag === true
                            ? "minimize grayScaleImage"
                            : "minimize inactive-state"
                        }
                      >
                        <img
                          src={ExpandIcon}
                          onClick={maximizePanel}
                          className="min-to-max-icon cursor-pointer"
                          alt="Maximize"
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : meetingHostData.isHost === false &&
        meetingHostData.isDashboardVideo === true ? (
        <>
          <div className="videoCallGroupScreen-minmizeVideoCall">
            <Row className="m-0 height100 align-items-center">
              {(currentCallType === 2 || callTypeID === 2) &&
              meetingTitle === "" ? (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">{t("Group-call")}</p>
                </Col>
              ) : (currentCallType === 2 || callTypeID === 2) &&
                meetingTitle !== "" ? (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="mt-1 cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">{meetingTitle}</p>
                </Col>
              ) : (
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="mt-1 cursor-pointer"
                  onClick={() => {
                    dispatch(normalizeVideoPanelFlag(true));
                    dispatch(minimizeVideoPanelFlag(false));
                  }}
                >
                  <p className="title-heading">
                    {currentUserName !==
                      VideoMainReducer.VideoRecipentData.userName &&
                    Object.keys(VideoMainReducer.VideoRecipentData).length >
                      0 &&
                    initiateVideoCallFlag === true
                      ? VideoMainReducer.VideoRecipentData.userName ||
                        VideoMainReducer.VideoRecipentData.recipients[0]
                          .userName
                      : currentUserName !==
                          VideoMainReducer.VideoRecipentData.userName &&
                        Object.keys(VideoMainReducer.VideoRecipentData).length >
                          0 &&
                        initiateVideoCallFlag === false
                      ? VideoMainReducer.VideoRecipentData.userName ||
                        VideoMainReducer.VideoRecipentData.recipients[0]
                          .userName
                      : Object.keys(VideoMainReducer.VideoRecipentData)
                          .length === 0
                      ? callerName
                      : null}
                  </p>
                </Col>
              )}

              <Col lg={6} md={6} sm={12}>
                <div className="d-flex gap-10 justify-content-end">
                  <div>
                    <div
                      onClick={() => toggleVideo(!localVidStatus)}
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : !localVidStatus
                          ? "minimize for-host-active-state-minimize"
                          : "minimize inactive-state"
                      }
                    >
                      <Tooltip
                        placement="topRight"
                        title={
                          videoControlForParticipant
                            ? t("Disable-video")
                            : t("Enable-video")
                        }
                      >
                        <img
                          src={
                            videoControlForParticipant ? VideoOffHost : VideoOn
                          }
                          onClick={() =>
                            videoHideUnHideForParticipant(
                              videoControlForParticipant ? false : true
                            )
                          }
                          alt="Video"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={() => toggleMic(!localMicStatus)}
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : !localMicStatus
                          ? "minimize for-host-active-state-minimize"
                          : "minimize inactive-state"
                      }
                    >
                      <Tooltip
                        placement="topRight"
                        title={
                          audioControlForParticipant
                            ? t("Enable-mic")
                            : t("Disable-mic")
                        }
                      >
                        <img
                          src={audioControlForParticipant ? MicOffHost : MicOn}
                          onClick={() =>
                            muteUnMuteForParticipant(
                              audioControlForParticipant ? false : true
                            )
                          }
                          alt="Mic"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {callerID === currentUserID &&
                  (callTypeID === 2 || currentCallType === 2) ? (
                    <div
                      className="position-relative"
                      ref={participantPopupDisable}
                    >
                      {videoFeatureReducer.MinimizeParticipantPopupFlag ===
                      true ? (
                        <>
                          <div className="minimize active-state-minimize">
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Participants")}
                            >
                              <img
                                src={ActiveParticipantIcon}
                                alt="Active Participants"
                                onClick={closeParticipantHandler}
                              />
                            </Tooltip>
                            <div className="minimize-participants-list">
                              <Row className="m-0">
                                <Col className="p-0" lg={8} md={8} sm={12}>
                                  <p className="participant-name">
                                    {currentUserName}
                                  </p>
                                </Col>
                                <Col className="p-0" lg={4} md={4} sm={12}>
                                  <p className="participant-state">Host</p>
                                </Col>
                              </Row>
                              {currentParticipants !== undefined &&
                              currentParticipants !== null &&
                              currentParticipants.length > 0
                                ? currentParticipants.map(
                                    (participantData, index) => {
                                      console.log(
                                        "participantStatus",
                                        participantStatus[0]
                                      );
                                      const matchingStatus =
                                        participantStatus[0].find(
                                          (status) =>
                                            status.RecipientID ===
                                              participantData.userID &&
                                            status.RoomID === initiateRoomID
                                        );
                                      return (
                                        <Row className="m-0" key={index}>
                                          <Col
                                            className="p-0"
                                            lg={8}
                                            md={8}
                                            sm={12}
                                          >
                                            <p className="participant-name">
                                              {participantData.userName}
                                            </p>
                                          </Col>
                                          <Col
                                            className="p-0"
                                            lg={4}
                                            md={4}
                                            sm={12}
                                          >
                                            <p className="participant-state">
                                              {matchingStatus
                                                ? matchingStatus.CallStatus
                                                : "Calling..."}
                                            </p>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )
                                : null}
                            </div>
                          </div>
                          <span className="participants-counter">3</span>
                        </>
                      ) : (
                        <>
                          <div
                            className={
                              videoFeatureReducer.LeaveCallModalFlag === true
                                ? "minimize grayScaleImage"
                                : "minimize inactive-state"
                            }
                          >
                            <Tooltip
                              placement="bottomLeft"
                              title={t("Participants")}
                            >
                              <img
                                src={ParticipantIcon}
                                onClick={closeParticipantHandler}
                                alt="Active Participants"
                              />
                            </Tooltip>
                          </div>
                          <span className="participants-counter">3</span>
                        </>
                      )}
                    </div>
                  ) : null}
                  <div className="position-relative">
                    {videoFeatureReducer.LeaveCallModalFlag === true &&
                    callerID === currentUserID ? (
                      <>
                        <div className="minimize active-state-end">
                          <Tooltip placement="bottomLeft" title={t("Cancel")}>
                            <img
                              onClick={cancelLeaveCallOption}
                              src={CallEndRedIcon}
                              alt="End Call"
                              className="cursor-pointer"
                            />
                          </Tooltip>
                        </div>
                        {videoFeatureReducer.LeaveCallModalFlag === true ? (
                          <div className="minimize-leave-meeting-options leave-meeting-options-position">
                            <div className="leave-meeting-options__inner">
                              <Button
                                className="leave-meeting-options__btn leave-meeting-red-button"
                                text={t("Leave-call")}
                                onClick={minimizeLeaveCall}
                              />

                              <Button
                                className="leave-meeting-options__btn leave-meeting-gray-button"
                                text={
                                  currentCallType === 1
                                    ? t("End-call")
                                    : t("End-call-for-everyone")
                                }
                                onClick={minimizeLeaveCall}
                              />

                              <Button
                                className="leave-meeting-options__btn leave-meeting-gray-button"
                                text="Cancel"
                                onClick={closeVideoPanel}
                              />
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                        callerID === currentUserID) ||
                      callerID === 0 ? (
                      <Tooltip placement="bottomLeft" title={t("End-call")}>
                        <div className="minimize inactive-state">
                          <img
                            src={CallEndRedIcon}
                            onClick={openVideoPanel}
                            alt="End Call"
                            className="cursor-pointer"
                          />
                        </div>
                      </Tooltip>
                    ) : videoFeatureReducer.LeaveCallModalFlag === false &&
                      callerID !== currentUserID ? (
                      <Tooltip placement="bottomLeft" title={t("End-call")}>
                        <img
                          src={CallEndRedIcon}
                          onClick={minimizeEndCallParticipant}
                          alt="End Call"
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                  <div>
                    <Tooltip
                      placement="bottomLeft"
                      title={t("Normalize-screen")}
                    >
                      <div
                        className={
                          videoFeatureReducer.LeaveCallModalFlag === true
                            ? "minimize grayScaleImage"
                            : "minimize inactive-state"
                        }
                      >
                        <img
                          src={MinToNormalIcon}
                          onClick={normalizePanel}
                          className="min-to-normal-icon cursor-pointer"
                          alt="Normalize Panel"
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip
                      placement="bottomLeft"
                      title={t("Maximize-screen")}
                    >
                      <div
                        className={
                          videoFeatureReducer.LeaveCallModalFlag === true
                            ? "minimize grayScaleImage"
                            : "minimize inactive-state"
                        }
                      >
                        <img
                          src={ExpandIcon}
                          onClick={maximizePanel}
                          className="min-to-max-icon cursor-pointer"
                          alt="Maximize"
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div className="videoCallGroupScreen-minmizeVideoCall">
          <Row className="m-0 height100 align-items-center">
            {(currentCallType === 2 || callTypeID === 2) &&
            meetingTitle === "" ? (
              <Col
                lg={6}
                md={6}
                sm={12}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(normalizeVideoPanelFlag(true));
                  dispatch(minimizeVideoPanelFlag(false));
                }}
              >
                <p className="title-heading">{t("Group-call")}</p>
              </Col>
            ) : (currentCallType === 2 || callTypeID === 2) &&
              meetingTitle !== "" ? (
              <Col
                lg={6}
                md={6}
                sm={12}
                className="mt-1 cursor-pointer"
                onClick={() => {
                  dispatch(normalizeVideoPanelFlag(true));
                  dispatch(minimizeVideoPanelFlag(false));
                }}
              >
                <p className="title-heading">{meetingTitle}</p>
              </Col>
            ) : (
              <Col
                lg={6}
                md={6}
                sm={12}
                className="mt-1 cursor-pointer"
                onClick={() => {
                  dispatch(normalizeVideoPanelFlag(true));
                  dispatch(minimizeVideoPanelFlag(false));
                }}
              >
                <p className="title-heading">
                  {currentUserName !==
                    VideoMainReducer.VideoRecipentData.userName &&
                  Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                  initiateVideoCallFlag === true
                    ? VideoMainReducer.VideoRecipentData.userName ||
                      VideoMainReducer.VideoRecipentData.recipients[0].userName
                    : currentUserName !==
                        VideoMainReducer.VideoRecipentData.userName &&
                      Object.keys(VideoMainReducer.VideoRecipentData).length >
                        0 &&
                      initiateVideoCallFlag === false
                    ? VideoMainReducer.VideoRecipentData.userName ||
                      VideoMainReducer.VideoRecipentData.recipients[0].userName
                    : Object.keys(VideoMainReducer.VideoRecipentData).length ===
                      0
                    ? callerName
                    : null}
                </p>
              </Col>
            )}

            <Col lg={6} md={6} sm={12}>
              <div className="d-flex gap-10 justify-content-end">
                <div>
                  <div
                    onClick={() => toggleVideo(!localVidStatus)}
                    className={
                      videoFeatureReducer.LeaveCallModalFlag === true
                        ? "minimize grayScaleImage"
                        : !localVidStatus
                        ? "minimize active-state-minimize"
                        : "minimize inactive-state"
                    }
                  >
                    <Tooltip
                      placement="topRight"
                      title={
                        localVidStatus ? t("Disable-video") : t("Enable-video")
                      }
                    >
                      <img
                        src={localVidStatus ? VideoOn : VideoOff}
                        alt="Video"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <div
                    onClick={() => toggleMic(!localMicStatus)}
                    className={
                      videoFeatureReducer.LeaveCallModalFlag === true
                        ? "minimize grayScaleImage"
                        : !localMicStatus
                        ? "minimize active-state-minimize"
                        : "minimize inactive-state"
                    }
                  >
                    <Tooltip
                      placement="topRight"
                      title={
                        localMicStatus ? t("Disable-mic") : t("Enable-mic")
                      }
                    >
                      <img src={localMicStatus ? MicOn : MicOff} alt="Mic" />
                    </Tooltip>
                  </div>
                </div>
                {callerID === currentUserID &&
                (callTypeID === 2 || currentCallType === 2) ? (
                  <div
                    className="position-relative"
                    ref={participantPopupDisable}
                  >
                    {videoFeatureReducer.MinimizeParticipantPopupFlag ===
                    true ? (
                      <>
                        <div className="minimize active-state-minimize">
                          <Tooltip
                            placement="bottomLeft"
                            title={t("Participants")}
                          >
                            <img
                              src={ActiveParticipantIcon}
                              alt="Active Participants"
                              onClick={closeParticipantHandler}
                            />
                          </Tooltip>
                          <div className="minimize-participants-list">
                            <Row className="m-0">
                              <Col className="p-0" lg={8} md={8} sm={12}>
                                <p className="participant-name">
                                  {currentUserName}
                                </p>
                              </Col>
                              <Col className="p-0" lg={4} md={4} sm={12}>
                                <p className="participant-state">Host</p>
                              </Col>
                            </Row>
                            {currentParticipants !== undefined &&
                            currentParticipants !== null &&
                            currentParticipants.length > 0
                              ? currentParticipants.map(
                                  (participantData, index) => {
                                    console.log(
                                      "participantStatus",
                                      participantStatus[0]
                                    );
                                    const matchingStatus =
                                      participantStatus[0].find(
                                        (status) =>
                                          status.RecipientID ===
                                            participantData.userID &&
                                          status.RoomID === initiateRoomID
                                      );
                                    return (
                                      <Row className="m-0" key={index}>
                                        <Col
                                          className="p-0"
                                          lg={8}
                                          md={8}
                                          sm={12}
                                        >
                                          <p className="participant-name">
                                            {participantData.userName}
                                          </p>
                                        </Col>
                                        <Col
                                          className="p-0"
                                          lg={4}
                                          md={4}
                                          sm={12}
                                        >
                                          <p className="participant-state">
                                            {matchingStatus
                                              ? matchingStatus.CallStatus
                                              : "Calling..."}
                                          </p>
                                        </Col>
                                      </Row>
                                    );
                                  }
                                )
                              : null}
                          </div>
                        </div>
                        <span className="participants-counter">3</span>
                      </>
                    ) : (
                      <>
                        <div
                          className={
                            videoFeatureReducer.LeaveCallModalFlag === true
                              ? "minimize grayScaleImage"
                              : "minimize inactive-state"
                          }
                        >
                          <Tooltip
                            placement="bottomLeft"
                            title={t("Participants")}
                          >
                            <img
                              src={ParticipantIcon}
                              onClick={closeParticipantHandler}
                              alt="Active Participants"
                            />
                          </Tooltip>
                        </div>
                        <span className="participants-counter">3</span>
                      </>
                    )}
                  </div>
                ) : null}
                <div className="position-relative">
                  {videoFeatureReducer.LeaveCallModalFlag === true &&
                  callerID === currentUserID ? (
                    <>
                      <div className="minimize active-state-end">
                        <Tooltip placement="bottomLeft" title={t("Cancel")}>
                          <img
                            onClick={cancelLeaveCallOption}
                            src={CallEndRedIcon}
                            alt="End Call"
                            className="cursor-pointer"
                          />
                        </Tooltip>
                      </div>
                      {videoFeatureReducer.LeaveCallModalFlag === true ? (
                        <div className="minimize-leave-meeting-options leave-meeting-options-position">
                          <div className="leave-meeting-options__inner">
                            <Button
                              className="leave-meeting-options__btn leave-meeting-red-button"
                              text={t("Leave-call")}
                              onClick={minimizeLeaveCall}
                            />

                            <Button
                              className="leave-meeting-options__btn leave-meeting-gray-button"
                              text={
                                currentCallType === 1
                                  ? t("End-call")
                                  : t("End-call-for-everyone")
                              }
                              onClick={minimizeLeaveCall}
                            />

                            <Button
                              className="leave-meeting-options__btn leave-meeting-gray-button"
                              text="Cancel"
                              onClick={closeVideoPanel}
                            />
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                      callerID === currentUserID) ||
                    callerID === 0 ? (
                    <Tooltip placement="bottomLeft" title={t("End-call")}>
                      <div className="minimize inactive-state">
                        <img
                          src={CallEndRedIcon}
                          onClick={openVideoPanel}
                          alt="End Call"
                          className="cursor-pointer"
                        />
                      </div>
                    </Tooltip>
                  ) : videoFeatureReducer.LeaveCallModalFlag === false &&
                    callerID !== currentUserID ? (
                    <Tooltip placement="bottomLeft" title={t("End-call")}>
                      <img
                        src={CallEndRedIcon}
                        onClick={minimizeEndCallParticipant}
                        alt="End Call"
                        className="cursor-pointer"
                      />
                    </Tooltip>
                  ) : null}
                </div>
                <div>
                  <Tooltip placement="bottomLeft" title={t("Normalize-screen")}>
                    <div
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : "minimize inactive-state"
                      }
                    >
                      <img
                        src={MinToNormalIcon}
                        onClick={normalizePanel}
                        className="min-to-normal-icon cursor-pointer"
                        alt="Normalize Panel"
                      />
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip placement="bottomLeft" title={t("Maximize-screen")}>
                    <div
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? "minimize grayScaleImage"
                          : "minimize inactive-state"
                      }
                    >
                      <img
                        src={ExpandIcon}
                        onClick={maximizePanel}
                        className="min-to-max-icon cursor-pointer"
                        alt="Maximize"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default VideoCallMinimizeHeader;
