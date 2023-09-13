import React, { useState, useEffect, useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './videoCallHeader.css'
import { Button, NotificationBar } from './../../../../elements'
import MicVideo from '../../../../../assets/images/newElements/micVideo.png'
import VideoCallIcon from '../../../../../assets/images/newElements/VideoIconExpand.png'
import ExpandIcon from '../../../../../assets/images/ExpandColorfullIcon.png'
import MinimizeIcon from '../../../../../assets/images/MinimizeIcon.png'
import ActiveScreenShare from '../../../../../assets/images/newElements/ActiveScreenShareIcon.svg'
import NonActiveScreenShare from '../../../../../assets/images/NonActiveScreenShare.png'
import ScreenShare from '../../../../../assets/images/newElements/ScreenShareIcon.png'
import HandRaise from '../../../../../assets/images/newElements/HandRaiseIcon.svg'
import Board from '../../../../../assets/images/newElements/WhiteBoard.svg'
import ThreeDots from '../../../../../assets/images/newElements/ThreeDotsIcon.svg'
import videoEndIcon from '../../../../../assets/images/newElements/VideoEndIcon.png'
import ChatNonActive from '../../../../../assets/images/newElements/ChatIconNonActive.svg'
import ActiveChat from '../../../../../assets/images/newElements/ActiveChatIcon.svg'
import ChatIcon from '../../../../../assets/images/Chat-Icon.png'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import NormalizeIcon from '../../../../../assets/images/Normalize-Icon.png'
import CancelIcon from '../../../../../assets/images/Artboard9.png'
import CloseNotification from '../../../../../assets/images/Close-Notification.png'
import ActiveParticipantIcon from '../../../../../assets/images/Active-Participant-Icon.png'
import AddParticipantIcon from '../../../../../assets/images/Add-Participant-Icon.png'
import ParticipantsIcon from '../../../../../assets/images/Participants-Icon.png'
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

  const [showNotification, setShowNotification] = useState(true)

  const [isActiveIcon, setIsActiveIcon] = useState(false)

  const [isParticipantActive, setIsParticipantActive] = useState(false)

  const [currentParticipants, setCurrentParticipants] = useState([])

  const otoMaximizeVideoPanel = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      dispatch(maximizeVideoPanelFlag(true))
      dispatch(minimizeVideoPanelFlag(false))
      dispatch(normalizeVideoPanelFlag(false))
    }
    setShowNotification(true)
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
    dispatch(leaveCallModal(false))
    localStorage.setItem('activeCall', false)
  }

  const openVideoPanel = () => {
    // dispatch(normalizeVideoPanelFlag(false))
    // dispatch(maximizeVideoPanelFlag(false))
    // dispatch(minimizeVideoPanelFlag(false))
    dispatch(leaveCallModal(true))
    localStorage.setItem('activeCall', false)
  }

  const endCallParticipant = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
    }
    dispatch(LeaveCall(Data, navigate, t))
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    localStorage.setItem('activeCall', false)
  }

  const onClickCloseChatHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (isActiveIcon === false) {
        dispatch(chatEnableNormalFlag(true))
        setIsActiveIcon(true)
      } else {
        dispatch(chatEnableNormalFlag(false))
        setIsActiveIcon(false)
      }
    }
  }

  const closeParticipantHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (isParticipantActive === false) {
        setIsParticipantActive(true)
      } else {
        setIsParticipantActive(false)
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
    localStorage.setItem('activeCall', false)
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    dispatch(leaveCallModal(false))
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  useEffect(() => {}, [
    VideoMainReducer.VideoRecipentData.userName,
    callerNameInitiate,
    callerName,
  ])

  useEffect(() => {
    // Use setTimeout to hide the notification after 4 seconds
    if (showNotification === true) {
      const timeoutId = setTimeout(() => {
        setShowNotification(false)
      }, 4000)
      // Clear the timeout when the component unmounts to avoid memory leaks
      return () => clearTimeout(timeoutId)
    }
  }, [showNotification])

  useEffect(() => {
    if (
      VideoMainReducer.GroupCallRecipientsData !== undefined &&
      VideoMainReducer.GroupCallRecipientsData !== null &&
      VideoMainReducer.GroupCallRecipientsData.length !== 0
    ) {
      setCurrentParticipants(VideoMainReducer.GroupCallRecipientsData)
    } else {
      setCurrentParticipants([])
    }
  }, [VideoMainReducer.GroupCallRecipientsData])

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
        <Col
          lg={4}
          md={4}
          sm={12}
          className="d-flex justify-content-center align-items-center mt-1"
        >
          {videoFeatureReducer.MaximizeVideoFlag === true &&
          showNotification === true ? (
            <div className="Notification-maximize">
              <p className="Notification-text">
                Minimize call to see the screen
              </p>
              <img src={CloseNotification} onClick={closeNotification} alt="" />
            </div>
          ) : null}
        </Col>
        <>
          <Col lg={5} md={5} sm={12} className="normal-screen-top-icons">
            <div className="screenShare-Toggle">
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                onClick={screenShareButton}
                src={NonActiveScreenShare}
              />
            </div>
            <div className="screenShare-Toggle">
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                onClick={onClickCloseChatHandler}
                src={ChatIcon}
              />
            </div>
            {videoFeatureReducer.LeaveCallModalFlag === true &&
            callerID === currentUserID ? (
              <img
                width={25}
                onClick={cancelLeaveCallOption}
                src={videoEndIcon}
              />
            ) : videoFeatureReducer.LeaveCallModalFlag === false &&
              callerID === currentUserID ? (
              <img width={25} src={CallEndRedIcon} onClick={openVideoPanel} />
            ) : videoFeatureReducer.LeaveCallModalFlag === false &&
              callerID !== currentUserID ? (
              <img
                width={35}
                src={CallEndRedIcon}
                onClick={endCallParticipant}
              />
            ) : null}
            <div onClick={minimizeVideoPanel}>
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : ''
                }
                src={MinimizeIcon}
              />
            </div>
            {videoFeatureReducer.NormalizeVideoFlag === true &&
            videoFeatureReducer.MinimizeVideoFlag === false &&
            videoFeatureReducer.MaximizeVideoFlag === false ? (
              <img
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
              text="End Call for Everyone"
              onClick={leaveCall}
            />

            <Button
              className="leave-meeting-options__btn leave-meeting-gray-button"
              text="Cancel"
              onClick={closeVideoPanel}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default VideoCallNormalHeader
