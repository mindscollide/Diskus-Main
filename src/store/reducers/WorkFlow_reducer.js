import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  createSignatureResponse: null,
  saveWorkFlowResponse: null,
  getWorkfFlowByFileId: null,
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
    case actions.SAVE_WORKFLOW_INT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_WORKFLOW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveWorkFlowResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_WORKFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        saveWorkFlowResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETWORKFLOWBYFILEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETWORKFLOWBYFILEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getWorkfFlowByFileId: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GETWORKFLOWBYFILEID_FAIL: {
      return {
        ...state,
        Loading: false,
        getWorkfFlowByFileId: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};

export default SignatureWorkflowReducer;
