import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  SearchPolls: null,
  createPollmodal: false,
  editpollmodal: false,
  viewPollModal: false,
  isVotePollModal: false,
  viewPollProgress: false,
  viewVotesDetails: false,
  deletePollsModal: false,
  editPollModalFlag: false,
  viewVotes: null,
  SavePoll: null,
  deletedPolls: null,
  gellAllCommittesandGroups: null,
  pollOptions: [],
  Statuspolls: [],
  Allpolls: null,
  updatedPolls: null,
  realtimePollsUpdate: null,
  pollingSocket: null,
  getPollByCommitteeID: null,
  getPollByGroupID: null,
  setGroupsPolls: null,
  setCommitteePoll: null,
  todoGetGroupTask: null,
  setTodoGroupTask: null,
  getTodoCommitteeTask: null,
  setTodoCommitteeTask: null,
  deleteCommitteePolls: null,
  deleteGroupPolls: null,
  deleteMeetingPolls: null,
  newPollGroups: null,
  newPollCommittees: null,
  newPollMeeting: null,
  newPollDelete: null,
  validateEmailString: null,
};

const PollsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLEAR_POLLS_MESSAGES: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
      };
    }
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
        Loading: action.loader,
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

    case actions.VIEW_POLL_MODAL: {
      return {
        ...state,
        viewPollModal: action.response,
      };
    }

    case actions.DELETE_POLL_MODAL: {
      return {
        ...state,
        deletePollsModal: action.response,
      };
    }

    case actions.VOTE_POLL_MODAL: {
      return {
        ...state,
        isVotePollModal: action.response,
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
        Loading: false,
        pollOptions: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CAST_VOTE_FAIL: {
      return {
        ...state,
        Loading: false,
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

    case actions.VIEW_POLL_PROGRESS: {
      return {
        ...state,
        viewPollProgress: action.response,
      };
    }

    case actions.VIEW_VOTES_DETAILS: {
      return {
        ...state,
        viewVotesDetails: action.response,
      };
    }

    case actions.VIEW_VOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.VIEW_VOTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        viewVotes: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VIEW_VOTES_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_POLL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_POLL_SUCCESS: {
      return {
        ...state,
        deletedPolls: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_POLL_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.ALL_POLLINGS_SOCKET: {
      return {
        ...state,
        pollingSocket: action.response,
      };
    }
    case actions.GETPOLLSBYCOMMITEEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETPOLLSBYCOMMITEEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getPollByCommitteeID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPOLLSBYCOMMITEEID_FAIL: {
      return {
        ...state,
        Loading: false,
        getPollByCommitteeID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_POLLS_BY_GROUPID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_POLLS_BY_GROUPID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getPollByGroupID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_POLLS_BY_GROUPID_FAIL: {
      return {
        ...state,
        Loading: false,
        getPollByGroupID: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_GROUP_POLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_GROUP_POLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setGroupsPolls: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_GROUP_POLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        setGroupsPolls: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SETCOMMITTEEPOLL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SETCOMMITTEEPOLL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setCommitteePoll: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SETCOMMITTEEPOLL_FAIL: {
      return {
        ...state,
        Loading: false,
        setCommitteePoll: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_TASK_BY_GROUPID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_TASK_BY_GROUPID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        todoGetGroupTask: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_TASK_BY_GROUPID_FAIL: {
      return {
        ...state,
        Loading: false,
        todoGetGroupTask: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_TASK_GROUP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SET_TASK_GROUP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setTodoGroupTask: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SET_TASK_GROUP_FAIL: {
      return {
        ...state,
        Loading: false,
        setTodoGroupTask: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_TASK_BY_COMMITTEE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_TASK_BY_COMMITTEE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getTodoCommitteeTask: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_TASK_BY_COMMITTEE_FAIL: {
      return {
        ...state,
        Loading: false,
        getTodoCommitteeTask: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_TASK_COMMITTEE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SET_TASK_COMMITTEE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        setTodoCommitteeTask: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SET_TASK_COMMITTEE_FAIL: {
      return {
        ...state,
        Loading: false,
        setTodoCommitteeTask: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEMEETINGPOLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEMEETINGPOLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteMeetingPolls: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEMEETINGPOLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteMeetingPolls: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETECOMMITTEEPOLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETECOMMITTEEPOLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteCommitteePolls: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETECOMMITTEEPOLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteCommitteePolls: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEGROUPPOLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEGROUPPOLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteGroupPolls: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEGROUPPOLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteGroupPolls: null,
        ResponseMessage: action.message,
      };
    }
    case actions.POLL_CREATE_GROUP: {
      return {
        ...state,
        newPollGroups: action.response,
      };
    }
    case actions.POLL_CREATE_COMMITTEE: {
      return {
        ...state,
        newPollCommittees: action.response,
      };
    }
    case actions.POLL_CREATE_ADVANCED_MEETING: {
      return {
        ...state,
        newPollMeeting: action.response,
      };
    }
    case actions.DELETE_POLLS_MQTT: {
      console.log(action, "responseresponseresponse");

      return {
        ...state,
        newPollDelete: action.deleteData,
      };
    }
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        validateEmailString: action.response,
        responseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_FAIL: {
      return {
        ...state,
        Loading: false,
        validateEmailString: null,
        responseMessage: action.message,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default PollsReducer;
