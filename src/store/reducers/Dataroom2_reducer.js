/**
 * @file Dataroom2_reducer.js
 * @description Redux reducer for the `DataRoomFileAndFoldersDetails` slice.
 * Manages Data Room file/folder detail lookups: validating encrypted share
 * links, retrieving file and folder records, fetching data-analytics summaries,
 * and document/folder preview state.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading                      - Loading flag for API requests.
 * @property {string}      ResponseMessage              - Last API response message.
 * @property {object|null} DatafileandFolderDetails     - File or folder detail data.
 * @property {object|null} updateFileAndFolderDetails   - Updated file/folder details.
 * @property {object|null} getDataAnalyticsDetails      - Data analytics detail records.
 * @property {Array}       getDataAnalyticsCountDetails - Data analytics count summaries.
 * @property {object|null} viewDocument                 - Document selected for preview.
 * @property {object|null} viewFolder                   - Folder selected for preview.
 * @property {string|null} errorSeverity                - Error severity level (`"error"` etc.).
 */
const initialState = {
  Loading: false,
  ResponseMessage: "",
  DatafileandFolderDetails: null,
  updateFileAndFolderDetails: null,
  getDataAnalyticsDetails: null,
  getDataAnalyticsCountDetails: [],
  viewDocument: null,
  viewFolder: null,
  errorSeverity: null, // Added errorSeverity to initialState
};

/**
 * Reducer for the `DataRoomFileAndFoldersDetails` slice.
 * Handles encrypted share-link validation, file/folder detail retrieval,
 * and data-analytics data.
 *
 * @param {object} state  - Current data-room-2 state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const DataRoomFileAndFoldersDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewDocument: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewDocument: null,
        errorSeverity: "error", // Added
      };
    }

    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewFolder: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewFolder: null,
        errorSeverity: "error", // Added
      };
    }
    case actions.GETFILESANDFOLDERS_DETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETFILESANDFOLDERS_DETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        DatafileandFolderDetails: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.GETFILESANDFOLDERS_DETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        DatafileandFolderDetails: null,
        errorSeverity: "error", // Added
      };
    }
    case actions.UPDATEANDOPENBYANDDESCRIPTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEANDOPENBYANDDESCRIPTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        updateFileAndFolderDetails: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.UPDATEANDOPENBYANDDESCRIPTION_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        updateFileAndFolderDetails: null,
        errorSeverity: "error", // Added
      };
    }
    case actions.GETDATAANALYTICS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETDATAANALYTICS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsDetails: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.GETDATAANALYTICS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsDetails: null,
        errorSeverity: "error", // Added
      };
    }
    case actions.GETDATAANALYTICSCOUNT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETDATAANALYTICSCOUNT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsCountDetails: action.response,
        errorSeverity: "success", // Added
      };
    }
    case actions.GETDATAANALYTICSCOUNT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsCountDetails: null,
        errorSeverity: "error", // Added
      };
    }
    case actions.CLEAR_DATAROOM2_RESPONSE_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
        errorSeverity: null, // Also clear errorSeverity
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default DataRoomFileAndFoldersDetailsReducer;