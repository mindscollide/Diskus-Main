import React from "react";
import { DatePicker, Typography } from "antd";
import moment from "moment";
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
