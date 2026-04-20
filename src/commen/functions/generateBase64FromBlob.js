/**
 * @file generateBase64FromBlob.js
 * @description Utility for converting Blob/File objects to base64 strings,
 * used when preparing file attachments for API payloads.
 */

/**
 * Reads a Blob and resolves with its base64-encoded content string
 * (the part after the `data:<mime>;base64,` prefix is stripped).
 * @param {Blob} blob
 * @returns {Promise<string>} Raw base64 string.
 */
export const generateBase64FromBlob = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
};
