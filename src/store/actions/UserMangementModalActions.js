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

const showThankYouPaymentModal = (response) => {
  return {
    type: actions.THANK_FOR_PAYMENT_MODAL,
    response: response,
  };
};

const showFailedPaymentModal = (response) => {
  return {
    type: actions.FAILED_PAYMENT_PROCESS,
    response: response,
  };
};

const showCancelSubscriptionModal = (response) => {
  return {
    type: actions.CANCEL_SUBSCRIPTION_MODAL,
    response: response,
  };
};

const showReasonForLeavingModal = (response) => {
  return {
    type: actions.REASON_FOR_LEAVING_MODAL,
    response: response,
  };
};

const openPaymentProcessModal = (response) => {
  return {
    type: actions.OPEN_PAYMENT_PROCESS_MODAL,
    response: response,
  };
};

const InsternetDisconnectModal = (response) => {
  return {
    type: actions.INTERNET_DISCONNECT_MODAL,
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
  showThankYouPaymentModal,
  showFailedPaymentModal,
  showCancelSubscriptionModal,
  showReasonForLeavingModal,
  openPaymentProcessModal,
  InsternetDisconnectModal,
};
