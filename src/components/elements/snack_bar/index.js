import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { notification } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./Snack_bar.css";

const Notification = React.memo(({ open, setOpen }) => {
  const { open: isOpen, message, severity = "info" } = open;
  const icons = {
    success: <CheckCircleOutlined style={{ color: "#4CAF50" }} />,
    error: <ExclamationCircleOutlined style={{ color: "#f5222d" }} />,
    info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
    warning: <WarningOutlined style={{ color: "#faad14" }} />,
  };
  console.log(open, "openopen");
  console.log(message, "openopen");
  useEffect(() => {
    if (isOpen) {
      notification.open({
        message,
        icon: icons[severity] || icons.info,
        placement: "topRight",
        onClose: () => setOpen((prev) => ({ ...prev, open: false })),
        duration: 3,
        closeIcon: <CloseOutlined />,
        className: "snackBar_new",
        style: {
          backgroundColor: severity === "error" ? "#f5222d" : "#6172d6",
          color: "#fff",
        },
      });
    }
  }, [isOpen, message, severity, setOpen]);

  return null;
});

Notification.propTypes = {
  open: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["success", "error", "info", "warning"]),
  }).isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Notification;
