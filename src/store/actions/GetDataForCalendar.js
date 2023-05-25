import * as actions from "../action_types";
import { calendarDataRequest } from "../../commen/apis/Api_config";
import { getCalenderApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { RefreshToken } from "./Auth_action";

const getCalendarDataInit = (response, message) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_INIT,
    response: response,
    message: message,
  };
};

const getCalendarDataSuccess = (response, message) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_SUCCESS,
    response: response,
    message: message,
  };
};

const getCalendarDataFail = (message) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_FAIL,
    message: message,
  };
};

const getCalendarDataResponse = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    UserID: parseInt(data),
  };
  return (dispatch) => {
    dispatch(getCalendarDataInit());
    let form = new FormData();
    form.append("RequestMethod", calendarDataRequest.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCalenderApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("calendar Data Response", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCalendarDataResponse(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingEventsByUserId_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCalendarDataSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingEventsByUserId_02".toLowerCase()
                )
            ) {
              await dispatch(getCalendarDataFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingEventsByUserId_03".toLowerCase()
                )
            ) {
              await dispatch(getCalendarDataFail(t("Empty-or-null-request")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingEventsByUserId_04".toLowerCase()
                )
            ) {
              await dispatch(getCalendarDataFail(t("Something-went-wrong")));
            }

            //   dispatch(SetLoaderFalse());
          } else {
            await dispatch(getCalendarDataFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getCalendarDataFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log("err", response);
        dispatch(getCalendarDataFail(t("Something-went-wrong")));
      });
  };
};

const HideNotificationCalendarData = () => {
  return {
    type: actions.HIDE,
  };
};

export { getCalendarDataResponse, HideNotificationCalendarData };
