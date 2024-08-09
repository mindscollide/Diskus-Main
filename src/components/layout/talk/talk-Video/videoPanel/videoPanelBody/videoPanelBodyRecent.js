import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { TextField, Modal, Button } from "../../../../../elements";
import { Container, Row, Col } from "react-bootstrap";
import "./videoPanelBody.css";
import { Spin, Tooltip } from "antd";
import { LoaderPanel } from "../../../../../elements";
import moment from "moment";
import {
  GetUserRecentCalls,
  InitiateVideoCall,
  getVideoRecipentData,
  ScrollRecentCalls,
  GetUserRecentCallsScroll,
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../../store/actions/VideoMain_actions";
import {
  newTimeFormaterAsPerUTCTalkTime,
  newTimeFormaterAsPerUTCTalkDate,
} from "../../../../../../commen/functions/date_formater";
import {
  normalizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  videoChatPanel,
  leaveCallModal,
  participantPopup,
} from "../../../../../../store/actions/VideoFeature_actions";
import MissedRedIcon from "../../../../../../assets/images/Missed-Red-Icon.png";
import MissedCallIcon from "../../../../../../assets/images/Missedcall-Icon.png";
import VideoCallIcon from "../../../../../../assets/images/VideoCall-Icon.png";
import IncomingIcon from "../../../../../../assets/images/Incoming-Icon.png";
import OutgoingIcon from "../../../../../../assets/images/Outgoing-Icon.png";
import EmptyRecentCalls from "./emptyRecentCalls";

const VideoPanelBodyRecent = () => {
  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  let currentUserName = localStorage.getItem("name");

  let currentOrganization = Number(localStorage.getItem("organizationID"));

  let currentUserID = Number(localStorage.getItem("userID"));

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));

  //CURRENT DATE TIME UTC
  let currentDateTime = new Date();

  let changeDateFormatCurrent = moment(currentDateTime).utc();

  let currentDateTimeUtc = moment(changeDateFormatCurrent).format(
    "YYYYMMDDHHmmss"
  );

  let currentUtcDate = currentDateTimeUtc.slice(0, 8);

  //YESTERDAY'S DATE
  let yesterdayDate = new Date();

  yesterdayDate.setDate(yesterdayDate.getDate() - 1); // Subtract 1 day

  let changeDateFormatYesterday = moment(yesterdayDate).utc();

  let yesterdayDateUtc = moment(changeDateFormatYesterday).format("YYYYMMDD");

  const [searchChatValue, setSearchChatValue] = useState("");

  const [recentVideoCalls, setRecentVideoCalls] = useState([]);

  const [sRowsData, setSRowsData] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);

  const [initiateVideoModalGroup, setInitiateVideoModalGroup] = useState(false);

  const [recentCallRecipientData, setRecentCallRecipientData] = useState([]);

  const searchChat = (e) => {
    setSearchChatValue(e);
    try {
      if (
        VideoMainReducer.RecentCallsData &&
        VideoMainReducer.RecentCallsData.videoCallHistory &&
        VideoMainReducer.RecentCallsData.videoCallHistory.length !== 0
      ) {
        if (e) {
          const filteredData =
            VideoMainReducer.RecentCallsData.videoCallHistory.filter(
              (value) => {
                return (
                  value.recipients[0].userName
                    .toLowerCase()
                    .includes(e.toLowerCase()) ||
                  value.callerName.toLowerCase().includes(e.toLowerCase())
                );
              }
            );
          setRecentVideoCalls(filteredData.length > 0 ? filteredData : []);
        } else {
          // When search input is empty, reset to original data
          setRecentVideoCalls(
            VideoMainReducer.RecentCallsData.videoCallHistory
          );
        }
      }
    } catch (error) {
      console.error("Error in searchChat:", error);
    }
  };

  console.log("Video Call User Data", VideoMainReducer);
  useEffect(() => {
    let Data = {
      OrganizationID: currentOrganization,
      Length: 10,
      sRow: sRowsData,
    };
    dispatch(GetUserRecentCalls(Data, navigate, t));
    return () => {
      setSRowsData(0);
    };
  }, []);

  //Setting state data of all users
  useEffect(() => {
    if (
      VideoMainReducer.RecentCallsData !== undefined &&
      VideoMainReducer.RecentCallsData !== null &&
      VideoMainReducer.RecentCallsData.length !== 0
    ) {
      if (VideoMainReducer.ScrollBehavior) {
        dispatch(ScrollRecentCalls(false));
        setSRowsData(
          (prev) =>
            prev + VideoMainReducer?.RecentCallsData?.videoCallHistory.length
        );
        setTotalRecords(VideoMainReducer?.RecentCallsData?.recentCallCount);
        let copyData = [...recentVideoCalls];
        VideoMainReducer?.RecentCallsData?.videoCallHistory.map(
          (data, index) => {
            copyData.push(data);
          }
        );
        setRecentVideoCalls(copyData);
      } else {
        setSRowsData(
          VideoMainReducer?.RecentCallsData?.videoCallHistory.length
        );
        setTotalRecords(VideoMainReducer?.RecentCallsData?.recentCallCount);
        setRecentVideoCalls(
          VideoMainReducer?.RecentCallsData?.videoCallHistory
        );
      }
    }
  }, [VideoMainReducer?.RecentCallsData]);

  const fetchMoreData = async () => {
    if (sRowsData <= totalRecords) {
      await dispatch(ScrollRecentCalls(true));
      let Data = {
        OrganizationID: currentOrganization,
        Length: 10,
        sRow: sRowsData,
      };
      await dispatch(GetUserRecentCallsScroll(Data, navigate, t));
    }
  };

  const otoVideoCall = (data) => {
    setRecentCallRecipientData(data);
    if (activeCall === false) {
      if (data.callType.callTypeID === 1) {
        let Data = {
          RecipentIDs:
            data.callerID === currentUserID
              ? [data.recipients[0].userID]
              : [data.callerID],
          CallTypeID: 1,
          OrganizationID: currentOrganization,
        };
        localStorage.setItem("CallType", Data.CallTypeID);
        dispatch(InitiateVideoCall(Data, navigate, t));
        localStorage.setItem("isCaller", true);
        localStorage.setItem("callerID", currentUserID);
        localStorage.setItem("activeCall", true);
        dispatch(callRequestReceivedMQTT({}, ""));
        dispatch(getVideoRecipentData(data));
        dispatch(normalizeVideoPanelFlag(true));
        dispatch(videoChatPanel(false));
      } else if (data.callType.callTypeID === 2) {
        const recipientIds =
          data.callerID !== currentUserID ? [data.callerID] : [];

        data.recipients.forEach((recipient) => {
          recipientIds.push(recipient.userID);
        });

        const indexToRemove = recipientIds.indexOf(currentUserID);
        if (indexToRemove !== -1) {
          recipientIds.splice(indexToRemove, 1);
        }

        let Data = {
          RecipentIDs: recipientIds,
          CallTypeID: 2,
          OrganizationID: currentOrganization,
        };

        localStorage.setItem("CallType", Data.CallTypeID);
        dispatch(InitiateVideoCall(Data, navigate, t));
        localStorage.setItem("callerID", currentUserID);
        localStorage.setItem("isCaller", true);
        localStorage.setItem("activeCall", true);
        dispatch(callRequestReceivedMQTT({}, ""));
        dispatch(normalizeVideoPanelFlag(true));
        dispatch(videoChatPanel(false));
      }
    } else {
      if (data.callType.callTypeID === 1) {
        setInitiateVideoModalOto(true);
      } else if (data.callType.callTypeID === 2) {
        setInitiateVideoModalGroup(true);
      }
    }
  };

  const leaveCallHostOto = () => {
    let userCalledID = Number(localStorage.getItem("recipentCalledID"));
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    let Data2 = {
      RecipentIDs:
        recentCallRecipientData.callerID === currentUserID
          ? [recentCallRecipientData.recipients[0].userID]
          : [recentCallRecipientData.callerID],
      CallTypeID: 1,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", currentUserID);
    localStorage.setItem("recipentCalledID", userCalledID);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", false);
  };

  const leaveCallParticipantOto = () => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let userCalledID = Number(localStorage.getItem("recipentCalledID"));
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    let Data2 = {
      RecipentIDs:
        recentCallRecipientData.callerID === currentUserID
          ? [recentCallRecipientData.recipients[0].userID]
          : [recentCallRecipientData.callerID],
      CallTypeID: 1,
      OrganizationID: currentOrganization,
    };
    dispatch(LeaveCall(Data, navigate, t));
    dispatch(InitiateVideoCall(Data2, navigate, t));
    localStorage.setItem("isCaller", true);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", Data2.CallTypeID);
    localStorage.setItem("activeCall", true);
    localStorage.setItem("recipentCalledID", userCalledID);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", false);
  };

  const leaveCallHostGroup = () => {
    const recipientIds =
      recentCallRecipientData.callerID !== currentUserID
        ? [recentCallRecipientData.callerID]
        : [];

    recentCallRecipientData.recipients.forEach((recipient) => {
      recipientIds.push(recipient.userID);
    });

    const indexToRemove = recipientIds.indexOf(currentUserID);
    if (indexToRemove !== -1) {
      recipientIds.splice(indexToRemove, 1);
    }

    let Data = {
      RecipentIDs: recipientIds,
      CallTypeID: 2,
      OrganizationID: currentOrganization,
    };

    let Data2 = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data2, navigate, t));
    dispatch(InitiateVideoCall(Data, navigate, t));
    localStorage.setItem("isCaller", true);
    localStorage.setItem("CallType", Data.CallTypeID);
    localStorage.setItem("callerID", currentUserID);
    localStorage.setItem("activeCall", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalGroup(false);
    dispatch(participantPopup(false));
    dispatch(videoChatPanel(false));

    localStorage.setItem("isMeetingVideo", false);
  };

  const leaveCallParticipantGroup = () => {
    const recipientIds =
      recentCallRecipientData.callerID !== currentUserID
        ? [recentCallRecipientData.callerID]
        : [];

    recentCallRecipientData.recipients.forEach((recipient) => {
      recipientIds.push(recipient.userID);
    });

    const indexToRemove = recipientIds.indexOf(currentUserID);
    if (indexToRemove !== -1) {
      recipientIds.splice(indexToRemove, 1);
    }

    let Data = {
      RecipentIDs: recipientIds,
      CallTypeID: 2,
      OrganizationID: currentOrganization,
    };

    let roomID = localStorage.getItem("acceptedRoomID");
    let Data2 = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    dispatch(LeaveCall(Data2, navigate, t));
    dispatch(InitiateVideoCall(Data, navigate, t));
    localStorage.setItem("CallType", Data.CallTypeID);
    localStorage.setItem("activeCall", true);
    localStorage.setItem("isCaller", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalGroup(false);
    dispatch(participantPopup(false));
    dispatch(videoChatPanel(false));

    localStorage.setItem("isMeetingVideo", false);
  };

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
                  searchChat(e.target.value);
                }}
                value={searchChatValue}
                placeholder={t("Search-Chat")}
                labelClass={"d-none"}
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
            height={"80vh"}
            loader={
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {" "}
                <Spin />
              </span>
            }
          >
            {recentVideoCalls.map((recentCallData, index) => {
              let recentCallDateTime =
                recentCallData.callDate + recentCallData.callTime;
              return (
                <>
                  <Row className="single-chat" key={index}>
                    <Col lg={2} md={2} sm={12} className="bottom-border">
                      {recentCallData.callerName === currentUserName ? (
                        <div
                          className="video-profile-icon"
                          style={{
                            backgroundImage: `url('data:image/jpeg;base64,${recentCallData.recipients[0].recipientDisplayProfilePicture}')`,
                          }}
                        />
                      ) : (
                        <div
                          className="video-profile-icon"
                          style={{
                            backgroundImage: `url('data:image/jpeg;base64,${recentCallData.callerDisplayProfilePicture}')`,
                          }}
                        />
                      )}
                    </Col>
                    <Col lg={8} md={8} sm={12} className="bottom-border">
                      <div className={"video-block"}>
                        {recentCallData.callStatus.status === "Unanswered" ||
                        recentCallData.callStatus.status === "Busy" ? (
                          <p className="Video-chat-username m-0">
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
                          recentCallData.callDate !== "" &&
                          recentCallData.callDate !== undefined ? (
                            <>
                              {newTimeFormaterAsPerUTCTalkTime(
                                recentCallDateTime
                              )}
                            </>
                          ) : recentCallData.callDate === yesterdayDateUtc &&
                            recentCallData.callDate !== "" &&
                            recentCallData.callDate !== undefined ? (
                            <>
                              {newTimeFormaterAsPerUTCTalkDate(
                                recentCallDateTime
                              ) + " "}
                              | {t("Yesterday")}
                            </>
                          ) : (
                            <>
                              {recentCallData.callDate !== "" &&
                              recentCallData.callDate !== undefined
                                ? newTimeFormaterAsPerUTCTalkDate(
                                    recentCallDateTime
                                  )
                                : ""}
                            </>
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col lg={2} md={2} sm={12} className="video_call_icon mt-4">
                      <Tooltip
                        placement="bottomLeft"
                        title={t("Start-video-call")}
                      >
                        <img
                          className="cursor-pointer"
                          src={VideoCallIcon}
                          onClick={() => otoVideoCall(recentCallData)}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </>
              );
            })}
          </InfiniteScroll>
        ) : VideoMainReducer.Loading === true ? (
          <>
            <LoaderPanel message={"Protecting your data"} />
          </>
        ) : (
          <EmptyRecentCalls />
        )}
      </Container>

      <Modal
        show={initiateVideoModalOto}
        onHide={() => {
          setInitiateVideoModalOto(false);
        }}
        setShow={setInitiateVideoModalOto}
        modalFooterClassName="d-none"
        centered
        size={"md"}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12} className="text-center">
                  <p className="disconnection-text">
                    {" "}
                    {t("Are-you-sure-you-want-to-disconnect-this-call")}{" "}
                  </p>
                </Col>
              </Row>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    // text={
                    //   callerID === currentUserID || callerID === 0
                    //     ? t("End Host")
                    //     : callerID !== currentUserID
                    //     ? t("End Participant")
                    //     : null
                    // }
                    text={"Confirm"}
                    className="confirmation-disconnection-button"
                    onClick={
                      callerID === currentUserID || callerID === 0
                        ? leaveCallHostOto
                        : callerID !== currentUserID
                        ? leaveCallParticipantOto
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="cancellation-disconnection-button"
                    onClick={() => setInitiateVideoModalOto(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />

      <Modal
        show={initiateVideoModalGroup}
        onHide={() => {
          setInitiateVideoModalGroup(false);
        }}
        setShow={setInitiateVideoModalGroup}
        modalFooterClassName="d-none"
        centered
        size={"sm"}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <p> Group Call Disconnection </p>
                </Col>
              </Row>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={
                      callerID === currentUserID || callerID === 0
                        ? t("End Host")
                        : callerID !== currentUserID
                        ? t("End Participant")
                        : null
                    }
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    onClick={
                      callerID === currentUserID || callerID === 0
                        ? leaveCallHostGroup
                        : callerID !== currentUserID
                        ? leaveCallParticipantGroup
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    onClick={() => setInitiateVideoModalGroup(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />
    </>
  );
};

export default VideoPanelBodyRecent;
