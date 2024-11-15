import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import './videoCallNormalChat.css'
import GroupIcon from '../../../../../assets/images/newElements/Peoplegroup.png'
import SecurityIconMessasgeBox from '../../../../../assets/images/SecurityIcon-MessasgeBox.png'
import SearchIcon from '../../../../../assets/images/Search-Icon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'
import EmojiIcon from '../../../../../assets/images/Emoji-Select-Icon.png'
import ChatPlus from '../../../../../assets/images/newElements/chatPlus.png'
import SendIcon from '../../../../../assets/images/newElements/sendIcon.png'

const VideoPanelNormalChat = () => {
  const onClickCloseChatHandler = () => {}

  return (
    <>
      <div className={'chatmedium-messenger-IsOpen'}>
        <Container>
          <Row className="mt-3">
            <Col lg={2} md={2} sm={2}>
              <img src={GroupIcon} className="video-chat-group-icon" />
            </Col>
            <Col lg={6} md={6} sm={6}>
              <p className="video-chat-It-Heading">IT Departmental Meeting</p>
            </Col>
            <Col lg={1} md={1} sm={1}>
              <img src={SecurityIconMessasgeBox} style={{ width: '17px' }} />
            </Col>
            <Col lg={1} md={1} sm={1}>
              <img src={SearchIcon} style={{ width: '17px' }} />
            </Col>
            <Col lg={1} md={1} sm={1}>
              <img src={MinimizeIcon} style={{ width: '17px' }} />
            </Col>
            <Col lg={1} md={1} sm={1}>
              <X
                width={20}
                className="video-chat-icon-inside"
                onClick={onClickCloseChatHandler}
              />
            </Col>
          </Row>
          <Row className="video-crypto-row">
            <Col lg={12} md={12} sm={12} className="p-0">
              <div className="encryption-videoCalling-video-chat">
                <Row>
                  <Col lg={7} md={7} sm={12}>
                    <p className="level-videoCalling-heading">Crypto Level:</p>
                  </Col>
                  <Col lg={5} md={5} sm={12} className="positionRelative mt-1">
                    <p className="level-NIAP">NIAP + PQC</p>

                    <span className="securityicon-Video-box">
                      <img
                        src={SecurityIconMessasgeBox}
                        style={{ width: '17px' }}
                      />
                    </span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className="bottom-video-chat-input-div">
            <Col lg={2} md={2} sm={2}>
              <img src={EmojiIcon} />
            </Col>
            <Col lg={2} md={2} sm={2}>
              <img src={ChatPlus} className="chat-inside-video-plus-img" />
            </Col>
            <Col lg={4} md={4} sm={4} className="chat-video-field">
              <Form.Control
                className="chat-message-input"
                placeholder={'Type a Message'}
              />
            </Col>
            <Col lg={2} md={2} sm={2}></Col>
            <Col lg={2} md={2} sm={2}>
              <img src={SendIcon} className="chat-inside-video-sendIcon-img" />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default VideoPanelNormalChat
