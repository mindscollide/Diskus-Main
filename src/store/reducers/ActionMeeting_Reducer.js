import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  todoListMeetingTask: [],
};

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

    default:
      return { ...state };
  }
};

export default actionMeetingReducer;
