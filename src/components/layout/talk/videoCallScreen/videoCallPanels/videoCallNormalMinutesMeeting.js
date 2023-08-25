import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import './videoCallNormalMinutesMeeting.css'
import SendIcon from '../../../../../assets/images/newElements/sendIcon.png'

const VideoPanelNormalMinutesMeeting = () => {
  const onClickCloseMinutesHandler = () => {}

  return (
    <>
      <div className="isMinutesmedium-div-changes">
        <Row>
          <Col lg={10} md={10} sm={10}>
            <p className="Agenda-title-heading">MEETING MINUTES</p>
          </Col>

          <Col lg={2} md={2} sm={2}>
            <X
              width={20}
              className="agenda-Close-icon"
              onClick={onClickCloseMinutesHandler}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">1</p>
          </Col>

          <Col lg={9} md={9} sm={9}>
            <p className="isMinutes-paragraph">
              Agenda Comes in here. It can have as much info as it can
              hold.Agenda Comes in here. It can have as much info as it can
              hold.Agenda Comes in here. It can have as much info as it can
              hold.
            </p>
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>

        <Row className="mt-3">
          <Col lg={2} md={2} sm={2}>
            <p className="agenda-count">2</p>
          </Col>

          <Col lg={9} md={9} sm={9}>
            <p className="isMinutes-paragraph">
              Agenda Comes in here. It can have as much info as it can
              hold.Agenda Comes in here. It can have as much info as it can
              hold.Agenda Comes in here. It can have as much info as it can
              hold.
            </p>
          </Col>
          <Col lg={1} md={1} sm={1} />
        </Row>

        <Row>
          <Col lg={10} md={10} sm={10} className="minutesmedium-video-field">
            <Form.Control
              // className="chat-message-input"
              placeholder={'Type a Message'}
            />
          </Col>
          <Col lg={2} md={2} sm={2}>
            <img src={SendIcon} className="minutesmedium-video-sendIcon" />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default VideoPanelNormalMinutesMeeting
