import { describe, it, expect, beforeAll } from "vitest";

/**
 * appConfig validates window.APP_CONFIG at import time, so the module can only be
 * imported once a valid config exists. The rules themselves are tested through
 * the exported createAppConfig.
 */
const valid = () => ({
  ENV: "uat",
  BASE_URL: "https://api.example.com",
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
  MQTT_HOST: "mqtt.example.com",
  MQTT_PORT: "8883",
});

let createAppConfig;
beforeAll(async () => {
  window.APP_CONFIG = valid();
  ({ createAppConfig } = await import("./appConfig"));
});

describe("createAppConfig", () => {
  it("returns a frozen config with the port as a number", () => {
    const config = createAppConfig(valid());
    expect(config.BASE_URL).toBe("https://api.example.com");
    expect(config.MQTT_PORT).toBe(8883);
    expect(Object.isFrozen(config)).toBe(true);
  });

  it("leaves optional values undefined and flags false when not provided", () => {
    const config = createAppConfig(valid());
    expect(config.VIDEO_EVENTS).toBeUndefined();
    expect(config.APRYSE_KEY).toBeUndefined();
    expect(config.HIDE_VIDEO).toBe(false);
  });

  it("reads flags given as boolean or as the string 'true'", () => {
    const config = createAppConfig({
      ...valid(),
      HIDE_VIDEO: true,
      SHOW_PSO_LOGO: "true",
      MANAGE_AGENDA_START_END_TIME: "false",
    });
    expect(config.HIDE_VIDEO).toBe(true);
    expect(config.SHOW_PSO_LOGO).toBe(true);
    expect(config.MANAGE_AGENDA_START_END_TIME).toBe(false);
  });

  it("keeps BASE_URL and the paths exactly as given (they are concatenated)", () => {
    const config = createAppConfig({
      ...valid(),
      BASE_URL: "https://api.example.com/",
      AUTH_API: "DAuth/",
    });
    expect(config.BASE_URL + config.AUTH_API).toBe(
      "https://api.example.com/DAuth/",
    );
  });

  it("fails with a clear message when the config object is missing", () => {
    expect(() => createAppConfig(undefined)).toThrow(/runtime-config\.js/);
  });

  it("names every missing required property in one error", () => {
    const raw = valid();
    delete raw.BASE_URL;
    delete raw.MQTT_HOST;
    raw.AUTH_API = "  ";
    expect(() => createAppConfig(raw)).toThrow(
      /BASE_URL is missing[\s\S]*MQTT_HOST is missing[\s\S]*AUTH_API is missing|AUTH_API is missing[\s\S]*BASE_URL is missing/,
    );
  });

  it("rejects a BASE_URL without a scheme and a non-numeric MQTT port", () => {
    expect(() =>
      createAppConfig({ ...valid(), BASE_URL: "api.example.com" }),
    ).toThrow(/BASE_URL must start with http/);
    expect(() => createAppConfig({ ...valid(), MQTT_PORT: "eight" })).toThrow(
      /MQTT_PORT must be a number/,
    );
  });
});
