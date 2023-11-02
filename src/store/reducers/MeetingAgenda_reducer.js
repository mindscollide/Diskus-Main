import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  MeetingAgendaVotingDetailsData: [],
  VotingResultDisplayData: [],
  SaveAgendaVotingData: [],
};

const MeetingAgendaReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_AGENDAVOTINGDETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_AGENDAVOTINGDETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaVotingDetailsData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_AGENDAVOTINGDETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaVotingDetailsData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALLVOTINGRESULTDISPLAY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALLVOTINGRESULTDISPLAY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        VotingResultDisplayData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALLVOTINGRESULTDISPLAY_FAIL: {
      return {
        ...state,
        Loading: false,
        VotingResultDisplayData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_AGENDA_VOTING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_AGENDA_VOTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveAgendaVotingData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_AGENDA_VOTING_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveAgendaVotingData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_RESPONSEMESSAGE_AGENDAMEETING: {
      return {
        ...state,
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default MeetingAgendaReducer;
