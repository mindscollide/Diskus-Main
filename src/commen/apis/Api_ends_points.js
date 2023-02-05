const baseURL = "http://diskus.axis-work.com";

//this is our services URL
const serviceAuthenticationURL = "/DAuth/";
const toDoListURL = "/DTDList/";
// ali work
const settingURL = "/DSettings/";
// Huzeifa work for Meetings
const meetingURL = "/DMeetings/";

//get Calendar API URL
const getCalendarURL = "/DMeetings/";
// aun work
const getMeetingURL = "/DMeetings/";
// huzeifa work
const getAdminURL = "/DAdmin/";

// socket url
const getSocketURL = ":9999";

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
};
