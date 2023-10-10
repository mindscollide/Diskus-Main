import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  adduserModal: false,
  crossConfirmation: false,
  notifyOrganizors: false,
  agendaContributors: false,
  notifyAgendaContributors: false,
  participantModal: false,
  agendaItemRemoved: false,
  mainAgendaItemRemoved: false,
  advancePermissionModal: false,
  advancePermissionConfirmation: false,
  voteAgendaModal: false,
  voteConfirmationModal: false,
  importPreviousAgendaModal: false,
  enableProposedMeetingDate: false,
  prposedMeetingUnsavedModal: false,
  ImportPreviousMinutes: false,
  afterImportState: false,
  unsaveFileUploadMinutes: false,
  unsavedModalScratch: false,
  UnsavedButtonCreateScratch: false,
  unsavedModalImportAgenda: false,
  unsavedActions: false,
  removeTableModal: false,
  unsavedPollsMeeting: false,
  unsavedEditPollsMeeting: false,
  deleteMeetingModal: false,
  endMeetingModal: false,
  endForAllMeeting: false,
  sceduleproposedMeeting: false,
  viewVotesAgenda: false,
  castVoteAgendaPage: false,
  getALlMeetingTypes: [],
  meetingDetails: [],
  getAllReminderFrequency: [],
  recurring: [],
  searchMeetings: null,
  cancelModalMeetingDetails: false,
  cancelModalOrganizer: false,
  cancelAgendaContributor: false,
  cancelPartipants: false,
  cancelAgenda: false,
  cancelMeetingMaterial: false,
  cancelActions: false,
  cancelPolls: false,
  getAllCommitteeAndGroupPartcipants: [],
};

const NewMeetingreducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.NEW_MEETING_ADDUSER_MODAL: {
      return {
        ...state,
        adduserModal: action.response,
      };
    }
    case actions.CROSS_CONFIRMATION_MODAL: {
      return {
        ...state,
        crossConfirmation: action.response,
      };
    }

    case actions.NOTIFY_ORGANIZORS_MODAL: {
      return {
        ...state,
        notifyOrganizors: action.response,
      };
    }

    case actions.ADD_AGENDA_CONTRIBUTORS: {
      return {
        ...state,
        agendaContributors: action.response,
      };
    }

    case actions.NOTIFY_AGENDA_CONTRIBUTORS: {
      return {
        ...state,
        notifyAgendaContributors: action.response,
      };
    }

    case actions.ADD_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantModal: action.response,
      };
    }

    case actions.AGENDA_ITEM_REMOVED: {
      return {
        ...state,
        agendaItemRemoved: action.response,
      };
    }

    case actions.MAIN_AGENDA_ITEM_REMOVED: {
      return {
        ...state,
        mainAgendaItemRemoved: action.response,
      };
    }

    case actions.ADVANCED_PERSMISSION_MODAL: {
      return {
        ...state,
        advancePermissionModal: action.response,
      };
    }

    case actions.ADVANCE_PERMISSION_CONFIRMATION: {
      return {
        ...state,
        advancePermissionConfirmation: action.response,
      };
    }

    case actions.VOTE_AGENDA_MODAL: {
      return {
        ...state,
        voteAgendaModal: action.response,
      };
    }

    case actions.VOTE_MODAL_CONFIRMATION: {
      return {
        ...state,
        voteConfirmationModal: action.response,
      };
    }

    case actions.IMPORT_PREVIOUS_AGENDA: {
      return {
        ...state,
        importPreviousAgendaModal: action.response,
      };
    }

    case actions.ENABLE_PROPOSED_MEETING_DATE: {
      return {
        ...state,
        enableProposedMeetingDate: action.response,
      };
    }

    case actions.PROPOSED_MEETING_SAVED_MODAL: {
      return {
        ...state,
        prposedMeetingUnsavedModal: action.response,
      };
    }

    case actions.IMPORT_PREVIOUS_MINUTES: {
      return {
        ...state,
        ImportPreviousMinutes: action.response,
      };
    }

    case actions.AFTER_IMPORT_STATE: {
      return {
        ...state,
        afterImportState: action.response,
      };
    }

    case actions.UNSAVE_MINUTES_FILEUPLOAD: {
      return {
        ...state,
        unsaveFileUploadMinutes: action.response,
      };
    }

    case actions.UNSAVED_CREATE_FROM_SCRATCH: {
      return {
        ...state,
        unsavedModalScratch: action.response,
      };
    }

    case actions.UNSAVED_BUTTON_CREATE_SCRATCH: {
      return {
        ...state,
        UnsavedButtonCreateScratch: action.response,
      };
    }

    case actions.UNSAVED_IMPORT_AGENDA: {
      return {
        ...state,
        unsavedModalImportAgenda: action.response,
      };
    }

    case actions.UNSAVED_MODAL_ACTIONS: {
      return {
        ...state,
        unsavedActions: action.response,
      };
    }

    case actions.REMOVED_TABLE_MODAL: {
      return {
        ...state,
        removeTableModal: action.response,
      };
    }

    case actions.UNSAVED_POLLS_MEETING: {
      return {
        ...state,
        unsavedPollsMeeting: action.response,
      };
    }

    case actions.UNSAVED_EDIT_POLL_MEETING: {
      return {
        ...state,
        unsavedEditPollsMeeting: action.response,
      };
    }

    case actions.DELETE_MEETING_MODAL: {
      return {
        ...state,
        deleteMeetingModal: action.response,
      };
    }

    case actions.END_MEETING_MODAL: {
      return {
        ...state,
        endMeetingModal: action.response,
      };
    }

    case actions.END_MEETING_FOR_ALL: {
      return {
        ...state,
        endForAllMeeting: action.response,
      };
    }

    case actions.SCEDULE_PROPOSED_MEETING: {
      return {
        ...state,
        sceduleproposedMeeting: action.response,
      };
    }

    case actions.VIEW_VOTE_AGENDA: {
      return {
        ...state,
        viewVotesAgenda: action.response,
      };
    }

    case actions.CAST_VOTE_AGENDA: {
      return {
        ...state,
        castVoteAgendaPage: action.response,
      };
    }
    // searchMeetings
    case actions.GET_SEARCH_NEW_MEETINGS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_SEARCH_NEW_MEETINGS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        searchMeetings: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_SEARCH_NEW_MEETINGS_FAIL: {
      return {
        ...state,
        Loading: false,
        searchMeetings: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_NEWMEETINGSTATE: {
      return {
        ...state,
        searchMeetings: null,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getALlMeetingTypes: action.response,
      };
    }

    case actions.GET_ALL_MEETING_TYPES_NEW_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_DETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_MEETING_DETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        meetingDetails: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MEETING_DETAILS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllReminderFrequency: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_REMINDER_FREQUENCY_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_RECURRING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_RECURRING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        recurring: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_RECURRING_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.CANCEL_BUTTON_MODAL_MEETING_DETIALS_TAB: {
      return {
        ...state,
        cancelModalMeetingDetails: action.response,
      };
    }

    case actions.CANCEL_BUTTON_MODAL_ORGANIZER: {
      return {
        ...state,
        cancelModalOrganizer: action.response,
      };
    }

    case actions.CANCEL_AGENDA_CONTRIBUTOR: {
      return {
        ...state,
        cancelAgendaContributor: action.response,
      };
    }

    case actions.CANCEL_PARTICIPANTS: {
      return {
        ...state,
        cancelPartipants: action.response,
      };
    }

    case actions.CANCEL_AGENDA: {
      return {
        ...state,
        cancelAgenda: action.response,
      };
    }

    case actions.CANCEL_MEETING_MATERIAL: {
      return {
        ...state,
        cancelMeetingMaterial: action.response,
      };
    }

    case actions.CANCEL_ACTIONS: {
      return {
        ...state,
        cancelActions: action.response,
      };
    }

    case actions.CANCEL_POLLS: {
      return {
        ...state,
        cancelPolls: action.response,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllCommitteeAndGroupPartcipants: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.ADD_MORE_PARTICIPANTS_MODAL_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    default: {
      return { ...state };
    }
  }
};

export default NewMeetingreducer;
