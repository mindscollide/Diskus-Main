import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./videoCallNormalPanel.css";
import VideoCallNormalHeader from "../videoCallHeader/videoCallNormalHeader";
import VideoPanelNormalAgenda from "./videoCallNormalAgenda";
import VideoPanelNormalMinutesMeeting from "./videoCallNormalMinutesMeeting";
import { LoaderPanelVideoScreen } from "../../../../elements";
import { MeetingContext } from "../../../../../context/MeetingContext";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import Raisehandselected from "../../../../../assets/images/Recent Activity Icons/Video/Raisehandselected.png";

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
import { getVideoCallParticipantsGuestMainApi } from "../../../../../store/actions/Guest_Video";
import { useNavigate } from "react-router-dom";

const VideoPanelNormal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const { editorRole } = useContext(MeetingContext);
  console.log(editorRole, "editorRoleeditorRoleeditorRole");

  let currentUserID = Number(localStorage.getItem("userID"));
  const { t } = useTranslation();

  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
  let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");
  let newRoomID = localStorage.getItem("newRoomId");

  localStorage.setItem("VideoView", "Sidebar");
  let callAcceptedRecipientID = Number(
    localStorage.getItem("acceptedRecipientID")
  );
  let currentUserName = localStorage.getItem("name");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  const getAllParticipantGuest = useSelector(
    (state) => state.GuestVideoReducer.getAllParticipantGuest
  );

  // For acccept Join name participantList
  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const [allParticipant, setAllParticipant] = useState([]);
  const [participantsList, setParticipantsList] = useState([]);

  console.log(participantsList, "participantsListparticipantsList");
  const [callerURL, setCallerURL] = useState("");
  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);

  useEffect(() => {
    let getRoomId = localStorage.getItem("participantRoomId");
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
      setAllParticipant(getAllParticipantGuest.participantList);
    } else {
      setAllParticipant([]);
    }
  }, [getAllParticipantGuest]);

  useEffect(() => {
    // Sync allParticipant with participantsList when it updates
    if (participantsList.length > 0) {
      setAllParticipant(participantsList);
    } else {
      setAllParticipant([]);
    }
  }, [participantsList]);

  useEffect(() => {
    if (
      getNewParticipantsMeetingJoin !== null &&
      getNewParticipantsMeetingJoin !== undefined &&
      getNewParticipantsMeetingJoin.length > 0
    ) {
      console.log(
        getNewParticipantsMeetingJoin,
        "getNewParticipantsMeetingJoingetNewParticipantsMeetingJoin"
      );
      console.log(getNewParticipantsMeetingJoin.length);
      // Extract and set the new participants to state
      setParticipantsList(getNewParticipantsMeetingJoin);
    } else {
      setParticipantsList([]);
    }
  }, [getNewParticipantsMeetingJoin]);

  useEffect(() => {
    if (
      getNewParticipantsMeetingJoin !== null &&
      getNewParticipantsMeetingJoin !== undefined &&
      getNewParticipantsMeetingJoin.length > 0
    ) {
      // Filter out duplicates based on UID
      const uniqueParticipants = getNewParticipantsMeetingJoin.reduce(
        (acc, current) => {
          console.log(acc, "datadatdtad");
          console.log(current, "currentcurrent");

          // Only add the current participant if its UID is not already in acc
          if (!acc.find((participant) => participant.guid === current.guid)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setParticipantsList(uniqueParticipants);
      console.log(uniqueParticipants, "uniqueParticipants");
    } else {
      setParticipantsList([]);
    }
  }, [getNewParticipantsMeetingJoin]);

  useEffect(() => {
    try {
      if (initiateCallRoomID !== null) {
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
      }
    } catch {}
  }, [initiateCallRoomID]);

  useEffect(() => {
    try {
      if (newRoomID !== null) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller);
        const extractedBaseURLCaller = extractedUrl(
          dynamicBaseURLCaller,
          endIndexBaseURLCaller
        );
        setCallerURL(
          generateURLCaller(extractedBaseURLCaller, currentUserName, newRoomID)
        );
      }
    } catch {}
  }, [newRoomID]);

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

                        {/* this is new Host Panel */}
                        {editorRole.role === "Organizer" ? (
                          <VideoNewParticipantList />
                        ) : (
                          <>
                            <div className="Participants-Lists">
                              <>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <p className="Participant-name-title">
                                      {t("Participants")}
                                    </p>
                                  </Col>
                                </Row>
                                {allParticipant.length > 0 &&
                                  allParticipant.map((participant, index) => {
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
                                            <img
                                              src={VideoOff}
                                              width="20px"
                                              height="20px"
                                              alt="Video Off"
                                            />
                                            <img
                                              src={MicOff}
                                              width="20px"
                                              height="20px"
                                              alt="Mic Mute"
                                            />
                                            <img
                                              src={Raisehandselected}
                                              width="20px"
                                              height="20px"
                                              alt="raise hand"
                                            />
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  })}
                              </>
                            </div>
                          </>
                        )}
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
