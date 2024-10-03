import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers";

const TimePickerResolution = ({
  onChange,
  minTime,
  value,
  disabled,
  defaultValue,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopTimePicker
        closeOnSelect={false}
        onChange={onChange}
        minTime={minTime}
        defaultValue={defaultValue}
        disabled={disabled}
        className={"resolutionTimePicker"}
        value={value !== null ? value : null}
      />
    </LocalizationProvider>
  );
};

export default TimePickerResolution;
