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
  getVideoCallParticipantsGuestMainApi,
  guestLeaveMeetingVideoApi,
  hideUnhideSelfMainApi,
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

  const guestMuteUnMuteData = useSelector(
    (state) => state.GuestVideoReducer.muteUmMuteByHost
  );

  const guesthideunHideByHostData = useSelector(
    (state) => state.GuestVideoReducer.hideunHideByHost
  );
  console.log(guesthideunHideByHostData, "guesthideunHideByHostData");

  const raiseUnRaisedGuestorParticipant = useSelector(
    (state) => state.GuestVideoReducer.raiseUnRaisedParticipantorGuest
  );

  const hideUnHideParticpantorGuest = useSelector(
    (state) => state.GuestVideoReducer.hideUnHideParticpantorGuest
  );

  const muteUnMuteParticpantorGuest = useSelector(
    (state) => state.GuestVideoReducer.muteUnMuteParticpantorGuest
  );

  console.log(hideUnHideParticpantorGuest, "hideUnHideParticpantorGuest123");

  const getAllParticipantGuest = useSelector(
    (state) => state.GuestVideoReducer.getAllParticipantGuest
  );

  console.log(getAllParticipantGuest, "hideUnHideParticpantorGuest123");

  const videoCameraGuest = useSelector(
    (state) => state.GuestVideoReducer.videoCameraGuest
  );

  const voiceControle = useSelector(
    (state) => state.GuestVideoReducer.voiceControle
  );

  console.log(voiceControle, "voiceControlevoiceControle");

  let guestName = sessionStorage.getItem("guestName");
  let guestUID = sessionStorage.getItem("GuestUserID");

  const [micOn, setMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [isSpeakerView, setIsSpeakerView] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [showTile, setShowTile] = useState(false);

  const [allParticipantGuest, setAllParticipantGuest] = useState([]);
  console.log(allParticipantGuest, "allParticipantGuest");

  console.log(isRaiseHand, "isRaiseHandisRaiseHand");

  const webcamStatus = sessionStorage.getItem("isWebCamEnabled");

  console.log({ micOn, isVideoOn }, "isVideoOnisVideoOn");

  useEffect(() => {
    let getRoomId = sessionStorage.getItem("roomId");
    let Data = {
      RoomID: String(getRoomId),
    };
    dispatch(getVideoCallParticipantsGuestMainApi(Data, navigate, t));
  }, []);

  useEffect(() => {
    if (
      getAllParticipantGuest !== null &&
      getAllParticipantGuest !== undefined &&
      getAllParticipantGuest.participantList.length > 0
    ) {
      setAllParticipantGuest(getAllParticipantGuest.participantList);
    } else {
      setAllParticipantGuest([]);
    }
  }, [getAllParticipantGuest]);

  useEffect(() => {
    if (guestMuteUnMuteData !== null && guestUID === guestMuteUnMuteData.uid) {
      const iframe = frameRef.current;
      if (iframe.contentWindow !== null) {
        if (guestMuteUnMuteData.isMuted === true) {
          iframe.contentWindow.postMessage("MicOff", "*");
          console.log("isVideoOnisVideoOn");

          setMicOn(true);
        } else {
          iframe.contentWindow.postMessage("MicOn", "*");
          console.log("isVideoOnisVideoOn");

          setMicOn(false);
        }
      }
    }
  }, [guestMuteUnMuteData]);

  useEffect(() => {
    if (
      guesthideunHideByHostData !== null &&
      guestUID === guesthideunHideByHostData.uid
    ) {
      const iframe = frameRef.current;
      if (iframe.contentWindow !== null) {
        if (guesthideunHideByHostData.isVideoHidden === true) {
          iframe.contentWindow.postMessage("VidOff", "*");
          console.log("isVideoOnisVideoOn");

          setIsVideoOn(true);
        } else {
          iframe.contentWindow.postMessage("VidOn", "*");
          console.log("isVideoOnisVideoOn");

          setIsVideoOn(false);
        }
      }
    }
  }, [guesthideunHideByHostData]);

  useEffect(() => {
    const iframe = frameRef.current;
    if (iframe.contentWindow !== null) {
      console.log("Sending message...");
      if (videoCameraGuest) {
        iframe.contentWindow.postMessage("VidOff", "*");
        console.log("isVideoOnisVideoOn");
        setIsVideoOn(true);
      } else {
        iframe.contentWindow.postMessage("VidOn", "*");
        console.log("isVideoOnisVideoOn");

        setIsVideoOn(false);
      }
    }
    console.log("Webcam status read from sessionStorage:", webcamStatus);
  }, []);

  useEffect(() => {
    const iframe = frameRef.current;
    if (iframe.contentWindow !== null) {
      console.log("Sending message...");
      setMicOn(voiceControle);
      if (voiceControle) {
        iframe.contentWindow.postMessage("MicOff", "*");
        console.log("isVideoOnisVideoOn");
      } else {
        iframe.contentWindow.postMessage("MicOn", "*");
        console.log("isVideoOnisVideoOn");
      }
    }
    console.log("Webcam status read from sessionStorage:", webcamStatus);
  }, []);

  const openMicStatus = (flag) => {
    const iframe = frameRef.current;
    if (flag) {
      iframe.contentWindow.postMessage("MicOn", "*");
    } else {
      iframe.contentWindow.postMessage("MicOff", "*");
    }
    setMicOn(flag);
    sessionStorage.setItem("MicOff", flag);
    let data = {
      RoomID: String(roomId),
      IsMuted: flag,
      UID: String(joinGuestData.guestGuid),
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data));
  };

  const openVideoStatus = (flag) => {
    const iframe = frameRef.current;

    // Send different messages depending on the state
    if (flag) {
      iframe.contentWindow.postMessage("VidOff", "*"); // Send "VidOff" message to turn video off
    } else {
      iframe.contentWindow.postMessage("VidOn", "*"); // Send "VidOn" message to turn video on
    }

    let data = {
      RoomID: String(roomId),
      HideVideo: flag,
      UID: String(joinGuestData.guestGuid),
    };
    dispatch(hideUnhideSelfMainApi(navigate, t, data));

    // Toggle the state
    setIsVideoOn(flag);

    // Persist the new video status to sessionStorage
    sessionStorage.setItem("enableVideo", flag);
  };

  const openScreenShare = () => {
    const iframe = frameRef.current;
    if (iframe) {
      iframe.contentWindow.postMessage("ScreenShare", "*");
      setIsScreenShare(!isScreenShare);
    }
  };

  const openRaiseHand = (flag) => {
    setIsRaiseHand(flag);
    let data = {
      RoomID: String(roomId),
      UID: String(joinGuestData.guestGuid),
      IsHandRaised: flag,
    };

    dispatch(raiseUnRaisedHandMainApi(navigate, t, data));
  };

  const openSpeaker = () => {
    const iframe = frameRef.current;
    if (showTile) {
      iframe.contentWindow.postMessage("TileView", "*");
      setIsSpeakerView(!isSpeakerView);
      sessionStorage.setItem("TileView", !isSpeakerView);
      setShowTile(false);
    } else {
      iframe.contentWindow.postMessage("SidebarView", "*");
      setIsSpeakerView(!isSpeakerView);
      sessionStorage.setItem("SidebarView", !isSpeakerView);
      setShowTile(true);
    }
  };

  const openParticipant = () => {
    setIsParticipant(!isParticipant);
  };

  const onClickEndGuestVideo = () => {
    setIsVideoOn(false);
    setMicOn(false);
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
                onClick={() => openMicStatus(false)}
                className="cursor-pointer"
              />
            ) : (
              <img
                src={MicOn2}
                onClick={() => openMicStatus(true)}
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
            {/* <img src={ScreenShareEnabled} onClick={openScreenShare} /> */}
            <img src={Screenshare} onClick={openScreenShare} />
          </div>
          <div className="Guest-Icons-state">
            {isRaiseHand ? (
              <img
                src={Raisehandselected}
                onClick={() => openRaiseHand(false)}
              />
            ) : (
              <img src={RaiseHand} onClick={() => openRaiseHand(true)} />
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
                  {allParticipantGuest.length > 0 &&
                    allParticipantGuest.map((participant, index) => {
                      // for raising hand show on specific participant
                      const isHandRaisedForParticipant =
                        raiseUnRaisedGuestorParticipant?.participantGuid ===
                          participant.guid &&
                        raiseUnRaisedGuestorParticipant?.isHandRaised;

                      // for show video on specific particpant
                      const isVideoOff =
                        hideUnHideParticpantorGuest?.uid === participant.guid &&
                        hideUnHideParticpantorGuest?.isVideoHidden;

                      // for show Mute on specific particpant

                      const muteParticipants =
                        muteUnMuteParticpantorGuest?.uid === participant.guid &&
                        muteUnMuteParticpantorGuest?.isMuted &&
                        micOn;

                      console.log(
                        participant,
                        "participantparticipantparticipant"
                      );
                      return (
                        <>
                          <Row key={participant.guid}>
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className="d-flex justify-content-start"
                            >
                              <p>{participant.name}</p>{" "}
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className="d-flex justify-content-end gap-2"
                            >
                              {isVideoOff && (
                                <img
                                  src={VideoOff}
                                  width="20px"
                                  height="20px"
                                  alt="Video Off"
                                />
                              )}
                              {muteParticipants && (
                                <img
                                  src={MicOff}
                                  width="20px"
                                  height="20px"
                                  alt="Mic Mute"
                                />
                              )}
                              {isHandRaisedForParticipant && (
                                <img
                                  src={Raisehandselected}
                                  width="20px"
                                  height="20px"
                                  alt="raise hand"
                                />
                              )}
                            </Col>
                          </Row>
                        </>
                      );
                    })}
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
