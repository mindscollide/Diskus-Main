/**
 * @file urlVideoCalls.js
 * @description Helpers for constructing video-call iFrame URLs that are passed
 * to the embedded meeting widget.  Supports both the custom WebRTC solution and
 * the Zoom SDK integration (`isZoomEnabled` flag in localStorage).
 */

/**
 * Returns the index immediately after the `.html` extension in a dynamic URL.
 * Used to trim any trailing query parameters inherited from a previous session.
 * @param {string} dynamicUrl - Full URL that contains `.html`.
 * @returns {number} End index of `.html` within the string.
 */
export const endIndexUrl = (dynamicUrl) => {
  console.log("iframeiframe", dynamicUrl);
  const endIndex = dynamicUrl.indexOf(".html") + ".html".length;
  console.log("iframeiframe", endIndex);

  return endIndex;
};

/**
 * Returns the substring of `dynamicUrl` up to (and including) `endIndex`.
 * Typically used together with `endIndexUrl` to strip trailing path segments.
 * @param {string} dynamicUrl
 * @param {number} endIndex - Result of `endIndexUrl`.
 * @returns {string}
 */
export const extractedUrl = (dynamicUrl, endIndex) => {
  const urlExtracted = dynamicUrl.substring(0, endIndex);
  return urlExtracted;
};

/**
 * Builds the iFrame URL for the **caller** (the person who initiates the call).
 *
 * - Zoom SDK enabled → inline query string with `userName`, `sessionKey`,
 *   `userGuid`, `isHideCamera`, and `isMute`.
 * - Custom WebRTC → `URLSearchParams` with `UserName`, `Type: "Call"`,
 *   and `RoomID`.
 *
 * @param {string} baseURL         - Base `.html` URL of the video widget.
 * @param {string} callerFullName  - Display name of the caller.
 * @param {string} roomID          - Unique meeting room identifier.
 * @param {string} UserGuid        - GUID of the calling user.
 * @returns {string} Complete iFrame URL with query parameters.
 */
export const generateURLCaller = (
  baseURL,
  callerFullName,
  roomID,
  UserGuid
) => {
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  let queryParams;
  console.log("iframeiframe", baseURL);
  console.log("iframeiframe", roomID);
  if (isZoomEnabled) {
    queryParams = `userName=${callerFullName}&sessionKey=${roomID}&userGuid=${UserGuid}&isHideCamera=false&isMute=false`;
    console.log("iframeiframe", queryParams);
  } else {
    queryParams = new URLSearchParams({
      UserName: callerFullName,
      Type: "Call",
      RoomID: roomID,
    });
  }

  return `${baseURL}?${queryParams.toString()}`;
};

/**
 * Builds the iFrame URL for a **participant** (someone who joins an existing call).
 *
 * - Zoom SDK enabled → returns `presenterViewvideoURL` from localStorage when
 *   present (presenter-view override), otherwise builds inline query string.
 * - Custom WebRTC → `URLSearchParams` with `UserName`, `Type: "Join"`,
 *   and `RoomID`.
 *
 * @param {string} baseURL              - Base `.html` URL of the video widget.
 * @param {string} participantFullName  - Display name of the participant.
 * @param {string} roomID               - Unique meeting room identifier.
 * @param {string} UserGuid             - GUID of the joining user.
 * @returns {string} Complete iFrame URL with query parameters.
 */
export const generateURLParticipant = (
  baseURL,
  participantFullName,
  roomID,
  UserGuid
) => {
  let queryParams;
  let isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
  console.log("iframeiframe", UserGuid);
  console.log("iframeiframe", roomID);
  console.log("iframeiframe", participantFullName);
  if (isZoomEnabled) {
    let presenterViewvideoURL = localStorage.getItem("presenterViewvideoURL");
    console.log("iframeiframe", presenterViewvideoURL);
    if (presenterViewvideoURL) {
      return presenterViewvideoURL;
    } else {
      queryParams = `userName=${participantFullName}&sessionKey=${roomID}&userGuid=${UserGuid}&isHideCamera=false&isMute=false`;
      console.log("iframeiframe", queryParams);
    }
    console.log("iframeiframe", isZoomEnabled);

    console.log("iframeiframe", queryParams);
  } else {
    console.log("iframeiframe");
    queryParams = new URLSearchParams({
      UserName: participantFullName,
      Type: "Join",
      RoomID: roomID,
    });
  }

  console.log("iframeiframe");
  return `${baseURL}?${queryParams.toString()}`;
};

/**
 * Generates a random guest display name in the form `"Guest####"` where
 * `####` is a random 4-digit number between 1000 and 9999.
 * @returns {string} e.g. `"Guest4271"`.
 */
export const generateRandomGuest = () => {
  // Generate a random 4-digit number
  const randomNum = Math.floor(Math.random() * 9000) + 1000;

  // Create the final string by appending the random number
  const guestString = `Guest${randomNum}`;

  // Return the result
  return guestString;
};
