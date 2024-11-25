import React, { useEffect } from "react";
import { notification } from "antd";
const Context = React.createContext({
  name: "Default",
});

const NotificationBar = ({
  iconName,
  notificationState,
  notificationMessage,
  setNotification,
  id,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const currentLanguage = localStorage.getItem("i18nextLng") || "en";
  const close = () => {
    setNotification({
      notificationShow: false,
      message: "",
    });
  };
  const openNotification = () => {
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
  };

  useEffect(() => {
    if (notificationState === true) {
      openNotification();
    } else {
      setNotification({
        notificationShow: false,
        message: "",
      });
    }
  }, [id]);

  return <>{contextHolder}</>;
};

export default NotificationBar;
