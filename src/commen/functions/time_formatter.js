export const timeFormatforResolution = () => {
  const currentDate = new Date();
  const currentHours = currentDate.getHours().toString().padStart(2, "0");
  const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
  const getcurrentTime = `${currentHours}:${currentMinutes}`;
  return getcurrentTime;
};
