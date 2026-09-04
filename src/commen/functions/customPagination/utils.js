/**
 * Convert the digits in a value to Arabic-Indic numerals (U+0660-U+0669).
 *
 * THIRD implementation of this conversion in the codebase, and they do not all
 * agree - check which glyphs you need before reusing one:
 *   - this file                  U+0660-U+0669  Arabic-Indic      as in 0123
 *   - commen/functions/regex.js  same range, via 0x0660 + digit
 *   - ./Paginations.js           U+06F0-U+06F9  Extended/Persian
 *
 * The sibling Paginations.js in this same folder therefore renders page numbers
 * in different glyphs from whatever this produces. Worth consolidating; until
 * then, matching the surrounding UI matters more than which is "correct".
 *
 * Unlike the regex.js helpers this does no zero-padding and no locale check -
 * it converts unconditionally, so the caller decides when Arabic is wanted.
 *
 * @param {number|string} number
 * @returns {string}
 */
export function convertToArabicNumber(number) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    return number
      .toString()
      .replace(/\d/g, (match) => arabicNumbers[Number(match)]);
  };