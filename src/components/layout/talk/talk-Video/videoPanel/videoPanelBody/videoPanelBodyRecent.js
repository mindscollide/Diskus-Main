import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TextField } from '../../../../../elements'
import { Container, Row, Col } from 'react-bootstrap'
import './videoPanelBody.css'
import { Spin } from 'antd'
import { LoaderPanel } from '../../../../../elements'
import moment from 'moment'
import {
  GetUserRecentCalls,
  InitiateVideoCall,
  getVideoRecipentData,
  ScrollRecentCalls,
  GetUserRecentCallsScroll,
} from '../../../../../../store/actions/VideoMain_actions'
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from '../../../../../../commen/functions/date_formater'
import { normalizeVideoPanelFlag } from '../../../../../../store/actions/VideoFeature_actions'
import MissedRedIcon from '../../../../../../assets/images/Missed-Red-Icon.png'
import MissedCallIcon from '../../../../../../assets/images/Missedcall-Icon.png'
import VideoCallIcon from '../../../../../../assets/images/VideoCall-Icon.png'
import IncomingIcon from '../../../../../../assets/images/Incoming-Icon.png'
import OutgoingIcon from '../../../../../../assets/images/Outgoing-Icon.png'
import EmptyRecentCalls from './emptyRecentCalls'

const VideoPanelBodyRecent = () => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state,
  )

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation()

  let currentOrganization = Number(localStorage.getItem('organizationID'))

  let currentUserName = localStorage.getItem('name')

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

  const [searchChatValue, setSearchChatValue] = useState('')

  const [recentVideoCalls, setRecentVideoCalls] = useState([])

  const [sRowsData, setSRowsData] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const searchChat = (e) => {
    setSearchChatValue(e)
    try {
      if (
        VideoMainReducer.RecentCallsData !== undefined &&
        VideoMainReducer.RecentCallsData !== null &&
        VideoMainReducer.RecentCallsData.length !== 0
      ) {
        if (e !== '') {
          let filteredData = VideoMainReducer.RecentCallsData.videoCallHistory.filter(
            (value) => {
              return value.callerName.toLowerCase().includes(e.toLowerCase())
            },
          )
          if (filteredData.length === 0) {
            setRecentVideoCalls(
              VideoMainReducer.RecentCallsData.videoCallHistory,
            )
          } else {
            setRecentVideoCalls(filteredData)
          }
        } else if (e === '' || e === null) {
          let data = VideoMainReducer.RecentCallsData.videoCallHistory
          setSearchChatValue('')
          setRecentVideoCalls(data)
        }
      }
    } catch {}
  }

  useEffect(() => {
    let Data = {
      OrganizationID: currentOrganization,
      Length: 10,
      sRow: sRowsData,
    }
    dispatch(GetUserRecentCalls(Data, navigate, t))
    return () => {
      setSRowsData(0)
    }
  }, [])

  console.log('VideoMainReducer', VideoMainReducer)

  //Setting state data of all users
  useEffect(() => {
    if (
      VideoMainReducer.RecentCallsData !== undefined &&
      VideoMainReducer.RecentCallsData !== null &&
      VideoMainReducer.RecentCallsData.length !== 0
    ) {
      if (VideoMainReducer.ScrollBehavior) {
        dispatch(ScrollRecentCalls(false))
        setSRowsData(
          (prev) =>
            prev + VideoMainReducer?.RecentCallsData?.videoCallHistory.length,
        )
        setTotalRecords(VideoMainReducer?.RecentCallsData?.recentCallCount)
        let copyData = [...recentVideoCalls]
        VideoMainReducer?.RecentCallsData?.videoCallHistory.map(
          (data, index) => {
            copyData.push(data)
          },
        )
        setRecentVideoCalls(copyData)
      } else {
        setSRowsData(VideoMainReducer?.RecentCallsData?.videoCallHistory.length)
        setTotalRecords(VideoMainReducer?.RecentCallsData?.recentCallCount)
        setRecentVideoCalls(VideoMainReducer?.RecentCallsData?.videoCallHistory)
      }
    }
  }, [VideoMainReducer?.RecentCallsData])

  const fetchMoreData = async () => {
    console.log('FetchMoreData', sRowsData, totalRecords)
    if (sRowsData <= totalRecords) {
      await dispatch(ScrollRecentCalls(true))
      let Data = {
        OrganizationID: currentOrganization,
        Length: 10,
        sRow: sRowsData,
      }
      await dispatch(GetUserRecentCallsScroll(Data, navigate, t))
    }
  }

  console.log(
    'Lengths',
    recentVideoCalls.length,
    totalRecords,
    recentVideoCalls.length <= totalRecords,
  )

  return (
    <>
      <Container>
        {videoFeatureReducer.VideoChatSearchFlag === true ? (
          <Row key={Math.random()}>
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
        {recentVideoCalls !== undefined &&
        recentVideoCalls !== null &&
        recentVideoCalls.length > 0 &&
        VideoMainReducer.Loading === false ? (
          <InfiniteScroll
            dataLength={recentVideoCalls.length}
            next={fetchMoreData}
            hasMore={recentVideoCalls.length === totalRecords ? false : true}
            // scrollThreshold="200px"
            height={'80vh'}
            loader={
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                }}
              >
                {' '}
                <Spin />
              </span>
            }
          >
            {recentVideoCalls.map((recentCallData, index) => {
              let recentCallDateTime =
                recentCallData.callDate + recentCallData.callTime
              return (
                <>
                  <Row className="single-chat" key={index}>
                    <Col lg={2} md={2} sm={12} className="bottom-border">
                      <div className="video-profile-icon">
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
                      </div>
                    </Col>
                    <Col lg={8} md={8} sm={12} className="bottom-border">
                      <div className={'video-block'}>
                        {recentCallData.callStatus.status === 'Unanswered' ||
                        recentCallData.callStatus.status === 'Busy' ? (
                          <p className="Video-chat-username missed m-0">
                            {recentCallData.callerName === currentUserName
                              ? recentCallData.recipients[0].userName
                              : recentCallData.callerName}
                            <span className="call-status-icon">
                              <img src={MissedCallIcon} />
                            </span>
                          </p>
                        ) : (
                          <p className="Video-chat-username m-0">
                            {recentCallData.callerName === currentUserName
                              ? recentCallData.recipients[0].userName
                              : recentCallData.callerName}
                            <span className="call-status-icon">
                              {recentCallData.isIncoming === false ? (
                                <img src={OutgoingIcon} />
                              ) : (
                                <img src={IncomingIcon} />
                              )}
                            </span>
                          </p>
                        )}

                        <p className="video-chat-date m-0">
                          {recentCallData.callDate === currentUtcDate &&
                          recentCallData.callDate !== '' &&
                          recentCallData.callDate !== undefined ? (
                            <>
                              {newTimeFormaterAsPerUTCTalkTime(
                                recentCallDateTime,
                              )}
                            </>
                          ) : recentCallData.callDate === yesterdayDateUtc &&
                            recentCallData.callDate !== '' &&
                            recentCallData.callDate !== undefined ? (
                            <>
                              {newTimeFormaterAsPerUTCTalkDate(
                                recentCallDateTime,
                              ) + ' '}
                              | {t('Yesterday')}
                            </>
                          ) : (
                            <>
                              {recentCallData.callDate !== '' &&
                              recentCallData.callDate !== undefined
                                ? newTimeFormaterAsPerUTCTalkDate(
                                    recentCallDateTime,
                                  )
                                : ''}
                            </>
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col lg={2} md={2} sm={12} className="mt-4">
                      <img
                        src={VideoCallIcon}
                        //   onClick={() => anotherVideoPanelHandler(true)}
                      />
                    </Col>
                  </Row>
                </>
              )
            })}
          </InfiniteScroll>
        ) : VideoMainReducer.Loading === true ? (
          <>
            <LoaderPanel message={'Protecting your data'} />
          </>
        ) : (
          <EmptyRecentCalls />
        )}
      </Container>
    </>
  )
}

export default VideoPanelBodyRecent
