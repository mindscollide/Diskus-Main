import * as actions from "../action_types";

const summaryInit = (response, message) => {
  return {
    type: actions.ADMIN_SUMMARY_INIT,
    response: response,
    message: message,
  };
};

const summarySuccess = (response, message) => {
  return {
    type: actions.ADMIN_SUMMARY_SUCCESS,
    response: response,
    message: message,
  };
};

const summaryFail = (response, message) => {
  return {
    type: actions.ADMIN_SUMMARY_FAIL,
    response: response,
    message: message,
  };
};
