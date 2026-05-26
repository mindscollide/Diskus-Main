import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  errorSeverity: null,
  xfdfData: "",
  attachmentBlob: "",
  isHTML: false
};

const webViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_MESSAGE_CLEARE: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
        errorSeverity: null,
      };
    }
    case actions.CLEAR_RESPONSE_MESSAGE_WEBVIEWER: {
      return {
        ...state,
        ResponseMessage: "",
        errorSeverity: null,
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        xfdfData: action.xfdfData,
        attachmentBlob: action.attachmentBlob,
        ResponseMessage: action.meessage,
        errorSeverity: "success",
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.ADDANNOTATIONSONTODOATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADDANNOTATIONSONTODOATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "success",
      };
    }
    case actions.ADDANNOTATIONSONTODOATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.GETANNOTATIONSOFNOTESATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETANNOTATIONSOFNOTESATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        xfdfData: action.xfdfData,
        attachmentBlob: action.attachmentBlob,
        ResponseMessage: action.meessage,
        errorSeverity: "success",
      };
    }
    case actions.GETANNOTATIONSOFNOTESATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.ADDANNOTATIONSOFNOTESATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADDANNOTATIONSOFNOTESATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "success",
      };
    }
    case actions.ADDANNOTATIONSOFNOTESATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        xfdfData: action.xfdfData,
        attachmentBlob: action.attachmentBlob,
        ResponseMessage: action.meessage,
        errorSeverity: "success",
      };
    }
    case actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "success",
      };
    }
    case actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
        errorSeverity: "error",
      };
    }
    case actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }
    case actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    case actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        xfdfData: action.xfdfData,
        attachmentBlob: action.attachmentBlob,
        ResponseMessage: "",
        isHTML: action.checking
      };
    }
    case actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }
    default:
      return { ...state };
  }
};

export default webViewerReducer;
