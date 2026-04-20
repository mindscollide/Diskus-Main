/**
 * @file GetSubscriptionPackages_reducer.js
 * @description Redux reducer for the `getPackageDetail` slice. Manages
 * subscription package data: available packages, the active subscription,
 * upgradable packages, subscription cancellation, and expiry details.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading                                    - Global loading flag.
 * @property {Array}       PackageDetails                             - All available subscription packages.
 * @property {object|null} getCurrentActiveSubscriptionPackage        - Currently active package for the org.
 * @property {Array}       getSubscriptionPackageforUpgradeResponse   - Packages eligible for upgrade.
 * @property {object|null} getCancelSubscriptionResponse              - Result of subscription cancellation.
 * @property {object|null} upgradeSubscriptionPackageResponse         - Result of subscription upgrade.
 * @property {object|null} getPackageExpiryDetailResponse             - Package expiry details.
 */
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

/**
 * Reducer for the `getPackageDetail` slice.
 * Handles listing, subscribing to, upgrading, and cancelling subscription
 * packages, plus fetching expiry details.
 *
 * @param {object} state  - Current getPackageDetail state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
