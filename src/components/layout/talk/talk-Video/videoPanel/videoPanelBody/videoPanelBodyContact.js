import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { TextField, Loader } from '../../../../../elements'
import './videoPanelBody.css'
import VideoCallIcon from '../../../../../../assets/images/VideoCall-Icon.png'
import { Spin } from 'antd'
import { LoaderPanel } from '../../../../../elements'
import { Checkbox } from 'antd'
import {
  GetAllVideoCallUsers,
  InitiateVideoCall,
  getVideoRecipentData,
  groupCallRecipients,
  callRequestReceivedMQTT,
} from '../../../../../../store/actions/VideoMain_actions'
import {
  videoOutgoingCallFlag,
  normalizeVideoPanelFlag,
  videoChatPanel,
} from '../../../../../../store/actions/VideoFeature_actions'
import VideoPanelFooter from '../videoPanelFooter/videoPanelFooter'

const VideoPanelBodyContact = () => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  let currentOrganization = Number(localStorage.getItem('organizationID'))

  let currentUserID = Number(localStorage.getItem('userID'))

  const [searchChatValue, setSearchChatValue] = useState('')

  const [allUsers, setAllUsers] = useState([])

  const [groupCallUsers, setGroupCallUsers] = useState([])

  const [groupCallActiveUsers, setGroupCallActiveUsers] = useState([])

  const groupCallUsersHandler = (data) => {
    if (groupCallUsers.includes(data.userID)) {
      let groupUsersIndex = groupCallUsers.findIndex(
        (userID) => userID === data.userID,
      )
      if (groupUsersIndex !== -1) {
        groupCallUsers.splice(groupUsersIndex, 1)
        setGroupCallUsers([...groupCallUsers])
      }
    } else {
      groupCallUsers.push(data.userID)
      setGroupCallUsers([...groupCallUsers])
    }
    if (groupCallActiveUsers.includes(data)) {
      let activeGroupCallUsersIndex = groupCallActiveUsers.findIndex(
        (data2, index) => data === data2,
      )
      if (activeGroupCallUsersIndex !== -1) {
        groupCallActiveUsers.splice(activeGroupCallUsersIndex, 1)
        setGroupCallActiveUsers([...groupCallActiveUsers])
      }
    } else {
      groupCallActiveUsers.push(data)
      setGroupCallActiveUsers([...groupCallActiveUsers])
    }
  }

  console.log('groupCallActiveUsers', groupCallActiveUsers)

  const searchChat = (e) => {
    setSearchChatValue(e)
    try {
      if (
        VideoMainReducer.VideoCallUsersData !== undefined &&
        VideoMainReducer.VideoCallUsersData !== null &&
        VideoMainReducer.VideoCallUsersData.length !== 0
      ) {
        if (e !== '') {
          let filteredData = VideoMainReducer.VideoCallUsersData.users.filter(
            (value) => {
              return value.userName.toLowerCase().includes(e.toLowerCase())
            },
          )
          if (filteredData.length === 0) {
            setAllUsers(VideoMainReducer.VideoCallUsersData.users)
          } else {
            setAllUsers(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = VideoMainReducer.VideoCallUsersData.users
          setSearchChatValue('')
          setAllUsers(data)
        }
      }
    } catch {}
  }

  useEffect(() => {
    let Data = { OrganizationID: currentOrganization }
    dispatch(GetAllVideoCallUsers(Data, navigate, t))
  }, [])

  console.log('VideoMainReducer', VideoMainReducer)

  //Setting state data of all users
  useEffect(() => {
    if (
      VideoMainReducer.VideoCallUsersData !== undefined &&
      VideoMainReducer.VideoCallUsersData !== null &&
      VideoMainReducer.VideoCallUsersData.length !== 0
    ) {
      setAllUsers(VideoMainReducer?.VideoCallUsersData?.users)
    } else {
      setAllUsers([])
    }
  }, [VideoMainReducer?.VideoCallUsersData])

  const otoVideoCall = (userData) => {
    // dispatch(videoOutgoingCallFlag(true))
    console.log('Video Called User Data', userData)
    let Data = {
      RecipentIDs: [userData.userID],
      CallTypeID: 1,
      OrganizationID: currentOrganization,
    }
    localStorage.setItem('CallType', Data.CallTypeID)
    dispatch(InitiateVideoCall(Data, navigate, t))
    localStorage.setItem('activeCall', true)
    localStorage.setItem('callerID', currentUserID)
    dispatch(callRequestReceivedMQTT({}, ''))
    dispatch(getVideoRecipentData(userData))
    dispatch(normalizeVideoPanelFlag(true))
    dispatch(videoChatPanel(false))
    console.log('Video Called User Data', Data)
  }

  const initiateGroupCall = () => {
    if (groupCallUsers.length <= 1) {
      console.log('Initiate Group Call Boys Less', groupCallUsers)
    } else {
      let Data = {
        RecipentIDs: groupCallUsers,
        CallTypeID: 2,
        OrganizationID: currentOrganization,
      }
      localStorage.setItem('CallType', Data.CallTypeID)
      dispatch(InitiateVideoCall(Data, navigate, t))
      localStorage.setItem('activeCall', true)
      localStorage.setItem('callerID', currentUserID)
      dispatch(callRequestReceivedMQTT({}, ''))
      dispatch(groupCallRecipients(groupCallActiveUsers))
      // dispatch(getVideoRecipentData(userData))
      dispatch(normalizeVideoPanelFlag(true))
      dispatch(videoChatPanel(false))
      console.log('Initiate Group Call Boys More', groupCallUsers)
    }
  }

  let buttonText = 'Group Call'

  if (groupCallUsers.length > 0) {
    const formattedLength = String(groupCallUsers.length).padStart(2, '0')
    buttonText += ' (' + formattedLength + ')'
  }

  return (
    <>
      <Container>
        {videoFeatureReducer.VideoChatSearchFlag === true ? (
          <Row>
            <Col lg={12} md={12} sm={12} className="mt-2">
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
        {allUsers !== undefined &&
        allUsers !== null &&
        allUsers.length > 0 &&
        VideoMainReducer.Loading === false ? (
          allUsers.map((userData, index) => {
            console.log('userData', userData)
            return (
              <Row className="single-chat" key={index}>
                <Col lg={1} md={1} sm={1} className="mt-4">
                  <Checkbox onChange={() => groupCallUsersHandler(userData)} />
                </Col>
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div
                    className="video-profile-icon"
                    style={{
                      backgroundImage: `url('data:image/jpeg;base64,${userData.profilePicture.displayProfilePictureName}')`,
                    }}
                  ></div>
                </Col>
                <Col lg={7} md={7} sm={7} className="bottom-border">
                  <div className={'video-block'}>
                    <p className="Video-chat-username m-0">
                      {userData.userName}
                    </p>

                    <p className="video-chat-date m-0">
                      {userData.organizationName}
                    </p>
                  </div>
                </Col>
                <Col lg={2} md={2} sm={2} className="mt-4">
                  <img
                    src={VideoCallIcon}
                    onClick={() => otoVideoCall(userData)}
                  />
                </Col>
              </Row>
            )
          })
        ) : VideoMainReducer.Loading === true ? (
          <>
            <LoaderPanel
              message={'Safeguarding your data to enhance the experience'}
            />
          </>
        ) : (
          <p>No Users Available</p>
        )}
      </Container>
      <VideoPanelFooter
        groupCallClick={initiateGroupCall}
        groupbtnClassName={
          groupCallUsers.length <= 1 ? 'group-btn-gray' : 'group-btn'
        }
        buttonText={buttonText}
      />
    </>
  )
}

export default VideoPanelBodyContact
