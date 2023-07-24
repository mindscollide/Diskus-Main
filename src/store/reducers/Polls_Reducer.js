import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  SearchPolls: null,
  createPollmodal: false,
  editpollmodal: false,
  editPollModalFlag: false,
  SavePoll: null,
  gellAllCommittesandGroups: null,
  pollOptions: [],
  Statuspolls: [],
  Allpolls: null,
  updatedPolls: null,
};

const PollsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SEARCH_POLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEARCH_POLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        SearchPolls: action.response,
      };
    }
    case actions.SEARCH_POLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        SearchPolls: null,
      };
    }
    case actions.SAVEPOLL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVEPOLL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SavePoll: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVEPOLL_FAIL: {
      return {
        ...state,
        Loading: false,
        SavePoll: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLCOMMITESANDGROUPSFORPOLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLCOMMITESANDGROUPSFORPOLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        gellAllCommittesandGroups: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLCOMMITESANDGROUPSFORPOLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        gellAllCommittesandGroups: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_POOL_MODAL: {
      return {
        ...state,
        createPollmodal: action.response,
      };
    }

    case actions.EDIT_POLL_MODAL: {
      return {
        ...state,
        editpollmodal: action.response,
      };
    }

    case actions.CAST_VOTE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CAST_VOTE_SUCCESS: {
      return {
        ...state,
        pollOptions: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CAST_VOTE_FAIL: {
      return {
        ...state,
        ResponseMessage: action.message,
      };
    }

    case actions.GLOBAL_FLAG: {
      return {
        ...state,
        editPollModalFlag: action.response,
      };
    }

    case actions.GET_ALL_POLL_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_POLL_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        Statuspolls: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_POLL_STATUS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_POLLS_BY_POLLID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_POLLS_BY_POLLID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        Allpolls: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_POLLS_BY_POLLID_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_POLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_POLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updatedPolls: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATE_POLLS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.LOADDER_STATE: {
      return {
        ...state,
        Loading: false,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default PollsReducer;
