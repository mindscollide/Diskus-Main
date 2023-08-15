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
  classNameCheckBoxP,
  prefixCls,
  name,
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
