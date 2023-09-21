import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import './videoCallHeader.css'
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from '../../../../../store/actions/VideoFeature_actions'
import MinimizeMicIcon from '../../../../../assets/images/newElements/MinimizeMicIcon.png'
import MinimizeExpandIcon from '../../../../../assets/images/newElements/MinimizeExpandIcon.png'
import MinimizeVideoIcon from '../../../../../assets/images/newElements/MinimizeVideoIcon.png'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import MinToNormalIcon from '../../../../../assets/images/newElements/Min-to-normal-Icon.svg'

const VideoCallMinimizeHeader = () => {
  let callerNameInitiate = localStorage.getItem('callerNameInitiate')
  let currentUserName = localStorage.getItem('name')
  let callerName = localStorage.getItem('callerName')
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem('initiateVideoCall'),
  )

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  const dispatch = useDispatch()

  const closeVideoPanel = () => {
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    localStorage.setItem('activeCall', false)
  }

  const normalizePanel = () => {
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
  }

  const maximizePanel = () => {
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(true))
    dispatch(minimizeVideoPanelFlag(false))
  }

  return (
    <div className="videoCallGroupScreen-minmizeVideoCall">
      <Row className="mt-2 mb-4">
        <Col lg={3} md={3} sm={12} className="mt-1">
          <p className="title-heading">
            {currentUserName !== VideoMainReducer.VideoRecipentData.userName &&
            Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
            initiateVideoCallFlag === true
              ? VideoMainReducer.VideoRecipentData.userName
              : currentUserName !==
                  VideoMainReducer.VideoRecipentData.userName &&
                Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                initiateVideoCallFlag === false
              ? callerNameInitiate
              : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
              ? callerName
              : null}
          </p>
        </Col>
        <Col lg={7} md={7} sm={12}>
          <div className="minimize-screen-on-bottom">
            <img src={MinimizeVideoIcon} className="minimize-video-icon" />
            <img src={MinimizeMicIcon} />
            <img src={CallEndRedIcon} onClick={closeVideoPanel} />
          </div>
        </Col>
        <Col lg={2} md={2} sm={12}>
          <div className="minimizeGroup-expand-icon">
            <img
              src={MinToNormalIcon}
              className="min-to-normal-icon"
              onClick={normalizePanel}
            />

            <img
              src={MinimizeExpandIcon}
              className="min-to-max-icon"
              onClick={maximizePanel}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default VideoCallMinimizeHeader
