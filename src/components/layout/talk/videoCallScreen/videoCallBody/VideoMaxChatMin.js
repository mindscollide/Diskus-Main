import React, { useState } from 'react'
import { Row, Col, Container, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import { X } from 'react-bootstrap-icons'
import GroupIcon from '../../../../../assets/images/newElements/Peoplegroup.png'
import EmojiIcon from '../../../../../assets/images/Emoji-Select-Icon.png'
import ChatPlus from '../../../../../assets/images/newElements/chatPlus.png'
import SendIcon from '../../../../../assets/images/newElements/sendIcon.png'
import Avatar2 from '../../../../../assets/images/newElements/Avatar2.png'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import ActiveNote from '../../../../../assets/images/newElements/ActiveNoteIcon.svg'
import SecurityIconMessasgeBox from '../../../../../assets/images/SecurityIcon-MessasgeBox.png'
import SearchIcon from '../../../../../assets/images/Search-Icon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'

// import VideoCallLargeHeader from "../videoCallHeader/videoCallLargeHeader";
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import NoteNonActive from '../../../../../assets/images/newElements/NoteIconNonActive.svg'
import ActiveNote2 from '../../../../../assets/images/newElements/ActiveNote2Icon.svg'
import Note_2NonActive from '../../../../../assets/images/newElements/Note_2NonActive.svg'
import './VideoMaxChatMin.css'
import {
  videoChatOpenFlag,
  videoAgendaOpenFlag,
  videoMinutesOpenFlag,
} from '../../../../../store/actions/VideoFeature_actions'

const VideoLargeBody = () => {
  const dispatch = useDispatch()
  // for open chat div
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAgendaOpen, setIsAgendaOpen] = useState(false)
  const [isMinuteOpen, setIsMinuteOpen] = useState(false)

  //for icons chat active or non active
  const [isActiveIcon, setIsActiveIcon] = useState(false)

  //for icon note active or non active
  const [isNoteActive, setIsNoteActive] = useState(false)

  //for icon note_2 active or non active
  const [isNote2Active, setIsNote2Active] = useState(false)

  //for close Chat
  const onClickCloseChatHandler = async () => {
    if (isChatOpen === false) {
      setIsChatOpen(true)
      videoChatOpenFlag(true)
    } else {
      setIsChatOpen(false)
      videoChatOpenFlag(false)
    }
  }

  //for open note agenda
  const onClickNoteIconHandler = async () => {
    if (isAgendaOpen === false) {
      setIsAgendaOpen(true)
      videoAgendaOpenFlag(true)
    } else {
      setIsAgendaOpen(false)
      videoAgendaOpenFlag(false)
    }
  }

  //for open minutesmeeting
  const onClickMinutesHandler = async () => {
    if (isMinuteOpen === false) {
      setIsMinuteOpen(true)
      videoMinutesOpenFlag(true)
    } else {
      setIsMinuteOpen(false)
      videoMinutesOpenFlag(false)
    }
  }

  //for note onClose
  const onClickCloseAgendaHandler = async () => {
    setIsAgendaOpen(false)
  }

  //for close minutes
  const onClickCloseMinutesHandler = async () => {
    setIsMinuteOpen(false)
  }

  return (
    <>
      {/* <Row>
        <Col lg={2} md={2} sm={12}>
          <div className="fullScreen-video-icons">
            <div onClick={() => setIsActiveIcon(!isActiveIcon)}>
              {isActiveIcon ? (
                <img
                  src={ActiveChat}
                  onClick={onClickCloseChatHandler}
                  alt="Active Chat"
                />
              ) : (
                <img
                  src={ChatNonActive}
                  alt="Chat Non Active"
                  onClick={onClickCloseChatHandler}
                />
              )}
            </div>

            <div onClick={() => setIsNoteActive(!isNoteActive)}>
              {isNoteActive ? (
                <img
                  src={ActiveNote}
                  onClick={onClickNoteIconHandler}
                  alt="Active Note"
                />
              ) : (
                <img
                  src={NoteNonActive}
                  onClick={onClickNoteIconHandler}
                  alt="Note Non Active"
                />
              )}
            </div>

            <div onClick={() => setIsNote2Active(!isNote2Active)}>
              {isNote2Active ? (
                <img
                  src={ActiveNote2}
                  onClick={onClickMinutesHandler}
                  alt="Active Note 2"
                />
              ) : (
                <img
                  src={Note_2NonActive}
                  onClick={onClickMinutesHandler}
                  alt="Note 2 NonActive"
                />
              )}
            </div>
          </div>
        </Col>
        <Col lg={10} md={10} sm={12} />
      </Row>

      <Row>
        <Col lg={4} md={4} sm={12}>
          {isChatOpen === true ? (
            <>
              <div className="chat-messenger-max-div">
                <Container>
                  <Row className="mt-3">
                    <Col lg={2} md={2} sm={2}>
                      <img
                        src={GroupIcon}
                        className="video-chat-group"
                        alt="Group Icon"
                      />
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <p className="video-chat-Heading">
                        IT Departmental Meeting
                      </p>
                    </Col>
                    <Col lg={1} md={1} sm={1}>
                      <img
                        src={SecurityIconMessasgeBox}
                        alt="Security Icon"
                        style={{ width: "17px" }}
                      />
                    </Col>
                    <Col lg={1} md={1} sm={1}>
                      <img
                        src={SearchIcon}
                        style={{ width: "17px" }}
                        alt="Search Icon"
                      />
                    </Col>
                    <Col lg={1} md={1} sm={1}>
                      <img
                        src={MinimizeIcon}
                        style={{ width: "17px" }}
                        alt="Minimize Icon"
                      />
                    </Col>
                    <Col lg={1} md={1} sm={1}>
                      <X
                        width={20}
                        className="video-chat-icons-insides"
                        onClick={onClickCloseChatHandler}
                      />
                    </Col>
                  </Row>
                  <Row className="video-max-crypto-rows">
                    <Col lg={12} md={12} sm={12} className="p-0">
                      <div className="encryption-videoCalling-video-max">
                        <Row>
                          <Col lg={7} md={7} sm={12}>
                            <p className="level-videoCalling-max">
                              Crypto Level:
                            </p>
                          </Col>
                          <Col
                            lg={5}
                            md={5}
                            sm={12}
                            className="positionRelative mt-1"
                          >
                            <p className="level-NIAP-max">NIAP + PQC</p>

                            <span className="securityicon-Video-box-max">
                              <img
                                src={SecurityIconMessasgeBox}
                                alt="Security MessasgeBox"
                                style={{ width: "17px" }}
                              />
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  <Row className="bottom-video-max-div">
                    <Col lg={2} md={2} sm={2}>
                      <img src={EmojiIcon} alt="Emoji Icon" />
                    </Col>
                    <Col lg={2} md={2} sm={2}>
                      <img
                        src={ChatPlus}
                        className="chat-inside-video-plus-max"
                        alt="Chat Plus"
                      />
                    </Col>
                    <Col lg={4} md={4} sm={4} className="chat-video-max">
                      <Form.Control
                        className="chat-message-input"
                        placeholder={"Type a Message"}
                      />
                    </Col>
                    <Col lg={2} md={2} sm={2}></Col>
                    <Col lg={2} md={2} sm={2}>
                      <img
                        src={SendIcon}
                        alt="Send Icon"
                        className="chat-max-video-sendIcon-img"
                      />
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          ) : isAgendaOpen === true ? (
            <>
              <div className="isAgenda-max-div">
                <Row>
                  <Col lg={10} md={10} sm={10}>
                    <p className="Agenda-title-max">Agenda</p>
                  </Col>

                  <Col lg={2} md={2} sm={2}>
                    <X
                      width={20}
                      className="agenda-Close-icon-max"
                      onClick={onClickCloseAgendaHandler}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">1</p>
                  </Col>

                  <Col lg={8} md={8} sm={8}>
                    <p className="agenda-pargraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.
                    </p>
                  </Col>
                  <Col>
                    <img
                      width={15}
                      src={ChatPlus}
                      alt="Chat Plus Icon"
                      className="agenda-plus-max"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">2</p>
                  </Col>

                  <Col lg={8} md={8} sm={8}>
                    <p className="agenda-pargraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.
                    </p>
                  </Col>
                  <Col>
                    <img
                      width={15}
                      src={ChatPlus}
                      alt="Chat Plus Icon"
                      className="agenda-plus-max"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">3</p>
                  </Col>

                  <Col lg={8} md={8} sm={8}>
                    <p className="agenda-pargraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.
                    </p>
                  </Col>
                  <Col>
                    <img
                      width={15}
                      src={ChatPlus}
                      alt="Chat Plus Icon"
                      className="agenda-plus-max"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">4</p>
                  </Col>

                  <Col lg={8} md={8} sm={8}>
                    <p className="agenda-pargraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.
                    </p>
                  </Col>
                  <Col>
                    <img
                      width={15}
                      src={ChatPlus}
                      alt="Chat Plus Icon"
                      className="agenda-plus-max"
                    />
                  </Col>
                </Row>
              </div>
            </>
          ) : isMinuteOpen === true ? (
            <>
              <div className="isMinutes-max-div">
                <Row>
                  <Col lg={10} md={10} sm={10}>
                    <p className="Agenda-title-max">MEETING MINUTES</p>
                  </Col>

                  <Col lg={2} md={2} sm={2}>
                    <X
                      width={20}
                      className="agenda-Close-icon-max"
                      onClick={onClickCloseMinutesHandler}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">1</p>
                  </Col>

                  <Col lg={9} md={9} sm={9}>
                    <p className="isMinutes-paragraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.Agenda Comes in here. It can have as much info as it
                      can hold.Agenda Comes in here. It can have as much info as
                      it can hold.
                    </p>
                  </Col>
                  <Col lg={1} md={1} sm={1} />
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">2</p>
                  </Col>

                  <Col lg={9} md={9} sm={9}>
                    <p className="isMinutes-paragraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.Agenda Comes in here. It can have as much info as it
                      can hold.Agenda Comes in here. It can have as much info as
                      it can hold.
                    </p>
                  </Col>
                  <Col lg={1} md={1} sm={1} />
                </Row>

                <Row className="mt-3">
                  <Col lg={2} md={2} sm={2}>
                    <p className="agenda-count-max">3</p>
                  </Col>

                  <Col lg={9} md={9} sm={9}>
                    <p className="isMinutes-paragraph-max">
                      Agenda Comes in here. It can have as much info as it can
                      hold.Agenda Comes in here. It can have as much info as it
                      can hold.Agenda Comes in here. It can have as much info as
                      it can hold.
                    </p>
                  </Col>
                  <Col lg={1} md={1} sm={1} />
                </Row>

                <Row>
                  <Col
                    lg={10}
                    md={10}
                    sm={10}
                    className="minutes-video-max-field"
                  >
                    <Form.Control
                      // className="chat-message-input"
                      placeholder={"Type a Message"}
                    />
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <img
                      src={SendIcon}
                      alt="Send Icon"
                      className="minutes-video-max"
                    />
                  </Col>
                </Row>
              </div>
            </>
          ) : null}
        </Col>
        <Col lg={8} md={8} sm={12} />
      </Row> */}
    </>
  )
}

export default VideoLargeBody
