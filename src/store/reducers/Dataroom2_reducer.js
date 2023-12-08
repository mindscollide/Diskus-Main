import * as actions from "../action_types";
const initialState = {
  Loading: false,
  ResponseMessage: "",
  DatafileandFolderDetails: null,
  updateFileAndFolderDetails: null,
  getDataAnalyticsDetails: null,
  getDataAnalyticsCountDetails: [],
};

const DataRoomFileAndFoldersDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
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
    default: {
      return {
        ...state,
      };
    }
  }
};

export default DataRoomFileAndFoldersDetailsReducer;
