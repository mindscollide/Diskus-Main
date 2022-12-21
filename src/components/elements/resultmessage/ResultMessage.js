import React from "react";
import { Result } from "antd";
import { Meeting } from "../../../container/pages/onBoard/Meeting/Meeting";
import { Row } from "react-bootstrap";

const CustomResultMessage = ({
  status,
  title,
  subTitle,
  extra,
  icon,
  className,
}) => {
  return (
    <Row>
      {/* <Meeting /> */}
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={extra}
        icon={icon}
        className={className}
      />
    </Row>
  );
};

export default CustomResultMessage;
