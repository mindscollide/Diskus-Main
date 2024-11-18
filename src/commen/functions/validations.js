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
    "pdf",
    "fdf",
    "xfdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "pub",
    "dwg",
    "dxf",
    "dgn",
    "rvt",
    "dwf",
    "rtf",
    "odt",
    "ods",
    "odp",
    "wpf",
    "bmp",
    "wmf",
    "emf",
    "gif",
    "hdp",
    "jpg",
    "jp2",
    "jpc",
    "png",
    "tif",
    "tiff",
  ];
  return arrExtension.includes(ext);
};

export const validateExtensionsforHTMLPage = (ext) => {
  let newArrExtensions = ["html", "htm", "mht"];
  return newArrExtensions.includes(ext);
};

export const isBase64 = (str) => {
  if (typeof str !== "string") {
    return false;
  }

  // Remove any data URL prefix if present
  const base64Pattern = /^data:image\/(png|jpeg);base64,/;
  if (base64Pattern.test(str)) {
    str = str.replace(base64Pattern, "");
  }

  // Base64 pattern
  const base64Regex = /^[A-Za-z0-9+/]+[=]{0,2}$/;

  // Check if the length of the string is divisible by 4
  if (str.length % 4 !== 0) {
    return false;
  }

  // Validate using regex
  return base64Regex.test(str);
};
