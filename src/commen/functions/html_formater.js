/**
 * @file html_formater.js
 * @description Utility for detecting whether a string contains HTML markup.
 */

/**
 * Tests whether a string contains any HTML elements by parsing it into a
 * temporary `<div>` and checking for child element nodes.
 * Returns `true` even for partial HTML snippets (e.g. `"<b>hello</b>"`).
 * @param {string} str - The string to inspect.
 * @returns {boolean} `true` if the string contains at least one HTML element.
 */
export function isHTML(str) {
  var a = document.createElement("div");
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true;
  }

  return false;
}
