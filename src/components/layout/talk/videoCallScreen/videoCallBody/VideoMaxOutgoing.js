import React, { useState, useEffect } from "react";
import "./VideoMaxOutgoing.css";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { videoOutgoingCallFlag } from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch } from "react-redux";

const VideoOutgoing = () => {
  const dispatch = useDispatch();

  const VideoRecipentData = useSelector(
    (state) => state.VideoMainReducer.VideoRecipentData
  );
  const CallRequestReceivedMQTTData = useSelector(
    (state) => state.VideoMainReducer.CallRequestReceivedMQTTData
  );
  let currentCallType = Number(localStorage.getItem("CallType"));

  useEffect(() => {
    // Create the audio element
    const audioElement = new Audio("/CallRing.wav");

    audioElement.loop = true;

    // Play the audio when the component mounts
    audioElement.play();
    console.log("busyCall");

    // const timer = setTimeout(() => {
    //   // Dispatch action to update global state
    //   dispatch(videoOutgoingCallFlag(false))
    //   setIsVisible(false)
    //   audioElement.pause()
    //   audioElement.currentTime = 0
    // }, timeValue)

    return () => {
      console.log("busyCall");
      audioElement.pause();
      dispatch(videoOutgoingCallFlag(false));
      audioElement.currentTime = 0;
      // clearTimeout(timer)
    };
  }, []);

  const [userNameCR, setUserNameCR] = useState("");

  useEffect(() => {
    if (
      VideoRecipentData !== undefined &&
      VideoRecipentData !== null &&
      Object.keys(VideoRecipentData).length !== 0 &&
      VideoRecipentData.userName !== undefined
    ) {
      setUserNameCR(VideoRecipentData.userName);
    } else if (
      VideoRecipentData !== undefined &&
      VideoRecipentData !== null &&
      Object.keys(VideoRecipentData).length !== 0
    ) {
      setUserNameCR(VideoRecipentData.recipients[0].userName);
    }
  }, []);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {currentCallType === 1 ? (
            <div className="Caller-Status">
              {Object.keys(CallRequestReceivedMQTTData).length > 0 &&
              CallRequestReceivedMQTTData.message ===
                "VIDEO_CALL_UNANSWERED" ? (
                <>{userNameCR} is unavailable</>
              ) : Object.keys(CallRequestReceivedMQTTData).length > 0 &&
                CallRequestReceivedMQTTData.message === "VIDEO_CALL_RINGING" ? (
                <>
                  Ringing
                  {" " + userNameCR}
                  ...
                </>
              ) : (
                <>
                  Calling
                  {" " + userNameCR}
                  ...
                </>
              )}
            </div>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default VideoOutgoing;
