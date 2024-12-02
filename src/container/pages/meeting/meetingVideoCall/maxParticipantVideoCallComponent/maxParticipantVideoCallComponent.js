import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import "./maxParticipantVideoCallComponent.css";
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
  maxParticipantVideoCallPanel,
  normalHostVideoCallPanel,
  normalParticipantVideoCallPanel,
  setAudioControlForParticipant,
  setVideoControlForParticipant,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import NormalHostVideoCallComponent from "../normalHostVideoCallComponent/NormalHostVideoCallComponent";
import { useNavigate } from "react-router-dom";
import { MeetingContext } from "../../../../../context/MeetingContext";

const ParticipantVideoCallComponent = ({
  handleExpandToNormalPanelParticipant,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );
  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );

  const { editorRole } = useContext(MeetingContext);
  console.log(editorRole, "editorRoleeditorRoleeditorRole");

  let meetingId = localStorage.getItem("currentMeetingID");
  let newVideoUrl = localStorage.getItem("videoCallURL");

  let participantMeetingTitle = localStorage.getItem("meetingTitle");

  const videoRef = useRef(null);
  const [getReady, setGetReady] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  console.log(isWebCamEnabled, "isWebCamEnabled");

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
    console.log(enable, "updatedUrlupdatedUrlupdatedUrl");
    console.log(check, "updatedUrlupdatedUrlupdatedUrl");
    dispatch(setAudioControlForParticipant(!enable));
    // dispatch(setVoiceControleGuest(!enable));
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
    dispatch(setVideoControlForParticipant(!enable));
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
    if (editorRole.role === "Participant") {
      localStorage.setItem("userRole", "Participant");
    }
    let data = {
      MeetingId: Number(meetingId),
      VideoCallURL: String(newVideoUrl),
      IsMuted: !isMicEnabled,
      HideVideo: !isWebCamEnabled,
    };
    dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
    setIsWaiting(true);
    setGetReady(false);
  };

  const onClickToNormalParticipantPanel = () => {
    dispatch(maxParticipantVideoCallPanel(false));
    dispatch(normalParticipantVideoCallPanel(true));
  };

  const onClickEndVideoCall = () => {
    dispatch(maxParticipantVideoCallPanel(false));
  };

  return (
    <Container fluid>
      <div className="max-videoParticipant-panel">
        <Row>
          <Col lg={4} md={4} sm={12} className="d-flex justify-content-start">
            <p className="max-participant-title">{participantMeetingTitle}</p>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div className="max-videoParticipant-Icons-state">
              {isMicEnabled ? (
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
            <div className="max-videoParticipant-Icons-state">
              {isWebCamEnabled ? (
                <img src={VideoOn2} onClick={() => toggleVideo(false)} />
              ) : (
                <img src={VideoOff} onClick={() => toggleVideo(true)} />
              )}
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img src={MinimizeIcon} />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                src={NormalizeIcon}
                onClick={onClickToNormalParticipantPanel}
              />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img src={EndCall} onClick={onClickEndVideoCall} />
            </div>
          </Col>
        </Row>
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
                    height: "78vh",
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
                          className="video-max-Participant"
                        />
                      </div>
                    </div>

                    {/* <div className="mic-vid-buttons">
                      {isMicEnabled ? (
                        <img
                          src={MicOn}
                          className="cursor-pointer"
                          onClick={() => toggleAudio(false, 2)}
                        />
                      ) : (
                        <img
                          src={MicOff}
                          className="cursor-pointer"
                          onClick={() => toggleAudio(true, 1)}
                        />
                      )}
                    </div> */}
                  </div>
                </div>
              </>
            }
          </Col>
          <Col lg={4} md={4} sm={12}>
            {/* <div className="max-videoParticipant-component">
              <p className="max-Hostvideo-left-meeting-text">
                {t("You've-left-the-meeting")}
              </p>
              <p className="max-videoParticipant-left-meeting-rejoin-text">
                {t("Want-to-rejoin?-click-here-to-return-to-the-session")}
              </p>
              <Button
                text={t("Rejoin")}
                className="normal-videoHost-Join-Now-Btn"
              />
            </div> */}
            {/* <div className="max-videoParticipant-component">
              <p className="max-videoParticipant-waiting-room-class">
                {t("You-are-in-the-waiting-room")}
              </p>
              <p className="max-videoParticipant-organizer-allow-class">
                {t("The-organizer-will-allow-you-to-join-shortly")}
              </p>
            </div> */}
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
                      text={t("Join-now")}
                      className="max-videoParticipant-Join-Now-Btn"
                      onClick={joinNewApiVideoCallOnClick}
                    />
                  </>
                </div>
              </>
            ) : null}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ParticipantVideoCallComponent;
