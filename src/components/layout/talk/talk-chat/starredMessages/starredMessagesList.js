import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { newTimeFormaterAsPerUTCTalkDate } from '../../../../../commen/functions/date_formater'
import { Spin } from 'antd'
import { GetAllStarredMessages } from '../../../../../store/actions/Talk_action'
import SingleIcon from '../../../../../assets/images/Single-Icon.png'
import StarredMessageIcon from '../../../../../assets/images/Starred-Message-Icon.png'

const StarredMessagesList = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const { talkStateData } = useSelector((state) => state)

  let currentUserId = localStorage.getItem('userID')
  let currentOrganizationId = localStorage.getItem('organizationID')

  const date = new Date()
  //CURRENT DATE TIME UTC

  //YESTERDAY'S DATE
  let yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1) // Subtract 1 day

  const [allStarredMessagesData, setAllStarredMessagesData] = useState([])

  useEffect(() => {
    let data = {
      TalkRequest: {
        UserID: parseInt(currentUserId),
        ChannelID: parseInt(currentOrganizationId),
      },
    }
    dispatch(GetAllStarredMessages(data, t, navigate))
  }, [])

  useEffect(() => {
    if (
      talkStateData.AllStarMessagesData.AllStarMessagesResponse !== undefined &&
      talkStateData.AllStarMessagesData.AllStarMessagesResponse !== null &&
      talkStateData.AllStarMessagesData.AllStarMessagesResponse.length !== 0
    ) {
      setAllStarredMessagesData(
        talkStateData.AllStarMessagesData.AllStarMessagesResponse.flagMessages,
      )
    } else {
      setAllStarredMessagesData([])
    }
  }, [talkStateData.AllStarMessagesData.AllStarMessagesResponse])

  console.log('Talk state Data', talkStateData, allStarredMessagesData)

  return (
    <>
      {talkStateData.AllStarMessagesData.Loading === true &&
      allStarredMessagesData.length === 0 ? (
        <>
          <Spin className="talk-overallchat-spinner" />
        </>
      ) : talkStateData.AllStarMessagesData.Loading === false &&
        allStarredMessagesData !== undefined &&
        allStarredMessagesData !== null &&
        allStarredMessagesData.length > 0 ? (
        allStarredMessagesData.map((dataItem, index) => {
          return (
            <>
              <Row key={index}>
                <Col lg={1} md={1} sm={1}>
                  <div className="chat-profile-icon starred-message">
                    <img src={SingleIcon} width={10} />
                  </div>
                </Col>
                <Col lg={7} md={7} sm={7}>
                  <p className="chat-username starred-message m-0">
                    {dataItem.senderName}
                  </p>
                </Col>
                <Col lg={4} md={4} sm={4} className="text-end"></Col>
              </Row>
              <Row className="bottom-border-starred" key={index}>
                <Col lg={12} md={12} sm={12}>
                  <div
                    className={
                      dataItem.senderID === parseInt(currentUserId)
                        ? 'sender-message-star'
                        : 'reply-message'
                    }
                  >
                    <p className="m-0">{dataItem.messageBody}</p>
                    <div className="starred-icon-date">
                      <span>
                        <img src={StarredMessageIcon} alt="" />
                      </span>
                      <p className="m-0">
                        {' '}
                        {dataItem.sentDate !== ''
                          ? newTimeFormaterAsPerUTCTalkDate(dataItem.sentDate)
                          : ''}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )
        })
      ) : talkStateData.AllStarMessagesData.Loading === false &&
        allStarredMessagesData.length === 0 ? (
        <p>No Starred Messages</p>
      ) : null}
    </>
  )
}

export default StarredMessagesList
