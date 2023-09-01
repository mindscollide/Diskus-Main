import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import './videoCallNormalPanel.css'
import VideoCallNormalHeader from '../videoCallHeader/videoCallNormalHeader'
import VideoPanelNormalChat from './videoCallNormalChat'
import VideoPanelNormalAgenda from './videoCallNormalAgenda'
import VideoPanelNormalMinutesMeeting from './videoCallNormalMinutesMeeting'
import { Spin } from 'antd'
import {
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
} from '../../../../../store/actions/VideoFeature_actions'
import {
  endIndexUrl,
  extractedUrl,
  generateURLCaller,
  generateURLParticipant,
} from '../../../../../commen/functions/urlVideoCalls'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import NoteNonActive from '../../../../../assets/images/newElements/NoteIconNonActive.svg'
import Note_2NonActive from '../../../../../assets/images/newElements/Note_2NonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import ActiveNote from '../../../../../assets/images/newElements/ActiveNoteIcon.svg'
import ActiveNote2 from '../../../../../assets/images/newElements/ActiveNote2Icon.svg'
import Avatar2 from '../../../../../assets/images/newElements/Avatar2.png'
import VideoOutgoing from '../videoCallBody/VideoMaxOutgoing'

const VideoPanelNormal = () => {
  const dispatch = useDispatch()

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  let currentUserID = Number(localStorage.getItem('userID'))
  // let currentUserName = localStorage.getItem('name')

  let callerID = Number(localStorage.getItem('callerID'))
  let recipentID = Number(localStorage.getItem('recipentID'))
  let roomID = localStorage.getItem('RoomID')
  let callerName = localStorage.getItem('callerName')
  let recipentName = localStorage.getItem('recipentName')
  let initiateCallRoomID = localStorage.getItem('initiateCallRoomID')
  let callAcceptedRoomID = localStorage.getItem('acceptedRoomID')
  let callAcceptedRecipientID = Number(
    localStorage.getItem('acceptedRecipientID'),
  )
  let currentUserName = localStorage.getItem('name')

  const [callerURL, setCallerURL] = useState('')
  const [participantURL, setParticipantURL] = useState('')

  const [isActiveIcon, setIsActiveIcon] = useState(false)
  const [isNoteActive, setIsNoteActive] = useState(false)
  const [isNote2Active, setIsNote2Active] = useState(false)

  const onClickCloseChatHandler = () => {
    if (isActiveIcon === false) {
      dispatch(chatEnableNormalFlag(true))
      setIsActiveIcon(true)
      dispatch(agendaEnableNormalFlag(false))
      setIsNoteActive(false)
      dispatch(minutesMeetingEnableNormalFlag(false))
      setIsNote2Active(false)
    } else {
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(agendaEnableNormalFlag(false))
      setIsNoteActive(false)
      dispatch(minutesMeetingEnableNormalFlag(false))
      setIsNote2Active(false)
    }
  }

  const onClickNoteIconHandler = () => {
    if (isNoteActive === false) {
      dispatch(agendaEnableNormalFlag(true))
      setIsNoteActive(true)
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(minutesMeetingEnableNormalFlag(false))
      setIsNote2Active(false)
    } else {
      dispatch(agendaEnableNormalFlag(false))
      setIsNoteActive(false)
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(minutesMeetingEnableNormalFlag(false))
      setIsNote2Active(false)
    }
  }

  const onClickMinutesHandler = () => {
    if (isNote2Active === false) {
      dispatch(agendaEnableNormalFlag(false))
      setIsNoteActive(false)
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(minutesMeetingEnableNormalFlag(true))
      setIsNote2Active(true)
    } else {
      dispatch(agendaEnableNormalFlag(false))
      setIsNoteActive(false)
      dispatch(chatEnableNormalFlag(false))
      setIsActiveIcon(false)
      dispatch(minutesMeetingEnableNormalFlag(false))
      setIsNote2Active(false)
    }
  }

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

  console.log('CALLER URL THEN PARTICIPANT', callerURL, participantURL)

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="videoCallScreen">
            {VideoMainReducer.FullLoader === true ? (
              <>
                <Spin className="talk-overallchat-spinner" />
              </>
            ) : (
              <>
                <VideoCallNormalHeader />
                {videoFeatureReducer.VideoOutgoingCallFlag === true ? (
                  <VideoOutgoing />
                ) : null}

                {/* <Row>
                  <Col lg={12} md={12} sm={12}>
                    <div className="Caller-Status">
                      Calling {VideoMainReducer.VideoRecipentData.userName}
                    </div>
                  </Col>
                </Row> */}
                <Row>
                  <>
                    <Col lg={12} md={12} sm={12}>
                      <div className="normal-avatar">
                        {initiateCallRoomID !== null ||
                        callAcceptedRoomID !== null ? (
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
                    </Col>
                  </>
                </Row>

                {/* <>
                          <Col lg={1} md={1} sm={1} className="video-side-icons">
                            <div>
                              {isActiveIcon ? (
                                <img src={ActiveChat} onClick={onClickCloseChatHandler} />
                              ) : (
                                <img
                                  src={ChatNonActive}
                                  onClick={onClickCloseChatHandler}
                                />
                              )}
                            </div>
          
                            <div>
                              {isNoteActive ? (
                                <img src={ActiveNote} onClick={onClickNoteIconHandler} />
                              ) : (
                                <img
                                  src={NoteNonActive}
                                  onClick={onClickNoteIconHandler}
                                />
                              )}
                            </div>
          
                            <div onClick={() => setIsNote2Active(!isNote2Active)}>
                              {isNote2Active ? (
                                <img src={ActiveNote2} onClick={onClickMinutesHandler} />
                              ) : (
                                <img
                                  src={Note_2NonActive}
                                  onClick={onClickMinutesHandler}
                                />
                              )}
                            </div>
                          </Col>
                        </> */}
                <Row>
                  <Col lg={8} md={8} sm={12}></Col>
                  <Col lg={4} md={4} sm={12}>
                    {videoFeatureReducer.VideoChatNormalFlag === true ? (
                      <VideoPanelNormalChat />
                    ) : null}

                    {videoFeatureReducer.VideoAgendaNormalFlag === true ? (
                      <VideoPanelNormalAgenda />
                    ) : null}

                    {videoFeatureReducer.VideoMinutesMeetingNormalFlag ===
                    true ? (
                      <VideoPanelNormalMinutesMeeting />
                    ) : null}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default VideoPanelNormal
