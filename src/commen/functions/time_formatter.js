/**
 * @file time_formatter.js
 * @description Date / time construction and formatting helpers used when
 * creating, proposing, and displaying meetings.  All public functions work
 * with JavaScript `Date` objects and the `moment` / `react-multi-date-picker`
 * libraries for consistent formatting across locales.
 */
import moment from "moment";
import { DateObject } from "react-multi-date-picker";
import { utcConvertintoGMT } from "./date_formater";

/**
 * Returns the next whole hour from now as both a `Date` object and a
 * compact `"HHmmss"` string.  Used to pre-fill the meeting start-time field.
 * @returns {{ newFormatTime: Date, formattedTime: string }}
 */
export const getStartTimeWithCeilFunction = () => {
  let newDate = new Date();
  const hours = ("0" + newDate.getHours()).slice(-2);
  const minutes = ("0" + newDate.getMinutes()).slice(-2);

  // Create a new Date object and set the hours and minutes
  newDate.setHours(hours, minutes, 0, 0);

  // Calculate the next hour using the ceil function
  const nextHour = Math.ceil(newDate.getHours() + newDate.getMinutes() / 60);
  const formattedTime = `${String(nextHour).padStart(2, "0")}0000`;

  // Set the new hour and minutes in the Date object
  let newFormatTime = new Date(newDate.setHours(nextHour, 0, 0, 0));

  return { newFormatTime, formattedTime };
};

/**
 * Returns the whole hour that is one hour after now as both a `Date` object
 * and a compact `"HHmmss"` string.  Used to pre-fill the meeting end-time field.
 * @returns {{ newFormatTime: Date, formattedTime: string }}
 */
export const getEndTimeWitlCeilFunction = () => {
  let newDate = new Date();
  const minutes = ("0" + newDate.getMinutes()).slice(-2);

  // Create a new Date object and set the hours and minutes
  newDate.setHours(newDate.getHours() + 1, minutes, 0, 0);

  // Calculate the next hour using the ceil function
  const nextHour = Math.ceil(newDate.getHours() + newDate.getMinutes() / 60);

  // Set the new hour and minutes in the Date object

  // Format the time as HH:mm:ss
  const formattedTime = `${String(nextHour).padStart(2, "0")}0000`;
  let newFormatTime = new Date(newDate.setHours(nextHour, 0, 0, 0));

  return { newFormatTime, formattedTime };
};

/**
 * Returns today's date as both a native `Date` and a `"YYYYMMDD"` string.
 * @returns {{ DateGMT: Date, dateFormat: string }}
 */
export const getCurrentDate = () => {
  let newDate = new Date();

  let DateDate = new DateObject(newDate).format("YYYYMMDD");

  return { DateGMT: newDate, dateFormat: DateDate };
};

/**
 * Converts a local date string (`"YYYY-MM-DD"`) and time string (`"HH:mm:ss"`)
 * to a UTC/GMT string in the format `"YYYY-MM-DD HH:mm:ss GMT"`.
 * @param {string} dateString - Local date, e.g. `"2024-05-01"`.
 * @param {string} timeString - Local time, e.g. `"14:30:00"`.
 * @returns {string} UTC representation, e.g. `"2024-05-01 11:30:00 GMT"`.
 */
export function convertToGMT(dateString, timeString) {
  // Combine date and time strings into a single string
  const combinedDateTimeString = `${dateString}T${timeString}`;

  // Create a Date object using the combined date and time
  const localDateTime = new Date(combinedDateTimeString);

  // Get the UTC versions of the year, month, day, hours, minutes, seconds
  const year = localDateTime.getUTCFullYear();
  const month = `0${localDateTime.getUTCMonth() + 1}`.slice(-2); // Months are 0-indexed, so adding 1
  const day = `0${localDateTime.getUTCDate()}`.slice(-2);
  const hours = `0${localDateTime.getUTCHours()}`.slice(-2);
  const minutes = `0${localDateTime.getUTCMinutes()}`.slice(-2);
  const seconds = `0${localDateTime.getUTCSeconds()}`.slice(-2);

  // Create a string representing the time in GMT format
  const GMTTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`;

  return GMTTimeString;
}

/**
 * Formats a `Date` object as a compact `"YYYYMMDDHHmmss"` string (seconds
 * are always `"00"`).  Returns `undefined` for invalid dates.
 * @param {Date} date
 * @returns {string|undefined}
 */
export const getCurrentDateTime = (date) => {
  // const currentDate = new Date();
  if (date instanceof Date && !isNaN(date)) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Months are 0-indexed, so adding 1
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `00`;

    const dateTimeFormat = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return dateTimeFormat;
  }
};

/**
 * Formats a `Date` object's time component as a compact `"HHmmss"` string
 * (seconds hardcoded to `"00"`).  Returns `undefined` for invalid dates.
 * @param {Date} date
 * @returns {string|undefined}
 */
export const getHoursMinutesSec = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const formattedTime = `${hours.padStart(2, "0")}${minutes.padStart(
      2,
      "0"
    )}${"00"}`;
    return formattedTime;
  }
};

/**
 * Adds one day to a `Date` and returns the incremented date as both a `Date`
 * and a compact `"YYYYMMDD"` string.  Returns `""` for invalid dates.
 * @param {Date} date
 * @returns {{ DateGMT: Date, dateFormat: string }|""}
 */
export const incrementDateforPropsedMeeting = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date(date); // Create a new Date object from the passed date
    newDate.setDate(newDate.getDate() + 1); // Increment the date by 1 day

    let year = newDate.getFullYear();
    let month = `0${newDate.getMonth() + 1}`.slice(-2); // Correctly format the month
    let day = `0${newDate.getDate()}`.slice(-2); // Correctly format the day

    let dateFormat = `${year}${month}${day}`;
    return { DateGMT: newDate, dateFormat };
  }
  return "";
};

/**
 * Returns a display-formatted date string (`"DD/MM/YYYY"`) offset from `date`
 * by `daycount` days (default 1).  Returns `""` for invalid dates.
 * @param {Date}   date
 * @param {number} [daycount=1]
 * @returns {string}
 */
export const dateforView = (date, daycount = 1) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();
    newDate.setDate(date.getDate() + daycount);
    let DateValforView = moment(newDate).format("DD/MM/YYYY");

    return DateValforView;
  }
  return "";
};

/**
 * Returns an API-ready date string (`"YYYY-MM-DD"`) offset from `date`
 * by `daycount` days (default 1).  Returns `""` for invalid dates.
 * @param {Date}   date
 * @param {number} [daycount=1]
 * @returns {string}
 */
export const dateforSend = (date, daycount = 1) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();
    newDate.setDate(date.getDate() + daycount);
    let DateValforSend = moment(newDate).format("YYYY-MM-DD");

    return DateValforSend;
  }

  return "";
};

/**
 * Returns the current time as a `Date` object (for display purposes).
 * Returns `""` for invalid dates.
 * @param {Date} date - Accepted but currently unused; function returns `new Date()`.
 * @returns {Date|""}
 */
export const timeforView = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();

    let timeValuforView = newDate;
    return timeValuforView;
  }
  return "";
};

/**
 * Advances `date` by one hour, zeroes minutes and seconds, and returns the
 * result as an `"HH:mm"` string.  Returns `""` for invalid dates.
 * @param {Date} date
 * @returns {string}
 */
export const timeforSend = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    date.setHours(date.getHours() + 1, 0, 0, 0);

    let timeValforSend = moment(date).format("HH:mm");

    return timeValforSend;
  }
  return "";
};
/**
 * Advances `dateObject` by one hour and zeroes minutes/seconds, then returns
 * the mutated `Date` for use in a schedule-resolution time picker.
 * Returns `""` for invalid dates.
 * @param {Date} dateObject
 * @returns {Date|""}
 */
export const timeforViewScheduleResolution = (dateObject) => {
  if (dateObject instanceof Date && !isNaN(dateObject)) {
    dateObject.setHours(dateObject.getHours() + 1, 0, 0, 0);

    return dateObject;
  }
  return "";
};

/**
 * Returns tomorrow's date as a `"YYYYMMDD"` string.
 * @returns {string}
 */
export const getNextDay = () => {
  return moment().add(1, "day").format("YYYYMMDD");
};

/**
 * Computes the elapsed time between two UTC date strings and returns it as
 * an `"HH:mm:ss"` string.  Returns `""` when the difference is negative
 * (e.g. dateLogOut is before dateLogin).
 * @param {string} dateLogin  - Login timestamp (UTC string accepted by
 *   `utcConvertintoGMT`).
 * @param {string} dateLogOut - Logout timestamp.
 * @returns {string}
 */
export const getTimeDifference = (dateLogin, dateLogOut) => {
  let loginTime = utcConvertintoGMT(dateLogin).getTime();
  let logoutTime = utcConvertintoGMT(dateLogOut).getTime();

  let timeDifference = logoutTime - loginTime;
  if (timeDifference < 0) {
    return "";
  }

  let hours = Math.floor(timeDifference / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// ─── Newly-added formatters ──────────────────────────────────────────────────

/**
 * Parses a compact UTC datetime string (`"YYYYMMDDHHmmss"`) and returns a
 * locale-formatted 12-hour time string (`"hh:mm a"`).
 * Swallows any parse errors and returns `undefined` on failure.
 * @param {string} timeStr - Compact UTC datetime, e.g. `"20240501143000"`.
 * @returns {string|undefined} e.g. `"02:30 pm"`.
 */
export const convertToGMTMinuteTime = (timeStr) => {
  try {
    let fullDateyear =
      timeStr.slice(0, 4) +
      "-" +
      timeStr.slice(4, 6) +
      "-" +
      timeStr.slice(6, 8) +
      "T" +
      timeStr.slice(8, 10) +
      ":" +
      timeStr.slice(10, 12) +
      ":" +
      timeStr.slice(12, 14) +
      ".000Z";
    // Create a Date object
    let date = new Date(fullDateyear).toString();

    let formattedTime = moment(date).format("hh:mm a");
    return formattedTime;
  } catch {}
};

/**
 * Parses a compact UTC date string (`"YYYYMMDD"`) and returns a human-readable
 * date like `"1st May, 2024"`.
 * Swallows parse errors and returns `undefined` on failure.
 * @param {string} dateStr - Compact date, e.g. `"20240501"`.
 * @returns {string|undefined}
 */
export const convertDateToGMTMinute = (dateStr) => {
  try {
    // Extract year, month, and day from the input string
    let year = parseInt(dateStr.substring(0, 4), 10);
    let month = parseInt(dateStr.substring(4, 6), 10) - 1; // Months are zero-indexed in JavaScript
    let day = parseInt(dateStr.substring(6, 8), 10);

    // Create a Date object
    let date = new Date(Date.UTC(year, month, day));

    // Define month names
    const monthNames = [
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

    // Format the date
    let formattedDate = `${date.getUTCDate()}th ${
      monthNames[date.getUTCMonth()]
    }, ${date.getUTCFullYear()}`;

    return formattedDate;
  } catch {}
};

/**
 * Converts a compact date string (`"YYYYMMDD"`) to `"MM/DD/YYYY"` format
 * for display in proposed-meeting date fields.
 * @param {string} dateString - e.g. `"20240501"`.
 * @returns {string} e.g. `"05/01/2024"`.
 */
export const ProposedMeetingformatDate = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return `${month}/${day}/${year}`;
};

/**
 * Converts a compact time string (`"HHmm"`) to `"H:mm AM/PM"` format for
 * display in proposed-meeting time fields.
 * @param {string} timeString - e.g. `"1430"`.
 * @returns {string} e.g. `"2:30 PM"`.
 */
export const ProposedMeetingformatTime = (timeString) => {
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = timeString.slice(2, 4);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${formattedHours}:${minutes} ${period}`;
};

/**
 * Returns the current local date-time as a compact `"YYYYMMDDHHmmss"` string.
 * Used to timestamp "mark as read" notification API calls.
 * @returns {string}
 */
export const getCurrentDateTimeMarkAsReadNotification = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
