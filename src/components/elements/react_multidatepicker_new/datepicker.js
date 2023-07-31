import React, { useEffect, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import { PencilSquare } from "react-bootstrap-icons";
import "./datepicker.css";
// import Icon from "react-multi-date-picker/components/icon";
import EditIcon from "../../../assets/images/Edit-Icon.png";

const MultiDatePickers = ({
  onChange,
  name,
  value,
  newValue,
  disabled,
  change,
  calendar,
  locale,
  check,
  multiple,
}) => {
  let dateFormat = "DD/MM/YYYY";
  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };

  const CustomIcon = () => (
    <div className="custom-icon-wrapper" onClick={handleIconClick}>
      <img
        src={EditIcon}
        alt="Edit Icon"
        height="11.11px"
        width="11.54px"
        className="custom-icon"
      />
    </div>
  );

  return (
    <>
      <label className="f-0">
        <DatePicker
          defaultValue={value}
          ref={datePickerRef}
          render={<CustomIcon />}
          onChange={onChange}
          format={dateFormat}
          minDate={moment().toDate()}
          disabled={disabled}
          name={name}
          multiple={multiple}
          calendar={calendar}
          locale={locale}
        />
      </label>
    </>
  );
};

export default MultiDatePickers;
