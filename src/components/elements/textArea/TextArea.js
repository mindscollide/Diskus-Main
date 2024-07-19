import React from "react";
import Form from "react-bootstrap/Form";

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
}) => {

  return (
    <Form className={formClassPosition}>
      <Form.Label className={timeClass}>{timeValue}</Form.Label>
      <Form.Label className={labelClassName}>{label}</Form.Label>
      <Form.Control
        as="textarea"
        rows={rows}
        cols={cols}
        className={className}
        disabled={disable}
        value={value}
        placeholder={placeholder}
        onChange={onChange} // Pass onChange prop
      />
    </Form>
  );
};
export default TextArea;
