import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./videoCallNormalPanel.css";
import VideoCallNormalHeader from "../videoCallHeader/videoCallNormalHeader";
import VideoPanelNormalAgenda from "./videoCallNormalAgenda";
import VideoPanelNormalMinutesMeeting from "./videoCallNormalMinutesMeeting";
import { LoaderPanelVideoScreen } from "../../../../elements";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
import {
  endIndexUrl,
  extractedUrl,
  generateURLCaller,
  generateURLParticipant,
} from "../../../../../commen/functions/urlVideoCalls";
import VideoOutgoing from "../videoCallBody/VideoMaxOutgoing";
import { useTranslation } from "react-i18next";
import VideoNewParticipantList from "../videoNewParticipantList/VideoNewParticipantList";
import { transferMeetingHostSuccess } from "../../../../../store/actions/Guest_Video";
import { useNavigate } from "react-router-dom";
import {
  acceptHostTransferAccessGlobalFunc,
  disableZoomBeforeJoinSession,
  getVideoCallParticipantsMainApi,
  incomingVideoCallFlag,
  isSharedScreenTriggeredApi,
  leaveCallModal,
  leavePresenterViewMainApi,
  makeHostNow,
  makeParticipantHost,
  maximizeVideoPanelFlag,
  maxParticipantVideoRemoved,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  participanMuteUnMuteMeeting,
  participantListWaitingListMainApi,
  participantWaitingListBox,
  presenterFlagForAlreadyInParticipantMeetingVideo,
  presenterStartedMainFlag,
  presenterViewGlobalState,
  setAudioControlHost,
  setParticipantLeaveCallForJoinNonMeetingCall,
  setParticipantRemovedFromVideobyHost,
  setRaisedUnRaisedParticiant,
  setVideoControlHost,
  startPresenterViewMainApi,
  stopPresenterViewMainApi,
  stopScreenShareOnPresenterStarting,
  toggleParticipantsVisibility,
  updatedParticipantListForPresenter,
} from "../../../../../store/actions/VideoFeature_actions";
import BlackCrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";
import NormalHostVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import MaxHostVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import ParticipantVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import NormalParticipantVideoComponent from "../../../../../container/pages/meeting/meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import MaxParticipantVideoDeniedComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import {
  initiateVideoCallFail,
  VideoCallResponse,
} from "../../../../../store/actions/VideoMain_actions";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const VideoPanelNormal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shareScreenTrue,
    setShareScreenTrue,
    toggleVideoMinimizeNonMeeting,
    setToggleVideoMinimizeNonMeeting,
    toggleMicMinimizeNonMeeting,
    setToggleMicMinimizeNonMeeting,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setStopRecordingState,
    iframeRef,
    setHandRaiseCounter,
  } = useMeetingContext();

  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");

  let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

  let newRoomID = localStorage.getItem("newRoomId");

  let NewRoomID = localStorage.getItem("NewRoomID");

  let activeRoomID = localStorage.getItem("activeRoomID");

  let currentUserName = localStorage.getItem("name");

  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

  let CallType = Number(localStorage.getItem("CallType"));

  let initiateVideoCall = JSON.parse(localStorage.getItem("initiateVideoCall"));

  let isCaller = JSON.parse(localStorage.getItem("isCaller"));

  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  let participantRoomIds = localStorage.getItem("participantRoomId");

  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

  let isMeetingVideoHostChecker = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );

  localStorage.setItem("VideoView", "Sidebar");

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );
  const FullLoader = useSelector((state) => state.VideoMainReducer.FullLoader);

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
  );

  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag
  );

  const VideoChatPanel = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel
  );

  const participantWaitinglistBox = useSelector(
    (state) => state.videoFeatureReducer.participantWaitinglistBox
  );

  const VideoOutgoingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoOutgoingCallFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );
  const VideoAgendaNormalFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoAgendaNormalFlag
  );

  const VideoMinutesMeetingNormalFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoMinutesMeetingNormalFlag
  );

  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const normalParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.normalParticipantVideoFlag
  );

  const maxParticipantVideoDeniedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoDeniedFlag
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );
  const participantRemovedFromVideobyHost = useSelector(
    (state) => state.videoFeatureReducer.participantRemovedFromVideobyHost
  );
  const participantLeaveCallForJoinNonMeetingCall = useSelector(
    (state) =>
      state.videoFeatureReducer.participantLeaveCallForJoinNonMeetingCall
  );

  // For acccept Join name participantList
  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  console.log("setHandRaiseCounter", getAllParticipantMain);

  const audioControl = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  const videoControl = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  const participantsVisible = useSelector(
    (state) => state.videoFeatureReducer.participantsVisible
  );

  const makeParticipantAsHost = useSelector(
    (state) => state.videoFeatureReducer.makeParticipantAsHost
  );

  const makeParticipantAsHostData = useSelector(
    (state) => state.videoFeatureReducer.makeParticipantAsHostData
  );

  const disableBeforeJoinZoom = useSelector(
    (state) => state.videoFeatureReducer.disableBeforeJoinZoom
  );

  const hostTransferFlag = useSelector(
    (state) => state.GuestVideoReducer.hostTransferFlag
  );

  const accpetAccessOfHostTransfer = useSelector(
    (state) => state.videoFeatureReducer.accpetAccessOfHostTransfer
  );

  const InitiateVideoCallData = useSelector(
    (state) => state.VideoMainReducer.InitiateVideoCallData
  );
  const VideoCallResponseData = useSelector(
    (state) => state.VideoMainReducer.VideoCallResponseData
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );
  console.log(disableBeforeJoinZoom, "disableBeforeJoinZoom");
  console.log(iframeRef, "iframeRef");

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const presenterMeetingId = useSelector(
    (state) => state.videoFeatureReducer.presenterMeetingId
  );

  const presenterParticipantAlreadyInMeetingVideo = useSelector(
    (state) =>
      state.videoFeatureReducer.presenterParticipantAlreadyInMeetingVideo
  );

  const leavePresenterOrJoinOtherCalls = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterOrJoinOtherCalls
  );

  const stopScreenShareOnPresenter = useSelector(
    (state) => state.videoFeatureReducer.stopScreenShareOnPresenter
  );

  const globallyScreenShare = useSelector(
    (state) => state.videoFeatureReducer.globallyScreenShare
  );

  const leavePresenterParticipant = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterParticipant
  );

  const startPresenterTriggered = useSelector(
    (state) => state.videoFeatureReducer.startPresenterTriggered
  );
  console.log(startPresenterTriggered, "startPresenterTriggered");

  console.log(leavePresenterOrJoinOtherCalls, "leavePresenterOrJoinOtherCalls");

  const [allParticipant, setAllParticipant] = useState([]);
  console.log(allParticipant, "allParticipant123");

  const [participantsList, setParticipantsList] = useState([]);

  const [callerURL, setCallerURL] = useState("");

  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  let meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
  // for make host
  const [isMeetingHost, setIsMeetingHost] = useState(
    meetingHost?.isHost ? true : false
  );
  let iframe = iframeRef.current;
  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  let refinedParticipantVideoUrl = localStorage.getItem("refinedVideoUrl");
  let refinedURLCheck = JSON.parse(localStorage.getItem("refinedVideoGiven"));

  let urlFormeetingapi = localStorage.getItem("hostUrl");

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);
  const [isMeetinVideoCeckForParticipant, setIsMeetinVideoCeckForParticipant] =
    useState(false);

  console.log(
    {
      startRecordingState,
      pauseRecordingState,
      stopRecordingState,
      resumeRecordingState,
    },
    "checkstartRecordingState"
  );

  function validateRoomID(input) {
    try {
      // Convert input to string if not already a string
      const urlString = String(input);

      // Parse the URL
      const url = new URL(urlString);

      // Extract query parameters
      const params = new URLSearchParams(url.search);
      console.log("iframeiframe", params);
      const sessionKey = params.get("sessionKey");
      console.log("iframeiframe", params);
      if (sessionKey) {
        return true;
      }
      // Look for 'RoomID' or 'roomid' (case-insensitive)
      console.log("iframeiframe", input);
      let roomID = params.get("RoomID") || params.get("roomid");

      // Ensure RoomID is treated as a string
      roomID = String(roomID).trim();
      console.log("iframeiframe", roomID);

      console.log(
        "iframeiframe",
        /^\d+$/.test(roomID) && parseInt(roomID, 10) > 0
      );
      // Validate RoomID - must be a number greater than 0
      return /^\d+$/.test(roomID) && parseInt(roomID, 10) > 0; // Only numbers > 0
    } catch (error) {
      // Return false for any parsing or validation error
      return false;
    }
  }

  useEffect(() => {
    if (stopScreenShareOnPresenter) {
      console.log("mqtt mqmqmqmqmqmq");
      if (isScreenActive) {
        console.log("mqtt mqmqmqmqmqmq");

        try {
          console.log("mqtt mqmqmqmqmqmq");

          if (iframe && iframe.contentWindow) {
            console.log("mqtt mqmqmqmqmqmq");
            setIsScreenActive(false);
            sessionStorage.setItem("nonPresenter", true);
            // Post message to iframe
            console.log("mqtt mqmqmqmqmqmq");
            iframe.contentWindow.postMessage("ScreenShare", "*"); // Replace with actual origin
          } else {
            console.log("mqtt mqmqmqmqmqmq");
            console.log("share screen Iframe contentWindow is not available.");
          }
        } catch (error) {}
      }
      let newRoomID = localStorage.getItem("newRoomId");
      let activeRoomID = localStorage.getItem("activeRoomID");
      if (newRoomID) {
        console.log("mqtt mqmqmqmqmqmq");
        localStorage.setItem("acceptedRoomID", newRoomID);
      } else {
        console.log("mqtt mqmqmqmqmqmq");
        localStorage.setItem("acceptedRoomID", activeRoomID);
      }
      console.log("mqtt mqmqmqmqmqmq");
      sessionStorage.setItem("alreadyInMeetingVideo", true);
      dispatch(participantWaitingListBox(false));
      dispatch(toggleParticipantsVisibility(false));
      dispatch(presenterViewGlobalState(currentMeetingID, true, false, true));
      dispatch(setAudioControlHost(true));
      console.log("videoHideUnHideForHost");
      dispatch(setVideoControlHost(true));
      dispatch(maximizeVideoPanelFlag(true));
      dispatch(normalizeVideoPanelFlag(false));
      dispatch(minimizeVideoPanelFlag(false));
      dispatch(stopScreenShareOnPresenterStarting(false));
    }
  }, [stopScreenShareOnPresenter]);

  useEffect(() => {
    if (
      (isMeeting &&
        isMeetingHost === false &&
        meetingHost?.isDashboardVideo === true) ||
      (presenterViewFlag && presenterViewHostFlag)
    ) {
      console.log("Check new");
      if (!leavePresenterOrJoinOtherCalls) {
        let Data = {
          RoomID: String(
            presenterViewFlag ? callAcceptedRoomID : participantRoomIds
          ),
        };
        dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
      }
      setIsMeetinVideoCeckForParticipant(true);
      if (validateRoomID(refinedParticipantVideoUrl)) {
        console.log("iframeiframe", refinedParticipantVideoUrl !== callerURL);
        if (refinedParticipantVideoUrl !== callerURL) {
          console.log("iframeiframe", refinedParticipantVideoUrl);
          setCallerURL(refinedParticipantVideoUrl);
        }
      }
    }
    return () => {
      console.log("iframeiframe");
      if (callerURL !== "") {
        console.log("iframeiframe");
        setCallerURL("");
      }
      localStorage.removeItem("refinedVideoUrl");
      localStorage.removeItem("initiateCallRoomID");
      localStorage.removeItem("acceptedRoomID");
    };
  }, []);

  useEffect(() => {
    if (participantRemovedFromVideobyHost) {
      const handleLeaveSession = async () => {
        const iframe = iframeRef.current;
        if (participantRemovedFromVideobyHost && iframe?.contentWindow) {
          console.log("busyCall");

          iframe.contentWindow.postMessage("leaveSession", "*");
          await new Promise((resolve) => setTimeout(resolve, 100));
          const meetingHost = {
            isHost: false,
            isHostId: 0,
            isDashboardVideo: true,
          };
          dispatch(makeHostNow(meetingHost));
          localStorage.setItem("isMeeting", true);
          localStorage.setItem("isMeetingVideo", false);
          localStorage.removeItem("refinedVideoUrl");
          localStorage.setItem("refinedVideoGiven", false);
          localStorage.setItem("isWebCamEnabled", false);
          localStorage.setItem("isMicEnabled", false);
          dispatch(setAudioControlHost(false));
          console.log("videoHideUnHideForHost");
          dispatch(setVideoControlHost(false));

          localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));

          dispatch(maximizeVideoPanelFlag(false));
          dispatch(maxParticipantVideoRemoved(true));
          // Participant room Id and usrrGuid
          let participantRoomIds = localStorage.getItem("participantRoomId");
          let participantUID = localStorage.getItem("participantUID");
          let currentMeetingID = localStorage.getItem("currentMeetingID");
          let newName = localStorage.getItem("name");
          let Data = {
            RoomID: String(participantRoomIds),
            UserGUID: String(participantUID),
            Name: String(newName),
            IsHost: false,
            MeetingID: Number(currentMeetingID),
          };
          dispatch(setRaisedUnRaisedParticiant(false));
          dispatch(LeaveMeetingVideo(Data, navigate, t));
          dispatch(setParticipantRemovedFromVideobyHost(false));
        }
      };

      handleLeaveSession();
    }
  }, [participantRemovedFromVideobyHost, iframe]);

  useEffect(() => {
    if (getAllParticipantMain?.length) {
      setAllParticipant(getAllParticipantMain);
    }
  }, [getAllParticipantMain]);

  useEffect(() => {
    const leftUID = leavePresenterParticipant?.uid;

    // Only proceed if all flags are valid and leftUID is defined
    if (leftUID && presenterViewFlag) {
      const updatedList = getAllParticipantMain.filter(
        (participant) => participant.guid !== leftUID
      );
      const updatedRaisedHands = updatedList.filter(
        (participant) => participant.raiseHand === true
      );
      setAllParticipant(updatedRaisedHands.length);

      console.log(updatedList, "setHandRaiseCounter");

      // if (!isMeetingVideo) {
      dispatch(updatedParticipantListForPresenter(updatedList));
      // }
    }
  }, [leavePresenterParticipant]);

  // 3️⃣ Cleanup presentation-only participants after presentation ends
  useEffect(() => {
    if (!presenterViewFlag || !presenterViewHostFlag) {
      const filteredParticipants = getAllParticipantMain.filter(
        (participant) => !participant.joinedForPresentation
      );

      console.log(filteredParticipants, "setHandRaiseCounter");

      dispatch(updatedParticipantListForPresenter(filteredParticipants));
    }
  }, [presenterViewFlag, presenterViewHostFlag]);

  useEffect(() => {
    if (participantLeaveCallForJoinNonMeetingCall) {
      const handleLeaveSession = async () => {
        const iframe = iframeRef.current;
        if (
          participantLeaveCallForJoinNonMeetingCall &&
          iframe?.contentWindow
        ) {
          console.log("busyCall");
          let meetinHostInfo = JSON.parse(
            localStorage.getItem("meetinHostInfo")
          );
          iframe.contentWindow.postMessage("leaveSession", "*");
          await new Promise((resolve) => setTimeout(resolve, 100));
          let currentMeetingID = JSON.parse(
            localStorage.getItem("currentMeetingID")
          );
          let newRoomID = meetinHostInfo?.isHost
            ? localStorage.getItem("newRoomId")
            : localStorage.getItem("activeRoomID");
          let newUserGUID = meetinHostInfo?.isHost
            ? localStorage.getItem("isGuid")
            : localStorage.getItem("participantUID");
          let newName = localStorage.getItem("name");
          let Data = {
            RoomID: String(newRoomID),
            UserGUID: String(newUserGUID),
            Name: String(newName),
            IsHost: meetinHostInfo?.isHost ? true : false,
            MeetingID: Number(currentMeetingID),
          };
          await dispatch(LeaveMeetingVideo(Data, navigate, t));
          await dispatch(setAudioControlHost(false));
          console.log("videoHideUnHideForHost");
          await dispatch(setVideoControlHost(false));
          localStorage.setItem("isMicEnabled", false);
          localStorage.setItem("isWebCamEnabled", false);
          localStorage.setItem("activeOtoChatID", 0);
          localStorage.setItem("initiateVideoCall", false);
          localStorage.setItem("activeRoomID", 0);
          localStorage.setItem("meetingVideoID", 0);
          localStorage.setItem("newCallerID", 0);
          localStorage.setItem("callerStatusObject", JSON.stringify([]));
          localStorage.removeItem("newRoomId");
          localStorage.removeItem("isHost");
          localStorage.removeItem("isGuid");
          localStorage.removeItem("hostUrl");
          localStorage.removeItem("VideoView");
          localStorage.removeItem("videoIframe");
          localStorage.removeItem("CallType");
          localStorage.removeItem("NewRoomID");
          let currentUserId = Number(localStorage.getItem("userID"));
          let callTypeID = Number(localStorage.getItem("callTypeID"));
          let Data2 = {
            ReciepentID: currentUserId,
            RoomID: activeRoomID,
            CallStatusID: 1,
            CallTypeID: callTypeID,
          };
          dispatch(VideoCallResponse(Data2, navigate, t));
          console.log("busyCall");
          dispatch(incomingVideoCallFlag(false));
          dispatch(setParticipantLeaveCallForJoinNonMeetingCall(false));
        }
      };

      handleLeaveSession();
    }
  }, [participantLeaveCallForJoinNonMeetingCall, iframe]);

  useEffect(() => {
    // Define the leave function to clean up the session
    const handleBeforeUnload = async (event) => {
      try {
        dispatch(updatedParticipantListForPresenter([]));
        console.log("busyCall");

        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow !== null) {
          console.log("busyCall");

          iframe.contentWindow.postMessage("leaveSession", "*");
          await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
        }
      } catch (error) {}
    };

    // Attach the event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      dispatch(updatedParticipantListForPresenter([]));
      console.log("busyCall");
    };
  }, []);

  //Hand Raise Counter To show on Participant Counter in presenter View
  useEffect(() => {
    let dublicateData = [...getAllParticipantMain];
    const raisedHandCounter = dublicateData.filter(
      (participant) => participant.raiseHand === true
    );
    setHandRaiseCounter(raisedHandCounter.length);
  }, [getAllParticipantMain]);

  useEffect(() => {
    try {
      if (Object.keys(InitiateVideoCallData).length > 0) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        let endIndexBaseURLCaller = "";
        let extractedBaseURLCaller = "";
        if (dynamicBaseURLCaller) {
          endIndexBaseURLCaller = dynamicBaseURLCaller
            ? endIndexUrl(dynamicBaseURLCaller)
            : "";
          extractedBaseURLCaller = endIndexBaseURLCaller
            ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
            : "";
        }
        if (isMeeting) {
          console.log("iframeiframe");
          if (!isMeetingVideo) {
            console.log("iframeiframe", InitiateVideoCallData);
            console.log("iframeiframe", extractedBaseURLCaller);
            console.log("iframeiframe", initiateCallRoomID);
            if (initiateCallRoomID) {
              let newurl = generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                initiateCallRoomID,
                InitiateVideoCallData?.guid
              );
              console.log("iframeiframe", newurl);
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", newurl);
                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl);
                  setCallerURL(newurl);
                  dispatch(initiateVideoCallFail(""));
                }
              }
            }
          } else if (isMeetingHost) {
            console.log("iframeiframe");
            console.log("iframeiframe", urlFormeetingapi);
            console.log("iframeiframe", validateRoomID(urlFormeetingapi));
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", urlFormeetingapi);
              if (urlFormeetingapi !== callerURL) {
                console.log("iframeiframe", urlFormeetingapi);
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            console.log("iframeiframe");

            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              let newurl = generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                initiateCallRoomID
              );
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", newurl);
                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl);
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          console.log("iframeiframe", InitiateVideoCallData);
          console.log("iframeiframe", extractedBaseURLCaller);
          console.log("iframeiframe", initiateCallRoomID);
          if (initiateCallRoomID) {
            let newurl = generateURLCaller(
              extractedBaseURLCaller,
              currentUserName,
              initiateCallRoomID,
              InitiateVideoCallData?.guid
            );
            console.log("iframeiframe", newurl);
            if (validateRoomID(newurl)) {
              console.log("iframeiframe", newurl);
              if (newurl !== callerURL) {
                console.log("iframeiframe", newurl);
                setCallerURL(newurl);
                dispatch(initiateVideoCallFail(""));
              }
            }
          }
        }
      }
    } catch {}
  }, [InitiateVideoCallData]);

  useEffect(() => {
    try {
      console.log("Check iframe Presenter");
      let dynamicBaseURLCaller = localStorage.getItem(
        "videoBaseURLParticipant"
      );
      let endIndexBaseURLCaller = "";
      let extractedBaseURLCaller = "";
      if (dynamicBaseURLCaller) {
        endIndexBaseURLCaller = dynamicBaseURLCaller
          ? endIndexUrl(dynamicBaseURLCaller)
          : "";
        extractedBaseURLCaller = endIndexBaseURLCaller
          ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
          : "";
      }

      if (isMeeting === false) {
        console.log("iframeiframe");
        if (callAcceptedRoomID && Number(callAcceptedRoomID) !== 0) {
          console.log("iframeiframe");
          let newurl = generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID,
            VideoCallResponseData?.guid
          );
          console.log("iframeiframe");
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", newurl !== callerURL);
            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl);
              setCallerURL(newurl);
            }
          }
        }
      } else if (isMeeting === true) {
        console.log("iframeiframe", isMeeting);
        // if (presenterViewFlag) {
        //   console.log("iframeiframe", isMeeting);
        //   let newurl = generateURLParticipant(
        //     extractedBaseURLCaller,
        //     currentUserName,
        //     callAcceptedRoomID
        //   );
        //   if (validateRoomID(newurl)) {
        //     console.log("iframeiframe", validateRoomID(newurl));

        //     if (newurl !== callerURL) {
        //       console.log("iframeiframe", newurl !== callerURL);
        //       console.log("iframeiframe", newurl);
        //       console.log("Check iframe Presenter", newurl);
        //       setCallerURL(newurl);
        //     }
        //   }
        // }
        if (presenterViewJoinFlag || presenterViewHostFlag) {
          console.log("iframeiframe", isMeeting);
          let newurl = generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID
          );
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", validateRoomID(newurl));

            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl !== callerURL);
              console.log("iframeiframe", newurl);
              console.log("Check iframe Presenter", newurl);
              setCallerURL(newurl);
            }
          }
        } else if (isMeetingVideo) {
          console.log("iframeiframe", isMeetingHost);
          if (isMeetingHost) {
            console.log("iframeiframe", urlFormeetingapi);
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", validateRoomID(urlFormeetingapi));
              if (urlFormeetingapi !== callerURL) {
                console.log("iframeiframe", urlFormeetingapi !== callerURL);
                console.log("iframeiframe", urlFormeetingapi);
                console.log("iframeiframe", callerURL);
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              let newurl = generateURLParticipant(
                extractedBaseURLCaller,
                currentUserName,
                callAcceptedRoomID
              );
              console.log("iframeiframe", newurl);
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", validateRoomID(newurl));

                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl !== callerURL);
                  console.log("iframeiframe", newurl);
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          let newurl = generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID,
            VideoCallResponseData?.guid
          );
          console.log("iframeiframe", newurl);
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", validateRoomID(newurl));
            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl);
              setCallerURL(newurl);
            }
          }
        }
      }
    } catch {}
  }, [VideoCallResponseData]);

  useEffect(() => {
    try {
      if (localStorage.getItem("newRoomId") !== null) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        const endIndexBaseURLCaller = dynamicBaseURLCaller
          ? endIndexUrl(dynamicBaseURLCaller)
          : "";
        let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
        const extractedBaseURLCaller = endIndexBaseURLCaller
          ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
          : "";
        if (isMeeting) {
          console.log("iframeiframe");
          if (isMeetingHost) {
            console.log("iframeiframe");
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", urlFormeetingapi !== callerURL);
              if (urlFormeetingapi !== callerURL) {
                console.log("iframeiframe", urlFormeetingapi);
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              console.log("iframeiframe");
              let newurl = generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                newRoomID
              );
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", newurl !== callerURL);
                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl);
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          let newurl = generateURLCaller(
            extractedBaseURLCaller,
            currentUserName,
            newRoomID === 0 ? activeRoomID : newRoomID
          );
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", newurl !== callerURL);
            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl);
              setCallerURL(newurl);
            }
          }
        }
      }
    } catch {}
  }, [newRoomID]);

  useEffect(() => {
    try {
      if (presenterParticipantAlreadyInMeetingVideo) {
        const iframe = iframeRef.current;
        console.log("maximizeParticipantVideoFlag");
        if (iframe && iframe.contentWindow) {
          console.log("maximizeParticipantVideoFlag");
          // Post message to iframe
          iframe.contentWindow.postMessage("ScreenShare", "*"); // Replace with actual origin
          dispatch(presenterFlagForAlreadyInParticipantMeetingVideo(false));
        } else {
          console.log("maximizeParticipantVideoFlag");
          console.log("share screen Iframe contentWindow is not available.");
        }
      }
    } catch {}
  }, [presenterParticipantAlreadyInMeetingVideo]);

  useEffect(() => {
    try {
      if (shareScreenTrue) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          // Post message to iframe
          sessionStorage.setItem("nonPresenter", true);
          iframe.contentWindow.postMessage("ScreenShare", "*"); // Replace with actual origin
        } else {
          console.log("share screen Iframe contentWindow is not available.");
        }
        setShareScreenTrue(false);
      }
    } catch {}
  }, [shareScreenTrue]);

  const handleScreenShareButton = async () => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      if (!LeaveCallModalFlag) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          sessionStorage.setItem("nonPresenter", true);
          // Post message to iframe
          console.log("handlePostMessage");
          iframe.contentWindow.postMessage("ScreenShare", "*"); // Replace with actual origin
        } else {
          console.log("share screen Iframe contentWindow is not available.");
        }
      }
    } else {
      console.log("Check");
    }
  };

  const handlePresenterView = async () => {
    const iframe = iframeRef.current;
    console.log("videoHideUnHideForHost");
    if (iframe && iframe.contentWindow) {
      // Post message to iframe
      sessionStorage.removeItem("nonPresenter");
      console.log("videoHideUnHideForHost");
      await dispatch(setVideoControlHost(true));
      dispatch(setAudioControlHost(false));
      console.log("videoHideUnHideForHost");
      setTimeout(() => {
        iframe?.contentWindow?.postMessage("ScreenShare", "*");
      }, 1000); // Replace with actual origin
    } else {
      console.log("share screen Iframe contentWindow is not available.");
    }
  };

  // For Recording Scenario In One To One
  const RecordingStartScenarioForOneToOne = () => {
    let initiateVideoCall = JSON.parse(
      localStorage.getItem("initiateVideoCall")
    );
    console.log("Does Check Recording Start", isZoomEnabled);
    if (isZoomEnabled) {
      console.log("Does Check Recording Start", initiateVideoCall);
      console.log("Does Check Recording Start", isMeetingVideo);
      if (!isMeetingVideo && initiateVideoCall) {
        console.log("Does Check Recording Start");
        const iframe = iframeRef.current;
        if (iframe && iframe?.contentWindow) {
          console.log("Does Check Recording Start");
          setTimeout(() => {
            console.log("Does Check Recording Start");
            iframe?.contentWindow?.postMessage(
              "RecordingStartMsgFromIframe",
              "*"
            );
          }, 1000);
        }
      }
      //  else {
      //   if (isMeeting && isMeetingVideo && isMeetingVideoHostChecker) {
      //     console.log("Does Check Recording Stop");
      //     const iframe = iframeRef.current;
      //     if (iframe && iframe?.contentWindow) {
      //       console.log("Does Check Recording Stop");
      //       setTimeout(() => {
      //         console.log("Does Check Recording Stop");
      //         iframe?.contentWindow?.postMessage(
      //           "RecordingStopMsgFromIframe",
      //           "*"
      //         );
      //       }, 1000);
      //     }
      //   }
      // }
    }
  };

  const handlePresenterViewForParticipent = async () => {
    sessionStorage.removeItem("nonPresenter");
    dispatch(setAudioControlHost(true));
    console.log("videoHideUnHideForHost");
    dispatch(setVideoControlHost(true));
  };

  let alreadyInMeetingVideo = JSON.parse(
    sessionStorage.getItem("alreadyInMeetingVideo")
  );

  const handlerForStaringPresenterView = async () => {
    console.log("maximizeParticipantVideoFlag");
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );
    let alreadyInMeetingVideo = JSON.parse(
      sessionStorage.getItem("alreadyInMeetingVideo")
    );
    let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
    let newRoomID = localStorage.getItem("newRoomId");
    let activeRoomID = localStorage.getItem("activeRoomID");
    let isGuid = localStorage.getItem("isGuid");
    let participantUID = localStorage.getItem("participantUID");
    // Post message to iframe
    let data = {
      MeetingID: currentMeetingID,
      RoomID: String(
        alreadyInMeetingVideo
          ? newRoomID
            ? newRoomID
            : activeRoomID
          : callAcceptedRoomID
      ),
      Guid: isMeetingVideoHostCheck ? isGuid : participantUID,
    };
    sessionStorage.removeItem("nonPresenter");
    dispatch(participanMuteUnMuteMeeting(true, true, true, true, 1));
    dispatch(startPresenterViewMainApi(navigate, t, data, 1));
  };

  const stopScreenShareEventTRiger = () => {
    console.log("Check triggered or not");
    if (alreadyInMeetingVideo) {
      sessionStorage.removeItem("alreadyInMeetingVideo");
    } else if (presenterViewFlag && presenterViewHostFlag) {
      console.log("Check triggered or not");
      let currentName = localStorage.getItem("name");
      let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
      let isMeetingVideoHostCheck = JSON.parse(
        localStorage.getItem("isMeetingVideoHostCheck")
      );
      let participantUID = localStorage.getItem("participantUID");
      let isGuid = localStorage.getItem("isGuid");
      localStorage.setItem("VidOff", false);
      let data = {
        RoomID: String(callAcceptedRoomID),
        UserGUID: String(isMeetingVideoHostCheck ? isGuid : participantUID),
        Name: String(currentName),
      };
      dispatch(leavePresenterViewMainApi(navigate, t, data, 4));
    }
  };

  // Add event listener for messages
  useEffect(() => {
    sessionStorage.removeItem("isWaiting");
    const messageHandler = (event) => {
      // Check the origin for security
      console.log("handlePostMessage", event.data);
      console.log("handlePostMessage", process.env.REACT_APP_VIDEO_EVENTS);
      console.log("handlePostMessage", event.origin);
      if (event.origin === process.env.REACT_APP_VIDEO_EVENTS) {
        // Example actions based on the message received

        console.log("handlePostMessage", presenterViewHostFlag);
        console.log("handlePostMessage", presenterViewHostFlag);
        console.log("handlePostMessage", event.data);
        console.log("handlePostMessagesss", event.data);
        console.log("maximizeParticipantVideoFlag");
        switch (event.data) {
          case "ScreenSharedMsgFromIframe":
            console.log("handlePostMessage", event.data);
            let alreadyInMeetingVideo = JSON.parse(
              sessionStorage.getItem("alreadyInMeetingVideo")
            );
            let alreadyInMeetingVideoStartPresenterCheck = JSON.parse(
              sessionStorage.getItem("alreadyInMeetingVideoStartPresenterCheck")
            );
            let nonPresenter = JSON.parse(
              sessionStorage.getItem("nonPresenter")
            );
            console.log("handlePostMessage", alreadyInMeetingVideo);
            console.log(
              "handlePostMessage",
              alreadyInMeetingVideoStartPresenterCheck
            );
            console.log("handlePostMessage", nonPresenter);

            setIsScreenActive(true); // Show a modal or perform an action
            if (nonPresenter) {
              console.log("handlePostMessage", nonPresenter);
              console.log("busyCall");

              sessionStorage.removeItem("nonPresenter");
              if (isZoomEnabled) {
                console.log("busyCall");

                let participantRoomId = String(
                  localStorage.getItem("participantRoomId")
                );
                let roomID = String(localStorage.getItem("acceptedRoomID"));
                let newRoomID = String(localStorage.getItem("newRoomId"));

                let isMeetingVideoHostCheck = JSON.parse(
                  localStorage.getItem("isMeetingVideoHostCheck")
                );
                let isMeetingVideo = JSON.parse(
                  localStorage.getItem("isMeetingVideo")
                );
                let userID = localStorage.getItem("userID");
                let isGuid = localStorage.getItem("isGuid");

                let participantUID = localStorage.getItem("participantUID");
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
                  ShareScreen: true,
                  UID: UID,
                };
                dispatch(isSharedScreenTriggeredApi(navigate, t, data));
              }
            } else if (alreadyInMeetingVideo) {
              console.log("handlePostMessage", alreadyInMeetingVideo);
              if (alreadyInMeetingVideoStartPresenterCheck) {
                console.log(
                  "handlePostMessage",
                  alreadyInMeetingVideoStartPresenterCheck
                );
                dispatch(setAudioControlHost(false));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(true));
              } else {
                console.log(
                  "handlePostMessage",
                  alreadyInMeetingVideoStartPresenterCheck
                );

                dispatch(setAudioControlHost(true));
                console.log("videoHideUnHideForHost");
                dispatch(setVideoControlHost(true));
              }
              handlerForStaringPresenterView();
            } else if (presenterViewFlag && presenterViewHostFlag) {
              console.log("handlePostMessage", presenterViewHostFlag);
              handlerForStaringPresenterView();
            }

            break;
          case "ScreenSharedStopMsgFromIframe":
            setIsScreenActive(false);
            console.log("ScreenSharedStopMsgFromIframe");

            console.log("busyCall");
            if (isZoomEnabled) {
              console.log("busyCall");
              let isSharedSceenEnable = JSON.parse(
                localStorage.getItem("isSharedSceenEnable")
              );
              if (isSharedSceenEnable && !globallyScreenShare) {
                console.log("busyCall");
                let participantRoomId = String(
                  localStorage.getItem("participantRoomId")
                );
                let newRoomID = String(localStorage.getItem("newRoomId"));
                let roomID = String(localStorage.getItem("acceptedRoomID"));
                let isMeetingVideoHostCheck = JSON.parse(
                  localStorage.getItem("isMeetingVideoHostCheck")
                );
                let isMeetingVideo = JSON.parse(
                  localStorage.getItem("isMeetingVideo")
                );
                let userID = localStorage.getItem("userID");
                let isGuid = localStorage.getItem("isGuid");
                let participantUID = localStorage.getItem("participantUID");
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
                console.log("busyCall");
                dispatch(isSharedScreenTriggeredApi(navigate, t, data));
              }
            }

            break;

          case "StreamConnected":
            console.log("disableZoomBeforeJoinSession", event.data);
            RecordingStartScenarioForOneToOne();

            if (isZoomEnabled) {
              console.log("is Zoom Connected");
              setTimeout(() => {
                dispatch(disableZoomBeforeJoinSession(false));
              }, 2000);
            }

            if (presenterViewFlag && presenterViewHostFlag) {
              if (isZoomEnabled) {
                setTimeout(() => {
                  console.log("stream");
                  handlePresenterView();
                }, 2000);
              } else {
                handlePresenterView();
              }
            } else if (presenterViewFlag && presenterViewJoinFlag) {
              handlePresenterViewForParticipent();
            }
            break;

          case "ScreenSharedCancelMsg":
            stopScreenShareEventTRiger();
            break;

          case "RecordingStartMsgFromIframe":
            console.log("recording Start");
            break;

          case "RecordingStopMsgFromIframe":
            console.log("recording Stop");
            break;

          case "RecordingPauseMsgFromIframe":
            console.log("recording Pause");
            break;

          case "RecordingResumeMsgFromIframe":
            console.log("recording Resume");
            break;

          default:
            console.log(
              "handlePostMessage share screen Unknown message received:",
              event.data
            );
        }
      } else {
      }
    };

    // Attach the event listener
    window.addEventListener("message", messageHandler);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  const layoutCurrentChange = () => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      let videoView = localStorage.getItem("VideoView");
      if (LeaveCallModalFlag === false) {
        const iframe = iframeRef.current;
        if (iframe && videoView === "Sidebar") {
          iframe.contentWindow.postMessage("TileView", "*");
          localStorage.setItem("VideoView", "TileView");
          setShowTile(true);
        } else if (iframe && videoView === "TileView") {
          iframe.contentWindow.postMessage("SidebarView", "*");
          localStorage.setItem("VideoView", "Sidebar");
          setShowTile(false);
        }
      }
    } else {
      console.log("Check");
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (audioControl === true) {
        console.log("audioControl Check");
        iframe.contentWindow.postMessage("MicOn", "*");
      } else {
        console.log("audioControl Check");
        iframe.contentWindow.postMessage("MicOff", "*");
      }
    }
  }, [audioControl]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      console.log("VidOn 123", videoControl);
      if (videoControl === true) {
        console.log("VidOn 123");
        iframe.contentWindow.postMessage("VidOn", "*");
      } else {
        console.log("VidOn 123");
        iframe.contentWindow.postMessage("VidOff", "*");
      }
    }
  }, [videoControl]);

  useEffect(() => {
    if (toggleMicMinimizeNonMeeting) {
      try {
        console.log("VidOn", toggleMicMinimizeNonMeeting);
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          if (isMicActive) {
            console.log("VidOn");
            iframe.contentWindow.postMessage("MicOff", "*");
          } else {
            console.log("VidOn");
            iframe.contentWindow.postMessage("MicOn", "*");
          }
          console.log("VidOn");
          setIsMicActive(!isMicActive);
          localStorage.setItem("MicOff", !isMicActive);
          setToggleMicMinimizeNonMeeting(false);
        }
      } catch (error) {
        console.log("disableMicFunction", error);
      }
    }
  }, [toggleMicMinimizeNonMeeting]);

  useEffect(() => {
    if (toggleVideoMinimizeNonMeeting) {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          console.log("videoHideUnHideForHost");
          if (isVideoActive) {
            console.log("VidOn");
            iframe.contentWindow.postMessage("VidOff", "*");
          } else {
            console.log("VidOn");
            iframe.contentWindow.postMessage("VidOn", "*");
          }
          setIsVideoActive(!isVideoActive);
          localStorage.setItem("VidOff", !isVideoActive);
          setToggleVideoMinimizeNonMeeting(false);
        }
      } catch {}
    }
  }, [toggleVideoMinimizeNonMeeting]);

  const disableMicFunction = () => {
    console.log("disableMicFunction");
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        console.log("disableMicFunction");
        let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
        if (isZoomEnabled) {
          if (isMicActive) {
            console.log("VidOn");
            setIsMicActive(false);
            localStorage.setItem("MicOff", false);
            iframe.contentWindow.postMessage("MicOn", "*");
          } else {
            console.log("VidOn");
            setIsMicActive(true);
            localStorage.setItem("MicOff", true);
            iframe.contentWindow.postMessage("MicOff", "*");
          }
        } else {
          if (isMicActive) {
            console.log("VidOn");
            iframe.contentWindow.postMessage("MicOff", "*");
          } else {
            console.log("VidOn");
            iframe.contentWindow.postMessage("MicOn", "*");
          }
          setIsMicActive(!isMicActive);
          localStorage.setItem("MicOff", !isMicActive);
        }
      }
    } catch (error) {
      console.log("disableMicFunction", error);
    }
  };

  const disableVideoFunction = () => {
    try {
      const iframe = iframeRef.current;
      console.log("videoHideUnHideForHost");
      if (iframe && iframe.contentWindow) {
        console.log("videoHideUnHideForHost");
        let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
        if (isZoomEnabled) {
          if (isVideoActive) {
            console.log("VidOn");
            setIsVideoActive(false);
            localStorage.setItem("VidOff", false);
            console.log("busyCall");
            iframe.contentWindow.postMessage("VidOn", "*");
          } else {
            console.log("VidOn");
            setIsVideoActive(true);
            localStorage.setItem("VidOff", true);
            iframe.contentWindow.postMessage("VidOff", "*");
          }
        } else {
          if (isVideoActive) {
            iframe.contentWindow.postMessage("VidOff", "*");
          } else {
            console.log("busyCall");
            iframe.contentWindow.postMessage("VidOn", "*");
          }
          setIsVideoActive(!isVideoActive);
          localStorage.setItem("VidOff", !isVideoActive);
        }
      }
    } catch {}
  };

  const closeParticipantsList = () => {
    dispatch(toggleParticipantsVisibility(false));
  };

  useEffect(() => {
    try {
      if (makeParticipantAsHost) {
        hostTrasfer(makeParticipantAsHostData);
        dispatch(makeParticipantHost([], false));
      }
    } catch {}
  }, [makeParticipantAsHost]);

  async function hostTrasfer(mqttData) {
    try {
      if (localStorage.getItem("participantUID") === mqttData.newHost.guid) {
        await dispatch(toggleParticipantsVisibility(false));
        await dispatch(participantWaitingListBox(false));
        const meetingHost = {
          isHost: true,
          isHostId: Number(localStorage.getItem("userID")),
          isDashboardVideo: true,
        };
        let participantRoomId = localStorage.getItem("participantRoomId");
        let participantUID = localStorage.getItem("participantUID");
        let refinedVideoUrl = localStorage.getItem("refinedVideoUrl");

        await setIsMeetingHost(true);
        let Data = { RoomID: participantRoomId };
        await dispatch(participantListWaitingListMainApi(Data, navigate, t));
        refinedURLCheck = false;

        await localStorage.setItem("hostUrl", refinedVideoUrl);
        await localStorage.setItem("newRoomId", participantRoomId);
        await localStorage.setItem(
          "meetinHostInfo",
          JSON.stringify(meetingHost)
        );
        await localStorage.setItem("isGuid", participantUID);
        await localStorage.setItem("isMeetingVideoHostCheck", true);
        await localStorage.setItem("isHost", true);
        await localStorage.removeItem("participantRoomId");
        await localStorage.removeItem("refinedVideoUrl");
        await localStorage.removeItem("participantUID");
        if (validateRoomID(refinedVideoUrl)) {
          console.log("iframeiframe", refinedVideoUrl);
          if (refinedVideoUrl !== callerURL) {
            console.log("iframeiframe", refinedVideoUrl !== callerURL);
            console.log("iframeiframe", refinedVideoUrl);
            setCallerURL(refinedVideoUrl);
          }
        }
        // localStorage.removeItem("participantUID");
        // localStorage.removeItem("participantRoomId");
      } else {
      }
    } catch {}
  }
  useEffect(() => {
    try {
      console.log("videoHideUnHideForHost", meetingHost);
      if (hostTransferFlag) {
        console.log("videoHideUnHideForHost", hostTransferFlag);
        setIsMeetingHost(false);
        dispatch(transferMeetingHostSuccess(false));
      }
    } catch {}
  }, [hostTransferFlag]);

  useEffect(() => {
    try {
      console.log("videoHideUnHideForHost", meetingHost);
      if (accpetAccessOfHostTransfer) {
        console.log("videoHideUnHideForHost", hostTransferFlag);
        setIsMeetingHost(true);
        dispatch(acceptHostTransferAccessGlobalFunc(false));
        dispatch(toggleParticipantsVisibility(false));
      }
    } catch {}
  }, [accpetAccessOfHostTransfer]);

  useEffect(() => {
    try {
      console.log("videoHideUnHideForHost", meetingHost);
      meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
      // for make host
      setIsMeetingHost(meetingHost?.isHost ? true : false);
    } catch {}
  }, [participantWaitinglistBox]);

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
        isMeetingVideoHostChecker &&
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
        isMeetingVideoHostChecker &&
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
        isMeetingVideoHostChecker &&
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

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      console.log("RecordingStopMsgFromIframe");

      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      if (isZoomEnabled) {
        const iframe = iframeRef.current;

        const sendMessage = () => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
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
          isMeetingVideoHostChecker &&
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

  return (
    <>
      {MaximizeHostVideoFlag ? (
        <MaxHostVideoCallComponent />
      ) : NormalHostVideoFlag ? (
        <NormalHostVideoCallComponent />
      ) : maximizeParticipantVideoFlag ? (
        <ParticipantVideoCallComponent />
      ) : normalParticipantVideoFlag ? (
        <NormalParticipantVideoComponent />
      ) : maxParticipantVideoDeniedFlag ? (
        <MaxParticipantVideoDeniedComponent />
      ) : maxParticipantVideoRemovedFlag ? (
        <MaxParticipantVideoRemovedComponent />
      ) : (
        <Row>
          <Col sm={12} md={12} lg={12}>
            <div
              className={
                NormalizeVideoFlag === true &&
                MinimizeVideoFlag === false &&
                MaximizeVideoFlag === false &&
                VideoChatPanel === true
                  ? "videoCallScreen"
                  : NormalizeVideoFlag === true &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === false &&
                    VideoChatPanel === false
                  ? "videoCallScreen more-zindex"
                  : NormalizeVideoFlag === false &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === true &&
                    VideoChatPanel === true
                  ? "max-video-panel"
                  : NormalizeVideoFlag === false &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === true &&
                    VideoChatPanel === false &&
                    presenterViewFlag &&
                    (presenterViewHostFlag || presenterViewJoinFlag)
                  ? "Presenter-Max-VideoPanel"
                  : "max-video-panel more-zindex"
              }
            >
              {FullLoader === true ? (
                <>
                  <LoaderPanelVideoScreen
                  // message={t(
                  //   "Securing-your-connection-You'll-be-able-to-join-in-a-moment"
                  // )}
                  />
                </>
              ) : (
                <>
                  <VideoCallNormalHeader
                    screenShareButton={handleScreenShareButton}
                    layoutCurrentChange={layoutCurrentChange}
                    isScreenActive={isScreenActive}
                    disableMic={disableMicFunction}
                    disableVideo={disableVideoFunction}
                    isVideoActive={isVideoActive}
                    isMicActive={isMicActive}
                    setIsMicActive={setIsMicActive}
                    showTile={showTile}
                    onStartRecording={onHandleClickForStartRecording}
                    onPauseRecording={onHandleClickForPauseRecording}
                    onStopRecording={onHandleClickForStopRecording}
                    onResumeRecording={onHandleClickForResumeRecording}
                    iframeCurrent={iframe}
                  />
                  {VideoOutgoingCallFlag && <VideoOutgoing />}
                  <Row>
                    <>
                      <Col
                        lg={
                          (isMeetingHost &&
                            meetingHost.isDashboardVideo &&
                            participantWaitinglistBox) ||
                          (presenterViewHostFlag &&
                            presenterViewFlag &&
                            participantWaitinglistBox)
                            ? 9
                            : 12
                        }
                        md={
                          (isMeetingHost &&
                            meetingHost.isDashboardVideo &&
                            participantWaitinglistBox) ||
                          (presenterViewHostFlag &&
                            presenterViewFlag &&
                            participantWaitinglistBox)
                            ? 9
                            : 12
                        }
                        sm={
                          (isMeetingHost &&
                            meetingHost.isDashboardVideo &&
                            participantWaitinglistBox) ||
                          (presenterViewHostFlag &&
                            presenterViewFlag &&
                            participantWaitinglistBox)
                            ? 9
                            : 12
                        }
                      >
                        <div
                          className={
                            presenterViewFlag &&
                            (presenterViewHostFlag || presenterViewJoinFlag)
                              ? "normal-Presenter-avatar-large"
                              : NormalizeVideoFlag === true &&
                                MinimizeVideoFlag === false &&
                                MaximizeVideoFlag === false
                              ? "normal-avatar"
                              : NormalizeVideoFlag === false &&
                                MinimizeVideoFlag === false &&
                                MaximizeVideoFlag === true
                              ? "normal-avatar-large"
                              : ""
                          }
                        >
                          {console.log("iframeiframe", isMeetingHost)}
                          {console.log("iframeiframe", callerURL)}
                          <>
                            {callerURL !== "" && (
                              <iframe
                                src={callerURL}
                                ref={iframeRef}
                                title="Live Video"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="camera;microphone;display-capture"
                              />
                            )}
                          </>
                        </div>
                      </Col>

                      {(isMeetingHost || presenterViewHostFlag) &&
                      meetingHost.isDashboardVideo &&
                      participantWaitinglistBox ? (
                        <>
                          {participantWaitinglistBox ? (
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className={`${
                                participantWaitinglistBox
                                  ? "ParticipantsWaiting_In"
                                  : "ParticipantsWaiting_Out"
                              } ps-0`}
                            >
                              {/* <VideoCallParticipants /> */}

                              {/* this is new Host Panel */}
                              {(isMeetingHost || presenterViewHostFlag) &&
                                participantWaitinglistBox && (
                                  <VideoNewParticipantList />
                                )}
                            </Col>
                          ) : null}
                        </>
                      ) : isMeeting && isMeetingVideo && !isMeetingHost ? (
                        <>
                          {participantsVisible && (
                            <div className="Participants-Lists">
                              <>
                                <Row>
                                  <Col lg={10} md={10} sm={10}>
                                    <p className="Participant-name-title">
                                      {t("Participants")}
                                    </p>
                                  </Col>
                                  <Col lg={2} md={2} sm={2}>
                                    <img
                                      draggable={false}
                                      src={BlackCrossIcon}
                                      alt=""
                                      className={"cursor-pointer"}
                                      width="8px"
                                      height="8px"
                                      onClick={closeParticipantsList}
                                    />
                                  </Col>
                                </Row>
                                {allParticipant.length > 0 &&
                                  allParticipant.map((participant, index) => {
                                    console.log(participant, "checkcheck");
                                    return (
                                      <>
                                        <Row
                                          key={participant.guid}
                                          className="mb-1"
                                        >
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-flex justify-content-start"
                                          >
                                            <p className="participantModal_name">
                                              {participant.name}
                                            </p>{" "}
                                          </Col>
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-flex justify-content-end gap-2"
                                          >
                                            <img
                                              src={VideoOff}
                                              width="20px"
                                              height="20px"
                                              alt="Video Off"
                                              style={{
                                                visibility:
                                                  participant.hideCamera
                                                    ? "visible"
                                                    : "hidden",
                                              }}
                                            />

                                            <img
                                              src={MicOff}
                                              width="20px"
                                              height="20px"
                                              alt="Mic Mute"
                                              style={{
                                                visibility: participant.mute
                                                  ? "visible"
                                                  : "hidden",
                                              }}
                                            />
                                            <img
                                              src={Raisehandselected}
                                              width="20px"
                                              height="20px"
                                              alt="raise hand"
                                              style={{
                                                visibility:
                                                  participant.raiseHand
                                                    ? "visible"
                                                    : "hidden",
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  })}
                              </>
                            </div>
                          )}
                        </>
                      ) : null}
                    </>
                  </Row>
                  <Row>
                    <Col lg={8} md={8} sm={12}></Col>
                    <Col lg={4} md={4} sm={12}>
                      {/* {videoFeatureReducer.VideoChatNormalFlag === true ? (
                      <VideoPanelNormalChat />
                    ) : null} */}

                      {VideoAgendaNormalFlag === true ? (
                        <VideoPanelNormalAgenda />
                      ) : null}

                      {VideoMinutesMeetingNormalFlag === true ? (
                        <VideoPanelNormalMinutesMeeting />
                      ) : null}
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default VideoPanelNormal;
