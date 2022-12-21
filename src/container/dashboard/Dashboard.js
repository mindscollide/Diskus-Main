import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Header, Sidebar, Talk } from "../../components/layout";
import Header2 from "../../components/layout/header2/Header2";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { setRecentActivity } from "../../store/actions/GetUserSetting";
import {
  allMeetingsSocket,
  getMeetingStatusfromSocket,
} from "../../store/actions/GetMeetingUserId";
import Helper from "../../commen/functions/history_logout";
import io from "socket.io-client";
import { Col, Row, Container } from "react-bootstrap";
import { getSocketConnection } from "../../commen/apis/Api_ends_points";
import { setTodoListActivityData } from "../../store/actions/ToDoList_action";
import { postComments } from "../../store/actions/Post_AssigneeComments";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [socket, setSocket] = useState(Helper.socket);
  const { Content } = Layout;
  let createrID = localStorage.getItem("UserID");
  const dispatch = useDispatch();
  const [newRecentData, setNewRecentData] = useState([]);
  const [newTodoData, setNewTodoData] = useState([]);
  const [newTodoDataComment, setNewTodoDataComment] = useState([]);
  const [meetingStatus, setMeetingStatus] = useState([]);

  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(false);

  //State For Meeting Data
  const [newMeetingData, setNewMeetingData] = useState([]);

  useEffect(() => {
    if (Object.keys(newRecentData).length > 0) {
      console.log("RecentActivityRecentActivity", newRecentData);
      let data = {
        creationDateTime: newRecentData.creationDateTime,
        notificationTypes: {
          pK_NTID: newRecentData.notificationTypes.pK_NTID,
          description: newRecentData.description,
          icon: newRecentData.notificationTypes.icon,
        },
        key: 0,
      };
      console.log("RecentActivityRecentActivity", data);
      dispatch(setRecentActivity(data));
      setNewRecentData([]);
    }
  }, [newRecentData]);

  // for Todo Data socket
  useEffect(() => {
    if (Object.keys(newTodoData).length > 0) {
      console.log("TodoActivitydataiofter", newTodoData);
      dispatch(setTodoListActivityData(newTodoData));
      setNewTodoData([]);
    }
  }, [newTodoData]);

  // for Todo Data comment socket
  useEffect(() => {
    if (Object.keys(newTodoDataComment).length > 0) {
      console.log("postComments", newTodoDataComment);
      if (createrID === newTodoDataComment.userID) {
      } else {
        dispatch(postComments(newTodoDataComment));
      }

      setNewTodoDataComment([]);
    }
  }, [newTodoDataComment]);

  // Meeting Add andEdit from socket
  useEffect(() => {
    console.log("MeetingMeetingMeetingMeeting", newMeetingData);
    if (Object.keys(newMeetingData).length > 0) {
      console.log("MeetingMeetingMeetingMeeting", newMeetingData);
      dispatch(allMeetingsSocket(newMeetingData));
      setNewMeetingData([]);
    }
  }, [newMeetingData]);

  // for meeting status update from socket
  useEffect(() => {
    console.log("MeetingStatusSocket", meetingStatus);
    if (Object.keys(meetingStatus).length > 0) {
      console.log("MeetingStatusSocket", meetingStatus);
      dispatch(getMeetingStatusfromSocket(meetingStatus));
      setMeetingStatus([]);
    }
  }, [meetingStatus]);

  // for Todo Data comment socket
  useEffect(() => {
    if (Object.keys(newTodoDataComment).length > 0) {
      console.log("postComments", newTodoDataComment);
      if (createrID === newTodoDataComment.userID) {
      } else {
        dispatch(postComments(newTodoDataComment));
      }

      setNewTodoDataComment([]);
    }
  }, [newTodoDataComment]);

  // new connection stablish on refresh page of socket
  useEffect(() => {
    let count = 0;
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      if (count === 0) {
        count = 1;
        const newSocket = io.connect(getSocketConnection, {
          query: {
            userID: createrID,
          },
        });
        Helper.socket = newSocket;
        setSocket(newSocket);
        console.log("RecentActivitydatarefreshRecentActivitydatarefresh page");
      }
    }
  }, []);

  const showsubTalkIcons = () => {
    setSubIcons(!subIcons);
  };

  useEffect(() => {
    if (socket != null) {
      socket.on("RecentActivity", (object) => {
        // let RecentActivityJSON = JSON.stringify(object)
        console.log("RecentActivitydatadashboard", object);
        if (object != "Meeting" && Object.keys(object).length > 0) {
          setNewRecentData(JSON.parse(object));
        }
      });
      socket.on("Meeting", (object) => {
        console.log(
          "MeetingMeetingMeetingMeeting",
          object,
          Object.keys(object).length > 0
        );
        if (object != "Meeting" && Object.keys(object).length > 0) {
          console.log(
            "MeetingMeetingMeetingMeeting",
            object,
            JSON.parse(object)
          );
          setNewMeetingData(JSON.parse(object));
        }
      });
      socket.on("MeetingStatus", (object) => {
        console.log(
          "MeetingStatusSocket",
          object,
          Object.keys(object).length > 0
        );
        if (object != "Meeting" && Object.keys(object).length > 0) {
          console.log("MeetingStatusSocket", object, JSON.parse(object));
          setMeetingStatus(JSON.parse(object));
        }
      });
      socket.on("Todo", (object) => {
        console.log("Todorecentactivity", object);
        if (Object.keys(object).length > 0) {
          setNewTodoData(JSON.parse(object));
        }
      });
      socket.on("Comment", (object) => {
        console.log("Comment", object);
        if (Object.keys(object).length > 0) {
          setNewTodoDataComment(JSON.parse(object));
        }
      });
      return () => {
        socket.off("RecentActivity");
        socket.off("Meeting");
        socket.off("MeetingStatus");
        socket.off("Comment");
        socket.off("Todo");
        // socket.off("pong");
      };
    }
  }, [socket]);

  // for socket conection and reconnect
  useEffect(() => {
    if (socket != null) {
      socket.on("connect", () => {
        console.log("socket1", socket.id);
        console.log(
          "RecentActivitydatarefreshRecentActivitydatarefresh connect"
        );
      });
      socket.on("connect_error", (error) => {
        setTimeout(() => {
          socket.io.opts.query = {
            userID: createrID,
          };
          socket.connect();
        }, 1000);

        console.log(
          "RecentActivitydatarefreshRecentActivitydatarefresh connect_error",
          error
        );
      });
      socket.on("reconnect_attempt", () => {
        setTimeout(() => {
          socket.io.opts.query = {
            userID: createrID,
          };
          socket.connect();
        }, 1000);
      });
      socket.on("reconnect", () => {
        socket.io.opts.query = {
          userID: createrID,
        };
        socket.connect();
      });
      socket.on("disconnecting", () => {
        socket.io.opts.query = {
          userID: createrID,
        };
        socket.connect();
      });
      socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          socket.io.opts.query = {
            userID: createrID,
          };
          socket.connect();
        }
      });
      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  return (
    <>
      {/* <Container fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="m-0 p-0">
            {location.pathname === "/DisKus/videochat" ? null : <Header2 />}
          </Col>
        </Row>

        <Row className="dashboard-row">
          <Col className="p-0 m-0">
            <Sidebar />
          </Col>
          <Col
            xs={10}
            sm={10}
            md={10}
            lg={10}
            xl={10}
            className="Dashboard-Content mx-auto m-0 p-0"
          >
            <Outlet />
          </Col>
          <Col xs sm md={1} lg={1} xl={1} className="talk-icons-container">
            <Talk />
          </Col>
        </Row>
      </Container> */}

      <Layout>
        <Sidebar />
        {location.pathname === "/DisKus/videochat" ? null : <Header2 />}
        <Content className="MainContainer">
          <Layout className="positionRelative">
            <Outlet />
            <Talk />
          </Layout>
        </Content>
      </Layout>
    </>
  );
};

export default Dashboard;
