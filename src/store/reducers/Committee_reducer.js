import * as actions from '../action_types';


const initialState = {
    Loading: false,
    ResponseMessage: "",
    getAllCommitteeGroupsData: [],
    AddCommitteeGroupResponse: null,
    getCommitteebyCommitteeId: null
}

const ComitteeGroupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_COMMITTEE_BYUSERID_INIT:
            return {
                ...state,
                Loading: true
            }
        case actions.GET_COMMITTEE_BYUSERID_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getAllCommitteeGroupsData: action.response,
                ResponseMessage: action.message,
            }
        }
        case actions.GET_COMMITTEE_BYUSERID_FAIL: {
            return {
                ...state,
                Loading: false,
                getAllCommitteeGroupsData: [],
                ResponseMessage: action.message,
            }
        }
        case actions.ADD_COMMITTEE_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.ADD_COMMITTEE_SUCCESS: {
            return {
                ...state,
                Loading: false,
                AddCommitteeGroupResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.ADD_COMMITTEE_FAIL: {
            return {
                ...state,
                Loading: false,
                AddCommitteeGroupResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.GET_COMMITTEE_BYCOMMITTEEID_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_COMMITTEE_BYCOMMITTEEID_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getCommitteebyCommitteeId: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_COMMITTEE_BYCOMMITTEEID_FAIL: {
            return {
                ...state,
                getCommitteebyCommitteeId: null,
                ResponseMessage: action.message
            }
        }
        case actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE: {
            return {
                ...state,
                ResponseMessage: ""
            }
        }
        default:
            return { ...state };
    }
}

export default ComitteeGroupsReducer;