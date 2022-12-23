import * as actions from "../action_types";

const addUserInit = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_INIT,
    response: response,
    message: message,
  };
};

const addUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const addUserFail = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_FAIL,
    response: response,
    message: message,
  };
};
