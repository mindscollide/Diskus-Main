import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import "./maxParticipantVideoCallComponent.css";
import { Button } from "../../../../../components/elements";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn from "../../../../../components/layout/talk/talk-Video/video-images/Minimize Video Enabled.svg";
import MinToNormalIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Half Video Screen.svg";

import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import MinimizeIcon2 from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize White.svg";
import MicOn from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Mic Enabled.svg";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import NormalizeIcon from "../../../../../assets/images/Recent Activity Icons/Video/MinimizeIcon.png";
import MicOffHost from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MeetingContext,
  useMeetingContext,
} from "../../../../../context/MeetingContext";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import {
  closeWaitingParticipantVideoStream,
  endMeetingStatusForQuickMeetingModal,
  endMeetingStatusForQuickMeetingVideo,
  getParticipantMeetingJoinMainApi,
  globalNavigatorVideoStream,
  globalStateForAudioStream,
  globalStateForVideoStream,
  leaveMeetingOnEndStatusMqtt,
  leaveMeetingOnlogout,
  leaveMeetingVideoOnEndStatusMqtt,
  leaveMeetingVideoOnlogout,
  maximizeVideoPanelFlag,
  maxParticipantVideoCallPanel,
  maxParticipantVideoDenied,
  participantVideoButtonState,
  setAudioControlHost,
  setVideoControlHost,
  joinPresenterViewMainApi,
  presentationJoinFlowFlag,
} from "../../../../../store/actions/VideoFeature_actions";
import { WebNotificationExportRoutFunc } from "../../../../../commen/functions/utils";
import { useGroupsContext } from "../../../../../context/GroupsContext";
import { Tooltip } from "antd";
import { useResolutionContext } from "../../../../../context/ResolutionContext";
import { joinPresentationRequestMainApi } from "../../../../../store/actions/Guest_Video";

const ParticipantVideoCallComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const location = useLocation();

  const {
    setEditorRole,
    setViewFlag,
    setViewProposeDatePoll,
    editorRole,
    setVideoTalk,
    setAdvanceMeetingModalID,
    setPolls,
  } = useMeetingContext();
  const { setResultresolution } = useResolutionContext();
  const { setViewGroupPage, setShowModal } = useGroupsContext();

  const webNotificationData = useSelector(
    (state) => state.settingReducer.webNotificationDataVideoIntimination
  );
  const closeQuickMeetingVideoReducer = useSelector(
    (state) =>
      state.videoFeatureReducer.endMeetingStatusForQuickMeetingVideoFlag
  );

  const getJoinMeetingParticipantorHostrequest = useSelector(
    (state) => state.videoFeatureReducer.getJoinMeetingParticipantorHostrequest
  );
  const isAudioGlobalStream = useSelector(
    (state) => state.videoFeatureReducer.isAudioGlobalStream
  );

  const isVideoGlobalStream = useSelector(
    (state) => state.videoFeatureReducer.isVideoGlobalStream
  );

  const allNavigatorVideoStream = useSelector(
    (state) => state.videoFeatureReducer.allNavigatorVideoStream
  );

  // CR(0012249) — false for every existing meeting-video usage of this
  // component; only true when this same modal is opened for a
  // Presentation join instead.
  const isPresentationJoinFlow = useSelector(
    (state) => state.videoFeatureReducer.isPresentationJoinFlow
  );

  // CR(0012249) — host's response to this participant's presentation join
  // request, and the "host stopped the presentation" signal while still
  // waiting. Only acted on when isPresentationJoinFlow is true, so none of
  // this can affect the existing meeting-video waiting flow.
  const presentationJoinApprovedData = useSelector(
    (state) => state.videoFeatureReducer.presentationJoinApprovedData
  );
  const presentationJoinRejectedData = useSelector(
    (state) => state.videoFeatureReducer.presentationJoinRejectedData
  );
  const presentationStoppedData = useSelector(
    (state) => state.videoFeatureReducer.presentationStoppedData
  );

  const leaveMeetingVideoOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnLogoutResponse
  );

  const leaveMeetingVideoOnEndStatusMqttFlag = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnEndStatusMqttFlag
  );

  const closeVideoStreamForParticipant = useSelector(
    (state) => state.videoFeatureReducer.closeVideoStreamForParticipant
  );

  let meetingId = localStorage.getItem("currentMeetingID");

  let newVideoUrl = localStorage.getItem("videoCallURL");

  let participantMeetingTitle = localStorage.getItem("meetingTitle");

  const videoRef = useRef(null);
  const [getReady, setGetReady] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isNormalPanel, setIsNormalPanel] = useState(false);
  const [joinButton, setJoinButton] = useState(false);
  // Other hooks and state declarations
  const [minimizeState, setMinimizeState] = useState(false);

  // local state for Video Html Tag event state
  const [canVideoPlay, setCanVideoPlay] = useState(false);

  

  useEffect(() => {
    // Enable webcam and microphone when isWebCamEnabled is true
    const enableWebCamAndMic = async () => {
      try {
        if (!isWebCamEnabled) {
          // Access video and audio streams
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          // Set up video playback
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = true;
            await videoRef.current.play();
          }
          localStorage.setItem("isWebCamEnabled", false);
          setStream(stream); // Store the video and audio stream

          // Handle microphone setup
          const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
          if (streamAudio) {
            // Stop any existing audio tracks
            streamAudio.getTracks().forEach((track) => track.stop());
          }
          localStorage.setItem("isMicEnabled", false);
          setStreamAudio(audioStream);
          sessionStorage.setItem("streamOnOff", JSON.stringify(true));
          sessionStorage.setItem("videoStreamId", stream.id); // Save video stream ID
          sessionStorage.setItem("audioStreamOnOff", JSON.stringify(true));
          sessionStorage.setItem("audioStreamId", audioStream.id);
        }
      } catch (error) {
        alert(`Error accessing media devices: ${error.message}`);
      }
    };

    enableWebCamAndMic();

    // Cleanup on unmount or when isWebCamEnabled changes
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }

      // Stop video stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Stop audio stream
      if (streamAudio) {
        streamAudio.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isWebCamEnabled]);

  useEffect(() => {
    if (allNavigatorVideoStream === 1) {
      if (isVideoGlobalStream) {
        if (stream) {
          stream.getVideoTracks().forEach((track) => track.stop());
          setStream(null); // Clear the stream from state
          if (videoRef.current) {
            videoRef.current.srcObject = null; // Clear the video source
          }
          sessionStorage.setItem("streamOnOff", JSON.stringify(false));
          sessionStorage.removeItem("videoStreamId");
        }
        dispatch(globalStateForVideoStream(false));
      }
      if (isAudioGlobalStream) {
        // Stop audio stream
        if (streamAudio) {
          streamAudio.getAudioTracks().forEach((track) => track.stop());
          setStreamAudio(null); // Clear the stream from state
          sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
        }
        dispatch(globalStateForAudioStream(true));
      }
      dispatch(globalNavigatorVideoStream(0));
      dispatch(maxParticipantVideoCallPanel(false));
      dispatch(maxParticipantVideoDenied(true));
    } else if (allNavigatorVideoStream === 2) {
      if (isVideoGlobalStream) {
        if (stream) {
          stream.getVideoTracks().forEach((track) => track.stop());
          setStream(null); // Clear the stream from state
          if (videoRef.current) {
            videoRef.current.srcObject = null; // Clear the video source
          }
          sessionStorage.setItem("streamOnOff", JSON.stringify(false));
          sessionStorage.removeItem("videoStreamId");
        }
        dispatch(globalStateForVideoStream(false));
      }
      if (isAudioGlobalStream) {
        // Stop audio stream
        if (streamAudio) {
          streamAudio.getAudioTracks().forEach((track) => track.stop());
          setStreamAudio(null); // Clear the stream from state
          sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
        }
        dispatch(globalStateForAudioStream(true));
      }
      dispatch(globalNavigatorVideoStream(0));
      dispatch(maxParticipantVideoCallPanel(false));
      dispatch(maximizeVideoPanelFlag(true));
    }
  }, [allNavigatorVideoStream]);

  // CR(0012249) — host admitted this participant into the presentation.
  // Completes the join using the same joinPresenterViewMainApi call that
  // used to fire immediately on click (AgendaViewer.js), then closes this
  // waiting-room panel so the actual presenter view can take over.
  useEffect(() => {
    if (isPresentationJoinFlow && presentationJoinApprovedData) {
      // videoCallNormalHeader.js's shared RoomID/UID resolution for the
      // in-call mute/hide/raise-hand controls checks callTypeID === 2
      // (an active 1:1/group call) BEFORE it checks presenter-view state.
      // A presentation participant is never in that kind of call by this
      // point, but callTypeID is easy to have left stale in localStorage
      // from an earlier 1:1/group call in the same session — which then
      // makes those controls resolve UID from callerGuid/recepientGuid
      // (never set here) instead of participantUID, sending null UID.
      // Clearing it here (scoped to this presentation-join path only)
      // keeps that existing shared logic correct without touching it.
      localStorage.removeItem("callTypeID");
      let data = {
        VideoCallURL: String(newVideoUrl),
        WasInVideo: false,
      };
      dispatch(joinPresenterViewMainApi(navigate, t, data));
      dispatch(presentationJoinFlowFlag(false));
      dispatch(maxParticipantVideoCallPanel(false));
      localStorage.removeItem("presentationRoomID");
    }
  }, [presentationJoinApprovedData]);

  // CR(0012249) — host rejected this participant's presentation join
  // request. Reuses the existing meeting-video "denied" screen/flag since
  // no presentation-specific denied screen exists yet.
  useEffect(() => {
    if (isPresentationJoinFlow && presentationJoinRejectedData) {
      dispatch(presentationJoinFlowFlag(false));
      dispatch(maxParticipantVideoCallPanel(false));
      dispatch(maxParticipantVideoDenied(true));
      localStorage.removeItem("presentationRoomID");
    }
  }, [presentationJoinRejectedData]);

  // CR(0012249) — host stopped the presentation while this participant was
  // still waiting to be admitted. Just close the waiting room; the toast is
  // shown from Dashboard.js's MEETING_PRESENTATION_STOPPED handler.
  useEffect(() => {
    if (isPresentationJoinFlow && presentationStoppedData) {
      dispatch(presentationJoinFlowFlag(false));
      dispatch(maxParticipantVideoCallPanel(false));
      localStorage.removeItem("presentationRoomID");
    }
  }, [presentationStoppedData]);

  // it'll check when Video Html Tag is Connected when connected then make video Icon enable otherwise it'll disable
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setCanVideoPlay(true);
    };

    const handleError = () => {
      setCanVideoPlay(false);
    };

    const handleStalled = () => {
      setCanVideoPlay(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
    };
  }, []);

  // for set Video Web Cam on CLick
  const toggleAudio = (enable) => {
    // CR(0012249): in the presentation waiting room, mic/camera are off by
    // default and the participant must not be able to turn them back on
    // themselves. The icon is already visually locked below (pointerEvents),
    // this is a defense-in-depth guard in case toggleAudio is ever invoked
    // another way. Turning OFF is still allowed either way.
    if (isPresentationJoinFlow && enable) {
      return;
    }
    dispatch(setAudioControlHost(enable));
    localStorage.setItem("isMicEnabled", enable);
    if (!enable) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((audioStream) => {
          // Stop any existing audio tracks before starting a new one
          if (streamAudio) {
            streamAudio.getAudioTracks().forEach((track) => track.stop());
          }

          const newStream = new MediaStream([audioStream.getAudioTracks()[0]]);
          setStreamAudio(newStream);
          setIsMicEnabled(enable);

          // Store audio stream state in sessionStorage
          sessionStorage.setItem("audioStreamOnOff", JSON.stringify(true));
          sessionStorage.setItem("audioStreamId", newStream.id);
        })
        .catch((error) => {
          alert("Error accessing microphone: " + error.message);
        });
    } else {
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
      sessionStorage.removeItem("audioStreamId");
      setIsMicEnabled(enable); // Microphone is now disabled
    }
  };

  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    // CR(0012249): see the matching guard in toggleAudio above.
    if (isPresentationJoinFlow && enable) {
      return;
    }
    dispatch(setVideoControlHost(enable));
    localStorage.setItem("isWebCamEnabled", enable);
    if (!enable) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((videoStream) => {
          // Stop any existing video tracks before starting a new one
          if (stream) {
            stream.getVideoTracks().forEach((track) => track.stop());
          }

          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.muted = true;
            videoRef.current.play().catch((error) => {
              
            });
          }
          setStream(videoStream);
          setIsWebCamEnabled(enable);

          // Store video stream information in sessionStorage
          sessionStorage.setItem("streamOnOff", JSON.stringify(true));
          sessionStorage.setItem("videoStreamId", videoStream.id);
        })
        .catch((error) => {
          alert("Error accessing webcam: " + error.message);
        });
    } else {
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream from state
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the video source
        }

        sessionStorage.setItem("streamOnOff", JSON.stringify(false));
        sessionStorage.removeItem("videoStreamId");
      }
      setIsWebCamEnabled(enable); // Webcam is now disabled
    }
  };

  const joinNewApiVideoCallOnClick = async () => {
    setJoinButton(true);

    // CR(0012249) — Presentation join request, kept fully separate from
    // the existing meeting-video branch below (which is untouched).
    // NOTE: RoomID's source (presentationRoomID) isn't wired yet — the
    // next step (opening this component for a started Presentation) needs
    // to set this localStorage key before the participant can click here,
    // since JoinPresentationRequest requires the presentation's own
    // RoomID, not the meeting's.
    if (isPresentationJoinFlow) {
      let presentationData = {
        RoomID: localStorage.getItem("presentationRoomID"),
        MeetingID: Number(meetingId),
        IsMuted: isMicEnabled,
        HideVideo: isWebCamEnabled,
      };
      await dispatch(
        joinPresentationRequestMainApi(navigate, t, presentationData),
      );
      setIsWaiting(true);
      setJoinButton(false);
      return;
    }

    if (editorRole.role === "Participant") {
      localStorage.setItem("userRole", "Participant");
      localStorage.setItem("isMeetingVideo", true);
    }
    dispatch(participantVideoButtonState(true));
    let data = {
      MeetingId: Number(meetingId),
      VideoCallURL: String(newVideoUrl),
      IsMuted: isMicEnabled,
      HideVideo: isWebCamEnabled,
    };
    await dispatch(
      getParticipantMeetingJoinMainApi(
        navigate,
        t,
        data,
        setIsWaiting,
        setGetReady,
        setJoinButton
      )
    );
  };

  //it's Ensure that videoRef is stream or open when transitioning or state changes between minimizeState
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => {
        
      });
    }
  }, [minimizeState]);

  useEffect(() => {
    
    if (closeVideoStreamForParticipant && stream) {
      
      if (stream) {
        
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream from state
        if (videoRef.current) {
          
          videoRef.current.srcObject = null; // Clear the video source
        }

        sessionStorage.setItem("streamOnOff", JSON.stringify(false));
        sessionStorage.removeItem("videoStreamId");
      }
      if (streamAudio) {
        
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
      sessionStorage.removeItem("audioStreamId");
      dispatch(participantVideoButtonState(false));

      setIsMicEnabled(false);
      
      let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
      let currentMeetingVideoURL = JSON.parse(
        sessionStorage.getItem("currentMeetingVideoURL")
      );
      let leaveRoomId = getJoinMeetingParticipantorHostrequest
        ? getJoinMeetingParticipantorHostrequest.roomID
        : 0;

      let userGUID = getJoinMeetingParticipantorHostrequest
        ? getJoinMeetingParticipantorHostrequest.guid
        : 0;
      let newName = localStorage.getItem("name");
      let currentMeetingID = localStorage.getItem("currentMeetingID");
      sessionStorage.removeItem("isWaiting");
      

      let Data = {
        RoomID: leaveRoomId,
        UserGUID: userGUID,
        Name: String(newName),
        IsHost: false,
        MeetingID: Number(currentMeetingID),
      };
      

      let data = {
        VideoCallURL: String(currentMeetingVideoURL || ""),
        Guid: "",
        WasInVideo: Boolean(isMeetingVideo),
      };
      dispatch(closeWaitingParticipantVideoStream(false));
      
      dispatch(LeaveMeetingVideo(Data, navigate, t, 1, data));
    }
  }, [closeVideoStreamForParticipant]);

  const onClickToNormalParticipantPanel = () => {
    setIsNormalPanel((prevState) => !prevState);
    setMinimizeState(false);
  };

  const toggleMinimizeState = () => {
    if (minimizeState) {
      // If currently minimized, clicking the icon will normalize the state
      setMinimizeState(false);
      setIsNormalPanel(true);
    } else {
      // If not minimized, toggle to minimized state
      setMinimizeState(true);
      setIsNormalPanel(false);
    }
  };

  const onClickEndVideoCall = async (flag, flag2, flag3) => {
    let userGUID = getJoinMeetingParticipantorHostrequest
      ? getJoinMeetingParticipantorHostrequest.guid
      : 0;
    let roomID = getJoinMeetingParticipantorHostrequest
      ? getJoinMeetingParticipantorHostrequest.roomID
      : 0;
    let newName = localStorage.getItem("name");
    let currentMeetingID = localStorage.getItem("currentMeetingID");
    if (stream) {
      stream.getVideoTracks().forEach((track) => track.stop());
      setStream(null); // Clear the stream from state
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }

      sessionStorage.setItem("streamOnOff", JSON.stringify(false));
      sessionStorage.removeItem("videoStreamId");
    }
    if (streamAudio) {
      streamAudio.getAudioTracks().forEach((track) => track.stop());
      setStreamAudio(null); // Clear the stream from state
    }
    sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
    sessionStorage.removeItem("audioStreamId");
    await dispatch(participantVideoButtonState(false));

    setIsMicEnabled(false); // Microphone is now disabled
    if (isWaiting) {
      let Data = {
        RoomID: roomID,
        UserGUID: userGUID,
        Name: String(newName),
        IsHost: false,
        MeetingID: Number(currentMeetingID),
      };
      await dispatch(LeaveMeetingVideo(Data, navigate, t));
      // Stop video stream
      dispatch(maxParticipantVideoCallPanel(false));
    } else {
      dispatch(maxParticipantVideoCallPanel(false));
    }

    sessionStorage.removeItem("audioStreamId");

    // Clear session storage related to participant
    sessionStorage.removeItem("participantData");
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

    const webNotifactionDataRoutecheckFlag = JSON.parse(
      localStorage.getItem("webNotifactionDataRoutecheckFlag")
    );
    try {
      if (webNotifactionDataRoutecheckFlag) {
        let currentURL = window.location.href;
        let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
        WebNotificationExportRoutFunc(
          currentURL,
          dispatch,
          t,
          location,
          navigate,
          webNotificationData,
          setViewFlag,
          setEditorRole,
          setViewProposeDatePoll,
          setViewGroupPage,
          setShowModal,
          setVideoTalk,
          setAdvanceMeetingModalID,
          setResultresolution,
          isMeeting,
          setPolls
        );
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnLogoutResponse) {
        onClickEndVideoCall(true, false, false);
      }
    } catch {}
  }, [leaveMeetingVideoOnLogoutResponse]);

  useEffect(() => {
    try {
      if (closeQuickMeetingVideoReducer) {
        onClickEndVideoCall(false, true, false);
      }
    } catch (error) {}
  }, [closeQuickMeetingVideoReducer]);

  useEffect(() => {
    try {
      if (leaveMeetingVideoOnEndStatusMqttFlag) {
        onClickEndVideoCall(false, false, true);
      }
    } catch (error) {}
  }, [leaveMeetingVideoOnEndStatusMqttFlag]);

  const isEndCallEnabled = !joinButton || isWaiting || getReady;

  return (
    <Container fluid>
      <div
        className={
          minimizeState
            ? "max-minimize-videoParticipantsvideo-panel"
            : isNormalPanel
            ? "max-videoParticipantsvideo-panel"
            : "max-videoParticipant-panel"
        }
      >
        <Row>
          <Col
            lg={minimizeState ? 5 : 8}
            md={minimizeState ? 5 : 8}
            sm={12}
            className="d-flex justify-content-start"
          >
            <p
              className={
                minimizeState
                  ? "max-minimize-participant-title"
                  : "max-participant-title"
              }
            >
              {participantMeetingTitle}
            </p>
          </Col>
          <Col
            lg={minimizeState ? 7 : 4}
            md={minimizeState ? 7 : 4}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div
              className="max-videoParticipant-Icons-state"
              style={{
                // CR(0012249): in the presentation waiting room the
                // participant can't control mic/camera at all — same
                // locked look as the existing canVideoPlay readiness gate.
                pointerEvents:
                  canVideoPlay && !isPresentationJoinFlow ? "auto" : "none",
                opacity: canVideoPlay && !isPresentationJoinFlow ? 1 : 0.4,
                cursor:
                  canVideoPlay && !isPresentationJoinFlow
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {isMicEnabled ? (
                <Tooltip placement="topRight" title={t("Enable-mic")}>
                  <img
                    dragable="false"
                    src={MicOff}
                    className="cursor-pointer"
                    onClick={() => toggleAudio(false)}
                    alt=""
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="topRight" title={t("Disable-mic")}>
                  <img
                    dragable="false"
                    src={minimizeState ? MicOn : MicOn2}
                    onClick={() => toggleAudio(true)}
                    className="cursor-pointer"
                    alt=""
                  />
                </Tooltip>
              )}
            </div>
            <div
              className="max-videoParticipant-Icons-state"
              style={{
                // CR(0012249): same presentation-mode lock as the mic block
                // above.
                pointerEvents:
                  canVideoPlay && !isPresentationJoinFlow ? "auto" : "none",
                opacity: canVideoPlay && !isPresentationJoinFlow ? 1 : 0.4,
                cursor:
                  canVideoPlay && !isPresentationJoinFlow
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {isWebCamEnabled ? (
                <Tooltip placement="topRight" title={t("Enable-video")}>
                  <img
                    dragable="false"
                    src={VideoOff}
                    onClick={() => toggleVideo(false)}
                    alt=""
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="topRight" title={t("Disable-video")}>
                  <img
                    dragable="false"
                    src={minimizeState ? VideoOn : VideoOn2}
                    onClick={() => toggleVideo(true)}
                    alt=""
                  />
                </Tooltip>
              )}
            </div>

            <div
              className="max-videoParticipant-Icons-state"
              style={{ pointerEvents: minimizeState ? "none" : "auto" }}
              onClick={toggleMinimizeState}
            >
              <Tooltip placement="topRight" title={t("Minimize")}>
                <img
                  dragable="false"
                  src={minimizeState ? MinimizeIcon2 : MinimizeIcon}
                  alt="MinimizeIcon"
                />
              </Tooltip>
            </div>
            <div className="max-videoParticipant-Icons-state">
              <Tooltip
                placement="topRight"
                title={
                  minimizeState
                    ? t("Expand")
                    : NormalizeIcon && isNormalPanel
                    ? t("Expand")
                    : t("Collapse")
                }
              >
                <img
                  dragable="false"
                  src={
                    minimizeState
                      ? MinToNormalIcon
                      : NormalizeIcon && isNormalPanel
                      ? ExpandIcon
                      : NormalizeIcon
                  }
                  onClick={onClickToNormalParticipantPanel}
                  alt="ExpandIcon"
                />
              </Tooltip>
            </div>
            <div
              className="max-videoParticipant-Icons-state"
              style={{
                pointerEvents: isEndCallEnabled ? "auto" : "none",
                opacity: isEndCallEnabled ? 1 : 0.4,
                cursor: isEndCallEnabled ? "pointer" : "not-allowed",
              }}
            >
              <Tooltip placement="topRight" title={t("Leave-call")}>
                <img
                  dragable="false"
                  src={EndCall}
                  onClick={() => {
                    if (isEndCallEnabled) {
                      onClickEndVideoCall(false);
                    }
                  }}
                  alt="EndCall"
                />
              </Tooltip>
            </div>
          </Col>
        </Row>

        {!minimizeState && (
          <Row>
            <Col lg={8} md={8} sm={12}>
              {
                <>
                  <div
                    className="max-videoParticipant-tag-name "
                    style={{
                      backgroundImage: `url(${ProfileUser})`,
                      backgroundSize: "33%",
                      backgroundRepeat: "no-repeat",
                      height: minimizeState
                        ? "7vh"
                        : isNormalPanel
                        ? "44vh"
                        : "78vh",
                      backgroundPosition: "center center",
                    }}
                  >
                    <div className="max-videoParticipant-gradient-sheet">
                      <div className="avatar-class">
                        <video
                          ref={videoRef}
                          className={
                            minimizeState
                              ? "video-max-minimize-videoParticipant-panel"
                              : isNormalPanel
                              ? "video-max-videoParticipantsvideo-panel"
                              : "video-max-Participant"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              }
            </Col>
            {!minimizeState && (
              <Col lg={4} md={4} sm={12}>
                {isWaiting ? (
                  <>
                    <div className="max-videoParticipant-component">
                      <p className="max-videoParticipant-waiting-room-class">
                        {t("You-are-in-the-waiting-room")}
                      </p>
                      <p className="max-Hostvideo-organizer-allow-class">
                        {t("The-organizer-will-allow-you-to-join-shortly")}
                      </p>
                    </div>
                  </>
                ) : !getReady ? (
                  <>
                    <div className="max-videoParticipant-component">
                      <>
                        <p className="max-videoParticipant-ready-to-join">
                          {t("Ready-to-join")}
                        </p>
                        <Button
                          disableBtn={joinButton}
                          text={t("Join-now")}
                          className="max-videoParticipant-Join-Now-Btn"
                          onClick={joinNewApiVideoCallOnClick}
                        />
                      </>
                    </div>
                  </>
                ) : null}
              </Col>
            )}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default ParticipantVideoCallComponent;
