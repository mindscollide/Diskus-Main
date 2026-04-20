/**
 * @file generateBase64.js
 * @description Utilities for converting Blobs / Apryse documentViewer documents
 * to base64 strings, and for extracting named attribute values from XFDF XML.
 */

/**
 * Reads a `Blob` (or `File`) with the `FileReader` API and resolves with the
 * raw base64 string (without the `data:…;base64,` prefix).
 * @param {Blob} blob
 * @returns {Promise<string>} Raw base64-encoded content.
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

/**
 * Exports the currently open Apryse WebViewer document as a base64 string
 * (without annotations).  The result is also logged to the console.
 *
 * **Note:** The function returns `fileString` synchronously before the inner
 * Promise resolves, so callers that need the value should await the inner
 * `generateBase64FromBlob` promise directly instead of relying on the return
 * value of this function.
 *
 * @param {import("@pdftron/webviewer").WebViewerInstance["Core"]["DocumentViewer"]} documentViewer
 * @returns {Promise<string|undefined>} Base64 string once the inner promise
 *   resolves, or `undefined` if called synchronously.
 */
export const convertDocumentintoBase64 = async (documentViewer) => {
  const doc = documentViewer.getDocument();
  const data = await doc.getFileData({}); // No xfdfString for annotations
  const arr = new Uint8Array(data);
  const blob = new Blob([arr], { type: "application/pdf" });
  let fileString;
  generateBase64FromBlob(blob)
    .then((base64String) => {
      fileString = base64String;
      console.log("xfdfStringxfdf PDF Base64 String:", base64String);
      // Here you can use the base64String as needed
    })
    .catch((error) => {
      console.error("Error generating base64 string:", error);
    });
  return fileString;
};

/**
 * Extracts the value of a named XML attribute from an XFDF string using a
 * regex pattern.  Returns `null` when the attribute is not found.
 *
 * Example: `getfieldValue(xfdf, "name")` → `"SignatureFormField 2"`
 *
 * @param {string} stringValue - Raw XFDF / XML string to search.
 * @param {string} value       - Attribute name to look for.
 * @returns {string|null}
 */
export const getfieldValue = (stringValue, value) => {
  const string = stringValue;
  const regex = `/${value}=\"([^\"]+)\"/;`;
  const match = string.match(regex);

  if (match && match[1]) {
    const nameValue = match[1];
    return nameValue;
    //     console.log(nameValue); // Output: SignatureFormField 2
  } else {
    return null;
    //     console.log("Name field not found in the string.");
  }
};
