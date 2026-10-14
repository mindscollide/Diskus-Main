/**
 * Does this string contain real HTML elements, as opposed to plain text?
 *
 * Parses the string into a detached <div> and looks for any child of nodeType 1
 * (an element). Text, comments and whitespace alone all return false, so
 * "3 < 5" is correctly treated as text while "<p>hi</p>" is not.
 *
 * Used to decide whether a value should be rendered as rich text or escaped as
 * plain text - notes, minutes and chat bodies can be either.
 *
 * SECURITY: this only DETECTS markup, it does not sanitise it. The string is
 * assigned to `innerHTML` on a detached node, so scripts do not execute here,
 * but a true result must not be taken as permission to inject the value into
 * the live DOM unsanitised.
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isHTML(str) {
  var a = document.createElement("div");
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true;
  }

  return false;
}
