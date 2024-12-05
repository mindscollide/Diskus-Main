import { DateTime } from "luxon";
import moment from "moment";
import { formatDistanceToNow, format, parse, isSameDay } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
export const removeDashesFromDate = (data) => {
  let value = data.split("-");
  return `${value[0]}${value[1]}${value[2]}`;
};

export const DateDisplayFormat = (data) =>
  data.slice(6, 8) + "-" + data.slice(4, 6) + "-" + data.slice(0, 4);

//Remove ":"
export const RemoveTimeDashes = (data) =>
  data.slice(0, 2) + data.slice(3, 5) + data.slice(6, 8);

// Time Format
export const TimeDisplayFormat = (data) =>
  data.slice(0, 2) + ":" + data.slice(2, 4) + ":" + data.slice(4, 6);

export const TimeHHMMFormat = (data) =>
  data.slice(0, 2) + ":" + data.slice(2, 4);

export const DateSendingFormat = (data) => {
  if (data.length > 0) {
    let value = data.split("-");
    return `${value[2]}${value[1]}${value[0]}`;
  }
};

export const dateforCalendar = (date) => {
  return date.slice(0, 4) + " ," + date.slice(4, 6) + " , " + date.slice(6, 8);
};

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

export const newDateFormaterAsPerUTC = (date) => {
  let dateConvert = moment(date, "YYYYMMDD").format();
  let newDate = moment(dateConvert).toDate().toISOString();

  return newDate.slice(0, 10).replace(/-/g, "");
};

export const convertintoGMTCalender = (date) => {
  let year = parseInt(date.substr(0, 4));
  let month = parseInt(date.substr(4, 2)) - 1; // Month is zero-based in JavaScript's Date object
  let day = parseInt(date.substr(6, 2));

  let formattedDate = new Date(year, month, day, 18, 10, 36).toString();
  return formattedDate;
};

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

export const _justShowDateformatBilling = (dateTime, locale) => {
  console.log(dateTime, "localelocalelocale");
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

  // Format the date as "D-MMM-YYYY"
  const formattedDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;

  // Return formatted date with Arabic or English numerals based on locale
  return locale === "ar"
    ? formattedDate.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]) // Replace digits with Arabic numerals
    : formattedDate;
};

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

export const resolutionResultTable = (dateTime) => {
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
};

export const createConvert = (dateTime) => {
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

// h:mm:ss

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

// this work is create by huzeifa please dont write any thing below thi line
export const multiDatePickerDateChangIntoUTC = (date) => {
  console.log(date, "utcFormattedutcFormattedutcFormatted");

  // Extract the year, month, and day components from the UTC time
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const utcFormatted = `${year}${month}${day}${hour}${minutes}${seconds}`;
  console.log(utcFormatted, "utcFormattedutcFormattedutcFormatted");
  return utcFormatted;
};

// this is for return only MMDDYY
export function formatDateToMMDDYY(date) {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return an empty string for empty or invalid dates
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}${day}${year}`;
}
// this is for return only MMDDYY
export function formatDateToYYYYMMDD(date) {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return an empty string for empty or invalid dates
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

// Example usage: handling both type and convert it into utc using in data room search
// "15 September, 2023";
// "Sat Dec 31 2022 00:00:00 GMT+0500 (Pakistan Standard Time)";
export function formatDateToUTC(inputDate, value) {
  console.log(inputDate, "inputDateinputDate");
  console.log(value, "inputDateinputDate");
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

  console.log("Date with Time:", dateWithTime);

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
  console.log("Formatted UTC Date:", utcDate);

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
  console.log("Formatted UTC DateTime:", finalDateTime);
  return finalDateTime;
}

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
export const convertDateinGMT = (date) => {
  return moment(date, "YYYYMMDD").format("Do-MMM-YYYY");
};

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

// this is time convertor of react multi date picker which i am getting in this formate "113046" this is using in meeting first time create
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
// this is time convertor of react multi date picker which i am converting  in this formate "113046" this is using in meeting first time create

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

export const convertDateToUTC = (dateString) => {
  const date = new Date(dateString);
  const utcDate = new Date(date.toUTCString());

  // Extract hours, minutes, and seconds and concatenate without colons
  const hours = utcDate.getUTCHours().toString().padStart(2, "0");
  const minutes = utcDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = utcDate.getUTCSeconds().toString().padStart(2, "0");

  return hours + minutes + seconds;
};

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

//Converting to GMT Having Date Plus StartTime And End Time
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

export const convertDateTimeObject = (date) => {
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10) - 1; // Months are zero-based
  const day = parseInt(date.substring(6, 8), 10);
  const hour = parseInt(date.substring(8, 10), 10);
  const minute = parseInt(date.substring(10, 12), 10);
  const second = parseInt(date.substring(12, 14), 10);

  return new Date(year, month, day, hour, minute, second);
};

export const get_CurrentDateTime = () => {
  let currentDate = new Date();

  // Get the UTC versions of the year, month, day, hours, minutes, seconds
  const year = currentDate.getFullYear();
  const month = `0${currentDate.getMonth() + 1}`.slice(-2); // Months are 0-indexed, so adding 1
  const day = `0${currentDate.getDate()}`.slice(-2);
  const hours = `0${currentDate.getHours()}`.slice(-2);
  const minutes = `0${currentDate.getMinutes()}`.slice(-2);

  const currentTime = `${hours}${minutes}${"00"}`;
  const current_Date = `${year}${month}${day}`;
  const current_value = `${day}/${month}/${year}`;
  return { currentTime, current_Date, dateObject: currentDate, current_value };
};

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

// this function made by Huj For proposed meeting date
// Exported function to convert a date string "DD/MM/YYYY" into UTC format
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

//For Agenda Viewer Participant
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

//Huzaifa Sir Global Date Formatter Function Same As Global Admin
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

export const formattedString = (dateString) => {
  return dateString.replace("T", "").replace(/:/g, "").replace(/-/g, "");
};

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

//Date formatter Subscription DownGrade for both english and arabic
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

export const newTimeFormaterViewPoll = (dateTime) => {
  let _dateTime = new Date(dateTime).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY");
};

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
export const timePassed = (dateString, locale) => {
  const givenDate = new Date(dateString);
  console.log("forRecentActivity", givenDate);

  // Choose the locale based on the input (`en` for English, `ar` for Arabic)
  const selectedLocale = locale === "ar" ? arSA : enUS;

  // Calculate the relative time distance to now, with localization
  let formattedTime = formatDistanceToNow(givenDate, {
    addSuffix: true,
    locale: selectedLocale,
  });
  console.log("forRecentActivity", formattedTime);

  // If the locale is Arabic, replace Western digits with Arabic-Indic digits
  if (locale === "ar") {
    formattedTime = formattedTime.replace(
      /\d/g,
      (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]
    );
  }

  console.log("forRecentActivity", formattedTime);
  return formattedTime;
};

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

export const dateConverterIntoUTCForDataroom = (newDate, no) => {
  if (no === 1) {
    newDate.setHours(0, 0, 0, 0); // Set to 00:00:00 in local time
  } else {
    newDate.setHours(23, 58, 59, 0); // Set to 23:58:59 in local time
  }
  console.log(newDate, no, "newDatenewDate");
  // Convert to UTC components
  const year = newDate.getUTCFullYear();
  const month = String(newDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(newDate.getUTCDate()).padStart(2, "0");
  const hours = String(newDate.getUTCHours()).padStart(2, "0");
  const minutes = String(newDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(newDate.getUTCSeconds()).padStart(2, "0");

  // Combine into the desired format
  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

  console.log(formattedDate, "UTC formatted date");
  return formattedDate;
};

//Review Minutes Send Date Format

export const formatDateToUTCWithEndOfDay = (date) => {
  // Extract the year, month, and day components from the UTC time
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  // Append "235959" to represent the end of the day
  const utcFormatted = `${year}${month}${day}235959`;
  console.log(utcFormatted, "utcFormatted with end of day");
  return utcFormatted;
};

// this is used for data rom search
export const formatToUTCDateString = (date) => {
  if (!date) return ""; // Handle empty date cases
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export function ProposedMeetingDateViewFormat(inputDate, language) {
  console.log(inputDate, "inputDateinputDateinputDateinputDate");
  // Trim and validate the input
  const sanitizedInput = inputDate?.trim() || "";
  if (!sanitizedInput || !/^\d{8}$/.test(sanitizedInput)) {
    console.warn(`Invalid or missing date. Received: "${inputDate}"`);
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
    // Parse the date
    const parsedDate = new Date(
      `${dateData.proposedDate.substring(
        0,
        4
      )}-${dateData.proposedDate.substring(
        4,
        6
      )}-${dateData.proposedDate.substring(6, 8)}`
    );

    // Parse the times
    const parsedStartTime = new Date(
      `1970-01-01T${dateData.startTime.substring(
        0,
        2
      )}:${dateData.startTime.substring(2, 4)}:${dateData.startTime.substring(
        4,
        6
      )}`
    );

    const parsedEndTime = new Date(
      `1970-01-01T${dateData.endTime.substring(
        0,
        2
      )}:${dateData.endTime.substring(2, 4)}:${dateData.endTime.substring(
        4,
        6
      )}`
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

    const proposedDate = dateFormatter.format(parsedDate);
    const startTime = timeFormatter.format(parsedStartTime);
    const endTime = timeFormatter.format(parsedEndTime);

    return `${startTime} - ${endTime} | ${proposedDate}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

//Web Notification Date Formatter

export function WebNotficationDateFormatter(input, locale) {
  // Ensure the input is a string and has the expected length
  if (typeof input !== "string" || input.length !== 14) {
    throw new Error("Invalid datetime format. Expected a 14-character string.");
  }

  const year = input.substring(0, 4);
  const month = input.substring(4, 6);
  const day = input.substring(6, 8);
  const hour = parseInt(input.substring(8, 10), 10);
  const minute = input.substring(10, 12);
  const second = input.substring(12, 14);

  // Create a Date object
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

  // Format hours and minutes for 12-hour clock
  const hours12 = date.getHours() % 12 || 12; // Convert to 12-hour format
  const ampm = date.getHours() >= 12 ? "pm" : "am";

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
