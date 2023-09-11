import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from '../../../elements'
import { Row, Col } from 'react-bootstrap'
import VideoPanelNormal from './videoCallPanels/videoCallNormalPanel'
import VideoPanelMaximize from './videoCallPanels/videoCallMaximizePanel'
import VideoCallMinimizeHeader from './videoCallHeader/videoCallMinimizeHeader'
import { leaveCallModal } from '../../../../store/actions/VideoFeature_actions'

const VideoMain = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  const dispatch = useDispatch()

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
