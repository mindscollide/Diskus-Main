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
import videoAvatar from "../../../../../assets/images/newElements/VideoAvatar.png";
import videoAttendIcon from "../../../../../assets/images/newElements/VideoAttendIcon.png";
import BusyIcon from "../../../../../assets/images/newElements/BusyIcon.png";
import {
  incomingVideoCallFlag,
  normalizeVideoPanelFlag,
} from "../../../../../store/actions/VideoFeature_actions";

const VideoMaxIncoming = () => {
  let activeCallState = JSON.parse(localStorage.getItem("activeCall"));

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
    }, timeValue);

    // Clear the timer if isTimerRunning becomes false

    if (!isTimerRunning) {
      clearTimeout(timer);
    }

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
      clearTimeout(timer);
    };
  }, []);

  // useEffect(() => {

  // }, [])

  const acceptCall = () => {
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
    localStorage.setItem("isMeetingVideo", false);
  };

  const rejectCall = () => {
    let Data = {
      ReciepentID: currentUserId,
      RoomID: incomingRoomID,
      CallStatusID: 2,
      CallTypeID: callTypeID,
    };
    dispatch(VideoCallResponse(Data, navigate, t));
    dispatch(incomingVideoCallFlag(false));
    localStorage.setItem("activeCall", false);
    setIsTimerRunning(false);
  };

  const busyCall = () => {
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

  useEffect(() => {}, [activeCallState]);

  return (
    <>
      {isVisible && (
        <div
          className={
            activeCallState === true
              ? "videoIncoming-active-call"
              : "videoIncoming-max-call"
          }
        >
          <Container>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <div
                  className={
                    activeCallState === true
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
                      activeCallState === true
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
                  <p className="calling-text-max-call">Calling...</p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    activeCallState === true
                      ? "d-flex justify-content-center"
                      : "d-flex justify-content-end"
                  }
                >
                  {activeCallState === true ? (
                    <>
                      <div className="incoming-action">
                        <Button
                          className={
                            activeCallState === true
                              ? "button-active-img"
                              : "button-img"
                          }
                          icon={<img src={BusyIcon} width={50} />}
                          onClick={busyCall}
                          style={{ marginTop: "10px" }}
                        />
                        <span
                          className={
                            activeCallState === true
                              ? "incoming-active-text"
                              : "incoming-text"
                          }
                        >
                          Busy
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="incoming-action">
                        <Button
                          className="button-img-max-call"
                          icon={<img src={videoEndIcon} width={50} />}
                          onClick={rejectCall}
                        />
                        <span className="incoming-text">Reject</span>
                      </div>
                    </>
                  )}
                </div>
              </Col>

              <Col sm={6} md={6} lg={6}>
                <div
                  className={
                    activeCallState === true
                      ? "d-flex justify-content-center"
                      : "d-flex justify-content-start"
                  }
                >
                  {activeCallState === true ? (
                    <>
                      <div className="incoming-action">
                        <Button
                          style={
                            activeCallState === true
                              ? { marginTop: "10px" }
                              : null
                          }
                          className={
                            activeCallState === true
                              ? "button-active-img"
                              : "button-img"
                          }
                          icon={<img src={videoAttendIcon} width={50} />}
                          onClick={endAndAccept}
                        />
                        <span
                          className={
                            activeCallState === true
                              ? "incoming-active-text"
                              : "incoming-text"
                          }
                        >
                          End & Accept
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="incoming-action">
                        <Button
                          className="button-img"
                          icon={<img src={videoAttendIcon} width={50} />}
                          onClick={acceptCall}
                        />
                        <span className="incoming-text">Accept</span>
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
