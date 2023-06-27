import * as actions from "../action_types";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "../actions/Auth_action";
import {
  getMeetingId,
  searchMeetingId,
  getWeekMeetings,
  upcomingEvents,
  searchUserMeetings
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

// const getMeetingIdFail = (message, response, searchResponse) => {
const getMeetingIdFail = (message) => {
  return {
    type: actions.GET_MEETINGUSERID_FAIL,
    message: message,
    // response: response,
    // searchResponse: searchResponse,
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
  console.log("responseresponseresponse", response);
  return {
    type: actions.ALL_MEETINGS_SOCKET,
    response: response,
  };
};

const getMeetingStatusfromSocket = (response) => {
  console.log("responseresponseresponse", response);
  return {
    type: actions.MEETING_STATUS_SOCKET,
    response: response,
  };
};
const meetingCount = (response) => {
  return {
    type: actions.RECENT_MEETINGCOUNTER,
    response: response
  }
}
const setMQTTRequestUpcomingEvents = (response) => {
  console.log("NEW_UPCOMING123", response)

  return {
    type: actions.UPCOMINGEVENTS_MQTT,
    response: response
  }
}
const getMeetingUserId = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingUserId(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByUserID_01".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingIdSuccess(
                  response.data.responseResult.meetings,
                  t("Record-found")
                )
              );
              dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByUserID_02".toLowerCase()
                )
            ) {
              dispatch(getMeetingIdFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByUserID_03".toLowerCase()
                )
            ) {
              dispatch(getMeetingIdFail(t("Something-went-wrong")));
              dispatch(SetLoaderFalse());
            }
          } else {
            dispatch(getMeetingIdFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(getMeetingIdFail(t("Something-went-wrong")));
          dispatch(SetLoaderFalse());
        }
      })

      .catch((response) => {
        dispatch(getMeetingIdFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

//get meetinguser ID API

const searchMeetingUserId = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", searchMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchMeetingUserId(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_01".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingIdSuccess(
                  response.data.responseResult.meetings,
                  t("Record-found")
                )
              );
              dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_02".toLowerCase()
                )
            ) {
              await dispatch(getMeetingIdFail(t("No-records-found")));
              dispatch(updateSearchResponse());
              dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_03".toLowerCase()
                )
            ) {
              await dispatch(getMeetingIdFail(t("Something-went-wrong")));
              dispatch(updateSearchResponse());
              dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(getMeetingIdFail(t("Something-went-wrong")));
            dispatch(updateSearchResponse());
            dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(getMeetingIdFail(t("Something-went-wrong")));
          dispatch(updateSearchResponse());
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(getMeetingIdFail(t("Something-went-wrong")));
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

const getWeeklyMeetingsCountFail = (message) => {
  return {
    type: actions.GET_MEETINGCOUNT_FAIL,
    message: message,
  };
};

//Get Week meetings
const GetWeeklyMeetingsCount = (navigate, id, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    UserId: parseInt(id),
  };
  return (dispatch) => {
    dispatch(SetSpinnerTrue());
    let form = new FormData();
    form.append("RequestMethod", getWeekMeetings.RequestMethod);
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetWeeklyMeetingsCount(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetWeekMeetings_01".toLowerCase()
                )
            ) {
              await dispatch(
                getWeeklyMeetingsCountSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetWeekMeetings_02".toLowerCase()
                )
            ) {
              await dispatch(getWeeklyMeetingsCountFail(t("No-records-found")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetWeekMeetings_03".toLowerCase()
                )
            ) {
              await dispatch(
                getWeeklyMeetingsCountFail(t("Something-went-wrong"))
              );
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(
              getWeeklyMeetingsCountFail(t("Something-went-wrong"))
            );
            await dispatch(SetSpinnerFalse());
          }
        } else {
          await dispatch(getWeeklyMeetingsCountFail(t("Something-went-wrong")));
          await dispatch(SetSpinnerFalse());
        }
      })

      .catch((response) => {
        console.log(response.message);
        dispatch(getWeeklyMeetingsCountFail(t("Something-went-wrong")));
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
const GetUpcomingEvents = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SetSpinnerTrue());
    let form = new FormData();
    form.append("RequestMethod", upcomingEvents.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("GetUpcomingEvents", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetUpcomingEvents(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_01".toLowerCase()
                )
            ) {
              await dispatch(
                getUpcomingEventsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_02".toLowerCase()
                )
            ) {
              await dispatch(getUpcomingEventsFail(t("No-records-found")));
              await dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_03".toLowerCase()
                )
            ) {
              await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
              await dispatch(SetSpinnerFalse());
            }
          } else {
            await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
            await dispatch(SetSpinnerFalse());
          }
        } else {
          await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
          await dispatch(SetSpinnerFalse());
        }
      })

      .catch((response) => {
        dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
        dispatch(SetSpinnerFalse());
      });
  };
};


// Search Meeting Init
const SearchMeeting_Init = () => {
  return {
    type: actions.SEARCH_USER_MEETINGS_INIT
  }
}
// Search Meeting Init
const SearchMeeting_Success = (response, message) => {
  return {
    type: actions.SEARCH_USER_MEETINGS_SUCCESS,
    response: response,
    message: message
  }
}
// Search Meeting Init
const SearchMeeting_Fail = (message) => {
  return {
    type: actions.SEARCH_USER_MEETINGS_FAIL,
    message: message
  }
}

const searchUserMeeting = (navigate, searchData, t) => {
  console.log(searchData, "searchData")
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"))
  let meetingpageRow = JSON.parse(localStorage.getItem("MeetingPageRows"))
  let meetingPageCurrent = JSON.parse(localStorage.getItem("MeetingPageCurrent"))
  let Data = {
    Date: searchData?.Date !== "" ? searchData?.Date : "",
    Title: searchData?.Title !== "" ? searchData?.Title : "",
    HostName: searchData?.HostName !== "" ? searchData?.HostName : "",
    UserID: userID,
    PageNumber: meetingPageCurrent,
    Length: meetingpageRow
  }
  return (dispatch) => {
    dispatch(SearchMeeting_Init())
    let form = new FormData();
    form.append("RequestMethod", searchUserMeetings.RequestMethod);
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
        console.log(response, "responseresponseresponse")
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchUserMeeting(navigate, searchData, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.responseMessage.toLowerCase().includes("Meeting_MeetingServiceManager_SearchMeetings_01".toLowerCase())) {
              dispatch(SearchMeeting_Success(response.data.responseResult, t("Record-found")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Meeting_MeetingServiceManager_SearchMeetings_02".toLowerCase())) {
              dispatch(SearchMeeting_Fail(t("No-record-found")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Meeting_MeetingServiceManager_SearchMeetings_03".toLowerCase())) {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")))
            } else {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")))
            }
          } else {
            dispatch(SearchMeeting_Fail(t("Something-went-wrong")))
          }
        } else {
          dispatch(SearchMeeting_Fail(t("Something-went-wrong")))
        }
      })
      .catch((response) => {
        dispatch(SearchMeeting_Fail(t("Something-went-wrong")))
      });
  };
}
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
  getMeetingStatusfromSocket,
  meetingCount,
  setMQTTRequestUpcomingEvents,
  searchUserMeeting
};
