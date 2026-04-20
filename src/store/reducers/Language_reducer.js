/**
 * @file Language_reducer.js
 * @description Redux reducer for the `language` slice. Manages fetching
 * all supported languages and setting/getting the user's selected language.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading          - Pending request flag.
 * @property {string}  ResponseMessage  - Last response message.
 * @property {Array}   AllLanguagesData - All supported language options.
 * @property {Array}   SetLanguageData  - Currently selected language preference.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  AllLanguagesData: [],
  SetLanguageData: [],
};

/**
 * Reducer for the `language` slice.
 * Handles fetching available languages and getting/setting the user's language preference.
 *
 * @param {object} state  - Current language state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const LanguageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_LANGUAGES_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_LANGUAGES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AllLanguagesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_LANGUAGES_FAIL: {
      return {
        ...state,
        Loading: false,
        AllLanguagesData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.SET_SELECTED_LANGUAGE_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_SELECTED_LANGUAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SET_SELECTED_LANGUAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_SELECTED_LANGUAGE_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_SELECTED_LANGUAGE_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        SetLanguageData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_SELECTED_LANGUAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        SetLanguageData: [],
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default LanguageReducer;
