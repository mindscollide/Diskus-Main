const signuprequest = {
  RequestMethod: "ServiceManager.SignUp",
};

const signinauthenication = {
  RequestMethod: "ServiceManager.Login",
};

const forgetpassword = {
  RequestMethod: "ServiceManager.ForgotPassword",
};

const verifyotp = {
  RequestMethod: "ServiceManager.VerifyOTP",
};

const verifyOTPSignUp = {
  RequestMethod: "ServiceManager.OTPVerification",
};

const resendOTP = {
  RequestMethod: "ServiceManager.ResendOTP",
};

const resendOTPForgotPassword = {
  RequestMethod: "ServiceManager.ResendPassConfirmationOTP",
};

const changepassword = {
  RequestMethod: "ServiceManager.ChangePassword",
};

const authenticationRefreshToken = {
  RequestMethod: "ServiceManager.RefreshToken",
};

// schedule new metings
const scheduleNewMeeting = {
  RequestMethod: "ServiceManager.ScheduleNewMeeting",
};
// update metings
const updateMeeting = {
  RequestMethod: "ServiceManager.UpdateMeeting",
};
//To-Do List APIs
//Get List By ID
const getToDoListByUserID = {
  RequestMethod: "ServiceManager.GetToDoListByUserID",
};

//Create To-Do List
const createToDoList = {
  RequestMethod: "ServiceManager.CreateToDoList",
};

//Create To-Do List
const uploadDocument = {
  RequestMethod: "ServiceManager.UploadDocument",
};

//Get All Assignees for To-Do List
const getAllAssigneesToDoList = {
  RequestMethod: "ServiceManager.GetAllAssignees",
};

// ali work
const getUserSettings = {
  RequestMethod: "ServiceManager.GetUserSettings",
};
const updateUserNotificationSetting = {
  RequestMethod: "ServiceManager.UpdateUserNotificationSettings",
};
const updateUserGeneralSetting = {
  RequestMethod: "ServiceManager.UpdateUserGeneralSettings",
};
const updateUserProfileSetting = {
  RequestMethod: "ServiceManager.UpdateUserProfileSettings",
};
const getUserNotifcations = {
  RequestMethod: "ServiceManager.GetUserNotifications",
};
const getCountryCode = {
  RequestMethod: "ServiceManager.GetAllCountryCodes",
};
const getTimeZOne = {
  RequestMethod: "ServiceManager.GetAllTimeZones",
};
// aun
//Get FAQ's
const getFaqs = {
  RequestMethod: "ServiceManager.GetFAQs",
};

//aun
// Get Meeting Id By User id
const getMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingsByUserID",
};

//startMeeting
const startMeeting = {
  RequestMethod: "ServiceManager.StartMeeting",
};

//endMeeting
const endMeeting = {
  RequestMethod: "ServiceManager.EndMeeting",
};

//aun
//Get todolist by userId
const getTodoList = {
  RequestMethod: "ServiceManager.GetToDoListByUserID",
};

// schedule View metings
const getMeetingByMeetingID = {
  RequestMethod: "ServiceManager.GetMeetingByMeetingID",
};

// View To-Do List
const getToDoListByToDoListID = {
  RequestMethod: "ServiceManager.GetToDoListByToDoListID",
};

// Edit To-Do List
const updateToDoList = {
  RequestMethod: "ServiceManager.UpdateToDoList",
};

// Edit To-Do List
const cancelMeeting = {
  RequestMethod: "ServiceManager.CancelMeeting",
};
// Get Data for Calender

const calendarDataRequest = {
  RequestMethod: "ServiceManager.GetMeetingEventsByUserId",
};

//search todolist by userId
const searchTodoList = {
  RequestMethod: "ServiceManager.SearchToDoList",
};

// search Meeting Id By User id
const searchMeetingId = {
  RequestMethod: "ServiceManager.SearchMeetings",
};

const todosStatus = {
  RequestMethod: "ServiceManager.GetAllTodoStatus",
};
const updateTodoStatus = {
  RequestMethod: "ServiceManager.UpdateTaskStatus",
};

//Download File
const downloadDocument = {
  RequestMethod: "ServiceManager.FileDownload",
};

const postComment = {
  RequestMethod: "ServiceManager.CreateComment",
};

//Dashboard APIs
//Meeting Count
const getWeekMeetings = {
  RequestMethod: "ServiceManager.GetWeekMeetings",
};

//Upcoming Events
const upcomingEvents = {
  RequestMethod: "ServiceManager.GetUpcomingMeetingEventsByUserId",
};

//Upcoming Events
const getWeekToDo = {
  RequestMethod: "ServiceManager.GetNumberOfToDoListInWeekByUserIDAndDate",
};

const getAttachmentByMeetingId = {
  RequestMethod: "ServiceManager.GetAgendaAttachmentsByMeetingId",
};
const getAgendasByMeetingId = {
  RequestMethod: "ServiceManager.GetMeetingAgendasByMeetingId",
};
const updateAgendaAttachments = {
  RequestMethod: "ServiceManager.AgendaAttachments",
};

const getAllReminders = {
  RequestMethod: "ServiceManager.GetMeetingReminders",
};
const addMinuteofMeetings = {
  RequestMethod: "ServiceManager.RecordMinutesofMeeting",
};
const updateMinuteofMeetings = {
  RequestMethod: "ServiceManager.UpdateRecordMinutesofMeeting",
};
export {
  signuprequest,
  signinauthenication,
  forgetpassword,
  verifyotp,
  verifyOTPSignUp,
  resendOTP,
  resendOTPForgotPassword,
  changepassword,
  authenticationRefreshToken,
  scheduleNewMeeting,
  getToDoListByUserID,
  createToDoList,
  uploadDocument,
  downloadDocument,
  getAllAssigneesToDoList,
  // ali work
  getUserSettings,
  updateUserNotificationSetting,
  updateUserGeneralSetting,
  updateUserProfileSetting,
  getUserNotifcations,
  getCountryCode,
  getTimeZOne,
  todosStatus,
  updateTodoStatus,
  postComment,
  getAttachmentByMeetingId,
  getAgendasByMeetingId,
  updateAgendaAttachments,
  addMinuteofMeetings,
  updateMinuteofMeetings,
  // Aun
  getFaqs,
  getMeetingId,
  getTodoList,
  // view meetings
  getMeetingByMeetingID,
  getToDoListByToDoListID,
  updateMeeting,
  updateToDoList,
  cancelMeeting,
  startMeeting,
  endMeeting,
  // calender data
  calendarDataRequest,
  searchTodoList,
  searchMeetingId,
  //Dashboard APIs
  getWeekMeetings,
  upcomingEvents,
  getWeekToDo,
  getAllReminders,
};
