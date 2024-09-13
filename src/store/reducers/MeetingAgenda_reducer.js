import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  MeetingAgendaVotingDetailsData: [],
  VotingResultDisplayData: [],
  SaveAgendaVotingData: [],
  AgendaVotingInfoData: [],
  CastAgendaVoteData: [],
  ViewAgendaVotingResultData: null,
  GetAdvanceMeetingAgendabyMeetingIDData: [],
  MeetingAgendaFolderID: 0,
  UploadDocumentsResponse: null,
  SaveFilesResponse: null,
  SaveMeetingFilesResponse: null,
  SaveDocumentsResponse: null,
  SaveUpdateAgendaData: [],
  GetCurrentAgendaDetails: [],
  PreviousTabAgenda: false,
  NextTabAgenda: false,
  GetAllMeetingForAgendaImportData: null,
  GetAgendaWithMeetingIDForImportData: null,
  MeetingAgendaStartedData: null,
  MeetingAgendaEndedData: null,
  MeetingAgendaUpdatedMqtt: null,
  PrintAgendaFlag: false,
  ExportAgendaFlag: false,
  AgendaViewFlag: 0,
  MeetingAgendaParticipants: [],
  SendAgendaAsPDFEmail: null,
  PrintCurrentAgenda: null,
  GetAdvanceMeetingAgendabyMeetingIDForViewData: null,
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
        // Loading: false,
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
        ViewAgendaVotingResultData: null,
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

    case actions.CREATEUPDATEMEETINGDATAROOMMAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATEUPDATEMEETINGDATAROOMMAP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaFolderID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATEUPDATEMEETINGDATAROOMMAP_FAIL: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaFolderID: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveUpdateAgendaData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveUpdateAgendaData: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVEFILES_AGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVEFILES_AGENDA_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        SaveFilesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVEFILES_AGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveFilesResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_DOCUMENTS_AGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPLOAD_DOCUMENTS_AGENDA_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        UploadDocumentsResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_DOCUMENTS_AGENDA_FAIL: {
      return {
        ...state,
        // Loading: false,
        UploadDocumentsResponse: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_DOCUMENTS_AGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_DOCUMENTS_AGENDA_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        SaveMeetingFilesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_DOCUMENTS_AGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveMeetingFilesResponse: null,
        ResponseMessage: action.message,
      };
    }

    case actions.START_END_AGENDAVOTING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.START_END_AGENDAVOTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }
    case actions.START_END_AGENDAVOTING_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_CURRENT_AGENDA_DETAILS: {
      return {
        ...state,
        GetCurrentAgendaDetails: action.response,
      };
    }

    case actions.SET_LOADER_FALSE_AGENDA: {
      return {
        ...state,
        Loading: action.response,
      };
    }

    case actions.PREVIOUS_TAB_AGENDA: {
      return {
        ...state,
        PreviousTabAgenda: action.response,
      };
    }

    case actions.NEXT_TAB_AGENDA: {
      return {
        ...state,
        NextTabAgenda: action.response,
      };
    }

    case actions.CLEAR_MEETING_AGENDA_REDUCER: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
        MeetingAgendaVotingDetailsData: [],
        VotingResultDisplayData: [],
        SaveAgendaVotingData: [],
        AgendaVotingInfoData: [],
        CastAgendaVoteData: [],
        ViewAgendaVotingResultData: null,
        GetAdvanceMeetingAgendabyMeetingIDData: [],
        MeetingAgendaFolderID: 0,
        UploadDocumentsResponse: null,
        SaveFilesResponse: null,
        SaveDocumentsResponse: null,
        SaveUpdateAgendaData: [],
        GetCurrentAgendaDetails: [],
        PreviousTabAgenda: false,
        NextTabAgenda: false,
      };
    }

    case actions.GET_ALLMEETINGFORAGENDAIMPORT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALLMEETINGFORAGENDAIMPORT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAllMeetingForAgendaImportData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALLMEETINGFORAGENDAIMPORT_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAllMeetingForAgendaImportData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_AGENDAWITHMEETINGIDFORIMPORT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_AGENDAWITHMEETINGIDFORIMPORT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAgendaWithMeetingIDForImportData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_AGENDAWITHMEETINGIDFORIMPORT_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAgendaWithMeetingIDForImportData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.MQTT_MEETING_AGENDA_VOTING_STARTED: {
      return {
        ...state,
        MeetingAgendaStartedData: action.response,
      };
    }

    case actions.MQTT_MEETING_AGENDA_VOTING_ENDED: {
      return {
        ...state,
        MeetingAgendaEndedData: action.response,
      };
    }

    case actions.MQTT_MEETING_AGENDA_UPDATED: {
      return {
        ...state,
        MeetingAgendaUpdatedMqtt: action.response,
      };
    }

    case actions.PRINT_AGENDA: {
      return {
        ...state,
        PrintAgendaFlag: action.response,
      };
    }

    case actions.EXPORT_AGENDA: {
      return {
        ...state,
        ExportAgendaFlag: action.response,
      };
    }

    case actions.AGENDA_VIEW_FLAG: {
      return {
        ...state,
        AgendaViewFlag: action.response,
      };
    }

    case actions.GET_GETMEETINGPARTICIPANTSAGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_GETMEETINGPARTICIPANTSAGENDA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaParticipants: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GETMEETINGPARTICIPANTSAGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        MeetingAgendaParticipants: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SEND_AGENDAPDFASEMAIL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEND_AGENDAPDFASEMAIL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SendAgendaAsPDFEmail: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SEND_AGENDAPDFASEMAIL_FAIL: {
      return {
        ...state,
        Loading: false,
        SendAgendaAsPDFEmail: null,
        ResponseMessage: action.message,
      };
    }

    case actions.PRINT_AGENDA_MEETING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.PRINT_AGENDA_MEETING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        PrintCurrentAgenda: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.PRINT_AGENDA_MEETING_FAIL: {
      return {
        ...state,
        Loading: false,
        PrintCurrentAgenda: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ADVANCEMEETINGAGENDAFORVIEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ADVANCEMEETINGAGENDAFORVIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAdvanceMeetingAgendabyMeetingIDForViewData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ADVANCEMEETINGAGENDAFORVIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAdvanceMeetingAgendabyMeetingIDForViewData: null,
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default MeetingAgendaReducer;
