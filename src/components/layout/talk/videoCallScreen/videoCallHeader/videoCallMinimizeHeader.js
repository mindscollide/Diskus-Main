import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
import { Button } from './../../../../elements'
import videoEndIcon from '../../../../../assets/images/newElements/VideoEndIcon.png'

import './videoCallHeader.css'
import {
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
} from '../../../../../store/actions/VideoFeature_actions'
import MinimizeMicIcon from '../../../../../assets/images/newElements/MinimizeMicIcon.png'
import MinimizeExpandIcon from '../../../../../assets/images/newElements/MinimizeExpandIcon.png'
import MinimizeVideoIcon from '../../../../../assets/images/newElements/MinimizeVideoIcon.png'
import CallEndRedIcon from '../../../../../assets/images/newElements/CallRedIcon.svg'
import MinToNormalIcon from '../../../../../assets/images/newElements/Min-to-normal-Icon.svg'
import { LeaveCall } from '../../../../../store/actions/VideoMain_actions'

const VideoCallMinimizeHeader = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [participantStatus, setParticipantStatus] = useState([])

  let callerNameInitiate = localStorage.getItem('callerNameInitiate')
  let currentUserName = localStorage.getItem('name')
  let callerName = localStorage.getItem('callerName')
  let initiateVideoCallFlag = JSON.parse(
    localStorage.getItem('initiateVideoCall'),
  )

  let currentOrganization = Number(localStorage.getItem('organizationID'))
  let roomID = localStorage.getItem('acceptedRoomID')
  let callTypeID = Number(localStorage.getItem('callTypeID'))
  let initiateRoomID = localStorage.getItem('initiateCallRoomID')
  let currentCallType = Number(localStorage.getItem('CallType'))
  let callerID = Number(localStorage.getItem('callerID'))
  let currentUserID = Number(localStorage.getItem('userID'))

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  const dispatch = useDispatch()

  const closeVideoPanel = () => {
    // dispatch(normalizeVideoPanelFlag(false));
    // dispatch(maximizeVideoPanelFlag(false));
    // dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false))
    localStorage.setItem('activeCall', false)
  }

  const normalizePanel = () => {
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(maximizeVideoPanelFlag(false))
    dispatch(minimizeVideoPanelFlag(false))
  }

  const maximizePanel = () => {
    dispatch(normalizeVideoPanelFlag(false))
    dispatch(maximizeVideoPanelFlag(true))
    dispatch(minimizeVideoPanelFlag(false))
  }

  const openVideoPanel = () => {
    dispatch(leaveCallModal(true))
    localStorage.setItem('activeCall', false)
  }

  // this is for leave call group API

  const minimizeEndCallParticipant = () => {
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

  const cancelLeaveCallOption = () => {
    dispatch(leaveCallModal(false))
  }

  const minimizeLeaveCall = () => {
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

  return (
    <>
      <div className="videoCallGroupScreen-minmizeVideoCall">
        <Row className="mt-2 mb-4">
          <Col lg={3} md={3} sm={12} className="mt-1">
            <p className="title-heading">
              {currentUserName !==
                VideoMainReducer.VideoRecipentData.userName &&
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
          <Col lg={7} md={7} sm={12}>
            <div className="minimize-screen-on-bottom">
              <img src={MinimizeVideoIcon} className={'minimize-video-icon'} />
              <img src={MinimizeMicIcon} />
              {videoFeatureReducer.LeaveCallModalFlag === true &&
              callerID === currentUserID ? (
                <img
                  width={25}
                  onClick={cancelLeaveCallOption}
                  src={videoEndIcon}
                  alt="Icon Video"
                />
              ) : (videoFeatureReducer.LeaveCallModalFlag === false &&
                  callerID === currentUserID) ||
                callerID === 0 ? (
                <img
                  width={25}
                  src={CallEndRedIcon}
                  onClick={openVideoPanel}
                  alt="Icon Video"
                />
              ) : videoFeatureReducer.LeaveCallModalFlag === false &&
                callerID !== currentUserID ? (
                <img
                  width={35}
                  src={CallEndRedIcon}
                  onClick={minimizeEndCallParticipant}
                  alt="Icon Video"
                />
              ) : null}
            </div>
          </Col>
          <Col lg={2} md={2} sm={12}>
            <div className="minimizeGroup-expand-icon">
              <img
                src={MinToNormalIcon}
                onClick={normalizePanel}
                className="min-to-normal-icon"
                alt="Icon Video"
              />

              <img
                src={MinimizeExpandIcon}
                // className="minimize-expand-icon"
                onClick={maximizePanel}
                className="min-to-max-icon"
                alt="Icon Video"
              />
            </div>
          </Col>
        </Row>
      </div>

      <div>
        {videoFeatureReducer.LeaveCallModalFlag === true ? (
          <div className="minimize-leave-meeting-options leave-meeting-options-position">
            <div className="leave-meeting-options__inner">
              <Button
                className="leave-meeting-options__btn leave-meeting-red-button"
                text="End Call for Everyone"
                onClick={minimizeLeaveCall}
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

export default VideoCallMinimizeHeader
