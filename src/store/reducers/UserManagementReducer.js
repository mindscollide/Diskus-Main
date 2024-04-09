import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  saveOrganizationAndSelectedPakageData: null,
  getOrganizationSubscriptionExpiryDetailsData: null,
  extentOrganizationalTrialData: null,
  addOrganizationUsersData: null,
  editOrganizationUsersData: null,
  allOrganizationUsersData: null,
  organizationPakageDetailsUserStatsData: null,
  organizationSelectedPakagesByOrganizationIDData: null,
  defaultRoutingValue: null,
  defaulSignUpRoute: 1,
  getAllSelectedPakagesData: null,
  getOrganizationUserStatsGraph: null,
  getAllUserTypePackagesData: [],
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
        Loading: true,
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

    case actions.ALL_ORGANIZAION_USERS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ALL_ORGANIZAION_USERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        allOrganizationUsersData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ALL_ORGANIZAION_USERS_FAIL: {
      return {
        ...state,
        Loading: false,
        allOrganizationUsersData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        organizationPakageDetailsUserStatsData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_FAIL: {
      return {
        ...state,
        Loading: false,
        organizationPakageDetailsUserStatsData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        organizationSelectedPakagesByOrganizationIDData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_FAIL: {
      return {
        ...state,
        Loading: false,
        organizationSelectedPakagesByOrganizationIDData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.ROUTING_ON_PAGES_USERMANAGEMENT: {
      return {
        ...state,
        defaultRoutingValue: action.response,
      };
    }

    case actions.ROUTES_FOR_SIGNUP_FLOW_UM: {
      return {
        ...state,
        defaulSignUpRoute: action.response,
      };
    }

    case actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllSelectedPakagesData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllSelectedPakagesData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_USER_TYPES_PAKAGES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_USER_TYPES_PAKAGES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllUserTypePackagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_USER_TYPES_PAKAGES_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllUserTypePackagesData: [],
        ResponseMessage: action.message,
      };
    }

    //action Case For OrganizationUserListStatistics
    case actions.USERADMIN_LIST_OF_STATS_GRAPH_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.USERADMIN_LIST_OF_STATS_GRAPH_SUCCESS:
      return {
        ...state,
        Loading: false,
        getOrganizationUserStatsGraph: action.response,
        ResponseMessage: action.message,
      };

    case actions.USERADMIN_LIST_OF_STATS_GRAPH_FAIL:
      return {
        ...state,
        Loading: false,
        getOrganizationUserStatsGraph: null,
        ResponseMessage: action.message,
      };

    default:
      return { ...state };
  }
};

export default UserMangementReducer;
