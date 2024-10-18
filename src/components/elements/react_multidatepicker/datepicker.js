import React, { useRef, useCallback } from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import "./datepicker.css";
import Icon from "react-multi-date-picker/components/icon";

const MultiDatePicker = ({
  onChange,
  name,
  value,
  disabled,
  calendar,
  locale,
  refProp,
  spanClass,
}) => {
  let dateFormat = "DD/MM/YYYY";

  return (
    <>
      <span className={spanClass}>
        <label className="f-0">
          <DatePicker
            render={<Icon />}
            onChange={onChange}
            inputClass="datepicker_input"
            format={dateFormat}
            minDate={moment().toDate()}
            className="datePickerTodoCreate2"
            disabled={disabled}
            name={name}
            onOpenPickNewDate={false}
            inputMode=""
            value={value}
            calendar={calendar}
            locale={locale}
            ref={refProp}
          />
        </label>
      </span>
    </>
  );
};

export default MultiDatePicker;
