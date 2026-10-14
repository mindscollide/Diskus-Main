import React from "react";
import { Result } from "antd";
import { Row } from "react-bootstrap";

/**
 * @component CustomResultMessage
 * @description A wrapper around Ant Design's Result component used to display
 * operation outcome screens (success, error, warning, info, 404, 403, 500).
 * Wrapped in a Bootstrap Row for consistent layout alignment within Diskus pages.
 * Supports an additional `extraCode` slot rendered after the Result component,
 * allowing supplementary UI (e.g. debug info, extra action panels) to be injected
 * below the standard result layout without modifying the Result's built-in `extra` area.
 *
 * @param {string} props.status - Result status type. Ant Design accepts: "success",
 *   "error", "info", "warning", "404", "403", "500".
 * @param {React.ReactNode} props.title - Primary heading displayed in the result panel.
 * @param {React.ReactNode} [props.subTitle] - Secondary description text below the title.
 * @param {React.ReactNode} [props.extra] - Extra action content (e.g. buttons) rendered
 *   at the bottom of the Ant Design Result component.
 * @param {React.ReactNode} [props.icon] - Custom icon element replacing the default
 *   status icon of the Ant Design Result.
 * @param {string} [props.PrefixClas] - Custom prefix class passed as `prefixCls` to the
 *   Result component for deep CSS customisation.
 * @param {string} [props.className] - Additional CSS class applied to the Result element.
 * @param {React.ReactNode} [props.extraCode] - Additional JSX rendered after the Result
 *   component, outside the Result's own layout.
 *
 * @example
 * <CustomResultMessage
 *   status="success"
 *   title="Meeting Created"
 *   subTitle="Your meeting has been scheduled successfully."
 *   extra={<Button onClick={goHome}>Back to Dashboard</Button>}
 * />
 */
const CustomResultMessage = ({
  status,
  title,
  subTitle,
  extra,
  icon,
  PrefixClas,
  className,
  extraCode
}) => {
  return (
    <Row>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={extra}
        icon={icon}
        className={className}
        prefixCls={PrefixClas}
      />
      {extraCode}
    </Row>
  );
};

export default CustomResultMessage;
