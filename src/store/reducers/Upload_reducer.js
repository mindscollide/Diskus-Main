import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  uploadDocumentsList: null,
};

const uploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_UPLOAD_LOADER_START:
      return { ...state, Loading: true };

    case actions.GET_UPLOAD_FAIL:
      return {
        ...state,
        Loading: false,
        Fail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };

    case actions.SET_LOADER_FALSE_UPLOAD:
      return { ...state, Loading: false };

    case actions.SHOW:
      return {
        ...state,
        ShowNotification: true,
        // ResponseMessage: action.message,
      };

    case actions.UPLOAD_DOCUMNET_FILE_SUCCESS:
      return {
        ...state,
        Loading: action.loading,
        isSuccess: true,
        uploadDocumentsList: action.response,
        isExecuted: action.isExecuted,
        ResponseMessage: action.message,
      };

    case actions.UPLOAD_DOCUMNET_FILE_FAIL:
      return { ...state, Loading: false, ResponseMessage: action.message };

    case actions.RESET_ALL_FILES_UPLOAD:
      return {
        ...state,
        Loading: false,
        ShowNotification: false,
        Fail: false,
        ResponseMessage: "",
        uploadDocumentsList: [],
      };

    case actions.UPLOAD_RESPONSE_MESSAGE:
      return { ...state, ResponseMessage: "" };

    case actions.UPLOAD_DOCUMENT_LOADER:
      return {
        ...state,
        Loading: action.payload,
      };
    default:
      return { ...state };
  }
};
export default uploadReducer;
