/**
 * @file AgendaWiseAgendaReducer.js
 * @description Redux reducer for the `AgendaWiseAgendaList` slice. Manages the
 * agenda-grouped agenda list used in the meeting view — fetches all agenda items
 * organised by agenda heading for the active meeting.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} loading         - Loading flag for the API request.
 * @property {string}  responseMessage - Last API response message.
 * @property {Array}   AllAgendas      - Flat list of agenda-wise agenda items.
 */
const initialState = {
  loading: false,
  responseMessage: "",
  AllAgendas: [],
};

/**
 * Reducer for the `AgendaWiseAgendaList` slice.
 * Handles fetching the agenda-grouped agenda items for a meeting.
 *
 * @param {object} state  - Current state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const AgendaWiseAgendaListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_AGENDAWISE_AGENDA_INIT:
      return {
        ...state,
        loading: true,
      };

    case actions.GET_ALL_AGENDAWISE_AGENDA_SUCCESS:
      return {
        ...state,
        loading: false,
        AllAgendas: action.response,
        responseMessage: action.message,
      };

    case actions.GET_ALL_AGENDAWISE_AGENDA_FAILED:
      return {
        ...state,
        loading: false,
        AllAgendas: [],
        responseMessage: action.message,
      };

    default:
      return state;
  }
};

export default AgendaWiseAgendaListReducer;
