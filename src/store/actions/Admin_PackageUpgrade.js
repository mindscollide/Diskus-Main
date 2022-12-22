import * as actions from "../action_types";

const packageUpgradeInit = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEUPGRADE_INIT,
    response: response,
    message: message,
  };
};

const packageUpgradeSuccess = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEUPGRADE_SUCCESS,
    response: response,
    message: message,
  };
};

const packageUpgradeFail = (response, message) => {
  return {
    type: actions.ADMIN_PACKAGEUPGRADE_FAIL,
    response: response,
    message: message,
  };
};
