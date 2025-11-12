import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { addMinuteofMeetings } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

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
const meetinOfMeetingFail = (message) => {
  return {
    type: actions.ADD_MINUTESOFMEETING_FAIL,
    message: message,
  };
};

const addMinutesofMeetings = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(meetinOfMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", addMinuteofMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addMinutesofMeetings(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RecordMinutesofMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                meetinOfMeetingSuccess(
                  response.data.responseResult,
                  t("The-record-has-been-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RecordMinutesofMeeting_02".toLowerCase()
                )
            ) {
              await dispatch(meetinOfMeetingFail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_RecordMinutesofMeeting_03".toLowerCase()
                )
            ) {
              await dispatch(meetinOfMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(meetinOfMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(meetinOfMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(meetinOfMeetingFail(t("Something-went-wrong")));
      });
  };
};
export { addMinutesofMeetings, HideMinuteMeetingMessage };
