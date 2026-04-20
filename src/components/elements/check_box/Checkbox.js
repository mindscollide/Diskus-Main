/**
 * @file Checkbox.js
 * @description Reusable checkbox component wrapping Ant Design's Checkbox with optional labels on both sides.
 */

import React from "react";
import "./Checkbox.css";
import { Checkbox } from "antd";

/**
 * Renders an Ant Design checkbox with configurable labels, disabled state, and custom CSS classes.
 * @param {{ label: string, label2: string, checked: boolean, onChange: Function, classNameDiv: string, disabled: boolean, className: string, label2Class: string, classNameCheckBoxP: string, prefixCls: string, name: string }} props
 * @returns {JSX.Element}
 */
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
