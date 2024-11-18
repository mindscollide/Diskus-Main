import React, { useRef } from "react";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { FormControl, FormGroup } from "react-bootstrap";

const TextField = ({
  onBlur,
  autoComplete,
  ref,
  id,
  focus,
  value,
  label,
  text,
  width,
  required,
  disable,
  as,
  type,
  size,
  error,
  multiline,
  rows,
  placeholder,
  margin,
  change,
  name,
  applyClass,
  inputicon,
  iconclassname,
  formParentClass,
  labelclass,
  clickIcon,
  min,
  max,
  maxLength,
  onDoubleClick,
  onClick,
  height,
  onKeyDown,
}) => {
  const iconRef = useRef(null);

  const preventDrag = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelclass}>{label}</Form.Label>
        <Form.Control
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={
            applyClass != undefined && applyClass != null
              ? styles[applyClass]
              : "form-control2 Saved_money_Tagline"
          }
          ref={ref}
          id={id && id}
          onFocus={focus}
          name={name && name}
          onChange={change}
          style={{ width: `${width}`, margin: `${margin}` }}
          placeholder={placeholder && placeholder}
          rows={rows}
          as={as}
          multiline={multiline}
          value={value === null ? "" : value}
          label={label && <small>{label}</small>}
          variant="outlined"
          size={size}
          error={error}
          type={type}
          maxLength={maxLength}
          disabled={disable}
          min={min}
          max={max}
          required={required ? true : false}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />
        <FormControl.Feedback className={iconclassname} onClick={clickIcon}>
          {/* <span
                     ref={iconRef}
                     onDragStart={preventDrag} // Prevent drag start
                     draggable="true" // Enable dragging for other items
          > */}
          {inputicon}
          {/* </span> */}
        </FormControl.Feedback>
      </FormGroup>
    </>
  );
};

export default TextField;
