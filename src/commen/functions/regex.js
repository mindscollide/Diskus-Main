/**
 * @file regex.js
 * @description String sanitisation, formatting, and regex-validation helpers
 * used across forms, table displays, and localisation (Arabic numeral support).
 */

/**
 * Strips leading whitespace and any character that is not an Arabic letter
 * (`\u0600-\u06FF`), ASCII letter, digit, or space.
 * @param {string} data
 * @returns {string}
 */
export const regexOnlyForNumberNCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, "");
};

/**
 * Strips leading whitespace and any non-ASCII-letter, non-space character.
 * @param {string} data
 * @returns {string}
 */
export const regexOnlyCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^a-zA-Z\s]/g, "");
};

/**
 * Trims a leading space character from a string if present.
 * Prevents inputs from starting with whitespace without blocking mid-word spaces.
 * @param {string} data
 * @returns {string}
 */
export const validateInput = (data) => {
  if (data.charAt(0) === " ") {
    return data.slice(1);
  }
  return data;
};

/**
 * Replaces every forward-slash `/` with a backslash `\\` in the string.
 * Used when building file-path strings that require Windows-style separators.
 * @param {string} inputString
 * @returns {string}
 */
export const replaceSlashWithBackslash = (inputString) => {
  // Use the global "g" flag in the regular expression to replace all occurrences
  return inputString.replace(/\//g, "\\");
};

/**
 * Tests whether a string looks like a valid URL (http/https optional).
 * @param {string} URL
 * @returns {boolean}
 */
export const urlPatternValidation = (URL) => {
  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  return regex.test(URL);
};

/**
 * Removes any character that is not an Arabic letter, ASCII letter, digit,
 * or space from the input string.
 * @param {string} value
 * @returns {string}
 */
export const containsStringandNumericCharacters = (value) => {
  // Use the replace method with the regular expression to remove non-alphanumeric characters
  let cleanedValue = value.replace(/[^\u0600-\u06FFa-zA-Z0-9 ]/g, "");

  // Return the cleaned value
  return cleanedValue;
};

/**
 * Truncates a string to `length` characters, appending `"..."` when truncated.
 * @param {string} string
 * @param {number} length - Max character count including the ellipsis.
 * @returns {string}
 */
export const truncateString = (string, length) => {
  return string.length < length ? string : `${string.slice(0, length - 3)}...`;
};

/**
 * Strips all non-digit characters (and leading whitespace) from a string.
 * @param {string} data
 * @returns {string} Digits only.
 */
export const regexOnlyNumbers = (data) => {
  return data.replace(/^\s/, "").replace(/\D/g, "");
};

/**
 * Zero-pads a number below 10 (`3` → `"03"`) and converts digits to Arabic
 * Eastern numerals when `locale === "ar"`.
 * @param {number} value
 * @param {string} locale - BCP 47 language tag, e.g. `"ar"` or `"en"`.
 * @returns {string}
 */
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

/**
 * Parses `input` as an integer, zero-pads it below 10, and converts each
 * digit to its Arabic Eastern numeral equivalent when the app language is `"ar"`.
 * Returns an empty string for null, undefined, or non-numeric input.
 * @param {number|string} input
 * @returns {string}
 */
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

/**
 * Converts only the digit characters within a mixed alphanumeric string
 * to the target locale's numeral system (Arabic Eastern or ASCII).
 * Non-digit characters are left untouched.
 * @param {string|number} inputString
 * @param {"ar"|"en"} locale
 * @returns {string}
 */
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

/**
 * Ensures the entry matching `guid` appears last in the array and that no
 * other entry with the same `userID` exists. Used to de-duplicate video-call
 * participant lists while keeping the host's own entry at the end.
 * @param {Array<{guid: string, userID: number}>} data
 * @param {string} guid - GUID of the entry to promote.
 * @returns {Array}
 */
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

/**
 * Filters out the participant whose `guid` matches `guidToRemove`.
 * Used when a participant leaves a video call.
 * @param {Array<{guid: string}>} data
 * @param {string} guidToRemove
 * @returns {Array}
 */
export const removeParticipantByGuid = (data, guidToRemove) => {
  // Filter the data to exclude the object with the matching guid
  const updatedData = data.filter(
    (participant) => participant.guid !== guidToRemove
  );
  return updatedData;
};
