import React from "react";
import { useSelector } from "react-redux";
import VideoPanel from "./videoPanel/videoPanel";

/**
 * @component TalkVideo
 * @description Conditional gate component for the authenticated Talk module's
 * video panel. Reads `videoFeatureReducer.VideoChatPanel` from Redux and
 * renders the `VideoPanel` slide-over only when that flag is `true`. Acts as
 * the top-level mount point for the video call UI within the main application
 * layout.
 */
const TalkVideo = () => {
  const VideoChatPanel = useSelector(
    (state) => state.videoFeatureReducer.VideoChatPanel
  );
  return <>{VideoChatPanel === true ? <VideoPanel /> : null}</>;
};

export default TalkVideo;
