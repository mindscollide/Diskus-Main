
const baseURL = "http://192.168.18.243";

//this is our services URL
const serviceAuthenticationURL = ':11001/ERM_Auth'

const toDoListURL = ':11003/ToDoList'

// ali work
const settingURL = ':11004/Settings'

// Huzeifa work for Meetings
const meetingURL = ':11002/Meeting'

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
const talkImageUrl = ':11014'
const talkURL = ':11014/Talk'

// Calender
const calenderURL = ':11016/Calender'

// Polls
const PollURL = ':11018/Polls'

//this is our final api's
const authenticationApi = baseURL + serviceAuthenticationURL

const toDoListApi = baseURL + toDoListURL

const dataRoomApi = baseURL + getDataRoomURL

// ali work
const settingApi = baseURL + settingURL

const meetingApi = baseURL + meetingURL

const getTodoListAPI = baseURL + toDoListURL

// get Socket connection
const getSocketConnection = baseURL + getSocketURL

// get Admin
const getAdminURLs = baseURL + getAdminURL

// get Notes
const getNotesApi = baseURL + getNotesURL

const getResolutionApi = baseURL + getResolutionURL

// get Talk Api
const talkApi = baseURL + talkURL

const filesUrlTalk = baseURL + talkImageUrl

const getGroupsApi = baseURL + getGroupsURL

const getCommitteesApi = baseURL + getCommitteeURL

// get Calender
const getCalender = baseURL + calenderURL

const pollApi = baseURL + PollURL

export {
  authenticationApi,
  toDoListApi,
  settingApi,
  meetingApi,
  getTodoListAPI,
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
}
