/**
 * @file Role_List_reducers.js
 * @description Redux reducer for the `roleList` slice. Manages reference
 * data used in admin user management: user roles, user statuses, and
 * organisation roles.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading               - Pending request flag.
 * @property {string}  OrganaizationName     - Name of the current organisation.
 * @property {Array}   UserRolesList         - Available user roles.
 * @property {Array}   UserStatusList        - Available user status options.
 * @property {Array}   OrganaizationRolesList - Organisation-level roles.
 */
const initialState = {
  Response: "",
  ResponseMessage: "",
  Loading: false,
  OrganaizationName: "",
  UserRolesList: [],
  UserStatusList: [],
  OrganaizationRolesList: [],
};

/**
 * Reducer for the `roleList` slice.
 * Handles fetching user roles, user statuses, and organisation roles.
 *
 * @param {object} state  - Current roleList state.
 * @param {{ type: string, response?: * }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
