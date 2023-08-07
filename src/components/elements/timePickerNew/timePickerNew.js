import React, { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DemoItem } from '@mui/x-date-pickers/internals/demo/DemoContainer';
import { DesktopTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


const TimePickerResolution = ({ onChange, minTime, value, disabled, defaultValue }) => {
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
}

export default TimePickerResolution