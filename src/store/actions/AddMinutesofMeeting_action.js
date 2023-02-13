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
const meetinOfMeetingFail = (message) => {
  return {
    type: actions.ADD_MINUTESOFMEETING_FAIL,
    message: message,
  };
};

const addMinutesofMeetings = (data, t) => {
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
          await dispatch(RefreshToken(t));
          dispatch(addMinutesofMeetings(data, t));
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
              await dispatch(meetinOfMeetingFail(t("something-went-worng")));
            }
          } else {
            dispatch(meetinOfMeetingFail(t("something-went-worng")));
          }
        } else {
          dispatch(meetinOfMeetingFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        dispatch(meetinOfMeetingFail(t("something-went-worng")));
      });
  };
};
export { addMinutesofMeetings, HideMinuteMeetingMessage };
