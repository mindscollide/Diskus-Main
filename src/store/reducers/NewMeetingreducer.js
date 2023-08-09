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

    default: {
      return { ...state };
    }
  }
};

export default NewMeetingreducer;
