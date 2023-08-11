import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  GetAllCommitteesByUserIDResponse: null,
  CreateCommitteeResponse: null,
  getCommitteeByCommitteeID: null,
  getCommitteeTypes: null,
  getCommitteeMembersRoles: null,
  updateCommitteeStatus: null,
  updateCommitteeResponse: null,
  realtimeCommitteeCreateResponse: null,
  realtimeCommitteeStatus: null,
  ArcheivedCommittees: null
};

const ComitteeGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_COMMITTEES_BY_USERID_INIT: {
      return {
        ...state,
        Loading: true,
        GetAllCommitteesByUserIDResponse: null,
      };
    }

    case actions.GET_ALL_COMMITTEES_BY_USERID_SUCCESS: {

      return {
        ...state,
        Loading: false,
        GetAllCommitteesByUserIDResponse: action.response,
        ResponseMessage: action.message
      };
    }

    case actions.GET_ALL_COMMITTEES_BY_USERID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAllCommitteesByUserIDResponse: null,
        ResponseMessage: action.message
      };
    }
    case actions.GET_COMMITTEE_BYCOMMITTEEID_INIT: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.message
      }
    }
    case actions.GET_COMMITTEE_BYCOMMITTEEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCommitteeByCommitteeID: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GET_COMMITTEE_BYCOMMITTEEID_FAIL: {
      return {
        ...state,
        Loading: false,
        getCommitteeByCommitteeID: null,
        ResponseMessage: action.message
      }
    }
    case actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    case actions.CREATE_COMMITTEE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CREATE_COMMITTEE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CreateCommitteeResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_COMMITTEE_FAIL: {
      return {
        ...state,
        Loading: false,
        CreateCommitteeResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_COMMITTEE_TYPES_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.GET_ALL_COMMITTEE_TYPES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCommitteeTypes: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GET_ALL_COMMITTEE_TYPES_FAIL: {
      return {
        ...state,
        Loading: false,
        getCommitteeTypes: null,
        ResponseMessage: action.message
      }
    }
    case actions.GET_COMMITTEE_MEMBERS_ROLES_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.GET_COMMITTEE_MEMBERS_ROLES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCommitteeMembersRoles: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.GET_COMMITTEE_MEMBERS_ROLES_FAIL: {
      return {
        ...state,
        Loading: false,
        getCommitteeMembersRoles: null,
        ResponseMessage: action.message
      }
    }
    case actions.UPDATE_COMMITTEE_STATUS_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.UPDATE_COMMITTEE_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateCommitteeStatus: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.UPDATE_COMMITTEE_STATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        updateCommitteeStatus: null,
        ResponseMessage: action.message
      }
    }
    case actions.UPDATE_COMMITTEE_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.UPDATE_COMMITTEE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateCommitteeResponse: action.response,
        ResponseMessage: action.message
      }
    }
    case actions.UPDATE_COMMITTEE_FAIL: {
      return {
        ...state,
        Loading: false,
        updateCommitteeResponse: null,
        ResponseMessage: action.message
      }
    }
    case actions.REALTIME_COMMITTEES_RESPONSE: {
      return {
        ...state,
        realtimeCommitteeCreateResponse: action.response,
      }
    }
    case actions.REALTIME_COMMITTEES_STATUS_RESPONSE: {
      return {
        ...state,
        realtimeCommitteeStatus: action.response
      }
    }
    case actions.COMMITTEE_GROUP_MAPPING_INIT: {
      return {
        ...state,
        Loading: true
      }
    }
    case actions.COMMITTEE_GROUP_MAPPING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message
      }
    }
    case actions.COMMITTEE_GROUP_MAPPING_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message
      }
    }
    case actions.ARCHEIVED_COMMITTES_INIT: {
      return {
        ...state,
        Loading: true,
        ArcheivedCommittees: null
      }
    }
    case actions.ARCHEIVED_COMMITTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ArcheivedCommittees: action.response,
        ResponseMessage: action.message
      }
    }
    // case actions.ARCHEIVED_COMMITTES_SUCCESS: {
    //   return {
    //     ...state,
    //     Loading: false,
    //     ArcheivedCommittees: [],
    //     ResponseMessage: action.message
    //   }

    // }
    case actions.ARCHEIVED_COMMITTES_FAIL: {
      return {
        ...state,
        Loading: false,
        ArcheivedCommittees: null,
        ResponseMessage: action.message
      }
    }
    default:
      return { ...state };
  }
};

export default ComitteeGroupsReducer;
