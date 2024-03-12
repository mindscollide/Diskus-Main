import React, { useEffect, useState } from "react";
import styles from "./ViewMeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row, Container } from "react-bootstrap";
import {
  Button,
  Notification,
  Loader,
  TextField,
  Modal,
} from "../../../../../components/elements";
import Messegeblue from "../../../../../assets/images/blue Messege.svg";
import BlueCamera from "../../../../../assets/images/blue Camera.svg";
import ClipboardIcon from "../../../../../assets/images/clipboard-01.svg";
import copyToClipboard from "../../../../../hooks/useClipBoard";
import { useDispatch } from "react-redux";
import {
  cleareAllState,
  CleareMessegeNewMeeting,
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { utcConvertintoGMT } from "../../../../../commen/functions/date_formater";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resolutionResultTable } from "../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
  activeChat,
} from "../../../../../store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  chatBoxActiveFlag,
  activeChatBoxGS,
} from "../../../../../store/actions/Talk_Feature_actions";
import CancelButtonModal from "./CancelButtonModal/CancelButtonModal";
import moment from "moment";
import {
  FetchMeetingURLApi,
  FetchMeetingURLClipboard,
} from "../../../../../store/actions/NewMeetingActions";
import {
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../store/actions/VideoMain_actions";
import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
} from "../../../../../store/actions/VideoFeature_actions";
import { convertToGMT } from "../../../../../commen/functions/time_formatter";

const ViewMeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  setMeetingDetails,
  editorRole,
  setAgenda,
  setEdiorRole,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, talkStateData } = useSelector((state) => state);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState(0);
  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");
  let currentMeeting = Number(localStorage.getItem("currentMeetingLS"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));

  const [rows, setRows] = useState([
    {
      selectedOption: "",
      dateForView: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ]);

  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);

  const [initiateVideoModalGroup, setInitiateVideoModalGroup] = useState(false);

  //For Custom language datepicker
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [meetingDetails, setMeetingDetailsData] = useState({
    MeetingTitle: "",
    MeetingType: 0,
    Location: "",
    Description: "",
    Link: "",
    ReminderFrequency: {
      value: 0,
      label: "",
    },
    ReminderFrequencyTwo: {
      value: 0,
      label: "",
    },
    ReminderFrequencyThree: {
      value: 0,
      label: "",
    },
    Notes: "",
    groupChat: false,
    AllowRSPV: false,
    NotifyMeetingOrganizer: false,
    RecurringOptions: {
      value: 0,
      label: "",
    },
    IsVideoCall: false,
  });

  const callApiOnComponentMount = async () => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    await dispatch(
      GetAllMeetingDetailsApiFunc(
        navigate,
        t,
        Data,
        true,
        setAdvanceMeetingModalID,
        setViewAdvanceMeetingModal,
        setDataroomMapFolderId
      )
    );
    let Data2 = {
      MeetingID: Number(advanceMeetingModalID),
    };
    await dispatch(
      FetchMeetingURLClipboard(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization
      )
    );
  };

  useEffect(() => {
    callApiOnComponentMount();
    return () => {
      setMeetingDetailsData({
        MeetingTitle: "",
        MeetingType: 0,
        Location: "",
        Description: "",
        Link: "",
        ReminderFrequency: {
          value: 0,
          label: "",
        },
        ReminderFrequencyTwo: {
          value: 0,
          label: "",
        },
        ReminderFrequencyThree: {
          value: 0,
          label: "",
        },
        Notes: "",
        groupChat: false,
        AllowRSPV: false,
        NotifyMeetingOrganizer: false,
        RecurringOptions: {
          value: 0,
          label: "",
        },
        IsVideoCall: false,
      });
      // dispatch(showGetAllMeetingDetialsFailed(""));
      dispatch(cleareAllState());
    };
  }, []);

  const handleUpdateNext = () => {
    setmeetingDetails(false);
    setorganizers(true);
  };

  const handleEndDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const hours = ("0" + newDate.getUTCHours()).slice(-2);
      const minutes = ("0" + newDate.getUTCMinutes()).slice(-2);
      const seconds = ("0" + newDate.getUTCSeconds()).slice(-2);

      // Format the time as HH:mm:ss
      const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
        .toString()
        .padStart(2, "0")}${seconds.toString().padStart(2, "0")}`;

      const updatedRows = [...rows];
      updatedRows[index].endDate = formattedTime;
      updatedRows[index].endTime = newDate;
      setRows(updatedRows);
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //funciton cancel button
  const handleCancelMeetingNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.removeItem("folderDataRoomMeeting");

    setEdiorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
    // setMeetingDetails(false);
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

    // setAgenda(false);
    // setCancelModalView(false);
    // setPolls(false);
    // setMinutes(false);
    // setAttendance(false);
  };

  let endMeetingRequest = {
    MeetingID: Number(advanceMeetingModalID),
    StatusID: 9,
  };

  //Fetching All Saved Data
  useEffect(() => {
    try {
      console.log("meetingStatus", NewMeetingreducer);
      if (
        NewMeetingreducer.getAllMeetingDetails !== null &&
        NewMeetingreducer.getAllMeetingDetails !== undefined
      ) {
        let MeetingData =
          NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails;
        localStorage.setItem("meetingTitle", MeetingData.meetingTitle);
        let getmeetingDates = MeetingData.meetingDates;
        let getmeetingRecurrance = MeetingData.meetingRecurrance;
        let getmeetingReminders = MeetingData.meetingReminders;
        let getmeetingStatus = MeetingData.meetingStatus.status;
        console.log("meetingStatus", NewMeetingreducer);
        console.log("meetingStatus", getmeetingStatus);
        setMeetingStatus(Number(getmeetingStatus));
        let getmeetingType = MeetingData.meetingType;
        let wasPublishedFlag = MeetingData.wasMeetingPublished;
        setMeetingDetailsData({
          MeetingTitle: MeetingData.meetingTitle,
          MeetingType: {
            PK_MTID: getmeetingType.pK_MTID,
            Type: getmeetingType.type,
          },
          Location: MeetingData.location,
          Description: MeetingData.description,
          Link: MeetingData.videoCallURl,
          ReminderFrequency: {
            value:
              getmeetingReminders[0] !== undefined
                ? getmeetingReminders[0]?.pK_MRID
                : 0,
            label:
              getmeetingReminders[0] !== undefined
                ? getmeetingReminders[0]?.description
                : "",
          },
          ReminderFrequencyTwo: {
            value:
              getmeetingReminders[1] !== undefined
                ? getmeetingReminders[1]?.pK_MRID
                : 0,
            label:
              getmeetingReminders[1] !== undefined
                ? getmeetingReminders[1]?.description
                : "",
          },
          ReminderFrequencyThree: {
            value:
              getmeetingReminders[2] !== undefined
                ? getmeetingReminders[2]?.pK_MRID
                : 0,
            label:
              getmeetingReminders[2] !== undefined
                ? getmeetingReminders[2]?.description
                : "",
          },
          Notes: MeetingData.notes,
          groupChat: MeetingData.isTalkGroup,
          AllowRSPV: MeetingData.allowRSVP,
          NotifyMeetingOrganizer: MeetingData.notifyAdminOnRSVP,
          RecurringOptions: {
            value: getmeetingRecurrance.recurranceID,
            label: getmeetingRecurrance.recurrance,
          },
          IsVideoCall: MeetingData.isVideo,
        });
        let newDateTimeData = [];
        if (
          getmeetingDates !== null &&
          getmeetingDates !== undefined &&
          getmeetingDates.length > 0
        ) {
          getmeetingDates.forEach((data, index) => {
            newDateTimeData.push({
              selectedOption: data.meetingDate,
              startDate: data.startTime,
              endDate: data.endTime,
              endTime: resolutionResultTable(data.meetingDate + data.endTime),
              startTime: resolutionResultTable(
                data.meetingDate + data.startTime
              ),
              dateForView: resolutionResultTable(
                data.meetingDate + data.startTime
              ),
            });
          });
        }
        setRows(newDateTimeData);
      }
    } catch {}
  }, [NewMeetingreducer.getAllMeetingDetails]);

  const leaveCallHost = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    let Data2 = {
      MeetingID: currentMeeting,
    };
    dispatch(
      FetchMeetingURLApi(Data2, navigate, t, currentUserID, currentOrganization)
    );
    localStorage.setItem("meetingTitle", meetingDetails.MeetingTitle);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", 0);
    localStorage.setItem("recipentCalledID", 0);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", true);
  };

  const leaveCallParticipant = () => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    dispatch(LeaveCall(Data, navigate, t));
    let Data2 = {
      MeetingID: currentMeeting,
    };
    dispatch(
      FetchMeetingURLApi(Data2, navigate, t, currentUserID, currentOrganization)
    );
    localStorage.setItem("meetingTitle", meetingDetails.MeetingTitle);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", 0);
    localStorage.setItem("activeCall", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", true);
  };

  const joinMeetingCall = () => {
    if (activeCall === false && isMeeting === false) {
      let Data = {
        MeetingID: currentMeeting,
      };
      dispatch(
        FetchMeetingURLApi(
          Data,
          navigate,
          t,
          currentUserID,
          currentOrganization,
          0
        )
      );
      localStorage.setItem("meetingTitle", meetingDetails.MeetingTitle);
    } else if (activeCall === true && isMeeting === false) {
      setInitiateVideoModalOto(true);
      dispatch(callRequestReceivedMQTT({}, ""));
    }
  };

  const copyToClipboardd = () => {
    if (
      NewMeetingreducer.CurrentMeetingURL !== undefined &&
      NewMeetingreducer.CurrentMeetingURL !== null &&
      NewMeetingreducer.CurrentMeetingURL !== ""
    ) {
      console.log(
        "NewMeetingreducer.CurrentMeetingURL",
        NewMeetingreducer.CurrentMeetingURL
      );
      copyToClipboard(NewMeetingreducer.CurrentMeetingURL);
      setOpen({
        ...open,
        flag: true,
        message: "URL copied to clipboard",
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    }
  };

  const groupChatInitiation = (data) => {
    if (
      data.talkGroupID !== 0 &&
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      dispatch(createShoutAllScreen(false));
      dispatch(addNewChatScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(createGroupScreen(false));
      dispatch(chatBoxActiveFlag(false));
      dispatch(recentChatFlag(true));
      dispatch(activeChatBoxGS(true));
      dispatch(chatBoxActiveFlag(true));
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      let chatGroupData = {
        UserID: parseInt(userID),
        ChannelID: currentOrganization,
        GroupID: data.talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(GetAllUsers(navigate, parseInt(userID), currentOrganization, t));
      dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(userID),
          currentOrganization,
          t
        )
      );
      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", data.talkGroupID);
    }
  };

  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Data-available") &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available") &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found") &&
      NewMeetingreducer.ResponseMessage !== undefined
    ) {
      setOpen({
        ...open,
        flag: true,
        message: NewMeetingreducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  console.log("NewMeetingReducerNewMeetingReducer", NewMeetingreducer);
  console.log("meetingDetailsmeetingDetails", meetingDetails);

  console.log(
    "setDataroomMapFolderIdsetDataroomMapFolderId",
    setDataroomMapFolderId
  );

  console.log("setEdiorRolesetEdiorRole", setEdiorRole);

  console.log("setAdvanceMeetingModalID", setAdvanceMeetingModalID);

  return (
    <>
      <section>
        {meetingStatus === 10 && (
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              {Number(editorRole.status) === 10 &&
              editorRole.role === "Organizer" ? (
                <>
                  <Button
                    text={t("End-meeting")}
                    className={styles["LeaveMeetinButton"]}
                    onClick={() =>
                      dispatch(
                        UpdateOrganizersMeeting(
                          navigate,
                          t,
                          4,
                          endMeetingRequest,
                          setEdiorRole,
                          setAdvanceMeetingModalID,
                          setDataroomMapFolderId,
                          setViewAdvanceMeetingModal
                        )
                      )
                    }
                  />
                </>
              ) : meetingDetails.IsVideoCall === true ? (
                <>
                  {/* <Button
                  text={t("Join-Video-Call")}
                  className={styles["JoinMeetingButton"]}
                  onClick={joinMeetingCall}
                /> */}
                  <Button
                    text={t("Leave-meeting")}
                    className={styles["LeaveMeetinButton"]}
                    onClick={handleCancelMeetingNoPopup}
                  />
                </>
              ) : (
                <Button
                  text={t("Leave-meeting")}
                  className={styles["LeaveMeetinButton"]}
                  onClick={handleCancelMeetingNoPopup}
                />
              )}
            </Col>
          </Row>
        )}

        <Row className="mt-4">
          <Col
            lg={12}
            md={12}
            sm={12}
            className={styles["ScrollerMeeting_Active"]}
          >
            <Row className={meetingStatus === 10 ? "mt-4" : ""}>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_Gray_meeting"]}>
                  {meetingDetails.MeetingType?.Type}{" "}
                  {meetingDetails.Location === "" ? "" : <>|</>}{" "}
                  {meetingDetails.Location}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["MeetingTitle_Heading"]}>
                  {meetingDetails.MeetingTitle}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              {/* <Col lg={12} md={12} sm={12} className="textAreaDivVieww vv"> */}
              <Col lg={12} md={12} sm={12}>
                <span className={styles["ParaGraph_SavedMeeting"]}>
                  {meetingDetails.Description}
                </span>
                {/* <TextField
                  // change={detailsHandler}
                  name="MeetingDescription"
                  applyClass="form-control2 textbox-height-details-view"
                  type="text"
                  disable={true}
                  // as={"textarea"}
                  rows="7"
                  // label={}
                  // placeholder={t("Description") + "*"}
                  value={meetingDetails.Description}
                  required
                /> */}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={5} md={5} sm={5}>
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["NOtes_heading"]}>
                      {t("Notes")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["ParaGraph_SavedMeeting"]}>
                      {meetingDetails.Notes}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Scedule_OnHeading"]}>
                      {t("Scheduled-on")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  {rows.map((data, index) => {
                    console.log(data, "formattedStartDateformattedStartDate");
                    const formattedStartDate = convertToGMT(
                      data.meetingDate,
                      data.startTime
                    );
                    const formattedEndDate = convertToGMT(
                      data.meetingDate,
                      data.endTime
                    );

                    if (!formattedStartDate || !formattedEndDate) {
                      return null;
                    }

                    return (
                      <Col key={index} lg={12} md={12} sm={12}>
                        <span className={styles["ScheduledDateTime"]}>
                          {moment(formattedStartDate).format("hh:mm a")} -{" "}
                          {moment(formattedEndDate).format("hh:mm a")} ,{" "}
                          {moment(formattedEndDate).format("DD MMM YYYY")}
                        </span>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col lg={7} md={7} sm={7}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex align-items-center gap-1"
                  >
                    {meetingDetails.groupChat && (
                      <img
                        src={Messegeblue}
                        height="20.44px"
                        width="25.68px"
                        alt=""
                        onClick={() => groupChatInitiation(meetingDetails)}
                        className="cursor-pointer mx-2"
                      />
                    )}
                    {meetingDetails.IsVideoCall && (
                      <>
                        {/* <img
                        src={BlueCamera}
                        height="17.84px"
                        width="27.19px"
                        alt=""
                        className={styles["blue-icon"]}
                      /> */}
                        {/* <img
                          src={ClipboardIcon}
                          height="40px"
                          width="40px"
                          alt=""
                          onClick={() => copyToClipboardd()}
                          className={styles["clipboard-icon"]}
                        /> */}
                        {editorRole.status === "10" ||
                        editorRole.status === 10 ? (
                          <>
                            {" "}
                            <Button
                              text={t("Copy-link")}
                              className={styles["CopyLinkButton"]}
                              onClick={() => copyToClipboardd()}
                            />
                            <Button
                              text={t("Join-Video-Call")}
                              className={styles["JoinMeetingButton"]}
                              onClick={joinMeetingCall}
                            />{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Button
                              text={t("Copy-link")}
                              className={`${
                                styles["CopyLinkButton"]
                              } ${"grayScaled"}`}
                              // onClick={() => copyToClipboardd()}
                            />
                            <Button
                              text={t("Join-Video-Call")}
                              className={`${
                                styles["JoinMeetingButton"]
                              } ${"grayScaled"} `}
                              // onClick={joinMeetingCall}
                            />
                          </>
                        )}
                        {/* <span className={styles["LinkClass"]}>
                        {meetingDetails.Link}
                      </span> */}
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["NOtes_heading"]}>{t("RSVP")}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["RspvClassDetails"]}>
                      {meetingDetails.AllowRSPV
                        ? t("RSVP-allowed-and-notify")
                        : t("RSVP-not-allowed")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={6} md={6} sm={6}>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NOtes_heading"]}>
                          {t("Reminder-frequency")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      {meetingDetails.ReminderFrequency && (
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["RspvClassDetails"]}>
                            {meetingDetails.ReminderFrequency.label}
                          </span>
                        </Col>
                      )}

                      {meetingDetails.ReminderFrequencyTwo && (
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["RspvClassDetails"]}>
                            {meetingDetails.ReminderFrequencyTwo.label}
                          </span>
                        </Col>
                      )}
                      {meetingDetails.ReminderFrequencyThree && (
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["RspvClassDetails"]}>
                            {meetingDetails.ReminderFrequencyThree.label}
                          </span>
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["NOtes_heading"]}>
                          {t("Recurring")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["ParaGraph_SavedMeeting"]}>
                          {meetingDetails.RecurringOptions.label}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Meeting_Details"]}
              onClick={handleCancelMeetingNoPopup}
            />
            <Button
              text={t("Next")}
              className={styles["Next_Meeting_SaveMeeting"]}
              onClick={handleUpdateNext}
            />
          </Col>
        </Row>
        {/* {NewMeetingreducer.LoadingViewModal && <Loader />} */}
        {cancelModalView && (
          <CancelButtonModal
            setCancelModalView={setCancelModalView}
            cancelModalView={cancelModalView}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
            setMeetingDetails={setmeetingDetails}
            setEdiorRole={setEdiorRole}
            setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          />
        )}
        <Notification
          setOpen={setOpen}
          open={open.flag}
          message={open.message}
        />
      </section>

      <Modal
        show={initiateVideoModalOto}
        onHide={() => {
          setInitiateVideoModalOto(false);
        }}
        setShow={setInitiateVideoModalOto}
        modalFooterClassName="d-none"
        centered
        size={"sm"}
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <p> Disconnect current call? </p>
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
                        ? leaveCallHost
                        : callerID !== currentUserID
                        ? leaveCallParticipant
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    onClick={() => setInitiateVideoModalOto(false)}
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

export default ViewMeetingDetails;
