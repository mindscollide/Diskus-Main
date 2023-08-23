import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import VideoPanelHeader from './videoPanelHeader/videoPanelHeader'
import VideoPanelBody from './videoPanelBody/videoPanelBody'
import VideoPanelFooter from './videoPanelFooter/videoPanelFooter'
import './videoPanel.css'
import { Triangle } from 'react-bootstrap-icons'

const VideoPanel = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      <div className="chatBox">
        <div className="chat-inner-content">
          <span className="triangle-overlay-chat"></span>
          <Triangle className="pointer-video-icon" />
          <>
            <VideoPanelHeader />
            <VideoPanelBody />
            {videoFeatureReducer.ContactVideoFlag === true ? (
              <VideoPanelFooter />
            ) : null}
          </>
        </div>
      </div>
    </>
  )
}

export default VideoPanel
