export const ConvertFileSizeInMB = (fileSize) => {
  const fileSizeInKB = fileSize / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  return fileSizeInMB.toFixed(2);
};

export const isFileSizeValid = (fileSize) => {
  const fileSizeInGB = fileSize / (1024 * 1024 * 1024); // Convert bytes to GB
  const isMorethan = fileSizeInGB <= 1.5;
  return { fileSizeInGB, isMorethan };
};

/**
 * Formats file size intelligently: returns in MB if >= 1024 KB, otherwise in KB.
 * @param {number} kb - File size in kilobytes.
 * @returns {string} - Formatted size string.
 */
export function formatFileSize(kb) {
  if (typeof kb !== "number" || isNaN(kb)) return "Invalid input";
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  }
  return `${kb.toFixed(2)} KB`;
}
/**
 * Formats a file size already in megabytes (MB) to two decimal places with "MB" suffix.
 * @param {number} mb - File size in megabytes.
 * @returns {string} - Formatted file size string like "0.98 MB"
 */
export function formatMB(fileSizeOnDiskus) {
  if (typeof fileSizeOnDiskus !== "number" || isNaN(fileSizeOnDiskus)) {
    return "";
  }

  let currentLanguage = localStorage.getItem("i18nextLng") || "en";

  const locale = currentLanguage === "ar" ? "ar-EG" : "en-US";

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let value;
  let unit;

  if (fileSizeOnDiskus >= 1) {
    value = fileSizeOnDiskus;
    unit = "MB";
  } else {
    value = fileSizeOnDiskus * 1000; // Convert MB to KB
    unit = "KB";
  }

  const formattedNumber = formatter.format(value);

  return `${formattedNumber} ${unit}`;
}
