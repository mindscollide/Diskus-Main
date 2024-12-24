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
import {
  getVideoCallParticipantsMainApi,
  toggleParticipantsVisibility,
} from "../../../../../store/actions/VideoFeature_actions";
import BlackCrossIcon from "../../../../../assets/images/BlackCrossIconModals.svg";

import NormalHostVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import MaxHostVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import ParticipantVideoCallComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import NormalParticipantVideoComponent from "../../../../../container/pages/meeting/meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import MaxParticipantVideoDeniedComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../../../../../container/pages/meeting/meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";

const VideoPanelNormal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Create a ref for the iframe element
  let iframeRef = useRef(null);

  let currentUserID = Number(localStorage.getItem("userID"));

  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");

  let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

  let newRoomID = localStorage.getItem("newRoomId");
  let activeRoomID = localStorage.getItem("activeRoomID");

  console.log(newRoomID, "newRoomIDnewRoomID");

  console.log(activeRoomID, "activeRoomIDactiveRoomID");

  let participantRoomId = localStorage.getItem("participantRoomId");

  localStorage.setItem("VideoView", "Sidebar");

  let callAcceptedRecipientID = Number(
    localStorage.getItem("acceptedRecipientID")
  );
  let currentUserName = localStorage.getItem("name");

  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  let participantRoomIds = localStorage.getItem("participantRoomId");

  const newUserGUID = localStorage.getItem("isGuid");

  const { editorRole } = useContext(MeetingContext);

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );
  const FullLoader = useSelector((state) => state.VideoMainReducer.FullLoader);

  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );

  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
  );

  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag
  );

  const VideoChatPanel = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel
  );

  const participantWaitinglistBox = useSelector(
    (state) => state.videoFeatureReducer.participantWaitinglistBox
  );

  const VideoOutgoingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoOutgoingCallFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );
  const VideoAgendaNormalFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoAgendaNormalFlag
  );

  const VideoMinutesMeetingNormalFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoMinutesMeetingNormalFlag
  );

  const LeaveCallModalFlag = useSelector(
    (state) => state.videoFeatureReducer.LeaveCallModalFlag
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const normalParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.normalParticipantVideoFlag
  );

  const maxParticipantVideoDeniedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoDeniedFlag
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );

  const getAllParticipantGuest = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );

  // For acccept Join name participantList
  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );

  const audioControlHost = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  const videoControlHost = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  // audioControlForParticipant for Participants
  const audioControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.audioControlForParticipant
  );

  // videoControlForParticipant for Participants
  const videoControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.videoControlForParticipant
  );

  const participantsVisible = useSelector(
    (state) => state.videoFeatureReducer.participantsVisible
  );

  const [allParticipant, setAllParticipant] = useState([]);

  const [participantsList, setParticipantsList] = useState([]);

  const [callerURL, setCallerURL] = useState("");

  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  const meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
  // for make host
  const [isMeetingHost, setIsMeetingHost] = useState(false);

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  let refinedParticipantVideoUrl = localStorage.getItem("refinedVideoUrl");
  let refinedURLCheck = JSON.parse(localStorage.getItem("refinedVideoGiven"));

  let urlFormeetingapi = localStorage.getItem("hostUrl");

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    if (
      isMeeting &&
      isMeetingHost === false &&
      meetingHost?.isDashboardVideo === true
    ) {
      console.log(isMeetingHost, "iframeiframe");

      let Data = {
        RoomID: String(participantRoomIds),
      };
      dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
    }
  }, []);
  useEffect(() => {
    if (meetingHost) {
      console.log(isMeetingHost, "iframeiframe");
      setIsMeetingHost(meetingHost.isHost);
    }
  }, [meetingHost]);
  console.log(isMeetingHost, "iframeiframe");

  // useEffect(() => {
  //   if (makeHostNow !== null) {isHost
  //     if (
  //       currentUserID === makeHostNow.isHostId &&
  //       makeHostNow.isHost === true
  //     ) {
  //       setIsMeetingHost(true);
  //     } else {
  //       setIsMeetingHost(false);
  //     }
  //   }
  // }, [makeHostNow]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    const userRole = localStorage.getItem("userRole");
    // Determine the control source based on the user role
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    if (isMeetingHost) {
      if (iframe && iframe.contentWindow !== null) {
        if (audioControlHost === true) {
          console.log(isMeetingHost, "iframeiframe");
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          console.log(isMeetingHost, "iframeiframe");
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlHost]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    const userRole = localStorage.getItem("userRole");
    // Determine the control source based on the user role
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    if (isMeetingHost === false) {
      if (iframe && iframe.contentWindow !== null) {
        if (audioControlForParticipant === true) {
          console.log(isMeetingHost, "iframeiframe");
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          console.log(isMeetingHost, "iframeiframe");
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlForParticipant]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    const userRole = localStorage.getItem("userRole");
    const iframe = iframeRef.current;
    if (isMeetingHost === false) {
      if (iframe && iframe.contentWindow !== null) {
        if (videoControlForParticipant === true) {
          iframe.contentWindow.postMessage("VidOn", "*");
        } else {
          iframe.contentWindow.postMessage("VidOff", "*");
        }
      }
    }
  }, [videoControlForParticipant]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    const userRole = localStorage.getItem("userRole");
    const iframe = iframeRef.current;
    if (isMeetingHost) {
      if (iframe && iframe.contentWindow !== null) {
        if (videoControlHost === true) {
          iframe.contentWindow.postMessage("VidOn", "*");
        } else {
          iframe.contentWindow.postMessage("VidOff", "*");
        }
      }
    }
  }, [videoControlHost]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");

    if (getAllParticipantGuest?.length) {
      setAllParticipant(getAllParticipantGuest);
    } else {
      setAllParticipant([]);
    }
  }, [getAllParticipantGuest]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    if (getVideoParticpantListandWaitingList?.length) {
      console.log(
        getVideoParticpantListandWaitingList,
        "participantListMainReducer"
      );
      setAllParticipant((prev) => {
        const combined = [...prev, ...getVideoParticpantListandWaitingList];
        // Filter duplicates by checking the unique identifier, e.g., `guid`
        const uniqueParticipants = combined.filter(
          (participant, index, self) =>
            index === self.findIndex((p) => p.guid === participant.guid)
        );
        return uniqueParticipants;
      });
    }
  }, [getVideoParticpantListandWaitingList]);
  console.log(
    getVideoParticpantListandWaitingList,
    "participantListMainReducer"
  );

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    if (
      getNewParticipantsMeetingJoin !== null &&
      getNewParticipantsMeetingJoin !== undefined &&
      getNewParticipantsMeetingJoin.length > 0
    ) {
      // Extract and set the new participants to state
      setParticipantsList(getNewParticipantsMeetingJoin);
    } else {
      setParticipantsList([]);
    }
  }, [getNewParticipantsMeetingJoin]);

  useEffect(() => {
    console.log(isMeetingHost, "iframeiframe");
    if (
      getNewParticipantsMeetingJoin !== null &&
      getNewParticipantsMeetingJoin !== undefined &&
      getNewParticipantsMeetingJoin.length > 0
    ) {
      // Filter out duplicates based on UID
      const uniqueParticipants = getNewParticipantsMeetingJoin.reduce(
        (acc, current) => {
          // Only add the current participant if its UID is not already in acc
          if (!acc.find((participant) => participant.guid === current.guid)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setParticipantsList(uniqueParticipants);
    } else {
      setParticipantsList([]);
    }
  }, [getNewParticipantsMeetingJoin]);

  useEffect(() => {
    console.log(initiateCallRoomID, "mqtt");
    try {
      if (initiateCallRoomID !== null) {
        console.log(initiateCallRoomID, "mqtt");
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        const endIndexBaseURLCaller = dynamicBaseURLCaller
          ? endIndexUrl(dynamicBaseURLCaller)
          : "";
        const extractedBaseURLCaller = endIndexBaseURLCaller
          ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
          : "";
        if (isMeeting) {
          console.log(initiateCallRoomID, "mqtt");
          if (isMeetingHost) {
            console.log(initiateCallRoomID, "mqtt");
            setCallerURL(urlFormeetingapi);
          } else {
            console.log(initiateCallRoomID, "mqtt");
            setCallerURL(
              generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                initiateCallRoomID
              )
            );
          }
        } else {
          console.log(initiateCallRoomID, "mqtt");
          setCallerURL(
            generateURLCaller(
              extractedBaseURLCaller,
              currentUserName,
              initiateCallRoomID
            )
          );
        }
      }
    } catch {}
  }, [initiateCallRoomID]);

  useEffect(() => {
    console.log(localStorage.getItem("newRoomId"), "mqtt");
    try {
      if (localStorage.getItem("newRoomId") !== null) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        const endIndexBaseURLCaller = dynamicBaseURLCaller
          ? endIndexUrl(dynamicBaseURLCaller)
          : "";
        let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
        const extractedBaseURLCaller = endIndexBaseURLCaller
          ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
          : "";
        console.log(dynamicBaseURLCaller, "mqtt");
        console.log(endIndexBaseURLCaller, "mqtt");
        console.log(extractedBaseURLCaller, "mqtt");
        console.log(isMeeting, "mqtt");
        if (isMeeting) {
          console.log(isMeetingHost, "mqtt");
          if (isMeetingHost) {
            console.log(urlFormeetingapi, "mqtt");
            setCallerURL(urlFormeetingapi);
          } else {
            console.log(
              generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                newRoomID
              ),
              "mqtt"
            );
            setCallerURL(
              generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                newRoomID === 0 ? activeRoomID : newRoomID
              )
            );
          }
        } else {
          console.log(
            generateURLCaller(
              extractedBaseURLCaller,
              currentUserName,
              newRoomID === 0 ? activeRoomID : newRoomID
            ),
            "mqtt"
          );
          setCallerURL(
            generateURLCaller(
              extractedBaseURLCaller,
              currentUserName,
              newRoomID === 0 ? activeRoomID : newRoomID
            )
          );
        }
      }
    } catch {}
  }, [newRoomID]);

  useEffect(() => {
    console.log(initiateCallRoomID, "mqtt");

    try {
      let dynamicBaseURLCaller = localStorage.getItem(
        "videoBaseURLParticipant"
      );
      let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

      const endIndexBaseURLCaller = dynamicBaseURLCaller
        ? endIndexUrl(dynamicBaseURLCaller)
        : "";
      const extractedBaseURLCaller = endIndexBaseURLCaller
        ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
        : "";
      // let randomGuestName = generateRandomGuest();
      console.log(endIndexBaseURLCaller, "iframeiframe");
      console.log(extractedBaseURLCaller, "iframeiframe");
      if (isMeeting === false) {
        console.log(initiateCallRoomID, "iframeiframe");
        setParticipantURL(
          generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID
          )
        );
      } else if (isMeeting === true) {
        console.log(extractedBaseURLCaller, "mqtt");
        if (isMeetingVideo) {
          console.log(extractedBaseURLCaller, "mqtt");
          if (isMeetingHost) {
            console.log(extractedBaseURLCaller, "mqtt");
            console.log(urlFormeetingapi, "iframeiframe");

            setParticipantURL(urlFormeetingapi);
          } else {
            console.log(extractedBaseURLCaller, "mqtt");
            console.log(callAcceptedRoomID, "iframeiframe");
            setParticipantURL(
              generateURLParticipant(
                extractedBaseURLCaller,
                currentUserName,
                callAcceptedRoomID
              )
            );
          }
        } else {
          console.log(extractedBaseURLCaller, "mqtt");
          console.log(callAcceptedRoomID, "iframeiframe");
          setParticipantURL(
            generateURLParticipant(
              extractedBaseURLCaller,
              currentUserName,
              callAcceptedRoomID
            )
          );
        }
      }
    } catch {}
  }, [callAcceptedRoomID]);

  // useEffect(() => {
  //   try {
  //     let dynamicBaseURLCaller = localStorage.getItem(
  //       "videoBaseURLParticipant"
  //     );
  //     const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller);
  //     const extractedBaseURLCaller = extractedUrl(
  //       dynamicBaseURLCaller,
  //       endIndexBaseURLCaller
  //     );
  //     // let randomGuestName = generateRandomGuest();
  //     if (isMeeting === false) {
  //       setParticipantURL(
  //         generateURLParticipant(
  //           extractedBaseURLCaller,
  //           currentUserName,
  //           callAcceptedRoomID
  //         )
  //       );
  //     }
  //   } catch {}
  // }, [callAcceptedRoomID]);

  // Function to trigger the action in the iframe
  const handleScreenShareButton = () => {
    if (LeaveCallModalFlag === false) {
      const iframe = iframeRef.current;

      if (iframe) {
        iframe.contentWindow.postMessage("ScreenShare", "*");
        setIsScreenActive(!isScreenActive);
      }
    }
  };

  const layoutCurrentChange = () => {
    let videoView = localStorage.getItem("VideoView");
    if (LeaveCallModalFlag === false) {
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

  const closeParticipantsList = () => {
    dispatch(toggleParticipantsVisibility(false));
  };

  localStorage.setItem("videoIframe", iframeRef.current);

  return (
    <>
      {MaximizeHostVideoFlag ? (
        <MaxHostVideoCallComponent />
      ) : NormalHostVideoFlag ? (
        <NormalHostVideoCallComponent />
      ) : maximizeParticipantVideoFlag ? (
        <ParticipantVideoCallComponent />
      ) : normalParticipantVideoFlag ? (
        <NormalParticipantVideoComponent />
      ) : maxParticipantVideoDeniedFlag ? (
        <MaxParticipantVideoDeniedComponent />
      ) : maxParticipantVideoRemovedFlag ? (
        <MaxParticipantVideoRemovedComponent />
      ) : (
        <Row>
          <Col sm={12} md={12} lg={12}>
            <div
              className={
                NormalizeVideoFlag === true &&
                MinimizeVideoFlag === false &&
                MaximizeVideoFlag === false &&
                VideoChatPanel === true
                  ? "videoCallScreen"
                  : NormalizeVideoFlag === true &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === false &&
                    VideoChatPanel === false
                  ? "videoCallScreen more-zindex"
                  : NormalizeVideoFlag === false &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === true &&
                    VideoChatPanel === true
                  ? "max-video-panel"
                  : NormalizeVideoFlag === false &&
                    MinimizeVideoFlag === false &&
                    MaximizeVideoFlag === true &&
                    VideoChatPanel === false
                  ? "max-video-panel more-zindex"
                  : ""
              }
            >
              {FullLoader === true ? (
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
                  {VideoOutgoingCallFlag === true ? <VideoOutgoing /> : null}
                  <Row>
                    <>
                      <Col
                        lg={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        md={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        sm={
                          isMeetingHost &&
                          meetingHost.isDashboardVideo &&
                          participantWaitinglistBox
                            ? 9
                            : 12
                        }
                      >
                        <div
                          className={
                            NormalizeVideoFlag === true &&
                            MinimizeVideoFlag === false &&
                            MaximizeVideoFlag === false
                              ? "normal-avatar"
                              : NormalizeVideoFlag === false &&
                                MinimizeVideoFlag === false &&
                                MaximizeVideoFlag === true
                              ? "normal-avatar-large"
                              : ""
                          }
                        >
                          <>
                            <>
                              {console.log("iframeiframe", isMeetingHost)}
                              {console.log("iframeiframe", participantURL)}
                              {console.log(
                                "iframeiframe",
                                typeof participantURL
                              )}
                              {console.log("iframeiframe", callerURL)}
                              {console.log("iframeiframe", typeof callerURL)}
                              {console.log(
                                "iframeiframe",
                                callAcceptedRecipientID === currentUserID
                              )}
                              {console.log("iframeiframe", currentUserID)}
                              {console.log(
                                "iframeiframe",
                                callAcceptedRecipientID
                              )}

                              {console.log(
                                "iframeiframe",
                                refinedParticipantVideoUrl
                              )}
                              {console.log("iframeiframe", participantURL)}
                              {console.log("iframeiframe", callerURL)}
                              {refinedURLCheck ? (
                                <>
                                  {console.log(
                                    "iframeiframe meetingHost.isHost",
                                    meetingHost.isHost
                                  )}
                                  {console.log(
                                    "iframeiframe",
                                    refinedParticipantVideoUrl
                                  )}
                                  {console.log(
                                    "iframeiframe",
                                    refinedParticipantVideoUrl
                                  )}
                                  <iframe
                                    src={
                                      !meetingHost.isHost
                                        ? refinedParticipantVideoUrl
                                        : null
                                    }
                                    ref={iframeRef}
                                    title="Live Video"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="camera;microphone;display-capture"
                                  />
                                </>
                              ) : (
                                <>
                                  {console.log(
                                    "iframeiframe participantURL",
                                    participantURL
                                  )}
                                  {console.log("iframeiframe", callerURL)}
                                  {console.log(
                                    "iframeiframe callAcceptedRecipientID",
                                    callAcceptedRecipientID
                                  )}
                                  {console.log(
                                    "iframeiframe currentUserID",
                                    currentUserID
                                  )}
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
                                </>
                              )}

                              {/* {console.log(
                                "iframeiframeIsMeetingHost",
                                isMeetingHost
                              )}
                              {console.log("iframeiframe", participantURL)}
                              {console.log(
                                "iframeiframe",
                                typeof participantURL
                              )}
                              {console.log("iframeiframe", callerURL)}
                              {console.log("iframeiframe", typeof callerURL)}
                              {console.log(
                                "iframeiframe",
                                callAcceptedRecipientID === currentUserID
                              )}
                              {console.log("iframeiframe", currentUserID)}
                              {console.log(
                                "iframeiframe",
                                callAcceptedRecipientID
                              )} */}
                              {/* {!refinedParticipantVideoUrl ? (
                                <>
                                  <iframe
                                    src={
                                      meetingHost.isHost
                                        ? urlFormeetingapi
                                        : callAcceptedRecipientID ===
                                          currentUserID
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
                                </>
                              ) : !isMeetingHost ? (
                                <>
                                  {console.log("iframeiframe", isMeetingHost)}
                                  <iframe
                                    src={refinedParticipantVideoUrl}
                                    ref={iframeRef}
                                    title="Live Video"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="camera;microphone;display-capture"
                                  />
                                </>
                              ) : null} */}
                            </>
                          </>
                          {/* // {!isMeetingHost ? (
                          //   <>
                          //     {console.log("iframeiframe", isMeetingHost)}
                          //     <iframe
                          //       src={refinedParticipantVideoUrl}
                          //       ref={iframeRef}
                          //       title="Live Video"
                          //       width="100%"
                          //       height="100%"
                          //       frameBorder="0"
                          //       allow="camera;microphone;display-capture"
                          //     />
                          //   </>
                          // ) : null} */}
                        </div>
                      </Col>

                      {isMeetingHost &&
                      meetingHost.isDashboardVideo &&
                      participantWaitinglistBox ? (
                        <>
                          {participantWaitinglistBox ? (
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className={`${
                                participantWaitinglistBox
                                  ? "ParticipantsWaiting_In"
                                  : "ParticipantsWaiting_Out"
                              } ps-0`}
                            >
                              {/* <VideoCallParticipants /> */}

                              {/* this is new Host Panel */}
                              {isMeetingHost && participantWaitinglistBox && (
                                <VideoNewParticipantList />
                              )}
                            </Col>
                          ) : null}
                        </>
                      ) : isMeeting && isMeetingVideo && !isMeetingHost ? (
                        <>
                          {participantsVisible && (
                            <div className="Participants-Lists">
                              <>
                                <Row>
                                  <Col lg={10} md={10} sm={10}>
                                    <p className="Participant-name-title">
                                      {t("Participants")}
                                    </p>
                                  </Col>
                                  <Col lg={2} md={2} sm={2}>
                                    <img
                                      draggable={false}
                                      src={BlackCrossIcon}
                                      alt=""
                                      className={"cursor-pointer"}
                                      width="8px"
                                      height="8px"
                                      onClick={closeParticipantsList}
                                    />
                                  </Col>
                                </Row>
                                {allParticipant.length > 0 &&
                                  allParticipant.map((participant, index) => {
                                    return (
                                      <>
                                        <Row
                                          key={participant.guid}
                                          className="mb-1"
                                        >
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-flex justify-content-start"
                                          >
                                            <p className="participantModal_name">
                                              {participant.name}
                                            </p>{" "}
                                          </Col>
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            className="d-flex justify-content-end gap-2"
                                          >
                                            {participant.hideCamera ? (
                                              <img
                                                src={VideoOff}
                                                width="20px"
                                                height="20px"
                                                alt="Video Off"
                                              />
                                            ) : null}

                                            {participant.mute ? (
                                              <img
                                                src={MicOff}
                                                width="20px"
                                                height="20px"
                                                alt="Mic Mute"
                                              />
                                            ) : null}
                                            {participant.raiseHand ? (
                                              <img
                                                src={Raisehandselected}
                                                width="20px"
                                                height="20px"
                                                alt="raise hand"
                                              />
                                            ) : null}
                                          </Col>
                                        </Row>
                                      </>
                                    );
                                  })}
                              </>
                            </div>
                          )}
                        </>
                      ) : null}
                    </>
                  </Row>
                  <Row>
                    <Col lg={8} md={8} sm={12}></Col>
                    <Col lg={4} md={4} sm={12}>
                      {/* {videoFeatureReducer.VideoChatNormalFlag === true ? (
                      <VideoPanelNormalChat />
                    ) : null} */}

                      {VideoAgendaNormalFlag === true ? (
                        <VideoPanelNormalAgenda />
                      ) : null}

                      {VideoMinutesMeetingNormalFlag === true ? (
                        <VideoPanelNormalMinutesMeeting />
                      ) : null}
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default VideoPanelNormal;
