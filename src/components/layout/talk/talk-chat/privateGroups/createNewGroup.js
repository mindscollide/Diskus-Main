import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Row, Col, Container, Form } from 'react-bootstrap'
import { TextField, Button } from '../../../../elements'
import { Checkbox } from 'antd'
import {
  GetAllUsers,
  CreatePrivateGroup,
} from '../../../../../store/actions/Talk_action'
import {
  headerShowHideStatus,
  footerActionStatus,
  footerShowHideStatus,
  privateGroupChatFlag,
  createGroupScreen,
} from '../../../../../store/actions/Talk_Feature_actions'
import CloseChatIcon from '../../../../../assets/images/Cross-Chat-Icon.png'

const CreateNewGroup = () => {
  const { talkStateData } = useSelector((state) => state)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  //Current User ID
  let currentUserId = localStorage.getItem('userID')

  //Current Organization
  let currentOrganizationId = localStorage.getItem('organizationID')

  //Create Group Participant Check
  const [noParticipant, setNoParticipant] = useState(false)

  //all users states
  const [allUsers, setAllUsers] = useState([])

  //Group Name State for Creation/Modification
  const [groupNameValue, setGroupNameValue] = useState('')

  //search group user states
  const [searchGroupUserValue, setSearchGroupUserValue] = useState('')

  //group users checked
  const [groupUsersChecked, setGroupUsersChecked] = useState([])

  //Search Group Chat
  const searchGroupUser = (e) => {
    if (e !== '') {
      setSearchGroupUserValue(e)
      let filteredData = talkStateData.AllUsers.AllUsersData.allUsers.filter(
        (value) => {
          return value.fullName
            .toLowerCase()
            .includes(searchGroupUserValue.toLowerCase())
        },
      )
      if (filteredData.length === 0) {
        setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers)
      } else {
        setAllUsers(filteredData)
      }
    } else if (e === '' || e === null) {
      let data = talkStateData.AllUsers.AllUsersData.allUsers
      setSearchGroupUserValue('')
      setAllUsers(data)
    }
  }

  //on change groups users
  const groupUsersCheckedHandler = (data, id, index) => {
    if (groupUsersChecked.includes(id)) {
      let groupUserIndex = groupUsersChecked.findIndex(
        (data2, index) => data2 === id,
      )
      if (groupUserIndex !== -1) {
        groupUsersChecked.splice(groupUserIndex, 1)
        setGroupUsersChecked([...groupUsersChecked])
      }
    } else {
      groupUsersChecked.push(id)
      setGroupUsersChecked([...groupUsersChecked])
    }
  }

  useEffect(() => {
    dispatch(
      GetAllUsers(
        navigate,
        parseInt(currentUserId),
        parseInt(currentOrganizationId),
        t,
      ),
    )
  }, [])

  //Setting state data of all users
  useEffect(() => {
    if (
      talkStateData.AllUsers.AllUsersData !== undefined &&
      talkStateData.AllUsers.AllUsersData !== null &&
      talkStateData.AllUsers.AllUsersData !== []
    ) {
      setAllUsers(talkStateData.AllUsers.AllUsersData.allUsers)
    }
  }, [talkStateData?.AllUsers?.AllUsersData?.allUsers])

  const createPrivateGroup = () => {
    if (groupUsersChecked.length === 0) {
      setNoParticipant(true)
    } else {
      setNoParticipant(false)
      let Data = {
        TalkRequest: {
          UserID: parseInt(currentUserId),
          ChannelID: parseInt(currentOrganizationId),
          Group: {
            GroupName: groupNameValue,
            Users: groupUsersChecked.toString(),
            IsPublic: false,
          },
        },
      }
      dispatch(CreatePrivateGroup(navigate, Data, t))
      dispatch(createGroupScreen(false))
      dispatch(footerActionStatus(false))
      dispatch(headerShowHideStatus(true))
      dispatch(footerShowHideStatus(true))
      dispatch(privateGroupChatFlag(true))
    }
  }

  const closeAddGroupScreen = async () => {
    await dispatch(createGroupScreen(false))
    await dispatch(footerActionStatus(false))
    await dispatch(headerShowHideStatus(true))
    await dispatch(footerShowHideStatus(true))
    await dispatch(privateGroupChatFlag(true))
  }

  return (
    <>
      <Container>
        <Row className="margin-top-10">
          <Col lg={6} md={6} sm={12}>
            <div className="new-chat">
              <p className="fw-bold m-0">{t('Create-A-Group')}</p>
            </div>
          </Col>
          <Col lg={5} md={5} sm={12}></Col>

          <Col lg={1} md={1} sm={12} className="p-0">
            <div className="close-addChat-filter" onClick={closeAddGroupScreen}>
              <img src={CloseChatIcon} />
            </div>
          </Col>
        </Row>
        <Row className="margin-top-10">
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass="form-control2"
              name="Name"
              placeholder={t('Group-Name')}
              change={(e) => {
                setGroupNameValue(e.target.value)
              }}
              value={groupNameValue}
              labelClass={'d-none'}
            />
          </Col>
        </Row>
        <Row className="margin-top-5">
          <Col lg={12} md={12} sm={12}>
            <TextField
              maxLength={200}
              applyClass="form-control2"
              name="Name"
              placeholder={t('Search-User')}
              change={(e) => {
                searchGroupUser(e.target.value)
              }}
              value={searchGroupUserValue}
              labelClass={'d-none'}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="add-group-members-list">
          {allUsers !== undefined && allUsers !== null && allUsers.length > 0
            ? allUsers.map((dataItem, index) => {
                return (
                  <Row className="single-user">
                    <Col lg={2} md={2} sm={2}>
                      <div className="user-profile-icon">
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
                        {/* <span className="user-active-status-group"></span> */}
                      </div>
                    </Col>
                    <Col lg={8} md={8} sm={8}>
                      <div className={'group-add-user'}>
                        <p className="chat-username-group m-0">
                          {dataItem.fullName}
                        </p>
                        <span>{dataItem.companyName}</span>
                      </div>
                    </Col>
                    <Col lg={2} md={2} sm={2}>
                      <Checkbox
                        checked={
                          groupUsersChecked.includes(dataItem.id) ? true : false
                        }
                        onChange={() =>
                          groupUsersCheckedHandler(dataItem, dataItem.id, index)
                        }
                        className="chat-message-checkbox-group"
                      />
                    </Col>
                  </Row>
                )
              })
            : null}
        </div>
      </Container>
      <Container>
        <Row>
          <Col className="text-center">
            {noParticipant === true ? (
              <p className="participant-warning m-0">
                {t('At-least-add-one-participant')}
              </p>
            ) : null}
            <Button
              className="MontserratSemiBold Ok-btn forward-user"
              text={t('Create-Group')}
              onClick={createPrivateGroup}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CreateNewGroup
