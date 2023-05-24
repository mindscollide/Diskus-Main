import * as actions from '../action_types'


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
    FolderisExistResponse: null,
    FileisExistResponse: null
}


const DataRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SAVEFILES_DATAROOM_INIT: {
            return {
                ...state,
                Loading: false
            }
        }
        case actions.SAVEFILES_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                SaveFilesResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SAVEFILES_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                SaveFilesResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.UPLOAD_DOCUMENTS_DATAROOM_INIT: {
            return {
                ...state,
                Loading: false
            }
        }
        case actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                UploadDocumentsResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                UploadDocumentsResponse: [],
                ResponseMessage: action.message
            }
        }
        case actions.SAVE_FOLDER_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SAVE_FOLDER_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                SaveFolderResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SAVE_FOLDER_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                SaveFolderResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS: {
            console.log(action)
            return {
                ...state,
                Loading: false,
                getFolderDocumentResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                getFolderDocumentResponse: [],
                ResponseMessage: action.message
            }
        }
        case actions.CREATE_FOLDER_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.CREATE_FOLDER_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                createFolderResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.CREATE_FOLDER_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                createFolderResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getAllDocumentandShareFolderResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                getAllDocumentandShareFolderResponse: [],
                ResponseMessage: action.message
            }
        }
        case actions.SHAREFILES_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SHAREFILES_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                shareFilesResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SHAREFILES_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                shareFilesResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.SHAREFOLDERS_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.SHAREFOLDERS_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                shareFoldersResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.SHAREFOLDERS_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                shareFoldersResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.DELETEFILE_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.DELETEFILE_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                DeleteFileResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.DELETEFILE_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                DeleteFileResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.FILEISEXIST_INIT: {
            return {
                ...state,
                Loading: false,

            }
        }
        case actions.FILEISEXIST_SUCCESS: {
            return {
                ...state,
                Loading: false,
                FileisExistResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.FILEISEXIST_FAIL: {
            return {
                ...state,
                Loading: false,
                FileisExistResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.FOLDERISEXIST_INIT: {
            return {
                ...state,
                Loading: false
            }
        }
        case actions.FOLDERISEXIST_SUCCESS: {
            return {
                ...state,
                Loading: false,
                FolderisExistResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.FOLDERISEXIST_FAIL: {
            return {
                ...state,
                Loading: false,
                FolderisExistResponse: null,
                ResponseMessage: action.message
            }
        }
        case actions.CLEARE_MESSAGE: {
            return {
                ...state,
                ResponseMessage: ""
            }
        }
        default: return { ...state }
    }
}
export default DataRoomReducer