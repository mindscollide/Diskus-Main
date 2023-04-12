import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
import { _justShowDateformat } from "../../../commen/functions/date_formater";
import { setLoader } from "../../../store/actions/Auth2_actions";

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { t } = useTranslation();
  const [client, setClient] = useState(null);
  let createrID = localStorage.getItem("userID");
  let isExpiry = localStorage.getItem("isAlert");
  let remainingDays = localStorage.getItem("remainingDays");
  let dateOfExpiry = localStorage.getItem("dateOfExpiry");
  const [notificationID, setNotificationID] = useState(0);
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
  const onConnected = (newClient) => {
    console.log("Connected to MQTT broker onConnected");
    let subscribeID = createrID.toString();
    newClient.subscribe(subscribeID);
  };
  const onNotification = () => {
    console.log("Connected to MQTT broker onConnected");
  };
  const onMessageArrived = (msg) => {
    let data = JSON.parse(msg.payloadString);
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    console.log(
      "Connected to MQTT broker onMessageArrived",
      JSON.parse(msg.payloadString)
    );
    if (data.action.toLowerCase() === "Notification".toLowerCase()) {
      if (data.payload.message.toLowerCase() === "USER_STATUS_EDITED".toLowerCase()) {
        setNotification({
          notificationShow: true,
          message: `Your account status in ${data.payload.organizationName} has been changed. Please re-login again to continue working`,
        });
        dispatch(setLoader())
        setNotificationID(id)
        setTimeout(() => {
          navigate("/")
        }, 4000)
      } else if (data.payload.message.toLowerCase() === "USER_STATUS_ENABLED".toLowerCase()) {
        setNotification({
          notificationShow: true,
          message: `Great News. Now you can schedule & attend meetings for ${data.payload.organizationName} also. Please login again to do so`,
        });
        setNotificationID(id)
      } else if (data.payload.message.toLowerCase() === "USER_ROLE_EDITED".toLowerCase()) {
        setNotification({
          notificationShow: true,
          message: `Your role in ${data.payload.organizationName} has been updated. Please login again to continue working`,
        });
        setNotificationID(id)
        setTimeout(() => {
          navigate("/")
        }, 4000)
      } else if (data.payload.message.toLowerCase() === "ORGANIZATION_SUBSCRIPTION_CANCELLED".toLowerCase()) {
        setNotification({
          notificationShow: true,
          message: `Organization Subscription of ${data.payload.organizationName} has been cancelled by the Organization Admin. Try logging in after some time`,
        });
        setNotificationID(id)
        setTimeout(() => {
          navigate("/")
        }, 4000)
      } else if (data.payload.message.toLowerCase() === "ORGANIZATION_DELETED".toLowerCase()) {
        setNotification({
          notificationShow: true,
          message: `Organization  ${data.payload.OrganizationName}  has been unregistered from the System by the Organization Admin. Try logging in after some time`,
        });
        setNotificationID(id)
        setTimeout(() => {
          navigate("/")
        }, 4000)
      }
    }
  };
  const onConnectionLost = () => {
    console.log("Connected to MQTT broker onConnectionLost");
    setTimeout(mqttConnection, 3000);
  };
  const mqttConnection = () => {
    var min = 10000;
    var max = 90000;
    var id = min + Math.random() * (max - min);
    newClient = new Paho.Client("192.168.18.241", 8228, subscribeID + "-" + id);
    newClient.connect({
      // cleanSession: false,
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        onConnected(newClient)
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
    // newClient.onConnected = onConnected; // Callback when connected
    newClient.onConnectionLost = onConnectionLost; // Callback when lost connection
    // newClient.disconnectedPublishing = true; // Enable disconnected publishing
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
            _justShowDateformat(dateOfExpiry + "000000") +
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
        id={notificationID}
      />
      <Outlet />
    </>
  );
};

export default AdminHome;
