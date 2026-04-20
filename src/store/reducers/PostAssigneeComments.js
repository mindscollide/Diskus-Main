/**
 * @file PostAssigneeComments.js
 * @description Redux reducer for the `postAssigneeComments` slice. Manages
 * posting, displaying, and deleting assignee comments on tasks, including
 * real-time MQTT comment delivery.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {string}      Response         - Raw response from the post-comment API.
 * @property {string}      ResponseMessage  - Last response message.
 * @property {boolean}     Loading          - Pending request flag.
 * @property {object|null} Comments         - Current comment payload received via MQTT.
 * @property {number}      createCommentID  - ID of the most recently created comment.
 * @property {object|null} DeleteCommentsId - ID of the comment most recently deleted.
 */
const initialState = {
  Response: "",
  ResponseMessage: "",
  Loading: false,
  Comments: null,
  createCommentID: 0,
  DeleteCommentsId: null,
};

/**
 * Reducer for the `postAssigneeComments` slice.
 * Handles posting, MQTT delivery, and deletion of task comments.
 *
 * @param {object} state  - Current postAssigneeComments state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const postAssigneeComments = (state = initialState, action) => {
  switch (action.type) {
    case actions.HIDE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    case actions.SET_LOADER_FALSE:
      return { ...state, Loading: false };

    case actions.POST_ASSIGNEEECOMMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.POST_ASSIGNEEECOMMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        createCommentID: action.response.commmentID,
        ResponseMessage: action.message,
      };
    }

    case actions.POST_ASSIGNEEECOMMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        createCommentID: 0,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
      };
    }
    case actions.POST_COMMENTS: {
      return {
        ...state,
        Loading: false,
        Comments: action.response,
      };
    }
    case actions.EMPTYCOMMENTSFROMMQTT: {
      return {
        ...state,
        Loading: false,
        Comments: null,
      };
    }
    case actions.DELETE_COMMENTS: {
      return {
        ...state,
        DeleteCommentsId: action.response,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default postAssigneeComments;
