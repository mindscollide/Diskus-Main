import * as actions from "../action_types";

const initialState = {
    Loading: false,
    ResponseMessage: "",
    SearchPolls: null,
    SavePoll: null,
    gellAllCommittesandGroups: null
}

const PollsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SEARCH_POLLS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SEARCH_POLLS_SUCCESS:
            {
                return {
                    ...state,
                    Loading: false,
                    ResponseMessage: action.message,
                    SearchPolls: action.response
                }
            }
        case actions.SEARCH_POLLS_FAIL: {
            return {
                ...state,
                Loading: false,
                ResponseMessage: action.message,
                SearchPolls: null
            }
        }
        case actions.SAVEPOLL_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SAVEPOLL_SUCCESS: {
            return {
                ...state,
                Loading: false,
                SavePoll: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SAVEPOLL_FAIL: {
            return {
                ...state,
                Loading: false,
                SavePoll: null,
                ResponseMessage: action.message
            }
        }
        case actions.GETALLCOMMITESANDGROUPSFORPOLLS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GETALLCOMMITESANDGROUPSFORPOLLS_SUCCESS: {
            return {
                ...state,
                Loading: false,
                gellAllCommittesandGroups: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GETALLCOMMITESANDGROUPSFORPOLLS_FAIL: {
            return {
                ...state,
                Loading: false,
                gellAllCommittesandGroups: null,
                ResponseMessage: action.message
            }
        }
        default:
            { return { ...state } }
    }
}

export default PollsReducer