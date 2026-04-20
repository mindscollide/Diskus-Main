/**
 * @file GetTodosStatus_reducer.js
 * @description Redux reducer for the `todosStatus` slice. Manages fetching
 * available to-do status options and updating the status of individual tasks.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean} Loading                - Pending request flag.
 * @property {Array}   Response               - List of available to-do status options.
 * @property {string}  ResponseMessage        - Last response message.
 * @property {string}  UpdateTodoStatus       - Result of the last status update operation.
 * @property {string}  UpdateTodoStatusMessage - Message from the last status update.
 */
const initialState = {
  Loading: false,
  Response: [],
  ResponseMessage: "",
  UpdateTodoStatus: "",
  UpdateTodoStatusMessage: "",
};

/**
 * Reducer for the `todosStatus` slice.
 * Handles fetching to-do status options and updating individual task statuses.
 *
 * @param {object} state  - Current todosStatus state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const getTodosStatus = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_TODOSSTATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_TODOSSTATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        Response: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_TODOSSTATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        Response: [],
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_TODOSTATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_TODOSTATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateTodoStatusMessage: action.message,
      };
    }
    case actions.UPDATE_TODOSTATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateTodoStatusMessage: "",
      };
    }
    // case actions.POST_ASSIGNEEECOMMENTS_INIT: {
    //   return {
    //     ...state,
    //     Loading: true,
    //   };
    // }
    // case actions.POST_ASSIGNEEECOMMENTS_SUCCESS: {
    //
    //   return {
    //     ...state,
    //     Loading: false,
    //     ResponseMessage: action.response.responseMessage,
    //   };
    // }
    case actions.GET_CLEAREMESSAGE_GETTODO: {
      return {
        ...state,
        ResponseMessage: "",
        UpdateTodoStatusMessage: "",
        UpdateTodoStatus: "",
      };
    }

    // case actions.POST_ASSIGNEEECOMMENTS_FAIL: {
    //     return {
    //         ...state,
    //         Loading: false,
    //         ResponseMessage: action.response.responseMessage
    //     }
    // }
    default:
      return {
        ...state,
      };
  }
};

export default getTodosStatus;
