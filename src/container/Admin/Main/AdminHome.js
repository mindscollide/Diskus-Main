import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavbarAdmin } from "../../../components/layout";
import Header2 from "../../../components/layout/header2/Header2";
import io from "socket.io-client";
import Helper from "../../../commen/functions/history_logout";
import { getSocketConnection } from "../../../commen/apis/Api_ends_points";
import { Subscriptionwarningline } from "../../../components/elements";

const AdminHome = () => {
  const [socket, setSocket] = useState(Helper.socket);
  console.log(socket, "socketsocket");
  let createrID = localStorage.getItem("userID");
  let isExpiry = localStorage.getItem("isAlert")
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
  useEffect(() => {
    if (socket != null) {
      socket.on("RecentActivity", (object) => {
        // let RecentActivityJSON = JSON.stringify(object)
        console.log("RecentActivitydatadashboard", object);
      });
      socket.on("Meeting", (object) => {
        console.log("MeetingMeetingMeetingMeeting", object);
      });
      socket.on("MeetingStatus", (object) => {
        console.log("MeetingStatusSocket", object);
      });
      socket.on("Todo", (object) => {
        console.log("Todorecentactivity", object);
      });
      socket.on("Comment", (object) => {
        console.log("Comment", object);
      });
      return () => {
        socket.off("RecentActivity");
        socket.off("Meeting");
        socket.off("MeetingStatus");
        socket.off("Comment");
        socket.off("Todo");
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
      <Header2 />
      {isExpiry ? <Subscriptionwarningline text={"You have reached the allowed limit"} /> : null}

      <NavbarAdmin />
      <Outlet />
    </>
  );
};

export default AdminHome;
