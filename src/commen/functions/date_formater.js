import moment from "moment";
import { DateObject } from "react-multi-date-picker";

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

// Time Format
export const TimeAndDisplayFormat = (data) =>
  data.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, "$4:$5:$6");

export const DateSendingFormat = (data) => {
  if (data.length > 0) {
    let value = data.split("-");
    return `${value[2]}${value[1]}${value[0]}`;
  }
};

export const currentToOneYearBackDate = (format) => {
  let _moment = moment();
  let toDate = _moment.format(format);
  let fromDate = _moment.subtract(1, "years").format(format);
  return { toThisDate: toDate, fromThisDate: fromDate };
};

export const NumberFormater = (value) => {
  return parseFloat(parseFloat(value).toFixed(2));
};
export const CommaFormter = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

export const CardNumberFormatter = (num) => {
  return num.match(/.{1,4}/g).join(" ");
};

export const newDateFormaterAsPerUTC = (date) => {
  let dateConvert = moment(date, "YYYYMMDD").format();
  const englishFormat = moment(dateConvert).format(
    "MMMM Do, YYYY [at] HH:mm:ss"
  );
  let newDate = moment(dateConvert).toDate().toISOString();
  let formattedDate = newDate.slice(0, 10).replace(/-/g, "");

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

export const newTimeFormaterAsPerUTCFullDate = (dateTime) => {
  console.log(dateTime, "formatetDateTimeformatetDateTime");
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
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY");
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

//Included  New One

export const newTimeFormaterForMeetingAsPerUTCFullDate = (dateTime) => {
  const fullDateyear =
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

  const _dateTime = new Date(fullDateyear);

  // Get the start time, end time, and date
  const startTime = moment(_dateTime).format("h:mm A");
  const endTime = moment(_dateTime).add(1, "hour").format("h:mm A"); // Assuming end time is 1 hour after start time
  const date = moment(_dateTime).format("D MMM, YYYY");

  return `${startTime}, ${endTime}, ${date}`;
};

export const _justShowDateformat = (dateTime) => {
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
  return moment(_dateTime).format("Do MMM, YYYY");
};

export const _justShowDateformatBilling = (dateTime) => {
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
  return moment(_dateTime).format("D-MMM-YYYY");
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

export const forSetstartDateTimeMeetingCalendar = (dateTime) => {
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
  // let _dateTime = moment(fullDateYear, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYYMMDD');

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
  let _dateTime2 = new Date(fullDateYear);

  // let _dateTime = moment(fullDateYear, "YYYY-MM-DDTHH:mm:ss.SSSZ").format(
  //   "YYYYMMDD"
  // );

  return _dateTime;
};

export const endDateTimeMeetingCalender = (dateTime) => {
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

export const createResolutionDateTime = (dateTime) => {
  // let convertUTC = new Date(dateTime,"YYYYMMDDHHmmss").toISOString()
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
  let _dateTime = moment(dateTime, "YYYYMMDDHHmmss").toISOString();
  let convertGMT = new Date(_dateTime).toString();

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
  // let convertTime = moment(convertGMT).format("HH:mm");
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

export const newTimeFormaterAsPerUTCTalkTime = (dateTime) => {
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
  return moment(_dateTime).format("hh:mm a");
};

export const newTimeFormaterAsPerUTCTalkDate = (dateTime) => {
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
  return moment(_dateTime).format("DD-MMM-YYYY");
};

export const newTimeFormaterAsPerUTCTalkDateTime = (dateTime) => {
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
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY");
};

export const newTimeFormaterMIAsPerUTCTalkDateTime = (dateTime) => {
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
  return moment(_dateTime).format("DD-MMM-YYYY h:mm:ss");
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

// Example usage: handling both type and convert it into utc using in data room search
// "15 September, 2023";
// "Sat Dec 31 2022 00:00:00 GMT+0500 (Pakistan Standard Time)";
export function formatDateToUTC(inputDate) {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    // Invalid date string
    return null;
  }

  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return month + day + year;
}

export const utcConvertintoGMT = (date) => {
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

export const newDateFormatterForMinutesPendingApproval = (dateTime) => {
  console.log(dateTime, "newDateFormatterForMinutesPendingApproval");
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
  return moment(_dateTime).format("D - MM -YYYY | h:mm A");
};

export const SignatureandPendingApprovalDateTIme = (dateTime) => {
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

  let _dateTime = new Date(fullDateyear);
  return moment(_dateTime).format("DD - MM - YYYY");
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
