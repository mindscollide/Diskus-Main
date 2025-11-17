import * as actions from "../action_types";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "../actions/Auth_action";
import {
  getMeetingId,
  getWeekMeetings,
  upcomingEvents,
  searchUserMeetings,
} from "../../commen/apis/Api_config";

import axiosInstance from "../../commen/functions/axiosInstance";

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const SetSpinnerTrue = (response) => {
  return {
    type: actions.SET_SPINNER_TRUE,
    response: response,
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
//get meetinguser Socket
const allMeetingsSocket = (response) => {
  return {
    type: actions.ALL_MEETINGS_SOCKET,
    response: response,
  };
};

const getMeetingStatusfromSocket = (response) => {
  return {
    type: actions.MEETING_STATUS_SOCKET,
    response: response,
  };
};

const mqttCurrentMeetingEnded = (response) => {
  console.log(response, "MEETING_STATUS_ENDED");
  return {
    type: actions.MEETING_STATUS_ENDED,
    response: response,
  };
};

const meetingCount = (response) => {
  return {
    type: actions.RECENT_MEETINGCOUNTER,
    response: response,
  };
};
const setMQTTRequestUpcomingEvents = (response) => {
  return {
    type: actions.UPCOMINGEVENTS_MQTT,
    response: response,
  };
};
const getMeetingUserId = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(getMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
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
                getMeetingIdSuccess(response.data.responseResult.meetings, "")
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
const GetWeeklyMeetingsCount = (navigate, id, t, loader) => {
  let Data = {
    UserId: parseInt(id),
  };
  return (dispatch) => {
    dispatch(SetSpinnerTrue(loader));
    let form = new FormData();
    form.append("RequestMethod", getWeekMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
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
                getWeeklyMeetingsCountSuccess(response.data.responseResult, "")
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

//Upcoming Events
const getShowMoreUpcomingEvent_init = (response) => {
  return {
    type: actions.SHOWMORE_UPCOMINGEVENTS_INIT,
  };
};

const getShowMoreUpcomingEvent_Success = (response, message) => {
  return {
    type: actions.SHOWMORE_UPCOMINGEVENTS_SUCCESS,
    response: response,
    message: message,
  };
};
const getShowMoreUpcomingEvent_fail = (message) => {
  return {
    type: actions.SHOWMORE_UPCOMINGEVENTS_FAIL,
    message: message,
  };
};

//Get Week meetings
const GetUpcomingEvents = (navigate, data, t, loader) => {
  return (dispatch) => {
    if (data.IsShowMore) {
      dispatch(getShowMoreUpcomingEvent_init());
    } else {
      dispatch(SetSpinnerTrue(loader));
    }
    let form = new FormData();
    form.append("RequestMethod", upcomingEvents.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
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
              if (data.IsShowMore) {
                await dispatch(
                  getShowMoreUpcomingEvent_Success(
                    response.data.responseResult,
                    ""
                  )
                );
                dispatch(SetSpinnerFalse());
                return;
              }
              await dispatch(
                getUpcomingEventsSuccess(response.data.responseResult, "")
              );
              dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_02".toLowerCase()
                )
            ) {
              if (data.IsShowMore) {
                await dispatch(
                  getShowMoreUpcomingEvent_fail(t("No-records-found"))
                );
                await dispatch(SetSpinnerFalse());
                return;
              }
              await dispatch(getUpcomingEventsFail(t("No-records-found")));
              await dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_03".toLowerCase()
                )
            ) {
              if (data.IsShowMore) {
                await dispatch(
                  getShowMoreUpcomingEvent_fail(t("Something-went-wrong"))
                );
                await dispatch(SetSpinnerFalse());
                return;
              }
              await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
              await dispatch(SetSpinnerFalse());
            }
          } else {
            if (data.IsShowMore) {
              await dispatch(
                getShowMoreUpcomingEvent_fail(t("Something-went-wrong"))
              );
              await dispatch(SetSpinnerFalse());
              return;
            }
            await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
            await dispatch(SetSpinnerFalse());
          }
        } else {
          if (data.IsShowMore) {
            await dispatch(
              getShowMoreUpcomingEvent_fail(t("Something-went-wrong"))
            );
            await dispatch(SetSpinnerFalse());
            return;
          }
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
//Get Week meetings
const GetUpcomingEventsForMQTT = (navigate, data, t, loader) => {
  return (dispatch) => {
    // dispatch(SetSpinnerTrue(loader));
    let form = new FormData();
    form.append("RequestMethod", upcomingEvents.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
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
                getUpcomingEventsSuccess(response.data.responseResult, "")
              );
              // dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_02".toLowerCase()
                )
            ) {
              await dispatch(getUpcomingEventsFail(t("No-records-found")));
              // await dispatch(SetSpinnerFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUpcomingMeetingEventsByUserId_03".toLowerCase()
                )
            ) {
              await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
              // await dispatch(SetSpinnerFalse());
            }
          } else {
            await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
            // await dispatch(SetSpinnerFalse());
          }
        } else {
          await dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
          // await dispatch(SetSpinnerFalse());
        }
      })

      .catch((response) => {
        dispatch(getUpcomingEventsFail(t("Something-went-wrong")));
        // dispatch(SetSpinnerFalse());
      });
  };
};
// Search Meeting Init
const SearchMeeting_Init = () => {
  return {
    type: actions.SEARCH_USER_MEETINGS_INIT,
  };
};
// Search Meeting Init
const SearchMeeting_Success = (response, message) => {
  return {
    type: actions.SEARCH_USER_MEETINGS_SUCCESS,
    response: response,
    message: message,
  };
};
// Search Meeting Init
const SearchMeeting_Fail = (message) => {
  return {
    type: actions.SEARCH_USER_MEETINGS_FAIL,
    message: message,
  };
};

const searchUserMeeting = (navigate, searchData, t) => {
  let userID = JSON.parse(localStorage.getItem("userID"));
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let Data = {
    Date: searchData?.Date !== "" ? searchData?.Date : "",
    Title: searchData?.Title !== "" ? searchData?.Title : "",
    HostName: searchData?.HostName !== "" ? searchData?.HostName : "",
    UserID: userID,
    PageNumber: meetingPageCurrent !== null ? meetingPageCurrent : 1,
    Length: meetingpageRow !== null ? meetingpageRow : 30,
  };
  return (dispatch) => {
    dispatch(SearchMeeting_Init());
    let form = new FormData();
    form.append("RequestMethod", searchUserMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        console.log("chek search meeting");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchUserMeeting(navigate, searchData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_01".toLowerCase()
                )
            ) {
              dispatch(SearchMeeting_Success(response.data.responseResult, ""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_02".toLowerCase()
                )
            ) {
              dispatch(SearchMeeting_Fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_03".toLowerCase()
                )
            ) {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
            } else {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
      });
  };
};

const HideNotificationMeetings = () => {
  return {
    type: actions.HIDE,
  };
};

const createGroupMeeting = (response) => {
  return {
    type: actions.MEETING_CREATE_GROUP,
    response: response,
  };
};
const createCommitteeMeeting = (response) => {
  return {
    type: actions.MEETING_CREATE_COMMITTEE,
    response: response,
  };
};

export {
  createGroupMeeting,
  createCommitteeMeeting,
  getMeetingUserId,
  // searchMeetingUserId,
  GetWeeklyMeetingsCount,
  GetUpcomingEvents,
  HideNotificationMeetings,
  allMeetingsSocket,
  getMeetingStatusfromSocket,
  meetingCount,
  setMQTTRequestUpcomingEvents,
  searchUserMeeting,
  SetSpinnerTrue,
  mqttCurrentMeetingEnded,
  GetUpcomingEventsForMQTT,
};
