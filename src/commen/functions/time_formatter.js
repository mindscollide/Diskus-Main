import { DateObject } from "react-multi-date-picker";

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

export function convertTimeToGMT(dateString, timeString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);
  const seconds = timeString.substring(4, 6);

  const combinedDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  const localDateTime = new Date(combinedDateTimeString);

  const GMTTimeString = localDateTime.toISOString(); // Convert to GMT string

  return GMTTimeString;
}
