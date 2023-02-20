import * as actions from "../action_types";
import axios from "axios";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import {
  getAllAssigneesToDoList,
  scheduleNewMeeting,
  getMeetingByMeetingID,
  updateMeeting,
  cancelMeeting,
  startMeeting,
  endMeeting,
  getAllReminders,
} from "../../commen/apis/Api_config";
import { getMeetingUserId } from "./GetMeetingUserId";
import { RefreshToken } from "../actions/Auth_action";
import { getCalendarDataResponse } from "../actions/GetDataForCalendar";

const ShowNotification = (message) => {
  return {
    type: actions.SHOW,
    message: message,
  };
};

const HideNotification = () => {
  return {
    type: actions.HIDE,
  };
};
// for cleare state
const cleareAssigneesState = () => {
  return {
    type: actions.CLEARE_STATE,
  };
};
const allassignesslistinit = () => {
  return {
    type: actions.ASSIGNESS_LIST_INIT,
  };
};

const allassignesslistsuccess = (response, message) => {
  return {
    type: actions.ASSIGNESS_LIST_SUCCESS,
    response: response,
    message: message,
  };
};

const allassignesslistfail = (message) => {
  return {
    type: actions.ASSIGNESS_LIST_FAIL,
    message: message,
  };
};
const clearResponseMessage = () => {
  return {
    type: actions.LISTOFASSIGNEE_RESPONSE_MESSAGE,
  };
};
const allAssignessList = (id, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    UserID: id,
  };
  return (dispatch) => {
    dispatch(allassignesslistinit());
    let form = new FormData();
    form.append("RequestMethod", getAllAssigneesToDoList.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(allAssignessList(id, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_01".toLowerCase()
                )
            ) {
              await dispatch(
                allassignesslistsuccess(
                  response.data.responseResult.user,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_02".toLowerCase()
                )
            ) {
              await dispatch(allassignesslistfail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllAssignees_03".toLowerCase()
                )
            ) {
              await dispatch(allassignesslistfail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(allassignesslistfail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(allassignesslistfail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(allassignesslistfail(t("Something-went-wrong")));
      });
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const ScheculeMeetingInit = () => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_INIT,
  };
};

const ScheduleMeetingFail = (message) => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_FAIL,
    message: message,
  };
};

//SaveNONAPIDisputes
const ScheduleNewMeeting = (object, calenderFlag, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(ScheculeMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", scheduleNewMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(ScheduleNewMeeting(object, calenderFlag, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                ShowNotification(t("The-record-has-been-saved-successfully"))
              );
              if (
                calenderFlag &&
                calenderFlag !== undefined &&
                calenderFlag !== null
              ) {
                await dispatch(getCalendarDataResponse(createrID, t));
                await dispatch(SetLoaderFalse());
              } else {
                await dispatch(getMeetingUserId(dataForList, t));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleNewMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(SetLoaderFalse());
          await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
      });
  };
};

// update meeting
const UpdateMeeting = (object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(ScheculeMeetingInit());
    console.log("Update Loader start");
    let form = new FormData();
    form.append("RequestMethod", updateMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(ScheduleNewMeeting(object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                ShowNotification(t("The-record-has-been-updated-successfully"))
              );
              await dispatch(getMeetingUserId(dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                ScheduleMeetingFail(t("No-record-has-been-updated"))
              );
              await dispatch(getMeetingUserId(dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
              await dispatch(getMeetingUserId(dataForList, t));
            }
          } else {
            dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
            await dispatch(getMeetingUserId(dataForList, t));
          }
        } else {
          dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
          await dispatch(getMeetingUserId(dataForList, t));
        }
      })
      .catch((response) => {
        dispatch(ScheduleMeetingFail(t("Something-went-wrong")));
        console.log(response);
      });
  };
};
const ViewMeetingInit = () => {
  return {
    type: actions.VIEW_MEETING_INIT,
  };
};

const ViewMeetingSuccess = (response, message) => {
  return {
    type: actions.VIEW_MEETING_SUCESS,
    response: response,
    message: message,
  };
};

const ViewMeetingFail = (message) => {
  return {
    type: actions.VIEW_MEETING_FAIL,
    message: message,
  };
};

// View Meeting
const ViewMeeting = (object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(ViewMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(ViewMeeting(object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_01".toLowerCase()
                )
            ) {
              await dispatch(
                ViewMeetingSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_02".toLowerCase()
                )
            ) {
              await dispatch(ViewMeetingFail(t("No-records-found")));
              dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByMeetingID_03".toLowerCase()
                )
            ) {
              await dispatch(ViewMeetingFail(t("Something-went-wrong")));
              dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(ViewMeetingFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(ViewMeetingFail(t("Something-went-wrong")));
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(ViewMeetingFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
        console.log(response);
      });
  };
};

//Cancel Meeting Init
const CancelMeetingInit = () => {
  return {
    type: actions.CANCEL_MEETING_INIT,
  };
};

//Cancel Meeting Success
const CancelMeetingSuccess = (response, message) => {
  return {
    type: actions.CANCEL_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//Cancel Meeting Fail
const CancelMeetingFail = (message) => {
  return {
    type: actions.CANCEL_MEETING_FAIL,
    message: message,
  };
};

//Cancel Meeting
const CancelMeeting = (object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(CancelMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", cancelMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          await dispatch(CancelMeeting(object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                CancelMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-cancelled")
                )
              );
              await dispatch(getMeetingUserId(dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                CancelMeetingFail(
                  t("The-meeting-has-not-been-cancelled-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CancelMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(CancelMeetingFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(CancelMeetingFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(CancelMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(CancelMeetingFail(t("Something-went-wrong")));
      });
  };
};

//START Meeting Init
const StartMeetingInit = () => {
  return {
    type: actions.START_MEETING_INIT,
  };
};

//START Meeting Success
const StartMeetingSuccess = (response, message) => {
  console.log("CancelMeetingSuccess", response);
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//START Meeting Fail
const StartMeetingFail = (message) => {
  return {
    type: actions.START_MEETING_FAIL,
    message: message,
  };
};

//START Meeting
const StartMeeting = (object, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(StartMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", startMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(StartMeeting(object, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_01".toLowerCase()
                )
            ) {
              localStorage.setItem("MeetingId", object.MeetingID);
              await dispatch(
                StartMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-started")
                )
              );
              await dispatch(getMeetingUserId(dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                StartMeetingFail(
                  t("The-Meeting-Has-not-Been-Started-Successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_StartMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(StartMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(StartMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(StartMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(StartMeetingFail(t("Something-went-wrong")));
      });
  };
};

//START Meeting Init
const EndMeetingInit = () => {
  return {
    type: actions.START_MEETING_INIT,
  };
};

//START Meeting Success
const EndMeetingSuccess = (response, message) => {
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//START Meeting Fail
const EndMeetingFail = (message) => {
  return {
    type: actions.START_MEETING_FAIL,
    message: message,
  };
};

//START Meeting
const EndMeeting = (object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    dispatch(EndMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", endMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(object));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(EndMeeting(object, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                EndMeetingSuccess(
                  response.data.responseResult,
                  t("The-meeting-has-been-ended")
                )
              );
              await dispatch(getMeetingUserId(dataForList, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(
                EndMeetingFail(t("The-meeting-has-not-been-ended"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_EndMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(EndMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(EndMeetingFail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        dispatch(EndMeetingFail(t("Something-went-wrong")));
        // dispatch(SetLoaderFalse());
      });
  };
};

const getAllRemindersSuccess = (response, message) => {
  return {
    type: actions.GET_REMINDERS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllRemindersFail = (message) => {
  return {
    type: actions.GET_REMINDERS_FAIL,
    message: message,
  };
};

const GetAllReminders = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", getAllReminders.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(GetAllReminders(t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllRemindersSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_02".toLowerCase()
                )
            ) {
              await dispatch(getAllRemindersFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_03".toLowerCase()
                )
            ) {
              await dispatch(getAllRemindersFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(getAllRemindersFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getAllRemindersFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllRemindersFail(t("Something-went-wrong")));
      });
  };
};

export {
  HideNotification,
  allAssignessList,
  ScheduleNewMeeting,
  ViewMeeting,
  cleareAssigneesState,
  UpdateMeeting,
  CancelMeeting,
  SetLoaderFalse,
  StartMeeting,
  EndMeeting,
  GetAllReminders,
  clearResponseMessage,
};
