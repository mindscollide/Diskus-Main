import React, { useState, useEffect } from 'react'
import './VideoMaxIncoming.css'
import { VideoCallResponse } from '../../../../../store/actions/VideoMain_actions'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../../elements'
import videoEndIcon from '../../../../../assets/images/newElements/VideoEndIcon.png'
import videoAvatar from '../../../../../assets/images/newElements/VideoAvatar.png'
import videoAttendIcon from '../../../../../assets/images/newElements/VideoAttendIcon.png'
import {
  incomingVideoCallFlag,
  normalizeVideoPanelFlag,
} from '../../../../../store/actions/VideoFeature_actions'

const VideoMaxIncoming = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { VideoMainReducer } = useSelector((state) => state)

  let currentUserId = Number(localStorage.getItem('userID'))

  let incomingRoomID = localStorage.getItem('RoomID')

  console.log('VideoMainReducer', VideoMainReducer)

  const [isVisible, setIsVisible] = useState(true)

  const [incomingCallerData, setIncomingCallerData] = useState([])

  useEffect(() => {
    if (
      VideoMainReducer.InitiateVideoCallDataMQTT !== undefined &&
      VideoMainReducer.InitiateVideoCallDataMQTT !== null &&
      VideoMainReducer.InitiateVideoCallDataMQTT.length !== 0
    ) {
      setIncomingCallerData(VideoMainReducer.InitiateVideoCallDataMQTT)
    } else {
      setIncomingCallerData([])
    }
  }, [VideoMainReducer?.InitiateVideoCallDataMQTT])

  const acceptCall = () => {
    let Data = {
      ReciepentID: currentUserId,
      RoomID: incomingRoomID,
      CallStatusID: 1,
    }
    dispatch(VideoCallResponse(Data, navigate, t))
    dispatch(incomingVideoCallFlag(false))
    dispatch(normalizeVideoPanelFlag(true))
    localStorage.setItem('activeCall', true)
  }

  const rejectCall = () => {
    let Data = {
      ReciepentID: currentUserId,
      RoomID: incomingRoomID,
      CallStatusID: 2,
    }
    dispatch(VideoCallResponse(Data, navigate, t))
    dispatch(incomingVideoCallFlag(false))
    localStorage.setItem('activeCall', false)
  }

  let timeValue = Number(localStorage.getItem('callRingerTimeout'))
  timeValue = timeValue * 1000

  useEffect(() => {
    // Create the audio element
    const audioElement = new Audio('/IncomingCall.wav')

    audioElement.loop = true

    // Play the audio when the component mounts
    audioElement.play()

    const timer = setTimeout(() => {
      // Dispatch action to update global state
      dispatch(incomingVideoCallFlag(false))
      let Data = {
        ReciepentID: currentUserId,
        RoomID: incomingRoomID,
        CallStatusID: 3,
      }
      dispatch(VideoCallResponse(Data, navigate, t))
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
                    {incomingCallerData.length !== 0 &&
                    incomingCallerData !== undefined &&
                    incomingCallerData !== null
                      ? incomingCallerData.callerName
                      : null}
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
                    onClick={acceptCall}
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
