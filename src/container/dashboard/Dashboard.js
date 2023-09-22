import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar, Talk } from "../../components/layout";
import { Loader, LoaderPanel } from "../../components/elements";
import Header2 from "../../components/layout/header2/Header2";
import { ConfigProvider, Layout } from "antd";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_US";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setRecentActivityDataNotification } from "../../store/actions/GetUserSetting";
import VideoCallScreen from "../../components/layout/talk/videoCallScreen/VideoCallScreen";
import VideoMaxIncoming from "../../components/layout/talk/videoCallScreen/videoCallBody/VideoMaxIncoming";
import VideoOutgoing from "../../components/layout/talk/videoCallScreen/videoCallBody/VideoMaxOutgoing";
import {
  incomingVideoCallFlag,
  videoOutgoingCallFlag,
  normalizeVideoPanelFlag,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
} from "../../store/actions/VideoFeature_actions";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  meetingCount,
  setMQTTRequestUpcomingEvents,
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
// import io from "socket.io-client";
import {
  setTodoListActivityData,
  setTodoStatusDataFormSocket,
  TodoCounter,
} from "../../store/actions/ToDoList_action";
import {
  deleteCommentsMQTT,
  postComments,
} from "../../store/actions/Post_AssigneeComments";
import "./Dashboard.css";
import { NotificationBar } from "../../components/elements";
import {
  realtimeGroupStatusResponse,
  realtimeGroupResponse,
} from "../../store/actions/Groups_actions";
import {
  realtimeCommitteeResponse,
  realtimeCommitteeStatusResponse,
} from "../../store/actions/Committee_actions";
import { mqttConnection } from "../../commen/functions/mqttconnection";
import { useTranslation } from "react-i18next";
import { notifyPollingSocket } from "../../store/actions/Polls_actions";
import {
  changeMQTTJSONOne,
  changeMQQTTJSONTwo,
} from "../../commen/functions/MQTTJson";
import {
  resolutionMQTTCancelled,
  resolutionMQTTClosed,
  resolutionMQTTCreate,
} from "../../store/actions/Resolution_actions";

const Dashboard = () => {
  const location = useLocation();
  const { talkStateData, videoFeatureReducer, VideoMainReducer, assignees } =
    useSelector((state) => state);
  console.log(assignees, "meetingIdReducermeetingIdReducer");
  // const [socket, setSocket] = useState(Helper.socket);
  const navigate = useNavigate();
  let createrID = localStorage.getItem("userID");
  let currentOrganization = localStorage.getItem("organizationID");
  let currentUserName = localStorage.getItem("name");

  //Translation
  const { t } = useTranslation();

  // let createrID = 5;
  const dispatch = useDispatch();

  // for real time Notification
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  // for sub menus Icons

  //State For Meeting Data
  const [activateBlur, setActivateBlur] = useState(false);
  const [notificationID, setNotificationID] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  let Blur = localStorage.getItem("blur");

  const [currentActiveChat, setCurrentActiveChat] = useState([]);

  useEffect(() => {
    if (
      talkStateData.ActiveChatData !== undefined &&
      talkStateData.ActiveChatData !== null &&
      talkStateData.ActiveChatData.length !== 0
    ) {
      setCurrentActiveChat(talkStateData.ActiveChatData);
    } else {
      setCurrentActiveChat([]);
    }
  }, [talkStateData.ActiveChatData]);

  let newClient = Helper.socket;
  // for close the realtime Notification bar
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };

  const onMessageArrived = (msg) => {
    console.log("IncomingVideoFlag", videoFeatureReducer.IncomingVideoCallFlag);
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = JSON.parse(msg.payloadString);
    console.log(
      "Connected to MQTT broker onMessageArrived",
      JSON.parse(msg.payloadString)
    );
    if (data.action.toLowerCase() === "Meeting".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_MEETING_CREATION".toLowerCase()
      ) {
        if (data.viewable) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("NEW_MEETING_CREATION"),
              "[Place holder]",
              data.payload.meetingTitle
            ),
          });
        }
        dispatch(allMeetingsSocket(data.payload.meeting));
        setNotificationID(id);
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
              data.payload.meetingTitle
            ),
          });
        }
        dispatch(allMeetingsSocket(data.payload.meeting));
        setNotificationID(id);
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
              data.payload.meetingTitle
            ),
          });
        }
        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_STATUS_EDITED_ENDED".toLowerCase()
      ) {
        if (data.viewable) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("MEETING_STATUS_EDITED_ENDED"),
              "[Meeting Title]",
              data.payload.meetingTitle
            ),
          });
        }
        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
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
              data.payload.meetingTitle
            ),
          });
        }

        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
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
              data.payload.meetingTitle
            ),
          });
        }
        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "NEW_MEETINGS_COUNT".toLowerCase()
      ) {
        dispatch(meetingCount(data.payload));
      } else if (
        data.payload.message.toLowerCase() ===
        "NEW_UPCOMING_EVENTS".toLowerCase()
      ) {
        dispatch(setMQTTRequestUpcomingEvents(data.payload.upcomingEvents[0]));
      }
    }
    if (data.action.toLowerCase() === "TODO".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() === "NEW_TODO_CREATION".toLowerCase()
      ) {
        dispatch(setTodoListActivityData(data.payload.todoList));
        if (data.viewable) {
          setNotification({
            notificationShow: true,
            message: changeMQTTJSONOne(
              t("NEW_TODO_CREATION"),
              "[Task Title]",
              data.payload.todoTitle
            ),
          });
        }
        setNotificationID(id);
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
              data.payload.todoTitle
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
              data.payload.todoTitle
            ),
          });
          setNotificationID(id);
        }
        dispatch(setTodoStatusDataFormSocket(data.payload));
      } else if (
        data.payload.message.toLowerCase() === "NEW_TODO_DELETED".toLowerCase()
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
              data.payload.comment.todoTitle
            ),
          });
        }
        dispatch(deleteCommentsMQTT(data.payload));
        setNotificationID(id);
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
              data.payload.todoTitle
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
              data.payload.todoTitle
            ),
          });
        }
        dispatch(deleteCommentsMQTT(data.payload));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "Notification".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "USER_STATUS_EDITED".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: changeMQTTJSONOne(
            t("USER_STATUS_EDITED"),
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
        "USER_STATUS_ENABLED".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: changeMQTTJSONOne(
            t("USER_STATUS_ENABLED"),
            "[organizationName]",
            data.payload.organizationName
          ),
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "USER_ROLE_EDITED".toLowerCase()
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
          navigate("/");
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
              data.payload.committees.committeesTitle
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
              data.payload.committeeTitle
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
              data.payload.committeeTitle
            ),
          });
        }
        dispatch(realtimeCommitteeStatusResponse(data.payload));
        setNotificationID(id);
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
              data.payload.groups.groupTitle
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
              data.payload.groupTitle
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
              data.payload.groupTitle
            ),
          });
        }
        dispatch(realtimeGroupStatusResponse(data.payload));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "TALK".toLowerCase()) {
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
        data.payload.message.toLowerCase() === "NEW_GROUP_MESSAGE".toLowerCase()
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
        data.payload.message.toLowerCase() === "USER_IS_UNBLOCKED".toLowerCase()
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
        data.payload.message.toLowerCase() === "MESSAGE_UNFLAGGED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: "Message Unstarred",
        });
        dispatch(mqttUnstarMessage(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "NEW_GROUP_CREATED".toLowerCase()
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
        // setNotificationID(id)
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
        data.payload.message.toLowerCase() === "MESSAGE_DELIVERED".toLowerCase()
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

        dispatch(notifyPollingSocket(data.payload.polls));
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
        dispatch(notifyPollingSocket(data.payload.polls));
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
        dispatch(notifyPollingSocket(data.payload.polls));
        setNotificationID(id);
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
        data.payload.message.toLowerCase() === "RESOLUTION_CLOSED".toLowerCase()
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
    if (data.action.toLowerCase() === "Video".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_VIDEO_CALL_INITIATED".toLowerCase()
      ) {
        console.log("VideoFeatureIncoming Dashboard", videoFeatureReducer);
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
          console.log(
            "VideoFeatureIncoming Dashboard CallStatusTrue",
            videoFeatureReducer
          );
          dispatch(incomingVideoCallMQTT(data.payload, data.payload.message));
          dispatch(incomingVideoCallFlag(true));
          let timeValue = Number(localStorage.getItem("callRingerTimeout"));
          let callTypeID = Number(localStorage.getItem("callTypeID"));
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
          }, 500000000);
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
        let callTypeID = Number(localStorage.getItem("callTypeID"));
        dispatch(videoOutgoingCallFlag(false));
        if (callTypeID === 1) {
          dispatch(normalizeVideoPanelFlag(false));
        }
        localStorage.setItem("activeCall", false);
        localStorage.setItem("initiateVideoCall", false);
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
        setNotification({
          ...notification,
          notificationShow: true,
          message: `${data.payload.recepientName} has declined the call`,
        });
        setNotificationID(id);
        dispatch(callRequestReceivedMQTT({}, ""));
      } else if (
        data.payload.message.toLowerCase() ===
        "VIDEO_CALL_UNANSWERED".toLowerCase()
      ) {
        let callTypeID = Number(localStorage.getItem("callTypeID"));
        if (Number(data.senderID) !== Number(createrID)) {
          if (callTypeID === 1) {
            // dispatch(videoOutgoingCallFlag(false))
            // dispatch(normalizeVideoPanelFlag(false))
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
        localStorage.setItem("activeCall", false);
        localStorage.setItem("initiateVideoCall", false);
        let roomID = Number(localStorage.getItem("NewRoomID"));
        let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));
        let activeRoomID = Number(localStorage.getItem("activeRoomID"));
        console.log(
          "Current Room, New Room, Accepted Room",
          roomID,
          activeRoomID,
          acceptedRoomID
        );
        dispatch(incomingVideoCallFlag(false));
        if (activeRoomID !== acceptedRoomID) {
          dispatch(incomingVideoCallFlag(false));
          localStorage.setItem("activeRoomID", acceptedRoomID);
        }
        if (activeRoomID === acceptedRoomID) {
          if (
            videoFeatureReducer.NormalizeVideoFlag === true ||
            videoFeatureReducer.IncomingVideoCallFlag === true
          ) {
            setNotification({
              ...notification,
              notificationShow: true,
              message: `Call has been disconnected by ${data.payload.callerName}`,
            });
            setNotificationID(id);
          }
          dispatch(normalizeVideoPanelFlag(false));
          dispatch(maximizeVideoPanelFlag(false));
          dispatch(minimizeVideoPanelFlag(false));
        }
        dispatch(leaveCallModal(false));
      } else if (
        data.payload.message.toLowerCase() ===
        "VIDEO_CALL_DISCONNECTED_RECIPIENT".toLowerCase()
      ) {
        localStorage.setItem("activeCall", false);
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
        }
      }
    }
  };

  const onConnectionLost = () => {
    console.log("Connected to MQTT broker onConnectionLost");
    setTimeout(mqttConnection, 3000);
  };

  useEffect(() => {
    console.log("Connected to MQTT broker onConnectionLost useEffect");
    if (Helper.socket === null) {
      let userID = localStorage.getItem("userID");
      mqttConnection(userID);
    }
    if (newClient != null) {
      console.log("onMessageArrived 1");

      newClient.onConnectionLost = onConnectionLost;
      newClient.onMessageArrived = onMessageArrived;
    }
  }, [
    newClient,
    videoFeatureReducer.IncomingVideoCallFlag,
    videoFeatureReducer.NormalizeVideoFlag,
  ]);

  useEffect(() => {
    if (Blur != undefined) {
      console.log("Blur", Blur);
      setActivateBlur(true);
    } else {
      console.log("Blur", Blur);
      setActivateBlur(false);
    }
  }, [Blur]);

  let videoGroupPanel = localStorage.getItem("VideoPanelGroup");

  const [isVideoPanel, setVideoPanel] = useState(false);

  useEffect(() => {
    if (videoGroupPanel !== undefined) {
      setVideoPanel(videoGroupPanel);
    }
  }, [videoGroupPanel]);

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
    localStorage.setItem("activeOtoChatID", 0);
  }, []);

  console.log("VideoMainReducer", VideoMainReducer);

  let i18nextLng = localStorage.getItem("i18nextLng");

  useEffect(() => {
    setCurrentLanguage(i18nextLng);
    console.log("Current Language UseEffect", currentLanguage);
  }, [i18nextLng]);
  console.log(
    assignees.meetingcreatedashboardLoader,
    "meetingcreatedashboardLoadermeetingcreatedashboardLoader"
  );
  return (
    <>
      <ConfigProvider locale={currentLanguage === "en" ? en_US : ar_EG}>
        {videoFeatureReducer.IncomingVideoCallFlag === true && (
          <div className="overlay-incoming-videocall" />
        )}
        <Layout>
          <Sidebar />
          {location.pathname === "/DisKus/videochat" ? null : <Header2 />}
          {/* <Content className="MainContainer"> */}
          <Layout className="positionRelative">
            <NotificationBar
              iconName={<img src={IconMetroAttachment} />}
              notificationMessage={notification.message}
              notificationState={notification.notificationShow}
              setNotification={setNotification}
              handleClose={closeNotification}
              id={notificationID}
            />
            <Outlet />
            {videoFeatureReducer.IncomingVideoCallFlag === true ? (
              <VideoMaxIncoming />
            ) : null}
            {/* {videoFeatureReducer.VideoOutgoingCallFlag === true ? (
            <VideoOutgoing />
          ) : null} */}
            {videoFeatureReducer.NormalizeVideoFlag === true ||
            videoFeatureReducer.MinimizeVideoFlag === true ||
            videoFeatureReducer.MaximizeVideoFlag === true ? (
              <VideoCallScreen />
            ) : null}
            {activateBlur === false ? <Talk /> : null}

            {assignees.meetingcreatedashboardLoader && <Loader />}
          </Layout>
          {/* </Content> */}
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default Dashboard;
