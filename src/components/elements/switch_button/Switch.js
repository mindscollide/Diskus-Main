import React from "react";
import { Switch } from "antd";
import "./Switch.css";

const CustomSwitch = ({
  name,
  value,
  onChange,
  checkedValue,
  className,
  onClick,
  disabled,
}) => {
  return (
    <>
      <Switch
        name={name}
        defaultChecked={value}
        checked={checkedValue}
        onChange={onChange}
        onClick={onClick}
        className={className}
        disabled={disabled}
      />
    </>
  );
};

export default CustomSwitch;
