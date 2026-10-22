/**
 * @component MultiDatePicker
 * @description A single-date picker wrapper around react-multi-date-picker
 * that renders a calendar icon trigger. Dates are formatted as DD/MM/YYYY
 * and the selectable range starts from today. Supports Hijri / custom
 * calendar systems and locale switching through the `calendar` and `locale`
 * props.
 *
 * @param {Function}         onChange   - Callback fired when the user selects a date.
 * @param {string}           name       - Name attribute forwarded to the underlying input.
 * @param {Date|string}      value      - Currently selected date value.
 * @param {boolean}          disabled   - When true, the picker is non-interactive.
 * @param {object}           calendar   - react-multi-date-picker calendar plugin (e.g. Hijri).
 * @param {object}           locale     - react-multi-date-picker locale plugin (e.g. Arabic).
 * @param {React.RefObject}  refProp    - Forwarded ref attached to the DatePicker instance.
 * @param {string}           spanClass  - CSS class name applied to the wrapping span element.
 * @returns {JSX.Element} An icon-triggered date picker wrapped in a labelled span.
 */
import React, { useRef, useCallback } from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import "./datepicker.css";
import Icon from "react-multi-date-picker/components/icon";

const MultiDatePicker = ({
  onChange,
  name,
  value,
  disabled,
  calendar,
  locale,
  refProp,
  spanClass,
}) => {
  let dateFormat = "DD/MM/YYYY";

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
