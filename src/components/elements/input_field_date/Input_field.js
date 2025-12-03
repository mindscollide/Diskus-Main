import Form from "react-bootstrap/Form";
import { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { FormControl, FormGroup } from "react-bootstrap";

const TextFieldDateTime = ({
  ref,
  id,
  value,
  label,
  width,
  required,
  size,
  error,
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
  max,
  min,
  onkeyDown,
}) => {
  const dateInputRef = useRef(null);
  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.click(); // Simulate a click event to open the date picker
    }
  };
  
  return (
    <>
      <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelclass}>{label}</Form.Label>
        <Form.Control
          className={
            applyClass !== undefined && applyClass !== null
              ? styles[applyClass]
              : "form-control2 Saved_money_Tagline"
          }
          ref={dateInputRef}
          id={id && id}
          name={name && name}
          onChange={change}
          style={{ width: `${width}`, margin: `${margin}` }}
          placeholder={placeholder && placeholder}
          value={value === null ? "" : value}
          size={size}
          error={error}
          type="date"
          max={max}
          min={min}
          onClick={openDatePicker}
          // readOnly
          required={required ? true : false}
          onKeyDown={(event) => event.preventDefault()}
          onInput={(event) => event.preventDefault()}
          onPaste={(event) => event.preventDefault()}
          // readOnly
        />
        <FormControl.Feedback className={iconclassname} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
    </>
  );
};

export default TextFieldDateTime;
