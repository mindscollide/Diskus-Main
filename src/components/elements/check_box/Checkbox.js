import React from "react";
import "./Checkbox.css";
import { Checkbox } from "antd";

const CustomCheckbox = ({
  label,
  label2,
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
        <p className="m-0">{label2}</p>
      </div>
    </>
  );
};
export default CustomCheckbox;
