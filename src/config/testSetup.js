/**
 * Vitest setup: gives every test file a valid `window.APP_CONFIG`.
 *
 * In the browser `/runtime-config.js` defines it before the app starts; under
 * Vitest there is no such file, and many modules (API endpoints, axios, MQTT,
 * feature flags) read src/config/appConfig.js as soon as they are imported.
 * The values are fake and never contacted.
 */
window.APP_CONFIG = {
  ENV: "test",
  BASE_URL: "https://api.test.invalid",
  AUTH_API: "/auth/",
  TODO_LIST_API: "/todo/",
  SETTING_API: "/setting/",
  SETTING_DOWNLOAD_API: "/setting-download/",
  MEETING_API: "/meeting/",
  ADMIN_API: "/admin/",
  DATA_ROOM_API: "/dataroom/",
  COMMITTEE_API: "/committee/",
  GROUPS_API: "/groups/",
  NOTES_API: "/notes/",
  RESOLUTION_API: "/resolution/",
  TALK_API: "/talk/",
  TALK_IMAGE_API: "/talk-image/",
  TALK_REPORT_API: "/talk-report/",
  CALENDAR_API: "/calendar/",
  POLL_API: "/poll/",
  VIDEO_API: "/video/",
  REPORT_DOWNLOAD_API: "/report-download/",
  DATA_ROOM_FILES_DOWNLOAD_API: "/dataroom-download/",
  WORKFLOW_API: "/workflow/",
  AUDIT_API: "/audit/",
  COMPLIANCE_API: "/compliance/",
  MQTT_HOST: "mqtt.test.invalid",
  MQTT_PORT: "8883",
};
