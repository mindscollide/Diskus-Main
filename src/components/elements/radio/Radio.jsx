import React from "react";
import Form from "react-bootstrap/Form";

/**
 * @component CustomRadio
 * @description A reusable radio-button (or checkbox) component built on top of the
 * React-Bootstrap Form.Check element. It renders inline and exposes all the
 * commonly needed Form.Check props through a clean, consistent interface.
 * The `type` prop can switch the underlying control between "radio" and "checkbox".
 *
 * @param {string}   [label]     - Visible label text rendered next to the control.
 * @param {Function} [change]    - onChange handler called when the selection changes.
 * @param {string}   [name]      - Groups radio buttons together; only one with the
 *                                 same name can be selected at a time.
 * @param {string}   [val]       - Value used as the HTML `id` attribute for the input.
 * @param {string}   [type]      - Input type, typically "radio" or "checkbox".
 * @param {string}   [size]      - Bootstrap size variant for the control.
 * @param {Function} [onClick]   - onClick handler for additional click-level handling.
 * @param {string}   [className] - Extra CSS class(es) applied to the Form.Check wrapper.
 * @param {boolean}  [disabled]  - When true the control is rendered in a disabled state.
 * @param {boolean}  [checked]   - Controlled checked state of the input.
 *
 * @example
 * <CustomRadio
 *   label="Option A"
 *   name="choices"
 *   val="option-a"
 *   type="radio"
 *   checked={selected === "option-a"}
 *   change={(e) => setSelected(e.target.id)}
 * />
 */
const CustomRadio = ({
  label,
  change,
  name,
  val,
  type,
  size,
  onClick,
  className,
  disabled,
  checked,
}) => {
  return (
    <div>
      <Form.Check
        inline
        label={label}
        name={name}
        type={type}
        id={val}
        checked={checked}
        disabled={disabled}
        onChange={change}
        onClick={onClick}
        size={size}
        className={className}
      />
    </div>
  );
};

export default CustomRadio;
