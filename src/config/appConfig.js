/**
 * Runtime configuration: the ONE place the app reads environment-specific values.
 *
 * ── Why this exists ───────────────────────────────────────────────────────────
 * The URLs of the backend services, the MQTT broker and a few feature flags used
 * to be `process.env.REACT_APP_*` values that Vite inlined into the bundle, so
 * every environment (UAT, staging, production, PSO ...) needed its own build.
 * They are now read from `window.APP_CONFIG`, which is defined by
 * `/runtime-config.js` — a plain file next to `index.html` that is loaded BEFORE
 * the application bundle and can be replaced on the server without rebuilding.
 *
 * ── Rules ─────────────────────────────────────────────────────────────────────
 * • Import this module; never read `window.APP_CONFIG` anywhere else.
 * • Values here may be edited by whoever deploys the site, so they are PUBLIC:
 *   everything in `runtime-config.js` is downloadable by any visitor. Never put
 *   passwords, private keys or tokens in it. (The MQTT credentials and the
 *   obfuscation key stay build-time `REACT_APP_*` values — see vite.config.js —
 *   because they are identical in every environment and are not deployment
 *   settings.)
 * • The config is validated once, at import. A missing or malformed value stops
 *   the app with a message that names the property, instead of producing requests
 *   to ".../undefined".
 */

/** Properties every deployment must provide. Missing or empty => the app stops. */
const REQUIRED = [
  "ENV",
  "BASE_URL",
  "MQTT_HOST",
  "MQTT_PORT",
  // service paths, appended to BASE_URL (see commen/apis/Api_ends_points.js)
  "AUTH_API",
  "TODO_LIST_API",
  "SETTING_API",
  "SETTING_DOWNLOAD_API",
  "MEETING_API",
  "ADMIN_API",
  "DATA_ROOM_API",
  "COMMITTEE_API",
  "GROUPS_API",
  "NOTES_API",
  "RESOLUTION_API",
  "TALK_API",
  "TALK_IMAGE_API",
  "TALK_REPORT_API",
  "CALENDAR_API",
  "POLL_API",
  "VIDEO_API",
  "REPORT_DOWNLOAD_API",
  "DATA_ROOM_FILES_DOWNLOAD_API",
  "WORKFLOW_API",
  "AUDIT_API",
  "COMPLIANCE_API",
];

/**
 * Properties that may be left out. They keep the meaning they had when the
 * matching `REACT_APP_*` variable was unset: `undefined`.
 */
const OPTIONAL = [
  "LOGOUT_AUTH_API", // exported by Api_ends_points but not used by any screen
  "SOCKET_API", // same
  "VIDEO_EVENTS", // origin of the video-call iframe (postMessage origin check)
  "MS_LOGIN_URL", // Microsoft calendar sync
  "APRYSE_KEY", // Apryse WebViewer licence key (a client-side key by design)
  "GOOGLE_CLIENT_ID",
];

/** Feature switches: `true` / `"true"` turn them on, anything else is off. */
const FLAGS = [
  "HIDE_VIDEO",
  "MANAGE_AGENDA_START_END_TIME",
  "HIDE_HEADER_FREETRAIL_BAR",
  "SHOW_PSO_LOGO",
];

const isFilled = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

/**
 * Validate a raw config object and return the frozen, normalised config.
 * Exported separately so the rules can be tested without touching `window`.
 *
 * @param {object | undefined} raw - normally `window.APP_CONFIG`
 * @returns {Readonly<object>}
 * @throws {Error} naming every problem found, so one deploy attempt fixes them all
 */
export const createAppConfig = (raw) => {
  if (!raw || typeof raw !== "object") {
    throw new Error(
      "[appConfig] window.APP_CONFIG is not defined. /runtime-config.js did not " +
        "load before the application: check that the file exists next to " +
        "index.html, that the server returns it as JavaScript (not the SPA " +
        "fallback page) and that the <script> tag in index.html comes first.",
    );
  }

  const problems = [];

  REQUIRED.forEach((key) => {
    if (!isFilled(raw[key])) problems.push(`${key} is missing`);
  });

  if (isFilled(raw.BASE_URL) && !/^https?:\/\/[^\s]+$/i.test(String(raw.BASE_URL))) {
    problems.push("BASE_URL must start with http:// or https://");
  }
  // BASE_URL and the service paths are joined by plain concatenation, so each
  // deployment decides where the '/' goes (e.g. "https://host/" + "DAuth/" or
  // "https://host" + "/DAuth/"); that is deliberately not validated here.
  if (isFilled(raw.MQTT_PORT) && !/^\d+$/.test(String(raw.MQTT_PORT).trim())) {
    problems.push("MQTT_PORT must be a number");
  }

  if (problems.length > 0) {
    throw new Error(
      "[appConfig] Invalid /runtime-config.js:\n - " + problems.join("\n - "),
    );
  }

  const config = {};
  REQUIRED.forEach((key) => {
    config[key] = String(raw[key]).trim();
  });
  OPTIONAL.forEach((key) => {
    config[key] = isFilled(raw[key]) ? String(raw[key]).trim() : undefined;
  });
  FLAGS.forEach((key) => {
    config[key] = raw[key] === true || String(raw[key]).toLowerCase() === "true";
  });
  config.MQTT_PORT = Number(config.MQTT_PORT);

  return Object.freeze(config);
};

/**
 * Show the failure on the page: a thrown error here happens before React renders,
 * so without this the deployer would just see a blank white screen.
 */
const showBootError = (error) => {
  try {
    const target = document.getElementById("root") || document.body;
    const box = document.createElement("pre");
    box.style.cssText =
      "margin:24px;padding:16px;font:14px/1.5 monospace;white-space:pre-wrap;" +
      "color:#7a1b1b;background:#fdeaea;border:1px solid #e0a3a3;";
    box.textContent = String(error && error.message ? error.message : error);
    target.appendChild(box);
  } catch (e) {
    /* no DOM (tests / SSR): the thrown error is enough */
  }
};

let appConfig;
try {
  appConfig = createAppConfig(
    typeof window !== "undefined" ? window.APP_CONFIG : undefined,
  );
} catch (error) {
  showBootError(error);
  throw error;
}

export default appConfig;
