import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  xfdfData: "",
  attachmentBlob: "",
};

const webViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_MESSAGE_CLEARE: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_SUCCESS: {
      console.log("blobToUint8Array", action);
      return {
        ...state,
        Loading: false,
        xfdfData: action.xfdfData,
        attachmentBlob: action.attachmentBlob,
        ResponseMessage: action.meessage,
      };
    }
    case actions.GETANNOTATIONSOFTODOATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
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
      };
    }
    case actions.ADDANNOTATIONSONTODOATTACHEMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.meessag,
      };
    }
    default:
      return { ...state };
  }
};

export default webViewerReducer;
