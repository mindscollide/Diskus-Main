import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container } from 'react-bootstrap'
import {
  videoIncomingCallFlag,
  videoOutgoingCallFlag,
  videoMultipleCallFlag,
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from '../../../../../../store/actions/VideoFeature_actions'
import VideoMaxModal from '../../../videoCallScreen/videoCallBody/VideoMaxModal'
import ActiveVideo from '../../../../../../assets/images/newElements/ActiveVideoIcon.svg'
import ActiveMic from '../../../../../../assets/images/newElements/ActiveMicIcon.svg'
import ActiveScreenShare from '../../../../../../assets/images/newElements/ActiveScreenShareIcon.svg'
import ActiveHandRaise from '../../../../../../assets/images/newElements/ActiveHandRaiseIcon.svg'
import ActiveBoard from '../../../../../../assets/images/newElements/ActiveBoardIcon.svg'
import ActiveDots from '../../../../../../assets/images/newElements/ActiveDotsIcon.svg'
import NonActiveVideo from '../../../../../../assets/images/newElements/NonActiveVideo.svg'
import NonActiveMic from '../../../../../../assets/images/newElements/NonActiveMic.svg'
import NonActiveScreenShare from '../../../../../../assets/images/newElements/NonActiveScreenShare.svg'
import NonActiveHand from '../../../../../../assets/images/newElements/NonActiveHandRaise.svg'
import NonActiveBoard from '../../../../../../assets/images/newElements/NonActiveWhiteBoard.svg'
import NonActiveCall from '../../../../../../assets/images/newElements/NonActiveRedCall.svg'
import NonActiveDots from '../../../../../../assets/images/newElements/NonActiveThreeDots.svg'
import { Button } from '../../../../../elements'
import './VideoLargePanelFooter.css'

const VideoLargePanelFooter = () => {
  const dispatch = useDispatch()

  // for open Chrome modal in maximum screen
  const [maxModalScreen, setMaxModalScreen] = useState(false)

  //for full screens bottom icons active or non active
  const [isVideoIconActive, setIsVideoIconActive] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [isScreenActive, setIsScreenActive] = useState(false)
  const [isHandActive, setIsHandActive] = useState(false)
  const [isBoardActive, setIsBoardActive] = useState(false)
  const [isDotsActive, setIsDotsActive] = useState(false)

  const [imageIncomingCall, setImageIncomingCall] = useState(false)
  const [outgoingCall, setOutgoingCall] = useState(false)
  const [multipleScreen, setMultipltScreen] = useState(false)

  // const videoCallingIncominCall = () => {
  //   if (isVideoIconActive === true) {
  //     dispatch(videoIncomingCallFlag(false))
  //   } else {
  //     dispatch(videoIncomingCallFlag(true))
  //   }
  // }

  // const videoCallingOutgoingCall = () => {
  //   if (isMicActive === true) {
  //     dispatch(videoOutgoingCallFlag(false))
  //   } else {
  //     dispatch(videoOutgoingCallFlag(true))
  //   }
  // }

  const videoMultipleScreen = () => {
    // if (isScreenActive === true) {
    //   dispatch(videoMultipleCallFlag(false))
    // } else {
    //   dispatch(videoMultipleCallFlag(true))
    // }
  }

  // For Open video modal screen
  const openMaxVideoModal = () => {
    setMaxModalScreen(true)
  }

  const closeVideoPanel = () => {
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    localStorage.setItem('activeCall', false)
  }

  return (
    <>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="full-screen-bottom-video-images"
        >
          <div
            onClick={() => setIsVideoIconActive(!isVideoIconActive)}
            className="videoNonActive-BottomImg-border"
          >
            {isVideoIconActive ? (
              <img
                src={ActiveVideo}
                // onClick={videoCallingIncominCall}
                alt="Active Video"
              />
            ) : (
              <img
                // onClick={videoCallingIncominCall}
                alt="NonActive Video"
                src={NonActiveVideo}
                className="videoNonActive-border-footer"
              />
            )}
          </div>

          <div onClick={() => setIsMicActive(!isMicActive)}>
            {isMicActive ? (
              <img
                src={ActiveMic}
                // onClick={videoCallingOutgoingCall}
                alt="Active Mic"
              />
            ) : (
              <img
                alt="NonActive Mic"
                src={NonActiveMic}
                // onClick={videoCallingOutgoingCall}
              />
            )}
          </div>

          <div onClick={() => setIsScreenActive(!isScreenActive)}>
            {isScreenActive ? (
              <img
                src={ActiveScreenShare}
                alt="Active ScreenShare"
                onClick={videoMultipleScreen}
              />
            ) : (
              <img
                src={NonActiveScreenShare}
                alt="NonActive Screen Share"
                onClick={videoMultipleScreen}
              />
            )}
          </div>

          {/* <div
            onClick={() => setIsHandActive(!isHandActive)}
            className="handraise-border-bottom-img"
          >
            {isHandActive ? (
              <img src={ActiveHandRaise} alt="Active HandRaise" />
            ) : (
              <img src={NonActiveHand} alt="Non Active HandRaise" />
            )}
          </div>

          <div onClick={() => setIsBoardActive(!isBoardActive)}>
            {isBoardActive ? (
              <img
                src={ActiveBoard}
                alt="Active Board"
                onClick={openMaxVideoModal}
              />
            ) : (
              <img
                src={NonActiveBoard}
                alt="NonActive Board"
                onClick={openMaxVideoModal}
              />
            )}
          </div>

          <div onClick={() => setIsDotsActive(!isDotsActive)}>
            {isDotsActive ? (
              <img src={ActiveDots} alt="Active Dots" />
            ) : (
              <img src={NonActiveDots} alt="NonActive Dots" />
            )}
          </div> */}

          <img
            src={NonActiveCall}
            alt="Non ActiveCall"
            onClick={closeVideoPanel}
          />
        </Col>
      </Row>

      {maxModalScreen ? (
        <>
          <VideoMaxModal
            videoModal={maxModalScreen}
            setVideoModal={setMaxModalScreen}
          />
        </>
      ) : null}
    </>
  )
}

export default VideoLargePanelFooter
