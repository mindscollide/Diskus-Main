import React from "react";
import { DatePicker, Typography } from "antd";
import moment from "moment";

/**
 * @component InputDatePicker
 * @description An Ant Design-based date picker input with an optional label and required
 * indicator. Dates are displayed and parsed in "DD-MM-YYYY" format. The component wraps
 * Ant Design's DatePicker and normalises the onChange event into a synthetic event object
 * `{ target: { name, value } }` so it integrates seamlessly with standard React form
 * patterns that rely on `e.target.name` and `e.target.value`.
 *
 * When `DateRange` is true, future dates beyond today are disabled via the `disabledDate`
 * callback, restricting selection to past dates and today only.
 *
 * @param {string}  [label]       - Label text displayed above the date picker.
 * @param {string}  [width]       - Inline CSS width of the DatePicker (e.g. "200px").
 * @param {string}  [size]        - Ant Design size variant ("small" | "middle" | "large").
 * @param {string}  [placeholder] - Placeholder text shown inside the picker input.
 * @param {Function} change       - onChange handler. Called with a synthetic event
 *                                  `{ target: { name, value } }` where value is the
 *                                  selected date string in "DD-MM-YYYY" format.
 * @param {string}  [name]        - Field name included in the synthetic event payload.
 * @param {boolean} [disable]     - When true, the date picker is disabled.
 * @param {string}  [value]       - Controlled date value in "DD-MM-YYYY" format.
 * @param {boolean} [DateRange]   - When true, restricts selectable dates to today and earlier.
 * @param {boolean} [required]    - When true, renders a red asterisk (*) before the picker.
 * @param {object}  [locale]      - Ant Design locale object for internationalisation.
 * @param {string}  [height]      - Inline CSS height of the DatePicker (e.g. "36px").
 *
 * @example
 * <InputDatePicker
 *   label="Date of Birth"
 *   name="dob"
 *   value={formData.dob}
 *   change={handleChange}
 *   DateRange={true}
 *   required
 * />
 */
const InputDatePicker = ({
  label,
  width,
  size,
  placeholder,
  change,
  name,
  disable,
  value,
  DateRange,
  required,
  locale,
  height,
}) => {
  const { Text } = Typography;
  let dateFormat = "DD-MM-YYYY";
  function onChange(date, dateString) {
    change({ target: { name: name, value: dateString } });
  }

  const disabledDate = (value) => {
    return value && value > moment().endOf("day");
  };
  return (
    <>
      {required ? <i style={{ fontSize: "0.7rem", color: "red" }}>*</i> : null}
      <div display="flex" alignItems="center">
        <Text>{label}</Text>
        <DatePicker
          disabledDate={DateRange ? disabledDate : false}
          disabled={disable}
          format={dateFormat}
          value={value ? moment(value, dateFormat) : null}
          placeholder={placeholder}
          onChange={onChange}
          size={size}
          style={{ width: `${width}`, marginLeft: "5px", height: `${height}` }}
          required={required}
          locale={locale}
        />
      </div>
    </>
  );
};
export default InputDatePicker;
