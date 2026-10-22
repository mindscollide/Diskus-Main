import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CalendarFill } from "react-bootstrap-icons";
import "react-datepicker/dist/react-datepicker.css";

/**
 * @component CustomDatePicker
 * @description A date picker built on the react-datepicker library. Internally maintains
 * a `startDate` state (a JavaScript Date object) that is synchronised with the external
 * `value` prop via a useEffect hook — allowing the parent to drive the selected date while
 * the component handles the conversion between moment-formatted strings and Date objects.
 *
 * On selection, the onChange callback fires a synthetic event
 * `{ target: { name, value } }` where value is formatted as "YYYYMMDD", keeping
 * integration with standard form handlers consistent with other date inputs in the app.
 *
 * A CalendarFill icon is rendered beside the picker as a visual affordance.
 * By default (when `flag` is falsy), past dates are disabled so users can only pick
 * today or a future date. Setting `flag` to a truthy value lifts this restriction.
 *
 * @param {string}   [name]     - Field name included in the synthetic onChange event payload.
 * @param {string}   [value]    - Controlled date value in any moment-parseable format.
 *                                Used to initialise and sync the internal startDate state.
 * @param {*}        [newValue] - Reserved prop (currently unused in rendering logic).
 * @param {boolean}  [disabled] - When true, the date picker input is disabled.
 * @param {Function} change     - onChange handler. Called with a synthetic event
 *                                `{ target: { name, value } }` where value is "YYYYMMDD".
 * @param {object}   [locale]   - react-datepicker locale object for internationalisation.
 * @param {string}   [className]- CSS class applied to the inner DatePicker input.
 * @param {*}        [selected] - Passed through to react-datepicker (overridden by internal
 *                                startDate state; kept for API compatibility).
 * @param {boolean}  [flag]     - When truthy, removes the minDate restriction, allowing
 *                                selection of past dates.
 *
 * @example
 * <CustomDatePicker
 *   name="scheduledDate"
 *   value={formData.scheduledDate}
 *   change={handleChange}
 *   flag={false}
 * />
 */
const CustomDatePicker = ({
  name,
  value,
  newValue,
  disabled,
  change,
  locale,
  className,
  selected,
  flag,
}) => {
  let dateFormat = "YYYY/MM/DD";
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
      setStartDate(moment(value, moment.defaultFormat).toDate());
    }
  }, [value]);

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
          disabled={disabled}
          name={name}
        />
        <div className="iconForDatePicker margin-right-20">
          <CalendarFill className="DatePickerIcon" size={34} />
        </div>
      </label>
    </>
  );
};

export default CustomDatePicker;
