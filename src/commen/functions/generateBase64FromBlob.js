/**
 * Read a Blob and resolve with its base64 payload, WITHOUT the data-URL prefix.
 *
 * `FileReader.readAsDataURL` yields "data:<mime>;base64,<payload>"; the split
 * here drops everything up to the comma so the caller gets just the payload,
 * which is the shape the APIs in this app expect for file uploads (see the
 * `base64File` fields in the workflow / data-room actions).
 *
 * Asynchronous by necessity - FileReader is event-based, so this wraps it in a
 * Promise. Rejects with the FileReader error if the read fails.
 *
 * Note it holds the whole decoded result in memory as a string, and base64 is
 * ~33% larger than the source bytes, so a large PDF costs several times its
 * file size in RAM while this resolves.
 *
 * @param {Blob} blob
 * @returns {Promise<string>} base64 payload with no "data:...;base64," prefix
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
