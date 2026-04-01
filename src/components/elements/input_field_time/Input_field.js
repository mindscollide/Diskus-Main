import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { FormControl, FormGroup } from "react-bootstrap";

/**
 * @component TextFieldTime
 * @description A time input field built on React-Bootstrap Form.Control with type="time".
 * Supports controlled value management, min/max time constraints, focus/blur/click
 * callbacks, and an optional icon rendered via FormControl.Feedback. A forwarded ref
 * (`inputRef`) allows parent components to imperatively focus or read the underlying
 * input element. Null values are normalised to an empty string to avoid React
 * uncontrolled-to-controlled warnings.
 *
 * @param {string}        [value]          - Controlled time value in "HH:mm" format.
 *                                           Null is normalised to "".
 * @param {string}        [label]          - Label text rendered above the input.
 * @param {boolean}       [required]       - Marks the input as required for form validation.
 * @param {boolean}       [disable]        - When true the input is rendered as disabled.
 * @param {Function}      [change]         - onChange handler called when the time value changes.
 * @param {string}        [name]           - HTML name attribute for the input.
 * @param {string}        [applyClass]     - CSS Module key looked up in Input_field.module.css.
 *                                           Falls back to "form-control2 Saved_money_Tagline".
 * @param {React.ReactNode} [inputicon]    - Icon or element rendered inside FormControl.Feedback.
 * @param {string}        [iconclassname]  - CSS class applied to the FormControl.Feedback wrapper.
 * @param {string}        [formParentClass]- CSS Module key applied to the FormGroup wrapper.
 * @param {string}        [labelclass]     - CSS class applied to the Form.Label element.
 * @param {Function}      [clickIcon]      - onClick handler for the icon feedback area.
 * @param {string}        [min]            - Minimum selectable time (e.g. "09:00").
 * @param {string}        [max]            - Maximum selectable time (e.g. "17:00").
 * @param {Function}      [onKeyDown]      - onKeyDown event handler.
 * @param {React.Ref}     [inputRef]       - Ref forwarded to the underlying Form.Control input.
 * @param {Function}      [onFocus]        - onFocus handler for the input.
 * @param {Function}      [onBlur]         - onBlur handler for the input.
 * @param {Function}      [onClick]        - onClick handler for the input.
 * @param {string}        [id]             - HTML id attribute for the input.
 *
 * @example
 * <TextFieldTime
 *   label="Start Time"
 *   name="startTime"
 *   value={formData.startTime}
 *   change={handleChange}
 *   min="08:00"
 *   max="18:00"
 * />
 */
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
