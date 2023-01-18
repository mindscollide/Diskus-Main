import * as actions from '../action_types'


const initialState = {
    Loading: false,
    PackageDetails: [],
    ResponseMessage: ""
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
        default:
            return {
                ...state
            }
    }
}
export default getPackageDetailReducer