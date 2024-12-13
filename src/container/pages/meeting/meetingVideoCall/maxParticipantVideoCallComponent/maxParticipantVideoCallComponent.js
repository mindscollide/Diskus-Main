import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import "./maxParticipantVideoCallComponent.css";
import { Button } from "../../../../../components/elements";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import NormalizeIcon from "../../../../../assets/images/Recent Activity Icons/Video/MinimizeIcon.png";

import {
  getParticipantMeetingJoinMainApi,
  maxParticipantVideoCallPanel,
  setAudioControlForParticipant,
  setVideoControlForParticipant,
} from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MeetingContext } from "../../../../../context/MeetingContext";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";

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

  const getJoinMeetingParticipantorHostrequest = useSelector(
    (state) => state.videoFeatureReducer.getJoinMeetingParticipantorHostrequest
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
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isNormalPanel, setIsNormalPanel] = useState(false);

  console.log(isWebCamEnabled, "isWebCamEnabled");

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
          console.log(videoRef.current, "streamstream");
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
          console.log(streamAudio, "streamstream");
          console.log(audioStream, "streamstream");
          console.log(stream, "streamstream");
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
        console.log(videoRef.current, "streamstream");
        videoRef.current.srcObject = null; // Clear the video source
      }

      // Stop video stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Stop audio stream
      if (streamAudio) {
        console.log(streamAudio, "streamstream");

        streamAudio.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isWebCamEnabled]);

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
          console.log(streamAudio, "streamstream");

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
      console.log(streamAudio, "streamstream");
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
    if (editorRole.role === "Participant") {
      localStorage.setItem("userRole", "Participant");
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
        setGetReady
      )
    );
    // setIsWaiting(true);
    // setGetReady(false);
  };

  const onClickToNormalParticipantPanel = () => {
    setIsNormalPanel((prevState) => !prevState);
    // dispatch(maxParticipantVideoCallPanel(false));
    // dispatch(normalParticipantVideoCallPanel(true));
  };

  const onClickEndVideoCall = async () => {
    console.log("onClickEndVideoCall", getJoinMeetingParticipantorHostrequest);
    let userGUID = getJoinMeetingParticipantorHostrequest
      ? getJoinMeetingParticipantorHostrequest.guid
      : 0;
    let roomID = getJoinMeetingParticipantorHostrequest
      ? getJoinMeetingParticipantorHostrequest.roomID
      : 0;
    let newName = localStorage.getItem("name");

    if (isWaiting) {
      let Data = {
        RoomID: roomID,
        UserGUID: userGUID,
        Name: String(newName),
      };
      await dispatch(LeaveMeetingVideo(Data, navigate, t));
      // Stop video stream

      dispatch(maxParticipantVideoCallPanel(false));
    } else {
      dispatch(maxParticipantVideoCallPanel(false));
    }
    if (stream) {
      stream.getVideoTracks().forEach((track) => track.stop());
      setStream(null); // Clear the stream from state
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }
      console.log(stream, "streamstream");
      sessionStorage.setItem("streamOnOff", JSON.stringify(false));
      sessionStorage.removeItem("videoStreamId");
    }

    // Stop audio stream
    if (streamAudio) {
      console.log(streamAudio, "streamstream");

      streamAudio.getAudioTracks().forEach((track) => track.stop());
      setStreamAudio(null); // Clear the stream from state
      sessionStorage.setItem("audioStreamOnOff", JSON.stringify(false));
    }
    sessionStorage.removeItem("audioStreamId");

    // Clear session storage related to participant
    sessionStorage.removeItem("participantData");
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
                  src={MicOff}
                  className="cursor-pointer"
                  onClick={() => toggleAudio(false)}
                  alt=""
                />
              ) : (
                <img
                  dragable="false"
                  src={MicOn2}
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
                  src={VideoOn2}
                  onClick={() => toggleVideo(true)}
                  alt=""
                />
              )}
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img dragable="false" src={MinimizeIcon} alt="MinimizeIcon" />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                dragable="false"
                src={isNormalPanel ? ExpandIcon : NormalizeIcon}
                onClick={onClickToNormalParticipantPanel}
                alt="ExpandIcon"
              />
            </div>
            <div className="max-videoParticipant-Icons-state">
              <img
                dragable="false"
                src={EndCall}
                onClick={onClickEndVideoCall}
                alt="EndCall"
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
