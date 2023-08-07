import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { ArrowRight } from "react-bootstrap-icons";
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
  iconClassName,
  formParentClass,
  labelClass,
  clickIcon,
  min,
  max,
  onKeyDown
}) => {
  console.log("applyClassapplyClass", applyClass);
  console.log("applyClassapplyClass", min);
  return (
    <>
      <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelClass}>{label}</Form.Label>
        <Form.Control
          className={
            applyClass != undefined && applyClass != null
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
          max={min} // Ensure that the min prop is passed correctly
          required={required ? true : false}
          onKeyDown={onKeyDown}
        />
        <FormControl.Feedback className={iconClassName} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
      {/* <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelClass}>{label}</Form.Label>
        <Form.Control
          className={
            applyClass != undefined && applyClass != null
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
          required={required ? true : false}
          onKeyDown={onKeyDown}
        />
        <FormControl.Feedback className={iconClassName} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup> */}
    </>
  );
};

export default TextFieldTime;
