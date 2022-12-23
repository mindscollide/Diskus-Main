import * as actions from "../action_types";

const cancelSubInit = (response, message) => {
  return {
    type: actions.ADMIN_CANCELSUB_INIT,
    response: response,
    message: message,
  };
};

const cancelSubSuccess = (response, message) => {
  return {
    type: actions.ADMIN_CANCELSUB_SUCCESS,
    response: response,
    message: message,
  };
};

const cancelSubFail = (response, message) => {
  return {
    type: actions.ADMIN_CANCELSUB_FAIL,
    response: response,
    message: message,
  };
};
