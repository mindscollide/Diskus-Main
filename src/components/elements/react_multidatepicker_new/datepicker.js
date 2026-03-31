/**
 * @component MultiDatePickers
 * @description A flexible single-date picker wrapper around react-multi-date-picker.
 * Unlike the original MultiDatePicker, this variant accepts a custom `render`
 * prop so callers can supply their own trigger element (icon, button, input, etc.).
 * The selectable range starts from today and the date format is DD/MM/YYYY.
 * Supports Hijri / custom calendar systems and locale switching.
 *
 * @param {Function}        onChange          - Callback fired when the user selects a date.
 * @param {string}          name              - Name attribute forwarded to the underlying input.
 * @param {Date|string}     value             - Currently selected date value.
 * @param {boolean}         disabled          - When true, the picker is non-interactive.
 * @param {object}          calendar          - react-multi-date-picker calendar plugin (e.g. Hijri).
 * @param {object}          locale            - react-multi-date-picker locale plugin (e.g. Arabic).
 * @param {boolean}         highlightToday    - When true, today's date is highlighted in the calendar panel.
 * @param {boolean}         onOpenPickNewDate - Controls whether a new date panel opens on selection.
 * @param {React.RefObject} ref               - Forwarded ref attached to the DatePicker instance.
 * @param {JSX.Element}     render            - Custom render element used as the picker trigger.
 * @returns {JSX.Element} A label-wrapped date picker with a customisable trigger.
 */
import React from "react";
import DatePicker from "react-multi-date-picker";
import moment from "moment";

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

  return (
    <>
      <label className="f-0">
        <DatePicker
          highlightToday={highlightToday}
          onOpenPickNewDate={onOpenPickNewDate}
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
