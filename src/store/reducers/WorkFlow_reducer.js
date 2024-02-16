import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  createSignatureResponse: null,
};

const SignatureWorkflowReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATESIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATESIGNATUREFLOW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        createSignatureResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATESIGNATUREFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        createSignatureResponse: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};

export default SignatureWorkflowReducer;
