// its allow only character  space and number and also didnt allow space as a first character
export const regexOnlyForNumberNCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^a-zA-Z0-9\s]/g, "");
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
