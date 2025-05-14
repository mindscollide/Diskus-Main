import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./videoCallHeader.css";
import { Button, Notification } from "./../../../../elements";
import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";
import { Tooltip } from "antd";
import ExpandIcon from "./../../talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../talk-Video/video-images/Minimize Purple.svg";
import NonActiveScreenShare from "./../../talk-Video/video-images/Screen Share Purple.svg";
import videoEndIcon from "./../../talk-Video/video-images/Call End White.svg";
import TileView from "./../../talk-Video/video-images/Tile View 1 Purple.svg";
import SidebarView from "./../../talk-Video/video-images/Tile View 3 Purple.svg";
import MicOn from "./../../talk-Video/video-images/Mic Enabled Purple.svg";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ChatIcon from "./../../talk-Video/video-images/Chat Purple.svg";
import CallEndRedIcon from "./../../talk-Video/video-images/Call End Red.svg";
import NormalizeIcon from "./../../talk-Video/video-images/Collapse.svg";
import RaiseHand from "./../../talk-Video/video-images/Raise Hand Purple.svg";
import LowerHand from "./../../talk-Video/video-images/Raise Hand White.svg";
import CopyLink from "./../../talk-Video/video-images/Copy Link Purple.svg";
import CloseNotification from "../../../../../assets/images/Close-Notification.png";
import ActiveParticipantIcon from "./../../talk-Video/video-images/Users White.svg";
import ParticipantsIcon from "./../../talk-Video/video-images/Users Purple.svg";
import StartRecordLarge from "../../../../../assets/images/Recent Activity Icons/Video/StartRecordLarge.png";
import StartRecordSmall from "../../../../../assets/images/Recent Activity Icons/Video/StartRecordSmall.png";
import RecordStart from "../../../../../assets/images/Recent Activity Icons/Video/RecordStart.png";
import RecordPlay from "../../../../../assets/images/Recent Activity Icons/Video/RecordPlay.png";

import { activeChat } from "../../../../../store/actions/Talk_action";
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  chatEnableNormalFlag,
  leaveCallModal,
  participantPopup,
  videoChatMessagesFlag,
  setRaisedUnRaisedParticiant,
  toggleParticipantsVisibility,
  leaveMeetingVideoOnlogout,
  leaveMeetingOnlogout,
  makeParticipantHost,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
  leavePresenterViewMainApi,
  stopPresenterViewMainApi,
  videoIconOrButtonState,
  participantVideoButtonState,
  setVideoControlHost,
  setAudioControlHost,
  joinPresenterViewMainApi,
  maxParticipantVideoCallPanel,
  openPresenterViewMainApi,
  unansweredOneToOneCall,
  getGroupCallParticipantsMainApi,
  updatedParticipantListForPresenter,
  presenterNewParticipantJoin,
  screenShareTriggeredGlobally,
  isSharedScreenTriggeredApi,
} from "../../../../../store/actions/VideoFeature_actions";
import { GetOTOUserMessages } from "../../../../../store/actions/Talk_action";
import { LeaveCall } from "../../../../../store/actions/VideoMain_actions";
import { useTranslation } from "react-i18next";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import { participantWaitingListBox } from "../../../../../store/actions/VideoFeature_actions";
import {
  getMeetingGuestVideoMainApi,
  hideUnhideSelfMainApi,
  muteUnMuteSelfMainApi,
  raiseUnRaisedHandMainApi,
} from "../../../../../store/actions/Guest_Video";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
import { convertNumbersInString } from "../../../../../commen/functions/regex";
import { RecordCircle } from "react-bootstrap-icons";
import { showMessage } from "../../../../elements/snack_bar/utill";

const VideoCallNormalHeader = ({
  isScreenActive,
  screenShareButton,
  layoutCurrentChange,
  disableMic,
  disableVideo,
  isMicActive,
  isVideoActive,
  showTile,
  iframeCurrent,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  onResumeRecording,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    editorRole,
    groupVideoCallAccepted,
    setGroupVideoCallAccepted,
    groupCallParticipantList,
    setGroupCallParticipantList,
    unansweredCallParticipant,
    setUnansweredCallParticipant,
    handRaiseCounter,
    setHandRaiseCounter,
    startRecordingState,
    setStartRecordingState,
    pauseRecordingState,
    setPauseRecordingState,
    resumeRecordingState,
    setResumeRecordingState,
    stopRecordingState,
    setStopRecordingState,
  } = useContext(MeetingContext);

  const leaveModalPopupRef = useRef(null);

  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag
  );

  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
  );

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag
  );

  const waitingParticipantsList = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  //Audio Control For host
  const audioControl = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  //Video Control For host
  const videoControl = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  // For Participant Raise Un Raised Hand
  const raisedUnRaisedParticipant = useSelector(
    (state) => state.videoFeatureReducer.raisedUnRaisedParticipant
  );

  const leaveMeetingVideoOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnLogoutResponse
  );

  const VideoChatMessagesFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoChatMessagesFlag
  );

  const ParticipantPopupFlag = useSelector(
    (state) => state.videoFeatureReducer.ParticipantPopupFlag
  );

  const VideoRecipentData = useSelector(
    (state) => state.VideoMainReducer.VideoRecipentData
  );

  const GroupCallRecipientsData = useSelector(
    (state) => state.VideoMainReducer.GroupCallRecipientsData
  );

  const priticipantListModalFlagForHost = useSelector(
    (state) => state.videoFeatureReducer.participantWaitinglistBox
  );

  const priticipantListModalFlagForNonHost = useSelector(
    (state) => state.videoFeatureReducer.participantsVisible
  );

  const makeParticipantAsHost = useSelector(
    (state) => state.videoFeatureReducer.makeParticipantAsHost
  );

  const closeQuickMeetingVideoReducer = useSelector(
    (state) =>
      state.videoFeatureReducer.endMeetingStatusForQuickMeetingVideoFlag
  );

  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom
  );

  const leaveMeetingVideoOnEndStatusMqttFlag = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnEndStatusMqttFlag
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const presenterStartedFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterStartedFlag
  );

  const newJoinPresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.newJoinPresenterParticipant
  );

  const unansweredFlagForOneToOneCall = useSelector(
    (state) => state.videoFeatureReducer.unansweredFlagForOneToOneCall
  );

  const pendingCallParticipantList = useSelector(
    (state) => state.videoFeatureReducer.pendingCallParticipantList
  );

  const leavePresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterParticipant
  );

  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare
  );

  let callerNameInitiate = localStorage.getItem("callerNameInitiate");
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let organizationName = localStorage.getItem("organizatioName");
  let currentUserName = localStorage.getItem("name");
  let callerName = localStorage.getItem("callerName");
  let lan = localStorage.getItem("i18nextLng");
  let recipentCalledID = Number(localStorage.getItem("recipentCalledID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let callerID = Number(localStorage.getItem("callerID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let newRoomID = localStorage.getItem("newRoomId");
  let isGuid = localStorage.getItem("isGuid");
  let newName = localStorage.getItem("name");
  let participantRoomId = localStorage.getItem("participantRoomId");
  let participantUID = localStorage.getItem("participantUID");
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let initiateRoomID = localStorage.getItem("initiateCallRoomID");
  let currentCallType = Number(localStorage.getItem("CallType"));
  let videoCallURL = Number(localStorage.getItem("videoCallURL"));
  let meetingTitle = localStorage.getItem("meetingTitle");
  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
  let getMeetingHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));
  let RoomID =
    presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
      ? roomID
      : isMeetingVideoHostCheck
      ? newRoomID
      : participantRoomId;
  let UID = isMeetingVideoHostCheck ? isGuid : participantUID;

  const {
    leaveOneToOne,
    setJoinMeetingVideoParticipant,
    setLeaveOneToOne,
    joinPresenterForOneToOneOrGroup,
    setPresenterForOneToOneOrGroup,
    startPresenterViewOrLeaveOneToOne,
    setStartPresenterViewOrLeaveOneToOne,
    leavePresenterViewToJoinOneToOne,
    setJoiningOneToOneAfterLeavingPresenterView,
    setLeavePresenterViewToJoinOneToOne,
    setLeaveMeetingVideoForOneToOneOrGroup,
    leaveMeetingVideoForOneToOneOrGroup,
  } = useMeetingContext();

  const getDashboardVideo = getMeetingHostInfo;

  const [showNotification, setShowNotification] = useState(true);

  console.log(startRecordingState, "startRecordingState");

  const [participantCounterList, setParticipantCounterList] = useState([]);

  const [handStatus, setHandStatus] = useState(raisedUnRaisedParticipant);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // to show a host participants waiting List Counter
  let participantWaitingListCounter = waitingParticipantsList?.length;

  // API for check getGroupVideoCall Participants Data
  useEffect(() => {
    if (currentCallType === 2 && isCaller) {
      let data = {
        RoomID: String(initiateRoomID),
      };
      dispatch(getGroupCallParticipantsMainApi(navigate, t, data));
    }

    const handleBeforeUnload = async (event) => {
      setHandRaiseCounter(0);
      setParticipantCounterList(0);
      participantWaitingListCounter = 0;
      setGroupVideoCallAccepted([]); // Clear list when component unmounts
      setGroupCallParticipantList([]);
      setUnansweredCallParticipant([]);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (
      pendingCallParticipantList !== undefined &&
      pendingCallParticipantList !== null &&
      pendingCallParticipantList.length !== 0
    ) {
      setGroupCallParticipantList(pendingCallParticipantList);
    } else {
      setGroupCallParticipantList([]);
    }
  }, [pendingCallParticipantList]);

  useEffect(() => {
    if (Object.keys(getAllParticipantMain)?.length > 0) {
      setParticipantCounterList(getAllParticipantMain?.length);
    }
  }, [getAllParticipantMain]);

  useEffect(() => {
    const leftUID = leavePresenterParticipant?.uid;

    // Only proceed if all flags are valid and leftUID is defined
    if (leftUID && presenterViewFlag && presenterViewHostFlag) {
      const updatedList = getAllParticipantMain.filter(
        (participant) => participant.guid !== leftUID
      );
      const updatedRaisedHands = updatedList.filter(
        (participant) => participant.raiseHand === true
      );
      setHandRaiseCounter(updatedRaisedHands.length);

      // if (!isMeetingVideo) {
      dispatch(updatedParticipantListForPresenter(updatedList));
      // }
    }
  }, [leavePresenterParticipant]); // 👈 optional: or just [leavePresenterParticipant]

  //Hand Raise Counter To show on Participant Counter in presenter View
  useEffect(() => {
    let dublicateData = [...getAllParticipantMain];
    const raisedHandCounter = dublicateData.filter(
      (participant) => participant.raiseHand === true
    );
    setHandRaiseCounter(raisedHandCounter.length);
  }, [getAllParticipantMain]);

  useEffect(() => {
    if (
      Object.keys(newJoinPresenterParticipant).length > 0 &&
      presenterViewFlag &&
      presenterViewHostFlag &&
      priticipantListModalFlagForHost === false
    ) {
      // Step 1: Remove any existing participant with the same userID or guid
      let dublicateData = [...getAllParticipantMain];
      const updatedParticipants = dublicateData.filter(
        (participant) =>
          participant.userID !== newJoinPresenterParticipant.userID &&
          participant.guid !== newJoinPresenterParticipant.guid
      );

      // Add flag to distinguish presentation-only participant
      const participantWithFlag = {
        ...newJoinPresenterParticipant,
        joinedForPresentation: true,
      };

      updatedParticipants.push(participantWithFlag);

      dispatch(updatedParticipantListForPresenter(updatedParticipants));

      dispatch(presenterNewParticipantJoin([]));
    }
  }, [newJoinPresenterParticipant]);

  // 3️⃣ Cleanup presentation-only participants after presentation ends
  useEffect(() => {
    if (!presenterViewFlag || !presenterViewHostFlag) {
      const filteredParticipants = getAllParticipantMain.filter(
        (participant) => !participant.joinedForPresentation
      );

      dispatch(updatedParticipantListForPresenter(filteredParticipants));
    }
  }, [presenterViewFlag, presenterViewHostFlag]);

  const otoMaximizeVideoPanel = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(normalizeVideoPanelFlag(false));
    }
    setShowNotification(true);
  };

  const minimizeVideoPanel = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
    }
  };

  const closeVideoPanel = () => {
    dispatch(leaveCallModal(false));
  };

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true));
    dispatch(toggleParticipantsVisibility(false));
  };

  function leaveSuccess() {
    console.log("busyCall");
    localStorage.setItem("isCaller", false);
    localStorage.setItem("isMeetingVideo", false);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
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

  // after presenter view is true then this funct call
  async function handlePresenterViewFunc() {
    console.log("busyCall");
    let alreadyInMeetingVideo = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideo")
    );
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    if (presenterViewHostFlag) {
      if (!alreadyInMeetingVideo || leavePresenterViewToJoinOneToOne) {
        await leaveSuccess();
      }
      // Stop presenter view
      if (presenterStartedFlag) {
        console.log("Check isShare Issue");
        if (iframeCurrent && iframeCurrent.contentWindow) {
          iframeCurrent.contentWindow.postMessage("ScreenShare", "*");
        }
        let data = {
          MeetingID: currentMeetingID,
          RoomID: String(RoomID),
          VideoCallUrl: videoCallURL,
        };
        sessionStorage.setItem("StopPresenterViewAwait", true);
        setLeavePresenterViewToJoinOneToOne(false);

        //Jab Recording On Ho aur Host Stop krday toh
        if (isZoomEnabled) {
          if (pauseRecordingState || resumeRecordingState) {
            console.log("Stop Recording Check");
            onStopRecording();
          }
        }

        await dispatch(
          stopPresenterViewMainApi(
            navigate,
            t,
            data,
            leavePresenterViewToJoinOneToOne ? 3 : 0,
            setLeaveMeetingVideoForOneToOneOrGroup,
            setJoiningOneToOneAfterLeavingPresenterView,
            setLeavePresenterViewToJoinOneToOne
          )
        );
      } else {
        let data = {
          RoomID: String(RoomID),
          UserGUID: String(UID),
          Name: String(newName),
        };
        await dispatch(
          leavePresenterViewMainApi(
            navigate,
            t,
            data,
            leavePresenterViewToJoinOneToOne ? 3 : 2,
            setLeaveMeetingVideoForOneToOneOrGroup,
            setJoiningOneToOneAfterLeavingPresenterView,
            setLeavePresenterViewToJoinOneToOne
          )
        );
      }
    } else {
      if (presenterViewJoinFlag) {
        console.log("busyCall");
        // Leave presenter view
        if (isMeetingVideoHostCheck) {
          dispatch(videoIconOrButtonState(false));
        } else {
          dispatch(participantVideoButtonState(false));
        }
        let data = {
          RoomID: String(RoomID),
          UserGUID: String(UID),
          Name: String(newName),
        };
        await dispatch(
          leavePresenterViewMainApi(
            navigate,
            t,
            data,
            leavePresenterViewToJoinOneToOne ? 3 : 2,
            setLeaveMeetingVideoForOneToOneOrGroup,
            setJoiningOneToOneAfterLeavingPresenterView,
            setLeavePresenterViewToJoinOneToOne
          )
        );
        leaveSuccess();
      }
    }
  }

  const endCallParticipant = async () => {
    try {
      if (iframeCurrent && iframeCurrent.contentWindow !== null) {
        console.log("busyCall");
        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (error) {}

    if (getDashboardVideo?.isDashboardVideo === false) {
      console.log("Check isCaller True");
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
      localStorage.removeItem("currentHostUserID");
      localStorage.removeItem("isHost");
      localStorage.removeItem("isNewHost");
      localStorage.setItem("MicOff", true);
      localStorage.setItem("VidOff", true);
    } else if (isMeeting === true) {
      const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        console.log("busyCall");
        handlePresenterViewFunc();
      } else if (isMeetingVideo && isMeetingVideoHostCheck) {
        console.log("busyCall");
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: meetHostFlag?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        dispatch(LeaveMeetingVideo(Data, navigate, t));
      } else if (isMeetingVideo) {
        dispatch(toggleParticipantsVisibility(false));
        let Data = {
          RoomID: String(participantRoomId),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: meetHostFlag?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        dispatch(setRaisedUnRaisedParticiant(false));

        dispatch(LeaveMeetingVideo(Data, navigate, t));
      }
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      localStorage.setItem("activeCall", false);
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("acceptedRecipientID", 0);
      localStorage.setItem("acceptedRoomID", 0);
      localStorage.setItem("activeRoomID", 0);
      localStorage.setItem("MicOff", true);
      localStorage.setItem("VidOff", true);
    }
  };

  const onClickCloseChatHandler = () => {
    if (LeaveCallModalFlag === false) {
      if (VideoChatMessagesFlag === false) {
        if (callerID === currentUserID) {
          let activeChatData = {
            id: VideoRecipentData.userID,
            fullName: VideoRecipentData.userName,
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

  const closeParticipantHandler = (flag, value) => {
    if (flag === 1) {
      let check = priticipantListModalFlagForHost ? false : true;
      dispatch(participantWaitingListBox(check));
    } else if (flag === 2) {
      let check = priticipantListModalFlagForNonHost ? false : true;
      dispatch(toggleParticipantsVisibility(check));
    }

    if (!isMeetingVideo && isCaller) {
      if (LeaveCallModalFlag === false) {
        if (ParticipantPopupFlag === false) {
          dispatch(participantPopup(true));
        } else {
          dispatch(participantPopup(false));
        }
      }
    }
  };

  const normalizeScreen = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(normalizeVideoPanelFlag(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
    }
  };

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false));
    dispatch(toggleParticipantsVisibility(false));
  };

  // for Host leave Call
  const leaveCall = async (flag, flag2, flag3, flag4) => {
    console.log("Check isCaller True");
    let UID = isMeetingVideoHostCheck ? isGuid : participantUID;
    try {
      if (!presenterStartedFlag) {
        if (iframeCurrent && iframeCurrent.contentWindow !== null) {
          console.log("busyCall");
          iframeCurrent.contentWindow.postMessage("leaveSession", "*");
          await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
        }
      }
    } catch (error) {}
    if (isMeeting === true) {
      console.log("Check isCaller True");
      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        console.log("busyCall");
        handlePresenterViewFunc();
      } else if (isMeetingVideo && isMeetingVideoHostCheck) {
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
            let isGuid = localStorage.getItem("isGuid");
            let RoomID =
              isMeetingVideo && isMeetingVideoHostCheck ? newRoomID : null;

            let UID = isMeetingVideo && isMeetingVideoHostCheck ? isGuid : null;
            let data = {
              RoomID: RoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
          //Jab Recording On Ho aur Host Stop krday toh
          if (pauseRecordingState || resumeRecordingState) {
            console.log("Stop Recording Check");
            onStopRecording();
          }
        }

        console.log("busyCall");
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        await dispatch(LeaveMeetingVideo(Data, navigate, t));
        leaveSuccess();
      } else if (isMeetingVideo) {
        let isSharedSceenEnable = JSON.parse(
          localStorage.getItem("isSharedSceenEnable")
        );
        console.log("busyCall");
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            let participantRoomId = localStorage.getItem("participantRoomId");
            let isMeetingVideoHostCheck = JSON.parse(
              localStorage.getItem("isMeetingVideoHostCheck")
            );
            let participantUID = String(localStorage.getItem("participantUID"));
            let RoomID =
              isMeetingVideo && !isMeetingVideoHostCheck
                ? participantRoomId
                : null;

            let UID =
              isMeetingVideo && !isMeetingVideoHostCheck
                ? participantUID
                : null;
            let data = {
              RoomID: RoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }
        let Data = {
          RoomID: String(participantRoomId),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        await dispatch(setRaisedUnRaisedParticiant(false));
        await dispatch(LeaveMeetingVideo(Data, navigate, t));
        leaveSuccess();
      } else if (getDashboardVideo?.isDashboardVideo === false) {
        console.log("Check isCaller True");
        let Data = {
          OrganizationID: currentOrganization,
          RoomID: initiateRoomID,
          IsCaller: true,
          CallTypeID: currentCallType,
        };
        await dispatch(LeaveCall(Data, navigate, t));
        leaveSuccess();
      }
    } else if (getDashboardVideo?.isDashboardVideo === false) {
      console.log("Check isCaller True");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateRoomID,
        IsCaller: true,
        CallTypeID: currentCallType,
      };
      await dispatch(LeaveCall(Data, navigate, t));
      leaveSuccess();
    }

    if (flag) {
      await dispatch(leaveMeetingVideoOnlogout(false));
      dispatch(leaveMeetingOnlogout(true));
    }
    if (flag2) {
      dispatch(endMeetingStatusForQuickMeetingVideo(false));
      dispatch(endMeetingStatusForQuickMeetingModal(true));
    }
    if (flag3) {
      await dispatch(leaveMeetingVideoOnEndStatusMqtt(false));
      dispatch(leaveMeetingOnEndStatusMqtt(true));
    }
  };

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnLogoutResponse) {
        console.log("busyCall");
        leaveCall(true, false, false, false);
      }
    } catch {}
  }, [leaveMeetingVideoOnLogoutResponse]);

  useEffect(() => {
    try {
      if (closeQuickMeetingVideoReducer) {
        console.log("busyCall");
        leaveCall(false, true, false, false);
      }
    } catch (error) {}
  }, [closeQuickMeetingVideoReducer]);

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnEndStatusMqttFlag) {
        console.log("busyCall");
        leaveCall(false, false, true, false);
      }
    } catch (error) {}
  }, [leaveMeetingVideoOnEndStatusMqttFlag]);

  const leaveCallForNonMeating = async (flag) => {
    try {
      if (iframeCurrent && iframeCurrent.contentWindow !== null) {
        console.log("busyCall");
        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (error) {}
    try {
      let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
      let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
      let activeRoomID = localStorage.getItem("activeRoomID");
      let isCaller = JSON.parse(localStorage.getItem("isCaller"));

      localStorage.removeItem("currentHostUserID");
      localStorage.removeItem("isHost");
      localStorage.removeItem("isNewHost");
      setGroupCallParticipantList([]);
      setGroupVideoCallAccepted([]);
      setUnansweredCallParticipant([]);
      let isSharedSceenEnable = JSON.parse(
        localStorage.getItem("isSharedSceenEnable")
      );

      if (isZoomEnabled) {
        if (isSharedSceenEnable && !globallyScreenShare) {
          console.log("busyCall");
          let acceptedRoomID = localStorage.getItem("acceptedRoomID");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let userID = String(localStorage.getItem("userID"));
          let RoomID = !isMeetingVideo ? acceptedRoomID : null;

          let UID = !isMeetingVideo ? userID : null;
          let data = {
            RoomID: RoomID,
            ShareScreen: false,
            UID: UID,
          };
          dispatch(screenShareTriggeredGlobally(false));
          await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
        }
      }
      console.log("Check isCaller True");
      if (isZoomEnabled) {
        if (isCaller && (currentCallType === 1 || currentCallType === 2)) {
          console.log("Check isCaller True");
          onStopRecording();
        }
      }

      console.log("busyCall");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: isZoomEnabled ? String(initiateCallRoomID) : activeRoomID,
        IsCaller: isCaller,
        CallTypeID: callTypeID,
      };
      await dispatch(LeaveCall(Data, navigate, t));
      localStorage.setItem("isCaller", false);
      localStorage.setItem("isMeetingVideo", false);
      const emptyArray = [];
      localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
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
      sessionStorage.setItem("NonMeetingVideoCall", false);
      let onlyLeaveCall = JSON.parse(localStorage.getItem("onlyLeaveCall"));
      if (
        onlyLeaveCall === null ||
        onlyLeaveCall === undefined ||
        onlyLeaveCall === false
      ) {
        if (flag === 1) {
          if (!unansweredFlagForOneToOneCall) {
            setJoinMeetingVideoParticipant(true);
          } else {
            dispatch(unansweredOneToOneCall(false));
          }
          setLeaveOneToOne(false);
        } else if (flag === 2) {
          setLeaveOneToOne(false);
          setPresenterForOneToOneOrGroup(false);
          let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
          let data = {
            VideoCallURL: String(currentMeetingVideoURL),
            WasInVideo: false,
          };
          dispatch(joinPresenterViewMainApi(navigate, t, data));
        } else if (flag === 3) {
          setLeaveOneToOne(false);
          let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
          let currentMeeting = localStorage.getItem("currentMeetingID");
          setStartPresenterViewOrLeaveOneToOne(false);
          dispatch(maxParticipantVideoCallPanel(false));
          let data = {
            VideoCallURL: String(currentMeetingVideoURL || ""),
            Guid: "",
            WasInVideo: false,
          };

          dispatch(
            openPresenterViewMainApi(t, navigate, data, currentMeeting, 4)
          );
        }
      } else {
        localStorage.removeItem("onlyLeaveCall");
        setLeaveOneToOne(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    try {
      if (leaveOneToOne) {
        leaveCallForNonMeating(
          joinPresenterForOneToOneOrGroup
            ? 2
            : startPresenterViewOrLeaveOneToOne
            ? 3
            : 1
        );
      }
    } catch (error) {}
  }, [leaveOneToOne]);

  useEffect(() => {
    try {
      if (leavePresenterViewToJoinOneToOne) {
        participantLeaveCall();
      }
    } catch (error) {}
  }, [leavePresenterViewToJoinOneToOne]);

  useEffect(() => {
    try {
      if (leaveMeetingVideoForOneToOneOrGroup) {
        participantLeaveCall();
      }
    } catch (error) {}
  }, [leaveMeetingVideoForOneToOneOrGroup]);

  // For Participant Leave Call
  const participantLeaveCall = async () => {
    console.log("busyCall");
    if (presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)) {
      if (presenterViewJoinFlag) {
        dispatch(toggleParticipantsVisibility(false));
      } else {
        dispatch(participantWaitingListBox(false));
      }
    }
    let meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );

    if (isMeeting === true) {
      console.log("busyCall");
      if (
        presenterViewFlag &&
        (presenterViewHostFlag || presenterViewJoinFlag)
      ) {
        console.log("busyCall");
        handlePresenterViewFunc();
      } else if (isMeetingVideo && isMeetingVideoHostCheck) {
        console.log("busyCall");
        try {
          if (iframeCurrent && iframeCurrent.contentWindow !== null) {
            console.log("busyCall");
            iframeCurrent.contentWindow.postMessage("leaveSession", "*");
            await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
          }
        } catch (error) {}
        localStorage.removeItem("currentHostUserID");
        localStorage.removeItem("isHost");
        localStorage.removeItem("isNewHost");

        // when host share screen then leave meeting Video
        let isSharedSceenEnable = JSON.parse(
          localStorage.getItem("isSharedSceenEnable")
        );
        console.log("busyCall");
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            console.log("busyCall");
            let isMeetingVideoHostCheck = JSON.parse(
              localStorage.getItem("isMeetingVideoHostCheck")
            );
            let isGuid = localStorage.getItem("isGuid");
            let RoomID =
              isMeetingVideo && isMeetingVideoHostCheck
                ? String(newRoomID)
                : null;

            let UID =
              isMeetingVideo && isMeetingVideoHostCheck ? String(isGuid) : null;
            let data = {
              RoomID: RoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }
        console.log("busyCall");
        let Data = {
          RoomID: String(RoomID),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        if (leaveMeetingVideoForOneToOneOrGroup) {
          dispatch(setRaisedUnRaisedParticiant(false));
          await dispatch(
            LeaveMeetingVideo(
              Data,
              navigate,
              t,
              3,
              null,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeaveMeetingVideoForOneToOneOrGroup
            )
          );
        } else {
          await dispatch(LeaveMeetingVideo(Data, navigate, t));
        }
        localStorage.setItem("isCaller", false);
        localStorage.setItem("isMeetingVideo", false);
        const emptyArray = [];
        localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
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
      } else if (isMeetingVideo) {
        localStorage.removeItem("currentHostUserID");
        localStorage.removeItem("isHost");
        localStorage.removeItem("isNewHost");
        try {
          if (iframeCurrent && iframeCurrent.contentWindow !== null) {
            console.log("busyCall");
            iframeCurrent.contentWindow.postMessage("leaveSession", "*");
            await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
          }
        } catch (error) {}
        console.log("busyCall");
        let isSharedSceenEnable = JSON.parse(
          localStorage.getItem("isSharedSceenEnable")
        );
        // when Participant share screen then leave meeting Video
        if (isZoomEnabled) {
          if (isSharedSceenEnable && !globallyScreenShare) {
            console.log("busyCall");
            let participantRoomId = String(
              localStorage.getItem("participantRoomId")
            );
            let isMeetingVideoHostCheck = JSON.parse(
              localStorage.getItem("isMeetingVideoHostCheck")
            );
            let participantUID = String(localStorage.getItem("participantUID"));
            let RoomID =
              isMeetingVideo && !isMeetingVideoHostCheck
                ? participantRoomId
                : null;

            let UID =
              isMeetingVideo && !isMeetingVideoHostCheck
                ? participantUID
                : null;
            let data = {
              RoomID: RoomID,
              ShareScreen: false,
              UID: UID,
            };
            dispatch(screenShareTriggeredGlobally(false));
            await dispatch(isSharedScreenTriggeredApi(navigate, t, data));
          }
        }
        console.log("busyCall");
        let Data = {
          RoomID: String(RoomID),
          UserGUID: String(UID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };
        dispatch(setRaisedUnRaisedParticiant(false));
        await dispatch(
          LeaveMeetingVideo(
            Data,
            navigate,
            t,
            leaveMeetingVideoForOneToOneOrGroup ? 3 : 0,
            null,
            setJoiningOneToOneAfterLeavingPresenterView,
            setLeaveMeetingVideoForOneToOneOrGroup
          )
        );
        localStorage.setItem("isCaller", false);
        localStorage.setItem("isMeetingVideo", false);
        const emptyArray = [];
        localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
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
      } else {
        console.log("busyCall");
        leaveCallForNonMeating(0);
      }
    } else if (
      // isMeeting === false &&
      meetHostFlag?.isDashboardVideo === false
    ) {
      console.log("busyCall");
      leaveCallForNonMeating(0);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const raiseHandFunction = () => {
    setHandStatus(!handStatus);
    dispatch(participantPopup(false));
  };

  const copyToClipboardd = () => {
    let data = {
      MeetingId: Number(currentMeetingID),
    };
    dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
    showMessage(t("Link-copied"), "success", setOpen);
  };

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

  const videoHideUnHideForHost = (flag) => {
    console.log("VidOn 123", flag);
    // Set the HideVideo flag based on videoControlForParticipant
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      console.log("VidOn 123", flag);
      dispatch(setVideoControlHost(flag));
      let data = {
        RoomID: String(RoomID),
        HideVideo: !!flag, // Ensuring it's a boolean
        UID: String(UID),
        MeetingID: Number(currentMeetingID),
      };

      // Dispatch the API request with the data
      dispatch(hideUnhideSelfMainApi(navigate, t, data, 1));
    }
  };

  const muteUnMuteForHost = (flag) => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      // Prepare data for the API request
      dispatch(setAudioControlHost(flag));

      let data = {
        RoomID: String(RoomID),
        IsMuted: !!flag, // Ensuring it's a boolean
        UID: String(UID),
        MeetingID: currentMeetingID,
      };

      // Dispatch the API request with the data
      dispatch(muteUnMuteSelfMainApi(navigate, t, data, 1));
    }
  };

  const raiseUnRaiseForParticipant = (flag) => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      let data = {
        RoomID: String(RoomID),
        UID: String(UID),
        IsHandRaised: flag,
      };
      dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
    }
  };

  useEffect(() => {
    try {
      if (makeParticipantAsHost) {
        if (participantUID === makeParticipantAsHost.newHost.guid) {
          dispatch(makeParticipantHost([], false));
        }
      }
    } catch {}
  }, [makeParticipantAsHost]);

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

  // const onHandleClickForStartRecording = () => {
  //   console.log("onHandleClickForStartRecording");
  //   setStartRecordingState(false);
  //   setPauseRecordingState(true);
  //   setResumeRecordingState(false);
  //   if (presenterViewFlag && presenterViewHostFlag) {
  //     const iframe = iframeRef.current;
  //     if (iframe && iframe.contentWindow) {
  //       if (startRecordingState === false) {
  //         iframe.contentWindow.postMessage("RecordingStartMsgFromIframe", "*");
  //       } else {
  //         iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
  //       }
  //     }
  //   }
  // };

  const onHandleClickForPauseRecording = () => {
    console.log("onHandleClickForStartRecording");
    setStartRecordingState(false);
    setPauseRecordingState(false);
    setResumeRecordingState(true);
  };

  return (
    <>
      <Row className="mb-4">
        <Col lg={3} md={3} sm={12} className="mt-1">
          <p
            className={
              presenterViewFlag && MinimizeVideoFlag && isMeetingVideo
                ? "title-for-presenter"
                : "title-heading"
            }
          >
            {getMeetingTitle()}
          </p>
        </Col>

        <Col
          lg={3}
          md={3}
          sm={12}
          className="d-flex justify-content-center align-items-center mt-1"
        >
          {MaximizeVideoFlag === true &&
            showNotification === true &&
            !presenterViewFlag && (
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
            )}
        </Col>

        <Col lg={6} md={6} sm={12} className="normal-screen-top-icons">
          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !isMicActive
                ? "cursor-pointer active-state"
                : "inactive-state"
            }
          >
            {isZoomEnabled && (
              <>
                {(isMeeting && isMeetingVideo && isMeetingVideoHostCheck) ||
                (presenterViewFlag && presenterViewHostFlag) ? (
                  <>
                    {/* if Recording is start */}
                    {startRecordingState && (
                      <div
                        className="start-Recording-div"
                        onClick={onStartRecording}
                      >
                        <Tooltip
                          placement={presenterViewFlag ? "bottom" : "topRight"}
                          title={
                            (isMeeting && isMeetingVideo) ||
                            (presenterViewFlag && presenterViewHostFlag)
                              ? t("Start-recording")
                              : null
                          }
                          overlayClassName={
                            presenterViewFlag
                              ? "zindexing-for-presenter-tooltip"
                              : ""
                          }
                        >
                          <img
                            src={StartRecordLarge}
                            className="Start-Record-Button"
                            alt="Record"
                          />
                        </Tooltip>
                      </div>
                    )}

                    {/* if Recording is Pause and Stop */}
                    {pauseRecordingState && (
                      <div
                        className={"Record-Start-Background-MeetingVideo"}
                        // className={
                        //   !presenterViewFlag && !presenterViewHostFlag
                        //     ? "Record-Start-Background-MeetingVideo"
                        //     : "Record-Start-Background"
                        // }
                        // onClick={onResumeRecording}
                      >
                        <Tooltip
                          placement={presenterViewFlag ? "bottom" : "topRight"}
                          title={
                            (isMeeting && isMeetingVideo) ||
                            (presenterViewFlag && presenterViewHostFlag)
                              ? t("Stop-recording")
                              : null
                          }
                          overlayClassName={
                            presenterViewFlag
                              ? "zindexing-for-presenter-tooltip"
                              : ""
                          }
                        >
                          <img
                            src={StartRecordSmall}
                            onClick={onStopRecording}
                            className="Bunch-Start-Record-Button-2"
                            alt="Record"
                          />
                        </Tooltip>
                        <p className="Recording-text">{t("Recording...")}</p>

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
                            onClick={onPauseRecording}
                            className="Bunch-Start-Record-Button"
                            alt="Record"
                          />
                        </Tooltip>
                      </div>
                    )}

                    {/* if Recording is Pause and Resume */}
                    {resumeRecordingState && (
                      <div
                        className={"Record-Start-BackgroundRed-VideoMeeting"}
                      >
                        <p className={"RecordingPaused-text-videoMeeting"}>
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
                            className="Bunch-Start-RecordingPaused-Button"
                            alt="Record"
                            onClick={onResumeRecording}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </>
                ) : null}
              </>
            )}
          </div>

          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !isMicActive
                ? "cursor-pointer active-state"
                : "inactive-state"
            }
          >
            <Tooltip
              placement={presenterViewFlag ? "bottom" : "topRight"}
              title={
                getMeetingHostInfo?.isDashboardVideo
                  ? audioControl
                    ? t("Enable-mic")
                    : t("Disable-mic")
                  : isMicActive
                  ? t("Disable-mic")
                  : t("Enable-mic")
              }
              overlayClassName={
                presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
              }
            >
              <img
                src={
                  getMeetingHostInfo?.isDashboardVideo
                    ? audioControl
                      ? MicOff
                      : MicOn
                    : isMicActive
                    ? MicOn
                    : MicOff
                }
                onClick={() =>
                  getMeetingHostInfo?.isDashboardVideo
                    ? muteUnMuteForHost(audioControl ? false : true)
                    : disableMic()
                }
                alt="Mic"
              />
            </Tooltip>
          </div>
          <div
            className={
              LeaveCallModalFlag === true ||
              (isZoomEnabled && disableBeforeJoinZoom)
                ? "grayScaleImage"
                : !isVideoActive
                ? "cursor-pointer active-state"
                : "inactive-state"
            }
          >
            <Tooltip
              placement={presenterViewFlag ? "bottom" : "topRight"}
              overlayClassName={
                presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
              }
              title={
                getMeetingHostInfo?.isDashboardVideo
                  ? videoControl
                    ? t("Enable-video")
                    : t("Disable-video")
                  : isVideoActive
                  ? t("Disable-video")
                  : t("Enable-video")
              }
            >
              <img
                src={
                  getMeetingHostInfo?.isDashboardVideo
                    ? videoControl
                      ? VideoOff
                      : VideoOn
                    : isVideoActive
                    ? VideoOn
                    : VideoOff
                }
                onClick={() =>
                  getMeetingHostInfo?.isDashboardVideo
                    ? videoHideUnHideForHost(videoControl ? false : true)
                    : disableVideo()
                }
                alt="Video"
              />
            </Tooltip>
          </div>
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
                ? "presenterImage"
                : "screenShare-Toggle inactive-state"
            }
          >
            <Tooltip
              placement={presenterViewFlag ? "bottom" : "topRight"}
              overlayClassName={
                presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
              }
              title={
                isScreenActive || (presenterViewFlag && presenterViewHostFlag)
                  ? t("Stop-sharing")
                  : t("Screen-share")
              }
            >
              <img
                onClick={
                  !presenterViewFlag && !globallyScreenShare
                    ? screenShareButton
                    : null
                }
                src={NonActiveScreenShare}
                alt="Screen Share"
              />
            </Tooltip>
          </div>
          {!presenterViewHostFlag && getMeetingHostInfo?.isDashboardVideo && (
            <div
              className={
                LeaveCallModalFlag === true ||
                (isZoomEnabled && disableBeforeJoinZoom)
                  ? "grayScaleImage"
                  : presenterViewJoinFlag
                  ? !raisedUnRaisedParticipant
                    ? "inactive-state"
                    : "cursor-pointer active-state"
                  : getMeetingHostInfo?.isHost === false
                  ? !raisedUnRaisedParticipant
                    ? "inactive-state"
                    : "cursor-pointer active-state"
                  : !handStatus
                  ? "inactive-state"
                  : "cursor-pointer active-state"
              }
            >
              <Tooltip
                placement={
                  presenterViewJoinFlag && !presenterViewHostFlag
                    ? "bottom"
                    : "topRight"
                }
                overlayClassName={
                  presenterViewJoinFlag ? "zindexing-for-presenter-tooltip" : ""
                }
                title={
                  getMeetingHostInfo?.isHost
                    ? presenterViewJoinFlag
                      ? raisedUnRaisedParticipant
                        ? t("Lower-hand")
                        : t("Raise-hand")
                      : handStatus
                      ? t("Lower-hand")
                      : t("Raise-hand")
                    : raisedUnRaisedParticipant
                    ? t("Lower-hand")
                    : t("Raise-hand")
                }
              >
                <img
                  onClick={() =>
                    getMeetingHostInfo?.isHost
                      ? presenterViewJoinFlag && !presenterViewHostFlag
                        ? raiseUnRaiseForParticipant(
                            raisedUnRaisedParticipant ? false : true
                          )
                        : raiseHandFunction
                      : raiseUnRaiseForParticipant(
                          raisedUnRaisedParticipant ? false : true
                        )
                  }
                  src={
                    getMeetingHostInfo?.isHost
                      ? presenterViewJoinFlag
                        ? raisedUnRaisedParticipant === true
                          ? LowerHand
                          : RaiseHand
                        : handStatus
                        ? LowerHand
                        : RaiseHand
                      : raisedUnRaisedParticipant === true
                      ? LowerHand
                      : RaiseHand
                  }
                  alt="Raise Hand"
                />
              </Tooltip>
            </div>
          )}

          {(!presenterViewFlag && getMeetingHostInfo?.isHost) ||
          (presenterViewHostFlag && presenterViewFlag) ? (
            <div
              className={
                LeaveCallModalFlag
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }
            >
              <Tooltip
                placement={presenterViewFlag ? "bottom" : "topRight"}
                overlayClassName={
                  presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
                }
                title={t("Copy-link")}
              >
                <img
                  onClick={copyToClipboardd}
                  src={CopyLink}
                  alt="Copy Link"
                />
              </Tooltip>
            </div>
          ) : null}

          {!isZoomEnabled && (
            <>
              {MaximizeVideoFlag && (
                <div
                  className={
                    LeaveCallModalFlag === true ||
                    (isZoomEnabled && disableBeforeJoinZoom)
                      ? "grayScaleImage"
                      : presenterViewFlag && !presenterViewHostFlag
                      ? "presenterImage"
                      : "screenShare-Toggle"
                  }
                >
                  <Tooltip
                    placement={presenterViewFlag ? "bottom" : "topRight"}
                    overlayClassName={
                      presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
                    }
                    title={t("Layout")}
                  >
                    <img
                      className={"cursor-pointer"}
                      onClick={
                        presenterViewFlag &&
                        !presenterViewHostFlag &&
                        !JSON.parse(localStorage.getItem("isMeetingVideo"))
                          ? null
                          : layoutCurrentChange
                      }
                      src={showTile ? TileView : SidebarView}
                      alt="Layout Change"
                    />
                  </Tooltip>
                </div>
              )}
            </>
          )}

          {(presenterViewFlag && presenterViewHostFlag) ||
          (currentCallType === 2 &&
            !presenterViewFlag &&
            !presenterViewHostFlag) ||
          (currentCallType === 3 &&
            !presenterViewFlag &&
            !presenterViewHostFlag) ? (
            <div className={"position-relative"}>
              {ParticipantPopupFlag === true ? (
                <>
                  <div className="cursor-pointer active-state">
                    <img
                      src={ActiveParticipantIcon}
                      onClick={() => {
                        const role = getMeetingHostInfo.isHost ? 1 : 2;
                        closeParticipantHandler(role, true);
                      }}
                      alt="Active participants"
                    />
                  </div>
                  <div className="participants-list">
                    {isCaller && (
                      <>
                        {groupCallParticipantList !== null &&
                        groupCallParticipantList.length > 0
                          ? groupCallParticipantList.map(
                              (participantData, index) => {
                                const displayStatus =
                                  participantData.callStatusID === 4
                                    ? t("Calling")
                                    : participantData.callStatus;

                                // Check if participant is in the accepted list
                                const isMatchingParticipant =
                                  groupVideoCallAccepted.some(
                                    (user) =>
                                      user.recepientID ===
                                        participantData.userID &&
                                      user.recepientName ===
                                        participantData.name
                                  );

                                // Check if participant is in the accepted list
                                const isMatchingParticipantUnanswered =
                                  unansweredCallParticipant.some(
                                    (user) =>
                                      user.recepientID ===
                                        participantData.userID &&
                                      user.recepientName ===
                                        participantData.name
                                  );

                                return (
                                  <Row className="m-0" key={index}>
                                    <Col className="p-0" lg={7} md={7} sm={12}>
                                      <p className="participant-name">
                                        {participantData.name}
                                      </p>
                                    </Col>
                                    <Col
                                      className="d-flex justify-content-end align-items-baseline gap-3 p-0"
                                      lg={5}
                                      md={5}
                                      sm={12}
                                    >
                                      {isMatchingParticipant ? (
                                        <>
                                          <Row>
                                            <Col>
                                              <p className="participant-state">
                                                {t("Accepted")}
                                              </p>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : isMatchingParticipantUnanswered ? (
                                        <>
                                          <Row>
                                            <Col>
                                              <p className="participant-state">
                                                {t("Unanswered")}
                                              </p>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <p className="participant-state">
                                          {displayStatus}
                                        </p>
                                      )}
                                    </Col>
                                  </Row>
                                );
                              }
                            )
                          : null}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <Tooltip placement="topRight" title={t("Participants")}>
                  <div
                    className={
                      LeaveCallModalFlag === true
                        ? "grayScaleImage"
                        : "inactive-state"
                    }
                  >
                    <img
                      src={ParticipantsIcon}
                      onClick={() => {
                        const role = getMeetingHostInfo.isHost
                          ? 1
                          : presenterViewHostFlag
                          ? 1
                          : 2;
                        const flag = getMeetingHostInfo.isHost
                          ? false
                          : presenterViewHostFlag
                          ? false
                          : true;
                        closeParticipantHandler(role, flag);
                      }}
                      alt="Participants"
                    />
                  </div>
                </Tooltip>
              )}

              {presenterViewFlag && presenterViewHostFlag ? (
                <>
                  {handRaiseCounter > 0 && (
                    <span className="HandRaise-Counter-for-Presenter">
                      {convertNumbersInString(handRaiseCounter, lan)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="participants-counter-For-Host">
                    {getMeetingHostInfo?.isDashboardVideo &&
                      convertNumbersInString(participantCounterList, lan)}
                  </span>
                  {participantWaitingListCounter > 0 && (
                    <span className="participants-counter-For-Host-waiting-counter">
                      {convertNumbersInString(
                        participantWaitingListCounter,
                        lan
                      )}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : null}

          {currentCallType === 1 && !presenterViewFlag && (
            <>
              {currentCallType === 1 && checkFeatureIDAvailability(3) && (
                <div
                  className={
                    LeaveCallModalFlag === true
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
              )}
            </>
          )}

          <Tooltip
            placement={presenterViewFlag ? "bottom" : "topRight"}
            overlayClassName={
              presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
            }
            title={t("Minimize")}
          >
            <div
              onClick={minimizeVideoPanel}
              className={
                LeaveCallModalFlag === true
                  ? "grayScaleImage"
                  : "inactive-state"
              }
            >
              <img src={MinimizeIcon} alt="Minimize" />
            </div>
          </Tooltip>

          {LeaveCallModalFlag === true && callerID === currentUserID ? (
            <div className="active-state-end">
              <Tooltip title={t("Cancel")}>
                <img
                  onClick={cancelLeaveCallOption}
                  src={videoEndIcon}
                  alt="End Call"
                />
              </Tooltip>
            </div>
          ) : (LeaveCallModalFlag === false && callerID === currentUserID) ||
            getMeetingHostInfo?.isDashboardVideo ? (
            <Tooltip
              title={
                isMeetingVideo ? t("Leave-meeting-video-call") : t("End-call")
              }
            >
              <div className="inactive-state">
                <img
                  className="cursor-pointer"
                  src={CallEndRedIcon}
                  onClick={openVideoPanel}
                  alt="End Call"
                />
              </div>
            </Tooltip>
          ) : LeaveCallModalFlag === false && callerID !== currentUserID ? (
            <Tooltip
              placement={presenterViewFlag ? "bottom" : "topRight"}
              overlayClassName={
                presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
              }
              title={
                isMeetingVideo ? t("Leave-meeting-video-call") : t("Leave-call")
              }
            >
              <img
                className="inactive-state"
                src={CallEndRedIcon}
                onClick={endCallParticipant}
                alt="End Call"
              />
            </Tooltip>
          ) : null}

          {(NormalizeVideoFlag || MaximizeVideoFlag) && (
            <Tooltip
              placement={presenterViewFlag ? "bottom" : "topRight"}
              overlayClassName={
                presenterViewFlag ? "zindexing-for-presenter-tooltip" : ""
              }
              title={
                NormalizeVideoFlag
                  ? t("Expand")
                  : MaximizeVideoFlag
                  ? t("Collapse")
                  : null
              }
            >
              <div
                className={
                  LeaveCallModalFlag === true
                    ? "grayScaleImage"
                    : presenterViewFlag &&
                      (presenterViewHostFlag || presenterViewJoinFlag)
                    ? "presenterImage"
                    : "inactive-state"
                }
              >
                <img
                  src={
                    NormalizeVideoFlag
                      ? ExpandIcon
                      : MaximizeVideoFlag ||
                        (!presenterViewFlag &&
                          (!presenterViewHostFlag || !presenterViewJoinFlag))
                      ? NormalizeIcon
                      : null
                  }
                  onClick={
                    NormalizeVideoFlag
                      ? otoMaximizeVideoPanel
                      : presenterViewFlag &&
                        MaximizeVideoFlag &&
                        (presenterViewHostFlag || presenterViewJoinFlag)
                      ? null
                      : MaximizeVideoFlag
                      ? normalizeScreen
                      : null
                  }
                  alt={
                    NormalizeVideoFlag
                      ? "Expand"
                      : MaximizeVideoFlag
                      ? "Maximize"
                      : null
                  }
                />
              </div>
            </Tooltip>
          )}
        </Col>
      </Row>
      <>
        <>
          <div ref={leaveModalPopupRef}>
            {LeaveCallModalFlag === true && !MinimizeVideoFlag ? (
              <div className="leave-meeting-options leave-meeting-options-position">
                <div className="leave-meeting-options__inner">
                  {editorRole.role === "Organizer" ? (
                    <>
                      <Button
                        className="leave-meeting-options__btn leave-meeting-red-button"
                        text={
                          presenterViewFlag && presenterViewHostFlag
                            ? t("Stop-presentation")
                            : presenterViewFlag && presenterViewJoinFlag
                            ? t("Leave-presentation")
                            : isMeetingVideo
                            ? t("Leave-meeting-video-call")
                            : t("End-call")
                        }
                        onClick={() => leaveCall(false, false, false, false)}
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
                        text={
                          presenterViewFlag && presenterViewHostFlag
                            ? t("Stop-presentation")
                            : presenterViewFlag && presenterViewJoinFlag
                            ? t("Leave-presentation")
                            : isMeetingVideo
                            ? t("Leave-meeting-video-call")
                            : t("End-call")
                        }
                        onClick={participantLeaveCall}
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

            <Notification setOpen={setOpen} open={open} />
          </div>
        </>
      </>
    </>
  );
};

export default VideoCallNormalHeader;
