import TalkChat2 from "../../components/layout/talk/talk-chat/talkChatBox/chat";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar, Talk } from "../../components/layout";
import CancelButtonModal from "../pages/meeting/closeMeetingTab/CancelModal";
import {
  Button,
  Modal,
  Notification,
  NotificationBar,
  GuestJoinRequest,
} from "../../components/elements";
import Header2 from "../../components/layout/header2/Header2";
import { ConfigProvider, Layout } from "antd";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_US";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setRecentActivityDataNotification } from "../../store/actions/GetUserSetting";
import VideoCallScreen from "../../components/layout/talk/videoCallScreen/VideoCallScreen";
import VideoMaxIncoming from "../../components/layout/talk/videoCallScreen/videoCallBody/VideoMaxIncoming";
import {
  incomingVideoCallFlag,
  videoOutgoingCallFlag,
  normalizeVideoPanelFlag,
  videoChatMessagesFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  guestJoinPopup,
  participantWaitingList,
  participantAcceptandReject,
  guestLeaveVideoMeeting,
  participanMuteUnMuteMeeting,
  participanRaisedUnRaisedHand,
  participantHideUnhideVideo,
  getParticipantsNewJoin,
  participantVideoNavigationScreen,
  maxParticipantVideoCallPanel,
  getVideoUrlForParticipant,
  setAudioControlForParticipant,
  setVideoControlForParticipant,
  setRaisedUnRaisedParticiant,
  checkHostNow,
  makeHostNow,
  maxParticipantVideoDenied,
  maxParticipantVideoRemoved,
  participantLeaveVideoMeeting,
} from "../../store/actions/VideoFeature_actions";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  meetingCount,
  setMQTTRequestUpcomingEvents,
  mqttCurrentMeetingEnded,
  GetUpcomingEventsForMQTT,
  createGroupMeeting,
  createCommitteeMeeting,
} from "../../store/actions/GetMeetingUserId";
import {
  mqttInsertOtoMessage,
  mqttInsertPrivateGroupMessage,
  mqttBlockUser,
  mqttUnblockUser,
  mqttStarMessage,
  mqttUnstarMessage,
  mqttGroupCreated,
  mqttGroupUpdated,
  mqttInsertBroadcastMessage,
  mqttUnreadMessageCount,
  mqttMessageStatusUpdate,
  UpdateMessageAcknowledgement,
  mqttMessageDeleted,
  GetAllUserChats,
  mqttGroupLeft,
  lastMessageDeletion,
} from "../../store/actions/Talk_action";
import {
  incomingVideoCallMQTT,
  videoCallAccepted,
  VideoCallResponse,
  CallRequestReceived,
  callRequestReceivedMQTT,
  GetUserMissedCallCount,
  missedCallCount,
  LeaveCall,
} from "../../store/actions/VideoMain_actions";
import Helper from "../../commen/functions/history_logout";
import IconMetroAttachment from "../../assets/images/newElements/Icon metro-attachment.svg";
import VerificationFailedIcon from "../../assets/images/failed.png";
import { GetPendingApprovalsCount } from "../../store/actions/Minutes_action";
import {
  createTaskCommitteeMQTT,
  createTaskGroupMQTT,
  createTaskMeetingMQTT,
  getDashboardTaskCountMQTT,
  setTodoListActivityData,
  setTodoStatusDataFormSocket,
  TodoCounter,
} from "../../store/actions/ToDoList_action";
import {
  meetingStatusProposedMqtt,
  meetingStatusPublishedMqtt,
  meetingNotConductedMQTT,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  meetingParticipantRemoved,
  meetingParticipantAdded,
  LeaveMeetingVideo,
  meetingReminderNotifcation,
  searchNewUserMeeting,
  getDashboardMeetingCountMQTT,
} from "../../store/actions/NewMeetingActions";
import {
  meetingAgendaStartedMQTT,
  meetingAgendaEndedMQTT,
  meetingAgendaUpdatedMQTT,
} from "../../store/actions/MeetingAgenda_action";
import {
  deleteCommentsMQTT,
  postComments,
} from "../../store/actions/Post_AssigneeComments";
import "./Dashboard.css";
import {
  realtimeGroupStatusResponse,
  realtimeGroupResponse,
  removeGroupMemberMQTT,
} from "../../store/actions/Groups_actions";
import {
  realtimeCommitteeResponse,
  realtimeCommitteeStatusResponse,
  removeCommitteeMemberMQTT,
} from "../../store/actions/Committee_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import { useTranslation } from "react-i18next";
import {
  createPollCommitteesMQTT,
  createPollGroupsMQTT,
  createPollMeetingMQTT,
  deletePollsMQTT,
  notifyPollingSocket,
} from "../../store/actions/Polls_actions";
import {
  changeMQTTJSONOne,
  changeMQQTTJSONTwo,
} from "../../commen/functions/MQTTJson";
import {
  resolutionMQTTCancelled,
  resolutionMQTTClosed,
  resolutionMQTTCreate,
} from "../../store/actions/Resolution_actions";
import {
  createGoogleEventMQTT,
  createMicrosftEventMQTT,
  deleteGoogleEventMQTT,
  deleteMicrosftEventMQTT,
  updateGoogletEventMQTT,
  updateMicrosftEventMQTT,
} from "../../store/actions/GetDataForCalendar";
import { userLogOutApiFunc } from "../../store/actions/Auth_Sign_Out";
import {
  checkFeatureIDAvailability,
  getLocalStorageItemNonActiveCheck,
} from "../../commen/functions/utils";
import { Col, Row } from "react-bootstrap";
import InternetConnectivityModal from "../pages/UserMangement/ModalsUserManagement/InternetConnectivityModal/InternetConnectivityModal";
import { InsternetDisconnectModal } from "../../store/actions/UserMangementModalActions";
import {
  fileRemoveMQTT,
  fileSharedMQTT,
  folderRemoveMQTT,
  folderSharedMQTT,
} from "../../store/actions/DataRoom_actions";
import MobileAppPopUpModal from "../pages/UserMangement/ModalsUserManagement/MobileAppPopUpModal/MobileAppPopUpModal";
import LeaveVideoIntimationModal from "../../components/layout/talk/videoCallScreen/LeaveVideoIntimationModal/LeaveVideoIntimationModal";
import {
  admitGuestUserRequest,
  muteUnMuteByHost,
  raiseUnRaisedHandMainApi,
  setVoiceControleGuest,
} from "../../store/actions/Guest_Video";
import { MeetingContext } from "../../context/MeetingContext";
import {
  DiskusGlobalDataIsReadFlag,
  DiskusGlobalUnreadNotificationCount,
} from "../../store/actions/UpdateUserNotificationSetting";

const Dashboard = () => {
  const location = useLocation();

  const { Sider, Content } = Layout;

  const navigate = useNavigate();
  //Translation
  const { t } = useTranslation();

  const dispatch = useDispatch();

  let i18nextLng = localStorage.getItem("i18nextLng");

  // let createrID = 5;
  let userGUID = localStorage.getItem("userGUID");

  let currentMeetingVideoID = localStorage.getItem("acceptedRoomID");

  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

  let createrID = localStorage.getItem("userID");

  let currentOrganization = localStorage.getItem("organizationID");

  let currentUserName = localStorage.getItem("name");

  const { editorRole } = useContext(MeetingContext);

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );
  // For Participant Raise Un Raised Hand
  const raisedUnRaisedParticipant = useSelector(
    (state) => state.videoFeatureReducer.raisedUnRaisedParticipant
  );

  const cancelModalMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  );
  const isInternetDisconnectModalVisible = useSelector(
    (state) => state.UserManagementModals.internetDisconnectModal
  );
  const mobileAppPopUp = useSelector(
    (state) => state.UserManagementModals.mobileAppPopUp
  );
  const IncomingVideoCallFlagReducer = useSelector(
    (state) => state.videoFeatureReducer.IncomingVideoCallFlag
  );
  const NormalizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalizeVideoFlag
  );
  const MaximizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeVideoFlag
  );
  const ShowGuestPopup = useSelector(
    (state) => state.videoFeatureReducer.ShowGuestPopup
  );
  const VideoChatMessagesFlagReducer = useSelector(
    (state) => state.videoFeatureReducer.VideoChatMessagesFlag
  );
  const MinimizeVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MinimizeVideoFlag
  );
  const MeetingStatusEnded = useSelector(
    (state) => state.meetingIdReducer.MeetingStatusEnded
  );
  const waitingParticipantsList = useSelector(
    (state) => state.videoFeatureReducer.waitingParticipantsList
  );
  const showInitimationMessegeModalLeaveVideoMeeting = useSelector(
    (state) => state.VideoMainReducer.LeaveVideoIntimationMessegeGlobalState
  );

  const videoControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.videoControlForParticipant
  );

  const audioControlForParticipant = useSelector(
    (state) => state.videoFeatureReducer.audioControlForParticipant
  );

  const getNewParticipantsMeetingJoin = useSelector(
    (state) => state.videoFeatureReducer.getNewParticipantsMeetingJoin
  );

  const getAllParticipantMain = useSelector(
    (state) => state.videoFeatureReducer.getAllParticipantMain
  );
  console.log(
    getAllParticipantMain,
    "getAllParticipantMaingetAllParticipantMain"
  );

  const getVideoParticpantListandWaitingList = useSelector(
    (state) => state.videoFeatureReducer.getVideoParticpantListandWaitingList
  );

  const [checkInternet, setCheckInternet] = useState(navigator);

  // for real time Notification
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  // for sub menus Icons

  //State For Meeting Data
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [activateBlur, setActivateBlur] = useState(false);
  const [notificationID, setNotificationID] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);
  const [handsRaisedCount, setHandsRaisedCount] = useState(0);
  const [participantsList, setParticipantsList] = useState([]);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  let Blur = localStorage.getItem("blur");

  let newClient = Helper.socket;
  // for close the realtime Notification bar
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };
  function checkCallStatus(data) {
    return !data.some(
      (item) => item.CallStatus === "Accepted" || item.CallStatus === "ringing"
    );
  }
  const closeModal = () => {
    localStorage.removeItem("packageFeatureIDs");
    localStorage.removeItem("LocalUserRoutes");
    localStorage.removeItem("VERIFICATION");

    dispatch(userLogOutApiFunc(navigate, t));
  };

  useEffect(() => {
    if (checkInternet.onLine) {
      dispatch(InsternetDisconnectModal(false));
    } else {
      dispatch(InsternetDisconnectModal(true));
    }
  }, [checkInternet.onLine]);

  const onMessageArrived = (msg) => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = JSON.parse(msg.payloadString);
    console.log(data, "MQTT onMessageArrived");
    try {
      if (data.action?.toLowerCase() === "Meeting".toLowerCase()) {
        if (data.action && data.payload) {
          try {
            if (
              data?.payload?.message.toLowerCase() ===
              "NEW_MEETING_CREATION".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(allMeetingsSocket(data.payload.meeting));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_EDITED_HOST".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_EDITED_HOST"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(allMeetingsSocket(data.payload.meeting));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_STARTED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_STARTED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(getMeetingStatusfromSocket(data.payload));
            } else if (
              data.payload.message
                .toLowerCase()
                .includes("MEETING_STATUS_EDITED_END".toLowerCase())
            ) {
              try {
                let meetingVideoID = Number(
                  localStorage.getItem("meetingVideoID")
                );

                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MEETING_STATUS_EDITED_END"),
                      "[Meeting Title]",
                      data.payload.meetingTitle.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
                if (
                  Number(meetingVideoID) ===
                  Number(data?.payload?.meeting?.pK_MDID)
                ) {
                  let newName = localStorage.getItem("name");
                  let getMeetingParticipants =
                    data.payload.meeting.meetingAttendees.filter(
                      (attendeeData) =>
                        attendeeData.meetingAttendeeRole.pK_MARID !== 1
                    );
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(maximizeVideoPanelFlag(false));
                  dispatch(minimizeVideoPanelFlag(false));
                  localStorage.setItem("activeCall", false);
                  localStorage.setItem("isMeeting", false);
                  localStorage.setItem("meetingTitle", "");
                  localStorage.setItem("acceptedRecipientID", 0);
                  localStorage.setItem("acceptedRoomID", 0);
                  localStorage.setItem("activeRoomID", 0);
                  localStorage.setItem("meetingVideoID", 0);
                  localStorage.setItem("MicOff", true);
                  localStorage.setItem("VidOff", true);
                  let Data = {
                    RoomID: currentMeetingVideoID,
                    UserGUID: userGUID,
                    Name: String(newName),
                  };
                  dispatch(LeaveMeetingVideo(Data, navigate, t, true));
                  if (getMeetingParticipants.length > 0) {
                    let userID = localStorage.getItem("userID");
                    let meetingpageRow =
                      localStorage.getItem("MeetingPageRows") || 30;
                    let meetingPageCurrent =
                      localStorage.getItem("MeetingPageCurrent") || 1;
                    let searchData = {
                      Date: "",
                      Title: "",
                      HostName: "",
                      UserID: Number(userID),
                      PageNumber: Number(meetingPageCurrent),
                      Length: Number(meetingpageRow),
                      PublishedMeetings: true,
                    };
                    dispatch(searchNewUserMeeting(navigate, searchData, t));
                  }
                }

                dispatch(mqttCurrentMeetingEnded(data.payload));
              } catch (error) {
                console.log(error);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_CANCELLED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_CANCELLED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }

              dispatch(getMeetingStatusfromSocket(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_ADMIN".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_ADMIN"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(getMeetingStatusfromSocket(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_UPCOMING_EVENTS".toLowerCase()
            ) {
              dispatch(
                setMQTTRequestUpcomingEvents(data.payload.upcomingEvents[0])
              );
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PROPOSED".toLowerCase()
            ) {
              dispatch(meetingStatusProposedMqtt(data.payload.meeting));
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_PROPOSED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_PUBLISHED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              let newMeetting = {
                ...data.payload.meeting,
                talkGroupID: data.payload.talkGroupID,
              };
              dispatch(meetingStatusPublishedMqtt(newMeetting));
              setNotificationID(id);
            } else if (
              data.payload.message.toLowerCase() ===
              "AGENDA_VOTING_STARTED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_STARTED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaStartedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "AGENDA_VOTING_ENDED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("AGENDA_VOTING_ENDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaEndedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETING_AGENDA_ADDED".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: t("NEW_MEETING_AGENDA_ADDED"),
                });
                setNotificationID(id);
              }
              dispatch(meetingAgendaUpdatedMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETINGS_COUNT".toLowerCase()
            ) {
              dispatch(getDashboardMeetingCountMQTT(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED_GROUP".toLowerCase()
            ) {
              try {
                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MEETING_STATUS_EDITED_PUBLISHED"),
                      "[Meeting Title]",
                      data.payload.meetingTitle.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
                dispatch(createGroupMeeting(data.payload));
              } catch (error) {
                console.log(error);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_STATUS_EDITED_PUBLISHED_COMMITTEE".toLowerCase()
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("MEETING_STATUS_EDITED_PUBLISHED"),
                    "[Meeting Title]",
                    data.payload.meetingTitle.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(createCommitteeMeeting(data.payload));
            } else if (
              data.payload.message?.toLowerCase() ===
              "NEW_MEETING_AGENDA_CONTRIBUTOR_ADDED".toLowerCase()
            ) {
              dispatch(meetingAgendaContributorAdded(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes(
                  "NEW_MEETING_AGENDA_CONTRIBUTOR_DELETED".toLowerCase()
                )
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_AGENDA_CONTRIBUTOR_DELETED"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }

              dispatch(meetingAgendaContributorRemoved(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes("NEW_MEETING_ORGANIZER_ADDED".toLowerCase())
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(meetingOrganizerAdded(data.payload));
            } else if (
              data.payload.message
                ?.toLowerCase()
                .includes("MEETING_ORGANIZER_DELETED".toLowerCase())
            ) {
              if (data.viewable) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: changeMQTTJSONOne(
                    t("NEW_MEETING_CREATION"),
                    "[Place holder]",
                    data.payload.title.substring(0, 100)
                  ),
                });
                setNotificationID(id);
              }
              dispatch(meetingOrganizerRemoved(data.payload));
            } else if (
              data?.payload?.message?.toLowerCase() ===
              "MeetingNotConductedNotification".toLowerCase()
            ) {
              try {
                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MEETING_STATUS_EDITED_NOTCONDUCTED"),
                      "[Meeting Title]",
                      data.payload.meetingTitle.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
                dispatch(meetingNotConductedMQTT(data.payload));
              } catch (error) {
                console.log(
                  error,
                  "MeetingReminderNotificationMeetingReminderNotification"
                );
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_GUEST_JOIN_REQUEST".toLowerCase()
            ) {
              dispatch(participantWaitingList(data.payload));
              dispatch(admitGuestUserRequest(data.payload));
              dispatch(guestJoinPopup(true));
              // if (data.viewable) {
              //   setNotification({
              //     ...notification,
              //     notificationShow: true,
              //     message: changeMQTTJSONOne(
              //       t("MeetingReminderNotification"),
              //       "[Meeting Title]",
              //       data.payload.title.substring(0, 100)
              //     ),
              //   });
              //   setNotificationID(id);
              // }
            } else if (
              //when Participant or attendee send Request to Host
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_PARTICIPANT_JOIN_REQUEST".toLowerCase()
            ) {
              let isMeetingVideo = JSON.parse(
                localStorage.getItem("isMeetingVideo")
              );

              if (isMeetingVideo) {
                if (data.payload.isGuest) {
                  dispatch(admitGuestUserRequest(data.payload));
                } else {
                  dispatch(participantWaitingList(data.payload));
                }
                dispatch(guestJoinPopup(true));
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "VIDEO_PARTICIPANT_LEFT".toLowerCase()
            ) {
              console.log(data.payload, "mqtt");
              console.log(waitingParticipantsList, "mqtt");
              if (data.payload.isGuest) {
                dispatch(guestLeaveVideoMeeting(data.payload.uid));
              } else {
                dispatch(participantLeaveVideoMeeting(data.payload.uid)); // Dispatch for participants
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MUTE_UNMUTE_AUDIO_BY_PARTICIPANT".toLowerCase()
            ) {
              dispatch(participanMuteUnMuteMeeting(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "PARTICIPANT_RAISE_UNRAISE_HAND".toLowerCase()
            ) {
              dispatch(participanRaisedUnRaisedHand(data.payload));
              if (data.payload.isHandRaised === true) {
                dispatch(setRaisedUnRaisedParticiant(true));
              } else {
                dispatch(setRaisedUnRaisedParticiant(false));
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "HIDE_UNHIDE_VIDEO_BY_PARTICIPANT".toLowerCase()
            ) {
              console.log(data.payload, "Partiicpantdatapayload");
              dispatch(participantHideUnhideVideo(data.payload));
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_NEW_PARTICIPANTS_JOINED".toLowerCase()
            ) {
              localStorage.setItem(
                "isHost",
                data.payload.newParticipants.isHost
              );
              dispatch(getParticipantsNewJoin(data.payload.newParticipants));
              console.log(data.payload, "JOINEDJOINEDJOINED");
            } else if (
              data.payload.message.toLowerCase() ===
              "REMOVED_FROM_MEETING".toLowerCase()
            ) {
              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: true,
              };
              dispatch(makeHostNow(meetingHost));
              localStorage.setItem("isMeeting", false);
              localStorage.setItem("isMeetingVideo", false);
              localStorage.removeItem("refinedVideoUrl");
              localStorage.setItem("refinedVideoGiven", false);
              localStorage.setItem("isWebCamEnabled", false);
              localStorage.setItem("isMicEnabled", false);
              dispatch(setAudioControlForParticipant(false));
              dispatch(setVideoControlForParticipant(false));

              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );

              dispatch(maximizeVideoPanelFlag(false));
              dispatch(maxParticipantVideoRemoved(true));
              // Participant room Id and usrrGuid
              let participantRoomIds =
                localStorage.getItem("participantRoomId");
              let participantUID = localStorage.getItem("participantUID");
              let newName = localStorage.getItem("name");
              let Data = {
                RoomID: String(participantRoomIds),
                UserGUID: String(participantUID),
                Name: String(newName),
              };

              dispatch(setRaisedUnRaisedParticiant(false));

              dispatch(LeaveMeetingVideo(Data, navigate, t));
            } else if (
              data.payload.message.toLowerCase() ===
              "MUTE_UNMUTE_PARTICIPANT".toLowerCase()
            ) {
              if (data.payload.isForAll) {
                // Gather all participant UIDs
                const allUids = getVideoParticpantListandWaitingList.map(
                  (participant) => participant.guid
                );

                console.log(allUids, "allUidsallUids");

                // Dispatch action with all UIDs
                dispatch(
                  participanMuteUnMuteMeeting({
                    isMuted: data.payload.isMuted,
                    isForAll: true,
                    uids: allUids, // Include all participant UIDs
                  })
                );
                let isGuid = localStorage.getItem("isGuid");

                if (data.payload.uid === isGuid) {
                  dispatch(setAudioControlForParticipant(data.payload.isMuted)); // Update global state to mute all
                }
              } else {
                // Handle individual mute/unmute
                dispatch(participanMuteUnMuteMeeting(data.payload));
                let isGuid = localStorage.getItem("isGuid");

                if (data.payload.uid === isGuid) {
                  if (data.payload.isMuted === true) {
                    dispatch(
                      setAudioControlForParticipant(data.payload.isMuted)
                    );
                  } else {
                    dispatch(
                      setAudioControlForParticipant(data.payload.isMuted)
                    );
                  }
                }
              }

              console.log(data.payload, "guestDataGuestData");
            } else if (
              data.payload.message.toLowerCase() ===
              "HIDE_UNHIDE_PARTICIPANT_VIDEO".toLowerCase()
            ) {
              //  dispatch(hideUnHideVideoByHost(data.payload));
              dispatch(participantHideUnhideVideo(data.payload));
              let isGuid = localStorage.getItem("isGuid");

              if (data.payload.uid === isGuid) {
                if (data.payload.isVideoHidden === true) {
                  dispatch(setVideoControlForParticipant(true));
                } else {
                  dispatch(setVideoControlForParticipant(false));
                }
              }

              console.log(data.payload, "guestDataGuestDataVideo");
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_JOIN_REQUEST_REJECTED".toLowerCase()
            ) {
              let currentMeetingID = Number(
                localStorage.getItem("currentMeetingID")
              );
              let userIDCurrent = Number(localStorage.getItem("userID"));

              console.log(
                "Dispatching PARTICIPANT_VIDEO_SCREEN_NAVIGATION with 3",
                data.payload
              );
              if (
                Number(currentMeetingID) === Number(data.payload.meetingID) &&
                Number(userIDCurrent) === Number(data.payload.userID)
              ) {
                console.log(
                  "Dispatching PARTICIPANT_VIDEO_SCREEN_NAVIGATION with 3",
                  data.payload
                );
                const stopStreams = () => {
                  console.log("Stopping webcam and microphone...");

                  // Stop video stream
                  const isVideoEnabled = JSON.parse(
                    sessionStorage.getItem("streamOnOff")
                  );
                  if (isVideoEnabled) {
                    try {
                      const videoStreamId =
                        sessionStorage.getItem("videoStreamId");
                      if (videoStreamId) {
                        navigator.mediaDevices
                          .getUserMedia({ video: true })
                          .then((videoStream) => {
                            videoStream
                              .getTracks()
                              .forEach((track) => track.stop());
                            console.log(
                              "Video stream stopped.streamstream",
                              videoStreamId
                            );
                            sessionStorage.setItem(
                              "streamOnOff",
                              JSON.stringify(false)
                            );
                            sessionStorage.removeItem("videoStreamId");
                          })
                          .catch((error) =>
                            console.error("Error stopping video:", error)
                          );
                      }
                    } catch (error) {
                      console.error("Error stopping video stream:", error);
                    }
                  }

                  // Stop audio stream
                  const isAudioEnabled = JSON.parse(
                    sessionStorage.getItem("audioStreamOnOff")
                  );
                  if (isAudioEnabled) {
                    try {
                      const audioStreamId =
                        sessionStorage.getItem("audioStreamId");
                      if (audioStreamId) {
                        navigator.mediaDevices
                          .getUserMedia({ audio: true })
                          .then((audioStream) => {
                            audioStream
                              .getTracks()
                              .forEach((track) => track.stop());
                            console.log(
                              "Video stream stopped.streamstream",
                              audioStreamId
                            );
                            console.log("Audio stream stopped.");
                            sessionStorage.setItem(
                              "audioStreamOnOff",
                              JSON.stringify(false)
                            );
                            sessionStorage.removeItem("audioStreamId");
                          })
                          .catch((error) =>
                            console.error("Error stopping audio:", error)
                          );
                      }
                    } catch (error) {
                      console.error("Error stopping audio stream:", error);
                    }
                  }
                };
                stopStreams();

                dispatch(maxParticipantVideoCallPanel(false));
                dispatch(maxParticipantVideoDenied(true));
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_VIDEO_JOIN_REQUEST_APPROVED".toLowerCase()
            ) {
              dispatch(maxParticipantVideoCallPanel(false));
              dispatch(maximizeVideoPanelFlag(true));
              localStorage.setItem("CallType", 2);
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("activeCall", true);
              localStorage.setItem("acceptedRecipientID", data.payload.userID);
              localStorage.setItem("isMeetingVideo", true);
              localStorage.setItem(
                "currentMeetingVideoUrl",
                data.payload.videoUrl
              );
              if (data?.payload?.videoUrl) {
                // Fetch values from localStorage and Redux
                console.log("isMeetingVideo", audioControlForParticipant);
                console.log("isMeetingVideo", videoControlForParticipant);
                let videoControlForParticipantLoacl = JSON.parse(
                  localStorage.getItem("isWebCamEnabled")
                );
                let audioControlForParticipantLocal = JSON.parse(
                  localStorage.getItem("isMicEnabled")
                );
                dispatch(
                  setAudioControlForParticipant(audioControlForParticipantLocal)
                );
                dispatch(
                  setVideoControlForParticipant(videoControlForParticipantLoacl)
                );

                const currentParticipantUser = localStorage.getItem("name");
                // Refine the URL by replacing placeholders
                const refinedUrl = data.payload.videoUrl
                  .replace("$ParticipantFullName$", currentParticipantUser)
                  .replace(
                    "$IsMute$",
                    audioControlForParticipantLocal.toString()
                  )
                  .replace(
                    "$IsHideCamera$",
                    videoControlForParticipantLoacl.toString()
                  );

                // Store the refined URL in localStorage
                localStorage.setItem("refinedVideoUrl", refinedUrl);
                localStorage.setItem("refinedVideoGiven", true);
              } else {
                console.error("Invalid data or missing videoUrl in payload");
              }

              dispatch(getVideoUrlForParticipant(data.payload.videoUrl));
              console.log(data.payload.videoUrl, "hahahahahahhassddsd");
              localStorage.setItem("participantRoomId", data.payload.roomID);
              localStorage.setItem("participantUID", data.payload.uid);
              localStorage.setItem("activeRoomID", data.payload.roomID);
              // dispatch(participantVideoNavigationScreen(3));
            } else if (
              data.payload.message.toLowerCase() ===
              "TRANSFER_HOST_TO_PARTICIPANT_NOTIFY".toLowerCase()
            ) {
              console.log("New Host Information", data.payload);
              localStorage.setItem(
                "isHost",
                JSON.stringify(data.payload.newHost.isHost)
              );
              const newHostUserID = data.payload.newHost.userID;

              dispatch(checkHostNow(newHostUserID));
              localStorage.setItem("currentHostUserID", newHostUserID);
              console.log("Host ID set in localStorage: ", newHostUserID);
            } else if (
              data.payload.message.toLowerCase() ===
              "TRANSFER_HOST_TO_PARTICIPANT".toLowerCase()
            ) {
              const meetingHost = {
                isHost: true,
                isHostId: Number(localStorage.getItem("userID")),
                isDashboardVideo: true,
              };
              dispatch(makeHostNow(meetingHost));

              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
            } else if (
              data?.payload?.message?.toLowerCase() ===
              "MeetingReminderNotification".toLowerCase()
            ) {
              try {
                dispatch(meetingReminderNotifcation(data.payload));

                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MeetingReminderNotification"),
                      "[Meeting Title]",
                      data.payload.calenderEvents.title.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
              } catch (error) {
                console.log(
                  error,
                  "MeetingReminderNotificationMeetingReminderNotification"
                );
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "MEETING_PARTICIPANT_DELETED".toLowerCase()
            ) {
              dispatch(meetingParticipantRemoved(data.payload));

              if (data.viewable) {
                setNotificationID(id);
              }
            } else if (
              data.payload.message.toLowerCase() ===
              "NEW_MEETING_PARTICIPANT_ADDED".toLowerCase()
            ) {
              if (
                Number(data.payload.status) !== 11 &&
                Number(data.payload.status) !== 12
              ) {
                dispatch(meetingParticipantAdded(data.payload));

                if (data.viewable) {
                  setNotification({
                    ...notification,
                    notificationShow: true,
                    message: changeMQTTJSONOne(
                      t("MeetingReminderNotification"),
                      "[Meeting Title]",
                      data.payload.title.substring(0, 100)
                    ),
                  });
                  setNotificationID(id);
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      if (data.action.toLowerCase() === "TODO".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_CREATION".toLowerCase()
        ) {
          dispatch(setTodoListActivityData(data.payload));
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_TODO_CREATION"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "TDOD_STATUS_EDITED".toLowerCase()
        ) {
          dispatch(setTodoStatusDataFormSocket(data.payload));
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("TDOD_STATUS_EDITED"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
          }
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "TDOD_STATUS_DELETED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("TDOD_STATUS_DELETED"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }

          dispatch(setTodoStatusDataFormSocket(data.payload));
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_DELETED".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() === "NEW_TODO_COUNT".toLowerCase()
        ) {
          dispatch(getDashboardTaskCountMQTT(data.payload));
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_DELETION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQQTTJSONTwo(
                t("NEW_COMMENT_DELETION"),
                "[User]",
                data.payload.comment.userName,
                "[Task Title]",
                data.payload.comment.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }
          dispatch(deleteCommentsMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_ADVANCE_MEETING_TODO".toLowerCase())
        ) {
          dispatch(createTaskMeetingMQTT(data.payload));
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_TODO_CREATION"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_GROUP_TODO".toLowerCase())
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_TODO_CREATION"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }
          dispatch(createTaskGroupMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_COMMITTEE_TODO".toLowerCase())
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_TODO_CREATION"),
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
            setNotificationID(id);
          }
          dispatch(createTaskCommitteeMQTT(data.payload));
        }
      }
      if (data.action.toLowerCase() === "COMMENT".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_CREATION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQQTTJSONTwo(
                t("NEW_COMMENT_CREATION"),
                "[User]",
                data.payload.comment.userName,
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
          }
          dispatch(postComments(data.payload.comment));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMENT_DELETION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQQTTJSONTwo(
                t("NEW_COMMENT_DELETION"),
                "[User]",
                data.payload.userName,
                "[Task Title]",
                data.payload.todoTitle.substring(0, 100)
              ),
            });
          }
          dispatch(deleteCommentsMQTT(data.payload));
          setNotificationID(id);
        }
      }
      if (data.action.toLowerCase() === "Notification".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() === "USER_EDITED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("USER_ROLE_EDITED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            if (data.payload.isLoggedOut === true) {
              //Apply Logout API here
              dispatch(userLogOutApiFunc(navigate, t));
            }
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() === "USER_DELETED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("USER_DELETED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            if (data.payload.isLoggedOut === true) {
              //Apply Logout API here
              dispatch(userLogOutApiFunc(navigate, t));
            }
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_CANCELLED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("ORGANIZATION_SUBSCRIPTION_CANCELLED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            navigate("/");
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_DELETED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("ORGANIZATION_DELETED"),
              "[organizationName]",
              data.payload.organizationName
            ),
          });
          setNotificationID(id);
          setTimeout(() => {
            navigate("/");
          }, 4000);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_PROFILE_EDITED".toLowerCase()
        ) {
          setNotification({
            notificationShow: true,
            message: t("USER_PROFILE_EDITED"),
          });
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_TODO_CREATION_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_MEETTING_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_MEETTING_CREATION_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_POLL_PUBLISHED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("NEW_POLL_PUBLISHED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_EXPIRED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("POLL_EXPIRED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_UPDATED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: t("POLL_UPDATED_RECENT_ACTIVITY"),
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "POLL_DELETED_RECENT_ACTIVITY".toLowerCase()
        ) {
          if (data.payload) {
            let data2 = {
              creationDateTime: data.payload.creationDateTime,
              notificationTypes: {
                pK_NTID: data.payload.notificationStatusID,
                description: "The Poll has been deleted",
                icon: "",
              },
              key: 0,
            };
            dispatch(setRecentActivityDataNotification(data2));
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_INACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-subscription-status-has-been-set-to-in-active"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_SUBSCRIPTION_SUSPENDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-subscription-has-been-suspended"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_STATUS_INACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-organization-status-has-been-set-to-in-active"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "ORGANIZATION_STATUS_SUSPENDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: t("Your-organization-status-has-been-suspended"),
            });
          }
          setNotificationID(id);

          if (data.payload.isLoggedOut) {
            setTimeout(() => {
              dispatch(userLogOutApiFunc(navigate, t));
            }, 4000);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATION_RECENT_ACTIVITY".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() ===
          "MEETING_STATUS_EDITED_STARTED".toLowerCase()
        ) {
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_TODO_DELETED_RECENT_ACTIVITY".toLowerCase()
        ) {
        }
      }
      if (data.action.toLowerCase() === "Committee".toLowerCase()) {
        console.log(data.action, "actionactionactionaction");
        if (
          data.payload.message.toLowerCase() ===
          "NEW_COMMITTEE_CREATION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_COMMITTEE_CREATION"),
                "[Committe Title]",
                data.payload.committees.committeesTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Committee ${data.payload.committees.committeesTitle}`,
            });
          }
          dispatch(realtimeCommitteeResponse(data.payload.committees));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_MEMBER_ADDED_IN_COMMITTEE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_MEMBER_ADDED_IN_COMMITTEE"),
                "[Committee Title]",
                data.payload.committees.committeesTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Committee ${data.payload.committees.committeesTitle}`,
            });
          }
          dispatch(realtimeCommitteeResponse(data.payload.committees));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_IN_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("COMMITTTEE_STATUS_EDITED_IN_ACTIVE"),
                "[Committee Title]",
                data.payload.committeeTitle.substring(0, 100)
              ),
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeCommitteeStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_ARCHIVED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("COMMITTTEE_STATUS_EDITED_ARCHIVED"),
                "[Committee Title]",
                data.payload.committeeTitle.substring(0, 100)
              ),
            });
          }
          dispatch(realtimeCommitteeStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "COMMITTTEE_STATUS_EDITED_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("COMMITTTEE_STATUS_EDITED_ACTIVE"),
                "[Committee Title]",
                data.payload.committeeTitle.substring(0, 100)
              ),
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeCommitteeStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MEMBER_REMOVED_FROM_COMMITTEE".toLowerCase()
        ) {
          dispatch(removeCommitteeMemberMQTT(data.payload));
          setNotificationID(id);
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("MEMBER_REMOVED_FROM_COMMITTEE"),
                "[Committee Title]",
                data.payload.committees.committeesTitle.substring(0, 100)
              ),
              // message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
            });
          }
        }
      }
      if (data.action.toLowerCase() === "Group".toLowerCase()) {
        console.log(data.action, "actionactionactionaction");
        if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATION".toLowerCase()
        ) {
          console.log(data.payload.message, "actionactionactionaction");
          console.log(data.viewable, "actionactionactionaction");
          console.log(data.payload, "actionactionactionaction");
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_GROUP_CREATION"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(realtimeGroupResponse(data.payload.groups));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_MEMBER_ADDED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_GROUP_MEMBER_ADDED"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(realtimeGroupResponse(data.payload.groups));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_IN-ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_STATUS_EDITED_IN-ACTIVE"),
                "[Group Title]",
                data.payload.groupTitle.substring(0, 100)
              ),
              // message: `Group ${data.payload.groupTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeGroupStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_ARCHIVED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_STATUS_EDITED_ARCHIVED"),
                "[Group Title]",
                data.payload.groupTitle.substring(0, 100)
              ),
            });
          }
          dispatch(realtimeGroupStatusResponse(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_MEMBER_REMOVED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_MEMBER_REMOVED"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
              // message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
            });
          }
          dispatch(removeGroupMemberMQTT(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "GROUP_STATUS_EDITED_ACTIVE".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("GROUP_STATUS_EDITED_ACTIVE"),
                "[Group Title]",
                data.payload.groupTitle.substring(0, 100)
              ),
              // message: `Group ${data.payload.groupTitle} in which you are a member has been set as In-Active`,
            });
          }
          dispatch(realtimeGroupStatusResponse(data.payload));
          setNotificationID(id);
        }
      }
      if (
        data.action.toLowerCase() === "TALK".toLowerCase() &&
        checkFeatureIDAvailability(3)
      ) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_ONE_TO_ONE_MESSAGE".toLowerCase()
        ) {
          let newMessageData = data.payload.data[0];
          let activeOtoChatID = localStorage.getItem("activeOtoChatID");
          if (data.payload.data[0].senderID !== parseInt(createrID)) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: `You have received a new message from ${data.payload.data[0].senderName}`,
            });
          }
          dispatch(mqttInsertOtoMessage(data.payload));
          setNotificationID(id);
          if (
            data.payload.data[0].senderID !== parseInt(createrID) &&
            (parseInt(activeOtoChatID) !== data.payload.data[0].senderID ||
              parseInt(activeOtoChatID) === 0)
          ) {
            let apiAcknowledgementData = {
              TalkRequest: {
                ChannelID: newMessageData.channelID,
                Chat: {
                  ChatID: newMessageData.senderID,
                  MyID: parseInt(createrID),
                  MessageStatus: "Delivered",
                  SenderID: newMessageData.senderID,
                  MessageID: newMessageData.messageID,
                  ChatType: "O",
                },
              },
            };
            dispatch(
              UpdateMessageAcknowledgement(apiAcknowledgementData, t, navigate)
            );
          } else if (
            data.payload.data[0].senderID !== parseInt(createrID) &&
            (parseInt(activeOtoChatID) === data.payload.data[0].senderID ||
              parseInt(activeOtoChatID) !== 0)
          ) {
            let apiAcknowledgementData = {
              TalkRequest: {
                ChannelID: newMessageData.channelID,
                Chat: {
                  ChatID: newMessageData.senderID,
                  MyID: parseInt(createrID),
                  MessageStatus: "Seen",
                  SenderID: newMessageData.senderID,
                  MessageID: newMessageData.messageID,
                  ChatType: "O",
                },
              },
            };
            dispatch(
              UpdateMessageAcknowledgement(apiAcknowledgementData, t, navigate)
            );
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_MESSAGE".toLowerCase()
        ) {
          if (data.payload.data[0].senderID !== parseInt(createrID)) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: `${data.payload.data[0].senderName} has sent a message in group ${data.payload.data[0].groupName}`,
            });
          }
          dispatch(mqttInsertPrivateGroupMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "USER_IS_BLOCKED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Selected user is blocked",
          });
          dispatch(mqttBlockUser(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_IS_UNBLOCKED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Selected user is Unblocked",
          });
          dispatch(mqttUnblockUser(data.payload));
          setNotificationID(id);
        }
        //
        else if (
          data.payload.message.toLowerCase() === "MESSAGE_FLAGGED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Message Starred",
          });
          dispatch(mqttStarMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MESSAGE_UNFLAGGED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: "Message Unstarred",
          });
          dispatch(mqttUnstarMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `You have been added in Talk Group for ${data.payload.data[0].fullName}`,
          });
          dispatch(mqttGroupCreated(data.payload));

          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "GROUP_MODIFIED".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `Group ${data.payload.data[0].fullName} has updated`,
          });
          dispatch(mqttGroupUpdated(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "UNREAD_MESSAGES_COUNT".toLowerCase()
        ) {
          dispatch(mqttUnreadMessageCount(data.payload));
        } else if (
          data.payload.message.toLowerCase() ===
          "NEW_BROADCAST_MESSAGE".toLowerCase()
        ) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `You have sent a message in broadcast list ${data.payload.data[0].broadcastName}`,
          });
          dispatch(mqttInsertBroadcastMessage(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MESSAGE_DELIVERED".toLowerCase()
        ) {
          dispatch(mqttMessageStatusUpdate(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "MESSAGE_SEEN".toLowerCase()
        ) {
          dispatch(mqttMessageStatusUpdate(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "MESSAGE_DELETED".toLowerCase()
        ) {
          dispatch(mqttMessageDeleted(data.payload));
          setNotification({
            ...notification,
            notificationShow: true,
            message: `Message Deleted`,
          });
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "USER_LEFT_THE_GROUP".toLowerCase()
        ) {
          if (data.senderID === Number(createrID)) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: "You have left the group",
            });
            setNotificationID(id);
            dispatch(mqttGroupLeft(data.payload));
          } else {
            setNotification({
              ...notification,
              notificationShow: true,
              message: data.payload.data[0].notiMsg,
            });
            setNotificationID(id);
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "LAST_MESSAGE_AFTER_DELETION".toLowerCase()
        ) {
          dispatch(lastMessageDeletion(data.payload));
        }
      }
      if (data.action.toLowerCase() === "Polls".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_POLL_PUBLISHED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_POLL_PUBLISHED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }

          dispatch(notifyPollingSocket(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "POLL_UPDATED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("POLL_UPDATED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }
          dispatch(notifyPollingSocket(data.payload));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() === "POLL_EXPIRED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("POLL_EXPIRED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }
          dispatch(notifyPollingSocket(data.payload.polls));
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "PUBLISHED_POLL_DELETED".toLowerCase()
        ) {
          dispatch(deletePollsMQTT(data.payload.polls));
          setNotificationID(id);
          try {
            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("PUBLISHED_POLL_DELETED"),
                  "[Poll Title]",
                  data.payload.pollTitle
                ),
              });
            }
          } catch {}
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_POLL_PUBLISHED_GROUP".toLowerCase())
        ) {
          dispatch(createPollGroupsMQTT(data.payload));
          setNotificationID(id);

          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_POLL_PUBLISHED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_POLL_PUBLISHED_COMMITTEE".toLowerCase())
        ) {
          dispatch(createPollCommitteesMQTT(data.payload));
          setNotificationID(id);

          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_POLL_PUBLISHED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_POLL_PUBLISHED_MEETING".toLowerCase())
        ) {
          dispatch(createPollMeetingMQTT(data.payload));
          setNotificationID(id);

          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_POLL_PUBLISHED"),
                "[Poll Title]",
                data.payload.pollTitle
              ),
            });
          }
        }
      }
      if (data.action.toLowerCase() === "Resolution".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_RESOLUTION_CREATION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_RESOLUTION_CREATION"),
                "[Resolution Title]",
                data.payload.model.resolution.title
              ),
            });
          }
          dispatch(resolutionMQTTCreate(data.payload.model));
        } else if (
          data.payload.message.toLowerCase() ===
          "RESOLUTION_CANCELLED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("RESOLUTION_CANCELLED"),
                "[Resolution Title]",
                data.payload.model.resolution.title
              ),
            });
          }
          dispatch(resolutionMQTTCancelled(data.payload.model));
        } else if (
          data.payload.message.toLowerCase() ===
          "RESOLUTION_CLOSED".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("RESOLUTION_CLOSED"),
                "[Resolution Title]",
                data.payload.model.resolution.title
              ),
            });
          }
          dispatch(resolutionMQTTClosed(data.payload.model));
        }
      }
      if (
        data.action.toLowerCase() === "Video".toLowerCase() &&
        checkFeatureIDAvailability(4)
      ) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_VIDEO_CALL_INITIATED".toLowerCase()
        ) {
          let callStatus = JSON.parse(localStorage.getItem("activeCall"));
          localStorage.setItem("callType", data.payload.callType);
          localStorage.setItem("callTypeID", data.payload.callTypeID);
          localStorage.setItem("newCallerID", data.payload.callerID);
          let Dataa = {
            OrganizationID: Number(currentOrganization),
            RoomID: data.payload.roomID,
          };
          // const meetingHost = {
          //   isHost: false,
          //   isHostId: 0,
          //   isDashboardVideo: false,
          // };
          // localStorage.setItem("meetinHostInfo", JSON.stringify(meetingHost));
          dispatch(CallRequestReceived(Dataa, navigate, t));
          if (callStatus === true) {
            dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
            dispatch(incomingVideoCallFlag(true));
            let timeValue = Number(localStorage.getItem("callRingerTimeout"));
            let callTypeID = Number(localStorage.getItem("callTypeID"));
            localStorage.setItem("NewRoomID", data.payload.roomID);
            timeValue = timeValue * 1000;
            const timeoutId = setTimeout(() => {
              let Data = {
                ReciepentID: Number(createrID),
                RoomID: data.payload.roomID,
                CallStatusID: 3,
                CallTypeID: callTypeID,
              };
              if (IncomingVideoCallFlagReducer === true) {
                dispatch(VideoCallResponse(Data, navigate, t));
              }
            }, timeValue);
            localStorage.setItem("activeRoomID", data.payload.roomID);
            return () => clearTimeout(timeoutId);
          } else if (
            callStatus === false &&
            IncomingVideoCallFlagReducer === false
          ) {
            dispatch(incomingVideoCallFlag(true));
            dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
            localStorage.setItem("NewRoomID", data.payload.roomID);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("callerID", data.payload.callerID);
            localStorage.setItem("callerNameInitiate", data.payload.callerName);
            localStorage.setItem("recipentID", data.receiverID[0]);
            localStorage.setItem("recipentName", currentUserName);
          }
          dispatch(callRequestReceivedMQTT({}, ""));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_ACCEPTED".toLowerCase()
        ) {
          dispatch(videoOutgoingCallFlag(false));
          dispatch(videoCallAccepted(data.payload, data.payload.message));
          localStorage.setItem("NewRoomID", 0);
          localStorage.setItem("callerID", data.receiverID[0]);
          localStorage.setItem("callerName", data.payload.callerName);
          localStorage.setItem("recipentID", data.payload.recepientID);
          localStorage.setItem("recipentName", data.payload.recepientName);
          localStorage.setItem("activeCall", true);
          localStorage.setItem("activeRoomID", data.payload.roomID);
          localStorage.setItem("CallType", data.payload.callTypeID);
          localStorage.setItem("callTypeID", data.payload.callTypeID);
          if (data.payload.recepientID === Number(createrID)) {
            localStorage.setItem("initiateVideoCall", false);
          }

          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];

          let newData = {
            RecipientName: data.payload.recepientName,
            RecipientID: data.payload.recepientID,
            CallStatus: "Accepted",
            RoomID: data.payload.roomID,
          };

          let existingObjectIndex = existingData.findIndex(
            (item) =>
              item.RecipientName === newData.RecipientName &&
              item.RecipientID === newData.RecipientID &&
              item.RoomID === newData.RoomID
          );

          if (existingObjectIndex !== -1) {
            existingData[existingObjectIndex] = newData;
          } else {
            existingData.push(newData);
          }

          localStorage.setItem(
            "callerStatusObject",
            JSON.stringify(existingData)
          );
          dispatch(callRequestReceivedMQTT({}, ""));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_REJECTED".toLowerCase()
        ) {
          let callerID = Number(localStorage.getItem("callerID"));
          let newCallerID = Number(localStorage.getItem("newCallerID"));
          let currentUserName = localStorage.getItem("name");
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let initiateRoomID = localStorage.getItem("initiateCallRoomID");
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let callTypeID = Number(localStorage.getItem("CallType"));

          // if (callerID === newCallerID) {
          // }

          if (callTypeID === 1) {
            console.log("mqtt", isMeetingVideo);
            let Data = {
              OrganizationID: currentOrganization,
              RoomID: initiateRoomID,
              IsCaller: true,
              CallTypeID: callTypeID,
            };
            dispatch(LeaveCall(Data, navigate, t));
            dispatch(
              callRequestReceivedMQTT(data.payload, data.payload.message)
            );
            localStorage.setItem("activeCall", false);
            localStorage.setItem("newCallerID", callerID);
            localStorage.setItem("initiateVideoCall", false);
            localStorage.setItem("NewRoomID", 0);
            localStorage.setItem("activeRoomID", 0);
            localStorage.setItem("initiateVideoCall", false);
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(videoChatMessagesFlag(false));
            dispatch(videoOutgoingCallFlag(false));
          } else if (callTypeID === 2) {
            let newData = {
              RecipientName: data.payload.recepientName,
              RecipientID: data.payload.recepientID,
              CallStatus: "Rejected",
              RoomID: data.payload.roomID,
            };
            let existingObjectIndex = existingData.findIndex(
              (item) =>
                item.RecipientName === newData.RecipientName &&
                item.RecipientID === newData.RecipientID &&
                item.RoomID === newData.RoomID
            );
            if (existingObjectIndex !== -1) {
              existingData[existingObjectIndex] = newData;
            } else {
              existingData.push(newData);
            }
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(existingData)
            );
            console.log("mqtt", isMeeting);
            if (isMeeting) {
              console.log("mqtt", isMeetingVideo);
              if (!isMeetingVideo) {
                console.log("mqtt");
              }
            } else {
              console.log("mqtt", checkCallStatus(existingData));
              if (checkCallStatus(existingData)) {
                localStorage.setItem("activeCall", false);
                console.log("mqtt", isMeetingVideo);
                let Data = {
                  OrganizationID: currentOrganization,
                  RoomID: initiateRoomID,
                  IsCaller: true,
                  CallTypeID: callTypeID,
                };
                dispatch(LeaveCall(Data, navigate, t));
                dispatch(
                  callRequestReceivedMQTT(data.payload, data.payload.message)
                );
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoOutgoingCallFlag(false));
                localStorage.setItem("initiateVideoCall", false);
              } else {
                console.log("mqtt", isMeetingVideo);
              }
            }
          }

          if (currentUserName !== data.payload.recepientName) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: `${data.payload.recepientName} has declined the call`,
            });
            setNotificationID(id);
          }
          dispatch(callRequestReceivedMQTT({}, ""));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_UNANSWERED".toLowerCase()
        ) {
          let callTypeID = Number(localStorage.getItem("callTypeID"));
          let callerID = Number(localStorage.getItem("callerID"));
          let newCallerID = Number(localStorage.getItem("newCallerID"));
          let isMeetingVideo = JSON.parse(
            localStorage.getItem("isMeetingVideo")
          );
          let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
          let initiateRoomID = localStorage.getItem("initiateCallRoomID");
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          localStorage.setItem("newCallerID", callerID);
          if (Number(data.senderID) !== Number(createrID)) {
            if (Number(createrID) !== data.payload.recepientID) {
              localStorage.setItem("unansweredFlag", true);
            }
            setNotification({
              ...notification,
              notificationShow: true,
              message: t("The-call-was-unanswered"),
            });
            setNotificationID(id);

            let newData = {
              RecipientName: data.payload.recepientName,
              RecipientID: data.payload.recepientID,
              CallStatus: "Unanswered",
              RoomID: data.payload.roomID,
            };
            let existingObjectIndex = existingData.findIndex(
              (item) =>
                item.RecipientName === newData.RecipientName &&
                item.RecipientID === newData.RecipientID &&
                item.RoomID === newData.RoomID
            );
            if (existingObjectIndex !== -1) {
              existingData[existingObjectIndex] = newData;
            } else {
              existingData.push(newData);
            }
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(existingData)
            );
          }
          if (callerID === newCallerID) {
            if (isMeeting) {
              if (!isMeetingVideo) {
                localStorage.setItem("activeCall", false);
              }
            } else {
              localStorage.setItem("activeCall", false);
            }
          }
          console.log("mqtt", callTypeID);
          if (Number(callTypeID) === 2 || Number(callTypeID) === 1) {
            console.log("mqtt", isMeeting);
            if (isMeeting) {
              console.log("mqtt", isMeetingVideo);
              if (!isMeetingVideo) {
                console.log("mqtt");
              }
            } else {
              if (Number(callTypeID) === 1) {
                console.log("mqtt", isMeetingVideo);
                let Data = {
                  OrganizationID: currentOrganization,
                  RoomID: initiateRoomID,
                  IsCaller: true,
                  CallTypeID: callTypeID,
                };
                dispatch(LeaveCall(Data, navigate, t));
                dispatch(
                  callRequestReceivedMQTT(data.payload, data.payload.message)
                );
                dispatch(normalizeVideoPanelFlag(false));
                dispatch(videoOutgoingCallFlag(false));
                localStorage.setItem("initiateVideoCall", false);
              } else {
                console.log("mqtt", checkCallStatus(existingData));
                if (checkCallStatus(existingData)) {
                  console.log("mqtt", isMeetingVideo);
                  let Data = {
                    OrganizationID: currentOrganization,
                    RoomID: initiateRoomID,
                    IsCaller: true,
                    CallTypeID: callTypeID,
                  };
                  dispatch(LeaveCall(Data, navigate, t));
                  dispatch(
                    callRequestReceivedMQTT(data.payload, data.payload.message)
                  );
                  dispatch(normalizeVideoPanelFlag(false));
                  dispatch(videoOutgoingCallFlag(false));
                  localStorage.setItem("activeCall", false);
                  localStorage.setItem("initiateVideoCall", false);
                } else {
                  console.log("mqtt", isMeetingVideo);
                }
              }
            }
          }
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_RINGING".toLowerCase()
        ) {
          localStorage.setItem("initiateCallRoomID", data.payload.roomID);
          localStorage.setItem("ringerRoomId", data.payload.roomID);
          localStorage.setItem("initiateVideoCall", true);
          dispatch(callRequestReceivedMQTT(data.payload, data.payload.message));
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
          let newData = {
            RecipientName: data.payload.recepientName,
            RecipientID: data.payload.recepientID,
            CallStatus: "Ringing",
            RoomID: data.payload.roomID,
          };
          let existingObjectIndex = existingData.findIndex(
            (item) =>
              item.RecipientName === newData.RecipientName &&
              item.RecipientID === newData.RecipientID &&
              item.RoomID === newData.RoomID
          );
          if (existingObjectIndex !== -1) {
            existingData[existingObjectIndex] = newData;
          } else {
            existingData.push(newData);
          }
          localStorage.setItem(
            "callerStatusObject",
            JSON.stringify(existingData)
          );
          let Dataa = {
            OrganizationID: Number(currentOrganization),
            RoomID: data.payload.roomID,
          };
          dispatch(CallRequestReceived(Dataa, navigate, t));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_DISCONNECTED_CALLER".toLowerCase()
        ) {
          let callStatus = JSON.parse(localStorage.getItem("activeCall"));
          let callerID = JSON.parse(localStorage.getItem("callerID"));
          let newCallerID = JSON.parse(localStorage.getItem("newCallerID"));
          if (IncomingVideoCallFlagReducer === true && callStatus === false) {
            let callerID = Number(localStorage.getItem("callerID"));
            let newCallerID = Number(localStorage.getItem("newCallerID"));
            if (callerID === newCallerID) {
              localStorage.setItem("activeCall", false);
            }
            localStorage.setItem("newCallerID", callerID);
            localStorage.setItem("initiateVideoCall", false);
            let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));
            let activeRoomID = Number(localStorage.getItem("activeRoomID"));
            dispatch(incomingVideoCallFlag(false));
            if (activeRoomID !== acceptedRoomID) {
              dispatch(incomingVideoCallFlag(false));
              localStorage.setItem("activeRoomID", acceptedRoomID);
            }
            if (activeRoomID === acceptedRoomID) {
              if (
                NormalizeVideoFlag === true ||
                IncomingVideoCallFlagReducer === true ||
                MaximizeVideoFlag === true
              ) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: `Call has been disconnected by ${data.payload.callerName}`,
                });
                setNotificationID(id);
              }
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(videoChatMessagesFlag(false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
            }
            dispatch(leaveCallModal(false));
          } else if (
            IncomingVideoCallFlagReducer === false &&
            callStatus === true
          ) {
            let callerID = Number(localStorage.getItem("callerID"));
            let newCallerID = Number(localStorage.getItem("newCallerID"));
            if (callerID === newCallerID) {
              localStorage.setItem("activeCall", false);
            }
            localStorage.setItem("newCallerID", callerID);
            localStorage.setItem("initiateVideoCall", false);
            let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));
            let activeRoomID = Number(localStorage.getItem("activeRoomID"));
            dispatch(incomingVideoCallFlag(false));
            if (activeRoomID !== acceptedRoomID) {
              dispatch(incomingVideoCallFlag(false));
              localStorage.setItem("activeRoomID", acceptedRoomID);
            }
            if (activeRoomID === acceptedRoomID) {
              if (
                NormalizeVideoFlag === true ||
                IncomingVideoCallFlagReducer === true ||
                MaximizeVideoFlag === true
              ) {
                setNotification({
                  ...notification,
                  notificationShow: true,
                  message: `Call has been disconnected by ${data.payload.callerName}`,
                });
                setNotificationID(id);
              }
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(videoChatMessagesFlag(false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
            }
            dispatch(leaveCallModal(false));
          } else if (
            IncomingVideoCallFlagReducer === true &&
            callStatus === true
          ) {
            if (
              data.payload.callerID === callerID &&
              data.payload.callerID === newCallerID
            ) {
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(videoChatMessagesFlag(false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              localStorage.setItem("activeCall", false);
            } else if (data.payload.callerID === newCallerID) {
              dispatch(incomingVideoCallFlag(false));
              let acceptedRoomID = Number(
                localStorage.getItem("acceptedRoomID")
              );
              localStorage.setItem("newCallerID", callerID);
              localStorage.setItem("activeCall", true);
              localStorage.setItem("activeRoomID", acceptedRoomID);
            } else if (data.payload.callerID === callerID) {
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(videoChatMessagesFlag(false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));
              localStorage.setItem("activeCall", false);
            }
          }
          dispatch(leaveCallModal(false));
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_DISCONNECTED_RECIPIENT".toLowerCase()
        ) {
          let callerID = Number(localStorage.getItem("callerID"));

          localStorage.setItem("newCallerID", callerID);
          localStorage.setItem("initiateVideoCall", false);

          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];

          let newData = {
            RecipientName: data.payload.recipientName,
            RecipientID: data.payload.recipientID,
            CallStatus: "Disconnected",
            RoomID: data.payload.roomID,
          };

          let existingObjectIndex = existingData.findIndex(
            (item) =>
              item.RecipientName === newData.RecipientName &&
              item.RecipientID === newData.RecipientID &&
              item.RoomID === newData.RoomID
          );

          if (existingObjectIndex !== -1) {
            existingData[existingObjectIndex] = newData;
          } else {
            existingData.push(newData);
          }

          localStorage.setItem(
            "callerStatusObject",
            JSON.stringify(existingData)
          );
          setNotification({
            ...notification,
            notificationShow: true,
            message: `${data.payload.recipientName} has left the call`,
          });
          setNotificationID(id);
        } else if (
          data.payload.message.toLowerCase() ===
          "MISSED_CALLS_COUNT".toLowerCase()
        ) {
          dispatch(missedCallCount(data.payload, data.payload.message));
        } else if (
          data.payload.message.toLowerCase() === "VIDEO_CALL_BUSY".toLowerCase()
        ) {
          if (data.payload.recepientID !== Number(createrID)) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(videoChatMessagesFlag(false));
            dispatch(maximizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            setNotification({
              ...notification,
              notificationShow: true,
              message: `${data.payload.recepientName} is currently Busy`,
            });
            setNotificationID(id);
            let existingData =
              JSON.parse(localStorage.getItem("callerStatusObject")) || [];
            let newData = {
              RecipientName: data.payload.recepientName,
              RecipientID: data.payload.recepientID,
              CallStatus: "Busy",
              RoomID: data.payload.roomID,
            };
            let existingObjectIndex = existingData.findIndex(
              (item) =>
                item.RecipientName === newData.RecipientName &&
                item.RecipientID === newData.RecipientID &&
                item.RoomID === newData.RoomID
            );
            if (existingObjectIndex !== -1) {
              existingData[existingObjectIndex] = newData;
            } else {
              existingData.push(newData);
            }
            localStorage.setItem(
              "callerStatusObject",
              JSON.stringify(existingData)
            );
            localStorage.setItem("activeCall", false);
          }
        }
      }
      if (data.action.toLowerCase() === "Notes".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_NOTES_CREATION".toLowerCase()
        ) {
          let data2 = {
            creationDateTime: data.dateTime,
            notificationTypes: {
              pK_NTID: 10,
              description: changeMQTTJSONOne(
                t("NOTES-RECENT-ACTIVITY"),
                "[Notes Title]",
                data.payload.model.title
              ),
              icon: "",
            },
            key: 0,
          };

          dispatch(setRecentActivityDataNotification(data2));
        }
      }
      if (data.action.toLowerCase() === "Calendar".toLowerCase()) {
        if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_CREATED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          dispatch(createGoogleEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_UPDATED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          dispatch(updateGoogletEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("EVENT_DELETED_FROM_GOOGLE_CALENDAR".toLowerCase())
        ) {
          // deleteGoogleEventMQTT;
          dispatch(deleteGoogleEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_CREATION".toLowerCase())
        ) {
          dispatch(createMicrosftEventMQTT(data.payload));
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_UPDATED".toLowerCase())
        ) {
          dispatch(updateMicrosftEventMQTT(data.payload));
          // updateMicrosftEventMQTT,
          //
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_DELETED".toLowerCase())
        ) {
          dispatch(deleteMicrosftEventMQTT(data.payload));
          // deleteMicrosftEventMQTT;
        }
      }
      if (data.action.toLowerCase() === "LogOut".toLowerCase()) {
        if (
          data.payload
            .toLowerCase()
            .includes("USER_lOGOUT_DUE_TO_INACTIVITY".toLowerCase())
        ) {
          dispatch(userLogOutApiFunc(navigate, t));
        }
      }
      if (data.action.toLowerCase() === "Login".toLowerCase()) {
        if (
          data.message.toLowerCase() === "USER_LOGIN_ACTIVITY".toLowerCase()
        ) {
          let getUserID =
            localStorage.getItem("userID") !== null &&
            localStorage.getItem("userID");

          if (
            Number(getUserID) === Number(data?.payload?.authToken?.userID) &&
            Number(data?.payload?.deviceID) === 1
          ) {
            dispatch(userLogOutApiFunc(navigate, t));
          }
        }
      }
      if (data.action.toLowerCase() === "DATAROOM".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() === "FILE_SHARED".toLowerCase()
        ) {
          try {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t(
                  `${data?.payload?.data?.displayFileName} document shared with you`
                ),
              });
            }
            setNotificationID(id);
            dispatch(fileSharedMQTT(data.payload));
          } catch (error) {}
        } else if (
          data.payload.message.toLowerCase() === "FOLDER_SHARED".toLowerCase()
        ) {
          try {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: t(
                  `${data?.payload?.data?.displayFolderName} folder shared with you`
                ),
              });
            }
            setNotificationID(id);
            dispatch(folderSharedMQTT(data.payload));
          } catch (error) {}
        } else if (
          data.payload.message.toLowerCase() ===
            "FILE_SHARING_REMOVED".toLowerCase() ||
          "FILE_DELETED".toLowerCase()
        ) {
          try {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: `file remove to you`,
              });
            }
            setNotificationID(id);
            dispatch(fileRemoveMQTT(data?.payload?.fileID));
          } catch (error) {}
        } else if (
          data.payload.message.toLowerCase() ===
          "FOLDER_SHARING_REMOVED".toLowerCase()
        ) {
          try {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: `folder remove to you`,
              });
            }
            setNotificationID(id);
            dispatch(folderRemoveMQTT(data?.payload?.fileID));
          } catch (error) {}
        } else if (
          data.payload.message.toLowerCase() === "FOLDER_DELETED".toLowerCase()
        ) {
          try {
            if (data.viewable) {
              setNotification({
                notificationShow: true,
                message: `folder remove to you`,
              });
            }
            setNotificationID(id);
            dispatch(folderRemoveMQTT(data?.payload?.folderID));
          } catch (error) {}
        }
        //  else if (
        //   data.payload.message.toLowerCase() ===
        //   "PARTICIPANT_RAISE_UNRAISE_HAND".toLowerCase()
        // ) {
        //   setHandsRaisedCount(data.payload.handsRaisedCount || 0);
        //   setParticipantsList(data.payload.particpantsList || []);
        //   // Log roomID or raise hand status if available
        //   if (data.payload.roomID) {
        //     console.log("Room ID:", data.payload.roomID);
        //   } else if (data.payload.raiseHand === true) {
        //     console.log("Hand Raised:", data.payload.raiseHand);
        //   }
        // }
      }
      //Web Notification
      if (data.action.toLowerCase() === "WEBNOTIFICATION".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "Web_Notification".toLowerCase()
        ) {
          console.log(data.payload, "datapayload");
          dispatch(DiskusGlobalUnreadNotificationCount(data.payload));
          setNotificationID(id);
        }
      }
    } catch (error) {}
  };

  const onConnectionLost = () => {
    setTimeout(mqttConnection, 3000);
  };

  useEffect(() => {
    if (meetingUrlData !== null && meetingUrlData !== undefined) {
      setMeetingURLLocalData(meetingUrlData);
    } else {
      setMeetingURLLocalData(null);
    }
  }, [meetingUrlData]);

  useEffect(() => {
    if (Helper.socket === null) {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
    if (newClient !== null) {
      newClient.onConnectionLost = onConnectionLost;
      newClient.onMessageArrived = onMessageArrived;
    }
  }, [
    newClient,
    IncomingVideoCallFlagReducer,
    NormalizeVideoFlag,
    MaximizeVideoFlag,
  ]);

  useEffect(() => {
    if (Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  localStorage.setItem("MqttConnectionState", isOnline);

  useEffect(() => {
    dispatch(GetAllUserChats(navigate, createrID, currentOrganization, t));
    dispatch(GetUserMissedCallCount(navigate, t));
    //Owais Pending APproval Count
    dispatch(GetPendingApprovalsCount(navigate, t));
    localStorage.setItem("activeOtoChatID", 0);
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18nextLng);
  }, [i18nextLng]);

  useEffect(() => {
    if (
      MeetingStatusEnded !== null &&
      MeetingStatusEnded !== undefined &&
      MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = MeetingStatusEnded?.meeting;
      let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
      let isMeetingVideo = localStorage.getItem("isMeetingVideo");
      isMeetingVideo = isMeetingVideo ? JSON.parse(isMeetingVideo) : false;
      if (endMeetingData) {
        if (
          currentMeetingID === endMeetingData?.pK_MDID &&
          Number(endMeetingData?.statusID) === 9
        ) {
          if (isMeetingVideo === true) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
          }
        }
      }
    }
  }, [MeetingStatusEnded]);

  useEffect(() => {
    let activeCall = JSON.parse(localStorage.getItem("activeCall"));

    if (window.performance) {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const navigationType = navigationEntries[0].type;
        if (navigationType === "reload" && activeCall === true) {
          dispatch(normalizeVideoPanelFlag(true));
        } else {
        }
      }
    }
  }, []);
  console.log(
    "isInternetDisconnectModalVisible",
    isInternetDisconnectModalVisible
  );
  return (
    <>
      <ConfigProvider
        direction={currentLanguage === "ar" ? ar_EG : en_US}
        locale={currentLanguage === "ar" ? ar_EG : en_US}
      >
        {IncomingVideoCallFlagReducer === true && (
          <div className="overlay-incoming-videocall" />
        )}
        <Layout className="mainDashboardLayout">
          {location.pathname === "/DisKus/videochat" ? null : <Header2 />}
          <Layout>
            <Sider width={"4%"}>
              <Sidebar />
            </Sider>
            <Content>
              <div className="dashbaord_data">
                <Outlet />
              </div>
              <div className="talk_features_home">
                {activateBlur ? null : roleRoute ? null : <Talk />}
              </div>
            </Content>
          </Layout>
          <NotificationBar
            iconName={
              <img src={IconMetroAttachment} alt="" draggable="false" />
            }
            notificationMessage={notification.message}
            notificationState={notification.notificationShow}
            setNotification={setNotification}
            handleClose={closeNotification}
            id={notificationID}
          />

          {ShowGuestPopup && (
            <div>
              <GuestJoinRequest />
            </div>
          )}
          {IncomingVideoCallFlagReducer === true ? <VideoMaxIncoming /> : null}
          {VideoChatMessagesFlagReducer === true ? (
            <TalkChat2
              chatParentHead="chat-messenger-head-video"
              chatMessageClass="chat-messenger-head-video"
            />
          ) : null}
          {/* <Modal show={true} size="md" setShow={true} /> */}
          {NormalizeVideoFlag === true ||
          MinimizeVideoFlag === true ||
          MaximizeVideoFlag === true ? (
            <VideoCallScreen />
          ) : null}
          {/* Disconnectivity Modal  */}
          {isInternetDisconnectModalVisible && (
            <InternetConnectivityModal
              open={isInternetDisconnectModalVisible}
            />
          )}
          <Notification
            open={open.open}
            message={open.message}
            setOpen={(status) => setOpen({ ...open, open: status.open })}
            severity={open.severity}
          />
          {cancelModalMeetingDetails && <CancelButtonModal />}
          {roleRoute && (
            <Modal
              show={roleRoute}
              setShow={() => {
                setActivateBlur();
              }}
              ButtonTitle={"Block"}
              centered
              size={"md"}
              modalHeaderClassName="d-none"
              ModalBody={
                <>
                  <>
                    <Row className="mb-1">
                      <Col lg={12} md={12} xs={12} sm={12}>
                        <Row>
                          <Col className="d-flex justify-content-center">
                            <img
                              src={VerificationFailedIcon}
                              width={60}
                              className={"allowModalIcon"}
                              alt=""
                              draggable="false"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="text-center mt-4">
                            <label className={"allow-limit-modal-p"}>
                              {t(
                                "The-organization-subscription-is-not-active-please-contact-your-admin"
                              )}
                            </label>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                </>
              }
              ModalFooter={
                <>
                  <Col sm={12} md={12} lg={12}>
                    <Row className="mb-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <Button
                          className={"Ok-Successfull-btn"}
                          text={t("Ok")}
                          onClick={closeModal}
                        />
                      </Col>
                    </Row>
                  </Col>
                </>
              }
            />
          )}
          {mobileAppPopUp && <MobileAppPopUpModal />}
          {showInitimationMessegeModalLeaveVideoMeeting && (
            <LeaveVideoIntimationModal />
          )}
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default Dashboard;
