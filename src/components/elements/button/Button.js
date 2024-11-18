import React from "react";
import Button from "react-bootstrap/Button";

const CustomButton = ({
  text,
  icon,
  onClick,
  className,
  // endIcon,
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
  buttonValue
}) => {
  return (
    <>
      <Button
        type={type}
        color={color}
        size={size}
        // startIcon={icon ? icon : null}
        // className={styles[applyClass] + " " + styles[disableClass]}
        className={className}
        variant={variant}
        disabled={disableBtn}
        onClick={onClick}
        onChange={onChange}
        // endIcon={endIcon ? endIcon : null}
        align={align}
        data-tut={datatut}
        style={style}
      >
        {buttonValue}
        <span className={iconClass}>{icon}</span>
        <span className={textClass}>{text}</span>
        <span className={iconClass2}>{icon2}</span>
        <img className={pdfIconClass} src={pdfIcon} draggable="false" />
      </Button>
    </>
  );
};

export default CustomButton;
