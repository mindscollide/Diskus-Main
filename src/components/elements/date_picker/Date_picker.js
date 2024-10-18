import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CalendarFill } from "react-bootstrap-icons";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  name,
  value,
  newValue,
  disabled,
  change,
  locale,
  className,
  selected,
  flag,
}) => {
  let dateFormat = "YYYY/MM/DD";
  const [startDate, setStartDate] = useState("");

  function onChange(date, e) {
    e.preventDefault();
    setStartDate(date);
    change({
      target: { name: name, value: moment(date).format("YYYYMMDD") },
    });
  }
  useEffect(() => {
    if (value != "") {
      setStartDate(moment(value, moment.defaultFormat).toDate());
    }
  }, [value]);

  return (
    <>
      <label className="f-0">
        <DatePicker
          selected={startDate}
          onChange={onChange}
          format={dateFormat}
          minDate={!flag && moment().toDate()}
          locale={locale}
          className={className}
          disabled={disabled}
          name={name}
        />
        <div className="iconForDatePicker margin-right-20">
          <CalendarFill className="DatePickerIcon" size={34} />
        </div>
      </label>
    </>
  );
};

export default CustomDatePicker;
