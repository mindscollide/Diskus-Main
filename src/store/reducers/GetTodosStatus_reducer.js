import * as actions from "../action_types";

const initialState = {
  Loading: false,
  Response: [],
  ResponseMessage: "",
  UpdateTodoStatus: "",
  UpdateTodoStatusMessage: "",
};

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
