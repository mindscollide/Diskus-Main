import React, { useRef } from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import EditIcon from "../../../assets/images/Edit-Icon.png";

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
  // const datePickerRef = useRef(null);

  // const handleIconClick = () => {
  //   if (datePickerRef.current) {
  //     datePickerRef.current.openCalendar();
  //   }
  // };

  // const CustomIcon = () => (
  //   <div className="custom-icon-wrapper" onClick={handleIconClick}>
  //     <img
  //       src={EditIcon}
  //       alt="Edit Icon"
  //       height="11.11px"
  //       width="11.54px"
  //       className="custom-icon cursor-pointer"
  //     />
  //   </div>
  // );

  return (
    <>
      <label className="f-0">
        <DatePicker
          highlightToday={highlightToday}
          onOpenPickNewDate={onOpenPickNewDate}
          // ref={ref}
          // render={<CustomIcon />}
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
