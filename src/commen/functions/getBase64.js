/**
 * @file getBase64.js
 * @description Base64 / Blob conversion utilities used for file previews,
 * HTML document display, and attachment upload preprocessing.
 */

/**
 * Reads a File object and resolves with its full data-URL base64 string
 * (includes the `data:<mime>;base64,` prefix).
 * @param {File} file
 * @returns {Promise<string>}
 */
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * Converts a data-URL base64 string back into a `File` object.
 * Slices the binary data into 512-byte chunks to avoid call-stack overflow
 * when processing large files.
 * @param {string} base64Url - Full data-URL string (with prefix).
 * @param {string} fileName - Name to assign to the resulting File.
 * @param {string} mimeType - MIME type of the file.
 * @returns {File}
 */
function base64UrlToFile(base64Url, fileName, mimeType) {
  const byteCharacters = atob(base64Url.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new File(byteArrays, fileName, { type: mimeType });
}

/**
 * Converts a raw base64 string (no data-URL prefix) to a `Blob`.
 * @param {string} base64 - Raw base64-encoded data.
 * @param {string} mimeType - MIME type for the resulting Blob.
 * @returns {Blob}
 */
const base64ToBlob = (base64, mimeType) => {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Reads a Blob as text and returns the HTML string via the FileReader `onload`
 * callback. Note: the return value from this function is always `undefined`;
 * callers must read the result inside the `onload` closure.
 * @param {Blob} blob - Blob containing HTML content.
 */
const displayBlobAsHtml = (blob) => {
  const reader = new FileReader();

  reader.onload = function (event) {
    // Get the HTML content from the Blob
    const htmlContent = event.target.result;

    return htmlContent;
  };

  reader.readAsText(blob);
};
/**
 * Opens an HTML string in a new browser tab by writing it directly into
 * a blank window's document.
 * @param {string} htmlContent - Raw HTML markup to display.
 */
const openHtmlInNewPage = (htmlContent) => {
  // Open a new window
  const newWindow = window.open("", "_blank");

  // Write HTML content into the new window
  newWindow.document.open();
  newWindow.document.write(htmlContent);
};

export {
  getBase64,
  base64UrlToFile,
  base64ToBlob,
  displayBlobAsHtml,
  openHtmlInNewPage,
};
