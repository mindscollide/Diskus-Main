/**
 * Helpers for embedding YouTube videos.
 */

/** A bare YouTube video id: exactly 11 URL-safe characters. */
const BARE_ID = /^[\w-]{11}$/;

/**
 * The id inside any of the URL shapes YouTube uses: watch?v=, youtu.be/,
 * /embed/, /shorts/, /live/ and /v/, on youtube.com or youtube-nocookie.com.
 * The subdomain (www., m.) needs no handling because the pattern is unanchored.
 */
const URL_ID =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/;

/**
 * Get the video id from whatever the backend stored: either the bare id
 * ("dQw4w9WgXcQ") or a full URL in any common form.
 *
 * The FAQ screen used to interpolate the stored value straight into
 * `youtube.com/embed/${value}`. That only works when the value is a bare id — a
 * full URL produces `embed/https://www.youtube.com/watch?v=…`, which YouTube
 * cannot play and reports as "An error occurred. Please try again later.
 * (Playback ID: …)".
 *
 * @param {*} value
 * @returns {string|null} the 11-character id, or null if none can be found
 */
export const extractYouTubeId = (value) => {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (BARE_ID.test(text)) return text;
  const match = text.match(URL_ID);
  return match ? match[1] : null;
};

/**
 * Embed URL for a stored id/URL, or null when no valid id can be found.
 *
 * @param {*} value
 * @returns {string|null}
 */
export const youTubeEmbedUrl = (value) => {
  const id = extractYouTubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};
