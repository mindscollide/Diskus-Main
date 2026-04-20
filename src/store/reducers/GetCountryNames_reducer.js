/**
 * @file GetCountryNames_reducer.js
 * @description Redux reducer for the `countryNames` slice. Fetches and
 * stores the list of country names used in registration and profile forms.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading          - Pending request flag.
 * @property {Array}   CountryNamesData - List of country name objects from the API.
 * @property {string}  ResponseMessage  - Last response message.
 */
const initialState = {
  Loading: false,
  CountryNamesData: [],
  ResponseMessage: "",
};

/**
 * Reducer for the `countryNames` slice.
 * Handles fetching and storing country name data.
 *
 * @param {object} state  - Current countryNames state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const countryNamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.COUNTRYNAMES_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.COUNTRYNAMES_SUCCESS:
      return {
        ...state,
        Loading: false,
        CountryNamesData: action.response,
        ResponseMessage: action.message,
      };
    case actions.COUNTRYNAMES_FAIL:
      return {
        ...state,
        Loading: false,
        CountryNamesData: [],
        ResponseMessage: action.message,
      };
    default:
      return { ...state };
  }
};
export default countryNamesReducer;
