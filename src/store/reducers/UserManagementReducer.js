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
  defaultRoutingValue: 1,
  defaulSignUpRoute: 1,
  getAllSelectedPakagesData: null,
  getOrganizationUserStatsGraph: null,
  getAllUserTypePackagesData: [],
  ResendForgotPasswordCodedData: null,
  deleteOrganizationUsersData: null,
  paymentInitiateData: null,
  cancelSubReasonData: [],
  cancelOrganizationSubsData: null,
  packageUpgradeDetail: null,
  defaultRoutes: null,
  organizationTrialExtendData: null,
  paymentStatusModal: null,
  changeSelectedPackage: null,
  isFreeTrailCancelandUpgradeOrganization: null,
  downgradeOrganizationSubscriptionData: null,
  cancelOrganizationSubscriptionData: null,
  getOrganizationWallet: null,
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

    // case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_INIT: {
    //   return {
    //     ...state,
    //     Loading: true,
    //   };
    // }
    // case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_SUCCESS: {
    //   return {
    //     ...state,
    //     Loading: true,
    //     getOrganizationSubscriptionExpiryDetailsData: action.response,
    //     ResponseMessage: action.message,
    //   };
    // }
    // case actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_FAILS: {
    //   return {
    //     ...state,
    //     Loading: false,
    //     getOrganizationSubscriptionExpiryDetailsData: null,
    //     ResponseMessage: action.message,
    //   };
    // }

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
        Loading: action.loader,
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
        Loading: action.loader,
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

    case actions.RESEND_FORGOT_PASSWORD_CODE_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.RESEND_FORGOT_PASSWORD_CODE_SUCCESS:
      return {
        ...state,
        Loading: false,
        ResendForgotPasswordCodedData: action.response,
        ResponseMessage: action.message,
      };

    case actions.RESEND_FORGOT_PASSWORD_CODE_FAIL:
      return {
        ...state,
        Loading: false,
        ResendForgotPasswordCodedData: null,
        ResponseMessage: action.message,
      };

    case actions.DELETE_ORGANIZATION_USERS_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.DELETE_ORGANIZATION_USERS_SUCCESS:
      return {
        ...state,
        Loading: false,
        deleteOrganizationUsersData: action.response,
        ResponseMessage: action.message,
      };

    case actions.DELETE_ORGANIZATION_USERS_FAIL:
      return {
        ...state,
        Loading: false,
        deleteOrganizationUsersData: null,
        ResponseMessage: action.message,
      };

    //Payment Initiate
    case actions.PAYMENT_INITIATE_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.PAYMENT_INITIATE_SUCCESS:
      return {
        ...state,
        Loading: false,
        paymentInitiateData: action.response,
        ResponseMessage: action.message,
      };

    case actions.PAYMENT_INITIATE_FAIL:
      return {
        ...state,
        Loading: false,
        paymentInitiateData: null,
        ResponseMessage: action.message,
      };

    //Cancel Sub Reason Api Data
    case actions.CANCEL_SUB_REASONS_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.CANCEL_SUB_REASONS_SUCCESS:
      return {
        ...state,
        Loading: false,
        cancelSubReasonData: action.response,
        ResponseMessage: action.message,
      };

    case actions.CANCEL_SUB_REASONS_FAIL:
      return {
        ...state,
        Loading: false,
        cancelSubReasonData: [],
        ResponseMessage: action.message,
      };

    //Cancel Organization Subscription Reason Api Data
    case actions.CANCEL_ORGANIZATION_SUB_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.CANCEL_ORGANIZATION_SUB_SUCCESS:
      return {
        ...state,
        Loading: false,
        cancelOrganizationSubsData: action.response,
        ResponseMessage: action.message,
      };

    case actions.CANCEL_ORGANIZATION_SUB_FAIL:
      return {
        ...state,
        Loading: false,
        cancelOrganizationSubsData: null,
        ResponseMessage: action.message,
      };

    // Api for upgrade button on package details which is not ready yet but structure should be ready when Api will implemented ready to go
    // case actions.PACKAGE_UPGRADE_DETAIL_INIT:
    //   return {
    //     ...state,
    //     Loading: true,
    //   };

    // case actions.PACKAGE_UPGRADE_DETAIL_SUCCESS:
    //   return {
    //     ...state,
    //     Loading: false,
    //     packageUpgradeDetail: action.response,
    //     ResponseMessage: action.message,
    //   };

    // case actions.PACKAGE_UPGRADE_DETAIL_FAIL:
    //   return {
    //     ...state,
    //     Loading: false,
    //     packageUpgradeDetail: null,
    //     ResponseMessage: action.message,
    //   };

    //Request Organizattion Trial Extend Data
    case actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_SUCCESS:
      return {
        ...state,
        Loading: false,
        organizationTrialExtendData: action.response,
        ResponseMessage: action.message,
      };

    case actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_FAIL:
      return {
        ...state,
        Loading: false,
        organizationTrialExtendData: null,
        ResponseMessage: action.message,
      };

    //Payment Status Modal
    case actions.PAYMENT_STATUS_INIT:
      return {
        ...state,
        Loading: true,
      };

    case actions.PAYMENT_STATUS_SUCCESS:
      return {
        ...state,
        Loading: false,
        paymentStatusModal: action.response,
        ResponseMessage: action.message,
      };

    case actions.PAYMENT_STATUS_FAILED:
      return {
        ...state,
        Loading: false,
        paymentStatusModal: null,
        ResponseMessage: action.message,
      };

    case actions.CHANGE_PACKAGE_SELECTED_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CHANGE_PACKAGE_SELECTED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        changeSelectedPackage: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CHANGE_PACKAGE_SELECTED_FAIL: {
      return {
        ...state,
        Loading: false,
        changeSelectedPackage: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        isFreeTrailCancelandUpgradeOrganization: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_FAIL: {
      return {
        ...state,
        Loading: false,
        isFreeTrailCancelandUpgradeOrganization: null,
        ResponseMessage: action.message,
      };
    }

    case actions.DOWNGRADE_ORGANIZATION_SUBSCRIPTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DOWNGRADE_ORGANIZATION_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        downgradeOrganizationSubscriptionData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.DOWNGRADE_ORGANIZATION_SUBSCRIPTION_FAILED: {
      return {
        ...state,
        Loading: false,
        downgradeOrganizationSubscriptionData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CANCEL_ORGANIZATION_SUBSCRIPTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CANCEL_ORGANIZATION_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        cancelOrganizationSubscriptionData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CANCEL_ORGANIZATION_SUBSCRIPTION_FAILED: {
      return {
        ...state,
        Loading: false,
        cancelOrganizationSubscriptionData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ORGANIZATION_WALLET_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ORGANIZATION_WALLET_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getOrganizationWallet: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ORGANIZATION_WALLET_FAILED: {
      return {
        ...state,
        Loading: false,
        getOrganizationWallet: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_MESSEGES_USER_MANAGEMENT:
      return {
        ...state,
        ResponseMessage: "",
      };

    default:
      return { ...state };
  }
};

export default UserMangementReducer;
