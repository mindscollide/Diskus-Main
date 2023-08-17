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
  activeChat,
} from '../../../../../store/actions/Talk_action'
import { Spin } from 'antd'
import SingleIcon from '../../../../../assets/images/Single-Icon.png'
import DoubleTickIcon from '../../../../../assets/images/DoubleTick-Icon.png'
import DoubleTickDeliveredIcon from '../../../../../assets/images/DoubleTickDelivered-Icon.png'
import SingleTickIcon from '../../../../../assets/images/SingleTick-Icon.png'
import TimerIcon from '../../../../../assets/images/Timer-Icon.png'
import { useTranslation } from 'react-i18next'

const PrivateChats = () => {
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
  const [privateMessageData, setPrivateMessageData] = useState([])

  useEffect(() => {
    if (
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      let privateAllMessages = talkStateData.AllUserChats.AllUserChatsData.allMessages.filter(
        (data, index) => data.messageType === 'O',
      )
      setPrivateMessageData(privateAllMessages)
    } else {
      setPrivateMessageData([])
    }
  }, [talkStateData.AllUserChats.AllUserChatsData])

  const chatClick = (record) => {
    dispatch(chatBoxActiveFlag(true))
    console.log('chatClick Record', record)
    let chatOTOData = {
      UserID: currentUserId,
      ChannelID: currentOrganizationId,
      OpponentUserId: record.id,
      NumberOfMessages: 50,
      OffsetMessage: 0,
    }
    dispatch(GetOTOUserMessages(navigate, chatOTOData, t))
    dispatch(activeChat(record))
    localStorage.setItem('activeOtoChatID', record.id)
  }

  return (
    <>
      {privateMessageData !== undefined &&
      privateMessageData !== null &&
      privateMessageData.length > 0
        ? privateMessageData.map((dataItem) => {
            return (
              <Row className="single-chat">
                <Col lg={2} md={2} sm={2} className="bottom-border">
                  <div className="chat-profile-icon">
                    {dataItem.messageType === 'O' ? (
                      <>
                        <img src={SingleIcon} width={25} />
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
                          <img src={TimerIcon} className="img-cover" />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate === '' &&
                          dataItem.seenDate === '' ? (
                          <img src={SingleTickIcon} className="img-cover" />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate !== '' &&
                          dataItem.seenDate === '' ? (
                          <img
                            src={DoubleTickDeliveredIcon}
                            className="img-cover"
                          />
                        ) : dataItem.senderID === currentUserId &&
                          dataItem.sentDate !== '' &&
                          dataItem.receivedDate !== '' &&
                          dataItem.seenDate !== '' ? (
                          <img src={DoubleTickIcon} className="img-cover" />
                        ) : null}
                      </span>
                      {dataItem.messageBody}
                    </p>
                    <p
                      onClick={() => chatClick(dataItem)}
                      className="chat-date m-0"
                    >
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
                          | Yesterday
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

export default PrivateChats
