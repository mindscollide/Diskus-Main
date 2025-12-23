const baseURL = process.env.REACT_APP_BASE_URL;

// API Endpoints from Environment Variables
const authenticationApi = baseURL + process.env.REACT_APP_AUTH_API;
//const authenticationApi = "http://localhost:12278/ERM_Auth";
const toDoListApi = baseURL + process.env.REACT_APP_TODO_LIST_API;
const settingApi = baseURL + process.env.REACT_APP_SETTING_API;
const settingDownloadApi = baseURL + process.env.REACT_APP_SETTING_DOWNLOAD_API;
const meetingApi = baseURL + process.env.REACT_APP_MEETING_API;
//const meetingApi = "http://localhost:62520/Meeting";
const getAdminURLs = baseURL + process.env.REACT_APP_ADMIN_API;
//const getAdminURLs = "http://localhost:42406/Admin";
const dataRoomApi = baseURL + process.env.REACT_APP_DATA_ROOM_API;
//const dataRoomApi = "http://localhost:3308/DataRoom";
const getCommitteesApi = baseURL + process.env.REACT_APP_COMMITTEE_API;
//const getCommitteesApi = "http://localhost:6695/Committee";
const getGroupsApi = baseURL + process.env.REACT_APP_GROUPS_API;
//const getGroupsApi = "http://localhost:47667/Groups";
const getNotesApi = baseURL + process.env.REACT_APP_NOTES_API;
//const getNotesApi = "http://localhost:37716/Notes";
const getResolutionApi = baseURL + process.env.REACT_APP_RESOLUTION_API;
//const getResolutionApi = "http://localhost:37813/Resolution";
const talkApi = baseURL + process.env.REACT_APP_TALK_API;
//const talkApi = "http://localhost:29802/Talk";
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
//const workflowApi = "http://localhost:58762/WorkFlow";
// WebSocket Connection
const getSocketConnection = baseURL + process.env.REACT_APP_SOCKET_API;

//Audit API
const AuditAPi = baseURL + process.env.REACT_APP_AUDIT_API;
//const AuditAPi = "https://localhost:44348/Audit";

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
