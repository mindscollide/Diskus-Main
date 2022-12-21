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
      />
    </Form>
  );
};
export default TextArea;
