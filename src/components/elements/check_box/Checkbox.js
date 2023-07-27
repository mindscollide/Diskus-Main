import React from "react";
import "./Checkbox.css";
import { Checkbox } from "antd";

const CustomCheckbox = ({
  label,
  name,
  label2,
  checked,
  onChange,
  classNameDiv,
  disabled,
  className,
  label2Class,
  classNameCheckBoxP,
  prefixCls,
}) => {
  return (
    <>
      <div className={classNameDiv}>
        <p className={classNameCheckBoxP}>{label}</p>
        <Checkbox
          name={name}
          className={className}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          prefixCls={prefixCls}
        ></Checkbox>
        <p className={label2Class}>{label2}</p>
      </div>
    </>
  );
};
export default CustomCheckbox;
