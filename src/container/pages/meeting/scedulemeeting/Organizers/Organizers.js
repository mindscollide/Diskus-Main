import React, { useState, useEffect } from 'react'
import styles from './Organizers.module.css'
import {
  Button,
  Table,
  TextField,
  Switch,
  Loader,
  Notification,
} from '../../../../../components/elements'
import EditIcon from '../../../../../assets/images/Edit-Icon.png'
import addmore from '../../../../../assets/images/addmore.png'
import redcrossIcon from '../../../../../assets/images/Artboard 9.png'
import greenMailIcon from '../../../../../assets/images/greenmail.svg'
import redMailIcon from '../../../../../assets/images/redmail.svg'
import rspvGreenIcon from '../../../../../assets/images/rspvGreen.svg'
import rspvAbstainIcon from '../../../../../assets/images/rspvAbstain.svg'
import NORSVP from '../../../../../assets/images/No-RSVP.png'
import mail from '../../../../../assets/images/mail.svg'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import { Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  showAddUserModal,
  showCrossConfirmationModal,
  showNotifyOrganizors,
} from '../../../../../store/actions/NewMeetingActions'
import ModalOrganizor from './ModalAddUserOrganizer/ModalOrganizor'
import ModalCrossIcon from './ModalCrossIconClick/ModalCrossIcon'
import NotifyOrganizers from './NotifyOrganizers/NotifyOrganizers'
import OrganizersViewPage from './OrganizerViewPage/OrganizersViewPage'
import {
  SaveMeetingOrganizers,
  clearResponseMessage,
} from '../../../../../store/actions/MeetingOrganizers_action'

const Organizers = ({ setAgendaContributors, setorganizers }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const navigate = useNavigate()

  let currentLanguage = localStorage.getItem('i18nextLng')

  const [viewOrganizers, setviewOrganizers] = useState(false)

  const [editState, setEditState] = useState(false)

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state,
  )

  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true))
  }

  const openNotifyOrganizorModal = () => {
    dispatch(showNotifyOrganizors(true))
  }

  // const data = [
  //   {
  //     key: '1',
  //     Name: <label className={styles['Title_desc']}>Muahmmad Saif</label>,
  //     Email: (
  //       <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
  //     ),
  //     OrganizerTitle: <label className="column-boldness">Organizer</label>,
  //     rsvp: (
  //       <>
  //         <img
  //           draggable={false}
  //           src={rspvGreenIcon}
  //           height="30px"
  //           width="30px"
  //         />
  //         {/* <img draggable = {false} src={rspvAbstainIcon} height="30px" width="30px" /> */}
  //       </>
  //     ),
  //     Notification: (
  //       <>
  //         <Row>
  //           <Col lg={7} md={7} sm={7} className="d-flex justify-content-center">
  //             <img
  //               draggable={false}
  //               src={greenMailIcon}
  //               height="17.64px"
  //               width="12.4px"
  //             />
  //             {/* <img draggable = {false} src={redMailIcon} height="17.64px" width="12.4px" /> */}
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //     Primary: <label className="column-boldness">Primary</label>,
  //   },
  //   {
  //     key: '1',
  //     Name: <label className={styles['Title_desc']}>Muahmmad Saif</label>,
  //     Email: (
  //       <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
  //     ),
  //     OrganizerTitle: (
  //       <>
  //         <Row>
  //           <Col lg={12} md={12} sm={12}>
  //             <TextField
  //               disable={editState === true ? true : false}
  //               placeholder={t('Content-title')}
  //               labelClass={'d-none'}
  //               applyClass={'Organizer_table'}
  //             />
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //     Primary: (
  //       <>
  //         <Row>
  //           <Col
  //             lg={12}
  //             md={12}
  //             sm={12}
  //             className="d-flex gap-3 align-items-center"
  //           >
  //             <Switch disabled={editState === true ? true : false} />
  //             <label className="column-boldness">Primary</label>
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //     Close: (
  //       <>
  //         <Row>
  //           <Col lg={12} md={12} sm={12}>
  //             {editState === true ? (
  //               <>
  //                 <img
  //                   draggable={false}
  //                   src={redcrossIcon}
  //                   width="21.79px"
  //                   height="21.79px"
  //                   onClick={openCrossIconModal}
  //                 />
  //               </>
  //             ) : null}
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //   },
  // ]

  let currentUserEmail = localStorage.getItem('userEmail')
  let currentUserID = Number(localStorage.getItem('userID'))
  let currentUserName = localStorage.getItem('name')

  const [inputValues, setInputValues] = useState({})

  const currentOrganizerData = {
    displayPicture: '',
    email: currentUserEmail,
    isChecked: true,
    IsPrimaryOrganizer: true,
    IsOrganizerNotified: true,
    isRSVP: true,
    Title: 'Organizer',
    userID: currentUserID,
    userName: currentUserName,
  }

  const [rowsData, setRowsData] = useState([currentOrganizerData])

  const [transformedData, setTransformedData] = useState({
    MeetingOrganizers: [],
  })

  useEffect(() => {
    if (
      MeetingOrganizersReducer.SelectedMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.SelectedMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.SelectedMeetingOrganizersData.length !== 0
    ) {
      const uniqueMeetingOrganizers = MeetingOrganizersReducer.SelectedMeetingOrganizersData.filter(
        (organizer) => {
          return !inputValues.hasOwnProperty(organizer.userID)
        },
      )
      const initialValues = {}
      MeetingOrganizersReducer.SelectedMeetingOrganizersData.forEach(
        (organizer) => {
          initialValues[organizer.userID] = organizer.Title || ''
        },
      )
      initialValues[currentOrganizerData.userID] =
        currentOrganizerData.Title || ''

      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        ...initialValues,
      }))

      setRowsData([...rowsData, ...uniqueMeetingOrganizers])
    }
  }, [MeetingOrganizersReducer.SelectedMeetingOrganizersData])

  const handleInputChange = (userID, newValue) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [userID]: newValue,
    }))
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            Title: newValue,
          }
        }
        return row
      })
    })
  }

  const handleSwitchChange = (checked, rowIndex) => {
    const updatedRowsData = rowsData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          IsPrimaryOrganizer: checked,
        }
      }
      return {
        ...row,
        IsPrimaryOrganizer: false,
      }
    })
    setRowsData(updatedRowsData)
  }

  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t('Name')}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: 'userName',
      key: 'userName',
      width: '200px',
      render: (text) => <label className={styles['Title_desc']}>{text}</label>,
    },

    {
      title: t('Email'),
      dataIndex: 'email',
      key: 'email',
      width: '250px',
      render: (text) => <label className="column-boldness">{text}</label>,
    },
    {
      title: t('Organizer-title'),
      dataIndex: 'Title',
      key: 'Title',
      width: '250px',
      render: (text, record) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <TextField
              placeholder={t('Content-title')}
              labelClass={'d-none'}
              applyClass={'Organizer_table'}
              value={inputValues[record.userID] || ''} // Use the controlled value
              change={(e) => handleInputChange(record.userID, e.target.value)} // Update the inputValues when the user types
            />
          </Col>
        </Row>
      ),
    },

    {
      dataIndex: 'IsPrimaryOrganizer',
      key: 'IsPrimaryOrganizer',
      width: '200px',
      render: (text, record, rowIndex) => (
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 align-items-center"
          >
            <Switch
              checkedValue={text}
              onChange={(checked) => handleSwitchChange(checked, rowIndex)}
            />
            <label className="column-boldness">Primary</label>
          </Col>
        </Row>
      ),
    },
    {
      title: t('RSVP'),
      dataIndex: 'isRSVP',
      key: 'isRSVP',
      width: '120px',
      render: (text, record) => {
        console.log('RSVP', text, record)
        if (record.isRSVP === true) {
          return (
            <img
              draggable={false}
              src={rspvGreenIcon}
              height="30px"
              width="30px"
            />
          )
        } else {
          return (
            <img draggable={false} src={NORSVP} height="30px" width="30px" />
          )
        }
      },
    },

    {
      title: t('Notification'),
      dataIndex: 'IsOrganizerNotified',
      key: 'IsOrganizerNotified',
      width: '180px',
      render: (text, record) => {
        console.log('RSVP', text, record)
        if (record.IsOrganizerNotified === true) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={greenMailIcon}
                  height="30px"
                  width="30px"
                />
              </Col>
            </Row>
          )
        } else {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={redMailIcon}
                  height="30px"
                  width="30px"
                />
              </Col>
            </Row>
          )
        }
      },
    },
    // {
    //   dataIndex: 'Close',
    //   key: 'Close',
    //   width: '50px',
    // },
  ]

  const openAddUserModal = () => {
    dispatch(showAddUserModal(true))
  }

  useEffect(() => {
    // Perform the data transformation here
    const transformedMeetingOrganizers = rowsData.map((item) => ({
      MeetingID: 1424, // You can set the MeetingID as needed
      IsPrimaryOrganizer: item.IsPrimaryOrganizer,
      IsOrganizerNotified: item.IsOrganizerNotified,
      Title: item.Title,
      UserID: item.userID,
    }))

    setTransformedData({ MeetingOrganizers: transformedMeetingOrganizers })
  }, [rowsData])

  const handleSaveButton = () => {
    console.log('For Save Data', transformedData)
    dispatch(SaveMeetingOrganizers(navigate, transformedData, t))
    // setorganizers(false)
    // setAgendaContributors(true)
  }

  const handleSaveNextButton = () => {
    console.log('For Save Data', transformedData)
    dispatch(SaveMeetingOrganizers(navigate, transformedData, t))
    setorganizers(false)
    setAgendaContributors(true)
  }

  const EnableOrganizersView = () => {
    setviewOrganizers(!viewOrganizers)
  }

  const enableEditButton = () => {
    setEditState(!editState)
  }

  const handleEditDone = () => {
    setEditState(false)
  }

  const handleCancelEdit = () => {
    setEditState(false)
  }

  console.log('MeetingOrganizersReducer', MeetingOrganizersReducer)

  console.log('Table Data', rowsData)

  const [open, setOpen] = useState({
    open: false,
    message: '',
  })

  useEffect(() => {
    if (
      MeetingOrganizersReducer.ResponseMessage ===
      'Organizers-saved-successfully'
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t('Organizers-saved-successfully'),
        }),
        3000,
      )
    }
    dispatch(clearResponseMessage(''))
  }, [MeetingOrganizersReducer.ResponseMessage])

  return (
    <>
      {viewOrganizers ? (
        <OrganizersViewPage />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-4 m-0 p-0">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-4"
              >
                {editState ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex align-items-center gap-2"
                      >
                        <img
                          src={redcrossIcon}
                          height="30px"
                          width="30px"
                          className="cursor-pointer"
                          onClick={handleCancelEdit}
                        />
                        <img
                          src={rspvGreenIcon}
                          height="30px"
                          width="30px"
                          className="cursor-pointer"
                          onClick={handleEditDone}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Button
                      text={t('Notification1')}
                      className={styles['Notification_button']}
                      icon={
                        <img
                          draggable={false}
                          src={mail}
                          width="17.18px"
                          height="12.08px"
                        />
                      }
                      onClick={openNotifyOrganizorModal}
                    />

                    <Button
                      text={t('Edit')}
                      className={styles['Edit_Button_Organizers']}
                      icon={
                        <img
                          draggable={false}
                          src={EditIcon}
                          width="11.75px"
                          height="11.75px"
                        />
                      }
                      onClick={enableEditButton}
                    />

                    <Button
                      text={t('Add-more')}
                      icon={<img draggable={false} src={addmore} />}
                      className={styles['AddMoreBtn']}
                      onClick={openAddUserModal}
                    />
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: '62vh' }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <section className={styles['Footer_button']}>
                <Button
                  text={t('Delete-meeting')}
                  className={styles['Cancel_Organization']}
                />
                <Button
                  text={t('Publish-the-meeting')}
                  className={styles['publish_button_Organization']}
                  onClick={EnableOrganizersView}
                />
                <Button
                  text={t('Cancel')}
                  className={styles['publish_button_Organization']}
                />
                <Button
                  text={t('Save')}
                  className={styles['Next_Organization']}
                  onClick={handleSaveButton}
                />
                <Button
                  text={t('Save-and-Next')}
                  className={styles['Next_Organization']}
                  onClick={handleSaveNextButton}
                />
              </section>
            </Col>
          </Row>
        </>
      )}

      {MeetingOrganizersReducer.LoadingMeetingOrganizer ? <Loader /> : null}

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {NewMeetingreducer.adduserModal && <ModalOrganizor />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyOrganizors && <NotifyOrganizers />}
    </>
  )
}

export default Organizers
