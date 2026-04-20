/**
 * @file VideoChat_Reducer.js
 * @description Redux reducer for the `videoChat` slice. Manages in-meeting
 * panel visibility flags (minutes, attachments), meeting agendas,
 * meeting attachment metadata, and call-recording downloads.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                        - Pending request flag.
 * @property {boolean} isAttachment                   - Whether the attachments panel is open.
 * @property {boolean} isMeetingAttachmentModal        - Whether the meeting-attachment modal is open.
 * @property {boolean} isMinutes                      - Whether the minutes panel is open.
 * @property {Array}   MeetingAgendasResponse         - Fetched meeting agenda attachments.
 * @property {Array}   MeetingAttachmentsResponse     - Fetched meeting-level attachments.
 */
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
};

/**
 * Reducer for the `videoChat` slice.
 * Controls panel/modal visibility flags and manages meeting agenda
 * attachments and call-recording download state.
 *
 * @param {object} state  - Current videoChat state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
      };
    }
    case actions.GET_MEETINGAGENDAS_FAIL: {
      return {
        ...state,
        MeetingAgendasMessage: action.message,
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
      };
    }
    case actions.GET_ATTACHMENTSBYMEETINGID_FAIL: {
      return {
        ...state,
        // Loading: false,
        MeetingAttachmentsResponse: [],
        MeetingAttachmentMessage: action.message,
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
      };
    }
    case actions.AGENDA_ATTACHMENTUPDATE_FAIL: {
      return {
        ...state,
        // Loading: false,
        MeetingAgendaAttachmentMessage: action.message,
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
      };
    }

    default:
      return { ...state };
  }
};
export default VideoChatReducer;
