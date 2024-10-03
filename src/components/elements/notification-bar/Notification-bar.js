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

  const close = () => {
    console.log(
      "Notification was closed. Either the close button was clicked or duration time elapsed."
    );
    setNotification({
      notificationShow: false,
      message: "",
    });
  };
  const openNotification = () => {
    console.log(
      "Notification was closed. Either the close button was clicked or duration time elapsed."
    );
    api.info({
      message: notificationMessage,
      description: (
        <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>
      ),
      classname: "custom-notification-antdesign",
      placement: "bottomLeft",
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
