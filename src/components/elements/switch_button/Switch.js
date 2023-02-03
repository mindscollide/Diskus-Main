import React from "react";
import { Switch } from "antd";
import "./Switch.css";

const CustomSwitch = ({ name, value, onChange, checkedValue, className }) => {
  return (
    <>
      <Switch
        name={name}
        defaultChecked={value}
        checked={checkedValue}
        onChange={onChange}
        className={className}
      />
    </>
  );
};

export default CustomSwitch;
