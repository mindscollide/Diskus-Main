/**
 * @file ManageAuthorityReducer.js
 * @description Redux reducer for the `ManageAuthority` slice. Controls the
 * visibility of authority-management modals: delete confirmation and
 * add/edit/view authority modal.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                 - Global loading flag.
 * @property {string}  ResponseMessage         - Last API response message.
 * @property {boolean} deleteAuthorityModal    - `true` when the delete-authority modal is open.
 * @property {boolean} addEditViewAuthorityModal - `true` when the add/edit/view authority modal is open.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  deleteAuthorityModal: false,
  addEditViewAuthorityModal: false,
};

/**
 * Reducer for the `ManageAuthority` slice.
 * Toggles authority modal visibility states.
 *
 * @param {object} state  - Current authority modal state.
 * @param {{ type: string, response?: boolean }} action - Dispatched action.
 * @returns {object} Next state.
 */
const ManageAuthorityReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.DELETE_AUTHORITY_MODAL: {
      return {
        ...state,
        deleteAuthorityModal: action.response,
      };
    }
    case actions.ADD_EDIT_VIEW_AUTHORITY_MODAL: {
      return {
        ...state,
        addEditViewAuthorityModal: action.response,
      };
    }

    default:
      return { ...state };
  }
};

export default ManageAuthorityReducer;
