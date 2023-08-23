import React from 'react'
import { useSelector } from 'react-redux'
import VideoPanelNormal from './videoCallPanels/videoCallNormalPanel'

const VideoMain = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      {videoFeatureReducer.VideoCallOTOFlag === true &&
      videoFeatureReducer.VideoCallNormalScreenFlag === true &&
      videoFeatureReducer.VideoCallNormalHeaderFlag === true ? (
        <VideoPanelNormal />
      ) : null}
    </>
  )
}

export default VideoMain
