/**
 * @file UpdateMinutesofMeeting_action.js
 * @description Redux thunk actions for updating minutes of a meeting.
 * Handles posting updated meeting-minutes data to the meeting API.
 * Dispatches: UPDATE_MINUTESOFMEETING_INIT / UPDATE_MINUTESOFMEETING_SUCCESS /
 * UPDATE_MINUTESOFMEETING_FAIL action types.
 */
import * as actions from "../action_types";

import { RefreshToken } from "./Auth_action";
import { updateMinuteofMeetings } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

/** @returns {{ type: string }} */
const meetinOfMeetingInit = () => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_INIT,
  };
};

/** @returns {{ type: string, response: *, message: string }} */
const meetinOfMeetingSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

/** @returns {{ type: string, response: *, message: string }} */
const meetinOfMeetingFail = (response, message) => {
  return {
    type: actions.UPDATE_MINUTESOFMEETING_FAIL,
    response: response,
    message: message,
  };
};

/**
 * Submits updated minutes-of-meeting data to the meeting API.
 * @param {Function} navigate - React Router navigate function.
 * @param {Object} data - Minutes of meeting payload.
 * @param {Function} t - i18next translation function.
 * @returns {Function} Redux thunk.
 */
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
