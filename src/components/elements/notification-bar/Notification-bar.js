import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";

import { Button, Divider, notification, Space } from "antd";

import React, { useMemo } from "react";

const Context = React.createContext({
  name: "Default",
});

const NotificationBar = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement) => {
    api.info({
      message: `Notification ${placement}`,
      description: (
        <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>
      ),
      placement,
      duration: 0,
    });
  };

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Space>
        <Button type="primary" onClick={() => openNotification("bottomLeft")}>
          <RadiusBottomleftOutlined />
          bottomLeft
        </Button>
      </Space>
    </Context.Provider>
  );
};

export default NotificationBar;
