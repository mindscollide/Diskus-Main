/**
 * @file customPagination/utils.js
 * @description Numeral conversion utility used by the custom pagination
 * component to render page numbers in Arabic Eastern numerals when the app
 * locale is `"ar"`.
 */

/**
 * Converts every digit in `number` to its Arabic Eastern numeral equivalent
 * using the Unicode Arabic-Indic digit range (٠١٢٣٤٥٦٧٨٩).
 * @param {number|string} number - The number to convert.
 * @returns {string} String representation using Arabic Eastern digit glyphs.
 * @example
 * convertToArabicNumber(42) // → "٤٢"
 */
export function convertToArabicNumber(number) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    return number
      .toString()
      .replace(/\d/g, (match) => arabicNumbers[Number(match)]);
  };