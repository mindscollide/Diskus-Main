import clipboardCopy from "clipboard-copy";

/**
 * @hook copyToClipboard
 * @description Reusable async utility that copies a given text string to the
 * system clipboard using the `clipboard-copy` library. Silently handles errors
 * by logging them to the console rather than re-throwing, so callers do not
 * need their own try/catch.
 * @param {string} text - The text to copy to the clipboard. No-op if falsy.
 * @returns {Promise<void>} Resolves when the copy operation completes (or is skipped)
 */
// Reusable pure function to copy text to clipboard
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
