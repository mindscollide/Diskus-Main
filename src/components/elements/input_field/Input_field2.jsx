import React, { forwardRef, useRef } from "react";
import Form from "react-bootstrap/Form";
import { FormControl, FormGroup } from "react-bootstrap";
import styles from "./Input_field.module.css";

const TextField = forwardRef(
  (
    {
      onBlur,
      autoComplete,
      id,
      focus,
      value,
      label,
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
    },
    ref
  ) => {
    return (
      <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelclass}>{label}</Form.Label>

        <Form.Control
          ref={ref} // ✅ THIS IS THE KEY
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={
            applyClass
              ? styles[applyClass]
              : "form-control2 Saved_money_Tagline"
          }
          id={id}
          onFocus={focus}
          name={name}
          onChange={change}
          style={{ width, margin }}
          placeholder={placeholder}
          rows={rows}
          as={as}
          value={value ?? ""}
          size={size}
          type={type}
          maxLength={maxLength}
          disabled={disable}
          min={min}
          max={max}
          required={required}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />

        <FormControl.Feedback className={iconclassname} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
    );
  }
);

export default TextField;
