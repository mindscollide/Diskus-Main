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
  flag
}) => {
  let dateFormat = "YYYY/MM/DD";
  console.log(flag, "flagflagflagflag")
  let currentDate = new Date();
  let currentDate1 = moment(currentDate, moment.defaultFormat).toDate();
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
      console.log("valuevalue", newValue);
      setStartDate(moment(value, moment.defaultFormat).toDate());
    }
  }, [value]);
  console.log(
    "valuevalue ",
    value,
    moment(startDate, moment.defaultFormat).toDate(),
    startDate
  );
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
          // value={value ? moment(value, dateFormat) : null}
          // placeholderText={placeholderText}
          disabled={disabled}
          // dateFormat="dd-MM-yyyy"
          name={name}
        // value={value ? moment(value) : null}
        />
        <div className="iconForDatePicker margin-right-20">
          <CalendarFill className="DatePickerIcon" size={34} />
          {/* <i class="icon-calendar color-white nm-icn dateinput cursor-pointer"></i> */}
        </div>
      </label>
    </>
  );
};

export default CustomDatePicker;
