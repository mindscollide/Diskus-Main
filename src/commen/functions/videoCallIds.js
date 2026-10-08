/**
 * Validation for the room / participant IDs that the video-call APIs need.
 *
 * Why this exists: callers build these request bodies with
 * `String(localStorage.getItem(key))`. `getItem` returns `null` for a key that
 * was never written, and `String(null)` is the TEXT "null" — so a missing ID
 * does not fail loudly, it is sent to the server as the string "null"
 * (`{"RoomID":"null","UID":"null",...}`), which the server cannot match to
 * anyone. The same happens with `undefined`.
 *
 * So the values to reject are not only real `null` / `undefined` but also their
 * stringified forms, which is what actually arrives here.
 *
 * Deliberately NOT treated as missing: `0` / "0". The app writes 0 into
 * `acceptedRoomID` to mean "no active room", but it is a legitimate-looking
 * value that other flows may pass through, so it is left for the server to
 * judge rather than blocked here on a guess.
 */

/** Stringified stand-ins for "no value" (compared trimmed and lower-cased). */
const MISSING_VALUES = new Set(["", "null", "undefined"]);

/**
 * Is this a usable ID — i.e. not null/undefined, not blank, and not the text
 * "null" / "undefined" produced by String() on a missing value?
 *
 * @param {*} value
 * @returns {boolean}
 */
export const isUsableVideoId = (value) => {
  if (value === null || value === undefined) return false;
  return !MISSING_VALUES.has(String(value).trim().toLowerCase());
};

/**
 * Names of the required fields in `data` that are not usable IDs.
 * An empty array means the request is safe to send.
 *
 * @param {object} data - Request payload, e.g. `{ RoomID, UID, IsHandRaised }`
 * @param {string[]} [fields] - Fields that must be present
 * @returns {string[]}
 */
export const findMissingVideoIds = (data, fields = ["RoomID", "UID"]) =>
  fields.filter((field) => !isUsableVideoId(data?.[field]));
