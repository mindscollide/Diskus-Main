const baseURL = 'http://192.168.18.241'

//this is our services URL
const serviceAuthenticationURL = ':11001/ERM_Auth'
const toDoListURL = ':11003/ToDoList'
// ali work
const settingURL = ':11004/Settings'
// Huzeifa work for Meetings
const meetingURL = ':11002/Meeting'

//get Calendar API URL
const getCalendarURL = ':11002/Meeting'
// aun work
const getMeetingURL = ':11002/Meeting'
// huzeifa work
const getAdminURL = ':11009/Admin'

// DataRoom End Points;
const getDataRoomURL = ':11017/DataRoom'

const getCommitteeURL = ':11013/Committee'

const getGroupsURL = ':11012/Groups'
// Notes
const getNotesURL = ':11011/Notes'
const getResolutionURL = ':11015/Resolution'
// socket url
const getSocketURL = ':9999'

//talk url
const talkURL = ':11014/Talk'

//this is our final api's
const authenticationApi = baseURL + serviceAuthenticationURL
const toDoListApi = baseURL + toDoListURL

const dataRoomApi = baseURL + getDataRoomURL

// ali work
const settingApi = baseURL + settingURL
const meetingApi = baseURL + meetingURL

// aun work
const getMeetingApi = baseURL + getMeetingURL
const getTodoListAPI = baseURL + toDoListURL
// get Data
const getCalenderApi = baseURL + getCalendarURL
// get Socket connection
const getSocketConnection = baseURL + getSocketURL
// get Admin
const getAdminURLs = baseURL + getAdminURL
// get Notes
const getNotesApi = baseURL + getNotesURL

const getResolutionApi = baseURL + getResolutionURL

// get Talk Api
const talkApi = baseURL + talkURL

const getGroupsApi = baseURL + getGroupsURL

const getCommitteesApi = baseURL + getCommitteeURL

export {
  authenticationApi,
  toDoListApi,
  settingApi,
  getMeetingApi,
  getTodoListAPI,
  meetingApi,
  getCalenderApi,
  getSocketConnection,
  getAdminURLs,
  getNotesApi,
  talkApi,
  getGroupsApi,
  getCommitteesApi,
  getResolutionApi,
  dataRoomApi,
}
