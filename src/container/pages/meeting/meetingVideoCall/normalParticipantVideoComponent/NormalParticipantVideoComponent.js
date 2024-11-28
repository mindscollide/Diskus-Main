import React, { useRef, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../components/elements";
import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import ExpandIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Expand.svg";
import MinimizeIcon from "./../../../../../components/layout/talk/talk-Video/video-images/Minimize Purple.svg";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import { getParticipantMeetingJoinMainApi } from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./NormalParticipantVideoComponent.css";

const NormalParticipantVideoComponent = ({ handleExpandToParticipantMax }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let meetingId = localStorage.getItem("currentMeetingID");
  let newVideoUrl = localStorage.getItem("videoCallURL");
  let participantMeetingTitle = localStorage.getItem("meetingTitle");

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(true);

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

  const joinNewApiVideoCallOnClick = () => {
    let data = {
      MeetingId: Number(meetingId),
      VideoCallURL: String(newVideoUrl),
      IsMuted: false,
      HideVideo: isWebCamEnabled,
    };
    dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
  };
  return (
    <Container fluid>
      <div className="normal-videoParticipant-panel">
        <Row>
          <Col lg={4} md={4} sm={12} className="d-flex justify-content-start">
            <p className="normal-participant-title">
              {participantMeetingTitle}
            </p>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={12}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <div className="normal-videoParticipant-Icons-state">
              {/* {micOn ? ( */}
              <img src={MicOn2} className="cursor-pointer" />
              {/* ) : (
                <img
                  src={MicOn2}
                  onClick={() => openMicStatus(true)}
                  className="cursor-pointer"
                />
              )} */}
            </div>
            <div className="normal-videoParticipant-Icons-state">
              {/* {isVideoOn ? ( */}
              <img src={VideoOn2} />
              {/* ) : (
                <img src={VideoOn2} onClick={() => openVideoStatus(true)} />
              )} */}
            </div>
            <div className="normal-videoParticipant-Icons-state">
              <img src={MinimizeIcon} />
            </div>
            <div className="normal-videoParticipant-Icons-state">
              <img src={ExpandIcon} onClick={handleExpandToParticipantMax} />
            </div>
            <div className="normal-videoParticipant-Icons-state">
              <img src={EndCall} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={7} md={7} sm={12}>
            {
              <>
                <div
                  className="normal-videoParticipant-tag-name"
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
                        <video
                          ref={videoRef}
                          className="video-normal-videoParticipant"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          </Col>
          <Col lg={5} md={5} sm={12}>
            {/* <div className="normal-videoParticipant-component">
              <p className="normal-videoHost-left-meeting-text">
                {t("You've-left-the-meeting")}
              </p>
              <p className="normal-videoHost-left-meeting-rejoin-text">
                {t("Want-to-rejoin?-click-here-to-return-to-the-session")}
              </p>
              <Button
                text={t("Rejoin")}
                className="normal-videoParticipant-Join-Now-Btn"
              />
            </div> */}
            {/* <div className="normal-videoParticipant-component">
              <p className="normal-videoHost-waiting-room-class">
                {t("You-are-in-the-waiting-room")}
              </p>
              <p className="normal-videoHost-organizer-allow-class">
                {t("The-organizer-will-allow-you-to-join-shortly")}
              </p>
            </div> */}
            <div className="normal-videoParticipant-component">
              <>
                <p className="normal-videoParticipant-ready-to-join">
                  {t("Ready-to-join")}
                </p>
                <Button
                  text={t("Join-now")}
                  className="normal-videoParticipant-Join-Now-Btn"
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

export default NormalParticipantVideoComponent;
