import * as actions from "../action_types";
import {
  calendarDataRequest,
  getEventsTypeRM,
  GetDiskusEventDetailsRM,
} from "../../commen/apis/Api_config";
import { getCalender } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { RefreshToken } from "./Auth_action";

const getCalendarDataInit = (flag) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_INIT,
    flag: flag,
  };
};

const getCalendarDataSuccess = (response, flag, message) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_SUCCESS,
    response: response,
    flag: flag,
    message: message,
  };
};

const getCalendarDataFail = (message, flag) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_FAIL,
    message: message,
    flag: flag,
  };
};

const clearCalendarState = () => {
  return {
    type: actions.CLEAR_CALENDAR_STATE,
  };
};
const calendarLoader = (loader) => {
  return {
    type: actions.CALENDAR_LOADER,
    payload: loader,
  };
};
const getCalendarDataResponse = (navigate, t, data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    try {
      // dispatch(getCalendarDataInit(flag));
      dispatch(calendarLoader(true));
      let form = new FormData();
      form.append("RequestMethod", calendarDataRequest.RequestMethod);
      form.append("RequestData", JSON.stringify(data));
      axios({
        method: "post",
        url: getCalender,
        data: form,
        headers: {
          _token: token,
        },
      })
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(getCalendarDataResponse(navigate, t, data, flag));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_01".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataSuccess(
                    response.data.responseResult,
                    false,
                    ""
                  )
                );
                dispatch(calendarLoader(false));
                // dispatch(getCalendarDataInit(false));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_02".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataFail(t("No-records-found"), false)
                );
                dispatch(calendarLoader(false));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_03".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataFail(t("Something-went-wrong"), false)
                );
                dispatch(calendarLoader(false));
                // dispatch(getCalendarDataInit(false));
              } else {
                await dispatch(
                  getCalendarDataFail(t("Something-went-wrong"), false)
                );
                dispatch(calendarLoader(false));
                // dispatch(getCalendarDataInit(false));
              }

              //   dispatch(SetLoaderFalse());
            } else {
              await dispatch(
                getCalendarDataFail(t("Something-went-wrong"), false)
              );
              dispatch(calendarLoader(false));
              // dispatch(getCalendarDataInit(false));
            }
          } else {
            await dispatch(
              getCalendarDataFail(t("Something-went-wrong"), false)
            );
            dispatch(calendarLoader(false));
            // dispatch(getCalendarDataInit(false));
          }
        })
        .catch((response) => {
          dispatch(getCalendarDataFail(t("Something-went-wrong"), false));
          dispatch(calendarLoader(false));
          // dispatch(getCalendarDataInit(false));
        });
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  };
};

const getCalendarDataResponseMQTT = (navigate, t, data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    try {
      // dispatch(getCalendarDataInit(flag));
      // dispatch(calendarLoader(true));
      let form = new FormData();
      form.append("RequestMethod", calendarDataRequest.RequestMethod);
      form.append("RequestData", JSON.stringify(data));
      axios({
        method: "post",
        url: getCalender,
        data: form,
        headers: {
          _token: token,
        },
      })
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(getCalendarDataResponse(navigate, t, data, flag));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_01".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataSuccess(
                    response.data.responseResult,
                    false,
                    ""
                  )
                );
                // dispatch(calendarLoader(false));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_02".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataFail(t("No-records-found"), false)
                );
                // dispatch(getCalendarDataInit(false));

                // dispatch(calendarLoader(false));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "Calender_CalenderServiceManager_GetCalenderList_03".toLowerCase()
                  )
              ) {
                await dispatch(
                  getCalendarDataFail(t("Something-went-wrong"), false)
                );
                dispatch(getCalendarDataInit(false));

                // dispatch(calendarLoader(false));
              } else {
                await dispatch(
                  getCalendarDataFail(t("Something-went-wrong"), false)
                );
                dispatch(getCalendarDataInit(false));

                // dispatch(calendarLoader(false));
              }

              //   dispatch(SetLoaderFalse());
            } else {
              await dispatch(
                getCalendarDataFail(t("Something-went-wrong"), false)
              );
              // dispatch(getCalendarDataInit(false));

              // dispatch(calendarLoader(false));
            }
          } else {
            await dispatch(
              getCalendarDataFail(t("Something-went-wrong"), false)
            );
            dispatch(getCalendarDataInit(false));

            // dispatch(calendarLoader(false));
          }
        })
        .catch((response) => {
          dispatch(getCalendarDataFail(t("Something-went-wrong"), false));
          // dispatch(getCalendarDataInit(false));

          // dispatch(calendarLoader(false));
        });
    } catch (error) {
      console.log(error, "errorerrorerrorerrorerror");
    }
  };
};
const HideNotificationCalendarData = () => {
  return {
    type: actions.HIDE,
  };
};

const getEventsType_init = () => {
  return {
    type: actions.GETEVENTSTYPES_INIT,
  };
};
const getEventsType_success = (response, message) => {
  return {
    type: actions.GETEVENTSTYPES_SUCCESS,
    response: response,
    message: message,
  };
};
const getEventsType_fail = (message) => {
  return {
    type: actions.GETEVENTSTYPES_FAIL,
    message: message,
  };
};
const getEventsTypes = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    await dispatch(getEventsType_init());
    let form = new FormData();
    form.append("RequestMethod", getEventsTypeRM.RequestMethod);
    axios({
      method: "post",
      url: getCalender,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getEventsTypes(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetAllEventTypes_01".toLowerCase()
                )
            ) {
              await dispatch(
                getEventsType_success(
                  response.data.responseResult.eventTypes,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetAllEventTypes_02".toLowerCase()
                )
            ) {
              dispatch(getEventsType_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetAllEventTypes_03".toLowerCase()
                )
            ) {
              dispatch(getEventsType_fail(t("Something-went-wrong")));
            } else {
              dispatch(getEventsType_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getEventsType_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getEventsType_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(getEventsType_fail(t("Something-went-wrong")));
      });
  };
};

const getEventsDetails_init = () => {
  return {
    type: actions.GETEVENTSDETAILS_INIT,
  };
};
const getEventsDetails_success = (response, message) => {
  return {
    type: actions.GETEVENTSDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getEventsDetails_fail = (message) => {
  return {
    type: actions.GETEVENTSDETAILS_FAIL,
    message: message,
  };
};
const getEventsDetails = (navigate, Data, t, setCalendarViewModal) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getEventsDetails_init());
    let form = new FormData();
    form.append("RequestMethod", GetDiskusEventDetailsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCalender,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getEventsDetails(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetDiskusEventDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                getEventsDetails_success(
                  response.data.responseResult,
                  ""
                )
              );
              if (Data.CalendarEventTypeId === 2) {
                setCalendarViewModal(true);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetDiskusEventDetails_02".toLowerCase()
                )
            ) {
              dispatch(getEventsDetails_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Calender_CalenderServiceManager_GetDiskusEventDetails_03".toLowerCase()
                )
            ) {
              dispatch(getEventsDetails_fail(t("Something-went-wrong")));
            } else {
              dispatch(getEventsDetails_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getEventsDetails_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getEventsDetails_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(getEventsDetails_fail(t("Something-went-wrong")));
      });
  };
};
const createMicrosftEventMQTT = (response) => {
  return {
    type: actions.MICROSOFT_CREATE_EVENT,
    response: response,
  };
};
const updateMicrosftEventMQTT = (response) => {
  return {
    type: actions.MICROSOFT_UPDATE_EVENT,
    response: response,
  };
};
const deleteMicrosftEventMQTT = (response) => {
  return {
    type: actions.MICROSOFT_DELETE_EVENT,
    response: response,
  };
};
const createGoogleEventMQTT = (response) => {
  return {
    type: actions.GOOGLE_CREATE_EVENT,
    response: response,
  };
};
const updateGoogletEventMQTT = (response) => {
  return {
    type: actions.GOOGLE_UPDATE_EVENT,
    response: response,
  };
};
const deleteGoogleEventMQTT = (response) => {
  return {
    type: actions.GOOGLE_DELETE_EVENT,
    response: response,
  };
};
export {
  getCalendarDataResponse,
  HideNotificationCalendarData,
  getCalendarDataInit,
  getEventsTypes,
  getEventsDetails,
  clearCalendarState,
  getCalendarDataResponseMQTT,
  createMicrosftEventMQTT,
  updateMicrosftEventMQTT,
  deleteMicrosftEventMQTT,
  createGoogleEventMQTT,
  updateGoogletEventMQTT,
  deleteGoogleEventMQTT,
};
