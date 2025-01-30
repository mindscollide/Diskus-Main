import React, { useState, useEffect } from "react";
import "./VideoMaxIncoming.css";
import {
  VideoCallResponse,
  LeaveCall,
} from "../../../../../store/actions/VideoMain_actions";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../elements";
import videoEndIcon from "../../../../../assets/images/newElements/VideoEndIcon.png";
import videoAttendIcon from "../../../../../assets/images/newElements/VideoAttendIcon.png";
import BusyIcon from "../../../../../assets/images/newElements/BusyIcon.png";
import {
  incomingVideoCallFlag,
  normalizeVideoPanelFlag,
  setAudioControlForParticipant,
  setAudioControlHost,
  setParticipantLeaveCallForJoinNonMeetingCall,
  setVideoControlForParticipant,
  setVideoControlHost,
} from "../../../../../store/actions/VideoFeature_actions";
import {
  LeaveCurrentMeeting,
  LeaveMeetingVideo,
} from "../../../../../store/actions/NewMeetingActions";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";

const VideoMaxIncoming = () => {
  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
  let typeOfMeeting = localStorage.getItem("typeOfMeeting");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { VideoMainReducer, videoFeatureReducer } = useSelector(
    (state) => state
  );

  let currentUserId = Number(localStorage.getItem("userID"));

  let incomingRoomID = localStorage.getItem("NewRoomID");

  let activeRoomID = localStorage.getItem("activeRoomID");

  let acceptedRoomID = localStorage.getItem("acceptedRoomID");

  let callerID = Number(localStorage.getItem("callerID"));

  let currentOrganization = Number(localStorage.getItem("organizationID"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  const [isVisible, setIsVisible] = useState(true);

  const [incomingCallerData, setIncomingCallerData] = useState([]);

  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (
      VideoMainReducer.InitiateVideoCallDataMQTT !== undefined &&
      VideoMainReducer.InitiateVideoCallDataMQTT !== null &&
      VideoMainReducer.InitiateVideoCallDataMQTT.length !== 0
    ) {
      console.log("busyCall");
      setIncomingCallerData(VideoMainReducer.InitiateVideoCallDataMQTT);
    } else {
      setIncomingCallerData([]);
    }
  }, [VideoMainReducer?.InitiateVideoCallDataMQTT]);

  let timeValue = Number(localStorage.getItem("callRingerTimeout"));
  timeValue = timeValue * 1000;

  useEffect(() => {
    // Create the audio element
    const audioElement = new Audio("/IncomingCall.wav");

    audioElement.loop = true;

    // Play the audio when the component mounts
    audioElement.play();
    console.log("busyCall");

    const timer = setTimeout(() => {
      // Dispatch action to update global state
      let Data = {
        ReciepentID: currentUserId,
        RoomID: incomingRoomID,
        CallStatusID: 3,
        CallTypeID: callTypeID,
      };
      dispatch(VideoCallResponse(Data, navigate, t));

      dispatch(incomingVideoCallFlag(false));
      setIsVisible(false);
      audioElement.pause();
      audioElement.currentTime = 0;
      console.log("busyCall");
    }, timeValue);

    // Clear the timer if isTimerRunning becomes false

    if (!isTimerRunning) {
      clearTimeout(timer);
    }

    return () => {
      console.log("busyCall");
      audioElement.pause();
      audioElement.currentTime = 0;
      clearTimeout(timer);
    };
  }, []);

  // useEffect(() => {

  // }, [])

  const acceptCall = () => {
    console.log("busyCall");
    const meetingHost = {
      isHost: false,
      isHostId: 0,
      isDashboardVideo: false,
    };
    localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
    let Data = {
      ReciepentID: currentUserId,
      RoomID: activeCallState === true ? activeRoomID : incomingRoomID,
      CallStatusID: 1,
      CallTypeID: callTypeID,
    };
    dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    dispatch(normalizeVideoPanelFlag(true));
    localStorage.setItem("activeCall", true);
    setIsTimerRunning(false);
  };

  const endAndAccept = async () => {
    console.log("busyCall");
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

    if (isMeeting) {
      if (isMeetingVideo) {
        let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
        if (isZoomEnabled) {
          await dispatch(setParticipantLeaveCallForJoinNonMeetingCall(true));
          setIsTimerRunning(false);
        } else {
          let meetinHostInfo = JSON.parse(
            localStorage.getItem("meetinHostInfo")
          );
          let currentMeetingID = JSON.parse(
            localStorage.getItem("currentMeetingID")
          );
          let newRoomID = meetinHostInfo?.isHost
            ? localStorage.getItem("newRoomId")
            : localStorage.getItem("activeRoomID");
          let newUserGUID = meetinHostInfo?.isHost
            ? localStorage.getItem("isGuid")
            : localStorage.getItem("participantUID");
          let newName = localStorage.getItem("name");

          let Data = {
            RoomID: String(newRoomID),
            UserGUID: String(newUserGUID),
            Name: String(newName),
            IsHost: meetinHostInfo?.isHost ? true : false,
            MeetingID: Number(currentMeetingID),
          };
          await dispatch(LeaveMeetingVideo(Data, navigate, t));
          await dispatch(setAudioControlHost(false));
          await dispatch(setAudioControlForParticipant(false));
          console.log("videoHideUnHideForHost");
          await dispatch(setVideoControlHost(false));
          await dispatch(setVideoControlForParticipant(false));
          localStorage.setItem("isMicEnabled", false);
          localStorage.setItem("isWebCamEnabled", false);
          localStorage.setItem("activeOtoChatID", 0);
          localStorage.setItem("initiateVideoCall", false);
          localStorage.setItem("activeRoomID", 0);
          localStorage.setItem("meetingVideoID", 0);
          localStorage.setItem("newCallerID", 0);
          localStorage.setItem("callerStatusObject", JSON.stringify([]));
          localStorage.removeItem("newRoomId");
          localStorage.removeItem("isHost");
          localStorage.removeItem("isGuid");
          localStorage.removeItem("hostUrl");
          localStorage.removeItem("VideoView");
          localStorage.removeItem("videoIframe");
          localStorage.removeItem("CallType");

          let Data2 = {
            ReciepentID: currentUserId,
            RoomID: activeRoomID,
            CallStatusID: 1,
            CallTypeID: callTypeID,
          };
          dispatch(VideoCallResponse(Data2, navigate, t));
          dispatch(incomingVideoCallFlag(false));
          setIsTimerRunning(false);
        }
      } else {
        let Data = {
          OrganizationID: currentOrganization,
          RoomID: acceptedRoomID,
          IsCaller: callerID === currentUserId ? true : false,
          CallTypeID: callTypeID,
        };
        await dispatch(LeaveCall(Data, navigate, t));
        localStorage.setItem("activeOtoChatID", 0);
        localStorage.setItem("initiateVideoCall", false);
        localStorage.setItem("activeRoomID", 0);
        localStorage.setItem("meetingVideoID", 0);
        localStorage.setItem("newCallerID", 0);
        localStorage.setItem("callerStatusObject", JSON.stringify([]));
        localStorage.removeItem("newRoomId");
        localStorage.removeItem("isHost");
        localStorage.removeItem("isGuid");
        localStorage.removeItem("hostUrl");
        localStorage.removeItem("VideoView");
        localStorage.removeItem("videoIframe");
        localStorage.removeItem("CallType");
        let Data2 = {
          ReciepentID: currentUserId,
          RoomID: activeRoomID,
          CallStatusID: 1,
          CallTypeID: callTypeID,
        };
        dispatch(VideoCallResponse(Data2, navigate, t));
        dispatch(incomingVideoCallFlag(false));
        setIsTimerRunning(false);
      }
    } else {
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: acceptedRoomID,
        IsCaller: callerID === currentUserId ? true : false,
        CallTypeID: callTypeID,
      };
      await dispatch(LeaveCall(Data, navigate, t));
      localStorage.setItem("isCaller", false);
      let Data2 = {
        ReciepentID: currentUserId,
        RoomID: activeRoomID,
        CallStatusID: 1,
        CallTypeID: callTypeID,
      };
      dispatch(VideoCallResponse(Data2, navigate, t));
      dispatch(incomingVideoCallFlag(false));
      setIsTimerRunning(false);
    }
  };

  const rejectCall = () => {
    console.log("busyCall");
    console.log("busyCall", incomingRoomID);

    let Data = {
      ReciepentID: currentUserId,
      RoomID: incomingRoomID,
      CallStatusID: 2,
      CallTypeID: callTypeID,
    };
    dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    console.log("busyCall");
    localStorage.setItem("activeCall", false);
    setIsTimerRunning(false);
  };

  const busyCall = () => {
    console.log("busyCall");
    let Data = {
      ReciepentID: currentUserId,
      RoomID: activeRoomID,
      CallStatusID: 5,
      CallTypeID: callTypeID,
    };
    dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    setIsTimerRunning(false);
  };

  // Use the global state to control whether the timer should run
  useEffect(() => {
    if (!videoFeatureReducer.IncomingVideoFlag) {
      setIsTimerRunning(false); // Stop the timer
    }
  }, [videoFeatureReducer.IncomingVideoFlag]);

  //For Ringer Incoming If page is Refereshed
  useEffect(() => {
    let RingerCallCheckFlag = JSON.parse(
      localStorage.getItem("RingerCallCheckFlag")
    );

    const handleBeforeUnload = async (event) => {
      if (RingerCallCheckFlag) {
        localStorage.removeItem("RingerCallCheckFlag");
        await rejectCall();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);
  console.log(
    "hhhhhhhhhhhhhh",
    activeCallState === true ||
      (isMeeting && typeOfMeeting === "isQuickMeeting")
  );
  console.log("hhhhhhhhhhhhhh", typeOfMeeting);
  console.log("hhhhhhhhhhhhhh", activeCallState);

  console.log("hhhhhhhhhhhhhh", isMeeting);
  return (
    <>
      {isVisible && (
        <div
          className={
            activeCallState === true ||
            (isMeeting && typeOfMeeting === "isQuickMeeting")
              ? "videoIncoming-active-call"
              : "videoIncoming-max-call"
          }
        >
          <Container>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <div
                  className={
                    activeCallState === true ||
                    (isMeeting && typeOfMeeting === "isQuickMeeting")
                      ? "avatar-column-active-call"
                      : "avatar-column-max-call"
                  }
                >
                  {activeCallState === false && !isMeeting ? (
                    // <img
                    //   src={`data:image/jpeg;base64,${incomingCallerData.callerProfilePicture}`}
                    //   width={150}
                    //   alt="Avatar video"
                    // />
                    <div
                      className="video-incoming-icon"
                      style={{
                        backgroundImage: `url('data:image/jpeg;base64,${incomingCallerData.callerProfilePicture}')`,
                      }}
                    ></div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="someone-calling-title-max-call">
                  <p
                    className={
                      activeCallState === true ||
                      (isMeeting && typeOfMeeting === "isQuickMeeting")
                        ? "outgoing-call-text-active-call"
                        : "outgoing-call-text-max-call"
                    }
                  >
                    {incomingCallerData.length !== 0 &&
                    incomingCallerData !== undefined &&
                    incomingCallerData !== null
                      ? incomingCallerData.callerName
                      : null}
                  </p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="calling-title-max-call">
                  <p className="calling-text-max-call">
                    {t("Calling") + "..."}
                  </p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    activeCallState === true ||
                    (isMeeting && typeOfMeeting === "isQuickMeeting")
                      ? "d-flex justify-content-center"
                      : "d-flex justify-content-end"
                  }
                >
                  {activeCallState === true ||
                  (isMeeting && typeOfMeeting === "isQuickMeeting") ? (
                    <>
                      <div className="incoming-action">
                        <Button
                          className={
                            activeCallState === true ||
                            (isMeeting && typeOfMeeting === "isQuickMeeting")
                              ? "button-active-img"
                              : "button-img"
                          }
                          icon={<img src={BusyIcon} width={50} alt="" />}
                          onClick={busyCall}
                          style={{ paddingBottom: "0" }}
                        />
                        <span
                          className={
                            activeCallState === true ||
                            (isMeeting && typeOfMeeting === "isQuickMeeting")
                              ? "incoming-active-text"
                              : "incoming-text"
                          }
                        >
                          {t("Busy")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="incoming-action">
                        <Button
                          className="button-img-max-call"
                          icon={<img src={videoEndIcon} width={50} alt="" />}
                          onClick={rejectCall}
                        />
                        <span className="incoming-text">{t("Reject")}</span>
                      </div>
                    </>
                  )}
                </div>
              </Col>

              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    activeCallState === true ||
                    (isMeeting && typeOfMeeting === "isQuickMeeting")
                      ? "d-flex justify-content-center"
                      : "d-flex justify-content-start"
                  }
                >
                  {activeCallState === true ||
                  (isMeeting && typeOfMeeting === "isQuickMeeting") ? (
                    <>
                      <div className="incoming-action">
                        <Button
                          style={
                            activeCallState === true ||
                            (isMeeting && typeOfMeeting === "isQuickMeeting")
                              ? { paddingBottom: "0" }
                              : null
                          }
                          className={
                            activeCallState === true ||
                            (isMeeting && typeOfMeeting === "isQuickMeeting")
                              ? "button-active-img"
                              : "button-img"
                          }
                          icon={<img src={videoAttendIcon} width={50} alt="" />}
                          onClick={endAndAccept}
                        />
                        <span
                          className={
                            activeCallState === true ||
                            (isMeeting && typeOfMeeting === "isQuickMeeting")
                              ? "incoming-active-text"
                              : "incoming-text"
                          }
                        >
                          {t("End-&-accept")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="incoming-action">
                        <Button
                          className="button-img"
                          icon={<img src={videoAttendIcon} width={50} alt="" />}
                          onClick={acceptCall}
                        />
                        <span className="incoming-text">{t("Accept")}</span>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default VideoMaxIncoming;
