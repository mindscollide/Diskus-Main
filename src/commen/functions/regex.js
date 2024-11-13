// its allow only character  space and number and also didnt allow space as a first character
export const regexOnlyForNumberNCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, "");
};

// its allow only character  space and also didnt allow space as a first character
export const regexOnlyCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^a-zA-Z\s]/g, "");
};

// not  allow first charector as an space
export const validateInput = (data) => {
  if (data.charAt(0) === " ") {
    return data.slice(1);
  }
  return data;
};

// replace slash / with \\
export const replaceSlashWithBackslash = (inputString) => {
  // Use the global "g" flag in the regular expression to replace all occurrences
  return inputString.replace(/\//g, "\\");
};

// Validae URL regex
export const urlPatternValidation = (URL) => {
  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  return regex.test(URL);
};

export const containsStringandNumericCharacters = (value) => {
  // Use the replace method with the regular expression to remove non-alphanumeric characters
  let cleanedValue = value.replace(/[^\u0600-\u06FFa-zA-Z0-9 ]/g, "");

  // Return the cleaned value
  return cleanedValue;
};

export const truncateString = (string, length) => {
  return string.length < length ? string : `${string.slice(0, length - 3)}...`;
};

// For Only Number Regex
export const regexOnlyNumbers = (data) => {
  return data.replace(/^\s/, "").replace(/\D/g, "");
};

// export const formatValue = (value) => (value < 10 ? `0${value}` : value);
export const formatValue = (value, locale) => {
  const formattedValue = value < 10 ? `0${value}` : value;

  if (locale === "ar") {
    // Convert each digit to its Arabic numeral equivalent
    return formattedValue
      .toString()
      .replace(/\d/g, (digit) => String.fromCharCode(0x0660 + parseInt(digit)));
  }

  return formattedValue;
};
export const convertToArabicNumerals = (number, locale ) => {
  if (locale === 'ar') {
    return number.toString().replace(/\d/g, (digit) =>
      String.fromCharCode(0x0660 + parseInt(digit))
    );
  }
  return number;
};