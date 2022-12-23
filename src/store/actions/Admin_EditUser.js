import * as actions from "../action_types";

const editUserInit = (response, message) => {
  return {
    type: actions.ADMIN_EDITUSER_INIT,
    response: response,
    message: message,
  };
};

const editUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_EDITUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const editUserFail = (response, message) => {
  return {
    type: actions.ADMIN_EDITUSER_FAIL,
    response: response,
    message: message,
  };
};
