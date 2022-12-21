import React from "react";
import "./Checkbox.css";
import { Checkbox } from "antd";

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  classNameDiv,
  disabled,
}) => {
  return (
    <>
      <div className={classNameDiv}>
        <p className="m-0">{label}</p>
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        ></Checkbox>
      </div>
    </>
  );
};
export default CustomCheckbox;
