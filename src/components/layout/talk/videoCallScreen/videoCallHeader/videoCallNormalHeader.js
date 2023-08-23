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
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import {
  videoCallOTOFlag,
  videoCallMaximizeHeaderFlag,
  videoCallMaximizeScreenFlag,
  videoCallNormalScreenFlag,
  videoCallNormalHeaderFlag,
} from '../../../../../store/actions/VideoFeature_actions'
const VideoCallNormalHeader = () => {
  // const { videoFeatureReducer } = useSelector((state) => state);

  const dispatch = useDispatch()

  const otoMaximizeVideoPanel = () => {
    console.log('Test')
    dispatch(videoCallOTOFlag(true))
    console.log('Test')
    dispatch(videoCallMaximizeHeaderFlag(true))
    console.log('Test')
    dispatch(videoCallMaximizeScreenFlag(true))
    console.log('Test')
    dispatch(videoCallNormalScreenFlag(false))
    console.log('Test')
    dispatch(videoCallNormalHeaderFlag(false))
    console.log('Test')
  }

  return (
    <Row className="mb-4">
      <Col lg={3} md={3} sm={3} className="mt-1">
        <p className="title-heading">IT Departmental Meeting</p>
      </Col>
      <>
        <Col lg={6} md={6} sm={6} className="normal-screen-top-icons">
          <img src={VideoCallIcon} />
          <img src={MicVideo} />
          <img src={ScreenShare} />
          <img src={HandRaise} />
          <img src={Board} />
          <img src={ThreeDots} />
          <img
            src={CallEndRedIcon}
            // onClick={() => closeVideoHandlerOfCall(false)}
          />
        </Col>
      </>
      <>
        <Col lg={2} md={2} sm={12} className="top-right-icons">
          <img
            width={20}
            src={MinimizeIcon}
            // onClick={() => minimizeScreen(true)}
          />
          <img width={17} src={ExpandIcon} onClick={otoMaximizeVideoPanel} />
        </Col>
      </>

      <>
        <Col lg={1} md={1} sm={12}></Col>
      </>
    </Row>
  )
}

export default VideoCallNormalHeader
