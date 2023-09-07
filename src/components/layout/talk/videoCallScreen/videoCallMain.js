import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import VideoPanelNormal from './videoCallPanels/videoCallNormalPanel'
import VideoPanelMaximize from './videoCallPanels/videoCallMaximizePanel'
import VideoCallMinimizeHeader from './videoCallHeader/videoCallMinimizeHeader'

const VideoMain = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  return (
    <>
      <div
        className={
          (videoFeatureReducer.NormalizeVideoFlag === true ||
            videoFeatureReducer.MaximizeVideoFlag === true) &&
          videoFeatureReducer.MinimizeVideoFlag === false
            ? 'd-block'
            : 'd-none'
        }
      >
        <VideoPanelNormal />
      </div>
      <div
        className={
          videoFeatureReducer.NormalizeVideoFlag === false &&
          videoFeatureReducer.MinimizeVideoFlag === true &&
          videoFeatureReducer.MaximizeVideoFlag === false
            ? 'd-block'
            : 'd-none'
        }
      >
        <VideoCallMinimizeHeader />
      </div>
    </>
  )
}

export default VideoMain
