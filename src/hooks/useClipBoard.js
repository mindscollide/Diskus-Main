/**
 * @file useClipBoard.js
 * @description Clipboard utility for copying text programmatically using the
 * `clipboard-copy` library (cross-browser fallback for `navigator.clipboard`).
 */
import clipboardCopy from "clipboard-copy";

/**
 * Copies `text` to the system clipboard.  Does nothing when `text` is falsy.
 * Errors are swallowed and logged to the console so callers never need to
 * handle a rejection.
 *
 * @param {string} text - The string to copy to the clipboard.
 * @returns {Promise<void>}
 */
const copyToClipboard = async (text) => {
  try {
    if (text) {
      await clipboardCopy(text);
    }
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
  }
};

export default copyToClipboard;
