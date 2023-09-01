import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import './videoCallHeader.css'
import MicVideo from '../../../../../assets/images/newElements/micVideo.png'
import VideoCallIcon from '../../../../../assets/images/newElements/VideoIconExpand.png'
import ExpandIcon from '../../../../../assets/images/newElements/ExpandColorfullIcon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'
import ScreenShare from '../../../../../assets/images/newElements/ScreenShareIcon.png'
import HandRaise from '../../../../../assets/images/newElements/HandRaiseIcon.svg'
import Board from '../../../../../assets/images/newElements/WhiteBoard.svg'
import ThreeDots from '../../../../../assets/images/newElements/ThreeDotsIcon.svg'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
} from '../../../../../store/actions/VideoFeature_actions'

const VideoCallNormalHeader = () => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
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

  return (
    <Row className="mb-4">
      <Col lg={3} md={3} sm={12} className="mt-1">
        <p className="title-heading">
          {VideoMainReducer.VideoRecipentData.userName}
        </p>
      </Col>
      <>
        <Col lg={9} md={9} sm={12} className="normal-screen-top-icons">
          {/* <img src={VideoCallIcon} /> */}
          {/* <img src={MicVideo} /> */}
          {/* <img src={ScreenShare} /> */}
          {/* <img src={HandRaise} /> */}
          {/* <img src={Board} /> */}
          {/* <img src={ThreeDots} /> */}
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
          <img width={17} src={ExpandIcon} onClick={otoMaximizeVideoPanel} />
        </Col>
      </>
      <>
        {/* <Col lg={2} md={2} sm={12} className="top-right-icons">

        </Col> */}
      </>

      <>
        <Col lg={1} md={1} sm={12}></Col>
      </>
    </Row>
  )
}

export default VideoCallNormalHeader
