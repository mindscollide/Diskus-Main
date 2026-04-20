/**
 * @file date_formater.js
 * @description Comprehensive date/time conversion and formatting library for
 * the Diskus application.
 *
 * All API timestamps are stored as compact UTC strings in `"YYYYMMDDHHmmss"`
 * format (14-character strings without separators).  The functions in this
 * file convert between that compact format and the various display formats
 * required across the UI, handling both English and Arabic (Eastern numeral)
 * locales.
 *
 * Naming conventions used throughout:
 *  - `utcConvert*`   – takes a compact UTC string, returns a local `Date`.
 *  - `newTimeFormater*` – formats a compact UTC string as a human-readable
 *    localised string (12-hour time, day-month-year, etc.).
 *  - `convert*`      – general-purpose conversion helpers.
 *  - `format*`       – takes a `Date` object and returns a formatted string.
 */
import moment from "moment";
import { formatDistanceToNow, format, parse, isSameDay } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import "moment/locale/ar"; // import Arabic locale (or other locales you support)

/**
 * Removes dashes from a `"YYYY-MM-DD"` string, returning `"YYYYMMDD"`.
 * @param {string} data - Dash-separated date string.
 * @returns {string}
 */
export const removeDashesFromDate = (data) => {
  let value = data.split("-");
  return `${value[0]}${value[1]}${value[2]}`;
};

/**
 * Converts a compact `"YYYYMMDD"` date string to display format `"DD-MM-YYYY"`.
 * @param {string} data
 * @returns {string}
 */
export const DateDisplayFormat = (data) =>
  data.slice(6, 8) + "-" + data.slice(4, 6) + "-" + data.slice(0, 4);

/**
 * Removes colons from an `"HH:MM:SS"` time string, returning `"HHMMSS"`.
 * @param {string} data
 * @returns {string}
 */
export const RemoveTimeDashes = (data) =>
  data.slice(0, 2) + data.slice(3, 5) + data.slice(6, 8);

/**
 * Inserts colons into a compact `"HHmmss"` time string, returning `"HH:mm:ss"`.
 * @param {string} data
 * @returns {string}
 */
export const TimeDisplayFormat = (data) =>
  data.slice(0, 2) + ":" + data.slice(2, 4) + ":" + data.slice(4, 6);

/**
 * Inserts a colon into a compact `"HHmm"` string, returning `"HH:mm"`.
 * @param {string} data
 * @returns {string}
 */
export const TimeHHMMFormat = (data) =>
  data.slice(0, 2) + ":" + data.slice(2, 4);

/**
 * Converts a `"DD-MM-YYYY"` date string to the API-ready `"YYYYMMDD"` format.
 * Returns `undefined` when `data` is empty.
 * @param {string} data
 * @returns {string|undefined}
 */
export const DateSendingFormat = (data) => {
  if (data.length > 0) {
    let value = data.split("-");
    return `${value[2]}${value[1]}${value[0]}`;
  }
};

/**
 * Formats a compact `"YYYYMMDD"` date string as a spaced calendar string
 * `"YYYY ,MM , DD"`.  Used by calendar widget date display.
 * @param {string} date
 * @returns {string}
 */
export const dateforCalendar = (date) => {
  return date.slice(0, 4) + " ," + date.slice(4, 6) + " , " + date.slice(6, 8);
};

/**
 * Converts a compact `"YYYYMMDDHHmmss"` string to an ISO-like display string
 * `"YYYY-MM-DD HH:mm:ss"`.
 * @param {string} data
 * @returns {string}
 */
export const dateTime = (data) => {
  let newtime =
    data.slice(0, 4) +
    "-" +
    data.slice(4, 6) +
    "-" +
    data.slice(6, 8) +
    " " +
    data.slice(8, 10) +
    ":" +
    data.slice(10, 12) +
    ":" +
    data.slice(12, 14);
  return newtime;
};

/**
 * Converts a compact `"YYYYMMDD"` string to a UTC-normalised `"YYYYMMDD"`
 * string by parsing it through moment and then extracting the ISO date part.
 * Useful when the local and UTC calendar dates may differ.
 * @param {string} date - Compact date, e.g. `"20240501"`.
 * @returns {string} UTC `"YYYYMMDD"`, e.g. `"20240430"`.
 */
export const newDateFormaterAsPerUTC = (date) => {
  let dateConvert = moment(date, "YYYYMMDD").format();
  let newDate = moment(dateConvert).toDate().toISOString();

  return newDate.slice(0, 10).replace(/-/g, "");
};

/**
 * Converts a compact `"YYYYMMDD"` string to a `Date` object set to local
 * 18:10:36.  Used by the calendar component to anchor day events.
 * @param {string} date
 * @returns {string} `Date.toString()` representation.
 */
export const convertintoGMTCalender = (date) => {
  let year = parseInt(date.substr(0, 4));
  let month = parseInt(date.substr(4, 2)) - 1; // Month is zero-based in JavaScript's Date object
  let day = parseInt(date.substr(6, 2));

  let formattedDate = new Date(year, month, day, 18, 10, 36).toString();
  return formattedDate;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a 12-hour local
 * time string (`"h:mm A"`), e.g. `"2:30 PM"`.
 * @param {string} dateTime - Compact UTC datetime.
 * @returns {string}
 */
export const newTimeFormaterAsPerUTC = (dateTime) => {
  let fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A");
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a fully
 * localised `"h:mm A, DD MMM YYYY"` string with Arabic numeral support.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime - Compact UTC datetime.
 * @param {"en"|"ar"} locale - BCP 47 language tag.
 * @returns {string}
 */
export const newTimeFormaterAsPerUTCFullDate = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);
  // Define month names in English and Arabic
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the time components (12-hour format with AM/PM)
  const formattedTime = date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format the date components
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format the full date as "h:mm A, Do MMM, YYYY"
  const formattedDate = `${formattedTime}, ${formattedDay} ${formattedMonth} ${formattedYear}`;

  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]) // Replace digits with Arabic numerals
    : formattedDate;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a formatted
 * `"h:mm A, D MMM, YYYY"` string (locale-independent English).
 * Uses optional chaining so null/undefined `dateTime` returns `"Invalid Date"`.
 * @param {string} [dateTime]
 * @returns {string}
 */
export const newTimeFormaterForResolutionAsPerUTCFullDate = (dateTime) => {
  let fullDateyear =
    dateTime?.slice(0, 4) +
    "-" +
    dateTime?.slice(4, 6) +
    "-" +
    dateTime?.slice(6, 8) +
    "T" +
    dateTime?.slice(8, 10) +
    ":" +
    dateTime?.slice(10, 12) +
    ":" +
    dateTime?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A, D MMM, YYYY");
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns only the date
 * part as `"D Month YYYY"` (e.g. `"1 May 2024"`) with Arabic numeral support.
 * Reads locale from `localStorage["i18nextLng"]`.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @returns {string}
 */
export const _justShowDateformat = (dateTime) => {
  let locale = localStorage.getItem("i18nextLng") || "en";
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the date components
  const formattedDay = date.getDate();
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Return formatted date with Arabic or English numerals based on locale
  return locale === "ar"
    ? `${formattedDay} ${formattedMonth} ${formattedYear}`.replace(
        /[0-9]/g,
        (d) => "٠١٢٣٤٥٦٧٨٩"[d]
      )
    : `${formattedDay} ${formattedMonth}, ${formattedYear}`;
};

/**
 * Formats a compact UTC `"YYYYMMDDHHmmss"` string as `"DD-MMM-YYYY"` using
 * `moment` with locale awareness (reads locale from localStorage).
 * Digits are converted to Arabic Eastern numerals when locale is `"ar"`.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @returns {string}
 */
export const _justShowDateformatBilling = (dateTime) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Convert dateTime string into ISO format
  const isoString =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    "Z";

  const locale = localStorage.getItem("i18nextLng") || "en"; // get locale from localStorage
  moment.locale(locale); // set locale globally for this instance

  // Format date according to the locale
  const formattedDate = moment(isoString).format("DD-MMM-YYYY");

  // If Arabic, convert digits to Arabic numerals
  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
    : formattedDate;
};
/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns the local day
 * name (e.g. `"Monday"`).
 * @param {string} dateTime
 * @returns {string}
 */
export const _justShowDay = (dateTime) => {
  let fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("dddd");
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string into a `Date` object.
 * Used as the raw date value in recent-activity notification lists.
 * @param {string} dateTime
 * @returns {Date}
 */
export const forRecentActivity = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateYear);
  return _dateTime;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `"YYYYMMDD"`
 * string via moment.  Used to place meeting events on the calendar grid.
 * @param {string} dateTime
 * @returns {string}
 */
export const startDateTimeMeetingCalendar = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  // let _dateTime = new Date(fullDateYear).toString('YYYYMMDDHHmmss')
  let _dateTime = moment(fullDateYear, "YYYY-MM-DDTHH:mm:ss.SSSZ").format(
    "YYYYMMDD"
  );

  return _dateTime;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `Date` object
 * via moment.  Used to feed event dates to the home-screen calendar.
 * @param {string} dateTime
 * @returns {Date}
 */
export const forHomeCalendar = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let _dateTime = moment(fullDateYear, "YYYYMMDDHHmmss").toDate();

  return _dateTime;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `Date` string
 * representation.  Used by the main full-calendar component.
 * @param {string} dateTime
 * @returns {string} `Date.toString()`.
 */
export const forMainCalendar = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  let _dateTime = new Date(fullDateYear).toString("YYYYMMDDHHmmss");

  return _dateTime;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a `"YYYY-MM-DD"` string
 * for pre-filling the resolution edit date picker.
 * @param {string} dateTime
 * @returns {string}
 */
export const editResolutionDate = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let convertGMT = new Date(fullDateYear);
  let convertDate = moment(convertGMT).format("YYYY-MM-DD");
  return convertDate;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `"HH:mm"` string
 * for pre-filling the resolution edit time picker.
 * @param {string} dateTime
 * @returns {string}
 */
export const editResolutionTime = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let convertGMT = new Date(fullDateYear).toString();
  let convertTime = moment(convertGMT).format("HH:mm");
  return convertTime;
};
/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `Date` object
 * for use in a read-only resolution time display.
 * @param {string} dateTime
 * @returns {Date}
 */
export const editResolutionTimeView = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let convertGMT = new Date(fullDateYear);
  return convertGMT;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `Date` object
 * for displaying in the resolution-results table.
 * Handles `null`/`undefined` gracefully and catches parse errors.
 * @param {string|null|undefined} dateTime
 * @returns {Date|"Invalid date"}
 */
export const resolutionResultTable = (dateTime) => {
  try {
    if(dateTime !== null && dateTime !== undefined) {
      if (!dateTime || dateTime.length < 14) {
        return "Invalid date";
      }
    }
    let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  let convertTime = new Date(fullDateYear);

  return convertTime;
  } catch (error) {
    console.error("Error converting date:", error);
    return "Invalid date";
    
  }

};

/**
 * Converts a local `"YYYYMMDDHHmmss"` string to a compact UTC
 * `"YYYYMMDDHHmmss"` string by parsing it as local time and extracting UTC
 * components.  Used when sending newly-created meeting/resolution dates to
 * the API.
 * @param {string} dateTime - Local compact datetime.
 * @returns {string} UTC compact datetime.
 */
export const createConvert = (dateTime) => {
  console.log(dateTime, "DatesDatesDatesDatesDates");
  let convertintoISO = moment(dateTime, "YYYYMMDDHHmmss").toISOString();
  let utcDate = new Date(convertintoISO).toUTCString();

  // Convert ISO date string to a Date object
  const date = new Date(utcDate);

  // Extract the individual components of the date
  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + date.getUTCDate()).slice(-2);
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);

  // Concatenate the components into the desired format
  const result = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return result;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local `Date` string
 * for the meeting edit date picker.  Uses optional chaining so `undefined`
 * input returns an invalid-date string rather than throwing.
 * @param {string} [dateTime]
 * @returns {string} `Date.toString()`.
 */
export const EditmeetingDateFormat = (dateTime) => {
  let fullDateyear =
    dateTime?.slice(0, 4) +
    "-" +
    dateTime?.slice(4, 6) +
    "-" +
    dateTime?.slice(6, 8) +
    "T" +
    dateTime?.slice(8, 10) +
    ":" +
    dateTime?.slice(10, 12) +
    ":" +
    dateTime?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("DD/MM/YYYY");
  return _dateTime;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a locale-aware
 * 12-hour time string (AM/PM converted to Arabic ص/م when `locale === "ar"`).
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const newTimeFormaterAsPerUTCTalkTime = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Format the time based on 12-hour format with AM/PM
  let formattedTime = date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Adjust AM/PM to Arabic if needed
  if (locale === "ar") {
    formattedTime = formattedTime.replace("AM", "ص").replace("PM", "م");
    formattedTime = formattedTime.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]); // Convert digits to Arabic numerals
  }

  return formattedTime;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a locale-aware
 * `"DD-MMM-YYYY"` date string (abbreviated month names; Arabic numerals when
 * `locale === "ar"`).
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const newTimeFormaterAsPerUTCTalkDate = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the date components
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format the date and apply Arabic numerals if locale is "ar"
  const formattedDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;

  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
    : formattedDate;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a combined
 * `"h:mm A, D MMM, YYYY"` display string with full locale support.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const newTimeFormaterAsPerUTCTalkDateTime = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the date components
  const formattedDay = date.getDate();
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format time in 12-hour format with AM/PM
  let formattedTime = date.toLocaleString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Adjust AM/PM to Arabic if needed
  if (locale === "ar") {
    formattedTime = formattedTime.replace("AM", "ص").replace("PM", "م");
    formattedTime = formattedTime.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]); // Convert digits to Arabic numerals
  }

  // Format date as "h:mm A, Do MMM, YYYY"
  const formattedDateTime = `${formattedTime}, ${formattedDay} ${formattedMonth}, ${formattedYear}`;

  // Convert English digits to Arabic if locale is "ar"
  return locale === "ar"
    ? formattedDateTime.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
    : formattedDateTime;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a
 * `"DD-MMM-YYYY HH:mm:ss"` display string (includes seconds) with full locale
 * support.  Used in the Meeting Information / minutes detail views.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const newTimeFormaterMIAsPerUTCTalkDateTime = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the date components
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format time in 12-hour format with seconds and AM/PM
  let formattedTime = date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Adjust AM/PM to Arabic if needed
  if (locale === "ar") {
    formattedTime = formattedTime.replace("AM", "ص").replace("PM", "م");
    formattedTime = formattedTime.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]); // Convert digits to Arabic numerals
  }

  // Format date as "DD-MMM-YYYY h:mm:ss"
  const formattedDateTime = `${formattedDay}-${formattedMonth}-${formattedYear} ${formattedTime}`;

  // Convert English digits to Arabic if locale is "ar"
  return locale === "ar"
    ? formattedDateTime.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
    : formattedDateTime;
};

/**
 * Converts a GMT/UTC `Date`-parseable string to a compact `"YYYYMMDDHHmmss"`
 * UTC string.  Inverse of `utcConvertintoGMT`.
 * @param {string} GMTdate - A string parseable by `new Date()`.
 * @returns {string} Compact UTC datetime.
 */
export const convertGMTDateintoUTC = (GMTdate) => {
  const currentDate = new Date(GMTdate);
  // Extract the individual components of the date
  const year = currentDate.getUTCFullYear();
  const month = ("0" + (currentDate.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getUTCDate()).slice(-2);
  const hours = ("0" + currentDate.getUTCHours()).slice(-2);
  const minutes = ("0" + currentDate.getUTCMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getUTCSeconds()).slice(-2);

  // Concatenate the components into the desired format
  const result = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return result;
};

/**
 * Extracts all UTC date/time components from a `Date` object and returns them
 * as a compact `"YYYYMMDDHHmmss"` string.  Used to normalise dates selected
 * via `react-multi-date-picker` before sending them to the API.
 * @param {Date} date
 * @returns {string} Compact UTC datetime.
 */
export const multiDatePickerDateChangIntoUTC = (date) => {
  // Extract the year, month, and day components from the UTC time
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const utcFormatted = `${year}${month}${day}${hour}${minutes}${seconds}`;
  return utcFormatted;
};

/**
 * Formats a `Date` object as `"MMDDYYYY"`.  Returns `""` for invalid dates.
 * @param {Date} date
 * @returns {string}
 */
export function formatDateToMMDDYY(date) {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return an empty string for empty or invalid dates
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}${day}${year}`;
}
/**
 * Formats a `Date` object as `"YYYYMMDD"`.  Returns `""` for invalid dates.
 * @param {Date} date
 * @returns {string}
 */
export function formatDateToYYYYMMDD(date) {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return an empty string for empty or invalid dates
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Formats a `Date` object as `"HHmmss"`.  Returns `""` for invalid dates.
 * @param {Date} date
 * @returns {string}
 */
export function formatTimeToHHMMSS(date) {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return an empty string for empty or invalid dates
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}${minutes}${seconds}`;
}

/**
 * Converts a human-readable date string (e.g. `"15 September, 2023"` or a
 * `Date.toString()` value) to a compact UTC `"YYYYMMDDHHmmss"` string with
 * optional time boundaries:
 *  - `value === 1` → appends `000000` (start of day)
 *  - `value === 2` → appends `235959` (end of day)
 *  - otherwise     → date only (`"YYYYMMDD"`)
 *
 * Used by the Data Room search filter to convert user-selected filter dates.
 *
 * @param {string} inputDate - A string parseable by `new Date()`.
 * @param {1|2|undefined} value - Time-boundary selector.
 * @returns {string} Compact UTC datetime.
 * @throws {RangeError} When `inputDate` is invalid.
 */
export function formatDateToUTC(inputDate, value) {
  // Validate inputDate
  if (!inputDate || isNaN(new Date(inputDate).getTime())) {
    console.error("Invalid input date:", inputDate);
    throw new RangeError("Invalid date value provided.");
  }

  // Parse and format inputDate
  const formattedDate = format(new Date(inputDate), "yyyyMMdd");

  let dateWithTime;
  if (inputDate === "") {
    return (dateWithTime = "");
  } else if (value === 1) {
    dateWithTime = `${formattedDate}000000`; // Append start of the day (00:00:00)
  } else if (value === 2) {
    dateWithTime = `${formattedDate}235959`; // Append end of the day (23:59:59)
  } else {
    dateWithTime = formattedDate; // Default to just the date
  }

  // Extract parts of the date string (yyyyMMddHHmmss)
  const dateString = dateWithTime.toString();
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(dateString.slice(6, 8), 10);
  const hours = parseInt(dateString.slice(8, 10), 10);
  const minutes = parseInt(dateString.slice(10, 12), 10);
  const seconds = parseInt(dateString.slice(12, 14), 10);

  // Create a UTC Date object
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  // Format the UTC Date to 'yyyyMMddHHmmss'
  const formattedYear = utcDate.getUTCFullYear(); // Extract the full year
  const formattedMonth = (utcDate.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0"); // Ensure two-digit month
  const formattedDay = utcDate.getUTCDate().toString().padStart(2, "0"); // Ensure two-digit day
  const formattedHours = utcDate.getUTCHours().toString().padStart(2, "0"); // Ensure two-digit hours
  const formattedMinutes = utcDate.getUTCMinutes().toString().padStart(2, "0"); // Ensure two-digit minutes
  const formattedSeconds = utcDate.getUTCSeconds().toString().padStart(2, "0"); // Ensure two-digit seconds

  // Combine into 'yyyyMMddHHmmss'
  const finalDateTime = `${formattedYear}${formattedMonth}${formattedDay}${formattedHours}${formattedMinutes}${formattedSeconds}`;
  return finalDateTime;
}

/**
 * Core UTC→local converter.  Parses a compact UTC `"YYYYMMDDHHmmss"` string
 * into a local `Date` object.  When `num === 1` the time is overridden to
 * `23:59:00` (end-of-day), useful for range comparisons.
 * @param {string} [date]  - Compact UTC datetime string; uses optional chaining.
 * @param {number} [num]   - Pass `1` to override time to 23:59.
 * @returns {Date}
 */
export const utcConvertintoGMT = (date, num) => {
  let fullDateyear =
    date?.slice(0, 4) +
    "-" +
    date?.slice(4, 6) +
    "-" +
    date?.slice(6, 8) +
    "T" +
    date?.slice(8, 10) +
    ":" +
    date?.slice(10, 12) +
    ":" +
    date?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear);
  if (Number(num) === 1) {
    _dateTime.setHours(23, 59, 0, 0);
  }

  return _dateTime;
};
/**
 * Formats a compact `"YYYYMMDD"` string as `"Do-MMM-YYYY"` (e.g. `"1st-May-2024"`).
 * @param {string} date
 * @returns {string}
 */
export const convertDateinGMT = (date) => {
  return moment(date, "YYYYMMDD").format("Do-MMM-YYYY");
};

/**
 * Converts a compact `"HHmmss"` time string to a `Date` object anchored to
 * the Unix epoch date (`1970-01-01`).  Used by time pickers that need a `Date`
 * rather than a plain string.
 * @param {string} time - e.g. `"143000"`.
 * @returns {Date}
 */
export const timeFormatFunction = (time) => {
  let defaultDate = "1970-01-01T";
  let fullDateTime =
    defaultDate +
    time.slice(0, 2) +
    ":" +
    time.slice(2, 4) +
    ":" +
    time.slice(4, 6) +
    ".000Z";

  let convertTime = new Date(fullDateTime);

  return convertTime;
};

/**
 * Treats a compact `"HHmmss"` UTC time string as today's UTC time and returns
 * the equivalent local `Date`.  Used when creating a meeting for the first time
 * via `react-multi-date-picker`.
 * @param {string} utcTime - e.g. `"113046"`.
 * @returns {Date}
 */
export const convertUtcToGmt = (utcTime) => {
  const currentDateTime = new Date();
  const utcDateTime = `${utcTime.slice(0, 2)}:${utcTime.slice(
    2,
    4
  )}:${utcTime.slice(4, 6)}`;
  const utcDate = new Date(
    `${currentDateTime.toISOString().split("T")[0]}T${utcDateTime}Z`
  );

  return utcDate;
};
/**
 * Iterates over an array of agenda rows and converts both the main-agenda and
 * sub-agenda `startDate`/`endDate` fields from local `Date` strings to compact
 * UTC `"HHmmss"` strings using `convertDateToUTC`.
 * @param {Array<{
 *   startDate: string,
 *   endDate: string,
 *   subAgenda: Array<{startDate: string, endDate: string}>
 * }>} rows
 * @returns {typeof rows} Mutated rows array with UTC times.
 */
export const convertDateFieldsToUTC = (rows) => {
  const convertedRows = rows.map((row) => {
    // Convert main agenda dates to UTC
    row.startDate = convertDateToUTC(row.startDate);
    row.endDate = convertDateToUTC(row.endDate);

    // Convert sub agenda dates to UTC
    row.subAgenda = row.subAgenda.map((subAgenda) => {
      subAgenda.startDate = convertDateToUTC(subAgenda.startDate);
      subAgenda.endDate = convertDateToUTC(subAgenda.endDate);
      return subAgenda;
    });

    return row;
  });

  return convertedRows;
};

/**
 * Converts a `Date`-parseable date string to a compact UTC `"HHmmss"` time
 * string.  Used to extract the UTC time component from local agenda date
 * values.
 * @param {string} dateString - A string parseable by `new Date()`.
 * @returns {string} e.g. `"113046"`.
 */
export const convertDateToUTC = (dateString) => {
  const date = new Date(dateString);
  const utcDate = new Date(date.toUTCString());

  // Extract hours, minutes, and seconds and concatenate without colons
  const hours = utcDate.getUTCHours().toString().padStart(2, "0");
  const minutes = utcDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = utcDate.getUTCSeconds().toString().padStart(2, "0");

  return hours + minutes + seconds;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and extracts the **local**
 * time as a compact `"HHmmss"` string.
 * @param {string} [dateString]
 * @returns {string}
 */
export const convertTimetoGMT = (dateString) => {
  let fullDateyear =
    dateString?.slice(0, 4) +
    "-" +
    dateString?.slice(4, 6) +
    "-" +
    dateString?.slice(6, 8) +
    "T" +
    dateString?.slice(8, 10) +
    ":" +
    dateString?.slice(10, 12) +
    ":" +
    dateString?.slice(12, 14) +
    ".000Z";
  const date = new Date(fullDateyear);

  // Extract hours, minutes, and seconds and concatenate without colons
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return hours + minutes + seconds;
};
/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a compact **local**
 * `"YYYYMMDDHHmmss"` string.  Used in the meeting-details page to convert API
 * timestamps back to the user's local timezone for display.  Swallows errors.
 * @param {string} [dateString]
 * @returns {string|undefined}
 */
export const convertDateTimetoGMTMeetingDetail = (dateString) => {
  try {
    const fullDateYear =
      dateString?.slice(0, 4) +
      "-" +
      dateString?.slice(4, 6) +
      "-" +
      dateString?.slice(6, 8) +
      "T" +
      dateString?.slice(8, 10) +
      ":" +
      dateString?.slice(10, 12) +
      ":" +
      dateString?.slice(12, 14) +
      ".000Z";
    const date = new Date(fullDateYear);

    // Extract year, month, date, hours, minutes, and seconds
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return year + month + day + hours + minutes + seconds;
  } catch {}
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a
 * `"h:mm A - D MMM, YYYY"` display string.  Used in the import-meeting-agenda
 * flow where meeting timestamps are displayed inline with the agenda items.
 * @param {string} [dateTime]
 * @returns {string}
 */
export const newTimeFormaterForImportMeetingAgenda = (dateTime) => {
  let fullDateyear =
    dateTime?.slice(0, 4) +
    "-" +
    dateTime?.slice(4, 6) +
    "-" +
    dateTime?.slice(6, 8) +
    "T" +
    dateTime?.slice(8, 10) +
    ":" +
    dateTime?.slice(10, 12) +
    ":" +
    dateTime?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A - D MMM, YYYY");
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a
 * `"MMM dd, yyyy HH:mm"` string for the login-history admin report.
 * @param {string} [dateTime]
 * @returns {string}
 */
export const LoginHistoryReport = (dateTime) => {
  let fullDateyear =
    dateTime?.slice(0, 4) +
    "-" +
    dateTime?.slice(4, 6) +
    "-" +
    dateTime?.slice(6, 8) +
    "T" +
    dateTime?.slice(8, 10) +
    ":" +
    dateTime?.slice(10, 12) +
    ":" +
    dateTime?.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("MMM dd, yyyy HH:mm");
};

/**
 * Converts two compact UTC `"YYYYMMDDHHmmss"` timestamps to a single
 * `"Do MMM, YYYY h:mm A - h:mm A"` range string for display in meeting cards.
 * @param {string} [startTime] - UTC start datetime.
 * @param {string} [endTime]   - UTC end datetime.
 * @returns {string} e.g. `"1st May, 2024 02:30 PM - 04:00 PM"`.
 */
export const convertDateTimeRangeToGMT = (startTime, endTime) => {
  let StartTimeFormat =
    startTime?.slice(0, 4) +
    "-" +
    startTime?.slice(4, 6) +
    "-" +
    startTime?.slice(6, 8) +
    "T" +
    startTime?.slice(8, 10) +
    ":" +
    startTime?.slice(10, 12) +
    ":" +
    startTime?.slice(12, 14) +
    ".000Z";
  let endTimeFormat =
    endTime?.slice(0, 4) +
    "-" +
    endTime?.slice(4, 6) +
    "-" +
    endTime?.slice(6, 8) +
    "T" +
    endTime?.slice(8, 10) +
    ":" +
    endTime?.slice(10, 12) +
    ":" +
    endTime?.slice(12, 14) +
    ".000Z";
  let convertDateIntoGMT = new Date(StartTimeFormat);
  let convertIntoGMTStartTime = new Date(StartTimeFormat);
  let convertIntoGMTEndTime = new Date(endTimeFormat);

  return `${moment(convertDateIntoGMT).format("Do MMM, YYYY")} ${moment(
    convertIntoGMTStartTime
  ).format("h:mm A")} - ${moment(convertIntoGMTEndTime).format("h:mm A")}`;
};

/**
 * Parses a compact `"YYYYMMDDHHmmss"` string into a **local** `Date` object.
 * Unlike `utcConvertintoGMT`, this uses local time components rather than UTC.
 * @param {string} date
 * @returns {Date}
 */
export const convertDateTimeObject = (date) => {
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10) - 1; // Months are zero-based
  const day = parseInt(date.substring(6, 8), 10);
  const hour = parseInt(date.substring(8, 10), 10);
  const minute = parseInt(date.substring(10, 12), 10);
  const second = parseInt(date.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
};

/**
 * Returns multiple representations of the current date/time:
 *  - `currentTime`  – raw millisecond timestamps joined (not recommended; kept
 *    for backward-compatibility).
 *  - `current_Date` – today as `"YYYYMMDD"`.
 *  - `dateObject`   – `Date` object set to `23:59:58` local time.
 *  - `current_value`– today as `"DD/MM/YYYY"`.
 * @returns {{ currentTime: string, current_Date: string, dateObject: Date, current_value: string }}
 */
export const get_CurrentDateTime = () => {
  let currentDate = new Date();

  // Get the UTC versions of the year, month, day, hours, minutes, seconds
  const year = currentDate.getFullYear();
  const month = `0${currentDate.getMonth() + 1}`.slice(-2); // Months are 0-indexed, so adding 1
  const day = `0${currentDate.getDate()}`.slice(-2);
  const hours = currentDate.setHours(23);
  const minutes = currentDate.setMinutes(59);
  const seconds = currentDate.setSeconds(58);

  const currentTime = `${hours}${minutes}${seconds}`;
  const current_Date = `${year}${month}${day}`;
  const current_value = `${day}/${month}/${year}`;
  return { currentTime, current_Date, dateObject: currentDate, current_value };
};

/**
 * Returns `true` when `currentDate` is strictly after `dataDateValue`
 * (date-only comparison, time components are ignored).  Returns `false` for
 * same-day or future `dataDateValue`, and for invalid `Date` inputs.
 * @param {Date} currentDate
 * @param {Date} dataDateValue
 * @returns {boolean}
 */
export const getDifferentisDateisPassed = (currentDate, dataDateValue) => {
  if (
    currentDate instanceof Date &&
    !isNaN(currentDate) &&
    dataDateValue instanceof Date &&
    !isNaN(dataDateValue)
  ) {
    // Create new Date objects with only date parts
    const currentDateOnlyDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const dataDateValueOnlyDate = new Date(
      dataDateValue.getFullYear(),
      dataDateValue.getMonth(),
      dataDateValue.getDate()
    );

    // Compare the dates
    if (currentDateOnlyDate > dataDateValueOnlyDate) {
      return true; // currentDate is after dataDateValue
    } else {
      return false; // currentDate is not after dataDateValue
    }
  }
  return false; // Invalid input dates
};

/**
 * Converts a `"DD/MM/YYYY"` date string (as produced by proposed-meeting date
 * pickers) to a compact UTC `"YYYYMMDDHHmmss"` string with time `000000`.
 * @param {string} dateStr - e.g. `"25/12/2024"`.
 * @returns {string} Compact UTC datetime with zero time.
 */
export function convertToUTC(dateStr) {
  // Parse the input string to get day, month, and year
  const parts = dateStr.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
  const year = parseInt(parts[2], 10);

  // Create a Date object using UTC values
  const date = new Date(Date.UTC(year, month, day));

  // Format the date as "YYYYMMDDHHMMSS"
  const yearStr = date.getUTCFullYear();
  const monthStr = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const dayStr = date.getUTCDate().toString().padStart(2, "0");
  const hourStr = date.getUTCHours().toString().padStart(2, "0");
  const minuteStr = date.getUTCMinutes().toString().padStart(2, "0");
  const secondStr = date.getUTCSeconds().toString().padStart(2, "0");

  return `${yearStr}${monthStr}${dayStr}${hourStr}${minuteStr}${secondStr}`;
}

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a `"D-M-YYYY | H:mm AM/PM"`
 * display string.  Applies a timezone-offset correction to produce a GMT-based
 * string for the agenda-viewer participant display.
 * @param {string} dateTimeString
 * @returns {string} e.g. `"1-5-2024 | 2:30 PM"`.
 */
export function convertAndFormatDateTimeGMT(dateTimeString) {
  const year = dateTimeString.substring(0, 4);
  const month = dateTimeString.substring(4, 6);
  const day = dateTimeString.substring(6, 8);
  const hour = dateTimeString.substring(8, 10);
  const minute = dateTimeString.substring(10, 12);
  const second = dateTimeString.substring(12, 14);

  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
  const gmtDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Convert to GMT
  const formattedDate = `${gmtDate.getUTCDate()}-${
    gmtDate.getUTCMonth() + 1
  }-${gmtDate.getUTCFullYear()}`;
  const formattedHour = gmtDate.getUTCHours();
  const formattedMinute =
    gmtDate.getUTCMinutes() < 10
      ? "0" + gmtDate.getUTCMinutes()
      : gmtDate.getUTCMinutes();
  const period = formattedHour < 12 ? "AM" : "PM";
  const formattedTime = `${
    formattedHour > 12 ? formattedHour - 12 : formattedHour
  }:${formattedMinute} ${period}`;

  return `${formattedDate} | ${formattedTime}`;
}

/**
 * Returns the current UTC date/time as a compact `"YYYYMMDDHHmmss"` string.
 * @returns {string}
 */
export function getCurrentDateTimeUTC() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a locale-aware short
 * date string (`"MMM DD, YYYY"` / Arabic equivalent) using `Intl.DateTimeFormat`.
 * Swallows errors; returns `undefined` on failure.
 * @param {string} utcDateTime
 * @param {"en"|"ar"} locale
 * @returns {string|undefined}
 */
export const convertUTCDateToLocalDate = (utcDateTime, locale) => {
  try {
    const date = new Date(
      `${utcDateTime.slice(0, 4)}-${utcDateTime.slice(
        4,
        6
      )}-${utcDateTime.slice(6, 8)}T${utcDateTime.slice(
        8,
        10
      )}:${utcDateTime.slice(10, 12)}:${utcDateTime.slice(12, 14)}.000Z`
    );

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      numberingSystem: locale === "ar" ? "arab" : "latn",
    };
    return date.toLocaleString(locale, options);
  } catch {}
};

/**
 * Strips `"T"`, colons, and dashes from an ISO-like date string, returning a
 * compact `"YYYYMMDDHHmmss"` string.  Useful for normalising datetime strings
 * that arrive with separators.
 * @param {string} dateString - e.g. `"2024-05-01T14:30:00"`.
 * @returns {string} e.g. `"20240501143000"`.
 */
export const formattedString = (dateString) => {
  return dateString.replace("T", "").replace(/:/g, "").replace(/-/g, "");
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a
 * `"DD - MMM - YYYY | h:mm A"` display string with full locale support.
 * Used in the Minutes pending-approval list.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const newDateFormatterForMinutesPendingApproval = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the time components (12-hour format with AM/PM)
  const formattedTime = date.toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format the date components
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format the date as "D - MM - YYYY | h:mm A"
  const formattedDate = `${formattedDay} - ${formattedMonth} - ${formattedYear} | ${formattedTime}`;

  // Return formatted date with Arabic or English numerals based on locale
  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]) // Replace digits with Arabic numerals
    : formattedDate;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns a
 * `"DD - MM - YYYY"` date string (numeric month, no time).
 * Used in the signature viewer and pending-approval summary rows.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const SignatureandPendingApprovalDateTIme = (dateTime, locale) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Format date string into ISO format
  const fullDateyear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";

  const date = new Date(fullDateyear);

  // Define month names in English and Arabic
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Format the date components
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedYear = date.getFullYear();

  // Return formatted date with Arabic or English numerals based on locale
  const formattedDate = `${formattedDay} - ${formattedMonth} - ${formattedYear}`;

  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
    : formattedDate;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string and returns separate
 * `DateVal` (`"Do MMM YYYY"`) and `TimeVal` (`"HH:mm a"`) strings for the
 * minutes detail view.
 * @param {string} [dateTime]
 * @returns {{ DateVal: string, TimeVal: string }}
 */
export const newDateFormatForMinutes = (dateTime) => {
  let DateVal;
  let TimeVal;
  let fullDateyear =
    dateTime?.slice(0, 4) +
    "-" +
    dateTime?.slice(4, 6) +
    "-" +
    dateTime?.slice(6, 8) +
    "T" +
    dateTime?.slice(8, 10) +
    ":" +
    dateTime?.slice(10, 12) +
    ":" +
    dateTime?.slice(12, 14) +
    ".000Z";
  let newDateFormate = new Date(fullDateyear);
  DateVal = moment(newDateFormate).format("Do MMM YYYY");
  TimeVal = moment(newDateFormate).format("HH:mm a");
  return { DateVal, TimeVal };
};

/**
 * Formats a compact `"YYYYMMDD"` date string as `"D Month YYYY"` (full month
 * name) with locale support.  Used in the downgrade-subscription flow.
 * Returns `"Invalid date"` for inputs shorter than 8 characters.
 * @param {string} dateString
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export function formatDateDownGradeSubscription(dateString, locale) {
  if (!dateString || dateString.length < 8) {
    return "Invalid date";
  }

  // Extract year, month, day from the input string
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // Create a new Date object
  const date = new Date(`${year}-${month}-${day}`);

  // Define arrays of month names in English and Arabic
  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // Select the appropriate month names based on locale
  const monthNames = locale === "ar" ? monthNamesAr : monthNamesEn;

  // Get the formatted day, month, and year
  const formattedDay = date.getDate();
  const formattedMonth = monthNames[date.getMonth()];
  const formattedYear = date.getFullYear();

  // Format and return the date string
  return locale === "ar"
    ? `${formattedDay} ${formattedMonth} ${formattedYear}`.replace(
        /[0-9]/g,
        (d) => "٠١٢٣٤٥٦٧٨٩"[d]
      ) // Convert to Arabic numerals
    : `${formattedDay} ${formattedMonth} ${formattedYear}`;
}

/**
 * Converts a compact `"YYYYMMDD"` string to `"YYYY-MM-DD"` format.
 * Used to feed date values into HTML date inputs in the downgrade-subscription
 * flow.  Returns `"Invalid date"` for inputs shorter than 8 characters.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDateToDDMMYYYYDownGradeSubscription(dateString) {
  if (!dateString || dateString.length < 8) {
    return "Invalid date";
  }

  // Extract year, month, day from the input string
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  // Create a new Date object
  const date = new Date(`${year}-${month}-${day}`);

  // Get the formatted day, month, and year
  const formattedDay = String(date.getDate()).padStart(2, "0");
  const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
  const formattedYear = date.getFullYear();

  // Return the formatted date string
  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
}

/**
 * Formats a `Date`-parseable `dateTime` value as `"h:mm A, Do MMM, YYYY"`.
 * Used to display poll expiry / creation timestamps.
 * @param {string|Date} dateTime
 * @returns {string}
 */
export const newTimeFormaterViewPoll = (dateTime) => {
  let _dateTime = new Date(dateTime).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY");
};

/**
 * Appends `"235900"` to a compact `"YYYYMMDD"` string (setting time to
 * 23:59:00) and converts the result to a compact UTC `"YYYYMMDDHHmmss"` string.
 * Used to set the end-of-day UTC expiry time when creating a poll.
 * @param {string} date - Compact date `"YYYYMMDD"`.
 * @returns {string} Compact UTC datetime.
 */
export const DateFormatForPolls = (date) => {
  let dateFormatted = `${date}235900`;
  const now = new Date(dateFormatted);
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// export const timePassed = (dateString, locale) => {
//   const givenDate = new Date(dateString);
//   const currentDate = new Date();

//   const diffInMs = currentDate - givenDate; // Difference in milliseconds
//   const diffInSeconds = Math.floor(diffInMs / 1000);
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   const diffInDays = Math.floor(diffInHours / 24);

//   if (diffInDays > 0) {
//     return `${diffInDays} day(s) ago`;
//   } else if (diffInHours > 0) {
//     return `${diffInHours} hour(s) ago`;
//   } else if (diffInMinutes > 0) {
//     return `${diffInMinutes} minute(s) ago`;
//   } else {
//     return `${diffInSeconds} second(s) ago`;
//   }
// };

/**
 * Returns a human-readable relative time string (e.g. `"3 minutes ago"`) for
 * a given date using `date-fns` `formatDistanceToNow`.  Supports `"en"` and
 * `"ar"` locales; Arabic output has Western digits replaced with Arabic-Indic
 * digits.
 * @param {string|Date} dateString - Date to compare against now.
 * @param {"en"|"ar"} locale
 * @returns {string}
 */
export const timePassed = (dateString, locale) => {
  const givenDate = new Date(dateString);

  // Choose the locale based on the input (`en` for English, `ar` for Arabic)
  const selectedLocale = locale === "ar" ? arSA : enUS;

  // Calculate the relative time distance to now, with localization
  let formattedTime = formatDistanceToNow(givenDate, {
    addSuffix: true,
    locale: selectedLocale,
  });

  // If the locale is Arabic, replace Western digits with Arabic-Indic digits
  if (locale === "ar") {
    formattedTime = formattedTime.replace(
      /\d/g,
      (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]
    );
  }

  return formattedTime;
};

/**
 * Parses a compact UTC `"YYYYMMDDHHmmss"` string into a `Date` object.
 * Functionally equivalent to `utcConvertintoGMT` without the optional
 * end-of-day override.
 * @param {string} dateTime
 * @returns {Date}
 */
export const convertIntoDateObject = (dateTime) => {
  let fullDateYear =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    ".000Z";
  let _dateTime = new Date(fullDateYear);
  return _dateTime;
};

/**
 * Converts a compact UTC `"YYYYMMDDHHmmss"` string to a local-timezone
 * `"dd MMMM, yyyy | EEEE"` string (e.g. `"01 May, 2024 | Wednesday"`) with
 * locale support.  Reads locale from `localStorage["i18nextLng"]`.
 * @param {string} dateString
 * @returns {string}
 */
export const formatToLocalTimezone = (dateString) => {
  let currentLang = localStorage.getItem("i18nextLng") || "en";
  const selectedLocale = currentLang === "ar" ? arSA : enUS;

  // Parse the input date string as a UTC date
  const utcDate = parse(dateString, "yyyyMMddHHmmss", new Date());

  // Convert to local time by adjusting for the timezone offset
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  // Format the local date as "dd MMMM, yyyy | EEEE" with the specified locale
  let formattedDate = format(localDate, "dd MMMM, yyyy | EEEE", {
    locale: selectedLocale,
  });

  // If the current language is Arabic, convert numbers to Arabic digits
  if (currentLang === "ar") {
    formattedDate = formattedDate.replace(
      /\d/g,
      (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]
    );
  }

  return formattedDate;
};

/**
 * Checks whether a compact UTC `"YYYYMMDDHHmmss"` string falls on today's
 * local date and returns both the flag and a human-readable formatted string.
 * Reads locale from `localStorage["i18nextLng"]`.
 * @param {string} utcDateString
 * @returns {{ isSame: boolean, formattedDate: string }}
 */
export const isSameAsToday = (utcDateString) => {
  let locale = localStorage.getItem("i18nextLng") || "en";
  // Select locale: 'ar' for Arabic, default to English
  const selectedLocale = locale === "ar" ? arSA : enUS;

  // Parse the input date string in UTC
  const utcDate = parse(utcDateString, "yyyyMMddHHmmss", new Date());

  // Convert UTC date to local time
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  // Get today's date in local timezone
  const today = new Date();

  // Compare if the localDate and today are the same
  const isSame = isSameDay(localDate, today);

  // Format the local date with the selected locale
  const formattedDate = format(localDate, "dd MMMM, yyyy | EEEE", {
    locale: selectedLocale,
  });

  return {
    isSame,
    formattedDate,
  };
};

/**
 * Converts a `Date` object to a compact UTC `"YYYYMMDDHHmmss"` string, with
 * a configurable time boundary:
 *  - `no === 1` → start of day (`00:00:00` local)
 *  - otherwise  → near-end of day (`23:58:59` local)
 *
 * Returns `""` when `newDate` is not a `Date` instance.
 * Used by the Data Room search filter date pickers.
 *
 * @param {Date} newDate
 * @param {1|undefined} no - Pass `1` for start-of-day.
 * @returns {string}
 */
export const dateConverterIntoUTCForDataroom = (newDate, no) => {
  // Check if newDate is a Date instance, return empty string if true
  if (!(newDate instanceof Date)) {
    return ""; // Return empty string if newDate is not a Date instance
  }

  if (no === 1) {
    newDate.setHours(0, 0, 0, 0); // Set to 00:00:00 in local time
  } else {
    newDate.setHours(23, 58, 59, 0); // Set to 23:58:59 in local time
  }

  // Convert to UTC components
  const year = newDate.getUTCFullYear();
  const month = String(newDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(newDate.getUTCDate()).padStart(2, "0");
  const hours = String(newDate.getUTCHours()).padStart(2, "0");
  const minutes = String(newDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(newDate.getUTCSeconds()).padStart(2, "0");

  // Combine into the desired format
  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return formattedDate;
};

/**
 * Formats a `Date` object as a compact `"YYYYMMDD235959"` UTC string (always
 * end-of-day).  Used when sending the review-minutes expiry date to the API.
 * @param {Date} date
 * @returns {string}
 */
export const formatDateToUTCWithEndOfDay = (date) => {
  // Extract the year, month, and day components from the UTC time
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  // Append "235959" to represent the end of the day
  const utcFormatted = `${year}${month}${day}235959`;
  return utcFormatted;
};

/**
 * Formats a `Date` object as a compact `"YYYYMMDD"` UTC date string.
 * Returns `""` for falsy input.  Used by the Data Room search filters.
 * @param {Date|null|undefined} date
 * @returns {string}
 */
export const formatToUTCDateString = (date) => {
  if (!date) return ""; // Handle empty date cases
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

/**
 * Converts a compact `"YYYYMMDD"` date string to a human-readable ordinal
 * date string (e.g. `"1st May 2024"` in English or `"1 مايو 2024"` in Arabic).
 * Returns a localised "Invalid Date" string for malformed input.
 * @param {string|null|undefined} inputDate
 * @param {"en"|"ar"} language
 * @returns {string}
 */
export function ProposedMeetingDateViewFormat(inputDate, language) {
  // Trim and validate the input
  const sanitizedInput = inputDate?.trim() || "";
  if (!sanitizedInput || !/^\d{8}$/.test(sanitizedInput)) {
    return language === "ar" ? "تاريخ غير صالح" : "Invalid Date";
  }

  const year = sanitizedInput.slice(0, 4);
  const month = parseInt(sanitizedInput.slice(4, 6), 10) - 1; // Months are 0-indexed
  const day = parseInt(sanitizedInput.slice(6, 8), 10);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date value.");
  }

  const months = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    ar: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
  };

  const ordinalSuffix = (n, lang) => {
    if (lang === "ar") return `${n}`; // Arabic doesn't use ordinal suffixes
    const lastDigit = n % 10;
    if (n >= 11 && n <= 13) return `${n}th`;
    if (lastDigit === 1) return `${n}st`;
    if (lastDigit === 2) return `${n}nd`;
    if (lastDigit === 3) return `${n}rd`;
    return `${n}th`;
  };

  const formattedDate =
    language === "ar"
      ? `${day} ${months.ar[month]} ${year}`
      : `${ordinalSuffix(day, "en")} ${months.en[month]} ${year}`;

  return formattedDate;
}
/**
 * Builds a combined `"startTime - endTime | date"` display string from a
 * proposed-meeting data object, converting UTC times to the user's local
 * timezone using `Intl.DateTimeFormat`.
 *
 * @param {{
 *   proposedDate: string,
 *   startTime: string,
 *   endTime: string
 * }} dateData - Object with compact UTC date (`"YYYYMMDD"`) and times (`"HHmmss"`).
 * @param {string} lang - BCP 47 locale tag.
 * @returns {string} e.g. `"2:00 PM - 4:00 PM | 1 May 2024"` or `""` on error.
 */
export function ProposedMeetingViewDateFormatWithTime(dateData, lang) {
  if (
    !dateData ||
    !dateData.proposedDate ||
    !dateData.startTime ||
    !dateData.endTime
  ) {
    return "";
  }

  try {
    // Parse the UTC date and time into Date objects
    const datePart = `${dateData.proposedDate.substring(
      0,
      4
    )}-${dateData.proposedDate.substring(
      4,
      6
    )}-${dateData.proposedDate.substring(6, 8)}`;

    const startDateTimeUTC = new Date(
      `${datePart}T${dateData.startTime.substring(
        0,
        2
      )}:${dateData.startTime.substring(2, 4)}:${dateData.startTime.substring(
        4,
        6
      )}Z`
    );

    const endDateTimeUTC = new Date(
      `${datePart}T${dateData.endTime.substring(
        0,
        2
      )}:${dateData.endTime.substring(2, 4)}:${dateData.endTime.substring(
        4,
        6
      )}Z`
    );

    // Convert the UTC times to local timezone
    const startDateTimeLocal = new Date(
      startDateTimeUTC.toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
    const endDateTimeLocal = new Date(
      endDateTimeUTC.toLocaleString("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );

    // Format the date and times based on the language
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat(lang, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const proposedDate = dateFormatter.format(startDateTimeLocal); // Same for both
    const startTime = timeFormatter.format(startDateTimeLocal);
    const endTime = timeFormatter.format(endDateTimeLocal);

    return `${startTime} - ${endTime} | ${proposedDate}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Formats a compact UTC `"YYYYMMDDHHmmss"` string for web push notification
 * badges.  Adjusts to GMT+5, then:
 *  - Today   → returns a 12-hour time string only (`"h:mm am/pm"`).
 *  - Earlier → returns `"h:mm am/pm | DD-MMM-YY"`.
 *
 * Supports `"en"` and `"ar"` locales; throws on invalid input.
 * @param {string} input   - Exactly 14 characters.
 * @param {"en"|"ar"} locale
 * @returns {string}
 * @throws {Error} When `input` is not a valid 14-character string or produces
 *   an invalid `Date`.
 */
export function WebNotificationDateFormatter(input, locale) {
  // Ensure the input is a string and has the expected length
  if (typeof input !== "string" || input.length !== 14) {
    throw new Error("Invalid datetime format. Expected a 14-character string.");
  }

  const year = input.substring(0, 4);
  const month = input.substring(4, 6);
  const day = input.substring(6, 8);
  const hour = input.substring(8, 10);
  const minute = input.substring(10, 12);
  const second = input.substring(12, 14);

  // Format the input into an ISO date string
  const isoDateString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;

  // Create a Date object
  let date = new Date(isoDateString);
  if (isNaN(date)) {
    throw new Error("Invalid date created from input.");
  }

  // Adjust the date to GMT+5 by adding 5 hours
  date = new Date(date.getTime() + 5 * 60 * 60 * 1000);

  // Get today's date in GMT+5
  const today = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
  const isToday =
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate();

  // Format hours and minutes for 12-hour clock
  const hours12 = date.getUTCHours() % 12 || 12; // Convert to 12-hour format
  const ampm = date.getUTCHours() >= 12 ? "pm" : "am";

  if (isToday) {
    if (locale === "ar") {
      // Arabic time formatting for today
      const arabicFormatter = new Intl.DateTimeFormat("ar-SA", {
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h12",
      });

      const arabicTimeParts = arabicFormatter.formatToParts(date);
      const formattedTime = `${arabicTimeParts
        .filter((part) => part.type === "hour" || part.type === "minute")
        .map((part) => part.value)
        .join(":")} ${
        arabicTimeParts.find((part) => part.type === "dayPeriod")?.value
      }`;

      return formattedTime;
    } else {
      // English time formatting for today
      const formattedTime = `${hours12}:${minute} ${ampm}`;
      return formattedTime;
    }
  }

  if (locale === "ar") {
    // Arabic formatting
    const arabicFormatter = new Intl.DateTimeFormat("ar-SA", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12",
    });

    const arabicDateParts = arabicFormatter.formatToParts(date);
    const formattedTime = `${arabicDateParts
      .filter((part) => part.type === "hour" || part.type === "minute")
      .map((part) => part.value)
      .join(":")} ${
      arabicDateParts.find((part) => part.type === "dayPeriod")?.value
    }`;

    const formattedDate = `${
      arabicDateParts.find((part) => part.type === "day")?.value
    }-${arabicDateParts.find((part) => part.type === "month")?.value}-${
      arabicDateParts.find((part) => part.type === "year")?.value
    }`;

    return `${formattedTime} | ${formattedDate}`;
  } else {
    // Default to English formatting
    const formattedDate = `${String(day).padStart(
      2,
      "0"
    )}-${date.toLocaleString("en-US", { month: "short" })}-${String(
      year
    ).substring(2)}`;
    const formattedTime = `${hours12}:${minute} ${ampm}`;

    return `${formattedTime} | ${formattedDate}`;
  }
}

/**
 * Formats a compact UTC `"YYYYMMDDHHmmss"` string as `"hh:mm A - Do MMMM, YYYY"`
 * using `moment` with the given locale.  Used in audit-trail list rows.
 * Returns `""` for inputs that don't have exactly 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} [locale="en"]
 * @returns {string}
 */
export const AuditTrialDateTimeFunction = (dateTime, locale = "en") => {
  if (!dateTime || dateTime.length !== 14) return "";

  // Construct ISO datetime string
  let isoString =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    "Z";

  const momentObj = moment(isoString).locale(locale);

  if (locale === "en") {
    return momentObj.format("hh:mm A - Do MMMM, YYYY");
  } else if (locale === "ar") {
    return momentObj.format("hh:mm A - Do MMMM, YYYY"); // Arabic locale applies automatically
  } else {
    return momentObj.format("hh:mm A - Do MMMM, YYYY"); // fallback to default
  }
};

/**
 * Formats a compact UTC `"YYYYMMDDHHmmss"` string as `"YYYY-MM-DD | hh:mm A"`.
 * Used in the audit-trail action-details view panel.
 * Returns `""` for inputs that don't have exactly 14 characters.
 * @param {string} dateTime
 * @param {"en"|"ar"} [locale="en"]
 * @returns {string}
 */
export const AuditTrialDateTimeFunctionViewActionDetails = (
  dateTime,
  locale = "en"
) => {
  if (!dateTime || dateTime.length !== 14) return "";

  // Construct ISO datetime string
  let isoString =
    dateTime.slice(0, 4) +
    "-" +
    dateTime.slice(4, 6) +
    "-" +
    dateTime.slice(6, 8) +
    "T" +
    dateTime.slice(8, 10) +
    ":" +
    dateTime.slice(10, 12) +
    ":" +
    dateTime.slice(12, 14) +
    "Z";

  const momentObj = moment(isoString).locale(locale);

  // Format: YYYY-MM-DD | hh:mm A
  return momentObj.format("YYYY-MM-DD | hh:mm A");
};



/**
 * Formats a compact UTC `"YYYYMMDDHHmmss"` string as
 * `"HH:mm:ss on DD-MMM-YYYY"` (English) or the Arabic equivalent with Arabic
 * month names, `"في"` preposition, and Arabic-Indic digits.
 * Used to display the OTP resend cooldown expiry timestamp.
 * Returns `"Invalid date"` for inputs shorter than 14 characters.
 * @param {string} dateTime
 * @returns {string}
 */
export const newDateTimeFormatterForOTPResend = (dateTime) => {
  if (!dateTime || dateTime.length < 14) {
    return "Invalid date";
  }

  // Get locale from localStorage (default: "en")
  const locale = localStorage.getItem("i18nextLng") || "en";

  // Build ISO date format
  const isoDate =
    `${dateTime.slice(0, 4)}-${dateTime.slice(4, 6)}-${dateTime.slice(6, 8)}T` +
    `${dateTime.slice(8, 10)}:${dateTime.slice(10, 12)}:${dateTime.slice(12, 14)}.000Z`;

  const m = moment(isoDate).locale(locale);

  // English format
  let formatted = m.format("HH:mm:ss [on] DD-MMM-YYYY");

  // Arabic formatting
  if (locale === "ar") {
    const monthsAr = [
      "يناير","فبراير","مارس","أبريل","مايو","يونيو",
      "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
    ];

    const monthIndex = m.month();

    // Replace month
    formatted = formatted.replace(m.format("MMM"), monthsAr[monthIndex]);

    // Replace "on" → "في"
    formatted = formatted.replace("on", "في");

    // Convert digits → Arabic numerals
    formatted = formatted.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  }

  return formatted;
};

