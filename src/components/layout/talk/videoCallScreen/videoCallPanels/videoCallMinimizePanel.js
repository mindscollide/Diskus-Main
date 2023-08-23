import React from 'react'
import './videoCallMinimizePanel.css'
import VideoCallMinimizeHeader from '../videoCallHeader/videoCallMinimizeHeader'
import { Row, Col } from 'react-bootstrap'

const VideoPanelMinimize = () => {
  return (
    <>
      <div className="videoCallGroupScreen-minmizeVideoCall">
        <VideoCallMinimizeHeader title="Group Meeting Video" />
      </div>
    </>
  )
}

export default VideoPanelMinimize
