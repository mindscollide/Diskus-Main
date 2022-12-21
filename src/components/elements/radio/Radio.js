import React, { useState } from "react";
import Form from "react-bootstrap/Form";

const CustomRadio = ({ label, change, name, val, type }) => {
  return (
    <div>
      <Form.Check
        inline
        label={label}
        name={name}
        type={type}
        id={val}
        onChange={change}
      />
    </div>
  );
};

export default CustomRadio;
