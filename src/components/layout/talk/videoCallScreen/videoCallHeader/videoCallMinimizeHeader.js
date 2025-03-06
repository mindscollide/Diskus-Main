import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Dropdown } from "react-bootstrap";
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
  setVideoControlHost,
  setAudioControlHost,
} from "../../../../../store/actions/VideoFeature_actions";
import AddParticipant from "./../../talk-Video/video-images/Add Participant Purple.svg";
import ExpandIcon from "./../../talk-Video/video-images/Expand White.svg";
import MinToNormalIcon from "./../../talk-Video/video-images/Half Video Screen.svg";
import NonActiveScreenShare from "./../../talk-Video/video-images/Screen Share Purple.svg";
import ShareScreenWhite from "../../../../../assets/images/Recent Activity Icons/Video/ShareScreenWhite.png";

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
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
import CopyLink from "./../../talk-Video/video-images/Copy Link Purple.svg";
import Menu from "./../../talk-Video/video-images/Menu.png";
import GoldenHandRaised from "./../../talk-Video/video-images/GoldenHandRaised.png";
import MenuRaiseHand from "./../../talk-Video/video-images/Menu-RaiseHand.png";

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
  getMeetingGuestVideoMainApi,
  hideUnhideSelfMainApi,
  muteUnMuteSelfMainApi,
} from "../../../../../store/actions/Guest_Video";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";

const VideoCallMinimizeHeader = ({ screenShareButton, isScreenActive }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const participantPopupDisable = useRef(null);

  const {
    editorRole,
    presenterParticipantList,
    setPresenterParticipantList,
    setShareScreenTrue,
    setToggleMicMinimizeNonMeeting,
    setToggleVideoMinimizeNonMeeting,
  } = useContext(MeetingContext);

  const leaveModalPopupRef = useRef(null);
  // state for participants
  const [currentParticipants, setCurrentParticipants] = useState([]);

  const [participantStatus, setParticipantStatus] = useState([]);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  const [localMicStatus, setLocalMicStatus] = useState(micStatus);
  const [localVidStatus, setLocalVidStatus] = useState(vidStatus);
  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  let newRoomID = localStorage.getItem("newRoomId");
  let newUserGUID = localStorage.getItem("isGuid");
  let participantUID = localStorage.getItem("participantUID");
  let currentUserName = localStorage.getItem("name");
  let callerName = localStorage.getItem("callerName");
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem("initiateVideoCall")
  );
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let callerID = Number(localStorage.getItem("callerID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let callerObject = localStorage.getItem("callerStatusObject");
  let currentCallType = Number(localStorage.getItem("CallType"));
  let meetingTitle = localStorage.getItem("meetingTitle");
  let activeCall = JSON.parse(localStorage.getItem("activeCall"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let participantRoomId = localStorage.getItem("participantRoomId");
  let isGuid = localStorage.getItem("isGuid");
  let newName = localStorage.getItem("name");
  let currentMeetingID = JSON.parse(localStorage.getItem("currentMeetingID"));

  // Prepare data for the API request

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );

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

  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom
  );
  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
  let activeRoomID = localStorage.getItem("activeRoomID");
  let RoomID =
    presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
      ? roomID
      : isMeetingVideo
      ? isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId
      : initiateCallRoomID
      ? initiateCallRoomID
      : activeRoomID;
  let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
  const meetingHostData = JSON.parse(localStorage.getItem("meetinHostInfo"));

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
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
    console.log("busyCall");
    let alreadyInMeetingVideo = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideo")
        ? sessionStorage.getItem("alreadyInMeetingVideo")
        : false
    );
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
              Name: String(currentUserName),
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
            RoomID: String(RoomID),
            UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
            Name: String(currentUserName),
          };

          dispatch(leavePresenterViewMainApi(navigate, t, data, 1));
        }
      }
    }

    leaveSuccess();
  }

  const minimizeEndCallParticipant = async (flag, flag2, flag3, flag4) => {
    console.log("busyCall");

    if (isMeeting === true) {
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );

      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        console.log("busyCall");
        handlePresenterViewFunc();
      } else if (meetingHostData.isDashboardVideo) {
        console.log("busyCall");
        let Data = {
          RoomID: String(RoomID),
          UserGUID: String(
            isMeetingVideoHostCheck ? newUserGUID : participantUID
          ),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        await dispatch(LeaveMeetingVideo(Data, navigate, t));
        leaveSuccess();
      } else if (meetingHostData.isDashboardVideo === false) {
        console.log("busyCall");
        let Data = {
          OrganizationID: currentOrganization,
          RoomID: RoomID,
          IsCaller: JSON.parse(localStorage.getItem("isCaller")),
          CallTypeID: currentCallType,
        };
        await dispatch(LeaveCall(Data, navigate, t));
        leaveSuccess();
      }
    } else if (meetingHostData.isDashboardVideo === false) {
      console.log("busyCall");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: RoomID,
        IsCaller: JSON.parse(localStorage.getItem("isCaller")),
        CallTypeID: currentCallType,
      };
      await dispatch(LeaveCall(Data, navigate, t));
      leaveSuccess();
    }

    if (flag) {
      console.log("busyCall");
      await dispatch(leaveMeetingVideoOnlogout(false));
      dispatch(leaveMeetingOnlogout(true));
    }
    if (flag2) {
      console.log("busyCall");
      dispatch(endMeetingStatusForQuickMeetingVideo(false));
      dispatch(endMeetingStatusForQuickMeetingModal(true));
    }
    if (flag3) {
      console.log("busyCall");
      await dispatch(leaveMeetingVideoOnEndStatusMqtt(false));
      dispatch(leaveMeetingOnEndStatusMqtt(true));
    }
  };

  const cancelLeaveCallOption = () => {
    console.log("busyCall");
    dispatch(leaveCallModal(false));
  };

  const minimizeLeaveCall = () => {
    console.log("busyCall");
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: RoomID,
      IsCaller: JSON.parse(localStorage.getItem("isCaller")),
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    const emptyArray = [];
    setParticipantStatus([]);
    localStorage.setItem("isCaller", false);
    localStorage.setItem("activeCall", false);
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    localStorage.setItem("activeCall", false);
    localStorage.setItem("isMeetingVideo", false);
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    dispatch(minimizeParticipantPopup(false));
  };

  const toggleMic = (status) => {
    console.log("VidOn");
    setToggleMicMinimizeNonMeeting(true);
    setLocalMicStatus(status);
  };

  const toggleVideo = (status) => {
    setToggleVideoMinimizeNonMeeting(true);
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
    dispatch(setAudioControlHost(flag));

    // Prepare data for the API request
    let data = {
      RoomID: String(RoomID),
      IsMuted: flag,
      UID: String(UID),
      MeetingID: Number(currentMeetingID),
    };

    // Dispatch the API request with the data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 1));
  };

  const videoHideUnHideForHost = (flag) => {
    // Set the HideVideo flag based on videoControl
    dispatch(setVideoControlHost(flag));
    console.log("videoHideUnHideForHost", flag);

    let data = {
      RoomID: String(RoomID),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(UID),
      MeetingID: Number(currentMeetingID),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 1));
  };

  const muteUnMuteForParticipant = (flag) => {
    // const flag = audioControl;
    dispatch(setAudioControlHost(flag));

    let data = {
      RoomID: String(RoomID),
      IsMuted: flag,
      UID: String(UID),
      MeetingID: Number(currentMeetingID),
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data, 2));
  };

  const videoHideUnHideForParticipant = (flag) => {
    // Prepare data for the API request
    dispatch(setVideoControlHost(flag));

    let data = {
      RoomID: String(RoomID),
      HideVideo: flag, // Set HideVideo to true or false
      UID: String(UID),
      MeetingID: Number(currentMeetingID),
    };

    // Dispatch the API request with the data
    dispatch(hideUnhideSelfMainApi(navigate, t, data, 2));
  };

  const minimizeStopPresenter = () => {
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
    let alreadyInMeetingVideo = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideo")
        ? sessionStorage.getItem("alreadyInMeetingVideo")
        : false
    );
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
        let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
        let isMeetingVideoHostCheck = JSON.parse(
          localStorage.getItem("isMeetingVideoHostCheck")
        );
        let participantUID = localStorage.getItem("participantUID");
        let isGuid = localStorage.getItem("isGuid");
        let data = {
          RoomID: String(callAcceptedRoomID),
          UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
          Name: String(currentUserName),
        };
        dispatch(leavePresenterViewMainApi(navigate, t, data, 1));
      }
    }
  };

  const copyToClipboardd = () => {
    let data = {
      MeetingId: Number(currentMeetingID),
    };
    dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
    setOpen({
      ...open,
      flag: true,
      message: t("Generating-meeting-link"),
    });
    setTimeout(() => {
      setOpen({
        ...open,
        flag: false,
        message: "",
      });
    }, 3000);
  };

  const openPresenterParticipantsList = () => {
    setPresenterParticipantList(!presenterParticipantList);
  };

  const handleScreenShareButton = async () => {
    setShareScreenTrue(true);
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
                <div onClick={minimizeStopPresenter} className="cursor-pointer">
                  <Tooltip placement="topRight" title={t("Stop-presentation")}>
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
                      meetingHostData?.isDashboardVideo
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
              {checkFeatureIDAvailability(5) && (
                <div
                  className={
                    LeaveCallModalFlag === true ||
                    (isZoomEnabled && disableBeforeJoinZoom)
                      ? "grayScaleImage"
                      : presenterViewFlag && presenterViewHostFlag
                      ? "presenterImage"
                      : presenterViewFlag && presenterViewJoinFlag
                      ? "presenterImage"
                      : "screenShare-Toggle inactive-state"
                  }
                >
                  <Tooltip
                    placement="topRight"
                    title={
                      isScreenActive ||
                      (presenterViewFlag && presenterViewHostFlag)
                        ? t("Stop-sharing")
                        : t("Screen-share")
                    }
                  >
                    <img
                      onClick={
                        !presenterViewHostFlag ? handleScreenShareButton : null
                      }
                      src={ShareScreenWhite}
                      alt="Screen Share"
                    />
                  </Tooltip>
                </div>
              )}
              {presenterViewFlag &&
                !JSON.parse(localStorage.getItem("activeCall")) && (
                  <Tooltip placement="topRight" title={t("Participants")}>
                    <div className={"grayScaleImage"}>
                      <img
                        src={ParticipantIcon}
                        alt="Participants"
                        onClick={openPresenterParticipantsList}
                      />
                    </div>

                    <div className={"position-relative"}>
                      {presenterParticipantList && (
                        <>
                          <div
                            className={"presenter-participants-minimize-list"}
                          >
                            <div className="background-color-for-list">
                              <Row>
                                <Col lg={6} md={6} sm={12}>
                                  <p className="Waiting-New-Participant-Hosts-Title">
                                    {t("Participants")}
                                  </p>
                                </Col>
                                <Col
                                  lg={6}
                                  md={6}
                                  sm={12}
                                  className="d-flex justify-content-end"
                                >
                                  <Button
                                    text={t("Mute-all")}
                                    className="Waiting-New-Participant-muteAll"
                                  />
                                </Col>
                              </Row>

                              <Row className="mt-4">
                                <Col
                                  lg={9}
                                  md={9}
                                  sm={12}
                                  className="d-flex justify-content-start gap-2"
                                >
                                  <p>Asad Jaffri</p>

                                  <img
                                    src={Raisehandselected}
                                    alt="Mic"
                                    width="19px"
                                    height="21px"
                                  />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={12}
                                  className="d-flex justify-content-end gap-2"
                                >
                                  <img
                                    src={MicOffHost}
                                    alt="Mic"
                                    width="22px"
                                    height="22px"
                                  />
                                  <img
                                    src={VideoOffHost}
                                    alt="RaiseHand"
                                    width="22px"
                                    height="22px"
                                  />
                                  <Dropdown>
                                    <Dropdown.Toggle className="participant-toggle">
                                      <img
                                        draggable="false"
                                        src={Menu}
                                        alt=""
                                      />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                      <>
                                        <Dropdown.Item className="participant-dropdown-item">
                                          {t("Remove")}
                                        </Dropdown.Item>
                                        <Dropdown.Item className="participant-dropdown-item">
                                          {t("Hide-video")}
                                        </Dropdown.Item>
                                      </>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Tooltip>
                )}

              {((meetingHostData?.isHost&&!presenterViewHostFlag&&!presenterViewJoinFlag) ||
                (presenterViewFlag && presenterViewHostFlag)) &&
                meetingHostData?.isDashboardVideo && (
                  <Tooltip placement="topRight" title={t("Copy-link")}>
                    <div
                      className={
                        LeaveCallModalFlag
                          ? "grayScaleImage"
                          : "screenShare-Toggle inactive-state"
                      }
                    >
                      <img
                        src={CopyLinkWhite}
                        onClick={copyToClipboardd}
                        alt="Copy Link"
                      />
                    </div>
                  </Tooltip>
                )}
              {/* {(!presenterViewFlag || */}
              {/* {activeCall && currentCallType === 1 && ( */}
              <div className="position-relative">
                {LeaveCallModalFlag === true &&
                callerID === currentUserID &&
                !presenterViewHostFlag &&
                !presenterViewJoinFlag ? (
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
                    {LeaveCallModalFlag === true && (
                      <div className="minimize-leave-meeting-options leave-meeting-options-position">
                        <div className="leave-meeting-options__inner">
                          {(currentCallType === 1 || currentCallType === 2) && (
                            <Button
                              className="leave-meeting-options__btn leave-meeting-red-button"
                              text={
                                isMeetingVideo
                                  ? t("Leave-meeting-video-call")
                                  : t("End-call")
                              }
                              onClick={() =>
                                minimizeEndCallParticipant(
                                  false,
                                  false,
                                  false,
                                  false
                                )
                              }
                            />
                          )}
                          {presenterViewFlag &&
                            !presenterViewHostFlag &&
                            !presenterViewJoinFlag &&
                            currentCallType === 2 &&
                            activeCall && (
                              <Button
                                className="leave-meeting-options__btn leave-meeting-gray-button"
                                text={
                                  currentCallType === 2 &&
                                  t("End-call-for-everyone")
                                }
                                onClick={minimizeLeaveCall}
                              />
                            )}
                          <Button
                            className="leave-meeting-options__btn leave-meeting-gray-button"
                            text="Cancel"
                            onClick={closeVideoPanel}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : ((LeaveCallModalFlag === false &&
                    callerID === currentUserID) ||
                    callerID === 0) &&
                  !presenterViewHostFlag &&
                  !presenterViewJoinFlag ? (
                  <Tooltip
                    placement="bottomLeft"
                    title={
                      isMeetingVideo
                        ? t("Leave-meeting-video-call")
                        : t("End-call")
                    }
                  >
                    <div className="minimize inactive-state">
                      <img
                        src={CallEndRedIcon}
                        onClick={openVideoPanel}
                        alt="End Call"
                        className="cursor-pointer"
                      />
                    </div>
                  </Tooltip>
                ) : (
                  LeaveCallModalFlag === false &&
                  callerID !== currentUserID &&
                  !presenterViewHostFlag &&
                  !presenterViewJoinFlag && (
                    <Tooltip
                      placement="bottomLeft"
                      title={
                        isMeetingVideo
                          ? t("Leave-meeting-video-call")
                          : t("End-call")
                      }
                    >
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
                  )
                )}
              </div>
              {/* )} */}

              {((!presenterViewHostFlag && !presenterViewJoinFlag) ||
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
      {/* <div ref={leaveModalPopupRef}>
        {LeaveCallModalFlag === true && (
          <div className="minimize-leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              {meetingHostData?.isDashboardVideo ? (
                <>
                  <Button
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    text={
                      presenterViewFlag && presenterViewHostFlag
                        ? t("Stop-presentation")
                        : presenterViewFlag && !presenterViewHostFlag
                        ? t("Leave-presentation")
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
                  {currentCallType === 1 && (
                    <Button
                      className="leave-meeting-options__btn leave-meeting-red-button"
                      text={t("Leave-call")}
                      onClick={minimizeLeaveCall}
                    />
                  )}
                  {currentCallType === 2 && (
                    <Button
                      className="leave-meeting-options__btn leave-meeting-gray-button"
                      text={currentCallType === 2 && t("End-call-for-everyone")}
                      onClick={minimizeLeaveCall}
                    />
                  )}

                  <Button
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    text="Cancel"
                    onClick={closeVideoPanel}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div> */}
    </>
  );
};

export default VideoCallMinimizeHeader;
