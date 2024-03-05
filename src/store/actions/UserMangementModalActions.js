import * as actions from "../action_types";

const showUpgradeNowModal = (response) => {
  return {
    type: actions.UPGRADE_NOW_MODAL,
    response: response,
  };
};

const showRequestExtentionModal = (response) => {
  return {
    type: actions.REQUEST_EXTENTION_MODAL,
    response: response,
  };
};

const showCreateAddtionalUsersModal = (response) => {
  return {
    type: actions.CREATE_ADDITIONAL_MODALS,
    response: response,
  };
};

export {
  showUpgradeNowModal,
  showRequestExtentionModal,
  showCreateAddtionalUsersModal,
};
