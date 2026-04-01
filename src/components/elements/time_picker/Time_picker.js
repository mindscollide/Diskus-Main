import React, { useEffect } from "react";
import "antd/dist/antd.min.css";
import "./Time_picker.css";
import { TimePicker } from "antd";
import moment from "moment";
import { ConfigProvider } from "antd";
import ar_EG from "antd/es/locale/ar_EG";
import en_US from "antd/es/locale/en_GB";
import fr_FR from "antd/es/locale/fr_FR";
require("moment/locale/ar");
require("moment/locale/fr");
require("moment/locale/en-gb");

/**
 * @component TimePickers
 * @description An internationalised time picker built on Ant Design's TimePicker and
 * wrapped in an Ant Design ConfigProvider to supply the correct locale. The active
 * locale is read from localStorage ("i18nextLng") and supports Arabic ("ar"),
 * French ("fr"), and English (default). moment.js locale is synchronised to match
 * whenever the language preference changes (via useEffect).
 *
 * Time is displayed and parsed in "HH:mm" (24-hour) format. The onChange callback
 * emits a synthetic event `{ target: { name, value } }` where value is the selected
 * time string, consistent with other controlled inputs in the application.
 *
 * @param {string}   [value]       - Controlled time value in "HH:mm" format. Null/undefined
 *                                   renders the picker in an empty/placeholder state.
 * @param {boolean}  [disable]     - When true, the time picker is disabled.
 * @param {string}   [placeholder] - Placeholder text shown when no time is selected.
 * @param {string}   [size]        - Ant Design size variant ("small" | "middle" | "large").
 * @param {Function} change        - onChange handler. Called with a synthetic event
 *                                   `{ target: { name, value } }` where value is "HH:mm".
 * @param {string}   [name]        - Field name included in the synthetic event payload.
 *
 * @example
 * <TimePickers
 *   name="startTime"
 *   value={formData.startTime}
 *   change={handleChange}
 *   placeholder="Select time"
 * />
 */
const TimePickers = ({ value, disable, placeholder, size, change, name }) => {
  let currentLanguage = localStorage.getItem("i18nextLng");
  let TimeFormat = "HH:mm";
  function onChange(date, timeString) {
    console.log("time check", date, timeString);
    change({ target: { name: name, value: timeString } });
  }

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage);
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage);
    } else {
      moment.locale(currentLanguage);
    }
  }, [currentLanguage]);
  return (
    <>
      <ConfigProvider
        locale={
          currentLanguage === "ar"
            ? ar_EG
            : currentLanguage === "fr"
            ? fr_FR
            : en_US
        }
      >
        <TimePicker
          className="timepicker_width"
          disabled={disable}
          format={TimeFormat}
          value={value ? moment(value, TimeFormat) : null}
          placeholder={placeholder}
          onChange={onChange}
          size={size}
        />
      </ConfigProvider>
    </>
  );
};

export default TimePickers;
