import React, { useContext, useEffect, useState } from "react";
import styles from "./ViewMeetingDetails.module.css";
import { useTranslation } from "react-i18next";
import { Col, Row, Container } from "react-bootstrap";
import {
  Button,
  Notification,
  Modal,
} from "../../../../../components/elements";
import Messegeblue from "../../../../../assets/images/blue Messege.svg";
import CopyLinkBtn from "../../../../../assets/images/CopyLink_Image.png";
import { useDispatch } from "react-redux";
import {
  cleareAllState,
  CleareMessegeNewMeeting,
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  LeaveCurrentMeeting,
  viewMeetingFlag,
} from "../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resolutionResultTable,
  getCurrentDateTimeUTC,
} from "../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
import {
  GetAllUsers,
  GetAllUserChats,
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
import { FetchMeetingURLApi } from "../../../../../store/actions/NewMeetingActions";
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
  maxHostVideoCallPanel,
  normalHostVideoCallPanel,
  maxParticipantVideoCallPanel,
  normalParticipantVideoCallPanel,
  getParticipantMeetingJoinMainApi,
  nonMeetingVideoGlobalModal,
  videoIconOrButtonState,
} from "../../../../../store/actions/VideoFeature_actions";
import { convertToGMT } from "../../../../../commen/functions/time_formatter";
import {
  ClearResponseMessageGuest,
  getMeetingGuestVideoMainApi,
} from "../../../../../store/actions/Guest_Video";

import EndMeetingConfirmationModal from "../../EndMeetingConfirmationModal/EndMeetingConfirmationModal";
import { MeetingContext } from "../../../../../context/MeetingContext";
import { useCallback } from "react";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import MaxHostVideoCallComponent from "../../meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import NormalHostVideoCallComponent from "../../meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import ParticipantVideoCallComponent from "../../meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import MaxParticipantVideoDeniedComponent from "../../meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../../meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";
import NormalParticipantVideoComponent from "../../meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import NonMeetingVideoModal from "../nonMeetingVideoModal/NonMeetingVideoModal";
const ViewMeetingDetails = ({
  setorganizers,
  setmeetingDetails,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setAdvanceMeetingModalID,
  setDataroomMapFolderId,
  setMeetingMaterial,
  setAgenda,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getAllMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.getAllMeetingDetails
  );
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const AllUserChats = useSelector((state) => state.talkStateData.AllUserChats);
  const { setEndMeetingConfirmationModal, editorRole, setEditorRole } =
    useContext(MeetingContext);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState(0);
  console.log(
    advanceMeetingModalID,
    "advanceMeetingModalIDadvanceMeetingModalID"
  );

  const guestVideoUrlNotification = useSelector(
    (state) => state.GuestVideoReducer.ResponseMessage
  );

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const participantVideoNavigationData = useSelector(
    (state) => state.videoFeatureReducer.participantVideoNavigationData
  );

  const normalParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.normalParticipantVideoFlag
  );

  const maxParticipantVideoDeniedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoDeniedFlag
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );

  const enableDisableVideoState = useSelector(
    (state) => state.videoFeatureReducer.enableDisableVideoState
  );

  console.log(enableDisableVideoState, "videoIconOrButtonStatehavsh");

  //For Non Video MEeting Modal
  const nonMeetingVideo = useSelector(
    (state) => state.videoFeatureReducer.nonMeetingVideo
  );

  console.log(
    guestVideoUrlNotification,
    "guestVideoUrlNotificationguestVideoUrlNotification"
  );
  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let currentMeeting = Number(localStorage.getItem("currentMeetingLS"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
  let currentMeetingVideoURL = localStorage.getItem("videoCallURL");

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

  const [viewFlag, setViewFlag] = useState(false);

  //For Custom language datepicker
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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
    TalkGroupID: 0,
  });

  const callApiOnComponentMount = async () => {
    //Notification if Published Advance meeting is Triggered
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      let AdvanceNotificationClickMeetingID = localStorage.getItem(
        "NotificationAdvanceMeetingID"
      );
      console.log(
        AdvanceNotificationClickMeetingID,
        "NotificationDataNotificationData"
      );
      let Data = {
        MeetingID:
          advanceMeetingModalID === "0" ||
          advanceMeetingModalID === 0 ||
          advanceMeetingModalID === null ||
          advanceMeetingModalID === undefined
            ? Number(AdvanceNotificationClickMeetingID)
            : Number(advanceMeetingModalID),
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
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserID),
          parseInt(currentOrganization),
          t
        )
      );
    } else {
      let Data = {
        MeetingID:
          advanceMeetingModalID === "0" ||
          advanceMeetingModalID === 0 ||
          advanceMeetingModalID === null ||
          advanceMeetingModalID === undefined
            ? currentMeetingID
            : Number(advanceMeetingModalID),
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
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserID),
          parseInt(currentOrganization),
          t
        )
      );
    }
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
        TalkGroupID: 0,
      });

      dispatch(cleareAllState());
      dispatch(viewMeetingFlag(false));
    };
  }, []);

  const handleUpdateNext = () => {
    if (editorRole.role === "Participant") {
      setmeetingDetails(false);
      setMeetingMaterial(true);
    } else if (editorRole.role === "Agenda Contributor") {
      setAgenda(true);
      setmeetingDetails(false);
    } else {
      setmeetingDetails(false);
      setorganizers(true);
    }
  };

  //funciton cancel button
  const handleCancelMeetingNoPopup = () => {
    //Notifcation when Meeting Started and you have joined it if you didnt applied this it will say join logs didnt find
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      localStorage.removeItem("folderDataRoomMeeting");
      setEditorRole({ status: null, role: null });
      setAdvanceMeetingModalID(null);
      setViewAdvanceMeetingModal(false);
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
      dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      localStorage.removeItem("AdvanceMeetingOperations");
      localStorage.removeItem("NotificationAdvanceMeetingID");
    } else {
      if (meetingStatus === 10 || meetingStatus === "10") {
        let leaveMeetingData = {
          FK_MDID: Number(currentMeeting),
          DateTime: getCurrentDateTimeUTC(),
        };
        dispatch(
          LeaveCurrentMeeting(
            navigate,
            t,
            leaveMeetingData,
            false,
            setViewFlag,
            setEditorRole,
            setAdvanceMeetingModalID,
            setViewAdvanceMeetingModal
          )
        );
      } else {
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        console.log("chek search meeting");
        dispatch(searchNewUserMeeting(navigate, searchData, t));
        localStorage.removeItem("folderDataRoomMeeting");
        setEditorRole({ status: null, role: null });
        setAdvanceMeetingModalID(null);
        setViewAdvanceMeetingModal(false);
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
        dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
      }
    }
  };

  //Fetching All Saved Data
  useEffect(() => {
    try {
      if (getAllMeetingDetails !== null && getAllMeetingDetails !== undefined) {
        let MeetingData = getAllMeetingDetails.advanceMeetingDetails;
        localStorage.setItem("meetingTitle", MeetingData.meetingTitle);
        localStorage.setItem(
          "isMinutePublished",
          MeetingData.isMinutePublished
        );
        let getmeetingDates = MeetingData.meetingDates;
        let getmeetingRecurrance = MeetingData.meetingRecurrance;
        let getmeetingReminders = MeetingData.meetingReminders;
        let getmeetingStatus = MeetingData.meetingStatus.status;
        console.log("meetingStatus", getmeetingStatus);
        setMeetingStatus(Number(getmeetingStatus));
        let getmeetingType = MeetingData.meetingType;
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
          TalkGroupID: MeetingData.talkGroupID,
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
  }, [getAllMeetingDetails]);

  const leaveCallHost = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    let Data2 = {
      VideoCallURL: currentMeetingVideoURL,
    };
    dispatch(
      FetchMeetingURLApi(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization,
        0,
        meetingDetails.MeetingTitle,
        advanceMeetingModalID
      )
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
      VideoCallURL: currentMeetingVideoURL,
    };
    dispatch(
      FetchMeetingURLApi(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization,
        0,
        meetingDetails.MeetingTitle,
        advanceMeetingModalID
      )
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
    let nonMeetingCheck = JSON.parse(
      sessionStorage.getItem("NonMeetingVideoCall")
    );

    const meetingHost = JSON.parse(localStorage.getItem("meetinHostInfo"));
    console.log(meetingHost, "editorRoleeditorRole");
    // Orgainzer  = 10 ,Participant = 2 , Agenda Contributor = 3,

    if (nonMeetingCheck) {
      dispatch(nonMeetingVideoGlobalModal(true));
    } else {
      let meetingVideoData = {
        roleID: editorRole.role === "Participant" ? 2 : 10,
      };
      if (meetingVideoData.roleID === 2) {
        dispatch(maxParticipantVideoCallPanel(true));
      } else {
        dispatch(videoIconOrButtonState(true));
        let data = {
          MeetingId: Number(currentMeetingID),
          VideoCallURL: String(currentMeetingVideoURL),
          IsMuted: false,
          HideVideo: false,
        };
        dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
      }
      console.log(meetingVideoData, "meetingVideoDatameetingVideoData");
      localStorage.setItem(
        "meetingVideoDetails",
        JSON.stringify(meetingVideoData)
      );
    }

    // let Data = {
    //   VideoCallURL: currentMeetingVideoURL,
    // };
    // dispatch(
    //   FetchMeetingURLApi(
    //     Data,
    //     navigate,
    //     t,
    //     currentUserID,
    //     currentOrganization,
    //     0,
    //     meetingDetails.MeetingTitle,
    //     advanceMeetingModalID
    //   )
    // );
    //   localStorage.setItem("meetingTitle", meetingDetails.MeetingTitle);
    // } else if (activeCall === true && isMeeting === false) {
    //   setInitiateVideoModalOto(true);
    //   dispatch(callRequestReceivedMQTT({}, ""));
    // }
  };

  const handleExpandToNormal = () => {
    dispatch(normalHostVideoCallPanel(true));
  };

  const handleExpandToMax = () => {
    dispatch(maxHostVideoCallPanel(true)); // Set Maximize flag to true
  };

  const handleExpandToParticipantMax = () => {
    dispatch(maxParticipantVideoCallPanel(true)); // Set Maximize flag to true
  };

  const handleExpandToNormalPanelParticipant = () => {
    dispatch(normalParticipantVideoCallPanel(true));
  };

  const copyToClipboardd = () => {
    let MeetingData = getAllMeetingDetails.advanceMeetingDetails;
    if (MeetingData.isVideo === true) {
      let data = {
        MeetingId: Number(advanceMeetingModalID),
      };
      dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
    }
    showMessage(t("Generating-meeting-link"), "error", setOpen);
  };

  const groupChatInitiation = (data) => {
    if (
      data.TalkGroupID !== 0 &&
      AllUserChats.AllUserChatsData !== undefined &&
      AllUserChats.AllUserChatsData !== null &&
      AllUserChats.AllUserChatsData.length !== 0
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
        GroupID: data.TalkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(GetAllUsers(navigate, parseInt(userID), currentOrganization, t));

      let allChatMessages = AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.TalkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", data.TalkGroupID);
    }
  };

  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-data-available") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== undefined
    ) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(CleareMessegeNewMeeting());
      dispatch(ClearResponseMessageGuest());
    } else {
      dispatch(CleareMessegeNewMeeting());
      dispatch(ClearResponseMessageGuest());
    }
  }, [ResponseMessage]);

  const handleClickEndMeeting = useCallback(async () => {
    let endMeetingRequest = {
      MeetingID: Number(advanceMeetingModalID),
      StatusID: 9,
    };
    await dispatch(
      UpdateOrganizersMeeting(
        false,
        navigate,
        t,
        4,
        endMeetingRequest,
        setEditorRole,
        setAdvanceMeetingModalID,
        setDataroomMapFolderId,
        setViewAdvanceMeetingModal,
        "",
        "",
        "",
        "",
        "",
        setEndMeetingConfirmationModal
      )
    );
  }, []);

  return (
    <>
      <section>
        {meetingStatus === 10 && (
          <Row className='mt-3'>
            <Col lg={12} md={12} sm={12} className='d-flex justify-content-end'>
              {Number(editorRole.status) === 10 &&
              editorRole.role === "Organizer" ? (
                <>
                  <Button
                    text={t("End-meeting")}
                    className={styles["LeaveMeetinButton"]}
                    onClick={() => {
                      console.log("end meeting chaek");
                      setEndMeetingConfirmationModal(true);
                    }}
                  />
                </>
              ) : null}
            </Col>
          </Row>
        )}

        <Row className='mt-4'>
          <Col
            lg={12}
            md={12}
            sm={12}
            className={styles["ScrollerMeeting_Active"]}>
            <Row className={meetingStatus === 10 ? "mt-4" : ""}>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Heading_Gray_meeting"]}>
                  {meetingDetails.MeetingType?.Type}{" "}
                  {meetingDetails.Location === "" ? "" : <>|</>}{" "}
                  {meetingDetails.Location}
                </span>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["MeetingTitle_Heading"]}>
                  {meetingDetails.MeetingTitle}
                </span>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["ParaGraph_SavedMeeting"]}>
                  {meetingDetails.Description}
                </span>
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col lg={5} md={5} sm={5}>
                <Row className='mt-1'>
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
                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Scedule_OnHeading"]}>
                      {t("Scheduled-on")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  {rows.length > 0 &&
                    rows.map((data, index) => {
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
                    className='d-flex align-items-center gap-1'>
                    {meetingDetails.groupChat && (
                      <img
                        src={Messegeblue}
                        height='20.44px'
                        width='25.68px'
                        alt=''
                        onClick={() => groupChatInitiation(meetingDetails)}
                        className='cursor-pointer mx-2'
                      />
                    )}
                    {meetingDetails.IsVideoCall && (
                      <>
                        {editorRole.status === "10" ||
                        editorRole.status === 10 ? (
                          <>
                            {" "}
                            <Button
                              icon={<img src={CopyLinkBtn} />}
                              text={t("Copy-invite-link")}
                              className={styles["CopyLinkButton"]}
                              onClick={() => copyToClipboardd()}
                            />
                            {!MaximizeHostVideoFlag && !NormalHostVideoFlag && (
                              <Button
                                disableBtn={
                                  enableDisableVideoState ? true : false
                                }
                                text='Join Video Call'
                                className='JoinMeetingButton'
                                onClick={joinMeetingCall}
                              />
                            )}
                            {/* Max Component */}
                            {MaximizeHostVideoFlag && (
                              <MaxHostVideoCallComponent />
                            )}
                            {NormalHostVideoFlag && (
                              <NormalHostVideoCallComponent />
                            )}
                            {maximizeParticipantVideoFlag && (
                              <ParticipantVideoCallComponent />
                            )}
                            {normalParticipantVideoFlag && (
                              <NormalParticipantVideoComponent />
                            )}
                            {maxParticipantVideoDeniedFlag && (
                              <MaxParticipantVideoDeniedComponent />
                            )}
                            {maxParticipantVideoRemovedFlag && (
                              <MaxParticipantVideoRemovedComponent />
                            )}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Button
                              title={t("The-meeting-has-ended")}
                              icon={<img src={CopyLinkBtn} />}
                              text={t("Copy-invite-link")}
                              className={`${
                                styles["CopyLinkButton_Disabled"]
                              } ${"grayScaled"}`}
                            />
                            <Button
                              text={t("Join-video-call")}
                              className={`${
                                styles["JoinMeetingButton"]
                              } ${"grayScaled"} `}
                            />
                          </>
                        )}
                      </>
                    )}
                  </Col>
                </Row>
                <Row className='mt-2'>
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
                <Row className='mt-3'>
                  <Col lg={6} md={6} sm={6}>
                    <Row className='mt-2'>
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
                    <Row className='mt-2'>
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
        <Row className='mt-2'>
          <Col
            lg={12}
            md={12}
            sm={12}
            className='d-flex justify-content-end gap-2'>
            <Button
              text={t("Back")}
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
        {
          <EndMeetingConfirmationModal
            handleClickContinue={handleClickEndMeeting}
            handleClickDiscard={() => setEndMeetingConfirmationModal(false)}
          />
        }
        {cancelModalView && (
          <CancelButtonModal
            setCancelModalView={setCancelModalView}
            cancelModalView={cancelModalView}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
            setMeetingDetails={setmeetingDetails}
            setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          />
        )}
        <Notification open={open} setOpen={setOpen} />
      </section>

      <Modal
        show={initiateVideoModalOto}
        onHide={() => {
          setInitiateVideoModalOto(false);
        }}
        setShow={setInitiateVideoModalOto}
        modalFooterClassName='d-none'
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
              <Row className='mt-3 mb-4'>
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className='d-flex justify-content-center gap-2'>
                  <Button
                    text={
                      callerID === currentUserID || callerID === 0
                        ? t("End Host")
                        : callerID !== currentUserID
                        ? t("End Participant")
                        : null
                    }
                    className='leave-meeting-options__btn leave-meeting-red-button'
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
                    className='leave-meeting-options__btn leave-meeting-gray-button'
                    onClick={() => setInitiateVideoModalOto(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />
      {nonMeetingVideo && <NonMeetingVideoModal />}
    </>
  );
};

export default ViewMeetingDetails;
