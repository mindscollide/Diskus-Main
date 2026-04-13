import React from "react";
import "./Checkbox.css";
import { Checkbox } from "antd";

/**
 * @component CustomCheckbox
 * @description A reusable checkbox component that wraps the Ant Design Checkbox.
 * Supports an optional prefix label rendered before the checkbox and an optional
 * suffix label rendered after it. Custom CSS classes can be applied to every
 * individual region (wrapper div, labels, and the checkbox itself).
 *
 * @param {string}  [label]              - Text rendered in a <p> tag before the checkbox.
 * @param {string}  [label2]             - Text rendered in a <p> tag after the checkbox.
 * @param {boolean} [checked]            - Controlled checked state of the checkbox.
 * @param {Function} [onChange]          - Callback fired when the checkbox value changes.
 * @param {string}  [classNameDiv]       - CSS class applied to the outer wrapper <div>.
 * @param {boolean} [disabled]           - When true the checkbox is rendered in a disabled state.
 * @param {string}  [className]          - CSS class passed directly to the Ant Design Checkbox.
 * @param {string}  [label2Class]        - CSS class applied to the second label <p> element.
 * @param {string}  [classNameCheckBoxP] - CSS class applied to the first label <p> element.
 * @param {string}  [prefixCls]          - Ant Design prefix class override for the Checkbox.
 * @param {string}  [name]               - HTML name attribute for the underlying input element.
 *
 * @example
 * <CustomCheckbox
 *   label="Accept terms"
 *   checked={isAccepted}
 *   onChange={(e) => setIsAccepted(e.target.checked)}
 *   classNameDiv="my-wrapper"
 * />
 */
const CustomCheckbox = ({
  label,
  label2,
  checked,
  onChange,
  classNameDiv,
  disabled,
  className,
  label2Class,
  classNameCheckBoxP,
  prefixCls,
  name,
}) => {
  return (
    <>
      <div className={classNameDiv}>
        <p className={classNameCheckBoxP}>{label}</p>
        <Checkbox
          name={name}
          className={className}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          prefixCls={prefixCls}
        ></Checkbox>
        <p className={label2Class}>{label2}</p>
      </div>
    </>
  );
};
export default CustomCheckbox;
