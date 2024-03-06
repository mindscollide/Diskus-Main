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

const showDeleteUsersModal = (response) => {
  return {
    type: actions.DELETE_USER_MODAL,
    response: response,
  };
};

const showEditUserModal = (response) => {
  return {
    type: actions.EDIT_USER_MODAL,
    response: response,
  };
};

const showSucessfullyUpdatedModal = (response) => {
  return {
    type: actions.SUCCESSFULLY_UPDATED_MODAL,
    response: response,
  };
};

export {
  showUpgradeNowModal,
  showRequestExtentionModal,
  showCreateAddtionalUsersModal,
  showDeleteUsersModal,
  showEditUserModal,
  showSucessfullyUpdatedModal,
};
