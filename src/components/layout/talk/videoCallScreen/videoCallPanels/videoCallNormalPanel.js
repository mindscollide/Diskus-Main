import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./videoCallNormalPanel.css";
import VideoCallNormalHeader from "../videoCallHeader/videoCallNormalHeader";
import VideoPanelNormalAgenda from "./videoCallNormalAgenda";
import VideoPanelNormalMinutesMeeting from "./videoCallNormalMinutesMeeting";
import { LoaderPanelVideoScreen } from "../../../../elements";
import {
  endIndexUrl,
  extractedUrl,
  generateURLCaller,
  generateURLParticipant,
} from "../../../../../commen/functions/urlVideoCalls";
import VideoOutgoing from "../videoCallBody/VideoMaxOutgoing";
import VideoCallParticipants from "../videocallParticipants/VideoCallParticipants";
import { useTranslation } from "react-i18next";
import VideoNewParticipantList from "../videoNewParticipantList/VideoNewParticipantList";

const VideoPanelNormal = () => {
  const dispatch = useDispatch();

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  let currentUserID = Number(localStorage.getItem("userID"));
  const { t } = useTranslation();

  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
  let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
  localStorage.setItem("VideoView", "Sidebar");
  let callAcceptedRecipientID = Number(
    localStorage.getItem("acceptedRecipientID")
  );
  let currentUserName = localStorage.getItem("name");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  const [callerURL, setCallerURL] = useState("");
  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);

  useEffect(() => {
    try {
      let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
      const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller);
      const extractedBaseURLCaller = extractedUrl(
        dynamicBaseURLCaller,
        endIndexBaseURLCaller
      );
      setCallerURL(
        generateURLCaller(
          extractedBaseURLCaller,
          currentUserName,
          initiateCallRoomID
        )
      );
    } catch {}
  }, [initiateCallRoomID]);

  useEffect(() => {
    try {
      let dynamicBaseURLCaller = localStorage.getItem(
        "videoBaseURLParticipant"
      );
      const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller);
      const extractedBaseURLCaller = extractedUrl(
        dynamicBaseURLCaller,
        endIndexBaseURLCaller
      );
      // let randomGuestName = generateRandomGuest();
      if (isMeeting === false) {
        setParticipantURL(
          generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID
          )
        );
      } else if (isMeeting === true) {
        setParticipantURL(
          generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID
          )
        );
      }
    } catch {}
  }, [callAcceptedRoomID]);

  // Create a ref for the iframe element
  const iframeRef = useRef(null);

  // Function to trigger the action in the iframe
  const handleScreenShareButton = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      const iframe = iframeRef.current;

      if (iframe) {
        iframe.contentWindow.postMessage("ScreenShare", "*");
        setIsScreenActive(!isScreenActive);
      }
    }
  };

  const layoutCurrentChange = () => {
    let videoView = localStorage.getItem("VideoView");
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      const iframe = iframeRef.current;

      if (iframe && videoView === "Sidebar") {
        iframe.contentWindow.postMessage("TileView", "*");
        localStorage.setItem("VideoView", "TileView");
        setShowTile(true);
      } else if (iframe && videoView === "TileView") {
        iframe.contentWindow.postMessage("SidebarView", "*");
        localStorage.setItem("VideoView", "Sidebar");
        setShowTile(false);
      }
    }
  };

  const disableMicFunction = () => {
    const iframe = iframeRef.current;
    iframe.contentWindow.postMessage("MicOff", "*");
    setIsMicActive(!isMicActive);
    localStorage.setItem("MicOff", !isMicActive);
  };

  const disableVideoFunction = () => {
    const iframe = iframeRef.current;
    iframe.contentWindow.postMessage("VidOff", "*");
    setIsVideoActive(!isVideoActive);
    localStorage.setItem("VidOff", !isVideoActive);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (micStatus !== isMicActive) {
        console.log("Mic Check");
        iframe.contentWindow.postMessage("MicOff", "*");
        setIsMicActive(!isMicActive);
      }
    }
  }, [videoFeatureReducer.NormalizeVideoFlag, isMicActive, micStatus]);

  useEffect(() => {
    console.log("Normalize UseEffect Check", vidStatus, isVideoActive);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (vidStatus !== isVideoActive) {
        console.log("Video Check");
        iframe.contentWindow.postMessage("VidOff", "*");
        setIsVideoActive(!isVideoActive);
      }
    }
  }, [videoFeatureReducer.NormalizeVideoFlag, isVideoActive, vidStatus]);

  localStorage.setItem("videoIframe", iframeRef.current);

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div
            className={
              videoFeatureReducer.NormalizeVideoFlag === true &&
              videoFeatureReducer.MinimizeVideoFlag === false &&
              videoFeatureReducer.MaximizeVideoFlag === false &&
              videoFeatureReducer.VideoChatPanel === true
                ? "videoCallScreen"
                : videoFeatureReducer.NormalizeVideoFlag === true &&
                  videoFeatureReducer.MinimizeVideoFlag === false &&
                  videoFeatureReducer.MaximizeVideoFlag === false &&
                  videoFeatureReducer.VideoChatPanel === false
                ? "videoCallScreen more-zindex"
                : videoFeatureReducer.NormalizeVideoFlag === false &&
                  videoFeatureReducer.MinimizeVideoFlag === false &&
                  videoFeatureReducer.MaximizeVideoFlag === true &&
                  videoFeatureReducer.VideoChatPanel === true
                ? "max-video-panel"
                : videoFeatureReducer.NormalizeVideoFlag === false &&
                  videoFeatureReducer.MinimizeVideoFlag === false &&
                  videoFeatureReducer.MaximizeVideoFlag === true &&
                  videoFeatureReducer.VideoChatPanel === false
                ? "max-video-panel more-zindex"
                : ""
            }
          >
            {VideoMainReducer.FullLoader === true ? (
              <>
                <LoaderPanelVideoScreen
                  message={t(
                    "Securing-your-connection-You'll-be-able-to-join-in-a-moment"
                  )}
                />
              </>
            ) : (
              <>
                <VideoCallNormalHeader
                  screenShareButton={handleScreenShareButton}
                  layoutCurrentChange={layoutCurrentChange}
                  isScreenActive={isScreenActive}
                  disableMic={disableMicFunction}
                  disableVideo={disableVideoFunction}
                  isVideoActive={isVideoActive}
                  isMicActive={isMicActive}
                  showTile={showTile}
                />
                {videoFeatureReducer.VideoOutgoingCallFlag === true ? (
                  <VideoOutgoing />
                ) : null}
                <Row>
                  <>
                    <Col
                      lg={
                        videoFeatureReducer.participantWaitinglistBox ? 9 : 12
                      }
                      md={
                        videoFeatureReducer.participantWaitinglistBox ? 9 : 12
                      }
                      sm={
                        videoFeatureReducer.participantWaitinglistBox ? 9 : 12
                      }
                    >
                      <div
                        className={
                          videoFeatureReducer.NormalizeVideoFlag === true &&
                          videoFeatureReducer.MinimizeVideoFlag === false &&
                          videoFeatureReducer.MaximizeVideoFlag === false
                            ? "normal-avatar"
                            : videoFeatureReducer.NormalizeVideoFlag ===
                                false &&
                              videoFeatureReducer.MinimizeVideoFlag === false &&
                              videoFeatureReducer.MaximizeVideoFlag === true
                            ? "normal-avatar-large"
                            : ""
                        }
                      >
                        {initiateCallRoomID !== null ||
                        callAcceptedRoomID !== null ? (
                          <iframe
                            src={
                              callAcceptedRecipientID === currentUserID
                                ? participantURL
                                : callerURL
                            }
                            ref={iframeRef}
                            title="Live Video"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="camera;microphone;display-capture"
                          />
                        ) : null}
                      </div>
                    </Col>
                    {videoFeatureReducer.participantWaitinglistBox ? (
                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className={`${
                          videoFeatureReducer.participantWaitinglistBox
                            ? "ParticipantsWaiting_In"
                            : "ParticipantsWaiting_Out"
                        } ps-0`}
                      >
                        {/* <VideoCallParticipants /> */}

                        <VideoNewParticipantList />
                      </Col>
                    ) : null}
                    {/* <VideoCallParticipants /> */}
                  </>
                </Row>
                <Row>
                  <Col lg={8} md={8} sm={12}></Col>
                  <Col lg={4} md={4} sm={12}>
                    {/* {videoFeatureReducer.VideoChatNormalFlag === true ? (
                      <VideoPanelNormalChat />
                    ) : null} */}

                    {videoFeatureReducer.VideoAgendaNormalFlag === true ? (
                      <VideoPanelNormalAgenda />
                    ) : null}

                    {videoFeatureReducer.VideoMinutesMeetingNormalFlag ===
                    true ? (
                      <VideoPanelNormalMinutesMeeting />
                    ) : null}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default VideoPanelNormal;
