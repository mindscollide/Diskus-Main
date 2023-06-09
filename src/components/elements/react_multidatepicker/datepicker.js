import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment from "moment";
import { CalendarFill } from "react-bootstrap-icons";
import Icon from "react-multi-date-picker/components/icon";
import EditIcon from "../../../assets/images/Edit-Icon.png";

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
}) => {
  let dateFormat = "DD/MM/YYYY";

  return (
    <>
      <label className="f-0">
        <DatePicker
          render={
            check === true ? (
              <img src={EditIcon} width="11.54px" height="11.11px" />
            ) : (
              <Icon />
            )
          }
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

export default MultiDatePicker;
