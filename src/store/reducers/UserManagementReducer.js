import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  saveOrganizationAndSelectedPakageData: null,
  getOrganizationSubscriptionExpiryDetailsData: null,
  extentOrganizationalTrialData: null,
  addOrganizationUsersData: null,
  editOrganizationUsersData: null,
};

const UserMangementReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveOrganizationAndSelectedPakageData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        saveOrganizationAndSelectedPakageData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getOrganizationSubscriptionExpiryDetailsData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_FAILS: {
      return {
        ...state,
        Loading: false,
        getOrganizationSubscriptionExpiryDetailsData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.EXTEND_ORGANIZATION_TRIAL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.EXTEND_ORGANIZATION_TRIAL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        extentOrganizationalTrialData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.EXTEND_ORGANIZATION_TRIAL_FAIL: {
      return {
        ...state,
        Loading: false,
        extentOrganizationalTrialData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.ADD_ORGANIZATION_USERS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_ORGANIZATION_USERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        addOrganizationUsersData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_ORGANIZATION_USERS_FAIL: {
      return {
        ...state,
        Loading: false,
        addOrganizationUsersData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.EDIT_ORGANIZATION_USERS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.EDIT_ORGANIZATION_USERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        editOrganizationUsersData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.EDIT_ORGANIZATION_USERS_FAIL: {
      return {
        ...state,
        Loading: false,
        editOrganizationUsersData: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};

export default UserMangementReducer;
