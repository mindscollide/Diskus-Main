import React, { useMemo, useState, useEffect } from "react";
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import DiskusLogo from "../../../assets/images/newElements/Diskus_newLogo.svg";

import { Button, Divider, notification, Space } from "antd";

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

  // const [notificationTrue, setNotificationTrue] = useState(notificationState);
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
    // if(notificationMessage !== "") {
    //   openNotification();
    // }

    if (notificationState === true) {
      openNotification();
    } else {
      setNotification({
        notificationShow: false,
        message: "",
      });
    }
  }, [id]);

  return (
    // <Context.Provider value={contextValue}>
    <>
      {contextHolder}
      {/* <RadiusBottomleftOutlined /> */}
    </>
  );
};

export default NotificationBar;
