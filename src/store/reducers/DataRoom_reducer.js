import * as actions from '../action_types'


const initialState = {
    Loading: false,
    ResponseMessage: "",
    SaveFilesResponse: null,
    UploadDocumentsResponse: [],
    SaveFolderResponse: null,
    getMyDocumentsResponse: [],
    getFolderDocumentResponse: [],
    createFolderResponse: null,
    getAllDocumentandShareFolderResponse: [],
    shareFilesResponse: null,
    shareFoldersResponse: null,
    shareFilesandFoldersResponse: null
}


const DataRoomReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SAVEFILES_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
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
                Loading: true
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
        case actions.GETMYDOCUMENTS_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GETMYDOCUMENTS_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                getMyDocumentsResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GETMYDOCUMENTS_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                getMyDocumentsResponse: [],
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
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_INIT: {
            return {
                ...state,
                Loading: true
            }
        }
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_SUCCESS: {
            return {
                ...state,
                Loading: false,
                shareFilesandFoldersResponse: action.response,
                ResponseMessage: action.message
            }
        }
        case actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_FAIL: {
            return {
                ...state,
                Loading: false,
                shareFilesandFoldersResponse: null,
                ResponseMessage: action.message
            }
        }


        default: return { ...state }
    }
}
export default DataRoomReducer