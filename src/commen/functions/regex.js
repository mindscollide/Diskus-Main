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

export const convertToArabicNumerals = (input) => {
  console.log(input, "convertToArabicNumerals");
  let currentLanguage = localStorage.getItem("i18nextLng");

  // Check for null or undefined input
  if (input == null || input === undefined) {
    return ""; // Return an empty string if input is null or undefined
  }

  // Convert input to a number and ensure it's valid
  let number = parseInt(input, 10);
  if (isNaN(number)) {
    return ""; // Return an empty string if input is not a valid number
  }

  // Pad the number with a leading zero if it's less than 10
  const paddedNumber = number < 10 ? `0${number}` : String(number); // Convert to string

  // If locale is 'ar', replace digits with Arabic numerals
  if (currentLanguage === "ar") {
    return paddedNumber
      .toString()
      .replace(/\d/g, (digit) =>
        String.fromCharCode(0x0660 + parseInt(digit, 10))
      );
  }

  // Return the padded number as is if locale is not 'ar'
  return paddedNumber;
};

// this take alpha numeric values and convert only numeric value into arabic or english
export const convertNumbersInString = (inputString, locale) => {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const englishDigits = "0123456789";
  {
    console.log("cancelSubscriptionDetails", inputString);
  }

  // Ensure the input is a string
  const safeString = String(inputString);

  // Helper function to convert a single digit
  const convertDigit = (digit, toLocale) => {
    if (toLocale === "ar") {
      return arabicDigits[digit];
    } else if (toLocale === "en") {
      return englishDigits[digit];
    }
    {
      console.log("cancelSubscriptionDetails", digit);
    }

    return digit; // Return as is if locale not supported
  };

  {
    console.log(
      "cancelSubscriptionDetails",
      safeString.replace(/\d/g, (match) => convertDigit(match, locale))
    );
  }
  // Convert the entire string
  return safeString.replace(/\d/g, (match) => convertDigit(match, locale));
};

export function filterHostData(data, guid) {
  // Find the data entry where the guid matches the provided guid
  const matchData = data.find((item) => item.guid === guid);

  if (!matchData) {
    // If no matching data is found, return the original data
    return data;
  }

  // Get the userID of the matched entry
  const matchUserID = matchData.userID;

  // Filter out all entries with the same userID except the matched one
  const filteredData = data.filter((item) => item.userID !== matchUserID);

  // Add the matched data back into the filtered list
  filteredData.push(matchData);

  return filteredData;
}

export const removeParticipantByGuid = (data, guidToRemove) => {
  // Filter the data to exclude the object with the matching guid
  const updatedData = data.filter(
    (participant) => participant.guid !== guidToRemove
  );
  return updatedData;
};
