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
import { activeChat } from '../../../../../store/actions/Talk_action'
import {
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  agendaEnableNormalFlag,
  chatEnableNormalFlag,
  minutesMeetingEnableNormalFlag,
  leaveCallModal,
  participantPopup,
  videoChatMessagesFlag,
} from '../../../../../store/actions/VideoFeature_actions'
import { GetOTOUserMessages } from '../../../../../store/actions/Talk_action'
import { LeaveCall } from '../../../../../store/actions/VideoMain_actions'
import { useTranslation } from 'react-i18next'

const VideoCallNormalHeader = ({ isScreenActive, screenShareButton }) => {
  const { videoFeatureReducer, VideoMainReducer, talkStateData } = useSelector(
    (state) => state,
  )

  let callerNameInitiate = localStorage.getItem('callerNameInitiate')
  let organizationName = localStorage.getItem('OrganizatioName')
  let currentUserName = localStorage.getItem('name')
  let callerName = localStorage.getItem('callerName')
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem('initiateVideoCall'),
  )
  let recipentCalledID = Number(localStorage.getItem('recipentCalledID'))

  let callerID = Number(localStorage.getItem('callerID'))
  let recipentID = Number(localStorage.getItem('recipentID'))
  let currentUserID = Number(localStorage.getItem('userID'))
  let currentOrganization = Number(localStorage.getItem('organizationID'))
  let roomID = localStorage.getItem('acceptedRoomID')
  let callTypeID = Number(localStorage.getItem('callTypeID'))
  let initiateRoomID = localStorage.getItem('initiateCallRoomID')
  let callerObject = localStorage.getItem('callerStatusObject')
  let currentCallType = Number(localStorage.getItem('CallType'))

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const [showNotification, setShowNotification] = useState(true)

  const [isActiveIcon, setIsActiveIcon] = useState(false)

  // const [isParticipantActive, setIsParticipantActive] = useState(false)

  const [currentParticipants, setCurrentParticipants] = useState([])

  const [participantStatus, setParticipantStatus] = useState([])

  const participantPopupDisable = useRef(null)
  const leaveModalPopupRef = useRef(null)

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
    // localStorage.setItem('activeCall', false)
  }

  const endCallParticipant = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    }
    dispatch(LeaveCall(Data, navigate, t))
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    localStorage.setItem('activeCall', false)
  }

  const onClickCloseChatHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.VideoChatMessagesFlag === false) {
        if (callerID === currentUserID) {
          let activeChatData = {
            id: VideoMainReducer.VideoRecipentData.userID,
            fullName: VideoMainReducer.VideoRecipentData.userName,
            imgURL: '',
            messageBody: '',
            messageDate: '',
            notiCount: 0,
            messageType: 'O',
            isOnline: false,
            companyName: organizationName,
            sentDate: '',
            receivedDate: '',
            seenDate: '',
            attachmentLocation: '',
            senderID: currentUserID,
            admin: 0,
            isBlock: 0,
          }
          dispatch(activeChat(activeChatData))
        } else if (callerID !== currentUserID) {
          let activeChatData = {
            id: callerID,
            fullName: callerNameInitiate,
            imgURL: '',
            messageBody: '',
            messageDate: '',
            notiCount: 0,
            messageType: 'O',
            isOnline: false,
            companyName: organizationName,
            sentDate: '',
            receivedDate: '',
            seenDate: '',
            attachmentLocation: '',
            senderID: currentUserID,
            admin: 0,
            isBlock: 0,
          }
          dispatch(activeChat(activeChatData))
        }
        localStorage.setItem('ActiveChatType', 'O')
        dispatch(chatEnableNormalFlag(true))
        setIsActiveIcon(true)
        let chatOTOData = {
          UserID: currentUserID,
          ChannelID: currentOrganization,
          OpponentUserId:
            callerID !== currentUserID ? callerID : recipentCalledID,
          NumberOfMessages: 50,
          OffsetMessage: 0,
        }
        dispatch(videoChatMessagesFlag(true))
        dispatch(GetOTOUserMessages(navigate, chatOTOData, t))
        localStorage.setItem('ActiveChatType', 'O')
        localStorage.setItem(
          'activeOtoChatID',
          callerID !== currentUserID ? callerID : recipentCalledID,
        )
      } else {
        // dispatch(chatEnableNormalFlag(false))
        // setIsActiveIcon(false)
        dispatch(videoChatMessagesFlag(false))
      }
    }
  }

  console.log('talkStateData', talkStateData)

  const closeParticipantHandler = () => {
    if (videoFeatureReducer.LeaveCallModalFlag === false) {
      if (videoFeatureReducer.ParticipantPopupFlag === false) {
        dispatch(participantPopup(true))
      } else {
        dispatch(participantPopup(false))
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
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    }
    dispatch(LeaveCall(Data, navigate, t))
    const emptyArray = []
    localStorage.setItem('callerStatusObject', JSON.stringify(emptyArray))
    setParticipantStatus([])
    localStorage.setItem('activeCall', false)
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
    dispatch(leaveCallModal(false))
    dispatch(participantPopup(false))
  }

  const closeNotification = () => {
    setShowNotification(false)
  }

  const handleOutsideClick = (event) => {
    if (
      participantPopupDisable.current &&
      !participantPopupDisable.current.contains(event.target) &&
      videoFeatureReducer.ParticipantPopupFlag
    ) {
      dispatch(participantPopup(false))
    }
    // if (
    //   leaveModalPopupRef.current &&
    //   !leaveModalPopupRef.current.contains(event.target) &&
    //   videoFeatureReducer.LeaveCallModalFlag
    // ) {
    //   dispatch(leaveCallModal(false))
    // }
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

  useEffect(() => {
    if (callerObject !== undefined && callerObject !== null) {
      let callerObjectObj = JSON.parse(callerObject)
      setParticipantStatus((prevStatus) => [callerObjectObj, ...prevStatus])
    }
  }, [callerObject])

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [
    videoFeatureReducer.ParticipantPopupFlag,
    // videoFeatureReducer.LeaveCallModalFlag,
  ])

  console.log('participantStatus', participantStatus[0])

  return (
    <>
      <Row className="mb-4">
        {currentCallType === 2 || callTypeID === 2 ? (
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">{t('Group-call')}</p>
          </Col>
        ) : (
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">
              {currentUserName !==
                VideoMainReducer.VideoRecipentData.userName &&
              Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
              initiateVideoCallFlag === true
                ? VideoMainReducer.VideoRecipentData.userName ||
                  VideoMainReducer.VideoRecipentData.recipients[0].userName
                : currentUserName !==
                    VideoMainReducer.VideoRecipentData.userName &&
                  Object.keys(VideoMainReducer.VideoRecipentData).length > 0 &&
                  initiateVideoCallFlag === false
                ? VideoMainReducer.VideoRecipentData.userName ||
                  VideoMainReducer.VideoRecipentData.recipients[0].userName
                : Object.keys(VideoMainReducer.VideoRecipentData).length === 0
                ? callerName
                : null}
            </p>
          </Col>
        )}

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
              <img
                className="cursor-pointer"
                src={CloseNotification}
                onClick={closeNotification}
                alt=""
              />
            </div>
          ) : null}
        </Col>
        <>
          <Col lg={5} md={5} sm={12} className="normal-screen-top-icons">
            {callerID === currentUserID && currentCallType === 2 ? (
              <div
                className="positionRelative flipHorizontal"
                ref={participantPopupDisable}
              >
                {videoFeatureReducer.ParticipantPopupFlag === true ? (
                  <>
                    <img
                      className={
                        videoFeatureReducer.LeaveCallModalFlag === true
                          ? 'grayScaleImage'
                          : 'cursor-pointer'
                      }
                      src={ActiveParticipantIcon}
                      onClick={closeParticipantHandler}
                      height={30}
                      width={30}
                    />
                    <div className="participants-list" key={Math.random()}>
                      {currentParticipants !== undefined &&
                      currentParticipants !== null &&
                      currentParticipants.length > 0
                        ? currentParticipants.map((participantData, index) => {
                            console.log(
                              'participantStatus',
                              participantStatus[0],
                            )
                            const matchingStatus = participantStatus[0].find(
                              (status) =>
                                status.RecipientID === participantData.userID &&
                                status.RoomID === initiateRoomID,
                            )
                            return (
                              <Row className="m-0" key={index}>
                                <Col className="p-0" lg={7} md={7} sm={12}>
                                  <p className="participant-name">
                                    {participantData.userName}
                                  </p>
                                </Col>
                                <Col className="p-0" lg={5} md={5} sm={12}>
                                  <p className="participant-state">
                                    {matchingStatus
                                      ? matchingStatus.CallStatus
                                      : 'Calling...'}
                                  </p>
                                </Col>
                              </Row>
                            )
                          })
                        : null}
                      <Row className="hostBorder m-0">
                        <Col className="p-0" lg={7} md={7} sm={12}>
                          <p className="participant-name">{currentUserName}</p>
                        </Col>
                        <Col className="p-0" lg={5} md={5} sm={12}>
                          <p className="participant-state">Host</p>
                        </Col>
                      </Row>
                      {/* <Button
                        className="add-participant-button"
                        text="Add Participants"
                        icon={
                          <img src={AddParticipantIcon} alt="participants" />
                        }
                        textClass="text-positioning"
                      /> */}
                    </div>
                  </>
                ) : (
                  <img
                    className={
                      videoFeatureReducer.LeaveCallModalFlag === true
                        ? 'grayScaleImage'
                        : 'cursor-pointer'
                    }
                    src={ParticipantsIcon}
                    onClick={closeParticipantHandler}
                    height={20}
                    width={25}
                  />
                )}
              </div>
            ) : null}
            <div className="screenShare-Toggle flipHorizontal">
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : 'cursor-pointer'
                }
                onClick={screenShareButton}
                src={NonActiveScreenShare}
              />
            </div>
            <div className="screenShare-Toggle flipHorizontal">
              <img
                className={
                  videoFeatureReducer.LeaveCallModalFlag === true
                    ? 'grayScaleImage'
                    : 'cursor-pointer'
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
                className="cursor-pointer"
              />
            ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                callerID === currentUserID) ||
              callerID === 0 ? (
              <img
                className="cursor-pointer"
                width={25}
                src={CallEndRedIcon}
                onClick={openVideoPanel}
              />
            ) : videoFeatureReducer.LeaveCallModalFlag === false &&
              callerID !== currentUserID ? (
              <img
                className="cursor-pointer"
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
                    : 'cursor-pointer'
                }
                src={MinimizeIcon}
              />
            </div>
            {videoFeatureReducer.NormalizeVideoFlag === true &&
            videoFeatureReducer.MinimizeVideoFlag === false &&
            videoFeatureReducer.MaximizeVideoFlag === false ? (
              <div className="video_maximize_icon">
                <img
                  src={ExpandIcon}
                  onClick={otoMaximizeVideoPanel}
                  className={
                    videoFeatureReducer.LeaveCallModalFlag === true
                      ? 'grayScaleImage'
                      : 'cursor-pointer'
                  }
                />
              </div>
            ) : videoFeatureReducer.NormalizeVideoFlag === false &&
              videoFeatureReducer.MinimizeVideoFlag === false &&
              videoFeatureReducer.MaximizeVideoFlag === true ? (
              <div className="normalize_video_icon">
                <img
                  width={17}
                  src={NormalizeIcon}
                  alt="Maximize Icon"
                  className={
                    videoFeatureReducer.LeaveCallModalFlag === true
                      ? 'normalize-Icon-Large grayScaleImage'
                      : 'normalize-Icon-Large cursor-pointer'
                  }
                  onClick={normalizeScreen}
                />
              </div>
            ) : null}
          </Col>
        </>

        <>
          <Col lg={1} md={1} sm={12}></Col>
        </>
      </Row>
      <div ref={leaveModalPopupRef}>
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
      </div>
    </>
  )
}

export default VideoCallNormalHeader
