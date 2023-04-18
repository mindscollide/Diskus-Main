import * as actions from "../action_types";


const initialState = {
    Loading: false,
    ResponseMessage: "",
    GetAllVotingMethods: null,
    GetAllResolutionStatus: null,
    GetResolutions: null
}
const ResolutionReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_ALL_VOTING_METHOD_INIT: {
            console.log("actionaction", action)
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_ALL_VOTING_METHOD_SUCCESS: {
            console.log("actionaction", action)
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                GetAllVotingMethods: action.response
            }
        }
        case actions.GET_ALL_VOTING_METHOD_FAIL: {
            console.log("actionaction", action)
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                GetAllVotingMethods: null
            }
        }
        case actions.GET_ALL_RESOLUTION_STATUS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_ALL_RESOLUTION_STATUS_SUCCESS: {
            console.log(action.response, action.message, "actionaction111")
            return {
                ...state,
                Loading: false,
                GetAllResolutionStatus: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_ALL_RESOLUTION_STATUS_FAIL: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                GetAllResolutionStatus: null
            }
        }
        case actions.GET_RESOLUTIONS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_RESOLUTIONS_SUCCESS: {
            return {
                ...state,
                Loading: false,
                GetResolutions: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_RESOLUTIONS_FAIL: {
            return {
                ...state,
                Loading: false,
                GetResolutions: null,
                ResponseMessage: action.message
            }
        }
        default: {
            return { ...state }
        }
    }
}
export default ResolutionReducer