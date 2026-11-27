/**
 * Every service URL the app talks to, in one place.
 *
 * Each entry is `BASE_URL` + a per-service path, both read from the runtime
 * configuration (`window.APP_CONFIG`, defined by /runtime-config.js and validated
 * in src/config/appConfig.js). Pointing the app at a different environment is
 * therefore a change to that file on the server, not a rebuild. The constants
 * below are evaluated once when this module first loads, which is after
 * runtime-config.js because index.html loads it before the application bundle.
 *
 * Consumers import the named constant rather than composing URLs themselves, so
 * a service moving path is a one-line change here. The values are passed to
 * `axiosInstance` (see commen/functions/axiosInstance.js), which supplies the
 * auth header and session handling.
 *
 * Note the names are historical and not uniform — `getAdminURLs`, `getCalender`,
 * `AuditAPi`, `complainceApi` (both misspellings are load-bearing: they are what
 * the 60-odd importers use). Renaming them is a mechanical but wide change.
 */
import appConfig from "../../config/appConfig";

const baseURL = appConfig.BASE_URL;

// API Endpoints from the runtime configuration
const authenticationApi = baseURL + appConfig.AUTH_API;
const toDoListApi = baseURL + appConfig.TODO_LIST_API;
const settingApi = baseURL + appConfig.SETTING_API;
const settingDownloadApi = baseURL + appConfig.SETTING_DOWNLOAD_API;
const meetingApi = baseURL + appConfig.MEETING_API;

const getAdminURLs = baseURL + appConfig.ADMIN_API;
const dataRoomApi = baseURL + appConfig.DATA_ROOM_API;
const getCommitteesApi = baseURL + appConfig.COMMITTEE_API;
const getGroupsApi = baseURL + appConfig.GROUPS_API;
const getNotesApi = baseURL + appConfig.NOTES_API;
const getResolutionApi = baseURL + appConfig.RESOLUTION_API;
const talkApi = baseURL + appConfig.TALK_API;
const filesUrlTalk = baseURL + appConfig.TALK_IMAGE_API;
const talkApiReport = baseURL + appConfig.TALK_REPORT_API;
const getCalender = baseURL + appConfig.CALENDAR_API;
const pollApi = baseURL + appConfig.POLL_API;
const videoApi = baseURL + appConfig.VIDEO_API;
const reportDownload = baseURL + appConfig.REPORT_DOWNLOAD_API;
const DataRoomAllFilesDownloads =
  baseURL + appConfig.DATA_ROOM_FILES_DOWNLOAD_API;
const userLogOutAuthURL = baseURL + (appConfig.LOGOUT_AUTH_API ?? "");
const workflowApi = baseURL + appConfig.WORKFLOW_API;
// WebSocket Connection
const getSocketConnection = baseURL + (appConfig.SOCKET_API ?? "");

//Audit API
const AuditAPi = baseURL + appConfig.AUDIT_API;

// Complaince Api
const complainceApi = baseURL + appConfig.COMPLIANCE_API;
export {
  authenticationApi,
  toDoListApi,
  settingApi,
  meetingApi,
  getSocketConnection,
  getAdminURLs,
  getNotesApi,
  talkApi,
  filesUrlTalk,
  getGroupsApi,
  getCommitteesApi,
  getResolutionApi,
  dataRoomApi,
  getCalender,
  pollApi,
  videoApi,
  reportDownload,
  DataRoomAllFilesDownloads,
  userLogOutAuthURL,
  workflowApi,
  settingDownloadApi,
  talkApiReport,
  AuditAPi,
  complainceApi,
};
