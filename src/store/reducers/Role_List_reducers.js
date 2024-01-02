import * as actions from "../action_types";

const initialState = {
  Response: "",
  ResponseMessage: "",
  Loading: false,
  OrganaizationName: "",
  UserRolesList: [],
  UserStatusList: [],
  OrganaizationRolesList: [],
};

const RoleListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADMIN_ALLORGANAIZATIONROLES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADMIN_ALLORGANAIZATIONROLES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        OrganaizationRolesList: action.response,
      };
    }

    case actions.ADMIN_ALLORGANAIZATIONROLES_FAIL: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.ADMIN_USERROLELIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADMIN_USERROLELIST_SUCCESS: {
      return {
        ...state,
        UserRolesList: action.response,
      };
    }
    case actions.ADMIN_USERROLELIST_FAIL: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.ADMIN_GETORGANAIZATIONID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADMIN_GETORGANAIZATIONID_INIT_SUCCESS: {
      return {
        ...state,
        OrganaizationName: action.response,
      };
    }
    case actions.ADMIN_GETORGANAIZATIONID_INIT_FAIL: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.ADMIN_USERSTATUSLIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADMIN_USERSTATUSLIST_SUCCESS: {
      return {
        ...state,
        UserStatusList: action.response,
      };
    }
    case actions.ADMIN_USERSTATUSLIST_FAIL: {
      return {
        ...state,
        Loading: false,
        UserStatusList: [],
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default RoleListReducer;
