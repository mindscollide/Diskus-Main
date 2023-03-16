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
  // this function tools date format as an argument
  //i.e YYYYMMDD , DDMMYYYY like this

  let _moment = moment();

  let toDate = _moment.format(format);
  let fromDate = _moment.subtract(1, "years").format(format);
  return { toThisDate: toDate, fromThisDate: fromDate };
  // console.log(toDate, fromDate);
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

  // return num.replace(num.substring(4,12), " **** **** ");;

  // return cardValueMasked;
};

export const newDateFormaterAsPerUTC = (date) => {
  let dateConvert = moment(date, "YYYYMMDD").utc().format("Do MMM YYYY")
  console.log(dateConvert, "dateConvertdateConvertdateConvert")
  return dateConvert

}
export const newTimeFormaterAsPerUTC = (time) => {
  let timeConvert = moment(time, "HHmmss").utc().format("LT")
  console.log(timeConvert, "dateConvertdateConvertdateConvert")
  return timeConvert
}
export const newTimeDateFormaterasPerUTC = (dateTime) => {
  let timeConvert = moment(dateTime, "YYYYMMDDHHmmss").utc().format("h:mm A - Do MMM, YYYY")
  let dateformat = new Date().toISOString()
  console.log(dateformat, "dateConvertdateConvertdateConvert")
  return timeConvert
}