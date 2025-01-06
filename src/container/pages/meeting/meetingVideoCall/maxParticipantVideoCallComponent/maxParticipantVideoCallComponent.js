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
import { useNavigate } from "react-router-dom";
import { MeetingContext } from "../../../../../context/MeetingContext";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";
import {
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
  setAudioControlForParticipant,
  setVideoControlForParticipant,
} from "../../../../../store/actions/VideoFeature_actions";

const ParticipantVideoCallComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const leaveMeetingVideoOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnLogoutResponse
  );

  const leaveMeetingVideoOnEndStatusMqttFlag = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingVideoOnEndStatusMqttFlag
  );
  const { editorRole } = useContext(MeetingContext);

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

  console.log(minimizeState, "minimizeState");

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

  // for set Video Web Cam on CLick
  const toggleAudio = (enable) => {
    dispatch(setAudioControlForParticipant(enable));
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
    dispatch(setVideoControlForParticipant(enable));
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
              console.error("Error playing video:", error);
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
    if (editorRole.role === "Participant") {
      localStorage.setItem("userRole", "Participant");
      localStorage.setItem("isMeetingVideo", true);
    }
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
        console.error("Error playing video:", error);
      });
    }
  }, [minimizeState]);

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
            lg={minimizeState ? 3 : 4}
            md={minimizeState ? 3 : 4}
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
            lg={minimizeState ? 9 : 8}
            md={minimizeState ? 9 : 8}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div className="max-videoParticipant-Icons-state">
              {isMicEnabled ? (
                <img
                  dragable="false"
                  src={MicOff}
                  className="cursor-pointer"
                  onClick={() => toggleAudio(false)}
                  alt=""
                />
              ) : (
                <img
                  dragable="false"
                  src={minimizeState ? MicOn : MicOn2}
                  onClick={() => toggleAudio(true)}
                  className="cursor-pointer"
                  alt=""
                />
              )}
            </div>
            <div className="max-videoParticipant-Icons-state">
              {isWebCamEnabled ? (
                <img
                  dragable="false"
                  src={VideoOff}
                  onClick={() => toggleVideo(false)}
                  alt=""
                />
              ) : (
                <img
                  dragable="false"
                  src={minimizeState ? VideoOn : VideoOn2}
                  onClick={() => toggleVideo(true)}
                  alt=""
                />
              )}
            </div>
            <div
              className="max-videoParticipant-Icons-state"
              onClick={toggleMinimizeState}
            >
              <img
                dragable="false"
                src={minimizeState ? MinimizeIcon2 : MinimizeIcon}
                alt="MinimizeIcon"
              />
            </div>
            <div className="max-videoParticipant-Icons-state">
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
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                dragable="false"
                src={EndCall}
                onClick={() => onClickEndVideoCall(false)}
                alt="EndCall"
              />
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
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
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
