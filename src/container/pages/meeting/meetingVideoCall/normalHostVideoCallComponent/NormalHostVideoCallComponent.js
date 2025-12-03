import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import "./NormalHostVideoCallComponent.css";
import { Button } from "../../../../../components/elements";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import {
  getParticipantMeetingJoinMainApi,
  maxParticipantVideoCallPanel,
  normalParticipantVideoCallPanel,
  setAudioControlHost,
  setVideoControlHost,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NormalHostVideoCallComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let meetingId = localStorage.getItem("currentMeetingID");
  let newVideoUrl = localStorage.getItem("videoCallURL");
  let participantMeetingTitle = localStorage.getItem("meetingTitle");

  const isMicEnabledState = useSelector(
    (state) => state.videoFeatureReducer.isMicEnabled
  );
  const isWebCamEnabledState = useSelector(
    (state) => state.videoFeatureReducer.isWebCamEnabled
  );

  const isWebCamEnabledTrue =
    localStorage.getItem("isWebCamEnabled") === "true";
  const isMicEnabledTrue = localStorage.getItem("isMicEnabled") === "true";

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  useEffect(() => {
    // Automatically enable the webcam on initial load
    if (isWebCamEnabled) {
      const mediaDevices = navigator.mediaDevices;
      mediaDevices
        ?.getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.muted = true;
            video.play();
          }
          setStream(stream); // Store the stream to disable later
          setIsWebCamEnabled(true); // Webcam is now enabled
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isWebCamEnabled]);

  // for set Video Web Cam on CLick
  const toggleAudio = (enable, check) => {
    
    
    dispatch(setAudioControlHost(!enable));
    if (enable) {
      localStorage.setItem("isMicEnabled", true);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((audioStream) => {
          // Stop any existing audio tracks before starting a new one
          if (streamAudio) {
            streamAudio.getAudioTracks().forEach((track) => track.stop());
          }

          const newStream = new MediaStream([audioStream.getAudioTracks()[0]]);
          setStreamAudio(newStream);
          setIsMicEnabled(true);
        })
        .catch((error) => {
          alert("Error accessing microphone: " + error.message);
        });
    } else {
      localStorage.setItem("isMicEnabled", false);
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      setIsMicEnabled(false); // Microphone is now disabled
    }
  };
  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    // localStorage.setItem("enableVideo", !enable);
    dispatch(setVideoControlHost(!enable));

    if (enable) {
      localStorage.setItem("isWebCamEnabled", true);

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
          setIsWebCamEnabled(true);
        })
        .catch((error) => {
          alert("Error accessing webcam: " + error.message);
        });
    } else {
      localStorage.setItem("isWebCamEnabled", false);
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream from state
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the video source
        }
      }
      setIsWebCamEnabled(false); // Webcam is now disabled
    }
  };

  const joinNewApiVideoCallOnClick = () => {
    let data = {
      MeetingId: Number(meetingId),
      VideoCallURL: String(newVideoUrl),
      IsMuted: false,
      HideVideo: isWebCamEnabled,
    };
    dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
  };

  const onClickNormalToMaxHost = () => {
    dispatch(normalParticipantVideoCallPanel(false));
    dispatch(maxParticipantVideoCallPanel(true));
  };

  return (
    <Container fluid>
      <div className="normal-videoHost-panel">
        <Row>
          <Col lg={4} md={4} sm={12} className="d-flex justify-content-start">
            <p className="normal-videoHost-title-name">
              {participantMeetingTitle}
            </p>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div className="max-videohost-Icons-state">
              {isMicEnabledState ? (
                <img
                  src={MicOn2}
                  className="cursor-pointer"
                  onClick={() => toggleAudio(false, 2)}
                />
              ) : (
                <img
                  src={MicOff}
                  onClick={() => toggleAudio(true, 1)}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="max-videohost-Icons-state">
              {isWebCamEnabledState ? (
                <img src={VideoOn2} onClick={() => toggleVideo(false)} />
              ) : (
                <img src={VideoOff} onClick={() => toggleVideo(true)} />
              )}
            </div>
            <div className="max-videohost-Icons-state">
              <img src={MinimizeIcon} />
            </div>
            <div className="max-videohost-Icons-state">
              <img src={ExpandIcon} onClick={onClickNormalToMaxHost} />
            </div>
            <div className="max-videohost-Icons-state">
              <img src={EndCall} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={7} md={7} sm={12}>
            {
              <>
                <div
                  className="normal-Hostvideo-tag-name"
                  style={{
                    backgroundImage: `url(${ProfileUser})`,
                    backgroundSize: "33%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                  }}
                >
                  <div className="gradient-sheet">
                    <div className="avatar-class">
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <video ref={videoRef} className="video-Normal-host" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </Col>
          <Col lg={5} md={5} sm={12}>
            <div className="normal-videoHost-component">
              <>
                <p className="normal-videohost-ready-to-join">
                  {t("Ready-to-join")}
                </p>
                <Button
                  text={t("Join-now")}
                  className="normal-videoHost-Join-Now-Btn"
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

export default NormalHostVideoCallComponent;
