import React, { useState, useEffect } from 'react'
import styles from './ModalOrganizor.module.css'
import {
  Modal,
  Table,
  TextField,
  Button,
  Loader,
  Notification,
} from '../../../../../../components/elements'
import {
  showAddUserModal,
  showNotifyOrganizors,
} from '../../../../../../store/actions/NewMeetingActions'
import BlackCrossIcon from '../../../../../../assets/images/BlackCrossIconModals.svg'
import committeeicon from '../../../../../../assets/images/committeedropdown.svg'
import committeicon from '../../../../../../assets/images/Group 2584.png'
import CrossIcon from '../../../../../../assets/images/CrossIcon.svg'
import {
  GetAllCommitteesUsersandGroups,
  meetingOrganizers,
  selectedMeetingOrganizers,
} from '../../../../../../store/actions/MeetingOrganizers_action'
import { useDispatch, useSelector } from 'react-redux'
import GroupIcon from '../../../../../../assets/images/groupdropdown.svg'
import profile from '../../../../../../assets/images/newprofile.png'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Col, Row } from 'react-bootstrap'

const ModalOrganizor = () => {
  const animatedComponents = makeAnimated()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let currentMeetingID = Number(localStorage.getItem('meetingID'))

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state,
  )

  const [membersOrganizers, setMembersOrganizers] = useState([])

  const [organizersSave, setOrganizersSave] = useState([])

  const [addOrganizerSearch, setAddOrganizerSearch] = useState({
    AddOrganizerSearch: '',
  })

  const handleCrossIcon = () => {
    dispatch(showAddUserModal(false))
  }

  useEffect(() => {
    let Data = {
      MeetingID: currentMeetingID,
    }
    dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t))
  }, [])

  const [selectedsearch, setSelectedsearch] = useState([])

  const [dropdowndata, setDropdowndata] = useState([])

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value)
  }

  const handleAddUsers = () => {
    let newOrganizersData = MeetingOrganizersReducer.AllUserCommitteesGroupsData
    let tem = [...membersOrganizers]
    let tem2 = [...organizersSave]
    if (Object.keys(selectedsearch).length > 0) {
      try {
        selectedsearch.map((seledtedData, index) => {
          console.log(
            seledtedData,
            'seledtedDataseledtedDataseledtedDataseledtedData',
          )
          if (seledtedData.type === 1) {
            let check1 = newOrganizersData.groups.find(
              (data, index) => data.groupID === seledtedData.value,
            )
            if (check1 !== undefined) {
              let groupUsers = check1.groupUsers
              if (Object.keys(groupUsers).length > 0) {
                groupUsers.map((gUser, index) => {
                  let check2 = membersOrganizers.find(
                    (data, index) => data.UserID === gUser.userID,
                  )
                  let check2Save = organizersSave.find(
                    (data, index) => data.UserID === gUser.userID,
                  )
                  if (check2 !== undefined && check2Save !== undefined) {
                  } else {
                    let newUser = {
                      userName: gUser.userName,
                      userID: gUser.userID,
                      displayPicture:
                        gUser.profilePicture.displayProfilePictureName,
                      email: gUser.emailAddress,
                      isPrimaryOrganizer: false,
                      isOrganizerNotified: false,
                      organizerTitle: '',
                      rsvp: false,
                      isDeletable: true,
                      disabledTitle: false,
                      disabledRSVP: true,
                      disabledNotification: true,
                      disabledSwitch: true,
                      NotificationMessage: '',
                    }
                    let newUserSave = {
                      isPrimaryOrganizer: false,
                      isOrganizerNotified: false,
                      organizerTitle: '',
                      UserID: gUser.userID,
                    }
                    tem.push(newUser)
                    tem2.push(newUserSave)
                  }
                })
              }
            }
          } else if (seledtedData.type === 2) {
            console.log('membersOrganizers check')
            let check1 = newOrganizersData.committees.find(
              (data, index) => data.committeeID === seledtedData.value,
            )
            if (check1 != undefined) {
              let committeesUsers = check1.committeeUsers
              if (Object.keys(committeesUsers).length > 0) {
                committeesUsers.map((cUser, index) => {
                  let check2 = membersOrganizers.find(
                    (data, index) => data.UserID === cUser.userID,
                  )
                  let check2Save = organizersSave.find(
                    (data, index) => data.UserID === cUser.userID,
                  )
                  if (check2 !== undefined && check2Save !== undefined) {
                  } else {
                    let newUser = {
                      userName: cUser.userName,
                      userID: cUser.userID,
                      displayPicture:
                        cUser.profilePicture.displayProfilePictureName,
                      email: cUser.emailAddress,
                      isPrimaryOrganizer: false,
                      isOrganizerNotified: false,
                      organizerTitle: '',
                      rsvp: false,
                      isDeletable: true,
                      disabledTitle: false,
                      disabledRSVP: true,
                      disabledNotification: true,
                      disabledSwitch: true,
                      NotificationMessage: '',
                    }
                    let newUserSave = {
                      isPrimaryOrganizer: false,
                      isOrganizerNotified: false,
                      organizerTitle: '',
                      UserID: cUser.userID,
                    }
                    tem.push(newUser)
                    tem2.push(newUserSave)
                  }
                })
              }
            }
          } else if (seledtedData.type === 3) {
            let check1 = membersOrganizers.find(
              (data, index) => data.UserID === seledtedData.value,
            )
            if (check1 != undefined) {
            } else {
              let check2 = newOrganizersData.organizationUsers.find(
                (data, index) => data.userID === seledtedData.value,
              )
              if (check2 !== undefined) {
                let newUser = {
                  userName: check2.userName,
                  userID: check2.userID,
                  displayPicture:
                    check2.profilePicture.displayProfilePictureName,
                  email: check2.emailAddress,
                  isPrimaryOrganizer: false,
                  isOrganizerNotified: false,
                  organizerTitle: '',
                  rsvp: false,
                  isDeletable: true,
                  disabledTitle: false,
                  disabledRSVP: true,
                  disabledNotification: true,
                  disabledSwitch: true,
                  NotificationMessage: '',
                }
                let newUserSave = {
                  isPrimaryOrganizer: false,
                  isOrganizerNotified: false,
                  organizerTitle: '',
                  UserID: check2.userID,
                }
                tem.push(newUser)
                tem2.push(newUserSave)
              }
            }
          } else {
          }
        })
      } catch {
        console.log('error in add')
      }
      console.log('membersOrganizers check', tem)
      const uniqueData = new Set(tem.map(JSON.stringify))

      const uniqueDataSave = new Set(tem2.map(JSON.stringify))

      // Convert the Set back to an array of objects
      const result = Array.from(uniqueData).map(JSON.parse)
      const resultSave = Array.from(uniqueDataSave).map(JSON.parse)
      setMembersOrganizers(result)
      setOrganizersSave(resultSave)
      setSelectedsearch([])
      console.log('Add Button output', membersOrganizers)
    } else {
      // setopen notionation work here
    }
  }

  const cancellAnyUser = (index) => {
    let removeData = [...membersOrganizers]
    let removeDataSave = [...organizersSave]
    removeData.splice(index, 1)
    removeDataSave.splice(index, 1)
    setMembersOrganizers(removeData)
    setOrganizersSave(removeDataSave)
  }

  useEffect(() => {
    dispatch(meetingOrganizers([]))
  }, [])

  useEffect(() => {
    let newOrganizersData = MeetingOrganizersReducer.AllUserCommitteesGroupsData
    if (newOrganizersData !== null && newOrganizersData !== undefined) {
      let temp = []
      if (Object.keys(newOrganizersData).length > 0) {
        if (Object.keys(newOrganizersData.groups).length > 0) {
          newOrganizersData.groups.map((a, index) => {
            let newData = {
              value: a.groupID,
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={GroupIcon}
                        height="16.45px"
                        width="18.32px"
                        draggable="false"
                      />
                      <span className={styles['NameDropDown']}>
                        {a.groupName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 1,
            }
            temp.push(newData)
          })
        }
        if (Object.keys(newOrganizersData.committees).length > 0) {
          newOrganizersData.committees.map((a, index) => {
            let newData = {
              value: a.committeeID,
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={committeeicon}
                        width="21.71px"
                        height="18.61px"
                        draggable="false"
                      />
                      <span className={styles['NameDropDown']}>
                        {a.committeeName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 2,
            }
            temp.push(newData)
          })
        }
        if (Object.keys(newOrganizersData.organizationUsers).length > 0) {
          console.log(
            newOrganizersData.organizationUsers,
            'organizationUsersorganizationUsersorganizationUsers',
          )
          newOrganizersData.organizationUsers.map((a, index) => {
            let newData = {
              value: a.userID,
              label: (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <img
                        src={`data:image/jpeg;base64,${a?.profilePicture?.displayProfilePictureName}`}
                        // src={}
                        alt=""
                        className={styles['UserProfilepic']}
                        width="18px"
                        height="18px"
                        draggable="false"
                      />
                      <span className={styles['NameDropDown']}>
                        {a.userName}
                      </span>
                    </Col>
                  </Row>
                </>
              ),
              type: 3,
            }
            temp.push(newData)
          })
        }
        setDropdowndata(temp)
      } else {
        setDropdowndata([])
      }
    }
  }, [MeetingOrganizersReducer.AllUserCommitteesGroupsData])

  const saveOrganizers = () => {
    console.log('Totally Saved Members', membersOrganizers)
    console.log('Totally SAVED API DATA', organizersSave)
    dispatch(showAddUserModal(false))
    dispatch(showNotifyOrganizors(true))
    dispatch(meetingOrganizers(membersOrganizers))
    dispatch(selectedMeetingOrganizers(organizersSave))
  }

  console.log('MeetingOrganizersReducer', MeetingOrganizersReducer)

  return (
    <section>
      <Modal
        show={NewMeetingreducer.adduserModal}
        setShow={dispatch(showAddUserModal)}
        modalFooterClassName={'d-block'}
        onHide={() => {
          dispatch(showAddUserModal(false))
        }}
        size={'md'}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles['OverAll_styling']}
              >
                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <span className={styles['Add_organization']}>
                      {t('Add-organizers')}
                    </span>
                  </Col>
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={'cursor-pointer'}
                      width="16px"
                      height="16px"
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="group-fields d-flex align-items-center gap-2"
                  >
                    <Select
                      onChange={handleSelectValue}
                      isDisabled={
                        MeetingOrganizersReducer.AllUserCommitteesGroupsData
                          .length === 0
                          ? true
                          : false
                      }
                      value={selectedsearch}
                      classNamePrefix={'selectMember'}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={dropdowndata}
                    />
                    <Button
                      text={t('ADD')}
                      className={styles['ADD_Btn_CreatePool_Modal']}
                      onClick={handleAddUsers}
                    />
                  </Col>
                </Row>
                <Row className={styles['Scroller_For_CreatePollModal2']}>
                  {membersOrganizers.length > 0
                    ? membersOrganizers.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={12} className="mt-2">
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles['Padding_Class']}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles['Card_border2']}>
                                        <Col sm={12} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data.displayPicture}`}
                                            width="33px"
                                            height="33px"
                                          />
                                          <span
                                            className={styles['Name_cards']}
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col sm={12} md={2} lg={2}>
                                          <img
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            onClick={cancellAnyUser}
                                            draggable="false"
                                            style={{ cursor: 'pointer' }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )
                      })
                    : null}
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles['OverAll_styling']}
              >
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t('Done')}
                      className={styles['Done_btn_organizor_modal']}
                      onClick={saveOrganizers}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  )
}

export default ModalOrganizor
