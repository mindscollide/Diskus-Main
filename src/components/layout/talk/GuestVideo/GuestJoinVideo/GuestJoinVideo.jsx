import React, { useState, useRef, useEffect } from "react";
import "./GuestJoinVideo.css";
import { Row, Col, Container } from "react-bootstrap";
import { Button, TextField } from "../../../../elements";
import ProfileUser from "../../../../../assets/images/Recent Activity Icons/Video/profileIcon.png";
import VideoOn from "../../../../../assets/images/Recent Activity Icons/Video/VideoOn.png";
import VideoOff from "../../../../../assets/images/Recent Activity Icons/Video/VideoOff.png";
import MicOff from "../../../../../assets/images/Recent Activity Icons/Video/MicOff.png";
import MicOn from "../../../../../assets/images/Recent Activity Icons/Video/MicOn.png";
import RemoveImage from "../../../../../assets/images/Recent Activity Icons/Video/RemoveImage.png";
import PresentationJoinIcon from "../../../../../assets/images/VideoCall/PresentationJoinIcon.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import {
  getValidateString,
  guestVideoNavigationScreen,
  joinGuestVideoMainApi,
  makeStreamStop,
  setVideoCameraGuest,
  setVoiceControleGuest,
} from "../../../../../store/actions/Guest_Video";
import { useSelector } from "react-redux";

/**
 * @component GuestJoinVideo
 * @description Pre-join lobby screen for unauthenticated guest participants
 * entering a video call. Allows the guest to enter their display name,
 * preview their local webcam feed, and toggle microphone/camera on or off
 * before requesting to join. On submission the component dispatches
 * `joinGuestVideoMainApi` which places the guest in the host's waiting room.
 * Handles the rejoin flow (re-populates name from sessionStorage when
 * `isRejoining` flag is set) and responds to Redux stream-stop signals that
 * can redirect the guest to the approved (screen 2) or rejected (screen 3)
 * navigation state.
 *
 * @param {number} extractMeetingId - Numeric ID of the target meeting,
 *   extracted from the validated encrypted URL and passed to the join API.
 * @param {string} extractMeetingTitle - Human-readable title of the meeting
 *   displayed on the lobby UI.
 * @param {Function} onJoinNameChange - Callback invoked with the guest's
 *   entered display name so the parent component can store and pass it to
 *   subsequent screens.
 */
const GuestJoinVideo = ({
  extractMeetingId,
  extractMeetingTitle,
  onJoinNameChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const guestVideoNavigationData = useSelector(
    (state) => state.GuestVideoReducer.guestVideoNavigationData
  );

  // to get Validate room ID
  const getValidateStringData = useSelector(
    (state) => state.GuestVideoReducer.validateStringData
  );
  const setStreamTypeForNavigate = useSelector(
    (state) => state.GuestVideoReducer.setStreamTypeForNavigate
  );
  const setStreamStop = useSelector(
    (state) => state.GuestVideoReducer.setStreamStop
  );
  console.log(getValidateStringData, "getValidateRoomIdgetValidateRoomId");

  // The invite link was opened while a presentation is running (from the validate API)
  // guestInPresentation covers a guest admitted/removed in a presentation whose page-load validate flag was false
  // presentationEnded: the presentation request answered that it is over, so the lobby is a normal meeting lobby again
  const [presentationEnded, setPresentationEnded] = useState(false);
  const isPresentationGuest =
    !presentationEnded &&
    (Boolean(getValidateStringData?.isPresenterViewStarted) ||
      sessionStorage.getItem("guestInPresentation") === "true");
  // This guest was inside the presentation (admitted or removed), so its rejoin goes through JoinPresentationGuestRequest
  const leftPresentation =
    isPresentationGuest &&
    sessionStorage.getItem("guestInPresentation") === "true";
  // Latest value for the one-time camera/mic effect below
  const presentationGuestRef = useRef(isPresentationGuest);
  presentationGuestRef.current = isPresentationGuest;

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [streamAudio, setStreamAudio] = useState(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [getReady, setGetReady] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);
  const [rejoinState, setRejoinState] = useState(false);

  const [joinName, setJoinName] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const [validateRoomId, setValidateRoomId] = useState("");
  const [validateHostEmail, setValidateHostEmail] = useState("");
  const [joinButton, setJoinButton] = useState(false);
  // True when Join Now was pressed on the "Presentation is started" view (not on a rejoin)
  const [joinedAsPresentation, setJoinedAsPresentation] = useState(false);
  console.log(joinButton, "joinButtonjoinButton");

  console.log(
    { validateRoomId, validateHostEmail },
    "validateRoomIdvalidateRoomId"
  );

  const getRejoin = sessionStorage.getItem("isRejoining") === "true";

  // Stored as the string "true"/"false"; "false" is truthy, so compare explicitly
  let isZoomEnabled =
    String(sessionStorage.getItem("isZoomEnabled")).toLowerCase() === "true";

  // for set Video Web Cam on CLick
  const toggleAudio = (enable, check) => {
    // Presentation guests cannot turn the mic on from the lobby
    if (isPresentationGuest) return;
    console.log(enable, "updatedUrlupdatedUrlupdatedUrl");
    console.log(check, "updatedUrlupdatedUrlupdatedUrl");
    dispatch(setVoiceControleGuest(!enable));
    if (enable) {
      sessionStorage.setItem("isMicEnabled", true);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((audioStream) => {
          // Stop any existing audio tracks before starting a new one
          if (streamAudio) {
            streamAudio.getAudioTracks().forEach((track) => track.stop());
          }

          const newStream = new MediaStream([audioStream.getAudioTracks()[0]]);
          setStreamAudio(newStream);
          setIsMicEnabled(true);
        })
        .catch((error) => {
          alert("Error accessing microphone: " + error.message);
        });
    } else {
      sessionStorage.setItem("isMicEnabled", false);
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      setIsMicEnabled(false); // Microphone is now disabled
    }
  };

  // Toggle Video (Webcam)
  const toggleVideo = (enable) => {
    // Presentation guests cannot turn the camera on from the lobby
    if (isPresentationGuest) return;
    console.log(enable, "updatedUrlupdatedUrlupdatedUrl");
    console.log("enableVideo", !enable);
    sessionStorage.setItem("enableVideo", !enable);
    dispatch(setVideoCameraGuest(!enable));

    if (enable) {
      if (isZoomEnabled) {
        sessionStorage.setItem("isWebCamEnabled", true);
      }
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
          setIsWebCamEnabled(true);
        })
        .catch((error) => {
          alert("Error accessing webcam: " + error.message);
        });
    } else {
      sessionStorage.setItem("isWebCamEnabled", false);
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream from state
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the video source
        }
      }
      setIsWebCamEnabled(false); // Webcam is now disabled
    }
  };

  // Camera and mic back on once the presentation turned out to be over; resolves false if the browser refuses
  const restoreMediaAfterPresentation = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
      setStream(mediaStream);
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        setStreamAudio(new MediaStream([audioTrack]));
      }
      setIsWebCamEnabled(true);
      setIsMicEnabled(true);
      sessionStorage.setItem("isMicEnabled", true);
      sessionStorage.setItem("isWebCamEnabled", true);
      sessionStorage.setItem("enableVideo", false);
      dispatch(setVoiceControleGuest(false));
      dispatch(setVideoCameraGuest(false));
      return true;
    } catch (error) {
      console.error("src/components/layout/talk/GuestVideo/GuestJoinVideo:", error);
      return false;
    }
  };

  const handleNameChange = (e) => {
    setJoinName(e.target.value);
    setErrorMessage(false);
  };

  // extract and set validate room ID into join Meeting
  useEffect(() => {
    if (getValidateStringData) {
      setValidateRoomId(getValidateStringData.roomID || "");
      setValidateHostEmail(getValidateStringData.hostEmail || "");
    } else {
      setValidateRoomId("");
      setValidateHostEmail("");
    }
  }, [getValidateStringData]);

  const onJoinNowButton = () => {
    if (joinName === "") {
      setErrorMessage(true);
    } else {
      setJoinButton(true);
      setErrorMessage(false);
      setGetReady(true);
      setIsWaiting(true); // Show the waiting room text
      setRejoinState(false); // Exit rejoin state
      onJoinNameChange(joinName);
      sessionStorage.setItem("guestName", joinName);
      sessionStorage.removeItem("isRejoining");

      // The "Presentation is started" view sends the presentation request; a rejoin does too if the guest had been inside the presentation, otherwise it keeps JoinGuestVideo
      const isPresentationJoin =
        isPresentationGuest && (!rejoinState || leftPresentation);
      setJoinedAsPresentation(isPresentationJoin);
      let data = {
        MeetingId: extractMeetingId,
        RoomID: validateRoomId,
        GuestName: joinName,
        IsMuted: isPresentationJoin || !isMicEnabled,
        HideVideo: isPresentationJoin || !isWebCamEnabled,
        ...(isPresentationJoin ? {} : { HostEmail: validateHostEmail }),
      };
      const backToLobby = () => {
        setIsWaiting(false);
        setGetReady(false);
        setJoinButton(false);
      };
      // Only one switch per click, so a backend that keeps answering _04 cannot ping-pong between the two joins
      let switched = false;

      // Presentation is running: send the presentation request with camera and mic off
      const sendPresentationJoin = () => {
        sessionStorage.setItem("guestInPresentation", "true");
        setJoinedAsPresentation(true);
        const { HostEmail, ...presentationData } = data;
        dispatch(
          joinGuestVideoMainApi(
            navigate,
            t,
            { ...presentationData, IsMuted: true, HideVideo: true },
            setJoinButton,
            true,
            onPresentationCheck,
          ),
        );
      };

      // Presentation is over: turn camera and mic back on, then fall back to the normal waiting-room join
      const sendMeetingJoin = async () => {
        sessionStorage.removeItem("guestInPresentation");
        setPresentationEnded(true);
        setJoinedAsPresentation(false);
        // The page-load validate flag would otherwise bring the presentation view back on a later lobby
        if (getValidateStringData) {
          dispatch(
            getValidateString({
              ...getValidateStringData,
              isPresenterViewStarted: false,
            }),
          );
        }
        const mediaOk = await restoreMediaAfterPresentation();
        dispatch(
          joinGuestVideoMainApi(
            navigate,
            t,
            {
              ...data,
              IsMuted: !mediaOk,
              HideVideo: !mediaOk,
              HostEmail: validateHostEmail,
            },
            setJoinButton,
            false,
            onPresentationCheck,
          ),
        );
      };

      // Join answered _04 with isPresenterViewStarted: switch to the other join once, otherwise back to the lobby
      const onPresentationCheck = (isPresenterViewStarted) => {
        if (switched) {
          backToLobby();
          return;
        }
        if (isPresentationJoin && !isPresenterViewStarted) {
          switched = true;
          sendMeetingJoin();
        } else if (!isPresentationJoin && isPresenterViewStarted) {
          switched = true;
          sendPresentationJoin();
        } else {
          backToLobby();
        }
      };
      dispatch(
        joinGuestVideoMainApi(
          navigate,
          t,
          data,
          setJoinButton,
          isPresentationJoin,
          onPresentationCheck,
        ),
      );
    }
  };

  useEffect(() => {
    const savedName = sessionStorage.getItem("guestName");
    const isRejoining = sessionStorage.getItem("isRejoining") === "true";
    console.log(
      { savedName, isRejoining },
      "isRejoiningisRejoiningisRejoiningF"
    );
    if (isRejoining) {
      setJoinName(savedName || ""); // Populate name from storage
      setGetReady(false); // Ensure waiting state is not active
      setRejoinState(true); // Show "You've-left-the-meeting" condition
      setIsWaiting(false);
      sessionStorage.removeItem("isRejoining"); // Clear rejoin flag
    } else {
      setJoinName(""); // Reset name
      setGetReady(false); // Default state on refresh
      setRejoinState(false); // Show "Ready-to-join" condition
      setIsWaiting(false);
    }
  }, []);

  // Latest streams for the unmount cleanup (state in a closure would be stale)
  const streamRef = useRef(null);
  const streamAudioRef = useRef(null);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);
  useEffect(() => {
    streamAudioRef.current = streamAudio;
  }, [streamAudio]);

  useEffect(() => {
    // Automatically enable the webcam and mic once on initial load. Re-enabling
    // later is handled by toggleVideo / toggleAudio.
    let cancelled = false;
    const mediaDevices = navigator.mediaDevices;
    // Presentation guests join with camera and mic off, so no preview or permission prompt
    if (presentationGuestRef.current) {
      return undefined;
    }
    mediaDevices
      ?.getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        if (cancelled || presentationGuestRef.current) {
          // Lobby already left before permission resolved
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        if (video) {
          video.srcObject = mediaStream;
          video.muted = true;
          video.play();
        }
        setStream(mediaStream); // Store the stream to disable later
        // Track the mic separately so toggleAudio(false) can stop it
        const audioTrack = mediaStream.getAudioTracks()[0];
        if (audioTrack) {
          setStreamAudio(new MediaStream([audioTrack]));
        }
        setIsWebCamEnabled(true); // Webcam is now enabled
      })
      .catch((error) => {
        alert(error.message);
      });
    return () => {
      cancelled = true;
      // Stop the preview camera and mic when leaving the lobby
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamAudioRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  // Presentation guests: camera and mic stay off (covers the validate flag arriving after the preview started)
  useEffect(() => {
    if (!isPresentationGuest) return;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamAudioRef.current?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setStreamAudio(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebCamEnabled(false);
    setIsMicEnabled(false);
    sessionStorage.setItem("isMicEnabled", false);
    sessionStorage.setItem("isWebCamEnabled", false);
    sessionStorage.setItem("enableVideo", true);
    dispatch(setVoiceControleGuest(true));
    dispatch(setVideoCameraGuest(true));
  }, [isPresentationGuest]);

  useEffect(() => {
    if (setStreamStop) {
      if (streamAudio) {
        streamAudio.getAudioTracks().forEach((track) => track.stop());
        setStreamAudio(null); // Clear the stream from state
      }
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream from state
        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the video source
        }
      }
      if (Number(setStreamTypeForNavigate) === 2) {
        dispatch(guestVideoNavigationScreen(2));
      } else if (Number(setStreamTypeForNavigate) === 3) {
        dispatch(guestVideoNavigationScreen(3));
      }
      dispatch(makeStreamStop(false, 0));
    }
  }, [setStreamStop]);
  return (
    <Container fluid>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {
            <>
              <div className="guest-join-video-main">
                <Container>
                  <Row>
                    <label className="name-label">
                      {t("Name")}
                      <span className="aesterick-name">*</span>
                    </label>
                    <Col lg={5} md={5} sm={12}>
                      <TextField
                        name={"joinName"}
                        value={joinName}
                        change={handleNameChange}
                        labelclass="d-none"
                        placeholder={"Enter your name"}
                        disable={getReady || rejoinState}
                      />
                      <span>
                        <p className="name-field-error">
                          {errorMessage ? "Please enter your name" : null}
                        </p>
                      </span>

                      <div
                        className="video-tag-name"
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
                              <video ref={videoRef} playsInline muted className="video-size" />
                            </div>
                          </div>

                          <div className="mic-vid-buttons">
                            {isMicEnabled ? (
                              <Tooltip
                                placement="topRight"
                                title={t("Disable-mic")}
                              >
                                <img
                                  src={MicOn}
                                  className="cursor-pointer"
                                  onClick={() => toggleAudio(false, 2)}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                placement="topRight"
                                title={t("Enable-mic")}
                              >
                                <img
                                  src={MicOff}
                                  className="cursor-pointer"
                                  onClick={() => toggleAudio(true, 1)}
                                />
                              </Tooltip>
                            )}

                            {isWebCamEnabled ? (
                              <Tooltip
                                placement="topRight"
                                title={t("Disable-video")}
                              >
                                <img
                                  className="cursor-pointer"
                                  onClick={() => toggleVideo(false, 2)}
                                  src={VideoOn}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                placement="topRight"
                                title={t("Enable-video")}
                              >
                                <img
                                  className="cursor-pointer"
                                  onClick={() => toggleVideo(true, 1)}
                                  src={VideoOff}
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col lg={7} md={7} sm={12}>
                      <div className="guest-video-inside-component">
                        {isWaiting && joinedAsPresentation ? (
                          <div className="guest-presentation-getting-ready">
                            <p className="guest-presentation-getting-ready-title">
                              {t("Guest-presentation-getting-ready")}
                            </p>
                            <div className="guest-presentation-spinner" />
                            <p className="guest-presentation-getting-ready-message">
                              {t("Guest-presentation-getting-ready-message")}
                            </p>
                          </div>
                        ) : isWaiting ? (
                          <div className="waiting-text-animation">
                            <p className="waiting-room-class">
                              {t("You-are-in-the-waiting-room")}
                            </p>
                            <p className="organizer-allow-class">
                              {t(
                                "The-organizer-will-allow-you-to-join-shortly"
                              )}
                            </p>
                          </div>
                        ) : rejoinState ? (
                          <>
                            {leftPresentation ? (
                              <img
                                src={RemoveImage}
                                alt=""
                                className="guest-presentation-left-icon"
                              />
                            ) : null}
                            <p className="left-meeting-text">
                              {leftPresentation
                                ? t("Guest-left-presentation")
                                : t("You've-left-the-meeting")}
                            </p>
                            <p className="left-meeting-rejoin-text">
                              {t(
                                "Want-to-rejoin?-click-here-to-return-to-the-session"
                              )}
                            </p>
                            <Button
                              text={t("Rejoin")}
                              className="Join-Now-Btn"
                              onClick={onJoinNowButton}
                            />
                          </>
                        ) : !getReady ? (
                          <>
                            {isPresentationGuest ? (
                              <>
                                <img
                                  src={PresentationJoinIcon}
                                  alt=""
                                  className="guest-presentation-icon"
                                />
                                <p className="guest-presentation-ready">
                                  {t("Presentation-join-ready")}
                                </p>
                              </>
                            ) : (
                              <p className="ready-to-join">
                                {t("Ready-to-join")}
                              </p>
                            )}
                            <Button
                              disableBtn={joinButton}
                              text={t("Join-now")}
                              className="Join-Now-Btn"
                              onClick={onJoinNowButton}
                            />
                          </>
                        ) : null}

                        {/* {!getReady ? (
                          <>
                            <p className="ready-to-join">
                              {t("Ready-to-join")}
                            </p>
                            <Button
                              text={t("Join-now")}
                              className="Join-Now-Btn"
                              onClick={onJoinNowButton}
                            />
                          </>
                        ) : (
                          <>
                            <div className="waiting-text-animation">
                              <p className="waiting-room-class">
                                {t("You-are-in-the-waiting-room")}
                              </p>
                              <p className="organizer-allow-class">
                                {t(
                                  "The-organizer-will-allow-you-to-join-shortly"
                                )}
                              </p>
                            </div>
                          </>
                        )} */}

                        {/* {
                          <>
                            <p className="left-meeting-text">
                              {t("You've-left-the-meeting")}
                            </p>
                            <p className="left-meeting-rejoin-text">
                              {t(
                                "Want-to-rejoin?-click-here-to-return-to-the-session"
                              )}
                            </p>
                            <Button
                              text={t("Rejoin")}
                              className="Join-Now-Btn"
                              onClick={onJoinNowButton}
                            />
                          </>
                        } */}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default GuestJoinVideo;
