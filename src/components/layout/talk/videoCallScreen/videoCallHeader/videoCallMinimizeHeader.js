import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Dropdown } from "react-bootstrap";
import { Button, Notification } from "./../../../../elements";
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
  presenterLeaveParticipant,
  updatedParticipantListForPresenter,
  presenterNewParticipantJoin,
  muteUnMuteParticipantMainApi,
  hideUnHideParticipantGuestMainApi,
  screenShareTriggeredGlobally,
  isSharedScreenTriggeredApi,
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
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
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
import VideoDisable from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import MicDisabled from "./../../talk-Video/video-images/MicOffDisabled.png";
import MicOnEnabled from "./../../talk-Video/video-images/MicOnEnabled.png";
import VideoOff from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import ChatIcon from "./../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../talk-Video/video-images/Collapse.svg";
import ParticipantIcon from "./../../talk-Video/video-images/Users White.svg";
import ActiveParticipantIcon from "./../../talk-Video/video-images/Users Purple.svg";
import ParticipantsIcon from "./../../talk-Video/video-images/Users Purple.svg";
import StartRecordLarge from "../../../../../assets/images/Recent Activity Icons/Video/StartRecordLarge.png";
import StartRecordSmall from "../../../../../assets/images/Recent Activity Icons/Video/StartRecordSmall.png";
import RecordStart from "../../../../../assets/images/Recent Activity Icons/Video/RecordStart.png";
import RecordPlay from "../../../../../assets/images/Recent Activity Icons/Video/RecordPlay.png";

import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import {
  getMeetingGuestVideoMainApi,
  hideUnhideSelfMainApi,
  muteUnMuteSelfMainApi,
  removeParticipantMeetingMainApi,
  transferMeetingHostMainApi,
} from "../../../../../store/actions/Guest_Video";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";
import { showMessage } from "../../../../elements/snack_bar/utill";

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
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setStopRecordingState,
    iframeRef,
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

  const [filteredParticipants, setFilteredParticipants] = useState([]);
  console.log(filteredParticipants, "filteredParticipants");

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
  let currentMeetingID = localStorage.getItem("currentMeetingID");
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));

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

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  const newJoinPresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.newJoinPresenterParticipant
  );

  const leavePresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterParticipant
  );

  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare
  );

  const VideoRecipentData = useSelector(
    (state) => state.VideoMainReducer.VideoRecipentData
  );

  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
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
    setPresenterParticipantList(false);
    dispatch(normalizeVideoPanelFlag(false));
    dispatch(maximizeVideoPanelFlag(true));
    dispatch(minimizeVideoPanelFlag(false));
  };

  const openVideoPanel = () => {
    console.log("busyCall");
    dispatch(leaveCallModal(true));
    // localStorage.setItem('activeCall', false)
  };

  useEffect(() => {
    if (Object.keys(getAllParticipantMain).length) {
      console.log("getAllParticipantMain");
      setFilteredParticipants(getAllParticipantMain);
    } else {
      console.log("getAllParticipantMain");
      setFilteredParticipants([]);
    }
  }, [getAllParticipantMain]);

  useEffect(() => {
    if (
      Object.keys(leavePresenterParticipant).length > 0 &&
      presenterViewFlag &&
      presenterViewHostFlag
    ) {
      // Remove the participant whose guid matches the uid
      const updatedParticipants = filteredParticipants.filter(
        (participant) => participant.guid !== leavePresenterParticipant.uid
      );
      // Update the state with the filtered list
      setFilteredParticipants(updatedParticipants);
      console.log("getAllParticipantMain");
      console.log("filteredParticipants", leavePresenterParticipant);
      dispatch(presenterLeaveParticipant([]));
    }
  }, [leavePresenterParticipant]);

  useEffect(() => {
    console.log("getAllParticipantMain");
    console.log("PRESENTER_JOIN_PARTICIPANT_VIDEO");
    if (
      Object.keys(newJoinPresenterParticipant).length > 0 &&
      presenterViewFlag &&
      presenterViewHostFlag
    ) {
      console.log("PRESENTER_JOIN_PARTICIPANT_VIDEO");
      // Step 1: Remove any existing participant with the same userID or guid
      let dublicateData = [...filteredParticipants];
      const updatedParticipants = dublicateData.filter(
        (participant) =>
          participant.userID !== newJoinPresenterParticipant.userID &&
          participant.guid !== newJoinPresenterParticipant.guid
      );

      // Step 2: Add the new participant
      updatedParticipants.push(newJoinPresenterParticipant);

      // Step 3: Update the state
      console.log("getAllParticipantMain");
      dispatch(updatedParticipantListForPresenter(updatedParticipants));
      dispatch(presenterNewParticipantJoin([]));

      console.log(updatedParticipants);
    }
  }, [newJoinPresenterParticipant]);

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

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      console.log("RecordingStopMsgFromIframe");

      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      let isCaller = JSON.parse(localStorage.getItem("isCaller"));
      let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
      let CallType = Number(localStorage.getItem("CallType"));

      let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
      let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );

      if (isZoomEnabled) {
        const iframe = iframeRef.current;
        console.log("RecordingStopMsgFromIframe");
        const sendMessage = () => {
          if (iframe && iframe?.contentWindow) {
            iframe?.contentWindow?.postMessage(
              "RecordingStopMsgFromIframe",
              "*"
            );
            console.log("RecordingStopMsgFromIframe");
          }

          // Slight delay to allow iframe to process the message
          setTimeout(() => {
            resolve();
          }, 100);
        };

        // Host-specific path
        if (
          isMeeting &&
          isMeetingVideo &&
          isMeetingVideoHostCheck &&
          !presenterViewJoinFlag &&
          !presenterViewHostFlag
        ) {
          setTimeout(sendMessage, 1000); // 1s delay for host
        } else {
          if (isCaller && (CallType === 1 || CallType === 2)) {
            sendMessage(); // Immediate for caller
          } else {
            resolve(); // If none of the conditions matched, resolve immediately
          }
        }
      } else {
        resolve(); // Zoom not enabled, no message needed
      }
    });
  };

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
      } else if (meetingHostData?.isDashboardVideo) {
        console.log("busyCall");

        let isSharedSceenEnable = JSON.parse(
          localStorage.getItem("isSharedSceenEnable")
        );
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            let isMeetingVideoHostCheck = JSON.parse(
              localStorage.getItem("isMeetingVideoHostCheck")
            );
            let roomID = localStorage.getItem("acceptedRoomID");
            let userID = localStorage.getItem("userID");
            let isGuid = localStorage.getItem("isGuid");
            let participantUID = localStorage.getItem("participantUID");
            let participantRoomId = localStorage.getItem("participantRoomId");
            let RoomID = !isMeetingVideo
              ? roomID
              : isMeetingVideo && isMeetingVideoHostCheck
              ? newRoomID
              : participantRoomId;

            let UID = isMeetingVideo
              ? userID
              : isMeetingVideoHostCheck
              ? isGuid
              : participantUID;
            let data = {
              RoomID: RoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }

        //When Recording is On and Host Leave Meeting Video
        if (pauseRecordingState || resumeRecordingState) {
          console.log("Stop Recording Check");
          await onHandleClickForStopRecording();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

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
      } else if (meetingHostData?.isDashboardVideo === false) {
        console.log("busyCall");
        let isCaller = JSON.parse(localStorage.getItem("isCaller"));
        let Data = {
          OrganizationID: currentOrganization,
          RoomID: RoomID,
          IsCaller: isCaller ? true : false,
          CallTypeID: currentCallType,
        };
        await console.log("Check LeaveCall new");
        dispatch(LeaveCall(Data, navigate, t));
        leaveSuccess();
      }
    } else if (meetingHostData?.isDashboardVideo === false) {
      console.log("busyCall");
      let isSharedSceenEnable = JSON.parse(
        localStorage.getItem("isSharedSceenEnable")
      );
      if (isZoomEnabled) {
        if (isSharedSceenEnable && !globallyScreenShare) {
          console.log("busyCall");
          let isMeetingVideoHostCheck = JSON.parse(
            localStorage.getItem("isMeetingVideoHostCheck")
          );
          let roomID = localStorage.getItem("acceptedRoomID");
          let userID = localStorage.getItem("userID");
          let isGuid = localStorage.getItem("isGuid");
          let participantUID = localStorage.getItem("participantUID");
          let participantRoomId = localStorage.getItem("participantRoomId");
          let RoomID = !isMeetingVideo
            ? roomID
            : isMeetingVideoHostCheck
            ? newRoomID
            : participantRoomId;

          let UID = !isMeetingVideo
            ? userID
            : isMeetingVideoHostCheck
            ? isGuid
            : participantUID;
          let data = {
            RoomID: RoomID,
            ShareScreen: false,
            UID: UID,
          };
          dispatch(screenShareTriggeredGlobally(false));
          await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
        }
      }
      let isCaller = JSON.parse(localStorage.getItem("isCaller"));
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: RoomID,
        IsCaller: isCaller ? true : false,
        CallTypeID: currentCallType,
      };
      await console.log("Check LeaveCall new");
      dispatch(LeaveCall(Data, navigate, t));
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
    console.log("Check LeaveCall new");
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
    showMessage(t("Link-copied"), "success", setOpen);
  };

  const openPresenterParticipantsList = () => {
    setPresenterParticipantList(!presenterParticipantList);
  };

  const handleScreenShareButton = async () => {
    setShareScreenTrue(true);
  };

  const makeHostOnClick = async (usersData) => {
    let newRoomId = localStorage.getItem("newRoomId");
    let data = {
      RoomID: String(newRoomId),
      UID: usersData.guid,
      UserID: usersData.userID,
      MeetingID: Number(currentMeetingID),
    };
    dispatch(transferMeetingHostMainApi(navigate, t, data, 1));
  };

  const muteUnmuteByHost = (usersData, flag) => {
    if (usersData) {
      let roomID = localStorage.getItem("acceptedRoomID");
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      let newRoomID = localStorage.getItem("newRoomId");
      let participantRoomId = localStorage.getItem("participantRoomId");
      let RoomID =
        presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
          ? roomID
          : isMeetingVideoHostCheck
          ? newRoomID
          : participantRoomId;
      // Mute/Unmute a specific participant
      console.log("filteredParticipants");
      console.log("getAllParticipantMain");
      setFilteredParticipants((prev) =>
        prev.map((participant) =>
          participant.guid === usersData.guid
            ? { ...participant, mute: flag }
            : participant
        )
      );
      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        // Exclude hosts from muting
        const data = {
          RoomID: RoomID,
          IsMuted: flag,
          isForAll: false,
          MuteUnMuteList: [
            {
              UID: usersData.guid, // The participant's UID
            },
          ],
          MeetingID: Number(currentMeetingID),
        };
        dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
      } else if (!usersData.isHost) {
        // Exclude hosts from muting
        const data = {
          RoomID: RoomID,
          IsMuted: flag,
          isForAll: false,
          MuteUnMuteList: [
            {
              UID: usersData.guid, // The participant's UID
            },
          ],
          MeetingID: Number(currentMeetingID),
        };

        dispatch(muteUnMuteParticipantMainApi(navigate, t, data));
      }
    }
  };

  const hideUnHideVideoParticipantByHost = (usersData, flag) => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let newRoomID = localStorage.getItem("newRoomId");
    let participantRoomId = localStorage.getItem("participantRoomId");
    let RoomID =
      presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
        ? roomID
        : isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId;

    let data = {
      RoomID: RoomID,
      HideVideo: flag,
      UIDList: [usersData.guid],
      MeetingID: Number(currentMeetingID),
    };

    // Update the specific participant's hideCamera state in `newParticipants`
    console.log("getAllParticipantMain");
    console.log("filteredParticipants");
    setFilteredParticipants((prev) =>
      prev.map((participant) =>
        participant.guid === usersData.guid
          ? { ...participant, hideCamera: flag }
          : participant
      )
    );

    dispatch(hideUnHideParticipantGuestMainApi(navigate, t, data));
  };

  const removeParticipantMeetingOnClick = (usersData) => {
    let data = {
      RoomID: String(roomID),
      UID: usersData.guid,
      Name: usersData.name,
      MeetingID: Number(currentMeetingID),
    };

    console.log("getAllParticipantMain");
    console.log("filteredParticipants");
    setFilteredParticipants((prev) =>
      prev.filter((participant) => participant.guid !== usersData.guid)
    );

    dispatch(removeParticipantMeetingMainApi(navigate, t, data));
  };

  const onHandleClickForStartRecording = () => {
    console.log("onHandleClickForStartRecording");
    setStartRecordingState(false);
    setPauseRecordingState(true);
    setResumeRecordingState(false);
    setStopRecordingState(false);
    if (isZoomEnabled) {
      if (
        isMeeting &&
        isMeetingVideo &&
        isMeetingVideoHostCheck &&
        !presenterViewJoinFlag &&
        !presenterViewHostFlag
      ) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage("RecordingStartMsgFromIframe", "*");
          console.log("onHandleClickForStartRecording");
        }
      }
    }
  };

  const onHandleClickForPauseRecording = () => {
    console.log("RecordingPauseMsgFromIframe");
    setStartRecordingState(false);
    setPauseRecordingState(false);
    setResumeRecordingState(true);
    setStopRecordingState(false);
    if (isZoomEnabled) {
      if (
        isMeeting &&
        isMeetingVideo &&
        isMeetingVideoHostCheck &&
        !presenterViewJoinFlag &&
        !presenterViewHostFlag
      ) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage("RecordingPauseMsgFromIframe", "*");
          console.log("RecordingPauseMsgFromIframe");
        }
      }
    }
  };

  const onHandleClickForResumeRecording = () => {
    console.log("RecordingResumeMsgFromIframe");
    setStartRecordingState(false);
    setPauseRecordingState(true);
    setResumeRecordingState(false);
    setStopRecordingState(false);
    if (isZoomEnabled) {
      if (
        isMeeting &&
        isMeetingVideo &&
        isMeetingVideoHostCheck &&
        !presenterViewJoinFlag &&
        !presenterViewHostFlag
      ) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage("RecordingResumeMsgFromIframe", "*");
          console.log("RecordingResumeMsgFromIframe");
        }
      }
    }
  };

  const getMeetingTitle = () => {
    const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    const callTypeID = Number(localStorage.getItem("callTypeID"));

    if (isMeetingVideo) {
      return meetingTitle?.trim();
    }
    if (presenterViewHostFlag || presenterViewJoinFlag) {
      return meetingTitle?.trim();
    }
    if (callTypeID === 2 && !presenterViewHostFlag && !presenterViewJoinFlag) {
      return t("Group-call");
    }
    if (
      currentUserName !== VideoRecipentData.userName &&
      Object.keys(VideoRecipentData).length > 0
    ) {
      return (
        VideoRecipentData.userName ||
        VideoRecipentData.recipients?.[0]?.userName
      );
    }

    if (Object.keys(VideoRecipentData).length === 0) {
      return callerName;
    }

    return null;
  };

  return (
    <>
      <div className="videoCallGroupScreen-minmizeVideoCall">
        <Row className="m-0 height100 align-items-center">
          <Col
            lg={5}
            md={5}
            sm={12}
            className={
              meetingTitle === "" ? "cursor-pointer" : "mt-1 cursor-pointer"
            }
            onClick={() => {
              dispatch(normalizeVideoPanelFlag(true));
              dispatch(minimizeVideoPanelFlag(false));
            }}
          >
            <p className="title-heading">{getMeetingTitle()}</p>
          </Col>

          <Col lg={7} md={7} sm={12}>
            <div className="d-flex gap-10 justify-content-end">
              {isMeeting &&
              isMeetingVideo &&
              isMeetingVideoHostCheck &&
              !presenterViewJoinFlag &&
              !presenterViewHostFlag ? (
                <>
                  {/* if Recording is start */}
                  {startRecordingState && (
                    <div
                      className="start-Recording-div"
                      onClick={onHandleClickForStartRecording}
                    >
                      <Tooltip
                        placement={presenterViewFlag ? "bottom" : "topRight"}
                        title={t("Start-recording")}
                        overlayClassName={
                          presenterViewFlag
                            ? "zindexing-for-presenter-tooltip"
                            : ""
                        }
                      >
                        <img
                          src={StartRecordLarge}
                          className="Start-Record-Button-Minimize"
                          alt="Record"
                        />
                      </Tooltip>
                    </div>
                  )}

                  {/* if Recording is Pause and Stop */}
                  {pauseRecordingState && (
                    <div
                      className="record-minimize-background"
                      // onClick={onResumeRecording}
                    >
                      <Tooltip
                        placement={presenterViewFlag ? "bottom" : "topRight"}
                        title={t("Stop-recording")}
                        overlayClassName={
                          presenterViewFlag
                            ? "zindexing-for-presenter-tooltip"
                            : ""
                        }
                      >
                        <img
                          src={StartRecordSmall}
                          onClick={onHandleClickForStopRecording}
                          className="Bunch-Start-Record-Button-2-MinimizePanel"
                          alt="Record"
                        />
                      </Tooltip>
                      <p className="Recording-text-MinimizePanel">
                        {t("Recording...")}
                      </p>

                      <Tooltip
                        placement={presenterViewFlag ? "bottom" : "topRight"}
                        title={t("Pause-recording")}
                        overlayClassName={
                          presenterViewFlag
                            ? "zindexing-for-presenter-tooltip"
                            : ""
                        }
                      >
                        <img
                          src={RecordStart}
                          onClick={onHandleClickForPauseRecording}
                          className="Bunch-Start-Record-Button-MinimizePanel"
                          alt="Record"
                        />
                      </Tooltip>
                    </div>
                  )}

                  {/* if Recording is Pause and Resume */}
                  {resumeRecordingState && (
                    <div className="Record-Start-BackgroundRed-Minimize">
                      <p className="RecordingPaused-text-Minimize">
                        {t("Recording-paused")}
                      </p>
                      <Tooltip
                        placement={presenterViewFlag ? "bottom" : "topRight"}
                        title={t("Resume-recording")}
                        overlayClassName={
                          presenterViewFlag
                            ? "zindexing-for-presenter-tooltip"
                            : ""
                        }
                      >
                        <img
                          src={RecordPlay}
                          className="Bunch-Start-RecordingPaused-Button-MinimizePanel"
                          alt="Record"
                          onClick={onHandleClickForResumeRecording}
                        />
                      </Tooltip>
                    </div>
                  )}
                </>
              ) : null}

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
                      : globallyScreenShare
                      ? "globally-screenshare-presenterImage"
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
                        !presenterViewHostFlag && !globallyScreenShare
                          ? handleScreenShareButton
                          : null
                      }
                      src={ShareScreenWhite}
                      alt="Screen Share"
                    />
                  </Tooltip>
                </div>
              )}
              {presenterViewFlag &&
                presenterViewJoinFlag &&
                presenterViewHostFlag &&
                !JSON.parse(localStorage.getItem("activeCall")) && (
                  <Tooltip placement="topRight" title={t("Participants")}>
                    <div className={"grayScaleImage-forminimize"}>
                      <img
                        src={ParticipantIcon}
                        alt="Participants"
                        onClick={openPresenterParticipantsList}
                      />
                    </div>

                    <div className={"position-relative"}>
                      {presenterParticipantList && presenterViewHostFlag && (
                        <>
                          <div
                            className={"presenter-participants-minimize-list"}
                          >
                            <div className="background-color-for-list">
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <p className="Waiting-New-Participant-Hosts-Title">
                                    {t("Participants")}
                                  </p>
                                </Col>
                              </Row>

                              <Row className="mt-4">
                                <Col lg={12} md={12} sm={12} className="gap-2">
                                  {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map(
                                      (usersData, index) => {
                                        console.log(
                                          usersData,
                                          "usersDatausersData"
                                        );
                                        return (
                                          <>
                                            <Row className="hostBorder m-0">
                                              <Col
                                                className="p-0 d-flex align-items-center"
                                                lg={7}
                                                md={7}
                                                sm={12}
                                              >
                                                <p className="participant-name">
                                                  {usersData?.name}
                                                </p>
                                                {presenterViewFlag ? (
                                                  presenterViewHostFlag &&
                                                  currentUserID ===
                                                    usersData.userID ? (
                                                    <>
                                                      <p>
                                                        <span
                                                          className={
                                                            "Host-title-name"
                                                          }
                                                        >
                                                          {t("(Presenter)")}
                                                        </span>
                                                      </p>
                                                    </>
                                                  ) : (
                                                    presenterViewJoinFlag ===
                                                      false &&
                                                    usersData.isHost && (
                                                      <>
                                                        <p>
                                                          <span
                                                            className={
                                                              "Host-title-name"
                                                            }
                                                          >
                                                            {t("(Host)")}
                                                          </span>
                                                        </p>
                                                      </>
                                                    )
                                                  )
                                                ) : (
                                                  usersData.isHost && (
                                                    <>
                                                      <p>
                                                        <span
                                                          className={
                                                            "Host-title-name"
                                                          }
                                                        >
                                                          {t("(Host)")}
                                                        </span>
                                                      </p>
                                                    </>
                                                  )
                                                )}{" "}
                                                {((presenterViewHostFlag &&
                                                  presenterViewFlag) ||
                                                  meetingHostData.isHost) &&
                                                usersData.raiseHand ? (
                                                  <img
                                                    draggable="false"
                                                    src={GoldenHandRaised}
                                                    alt=""
                                                    width={"22px"}
                                                    height={"22px"}
                                                    className="handraised-participant"
                                                  />
                                                ) : (
                                                  <img
                                                    draggable="false"
                                                    src={MenuRaiseHand}
                                                    alt=""
                                                    className="handraised-participant"
                                                  />
                                                )}
                                                {!presenterViewHostFlag &&
                                                !presenterViewJoinFlag &&
                                                usersData.isHost ? (
                                                  JSON.parse(
                                                    localStorage.getItem(
                                                      "isWebCamEnabled"
                                                    )
                                                  ) ? (
                                                    <img
                                                      draggable="false"
                                                      src={VideoDisable}
                                                      width="18px"
                                                      height="18px"
                                                      alt="Video Disabled"
                                                      className="handraised-participant"
                                                    />
                                                  ) : (
                                                    <img
                                                      draggable="false"
                                                      src={VideoOn2}
                                                      width="18px"
                                                      height="16px"
                                                      alt="Video On"
                                                      className="handraised-participant"
                                                    />
                                                  )
                                                ) : usersData.hideCamera ? (
                                                  <img
                                                    draggable="false"
                                                    src={VideoDisable}
                                                    width="18px"
                                                    height="18px"
                                                    alt="Video Disabled"
                                                    className="handraised-participant"
                                                  />
                                                ) : (
                                                  <img
                                                    draggable="false"
                                                    src={VideoOn2}
                                                    width="18px"
                                                    height="16px"
                                                    alt="Video On"
                                                    className="handraised-participant"
                                                  />
                                                )}
                                              </Col>

                                              <Col
                                                className="
                        d-flex
                        justify-content-end
                        align-items-baseline
                        gap-2
                        p-0"
                                                lg={5}
                                                md={5}
                                                sm={12}
                                              >
                                                {!presenterViewHostFlag &&
                                                !presenterViewJoinFlag &&
                                                usersData.isHost ? (
                                                  JSON.parse(
                                                    localStorage.getItem(
                                                      "isMicEnabled"
                                                    )
                                                  ) ? (
                                                    <img
                                                      draggable="false"
                                                      src={MicDisabled}
                                                      width="19px"
                                                      height="19px"
                                                      alt="Microphone Disabled"
                                                    />
                                                  ) : (
                                                    <img
                                                      draggable="false"
                                                      src={MicOnEnabled}
                                                      width="15px"
                                                      height="19px"
                                                      alt="Microphone Enabled"
                                                    />
                                                  )
                                                ) : usersData.mute ? (
                                                  <img
                                                    draggable="false"
                                                    src={MicDisabled}
                                                    width="19px"
                                                    height="19px"
                                                    alt="Microphone Disabled"
                                                  />
                                                ) : (
                                                  <img
                                                    draggable="false"
                                                    src={MicOnEnabled}
                                                    width="15px"
                                                    height="19px"
                                                    alt="Microphone Enabled"
                                                  />
                                                )}
                                                {presenterViewFlag ? (
                                                  currentUserID !==
                                                  usersData.userID ? (
                                                    <Dropdown>
                                                      <Dropdown.Toggle className="participant-toggle">
                                                        <img
                                                          draggable="false"
                                                          src={Menu}
                                                          alt=""
                                                        />
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        {!presenterViewFlag &&
                                                          !presenterViewHostFlag && (
                                                            <>
                                                              {usersData.isGuest ===
                                                              false ? (
                                                                <Dropdown.Item
                                                                  className="participant-dropdown-item"
                                                                  onClick={() =>
                                                                    makeHostOnClick(
                                                                      usersData
                                                                    )
                                                                  }
                                                                >
                                                                  {t(
                                                                    "Make-host"
                                                                  )}
                                                                </Dropdown.Item>
                                                              ) : null}
                                                            </>
                                                          )}

                                                        {!presenterViewFlag &&
                                                          !presenterViewHostFlag && (
                                                            <>
                                                              {usersData.isHost ===
                                                              false ? (
                                                                <Dropdown.Item
                                                                  className="participant-dropdown-item"
                                                                  onClick={() =>
                                                                    removeParticipantMeetingOnClick(
                                                                      usersData
                                                                    )
                                                                  }
                                                                >
                                                                  {t("Remove")}
                                                                </Dropdown.Item>
                                                              ) : null}
                                                            </>
                                                          )}
                                                        {usersData.mute ===
                                                        false ? (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() =>
                                                                muteUnmuteByHost(
                                                                  usersData,
                                                                  true
                                                                )
                                                              }
                                                            >
                                                              {t("Mute")}
                                                            </Dropdown.Item>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() =>
                                                                muteUnmuteByHost(
                                                                  usersData,
                                                                  false
                                                                )
                                                              }
                                                            >
                                                              {t("UnMute")}
                                                            </Dropdown.Item>
                                                          </>
                                                        )}
                                                        {usersData.hideCamera ===
                                                        false ? (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() => {
                                                                hideUnHideVideoParticipantByHost(
                                                                  usersData,
                                                                  true
                                                                );
                                                              }}
                                                            >
                                                              {t("Hide-video")}
                                                            </Dropdown.Item>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() => {
                                                                hideUnHideVideoParticipantByHost(
                                                                  usersData,
                                                                  false
                                                                );
                                                              }}
                                                            >
                                                              {t(
                                                                "UnHide-video"
                                                              )}
                                                            </Dropdown.Item>
                                                          </>
                                                        )}
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  ) : null
                                                ) : (
                                                  !usersData.isHost && (
                                                    <Dropdown>
                                                      <Dropdown.Toggle className="participant-toggle">
                                                        <img
                                                          draggable="false"
                                                          src={Menu}
                                                          alt=""
                                                        />
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        {!presenterViewFlag &&
                                                          !presenterViewHostFlag && (
                                                            <>
                                                              {usersData.isGuest ===
                                                              false ? (
                                                                <Dropdown.Item
                                                                  className="participant-dropdown-item"
                                                                  onClick={() =>
                                                                    makeHostOnClick(
                                                                      usersData
                                                                    )
                                                                  }
                                                                >
                                                                  {t(
                                                                    "Make-host"
                                                                  )}
                                                                </Dropdown.Item>
                                                              ) : null}
                                                            </>
                                                          )}

                                                        {!presenterViewFlag &&
                                                          !presenterViewHostFlag && (
                                                            <>
                                                              {usersData.isHost ===
                                                              false ? (
                                                                <Dropdown.Item
                                                                  className="participant-dropdown-item"
                                                                  onClick={() =>
                                                                    removeParticipantMeetingOnClick(
                                                                      usersData
                                                                    )
                                                                  }
                                                                >
                                                                  {t("Remove")}
                                                                </Dropdown.Item>
                                                              ) : null}
                                                            </>
                                                          )}
                                                        {usersData.mute ===
                                                        false ? (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() =>
                                                                muteUnmuteByHost(
                                                                  usersData,
                                                                  true
                                                                )
                                                              }
                                                            >
                                                              {t("Mute")}
                                                            </Dropdown.Item>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() =>
                                                                muteUnmuteByHost(
                                                                  usersData,
                                                                  false
                                                                )
                                                              }
                                                            >
                                                              {t("UnMute")}
                                                            </Dropdown.Item>
                                                          </>
                                                        )}
                                                        {usersData.hideCamera ===
                                                        false ? (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() => {
                                                                hideUnHideVideoParticipantByHost(
                                                                  usersData,
                                                                  true
                                                                );
                                                              }}
                                                            >
                                                              {t("Hide-video")}
                                                            </Dropdown.Item>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <Dropdown.Item
                                                              className="participant-dropdown-item"
                                                              onClick={() => {
                                                                hideUnHideVideoParticipantByHost(
                                                                  usersData,
                                                                  false
                                                                );
                                                              }}
                                                            >
                                                              {t(
                                                                "UnHide-video"
                                                              )}
                                                            </Dropdown.Item>
                                                          </>
                                                        )}
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  )
                                                )}
                                              </Col>
                                            </Row>
                                          </>
                                        );
                                      }
                                    )
                                  ) : (
                                    <>
                                      <Row>
                                        <Col className="d-flex justify-content-center align-item-center">
                                          <p>{t("No-participant")}</p>
                                        </Col>
                                      </Row>
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Tooltip>
                )}

              {((meetingHostData?.isHost &&
                !presenterViewHostFlag &&
                !presenterViewJoinFlag) ||
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
                    {LeaveCallModalFlag === true && !isMeeting && (
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
            <Notification open={open} setOpen={setOpen} />
          </Col>
        </Row>
      </div>
      {!isCaller && isMeeting && (
        <>
          <div ref={leaveModalPopupRef}>
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
                            : isMeetingVideo
                            ? t("Leave-meeting-video-call")
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
          </div>
        </>
      )}
    </>
  );
};

export default VideoCallMinimizeHeader;
