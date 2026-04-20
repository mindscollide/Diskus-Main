/**
 * @file Get_Faqs_reducer.js
 * @description Redux reducer for the `faqs` slice. Manages fetching and
 * storing the list of FAQ entries for display in the application.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading          - Pending request flag.
 * @property {boolean} ShowNotification - Whether a UI notification should be shown.
 * @property {boolean} Fail             - Whether the last request failed.
 * @property {string}  ResponseMessage  - Last response message.
 * @property {Array}   AllFAQsData      - List of FAQ objects returned by the API.
 */
const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  AllFAQsData: [],
};

/**
 * Reducer for the `faqs` slice.
 * Handles fetching and storing the full FAQ list.
 *
 * @param {object} state  - Current faqs state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const fAQsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADER_FALSE:
      return { ...state, Loading: false };

    case actions.SHOW:
      return { ...state, ShowNotification: true, Message: action.message };

    case actions.GET_FAQS_INIT:
      return { ...state, Loading: true };

    case actions.GET_FAQS_SUCCESS:
      let GetAllFAQsArray = action.response.listOfFAQs.map((item, index) => {
        return { ...item, key: index };
      });

      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        AllFAQsData: GetAllFAQsArray,
        ShowNotification: true,
      };

    case actions.GET_FAQS_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        AllFAQsData: [],
        ShowNotification: true,
      };

    default:
      return { ...state };
  }
};

export default fAQsReducer;
