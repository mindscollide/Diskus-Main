/**
 * @file ManageAuthoriyAction.js
 * @description Lightweight Redux UI-state actions for showing and hiding the authority
 * add/edit/view and delete modals in the Compliance module. No API calls.
 * Dispatches: DELETE_AUTHORITY_MODAL, ADD_EDIT_VIEW_AUTHORITY_MODAL.
 */
import * as actions from "../action_types";

//Manage Authority
const showDeleteAuthorityModal = (response) => {
  return {
    type: actions.DELETE_AUTHORITY_MODAL,
    response: response,
  };
};

const showAddEditViewAuthorityModal = (response) => {
  return {
    type: actions.ADD_EDIT_VIEW_AUTHORITY_MODAL,
    response: response,
  };
};

export { showDeleteAuthorityModal, showAddEditViewAuthorityModal };
