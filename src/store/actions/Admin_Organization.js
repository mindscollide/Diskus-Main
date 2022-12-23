import * as actions from "../action_types";

const organizationInit = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_INIT,
    response: response,
    message: message,
  };
};

const organizationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};

const organizationFail = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_FAIL,
    response: response,
    message: message,
  };
};
