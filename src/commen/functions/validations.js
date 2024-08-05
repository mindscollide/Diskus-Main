import XRegExp from "xregexp";

export const checkEmptyField = (data) => {
  let dataToStr = String(data);
  return dataToStr.length > 0 ? false : true;
};

export const validEmailAddress = (data) => {
  let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let dataToStr = String(data);

  return dataToStr.match(pattern) ? true : false;
};

export const validateEmail = (email) => {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return re.test(String(email).toLowerCase());
};

export const validationEmail = (value) => {
  var mailformat = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (mailformat.test(value)) {
    return true;
  } else {
    return false;
  }
};

//only are valid from this function
export const stringValidation = (value) => {
  let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
  let stringValidate = valueCheck !== "" ? true : false;
  return stringValidate;
};

export const onlyNumberValidation = (value) => {
  let valueCheck = value.replace(/[^\d]/g, "");
  let numberValidate = valueCheck !== "" ? true : false;
  return numberValidate;
};

export function removePropertiesFromObject(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      // If the current property is an object (but not an array), recursively remove properties from it
      removePropertiesFromObject(obj[key]);
    } else {
      // Remove the specified properties
      if (
        key === "presenterName" ||
        key === "subAgendarequestContributorUrlName" ||
        key === "requestContributorURlName"
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

//Email supports arabic and english langugae both emails formats

export const validateEmailEnglishAndArabicFormat = (email) => {
  const emailRegex = XRegExp(
    `
  ^
  [\\p{L}0-9._%+-]+@[\\p{L}0-9.-]+\\.[\\p{L}]{2,}$
`,
    "xi"
  );
  return emailRegex.test(email);
};

export const validationExtension = (ext) => {
  let arrExtension = [
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "csv",
    "ppt",
    "pptx",
    "json",
    "pdf",
  ];
  return arrExtension.includes(ext);
};

export const validateExtensionsforHTMLPage = (ext) => {
  let newArrExtensions = ["html", "htm"];
  return newArrExtensions.includes(ext);
};
