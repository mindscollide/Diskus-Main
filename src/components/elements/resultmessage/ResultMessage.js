import React from "react";
import { Result } from "antd";
import { Row } from "react-bootstrap";

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
