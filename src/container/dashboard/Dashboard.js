import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Sidebar, Talk } from "../../components/layout";
import Header2 from "../../components/layout/header2/Header2";
import { Layout, message } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setRecentActivityDataNotification } from "../../store/actions/GetUserSetting";
import VideoCallScreen from "../../components/layout/talk/videoCallScreen/VideoCallScreen";
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
  InsertOTOMessages,
} from "../../store/actions/Talk_action";
import Paho from "paho-mqtt";
import Helper from "../../commen/functions/history_logout";
import IconMetroAttachment from "../../assets/images/newElements/Icon metro-attachment.svg";
import { GetNotes } from "../../store/actions/Notes_actions";
// import io from "socket.io-client";
import { Col, Row, Container } from "react-bootstrap";
import { getSocketConnection } from "../../commen/apis/Api_ends_points";
import {
  setTodoListActivityData,
  setTodoStatusDataFormSocket,
  TodoCounter,
} from "../../store/actions/ToDoList_action";
import { postComments } from "../../store/actions/Post_AssigneeComments";
import "./Dashboard.css";
import AttachmentIcon from "../../assets/images/Icon-Attachment.png";
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
import { realtimeNotificationRecent } from "../../store/actions/RealtimeNotification_actions";
import { useTranslation } from "react-i18next";
import numeral from "numeral";
import "numeral/locales";
import { notifyPollingSocket } from "../../store/actions/Polls_actions";

const Dashboard = () => {
  const location = useLocation();
  const [client, setClient] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);

  const { videoCall } = useSelector((state) => state);
  // const [socket, setSocket] = useState(Helper.socket);
  const navigate = useNavigate();
  const { Content } = Layout;
  let createrID = localStorage.getItem("userID");

  //Translation
  const { t } = useTranslation();

  // let createrID = 5;
  const dispatch = useDispatch();
  const [newRecentData, setNewRecentData] = useState({
    creationDateTime: "",
    notificationTypes: {
      pK_NTID: 0,
      description: "",
      icon: "",
    },
    key: 0,
  });
  const [newTodoData, setNewTodoData] = useState([]);
  const [newTodoDataComment, setNewTodoDataComment] = useState([]);
  const [meetingStatus, setMeetingStatus] = useState([]);
  let subscribeID =
    createrID != null && createrID != undefined ? createrID.toString() : "";
  let RandomNumber = Math.random();
  console.log(RandomNumber, "RandomNumberRandomNumberRandomNumber");
  // for real time Notification
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(false);

  //State For Meeting Data
  const [newMeetingData, setNewMeetingData] = useState([]);
  const [activateBlur, setActivateBlur] = useState(false);
  const [notificationID, setNotificationID] = useState(0);

  let Blur = localStorage.getItem("blur");

  let newClient = Helper.socket;
  // for close the realtime Notification bar
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };

  const onMessageArrived = (msg) => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    let data = JSON.parse(msg.payloadString);
    console.log("onMessageArrived 2", data.payload);
    console.log(
      "Connected to MQTT broker onMessageArrived",
      JSON.parse(msg.payloadString)
    );
    console.log(
      data.payload.message === "NEW_MEETTING_CREATION_RECENT_ACTIVITY",
      data.payload.message,
      "setRecentActivityDataNotification"
    );
    if (data.action.toLowerCase() === "Meeting".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_MEETING_CREATION".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `You have been added as a ${data.payload.meetingTitle} Role in a new Meeting. Refer to Meeting List for details`,
        });
        dispatch(allMeetingsSocket(data.payload.meeting));
        // dispatch(setTodoListActivityData(data.payload.message + data.payload.meetingTitle))
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_EDITED_HOST".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Meeting ${data.payload.meeting.MeetingTitle} has been updated. Refer to Meeting List for details`,
        });
        dispatch(allMeetingsSocket(data.payload.meeting));
        // dispatch(setTodoListActivityData(data.payload.message + data.payload.meeting.meetingTitle))
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_STATUS_EDITED_STARTED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Meeting  ${data.payload.MeetingTitle} has been Started. Refer to Meeting List for details`,
        });
        dispatch(getMeetingStatusfromSocket(data.payload));
        // dispatch(setTodoListActivityData(data.payload.message + data.payload.meetingTitle))
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_STATUS_EDITED_ENDED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Meeting ${data.payload.MeetingTitle} has been Ended. Refer to Meeting List for details`,
        });
        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_STATUS_EDITED_CANCELLED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Meeting ${data.payload.MeetingTitle} has been Cancelled. Refer to Meeting List for details`,
        });
        dispatch(getMeetingStatusfromSocket(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "MEETING_STATUS_EDITED_ADMIN".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Meeting ${data.payload.meetingTitle} has been Changed By Admin. Refer to Meeting List for details`,
        });
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
        console.log("NEW_UPCOMING123", data.payload.message);
        dispatch(setMQTTRequestUpcomingEvents(data.payload.upcomingEvents[0]));
      }
    }
    if (data.action.toLowerCase() === "TODO".toLowerCase()) {
      setNotification({
        ...notification,
        notificationShow: true,
        message: data.payload.message,
      });

      if (
        data.payload.message.toLowerCase() === "NEW_TODO_CREATION".toLowerCase()
      ) {
        dispatch(setTodoListActivityData(data.payload.todoList));
        // dispatch(setRecentActivityDataNotification(data.payload.message + "To-Do List"))
        setNotification({
          notificationShow: true,
          message: `New Task has been assigned to you. Refer to To-Do List for details`,
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "TDOD_STATUS_EDITED".toLowerCase()
      ) {
        dispatch(setTodoStatusDataFormSocket(data.payload));
        setNotification({
          notificationShow: true,
          message: `Task ${data.payload.todoTitle} has been updated. Refer to To-Do List for details`,
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "NEW_TODO_DELETED".toLowerCase()
      ) {
      } else if (
        data.payload.message.toLowerCase() === "NEW_TODO_COUNT".toLowerCase()
      ) {
        console.log("setRecentActivityDataNotification", data.payload);
        dispatch(TodoCounter(data.payload));
      }
    }
    if (data.action.toLowerCase() === "COMMENT".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_COMMENT_CREATION".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `${data.payload.comment.userName} has commented on Task ${data.payload.comment.todoTitle}. Refer to To-Do List for details`,
        });
        dispatch(postComments(data.payload.comment));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "Notification".toLowerCase()) {
      console.log(
        "testing",
        data.payload.message.toLowerCase(),
        "NEW_TODO_CREATION_RECENT_ACTIVITY".toLowerCase(),
        data.payload.message.toLowerCase() ===
          "NEW_TODO_CREATION_RECENT_ACTIVITY".toLowerCase()
      );
      console.log("testing", data.payload.message);
      console.log(
        data.payload.message === "NEW_MEETTING_CREATION_RECENT_ACTIVITY",
        "checkingsetRecentActivityDataNotification"
      );
      if (
        data.payload.message.toLowerCase() ===
        "USER_STATUS_EDITED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `Your account status in ${data.payload.organizationName} has been changed. Please re-login again to continue working`,
        });
        setNotificationID(id);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else if (
        data.payload.message.toLowerCase() ===
        "USER_STATUS_ENABLED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `Great News. Now you can schedule & attend meetings for ${data.payload.organizationName} also. Please login again to do so`,
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "USER_ROLE_EDITED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `Your role in ${data.payload.organizationName} has been updated. Please login again to continue working`,
        });
        setNotificationID(id);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else if (
        data.payload.message.toLowerCase() ===
        "ORGANIZATION_SUBSCRIPTION_CANCELLED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `Organization Subscription of ${data.payload.organizationName} has been cancelled by the Organization Admin. Try logging in after some time`,
        });
        setNotificationID(id);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else if (
        data.payload.message.toLowerCase() ===
        "ORGANIZATION_DELETED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `Organization  ${data.payload.organizationName}  has been unregistered from the System by the Organization Admin. Try logging in after some time`,
        });
        setNotificationID(id);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else if (
        data.payload.message.toLowerCase() ===
        "USER_PROFILE_EDITED".toLowerCase()
      ) {
        console.log("testing", data.payload.message);

        setNotification({
          notificationShow: true,
          message: `The User Profile has been Updated. Try logging in after some time`,
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "NEW_TODO_CREATION_RECENT_ACTIVITY".toLowerCase()
      ) {
        console.log("setRecentActivityDataNotification", data.payload);
        // let data1=[...data.payload]
        // if(Object.keys(data1).length>0){
        //   setNewRecentData(...data1)

        // }
        if (data.payload) {
          let data2 = {
            creationDateTime: data.payload.creationDateTime,
            notificationTypes: {
              pK_NTID: data.payload.notificationStatusID,
              description: "The New Todo Creation",
              icon: "",
            },
            key: 0,
          };
          dispatch(setRecentActivityDataNotification(data2));
          // setNewRecentData({
          //   ...newRecentData,
          //   creationDateTime: data.payload.creationDateTime,
          //   notificationTypes: {
          //     pK_NTID: data.payload.notificationStatusID,
          //     description: "The New Todo Creation",
          //     icon: "",
          //   },
          //   key: 0,
          // })
        }
        // let data2
        // try {
        //   data2 = {
        //     creationDateTime: data.payload.creationDateTime,
        //     notificationTypes: {
        //       pK_NTID: data.payload.notificationStatusID,
        //       description: "The New Todo Creation",
        //       icon: "",
        //     },
        //     key: 0,
        //   };

        // } catch {
        //   console.log("error123")
        // }

        // dispatch(setRecentActivityDataNotification(data))
      } else if (
        data.payload.message.toLowerCase() ===
        "NEW_MEETTING_CREATION_RECENT_ACTIVITY".toLowerCase()
      ) {
        console.log("setRecentActivityDataNotification", data.payload);
        if (data.payload) {
          let data2 = {
            creationDateTime: data.payload.creationDateTime,
            notificationTypes: {
              pK_NTID: data.payload.notificationStatusID,
              description: "The New Meeting Creation",
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
      }
    }
    if (data.action.toLowerCase() === "Committee".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_COMMITTEE_CREATION".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `You have been added as a member in Committee ${data.payload.committees.committeesTitle}`,
        });
        dispatch(realtimeCommitteeResponse(data.payload.committees));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "COMMITTTEE_STATUS_EDITED_IN_ACTIVE".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `Committee ${data.payload.committeeTitle} in which you are a member has been set as In-Active`,
        });
        dispatch(realtimeCommitteeStatusResponse(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "COMMITTTEE_STATUS_EDITED_ARCHIVED".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `Committee ${data.payload.committeeTitle} in which you are a member has been dissolved by the committee head`,
        });
        dispatch(realtimeCommitteeStatusResponse(data.payload));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "Group".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_GROUP_CREATION".toLowerCase()
      ) {
        console.log("onMessageArrived 2", data.payload);

        setNotification({
          notificationShow: true,
          message: `You have been added as a member in Group  ${data.payload.groups.groupTitle}`,
        });
        dispatch(realtimeGroupResponse(data.payload.groups));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "GROUP_STATUS_EDITED_IN-ACTIVE".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `Group ${data.payload.groupTitle} in which you are a member has been set as In-Active`,
        });
        dispatch(realtimeGroupStatusResponse(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() ===
        "GROUP_STATUS_EDITED_ARCHIVED".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `Group ${data.payload.groupTitle} in which you are a member has been dissolved by the group head`,
        });
        dispatch(realtimeGroupStatusResponse(data.payload));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "TALK".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_ONE_TO_ONE_MESSAGE".toLowerCase()
      ) {
        console.log("NEW_ONE_TO_ONE_MESSAGE", data.payload.data);
        if (data.payload.data[0].senderID !== parseInt(createrID)) {
          setNotification({
            ...notification,
            notificationShow: true,
            message: `You have received a new message from ${data.payload.data[0].senderName}`,
          });
        }
        dispatch(mqttInsertOtoMessage(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "NEW_GROUP_MESSAGE".toLowerCase()
      ) {
        console.log("NEW_GROUP_MESSAGE", data.payload.data);
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
        console.log("USER_IS_BLOCKED", data.payload.data);
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
        console.log("MQTT_UNBLOCK_USER", data.payload.data);
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
        console.log("MESSAGE_FLAGGED", data.payload.data);
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
        console.log("MESSAGE_UNFLAGGED", data.payload.data);
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
        console.log("NEW_GROUP_CREATED", data.payload.data);
        setNotification({
          ...notification,
          notificationShow: true,
          message: `You have been added in a group ${data.payload.data[0].fullName}`,
        });
        dispatch(mqttGroupCreated(data.payload));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "GROUP_MODIFIED".toLowerCase()
      ) {
        console.log("GROUP_MODIFIED", data.payload.data);
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
        console.log("UNREAD_MESSAGES_COUNT", data.payload.data);
        // setNotification({
        //   ...notification,
        //   notificationShow: true,
        //   message: `UNREAD_MESSAGES_COUNT`,
        // })
        dispatch(mqttUnreadMessageCount(data.payload));
        // setNotificationID(id)
      } else if (
        data.payload.message.toLowerCase() ===
        "NEW_BROADCAST_MESSAGE".toLowerCase()
      ) {
        console.log("NEW_BROADCAST_MESSAGE", data.payload.data);
        setNotification({
          ...notification,
          notificationShow: true,
          message: `You have sent a message in broadcast list ${data.payload.data[0].broadcastName}`,
        });
        dispatch(mqttInsertBroadcastMessage(data.payload));
        setNotificationID(id);
      }
    }
    if (data.action.toLowerCase() === "Polls".toLowerCase()) {
      if (
        data.payload.message.toLowerCase() ===
        "NEW_POLL_PUBLISHED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `A new Poll ${data.payload.pollTitle} is published for your review..`,
        });
        console.log(data.payload);
        dispatch(notifyPollingSocket(data.payload.polls));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "POLL_UPDATED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `The Poll ${data.payload.pollTitle} has been updated`,
        });
        dispatch(notifyPollingSocket(data.payload.polls));
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "POLL_EXPIRED".toLowerCase()
      ) {
        setNotification({
          ...notification,
          notificationShow: true,
          message: `Due date of Poll ${data.payload.pollTitle} has passed.`,
        });
        dispatch(notifyPollingSocket(data.payload.polls));
        setNotificationID(id);
      }
    }
  };

  // const [retryCount, setRetryCount] = useState(0)

  const onConnectionLost = () => {
    console.log("Connected to MQTT broker onConnectionLost");
    setTimeout(mqttConnection, 3000);
  };

  // console.log('mqttConnectionmqttConnectionmqttConnection', mqttConnection)

  // let messageSendingJson = localStorage.getItem('messageArray')

  //   let interval
  //   const maxRetries = 5

  //   const fetchData = async () => {
  //     const response = await dispatch(
  //       InsertOTOMessages(navigate, messageSendingJson, null, t),
  //     )

  //     // Check if response is successful
  //     if (response.success) {
  //       clearInterval(interval)
  //       return
  //     }

  //     // Check if maximum retries reached
  //     if (retryCount >= maxRetries) {
  //       clearInterval(interval)
  //       console.log('Maximum retries reached. Stopping API calls.')
  //       return
  //     }

  //     // Increment retry count
  //     setRetryCount(retryCount + 1)
  //   }

  //   // Initial API call
  //   fetchData()

  //   interval = setInterval(fetchData, 4000)

  //   // Stop hitting the API after 20 seconds
  //   setTimeout(() => {
  //     clearInterval(interval)
  //   }, 20000)

  //   // Clean up the interval on component unmount
  //   return () => {
  //     clearInterval(interval)
  //   }

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
  }, [newClient]);

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

  const showsubTalkIcons = () => {
    setSubIcons(!subIcons);
  };

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

  return (
    <>
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
          {videoCall.openVideoCall === true && (
            <VideoCallScreen
            // openVideoScreen={videoCall.openVideoCall}
            // closeButtonVideoCallFunc={() => videoHandlerforInisiateCall(false)}
            />
          )}

          {videoCall.openGroupVideopanel === true || isVideoPanel ? (
            <VideoCallScreen
            // openVideoScreen={videoCall.openVideoCall}
            // closeButtonVideoCallFunc={() => videoHandlerforInisiateCall(false)}
            />
          ) : null}

          {activateBlur === false ? <Talk /> : null}
        </Layout>
        {/* </Content> */}
      </Layout>
    </>
  );
};

export default Dashboard;
