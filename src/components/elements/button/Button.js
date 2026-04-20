/**
 * @file Button.js
 * @description Reusable button component wrapping React-Bootstrap's Button with support for icons, text, disabled state, and custom styling.
 */

import React from "react";
import Button from "react-bootstrap/Button";

/**
 * Flexible button that can render a left icon, text, and right icon inside separate spans.
 * @param {{ text: string, icon: JSX.Element, onClick: Function, className: string, icon2: JSX.Element, disableBtn: boolean, variant: string, datatut: string, size: string, color: string, align: string, type: string, onChange: Function, style: object, pdfIcon: any, pdfIconClass: string, iconClass: string, iconClass2: string, textClass: string, buttonValue: any, title: string }} props
 * @returns {JSX.Element}
 */
const CustomButton = ({
  text,
  icon,
  onClick,
  className,
  icon2,
  disableBtn,
  variant,
  datatut,
  size,
  color,
  align,
  type,
  onChange,
  style,
  pdfIcon,
  pdfIconClass,
  iconClass,
  iconClass2,
  textClass,
  buttonValue,
  title
}) => {
  return (
    <>
      <Button
        type={type}
        color={color}
        size={size}
        className={className}
        variant={variant}
        disabled={disableBtn}
        onClick={onClick}
        onChange={onChange}
        align={align}
        data-tut={datatut}
        style={style}
        title={title}
      >
        {buttonValue}
        <span className={iconClass}>{icon}</span>
        <span className={textClass}>{text}</span>
        <span className={iconClass2}>{icon2}</span>
      </Button>
    </>
  );
};

export default CustomButton;
