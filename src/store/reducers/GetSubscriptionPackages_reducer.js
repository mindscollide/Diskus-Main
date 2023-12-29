import * as actions from "../action_types";

const initialState = {
  Loading: false,
  PackageDetails: [],
  ResponseMessage: "",
  getCurrentActiveSubscriptionPackage: null,
  getCurrentActiveSubscriptionPackageResponseMessage: "",
  getSubscriptionPackageforUpgradeResponse: [],
  getSubscriptionPackageforUpgradeResponseMessage: "",
  getCancelSubscriptionResponse: null,
  getCancelSubscriptionResponseMessage: "",
  upgradeSubscriptionPackageResponse: null,
  upgradeSubscriptionPackageResponseMessage: "",
  getPackageExpiryDetailResponse: null,
};

const getPackageDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GETSUBSCRIPTIONPACAKGES_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.GETSUBSCRIPTIONPACAKGES_SUCCESS:
      return {
        ...state,
        Loading: false,
        PackageDetails: action.response,
        ResponseMessage: action.message,
      };
    case actions.GETSUBSCRIPTIONPACAKGES_FAIL:
      return {
        ...state,
        Loading: false,
        PackageDetails: [],
        ResponseMessage: action.message,
      };
    case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCurrentActiveSubscriptionPackage: action.response,
        getCurrentActiveSubscriptionPackageResponseMessage: action.message,
      };
    }
    case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getCurrentActiveSubscriptionPackage: null,
        getCurrentActiveSubscriptionPackageResponseMessage: action.message,
      };
    }
    case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSubscriptionPackageforUpgradeResponse: action.response,
        getSubscriptionPackageforUpgradeResponseMessage: action.message,
      };
    }
    case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getSubscriptionPackageforUpgradeResponse: [],
        getSubscriptionPackageforUpgradeResponseMessage: action.message,
      };
    }
    case actions.UPGRADESUBSRIPTIONPACKAGE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPGRADESUBSRIPTIONPACKAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        upgradeSubscriptionPackageResponse: action.response,
        upgradeSubscriptionPackageResponseMessage: action.message,
      };
    }
    case actions.UPGRADESUBSRIPTIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        upgradeSubscriptionPackageResponse: null,
        upgradeSubscriptionPackageResponseMessage: action.message,
      };
    }
    case actions.CANCELSUBCRIPTIONPACKAGE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CANCELSUBCRIPTIONPACKAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCancelSubscriptionResponse: action.response,
        getCancelSubscriptionResponseMessage: action.message,
      };
    }
    case actions.CANCELSUBCRIPTIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getCancelSubscriptionResponse: action.response,
        getCancelSubscriptionResponseMessage: action.message,
      };
    }
    case actions.GETPACKAGEEXPIRYDETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETPACKAGEEXPIRYDETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getPackageExpiryDetailResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPACKAGEEXPIRYDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        getPackageExpiryDetailResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEARE_MESSAGE_SUBSPACK: {
      return {
        ...state,
        getSubscriptionPackageforUpgradeResponseMessage: "",
        getCurrentActiveSubscriptionPackageResponseMessage: "",
        getCancelSubscriptionResponseMessage: "",
        upgradeSubscriptionPackageResponseMessage: "",
        ResponseMessage: "",
      };
    }

    default:
      return {
        ...state,
      };
  }
};
export default getPackageDetailReducer;
