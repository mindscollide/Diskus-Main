import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from '../../../../../commen/functions/date_formater'
import {
  chatBoxActiveFlag,
  shoutallChatFlag,
  privateGroupChatFlag,
  recentChatFlag,
} from '../../../../../store/actions/Talk_Feature_actions'
import {
  GetBroadcastMessages,
  activeChat,
} from '../../../../../store/actions/Talk_action'
import { Spin } from 'antd'
import SingleIcon from '../../../../../assets/images/Single-Icon.png'
import GroupIcon from '../../../../../assets/images/Group-Icon.png'
import ShoutIcon from '../../../../../assets/images/Shout-Icon.png'
import DoubleTickIcon from '../../../../../assets/images/DoubleTick-Icon.png'
import DoubleTickDeliveredIcon from '../../../../../assets/images/DoubleTickDelivered-Icon.png'
import SingleTickIcon from '../../../../../assets/images/SingleTick-Icon.png'
import TimerIcon from '../../../../../assets/images/Timer-Icon.png'
import DropDownIcon from '../../../../../assets/images/dropdown-icon.png'
import { useTranslation } from 'react-i18next'

const ShoutAll = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const { talkStateData } = useSelector((state) => state)

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
  //YESTERDAY'S DATE
  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1) // Subtract 1 day
  let changeDateFormatYesterday = moment(yesterdayDate).utc()
  let yesterdayDateUtc = moment(changeDateFormatYesterday).format('YYYYMMDD')

  //Private Messages State
  const [shoutAllData, setShoutAllData] = useState([])

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      let shoutAllMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
        (data, index) => data.messageType === 'B',
      )
      setShoutAllData(shoutAllMessages)
    } else {
      setShoutAllData([])
    }
  }, [talkStateData.AllUserChats.AllUserChatsData])

  const chatClick = (record) => {
    dispatch(chatBoxActiveFlag(true))
    console.log('chatClick Record', record)
    let broadcastMessagesData = {
      UserID: currentUserId,
      BroadcastID: record.id,
      NumberOfMessages: 10,
      OffsetMessage: 0,
    }
    dispatch(GetBroadcastMessages(navigate, broadcastMessagesData, t))
    dispatch(activeChat(record))
  }

  return (
    <>
      {shoutAllData !== undefined &&
      shoutAllData !== null &&
      shoutAllData.length > 0
        ? shoutAllData.map((dataItem) => {
            return (
              <Row className="single-chat">
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div className="chat-profile-icon">
                    {dataItem.messageType === 'B' ? (
                      <>
                        <img draggable="false" src={ShoutIcon} width={25} />
                      </>
                    ) : null}
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
                        {dataItem.senderID === currentUserId &&
                        dataItem.sentDate === '' &&
                        dataItem.receivedDate === '' &&
                        dataItem.seenDate === '' ? (
                          <img draggable="false" src={TimerIcon} className="img-cover" />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate === '' &&
                          dataItem.seenDate === '' ? (
                          <img draggable="false" src={SingleTickIcon} className="img-cover" />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate !== '' &&
                          dataItem.seenDate === '' ? (
                          <img draggable="false"
                            src={DoubleTickDeliveredIcon}
                            className="img-cover"
                          />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate !== '' &&
                          dataItem.seenDate !== '' ? (
                          <img draggable="false" src={DoubleTickIcon} className="img-cover" />
                        ) : null}
                      </span>
                      {dataItem.messageBody}
                    </p>
                    <p className="chat-date m-0">
                      {dataItem.messageDate.slice(0, 8) === currentUtcDate ? (
                        <>
                          {newTimeFormaterAsPerUTCTalkTime(
                            dataItem.messageDate,
                          )}
                        </>
                      ) : dataItem.messageDate.slice(0, 8) ===
                        yesterdayDateUtc ? (
                        <>
                          {newTimeFormaterAsPerUTCTalkDate(
                            dataItem.messageDate,
                          ) + ' '}
                          | {t('Yesterday')}
                        </>
                      ) : (
                        <>
                          {newTimeFormaterAsPerUTCTalkDate(
                            dataItem.messageDate,
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </Col>
              </Row>
            )
          })
        : null}
    </>
  )
}

export default ShoutAll
