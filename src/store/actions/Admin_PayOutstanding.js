import * as actions from "../action_types";

const payOutstandingInit = (response, message) => {
  return {
    type: actions.ADMIN_PAYOUTSTANDING_INIT,
    response: response,
    message: message,
  };
};

const payOutstandingSuccess = (response, message) => {
  return {
    type: actions.ADMIN_PAYOUTSTANDING_SUCCESS,
    response: response,
    message: message,
  };
};

const payOutstandingFail = (response, message) => {
  return {
    type: actions.ADMIN_PAYOUTSTANDING_FAIL,
    response: response,
    message: message,
  };
};
