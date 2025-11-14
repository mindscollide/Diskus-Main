import * as actions from "../action_types";

import { RefreshToken } from "./Auth_action";
import { updateMinuteofMeetings } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

const meetinOfMeetingInit = () => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_INIT,
  };
};
const meetinOfMeetingSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_SUCCESS,
    response: response,
    message: message,
  };
};
const meetinOfMeetingFail = (response, message) => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_FAIL,
    response: response,
    message: message,
  };
};

const updateMeetingOfMinutes = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(meetinOfMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", updateMinuteofMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
    .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateMeetingOfMinutes(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              meetinOfMeetingSuccess(
                response.data.responseResult,
                response.data.responseResult.responseMessage
              )
            );
          } else {
            dispatch(
              meetinOfMeetingFail(
                response.data.responseResult,
                response.data.responseResult.responseMessage
              )
            );
          }
        } else {
          dispatch(
            meetinOfMeetingFail(
              response.data.responseResult,
              response.data.responseResult.responseMessage
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          meetinOfMeetingFail(
            response.data.responseResult,
            response.data.responseResult.responseMessage
          )
        );
      });
  };
};
export { updateMeetingOfMinutes };
