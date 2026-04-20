/**
 * @file UserMangementModalActions.js
 * @description Redux action creators for user-management modal visibility flags.
 * Handles showing/hiding modals for plan upgrades, request extensions, additional users,
 * delete/edit user, payment outcomes, subscription cancellation, and connectivity alerts.
 * Dispatches: UPGRADE_NOW_MODAL / REQUEST_EXTENTION_MODAL / CREATE_ADDITIONAL_MODALS /
 * DELETE_USER_MODAL / EDIT_USER_MODAL / SUCCESSFULLY_UPDATED_MODAL /
 * THANK_FOR_PAYMENT_MODAL / FAILED_PAYMENT_PROCESS / CANCEL_SUBSCRIPTION_MODAL /
 * REASON_FOR_LEAVING_MODAL / OPEN_PAYMENT_PROCESS_MODAL /
 * INTERNET_DISCONNECT_MODAL / MOBILE_POP_UP_MODAL action types.
 */
import * as actions from "../action_types";

/**
 * Opens or closes the "Upgrade Now" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showUpgradeNowModal = (response) => {
  return {
    type: actions.UPGRADE_NOW_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Request Extension" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showRequestExtentionModal = (response) => {
  return {
    type: actions.REQUEST_EXTENTION_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Create Additional Users" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showCreateAddtionalUsersModal = (response) => {
  return {
    type: actions.CREATE_ADDITIONAL_MODALS,
    response: response,
  };
};

/**
 * Opens or closes the "Delete User" confirmation modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showDeleteUsersModal = (response) => {
  return {
    type: actions.DELETE_USER_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Edit User" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showEditUserModal = (response) => {
  return {
    type: actions.EDIT_USER_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Successfully Updated" confirmation modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showSucessfullyUpdatedModal = (response) => {
  return {
    type: actions.SUCCESSFULLY_UPDATED_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Thank You for Payment" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showThankYouPaymentModal = (response) => {
  return {
    type: actions.THANK_FOR_PAYMENT_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Failed Payment" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showFailedPaymentModal = (response) => {
  return {
    type: actions.FAILED_PAYMENT_PROCESS,
    response: response,
  };
};

/**
 * Opens or closes the "Cancel Subscription" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showCancelSubscriptionModal = (response) => {
  return {
    type: actions.CANCEL_SUBSCRIPTION_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the "Reason for Leaving" modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showReasonForLeavingModal = (response) => {
  return {
    type: actions.REASON_FOR_LEAVING_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the payment-process modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const openPaymentProcessModal = (response) => {
  return {
    type: actions.OPEN_PAYMENT_PROCESS_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the internet-disconnect alert modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const InsternetDisconnectModal = (response) => {
  return {
    type: actions.INTERNET_DISCONNECT_MODAL,
    response: response,
  };
};

/**
 * Opens or closes the mobile-app promotion pop-up modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const mobileAppPopModal = (response) => {
  return {
    type: actions.MOBILE_POP_UP_MODAL,
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
  mobileAppPopModal,
};
