import React, { useState, useRef, useEffect } from "react";
import "./GuestJoinVideo.css";
import { Row, Col, Container } from "react-bootstrap";
import { Button, TextField } from "../../../../elements";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import MicOn from "../../../../../assets/images/Recent Activity Icons/Video/MicOn.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  joinGuestVideoMainApi,
  setVideoCameraGuest,
  setVoiceControleGuest,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";

const GuestJoinVideo = ({
  extractMeetingId,
  extractMeetingTitle,
  onJoinNameChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const guestVideoNavigationData = useSelector(
    (state) => state.GuestVideoReducer.guestVideoNavigationData
  );
  console.log(guestVideoNavigationData, "guestVideoNavigationData");
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [getReady, setGetReady] = useState(false);

  const [joinName, setJoinName] = useState("");

  const [errorMessage, setErrorMessage] = useState(false);

  console.log({ extractMeetingId, extractMeetingTitle }, "namenamenamename");

  // for set Video Web Cam on CLick
  const toggleAudio = (enable, check) => {
    console.log(enable, "updatedUrlupdatedUrlupdatedUrl");
    console.log(check, "updatedUrlupdatedUrlupdatedUrl");
    dispatch(setVoiceControleGuest(!enable));
    if (enable) {
      sessionStorage.setItem("isMicEnabled", true);

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
      sessionStorage.setItem("isMicEnabled", false);
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      setIsMicEnabled(false); // Microphone is now disabled
    }
  };

  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    console.log(enable, "updatedUrlupdatedUrlupdatedUrl");
    sessionStorage.setItem("enableVideo", !enable);
    dispatch(setVideoCameraGuest(!enable));

    if (enable) {
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
      sessionStorage.setItem("isWebCamEnabled", false);
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

  const handleNameChange = (e) => {
    setJoinName(e.target.value);
    setErrorMessage(false);
  };

  const onJoinNowButton = () => {
    if (joinName === "") {
      setErrorMessage(true);
    } else {
      setErrorMessage(false);
      setGetReady(true);
      onJoinNameChange(joinName);
      sessionStorage.setItem("joinName", joinName);
      let data = {
        MeetingId: extractMeetingId,
        GuestName: joinName,
        IsMuted: !isMicEnabled,
        HideVideo: !isWebCamEnabled,
      };
      dispatch(joinGuestVideoMainApi(navigate, t, data));
    }
  };

  // useEffect(() => {
  //   const savedName = sessionStorage.getItem("joinName");
  //   if (savedName) {
  //     setJoinName(savedName); // Set the saved name to display in the text field
  //   }
  //   console.log(savedName, "savedatdadadad");
  // }, []);

  useEffect(() => {
    // Automatically enable the webcam on initial load
    if (isWebCamEnabled) {
      const mediaDevices = navigator.mediaDevices;

      mediaDevices
        .getUserMedia({
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

  return (
    <Container fluid>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {
            <>
              <div className="guest-join-video-main">
                <Container>
                  <Row>
                    <label className="name-label">
                      {t("Name")}
                      <span className="aesterick-name">*</span>
                    </label>
                    <Col lg={5} md={5} sm={12}>
                      <TextField
                        name={"joinName"}
                        value={joinName}
                        change={handleNameChange}
                        labelclass="d-none"
                        placeholder={"Enter your name"}
                      />
                      <span>
                        <p className="name-field-error">
                          {errorMessage ? "Please enter your name" : null}
                        </p>
                      </span>

                      <div
                        className="video-tag-name"
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
                              <video ref={videoRef} className="video-size" />
                            </div>
                          </div>

                          <div className="mic-vid-buttons">
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

                            {isWebCamEnabled ? (
                              <img
                                className="cursor-pointer"
                                onClick={() => toggleVideo(false)}
                                src={VideoOn}
                              />
                            ) : (
                              <img
                                className="cursor-pointer"
                                onClick={() => toggleVideo(true)}
                                src={VideoOff}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col lg={7} md={7} sm={12}>
                      <div className="guest-video-inside-component">
                        {!getReady ? (
                          <>
                            <p className="ready-to-join">
                              {t("Ready-to-join")}
                            </p>
                            <Button
                              text="Join Now"
                              className="Join-Now-Btn"
                              onClick={onJoinNowButton}
                            />
                          </>
                        ) : (
                          <>
                            <div className="waiting-text-animation">
                              <p className="waiting-room-class">
                                {t("You-are-in-the-waiting-room")}
                              </p>
                              <p className="organizer-allow-class">
                                {t(
                                  "The-organizer-will-allow-you-to-join-shortly"
                                )}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default GuestJoinVideo;
