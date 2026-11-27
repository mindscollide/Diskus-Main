/**
 * Diskus runtime configuration — edited per deployment, NOT part of the build.
 *
 * This file is copied as-is into the build output and loaded by index.html
 * before the application starts. Replace it on the server (or generate it with
 * `node scripts/generate-runtime-config.cjs <env file>`) to point the SAME build
 * at a different environment. No rebuild is needed.
 *
 * The values below are PLACEHOLDERS. The app refuses to start (and says which
 * property is wrong) until they are replaced.
 *
 * Everything here is downloadable by any visitor of the site: do not put
 * passwords, private keys or tokens in this file.
 */
window.APP_CONFIG = {
  // Environment name. "prod" silences console.log/warn/info; "dev" makes the MQTT
  // connection use plain ws:// instead of wss://. Other values: "uat", "staging".
  ENV: "prod",

  // Backend. Every service URL is BASE_URL + the service path below (plain
  // concatenation, so put the "/" wherever your deployment needs it).
  BASE_URL: "https://example-api.com",
  AUTH_API: "/DAuth/",
  TODO_LIST_API: "/DTDList/",
  SETTING_API: "/DSettings/",
  SETTING_DOWNLOAD_API: "/DSettingsDownload/",
  MEETING_API: "/DMeetings/",
  ADMIN_API: "/DAdmin/",
  DATA_ROOM_API: "/DDataRoom/",
  COMMITTEE_API: "/DCommittee/",
  GROUPS_API: "/DGroup/",
  NOTES_API: "/DNotes/",
  RESOLUTION_API: "/DResolution/",
  TALK_API: "/DTalk/",
  TALK_IMAGE_API: "/DTAT/",
  TALK_REPORT_API: "/DTAT/",
  CALENDAR_API: "/DCalender/",
  POLL_API: "/DPoll/",
  VIDEO_API: "/DVC/",
  REPORT_DOWNLOAD_API: "/DReportDownload/",
  DATA_ROOM_FILES_DOWNLOAD_API: "/DataRoomDownload/",
  WORKFLOW_API: "/DWorkflow/",
  AUDIT_API: "/DAudit/",
  COMPLIANCE_API: "/DCompliance/",

  // MQTT broker (real-time updates). Host and port only; the app builds
  // wss://<host>:<port>/mqtt (or ws://<host>:<port> when ENV is "dev").
  MQTT_HOST: "example-mqtt.com",
  MQTT_PORT: "8883",

  // Optional. Leave out (or "") when not used.
  VIDEO_EVENTS: "https://example-api.com:9414", // origin of the video-call iframe
  MS_LOGIN_URL: "", // Microsoft calendar sync authorize URL
  APRYSE_KEY: "", // Apryse WebViewer licence key for this domain
  GOOGLE_CLIENT_ID: "",

  // Feature switches (true / false).
  HIDE_VIDEO: false,
  MANAGE_AGENDA_START_END_TIME: false,
  HIDE_HEADER_FREETRAIL_BAR: false,
  SHOW_PSO_LOGO: false,
};
