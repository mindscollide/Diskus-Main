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

const getCalendarDataFail = (response, message) => {
  return {
    type: actions.GET_DATA_FOR_CALENDAR_FAIL,
    response: response,
    message: message,
  };
};

const getCalendarDataResponse = (data) => {
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
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              getCalendarDataSuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
            //   dispatch(SetLoaderFalse());
          } else {
            dispatch(
              getCalendarDataFail(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
            //   dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(
            getCalendarDataFail(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
          // dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        console.log("err", response);
        dispatch(
          getCalendarDataFail(
            response.data.responseResult,
            response.data.responseMessage
          )
        );
      });
  };
};

const HideNotificationCalendarData = () => {
  return {
    type: actions.HIDE,
  };
};

export { getCalendarDataResponse, HideNotificationCalendarData };
