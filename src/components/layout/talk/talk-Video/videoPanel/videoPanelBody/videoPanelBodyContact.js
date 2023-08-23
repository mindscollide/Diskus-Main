import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import { TextField } from '../../../../../elements'
import './videoPanelBody.css'
import VideoCallIcon from '../../../../../../assets/images/VideoCall-Icon.png'
import { Checkbox } from 'antd'
import {
  videoCallOTOFlag,
  videoCallNormalScreenFlag,
  videoCallNormalHeaderFlag,
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from '../../../../../../store/actions/VideoFeature_actions'

const VideoPanelBodyContact = () => {
  const { videoFeatureReducer } = useSelector((state) => state)

  const dispatch = useDispatch()

  const [searchChatValue, setSearchChatValue] = useState('')

  const searchChat = (e) => {
    setSearchChatValue(e)
    try {
      // if (
      //   talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      //   talkStateData.AllUserChats.AllUserChatsData !== null &&
      //   talkStateData.AllUserChats.AllUserChatsData.length !== 0
      // ) {
      //   if (e !== '') {
      //     let filteredData = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
      //       (value) => {
      //         return value.fullName.toLowerCase().includes(e.toLowerCase())
      //       },
      //     )
      //     if (filteredData.length === 0) {
      //       setAllChatData(
      //         talkStateData.AllUserChats.AllUserChatsData.allMessages,
      //       )
      //     } else {
      //       setAllChatData(filteredData)
      //     }
      //   } else if (e === '' || e === null) {
      //     let data = talkStateData.AllUserChats.AllUserChatsData.allMessages
      //     setSearchChatValue('')
      //     setAllChatData(data)
      //   }
      // }
    } catch {}
  }

  const otoVideoCall = () => {
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    // dispatch(videoCallOTOFlag(true))
    // dispatch(videoCallNormalHeaderFlag(true))
    // dispatch(videoCallNormalScreenFlag(true))
  }

  return (
    <>
      <Container>
        {videoFeatureReducer.VideoChatSearchFlag === true ? (
          <Row>
            <Col lg={12} md={12} sm={12}>
              <TextField
                maxLength={200}
                applyClass="form-control2"
                name="Name"
                change={(e) => {
                  searchChat(e.target.value)
                }}
                value={searchChatValue}
                placeholder="Search-Chat"
                labelClass={'d-none'}
              />
            </Col>
          </Row>
        ) : null}
        <Row className="single-chat">
          <Col lg={1} md={1} sm={1} className="mt-4">
            <Checkbox />
          </Col>
          <Col lg={2} md={2} sm={2} className="bottom-border">
            <div className="video-profile-icon">
              {/* Bell Notification SVG Code */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31.188"
                height="31.186"
                viewBox="0 0 31.188 31.186"
              >
                <g
                  id="Group_1683"
                  data-name="Group 1683"
                  transform="translate(-189.415 78.235)"
                >
                  <path
                    id="Path_594"
                    data-name="Path 594"
                    d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </div>
          </Col>
          <Col lg={7} md={7} sm={7} className="bottom-border">
            <div className={'video-block'}>
              <p className="Video-chat-username m-0">Test Name</p>

              <p className="video-chat-date m-0">Axis</p>
            </div>
          </Col>
          <Col lg={2} md={2} sm={2} className="mt-4">
            <img src={VideoCallIcon} onClick={otoVideoCall} />
          </Col>
        </Row>
        <Row className="single-chat">
          <Col lg={1} md={1} sm={1} className="mt-4">
            <Checkbox />
          </Col>
          <Col lg={2} md={2} sm={2} className="bottom-border">
            <div className="video-profile-icon">
              {/* Bell Notification SVG Code */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31.188"
                height="31.186"
                viewBox="0 0 31.188 31.186"
              >
                <g
                  id="Group_1683"
                  data-name="Group 1683"
                  transform="translate(-189.415 78.235)"
                >
                  <path
                    id="Path_594"
                    data-name="Path 594"
                    d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </div>
          </Col>
          <Col lg={7} md={7} sm={7} className="bottom-border">
            <div
              className={'video-block'}
              //   onClick={() => chatClick(dataItem)}
            >
              <p className="Video-chat-username m-0">Test Name</p>

              <p className="video-chat-date m-0">Axis</p>
            </div>
          </Col>
          <Col lg={2} md={2} sm={2} className="mt-4">
            <img
              src={VideoCallIcon}
              //   onClick={() => anotherVideoPanelHandler(true)}
            />
          </Col>
        </Row>
        <Row className="single-chat">
          <Col lg={1} md={1} sm={1} className="mt-4">
            <Checkbox />
          </Col>
          <Col lg={2} md={2} sm={2} className="bottom-border">
            <div className="video-profile-icon">
              {/* Bell Notification SVG Code */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="31.188"
                height="31.186"
                viewBox="0 0 31.188 31.186"
              >
                <g
                  id="Group_1683"
                  data-name="Group 1683"
                  transform="translate(-189.415 78.235)"
                >
                  <path
                    id="Path_594"
                    data-name="Path 594"
                    d="M220.6-47.049H218.18a13.038,13.038,0,0,0-4.892-10.2,12.728,12.728,0,0,0-8.892-2.939,12.681,12.681,0,0,0-6.291,1.95,13.229,13.229,0,0,0-4.581,4.787,13.087,13.087,0,0,0-1.674,6.385h-2.434a15.387,15.387,0,0,1,2.885-9.01,15.6,15.6,0,0,1,7.585-5.709c-.09-.076-.145-.129-.207-.175a8.863,8.863,0,0,1-3.339-9.641,8.764,8.764,0,0,1,6.6-6.379c.477-.127.975-.171,1.464-.254h1.218c.489.083.987.128,1.464.254a8.694,8.694,0,0,1,6.591,6.382A8.679,8.679,0,0,1,211-62.5c-.261.247-.554.459-.854.705.09.041.151.073.215.1a15.292,15.292,0,0,1,5.562,3.519,15.27,15.27,0,0,1,4.436,8.416c.1.6.164,1.2.244,1.8ZM205.008-75.8a6.6,6.6,0,0,0-6.576,6.563,6.6,6.6,0,0,0,6.579,6.591,6.6,6.6,0,0,0,6.576-6.563A6.6,6.6,0,0,0,205.008-75.8Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </div>
          </Col>
          <Col lg={7} md={7} sm={7} className="bottom-border">
            <div
              className={'video-block'}
              //   onClick={() => chatClick(dataItem)}
            >
              <p className="Video-chat-username m-0">Test Name</p>

              <p className="video-chat-date m-0">Tresmark</p>
            </div>
          </Col>
          <Col lg={2} md={2} sm={2} className="mt-4">
            <img
              src={VideoCallIcon}
              //   onClick={() => anotherVideoPanelHandler(true)}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default VideoPanelBodyContact
