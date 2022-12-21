import * as actions from "../action_types";
import { getMeetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "../actions/Auth_action";
import {
  getMeetingId,
  searchMeetingId,
  getWeekMeetings,
  upcomingEvents,
} from "../../commen/apis/Api_config";
import axios from "axios";

const SetLoaderTrue = () => {
  return {
    type: actions.SET_LOADER_TRUE,
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const SetSpinnerTrue = () => {
  return {
    type: actions.SET_SPINNER_TRUE,
  };
};

const SetSpinnerFalse = () => {
  return {
    type: actions.SET_SPINNER_FALSE,
  };
};

const getMeetingIdInit = () => {
  return {
    type: actions.GET_MEETINGUSERID_INIT,
  };
};

const getMeetingIdSuccess = (response, message) => {
  return {
    type: actions.GET_MEETINGUSERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingIdFail = (message, response, searchResponse) => {
  return {
    type: actions.GET_MEETINGUSERID_FAIL,
    message: message,
    response: response,
    searchResponse: searchResponse,
  };
};
const updateSearchResponse = () => {
  return {
    type: actions.SEARCH_MEETING_RESPONSE,
  };
};
const clearState = () => {
  return {
    type: actions.MEETINGID_RESPONSE_MESSAGE,
  };
};

//get meetinguser Socket
const allMeetingsSocket = (response) => {
  return {
    type: actions.ALL_MEETINGS_SOCKET,
    response: response,
  };
};
const getMeetingStatusfromSocket = (response) => {
  console.log(
    "MeetingStatusSocket",response
  );
  return {
    type: actions.MEETING_STATUS_SOCKET,
    response: response
  }
}
const getMeetingUserId = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  //   let userMeetingIdData = {
  //     userID: UserID,
  //     numberOfRecords: NumberOfRecords,
  //   };
  return (dispatch) => {
    dispatch(getMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getMeetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("GetMeetingByID", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(getMeetingUserId(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(getMeetingIdSuccess(response.data.responseResult));
            dispatch(SetLoaderFalse());
          } else {
            dispatch(getMeetingIdFail(response.data.responseResult));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(getMeetingIdFail(response.data));
          dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(SetLoaderFalse());
      });
  };
};

//get meetinguser ID API

const searchMeetingUserId = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("searchMeetingUserId", data);

  return (dispatch) => {
    dispatch(getMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", searchMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getMeetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("searchMeetingUserId", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(getMeetingUserId(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(
              "searchMeetingUserId112",
              response.data.responseResult.meetings
            );
            await dispatch(getMeetingIdSuccess(response.data.responseResult));
            dispatch(SetLoaderFalse());
          } else {
            dispatch(getMeetingIdFail(response.data.responseResult));
            dispatch(updateSearchResponse());
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(getMeetingIdFail(response.data));
          dispatch(updateSearchResponse());
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        console.log(response.message);
        dispatch(SetLoaderFalse());
      });
  };
};

//Meeting Count
const getWeeklyMeetingsCountSuccess = (response, message) => {
  return {
    type: actions.GET_MEETINGCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

const getWeeklyMeetingsCountFail = (message, response) => {
  return {
    type: actions.GET_MEETINGCOUNT_FAIL,
    message: message,
    response: response,
  };
};

//Get Week meetings
const GetWeeklyMeetingsCount = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SetSpinnerTrue());
    let form = new FormData();
    form.append("RequestMethod", getWeekMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getMeetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("GetWeeklyMeetingsCount", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetWeeklyMeetingsCount(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getWeeklyMeetingsCountSuccess(response.data.responseResult)
            );
            dispatch(SetSpinnerFalse());
          } else {
            dispatch(getWeeklyMeetingsCountFail(response.data.responseResult));
            dispatch(SetSpinnerFalse());
          }
        } else {
          dispatch(getWeeklyMeetingsCountFail(response.data));
          dispatch(SetSpinnerFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(SetSpinnerFalse());
      });
  };
};

//Upcoming Events
const getUpcomingEventsSuccess = (response) => {
  return {
    type: actions.GET_UPCOMINGEVENTS_SUCCESS,
    response: response,
    // message: message,
  };
};

const getUpcomingEventsFail = (response) => {
  return {
    type: actions.GET_UPCOMINGEVENTS_FAIL,
    // message: message,
    response: response,
  };
};

//Get Week meetings
const GetUpcomingEvents = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SetSpinnerTrue());
    let form = new FormData();
    form.append("RequestMethod", upcomingEvents.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getMeetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("GetUpcomingEvents", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetUpcomingEvents(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getUpcomingEventsSuccess(response.data.responseResult)
            );
            dispatch(SetSpinnerFalse());
          } else {
            dispatch(getUpcomingEventsFail(response.data.responseResult));
            dispatch(SetSpinnerFalse());
          }
        } else {
          dispatch(getUpcomingEventsFail(response.data));
          dispatch(SetSpinnerFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(SetSpinnerFalse());
      });
  };
};

const HideNotificationMeetings = () => {
  return {
    type: actions.HIDE,
  };
};

export {
  getMeetingUserId,
  searchMeetingUserId,
  GetWeeklyMeetingsCount,
  GetUpcomingEvents,
  HideNotificationMeetings,
  allMeetingsSocket,
  getMeetingStatusfromSocket
};
