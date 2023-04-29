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
  className,
  label2Class,
  classNameCheckBoxP
}) => {
  return (
    <>
      <div className={classNameDiv}>
        <p className={classNameCheckBoxP}>{label}</p>
        <Checkbox
          className={className}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        ></Checkbox>
        <p className={label2Class}>{label2}</p>
      </div>
    </>
  );
};
export default CustomCheckbox;
