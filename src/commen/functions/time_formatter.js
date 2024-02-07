import moment from "moment";
import { DateObject } from "react-multi-date-picker";
import { utcConvertintoGMT } from "./date_formater";

export const timeFormatforResolution = () => {
  const currentDate = new Date();
  const currentHours = currentDate.getHours().toString().padStart(2, "0");
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
  const getcurrentTime = `${currentHours}:${currentMinutes}`;
  return getcurrentTime;
};

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

export const getCurrentDate = () => {
  let newDate = new Date();

  let DateDate = new DateObject(newDate).format("YYYYMMDD");

  return { DateGMT: newDate, dateFormat: DateDate };
};

//Newly Time Added For Converting Time into GMT Format
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

export const dateforView = (date, daycount = 1) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();
    newDate.setDate(date.getDate() + daycount);
    // let DateValforSend = moment(newDate).format("YYYY-MM-DD");
    let DateValforView = moment(newDate).format("DD/MM/YYYY");
    // let timeValforSend = moment(newDate).format("HH:SS");
    // let timeValuforView = newDate;
    return DateValforView;
  }
  return "";
};

export const dateforSend = (date, daycount = 1) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();
    newDate.setDate(date.getDate() + daycount);
    let DateValforSend = moment(newDate).format("YYYY-MM-DD");

    return DateValforSend;
  }

  return "";
};

export const timeforView = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    let newDate = new Date();
    // newDate.setDate(date.getDate() + daycount);

    let timeValuforView = newDate;
    return timeValuforView;
  }
  return "";
};

export const timeforSend = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    // let newDate = new Date();
    // newDate.setDate(date.getDate() + daycount);

    let timeValforSend = moment(date).format("HH:mm");

    return timeValforSend;
  }
  return "";
};

export const getNextDay = () => {
  return moment().add(1, "day").format("YYYYMMDD");
};

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
