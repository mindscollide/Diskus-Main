/**
 * @module snackBarUtil
 * @description Utility functions for the Diskus snack-bar (toast) notification system.
 *
 * Exports:
 *  - `showMessage`        - Triggers a snack-bar notification and automatically
 *                           dismisses it after 3 seconds.
 *  - `getCurrentDateTime` - Returns the current date-time as a compact numeric
 *                           string in `YYYYMMDDHHmmss` format, suitable for use
 *                           as a filename suffix or audit-log timestamp.
 */

/**
 * Displays a snack-bar notification by updating the provided state setter, then
 * automatically closes it after 3 000 ms.
 *
 * @param {string}   message  - The text content to display in the notification.
 * @param {string}   severity - Severity level that controls the visual style
 *                              (e.g. "success", "error", "warning", "info").
 * @param {Function} setOpen  - React state setter expecting an object with the
 *                              shape `{ open: boolean, message: string, severity: string }`.
 */
export const showMessage = (message, severity, setOpen) => {
  console.log("openopen", message);
  console.log("Showing severity:", severity);

  if (message) {
    setOpen({
      open: true,
      message: message,
      severity: severity,
    });

    // Automatically close the notification after 3 seconds
    setTimeout(() => {
      setOpen((prev) => ({ ...prev, open: false }));
    }, 3000);
  }
};

/**
 * Returns the current local date and time as a 14-character numeric string in
 * `YYYYMMDDHHmmss` format (e.g. "20260331143022"). Month and day values are
 * zero-padded to two digits.
 *
 * @returns {string} Compact date-time string suitable for filenames or timestamps.
 */
// Getting Current Date Time in the Required Format
export const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
