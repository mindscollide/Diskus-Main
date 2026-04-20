/**
 * @file datepicker.js
 * @description Ant Design date picker input with optional label, date range restriction (no future dates), and DD-MM-YYYY display format.
 */

import React from "react";
import { DatePicker, Typography } from "antd";
import moment from "moment";

/**
 * Renders an Ant Design DatePicker with an optional required indicator and label.
 * @param {{ label: string, width: string, size: string, placeholder: string, change: Function, name: string, disable: boolean, value: string, DateRange: boolean, required: boolean, locale: object, height: string }} props
 * @returns {JSX.Element}
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
