import React, { useState, useEffect } from 'react'
import './VideoMaxIncoming.css'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Button } from '../../../../elements'
import videoEndIcon from '../../../../../assets/images/newElements/VideoEndIcon.png'
import videoAvatar from '../../../../../assets/images/newElements/VideoAvatar.png'
import videoAttendIcon from '../../../../../assets/images/newElements/VideoAttendIcon.png'
import { incomingVideoCallFlag } from '../../../../../store/actions/VideoFeature_actions'

const VideoMaxIncoming = () => {
  const dispatch = useDispatch()

  const [isVisible, setIsVisible] = useState(true)

  const rejectCall = () => {
    dispatch(incomingVideoCallFlag(false))
  }

  let timeValue = Number(localStorage.getItem('callRingerTimeout'))
  timeValue = timeValue * 1000

  console.log('timeValue', timeValue, typeof timeValue)

  useEffect(() => {
    // Create the audio element
    const audioElement = new Audio('/IncomingCall.wav')

    audioElement.loop = true

    // Play the audio when the component mounts
    audioElement.play()

    const timer = setTimeout(() => {
      // Dispatch action to update global state
      dispatch(incomingVideoCallFlag(false))
      setIsVisible(false)
      audioElement.pause()
      audioElement.currentTime = 0
    }, timeValue)

    return () => {
      audioElement.pause()
      audioElement.currentTime = 0
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {isVisible && (
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
                    Some One Calling
                  </p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={12} lg={12}>
                <div className="calling-title-max-call">
                  <p className="calling-text-max-call">Calling...</p>
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={6} md={6} lg={6}>
                <div className="d-flex justify-content-end">
                  <Button
                    className="button-img-max-call"
                    icon={<img src={videoEndIcon} width={50} />}
                    onClick={rejectCall}
                  />
                </div>
              </Col>

              <Col sm={6} md={6} lg={6}>
                <div className="d-flex justify-content-start">
                  <Button
                    className="button-img"
                    icon={<img src={videoAttendIcon} width={50} />}
                    onClick={rejectCall}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  )
}

export default VideoMaxIncoming
