import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment from "moment";
import { CalendarFill } from "react-bootstrap-icons";
import Icon from "react-multi-date-picker/components/icon";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import InputIcon from "react-multi-date-picker/components/input_icon"

const MultiDatePicker = ({
  onChange,
  name,
  value,
  newValue,
  disabled,
  change,
  calendar,
  locale,
  check,
  spanClass
}) => {
  let dateFormat = "DD/MM/YYYY";

  return (
    <>
      <span className={spanClass}>
        <label className="f-0">
          <DatePicker
            render={<InputIcon />}
            onChange={onChange}
            format={dateFormat}
            minDate={moment().toDate()}
            className="datePickerTodoCreate2"
            disabled={disabled}
            name={name}
            value={value}
            calendar={calendar}
            locale={locale}
          />
        </label>
      </span>
    </>
  );
};

export default MultiDatePicker;
