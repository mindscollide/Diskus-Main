import * as actions from "../action_types";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import {
  getAllAttendanceMeeting,
  saveMeetingAttendance,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

//Get Attendance Meeting Init
const getAttendanceMeetingInit = () => {
  return {
    type: actions.GET_ALL_ATTENDANCE_MEETING_INIT,
  };
};

//Get Attendance Meeting Success
const getAttendanceMeetingSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_ATTENDANCE_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

//Get Attendance Meeting Fail
const getAttendanceMeetingFail = (message) => {
  return {
    type: actions.GET_ALL_ATTENDANCE_MEETING_FAIL,
    message: message,
  };
};

//Get Attendance Meeting Main Api
const getAllAttendanceMeetingApi = (navigate, t, meetingData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAttendanceMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", getAllAttendanceMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(meetingData));
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
          dispatch(RefreshToken(navigate, t));
          dispatch(getAllAttendanceMeetingApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingAttendanceReport_01"
            ) {
              dispatch(
                getAttendanceMeetingSuccess(
                  response.data.responseResult.meetingAttendance,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingAttendanceReport_02"
            ) {
              dispatch(
                getAttendanceMeetingFail(
                  response.data.responseResult.responseMessage,
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingAttendanceReport_03"
            ) {
              dispatch(
                getAttendanceMeetingFail(
                  response.data.responseResult.responseMessage,
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(getAttendanceMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAttendanceMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAttendanceMeetingFail(t("Something-went-wrong")));
      });
  };
};

//Save Meeting Attendance Init
const saveAttendanceInit = () => {
  return {
    type: actions.SAVE_MEETING_ATTENDANCE_INIT,
  };
};

//Save Meeting Attendance Success
const saveAttendanceSuccess = (response, message) => {
  return {
    type: actions.SAVE_MEETING_ATTENDANCE_SUCCESS,
    response: response,
    message: message,
  };
};

//Save Meeting Attendance Fail
const saveAttendanceFail = (message) => {
  return {
    type: actions.SAVE_MEETING_ATTENDANCE_FAIL,
    message: message,
  };
};

//Get Attendance Meeting Main Api
const saveMeetingAttendanceApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(saveAttendanceInit());
    let form = new FormData();
    form.append("RequestMethod", saveMeetingAttendance.RequestMethod);
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
          dispatch(RefreshToken(navigate, t));
          dispatch(saveMeetingAttendanceApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveMeetingAttendanceReport_01"
            ) {
              dispatch(
                saveAttendanceSuccess(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveMeetingAttendanceReport_02"
            ) {
              dispatch(saveAttendanceFail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveMeetingAttendanceReport_03"
            ) {
              dispatch(saveAttendanceFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveMeetingAttendanceReport_04"
            ) {
              dispatch(saveAttendanceFail(t("The-meeting-has-been-ended")));
            } else {
              dispatch(saveAttendanceFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveAttendanceFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveAttendanceFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveAttendanceFail(t("Something-went-wrong")));
      });
  };
};

const clearAttendanceState = (message) => {
  return {
    type: actions.ATTENDANCE_REDUCER_STATE_CLEAR,
    message: message,
  };
};

const clearAttendanceResponse = () => {
  return {
    type: actions.CLEAR_ATTENDANCE_RESPONSEMESSAGE,
  };
};

export {
  getAllAttendanceMeetingApi,
  saveMeetingAttendanceApi,
  clearAttendanceState,
  clearAttendanceResponse,
};
