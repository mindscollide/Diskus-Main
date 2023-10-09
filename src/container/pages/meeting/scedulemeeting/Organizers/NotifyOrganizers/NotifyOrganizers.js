import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  TextField,
  Checkbox,
} from '../../../../../../components/elements'
import { useTranslation } from 'react-i18next'
import styles from './NotifyOrganizors.module.css'
import { useDispatch, useSelector } from 'react-redux'
import BlackCrossIcon from '../../../../../../assets/images/BlackCrossIconModals.svg'
import { selectedMeetingOrganizers } from '../../../../../../store/actions/MeetingOrganizers_action'
import { useNavigate } from 'react-router-dom'
import profile from '../../../../../../assets/images/newprofile.png'
import { showNotifyOrganizors } from '../../../../../../store/actions/NewMeetingActions'
import UpperArrow from '../../../../../../assets/images/UpperArrow.svg'
import { Col, Row } from 'react-bootstrap'
import { style } from '@mui/system'
import { validateInput } from '../../../../../../commen/functions/regex'
import downdirect from '../../../../../../assets/images/downDirect.png'

const NotifyOrganizers = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state,
  )
  const [notifyOrganizerData, setNotifyOrganizerData] = useState({
    Messege: '',
    allOrganizersAccept: false,
  })

  const [membersHide, setMembersHide] = useState(false)
  const [allOrganizersAccept, setAllOrganizersAccept] = useState(false)
  // const [members, setMembers] = useState([
  //   {
  //     name: 'saif',
  //   },
  //   {
  //     name: 'owais wAJID',
  //   },
  //   {
  //     name: 'ALI RAZA',
  //   },
  //   {
  //     name: 'huzeifa',
  //   },
  //   {
  //     name: 'mamdani',
  //   },
  //   {
  //     name: 'aun',
  //   },
  //   {
  //     name: 'saroush',
  //   },
  // ])

  const [membersOrganizers, setMembersOrganizers] = useState([])

  const [memberCheckboxes, setMemberCheckboxes] = useState(
    membersOrganizers.map(() => false),
  )

  const handleCrossIcon = () => {
    dispatch(showNotifyOrganizors(false))
  }

  const HandleChange = (e, index) => {
    let name = e.target.name
    let value = e.target.value
    if (name === 'Message') {
      let valueCheck = validateInput(value)
      if (valueCheck !== '') {
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: valueCheck,
        })
      } else {
        setNotifyOrganizerData({
          ...notifyOrganizerData,
          Messege: '',
        })
      }
    }
  }

  const handleAllowOrganizerCheck = () => {
    const updatedCheckboxes = membersOrganizers.map(() => !allOrganizersAccept)
    const updatedMembers = membersOrganizers.map((member) => ({
      ...member,
      IsOrganizerNotified: !allOrganizersAccept,
    }))

    setAllOrganizersAccept(!allOrganizersAccept)
    setMemberCheckboxes(updatedCheckboxes)
    setMembersOrganizers(updatedMembers)
  }

  const handleHideItems = () => {
    setMembersHide(!membersHide)
  }

  const handleCheckboxChange = (index, isChecked, data) => {
    const updatedCheckboxes = [...memberCheckboxes]
    updatedCheckboxes[index] = isChecked

    const updatedMembers = [...membersOrganizers]
    updatedMembers[index].IsOrganizerNotified = isChecked

    setMemberCheckboxes(updatedCheckboxes)
    setMembersOrganizers(updatedMembers)
  }

  const sendNotification = () => {
    dispatch(showNotifyOrganizors(false))
    dispatch(selectedMeetingOrganizers(membersOrganizers))
  }

  const handleCancelButton = () => {
    dispatch(showNotifyOrganizors(false))
    dispatch(selectedMeetingOrganizers([]))
  }

  console.log('MeetingOrganizersReducer', MeetingOrganizersReducer)

  useEffect(() => {
    if (
      MeetingOrganizersReducer.MeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.MeetingOrganizersData !== null &&
      MeetingOrganizersReducer.MeetingOrganizersData.length !== 0
    ) {
      setMembersOrganizers(MeetingOrganizersReducer.MeetingOrganizersData)
    }
  }, [MeetingOrganizersReducer.MeetingOrganizersData])

  console.log('Checkboxes state check', memberCheckboxes, membersOrganizers)

  return (
    <section>
      <Modal
        show={NewMeetingreducer.notifyOrganizors}
        setShow={dispatch(showNotifyOrganizors)}
        modalFooterClassName={'d-block'}
        onHide={() => {
          dispatch(showNotifyOrganizors(false))
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={5} md={5} sm={12}>
                <span className={styles['Notify_organisors']}>
                  {t('Notify-organizers')}
                </span>
              </Col>
              <Col lg={7} md={7} sm={12} className="d-flex justify-content-end">
                <img
                  draggable={false}
                  src={BlackCrossIcon}
                  className="cursor-pointer"
                  width="16px"
                  height="16px"
                  onClick={handleCrossIcon}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  applyClass="text-area-create-Notify-organizors"
                  type="text"
                  as={'textarea'}
                  rows="4"
                  placeholder={t('Message')}
                  change={HandleChange}
                  value={notifyOrganizerData.Messege}
                  required={true}
                  name="Message"
                  maxLength={500}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex align-items-center gap-2"
              >
                <Checkbox
                  checked={allOrganizersAccept}
                  onChange={handleAllowOrganizerCheck}
                />
                <p className={styles['Check_box_title']}>
                  {t('All-organizer-except-me')}
                </p>
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex justify-content-end align-items-center cursor-pointer"
              >
                <img
                  draggable={false}
                  src={membersHide ? downdirect : UpperArrow}
                  width="18.4px"
                  height="9.2px"
                  className={styles['UparrowClasss']}
                  onClick={handleHideItems}
                />
              </Col>
            </Row>
            {membersHide ? null : (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles['Scroller_notify']}
                  >
                    <Row>
                      {membersOrganizers.map((data, index) => (
                        <Col lg={6} md={6} sm={12} className="mt-2" key={index}>
                          <Row className="m-0 p-0">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles['Box_for_Assignee']}
                            >
                              <Row>
                                <Col
                                  lg={10}
                                  md={10}
                                  sm={12}
                                  className="d-flex gap-2 align-items-center"
                                >
                                  <img
                                    draggable={false}
                                    src={`data:image/jpeg;base64,${data.displayPicture}`}
                                    width="33px"
                                    height="33px"
                                    className={styles['ProfilePic']}
                                  />
                                  <span>{data.userName}</span>
                                </Col>
                                <Col lg={2} md={2} sm={12}>
                                  <Checkbox
                                    checked={memberCheckboxes[index]}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        index,
                                        e.target.checked,
                                        data,
                                      )
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t('Cancel')}
                  className={styles['Cancel_button_Notify']}
                  onClick={handleCancelButton}
                />
                <Button
                  text={t('Send')}
                  onClick={sendNotification}
                  className={styles['Send_Notify']}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  )
}

export default NotifyOrganizers
