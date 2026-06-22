import * as actions from "../action_types";

const initialState = {
  Loading: false,
  isAttachment: false,
  isMeetingAttachmentModal: false,
  isMinutes: false,
  MeetingAgendasResponse: [],
  MeetingAgendasMessage: "",
  MeetingAttachmentsResponse: [],
  MeetingAttachmentMessage: "",
  MeetingAgendaAttachmentResponse: "",
  MeetingAgendaAttachmentMessage: "",
  errorSeverity: null,
};

const VideoChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_MINUTES_STATE: {
      return {
        ...state,
        isMinutes: action.response,
      };
    }
    case actions.SHOW_ATTACHMENTS_STATE: {
      return {
        ...state,
        isAttachment: action.response,
      };
    }
    case actions.MEETINGATTACHMENT_MODAL: {
      return {
        ...state,
        isMeetingAttachmentModal: action.response,
      };
    }
    case actions.GET_MEETINGAGENDAS_INIT: {
      return {
        ...state,
        // Loading: true
      };
    }
    case actions.GET_MEETINGAGENDAS_SUCCESS: {
      return {
        ...state,
        MeetingAgendasResponse: action.response.meetingAgendaAttachments,
        MeetingAgendasMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.GET_MEETINGAGENDAS_FAIL: {
      return {
        ...state,
        MeetingAgendasMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.GET_ATTACHMENTSBYMEETINGID_INIT: {
      return {
        ...state,
        // Loading: true
      };
    }
    case actions.GET_ATTACHMENTSBYMEETINGID_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        MeetingAttachmentsResponse: action.response.meetingAgendaAttachments,
        MeetingAttachmentMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.GET_ATTACHMENTSBYMEETINGID_FAIL: {
      return {
        ...state,
        // Loading: false,
        MeetingAttachmentsResponse: [],
        MeetingAttachmentMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.AGENDA_ATTACHMENTUPDATE_INIT: {
      return {
        ...state,
        // Loading: true
      };
    }
    case actions.AGENDA_ATTACHMENTUPDATE_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        MeetingAgendaAttachmentResponse: action.response,
        MeetingAgendaAttachmentMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.AGENDA_ATTACHMENTUPDATE_FAIL: {
      return {
        ...state,
        // Loading: false,
        MeetingAgendaAttachmentMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.DOWNLOAD_CALL_RECORDING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DOWNLOAD_CALL_RECORDING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        errorSeverity: "success",
      };
    }

    default:
      return { ...state };
  }
};
export default VideoChatReducer;
