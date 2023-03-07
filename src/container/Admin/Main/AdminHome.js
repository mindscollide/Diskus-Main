import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavbarAdmin } from "../../../components/layout";
import Header2 from "../../../components/layout/header2/Header2";
import AttachmentIcon from "../../../assets/images/Icon-Attachment.png";
import Helper from "../../../commen/functions/history_logout";
import { getSocketConnection } from "../../../commen/apis/Api_ends_points";
import IconMetroAttachment from '../../../assets/images/newElements/Icon metro-attachment.svg'
import { NotificationBar, Subscriptionwarningline } from "../../../components/elements";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Paho from "paho-mqtt";
import { getPackageExpiryDetail } from "../../../store/actions/GetPackageExpirtyDetails";

const AdminHome = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [client, setClient] = useState(null);
  let createrID = localStorage.getItem("userID");
  let isExpiry = localStorage.getItem("isAlert");
  let remainingDays = localStorage.getItem("remainingDays");
  let dateOfExpiry = localStorage.getItem("dateOfExpiry");
  let subscribeID = createrID.toString();
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  let newClient;
  Helper.socket = newClient;
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };
  const onConnected = () => {
    console.log("Connected to MQTT broker onConnected");
  };
  const onNotification = () => {
    console.log("Connected to MQTT broker onConnected");
  };
  const onMessageArrived = (msg) => {
    let data = JSON.parse(msg.payloadString);
    console.log(
      "Connected to MQTT broker onMessageArrived",
      JSON.parse(msg.payloadString)
    );
    // if(data.)
    setNotification({
      ...notification,
      notificationShow: true,
      message: data.payload.message,
    });
  };
  const onConnectionLost = () => {
    console.log("Connected to MQTT broker onConnectionLost");
    setTimeout(mqttConnection, 3000);
  };
  const mqttConnection = () => {
    newClient = new Paho.Client("192.168.18.241", 8228, subscribeID);
    newClient.connect({
      cleanSession: false,
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        let subscribeID = createrID.toString();
        newClient.subscribe(subscribeID);
      },
      onFailure: () => {
        console.log("Connected to MQTT broker onFailedConnect");
        setTimeout(onConnectionLost, 6000);
      },
      keepAliveInterval: 30,
      reconnect: true, // Enable automatic reconnect
    });

    setClient(newClient);
  };
  useEffect(() => {
    mqttConnection();
    newClient.onConnected = onConnected; // Callback when connected
    newClient.onConnectionLost = onConnectionLost; // Callback when lost connection
    newClient.disconnectedPublishing = true; // Enable disconnected publishing
    newClient.onMessageArrived = onMessageArrived;
  }, []);
  return (
    <>
      <Header2 />
      {isExpiry &&
      isExpiry != undefined &&
      remainingDays > 0 &&
      remainingDays != undefined ? (
        <Subscriptionwarningline
          text={
            t("Subscription-package-expiry") +
            " " +
            moment(dateOfExpiry).format("Do MMM, YYYY") +
            " " +
            t("after") +
            " " +
            parseInt(remainingDays) +
            " " +
            t("days")
          }
        />
      ) : null}
      <NavbarAdmin />
      <NotificationBar
        iconName={<img src={IconMetroAttachment} />}
        notificationMessage={notification.message}
        notificationState={notification.notificationShow}
        setNotification={setNotification}
        handleClose={closeNotification}
      />
      <Outlet />
    </>
  );
};

export default AdminHome;
