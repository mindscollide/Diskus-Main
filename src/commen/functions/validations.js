import XRegExp from "xregexp";

export const validateEmail = (email) => {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return re.test(String(email).toLowerCase());
};

export const validationEmail = (value) => {
  var mailformat = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (mailformat.test(value)) {
    console.log(mailformat.test(value), mailformat, "mailformatmailformat");
    return true;
  } else {
    console.log(mailformat.test(value), mailformat, "mailformatmailformat");

    return false;
  }
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


export const getFiscalQuarterDetails = ({
  fiscalStartMonth,
  fiscalStartDay = 1,
  currentDate = new Date(),
}) => {

  const date = new Date(currentDate);

  // Step 1: Get fiscal year start for current year
  let fiscalYearStart = new Date(
    date.getFullYear(),
    fiscalStartMonth - 1,
    fiscalStartDay
  );

  // If current date is before fiscal start → go to previous year
  if (date < fiscalYearStart) {
    fiscalYearStart = new Date(
      date.getFullYear() - 1,
      fiscalStartMonth - 1,
      fiscalStartDay
    );
  }

  // Step 2: Calculate months passed since fiscal start
  const monthsDiff =
    (date.getFullYear() - fiscalYearStart.getFullYear()) * 12 +
    (date.getMonth() - fiscalYearStart.getMonth());

  // Adjust if day is before start day
  const dayAdjustment = date.getDate() < fiscalStartDay ? -1 : 0;

  const adjustedMonths = monthsDiff + dayAdjustment;

  // Step 3: Get quarter
  const quarter = Math.floor(adjustedMonths / 3) + 1;

  // Step 4: Quarter start date
  const quarterStart = new Date(fiscalYearStart);
  quarterStart.setMonth(
    fiscalYearStart.getMonth() + (quarter - 1) * 3
  );

  // Step 5: Quarter end date
  const quarterEnd = new Date(quarterStart);
  quarterEnd.setMonth(quarterStart.getMonth() + 3);
  quarterEnd.setDate(quarterEnd.getDate() - 1);

  return {
    quarter: `Q${quarter}`,
    quarterNumber: quarter,
    startDate: quarterStart,
    endDate: quarterEnd,
  };
};