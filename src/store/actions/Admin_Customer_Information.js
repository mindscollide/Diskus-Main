import * as actions from "../action_types";

const customerInformationInit = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_INIT,
    response: response,
    message: message,
  };
};

const customerInformationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_SUCCESS,
    response: response,
    message: message,
  };
};

const customerInformationFail = (response, message) => {
  return {
    type: actions.ADMIN_CUSTOMERINFORMATION_FAIL,
    response: response,
    message: message,
  };
};
