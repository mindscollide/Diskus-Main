/**
 * @file OnBoardModalStates.js
 * @description Redux reducer for the `onBoardModal` slice. Manages the
 * multi-step on-boarding modal UI state: visibility, active step, and
 * which tab (Details / Agenda / Attendees) is currently shown.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} show        - Whether the on-boarding modal is visible.
 * @property {boolean} isDetails   - Whether the Details tab is active.
 * @property {boolean} isAgenda    - Whether the Agenda tab is active.
 * @property {boolean} isAttendees - Whether the Attendees tab is active.
 * @property {boolean} modalSteps  - Current step state of the modal wizard.
 * @property {boolean} Loader      - Loading indicator for URL/route checks.
 */
const initialState = {
  show: false,
  isDetails: true,
  isAgenda: false,
  isAttendees: false,
  modalSteps: false,
  Loader: false,
};
/**
 * Reducer for the `onBoardModal` slice.
 * Controls visibility and active-step/tab state of the on-boarding modal.
 *
 * @param {object} state  - Current onBoardModal state.
 * @param {{ type: string, response?: * }} action - Dispatched action.
 * @returns {object} Next state.
 */
const OnBoardModalStates = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEPS_MODAL_STATE: {
      return {
        ...state,
        modalSteps: action.response,
      };
    }
    case actions.SHOW_MODAL_STATE: {
      return {
        ...state,
        show: action.response,
      };
    }
    case actions.ISDETAIL_MODAL_STATE: {
      return {
        ...state,
        isDetails: action.response,
      };
    }
    case actions.ISAGENDA_MODAL_STATE: {
      return {
        ...state,
        isAgenda: action.response,
      };
    }
    case actions.ISATTENDEES_MODAL_STATE: {
      return {
        ...state,
        isAttendees: action.response,
      };
    }
    case actions.CURRENT_URL_CHECK: {
      return {
        ...state,
        Loader: action.response,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default OnBoardModalStates;
