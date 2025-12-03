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
import { Tooltip } from "antd";
import {
  getVideoCallParticipantsGuestMainApi,
  guestLeaveMeetingVideoApi,
  hideUnhideSelfMainApi,
  muteUnMuteParticipantMainApi,
  muteUnMuteParticipantsorGuestbyHost,
  muteUnMuteSelfMainApi,
  raiseUnRaisedHandMainApi,
  setVoiceControleGuestForAllbyHost,
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
  

  const raiseUnRaisedGuestorParticipant = useSelector(
    (state) => state.GuestVideoReducer.raiseUnRaisedParticipantorGuest
  );

  const hideUnHideParticpantorGuest = useSelector(
    (state) => state.GuestVideoReducer.hideUnHideParticpantorGuest
  );

  const muteUnMuteParticpantorGuest = useSelector(
    (state) => state.GuestVideoReducer.muteUnMuteParticpantorGuest
  );
  const muteUnMuteParticpantorGuestByHost = useSelector(
    (state) => state.GuestVideoReducer.muteUnMuteParticpantorGuestByHost
  );

  

  const getAllParticipantGuest = useSelector(
    (state) => state.GuestVideoReducer.getAllParticipantGuest
  );

  

  const videoCameraGuest = useSelector(
    (state) => state.GuestVideoReducer.videoCameraGuest
  );

  const voiceControle = useSelector(
    (state) => state.GuestVideoReducer.voiceControle
  );
  const voiceControleForAllByHostFlag = useSelector(
    (state) => state.GuestVideoReducer.voiceControleForAllByHostFlag
  );

  

  let guestName = sessionStorage.getItem("guestName");
  let guestUID = sessionStorage.getItem("GuestUserID");
  let MeetingId = Number(sessionStorage.getItem("MeetingId"));

  const [micOn, setMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [isSpeakerView, setIsSpeakerView] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [showTile, setShowTile] = useState(false);

  // this is for Participant list for video state when Multiple user VidOff and On
  const [participantStatusMap, setParticipantStatusMap] = useState({});

  const [allParticipantGuest, setAllParticipantGuest] = useState([]);
  
  

  

  const webcamStatus = sessionStorage.getItem("isWebCamEnabled");

  let isZoomEnabled =
    sessionStorage.getItem("isZoomEnabled") !== null &&
    sessionStorage.getItem("isZoomEnabled");

  

  useEffect(() => {
    let getRoomId = sessionStorage.getItem("roomId");
    let Data = {
      RoomID: String(getRoomId),
    };
    dispatch(getVideoCallParticipantsGuestMainApi(Data, navigate, t));
    if (videoCameraGuest) {
      setIsVideoOn(true);
    } else {
      setIsVideoOn(false);
    }
    if (voiceControle) {
      setMicOn(true);
    } else {
      setMicOn(false);
    }
  }, []);

  useEffect(() => {
    if (
      getAllParticipantGuest !== null &&
      getAllParticipantGuest !== undefined &&
      getAllParticipantGuest?.length > 0
    ) {
      setAllParticipantGuest(getAllParticipantGuest);
    } else {
      setAllParticipantGuest([]);
    }
  }, [getAllParticipantGuest]);
  

  useEffect(() => {
    if (
      guestMuteUnMuteData &&
      guestMuteUnMuteData.isForAll &&
      guestMuteUnMuteData.isMuted !== undefined
    ) {
      const iframe = frameRef.current;
      if (iframe.contentWindow) {
        // Update the microphone state based on host's action
        if (guestMuteUnMuteData.isMuted) {
          
          iframe.contentWindow.postMessage("MicOff", "*");
          setMicOn(true); // Mic is off (muted)
        } else {
          
          iframe.contentWindow.postMessage("MicOn", "*");
          setMicOn(false); // Mic is on (unmuted)
        }
      }
    }
  }, [guestMuteUnMuteData]);

  // for only single Mute
  useEffect(() => {
    if (guestMuteUnMuteData !== null && guestUID === guestMuteUnMuteData.uid) {
      const iframe = frameRef.current;
      if (iframe.contentWindow !== null) {
        if (guestMuteUnMuteData.isMuted === true) {
          
          iframe.contentWindow.postMessage("MicOff", "*");
          

          setMicOn(true);
        } else {
          
          iframe.contentWindow.postMessage("MicOn", "*");
          

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
      if (isZoomEnabled) {
        if (iframe.contentWindow !== null) {
          if (guesthideunHideByHostData.isVideoHidden === true) {
            iframe.contentWindow.postMessage("VidOn", "*");
            

            setIsVideoOn(true);
          } else {
            iframe.contentWindow.postMessage("VidOff", "*");
            

            setIsVideoOn(false);
          }
        }
      } else {
        if (iframe.contentWindow !== null) {
          if (guesthideunHideByHostData.isVideoHidden === true) {
            iframe.contentWindow.postMessage("VidOff", "*");
            

            setIsVideoOn(true);
          } else {
            iframe.contentWindow.postMessage("VidOn", "*");
            

            setIsVideoOn(false);
          }
        }
      }
    }
  }, [guesthideunHideByHostData]);

  useEffect(() => {
    if (muteUnMuteParticpantorGuestByHost) {
      
      if (muteUnMuteParticpantorGuest?.uid === guestUID) {
        const iframe = frameRef.current;
        if (muteUnMuteParticpantorGuest.isMuted) {
          
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          iframe.contentWindow.postMessage("MicOff", "*");
        }
        setMicOn(muteUnMuteParticpantorGuest.isMuted);
        
        sessionStorage.setItem("MicOff", muteUnMuteParticpantorGuest.isMuted);
      }
      dispatch(muteUnMuteParticipantsorGuestbyHost(false));
    }
  }, [muteUnMuteParticpantorGuestByHost]);

  // For All Mute
  useEffect(() => {
    if (voiceControleForAllByHostFlag) {
      
      // if (muteUnMuteParticpantorGuest?.uid === guestUID) {
      const iframe = frameRef.current;
      if (voiceControleForAllByHostFlag) {
        
        iframe.contentWindow.postMessage("MicOn", "*");
      } else {
        
        iframe.contentWindow.postMessage("MicOff", "*");
      }
      setMicOn(voiceControleForAllByHostFlag);
      sessionStorage.setItem("MicOff", voiceControleForAllByHostFlag);
      // }
      dispatch(setVoiceControleGuestForAllbyHost(false, false));
    }
  }, [voiceControleForAllByHostFlag]);

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
      MeetingID: MeetingId,
    };
    // Dispatch the API call with the structured request data
    dispatch(muteUnMuteSelfMainApi(navigate, t, data));
  };

  const openVideoStatus = (flag) => {
    const iframe = frameRef.current;

    // Send different messages depending on the state
    if (isZoomEnabled) {
      if (flag) {
        iframe.contentWindow.postMessage("VidOn", "*"); // Send "VidOff" message to turn video off
      } else {
        
        iframe.contentWindow.postMessage("VidOff", "*"); // Send "VidOn" message to turn video on
      }
    } else {
      if (flag) {
        iframe.contentWindow.postMessage("VidOff", "*"); // Send "VidOff" message to turn video off
      } else {
        
        iframe.contentWindow.postMessage("VidOn", "*"); // Send "VidOn" message to turn video on
      }
    }

    let data = {
      RoomID: String(roomId),
      HideVideo: flag,
      UID: String(joinGuestData.guestGuid),
      MeetingID: MeetingId,
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
      MeetingID: MeetingId,
    };
    dispatch(guestLeaveMeetingVideoApi(navigate, t, data));
  };

  useEffect(() => {
    if (muteUnMuteParticpantorGuest?.uid) {
      setParticipantStatusMap((prev) => ({
        ...prev,
        [muteUnMuteParticpantorGuest.uid]: {
          ...prev[muteUnMuteParticpantorGuest.uid],
          isMuted: muteUnMuteParticpantorGuest.isMuted,
        },
      }));
    }
  }, [muteUnMuteParticpantorGuest]);

  useEffect(() => {
    if (hideUnHideParticpantorGuest?.uid) {
      setParticipantStatusMap((prev) => ({
        ...prev,
        [hideUnHideParticpantorGuest.uid]: {
          ...prev[hideUnHideParticpantorGuest.uid],
          isVideoHidden: hideUnHideParticpantorGuest.isVideoHidden,
        },
      }));
    }
  }, [hideUnHideParticpantorGuest]);

  useEffect(() => {
    if (raiseUnRaisedGuestorParticipant?.participantGuid) {
      setParticipantStatusMap((prev) => ({
        ...prev,
        [raiseUnRaisedGuestorParticipant.participantGuid]: {
          ...prev[raiseUnRaisedGuestorParticipant.participantGuid],
          isHandRaised: raiseUnRaisedGuestorParticipant.isHandRaised,
        },
      }));
    }
  }, [raiseUnRaisedGuestorParticipant]);

  return (
    <>
      <Row className="mt-4">
        <Col lg={5} md={5} sm={12}>
          <p className="title-header-name">{extractMeetingTitle}</p>
        </Col>

        <Col lg={7} md={7} sm={12} className="d-flex justify-content-end gap-2">
          <div className="Guest-Icons-state">
            {micOn ? (
              <Tooltip placement="topRight" title={t("Enable-mic")}>
                <img
                  src={MicOff}
                  onClick={() => openMicStatus(false)}
                  className="cursor-pointer"
                  alt="MicOff"
                />
              </Tooltip>
            ) : (
              <Tooltip placement="topRight" title={t("Disable-mic")}>
                <img
                  src={MicOn2}
                  onClick={() => openMicStatus(true)}
                  className="cursor-pointer"
                  alt="MicOn2"
                />
              </Tooltip>
            )}
          </div>
          <div className="Guest-Icons-state">
            {isVideoOn ? (
              <Tooltip placement="topRight" title={t("Enable-video")}>
                <img
                  src={VideoOff}
                  onClick={() => openVideoStatus(false)}
                  alt="VideoOff"
                />
              </Tooltip>
            ) : (
              <Tooltip placement="topRight" title={t("Disable-video")}>
                <img
                  src={VideoOn2}
                  onClick={() => openVideoStatus(true)}
                  alt="VideoOn2"
                />
              </Tooltip>
            )}
          </div>
          <div className="Guest-Icons-state">
            {/* <img src={ScreenShareEnabled} onClick={openScreenShare} /> */}
            <Tooltip
              placement="topRight"
              title={isScreenShare ? t("Stop-sharing") : t("Screen-share")}
            >
              <img
                src={Screenshare}
                onClick={openScreenShare}
                alt="Screenshare"
              />
            </Tooltip>
          </div>
          <div className="Guest-Icons-state">
            {isRaiseHand ? (
              <Tooltip placement="topRight" title={t("Lower-hand")}>
                <img
                  src={Raisehandselected}
                  onClick={() => openRaiseHand(false)}
                  alt="Raisehandselected"
                />
              </Tooltip>
            ) : (
              <Tooltip placement="topRight" title={t("Raise-hand")}>
                <img
                  src={RaiseHand}
                  onClick={() => openRaiseHand(true)}
                  alt="RaiseHand"
                />
              </Tooltip>
            )}
          </div>

          <div className="Guest-Icons-state">
            {isSpeakerView ? (
              <>
                <Tooltip placement="topRight" title={t("Layout")}>
                  <img
                    src={SpeakerView}
                    onClick={openSpeaker}
                    alt="SpeakerView"
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip placement="topRight" title={t("Layout")}>
                  <img src={TileView} onClick={openSpeaker} alt="TileView" />
                </Tooltip>
              </>
            )}
          </div>
          <div className="Guest-Icons-state-Participant">
            {isParticipant ? (
              <>
                <Tooltip placement="topRight" title={t("Participants")}>
                  <img
                    src={ParticipantSelected}
                    onClick={openParticipant}
                    alt="ParticipantSelected"
                  />
                </Tooltip>
                <div className="New-List-Participants">
                  {allParticipantGuest.length > 0 &&
                    allParticipantGuest.map((participant, index) => {
                      
                      
                      

                      // for raising hand show on specific participant
                      const participantStatus =
                        participantStatusMap[participant.guid] || {};

                      const isHandRaisedForParticipant =
                        participantStatus.isHandRaised;
                      const isVideoOff = participantStatus.isVideoHidden;
                      const muteParticipants = participantStatus.isMuted;
                      
                      return (
                        <>
                          <Row key={participant.guid}>
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className="d-flex justify-content-start"
                            >
                              <p className="guest-Video-Participants">
                                {participant.name}
                              </p>{" "}
                              <span className="isHost-class">
                                {participant.isHost && <>{t("(Host)")}</>}
                              </span>
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
              <Tooltip placement="topRight" title={t("Participants")}>
                <img
                  src={Participant}
                  onClick={openParticipant}
                  alt="Participant"
                />
              </Tooltip>
            )}
          </div>
          <div className="Guest-Icons-state">
            <Tooltip placement="topRight" title={t("End-call")}>
              <img src={EndCall} onClick={onClickEndGuestVideo} alt="EndCall" />
            </Tooltip>
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
