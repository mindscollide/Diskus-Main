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
  disableZoomBeforeJoinSession,
  incomingVideoCallFlag,
  leaveCallModal,
  leavePresenterJoinOneToOneOrOtherCall,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  nonMeetingVideoGlobalModal,
  normalizeVideoPanelFlag,
  participantPopup,
  setAudioControlHost,
  setParticipantLeaveCallForJoinNonMeetingCall,
  setRaisedUnRaisedParticiant,
  setVideoControlHost,
} from "../../../../../store/actions/VideoFeature_actions";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import { LeaveMeetingVideo } from "../../../../../store/actions/NewMeetingActions";

const VideoMaxIncoming = () => {
  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
  let typeOfMeeting = localStorage.getItem("typeOfMeeting");
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    joiningOneToOneAfterLeavingPresenterView,
    setJoiningOneToOneAfterLeavingPresenterView,
    setLeaveMeetingVideoForOneToOneOrGroup,
    setStartRecordingState,
    setPauseRecordingState,
    setResumeRecordingState,
    startRecordingState,
    pauseRecordingState,
    resumeRecordingState,
    stopRecordingState,
    setStopRecordingState,
    iframeRef,
  } = useMeetingContext();
  const { VideoMainReducer, videoFeatureReducer } = useSelector(
    (state) => state
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const IncomingVideoCallFlag = useSelector(
    (state) => state.videoFeatureReducer.IncomingVideoCallFlag
  );

  const VideoOutgoingCallFlag = useSelector(
    (state) => state.videoFeatureReducer.VideoOutgoingCallFlag
  );

  console.log("IncomingVideoCallFlag", IncomingVideoCallFlag);
  console.log("VideoOutgoingCallFlag", VideoOutgoingCallFlag);

  let currentUserId = Number(localStorage.getItem("userID"));
  let incomingRoomID = localStorage.getItem("NewRoomID");
  let callerID = Number(localStorage.getItem("callerID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let callTypeID = Number(localStorage.getItem("callTypeID"));
  let CallType = Number(localStorage.getItem("CallType"));
  let roomID = localStorage.getItem("acceptedRoomID");
  let isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck")
  );
  let isCaller = JSON.parse(localStorage.getItem("isCaller"));
  let newRoomID = localStorage.getItem("newRoomId");
  let participantRoomId = localStorage.getItem("participantRoomId");
  let initiateCallRoomID = localStorage.getItem("initiateCallRoomID");
  let activeRoomID = localStorage.getItem("activeRoomID");
  let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  let isActiveCall = localStorage.getItem("activeCall");

  let RoomID =
    presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)
      ? roomID
      : isMeetingVideo
      ? isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId
      : initiateCallRoomID
      ? initiateCallRoomID
      : activeRoomID;
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
    dispatch(incomingVideoCallFlag(true));

    // Create the audio element
    const audioElement = new Audio("/IncomingCall.wav");

    audioElement.loop = true;

    // Play the audio when the component mounts
    audioElement.play();
    console.log("busyCall");

    const timer = setTimeout(() => {
      // Dispatch action to update global state
      let NewRoomID = localStorage.getItem("NewRoomID");
      let acceptedRoomID = localStorage.getItem("acceptedRoomID");
      let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");

      let Data = {
        ReciepentID: Number(currentUserId),
        RoomID: isActiveCall ? acceptedRoomID : NewRoomID,
        CallStatusID: 3,
        CallTypeID: Number(incommingCallTypeID),
      };
      console.log("busyCall");
      dispatch(VideoCallResponse(Data, navigate, t));

      localStorage.removeItem("NewRoomID");
      localStorage.removeItem("incommingCallTypeID");
      localStorage.removeItem("incommingCallType");
      localStorage.removeItem("incommingNewCallerID");
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

  useEffect(() => {
    if (joiningOneToOneAfterLeavingPresenterView) {
      setJoiningOneToOneAfterLeavingPresenterView(false);
      const meetingHost = {
        isHost: false,
        isHostId: 0,
        isDashboardVideo: false,
      };
      localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
      let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");
      let incommingCallType = localStorage.getItem("incommingCallType");
      let incommingNewCallerID = localStorage.getItem("incommingNewCallerID");
      localStorage.setItem("callTypeID", incommingCallTypeID);
      localStorage.setItem("callType", incommingCallType);
      localStorage.setItem("newCallerID", incommingNewCallerID);
      let NewRoomID = localStorage.getItem("NewRoomID");
      localStorage.setItem("activeRoomID", NewRoomID);

      let Data = {
        ReciepentID: Number(currentUserId),
        RoomID: NewRoomID,
        CallStatusID: 1,
        CallTypeID: Number(incommingCallTypeID),
      };
      console.log("busyCall");
      dispatch(VideoCallResponse(Data, navigate, t));
      localStorage.removeItem("NewRoomID");
      localStorage.removeItem("incommingCallTypeID");
      localStorage.removeItem("incommingCallType");
      localStorage.removeItem("incommingNewCallerID");
      dispatch(incomingVideoCallFlag(false));
      dispatch(normalizeVideoPanelFlag(true));
      localStorage.setItem("activeCall", true);
      setIsTimerRunning(false);
    }
  }, [joiningOneToOneAfterLeavingPresenterView]);

  const onHandleClickForStopRecording = () => {
    return new Promise((resolve) => {
      console.log("RecordingStopMsgFromIframe");
      let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
      setStartRecordingState(true);
      setPauseRecordingState(false);
      setResumeRecordingState(false);
      setStopRecordingState(false);

      if (isZoomEnabled) {
        const iframe = iframeRef.current;

        const sendMessage = () => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("RecordingStopMsgFromIframe", "*");
            console.log("RecordingStopMsgFromIframe");
          }

          // Slight delay to allow iframe to process the message
          setTimeout(() => {
            resolve();
          }, 100);
        };

        // Host-specific path
        if (
          isMeeting &&
          isMeetingVideo &&
          isMeetingVideoHostCheck &&
          !presenterViewJoinFlag &&
          !presenterViewHostFlag
        ) {
          setTimeout(sendMessage, 1000); // 1s delay for host
        } else {
          if (isCaller && (CallType === 1 || CallType === 2)) {
            sendMessage(); // Immediate for caller
          } else {
            resolve(); // If none of the conditions matched, resolve immediately
          }
        }
      } else {
        resolve(); // Zoom not enabled, no message needed
      }
    });
  };

  const endAndAccept = async () => {
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled) {
      dispatch(disableZoomBeforeJoinSession(true));
    }
    console.log("busyCall");
    let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
    let activeCallState = JSON.parse(localStorage.getItem("activeCall"));
    console.log("busyCall", activeCallState);
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    if (isMeeting) {
      console.log("busyCall");
      if (isMeetingVideo) {
        console.log("busyCall");
        if (isZoomEnabled) {
          console.log("busyCall");
          // await dispatch(setParticipantLeaveCallForJoinNonMeetingCall(true));
          // setIsTimerRunning(false);
          if (pauseRecordingState || resumeRecordingState) {
            console.log("busyCall");
            await onHandleClickForStopRecording();
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          if (
            presenterViewFlag &&
            (presenterViewHostFlag || presenterViewJoinFlag)
          ) {
            console.log("busyCall");
            dispatch(nonMeetingVideoGlobalModal(true));
            dispatch(leavePresenterJoinOneToOneOrOtherCall(true));
          } else {
            console.log("busyCall");
            let meetinHostInfo = JSON.parse(
              localStorage.getItem("meetinHostInfo")
            );
            let currentMeetingID = JSON.parse(
              localStorage.getItem("currentMeetingID")
            );

            let newUserGUID = meetinHostInfo?.isHost
              ? localStorage.getItem("isGuid")
              : localStorage.getItem("participantUID");
            let newName = localStorage.getItem("name");
            let Data = {
              RoomID: String(RoomID),
              UserGUID: String(newUserGUID),
              Name: String(newName),
              IsHost: meetinHostInfo?.isHost ? true : false,
              MeetingID: Number(currentMeetingID),
            };
            dispatch(setRaisedUnRaisedParticiant(false));
            await dispatch(
              LeaveMeetingVideo(
                Data,
                navigate,
                t,
                3,
                null,
                setJoiningOneToOneAfterLeavingPresenterView,
                setLeaveMeetingVideoForOneToOneOrGroup
              )
            );

            const emptyArray = [];
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(emptyArray)
            );
            await dispatch(setAudioControlHost(false));
            console.log("videoHideUnHideForHost");
            await dispatch(setVideoControlHost(false));
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(maximizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            dispatch(leaveCallModal(false));
            dispatch(participantPopup(false));
            localStorage.setItem("activeCall", false);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("activeRoomID", 0);
            localStorage.setItem("isCaller", false);
            localStorage.setItem("isMeetingVideo", false);
            localStorage.setItem("MicOff", true);
            localStorage.setItem("VidOff", true);
            localStorage.setItem("isMicEnabled", false);
            localStorage.setItem("isWebCamEnabled", false);
            localStorage.setItem("activeOtoChatID", 0);
            localStorage.setItem("initiateVideoCall", false);
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
          }
        } else {
          console.log("busyCall");
          if (
            presenterViewFlag &&
            (presenterViewHostFlag || presenterViewJoinFlag)
          ) {
            console.log("busyCall");
            dispatch(nonMeetingVideoGlobalModal(true));
            dispatch(leavePresenterJoinOneToOneOrOtherCall(true));
          } else {
            console.log("busyCall");
            let meetinHostInfo = JSON.parse(
              localStorage.getItem("meetinHostInfo")
            );
            let currentMeetingID = JSON.parse(
              localStorage.getItem("currentMeetingID")
            );

            let newUserGUID = meetinHostInfo?.isHost
              ? localStorage.getItem("isGuid")
              : localStorage.getItem("participantUID");
            let newName = localStorage.getItem("name");
            let Data = {
              RoomID: String(RoomID),
              UserGUID: String(newUserGUID),
              Name: String(newName),
              IsHost: meetinHostInfo?.isHost ? true : false,
              MeetingID: Number(currentMeetingID),
            };
            dispatch(setRaisedUnRaisedParticiant(false));
            await dispatch(
              LeaveMeetingVideo(
                Data,
                navigate,
                t,
                3,
                null,
                setJoiningOneToOneAfterLeavingPresenterView,
                setLeaveMeetingVideoForOneToOneOrGroup
              )
            );

            const emptyArray = [];
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(emptyArray)
            );
            await dispatch(setAudioControlHost(false));
            console.log("videoHideUnHideForHost");
            await dispatch(setVideoControlHost(false));
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(maximizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            dispatch(leaveCallModal(false));
            dispatch(participantPopup(false));
            localStorage.setItem("activeCall", false);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("activeRoomID", 0);
            localStorage.setItem("isCaller", false);
            localStorage.setItem("isMeetingVideo", false);
            localStorage.setItem("MicOff", true);
            localStorage.setItem("VidOff", true);
            localStorage.setItem("isMicEnabled", false);
            localStorage.setItem("isWebCamEnabled", false);
            localStorage.setItem("activeOtoChatID", 0);
            localStorage.setItem("initiateVideoCall", false);
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
          }
        }
      } else {
        console.log("busyCall", activeCallState);
        if (
          presenterViewFlag &&
          (presenterViewHostFlag || presenterViewJoinFlag)
        ) {
          console.log("busyCall");
          dispatch(nonMeetingVideoGlobalModal(true));
          dispatch(leavePresenterJoinOneToOneOrOtherCall(true));
        } else if (activeCallState) {
          console.log("busyCall");
          let Data = {
            OrganizationID: currentOrganization,
            RoomID: RoomID,
            IsCaller: callerID === currentUserId ? true : false,
            CallTypeID: callTypeID,
          };
          await dispatch(LeaveCall(Data, navigate, t, 1, setIsTimerRunning));
        } else {
          console.log("busyCall");
          const meetingHost = {
            isHost: false,
            isHostId: 0,
            isDashboardVideo: false,
          };
          localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
          let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");
          let incommingCallType = localStorage.getItem("incommingCallType");
          let incommingNewCallerID = localStorage.getItem(
            "incommingNewCallerID"
          );

          localStorage.setItem("callTypeID", incommingCallTypeID);
          localStorage.setItem("callType", incommingCallType);
          localStorage.setItem("newCallerID", incommingNewCallerID);
          let NewRoomID = localStorage.getItem("NewRoomID");
          localStorage.setItem("activeRoomID", NewRoomID);

          let Data = {
            ReciepentID: currentUserId,
            RoomID: NewRoomID,
            CallStatusID: 1,
            CallTypeID: Number(incommingCallTypeID),
          };
          console.log("busyCall");
          await dispatch(VideoCallResponse(Data, navigate, t));
          localStorage.removeItem("NewRoomID");
          localStorage.removeItem("incommingCallTypeID");
          localStorage.removeItem("incommingCallType");
          localStorage.removeItem("incommingNewCallerID");
          dispatch(incomingVideoCallFlag(false));
          dispatch(normalizeVideoPanelFlag(true));
          localStorage.setItem("activeCall", true);
          setIsTimerRunning(false);
        }
      }
    } else if (activeCallState) {
      console.log("busyCall");
      let Data = {
        OrganizationID: currentOrganization,
        RoomID: RoomID,
        IsCaller: callerID === currentUserId ? true : false,
        CallTypeID: callTypeID,
      };
      await dispatch(LeaveCall(Data, navigate, t, 1, setIsTimerRunning));
    } else {
      console.log("busyCall");
      let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");
      let incommingCallType = localStorage.getItem("incommingCallType");
      let incommingNewCallerID = localStorage.getItem("incommingNewCallerID");

      localStorage.setItem("callTypeID", incommingCallTypeID);
      localStorage.setItem("callType", incommingCallType);
      localStorage.setItem("newCallerID", incommingNewCallerID);

      const meetingHost = {
        isHost: false,
        isHostId: 0,
        isDashboardVideo: false,
      };
      localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
      let NewRoomID = localStorage.getItem("NewRoomID");
      localStorage.setItem("activeRoomID", NewRoomID);
      let Data = {
        ReciepentID: currentUserId,
        RoomID: NewRoomID,
        CallStatusID: 1,
        CallTypeID: Number(incommingCallTypeID),
      };
      console.log("busyCall");
      await dispatch(VideoCallResponse(Data, navigate, t));
      localStorage.removeItem("NewRoomID");
      localStorage.removeItem("incommingCallTypeID");
      localStorage.removeItem("incommingCallType");
      localStorage.removeItem("incommingNewCallerID");
      dispatch(incomingVideoCallFlag(false));
      dispatch(normalizeVideoPanelFlag(true));
      localStorage.setItem("activeCall", true);
      setIsTimerRunning(false);
    }
  };

  const rejectCall = async () => {
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled) {
      dispatch(disableZoomBeforeJoinSession(false));
    }
    console.log("busyCall");
    console.log("busyCall", incomingRoomID);
    let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");
    let NewRoomID = localStorage.getItem("NewRoomID");

    let Data = {
      ReciepentID: currentUserId,
      RoomID: NewRoomID,
      CallStatusID: 2,
      CallTypeID: Number(incommingCallTypeID),
    };
    console.log("busyCall");
    await dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    console.log("busyCall");
    // localStorage.setItem("activeCall", false);
    localStorage.removeItem("NewRoomID");
    localStorage.removeItem("incommingCallTypeID");
    localStorage.removeItem("incommingCallType");
    localStorage.removeItem("incommingNewCallerID");
    setIsTimerRunning(false);
  };

  const busyCall = async () => {
    let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled) {
      dispatch(disableZoomBeforeJoinSession(false));
    }
    console.log("busyCall");
    let incommingCallTypeID = localStorage.getItem("incommingCallTypeID");
    let NewRoomID = localStorage.getItem("NewRoomID");

    let Data = {
      ReciepentID: currentUserId,
      RoomID: NewRoomID,
      CallStatusID: 5,
      CallTypeID: Number(incommingCallTypeID),
    };
    console.log("busyCall");
    await dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    setIsTimerRunning(false);
    localStorage.removeItem("NewRoomID");
    localStorage.removeItem("incommingCallTypeID");
    localStorage.removeItem("incommingCallType");
    localStorage.removeItem("incommingNewCallerID");
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
                  {activeCallState === false ? (
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
                          onClick={endAndAccept}
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
