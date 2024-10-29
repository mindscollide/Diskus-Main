import React from "react";
import { useSelector } from "react-redux";
import VideoPanel from "./videoPanel/videoPanel";

const TalkVideo = () => {
  const VideoChatPanel = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel
  );
  return <>{VideoChatPanel === true ? <VideoPanel /> : null}</>;
};

export default TalkVideo;
