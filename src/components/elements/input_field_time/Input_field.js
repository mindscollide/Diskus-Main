import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { FormControl, FormGroup } from "react-bootstrap";

const TextFieldTime = ({
  value,
  label,
  required,
  disable,
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
  onKeyDown,
  inputRef,
  onFocus,
  onBlur,
  onClick,
  id,
}) => {
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
          name={name && name}
          onChange={change}
          value={value === null ? "" : value}
          label={label && <small>{label}</small>}
          type="time"
          disabled={disable}
          min={min}
          max={max} // Ensure that the min prop is passed correctly
          required={required ? true : false}
          onKeyDown={onKeyDown}
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick}
          id={id}
        />
        <FormControl.Feedback className={iconclassname} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
    </>
  );
};

export default TextFieldTime;
