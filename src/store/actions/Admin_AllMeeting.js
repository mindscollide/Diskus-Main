import * as actions from "../action_types";

const allMeetingInit = (response, message) => {
  return {
    type: actions.ADMIN_ALLMEETING_INIT,
    response: response,
    message: message,
  };
};

const allMeetingSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ALLMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const allMeetingFail = (response, message) => {
  return {
    type: actions.ADMIN_ALLMEETING_FAIL,
    response: response,
    message: message,
  };
};
