import React, { useEffect, useRef, useCallback, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment from "moment";
import { CalendarFill } from "react-bootstrap-icons";
import "./datepicker.css"
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
  refProp,
  spanClass
}) => {
  let dateFormat = "DD/MM/YYYY";
  const calenderRef = useRef()
  console.log(calenderRef, "calenderRefcalenderRef")
  const handleClick = useCallback(() => {
    if (calenderRef.current.isOpen) {
      return calenderRef.current.closeCalendar()
    } else {
      return calenderRef.current.openCalendar()
    }
  }, [calenderRef])
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