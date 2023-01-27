import React, { useState } from "react";
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
}) => {
  return (
    <div>
      <Form.Check
        inline
        label={label}
        name={name}
        type={type}
        id={val}
        onChange={change}
        onClick={onClick}
        size={size}
        className={className}
      />
    </div>
  );
};

export default CustomRadio;
