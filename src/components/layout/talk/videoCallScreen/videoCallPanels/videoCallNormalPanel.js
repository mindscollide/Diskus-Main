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
  disableZoomBeforeJoinSession,
  getVideoCallParticipantsMainApi,
  incomingVideoCallFlag,
  makeHostNow,
  makeParticipantHost,
  maximizeVideoPanelFlag,
  maxParticipantVideoRemoved,
  participantListWaitingListMainApi,
  participantWaitingListBox,
  setAudioControlForParticipant,
  setAudioControlHost,
  setParticipantLeaveCallForJoinNonMeetingCall,
  setParticipantRemovedFromVideobyHost,
  setRaisedUnRaisedParticiant,
  setVideoControlForParticipant,
  setVideoControlHost,
  startPresenterViewMainApi,
  toggleParticipantsVisibility,
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

const VideoPanelNormal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Create a ref for the iframe element
  let iframeRef = useRef(null);

  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");

  let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

  let newRoomID = localStorage.getItem("newRoomId");

  let activeRoomID = localStorage.getItem("activeRoomID");

  let currentUserName = localStorage.getItem("name");

  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  let participantRoomIds = localStorage.getItem("participantRoomId");

  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));

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

  const getAllParticipantGuest = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  // For acccept Join name participantList
  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );

  const audioControlHost = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

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

  const InitiateVideoCallData = useSelector(
    (state) => state.VideoMainReducer.InitiateVideoCallData
  );
  const VideoCallResponseData = useSelector(
    (state) => state.VideoMainReducer.VideoCallResponseData
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

  const presenterMeetingId = useSelector(
    (state) => state.videoFeatureReducer.presenterMeetingId
  );

  console.log(presenterViewFlag, "presenterViewFlag");

  const [allParticipant, setAllParticipant] = useState([]);

  const [participantsList, setParticipantsList] = useState([]);

  const [callerURL, setCallerURL] = useState("");

  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  const meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
  // for make host
  const [isMeetingHost, setIsMeetingHost] = useState(
    meetingHost?.isHost ? true : false
  );
  const iframe = iframeRef.current;
  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  let refinedParticipantVideoUrl = localStorage.getItem("refinedVideoUrl");
  let refinedURLCheck = JSON.parse(localStorage.getItem("refinedVideoGiven"));

  let urlFormeetingapi = localStorage.getItem("hostUrl");

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);
  const [isMeetinVideoCeckForParticipant, setIsMeetinVideoCeckForParticipant] =
    useState(false);

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
      let roomID = params.get("RoomID") || params.get("roomid");

      // Ensure RoomID is treated as a string
      roomID = String(roomID).trim();

      // Validate RoomID - must be a number greater than 0
      return /^\d+$/.test(roomID) && parseInt(roomID, 10) > 0; // Only numbers > 0
    } catch (error) {
      // Return false for any parsing or validation error
      return false;
    }
  }

  useEffect(() => {
    if (
      isMeeting &&
      isMeetingHost === false &&
      meetingHost?.isDashboardVideo === true
    ) {
      let Data = {
        RoomID: String(participantRoomIds),
      };
      dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
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
        dispatch(setAudioControlForParticipant(false));
        dispatch(setVideoControlForParticipant(false));

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
  }, [participantRemovedFromVideobyHost, iframe]);

  useEffect(() => {
    const handleLeaveSession = async () => {
      const iframe = iframeRef.current;
      if (participantLeaveCallForJoinNonMeetingCall && iframe?.contentWindow) {
        console.log("busyCall");
        let meetinHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));
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
        await dispatch(setAudioControlForParticipant(false));
        await dispatch(setVideoControlHost(false));
        await dispatch(setVideoControlForParticipant(false));
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
  }, [participantLeaveCallForJoinNonMeetingCall, iframe]);

  useEffect(() => {
    // Determine the control source based on the user role
    // Reference the iframe and perform postMessage based on the control source
    if (isMeetingHost) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow !== null) {
        if (audioControlHost === true) {
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlHost]);

  useEffect(() => {
    // Define the leave function to clean up the session
    const handleBeforeUnload = async (event) => {
      try {
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
    };
  }, [iframe]);

  useEffect(() => {
    // Determine the control source based on the user role
    if (isMeetingHost === false) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow !== null) {
        if (audioControlForParticipant === true) {
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlForParticipant]);

  useEffect(() => {
    if (isMeetingHost === false) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow !== null) {
        if (videoControlForParticipant === true) {
          iframe.contentWindow.postMessage("VidOn", "*");
        } else {
          iframe.contentWindow.postMessage("VidOff", "*");
        }
      }
    }
  }, [videoControlForParticipant]);

  useEffect(() => {
    if (isMeetingHost) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow !== null) {
        if (videoControlHost === true) {
          iframe.contentWindow.postMessage("VidOn", "*");
        } else {
          iframe.contentWindow.postMessage("VidOff", "*");
        }
      }
    }
  }, [videoControlHost]);

  useEffect(() => {
    if (getAllParticipantGuest?.length) {
      setAllParticipant(getAllParticipantGuest);
    } else {
      setAllParticipant([]);
    }
  }, [getAllParticipantGuest]);

  useEffect(() => {
    if (getVideoParticpantListandWaitingList?.length) {
      setAllParticipant((prev) => {
        const combined = [...prev, ...getVideoParticpantListandWaitingList];
        // Filter duplicates by checking the unique identifier, e.g., `guid`
        const uniqueParticipants = combined.filter(
          (participant, index, self) =>
            index === self.findIndex((p) => p.guid === participant.guid)
        );
        return uniqueParticipants;
      });
    }
  }, [getVideoParticpantListandWaitingList]);

  useEffect(() => {
    if (
      getNewParticipantsMeetingJoin !== null &&
      getNewParticipantsMeetingJoin !== undefined &&
      getNewParticipantsMeetingJoin.length > 0
    ) {
      // Extract and set the new participants to state
      setParticipantsList(getNewParticipantsMeetingJoin);
    } else {
      setParticipantsList([]);
    }
  }, [getNewParticipantsMeetingJoin]);

  useEffect(() => {
    try {
      if (Object.keys(InitiateVideoCallData).length > 0) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        console.log("iframeiframe", dynamicBaseURLCaller);

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
          if (isMeetingHost) {
            console.log("iframeiframe");
            console.log("iframeiframe", urlFormeetingapi);
            console.log("iframeiframe", validateRoomID(urlFormeetingapi));
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", urlFormeetingapi);
              if (urlFormeetingapi !== callerURL) {
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
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

      // let randomGuestName = generateRandomGuest();
      console.log("iframeiframe", endIndexBaseURLCaller);
      console.log("iframeiframe", extractedBaseURLCaller);
      console.log("iframeiframe", isMeeting);
      console.log("iframeiframe", callAcceptedRoomID);
      console.log("iframeiframe", VideoCallResponseData);

      if (isMeeting === false) {
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
        if (presenterViewFlag) {
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
          if (isMeetingHost) {
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

  // Function to trigger the action in the iframe
  // const handleScreenShareButton = async () => {
  //   if (!LeaveCallModalFlag) {
  //     const iframe = iframeRef.current; // Reference to your iframe
  //     if (iframe) {
  //       // Post message to iframe
  //       iframe.contentWindow.postMessage("ScreenShare", "*"); // Use specific origin to improve security
  //     }
  //     // window.parent.postMessage("ScreenShareStarted", "*");

  //     // try {
  //     //   const stream = await navigator.mediaDevices.getDisplayMedia({
  //     //     video: true,
  //     //     audio: false,
  //     //   });

  //     //   // Screen sharing started successfully
  //     //   console.log("Screen sharing started");
  //     //   setIsScreenActive(true);

  //     //   // Set screen sharing stream to a video element
  //     //   const videoElement = document.getElementById("screenShareVideo");
  //     //   if (videoElement) {
  //     //     videoElement.srcObject = stream;
  //     //     videoElement.play(); // Ensure video playback starts
  //     //   }

  //     //   // Listen for when the stream ends (i.e., user stops sharing)
  //     //   stream.getVideoTracks()[0].addEventListener("ended", () => {
  //     //     window.parent.postMessage("ScreenShareEnded", "*");
  //     //     setIsScreenActive(false);
  //     //     console.log("Screen sharing ended");
  //     //     setIsScreenActive(false);

  //     //     // Optionally, stop the video element
  //     //     if (videoElement) {
  //     //       videoElement.srcObject = null; // Stop the stream from being displayed
  //     //     }
  //     //   });
  //     // } catch (err) {
  //     //   // User canceled or failed to get media
  //     //   window.parent.postMessage("ScreenShareCanceled", "*");
  //     //   setIsScreenActive(false);
  //     //   console.log("Screen sharing canceled", err);
  //     // }
  //   }
  // };

  const handleScreenShareButton = async () => {
    if (!isZoomEnabled || !disableBeforeJoinZoom) {
      if (!LeaveCallModalFlag) {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          // Post message to iframe
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
    console.log("handlePostMessage", iframe);
    if (iframe && iframe.contentWindow) {
      // Post message to iframe
      iframe.contentWindow.postMessage("ScreenShare", "*"); // Replace with actual origin
    } else {
      console.log("share screen Iframe contentWindow is not available.");
    }
  };

  const handlerForStaringPresenterView = async () => {
    console.log("handlePostMessage", iframe);
    let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));

    // Post message to iframe
    let data = { MeetingID: currentMeetingID, RoomID: callAcceptedRoomID };

    dispatch(startPresenterViewMainApi(navigate, t, data));
  };

  // Add event listener for messages
  useEffect(() => {
    const messageHandler = (event) => {
      // Check the origin for security
      console.log("handlePostMessage", event);
      console.log("handlePostMessage", event.data);
      if (event.origin === "https://portal.letsdiskus.com:9414") {
        // if (event.origin === "http://localhost:5500") {
        // Example actions based on the message received
        console.log("handlePostMessage", event.data);
        switch (event.data) {
          case "ScreenSharedMsgFromIframe":
            console.log("handlePostMessage", event.data);
            setIsScreenActive(true); // Show a modal or perform an action
            if (presenterViewFlag && presenterViewHostFlag) {
              console.log("handlePostMessage", iframe);
              handlerForStaringPresenterView();
            }

            break;
          case "ScreenSharedStopMsgFromIframe":
            console.log("handlePostMessage", event.data);
            setIsScreenActive(false);
            break;

          case "StreamConnected":
            dispatch(disableZoomBeforeJoinSession(false));
            console.log("handlePostMessage", presenterViewFlag);
            console.log("handlePostMessage", presenterViewHostFlag);
            console.log("handlePostMessage", iframe?.contentWindow);
            if (presenterViewFlag && presenterViewHostFlag) {
              console.log("handlePostMessage", iframe);
              handlePresenterView();
            }
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

  const disableMicFunction = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow && presenterViewFlag) {
        console.log("disableMicFunction");
        iframe.contentWindow.postMessage("MicOff", "*");
        setIsMicActive(!isMicActive);
        localStorage.setItem("MicOff", !isMicActive);
      }
    } catch (error) {
      console.log("disableMicFunction", error);
    }
  };

  const disableVideoFunction = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage("VidOff", "*");
        setIsVideoActive(!isVideoActive);
        localStorage.setItem("VidOff", !isVideoActive);
      }
    } catch {}
  };

  const closeParticipantsList = () => {
    dispatch(toggleParticipantsVisibility(false));
  };

  localStorage.setItem("videoIframe", iframeRef.current);
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
                    presenterViewFlag
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
                    showTile={showTile}
                    iframeCurrent={iframe}
                  />
                  {VideoOutgoingCallFlag && <VideoOutgoing />}
                  <Row>
                    <>
                      <Col
                        lg={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        md={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        sm={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                      >
                        <div
                          className={
                            NormalizeVideoFlag === true &&
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

                      {isMeetingHost &&
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
                              {isMeetingHost && participantWaitinglistBox && (
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
                                            {participant.hideCamera ? (
                                              <img
                                                src={VideoOff}
                                                width="20px"
                                                height="20px"
                                                alt="Video Off"
                                              />
                                            ) : null}

                                            {participant.mute ? (
                                              <img
                                                src={MicOff}
                                                width="20px"
                                                height="20px"
                                                alt="Mic Mute"
                                              />
                                            ) : null}
                                            {participant.raiseHand ? (
                                              <img
                                                src={Raisehandselected}
                                                width="20px"
                                                height="20px"
                                                alt="raise hand"
                                              />
                                            ) : null}
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
