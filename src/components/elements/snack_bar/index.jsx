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
import { useTranslation } from "react-i18next";

const Notification = React.memo(({ open, setOpen }) => {
  const { t } = useTranslation();
  const { open: isOpen, message, severity = "success" } = open;
  const icons = {
    success: <CheckCircleOutlined style={{ color: "#4CAF50" }} />,
    error: <ExclamationCircleOutlined style={{ color: "#f5222d" }} />,
    info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
    warning: <WarningOutlined style={{ color: "#faad14" }} />,
  };
  useEffect(() => {
    if (
      message !== t("Record-available") &&
      message !== t("No-records-found") &&
      message !== t("Records-found") &&
      message !== t("Data-available") &&
      message !== t("No-data-available") &&
      message !== "" &&
      message !== undefined &&
      message !== null &&
      message !== isNaN
    ) {
      if (isOpen) {
        // ConfigProvider (Dashboard) sets direction, and antd then calls
        // notification.config({ rtl }), which mirrors the toast's own layout via an
        // "-rtl" class on the (cached) notification container. This toast's RTL
        // layout is handled by Snack_bar.css (body[dir="rtl"]), so keep antd's own
        // mirroring off, otherwise the icon / close button swap sides.
        notification.config({ rtl: false });
        notification.open({
          message,
          icon: icons[severity] || icons.info,
          placement: "topRight",
          onClose: () => setOpen((prev) => ({ ...prev, open: false })),
          duration: 4,
          closeIcon: <CloseOutlined />,
          className: "snackBar_new",
          style: {
            backgroundColor: severity === "error" ? "#f5222d" : "#6172d6",
            color: "#fff",
          },
        });
      }
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
