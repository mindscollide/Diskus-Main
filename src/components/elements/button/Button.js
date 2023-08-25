import React from 'react'
import Button from 'react-bootstrap/Button'

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
        <span className={iconClass}>{icon}</span>
        {text}
        <span className={iconClass2}>{icon2}</span>
        <img className={pdfIconClass} src={pdfIcon} />
      </Button>
    </>
  )
}

export default CustomButton
