import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import "./MaxHostVideoCallComponent.css";
import { Button } from "../../../../../components/elements";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import NormalizeIcon from "../../../../../assets/images/Recent Activity Icons/Video/MinimizeIcon.png";

import {
  getParticipantMeetingJoinMainApi,
  maxHostVideoCallPanel,
  normalHostVideoCallPanel,
  setAudioControlHost,
  setMicState,
  setVideoControlHost,
  setVideoState,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import NormalHostVideoCallComponent from "../normalHostVideoCallComponent/NormalHostVideoCallComponent";
import { useNavigate } from "react-router-dom";

const MaxHostVideoCallComponent = ({ handleExpandToNormal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );
  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );
  console.log("maxHostTrueeeee");

  let meetingId = localStorage.getItem("currentMeetingID");
  let newVideoUrl = localStorage.getItem("videoCallURL");

  let MeetingTitle = localStorage.getItem("MeetingTitle");

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isNormalPanel, setIsNormalPanel] = useState(false);

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
        }
      } catch (error) {
        alert(`Error accessing media devices: ${error.message}`);
      }
    };

    enableWebCamAndMic();

    // Cleanup on unmount or when isWebCamEnabled changes
    return () => {
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());

        // Clear the stream from state
        setStream(null);

        // Clear the video source
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null);
      }
    };
  }, [isWebCamEnabled]);
  // for set Video Web Cam on CLick
  const toggleAudio = (enable) => {
    console.log("toggleAudio", enable);
    dispatch(setMicState(enable));
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
        })
        .catch((error) => {
          alert("Error accessing microphone: " + error.message);
        });
    } else {
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      setIsMicEnabled(enable); // Microphone is now disabled
    }
  };
  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    console.log("toggleAudio", enable);
    dispatch(setVideoState(enable));
    localStorage.setItem("isWebCamEnabled", enable);
    dispatch(setVideoControlHost(enable));

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
      }
      setIsWebCamEnabled(enable); // Webcam is now disabled
    }
  };

  const joinNewApiVideoCallOnClick = () => {
    console.log("toggleAudio", isMicEnabled);
    console.log("toggleAudio", isWebCamEnabled);
    let data = {
      MeetingId: Number(meetingId),
      VideoCallURL: String(newVideoUrl),
      IsMuted: isMicEnabled,
      HideVideo: isWebCamEnabled,
    };
    dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
  };

  const onClickToNormalHostPanel = () => {
    setIsNormalPanel((prevState) => !prevState); // Toggle the state
    // dispatch(maxHostVideoCallPanel(false));
    // dispatch(normalHostVideoCallPanel(true));
  };

  const onClickToCloseHostMaxPanel = () => {
    dispatch(maxHostVideoCallPanel(false));
  };

  return (
    <Container fluid>
      <div
        className={
          isNormalPanel
            ? "max-videoParticipants-new-panel"
            : "max-videoHost-panel"
        }
      >
        <Row>
          <Col lg={4} md={4} sm={12} className="d-flex justify-content-start">
            <p className="max-Host-title-name">{MeetingTitle}</p>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div className="max-videohost-Icons-state">
              {isMicEnabled ? (
                <img
                  draggable="false"
                  src={MicOff}
                  className="cursor-pointer"
                  onClick={() => toggleAudio(false)}
                  alt=""
                />
              ) : (
                <img
                  draggable="false"
                  src={MicOn2 }
                  onClick={() => toggleAudio(true)}
                  className="cursor-pointer"
                  alt=""
                />
              )}
            </div>
            <div className="max-videohost-Icons-state">
              {isWebCamEnabled ? (
                <img
                  draggable="false"
                  src={VideoOff}
                  onClick={() => toggleVideo(false)}
                  alt=""
                />
              ) : (
                <img
                  draggable="false"
                  src={VideoOn2}
                  onClick={() => toggleVideo(true)}
                  alt=""
                />
              )}
            </div>
            <div className="max-videohost-Icons-state">
              <img draggable="false" src={MinimizeIcon} alt="" />
            </div>
            <div className="max-videohost-Icons-state">
              <img
                draggable="false"
                src={isNormalPanel ? ExpandIcon : NormalizeIcon}
                onClick={onClickToNormalHostPanel}
                alt=""
              />
            </div>
            <div className="max-videohost-Icons-state">
              <img
                draggable="false"
                src={EndCall}
                onClick={onClickToCloseHostMaxPanel}
                alt=""
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={8} md={8} sm={12}>
            {
              <>
                <div
                  className="max-Hostvideo-tag-name"
                  style={{
                    backgroundImage: `url(${ProfileUser})`,
                    backgroundSize: "33%",
                    backgroundRepeat: "no-repeat",
                    height: isNormalPanel ? "44vh" : "78vh",
                    backgroundPosition: "center center",
                  }}
                >
                  <div className="max-host-gradient-sheet">
                    <div className="avatar-class">
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <video
                          ref={videoRef}
                          className={
                            isNormalPanel
                              ? "video-max-Participant-new"
                              : "video-max-host"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </Col>
          <Col lg={4} md={4} sm={12}>
            <div
              className={
                isNormalPanel
                  ? "max-videoHostcomponent-panel"
                  : "max-videoHost-component"
              }
            >
              <>
                <p className="max-videohost-ready-to-join">
                  {t("Ready-to-join")}
                </p>
                <Button
                  text={t("Join-now")}
                  className="max-videoHost-Join-Now-Btn"
                  onClick={joinNewApiVideoCallOnClick}
                />
              </>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default MaxHostVideoCallComponent;
