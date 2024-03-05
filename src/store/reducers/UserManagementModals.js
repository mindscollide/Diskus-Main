import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  UpgradeNowModal: false,
  requestExtentionModal: false,
  createAdditionalModals: false,
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

    default:
      return { ...state };
  }
};

export default UserManagementModals;
