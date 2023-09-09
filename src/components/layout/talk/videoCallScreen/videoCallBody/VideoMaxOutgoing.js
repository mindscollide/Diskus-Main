import React, { useState, useEffect } from 'react'
import './VideoMaxOutgoing.css'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../../elements'
import videoEndIcon from '../../../../../assets/images/newElements/VideoEndIcon.png'
import videoAvatar from '../../../../../assets/images/newElements/VideoAvatar.png'
import { videoOutgoingCallFlag } from '../../../../../store/actions/VideoFeature_actions'

const VideoOutgoing = () => {
  const dispatch = useDispatch()

  const { VideoMainReducer } = useSelector((state) => state)

  const [isVisible, setIsVisible] = useState(true)

  // const [recipentData, setRecipentData] = useState([])

  // useEffect(() => {
  //   if (
  //     VideoMainReducer.VideoRecipentData !== undefined &&
  //     VideoMainReducer.VideoRecipentData !== null &&
  //     VideoMainReducer.VideoRecipentData.length !== 0
  //   ) {
  //     setRecipentData(VideoMainReducer.VideoRecipentData)
  //   } else {
  //     setRecipentData([])
  //   }
  // }, [VideoMainReducer?.VideoRecipentData])

  // const endCall = () => {
  //   dispatch(videoOutgoingCallFlag(false))
  // }

  // let timeValue = Number(localStorage.getItem('callRingerTimeout'))
  // timeValue = timeValue * 1000

  // console.log('timeValue', timeValue, typeof timeValue)

  // useEffect(() => {
  //   // Create the audio element
  //   const audioElement = new Audio('/CallRing.wav')

  //   audioElement.loop = true

  //   // Play the audio when the component mounts
  //   audioElement.play()

  //   // const timer = setTimeout(() => {
  //   //   // Dispatch action to update global state
  //   //   dispatch(videoOutgoingCallFlag(false))
  //   //   setIsVisible(false)
  //   //   audioElement.pause()
  //   //   audioElement.currentTime = 0
  //   // }, timeValue)

  //   return () => {
  //     audioElement.pause()
  //     audioElement.currentTime = 0
  //     // clearTimeout(timer)
  //   }
  // }, [])

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="Caller-Status">
            {Object.keys(VideoMainReducer.CallRequestReceivedMQTTData).length >
            0
              ? 'Ringing '
              : 'Calling '}
            {VideoMainReducer.VideoRecipentData.userName}
          </div>
        </Col>
      </Row>
      {/* {isVisible && (
        <div className="videoIncoming-max-call">
          <Container>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="avatar-column-max-call">
                  <img src={videoAvatar} width={150} alt="Avatar video" />
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="someone-calling-title-max-call">
                  <p className="outgoing-call-text-max-call">
                    {recipentData.length !== 0 &&
                    recipentData !== undefined &&
                    recipentData !== null
                      ? recipentData.userName
                      : null}
                  </p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="calling-title-max-call">
                  <p className="calling-text-max-call">Ringing...</p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="d-flex justify-content-center">
                  <Button
                    className="button-img-max-call"
                    icon={<img src={videoEndIcon} width={50} />}
                    onClick={endCall}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )} */}
    </>
  )
}

export default VideoOutgoing
