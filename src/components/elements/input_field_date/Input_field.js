import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { ArrowRight } from "react-bootstrap-icons";
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
  iconClassName,
  formParentClass,
  labelClass,
  clickIcon,
  max,
  min,
  onkeyDown
}) => {
  console.log("applyClassapplyClass", applyClass);
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
          ref={ref}
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
          readonly
          required={required ? true : false}
          onkeydown={(event) => event.preventDefault()}
          onInput={(event) => event.preventDefault()}
          onPaste={(event) => event.preventDefault()}
        // readOnly={true}
        />
        <FormControl.Feedback className={iconClassName} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
    </>
  );
};

export default TextFieldDateTime;
