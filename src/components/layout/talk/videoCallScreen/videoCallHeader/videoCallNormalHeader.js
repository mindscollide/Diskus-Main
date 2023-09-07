import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import './videoCallHeader.css'
import MicVideo from '../../../../../assets/images/newElements/micVideo.png'
import VideoCallIcon from '../../../../../assets/images/newElements/VideoIconExpand.png'
import ExpandIcon from '../../../../../assets/images/newElements/ExpandColorfullIcon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'
import ActiveScreenShare from '../../../../../assets/images/newElements/ActiveScreenShareIcon.svg'
import NonActiveScreenShare from '../../../../../assets/images/newElements/NonActiveScreenShare.svg'
import ScreenShare from '../../../../../assets/images/newElements/ScreenShareIcon.png'
import HandRaise from '../../../../../assets/images/newElements/HandRaiseIcon.svg'
import Board from '../../../../../assets/images/newElements/WhiteBoard.svg'
import ThreeDots from '../../../../../assets/images/newElements/ThreeDotsIcon.svg'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import NormalizeIcon from '../../../../../assets/images/newElements/Normalize-Icon.png'
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
} from '../../../../../store/actions/VideoFeature_actions'

const VideoCallNormalHeader = ({ isScreenActive, screenShareButton }) => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  let callerNameInitiate = localStorage.getItem('callerNameInitiate')
  let currentUserName = localStorage.getItem('name')
  let callerName = localStorage.getItem('callerName')
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem('initiateVideoCall'),
  )

  const dispatch = useDispatch()

  const otoMaximizeVideoPanel = () => {
    dispatch(maximizeVideoPanelFlag(true))
    dispatch(minimizeVideoPanelFlag(false))
    dispatch(normalizeVideoPanelFlag(false))
  }

  const minimizeVideoPanel = () => {
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(true))
    dispatch(normalizeVideoPanelFlag(false))
  }

  const closeVideoPanel = () => {
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    localStorage.setItem('activeCall', false)
  }

  const [isActiveIcon, setIsActiveIcon] = useState(false)

  const onClickCloseChatHandler = () => {
    if (isActiveIcon === false) {
      dispatch(chatEnableNormalFlag(true))
      setIsActiveIcon(true)
      dispatch(agendaEnableNormalFlag(false))
      dispatch(minutesMeetingEnableNormalFlag(false))
    } else {
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(agendaEnableNormalFlag(false))
      dispatch(minutesMeetingEnableNormalFlag(false))
    }
  }

  const normalizeScreen = () => {
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
  }

  return (
    <Row className="mb-4">
      <Col lg={3} md={3} sm={12} className="mt-1">
        <p className="title-heading">
          {currentUserName !== VideoMainReducer.VideoRecipentData.userName &&
          Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
          initiateVideoCallFlag === true
            ? VideoMainReducer.VideoRecipentData.userName
            : currentUserName !== VideoMainReducer.VideoRecipentData.userName &&
              Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
              initiateVideoCallFlag === false
            ? callerNameInitiate
            : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
            ? callerName
            : null}
        </p>
      </Col>
      <>
        <Col lg={9} md={9} sm={12} className="normal-screen-top-icons">
          {/* <img src={VideoCallIcon} /> */}
          {/* <img src={MicVideo} /> */}
          {isScreenActive ? (
            <img
              width={30}
              onClick={screenShareButton}
              src={ActiveScreenShare}
            />
          ) : (
            <img
              width={30}
              onClick={screenShareButton}
              src={NonActiveScreenShare}
            />
          )}
          {isActiveIcon ? (
            <img
              width={30}
              src={ActiveChat}
              onClick={onClickCloseChatHandler}
            />
          ) : (
            <img
              width={30}
              src={ChatNonActive}
              onClick={onClickCloseChatHandler}
            />
          )}
          <img src={CallEndRedIcon} onClick={closeVideoPanel} />
          <img width={20} src={MinimizeIcon} onClick={minimizeVideoPanel} />

          {videoFeatureReducer.NormalizeVideoFlag === true &&
          videoFeatureReducer.MinimizeVideoFlag === false &&
          videoFeatureReducer.MaximizeVideoFlag === false ? (
            <img width={17} src={ExpandIcon} onClick={otoMaximizeVideoPanel} />
          ) : videoFeatureReducer.NormalizeVideoFlag === false &&
            videoFeatureReducer.MinimizeVideoFlag === false &&
            videoFeatureReducer.MaximizeVideoFlag === true ? (
            <img
              width={17}
              src={NormalizeIcon}
              alt="Maximize Icon"
              className="normalize-Icon-Large"
              onClick={normalizeScreen}
            />
          ) : null}
        </Col>
      </>

      <>
        <Col lg={1} md={1} sm={12}></Col>
      </>
    </Row>
  )
}

export default VideoCallNormalHeader
