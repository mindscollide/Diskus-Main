import React from "react";
import { Switch } from "antd";
import "./Switch.css";

const CustomSwitch = ({ name, value, onChange, checkedValue }) => {
  return (
    <>
      <Switch
        name={name}
        defaultChecked={value}
        checked={checkedValue}
        onChange={onChange}
      />
    </>
  );
};

export default CustomSwitch;
