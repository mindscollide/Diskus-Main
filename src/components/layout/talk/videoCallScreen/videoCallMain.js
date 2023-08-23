import React from 'react'
import { useSelector } from 'react-redux'
import VideoPanelNormal from './videoCallPanels/videoCallNormalPanel'
import VideoPanelMaximize from './videoCallPanels/videoCallMaximizePanel'

const VideoMain = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      {videoFeatureReducer.NormalizeVideoFlag === true &&
      videoFeatureReducer.MinimizeVideoFlag === false &&
      videoFeatureReducer.MaximizeVideoFlag === false ? (
        <VideoPanelNormal />
      ) : videoFeatureReducer.NormalizeVideoFlag === false &&
        videoFeatureReducer.MinimizeVideoFlag === false &&
        videoFeatureReducer.MaximizeVideoFlag === true ? (
        <VideoPanelMaximize />
      ) : null}
    </>
  )
}

export default VideoMain
