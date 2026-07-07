import * as actions from "../action_types";

const initialState = {
  Loading: false,
  PackageDetails: [],
  ResponseMessage: "",
  errorSeverity: null,
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
        errorSeverity: "success",
      };
    case actions.GETSUBSCRIPTIONPACAKGES_FAIL:
      return {
        ...state,
        Loading: false,
        PackageDetails: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: "success",
      };
    }
    case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getCurrentActiveSubscriptionPackage: null,
        getCurrentActiveSubscriptionPackageResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: "success",
      };
    }
    case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getSubscriptionPackageforUpgradeResponse: [],
        getSubscriptionPackageforUpgradeResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: "success",
      };
    }
    case actions.UPGRADESUBSRIPTIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        upgradeSubscriptionPackageResponse: null,
        upgradeSubscriptionPackageResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: "success",
      };
    }
    case actions.CANCELSUBCRIPTIONPACKAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        getCancelSubscriptionResponse: action.response,
        getCancelSubscriptionResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: "success",
      };
    }
    case actions.GETPACKAGEEXPIRYDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        getPackageExpiryDetailResponse: null,
        ResponseMessage: action.message,
        errorSeverity: "error",
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
        errorSeverity: null,
      };
    }

    default:
      return {
        ...state,
      };
  }
};
export default getPackageDetailReducer;
