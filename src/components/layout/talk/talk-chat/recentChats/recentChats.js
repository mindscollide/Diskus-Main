import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from '../../../../../commen/functions/date_formater'
import { chatBoxActiveFlag } from '../../../../../store/actions/Talk_Feature_actions'
import {
  GetOTOUserMessages,
  GetGroupMessages,
  GetBroadcastMessages,
  activeChat,
  pushChatData,
  BlockUnblockUser,
  DeleteShout,
  LeaveGroup,
  GetAllUserChats,
  mqttGroupCreated,
} from '../../../../../store/actions/Talk_action'
import { Spin } from 'antd'
import { TextField, ResultMessage } from '../../../../elements'
import SingleIcon from '../../../../../assets/images/Single-Icon.png'
import GroupIcon from '../../../../../assets/images/Group-Icon.png'
import ShoutIcon from '../../../../../assets/images/Shout-Icon.png'
import DoubleTickIcon from '../../../../../assets/images/DoubleTick-Icon.png'
import DoubleTickDeliveredIcon from '../../../../../assets/images/DoubleTickDelivered-Icon.png'
import SingleTickIcon from '../../../../../assets/images/SingleTick-Icon.png'
import TimerIcon from '../../../../../assets/images/Timer-Icon.png'
import DropDownIcon from '../../../../../assets/images/dropdown-icon.png'
import ClipIcon from '../../../../../assets/images/ClipIcon.png'
import NoRecentChatsIcon from '../../../../../assets/images/No-Recent-Chats.png'
import { useTranslation } from 'react-i18next'

const RecentChats = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const { talkFeatureStates, talkStateData } = useSelector((state) => state)

  let currentUserId = localStorage.getItem('userID')
  let currentOrganizationId = localStorage.getItem('organizationID')

  const date = new Date()
  //CURRENT DATE TIME UTC
  let currentDateTime = new Date()
  let changeDateFormatCurrent = moment(currentDateTime).utc()
  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    'YYYYMMDDHHmmss',
  )
  let currentUtcDate = currentDateTimeUtc.slice(0, 8)

  console.log('Current UTC Data', currentDateTimeUtc)
  //YESTERDAY'S DATE
  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1) // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc()
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format('YYYYMMDD')

  const [allChatData, setAllChatData] = useState([])
  const [searchChatValue, setSearchChatValue] = useState('')

  //Dropdown state of chat head menu (Dropdown icon wali)
  const [chatHeadMenuActive, setChatHeadMenuActive] = useState(false)

  const [newGroupData, setNewGroupData] = useState([])

  useEffect(() => {
    dispatch(GetAllUserChats(navigate, currentUserId, currentOrganizationId, t))
  }, [])

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      setAllChatData(talkStateData.AllUserChats.AllUserChatsData.allMessages)
    }
  }, [talkStateData.AllUserChats.AllUserChatsData])

  //Search Chats
  const searchChat = (e) => {
    setSearchChatValue(e)
    try {
      if (
        talkStateData.AllUserChats.AllUserChatsData !== undefined &&
        talkStateData.AllUserChats.AllUserChatsData !== null &&
        talkStateData.AllUserChats.AllUserChatsData.length !== 0
      ) {
        if (e !== '') {
          let filteredData = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
            (value) => {
              return value.fullName.toLowerCase().includes(e.toLowerCase())
            },
          )

          if (filteredData.length === 0) {
            setAllChatData(
              talkStateData.AllUserChats.AllUserChatsData.allMessages,
            )
          } else {
            setAllChatData(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = talkStateData.AllUserChats.AllUserChatsData.allMessages
          setSearchChatValue('')
          setAllChatData(data)
        }
      }
    } catch {}
  }

  //Managing that state of chat head, if show or hide
  const activateChatHeadMenu = (id) => {
    if (chatHeadMenuActive === false) {
      setChatHeadMenuActive(id)
    } else {
      setChatHeadMenuActive(false)
    }
  }

  const chatClick = (record) => {
    localStorage.setItem('ActiveChatType', record.messageType)
    if (!talkFeatureStates.ChatBoxActiveFlag) {
      dispatch(chatBoxActiveFlag(true))
    }
    console.log('chatClick Record', record)
    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }

    let chatGroupData = {
      UserID: parseInt(currentUserId),
      ChannelID: currentOrganizationId,
      GroupID: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }

    let broadcastMessagesData = {
      UserID: currentUserId,
      BroadcastID: record.id,
      NumberOfMessages: 10,
      OffsetMessage: 0,
    }
    try {
      if (record.messageType === 'O') {
        localStorage.setItem('activeOtoChatID', record.id)
        dispatch(GetOTOUserMessages(navigate, chatOTOData, t))
      } else if (record.messageType === 'G') {
        dispatch(GetGroupMessages(navigate, chatGroupData, t))
      } else if (record.messageType === 'B') {
        dispatch(GetBroadcastMessages(navigate, broadcastMessagesData, t))
      }
      dispatch(activeChat(record))
    } catch (error) {
      // console.log('error in call api')
    }
  }

  const unblockblockContactHandler = (record) => {
    let Data = {
      senderID: currentUserId,
      channelID: currentOrganizationId,
      opponentUserId: record.id,
    }
    dispatch(BlockUnblockUser(navigate, Data, t))
  }

  const leaveGroupHandler = (record) => {
    let data = {
      UserID: parseInt(currentUserId),
      GroupID: record.id,
    }
    dispatch(LeaveGroup(navigate, data, t))
    setChatHeadMenuActive(false)
  }

  const deleteShoutFunction = (record) => {
    let Data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
        Group: {
          GroupID: record.id,
        },
      },
    }
    dispatch(DeleteShout(navigate, Data, t))
    setChatHeadMenuActive(false)
  }

  useEffect(() => {
    // Find the index of the object in the second state with matching ID
    if (allChatData.length !== 0) {
      const matchingIndex = allChatData.findIndex(
        (obj) => obj.id === talkStateData.PushChatData.id,
      )

      // If a match is found, replace the object at the matching index with the one from the first state
      if (matchingIndex !== -1) {
        const updatedAllChatData = [...allChatData] // Create a copy to avoid mutating state directly
        updatedAllChatData[matchingIndex] = talkStateData.PushChatData
        // Sort the updatedAllChatData based on messageDate and messageTime
        updatedAllChatData.sort((a, b) => {
          const aTimestamp = new Date(
            `${a.messageDate.substr(0, 4)}-${a.messageDate.substr(
              4,
              2,
            )}-${a.messageDate.substr(6, 2)} ${a.messageDate.substr(
              8,
              2,
            )}:${a.messageDate.substr(10, 2)}:${a.messageDate.substr(12, 2)}`,
          ).getTime()

          const bTimestamp = new Date(
            `${b.messageDate.substr(0, 4)}-${b.messageDate.substr(
              4,
              2,
            )}-${b.messageDate.substr(6, 2)} ${b.messageDate.substr(
              8,
              2,
            )}:${b.messageDate.substr(10, 2)}:${b.messageDate.substr(12, 2)}`,
          ).getTime()

          return bTimestamp - aTimestamp
        })

        setAllChatData(updatedAllChatData)
      }
    }
    // Check if PushChatData is not empty
    if (talkStateData.PushChatData.length !== 0) {
      // Check if PushChatData.id is not equal to any existing object's id in allChatData
      const isIdUnique = allChatData.every(
        (obj) => obj.id !== talkStateData.PushChatData.id,
      )

      if (isIdUnique) {
        setAllChatData((prevChatData) => [
          talkStateData.PushChatData,
          ...prevChatData,
        ])
      }
    } else if (
      allChatData.length === 0 &&
      talkStateData.PushChatData.length !== 0
    ) {
      setAllChatData((prevChatData) => [
        ...prevChatData,
        talkStateData.PushChatData,
      ])
    }
  }, [talkStateData.PushChatData])

  console.log('All Chat Data', allChatData, allChatData.length)

  //Making Data from MQTT Response
  useEffect(() => {
    if (
      talkStateData.talkSocketData.socketInsertOTOMessageData !== null &&
      talkStateData.talkSocketData.socketInsertOTOMessageData !== undefined &&
      talkStateData.talkSocketData.socketInsertOTOMessageData.length !== 0
    ) {
      try {
        if (
          talkStateData.ActiveChatData.id ===
          talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            .receiverID
        ) {
          let mqttInsertOtoMessageData =
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: 'O.jpg',
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: 'O',
            isOnline: true,
            isBlock: 0,
            companyName: 'Tresmark',
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          }
          dispatch(pushChatData(allChatNewMessageOtoData))
          console.log('This Condition Working')
        } else if (
          parseInt(currentUserId) ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID &&
          talkStateData.ActiveChatData.id ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID
        ) {
          let mqttInsertOtoMessageData =
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: 'O.jpg',
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: 'O',
            isOnline: true,
            isBlock: 0,
            companyName: 'Tresmark',
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          }
          dispatch(pushChatData(allChatNewMessageOtoData))
          console.log('This Condition Working')
        } else if (
          parseInt(currentUserId) ===
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .receiverID &&
          talkStateData.ActiveChatData.id !==
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID
        ) {
          if (
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != undefined &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != null &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != 0 &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '' &&
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
              .senderID != '0' &&
            talkStateData.ActiveChatData.id === 0 &&
            talkStateData.ActiveChatData.messageType === ''
          ) {
            let mqttInsertOtoMessageData =
              talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
            let allChatNewMessageOtoData = {
              id:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverID
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderID
                  : null,
              fullName:
                parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                  ? mqttInsertOtoMessageData.receiverName
                  : parseInt(currentUserId) ===
                    mqttInsertOtoMessageData.receiverID
                  ? mqttInsertOtoMessageData.senderName
                  : null,
              imgURL: 'O.jpg',
              messageBody: mqttInsertOtoMessageData.messageBody,
              messageDate: mqttInsertOtoMessageData.sentDate,
              notiCount: 0,
              messageType: 'O',
              isOnline: true,
              isBlock: 0,
              companyName: 'Tresmark',
              sentDate: mqttInsertOtoMessageData.sentDate,
              receivedDate: mqttInsertOtoMessageData.receivedDate,
              seenDate: mqttInsertOtoMessageData.seenDate,
              attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
              senderID: mqttInsertOtoMessageData.senderID,
              admin: 0,
            }
            dispatch(pushChatData(allChatNewMessageOtoData))
            console.log('This Condition Working')
          }
        } else if (talkStateData.ActiveChatData.length !== 0) {
          let mqttInsertOtoMessageData =
            talkStateData.talkSocketData.socketInsertOTOMessageData.data[0]
          let allChatNewMessageOtoData = {
            id:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverID
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderID
                : null,
            fullName:
              parseInt(currentUserId) === mqttInsertOtoMessageData.senderID
                ? mqttInsertOtoMessageData.receiverName
                : parseInt(currentUserId) ===
                  mqttInsertOtoMessageData.receiverID
                ? mqttInsertOtoMessageData.senderName
                : null,
            imgURL: 'O.jpg',
            messageBody: mqttInsertOtoMessageData.messageBody,
            messageDate: mqttInsertOtoMessageData.sentDate,
            notiCount: 0,
            messageType: 'O',
            isOnline: true,
            isBlock: 0,
            companyName: 'Tresmark',
            sentDate: mqttInsertOtoMessageData.sentDate,
            receivedDate: mqttInsertOtoMessageData.receivedDate,
            seenDate: mqttInsertOtoMessageData.seenDate,
            attachmentLocation: mqttInsertOtoMessageData.attachmentLocation,
            senderID: mqttInsertOtoMessageData.senderID,
            admin: 0,
          }
          dispatch(pushChatData(allChatNewMessageOtoData))
          console.log('This Condition Working')
        }
      } catch {
        console.log('Error in MQTT OTO')
      }
    }
    //
  }, [talkStateData.talkSocketData.socketInsertOTOMessageData])

  useEffect(() => {
    if (
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !==
        undefined &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData !== null &&
      talkStateData.talkSocketUnreadMessageCount.unreadMessageData.length !== 0
    ) {
      if (
        talkStateData.ActiveChatData.id ===
        talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
          .chatID
      ) {
        // Update state1 immutably
        const updatedAllChatData = allChatData.map((item) => {
          if (
            item.id ===
            talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
              .chatID
          ) {
            return {
              ...item,
              notiCount: 0,
            }
          }
          return item
        })
        setAllChatData(updatedAllChatData)
      } else {
        // Update state1 immutably
        const updatedAllChatData = allChatData.map((item) => {
          if (
            item.id ===
            talkStateData.talkSocketUnreadMessageCount.unreadMessageData.data[0]
              .chatID
          ) {
            return {
              ...item,
              notiCount:
                talkStateData.talkSocketUnreadMessageCount.unreadMessageData
                  .data[0].chatCount,
            }
          }
          return item
        })
        setAllChatData(updatedAllChatData)
      }
    }
  }, [talkStateData?.talkSocketUnreadMessageCount?.unreadMessageData])

  useEffect(() => {
    if (
      talkStateData.talkSocketGroupCreation.groupCreatedData !== undefined &&
      talkStateData.talkSocketGroupCreation.groupCreatedData !== null &&
      talkStateData.talkSocketGroupCreation.groupCreatedData.length !== 0
    ) {
      let filterData =
        talkStateData.talkSocketGroupCreation.groupCreatedData.data[0]
      let newGroup = {
        id: filterData.id,
        fullName: filterData.fullName,
        imgURL: filterData.imgURL,
        messageBody: filterData.messageBody,
        messageDate: currentDateTimeUtc,
        notiCount: 0,
        messageType: 'G',
        isOnline: false,
        isBlock: 0,
        companyName: '',
        sentDate: '',
        receivedDate: '',
        seenDate: '',
        attachmentLocation: '',
        senderID: 0,
        admin: filterData.admin,
      }
      let updatedArray = allChatData.map((obj) => {
        if (obj.id === newGroup.id) {
          return newGroup
        } else {
          return obj
        }
      })
      updatedArray = [
        newGroup,
        ...updatedArray.filter((obj) => obj.id !== newGroup.id),
      ]
      console.log('reciver check resent chat ', updatedArray)
      setAllChatData(updatedArray)
      dispatch(mqttGroupCreated([]))
    }
  }, [talkStateData.talkSocketGroupCreation.groupCreatedData])

  console.log('talk State Data', talkStateData)

  console.log('All User Chats', allChatData)

  return (
    <>
      {talkFeatureStates.GlobalChatsSearchFlag === true ? (
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
              placeholder={t('Search-Chat')}
              labelClass={'d-none'}
            />
          </Col>
        </Row>
      ) : null}{' '}
      {talkStateData.AllUserChats.Loading === true &&
      allChatData.length === 0 ? (
        <>
          <Spin className="talk-overallchat-spinner" />
        </>
      ) : talkStateData.AllUserChats.Loading === false &&
        allChatData !== undefined &&
        allChatData !== null &&
        allChatData.length > 0 ? (
        allChatData.map((dataItem, index) => {
          return (
            <Row key={index} className="single-chat">
              <Col lg={2} md={2} sm={2} className="bottom-border">
                <div className="chat-profile-icon">
                  {dataItem.messageType === 'O' ? (
                    <>
                      <img draggable="false" src={SingleIcon} width={25} />
                    </>
                  ) : dataItem.messageType === 'G' ? (
                    <>
                      <img draggable="false" src={GroupIcon} width={35} />
                    </>
                  ) : dataItem.messageType === 'B' ? (
                    <>
                      <img draggable="false" src={ShoutIcon} width={25} />
                    </>
                  ) : (
                    <img draggable="false" src={SingleIcon} width={25} />
                  )}
                </div>
              </Col>
              <Col lg={10} md={10} sm={10} className="bottom-border">
                <div className={'chat-block'}>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-username m-0"
                  >
                    {' '}
                    {dataItem.fullName}
                  </p>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-message m-0"
                  >
                    <span className="chat-tick-icon">
                      {dataItem.senderID === parseInt(currentUserId) &&
                      dataItem.sentDate === '' &&
                      dataItem.receivedDate === '' &&
                      dataItem.seenDate === '' ? (
                        <img
                          draggable="false"
                          src={TimerIcon}
                          className="img-cover"
                        />
                      ) : dataItem.senderID === parseInt(currentUserId) &&
                        dataItem.sentDate !== '' &&
                        dataItem.receivedDate === '' &&
                        dataItem.seenDate === '' ? (
                        <img
                          draggable="false"
                          src={SingleTickIcon}
                          className="img-cover"
                        />
                      ) : dataItem.senderID === parseInt(currentUserId) &&
                        dataItem.sentDate !== '' &&
                        dataItem.receivedDate !== '' &&
                        dataItem.seenDate === '' ? (
                        <img
                          draggable="false"
                          src={DoubleTickDeliveredIcon}
                          className="img-cover"
                        />
                      ) : dataItem.senderID === parseInt(currentUserId) &&
                        dataItem.sentDate !== '' &&
                        dataItem.receivedDate !== '' &&
                        dataItem.seenDate !== '' ? (
                        <img
                          draggable="false"
                          src={DoubleTickIcon}
                          className="img-cover"
                        />
                      ) : null}
                    </span>

                    {dataItem.messageBody === '' &&
                    dataItem.attachmentLocation !== '' ? (
                      <>
                        <span className="attachment-recent-chat">
                          <img draggable="false" src={ClipIcon} alt="" />
                          {dataItem.attachmentLocation
                            .substring(
                              dataItem.attachmentLocation.lastIndexOf('/') + 1,
                            )
                            .replace(/^\d+_/, '')}
                        </span>
                      </>
                    ) : (
                      dataItem.messageBody
                    )}
                  </p>
                  <p
                    onClick={() => chatClick(dataItem)}
                    className="chat-date m-0"
                  >
                    {dataItem.messageDate.slice(0, 8) === currentUtcDate &&
                    dataItem.messageDate !== '' &&
                    dataItem.messageDate !== undefined ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkTime(dataItem.messageDate)}
                      </>
                    ) : dataItem.messageDate.slice(0, 8) === yesterdayDateUtc &&
                      dataItem.messageDate !== '' &&
                      dataItem.messageDate !== undefined ? (
                      <>
                        {newTimeFormaterAsPerUTCTalkDate(dataItem.messageDate) +
                          ' '}
                        | {t('Yesterday')}
                      </>
                    ) : (
                      <>
                        {dataItem.messageDate !== '' &&
                        dataItem.messageDate !== undefined
                          ? newTimeFormaterAsPerUTCTalkDate(
                              dataItem.messageDate,
                            )
                          : ''}
                      </>
                    )}
                  </p>
                  {dataItem.notiCount > 0 ? (
                    <span className="new-message-count">
                      {dataItem.notiCount}
                    </span>
                  ) : null}
                  <div className="chathead-box-icons">
                    <img
                      draggable="false"
                      src={DropDownIcon}
                      onClick={() => activateChatHeadMenu(dataItem.id)}
                    />
                    {chatHeadMenuActive === dataItem.id ? (
                      <div className="dropdown-menus-chathead">
                        {/* <span onClick={deleteChatHandler}>
                            Delete Chat
                          </span> */}
                        {dataItem.messageType === 'O' &&
                        dataItem.isBlock === 0 ? (
                          <span
                            onClick={() => unblockblockContactHandler(dataItem)}
                            style={{ borderBottom: 'none' }}
                          >
                            {t('Block')}
                          </span>
                        ) : dataItem.messageType === 'O' &&
                          dataItem.isBlock === 1 ? (
                          <span
                            onClick={() => unblockblockContactHandler(dataItem)}
                            style={{ borderBottom: 'none' }}
                          >
                            {t('Unblock')}
                          </span>
                        ) : dataItem.messageType === 'G' &&
                          dataItem.isBlock === 0 ? (
                          <span
                            onClick={() => leaveGroupHandler(dataItem)}
                            style={{ borderBottom: 'none' }}
                          >
                            {t('Leave-Group')}
                          </span>
                        ) : dataItem.messageType === 'B' ? (
                          <span
                            onClick={() => deleteShoutFunction(dataItem)}
                            style={{ borderBottom: 'none' }}
                          >
                            {t('Delete-Shout')}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>
          )
        })
      ) : talkStateData.AllUserChats.Loading === false &&
        allChatData.length === 0 ? (
        // <p>{t('No-Chats-Available')}</p>
        <ResultMessage
          icon={<img src={NoRecentChatsIcon} width={250} />}
          title={"It looks like you haven't made any recent chats"}
          className="emptyRecentChats"
        />
      ) : null}
    </>
  )
}

export default RecentChats
