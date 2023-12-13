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
  const utcTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Extract the year, month, and day components from the UTC time
  const year = utcTime.getUTCFullYear();
  const month = String(utcTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utcTime.getUTCDate()).padStart(2, "0");
  const utcFormatted = `${year}${month}${day}`;

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

export const convertDateTimeRangeToGMT = (date, startTime, endTime) => {
  const startDateTime = moment
    .utc(
      `${date}T${startTime.slice(0, 2)}:${startTime.slice(
        2,
        4
      )}:${startTime.slice(4, 6)}Z`,
      "YYYYMMDDTHHmmssZ"
    )
    .format("h:mm A, Do MMM, YYYY [GMT]");

  const endDateTime = moment
    .utc(
      `${date}T${endTime.slice(0, 2)}:${endTime.slice(2, 4)}:${endTime.slice(
        4,
        6
      )}Z`,
      "YYYYMMDDTHHmmssZ"
    )
    .format("h:mm A, Do MMM, YYYY [GMT]");

  return { startDateTime, endDateTime };
};
