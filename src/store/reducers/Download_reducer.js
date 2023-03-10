import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  downloadDocumentsList: [],
};

const downloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_DOWNLOAD_LOADER_START:
      return { ...state, Loading: true };

    case actions.GET_DOWNLOAD_FAIL:
      console.log("action", action);
      return {
        ...state,
        Loading: false,
        Fail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };

    case actions.SET_LOADER_FALSE_DOWNLOAD:
      return { ...state, Loading: false };

    case actions.SHOW:
      return { ...state, ShowNotification: true, Message: action.message };

    case actions.DOWNLOAD_DOCUMENT_FILE_SUCCESS:
      console.log("uploadedFile", action);
      return {
        ...state,
        Loading: false,
        isSuccess: true,
        uploadDocumentsList: action.response,
        isExecuted: action.isExecuted,
        responseMessage: action.response.responseMessage,
      };

    case actions.DOWNLOAD_DOCUMENT_FILE_FAIL:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
export default downloadReducer;
