/**
 * Placeholder substitution for MQTT message templates.
 *
 * Outgoing MQTT payloads are stored as JSON strings with placeholder tokens in
 * them; these swap the tokens for real values just before publishing.
 *
 * Both use `String.prototype.replace` with a STRING pattern, which replaces only
 * the FIRST occurrence. A template that mentions the same placeholder twice will
 * keep the second one verbatim. Use a global regex at the call site if a
 * template needs repeated substitution.
 *
 * Values are interpolated as-is with no JSON escaping, so a value containing a
 * quote or backslash produces an invalid payload. Callers are responsible for
 * passing already-safe values.
 *
 * `changeMQQTTJSONTwo` is spelled with the triple Q - that typo is load-bearing,
 * it is what the importers use.
 */
export const changeMQTTJSONOne = (message, placeholder, apiData) => {
  const updatedString = message.replace(placeholder, apiData);
  return updatedString;
};

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
