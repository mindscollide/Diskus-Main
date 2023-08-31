export const changeMQTTJSONOne = (message, placeholder, apiData) => {
  const updatedString = message.replace(placeholder, apiData);
  return updatedString;
};

export const changeMQQTTJSONTwo = (
  message,
  placeholder1,
  apiData1,
  placeholder2,
  apiData2
) => {
  const updatedString = message
    .replace(placeholder1, apiData1)
    .replace(placeholder2, apiData2);

  return updatedString;
};
