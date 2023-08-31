import * as actions from "../action_types";

const initialState = {
    Loading: false,
    ResponseMessage: "",
    SaveFilesResponse: null,
    UploadDocumentsResponse: [],
    SaveFolderResponse: null,
    getAllDocumentandShareFolderResponse: [],
    getFolderDocumentResponse: [],
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
    CreatedFolderID: 0,
    SavefilesandfoldersResponse: null,
    TableSpinner: false,
    NotFound: 0,
    sortedData: [],
    dataBehaviour: false
};

const DataRoomReducer = (state = initialState, action) => {
    switch (action.type) {

        case actions.DATAROOM_DATA_BEHAVIOUR: {
            return {
                ...state,
                dataBehaviour: action.response
            }
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
                Loading: false,
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
            console.log(action);
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
                getFolderDocumentResponse: [],
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
            let mergeData = [...state.getAllDocumentandShareFolderResponse]
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
                getAllDocumentandShareFolderResponse: [],
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
                ResponseMessage: action.message,
            };
        }
        case actions.FOLDERISEXIST_INIT: {
            return {
                ...state,
                Loading: true,
            };
        }

        case actions.FOLDERISEXIST_FAIL: {
            return {
                ...state,
                Loading: false,
                FolderisExistResponse: null,
                ResponseMessage: action.message,
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
        case actions.CLEARE_MESSAGE: {
            return {
                ...state,
                ResponseMessage: "",
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
            return {
                ...state,
                Loading: false,
                CreatedFolderID: action.response,
            };
        }
        case actions.SAVEFILESANDFOLDERS_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SAVEFILESANDFOLDERS_SUCCESS: {
            return {
                ...state,
                Loading: false,
                SaveFilesAndFoldersResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SAVEFILESANDFOLDERS_FAIL: {
            return {
                ...state,
                Loading: false,
                SaveFilesAndFoldersResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.DATAROOM_TABLE_SCROLL_BAR: {
            console.log(action, "sssasasasasas")
            return {
                ...state,
                TableSpinner: action.response,
                NotFound: action.value

            };
        }
        default:
            return { ...state };
    }
};
export default DataRoomReducer;
