const baseURL = "http://192.168.18.241";

//this is our services URL
const serviceAuthenticationURL = ":11001/ERM_Auth";
const toDoListURL = ":11003/ToDoList";
// ali work
const settingURL = ":11004/Settings";
// Huzeifa work for Meetings
const meetingURL = ":11002/Meeting";

//get Calendar API URL
const getCalendarURL = ":11002/Meeting";
// aun work
const getMeetingURL = ":11002/Meeting";
// huzeifa work
const getAdminURL = ":11009/Admin";

// Notes
const getNotesURL = ":11011/Notes";

// socket url
const getSocketURL = ":9999";

//talk url
const talkURL = ":11014/Talk";

//this is our final api's
const authenticationApi = baseURL + serviceAuthenticationURL;
const toDoListApi = baseURL + toDoListURL;

// ali work
const settingApi = baseURL + settingURL;

const meetingApi = baseURL + meetingURL;

// aun work
const getMeetingApi = baseURL + getMeetingURL;
const getTodoListAPI = baseURL + toDoListURL;
// get Data
const getCalenderApi = baseURL + getCalendarURL;
// get Socket connection
const getSocketConnection = baseURL + getSocketURL;
// get Admin
const getAdminURLs = baseURL + getAdminURL;
// get Notes
const getNotesApi = baseURL + getNotesURL;

// get Talk Api
const talkApi = baseURL + talkURL;

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
};
