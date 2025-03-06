const baseURL = process.env.REACT_APP_BASE_URL;

// API Endpoints from Environment Variables
const authenticationApi = baseURL + process.env.REACT_APP_AUTH_API;
const toDoListApi = baseURL + process.env.REACT_APP_TODO_LIST_API;
const settingApi = baseURL + process.env.REACT_APP_SETTING_API;
const settingDownloadApi = baseURL + process.env.REACT_APP_SETTING_DOWNLOAD_API;
const meetingApi = baseURL + process.env.REACT_APP_MEETING_API;
//const meetingApi = "http://localhost:62520/Meeting";
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
};
