/**
 * @file ActionMeeting_Reducer.js
 * @description Redux reducer for the `actionMeeting` slice. Manages meeting
 * task/action items: fetching the to-do task list, uploading action documents,
 * mapping tasks to agenda items, and removing task-agenda mappings.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading               - Global loading flag.
 * @property {string}      ResponseMessage       - Last API response message.
 * @property {object|null} todoListMeetingTask   - Task list data for the active meeting.
 * @property {object|null} uploadActionDocument  - Result of the action-document upload.
 * @property {object|null} mapTaskMeetingAgenda  - Result of mapping a task to an agenda item.
 * @property {object|null} removeTaskMapping     - Result of removing a task-agenda mapping.
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  todoListMeetingTask: null,
  uploadActionDocument: null,
  mapTaskMeetingAgenda: null,
  removeTaskMapping: null,
};

/**
 * Reducer for the `actionMeeting` slice.
 * Handles meeting action/task CRUD and document upload lifecycle.
 *
 * @param {object} state  - Current action-meeting state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const actionMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MEETING_TASKS_ACTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_MEETING_TASKS_ACTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        todoListMeetingTask: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MEETING_TASKS_ACTION_FAIL: {
      return {
        ...state,
        Loading: false,
        todoListMeetingTask: [],
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_SUCCESS: {
      return {
        ...state,
        Loading: true,
        uploadActionDocument: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_ACTION_FAIL: {
      return {
        ...state,
        Loading: false,
        uploadActionDocument: null,
        ResponseMessage: action.message,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        mapTaskMeetingAgenda: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MAP_TASK_MEETING_AGENDA_FAIL: {
      return {
        ...state,
        Loading: false,
        mapTaskMeetingAgenda: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        removeTaskMapping: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.REMOVE_TASK_MEETING_MAP_FAIL: {
      return {
        ...state,
        Loading: false,
        removeTaskMapping: null,
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default actionMeetingReducer;
