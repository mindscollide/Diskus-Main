import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Sidebar, Talk } from "../../components/layout";
import Header2 from "../../components/layout/header2/Header2";
import { Layout, message } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setRecentActivity } from "../../store/actions/GetUserSetting";
import VideoCallScreen from "../../components/layout/talk/videoCallScreen/VideoCallScreen";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
} from "../../store/actions/GetMeetingUserId";
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

const Dashboard = () => {
  const location = useLocation();
  const [client, setClient] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const { videoCall } = useSelector((state) => state);
  // const [socket, setSocket] = useState(Helper.socket);
  const navigate = useNavigate();
  const { Content } = Layout;
  let createrID = localStorage.getItem("userID");
  // let createrID = 5;
  const dispatch = useDispatch();
  const [newRecentData, setNewRecentData] = useState([]);
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
  // const onConnected = (newClient) => {
  //   console.log("Connected to MQTT broker onConnected");
  //   let subscribeID = createrID.toString();
  //   newClient.subscribe(subscribeID);
  // };
  // const onNotification = () => {
  //   console.log("Connected to MQTT broker onConnected");
  // };
  // console.log("newMeetingDatanewMeetingData", newMeetingData);

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
      if (
        data.payload.message.toLowerCase() ===
        "USER_STATUS_EDITED".toLowerCase()
      ) {
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
        setNotification({
          notificationShow: true,
          message: `Great News. Now you can schedule & attend meetings for ${data.payload.organizationName} also. Please login again to do so`,
        });
        setNotificationID(id);
      } else if (
        data.payload.message.toLowerCase() === "USER_ROLE_EDITED".toLowerCase()
      ) {
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
        setNotification({
          notificationShow: true,
          message: `The User Profile has been Updated. Try logging in after some time`,
        });
        setNotificationID(id);
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
  };

  const onConnectionLost = () => {
    console.log("Connected to MQTT broker onConnectionLost");
    setTimeout(mqttConnection, 3000);
  };

  // const mqttConnection = () => {
  //   var min = 10000;
  //   var max = 90000;
  //   var id = min + Math.random() * (max - min);
  //   newClient = new Paho.Client("192.168.18.241", 8228, subscribeID + "-" + id);
  //   newClient.connect({
  //     // cleanSession: false,
  //     onSuccess: () => {
  //       console.log("Connected to MQTT broker");
  //       onConnected(newClient);
  //     },
  //     onFailure: () => {
  //       console.log("Connected to MQTT broker onFailedConnect");
  //       setTimeout(onConnectionLost, 6000);
  //     },
  //     keepAliveInterval: 30,
  //     reconnect: true, // Enable automatic reconnect
  //   });

  //   setClient(newClient);
  // };

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

  // useEffect(() => {
  //   if (Object.keys(newRecentData).length > 0) {
  //     console.log("RecentActivityRecentActivity", newRecentData);
  //     let data = {
  //       creationDateTime: newRecentData.creationDateTime,
  //       notificationTypes: {
  //         pK_NTID: newRecentData.notificationTypes.pK_NTID,
  //         description: newRecentData.description,
  //         icon: newRecentData.notificationTypes.icon,
  //       },
  //       key: 0,
  //     };
  //     console.log("RecentActivityRecentActivity", data);
  //     dispatch(setRecentActivity(data));
  //     setNewRecentData([]);
  //   }
  // }, [newRecentData]);

  // for Todo Data socket
  // useEffect(() => {
  //   if (Object.keys(newTodoData).length > 0) {
  //     console.log("TodoActivitydataiofter", newTodoData);
  //     dispatch(setTodoListActivityData(newTodoData));
  //     setNewTodoData([]);
  //   }
  // }, [newTodoData]);

  // for Todo Data comment socket
  // useEffect(() => {
  //   if (Object.keys(newTodoDataComment).length > 0) {
  //     console.log("postComments", newTodoDataComment);
  //     if (createrID === newTodoDataComment.userID) {
  //     } else {
  //       dispatch(postComments(newTodoDataComment));
  //     }
  //     setNewTodoDataComment([]);
  //   }
  // }, [newTodoDataComment]);

  // Meeting Add andEdit from socket
  // useEffect(() => {
  //   console.log("MeetingMeetingMeetingMeeting", newMeetingData);
  //   if (Object.keys(newMeetingData).length > 0) {
  //     console.log("MeetingMeetingMeetingMeeting", newMeetingData);
  //     dispatch(allMeetingsSocket(newMeetingData));
  //     setNewMeetingData([]);
  //   }
  // }, [newMeetingData]);

  // for meeting status update from socket
  // useEffect(() => {
  //   console.log("MeetingStatusSocket", meetingStatus);
  //   if (Object.keys(meetingStatus).length > 0) {
  //     console.log("MeetingStatusSocket", meetingStatus);
  //     dispatch(getMeetingStatusfromSocket(meetingStatus));
  //     setMeetingStatus([]);
  //   }
  // }, [meetingStatus]);

  // for Todo Data comment socket
  // useEffect(() => {
  //   if (Object.keys(newTodoDataComment).length > 0) {
  //     console.log("postComments", newTodoDataComment);
  //     if (createrID === newTodoDataComment.userID) {
  //     } else {
  //       dispatch(postComments(newTodoDataComment));
  //     }

  //     setNewTodoDataComment([]);
  //   }
  // }, [newTodoDataComment]);

  const showsubTalkIcons = () => {
    setSubIcons(!subIcons);
  };

  return (
    <>
      <Layout>
        <Sidebar />
        {location.pathname === "/DisKus/videochat" ? null : <Header2 />}
        <Content className="MainContainer">
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
        </Content>
      </Layout>
    </>
  );
};

export default Dashboard;
