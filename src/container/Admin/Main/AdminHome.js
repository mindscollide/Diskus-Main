import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../../../components/layout";
import Header2 from "../../../components/layout/header2/Header2";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_US";
import AttachmentIcon from "../../../assets/images/Icon-Attachment.png";
import Helper from "../../../commen/functions/history_logout";
import { getSocketConnection } from "../../../commen/apis/Api_ends_points";
import IconMetroAttachment from "../../../assets/images/newElements/Icon metro-attachment.svg";
import {
  Loader,
  NotificationBar,
  Subscriptionwarningline,
} from "../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Paho from "paho-mqtt";
import { getPackageExpiryDetail } from "../../../store/actions/GetPackageExpirtyDetails";
import { _justShowDateformat } from "../../../commen/functions/date_formater";
import { setLoader } from "../../../store/actions/Auth2_actions";
import { mqttConnection } from "../../../commen/functions/mqttconnection";
import { ConfigProvider } from "antd";
// import { GetSubscriptionPackages } from "../../../store/reducers";

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  // settingReducer.Loading;
  const location = useLocation();
  const { GetSubscriptionPackage, settingReducer, UserReportReducer } = state;
  const [currentLanguge, setCurrentLanguage] = useState("en");
  const { t } = useTranslation();
  const [client, setClient] = useState(null);
  let createrID = localStorage.getItem("userID");
  let isExpiry = localStorage.getItem("isAlert");
  let color = localStorage.getItem("color");
  let roleID = JSON.parse(localStorage.getItem("roleID"));
  let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
  let remainingDays = localStorage.getItem("remainingDays");
  let currentLanguageSelect = localStorage.getItem("i18nextLng");
  let dateOfExpiry = localStorage.getItem("dateOfExpiry");
  const [notificationID, setNotificationID] = useState(0);
  // let subscribeID = createrID!=null&&createrID!=undefined?createrID.toString():0;
  const [notification, setNotification] = useState({
    notificationShow: false,
    message: "",
  });
  let newClient = Helper.socket;
  const closeNotification = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };
  useEffect(() => {
    setCurrentLanguage(currentLanguageSelect);
  }, [currentLanguageSelect]);

  console.log("location.pathname", location.pathname);

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
      if (
        data.payload.message.toLowerCase() ===
        "USER_STATUS_EDITED".toLowerCase()
      ) {
        setNotification({
          notificationShow: true,
          message: `Your account status in ${data.payload.organizationName} has been changed. Please re-login again to continue working`,
        });
        dispatch(setLoader());
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
          dispatch(setLoader());
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
          message: `Organization  ${data.payload.OrganizationName}  has been unregistered from the System by the Organization Admin. Try logging in after some time`,
        });
        setNotificationID(id);
        setTimeout(() => {
          navigate("/");
        }, 4000);
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
      // newClient.onConnected = onConnected; // Callback when connected
      newClient.onConnectionLost = onConnectionLost; // Callback when lost connection
      // newClient.disconnectedPublishing = true; // Enable disconnected publishing
      newClient.onMessageArrived = onMessageArrived;
    }
  }, []);

  // useEffect(() => {
  //   mqttConnection();
  //   // newClient.onConnected = onConnected; // Callback when connected
  //   newClient.onConnectionLost = onConnectionLost; // Callback when lost connection
  //   // newClient.disconnectedPublishing = true; // Enable disconnected publishing
  //   newClient.onMessageArrived = onMessageArrived;
  // }, []);
  useEffect(() => {
    if (roleID !== 3) {
      dispatch(getPackageExpiryDetail(navigate, JSON.parse(OrganizationID), t));
    }
  }, []);
  useEffect(() => {
    console.log(
      "isExpiry color",
      GetSubscriptionPackage.getPackageExpiryDetailResponse
    );
  }, [GetSubscriptionPackage.getPackageExpiryDetailResponse]);

  return (
    <>
      <ConfigProvider locale={currentLanguge === "en" ? en_US : ar_EG}>
        <Header2 />
        {isExpiry === "true" &&
        isExpiry !== null &&
        isExpiry !== undefined &&
        remainingDays > 0 &&
        remainingDays !== null &&
        remainingDays !== undefined ? (
          <Subscriptionwarningline
            color={color}
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
          iconName={<img draggable="false" src={IconMetroAttachment} />}
          notificationMessage={notification.message}
          notificationState={notification.notificationShow}
          setNotification={setNotification}
          handleClose={closeNotification}
          id={notificationID}
        />
        <Outlet />
        {settingReducer.Loading || UserReportReducer.Loading ? (
          <Loader />
        ) : null}
      </ConfigProvider>
    </>
  );
};

export default AdminHome;
