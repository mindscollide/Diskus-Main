import Form from "react-bootstrap/Form";
import { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Input_field.module.css";
import { FormControl, FormGroup } from "react-bootstrap";

/**
 * @component TextFieldDateTime
 * @description A date input field built on React-Bootstrap Form.Control with type="date".
 * Keyboard entry, paste, and manual input are intentionally blocked so the user can only
 * pick a date via the native browser date-picker popup. An internal ref is used to
 * programmatically open the date-picker when the field itself is clicked. An optional
 * icon element can be rendered below the input via FormControl.Feedback, useful for
 * adding a calendar icon with its own click action.
 *
 * @param {string}        [id]             - HTML id attribute for the input.
 * @param {string}        [value]          - Controlled value of the date input (ISO or
 *                                           formatted date string). Null is normalised to "".
 * @param {string}        [label]          - Label text rendered above the input.
 * @param {string}        [width]          - Inline CSS width applied to the input (e.g. "200px").
 * @param {boolean}       [required]       - Marks the input as required.
 * @param {string}        [size]           - Bootstrap size variant ("sm" | "lg").
 * @param {*}             [error]          - Error value forwarded to Form.Control (display handled externally).
 * @param {string}        [placeholder]    - Placeholder text for the input.
 * @param {string}        [margin]         - Inline CSS margin applied to the input.
 * @param {Function}      [change]         - onChange handler called when the date value changes.
 * @param {string}        [name]           - HTML name attribute for the input.
 * @param {string}        [applyClass]     - CSS Module key looked up in Input_field.module.css.
 *                                           Falls back to "form-control2 Saved_money_Tagline" when
 *                                           not provided.
 * @param {React.ReactNode} [inputicon]    - Icon or element rendered inside FormControl.Feedback.
 * @param {string}        [iconclassname]  - CSS class applied to the FormControl.Feedback wrapper.
 * @param {string}        [formParentClass]- CSS Module key applied to the FormGroup wrapper.
 * @param {string}        [labelclass]     - CSS class applied to the Form.Label element.
 * @param {Function}      [clickIcon]      - onClick handler for the icon feedback area.
 * @param {string}        [max]            - Maximum selectable date (HTML date string).
 * @param {string}        [min]            - Minimum selectable date (HTML date string).
 * @param {Function}      [onkeyDown]      - onKeyDown handler (note: keyboard input is also
 *                                           blocked by event.preventDefault internally).
 *
 * @example
 * <TextFieldDateTime
 *   label="Meeting Date"
 *   name="meetingDate"
 *   value={formData.meetingDate}
 *   change={handleChange}
 *   min="2024-01-01"
 *   max="2025-12-31"
 *   required
 * />
 */
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
  console.log("applyClassapplyClass", applyClass);
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
