import React, { useState, useEffect } from "react";
import "./VideoMaxOutgoing.css";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../elements";
import videoEndIcon from "../../../../../assets/images/newElements/VideoEndIcon.png";
import videoAvatar from "../../../../../assets/images/newElements/VideoAvatar.png";
import { videoOutgoingCallFlag } from "../../../../../store/actions/VideoFeature_actions";

const VideoOutgoing = () => {
  const { VideoMainReducer } = useSelector((state) => state);

  let currentCallType = Number(localStorage.getItem("CallType"));

  useEffect(() => {
    // Create the audio element
    const audioElement = new Audio("/CallRing.wav");

    audioElement.loop = true;

    // Play the audio when the component mounts
    audioElement.play();

    // const timer = setTimeout(() => {
    //   // Dispatch action to update global state
    //   dispatch(videoOutgoingCallFlag(false))
    //   setIsVisible(false)
    //   audioElement.pause()
    //   audioElement.currentTime = 0
    // }, timeValue)

    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
      // clearTimeout(timer)
    };
  }, []);

  const [userNameCR, setUserNameCR] = useState("");

  useEffect(() => {
    if (
      VideoMainReducer.VideoRecipentData !== undefined &&
      VideoMainReducer.VideoRecipentData !== null &&
      Object.keys(VideoMainReducer.VideoRecipentData).length !== 0 &&
      VideoMainReducer.VideoRecipentData.userName !== undefined
    ) {
      setUserNameCR(VideoMainReducer.VideoRecipentData.userName);
    } else if (
      VideoMainReducer.VideoRecipentData !== undefined &&
      VideoMainReducer.VideoRecipentData !== null &&
      Object.keys(VideoMainReducer.VideoRecipentData).length !== 0
    ) {
      setUserNameCR(VideoMainReducer.VideoRecipentData.recipients[0].userName);
    }
  }, []);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {currentCallType === 1 ? (
            <div className="Caller-Status">
              {Object.keys(VideoMainReducer.CallRequestReceivedMQTTData)
                .length > 0 &&
              VideoMainReducer.CallRequestReceivedMQTTData.message ===
                "VIDEO_CALL_UNANSWERED" ? (
                <>{userNameCR} is unavailable</>
              ) : Object.keys(VideoMainReducer.CallRequestReceivedMQTTData)
                  .length > 0 &&
                VideoMainReducer.CallRequestReceivedMQTTData.message ===
                  "VIDEO_CALL_RINGING" ? (
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
