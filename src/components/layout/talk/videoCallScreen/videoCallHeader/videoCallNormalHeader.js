import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './videoCallHeader.css'
import { Button, NotificationBar } from './../../../../elements'
import MicVideo from '../../../../../assets/images/newElements/micVideo.png'
import VideoCallIcon from '../../../../../assets/images/newElements/VideoIconExpand.png'
import ExpandIcon from '../../../../../assets/images/newElements/ExpandColorfullIcon.png'
import MinimizeIcon from '../../../../../assets/images/newElements/MinimizeIcon.png'
import ActiveScreenShare from '../../../../../assets/images/newElements/ActiveScreenShareIcon.svg'
import NonActiveScreenShare from '../../../../../assets/images/newElements/NonActiveScreenShare.svg'
import ScreenShare from '../../../../../assets/images/newElements/ScreenShareIcon.png'
import HandRaise from '../../../../../assets/images/newElements/HandRaiseIcon.svg'
import Board from '../../../../../assets/images/newElements/WhiteBoard.svg'
import ThreeDots from '../../../../../assets/images/newElements/ThreeDotsIcon.svg'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import NormalizeIcon from '../../../../../assets/images/newElements/Normalize-Icon.png'
import CancelIcon from '../../../../../assets/images/Artboard9.png'
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
  leaveCallModal,
} from '../../../../../store/actions/VideoFeature_actions'
import { LeaveCall } from '../../../../../store/actions/VideoMain_actions'
import { useTranslation } from 'react-i18next'

const VideoCallNormalHeader = ({ isScreenActive, screenShareButton }) => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  let callerNameInitiate = localStorage.getItem('callerNameInitiate')
  let currentUserName = localStorage.getItem('name')
  let callerName = localStorage.getItem('callerName')
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem('initiateVideoCall'),
  )

  let callerID = Number(localStorage.getItem('callerID'))
  let currentUserID = Number(localStorage.getItem('userID'))
  let currentOrganization = Number(localStorage.getItem('organizationID'))
  let roomID = localStorage.getItem('RoomID')

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  console.log(
    'VideoMainReducer.LeaveCallResponse',
    VideoMainReducer.LeaveCallResponse,
  )

  const otoMaximizeVideoPanel = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true))
      dispatch(minimizeVideoPanelFlag(false))
      dispatch(normalizeVideoPanelFlag(false))
    }
  }

  const minimizeVideoPanel = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(false))
      dispatch(minimizeVideoPanelFlag(true))
      dispatch(normalizeVideoPanelFlag(false))
    }
  }

  const closeVideoPanel = () => {
    // dispatch(normalizeVideoPanelFlag(false))
    // dispatch(maximizeVideoPanelFlag(false))
    // dispatch(minimizeVideoPanelFlag(false))
    dispatch(leaveCallModal(true))
    localStorage.setItem('activeCall', false)
  }

  const [isActiveIcon, setIsActiveIcon] = useState(false)

  const onClickCloseChatHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (isActiveIcon === false) {
        dispatch(chatEnableNormalFlag(true))
        setIsActiveIcon(true)
        dispatch(agendaEnableNormalFlag(false))
        dispatch(minutesMeetingEnableNormalFlag(false))
      } else {
        dispatch(chatEnableNormalFlag(false))
        setIsActiveIcon(false)
        dispatch(agendaEnableNormalFlag(false))
        dispatch(minutesMeetingEnableNormalFlag(false))
      }
    }
  }

  const normalizeScreen = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(normalizeVideoPanelFlag(true))
      dispatch(maximizeVideoPanelFlag(false))
      dispatch(minimizeVideoPanelFlag(false))
    }
  }

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false))
  }

  const leaveCall = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: callerID === currentUserID ? true : false,
    }
    dispatch(LeaveCall(Data, navigate, t))
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    dispatch(leaveCallModal(false))
  }

  useEffect(() => {}, [
    VideoMainReducer.VideoRecipentData.userName,
    callerNameInitiate,
    callerName,
  ])

  return (
    <>
      <Row className="mb-4">
        <Col lg={3} md={3} sm={12} className="mt-1">
          <p className="title-heading">
            {currentUserName !== VideoMainReducer.VideoRecipentData.userName &&
            Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
            initiateVideoCallFlag === true
              ? VideoMainReducer.VideoRecipentData.userName
              : currentUserName !==
                  VideoMainReducer.VideoRecipentData.userName &&
                Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                initiateVideoCallFlag === false
              ? callerNameInitiate
              : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
              ? callerName
              : null}
          </p>
        </Col>
        <>
          <Col lg={9} md={9} sm={12} className="normal-screen-top-icons">
            {isScreenActive ? (
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                width={30}
                onClick={screenShareButton}
                src={ActiveScreenShare}
              />
            ) : (
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                width={30}
                onClick={screenShareButton}
                src={NonActiveScreenShare}
              />
            )}
            {isActiveIcon ? (
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                width={30}
                src={ActiveChat}
                onClick={onClickCloseChatHandler}
              />
            ) : (
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                width={30}
                src={ChatNonActive}
                onClick={onClickCloseChatHandler}
              />
            )}
            {videoFeatureReducer.LeaveCallModalFlag === true ? (
              <img
                width={25}
                onClick={cancelLeaveCallOption}
                src={CancelIcon}
              />
            ) : (
              <img width={25} src={CallEndRedIcon} onClick={closeVideoPanel} />
            )}
            <img
              className={
                videoFeatureReducer.LeaveCallModalFlag === true
                  ? 'grayScaleImage'
                  : ''
              }
              width={20}
              src={MinimizeIcon}
              onClick={minimizeVideoPanel}
            />

            {videoFeatureReducer.NormalizeVideoFlag === true &&
            videoFeatureReducer.MinimizeVideoFlag === false &&
            videoFeatureReducer.MaximizeVideoFlag === false ? (
              <img
                width={17}
                src={ExpandIcon}
                onClick={otoMaximizeVideoPanel}
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
              />
            ) : videoFeatureReducer.NormalizeVideoFlag === false &&
              videoFeatureReducer.MinimizeVideoFlag === false &&
              videoFeatureReducer.MaximizeVideoFlag === true ? (
              <img
                width={17}
                src={NormalizeIcon}
                alt="Maximize Icon"
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'normalize-Icon-Large grayScaleImage'
                    : 'normalize-Icon-Large'
                }
                onClick={normalizeScreen}
              />
            ) : null}
          </Col>
        </>

        <>
          <Col lg={1} md={1} sm={12}></Col>
        </>
      </Row>

      {videoFeatureReducer.LeaveCallModalFlag === true ? (
        <div className="leave-meeting-options leave-meeting-options-position">
          <div className="leave-meeting-options__inner">
            <Button
              className="leave-meeting-options__btn leave-meeting-red-button"
              text="End Call"
              onClick={leaveCall}
            />

            <Button
              className="leave-meeting-options__btn leave-meeting-gray-button"
              text="End Call For All"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default VideoCallNormalHeader
