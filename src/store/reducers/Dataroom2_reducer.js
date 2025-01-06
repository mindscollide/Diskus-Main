import * as actions from "../action_types";
const initialState = {
  Loading: false,
  ResponseMessage: "",
  DatafileandFolderDetails: null,
  updateFileAndFolderDetails: null,
  getDataAnalyticsDetails: null,
  getDataAnalyticsCountDetails: [],
  viewDocument: null,
  viewFolder: null,
};

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
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewDocument: null,
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
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        viewFolder: null,
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
      };
    }
    case actions.GETFILESANDFOLDERS_DETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        DatafileandFolderDetails: null,
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
      };
    }
    case actions.UPDATEANDOPENBYANDDESCRIPTION_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        updateFileAndFolderDetails: null,
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
      };
    }
    case actions.GETDATAANALYTICS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsDetails: null,
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
      };
    }
    case actions.GETDATAANALYTICSCOUNT_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getDataAnalyticsCountDetails: null,
      };
    }
    case actions.CLEAR_DATAROOM2_RESPONSE_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
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
