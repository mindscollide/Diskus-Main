import * as actions from "../action_types";

const initialState = {
  Response: "",
  ResponseMessage: "",
  Loading: false,
  Comments: [],
};

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
      console.log("POST_ASSIGNEEECOMMENTS_SUCCESS", action);
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.POST_ASSIGNEEECOMMENTS_FAIL: {
      console.log("POST_ASSIGNEEECOMMENTS_FAIL", action);
      return {
        ...state,
        Loading: false,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
      };
    }
    case actions.POST_COMMENTS: {
      console.log("POST_COMMENTS", action);
      return {
        ...state,
        Loading: false,
        Comments: action.response,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default postAssigneeComments;
