import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VideoPanelHeader from "./videoPanelHeader/videoPanelHeader";
import VideoPanelBody from "./videoPanelBody/videoPanelBody";
import VideoPanelFooter from "./videoPanelFooter/videoPanelFooter";
import "./videoPanel.css";
import { Triangle } from "react-bootstrap-icons";

/**
 * @component VideoPanel
 * @description Slide-over panel container for the Talk module's video call
 * interface. Composes `VideoPanelHeader`, `VideoPanelBody`, and (currently
 * commented-out) `VideoPanelFooter` into a single scrollable panel.
 * Applies `videocall-normal-panel` or `videocall-normal-recent` CSS class to
 * the body area depending on whether `videoFeatureReducer.ContactVideoFlag`
 * is active, toggling between the contacts view and recent calls view layout.
 */
const VideoPanel = () => {
  const ContactVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.ContactVideoFlag
  );
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
                ContactVideoFlag === true
                  ? "videocall-normal-panel"
                  : "videocall-normal-recent"
              }
            >
              <VideoPanelBody />
            </div>
            {/* {ContactVideoFlag === true ? (
              <VideoPanelFooter />
            ) : null} */}
          </>
        </div>
      </div>
    </>
  );
};

export default VideoPanel;
