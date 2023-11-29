export const timeFormatforResolution = () => {
  const currentDate = new Date();
  const currentHours = currentDate.getHours().toString().padStart(2, "0");
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
  const getcurrentTime = `${currentHours}:${currentMinutes}`;
  return getcurrentTime;
};

export const getTimeWithCeilFunction = () => {
  let newDate = new Date();
  const hours = ("0" + newDate.getHours()).slice(-2);
  const minutes = ("0" + newDate.getMinutes()).slice(-2);

  // Create a new Date object and set the hours and minutes
  newDate.setHours(hours, minutes, 0, 0);

  // Calculate the next hour using the ceil function
  const nextHour = Math.ceil(newDate.getHours() + newDate.getMinutes() / 60);

  // Set the new hour and minutes in the Date object
  let newFormatTime = newDate.setHours(nextHour, 0, 0, 0);
  console.log(newFormatTime, "newFormatTimenewFormatTimenewFormatTime");
  return newDate;
};
