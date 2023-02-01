import * as actions from '../action_types'


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
    upgradeSubscriptionPackageResponseMessage: ""
}


const getPackageDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.GETSUBSCRIPTIONPACAKGES_INIT:
            return {
                ...state,
                Loading: true
            }
        case actions.GETSUBSCRIPTIONPACAKGES_SUCCESS:
            return {
                ...state,
                Loading: false,
                PackageDetails: action.response,
                ResponseMessage: action.messasge
            }
        case actions.GETSUBSCRIPTIONPACAKGES_FAIL:
            return {
                ...state,
                Loading: false,
                PackageDetails: [],
                ResponseMessage: action.messasge
            }
        case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getCurrentActiveSubscriptionPackage: action.response,
                getCurrentActiveSubscriptionPackageResponseMessage: action.messasge

            }
        }
        case actions.GETSUBSCRIBEORGANIZATIONPACKAGE_FAIL: {
            return {
                ...state,
                Loading: false,
                getCurrentActiveSubscriptionPackage: null,
                getCurrentActiveSubscriptionPackageResponseMessage: action.messasge

            }
        }
        case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_SUCCESS: {
            console.log(action.response, "getSubscriptionPackageforUpgradeResponse")
            return {
                ...state,
                Loading: false,
                getSubscriptionPackageforUpgradeResponse: action.response,
                getSubscriptionPackageforUpgradeResponseMessage: action.message
            }
        }
        case actions.GETUPGRADABLESUBSCRIPTIONPACAKGE_FAIL: {
            return {
                ...state,
                Loading: false,
                getSubscriptionPackageforUpgradeResponse: [],
                getSubscriptionPackageforUpgradeResponseMessage: action.messasge
            }
        }
        case actions.UPGRADESUBSRIPTIONPACKAGE_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.UPGRADESUBSRIPTIONPACKAGE_SUCCESS: {
            return {
                ...state,
                Loading: false,
                upgradeSubscriptionPackageResponse: action.response,
                upgradeSubscriptionPackageResponseMessage: action.messasge
            }
        }
        case actions.UPGRADESUBSRIPTIONPACKAGE_FAIL: {
            return {
                ...state,
                Loading: false,
                upgradeSubscriptionPackageResponse: null,
                upgradeSubscriptionPackageResponseMessage: action.messasge
            }
        }
        case actions.CANCELSUBCRIPTIONPACKAGE_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.CANCELSUBCRIPTIONPACKAGE_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getCancelSubscriptionResponse: action.response,
                getCancelSubscriptionResponseMessage: action.messasge
            }
        }
        case actions.CANCELSUBCRIPTIONPACKAGE_FAIL: {
            return {
                ...state,
                Loading: false,
                getCancelSubscriptionResponse: action.response,
                getCancelSubscriptionResponseMessage: action.messasge
            }
        }
        default:
            return {
                ...state
            }
    }
}
export default getPackageDetailReducer