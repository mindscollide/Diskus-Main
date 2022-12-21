import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { addMinuteofMeetings } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";

const HideMinuteMeetingMessage = () => {
  return {
    type: actions.HIDEMINUTEMESSAGE,
  };
};

const meetinOfMeetingInit = () => {
  return {
    type: actions.ADD_MINUTESOFMEETING_INIT,
  };
};
const meetinOfMeetingSuccess = (response, message) => {
  return {
    type: actions.ADD_MINUTESOFMEETING_SUCCESS,
    response: response,
    message: message,
  };
};
const meetinOfMeetingFail = (response, message) => {
  return {
    type: actions.ADD_MINUTESOFMEETING_FAIL,
    response: response,
    message: message,
  };
};

const addMinutesofMeetings = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(meetinOfMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", addMinuteofMeetings.RequestMethod);
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
          await dispatch(RefreshToken());
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
export { addMinutesofMeetings, HideMinuteMeetingMessage };
