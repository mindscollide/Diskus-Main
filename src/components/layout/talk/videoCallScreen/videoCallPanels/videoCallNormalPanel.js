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
import { useTranslation } from "react-i18next";
import VideoNewParticipantList from "../videoNewParticipantList/VideoNewParticipantList";
import { transferMeetingHostSuccess } from "../../../../../store/actions/Guest_Video";
import { useNavigate } from "react-router-dom";
import {
  getVideoCallParticipantsMainApi,
  makeParticipantHost,
  participantListWaitingListMainApi,
  participantWaitingListBox,
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

  const makeParticipantAsHost = useSelector(
    (state) => state.videoFeatureReducer.makeParticipantAsHost
  );

  const makeParticipantAsHostData = useSelector(
    (state) => state.videoFeatureReducer.makeParticipantAsHostData
  );
  const hostTransferFlag = useSelector(
    (state) => state.GuestVideoReducer.hostTransferFlag
  );

  const [allParticipant, setAllParticipant] = useState([]);

  const [participantsList, setParticipantsList] = useState([]);

  const [callerURL, setCallerURL] = useState("");

  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  const meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
  // for make host
  const [isMeetingHost, setIsMeetingHost] = useState(
    meetingHost?.isHost ? true : false
  );

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  let refinedParticipantVideoUrl = localStorage.getItem("refinedVideoUrl");
  let refinedURLCheck = JSON.parse(localStorage.getItem("refinedVideoGiven"));

  let urlFormeetingapi = localStorage.getItem("hostUrl");

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);
  const [isMeetinVideoCeckForParticipant, setIsMeetinVideoCeckForParticipant] =
    useState(false);
  function validateRoomID(input) {
    try {
      // Convert input to string if not already a string
      const urlString = String(input);

      // Parse the URL
      const url = new URL(urlString);

      // Extract query parameters
      const params = new URLSearchParams(url.search);

      // Look for 'RoomID' or 'roomid' (case-insensitive)
      let roomID = params.get("RoomID") || params.get("roomid");

      // Ensure RoomID is treated as a string
      roomID = String(roomID).trim();

      // Validate RoomID - must be a number greater than 0
      return /^\d+$/.test(roomID) && parseInt(roomID, 10) > 0; // Only numbers > 0
    } catch (error) {
      // Return false for any parsing or validation error
      return false;
    }
  }
  useEffect(() => {
    if (
      isMeeting &&
      isMeetingHost === false &&
      meetingHost?.isDashboardVideo === true
    ) {
      let Data = {
        RoomID: String(participantRoomIds),
      };
      dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
      setIsMeetinVideoCeckForParticipant(true);
      if (validateRoomID(refinedParticipantVideoUrl)) {
        console.log("iframeiframe", refinedParticipantVideoUrl !== callerURL);
        if (refinedParticipantVideoUrl !== callerURL) {
          console.log("iframeiframe", refinedParticipantVideoUrl);
          setCallerURL(refinedParticipantVideoUrl);
        }
      }
    }
    return () => {
      console.log("iframeiframe");
      if (callerURL !== "") {
        console.log("iframeiframe");
        setCallerURL("");
      }
      localStorage.removeItem("refinedVideoUrl");
      localStorage.removeItem("initiateCallRoomID");
      localStorage.removeItem("acceptedRoomID");
    };
  }, []);

  useEffect(() => {
    // Determine the control source based on the user role
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    if (isMeetingHost) {
      if (iframe && iframe.contentWindow !== null) {
        if (audioControlHost === true) {
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlHost]);

  useEffect(() => {
    // Determine the control source based on the user role
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    console.log("videoHideUnHideForHost", audioControlForParticipant);
    console.log("videoHideUnHideForHost", isMeetingHost);
    if (isMeetingHost === false) {
      console.log("videoHideUnHideForHost", audioControlForParticipant);
      if (iframe && iframe.contentWindow !== null) {
        console.log("videoHideUnHideForHost", audioControlForParticipant);
        if (audioControlForParticipant === true) {
          iframe.contentWindow.postMessage("MicOn", "*");
        } else {
          iframe.contentWindow.postMessage("MicOff", "*");
        }
      }
    }
  }, [audioControlForParticipant]);

  useEffect(() => {
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
    const iframe = iframeRef.current;
    console.log("videoHideUnHideForHost", videoControlHost);
    if (isMeetingHost) {
      if (iframe && iframe.contentWindow !== null) {
        console.log("videoHideUnHideForHost", videoControlHost);
        if (videoControlHost === true) {
          iframe.contentWindow.postMessage("VidOn", "*");
        } else {
          iframe.contentWindow.postMessage("VidOff", "*");
        }
      }
    }
  }, [videoControlHost]);

  useEffect(() => {
    if (getAllParticipantGuest?.length) {
      setAllParticipant(getAllParticipantGuest);
    } else {
      setAllParticipant([]);
    }
  }, [getAllParticipantGuest]);

  useEffect(() => {
    if (getVideoParticpantListandWaitingList?.length) {
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

  useEffect(() => {
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
    try {
      if (initiateCallRoomID !== null) {
        let dynamicBaseURLCaller = localStorage.getItem("videoBaseURLCaller");
        const endIndexBaseURLCaller = dynamicBaseURLCaller
          ? endIndexUrl(dynamicBaseURLCaller)
          : "";
        const extractedBaseURLCaller = endIndexBaseURLCaller
          ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
          : "";
        if (isMeeting) {
          if (isMeetingHost) {
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", urlFormeetingapi);
              if (urlFormeetingapi !== callerURL) {
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              let newurl = generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                initiateCallRoomID
              );
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", newurl);
                if (newurl !== callerURL) {
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          let newurl = generateURLCaller(
            extractedBaseURLCaller,
            currentUserName,
            initiateCallRoomID
          );
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", newurl);
            if (newurl !== callerURL) {
              setCallerURL(newurl);
            }
          }
        }
      }
    } catch {}
  }, [initiateCallRoomID]);

  useEffect(() => {
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
        if (isMeeting) {
          if (isMeetingHost) {
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", urlFormeetingapi !== callerURL);
              if (urlFormeetingapi !== callerURL) {
                console.log("iframeiframe", urlFormeetingapi);
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              let newurl = generateURLCaller(
                extractedBaseURLCaller,
                currentUserName,
                newRoomID
              );
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", newurl !== callerURL);
                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl);
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          let newurl = generateURLCaller(
            extractedBaseURLCaller,
            currentUserName,
            newRoomID === 0 ? activeRoomID : newRoomID
          );
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", newurl !== callerURL);
            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl);
              setCallerURL(newurl);
            }
          }
        }
      }
    } catch {}
  }, [newRoomID]);

  useEffect(() => {
    try {
      let dynamicBaseURLCaller = localStorage.getItem(
        "videoBaseURLParticipant"
      );

      const endIndexBaseURLCaller = dynamicBaseURLCaller
        ? endIndexUrl(dynamicBaseURLCaller)
        : "";
      const extractedBaseURLCaller = endIndexBaseURLCaller
        ? extractedUrl(dynamicBaseURLCaller, endIndexBaseURLCaller)
        : "";
      // let randomGuestName = generateRandomGuest();
      console.log("iframeiframe", isMeeting);
      if (isMeeting === false) {
        let newurl = generateURLParticipant(
          extractedBaseURLCaller,
          currentUserName,
          callAcceptedRoomID
        );
        if (validateRoomID(newurl)) {
          console.log("iframeiframe", newurl !== callerURL);
          if (newurl !== callerURL) {
            console.log("iframeiframe", newurl);
            setCallerURL(newurl);
          }
        }
      } else if (isMeeting === true) {
        console.log("iframeiframe", isMeeting);
        if (isMeetingVideo) {
          console.log("iframeiframe", isMeetingHost);
          if (isMeetingHost) {
            console.log("iframeiframe", urlFormeetingapi);
            if (validateRoomID(urlFormeetingapi)) {
              console.log("iframeiframe", validateRoomID(urlFormeetingapi));
              if (urlFormeetingapi !== callerURL) {
                console.log("iframeiframe", urlFormeetingapi !== callerURL);
                console.log("iframeiframe", urlFormeetingapi);
                console.log("iframeiframe", callerURL);
                setCallerURL(urlFormeetingapi);
              }
            }
          } else {
            if (
              isMeeting &&
              isMeetingHost === false &&
              meetingHost?.isDashboardVideo === false
            ) {
              let newurl = generateURLParticipant(
                extractedBaseURLCaller,
                currentUserName,
                callAcceptedRoomID
              );
              console.log("iframeiframe", newurl);
              if (validateRoomID(newurl)) {
                console.log("iframeiframe", validateRoomID(newurl));

                if (newurl !== callerURL) {
                  console.log("iframeiframe", newurl !== callerURL);
                  setCallerURL(newurl);
                }
              }
            }
          }
        } else {
          let newurl = generateURLParticipant(
            extractedBaseURLCaller,
            currentUserName,
            callAcceptedRoomID
          );
          console.log("iframeiframe", newurl);
          if (validateRoomID(newurl)) {
            console.log("iframeiframe", validateRoomID(newurl));
            if (newurl !== callerURL) {
              console.log("iframeiframe", newurl !== callerURL);
              setCallerURL(newurl);
            }
          }
        }
      }
    } catch {}
  }, [callAcceptedRoomID]);

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
  useEffect(() => {
    try {
      if (makeParticipantAsHost) {
        hostTrasfer(makeParticipantAsHostData);
        dispatch(makeParticipantHost([], false));
      }
    } catch {}
  }, [makeParticipantAsHost]);

  async function hostTrasfer(mqttData) {
    try {
      if (localStorage.getItem("participantUID") === mqttData.newHost.guid) {
        await dispatch(toggleParticipantsVisibility(false));
        await dispatch(participantWaitingListBox(false));
        const meetingHost = {
          isHost: true,
          isHostId: Number(localStorage.getItem("userID")),
          isDashboardVideo: true,
        };
        let participantRoomId = localStorage.getItem("participantRoomId");
        let participantUID = localStorage.getItem("participantUID");
        let refinedVideoUrl = localStorage.getItem("refinedVideoUrl");

        await setIsMeetingHost(true);
        let Data = { RoomID: participantRoomId };
        await dispatch(participantListWaitingListMainApi(Data, navigate, t));
        refinedURLCheck = false;

        await localStorage.setItem("hostUrl", refinedVideoUrl);
        await localStorage.setItem("newRoomId", participantRoomId);
        await localStorage.setItem(
          "meetinHostInfo",
          JSON.stringify(meetingHost)
        );
        await localStorage.setItem("isGuid", participantUID);
        await localStorage.setItem("isMeetingVideoHostCheck", true);
        await localStorage.setItem("isHost", true);
        await localStorage.removeItem("participantRoomId");
        await localStorage.removeItem("refinedVideoUrl");
        await localStorage.removeItem("participantUID");
        if (validateRoomID(refinedVideoUrl)) {
          console.log("iframeiframe", refinedVideoUrl);
          if (refinedVideoUrl !== callerURL) {
            console.log("iframeiframe", refinedVideoUrl !== callerURL);
            setCallerURL(refinedVideoUrl);
          }
        }
        // localStorage.removeItem("participantUID");
        // localStorage.removeItem("participantRoomId");
      } else {
      }
    } catch {}
  }
  useEffect(() => {
    try {
      console.log("videoHideUnHideForHost", meetingHost);
      if (hostTransferFlag) {
        console.log("videoHideUnHideForHost", hostTransferFlag);
        setIsMeetingHost(false);
        dispatch(transferMeetingHostSuccess(false));
      }
    } catch {}
  }, [hostTransferFlag]);
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
                  // message={t(
                  //   "Securing-your-connection-You'll-be-able-to-join-in-a-moment"
                  // )}
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
                          {console.log("iframeiframe", isMeetingHost)}
                          {console.log("iframeiframe", callerURL)}
                          <>
                            {callerURL !== "" && (
                              <iframe
                                src={callerURL}
                                ref={iframeRef}
                                title="Live Video"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="camera;microphone;display-capture"
                              />
                            )}
                          </>
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
