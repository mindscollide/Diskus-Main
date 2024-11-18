import React from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";

const MultiDatePickers = ({
  onChange,
  name,
  value,
  disabled,
  calendar,
  locale,
  highlightToday,
  onOpenPickNewDate,
  ref,
  render,
}) => {
  let dateFormat = "DD/MM/YYYY";

  return (
    <>
      <label className="f-0">
        <DatePicker
          highlightToday={highlightToday}
          onOpenPickNewDate={onOpenPickNewDate}
          ref={ref}
          render={render}
          onChange={onChange}
          format={dateFormat}
          minDate={moment().toDate()}
          disabled={disabled}
          name={name}
          value={value}
          calendar={calendar}
          locale={locale}
        />
      </label>
    </>
  );
};

export default MultiDatePickers;
