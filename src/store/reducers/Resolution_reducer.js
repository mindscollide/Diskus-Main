import * as actions from "../action_types";


const initialState = {
    Loading: false,
    ResponseMessage: "",
    GetAllVotingMethods: null,
    GetAllResolutionStatus: null,
    GetResolutions: null,
    ScheduleResolution: null,
    UpdateResolution: null,
    getResolutionbyID: null,
    getResolutionResult: null,
    getVoteDetailsByID: null
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
        case actions.SCHEDULE_RESOLUTION_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SCHEDULE_RESOLUTION_SUCCESS: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                ScheduleResolution: action.response
            }
        }
        case actions.SCHEDULE_RESOLUTION_FAIL: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                ScheduleResolution: null
            }
        }
        case actions.ADD_UPDATE_DETAILS_RESOLUTION_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.ADD_UPDATE_DETAILS_RESOLUTION_SUCCESS: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                UpdateResolution: action.response
            }
        }
        case actions.ADD_UPDATE_DETAILS_RESOLUTION_FAIL: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                UpdateResolution: null
            }
        }
        case actions.GET_VOTESDETAILSBYID_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_VOTESDETAILSBYID_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getVoteDetailsByID: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_VOTESDETAILSBYID_FAIL: {
            return {
                ...state,
                Loading: false,
                getVoteDetailsByID: null,
                ResponseMessage: action.message
            }
        }
        case actions.GET_RESOLUTION_RESULTS_DETAILS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_RESOLUTION_RESULTS_DETAILS_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getResolutionResult: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_RESOLUTION_RESULTS_DETAILS_FAIL: {
            return {
                ...state,
                Loading: false,
                getResolutionResult: null,
                ResponseMessage: action.message
            }
        }

        case actions.GET_RESOLUTION_BY_RESOLUTION_ID_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_RESOLUTION_BY_RESOLUTION_ID_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getResolutionbyID: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_RESOLUTION_BY_RESOLUTION_ID_FAIL: {
            return {
                ...state,
                Loading: false,
                getResolutionbyID: null,
                ResponseMessage: action.message
            }
        }
        default: {
            return { ...state }
        }
    }
}
export default ResolutionReducer