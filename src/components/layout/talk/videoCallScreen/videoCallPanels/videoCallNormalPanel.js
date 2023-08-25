import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import './videoCallNormalPanel.css'
import VideoCallNormalHeader from '../videoCallHeader/videoCallNormalHeader'
import VideoPanelNormalChat from './videoCallNormalChat'
import VideoPanelNormalAgenda from './videoCallNormalAgenda'
import VideoPanelNormalMinutesMeeting from './videoCallNormalMinutesMeeting'
import {
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
} from '../../../../../store/actions/VideoFeature_actions'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import NoteNonActive from '../../../../../assets/images/newElements/NoteIconNonActive.svg'
import Note_2NonActive from '../../../../../assets/images/newElements/Note_2NonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import ActiveNote from '../../../../../assets/images/newElements/ActiveNoteIcon.svg'
import ActiveNote2 from '../../../../../assets/images/newElements/ActiveNote2Icon.svg'
import Avatar2 from '../../../../../assets/images/newElements/Avatar2.png'

const VideoPanelNormal = () => {
  const dispatch = useDispatch()

  const { videoFeatureReducer } = useSelector((state) => state)

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

  console.log('videoFeatureReducer', videoFeatureReducer)

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <div className="videoCallScreen">
            <VideoCallNormalHeader />
            <Row>
              <>
                <Col lg={11} md={11} sm={11}>
                  <Row>
                    <Col lg={6} md={6} sm={12}>
                      <div className="normal-avatar">
                        <img
                          src={Avatar2}
                          // width={550}
                          // height={280}
                          // className="img-fluid"
                        />
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <div className="normal-avatar">
                        <img
                          src={Avatar2}
                          // width={550}
                          // height={280}
                          // className="img-fluid"
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </>

              <>
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
              </>
            </Row>
            <Row>
              <Col lg={8} md={8} sm={12}></Col>
              <Col lg={4} md={4} sm={12}>
                {videoFeatureReducer.VideoChatNormalFlag === true ? (
                  <VideoPanelNormalChat />
                ) : null}

                {videoFeatureReducer.VideoAgendaNormalFlag === true ? (
                  <VideoPanelNormalAgenda />
                ) : null}

                {videoFeatureReducer.VideoMinutesMeetingNormalFlag === true ? (
                  <VideoPanelNormalMinutesMeeting />
                ) : null}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default VideoPanelNormal
