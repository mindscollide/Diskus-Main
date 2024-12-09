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
  const [isNormalPanel, setIsNormalPanel] = useState(false);

  console.log(isWebCamEnabled, "isWebCamEnabled");

  useEffect(() => {
    // Enable webcam and microphone when isWebCamEnabled is true
    const enableWebCamAndMic = async () => {
      try {
        if (isWebCamEnabled) {
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

          localStorage.setItem("isWebCamEnabled", true);
          setStream(stream); // Store the video and audio stream

          // Handle microphone setup
          const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
          if (streamAudio) {
            // Stop any existing audio tracks
            streamAudio.getTracks().forEach((track) => track.stop());
          }
          localStorage.setItem("isMicEnabled", true);
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
  const toggleAudio = (enable, check) => {
    dispatch(setAudioControlForParticipant(enable));
    localStorage.setItem("isMicEnabled", enable);
    if (enable) {
      navigator.mediaDevices
        .getUserMedia({ audio: enable })
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
      localStorage.setItem("isMicEnabled", enable);
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      setIsMicEnabled(enable); // Microphone is now disabled
    }
  };

  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    dispatch(setVideoControlForParticipant(enable));
    localStorage.setItem("isWebCamEnabled", enable);
    if (enable) {
      navigator.mediaDevices
        .getUserMedia({ video: enable })
        .then((videoStream) => {
          // Stop any existing video tracks before starting a new one
          if (stream) {
            stream.getVideoTracks().forEach((track) => track.stop());
          }

          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.muted = enable;
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
    setIsNormalPanel((prevState) => !prevState);
    // dispatch(maxParticipantVideoCallPanel(false));
    // dispatch(normalParticipantVideoCallPanel(true));
  };

  const onClickEndVideoCall = () => {
    dispatch(maxParticipantVideoCallPanel(false));
  };

  return (
    <Container fluid>
      <div
        className={
          isNormalPanel
            ? "max-videoParticipantsvideo-panel"
            : "max-videoParticipant-panel"
        }
      >
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
                  dragable="false"
                  src={MicOn2}
                  className="cursor-pointer"
                  onClick={() => toggleAudio(false, 2)}
                  alt=""
                />
              ) : (
                <img
                  dragable="false"
                  src={MicOff}
                  onClick={() => toggleAudio(true, 1)}
                  className="cursor-pointer"
                  alt=""
                />
              )}
            </div>
            <div className="max-videoParticipant-Icons-state">
              {isWebCamEnabled ? (
                <img
                  dragable="false"
                  src={VideoOn2}
                  onClick={() => toggleVideo(false)}
                  alt=""
                />
              ) : (
                <img
                  dragable="false"
                  src={VideoOff}
                  onClick={() => toggleVideo(true)}
                  alt=""
                />
              )}
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img dragable="false" src={MinimizeIcon} alt="" />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                dragable="false"
                src={isNormalPanel ? ExpandIcon : NormalizeIcon}
                onClick={onClickToNormalParticipantPanel}
                alt=""
              />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                dragable="false"
                src={EndCall}
                onClick={onClickEndVideoCall}
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
                  className="max-videoParticipant-tag-name "
                  style={{
                    backgroundImage: `url(${ProfileUser})`,
                    backgroundSize: "33%",
                    backgroundRepeat: "no-repeat",
                    height: isNormalPanel ? "44vh" : "78vh",
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
                            isNormalPanel
                              ? "video-max-videoParticipantsvideo-panel"
                              : "video-max-Participant"
                          }
                        />
                      </div>
                    </div>

                    {/* <div className="mic-vid-buttons">
                      {isMicEnabled ? (
                        <img dragable="false"
                          src={MicOn}
                          className="cursor-pointer"
                          onClick={() => toggleAudio(false, 2)}
                        />
                      ) : (
                        <img dragable="false"
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
