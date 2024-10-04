import TalkChat2 from "../../components/layout/talk/talk-chat/talkChatBox/chat";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar, Talk } from "../../components/layout";
import CancelButtonModal from "../pages/meeting/closeMeetingTab/CancelModal";
import { Button, Loader, Modal, Notification } from "../../components/elements";
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
} from "../../store/actions/VideoMain_actions";
import Helper from "../../commen/functions/history_logout";
import IconMetroAttachment from "../../assets/images/newElements/Icon metro-attachment.svg";
import VerificationFailedIcon from "../../assets/images/failed.png";
import { GetPendingApprovalsCount } from "../../store/actions/Minutes_action";
// import io from "socket.io-client";
import {
  createTaskCommitteeMQTT,
  createTaskGroupMQTT,
  createTaskMeetingMQTT,
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
import { NotificationBar } from "../../components/elements";
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

const Dashboard = () => {
  const location = useLocation();
  const roleRoute = getLocalStorageItemNonActiveCheck("VERIFICATION");

  const {
    videoFeatureReducer,
    assignees,
    CommitteeReducer,
    toDoListReducer,
    getTodosStatus,
    downloadReducer,
    todoStatus,
    uploadReducer,
    settingReducer,
    fAQsReducer,
    meetingIdReducer,
    calendarReducer,
    OnBoardModal,
    postAssigneeComments,
    VideoChatReducer,
    minuteofMeetingReducer,
    countryNamesReducer,
    GetSubscriptionPackage,
    Authreducer,
    roleListReducer,
    NotesReducer,
    GroupsReducer,
    ResolutionReducer,
    RealtimeNotification,
    OrganizationBillingReducer,
    PollsReducer,
    NewMeetingreducer,
    LanguageReducer,
    webViewer,
    MeetingOrganizersReducer,
    MeetingAgendaReducer,
    attendanceMeetingReducer,
    actionMeetingReducer,
    AgendaWiseAgendaListReducer,
    DataRoomReducer,
    DataRoomFileAndFoldersDetailsReducer,
    SignatureWorkFlowReducer,
    UserMangementReducer,
    MinutesReducer,
    UserManagementModals,
  } = useSelector((state) => state);

  const meetingUrlData = useSelector(
    (state) => state.NewMeetingreducer.getmeetingURL
  );

  const navigate = useNavigate();
  const [checkInternet, setCheckInternet] = useState(navigator);
  let createrID = localStorage.getItem("userID");
  let currentOrganization = localStorage.getItem("organizationID");
  let currentUserName = localStorage.getItem("name");
  const { Sider, Content } = Layout;
  //Translation
  const { t } = useTranslation();

  // let createrID = 5;
  const dispatch = useDispatch();
  let userGUID = localStorage.getItem("userGUID");
  let currentMeetingVideoID = localStorage.getItem("acceptedRoomID");

  // for real time Notification
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  // for sub menus Icons

  //State For Meeting Data
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [activateBlur, setActivateBlur] = useState(false);
  const [notificationID, setNotificationID] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [meetingURLLocalData, setMeetingURLLocalData] = useState(null);
  let Blur = localStorage.getItem("blur");

  const cancelModalMeetingDetails = useSelector(
    (state) => state.NewMeetingreducer.cancelModalMeetingDetails
  );

  let newClient = Helper.socket;
  // for close the realtime Notification bar
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };

  const closeModal = () => {
    localStorage.removeItem("packageFeatureIDs");
    localStorage.removeItem("LocalUserRoutes");
    localStorage.removeItem("VERIFICATION");

    dispatch(userLogOutApiFunc(navigate, t));
  };

  const isInternetDisconnectModalVisible = useSelector(
    (state) => state.UserManagementModals.internetDisconnectModal
  );
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
    console.log(data, " MQTT onMessageArrived");
    try {
      if (data.action?.toLowerCase() === "Meeting".toLowerCase()) {
        if (data.action && data.payload) {
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
            let meetingVideoID = Number(localStorage.getItem("meetingVideoID"));
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
              if (meetingVideoID === data.payload.meeting.pK_MDID) {
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
                };
                dispatch(LeaveMeetingVideo(Data, navigate, t));
              }
            }

            dispatch(mqttCurrentMeetingEnded(data.payload));
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
            let Data2 = {
              UserID: Number(createrID),
            };
            dispatch(GetUpcomingEventsForMQTT(navigate, Data2, t, false));
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
            dispatch(meetingStatusPublishedMqtt(data.payload.meeting));
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
            dispatch(meetingCount(data.payload));
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
              .includes("NEW_MEETING_AGENDA_CONTRIBUTOR_DELETED".toLowerCase())
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
            data.payload.message?.toLowerCase() ===
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
            } catch (error) {}
          } else if (
            data.payload.message?.toLowerCase() ===
            "MeetingReminderNotification".toLowerCase()
          ) {
            dispatch(meetingNotConductedMQTT(data.payload));

            if (data.viewable) {
              setNotification({
                ...notification,
                notificationShow: true,
                message: changeMQTTJSONOne(
                  t("MeetingReminderNotification"),
                  "[Meeting Title]",
                  data.payload.meetingTitle.substring(0, 100)
                ),
              });
              setNotificationID(id);
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
          dispatch(TodoCounter(data.payload));
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
            });
          }
        }
      }
      if (data.action.toLowerCase() === "Group".toLowerCase()) {
        if (
          data.payload.message.toLowerCase() ===
          "NEW_GROUP_CREATION".toLowerCase()
        ) {
          if (data.viewable) {
            setNotification({
              notificationShow: true,
              message: changeMQTTJSONOne(
                t("NEW_GROUP_CREATION"),
                "[Group Title]",
                data.payload.groups.groupTitle.substring(0, 100)
              ),
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
              if (videoFeatureReducer.IncomingVideoCallFlag === true) {
                dispatch(VideoCallResponse(Data, navigate, t));
              }
            }, timeValue);
            localStorage.setItem("activeRoomID", data.payload.roomID);
            return () => clearTimeout(timeoutId);
          } else if (
            callStatus === false &&
            videoFeatureReducer.IncomingVideoCallFlag === false
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
          localStorage.setItem("NewRoomID", 0);
          localStorage.setItem("activeRoomID", 0);
          let callerID = Number(localStorage.getItem("callerID"));
          let newCallerID = Number(localStorage.getItem("newCallerID"));
          let currentUserName = localStorage.getItem("name");
          if (callerID === newCallerID) {
            localStorage.setItem("activeCall", false);
          }
          localStorage.setItem("newCallerID", callerID);
          localStorage.setItem("initiateVideoCall", false);
          let callTypeID = Number(localStorage.getItem("CallType"));
          dispatch(videoOutgoingCallFlag(false));
          if (callTypeID === 1) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(videoChatMessagesFlag(false));
          }
          let existingData =
            JSON.parse(localStorage.getItem("callerStatusObject")) || [];
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
          if (Number(data.senderID) !== Number(createrID)) {
            if (callTypeID === 1) {
            }
            if (Number(createrID) !== data.payload.recepientID) {
              localStorage.setItem("unansweredFlag", true);
            }
            setNotification({
              ...notification,
              notificationShow: true,
              message: `The call was unanswered`,
            });
            setNotificationID(id);
            let existingData =
              JSON.parse(localStorage.getItem("callerStatusObject")) || [];
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
          let callerID = Number(localStorage.getItem("callerID"));
          let newCallerID = Number(localStorage.getItem("newCallerID"));
          if (callerID === newCallerID) {
            localStorage.setItem("activeCall", false);
          }
          localStorage.setItem("newCallerID", callerID);
          dispatch(callRequestReceivedMQTT(data.payload, data.payload.message));
          localStorage.setItem("initiateVideoCall", false);
        } else if (
          data.payload.message.toLowerCase() ===
          "VIDEO_CALL_RINGING".toLowerCase()
        ) {
          dispatch(callRequestReceivedMQTT(data.payload, data.payload.message));
          localStorage.setItem("initiateVideoCall", true);
          localStorage.setItem("ringerRoomId", data.payload.roomID);
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
          if (
            videoFeatureReducer.IncomingVideoCallFlag === true &&
            callStatus === false
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
                videoFeatureReducer.NormalizeVideoFlag === true ||
                videoFeatureReducer.IncomingVideoCallFlag === true ||
                videoFeatureReducer.MaximizeVideoFlag === true
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
            videoFeatureReducer.IncomingVideoCallFlag === false &&
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
                videoFeatureReducer.NormalizeVideoFlag === true ||
                videoFeatureReducer.IncomingVideoCallFlag === true ||
                videoFeatureReducer.MaximizeVideoFlag === true
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
            videoFeatureReducer.IncomingVideoCallFlag === true &&
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
        } else if (
          data.payload.message
            .toLowerCase()
            .includes("NEW_MICROSOFT_EVENT_DELETED".toLowerCase())
        ) {
          dispatch(deleteMicrosftEventMQTT(data.payload));
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
          let getToken =
            localStorage.getItem("token") !== null &&
            localStorage.getItem("token");
          if (getToken !== data?.payload?.authToken?.token) {
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
                message: ` folder remove to you`,
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
                message: ` folder remove to you`,
              });
            }
            setNotificationID(id);
            dispatch(folderRemoveMQTT(data?.payload?.folderID));
          } catch (error) {}
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
        mqttConnection(userID);
      }
    }
    if (newClient !== null) {
      newClient.onConnectionLost = onConnectionLost;
      newClient.onMessageArrived = onMessageArrived;
    }
  }, [
    newClient,
    videoFeatureReducer.IncomingVideoCallFlag,
    videoFeatureReducer.NormalizeVideoFlag,
    videoFeatureReducer.MaximizeVideoFlag,
  ]);

  useEffect(() => {
    if (Blur !== undefined && Blur !== null) {
      setActivateBlur(true);
    } else {
      setActivateBlur(false);
    }
  }, [Blur]);

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

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

  let i18nextLng = localStorage.getItem("i18nextLng");

  useEffect(() => {
    setCurrentLanguage(i18nextLng);
  }, [i18nextLng]);

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusEnded !== null &&
      meetingIdReducer.MeetingStatusEnded !== undefined &&
      meetingIdReducer.MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = meetingIdReducer?.MeetingStatusEnded?.meeting;
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
  }, [meetingIdReducer.MeetingStatusEnded]);

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

  return (
    <>
      <ConfigProvider
        direction={currentLanguage === "ar" ? ar_EG : en_US}
        locale={currentLanguage === "ar" ? ar_EG : en_US}
      >
        {videoFeatureReducer.IncomingVideoCallFlag === true && (
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
          {videoFeatureReducer.IncomingVideoCallFlag === true ? (
            <VideoMaxIncoming />
          ) : null}
          {videoFeatureReducer.VideoChatMessagesFlag === true ? (
            <TalkChat2
              chatParentHead="chat-messenger-head-video"
              chatMessageClass="chat-messenger-head-video"
            />
          ) : null}
          {videoFeatureReducer.NormalizeVideoFlag === true ||
          videoFeatureReducer.MinimizeVideoFlag === true ||
          videoFeatureReducer.MaximizeVideoFlag === true ? (
            <VideoCallScreen />
          ) : null}
          {!navigator.onLine ? (
            <React.Fragment></React.Fragment>
          ) : // Check for loading states to determine whether to display loader
          NewMeetingreducer.Loading ||
            assignees.Loading ||
            MeetingOrganizersReducer.LoadingMeetingOrganizer ||
            MeetingOrganizersReducer.Loading ||
            PollsReducer.Loading ||
            CommitteeReducer.Loading ||
            toDoListReducer.Loading ||
            todoStatus.Loading ||
            getTodosStatus.Loading ||
            MeetingAgendaReducer.Loading ||
            actionMeetingReducer.Loading ||
            AgendaWiseAgendaListReducer.loading ||
            downloadReducer.Loading ||
            attendanceMeetingReducer.Loading ||
            webViewer.Loading ||
            LanguageReducer.Loading ||
            uploadReducer.Loading ||
            settingReducer.Loading ||
            fAQsReducer.Loading ||
            meetingIdReducer.Loading ||
            calendarReducer.Loading ||
            OnBoardModal.Loading ||
            postAssigneeComments.Loading ||
            VideoChatReducer.Loading ||
            minuteofMeetingReducer.Loading ||
            countryNamesReducer.Loading ||
            GetSubscriptionPackage.Loading ||
            Authreducer.Loading ||
            roleListReducer.Loading ||
            NotesReducer.Loading ||
            GroupsReducer.Loading ||
            GroupsReducer.getAllLoading ||
            ResolutionReducer.Loading ||
            RealtimeNotification.Loading ||
            OrganizationBillingReducer.Loading ||
            DataRoomReducer.Loading ||
            MinutesReducer.Loading ||
            DataRoomFileAndFoldersDetailsReducer.Loading ||
            SignatureWorkFlowReducer.Loading ||
            UserMangementReducer.Loading ? (
            <Loader /> // <Loader />
          ) : null}
          {/* Disconnectivity Modal  */}
          {isInternetDisconnectModalVisible && <InternetConnectivityModal />}
          <Notification
            setOpen={setOpen}
            open={open.flag}
            message={open.message}
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
          {UserManagementModals.mobileAppPopUp && <MobileAppPopUpModal />}
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default Dashboard;
