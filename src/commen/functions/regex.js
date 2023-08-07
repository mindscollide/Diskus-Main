// its allow only character  space and number and also didnt allow space as a first character
export const regexOnlyForNumberNCharacters = (data) => {
  return data.replace(/^\s/, "").replace(/[^a-zA-Z0-9\s]/g, "");
};

// its allow only character  space and also didnt allow space as a first character
export const regexOnlyCharacters = (data) => {
    return data.replace(/^\s/, "").replace(/[^a-zA-Z\s]/g, '');
  };