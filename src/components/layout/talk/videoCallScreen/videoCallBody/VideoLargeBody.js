import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import './VideoLargeBody.css'
import {
  endIndexUrl,
  extractedUrl,
  generateURLCaller,
  generateURLParticipant,
} from '../../../../../commen/functions/urlVideoCalls'

const VideoLargeBody = () => {
  let currentUserID = Number(localStorage.getItem('userID'))
  let initiateCallRoomID = localStorage.getItem('initiateCallRoomID')
  let callAcceptedRoomID = localStorage.getItem('acceptedRoomID')
  let callAcceptedRecipientID = Number(
    localStorage.getItem('acceptedRecipientID'),
  )
  let currentUserName = localStorage.getItem('name')

  const [callerURL, setCallerURL] = useState('')
  const [participantURL, setParticipantURL] = useState('')

  useEffect(() => {
    let dynamicBaseURLCaller = localStorage.getItem('videoBaseURLCaller')
    const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller)
    const extractedBaseURLCaller = extractedUrl(
      dynamicBaseURLCaller,
      endIndexBaseURLCaller,
    )
    setCallerURL(
      generateURLCaller(
        extractedBaseURLCaller,
        currentUserName,
        initiateCallRoomID,
      ),
    )
  }, [initiateCallRoomID])

  useEffect(() => {
    let dynamicBaseURLCaller = localStorage.getItem('videoBaseURLParticipant')
    const endIndexBaseURLCaller = endIndexUrl(dynamicBaseURLCaller)
    const extractedBaseURLCaller = extractedUrl(
      dynamicBaseURLCaller,
      endIndexBaseURLCaller,
    )
    setParticipantURL(
      generateURLParticipant(
        extractedBaseURLCaller,
        currentUserName,
        callAcceptedRoomID,
      ),
    )
  }, [callAcceptedRoomID])

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="normal-avatar-large">
            {initiateCallRoomID !== null || callAcceptedRoomID !== null ? (
              <iframe
                src={
                  callAcceptedRecipientID === currentUserID
                    ? participantURL
                    : callerURL
                }
                title="Live Video"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="camera;microphone;display-capture"
              />
            ) : null}
          </div>
          {/* <Row>
            <Col lg={6} md={6} sm={12}>
              <div className="normal-avatar-large">
                <img
                  src={Avatar2}
                  alt="Avatar Pic One"
                  // className="img-fluid"
                />
              </div>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <div className="normal-avatar-large">
                <img
                  src={Avatar2}
                  alt="Avatar Pic One"
                  // className="img-fluid"
                />
              </div>
            </Col>
          </Row> */}
        </Col>
      </Row>
    </>
  )
}

export default VideoLargeBody
