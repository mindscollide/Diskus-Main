import * as actions from "../action_types";

const packageDetailInit = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEDETAIL_INIT,
    response: response,
    message: message,
  };
};

const packageDetailSuccess = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEDETAIL_SUCCESS,
    response: response,
    message: message,
  };
};

const packageDetailFail = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEDETAIL_FAIL,
    response: response,
    message: message,
  };
};
