import * as actions from "../action_types";

const initialState = {
  Loader: false,
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

    default: {
      return { ...state };
    }
  }
};

export default NewMeetingreducer;
