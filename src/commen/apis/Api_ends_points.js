/**
 * Every service URL the app talks to, in one place.
 *
 * Each entry is `REACT_APP_BASE_URL` + a per-service path, both supplied by the
 * .env file the build was made with (see the `build:*` scripts in package.json —
 * `env-cmd -f .env.<target>`). Pointing the app at a different environment is
 * therefore a rebuild, never a runtime switch: CRA inlines `process.env.*` as
 * string literals at build time, and these constants are evaluated once when the
 * module first loads.
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
const baseURL = process.env.REACT_APP_BASE_URL;

// API Endpoints from Environment Variables
const authenticationApi = baseURL + process.env.REACT_APP_AUTH_API;
const toDoListApi = baseURL + process.env.REACT_APP_TODO_LIST_API;
const settingApi = baseURL + process.env.REACT_APP_SETTING_API;
const settingDownloadApi = baseURL + process.env.REACT_APP_SETTING_DOWNLOAD_API;
const meetingApi = baseURL + process.env.REACT_APP_MEETING_API;

const getAdminURLs = baseURL + process.env.REACT_APP_ADMIN_API;
const dataRoomApi = baseURL + process.env.REACT_APP_DATA_ROOM_API;
const getCommitteesApi = baseURL + process.env.REACT_APP_COMMITTEE_API;
const getGroupsApi = baseURL + process.env.REACT_APP_GROUPS_API;
const getNotesApi = baseURL + process.env.REACT_APP_NOTES_API;
const getResolutionApi = baseURL + process.env.REACT_APP_RESOLUTION_API;
const talkApi = baseURL + process.env.REACT_APP_TALK_API;
const filesUrlTalk = baseURL + process.env.REACT_APP_TALK_IMAGE_API;
const talkApiReport = baseURL + process.env.REACT_APP_TALK_REPORT_API;
const getCalender = baseURL + process.env.REACT_APP_CALENDAR_API;
const pollApi = baseURL + process.env.REACT_APP_POLL_API;
const videoApi = baseURL + process.env.REACT_APP_VIDEO_API;
const reportDownload = baseURL + process.env.REACT_APP_REPORT_DOWNLOAD_API;
const DataRoomAllFilesDownloads =
  baseURL + process.env.REACT_APP_DATA_ROOM_FILES_DOWNLOAD_API;
const userLogOutAuthURL = baseURL + process.env.REACT_APP_LOGOUT_AUTH_API;
const workflowApi = baseURL + process.env.REACT_APP_WORKFLOW_API;
// WebSocket Connection
const getSocketConnection = baseURL + process.env.REACT_APP_SOCKET_API;

//Audit API
const AuditAPi = baseURL + process.env.REACT_APP_AUDIT_API;

// Complaince Api
const complainceApi = baseURL + process.env.REACT_APP_COMPLIANCE_API;
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
