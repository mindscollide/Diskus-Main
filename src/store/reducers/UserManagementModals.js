import * as actions from "../action_types";

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
};

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

    default:
      return { ...state };
  }
};

export default UserManagementModals;
