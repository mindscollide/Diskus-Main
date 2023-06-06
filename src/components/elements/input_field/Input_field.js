import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { ArrowRight } from "react-bootstrap-icons";
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
  iconClassName,
  formParentClass,
  labelClass,
  clickIcon,
  min,
  max,
  maxLength,
  onDoubleClick,
  onClick
}) => {
  console.log("applyClassapplyClass", applyClass);
  return (
    <>
      <FormGroup className={styles[formParentClass]}>
        <Form.Label className={labelClass}>{label}</Form.Label>
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
        />
        <FormControl.Feedback className={iconClassName} onClick={clickIcon}>
          {inputicon}
        </FormControl.Feedback>
      </FormGroup>
    </>
  );
};

export default TextField;
