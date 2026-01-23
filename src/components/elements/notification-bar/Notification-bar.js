import React, { memo, useEffect, useRef } from "react";
import { notification } from "antd";

const Context = React.createContext({
  name: "Default",
});

const NotificationBar = memo(
  ({
    iconName,
    notificationState,
    notificationMessage,
    setNotification,
    id,
  }) => {
    const [api, contextHolder] = notification.useNotification();
    const currentLanguage = localStorage.getItem("i18nextLng") || "en";

    const lastMessageRef = useRef(""); // keep track of last shown message

    const close = () => {
      setNotification({
        notificationShow: false,
        message: "",
      });
      lastMessageRef.current = ""; // reset last message on close
    };

    const openNotification = () => {
      // Only show notification if it's a new message
      if (
        notificationMessage &&
        lastMessageRef.current !== notificationMessage
      ) {
        lastMessageRef.current = notificationMessage;

        api.info({
          description: (
            <Context.Consumer>
              {({ name }) => `${notificationMessage}`}
            </Context.Consumer>
          ),
          className: "MQTT_Notification",
          placement: currentLanguage === "en" ? "bottomLeft" : "bottomRight",
          duration: 4,
          icon: iconName,
          onClose: close,
        });
      }
    };

    useEffect(() => {
      if (notificationState) {
        openNotification();
      } else {
        close();
      }
    }, [id, notificationState, notificationMessage]); // watch all relevant props

    return <>{contextHolder}</>;
  },
);

export default NotificationBar;
