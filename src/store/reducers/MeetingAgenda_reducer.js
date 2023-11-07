import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  MeetingAgendaVotingDetailsData: [],
  VotingResultDisplayData: [],
  SaveAgendaVotingData: [],
  AgendaVotingInfoData: [],
  CastAgendaVoteData: [],
  ViewAgendaVotingResultData: [],
  GetAdvanceMeetingAgendabyMeetingIDData: [],
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

    case actions.GET_AGENDAVOTINGINFO_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_AGENDAVOTINGINFO_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AgendaVotingInfoData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_AGENDAVOTINGINFO_FAIL: {
      return {
        ...state,
        Loading: false,
        AgendaVotingInfoData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_RESPONSEMESSAGE_AGENDAMEETING: {
      return {
        ...state,
        ResponseMessage: action.message,
      };
    }

    case actions.CASTEVOTEFORAGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CASTEVOTEFORAGENDA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CastAgendaVoteData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CASTEVOTEFORAGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        CastAgendaVoteData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_RESPONSEMESSAGE_AGENDAMEETING: {
      return {
        ...state,
        ResponseMessage: action.message,
      };
    }

    case actions.VIEW_AGENDAVOTINGRESULTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.VIEW_AGENDAVOTINGRESULTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ViewAgendaVotingResultData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VIEW_AGENDAVOTINGRESULTS_FAIL: {
      return {
        ...state,
        Loading: false,
        ViewAgendaVotingResultData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_SUCCESS: {
      console.log(action, "getAdvanceMeetingAgendabyMeetingID_success");

      return {
        ...state,
        Loading: false,
        GetAdvanceMeetingAgendabyMeetingIDData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAdvanceMeetingAgendabyMeetingIDData: [],
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default MeetingAgendaReducer;
