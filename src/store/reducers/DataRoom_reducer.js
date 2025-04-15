import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  SaveFilesResponse: null,
  UploadDocumentsResponse: [],
  SaveFolderResponse: null,
  getAllDocumentandShareFolderResponse: null,
  getFolderDocumentResponse: null,
  createFolderResponse: null,
  shareFilesResponse: null,
  shareFoldersResponse: null,
  DeleteFileResponse: null,
  DeleteFolderResponse: null,
  FolderisExistResponse: null,
  FileisExistResponse: null,
  RenameFolderResponse: null,
  RenameFileResponse: null,
  FolderisExistCheck: null,
  CreatedFoldersArray: [],
  SavefilesandfoldersResponse: null,
  TableSpinner: false,
  NotFound: 0,
  sortedData: [],
  dataBehaviour: false,
  isFolder: 0,
  folderUploadData: [],
  isFileExsist: null,
  SearchFilesAndFoldersResponse: [],
  SearchFileListCount: 0,
  RecentDocuments: null,
  getSharedFileUsers: null,
  getSharedFolderUsers: null,
  getCreateFolderLink: "",
  getCreateFileLink: "",
  checklinkresponse: null,
  updateAccess: null,
  updateGeneralAccess: null,
  updateFolderGeneralAccess: null,
  FolderisExistMessage: "",
  FileisExistMessage: "",
  Fail: false,
  FolderFail: false,
  fileDetials: false,
  userAvailabilityDataRoom: null,
  downloadMessage: 0,
  deleteSharedFile: null,
  deleteSharedFolder: null,
  FileSharedMQTT: null,
  FolderSharedMQTT: null,
  FileRemoveMQTT: null,
  FolderRemoveMQTT: null,
  BreadCrumbsList: [],
  fileSharePermissionData: null,
  meetingVideoRecording: null,
  videRecording: null,
};

const DataRoomReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MEETING_VIDEO_RECORDING_RECEIVED: {
      return {
        ...state,
        meetingVideoRecording: action.payload,
      };
    }
    case actions.VIDEO_RECORDING_RECEIVED: {
      return {
        ...state,
        videRecording: action.payload,
      };
    }
    case actions.DATAROOM_BREADCRUMBS: {
      const { payload } = action;

      return {
        ...state,
        BreadCrumbsList: payload,
      };
    }

    case actions.DATAROOM_DATA_BEHAVIOUR: {
      return {
        ...state,
        dataBehaviour: action.response,
      };
    }
    case actions.SAVEFILES_DATAROOM_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.SAVEFILES_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: true,
        SaveFilesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVEFILES_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveFilesResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_DOCUMENTS_DATAROOM_INIT: {
      return {
        ...state,
        Loading: false,
      };
    }
    case actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UploadDocumentsResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        UploadDocumentsResponse: [],
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_FOLDER_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_FOLDER_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_FOLDER_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveFolderResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getFolderDocumentResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        getFolderDocumentResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_FOLDER_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATE_FOLDER_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        createFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_FOLDER_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        createFolderResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllDocumentandShareFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllDocumentandShareFolderResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SHAREFILES_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SHAREFILES_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        shareFilesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SHAREFILES_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        shareFilesResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SHAREFOLDERS_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SHAREFOLDERS_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        shareFoldersResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SHAREFOLDERS_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        shareFoldersResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEFILE_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEFILE_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        DeleteFileResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEFILE_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        DeleteFileResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.FILEISEXIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.FILEISEXIST_SUCCESS: {
      return {
        ...state,
        Loading: false,
        FileisExistResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.FILEISEXIST_FAIL: {
      return {
        ...state,
        Loading: false,
        FileisExistResponse: null,
        FileisExistMessage: action.message,
      };
    }
    case actions.FOLDERISEXIST_FAIL: {
      return {
        ...state,
        Loading: false,
        FolderisExistResponse: null,
        FolderisExistMessage: action.message,
      };
    }
    case actions.DELETEFOLDER_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETEFOLDER_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        DeleteFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETEFOLDER_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        DeleteFolderResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.RENAMEFOLDER_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.RENAMEFOLDER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        RenameFolderResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.RENAMEFOLDER_FAIL: {
      return {
        ...state,
        Loading: false,
        RenameFolderResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.RENAMEFILE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.RENAMEFILE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        RenameFileResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.RENAMEFILE_FAIL: {
      return {
        ...state,
        Loading: false,
        RenameFileResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DATAROOM_CLEAR_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
        FileisExistMessage: "",
        FolderisExistMessage: "",
      };
    }
    case actions.FOLDERISEXIST_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    // huzeifa
    case actions.FOLDERISEXIST_SUCCESS: {
      return {
        ...state,
        Loading: false,
        FolderisExistCheck: action.response,
      };
    }
    case actions.CREATE_FOLDER_SUCCESS: {
      let newData = [...state.CreatedFoldersArray];
      newData.push(action.response);
      return {
        ...state,
        Loading: false,
        CreatedFoldersArray: newData,
      };
    }
    case actions.CREATE_FOLDER_EMPTY: {
      return {
        ...state,
        CreatedFoldersArray: [],
      };
    }
    case actions.SAVEFILESANDFOLDERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveFilesAndFoldersResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVEFILESANDFOLDERS_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveFilesAndFoldersResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DATAROOM_TABLE_SCROLL_BAR: {
      return {
        ...state,
        TableSpinner: action.response,
        NotFound: action.value,
      };
    }

    case actions.ISFOLDER: {
      return {
        ...state,
        isFolder: action.response,
      };
    }
    case actions.FOLDER_UPLOAD_DATA: {
      let newData = [...state.folderUploadData];
      newData.push(action.response);
      return {
        ...state,
        folderUploadData: newData,
      };
    }
    case actions.REMOVE_FOLDER_UPLOAD_DATA: {
      return {
        ...state,
        folderUploadData: action.response,
      };
    }
    case actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SearchFilesAndFoldersResponse: action.response,
        SearchFileListCount: action.fileCount,
        ResponseMessage: action.message,
      };
    }
    case actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_FAIL: {
      return {
        ...state,
        Loading: false,
        SearchFilesAndFoldersResponse: [],
        SearchFileListCount: 0,
        ResponseMessage: action.message,
      };
    }
    case actions.ISFILEISEXIST: {
      return {
        ...state,
        isFileExsist: action.response,
      };
    }
    case actions.GET_RECENT_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_RECENT_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        RecentDocuments: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_RECENT_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        RecentDocuments: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFILE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFILE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSharedFileUsers: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFILE_FAIL: {
      return {
        ...state,
        Loading: false,
        getSharedFileUsers: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFOLDER_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFOLDER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSharedFolderUsers: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETUSERSAGAINSTSHAREDFOLDER_FAIL: {
      return {
        ...state,
        Loading: false,
        getSharedFolderUsers: null,
        ResponseMessage: action.message,
      };
    }
    // getCreateFolderLink: null,
    // getCreateFileLink: null,
    case actions.CREATEFILELINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATEFILELINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCreateFileLink: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATEFILELINK_FAIL: {
      return {
        ...state,
        Loading: false,
        getCreateFileLink: "",
        ResponseMessage: action.message,
      };
    }
    case actions.CREATEFOLDERLINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATEFOLDERLINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getCreateFolderLink: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATEFOLDERLINK_FAIL: {
      return {
        ...state,
        Loading: false,
        getCreateFolderLink: "",
        ResponseMessage: action.message,
      };
    }

    case actions.CHECKLINKFILE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CHECKLINKFILE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        checklinkresponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CHECKLINKFILE_FAIL: {
      return {
        ...state,
        Loading: false,
        checklinkresponse: null,
        ReResponseMessage: action.message,
      };
    }

    case actions.REQUESTACCESS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.REQUESTACCESS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }
    case actions.REQUESTACCESS_FAIL: {
      return {
        ...state,
        Loading: false,
        updateAccess: null,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATEGENERALACCESS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEGENERALACCESS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateGeneralAccess: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATEGENERALACCESS_FAIL: {
      return {
        ...state,
        Loading: false,
        updateGeneralAccess: null,
        ResponseMessage: action.message,
      };
    }

    case actions.UPDATEFOLDERGENERALACCESS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEFOLDERGENERALACCESS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateFolderGeneralAccess: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATEFOLDERGENERALACCESS_FAIL: {
      return {
        ...state,
        Loading: false,
        updateFolderGeneralAccess: null,
        ResponseMessage: action.message,
      };
    }

    case actions.DATA_ROOM_FILE_DOWNLOAD: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DATA_ROOM_FILE_DOWNLOAD_LOADER_FALSED: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.DATA_ROOM_FILE_DOWNLOAD_FAILED: {
      return {
        ...state,
        Loading: false,
        Fail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };
    }

    case actions.DATA_ROOM_FOLDER_DOWNLOAD: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DATA_ROOM_FOLDER_DOWNLOAD_LOADER_FALSE: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.DATA_ROOM_FOLDER_DOWNLOAD_FAILED: {
      return {
        ...state,
        Loading: false,
        FolderFail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };
    }

    case actions.FILE_DETAIL_MODAL: {
      return {
        ...state,
        fileDetials: action.response,
      };
    }

    //user Availibility For Data Room

    case actions.VALIDATE_EMPTY_STRING_DATAROOM_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.VALIDATE_EMPTY_STRING_DATAROOM_SUCCESS: {
      return {
        ...state,
        Loading: false,
        userAvailabilityDataRoom: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VALIDATE_EMPTY_STRING_DATAROOM_FAILED: {
      return {
        ...state,
        Loading: false,
        userAvailabilityDataRoom: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DOWNLOAD_MESSAGE: {
      return {
        ...state,
        downloadMessage: action.payload,
      };
    }
    case actions.DELETE_SHARED_FILE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_SHARED_FILE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteSharedFile: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETE_SHARED_FILE_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteSharedFile: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETE_SHARED_FOLDER_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_SHARED_FOLDER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteSharedFolder: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETE_SHARED_FOLDER_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteSharedFolder: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DATAROOM_FILE_SHARED_MQTT: {
      return {
        ...state,
        FileSharedMQTT: action.response,
      };
    }
    case actions.DATAROOM_FOLDER_SHARED_MQTT: {
      return {
        ...state,
        FolderSharedMQTT: action.response,
      };
    }
    case actions.DATAROOM_FILE_REMOVE_MQTT: {
      return {
        ...state,
        FileRemoveMQTT: action.response,
      };
    }
    case actions.DATAROOM_FOLDER_REMOVE_MQTT: {
      return {
        ...state,
        FolderRemoveMQTT: action.response,
      };
    }

    case actions.DATAROOM_FILE_SHARED_PERMISSION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DATAROOM_FILE_SHARED_PERMISSION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        fileSharePermissionData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DATAROOM_FILE_SHARED_PERMISSION_FAILED: {
      return {
        ...state,
        Loading: false,
        fileSharePermissionData: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};
export default DataRoomReducer;
