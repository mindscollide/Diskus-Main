import moment from "moment";

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
  let dateConvert = moment(date, "YYYYMMDD").format()
  let newDate = new Date(dateConvert).toISOString();
  return newDate.slice(0, 10).replace(/-/g, "")
}
export const newTimeFormaterAsPerUTC = (dateTime) => {
  let fullDateyear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A")
}
export const newTimeFormaterAsPerUTCFullDate = (dateTime) => {
  let fullDateyear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("h:mm A, Do MMM, YYYY")
}
export const _justShowDateformat = (dateTime) => {
  let fullDateyear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("Do MMM, YYYY")
}
export const _justShowDay = (dateTime) => {
  let fullDateyear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateyear).toString("YYYYMMDDHHmmss");
  return moment(_dateTime).format("dddd")
}
export const forRecentActivity = (dateTime) => {
  let fullDateYear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateYear).toString("YYYYMMDDHHmmss");
  return _dateTime;
}

export const startDateTimeMeetingCalendar = (dateTime) => {
  let fullDateYear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateYear).toString("YYYYMMDDHHmmss");
  return _dateTime
}
export const endDateTimeMeetingCalender = (dateTime) => {
  let fullDateYear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = new Date(fullDateYear).toString("YYYYMMDDHHmmss");
  return _dateTime
}

export const createResolutionDateTime = (dateTime) => {
  console.log("createResolutionDateTime12",dateTime)
  let fullDateYear = dateTime.slice(0, 4) + "-" + dateTime.slice(4, 6) + "-" + dateTime.slice(6, 8) + "T" + dateTime.slice(8, 10) + ":" + dateTime.slice(10, 12) + ":" + dateTime.slice(12, 14) + ".000Z";
  let _dateTime = moment(fullDateYear).format("YYYYMMDDHHMMss")
  console.log("_dateTime_dateTime", _dateTime)
  return _dateTime
}

