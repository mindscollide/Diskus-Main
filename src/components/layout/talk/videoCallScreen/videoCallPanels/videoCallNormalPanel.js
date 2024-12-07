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
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";

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

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
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

  console.log(getAllParticipantGuest, "getAllParticipantGuest");

  const muteUnMuteParticipantList = useSelector(
    (state) => state.videoFeatureReducer.muteUnMuteParticipantList
  );

  console.log(muteUnMuteParticipantList, "muteUnMuteParticipantList");

  // For acccept Join name participantList
  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );
  console.log(
    getVideoParticpantListandWaitingList,
    "getNewParticipantsMeetingJoin"
  );

  const audioControlHost = useSelector(
    (state) => state.videoFeatureReducer.audioControlHost
  );

  const videoControlHost = useSelector(
    (state) => state.videoFeatureReducer.videoControlHost
  );

  console.log(videoControlHost, "videoControlHostvideoControlHost");

  // audioControlForParticipant for Participants
  const audioControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.audioControlForParticipant
  );
  console.log(audioControlForParticipant, "audioControlForParticipant");

  // Raise Un Raise For Partciipant
  const raisedUnRaisedParticipant = useSelector(
    (state) => state.videoFeatureReducer.raisedUnRaisedParticipant
  );

  console.log(raisedUnRaisedParticipant, "raisedUnRaisedParticipant");

  // videoControlForParticipant for Participants
  const videoControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.videoControlForParticipant
  );
  console.log(videoControlForParticipant, "videoControlForParticipant");

  const getParticipantsVideoUrl = useSelector(
    (state) => state.videoFeatureReducer.getParticipantsVideoUrl
  );
  console.log(getParticipantsVideoUrl, "getParticipantsVideoUrl");

  //makeHostNow Reducer
  const makeHostNow = useSelector(
    (state) => state.videoFeatureReducer.makeHostNow
  );

  const participantsVisible = useSelector(
    (state) => state.videoFeatureReducer.participantsVisible
  );

  const [allParticipant, setAllParticipant] = useState([]);
  const [participantsList, setParticipantsList] = useState([]);

  console.log(allParticipant, "allParticipantallParticipant");

  console.log(participantsList, "participantsListparticipantsList");
  const [callerURL, setCallerURL] = useState("");
  const [participantURL, setParticipantURL] = useState("");

  const [showTile, setShowTile] = useState(false);

  const [isScreenActive, setIsScreenActive] = useState(false);

  const [meetingVideoUrl, setMeetingVideoUrl] = useState("");
  console.log(meetingVideoUrl, "meetingVideoUrlmeetingVideoUrl");

  // for make host
  const [isMeetingHost, setIsMeetingHost] = useState(false);
  console.log(isMeetingHost, "isMeetingHostisMeetingHost");

  let getMeetingHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));

  let micStatus = JSON.parse(localStorage.getItem("MicOff"));
  let vidStatus = JSON.parse(localStorage.getItem("VidOff"));

  let refinedParticipantVideoUrl = localStorage.getItem("refinedVideoUrl");
  console.log(refinedParticipantVideoUrl, "refinedParticipantVideoUrl");

  const [isMicActive, setIsMicActive] = useState(micStatus);
  const [isVideoActive, setIsVideoActive] = useState(vidStatus);

  useEffect(() => {
    const meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
    console.log(meetingHost, "iframeiframe");
    if (
      isMeeting &&
      meetingHost?.isHost === false &&
      meetingHost?.isDashboardVideo === true
    ) {
      let Data = {
        RoomID: String(participantRoomIds),
      };
      dispatch(getVideoCallParticipantsMainApi(Data, navigate, t));
    }
  }, []);

  useEffect(() => {
    if (makeHostNow !== null) {
      if (
        currentUserID === makeHostNow.isHostId &&
        makeHostNow.isHost === true
      ) {
        setIsMeetingHost(true);
      } else {
        setIsMeetingHost(false);
      }
    }
  }, [makeHostNow]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    // Determine the control source based on the user role
    console.log("toggleAudio", audioControlHost);
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (audioControlHost === true) {
        console.log("Mic Check - Turning Mic Off");
        iframe.contentWindow.postMessage("MicOn", "*");
      } else {
        console.log("Mic Check - Turning Mic On");
        iframe.contentWindow.postMessage("MicOff", "*");
      }
    }
  }, [audioControlHost]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    // Determine the control source based on the user role
    console.log("toggleAudio", audioControlForParticipant);
    // Reference the iframe and perform postMessage based on the control source
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (audioControlForParticipant === true) {
        console.log("Mic Check - Turning Mic Off");
        iframe.contentWindow.postMessage("MicOn", "*");
      } else {
        console.log("Mic Check - Turning Mic On");
        iframe.contentWindow.postMessage("MicOff", "*");
      }
    }
  }, [ audioControlForParticipant]);
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    console.log("toggleAudio", videoControlHost);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (videoControlForParticipant === true) {
        console.log("Video Check - Turning Video Off");
        iframe.contentWindow.postMessage("VidOn", "*");
      } else {
        console.log("Video Check - Turning Video On");
        iframe.contentWindow.postMessage("VidOff", "*");
      }
    }
  }, [videoControlForParticipant]);
  
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    console.log("toggleAudio", videoControlHost);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow !== null) {
      if (videoControlHost === true) {
        console.log("Video Check - Turning Video Off");
        iframe.contentWindow.postMessage("VidOn", "*");
      } else {
        console.log("Video Check - Turning Video On");
        iframe.contentWindow.postMessage("VidOff", "*");
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

  // useEffect(() => {
  //   // Sync allParticipant with participantsList when it updates
  //   if (participantsList.length > 0) {
  //     setAllParticipant(participantsList);
  //   } else {
  //     setAllParticipant([]);
  //   }
  // }, [participantsList]);

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

  // useEffect(() => {
  //   const iframe = iframeRef.current;
  //   if (iframe && iframe.contentWindow !== null) {
  //     if (micStatus !== isMicActive) {
  //       console.log("Mic Check");
  //       iframe.contentWindow.postMessage("MicOff", "*");
  //       setIsMicActive(!isMicActive);
  //     }
  //   }
  // }, [videoFeatureReducer.NormalizeVideoFlag, isMicActive, micStatus]);

  console.log("hell");

  const closeParticipantsList = () => {
    dispatch(toggleParticipantsVisibility(false));
  };

  // useEffect(() => {
  //   console.log("Normalize UseEffect Check", vidStatus, isVideoActive);
  //   const iframe = iframeRef.current;
  //   if (iframe && iframe.contentWindow !== null) {
  //     if (vidStatus !== isVideoActive) {
  //       console.log("Video Check");
  //       iframe.contentWindow.postMessage("VidOff", "*");
  //       setIsVideoActive(!isVideoActive);
  //     }
  //   }
  // }, [videoFeatureReducer.NormalizeVideoFlag, isVideoActive, vidStatus]);

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
                          isMeetingHost &&
                          videoFeatureReducer.participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        md={
                          isMeetingHost &&
                          videoFeatureReducer.participantWaitinglistBox
                            ? 9
                            : 12
                        }
                        sm={
                          isMeetingHost &&
                          videoFeatureReducer.participantWaitinglistBox
                            ? 9
                            : 12
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
                                videoFeatureReducer.MinimizeVideoFlag ===
                                  false &&
                                videoFeatureReducer.MaximizeVideoFlag === true
                              ? "normal-avatar-large"
                              : ""
                          }
                        >
                          {console.log(
                            "iframeiframe",
                            initiateCallRoomID,
                            callAcceptedRoomID
                          )}
                          {isMeetingHost ? (
                            <>
                              {console.log("iframeiframe", isMeetingHost)}
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
                          ) : (
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
                          )}
                        </div>
                      </Col>

                      {isMeetingHost === true &&
                      videoFeatureReducer.participantWaitinglistBox ? (
                        <>
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
                              {isMeetingHost &&
                                videoFeatureReducer.participantWaitinglistBox && (
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
      )}
    </>
  );
};

export default VideoPanelNormal;
