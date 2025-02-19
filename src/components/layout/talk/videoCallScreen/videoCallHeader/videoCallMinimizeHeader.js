import React, { useState, useRef, useEffect, useContext } from "react";
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
  leavePresenterViewMainApi,
  stopPresenterViewMainApi,
  presenterViewGlobalState,
  participantPopup,
  setRaisedUnRaisedParticiant,
  leaveMeetingVideoOnlogout,
  leaveMeetingOnlogout,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
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
import StopMinPresenter from "../../../../../assets/images/Recent Activity Icons/Video/StopMinPresenter.png";
import CopyLinkWhite from "../../../../../assets/images/Recent Activity Icons/Video/CopyLinkWhite.png";
import CopyLink from "./../../talk-Video/video-images/Copy Link Purple.svg";

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
import { MeetingContext } from "../../../../../context/MeetingContext";

const VideoCallMinimizeHeader = ({ screenShareButton }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const participantPopupDisable = useRef(null);

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );
  const { editorRole } = useContext(MeetingContext);
  // const { isMeeting } = useMeetingContext();

  const leaveModalPopupRef = useRef(null);
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
  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  //Audio Control For host
  const audioControl = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  //Video Control For host
  const videoControl = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );
  const presenterStartedFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterStartedFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );
  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag
  );
  console.log(
    { presenterViewFlag, presenterViewHostFlag },
    "presenterViewFlagpresenterViewHostFlag"
  );

  const meetingHostData = JSON.parse(localStorage.getItem("meetinHostInfo"));
  console.log(meetingHostData, "meetingHostDatameetingHostData");
  console.log(LeaveCallModalFlag, "LeaveCallModalFlag");

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
    console.log("busyCall");
    dispatch(leaveCallModal(true));
    // localStorage.setItem('activeCall', false)
  };

  // this handler is for close participant

  const closeParticipantHandler = () => {
    if (LeaveCallModalFlag === false) {
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
  function leaveSuccess() {
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
  }
  // this is for leave call group API
  async function handlePresenterViewFunc() {
    console.log(presenterViewFlag, "presenterViewFlag");
    console.log("busyCall");

    // if (Number(currentMeetingID) !== Number(presenterMeetingId)) {
    //   leaveSuccess();
    //   return;
    // }
    console.log("busyCall");

    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let participantUID = localStorage.getItem("participantUID");
    let isGuid = localStorage.getItem("isGuid");

    if (presenterViewHostFlag) {
      console.log("busyCall");
      console.log(presenterViewHostFlag, "presenterViewHostFlag");

      if (presenterViewJoinFlag) {
        console.log(presenterViewJoinFlag, "presenterViewJoinFlag");
        // Stop presenter view
        if (presenterStartedFlag) {
          let data = {
            MeetingID: currentMeetingID,
            RoomID: callAcceptedRoomID,
          };
          sessionStorage.setItem("StopPresenterViewAwait", true);
          console.log(data, "presenterViewJoinFlag");
          dispatch(stopPresenterViewMainApi(navigate, t, data, 0));
        } else {
          if (alreadyInMeetingVideo) {
            sessionStorage.removeItem("alreadyInMeetingVideo");
            await dispatch(presenterViewGlobalState(0, false, false, false));
            dispatch(maximizeVideoPanelFlag(false));
            dispatch(normalizeVideoPanelFlag(true));
            dispatch(minimizeVideoPanelFlag(false));
          } else {
            let meetingTitle = localStorage.getItem("meetingTitle");
            let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
            let isMeetingVideoHostCheck = JSON.parse(
              localStorage.getItem("isMeetingVideoHostCheck")
            );
            let participantUID = localStorage.getItem("participantUID");
            let isGuid = localStorage.getItem("isGuid");
            let data = {
              RoomID: String(callAcceptedRoomID),
              UserGUID: String(
                isMeetingVideoHostCheck ? isGuid : participantUID
              ),
              Name: String(meetingTitle),
            };
            dispatch(leavePresenterViewMainApi(navigate, t, data, 2));
          }
        }
      }
    } else {
      console.log("busyCall");

      if (presenterViewJoinFlag) {
        // Leave presenter view
        if (alreadyInMeetingVideo) {
          sessionStorage.removeItem("alreadyInMeetingVideo");
          await dispatch(presenterViewGlobalState(0, false, false, false));
          dispatch(maximizeVideoPanelFlag(false));
          dispatch(normalizeVideoPanelFlag(true));
          dispatch(minimizeVideoPanelFlag(false));
        } else {
          let data = {
            RoomID: String(callAcceptedRoomID),
            UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
            Name: String(meetingTitle),
          };

          dispatch(leavePresenterViewMainApi(navigate, t, data, 1));
        }
      }
    }

    leaveSuccess();
  }
  let newName = localStorage.getItem("name");
  let currentMeetingID = JSON.parse(localStorage.getItem("currentMeetingID"));

  const minimizeEndCallParticipant = async (flag, flag2, flag3) => {
    console.log("LeaveCallModalFlag");
    // try {
    //   if (iframeCurrent && iframeCurrent.contentWindow !== null) {
    //     console.log("busyCall");

    //     iframeCurrent.contentWindow.postMessage("leaveSession", "*");
    //     await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
    //   }
    // } catch (error) {}
    if (isMeeting === true) {
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );

      const meetHostFlag = localStorage.getItem("meetinHostInfo");
      console.log(meetHostFlag, "meetHostFlagmeetHostFlag");
      if (presenterViewFlag) {
        console.log("Check Presenter");
        handlePresenterViewFunc();
      } else if (meetingHostData.isDashboardVideo) {
        let Data = {
          RoomID: String(
            isMeetingVideoHostCheck ? newRoomID : participantRoomIds
          ),
          UserGUID: String(
            isMeetingVideoHostCheck ? newUserGUID : participantUID
          ),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        await dispatch(LeaveMeetingVideo(Data, navigate, t));
        leaveSuccess();
      }
    } else if (meetingHostData.isDashboardVideo === false) {
      console.log("leaveCallleaveCallleaveCallleaveCall");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateRoomID,
        IsCaller: true,
        CallTypeID: currentCallType,
      };
      await dispatch(LeaveCall(Data, navigate, t));
      leaveSuccess();
      console.log("Not End 1");
    }
    // dispatch(LeaveCall(Data, navigate, t));

    if (flag) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingVideoOnlogout(false));
      dispatch(leaveMeetingOnlogout(true));
    }
    if (flag2) {
      console.log("mqtt mqmqmqmqmqmq");
      dispatch(endMeetingStatusForQuickMeetingVideo(false));
      dispatch(endMeetingStatusForQuickMeetingModal(true));
    }
    if (flag3) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingVideoOnEndStatusMqtt(false));
      dispatch(leaveMeetingOnEndStatusMqtt(true));
    }
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
    console.log("Check Minimize");
    console.log(status ? "Enable Video" : "Disable Video");
    localStorage.setItem("VidOff", status);
    setLocalVidStatus(status);
  };

  useEffect(() => {
    try {
      if (
        callerObject !== undefined &&
        (callerObject !== null) & (callerObject?.length > 0)
      ) {
        let callerObjectObj = JSON.parse(callerObject);
        setParticipantStatus((prevStatus) => [callerObjectObj, ...prevStatus]);
      }
    } catch {}
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
    // const flag = audioControl;
    console.log("videoHideUnHideForHost", flag);

    // Prepare data for the API request
    let data = {
      RoomID: String(presenterViewFlag ? roomID : newRoomID),
      IsMuted: flag,
      UID: String(
        presenterViewFlag
          ? meetingHostData.isHost
            ? newUserGUID
            : participantUID
          : meetingHostData.isHost
          ? newUserGUID
          : participantUID
      ),
    };

    // Dispatch the API request with the data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 1));
  };

  const videoHideUnHideForHost = (flag) => {
    // Set the HideVideo flag based on videoControl
    // const flag = videoControl;
    console.log("videoHideUnHideForHost", flag);
    // Prepare data for the API request
    let data = {
      RoomID: String(presenterViewFlag ? roomID : newRoomID),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(
        presenterViewFlag
          ? meetingHostData.isHost
            ? newUserGUID
            : participantUID
          : meetingHostData.isHost
          ? newUserGUID
          : participantUID
      ),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 1));
  };

  const muteUnMuteForParticipant = (flag) => {
    // const flag = audioControl;

    let data = {
      RoomID: String(participantRoomIds),
      IsMuted: flag,
      UID: String(
        presenterViewFlag
          ? meetingHostData.isHost
            ? newUserGUID
            : participantUID
          : meetingHostData.isHost
          ? newUserGUID
          : participantUID
      ),
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 2));
  };

  const videoHideUnHideForParticipant = (flag) => {
    // Prepare data for the API request
    let data = {
      RoomID: String(participantRoomIds),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(
        presenterViewFlag
          ? meetingHostData.isHost
            ? newUserGUID
            : participantUID
          : meetingHostData.isHost
          ? newUserGUID
          : participantUID
      ),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 2));
  };

  let alreadyInMeetingVideo = JSON.parse(
    sessionStorage.getItem("alreadyInMeetingVideo")
      ? sessionStorage.getItem("alreadyInMeetingVideo")
      : false
  );

  const minimizeStopPresenter = () => {
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

    if (presenterViewHostFlag) {
      let data = {
        MeetingID: currentMeetingID,
        RoomID: callAcceptedRoomID,
      };
      sessionStorage.setItem("StopPresenterViewAwait", true);
      console.log(data, "presenterViewJoinFlag");
      dispatch(stopPresenterViewMainApi(navigate, t, data, 0));
      console.log("busyCall");
      console.log(presenterViewHostFlag, "presenterViewHostFlag");
    } else {
      if (alreadyInMeetingVideo) {
        dispatch(presenterViewGlobalState(0, true, false, false));
        dispatch(maximizeVideoPanelFlag(false));
        dispatch(normalizeVideoPanelFlag(false));
        dispatch(minimizeVideoPanelFlag(false));
      } else {
        let meetingTitle = localStorage.getItem("meetingTitle");
        let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
        let isMeetingVideoHostCheck = JSON.parse(
          localStorage.getItem("isMeetingVideoHostCheck")
        );
        let participantUID = localStorage.getItem("participantUID");
        let isGuid = localStorage.getItem("isGuid");
        let data = {
          RoomID: String(callAcceptedRoomID),
          UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
          Name: String(meetingTitle),
        };
        dispatch(leavePresenterViewMainApi(navigate, t, data, 1));
      }
    }
  };

  return (
    <>
      <div className="videoCallGroupScreen-minmizeVideoCall">
        <Row className="m-0 height100 align-items-center">
          <Col
            lg={6}
            md={6}
            sm={12}
            className={
              meetingTitle === "" ? "cursor-pointer" : "mt-1 cursor-pointer"
            }
            onClick={() => {
              dispatch(normalizeVideoPanelFlag(true));
              dispatch(minimizeVideoPanelFlag(false));
            }}
          >
            <p className="title-heading">
              {currentCallType === 2 || callTypeID === 2
                ? meetingTitle === ""
                  ? t("Group-call")
                  : meetingTitle
                : currentUserName !==
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

          <Col lg={6} md={6} sm={12}>
            <div className="d-flex gap-10 justify-content-end">
              {presenterViewFlag && presenterViewHostFlag && (
                <div onClick={minimizeStopPresenter}>
                  <Tooltip placement="topRight" title={t("Stop-presenting")}>
                    <img src={StopMinPresenter} alt="Video" />
                  </Tooltip>
                </div>
              )}
              <div
                className={
                  LeaveCallModalFlag === true
                    ? "minimize grayScaleImage"
                    : !localMicStatus
                    ? "minimize for-host-active-state-minimize"
                    : "minimize inactive-state"
                }
              >
                <Tooltip
                  placement="topRight"
                  title={
                    (meetingHostData?.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)) &&
                    meetingHostData?.isDashboardVideo
                      ? audioControl
                        ? t("Enable-mic")
                        : t("Disable-mic")
                      : meetingHostData?.isDashboardVideo
                      ? audioControl
                        ? t("Enable-mic")
                        : t("Disable-mic")
                      : localMicStatus
                      ? t("Disable-mic")
                      : t("Enable-mic")
                  }
                >
                  <img
                    src={
                      (meetingHostData?.isHost ||
                        (presenterViewFlag && presenterViewHostFlag)) &&
                      meetingHostData?.isDashboardVideo
                        ? audioControl
                          ? MicOffHost
                          : MicOn
                        : meetingHostData?.isDashboardVideo
                        ? audioControl
                          ? MicOffHost
                          : MicOn
                        : localMicStatus
                        ? MicOn
                        : MicOff
                    }
                    onClick={() => {
                      if (
                        (meetingHostData?.isHost ||
                          (presenterViewFlag && presenterViewHostFlag)) &&
                        meetingHostData?.isDashboardVideo
                      ) {
                        muteUnMuteForHost(audioControl ? false : true);
                      } else if (meetingHostData?.isDashboardVideo) {
                        muteUnMuteForParticipant(audioControl ? false : true);
                      } else {
                        toggleMic(!localMicStatus);
                      }
                    }}
                    alt="Mic"
                  />
                </Tooltip>
              </div>
              <div
                className={
                  LeaveCallModalFlag === true
                    ? "minimize grayScaleImage"
                    : !localVidStatus
                    ? "minimize for-host-active-state-minimize"
                    : "minimize inactive-state"
                }
              >
                <Tooltip
                  placement="topRight"
                  title={
                    (meetingHostData?.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)) &&
                    meetingHostData?.isDashboardVideo
                      ? videoControl
                        ? t("Disable-video")
                        : t("Enable-video")
                      : meetingHostData?.isDashboardVideo
                      ? videoControl
                        ? t("Disable-video")
                        : t("Enable-video")
                      : localVidStatus
                      ? t("Disable-video")
                      : t("Enable-video")
                  }
                >
                  <img
                    src={
                      (meetingHostData?.isHost ||
                        (presenterViewFlag && presenterViewHostFlag)) &&
                      meetingHostData?.isDashboardVideo
                        ? videoControl
                          ? VideoOffHost
                          : VideoOn
                        : meetingHostData?.isDashboardVideo
                        ? videoControl
                          ? VideoOffHost
                          : VideoOn
                        : localVidStatus
                        ? VideoOn
                        : VideoOff
                    }
                    onClick={() => {
                      if (
                        (meetingHostData?.isHost ||
                          (presenterViewFlag && presenterViewHostFlag)) &&
                        meetingHostData?.isDashboardVideo
                      ) {
                        videoHideUnHideForHost(videoControl ? false : true);
                      } else if (meetingHostData?.isDashboardVideo) {
                        videoHideUnHideForParticipant(
                          videoControl ? false : true
                        );
                      } else {
                        toggleVideo(!localVidStatus);
                      }
                    }}
                    alt="Video"
                  />
                </Tooltip>
              </div>
              {presenterViewFlag && !activeCall && (
                <Tooltip placement="topRight" title={t("Participants")}>
                  <div className={"grayScaleImage"}>
                    <img src={ParticipantIcon} alt="Participants" />
                  </div>
                </Tooltip>
              )}

              {(meetingHostData?.isHost ||
                (presenterViewFlag && presenterViewHostFlag)) &&
                meetingHostData?.isDashboardVideo && (
                  <Tooltip placement="topRight" title={t("Copy-link")}>
                    <div className={"grayScaleImage"}>
                      <img src={CopyLink} alt="Copy Link" />
                    </div>
                  </Tooltip>
                )}

              {/* {callerID === currentUserID &&
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
                  ) : null} */}
              {console.log("LeaveCallModalFlag 1", callerID, currentUserID)}
              {(!presenterViewFlag ||
                (activeCall && currentCallType === 1)) && (
                <div className="position-relative">
                  {LeaveCallModalFlag === true && callerID === currentUserID ? (
                    <>
                      {console.log(
                        "LeaveCallModalFlagv2",
                        callerID,
                        currentUserID
                      )}
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
                      {LeaveCallModalFlag === true ? (
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
                  ) : (LeaveCallModalFlag === false &&
                      callerID === currentUserID) ||
                    callerID === 0 ? (
                    <Tooltip placement="bottomLeft" title={t("End-call")}>
                      {console.log(
                        "LeaveCallModalFlag 3",
                        callerID,
                        currentUserID
                      )}
                      <div className="minimize inactive-state">
                        <img
                          src={CallEndRedIcon}
                          onClick={openVideoPanel}
                          alt="End Call"
                          className="cursor-pointer"
                        />
                      </div>
                    </Tooltip>
                  ) : LeaveCallModalFlag === false &&
                    callerID !== currentUserID ? (
                    <Tooltip placement="bottomLeft" title={t("End-call")}>
                      {console.log(
                        "LeaveCallModalFlag 4",
                        callerID,
                        currentUserID
                      )}
                      <img
                        src={CallEndRedIcon}
                        onClick={() =>
                          minimizeEndCallParticipant(false, false, false, false)
                        }
                        alt="End Call"
                        className="cursor-pointer"
                      />
                    </Tooltip>
                  ) : (
                    <>
                      {" "}
                      {console.log(
                        "LeaveCallModalFlag 6",
                        callerID,
                        currentUserID
                      )}
                    </>
                  )}
                </div>
              )}

              {(!presenterViewFlag ||
                (activeCall && currentCallType === 1)) && (
                <div>
                  <Tooltip placement="bottomLeft" title={t("Normalize-screen")}>
                    <div
                      className={
                        LeaveCallModalFlag === true
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
              )}

              <div>
                <Tooltip placement="bottomLeft" title={t("Maximize-screen")}>
                  <div
                    className={
                      LeaveCallModalFlag === true
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
      <div ref={leaveModalPopupRef}>
        {LeaveCallModalFlag === true ? (
          <div className="minimize-leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              {meetingHostData?.isDashboardVideo ? (
                <>
                  <Button
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    text={
                      presenterViewFlag && presenterViewHostFlag
                        ? t("Stop-presenting")
                        : presenterViewFlag && !presenterViewHostFlag
                        ? t("Leave-presenting")
                        : t("Leave-call")
                    }
                    onClick={() =>
                      minimizeEndCallParticipant(false, false, false, false)
                    }
                  />

                  <Button
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    text="Cancel"
                    onClick={closeVideoPanel}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoCallMinimizeHeader;
