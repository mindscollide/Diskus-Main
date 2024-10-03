import React from "react";
import Form from "react-bootstrap/Form";

const CustomRadio = ({
  label,
  change,
  name,
  val,
  type,
  size,
  onClick,
  className,
  disabled,
  checked,
}) => {
  return (
    <div>
      <Form.Check
        inline
        label={label}
        name={name}
        type={type}
        id={val}
        checked={checked}
        disabled={disabled}
        onChange={change}
        onClick={onClick}
        size={size}
        className={className}
      />
    </div>
  );
};

export default CustomRadio;
