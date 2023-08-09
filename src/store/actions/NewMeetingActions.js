import * as actions from "../action_types";

const showAddUserModal = (response) => {
  return {
    type: actions.NEW_MEETING_ADDUSER_MODAL,
    response: response,
  };
};

const showCrossConfirmationModal = (response) => {
  return {
    type: actions.CROSS_CONFIRMATION_MODAL,
    response: response,
  };
};

const showNotifyOrganizors = (response) => {
  return {
    type: actions.NOTIFY_ORGANIZORS_MODAL,
    response: response,
  };
};

const showAddAgendaContributor = (response) => {
  return {
    type: actions.ADD_AGENDA_CONTRIBUTORS,
    response: response,
  };
};

const showAgendaContributorsModals = (response) => {
  return {
    type: actions.NOTIFY_AGENDA_CONTRIBUTORS,
    response: response,
  };
};

const showAddParticipantsModal = (response) => {
  return {
    type: actions.ADD_PARTICIPANTS_MODAL,
    response: response,
  };
};

const showAgenItemsRemovedModal = (response) => {
  return {
    type: actions.AGENDA_ITEM_REMOVED,
    response: response,
  };
};

const showMainAgendaItemRemovedModal = (response) => {
  return {
    type: actions.MAIN_AGENDA_ITEM_REMOVED,
    response: response,
  };
};

export {
  showAddUserModal,
  showCrossConfirmationModal,
  showNotifyOrganizors,
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showAddParticipantsModal,
  showAgenItemsRemovedModal,
  showMainAgendaItemRemovedModal,
};
