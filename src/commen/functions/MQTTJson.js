/**
 * @file MQTTJson.js
 * @description Helpers for building MQTT message payloads by substituting
 * runtime values into template strings that contain placeholder tokens.
 */

/**
 * Replaces a single placeholder token inside an MQTT message template.
 * @param {string} message     - Template string containing `placeholder`.
 * @param {string} placeholder - Token to find in `message`.
 * @param {*}      apiData     - Value to substitute for the placeholder.
 * @returns {string} The message with the placeholder replaced.
 */
export const changeMQTTJSONOne = (message, placeholder, apiData) => {
  const updatedString = message.replace(placeholder, apiData);
  return updatedString;
};

/**
 * Replaces two placeholder tokens inside an MQTT message template in a single
 * chained call.
 * @param {string} message      - Template string containing both placeholders.
 * @param {string} placeholder1 - First token to replace.
 * @param {*}      apiData1     - Value to substitute for `placeholder1`.
 * @param {string} placeholder2 - Second token to replace.
 * @param {*}      apiData2     - Value to substitute for `placeholder2`.
 * @returns {string} The message with both placeholders replaced.
 */
export const changeMQQTTJSONTwo = (
  message,
  placeholder1,
  apiData1,
  placeholder2,
  apiData2
) => {
  const updatedString = message
    .replace(placeholder1, apiData1)
    .replace(placeholder2, apiData2);

  return updatedString;
};
