import React from "react";
import Form from "react-bootstrap/Form";
import styles from "../input_field/Input_field.module.css";

const TextArea = ({
  rows,
  cols,
  className,
  disable,
  value,
  label,
  labelClassName,
  timeValue,
  timeClass,
  formClassPosition,
  placeholder,
  onChange,
  applyClass,
  name,
  maxLength,
}) => {
  return (
    <Form className={formClassPosition}>
      <Form.Label className={timeClass}>{timeValue}</Form.Label>
      <Form.Label className={labelClassName}>{label}</Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        cols={cols}
        name={name}
        className={
          applyClass !== null && applyClass !== undefined
            ? styles[applyClass]
            : className
        }
        maxLength={maxLength}
        disabled={disable}
        value={value}
        placeholder={placeholder}
        onChange={onChange} // Pass onChange prop
      />
    </Form>
  );
};
export default TextArea;
