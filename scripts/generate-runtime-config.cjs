#!/usr/bin/env node
/**
 * Turn one of the old per-environment `.env.*` files into a `runtime-config.js`.
 *
 *   node scripts/generate-runtime-config.cjs .env.uat                      (prints)
 *   node scripts/generate-runtime-config.cjs .env.uat deploy-config/uat.js (writes)
 *
 * Only the deployment settings are copied. REACT_APP_SECERETKEY,
 * REACT_APP_MQTT_User and REACT_APP_MQTT_Pass are skipped on purpose: they are
 * identical in every environment, stay build-time values (see vite.config.js)
 * and must not appear in a plain, publicly downloadable file.
 *
 * The output must still be checked by a person: the file is the deployment's
 * contract with the app, and the app validates it at start-up (src/config/appConfig.js).
 */
const fs = require("fs");
const path = require("path");

// runtime key -> the REACT_APP_ variable it used to come from
const STRINGS = {
  ENV: "ENV",
  BASE_URL: "BASE_URL",
  AUTH_API: "AUTH_API",
  TODO_LIST_API: "TODO_LIST_API",
  SETTING_API: "SETTING_API",
  SETTING_DOWNLOAD_API: "SETTING_DOWNLOAD_API",
  MEETING_API: "MEETING_API",
  ADMIN_API: "ADMIN_API",
  DATA_ROOM_API: "DATA_ROOM_API",
  COMMITTEE_API: "COMMITTEE_API",
  GROUPS_API: "GROUPS_API",
  NOTES_API: "NOTES_API",
  RESOLUTION_API: "RESOLUTION_API",
  TALK_API: "TALK_API",
  TALK_IMAGE_API: "TALK_IMAGE_API",
  TALK_REPORT_API: "TALK_REPORT_API",
  CALENDAR_API: "CALENDAR_API",
  POLL_API: "POLL_API",
  VIDEO_API: "VIDEO_API",
  REPORT_DOWNLOAD_API: "REPORT_DOWNLOAD_API",
  DATA_ROOM_FILES_DOWNLOAD_API: "DATA_ROOM_FILES_DOWNLOAD_API",
  WORKFLOW_API: "WORKFLOW_API",
  AUDIT_API: "AUDIT_API",
  COMPLIANCE_API: "COMPLIANCE_API",
  LOGOUT_AUTH_API: "LOGOUT_AUTH_API",
  SOCKET_API: "SOCKET_API",
  MQTT_HOST: "MQTT",
  MQTT_PORT: "MQTT_PORT",
  VIDEO_EVENTS: "VIDEO_EVENTS",
  MS_LOGIN_URL: "MS_LOGIN_URL",
  APRYSE_KEY: "APRYSEKEY",
  GOOGLE_CLIENT_ID: "GOOGLE_CLIENT_ID",
};
const FLAGS = {
  HIDE_VIDEO: "HIDE_VIDEO",
  MANAGE_AGENDA_START_END_TIME: "MANAGE_AGENDA_START_END_TIME",
  HIDE_HEADER_FREETRAIL_BAR: "HIDE_HEADER_FREETRAIL_BAR",
  SHOW_PSO_LOGO: "SHOW_PSO_LOGO",
};

const parseEnv = (text) => {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
};

const [envFile, outFile] = process.argv.slice(2);
if (!envFile) {
  console.error("usage: node scripts/generate-runtime-config.cjs <env file> [output file]");
  process.exit(1);
}

const env = parseEnv(fs.readFileSync(envFile, "utf8"));
const get = (name) => env[`REACT_APP_${name}`];

const lines = [];
for (const [key, envName] of Object.entries(STRINGS)) {
  const value = get(envName);
  if (value === undefined || value === "") continue;
  lines.push(`  ${key}: ${JSON.stringify(value)},`);
}
lines.push("");
for (const [key, envName] of Object.entries(FLAGS)) {
  lines.push(`  ${key}: ${String(get(envName)).toLowerCase() === "true"},`);
}

const output =
  `/** Runtime configuration generated from ${path.basename(envFile)}. See public/runtime-config.js for the property list. */\n` +
  `window.APP_CONFIG = {\n${lines.join("\n")}\n};\n`;

if (outFile) {
  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  fs.writeFileSync(outFile, output);
  console.error(`wrote ${outFile}`);
} else {
  process.stdout.write(output);
}
