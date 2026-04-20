/**
 * @file Upload_reducer.js
 * @description Redux reducer for the `upload` slice. Tracks the lifecycle of
 * document/file uploads — loading state, success notification flag, failure
 * flag, and the resulting list of uploaded documents.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading             - `true` while an upload is in progress.
 * @property {boolean}     ShowNotification    - `true` when the success notification should be shown.
 * @property {boolean}     Fail                - `true` when the upload failed.
 * @property {string}      ResponseMessage     - Last API response or error message.
 * @property {object|null} uploadDocumentsList - List of documents returned after upload.
 */
const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  uploadDocumentsList: null,
};

/**
 * Reducer for the `upload` slice.
 * Handles file/document upload request lifecycle.
 *
 * @param {object} state  - Current upload state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
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
