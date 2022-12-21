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
  console.log("message", message);
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

const allassignesslistsuccess = (response) => {
  return {
    type: actions.ASSIGNESS_LIST_SUCCESS,
    response: response,
    // message: message
  };
};

const allassignesslistfail = (response) => {
  return {
    type: actions.ASSIGNESS_LIST_FAIL,
    response: response,
    // message: message
  };
};
const clearResponseMessage = () => {
  return {
    type: actions.LISTOFASSIGNEE_RESPONSE_MESSAGE,
  };
};
const allAssignessList = (id) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    UserID: id,
  };
  console.log("allAssignessList", id);
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
        console.log("allAssignessList", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(allAssignessList(id));
        } else if (response.data.responseCode === 200) {
          console.log("allAssignessList TrueResponse", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              allassignesslistsuccess(response.data.responseResult)
              //   response.data.responseResult,
              //   response.data.responseMessage
            );
            // setTimeout(() => {
            //   dispatch(cleareAssigneesState());
            // }, 2000);
          } else {
            await dispatch(
              allassignesslistfail(response.data.responseResult.responseMessage)
              // response.data.responseResult
            );
          }
        } else {
          await dispatch(allassignesslistfail());
          // setTimeout(() => {
          //   dispatch(cleareAssigneesState());
          // }, 2000);
        }
      })
      .catch((response) => {
        console.log("allAssignessList", response);
        // setTimeout(() => {
        //   dispatch(cleareAssigneesState());
        // }, 2000);
        dispatch(
          allassignesslistfail(response.data.responseResult.responseMessage)
        );
      });
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const ScheculeMeetingInit = () => {
  console.log("Update Loader start");
  return {
    type: actions.SCHEDULE_NEW_MEETING_INIT,
  };
};

const ScheduleMeetingFail = (response) => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_FAIL,
    response: response,
  };
};

//SaveNONAPIDisputes
const ScheduleNewMeeting = (object, calenderFlag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("UserID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  console.log("ScheduleNewMeeting", object);
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
        console.log("ScheduleNewMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(ScheduleNewMeeting(object, calenderFlag));
        } else if (response.data.responseCode === 200) {
          console.log("ScheduleNewMeeting", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              ShowNotification(response.data.responseResult.responseMessage)
            );
            if (
              calenderFlag &&
              calenderFlag !== undefined &&
              calenderFlag !== null
            ) {
              await dispatch(getCalendarDataResponse(createrID));
              await dispatch(SetLoaderFalse());
            } else {
              await dispatch(getMeetingUserId(dataForList));
            }
          } else {
            dispatch(ScheduleMeetingFail(response.data.responseResult));
          }
        } else {
          console.log("ScheduleNewMeeting", response.data);
          dispatch(SetLoaderFalse());

          dispatch(ScheduleMeetingFail(response.data));
        }
      })
      .catch((response) => {
        dispatch(ScheduleMeetingFail());
        console.log(response);
      });
  };
};

// update meeting
const UpdateMeeting = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("UserID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  console.log("ScheduleNewMeeting", object);
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
        console.log("ScheduleNewMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(ScheduleNewMeeting(object));
        } else if (response.data.responseCode === 200) {
          console.log("ScheduleNewMeeting", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              ShowNotification(response.data.responseResult.responseMessage)
            );
            await dispatch(getMeetingUserId(dataForList));
            // dispatch(SetLoaderFalse());
          } else {
            dispatch(ScheduleMeetingFail(response.data.responseResult));
            await dispatch(getMeetingUserId(dataForList));
          }
        } else {
          dispatch(ScheduleMeetingFail(response.data));
          await dispatch(getMeetingUserId(dataForList));
        }
      })
      .catch((response) => {
        dispatch(ScheduleMeetingFail());
        console.log(response);
      });
  };
};
const ViewMeetingInit = () => {
  return {
    type: actions.VIEW_MEETING_INIT,
  };
};

const ViewMeetingSuccess = (response) => {
  console.log("ViewMeeting", response);
  return {
    type: actions.VIEW_MEETING_SUCESS,
    response: response,
  };
};

const ViewMeetingFail = (response) => {
  return {
    type: actions.VIEW_MEETING_FAIL,
    response: response,
  };
};

// View Meeting
const ViewMeeting = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("ViewMeeting", object);
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
        console.log("ViewMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(ViewMeeting(object));
        } else if (response.data.responseCode === 200) {
          console.log("ViewMeeting", response);
          if (response.data.responseResult.isExecuted === true) {
            console.log("ViewMeeting", response);

            // await dispatch(
            //   ShowNotification(response.data.responseResult.responseMessage)
            // );
            console.log("ViewMeeting", response);
            await dispatch(ViewMeetingSuccess(response.data.responseResult));
            // dispatch(SetLoaderFalse());
          } else {
            dispatch(ViewMeetingFail(response.data.responseResult));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(ViewMeetingFail(response.data));
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(ViewMeetingFail());
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
const CancelMeetingSuccess = (response) => {
  console.log("CancelMeetingSuccess", response);
  return {
    type: actions.CANCEL_MEETING_SUCCESS,
    response: response,
  };
};

//Cancel Meeting Fail
const CancelMeetingFail = (response) => {
  return {
    type: actions.CANCEL_MEETING_FAIL,
    response: response,
  };
};

//Cancel Meeting
const CancelMeeting = (object) => {
  console.log("CancelMeeting");
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("UserID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    console.log("CancelMeeting", JSON.stringify(object));
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
        console.log("CancelMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(CancelMeeting(object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log("CancelMeeting", response.data.responseResult);
            await dispatch(CancelMeetingSuccess(response.data.responseResult));
            await dispatch(getMeetingUserId(dataForList));

            // await dispatch(GetAllDisputesQM(sData, dData));
            // dispatch(SetLoaderFalse());
          } else {
            dispatch(CancelMeetingFail(response.data.responseResult));
            console.log(response.data.responseResult);
          }
        }
      })
      .catch((response) => {
        dispatch(SetLoaderFalse());
        console.log(response);
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
const StartMeetingSuccess = (response) => {
  console.log("CancelMeetingSuccess", response);
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
  };
};

//START Meeting Fail
const StartMeetingFail = (response) => {
  return {
    type: actions.START_MEETING_FAIL,
    response: response,
  };
};

//START Meeting
const StartMeeting = (object, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("UserID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    console.log("StartMeeting", JSON.stringify(object));
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
        console.log("StartMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(StartMeeting(object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            localStorage.setItem("MeetingId", object.MeetingID);
            console.log("StartMeeting", response.data.responseResult);
            await dispatch(StartMeetingSuccess(response.data.responseResult));
            await dispatch(getMeetingUserId(dataForList));
            // navigate("/Diskus/videochat")
            // await dispatch(GetAllDisputesQM(sData, dData));
            // dispatch(SetLoaderFalse());
          } else {
            dispatch(StartMeetingFail(response.data.responseResult));
            console.log(response.data.responseResult);
          }
        }
      })
      .catch((response) => {
        // dispatch(SetLoaderFalse());
        console.log(response);
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
const EndMeetingSuccess = (response) => {
  console.log("CancelMeetingSuccess", response);
  return {
    type: actions.START_MEETING_SUCCESS,
    response: response,
  };
};

//START Meeting Fail
const EndMeetingFail = (response) => {
  return {
    type: actions.START_MEETING_FAIL,
    response: response,
  };
};

//START Meeting
const EndMeeting = (object) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("UserID");
  let dataForList = { UserID: JSON.parse(createrID), NumberOfRecords: 300 };
  return (dispatch) => {
    console.log("EndMeeting", JSON.stringify(object));
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
        console.log("EndMeeting", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(EndMeeting(object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log("EndMeeting", response.data.responseResult);
            await dispatch(EndMeetingSuccess(response.data.responseResult));
            await dispatch(getMeetingUserId(dataForList));

            // await dispatch(GetAllDisputesQM(sData, dData));
            // dispatch(SetLoaderFalse());
          } else {
            dispatch(EndMeetingFail(response.data.responseResult));
            console.log(response.data.responseResult);
          }
        }
      })
      .catch((response) => {
        // dispatch(SetLoaderFalse());
        console.log(response);
      });
  };
};

const getAllRemindersSuccess = (response) => {
  return {
    type: actions.GET_REMINDERS_SUCCESS,
    response: response,
  };
};

const getAllRemindersFail = (response) => {
  return {
    type: actions.GET_REMINDERS_FAIL,
    response: response,
  };
};

const GetAllReminders = () => {
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
        console.log("GetAllReminders", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetAllReminders());
        } else if (response.data.responseCode === 200) {
          console.log("GetAllReminders TrueResponse", response);
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getAllRemindersSuccess(response.data.responseResult)
            );
          } else {
            await dispatch(getAllRemindersFail());
          }
        } else {
          await dispatch(getAllRemindersFail());
        }
      })
      .catch((response) => {
        console.log("GetAllReminders", response);
        // dispatch(getAllRemindersFail());
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
