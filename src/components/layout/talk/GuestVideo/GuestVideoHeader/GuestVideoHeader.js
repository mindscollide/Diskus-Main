import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import ScreenShareEnabled from "../../../../../assets/images/Recent Activity Icons/Video/ScreenShareEnabled.png";
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";
import SpeakerView from "../../../../../assets/images/Recent Activity Icons/Video/SpeakerView.png";
import ParticipantSelected from "../../../../../assets/images/Recent Activity Icons/Video/ParticipantSelected.png";

import MicOn2 from "../../../../../assets/images/Recent Activity Icons/Video/MicOn2.png";
import VideoOn2 from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn2.png";
import Screenshare from "../../../../../assets/images/Recent Activity Icons/Video/Screenshare.png";
import RaiseHand from "../../../../../assets/images/Recent Activity Icons/Video/RaiseHand.png";
import TileView from "../../../../../assets/images/Recent Activity Icons/Video/TileView.png";
import Participant from "../../../../../assets/images/Recent Activity Icons/Video/Participant.png";
import EndCall from "../../../../../assets/images/Recent Activity Icons/Video/EndCall.png";
import "./GuestVideoHeader.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  guestLeaveMeetingVideoApi,
  muteUnMuteParticipantMainApi,
  muteUnMuteSelfMainApi,
  raiseUnRaisedHandMainApi,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";

const GuestVideoHeader = ({ extractMeetingTitle, roomId, videoUrlName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const frameRef = useRef(null);

  const joinGuestData = useSelector(
    (state) => state.GuestVideoReducer.joinGuestData
  );

  let guestName = sessionStorage.getItem("joinName");

  console.log(joinGuestData, "joinGuestDataguestGuidjoinGuestDataguestGuid");

  const [micOn, setMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [isSpeakerView, setIsSpeakerView] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const webcamStatus = sessionStorage.getItem("isWebCamEnabled");

  console.log(isVideoOn, "isVideoOnisVideoOn");

  // Fetch the webcam status from sessionStorage
  // const webcamStatus = sessionStorage.getItem("isWebCamEnabled") === "true";
  // console.log(webcamStatus, "webcamStatuswebcamStatus");

  // useEffect(() => {
  //   if (webcamStatus === false || webcamStatus === "false") {
  //     const iframe = frameRef.current;
  //     iframe.contentWindow.postMessage("VidOff", "*");
  //     setIsVideoOn(false);
  //   } else {
  //     setIsVideoOn(true);
  //   }
  //   console.log("Webcam status read from sessionStorage:", webcamStatus);
  // }, []);

  useEffect(() => {
    const iframe = frameRef.current;

    const handleIframeLoad = () => {
      setIsIframeLoaded(true); // Set the state when iframe is loaded
    };

    if (iframe) {
      // Listen for the iframe's load event
      iframe.addEventListener("load", handleIframeLoad);
    }

    // Clean up event listener on unmount
    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);

  useEffect(() => {
    const webcamStatus = sessionStorage.getItem("isWebCamEnabled");
    const iframe = frameRef.current;

    // Only send messages when the iframe is loaded
    if (isIframeLoaded && iframe && iframe.contentWindow) {
      console.log("Sending message...");

      if (webcamStatus === "false") {
        console.log("Turning webcam off");
        iframe.contentWindow.postMessage("VidOff", "*");
      } else {
        console.log("Turning webcam on");
        iframe.contentWindow.postMessage("VidOn", "*");
      }
    }
  }, [isIframeLoaded]);

  const openMicStatus = () => {
    const iframe = frameRef.current;
    iframe.contentWindow.postMessage("MicOff", "*");
    setMicOn(!micOn);
    sessionStorage.setItem("MicOff", !micOn);
    let data = {
      RoomID: String(roomId),
      IsMuted: micOn ? true : false,
      UID: String(joinGuestData.guestGuid),
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data));
  };

  // const openVideoStatus = () => {
  //   const iframe = frameRef.current;
  //   iframe.contentWindow.postMessage("VidOff", "*");
  //   setIsVideoOn(!isVideoOn);
  //   sessionStorage.setItem("VidOff", !isVideoOn);
  // };

  const openVideoStatus = (flag) => {
    const iframe = frameRef.current;

    // Send different messages depending on the state
    if (flag) {
      iframe.contentWindow.postMessage("VidOff", "*"); // Send "VidOff" message to turn video off
    } else {
      iframe.contentWindow.postMessage("VidOn", "*"); // Send "VidOn" message to turn video on
    }

    // Toggle the state
    setIsVideoOn(flag);

    // Persist the new video status to sessionStorage
    sessionStorage.setItem("isWebCamEnabled", flag);
  };

  const openScreenShare = () => {
    setIsScreenShare(!isScreenShare);
  };

  const openRaiseHand = () => {
    setIsRaiseHand(!isRaiseHand);
    let data = {
      RoomID: String(roomId),
      UID: String(joinGuestData.guestGuid),
      IsHandRaised: isRaiseHand ? true : false,
    };

    dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
  };

  const openSpeaker = () => {
    setIsSpeakerView(!isSpeakerView);
  };

  const openParticipant = () => {
    setIsParticipant(!isParticipant);
  };

  const onClickEndGuestVideo = () => {
    let data = {
      RoomID: String(roomId),
      UID: String(joinGuestData.guestGuid),
      Name: String(guestName),
    };
    dispatch(guestLeaveMeetingVideoApi(navigate, t, data));
  };

  return (
    <>
      <Row className="mt-4">
        <Col lg={5} md={5} sm={12}>
          <p className="title-header-name">{extractMeetingTitle}</p>
        </Col>

        <Col lg={7} md={7} sm={12} className="d-flex justify-content-end gap-2">
          <div className="Guest-Icons-state">
            {micOn ? (
              <img
                src={MicOff}
                onClick={openMicStatus}
                className="cursor-pointer"
              />
            ) : (
              <img
                src={MicOn2}
                onClick={openMicStatus}
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isVideoOn ? (
              <img src={VideoOff} onClick={() => openVideoStatus(false)} />
            ) : (
              <img src={VideoOn2} onClick={() => openVideoStatus(true)} />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isScreenShare ? (
              <img src={ScreenShareEnabled} onClick={openScreenShare} />
            ) : (
              <img src={Screenshare} onClick={openScreenShare} />
            )}
          </div>
          <div className="Guest-Icons-state">
            {isRaiseHand ? (
              <img src={Raisehandselected} onClick={openRaiseHand} />
            ) : (
              <img src={RaiseHand} onClick={openRaiseHand} />
            )}
          </div>

          <div className="Guest-Icons-state">
            {isSpeakerView ? (
              <img src={SpeakerView} onClick={openSpeaker} />
            ) : (
              <img src={TileView} onClick={openSpeaker} />
            )}
          </div>
          <div className="Guest-Icons-state-Participant">
            {isParticipant ? (
              <>
                <img src={ParticipantSelected} onClick={openParticipant} />
                <div className="New-List-Participants">
                  {/* Your additional div content here */}
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Sarah Thompson</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Michael Davis</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={7}
                      md={7}
                      sm={12}
                      className="d-flex justify-content-start"
                    >
                      <p>Emily Parkor</p>
                    </Col>
                    <Col
                      lg={5}
                      md={5}
                      sm={12}
                      className="d-flex justify-content-end"
                    >
                      <img src={RaiseHand} width="13px" height="16px" />
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <img src={Participant} onClick={openParticipant} />
            )}
          </div>
          <div className="Guest-Icons-state">
            <img src={EndCall} onClick={onClickEndGuestVideo} />
          </div>
        </Col>
      </Row>
      <div className="new-div">
        <iframe
          src={videoUrlName}
          ref={frameRef}
          title="Live Video"
          width="100%"
          height="100%"
          allow={"camera;microphone;display-capture"}
        />
      </div>
    </>
  );
};

export default GuestVideoHeader;
