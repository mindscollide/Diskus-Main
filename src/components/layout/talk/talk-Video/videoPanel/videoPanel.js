import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VideoPanelHeader from "./videoPanelHeader/videoPanelHeader";
import VideoPanelBody from "./videoPanelBody/videoPanelBody";
import VideoPanelFooter from "./videoPanelFooter/videoPanelFooter";
import "./videoPanel.css";
import { Triangle } from "react-bootstrap-icons";

const VideoPanel = () => {
  const { videoFeatureReducer } = useSelector((state) => state);

  return (
    <>
      <div className="chatBox-video ">
        <div className="chat-inner-content">
          {/* <span className="triangle-overlay-video"></span>
          <Triangle className="pointer-video-icon" /> */}
          <>
            <div className="videocall-header-panel">
              <VideoPanelHeader />
            </div>
            <div
              className={
                videoFeatureReducer.ContactVideoFlag === true
                  ? "videocall-normal-panel"
                  : "videocall-normal-recent"
              }
            >
              <VideoPanelBody />
            </div>
            {/* {videoFeatureReducer.ContactVideoFlag === true ? (
              <VideoPanelFooter />
            ) : null} */}
          </>
        </div>
      </div>
    </>
  );
};

export default VideoPanel;
