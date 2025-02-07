import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
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
  setRaisedUnRaisedParticiant,
  toggleParticipantsVisibility,
  leaveMeetingVideoOnlogout,
  leaveMeetingOnlogout,
  makeParticipantHost,
  closeQuickMeetingVideo,
  closeQuickMeetingModal,
  endMeetingStatusForQuickMeetingVideo,
  endMeetingStatusForQuickMeetingModal,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingOnEndStatusMqtt,
  leavePresenterViewMainApi,
  stopPresenterViewMainApi,
  presenterViewGlobalState,
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
import { useGroupsContext } from "../../../../../context/GroupsContext";
import { webnotificationGlobalFlag } from "../../../../../store/actions/UpdateUserNotificationSetting";

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
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const location = useLocation();

  const { editorRole } = useContext(MeetingContext);
  // const { isMeeting } = useMeetingContext();

  const leaveModalPopupRef = useRef(null);

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );

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

  // For acccept Join name participantList
  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
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

  //makeHostNow Reducer
  const makeHostNow = useSelector(
    (state) => state.videoFeatureReducer.makeHostNow
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

  console.log(
    { presenterViewFlag, presenterViewHostFlag },
    "presenterViewFlag && presenterViewHostFlag"
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const presenterMeetingId = useSelector(
    (state) => state.videoFeatureReducer.presenterMeetingId
  );

  const meetingStoppedByPresenter = useSelector(
    (state) => state.videoFeatureReducer.meetingStoppedByPresenter
  );

  const presenterStartedFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterStartedFlag
  );
  let callerNameInitiate = localStorage.getItem("callerNameInitiate");
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let organizationName = localStorage.getItem("organizatioName");
  let currentUserName = localStorage.getItem("name");
  let callerName = localStorage.getItem("callerName");
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem("initiateVideoCall")
  );
  let lan = localStorage.getItem("i18nextLng");
  let recipentCalledID = Number(localStorage.getItem("recipentCalledID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let callerID = Number(localStorage.getItem("callerID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let newRoomID = localStorage.getItem("newRoomId");
  let newUserGUID = localStorage.getItem("isGuid");
  let newName = localStorage.getItem("name");
  let participantRoomIds = localStorage.getItem("participantRoomId");
  let participantUID = localStorage.getItem("participantUID");
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let initiateRoomID = localStorage.getItem("initiateCallRoomID");
  let callerObject = localStorage.getItem("callerStatusObject");
  let currentCallType = Number(localStorage.getItem("CallType"));
  let meetingTitle = localStorage.getItem("meetingTitle");
  let currentMeetingID = JSON.parse(localStorage.getItem("currentMeetingID"));
  let getMeetingHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  const getDashboardVideo = getMeetingHostInfo;

  const [showNotification, setShowNotification] = useState(true);

  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);

  const [isActiveIcon, setIsActiveIcon] = useState(false);

  const [currentParticipants, setCurrentParticipants] = useState([]);

  const [participantStatus, setParticipantStatus] = useState([]);

  const [addParticipantPopup, setAddParticipantPopup] = useState(false);

  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [isMeetingHost, setIsMeetingHost] = useState(null);

  const [participantCounterList, setParticipantCounterList] = useState([]);

  // to show a host participants list counter
  const participantCounter = participantCounterList?.length;

  // to show a host participants waiting List Counter
  const participantWaitingListCounter = waitingParticipantsList?.length;

  const [handStatus, setHandStatus] = useState(raisedUnRaisedParticipant);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  let isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );
  // for show Participant popUp only
  // Update filteredParticipants based on participantList
  useEffect(() => {
    if (getVideoParticpantListandWaitingList?.length) {
      const uniqueParticipants = getVideoParticpantListandWaitingList.filter(
        (participant, index, self) =>
          self.findIndex((p) => p.userID === participant.userID) === index
      );
      setParticipantCounterList(uniqueParticipants);
    } else {
      setParticipantCounterList([]);
    }
  }, [getVideoParticpantListandWaitingList]);

  useEffect(() => {
    if (makeHostNow !== null) {
      if (
        currentUserID === makeHostNow.isHostId &&
        makeHostNow.isHost === true
      ) {
        setIsMeetingHost(true);
      } else {
        setIsMeetingHost(null);
      }
    }
  }, [makeHostNow]);

  useEffect(() => {
    if (meetingUrlData !== null && meetingUrlData !== undefined) {
      setMeetingURLLocalData(meetingUrlData);
    } else {
      setMeetingURLLocalData(null);
    }
  }, [meetingUrlData]);

  const otoMaximizeVideoPanel = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(normalizeVideoPanelFlag(false));
    }
    setShowNotification(true);
  };

  const handleCheckboxChange = (userID) => (e) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedParticipants((prev) => [...prev, userID]);
    } else {
      setSelectedParticipants((prev) => prev.filter((id) => id !== userID));
    }
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
    localStorage.setItem("activeCall", false);
  };

  const openVideoPanel = () => {
    console.log("busyCall");
    dispatch(leaveCallModal(true));
    dispatch(toggleParticipantsVisibility(false));
  };

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
  let alreadyInMeetingVideo = JSON.parse(
    sessionStorage.getItem("alreadyInMeetingVideo")
      ? sessionStorage.getItem("alreadyInMeetingVideo")
      : false
  );
  // after presenter view is true then this funct call
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
          dispatch(stopPresenterViewMainApi(navigate, t, data));
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

  const endCallParticipant = async () => {
    console.log("busyCall");
    try {
      if (iframeCurrent && iframeCurrent.contentWindow !== null) {
        console.log("busyCall");

        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (error) {}

    if (getDashboardVideo.isDashboardVideo === false) {
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: roomID,
        IsCaller: false,
        CallTypeID: callTypeID,
      };
      dispatch(LeaveCall(Data, navigate, t));
      console.log("Not End 1");
      const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
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
      console.log("busyCall");

      const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
      if (presenterViewFlag) {
        console.log("Check Presenter");
        handlePresenterViewFunc();
      } else if (isMeetingVideoHostCheck) {
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(newUserGUID),
          Name: String(newName),
          IsHost: meetHostFlag?.isHost ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        dispatch(LeaveMeetingVideo(Data, navigate, t));
      } else {
        dispatch(toggleParticipantsVisibility(false));

        let Data = {
          RoomID: String(participantRoomIds),
          UserGUID: String(participantUID),
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
      // localStorage.setItem("meetingTitle", "");
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

  const closeParticipantHandler = (flag, value) => {
    console.log("check kerrai hy ", flag, value);
    if (flag === 1) {
      let check = priticipantListModalFlagForHost ? false : true;
      console.log("check kerrai hy ", check, priticipantListModalFlagForHost);
      dispatch(participantWaitingListBox(check));
    } else if (flag === 2) {
      let check = priticipantListModalFlagForNonHost ? false : true;
      console.log(
        "check kerrai hy ",
        check,
        priticipantListModalFlagForNonHost
      );
      dispatch(toggleParticipantsVisibility(check));
    }
    // if (LeaveCallModalFlag === false) {
    //   if (ParticipantPopupFlag === false) {
    //     // dispatch(participantPopup(true));
    //     dispatch(toggleParticipantsVisibility(true));
    //     dispatch(participantWaitingListBox(true));
    //     setAddParticipantPopup(false);
    //   } else {
    //     // dispatch(participantPopup(false));
    //     dispatch(participantWaitingListBox(false));
    //     setAddParticipantPopup(false);
    //   }
    // }
  };

  const normalizeScreen = () => {
    if (LeaveCallModalFlag === false) {
      dispatch(normalizeVideoPanelFlag(true));
      dispatch(maximizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
    }
  };

  const cancelLeaveCallOption = () => {
    console.log("busyCall");
    dispatch(leaveCallModal(false));
    dispatch(toggleParticipantsVisibility(false));
  };

  // for Host leave Call
  const leaveCall = async (flag, flag2, flag3) => {
    console.log("busyCall");
    try {
      if (iframeCurrent && iframeCurrent.contentWindow !== null) {
        console.log("busyCall");

        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (error) {}
    if (isMeeting === true) {
      const meetHostFlag = localStorage.getItem("meetinHostInfo");
      console.log(meetHostFlag, "meetHostFlagmeetHostFlag");
      if (presenterViewFlag) {
        console.log("Check Presenter");
        handlePresenterViewFunc();
      } else if (isMeetingVideoHostCheck) {
        // Parse the string into an object
        console.log(isMeetingVideoHostCheck, "parsedHostFlag");
        if (isMeetingVideoHostCheck) {
          let Data = {
            RoomID: String(newRoomID),
            UserGUID: String(newUserGUID),
            Name: String(newName),
            IsHost: isMeetingVideoHostCheck ? true : false,
            MeetingID: Number(currentMeetingID),
          };

          await dispatch(LeaveMeetingVideo(Data, navigate, t));
          leaveSuccess();
        } else {
          let Data = {
            RoomID: String(participantRoomIds),
            UserGUID: String(participantUID),
            Name: String(newName),
            IsHost: isMeetingVideoHostCheck ? true : false,
            MeetingID: Number(currentMeetingID),
          };

          await dispatch(setRaisedUnRaisedParticiant(false));
          await dispatch(LeaveMeetingVideo(Data, navigate, t));
          leaveSuccess();
        }
      }
    } else if (getDashboardVideo.isDashboardVideo === false) {
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

  // useEffect(() => {
  //   if (meetingStoppedByPresenter) {
  //     leaveCall(false, false, false, true);
  //   }
  // }, [meetingStoppedByPresenter]);

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnLogoutResponse) {
        leaveCall(true, false, false, false);
      }
    } catch {}
  }, [leaveMeetingVideoOnLogoutResponse]);

  useEffect(() => {
    try {
      if (closeQuickMeetingVideoReducer) {
        console.log("mqtt mqmqmqmqmqmq");
        leaveCall(false, true, false, false);
      }
    } catch (error) {}
  }, [closeQuickMeetingVideoReducer]);

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnEndStatusMqttFlag) {
        console.log("mqtt mqmqmqmqmqmq");
        leaveCall(false, false, true, false);
      }
    } catch (error) {}
  }, [leaveMeetingVideoOnEndStatusMqttFlag]);

  // For Participant Leave Call
  const participantLeaveCall = async () => {
    dispatch(toggleParticipantsVisibility(false));
    console.log("busyCall");
    try {
      if (iframeCurrent && iframeCurrent.contentWindow !== null) {
        console.log("busyCall");

        iframeCurrent.contentWindow.postMessage("leaveSession", "*");
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (error) {}

    localStorage.removeItem("currentHostUserID");
    localStorage.removeItem("currentHostUserID");
    localStorage.removeItem("isHost");
    localStorage.removeItem("isNewHost");
    const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));

    if (isMeeting === true) {
      console.log("busyCall");
      const meetHostFlag = JSON.parse(localStorage.getItem("meetinHostInfo"));
      console.log(meetHostFlag, "meetHostFlagmeetHostFlag");
      if (presenterViewFlag) {
        console.log("Check Presenter");
        handlePresenterViewFunc();
      } else if (isMeetingVideoHostCheck) {
        console.log("busyCall");
        let Data = {
          RoomID: String(newRoomID),
          UserGUID: String(newUserGUID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        dispatch(LeaveMeetingVideo(Data, navigate, t));
      } else {
        console.log("busyCall");
        let Data = {
          RoomID: String(participantRoomIds),
          UserGUID: String(participantUID),
          Name: String(newName),
          IsHost: isMeetingVideoHostCheck ? true : false,
          MeetingID: Number(currentMeetingID),
        };

        dispatch(setRaisedUnRaisedParticiant(false));
        dispatch(LeaveMeetingVideo(Data, navigate, t));
      }
    } else if (
      isMeeting === false &&
      getDashboardVideo.isDashboardVideo === false
    ) {
      console.log("busyCall");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: initiateRoomID,
        IsCaller: true,
        CallTypeID: callTypeID,
      };
      dispatch(LeaveCall(Data, navigate, t));
    }
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
    setHandStatus(!handStatus);
    dispatch(participantPopup(false));
  };

  const addMoreParticipants = () => {
    setAddParticipantPopup(!addParticipantPopup);
    dispatch(participantPopup(false));
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
      GroupCallRecipientsData !== undefined &&
      GroupCallRecipientsData !== null &&
      GroupCallRecipientsData.length !== 0
    ) {
      setCurrentParticipants(GroupCallRecipientsData);
    } else {
      setCurrentParticipants([]);
    }
  }, [GroupCallRecipientsData]);

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

  const videoHideUnHideForParticipant = (flag) => {
    console.log(
      "videoHideUnHideForHost",
      presenterViewFlag,
      getMeetingHostInfo.isHost,
      newUserGUID,
      participantUID,
      getMeetingHostInfo.isHost,
      newUserGUID,
      participantUID
    );
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      // Prepare data for the API request
      let data = {
        RoomID: String(participantRoomIds),
        HideVideo: flag, // Set HideVideo to true or false
        UID: String(isMeetingVideoHostCheck ? newUserGUID : participantUID),
      };

      // Dispatch the API request with the data
      dispatch(hideUnhideSelfMainApi(navigate, t, data, 2));
    } else {
      console.log("Check");
    }
  };

  const videoHideUnHideForHost = (flag) => {
    // Set the HideVideo flag based on videoControlForParticipant
    // const flag = videoControl;
    console.log("videoHideUnHideForHost", flag);
    console.log(
      "videoHideUnHideForHost",
      presenterViewFlag,
      getMeetingHostInfo.isHost,
      newUserGUID,
      participantUID,
      getMeetingHostInfo.isHost,
      newUserGUID,
      participantUID
    );

    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      // Prepare data for the API request
      let data = {
        RoomID: String(presenterViewFlag ? roomID : newRoomID),
        HideVideo: flag, // Set HideVideo to true or false
        UID: String(isMeetingVideoHostCheck ? newUserGUID : participantUID),
      };

      // Dispatch the API request with the data
      dispatch(hideUnhideSelfMainApi(navigate, t, data, 1));
    } else {
      console.log("Check");
    }
  };

  const muteUnMuteForHost = (flag) => {
    // const flag = audioControlHost;
    console.log("videoHideUnHideForHost", flag);
   
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      // Prepare data for the API request
      let data = {
        RoomID: String(presenterViewFlag ? roomID : newRoomID),
        IsMuted: flag,
        UID: String(isMeetingVideoHostCheck ? newUserGUID : participantUID),
      };

      // Dispatch the API request with the data
      dispatch(muteUnMuteSelfMainApi(navigate, t, data, 1));
    } else {
      console.log("Check");
    }
  };

  const muteUnMuteForParticipant = (flag) => {
    console.log("muteUnMuteForParticipant", flag);
    console.log(
      "muteUnMuteForParticipant",
      presenterViewFlag,
      getMeetingHostInfo.isHost,
      newUserGUID,
      participantUID,
      newUserGUID
    );
    // const flag = audioControl;
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      let data = {
        RoomID: String(presenterViewFlag ? roomID : participantRoomIds),
        IsMuted: flag,
        UID: String(isMeetingVideoHostCheck ? newUserGUID : participantUID),
      };
      // Dispatch the API call with the structured request data
      dispatch(muteUnMuteSelfMainApi(navigate, t, data, 2));
    } else {
      console.log("Check");
    }
  };

  const raiseUnRaiseForParticipant = () => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      const flag = !raisedUnRaisedParticipant;
      let data = {
        RoomID: String(presenterViewFlag ? roomID : participantRoomIds),
        UID: String(isMeetingVideoHostCheck ? newUserGUID : participantUID),
        IsHandRaised: flag,
      };
      localStorage.setItem("handStatus", flag);
      setHandStatus(flag);
      dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
    } else {
      console.log("Check");
    }
  };

  const onClickCLoseParticipantPanel = () => {
    dispatch(toggleParticipantsVisibility(false));
  };

  useEffect(() => {
    try {
      if (makeParticipantAsHost) {
        if (
          localStorage.getItem("participantUID") ===
          makeParticipantAsHost.newHost.guid
        ) {
          setIsMeetingHost(true);
          // hostTrasfer(makeParticipantAsHostData);
          dispatch(makeParticipantHost([], false));
        }
      }
    } catch {}
  }, [makeParticipantAsHost]);
  return (
    <>
      <Row className="mb-4">
        <Col lg={3} md={3} sm={12} className="mt-1">
          <p className="title-heading">
            {currentCallType === 2 && callTypeID === 2
              ? meetingTitle?.trim() || t("Group-call")
              : meetingTitle?.trim()
              ? meetingTitle?.trim()
              : currentUserName !== VideoRecipentData.userName &&
                Object.keys(VideoRecipentData).length > 0
              ? VideoRecipentData.userName ||
                VideoRecipentData.recipients?.[0]?.userName
              : Object.keys(VideoRecipentData).length === 0
              ? callerName
              : null}
          </p>
        </Col>

        <Col
          lg={3}
          md={3}
          sm={12}
          className="d-flex justify-content-center align-items-center mt-1"
        >
          {MaximizeVideoFlag === true && showNotification === true && (
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
            <Tooltip
              placement="topRight"
              title={
                getMeetingHostInfo?.isDashboardVideo
                  ? getMeetingHostInfo.isHost ||
                    (presenterViewFlag && presenterViewHostFlag)
                    ? audioControl
                      ? t("Enable-mic")
                      : t("Disable-mic")
                    : audioControl
                    ? t("Enable-mic")
                    : t("Disable-mic")
                  : isMicActive
                  ? t("Disable-mic")
                  : t("Enable-mic")
              }
            >
              <img
                src={
                  getMeetingHostInfo?.isDashboardVideo
                    ? getMeetingHostInfo.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)
                      ? audioControl
                        ? MicOff
                        : MicOn
                      : audioControl
                      ? MicOff
                      : MicOn
                    : isMicActive
                    ? MicOn
                    : MicOff
                }
                onClick={() =>
                  getMeetingHostInfo?.isDashboardVideo
                    ? getMeetingHostInfo.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)
                      ? muteUnMuteForHost(audioControl ? false : true)
                      : muteUnMuteForParticipant(
                          audioControl ? false : true
                        )
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
              placement="topRight"
              title={
                getMeetingHostInfo?.isDashboardVideo
                  ? getMeetingHostInfo.isHost ||
                    (presenterViewFlag && presenterViewHostFlag)
                    ? videoControl
                      ? t("Enable-video")
                      : t("Disable-video")
                    : videoControl
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
                    ? getMeetingHostInfo.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)
                      ? videoControl
                        ? VideoOff
                        : VideoOn
                      : videoControl
                      ? VideoOff
                      : VideoOn
                    : isVideoActive
                    ? VideoOn
                    : VideoOff
                }
                onClick={() =>
                  getMeetingHostInfo?.isDashboardVideo
                    ? getMeetingHostInfo.isHost ||
                      (presenterViewFlag && presenterViewHostFlag)
                      ? videoHideUnHideForHost(videoControl ? false : true)
                      : videoHideUnHideForParticipant(
                          videoControl ? false : true
                        )
                    : disableVideo()
                }
                alt="Video"
              />
            </Tooltip>
          </div>
          {checkFeatureIDAvailability(5) && (
            <div
              className={
                LeaveCallModalFlag === true ||
                (isZoomEnabled && disableBeforeJoinZoom) ||
                presenterViewFlag
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }
            >
              <Tooltip
                placement="topRight"
                title={
                  isScreenActive || presenterViewFlag
                    ? t("Stop-sharing")
                    : t("Screen-share")
                }
              >
                <img
                  onClick={!presenterViewFlag ? screenShareButton : null}
                  src={NonActiveScreenShare}
                  alt="Screen Share"
                />
              </Tooltip>
            </div>
          )}
          {getMeetingHostInfo.isDashboardVideo && (
            <div
              className={
                LeaveCallModalFlag === true ||
                (isZoomEnabled && disableBeforeJoinZoom)
                  ? "grayScaleImage"
                  : !handStatus
                  ? "inactive-state"
                  : "cursor-pointer active-state"
              }
            >
              <Tooltip
                placement="topRight"
                title={
                  getMeetingHostInfo.isHost
                    ? handStatus
                      ? t("Lower-hand")
                      : t("Raise-hand")
                    : raisedUnRaisedParticipant
                    ? t("Lower-hand")
                    : t("Raise-hand")
                }
              >
                <img
                  onClick={
                    getMeetingHostInfo.isHost
                      ? raiseHandFunction
                      : raiseUnRaiseForParticipant
                  }
                  src={
                    getMeetingHostInfo.isHost
                      ? handStatus
                        ? LowerHand
                        : RaiseHand
                      : raisedUnRaisedParticipant === true
                      ? Raisehandselected
                      : RaiseHand
                  }
                  alt="Raise Hand"
                />
              </Tooltip>
            </div>
          )}
          {(!presenterViewFlag && getMeetingHostInfo.isHost) ||
          (presenterViewHostFlag && presenterViewFlag) ? (
            <div
              className={
                LeaveCallModalFlag
                  ? "grayScaleImage"
                  : "screenShare-Toggle inactive-state"
              }
            >
              <Tooltip placement="topRight" title={t("Copy-link")}>
                <img
                  onClick={copyToClipboardd}
                  src={CopyLink}
                  alt="Copy Link"
                />
              </Tooltip>
            </div>
          ) : null}

          {MaximizeVideoFlag && (
            <div
              className={
                LeaveCallModalFlag === true ||
                (isZoomEnabled && disableBeforeJoinZoom) ||
                (presenterViewFlag && !presenterViewHostFlag)
                  ? "grayScaleImage"
                  : "screenShare-Toggle"
              }
            >
              <Tooltip placement="topRight" title={t("Layout")}>
                <img
                  className={"cursor-pointer"}
                  onClick={
                    presenterViewFlag && !presenterViewHostFlag
                      ? null
                      : layoutCurrentChange
                  }
                  src={showTile ? TileView : SidebarView}
                  alt="Layout Change"
                />
              </Tooltip>
            </div>
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
                    {currentParticipants !== undefined &&
                    currentParticipants !== null &&
                    currentParticipants.length > 0
                      ? currentParticipants.map((participantData, index) => {
                          return (
                            <Row className="m-0" key={index}>
                              <Col className="p-0" lg={7} md={7} sm={12}>
                                <p className="participant-name">
                                  {participantData.userName}
                                </p>
                              </Col>
                              <Col
                                className="d-flex justify-content-end align-items-canter gap-3 p-0"
                                lg={5}
                                md={5}
                                sm={12}
                              >
                                <img src={MenuRaiseHand} alt="MenuRaiseHand" />

                                <Dropdown>
                                  <Dropdown.Toggle className="participant-toggle">
                                    <img src={Menu} alt="Menu" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
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
                          );
                        })
                      : null}
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
              <span className="participants-counter-For-Host">
                {convertNumbersInString(participantCounter, lan)}
              </span>
              {participantWaitingListCounter > 0 && (
                <span className="participants-counter-For-Host-waiting-counter">
                  {convertNumbersInString(participantWaitingListCounter, lan)}
                </span>
              )}
            </div>
          ) : null}

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

          <Tooltip placement="topRight" title={t("Minimize")}>
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
              <Tooltip placement="topRight" title={t("Cancel")}>
                <img
                  onClick={cancelLeaveCallOption}
                  src={videoEndIcon}
                  alt="End Call"
                />
              </Tooltip>
            </div>
          ) : (LeaveCallModalFlag === false && callerID === currentUserID) ||
            getMeetingHostInfo.isDashboardVideo ? (
            <Tooltip placement="topRight" title={t("Leave-call")}>
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
            <Tooltip placement="topRight" title={t("End-call")}>
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
              placement="topRight"
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
                    : "inactive-state"
                }
              >
                <img
                  src={
                    NormalizeVideoFlag
                      ? ExpandIcon
                      : MaximizeVideoFlag
                      ? NormalizeIcon
                      : null
                  }
                  onClick={
                    NormalizeVideoFlag
                      ? otoMaximizeVideoPanel
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

      <div ref={leaveModalPopupRef}>
        {LeaveCallModalFlag === true ? (
          <div className="leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              {editorRole.role === "Organizer" ? (
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
                    onClick={() => leaveCall(false, false, false)}
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
                        ? t("Stop-presenting")
                        : presenterViewFlag && !presenterViewHostFlag
                        ? t("Leave-presenting")
                        : t("Leave-call")
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

        <Notification
          setOpen={setOpen}
          open={open.flag}
          message={open.message}
        />
      </div>
    </>
  );
};

export default VideoCallNormalHeader;
