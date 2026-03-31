import Form from "react-bootstrap/Form";
import "./Radio.css";

/**
 * @component Radio3
 * @description A minimal, uncontrolled radio button built on React-Bootstrap Form.Check.
 * It uses a fixed CSS class ("customRadioButton") and a fixed aria-label, making it
 * suitable as a lightweight building block when only the group name, current value,
 * and change handler need to vary. Intended as an alternative to CustomRadio when
 * fewer configuration options are required.
 *
 * @param {string}   values   - The `name` attribute that groups related radio buttons.
 * @param {string}   value    - The value submitted when this radio option is selected.
 * @param {Function} onChange - Callback fired when the user selects this radio button.
 *
 * @example
 * <Radio3
 *   values="priority"
 *   value="high"
 *   onChange={(e) => setPriority(e.target.value)}
 * />
 */
export const Radio3 = ({ values, value, onChange }) => {
  console.log(values, value);
  return (
    <>
      <Form.Check
        name={values}
        value={value}
        prefix="RadioButton"
        className="customRadioButton"
        type="radio"
        aria-label="radio 1"
        onChange={onChange}
      />
    </>
  );
};
