/**
 * @file UserManagementModals.js
 * @description Redux reducer for the `UserManagementModals` slice. Controls the
 * visibility of all modals in the User Management section: subscription upgrade,
 * seat extension, payment, cancellation, user CRUD, and system modals
 * (internet disconnect, mobile app pop-up).
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                  - Global loading flag.
 * @property {string}  ResponseMessage          - Last API response message.
 * @property {boolean} UpgradeNowModal          - Upgrade-now modal visibility.
 * @property {boolean} requestExtentionModal    - Request seat-extension modal visibility.
 * @property {boolean} createAdditionalModals   - Create additional users modal visibility.
 * @property {boolean} deleteUsersModal         - Delete users modal visibility.
 * @property {boolean} editUserModal            - Edit user modal visibility.
 * @property {boolean} successfullyUpdated      - Success confirmation modal visibility.
 * @property {boolean} thanksForPaymentModal    - Thank-you after payment modal visibility.
 * @property {boolean} paymentProceedFailed     - Payment failure modal visibility.
 * @property {boolean} cancelSubscriptionModal  - Cancel subscription modal visibility.
 * @property {boolean} reasonForleavingModal    - Reason-for-leaving modal visibility.
 * @property {boolean} paymentProcessModal      - Payment processing iframe modal visibility.
 * @property {boolean} internetDisconnectModal  - Internet disconnect warning modal visibility.
 * @property {boolean} mobileAppPopUp           - Mobile app download pop-up visibility.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  UpgradeNowModal: false,
  requestExtentionModal: false,
  createAdditionalModals: false,
  deleteUsersModal: false,
  editUserModal: false,
  successfullyUpdated: false,
  thanksForPaymentModal: false,
  paymentProceedFailed: false,
  cancelSubscriptionModal: false,
  reasonForleavingModal: false,
  paymentProcessModal: false,
  internetDisconnectModal: false,
  mobileAppPopUp: false,
};

/**
 * Reducer for the `UserManagementModals` slice.
 * Each action toggles a specific modal's open/close state.
 *
 * @param {object} state  - Current modal flags state.
 * @param {{ type: string, response?: boolean }} action - Dispatched action.
 * @returns {object} Next state.
 */
const UserManagementModals = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPGRADE_NOW_MODAL: {
      return {
        ...state,
        UpgradeNowModal: action.response,
      };
    }

    case actions.REQUEST_EXTENTION_MODAL: {
      return {
        ...state,
        requestExtentionModal: action.response,
      };
    }

    case actions.CREATE_ADDITIONAL_MODALS: {
      return {
        ...state,
        createAdditionalModals: action.response,
      };
    }

    case actions.DELETE_USER_MODAL: {
      return {
        ...state,
        deleteUsersModal: action.response,
      };
    }

    case actions.EDIT_USER_MODAL: {
      return {
        ...state,
        editUserModal: action.response,
      };
    }

    case actions.SUCCESSFULLY_UPDATED_MODAL: {
      return {
        ...state,
        successfullyUpdated: action.response,
      };
    }

    case actions.THANK_FOR_PAYMENT_MODAL: {
      return {
        ...state,
        thanksForPaymentModal: action.response,
      };
    }

    case actions.FAILED_PAYMENT_PROCESS: {
      return {
        ...state,
        paymentProceedFailed: action.response,
      };
    }

    case actions.CANCEL_SUBSCRIPTION_MODAL: {
      return {
        ...state,
        cancelSubscriptionModal: action.response,
      };
    }

    case actions.REASON_FOR_LEAVING_MODAL: {
      return {
        ...state,
        reasonForleavingModal: action.response,
      };
    }

    // to open modal of payment process modal in Iframe
    case actions.OPEN_PAYMENT_PROCESS_MODAL: {
      return {
        ...state,
        paymentProcessModal: action.response,
      };
    }

    case actions.INTERNET_DISCONNECT_MODAL: {
      return {
        ...state,
        internetDisconnectModal: action.response,
      };
    }

    case actions.MOBILE_POP_UP_MODAL: {
      return {
        ...state,
        mobileAppPopUp: action.response,
      };
    }

    default:
      return { ...state };
  }
};

export default UserManagementModals;
